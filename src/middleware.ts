import { NextRequest, NextResponse } from "next/server";

// Comma-separated list of allowed origins, e.g. "https://codytoken.com,https://api.codytoken.com"
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "").split(",").map(o => o.trim()).filter(Boolean);
const IS_PROD = process.env.NODE_ENV === "production";

// Basic in-memory rate limiter (per-instance). For multi-instance, back with Redis.
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10); // 60s
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || "120", 10); // 120 req/min
const rateLimitBuckets: Map<string, { count: number; resetAt: number }> = new Map();

function getClientIp(req: NextRequest): string {
	const xfwd = req.headers.get("x-forwarded-for");
	if (xfwd) return xfwd.split(",")[0].trim();
	// Fallback to remote address if available
	// @ts-expect-error: ip may not exist in all environments
	return (req.ip as string) || "unknown";
}

function resolveAllowedOrigin(req: NextRequest, isToml: boolean): string | null {
	// Always allow cross-origin for stellar.toml as wallets fetch it cross-origin
	if (isToml) return "*";
	const origin = req.headers.get("origin");
	if (!origin) return null;
	if (!IS_PROD) {
		// In non-prod, reflect origin if allowlist is not explicitly set
		if (ALLOWED_ORIGINS.length === 0) return origin;
	}
	return ALLOWED_ORIGINS.includes(origin) ? origin : null;
}

function applyCors(res: NextResponse, origin: string | null, isPreflight: boolean, isToml: boolean) {
	if (isToml && origin === "*") {
		res.headers.set("Access-Control-Allow-Origin", "*");
		res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
		res.headers.set("Access-Control-Allow-Headers", "*");
		res.headers.set("Vary", "Origin");
		return;
	}

	if (origin) {
		res.headers.set("Access-Control-Allow-Origin", origin);
		res.headers.set("Vary", "Origin");
		res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
		// Echo requested headers for preflight, otherwise allow Content-Type by default
		if (isPreflight) {
			res.headers.set(
				"Access-Control-Allow-Headers",
				// Will be overwritten at callsite for preflight to echo requested headers
				res.headers.get("Access-Control-Allow-Headers") || "Content-Type, Authorization"
			);
			res.headers.set("Access-Control-Max-Age", "600");
		} else {
			res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
		}
	}
}

function applyRateLimit(req: NextRequest, res: NextResponse): NextResponse | null {
	if (RATE_LIMIT_MAX <= 0) return null;
	const ip = getClientIp(req);
	const now = Date.now();
	const bucket = rateLimitBuckets.get(ip);
	if (!bucket || now > bucket.resetAt) {
		rateLimitBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		res.headers.set("RateLimit-Limit", String(RATE_LIMIT_MAX));
		res.headers.set("RateLimit-Remaining", String(RATE_LIMIT_MAX - 1));
		res.headers.set("RateLimit-Reset", String(Math.ceil((now + RATE_LIMIT_WINDOW_MS - now) / 1000)));
		return null;
	}
	bucket.count += 1;
	const remaining = Math.max(0, RATE_LIMIT_MAX - bucket.count);
	res.headers.set("RateLimit-Limit", String(RATE_LIMIT_MAX));
	res.headers.set("RateLimit-Remaining", String(remaining));
	res.headers.set("RateLimit-Reset", String(Math.ceil((bucket.resetAt - now) / 1000)));
	if (bucket.count > RATE_LIMIT_MAX) {
		return new NextResponse(null, { status: 429, headers: res.headers });
	}
	return null;
}

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const isApi = pathname.startsWith("/api/");
	const isToml = pathname === "/.well-known/stellar.toml";
	const isHealthCheck = pathname === "/api/healthz";
	
	// Skip middleware for health checks to ensure fast response
	if (isHealthCheck) {
		return NextResponse.next();
	}
	
	if (!isApi && !isToml) return;

	const isPreflight = req.method === "OPTIONS";
	const allowedOrigin = resolveAllowedOrigin(req, isToml);

	// Preflight handling
	if (isPreflight) {
		const res = new NextResponse(null, { status: 204 });
		// Echo requested headers if present
		const reqHeaders = req.headers.get("access-control-request-headers");
		if (reqHeaders) res.headers.set("Access-Control-Allow-Headers", reqHeaders);
		applyCors(res, allowedOrigin, true, isToml);
		return res;
	}

	const res = NextResponse.next();

	// Apply rate limit to API only, not the toml
	if (isApi) {
		const rl = applyRateLimit(req, res);
		if (rl) return rl;
	}

	applyCors(res, allowedOrigin, false, isToml);
	return res;
}

export const config = {
	matcher: ["/api/:path*", "/.well-known/stellar.toml"],
};


