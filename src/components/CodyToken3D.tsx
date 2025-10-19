import React, { Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';

// Optimized model component with error handling
function Model() {
  const { scene } = useGLTF('/models/codytoken3d.glb');
  
  // Memoize the scene to prevent unnecessary re-renders
  const memoizedScene = useMemo(() => {
    if (scene) {
      // Optimize the model for better performance
      scene.traverse((child) => {
        if ('isMesh' in child && child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          // Enable frustum culling for better performance
          child.frustumCulled = true;
        }
      });
    }
    return scene;
  }, [scene]);

  return <primitive object={memoizedScene} />;
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      color: 'white',
      fontSize: '18px',
      fontWeight: '600'
    }}>
      🎵 Loading CODY Token...
    </div>
  );
}

export default function CodyToken3D() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('cody-3d-container');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  // Preload the model when component mounts
  useEffect(() => {
    try {
      useGLTF.preload('/models/codytoken3d.glb');
    } catch (error) {
      console.error('Failed to preload 3D model:', error);
      setHasError(true);
    }
  }, []);

  if (hasError) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        borderRadius: '16px',
        color: 'white',
        fontSize: '16px',
        fontWeight: '500',
        textAlign: 'center',
        padding: '20px'
      }}>
        🎵 CODY Token 3D Model<br />
        <small>Loading failed - please refresh</small>
      </div>
    );
  }

  return (
    <div id="cody-3d-container" style={{ height: '400px', width: '100%' }}>
      {isVisible ? (
        <Canvas 
          style={{ height: '100%', width: '100%' }} 
          camera={{ position: [0, 0, 3], fov: 50 }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
          dpr={[1, 2]} // Limit pixel ratio for better performance
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Environment preset="city" />
          <Suspense fallback={<LoadingFallback />}>
            <Model />
          </Suspense>
          <OrbitControls 
            enablePan={false} 
            enableZoom={true}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={1}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Canvas>
      ) : (
        <LoadingFallback />
      )}
    </div>
  );
}

// Preload the model immediately when the module loads
if (typeof window !== 'undefined') {
  try {
    useGLTF.preload('/models/codytoken3d.glb');
  } catch (error) {
    console.warn('Failed to preload 3D model on module load:', error);
  }
} 