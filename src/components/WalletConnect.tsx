// 📁 src/components/WalletConnect.tsx
"use client";

import React, { useState } from "react";
import { StellarWalletsKit, WalletNetwork, FREIGHTER_ID, FreighterModule, xBullModule, LobstrModule } from "@creit.tech/stellar-wallets-kit";
import { useWallet } from "@/context/WalletContext";

let kit: StellarWalletsKit | null = null;

if (typeof window !== "undefined" && !kit) {
  kit = new StellarWalletsKit({
    network: WalletNetwork.PUBLIC,
    selectedWalletId: FREIGHTER_ID,
    modules: [new FreighterModule(), new xBullModule(), new LobstrModule()],
  });
}

export default function WalletConnect() {
  const [modalOpen, setModalOpen] = useState(false);
  const { walletAddress, setWalletAddress } = useWallet();

  const handleConnectClick = () => {
    if (kit && !modalOpen) {
      setModalOpen(true);
      try {
        kit.openModal({
          modalTitle: "Connect Your Stellar Wallet",
          onWalletSelected: async (option) => {
            await kit.setWallet(option.id);
            const { address } = await kit.getAddress();
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
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <span
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
        }}
      >
        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
      </span>
      <button className="wallet-connect-btn" onClick={handleDisconnect}>
        Disconnect
      </button>
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
