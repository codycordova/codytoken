import jwt from 'jsonwebtoken';
import { SEP10_CONFIG } from '@/config/sep10Config';

export interface SEP10TokenPayload {
  iss: string; // Issuer (domain)
  sub: string; // Subject (Stellar account)
  iat: number; // Issued at
  exp: number; // Expiration
  jti: string; // JWT ID (unique identifier)
}

export class JWTService {
  private static readonly JWT_SECRET = SEP10_CONFIG.JWT_SECRET;
  private static readonly JWT_EXPIRY = '5m'; // 5 minutes as per SEP-10 spec
  private static readonly DOMAIN = SEP10_CONFIG.DOMAIN;

  // Validate configuration when the service is first used
  private static validateConfig() {
    SEP10_CONFIG.validate();
  }

  /**
   * Generate a JWT token for SEP-10 authentication
   * @param stellarAccount - The Stellar account address
   * @param jti - Unique JWT identifier
   * @returns JWT token string
   */
  static generateSEP10Token(stellarAccount: string, jti: string): string {
    this.validateConfig();
    
    const payload: SEP10TokenPayload = {
      iss: this.DOMAIN,
      sub: stellarAccount,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (5 * 60), // 5 minutes from now
      jti: jti
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      algorithm: 'HS256'
    });
  }

  /**
   * Verify and decode a JWT token
   * @param token - JWT token string
   * @returns Decoded token payload
   */
  static verifySEP10Token(token: string): SEP10TokenPayload {
    this.validateConfig();
    
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET, {
        algorithms: ['HS256']
      }) as SEP10TokenPayload;

      // Validate issuer
      if (decoded.iss !== this.DOMAIN) {
        throw new Error('Invalid issuer');
      }

      // Validate expiration
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token expired');
      }

      return decoded;
    } catch (error) {
      throw new Error(`Invalid token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a unique JWT ID
   * @returns Unique identifier string
   */
  static generateJTI(): string {
    return `sep10_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate Stellar account format
   * @param account - Stellar account address
   * @returns True if valid format
   */
  static isValidStellarAccount(account: string): boolean {
    // Basic Stellar account validation (starts with G, 56 characters)
    return /^G[A-Z0-9]{55}$/.test(account);
  }
}
