'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as Sentry from '@sentry/nextjs';

// Model URL - using local file from public folder (no CORS issues)
const MODEL_URL = '/models/codytoken3d.glb';
const THREE_JS_MODULE_CDN = 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';


// Error fallback component
function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      borderRadius: '16px',
      color: 'white',
      fontSize: '16px',
      fontWeight: '500',
      textAlign: 'center',
      padding: '20px',
      gap: '12px'
    }}>
      <div>🎵 CODY Token 3D Model</div>
      <small>Loading failed - please refresh</small>
      <button
        onClick={onRetry}
        style={{
          marginTop: '8px',
          padding: '8px 16px',
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid white',
          borderRadius: '8px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Retry
      </button>
    </div>
  );
}

export default function CodyToken3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: any;
    camera: any;
    renderer: any;
    model: any;
    animationId: number | null;
    isDragging: boolean;
    previousMousePosition: { x: number; y: number };
    autoRotate: boolean;
  } | null>(null);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure client-side only rendering and load immediately
  useEffect(() => {
    setMounted(true);
    // Set visible immediately after mount - no delay needed
    setIsVisible(true);
  }, []);

  // Load Three.js and initialize scene
  useEffect(() => {
    if (!isVisible || !containerRef.current || sceneRef.current || !mounted) return;

    let THREE: any;
    let GLTFLoader: any;
    let isMounted = true;

    const initScene = async () => {
      try {
        // Setup import map for Three.js ES modules (official recommended approach)
        if (!document.querySelector('script[type="importmap"]')) {
          const importMap = document.createElement('script');
          importMap.type = 'importmap';
          importMap.textContent = JSON.stringify({
            imports: {
              three: THREE_JS_MODULE_CDN,
              'three/addons/': 'https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/'
            }
          });
          document.head.appendChild(importMap);
          // Wait for import map to be processed
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Load Three.js and GLTFLoader as ES modules (official recommended approach)
        if (!(window as any).THREE || !(window as any).GLTFLoader) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.type = 'module';
            script.textContent = `
              import * as THREE from 'three';
              import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
              window.THREE = THREE;
              window.GLTFLoader = GLTFLoader;
            `;
            script.onload = () => {
              THREE = (window as any).THREE;
              GLTFLoader = (window as any).GLTFLoader;
              if (!THREE || !GLTFLoader) {
                reject(new Error('THREE or GLTFLoader not found on window'));
                return;
              }
              resolve();
            };
            script.onerror = (err) => {
              console.error('[CodyToken3D] Failed to load Three.js modules:', err);
              reject(new Error('Failed to load Three.js modules'));
            };
            document.head.appendChild(script);
          });
        } else {
          THREE = (window as any).THREE;
          GLTFLoader = (window as any).GLTFLoader;
        }
        if (!isMounted) return;
        
        if (!THREE || !GLTFLoader) {
          throw new Error('THREE or GLTFLoader not available');
        }

        const container = containerRef.current;
        if (!container) return;

        // Create scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 3);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 5);
        scene.add(directionalLight);

        // Load model with retry logic
        const loader = new GLTFLoader();
        
        // Set up error handling with retry
        let retryCount = 0;
        const maxRetries = 3;
        
        const loadModel = (url: string) => {
          loader.load(
            url,
            (gltf: any) => {
              if (!isMounted) return;
              const model = gltf.scene;
              scene.add(model);
            
            // Center and scale model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 1.5 / maxDim;
            model.scale.multiplyScalar(scale);
            model.position.sub(center.multiplyScalar(scale));

            sceneRef.current = {
              scene,
              camera,
              renderer,
              model,
              animationId: null,
              isDragging: false,
              previousMousePosition: { x: 0, y: 0 },
              autoRotate: true,
            };

            // Start animation loop
            if (sceneRef.current) {
              sceneRef.current.animationId = requestAnimationFrame(animate);
            }
          },
              undefined,
            (error: Error) => {
              console.error('[CodyToken3D] Error loading model:', error);
              console.error('[CodyToken3D] Error details:', {
                message: error.message,
                name: error.name,
                stack: error.stack,
                url: MODEL_URL,
                retryCount
              });
              
              // Check for specific error types
              const isNetworkError = error.message.includes('fetch') || 
                                    error.message.includes('Failed to load') ||
                                    error.message.includes('Failed to fetch') ||
                                    error.message.includes('NetworkError') ||
                                    error.message.includes('403') ||
                                    error.message.includes('Forbidden') ||
                                    error.message.includes('CORS');
              
              // Retry logic for network/CORS errors (but not 403 - that's a config issue)
              if (retryCount < maxRetries && isNetworkError && !error.message.includes('403') && !error.message.includes('Forbidden')) {
                retryCount++;
                console.log(`[CodyToken3D] Retrying model load (attempt ${retryCount}/${maxRetries})...`);
                setTimeout(() => {
                  if (isMounted) {
                    loadModel(MODEL_URL);
                  }
                }, 1000 * retryCount); // Exponential backoff
                return;
              }
              
              // Log helpful error message for 403/CORS issues
              if (error.message.includes('403') || error.message.includes('Forbidden') || error.message.includes('CORS')) {
                console.error('[CodyToken3D] ⚠️ CORS/Access Error - The model file needs CORS headers configured on Cloudflare R2');
                console.error('[CodyToken3D] URL:', MODEL_URL);
                console.error('[CodyToken3D] Configure CORS on your R2 bucket to allow requests from:', window.location.origin);
              }
              
              Sentry.captureException(error, {
                tags: { component: 'CodyToken3D', model: 'codytoken3d.glb' },
                extra: { 
                  modelUrl: MODEL_URL,
                  retryCount,
                  errorMessage: error.message,
                  isNetworkError,
                  origin: typeof window !== 'undefined' ? window.location.origin : 'unknown'
                },
              });
              
              if (isMounted) {
                setError(true);
              }
            }
          );
        };
        
        loadModel(MODEL_URL);

        // Mouse interaction handlers
        const handleMouseDown = (event: MouseEvent) => {
          if (!sceneRef.current) return;
          sceneRef.current.isDragging = true;
          sceneRef.current.autoRotate = false;
          sceneRef.current.previousMousePosition = {
            x: event.clientX,
            y: event.clientY,
          };
        };

        const handleMouseMove = (event: MouseEvent) => {
          if (!sceneRef.current || !sceneRef.current.isDragging) return;
          
          const deltaX = event.clientX - sceneRef.current.previousMousePosition.x;
          const deltaY = event.clientY - sceneRef.current.previousMousePosition.y;
          
          if (sceneRef.current.model) {
            sceneRef.current.model.rotation.y += deltaX * 0.01;
            sceneRef.current.model.rotation.x += deltaY * 0.01;
          }
          
          sceneRef.current.previousMousePosition = {
            x: event.clientX,
            y: event.clientY,
          };
        };

        const handleMouseUp = () => {
          if (!sceneRef.current) return;
          sceneRef.current.isDragging = false;
          // Resume auto-rotate after a delay
          setTimeout(() => {
            if (sceneRef.current && !sceneRef.current.isDragging) {
              sceneRef.current.autoRotate = true;
            }
          }, 1000);
        };

        // Enhanced mouse handlers with cursor updates
        const handleMouseDownWithCursor = (event: MouseEvent) => {
          handleMouseDown(event);
          if (renderer.domElement) {
            renderer.domElement.style.cursor = 'grabbing';
          }
        };

        const handleMouseUpWithCursor = () => {
          handleMouseUp();
          if (renderer.domElement) {
            renderer.domElement.style.cursor = 'grab';
          }
        };

        renderer.domElement.style.cursor = 'grab';
        renderer.domElement.addEventListener('mousedown', handleMouseDownWithCursor);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUpWithCursor);

        // Animation loop
        const animate = () => {
          if (!mounted || !sceneRef.current) return;
          
          if (sceneRef.current.model && sceneRef.current.autoRotate && !sceneRef.current.isDragging) {
            // Coin-flip rotation (Y-axis)
            sceneRef.current.model.rotation.y += 0.01;
          }
          
          sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
          sceneRef.current.animationId = requestAnimationFrame(animate);
        };

        // Handle resize
        const handleResize = () => {
          if (!sceneRef.current || !container) return;
          const width = container.clientWidth;
          const height = container.clientHeight;
          sceneRef.current.camera.aspect = width / height;
          sceneRef.current.camera.updateProjectionMatrix();
          sceneRef.current.renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
          isMounted = false;
          window.removeEventListener('resize', handleResize);
          renderer.domElement.removeEventListener('mousedown', handleMouseDownWithCursor);
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUpWithCursor);
          
          if (sceneRef.current) {
            if (sceneRef.current.animationId !== null) {
              cancelAnimationFrame(sceneRef.current.animationId);
            }
            sceneRef.current.renderer.dispose();
            if (container && renderer.domElement.parentNode === container) {
              container.removeChild(renderer.domElement);
            }
            sceneRef.current = null;
          }
        };
      } catch (err) {
        console.error('[CodyToken3D] Error initializing scene:', err);
        Sentry.captureException(err instanceof Error ? err : new Error('Scene initialization failed'), {
          tags: { component: 'CodyToken3D' },
          extra: { error: String(err) },
        });
        if (isMounted) {
          setError(true);
        }
      }
    };

    initScene();

    return () => {
      isMounted = false;
      if (sceneRef.current) {
        if (sceneRef.current.animationId !== null) {
          cancelAnimationFrame(sceneRef.current.animationId);
        }
        sceneRef.current.renderer.dispose();
        if (containerRef.current && sceneRef.current.renderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
        sceneRef.current = null;
      }
    };
  }, [isVisible]);

  const handleRetry = () => {
    setError(false);
    setIsVisible(false);
    // Force re-initialization
    setTimeout(() => setIsVisible(true), 100);
  };

  if (error) {
    return <ErrorFallback onRetry={handleRetry} />;
  }

  // Consistent initial render for SSR - no dynamic styles
  // suppressHydrationWarning because Three.js canvas is added client-side only
  return (
    <div 
      ref={containerRef}
      id="cody-3d-container" 
      suppressHydrationWarning
      style={{
        height: '400px',
        width: '100%',
        position: 'relative',
      }}
    >
    </div>
  );
}