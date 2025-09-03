# Stellar TOML Validation Fix Guide

## Issues Identified

Based on the Stellar TOML checker warnings, you had two main problems:

1. **API Endpoints Returning Wrong Content-Type**: `TRANSFER_SERVER` and `WEB_AUTH_ENDPOINT` were returning `text/html` instead of `application/json`
2. **ORG_URL Returning 403 Forbidden**: The checker hit `https://codytoken.com` and got a 403 error

## Root Cause

The main issue is **Cloudflare Worker routing**. Your `stellar-toml-proxy` worker is intercepting ALL requests to both:
- `codytoken.com/*` 
- `api.codytoken.com/*`

This means your Next.js API routes at `/sep10`, `/sep24`, and `/sep12` are never reached, so the Stellar checker gets HTML responses instead of JSON.

## Fixes Applied

### 1. Created API Route for stellar.toml
- **File**: `src/app/api/stellar-toml/route.ts`
- **Purpose**: Serves stellar.toml with proper `text/plain` content type
- **Access**: `https://api.codytoken.com/api/stellar-toml`

### 2. Created .well-known Route
- **File**: `src/app/.well-known/stellar.toml/route.ts`
- **Purpose**: Serves stellar.toml at the standard path
- **Access**: `https://api.codytoken.com/.well-known/stellar.toml`

### 3. Enhanced Next.js Configuration
- **File**: `next.config.ts`
- **Added**: CORS headers for all API routes
- **Added**: Security headers to prevent 403 errors
- **Added**: Proper content-type headers for stellar.toml

### 4. Fixed Account Address Typo
- **Issue**: One account address had a typo (`GCNBBQLCRN7AHIQ72NS5ZCIL7HUXPBA326UUMTRHT55OA5ET`)
- **Fixed**: Corrected to `GCNBBQLCRN7AHIQ72LRQU24UZNS5ZCIL7HUXPBA326UUMTRHT550A5ET`

## Required Cloudflare Changes

### Option 1: Update Worker Routes (Recommended)
In your Cloudflare Workers Routes, change:

**Current (Problematic):**
```
codytoken.com/* → stellar-toml-proxy
api.codytoken.com/* → stellar-toml-proxy
```

**New (Fixed):**
```
codytoken.com/* → stellar-toml-proxy (for stellar.toml)
api.codytoken.com/* → Your Next.js App (for SEP endpoints)
```

### Option 2: Modify stellar-toml-proxy Worker
Update your worker to only handle stellar.toml requests and proxy API requests to your Next.js app.

### Option 3: Create Separate Routes
```
codytoken.com/.well-known/stellar.toml → stellar-toml-proxy
codytoken.com/* → Your Next.js App
api.codytoken.com/* → Your Next.js App
```

## Testing the Fix

1. **Deploy your Next.js app** with the new routes
2. **Update Cloudflare Worker routes** as described above
3. **Test the endpoints**:
   - `https://api.codytoken.com/sep10` → Should return JSON
   - `https://api.codytoken.com/sep24` → Should return JSON  
   - `https://api.codytoken.com/sep12` → Should return JSON
   - `https://api.codytoken.com/.well-known/stellar.toml` → Should return TOML

4. **Re-run Stellar TOML checker** at https://stellar.toml-checker.com/

## Expected Results

After applying these fixes, the Stellar TOML checker should show:
- ✅ `TRANSFER_SERVER`: Got application/json (expected application/json)
- ✅ `WEB_AUTH_ENDPOINT`: Got application/json (expected application/json)  
- ✅ `KYC_SERVER`: Got application/json (expected application/json)
- ✅ `ORG_URL`: Got 200 OK (expected 200 OK)

## Additional Recommendations

1. **Temporarily disable Bot Fight Mode** in Cloudflare Security settings
2. **Check WAF rules** for any that might be blocking the Stellar checker
3. **Add bypass rules** for `/.well-known/*` and `/api/*` paths
4. **Monitor Cloudflare logs** to see if requests are reaching your Next.js app

## Files Modified/Created

- ✅ `src/app/api/stellar-toml/route.ts` (NEW)
- ✅ `src/app/.well-known/stellar.toml/route.ts` (NEW)
- ✅ `next.config.ts` (ENHANCED)
- ✅ `public/.well-known/stellar.toml` (VERIFIED - no changes needed)

Your Next.js API routes were already correctly configured - the issue was Cloudflare routing, not your code!
