// /src/app/api/balances/route.ts
import { NextResponse } from "next/server";
import { Horizon } from "@stellar/stellar-sdk";

export interface BalanceLine {
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  balance: string;
}

// Define proper types for Stellar SDK balance objects
interface StellarBalance {
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  balance: string;
}

// You can override via env if needed
const HORIZON_URL = process.env.HORIZON_URL || process.env.STELLAR_HORIZON_URL || "https://horizon.stellar.org";
// Optional default account (falls back if query param not provided)
const DEFAULT_ACCOUNT = process.env.NEXT_PUBLIC_BALANCES_ACCOUNT || process.env.BALANCES_ACCOUNT;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const account = searchParams.get("account") || DEFAULT_ACCOUNT;

    if (!account) {
      return NextResponse.json(
        { error: "Missing 'account' query parameter and no default is configured." },
        { status: 400 }
      );
    }

    // Contracts (addresses starting with 'C') do not have classic balances via Horizon.
    // Require a classic account (G...) here to ensure real balances are returned.
    if (!/^G[A-Z2-7]{55}$/.test(account)) {
      return NextResponse.json(
        { error: "Only classic Stellar accounts (starting with 'G') are supported for balances." },
        { status: 400 }
      );
    }

    const server = new Horizon.Server(HORIZON_URL);
    const acc = await server.loadAccount(account);

    // Map Horizon balances to our BalanceLine interface
    const balances: BalanceLine[] = acc.balances.map((b: StellarBalance) => ({
      asset_type: b.asset_type,
      // asset_code/asset_issuer exist only for non-native assets
      asset_code: "asset_code" in b ? b.asset_code : undefined,
      asset_issuer: "asset_issuer" in b ? b.asset_issuer : undefined,
      balance: b.balance,
    }));

    // short cache to avoid hammering Horizon while keeping data fresh
    return NextResponse.json(
      { account, balances },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=30",
        },
      }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to fetch balances", details: errorMessage },
      { status: 500 }
    );
  }
}
