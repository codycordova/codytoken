import WebSocket, { Server as WebSocketServer } from 'ws';
import { Horizon, Asset } from '@stellar/stellar-sdk';
import { PriceService } from '@/services/priceService';
import { TradeData } from '@/types/price';

interface Client {
  ws: WebSocket;
  id: string;
  lastPing: number;
}

class WebSocketPriceServer {
  private wss: WebSocketServer;
  private clients: Map<string, Client> = new Map();
  private priceInterval: NodeJS.Timeout | null = null;
  private tradeStream: (() => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private brandName = process.env.WS_BRAND_NAME || 'CODY Token';
  private brandUrl = process.env.WS_BRAND_URL || 'https://codytoken.com';
  private assetCode = process.env.CODY_ASSET_CODE || 'CODY';

  constructor(port: number = 3030) {
    this.wss = new WebSocketServer({
      port,
      maxPayload: parseInt(process.env.WS_MAX_PAYLOAD_BYTES || '1048576', 10),
      perMessageDeflate: false
    });
    this.setupWebSocketServer();
    this.startPriceStreaming();
    this.startTradeStreaming();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket, request) => {
      const origin = request.headers.origin;
      const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
      if (origin && allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
        ws.close(1008, 'Origin not allowed');
        return;
      }
      const clientId = this.generateClientId();
      const client: Client = {
        ws,
        id: clientId,
        lastPing: Date.now()
      };

      this.clients.set(clientId, client);
      console.log(`[${this.brandName} WS] Client connected: ${clientId}`);
      // Send hello/branding message
      try {
        ws.send(JSON.stringify({
          type: 'hello',
          project: this.brandName,
          homepage: this.brandUrl,
          asset: this.assetCode,
          pair: `${this.assetCode}/XLM`,
          version: '1.0',
          timestamp: new Date().toISOString()
        }));
      } catch {}

      // Send initial price data
      this.sendPriceUpdate(clientId);

      // Handle client messages
      ws.on('message', (message: Buffer) => {
        const maxMessageBytes = parseInt(process.env.WS_MAX_MESSAGE_BYTES || '262144', 10);
        if (message.byteLength > maxMessageBytes) {
          ws.close(1009, 'Message too large');
          this.clients.delete(clientId);
          return;
        }
        try {
          const data = JSON.parse(message.toString());
          this.handleClientMessage(clientId, data);
        } catch (error) {
          console.error('Error parsing client message:', error);
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        this.clients.delete(clientId);
        console.log(`[${this.brandName} WS] Client disconnected: ${clientId}`);
      });

      // Handle client errors
      ws.on('error', (error) => {
        console.error(`[${this.brandName} WS] Client error for ${clientId}:`, error);
        this.clients.delete(clientId);
      });

      // Send ping to keep connection alive
      const pingInterval = setInterval(() => {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.ping();
          client.lastPing = Date.now();
        } else {
          clearInterval(pingInterval);
          this.clients.delete(clientId);
        }
      }, 30000); // Ping every 30 seconds
    });

