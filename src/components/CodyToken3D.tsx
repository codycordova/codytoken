import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';

function Model() {
  const { scene } = useGLTF('/models/codytoken3d.glb');
  return <primitive object={scene} />;
}

export default function CodyToken3D() {
  return (
    <Canvas style={{ height: 400, width: '100%' }} camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <OrbitControls enablePan={false} />
      <Environment preset="city" />
    </Canvas>
  );
}

useGLTF.preload('/models/codytoken3d.glb'); 