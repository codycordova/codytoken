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

    // Add trustline button logic
    async function addTrustline() {
        if (!walletAddress || !kit || !serverRef.current) return;
        setLoading(true);
        try {
            const account = await serverRef.current.loadAccount(walletAddress);
            // Calculate available XLM (native balance minus minimum reserve)
            const nativeBalance = account.balances.find((b: BalanceLine) => b.asset_type === "native");
            const xlm = nativeBalance ? parseFloat(nativeBalance.balance) : 0;
            // Minimum balance: 1 XLM base + 0.5 XLM per trustline + 0.5 XLM for new trustline
            // See: https://developers.stellar.org/docs/fundamentals-and-concepts/fees-and-reserves
            const subentryCount = Number(account.subentry_count) || 0;
            const minBalance = 1 + 0.5 * (subentryCount + 1); // +1 for new trustline
            if (xlm < minBalance) {
                alert("❌ You need at least 0.5 XLM available to add a trustline. Please fund your wallet and try again.");
                setLoading(false);
                return;
            }
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
            alert("✅ Trustline successfully added!");
        } catch (e: unknown) {
            console.error("Failed to add trustline:", e);
            if (isStellarError(e)) {
                alert("❌ Failed to add trustline: " + JSON.stringify(e.response.data.extras.result_codes));
            } else if (typeof e === "object" && e && "message" in e && typeof (e as { message: unknown }).message === "string") {
                alert("❌ Failed to add trustline. " + (e as { message: string }).message);
            } else {
                alert("❌ Failed to add trustline. Unknown error.");
            }
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
