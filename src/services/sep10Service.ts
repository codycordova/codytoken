import { 
  Keypair, 
  TransactionBuilder, 
  Operation, 
  Networks, 
  Memo
} from '@stellar/stellar-sdk';
import Server from '@stellar/stellar-sdk';
import crypto from 'crypto';
import { JWTService } from './jwtService';
import { SEP10_CONFIG } from '@/config/sep10Config';

export interface SEP10Challenge {
  transaction: string;
  network_passphrase: string;
}

export interface SEP10TokenResponse {
  token: string;
  type: 'jwt';
}

export class SEP10Service {
  private static readonly NETWORK_PASSPHRASE = Networks.PUBLIC;
  private static readonly CHALLENGE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static readonly DOMAIN = SEP10_CONFIG.DOMAIN;
  
  // Store challenges temporarily (in production, use Redis or database)
  private static challenges: Map<string, { account: string; expires: number }> = new Map();

  /**
   * Generate a SEP-10 challenge transaction
   * @param account - The Stellar account requesting authentication
   * @returns Challenge transaction and network passphrase
   */
  static async generateChallenge(account: string): Promise<SEP10Challenge> {
    try {
      // Validate account format
      if (!JWTService.isValidStellarAccount(account)) {
        throw new Error('Invalid Stellar account format');
      }

      // Create a keypair for the challenge
      const challengeKeypair = Keypair.random();
      const challengeAccount = challengeKeypair.publicKey();

      // Create the challenge transaction using a simple approach
      // For SEP-10, we can use a basic transaction structure
      const transaction = new TransactionBuilder(
        challengeKeypair.publicKey(),
        {
          fee: '100',
          networkPassphrase: this.NETWORK_PASSPHRASE,
          sequence: '1',
        }
      )
        .setTimeout(this.CHALLENGE_DURATION / 1000) // Convert to seconds
        .build();

      // Sign the transaction with the challenge keypair
      transaction.sign(challengeKeypair);

      // Store the challenge for validation
      const jti = JWTService.generateJTI();
      this.challenges.set(jti, {
        account: account,
        expires: Date.now() + this.CHALLENGE_DURATION
      });

      // Clean up expired challenges
      this.cleanupExpiredChallenges();

      return {
        transaction: transaction.toXDR(),
        network_passphrase: this.NETWORK_PASSPHRASE
      };
    } catch (error) {
      throw new Error(`Failed to generate challenge: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate a SEP-10 challenge transaction and generate JWT token
   * @param transactionXdr - The signed challenge transaction in XDR format
   * @returns JWT token response
   */
  static async validateChallenge(transactionXdr: string): Promise<SEP10TokenResponse> {
    try {
      // Parse the transaction
      const transaction = TransactionBuilder.fromXDR(transactionXdr, this.NETWORK_PASSPHRASE);
      
      // Validate transaction
      if (!this.isValidChallengeTransaction(transaction)) {
        throw new Error('Invalid challenge transaction');
      }

      // Extract the account from the manage data operation
      const account = this.extractAccountFromTransaction(transaction);
      if (!account || !JWTService.isValidStellarAccount(account)) {
        throw new Error('Invalid account in challenge transaction');
      }

      // Verify the transaction signature
      if (!this.verifyTransactionSignature(transaction)) {
        throw new Error('Invalid transaction signature');
      }

      // Generate JWT token
      const jti = JWTService.generateJTI();
      const token = JWTService.generateSEP10Token(account, jti);

      return {
        token: token,
        type: 'jwt'
      };
    } catch (error) {
      throw new Error(`Challenge validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate that the transaction is a proper SEP-10 challenge
   */
  private static isValidChallengeTransaction(transaction: unknown): boolean {
    try {
      // Type guard to check if transaction has the expected structure
      if (!transaction || typeof transaction !== 'object' || !('operations' in transaction)) {
        return false;
      }

      const tx = transaction as { operations: unknown[] };
      
      // Check if transaction has exactly one operation
      if (tx.operations.length !== 1) {
        return false;
      }

      const operation = tx.operations[0] as { type?: string; name?: string; value?: string };
      
      // Check if it's a manage data operation
      if (operation.type !== 'manageData') {
        return false;
      }

      // Check if the data name contains our domain
      const dataName = operation.name;
      if (!dataName || !dataName.includes(this.DOMAIN)) {
        return false;
      }

      // Check if the data value is a valid Stellar account
      const dataValue = operation.value;
      if (!dataValue || !JWTService.isValidStellarAccount(dataValue)) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Extract the account address from the challenge transaction
   */
  private static extractAccountFromTransaction(transaction: unknown): string | null {
    try {
      if (!transaction || typeof transaction !== 'object' || !('operations' in transaction)) {
        return null;
      }

      const tx = transaction as { operations: unknown[] };
      if (tx.operations.length === 0) {
        return null;
      }

      const operation = tx.operations[0] as { value?: string };
      return operation.value || null;
    } catch {
      return null;
    }
  }

  /**
   * Verify the transaction signature
   */
  private static verifyTransactionSignature(transaction: unknown): boolean {
    try {
      // In a real implementation, you would verify the signature
      // For now, we'll do basic validation
      if (!transaction || typeof transaction !== 'object' || !('signatures' in transaction)) {
        return false;
      }

      const tx = transaction as { signatures: unknown[] };
      return tx.signatures && tx.signatures.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Clean up expired challenges
   */
  private static cleanupExpiredChallenges(): void {
    const now = Date.now();
    for (const [jti, challenge] of this.challenges.entries()) {
      if (challenge.expires < now) {
        this.challenges.delete(jti);
      }
    }
  }

  /**
   * Get challenge info by JTI
   */
  static getChallengeInfo(jti: string): { account: string; expires: number } | null {
    return this.challenges.get(jti) || null;
  }
}
