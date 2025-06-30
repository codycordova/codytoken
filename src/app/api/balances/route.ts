// /src/app/api/balances/route.ts
import { NextResponse } from "next/server";

export interface BalanceLine {
    asset_type: string;
    asset_code?: string;
    asset_issuer?: string;
    balance: string;
}

export async function GET() {
    // Replace this with your actual logic for fetching balances
    // Example balances data:
    const balances: BalanceLine[] = [
        {
            asset_type: "credit_alphanum4",
            asset_code: "CODY",
            asset_issuer: "GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK",
            balance: "100.0000",
        },
        {
            asset_type: "native",
            balance: "54.2300",
        },
    ];

    return NextResponse.json({ balances });
}
