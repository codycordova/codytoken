"use client";

import React, { useState, useEffect, useRef } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";
import { useStellarWallets } from "@/context/StellarWalletsContext";

const CODY_ASSET_CODE = "CODY";
const CODY_ASSET_ISSUER =
    "GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK";
const CODY = new StellarSdk.Asset(CODY_ASSET_CODE, CODY_ASSET_ISSUER);

interface BalanceLine {
    asset_type: string;
    asset_code?: string;
    asset_issuer?: string;
    balance: string;
}

interface TrustlineButtonProps {
    walletAddress: string;
    onTrustlineActive?: (active: boolean) => void;
}

function isStellarError(e: unknown): e is {
  response: {
    data: {
      extras: {
        result_codes: unknown
      }
    }
  },
  message?: string
} {
  return (
    typeof e === "object" &&
    e !== null &&
    "response" in e &&
    typeof (e as { response?: unknown }).response === "object" &&
    (e as { response?: unknown }).response !== null &&
    "data" in (e as { response: { data?: unknown } }).response &&
    typeof (e as { response: { data?: unknown } }).response.data === "object" &&
    (e as { response: { data?: unknown } }).response.data !== null &&
    "extras" in (e as { response: { data: { extras?: unknown } } }).response.data &&
    typeof (e as { response: { data: { extras?: unknown } } }).response.data.extras === "object" &&
    (e as { response: { data: { extras?: unknown } } }).response.data.extras !== null &&
    "result_codes" in (e as { response: { data: { extras: { result_codes?: unknown } } } }).response.data.extras
  );
}

export default function TrustlineButton({
                                            walletAddress,
                                            onTrustlineActive,
                                        }: TrustlineButtonProps) {
    const { kit } = useStellarWallets();
    const [hasTrustline, setHasTrustline] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);
    const serverRef = useRef<StellarSdk.Horizon.Server | null>(null);

    // Create the server instance ONCE on client
    useEffect(() => {
        if (!serverRef.current && typeof window !== "undefined") {
            serverRef.current = new StellarSdk.Horizon.Server("https://horizon.stellar.org");
        }
    }, []);

    // Check trustline status when walletAddress changes
    useEffect(() => {
        if (!walletAddress || !serverRef.current) return;
        let isMounted = true;
        const check = async () => {
            try {
                const account = await serverRef.current!.loadAccount(walletAddress);
                const found = account.balances.some((b: BalanceLine) =>
                    b.asset_code === CODY_ASSET_CODE && b.asset_issuer === CODY_ASSET_ISSUER
                );
                if (isMounted) {
                    setHasTrustline(found);
                    onTrustlineActive?.(found);
                }
            } catch (e) {
                console.error("Error checking trustline:", e);
                if (isMounted) setHasTrustline(null);
            }
        };
        check();
        return () => {
            isMounted = false;
        };
    }, [walletAddress, onTrustlineActive]);

    // Enhanced trustline logic with better balance validation
    async function addTrustline() {
        if (!walletAddress || !kit || !serverRef.current) return;
        setLoading(true);
        try {
            const account = await serverRef.current.loadAccount(walletAddress);
            
            // Calculate detailed balance requirements
            const nativeBalance = account.balances.find((b: BalanceLine) => b.asset_type === "native");
            const currentXlm = nativeBalance ? parseFloat(nativeBalance.balance) : 0;
            const subentryCount = Number(account.subentry_count) || 0;
            
            // Calculate required reserves
            const baseReserve = 1.0; // Base reserve for account
            const trustlineReserve = 0.5; // Reserve for new trustline
            const existingReserves = subentryCount * 0.5; // Existing subentry reserves
            const feeBuffer = 0.001; // Small buffer for transaction fees
            
            const totalRequired = baseReserve + existingReserves + trustlineReserve + feeBuffer;
            const shortfall = Math.max(0, totalRequired - currentXlm);
            
            // Check if user has enough XLM
            if (currentXlm < totalRequired) {
                const message = `❌ Insufficient XLM for trustline setup.

Current XLM: ${currentXlm.toFixed(6)}
Required: ${totalRequired.toFixed(6)}
Shortfall: ${shortfall.toFixed(6)} XLM

💡 Need more XLM? Buy from:
• Coinbase: https://coinbase.com
• CoinDisco: https://coindisco.com
• Stellar DEX: Use any Stellar wallet

After purchasing, send XLM to your wallet address:
${walletAddress}`;
                
                alert(message);
                setLoading(false);
                return;
            }
            
            // Proceed with trustline creation
            const tx = new StellarSdk.TransactionBuilder(account, {
                fee: StellarSdk.BASE_FEE,
                networkPassphrase: StellarSdk.Networks.PUBLIC,
            })
                .addOperation(StellarSdk.Operation.changeTrust({ asset: CODY }))
                .setTimeout(60)
                .build();

            const { signedTxXdr } = await kit.signTransaction(tx.toXDR(), {
                networkPassphrase: StellarSdk.Networks.PUBLIC,
            });

            await serverRef.current.submitTransaction(
                StellarSdk.TransactionBuilder.fromXDR(signedTxXdr, StellarSdk.Networks.PUBLIC)
            );

            setHasTrustline(true);
            onTrustlineActive?.(true);
            alert("✅ Trustline successfully added! You can now receive CODY tokens.");
            
        } catch (e: unknown) {
            console.error("Failed to add trustline:", e);
            
            let errorMessage = "Failed to add trustline. Unknown error.";
            
            if (isStellarError(e)) {
                const resultCodes = e.response.data.extras.result_codes as { transaction?: string; operations?: string[] };
                if (resultCodes.transaction) {
                    errorMessage = `Transaction failed: ${resultCodes.transaction}`;
                } else if (resultCodes.operations && resultCodes.operations.length > 0) {
                    const opErrors = resultCodes.operations.filter((op: string) => op !== 'op_success');
                    if (opErrors.length > 0) {
                        errorMessage = `Operation errors: ${opErrors.join(', ')}`;
                    }
                }
            } else if (typeof e === "object" && e && "message" in e && typeof (e as { message: unknown }).message === "string") {
                errorMessage = (e as { message: string }).message;
            }
            
            alert(`❌ ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    }

    if (!walletAddress) return null;

    return (
        <div style={{ margin: "1rem 0", textAlign: "center" }}>
            {hasTrustline ? (
                <span style={{ color: "limegreen" }}>✔ Trustline active</span>
            ) : (
                <button onClick={addTrustline} disabled={loading}>
                    {loading ? "Adding…" : "Add Trustline to $CODY"}
                </button>
            )}
        </div>
    );
}
