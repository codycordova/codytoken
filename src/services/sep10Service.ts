import {
  Keypair,
  Networks,
  Utils,
} from '@stellar/stellar-sdk';
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
  private static readonly NETWORK_PASSPHRASE = (SEP10_CONFIG.STELLAR_NETWORK || 'public').toLowerCase() === 'testnet'
    ? Networks.TESTNET
    : Networks.PUBLIC;
  private static readonly CHALLENGE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static readonly DOMAIN = SEP10_CONFIG.DOMAIN;
  private static readonly HOME_DOMAIN = SEP10_CONFIG.HOME_DOMAIN;
  
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

      // Build SEP-10 challenge transaction per spec using server signing key
      SEP10_CONFIG.validate();
      const serverKeypair = Keypair.fromSecret(SEP10_CONFIG.WEB_AUTH_SIGNING_SECRET);
      // @ts-expect-error: SEP-10 Utils helpers are available at runtime in stellar-sdk
      const challengeXdr = Utils.buildChallengeTx(
        serverKeypair,
        account,
        this.HOME_DOMAIN,
        this.DOMAIN,
        this.NETWORK_PASSPHRASE,
        Math.floor(this.CHALLENGE_DURATION / 1000)
      );

      // Store the challenge for validation
      const jti = JWTService.generateJTI();
      this.challenges.set(jti, {
        account: account,
        expires: Date.now() + this.CHALLENGE_DURATION
      });

      // Clean up expired challenges
      this.cleanupExpiredChallenges();

      return {
        transaction: challengeXdr,
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
      SEP10_CONFIG.validate();
      const serverPublicKey = Keypair.fromSecret(SEP10_CONFIG.WEB_AUTH_SIGNING_SECRET).publicKey();

      // Read and validate challenge transaction according to SEP-10
      // @ts-expect-error: SEP-10 Utils helpers are available at runtime in stellar-sdk
      const read = Utils.readChallengeTx(
        transactionXdr,
        serverPublicKey,
        this.NETWORK_PASSPHRASE,
        this.HOME_DOMAIN,
        this.DOMAIN
      );
      const account = read.clientAccountID;
      if (!JWTService.isValidStellarAccount(account)) {
        throw new Error('Invalid account in challenge transaction');
      }

      // Verify the client has signed the transaction
      // @ts-expect-error: SEP-10 Utils helpers are available at runtime in stellar-sdk
      const signersFound = Utils.verifyChallengeTxSigners(
        transactionXdr,
        serverPublicKey,
        this.NETWORK_PASSPHRASE,
        [account]
      );
      if (!signersFound || signersFound.length === 0) {
        throw new Error('Missing required client signature');
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
