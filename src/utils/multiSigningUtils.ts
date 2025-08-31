// Multi-signing utility functions for Stellar transactions

export interface StellarAccount {
  balances: Array<{
    asset_type: string;
    asset_code?: string;
    asset_issuer?: string;
    balance: string;
  }>;
  subentry_count?: string;
  signers?: Array<{
    key: string;
    weight: number;
    type: string;
  }>;
  thresholds?: {
    low_threshold: number;
    med_threshold: number;
    high_threshold: number;
  };
}

export interface StellarError {
  response?: {
    data?: {
      extras?: {
        result_codes?: {
          operations?: string[];
          transaction?: string;
        };
      };
    };
  };
  message?: string;
}

/**
 * Check if an account is configured for multi-signing
 */
export function isMultiSigningAccount(account: StellarAccount): boolean {
  if (!account.signers || account.signers.length === 0) return false;
  
  // Check if there are multiple signers or if the master key weight is 0
  const masterSigner = account.signers.find(signer => signer.type === 'ed25519_public_key');
  const hasMultipleSigners = account.signers.length > 1;
  const masterKeyDisabled = masterSigner ? masterSigner.weight === 0 : false;
  
  return hasMultipleSigners || masterKeyDisabled;
}

/**
 * Get the number of required signatures for medium threshold operations
 */
export function getRequiredSignatures(account: StellarAccount): number {
  if (!account.thresholds) return 1;
  
  // For medium threshold operations (like payments and trustline changes), 
  // we need to meet the medium threshold
  return account.thresholds.med_threshold;
}

/**
 * Get a user-friendly description of the multi-signing setup
 */
export function getMultiSigningDescription(account: StellarAccount): string {
  if (!isMultiSigningAccount(account)) {
    return 'Single signature account';
  }

  const signerCount = account.signers?.length || 0;
  const requiredSigs = getRequiredSignatures(account);
  
  if (signerCount === 2 && requiredSigs === 2) {
    return '2-of-2 multi-signing (requires both signers)';
  } else if (signerCount > 2) {
    return `${requiredSigs}-of-${signerCount} multi-signing`;
  } else {
    return 'Multi-signing account';
  }
}

/**
 * Check if a transaction error is related to multi-signing
 */
export function isMultiSigningError(error: StellarError): boolean {
  const txCode = error?.response?.data?.extras?.result_codes?.transaction;
  return txCode === 'tx_bad_auth' || txCode === 'tx_bad_seq';
}

/**
 * Get a user-friendly error message for multi-signing errors
 */
export function getMultiSigningErrorMessage(error: StellarError, operation: string = 'transaction'): string {
  const txCode = error?.response?.data?.extras?.result_codes?.transaction;
  
  if (txCode === 'tx_bad_auth') {
    return `🔐 Multi-signing error: ${operation} requires additional signatures. Please complete the signing process in your wallet interface (Lobstr + Vault).`;
  } else if (txCode === 'tx_bad_seq') {
    return `🔐 Multi-signing error: Transaction sequence number mismatch. Please try again or refresh your wallet connection.`;
  } else {
    return `🔐 Multi-signing error: ${operation} failed. Please check your wallet setup and try again.`;
  }
}

/**
 * Get a user-friendly error message for general Stellar errors
 */
export function getStellarErrorMessage(error: StellarError, operation: string = 'transaction'): string {
  const opCodes = error?.response?.data?.extras?.result_codes?.operations;
  
  if (isMultiSigningError(error)) {
    return getMultiSigningErrorMessage(error, operation);
  } else if (opCodes && opCodes.includes('op_underfunded')) {
    return `❌ Insufficient balance for this ${operation}. Please check your XLM balance and try a smaller amount.`;
  } else if (opCodes && opCodes.includes('op_cross_self')) {
    return `❌ Cannot ${operation} to the same account. Please use a different destination address.`;
  } else if (opCodes && opCodes.includes('op_no_trust')) {
    return `❌ Trustline required. Please add the required trustline before attempting this ${operation}.`;
  } else {
    const msg = opCodes || error?.message || `Unknown error during ${operation}.`;
    return `❌ ${operation} failed: ${msg}`;
  }
}