    this.wss.on('error', (error) => {
      console.error(`[${this.brandName} WS] WebSocket server error:`, error);
    });
  }

  private async startPriceStreaming() {
    // Send price updates every 5 seconds
    this.priceInterval = setInterval(async () => {
      try {
        const priceData = await PriceService.getCodyPrice();
        this.broadcastToAll({
          type: 'price_update',
          data: priceData,
          pair: `${this.assetCode}/XLM`,
          asset: this.assetCode,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error(`[${this.brandName} WS] Error streaming price updates:`, error);
      }
    }, 5000);
  }

  private startTradeStreaming() {
    this.connectToTradeStream();
  }

  private connectToTradeStream() {
    try {
      const server = new Horizon.Server(process.env.STELLAR_HORIZON_URL || 'https://horizon.stellar.org');
      const codyAsset = new Asset(
        process.env.CODY_ASSET_CODE || 'CODY',
        process.env.CODY_ISSUER || 'GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK'
      );
      const xlmAsset = Asset.native();

      // Subscribe to trades for CODY/XLM pair
      this.tradeStream = server.trades()
        .forAssetPair(codyAsset, xlmAsset)
        .cursor('now')
        .stream({
          onmessage: (trade) => {
            const tradeData: TradeData = {
              price:
                typeof trade.price === 'string'
                  ? parseFloat(trade.price)
                  : trade.price && typeof trade.price === 'object'
                    ? Number(trade.price.n) / Number(trade.price.d)
                    : 0,
              amount: parseFloat(trade.base_amount),
              timestamp: trade.ledger_close_time,
              side: trade.base_is_seller ? 'sell' : 'buy'
            };

            this.broadcastToAll({
              type: 'trade',
              data: tradeData,
              pair: `${this.assetCode}/XLM`,
              asset: this.assetCode,
              timestamp: new Date().toISOString()
            });

            // Reset reconnect attempts on successful message
            this.reconnectAttempts = 0;
          },
          onerror: (error) => {
            console.error('Trade stream error:', error);
            this.handleTradeStreamError();
          }
        });

      console.log(`[${this.brandName} WS] Connected to Stellar trade stream`);
    } catch (error) {
      console.error(`[${this.brandName} WS] Error connecting to trade stream:`, error);
      this.handleTradeStreamError();
    }
  }

  private handleTradeStreamError() {
    if (this.tradeStream) {
      this.tradeStream();
      this.tradeStream = null;
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // Exponential backoff
      
      console.log(`[${this.brandName} WS] Reconnecting to trade stream in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connectToTradeStream();
      }, delay);
    } else {
      console.error(`[${this.brandName} WS] Max reconnection attempts reached for trade stream`);
    }
  }

  private async sendPriceUpdate(clientId: string) {
    try {
      const priceData = await PriceService.getCodyPrice();
      const client = this.clients.get(clientId);
      
      if (client && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify({
          type: 'price_update',
          data: priceData,
          pair: `${this.assetCode}/XLM`,
          asset: this.assetCode,
          timestamp: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error(`[${this.brandName} WS] Error sending price update to ${clientId}:`, error);
    }
  }

  private broadcastToAll(message: Record<string, unknown>) {
    const messageStr = JSON.stringify(message);
    
    for (const [clientId, client] of this.clients) {
      if (client.ws.readyState === WebSocket.OPEN) {
        try {
          client.ws.send(messageStr);
        } catch (error) {
          console.error(`Error sending message to ${clientId}:`, error);
          this.clients.delete(clientId);
        }
      } else {
        this.clients.delete(clientId);
      }
    }
  }

  private handleClientMessage(clientId: string, data: Record<string, unknown>) {
    switch (data.type) {
      case 'ping':
        const client = this.clients.get(clientId);
        if (client && client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        }
        break;
      
      case 'get_price':
        this.sendPriceUpdate(clientId);
        break;
      
      default:
        console.log(`Unknown message type from ${clientId}:`, data.type);
    }
  }

  private generateClientId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  public getStats() {
    return {
      connectedClients: this.clients.size,
      serverPort: this.wss.options.port,
      tradeStreamActive: this.tradeStream !== null,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  public shutdown() {
    if (this.priceInterval) {
      clearInterval(this.priceInterval);
    }
    
    if (this.tradeStream) {
      this.tradeStream();
    }
    
    this.wss.close();
    console.log('WebSocket server shutdown');
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  const port = parseInt(process.env.WS_PORT || '3030');
  const server = new WebSocketPriceServer(port);
  
  console.log(`WebSocket price server started on port ${port}`);
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('Shutting down WebSocket server...');
    server.shutdown();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('Shutting down WebSocket server...');
    server.shutdown();
    process.exit(0);
  });
}

export { WebSocketPriceServer }; 