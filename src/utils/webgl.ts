export function isWebGLAvailable(): boolean {
  try {
    if (typeof window === "undefined") return false;
    const canvas = document.createElement("canvas");
    // Try standard WebGL contexts first
    let gl = canvas.getContext("webgl") || canvas.getContext("webgl2");

    // Fallback for older browsers with experimental WebGL
    if (!gl) {
      try {
        gl = canvas.getContext("experimental-webgl" as "webgl");
      } catch {
        gl = null;
      }
    }

    const isAvailable = !!gl;

    // Clean up
    if (gl && typeof (gl as WebGLRenderingContext).getExtension === 'function') {
      (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext();
    }

    return isAvailable;
  } catch {
    return false;
  }
}

/**
 * Sets up WebGL context restoration handlers
 * Call this on your canvas or WebGL renderer to handle context loss gracefully
 */
export function setupWebGLContextRestoration(
  canvas: HTMLCanvasElement,
  onContextLost?: () => void,
  onContextRestored?: () => void
): () => void {
  const handleContextLost = (event: Event) => {
    event.preventDefault();
    console.warn('WebGL context lost. Attempting to restore...');
    onContextLost?.();
  };

  const handleContextRestored = () => {
    console.log('WebGL context restored successfully');
    onContextRestored?.();
  };

  canvas.addEventListener('webglcontextlost', handleContextLost, false);
  canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

  // Return cleanup function
  return () => {
    canvas.removeEventListener('webglcontextlost', handleContextLost);
    canvas.removeEventListener('webglcontextrestored', handleContextRestored);
  };
}


