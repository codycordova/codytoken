// 📁 src/components/WalletConnect.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useWallet } from "@/context/WalletContext";
import { useStellarWallets } from "@/context/StellarWalletsContext";

export default function WalletConnect() {
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { walletAddress, setWalletAddress } = useWallet();
  const { kit } = useStellarWallets();

  const handleConnectClick = () => {
    if (!kit || modalOpen) return;
    setModalOpen(true);
  };

  async function selectWallet(id: 'freighter' | 'lobstr' | 'xbull') {
    if (!kit) return;
    try {
      await (kit as any).setWallet(id);
      const k = kit as any;
      let address: string | undefined;
      if (typeof k.getPublicKey === "function") {
        address = await k.getPublicKey();
      } else if (typeof k.getAddress === "function") {
        const res = await k.getAddress();
        address = typeof res === "string" ? res : res?.address;
      }
      if (!address) throw new Error("Unable to read wallet address. Please try again.");
      setWalletAddress(address);
      setModalOpen(false);
    } catch (e) {
      console.error("Wallet connection failed", e);
      setModalOpen(false);
      alert("Failed to connect wallet. Please ensure the extension/app is installed and unlocked.");
    }
  }

  const walletOptions = useMemo(() => {
    if (typeof window === "undefined") return [] as { id: string; name: string; installed: boolean; installUrl: string }[];
    const w = window as unknown as { freighterApi?: unknown; lobstrApi?: unknown; xBullApi?: unknown };
    return [
      { id: "freighter", name: "Freighter", installed: !!w.freighterApi, installUrl: "https://www.freighter.app/" },
      { id: "lobstr", name: "Lobstr", installed: !!(w as any).lobstrApi, installUrl: "https://lobstr.co" },
      { id: "xbull", name: "xBull", installed: !!(w as any).xBullApi, installUrl: "https://xbull.app" },
    ];
  }, []);

  const handleDisconnect = () => {
    setWalletAddress("");
    // Optionally, call kit.disconnect() if supported
  };

  return walletAddress ? (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", position: "relative" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#23234a",
          color: "#a5b4fc",
          borderRadius: "999px",
          padding: "0.25rem 0.75rem",
          fontSize: "0.95em",
          fontWeight: 500,
          letterSpacing: "0.03em",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        <span style={{ marginLeft: "0.5rem", fontSize: "0.8em" }}>
          {dropdownOpen ? "▲" : "▼"}
        </span>
      </div>
      
      {/* Wallet Dropdown Menu */}
      {dropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "0.5rem",
            background: "#1e1e2f",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "0.5rem",
            minWidth: "200px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            zIndex: 1000,
          }}
        >
          <Link
            href="/balances"
            style={{
              display: "block",
              padding: "0.75rem 1rem",
              color: "#e0e0e0",
              textDecoration: "none",
              borderRadius: "8px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = "rgba(255, 77, 196, 0.1)";
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = "transparent";
            }}
            onClick={() => setDropdownOpen(false)}
          >
            💰 View Balances
          </Link>
          <Link
            href="/purchase"
            style={{
              display: "block",
              padding: "0.75rem 1rem",
              color: "#e0e0e0",
              textDecoration: "none",
              borderRadius: "8px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = "rgba(255, 77, 196, 0.1)";
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = "transparent";
            }}
            onClick={() => setDropdownOpen(false)}
          >
            🛒 Buy CODY
          </Link>
          <hr style={{ border: "none", borderTop: "1px solid rgba(255, 255, 255, 0.1)", margin: "0.5rem 0" }} />
          <button
            onClick={() => {
              handleDisconnect();
              setDropdownOpen(false);
            }}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              background: "transparent",
              color: "#ff6b6b",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "left",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = "rgba(255, 107, 107, 0.1)";
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = "transparent";
            }}
          >
            🔌 Disconnect
          </button>
        </div>
      )}
      
      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </div>
  ) : (
    <>
      <button
        className="wallet-connect-btn"
        onClick={handleConnectClick}
        disabled={modalOpen}
        style={modalOpen ? { opacity: 0.6, cursor: "not-allowed" } : {}}
      >
        Connect Wallet
      </button>

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Connect Your Stellar Wallet"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              width: "90%",
              maxWidth: 420,
              background: "rgba(34,34,64,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
              padding: "1rem",
              color: "#e0e7ff",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0 }}>Connect Your Stellar Wallet</h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: "transparent", color: "#fff", border: "none", cursor: "pointer" }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.5rem" }}>
              {walletOptions.map((opt) => (
                <div
                  key={opt.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 10,
                    padding: "0.75rem 0.85rem",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{opt.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.75 }}>{opt.installed ? "Detected" : "Not installed"}</div>
                  </div>
                  {opt.installed ? (
                    <button onClick={() => selectWallet(opt.id as any)} style={{ padding: "0.5rem 0.75rem" }}>
                      Connect
                    </button>
                  ) : (
                    <a
                      href={opt.installUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#9cc1ff" }}
                    >
                      Install
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Add a display name for the component (for React DevTools and lint)
WalletConnect.displayName = "WalletConnect";
