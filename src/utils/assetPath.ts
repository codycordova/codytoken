/**
 * Get the correct asset path for static assets in Next.js
 * Handles assetPrefix if set in next.config.ts
 */
export function getAssetPath(path: string): string {
  if (typeof window === 'undefined') {
    return path;
  }

  // If path is already absolute URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Check for Next.js assetPrefix in __NEXT_DATA__
  // Next.js injects this in the HTML when assetPrefix is configured
  const nextData = (window as any).__NEXT_DATA__;
  const assetPrefix = nextData?.assetPrefix || '';
  
  // If assetPrefix is set and path doesn't already include it, prepend it
  if (assetPrefix) {
    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    // Remove trailing slash from assetPrefix if present
    const cleanPrefix = assetPrefix.endsWith('/') ? assetPrefix.slice(0, -1) : assetPrefix;
    return `${cleanPrefix}${cleanPath}`;
  }
  
  // Default: return path as-is (Next.js will handle it)
  return path;
}

