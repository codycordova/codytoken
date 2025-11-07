# Cloudflare Rocket Loader Fix

## Problem
Cloudflare Rocket Loader is interfering with Next.js JavaScript chunks, causing MIME type errors:
- Scripts are served as `text/plain` instead of `application/javascript`
- This breaks Next.js functionality and prevents CSS/images from loading

## Code Fixes Applied

1. **Added proper MIME type headers** in `next.config.ts`:
   - JavaScript files: `application/javascript; charset=utf-8`
   - CSS files: `text/css; charset=utf-8`

2. **Added Rocket Loader disable script** in `layout.tsx`:
   - Attempts to disable Rocket Loader for Next.js scripts
   - Adds `data-cfasync="false"` to Next.js script tags

## Required Cloudflare Configuration

**You MUST configure Cloudflare to disable Rocket Loader for Next.js paths:**

### Option 1: Page Rule (Recommended)
1. Go to Cloudflare Dashboard → Rules → Page Rules
2. Create a new page rule:
   - **URL Pattern**: `*codytoken.com/_next/static/*`
   - **Settings**:
     - Rocket Loader: **Off**
     - Cache Level: **Cache Everything**
     - Edge Cache TTL: **1 month**

### Option 2: Disable Rocket Loader Globally
1. Go to Cloudflare Dashboard → Speed → Optimization
2. Find "Rocket Loader"
3. Set to **Off** (or use "Manual" mode)

### Option 3: Transform Rules (Modern Approach)
1. Go to Cloudflare Dashboard → Rules → Transform Rules
2. Create a new Response Header Modification rule:
   - **Matching**: `http.request.uri.path matches "^/_next/static/.*\.js$"`
   - **Action**: Set static header
     - Header name: `Content-Type`
     - Value: `application/javascript; charset=utf-8`
   - **Action**: Set static header
     - Header name: `X-Rocket-Loader`
     - Value: `0`

## Deployment Steps

1. **Rebuild the project:**
   ```powershell
   npm run build
   ```

2. **Deploy to Fly.io:**
   ```powershell
   fly deploy
   ```

3. **Clear Cloudflare cache:**
   - Go to Cloudflare Dashboard → Caching → Configuration
   - Click "Purge Everything"

4. **Verify:**
   - Check browser console for MIME type errors
   - Verify images and CSS load correctly
   - Test page functionality

## Quick Test

After deployment, check the browser console. You should NOT see:
- ❌ `Refused to execute script... MIME type ('text/plain')`

You SHOULD see:
- ✅ Scripts loading normally
- ✅ CSS applied correctly
- ✅ Images displaying

