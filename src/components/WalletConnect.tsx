// 📁 src/components/WalletConnect.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StellarWalletsKit, WalletNetwork, FREIGHTER_ID, FreighterModule, xBullModule, LobstrModule } from "@creit.tech/stellar-wallets-kit";
import { useWallet } from "@/context/WalletContext";

let kit: StellarWalletsKit | null = null;

if (typeof window !== "undefined") {
  kit = new StellarWalletsKit({
    network: WalletNetwork.PUBLIC,
    selectedWalletId: FREIGHTER_ID,
    modules: [new FreighterModule(), new xBullModule(), new LobstrModule()],
  });
}

export default function WalletConnect() {
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { walletAddress, setWalletAddress } = useWallet();

  const handleConnectClick = () => {
    if (kit && !modalOpen) {
      setModalOpen(true);
      try {
        kit.openModal({
            modalTitle: "Connect Your Stellar Wallet",
            onWalletSelected: async (option) => {
                kit.setWallet(option.id);
                const {address} = await kit.getAddress();
                setWalletAddress(address);
                setModalOpen(false);
            },
            onClosed: () => setModalOpen(false),
         });
      } catch {
        setModalOpen(false);
      }
    }
  };

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
    <button
      className="wallet-connect-btn"
      onClick={handleConnectClick}
      disabled={modalOpen}
      style={modalOpen ? { opacity: 0.6, cursor: "not-allowed" } : {}}
    >
      Connect Wallet
    </button>
  );
}

// Add a display name for the component (for React DevTools and lint)
WalletConnect.displayName = "WalletConnect";
