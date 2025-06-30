export {};

declare global {
    interface Window {
        freighterApi: {
            getPublicKey: () => Promise<string>;
            signTransaction: (xdr: string, opts: { network: "PUBLIC" | "TESTNET" }) => Promise<string>;
            isConnected: () => Promise<boolean>;
        };
    }
}
