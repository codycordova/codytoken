"use client";

import React, { useMemo, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls, Stars, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// Animated model
function CodyModel({ position, speed, index }) {
    const { scene } = useGLTF("/models/codytoken3d.glb");
    const ref = useRef();

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y += 0.5 * delta;
            ref.current.rotation.x = Math.sin(state.clock.elapsedTime + index) * 0.3;
        }
    });

    return (
        <Float speed={speed} rotationIntensity={1.5} floatIntensity={2}>
            <group ref={ref} position={position} scale={0.5}>
                <primitive object={scene.clone()} />
            </group>
        </Float>
    );
}

// Optional: move camera with scroll for parallax effect
function ParallaxCamera() {
    const { camera } = useThree();
    React.useEffect(() => {
        const onScroll = () => {
            const scrollY = window.scrollY;
            camera.position.y = scrollY * 0.005; // Adjust for parallax
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [camera]);
    return null;
}

export default function CodyLogoScene() {
    const modelInstances = useMemo(() => {
        return [...Array(8)].map((_, i) => ({
            speed: 1 + Math.random(),
            position: [
                Math.cos((i / 8) * 2 * Math.PI) * 3,
                Math.sin((i / 8) * 2 * Math.PI) * 1.5,
                Math.sin(i) * 1.5,
            ],
            index: i,
        }));
    }, []);

    return (
        <Canvas
            style={{
                position: "fixed",
                top: 0, left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 0, // Behind your app content!
                pointerEvents: "none",
                background: "transparent",
            }}
            camera={{ position: [0, 0, 8], fov: 75 }}
        >
            {/* Scroll parallax */}
            <ParallaxCamera />

            {/* Lighting */}
            <ambientLight intensity={1.2} />
            <directionalLight position={[0, 5, 5]} intensity={1.5} />

            {/* Stars background */}
            <Stars radius={10} depth={60} count={800} factor={5} fade />

            {/* Glow */}
            <EffectComposer>
                <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} intensity={1.5} />
            </EffectComposer>

            {/* Models */}
            <Suspense fallback={null}>
                {modelInstances.map((m, i) => (
                    <CodyModel key={i} position={m.position} speed={m.speed} index={m.index} />
                ))}
            </Suspense>

            {/* Camera controls - turn off drag/zoom so users don't mess up view */}
            <OrbitControls autoRotate autoRotateSpeed={1.2} enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
    );
}
