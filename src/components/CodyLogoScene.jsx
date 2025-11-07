"use client";

import React, { useEffect, useRef, useState } from "react";
import * as Sentry from "@sentry/nextjs";

// Model URL - using local file from public folder (no CORS issues)
const MODEL_URL = '/models/codytoken3d.glb';
const THREE_JS_MODULE_CDN = 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';

export default function CodyLogoScene() {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Ensure client-side only rendering
    useEffect(() => {
        setMounted(true);
    }, []);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (!mounted) return;
        
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [mounted]);

    // Initialize Three.js scene
    useEffect(() => {
        if (!isVisible || !containerRef.current || sceneRef.current || !mounted) return;

        let THREE;
        let GLTFLoader;
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
                    await new Promise(resolve => setTimeout(resolve, 0));
                }

                // Load Three.js and GLTFLoader as ES modules (official recommended approach)
                if (!window.THREE || !window.GLTFLoader) {
                    await new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.type = 'module';
                        script.textContent = `
                            import * as THREE from 'three';
                            import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
                            window.THREE = THREE;
                            window.GLTFLoader = GLTFLoader;
                        `;
                        script.onload = () => {
                            THREE = window.THREE;
                            GLTFLoader = window.GLTFLoader;
                            resolve();
                        };
                        script.onerror = () => reject(new Error('Failed to load Three.js modules'));
                        document.head.appendChild(script);
                    });
                } else {
                    THREE = window.THREE;
                    GLTFLoader = window.GLTFLoader;
                }
                if (!isMounted) return;

                const container = containerRef.current;
                if (!container) return;

                // Create scene
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.set(0, 0, 8);

                const renderer = new THREE.WebGLRenderer({ 
                    antialias: true, 
                    alpha: true,
                    powerPreference: "high-performance"
                });
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.setClearColor(0x000000, 0);
                container.appendChild(renderer.domElement);

                // Lighting
                const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
                scene.add(ambientLight);
                const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
                directionalLight.position.set(0, 5, 5);
                scene.add(directionalLight);

                // Simple stars background
                const starsGeometry = new THREE.BufferGeometry();
                const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
                const starsVertices = [];
                for (let i = 0; i < 800; i++) {
                    const x = (Math.random() - 0.5) * 2000;
                    const y = (Math.random() - 0.5) * 2000;
                    const z = (Math.random() - 0.5) * 2000;
                    starsVertices.push(x, y, z);
                }
                starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
                const stars = new THREE.Points(starsGeometry, starsMaterial);
                scene.add(stars);

                // Load models in a circle
                const loader = new GLTFLoader();
                const models = [];
                const modelCount = 8;
                let loadedCount = 0;

                const createModelInstance = (index) => {
                    loader.load(
                        MODEL_URL,
                        (gltf) => {
                            if (!isMounted) return;
                            const model = gltf.scene.clone();
                            
                            // Position in circle
                            const angle = (index / modelCount) * Math.PI * 2;
                            const radius = 3;
                            model.position.set(
                                Math.cos(angle) * radius,
                                Math.sin(angle) * 1.5,
                                Math.sin(index) * 1.5
                            );
                            model.scale.set(0.5, 0.5, 0.5);
                            
                            scene.add(model);
                            models.push({ model, index, speed: 1 + Math.random() });
                            
                            loadedCount++;
                            if (loadedCount === modelCount) {
                                sceneRef.current = {
                                    scene: scene,
                                    camera: camera,
                                    renderer: renderer,
                                    models: models,
                                    animationId: null,
                                };
                                animate();
                            }
                        },
                        undefined,
                        (error) => {
                            console.error(`Error loading model instance ${index}:`, error);
                            Sentry.captureException(error, {
                                tags: { component: 'CodyLogoScene', instance: index },
                            });
                        }
                    );
                };

                // Load all model instances
                for (let i = 0; i < modelCount; i++) {
                    createModelInstance(i);
                }

                // Animation loop
                const animate = () => {
                    if (!isMounted || !sceneRef.current) return;
                    
                    // Rotate models
                    sceneRef.current.models.forEach((m) => {
                        m.model.rotation.y += 0.5 * 0.016; // ~60fps
                        m.model.rotation.x = Math.sin(Date.now() * 0.001 + m.index) * 0.3;
                    });
                    
                    // Parallax camera movement
                    const scrollY = window.scrollY;
                    camera.position.y = scrollY * 0.005;
                    
                    sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
                    sceneRef.current.animationId = requestAnimationFrame(animate);
                };

                // Handle resize
                const handleResize = () => {
                    if (!sceneRef.current) return;
                    const width = window.innerWidth;
                    const height = window.innerHeight;
                    sceneRef.current.camera.aspect = width / height;
                    sceneRef.current.camera.updateProjectionMatrix();
                    sceneRef.current.renderer.setSize(width, height);
                };

                window.addEventListener('resize', handleResize);

                // WebGL context recovery
                const handleContextLost = (event) => {
                    console.warn('WebGL context lost, attempting recovery...');
                    Sentry.captureMessage('WebGL context lost', {
                        level: 'warning',
                        tags: { component: 'CodyLogoScene' },
                    });
                    event.preventDefault();
                };

                const handleContextRestored = () => {
                    console.log('WebGL context restored');
                    Sentry.captureMessage('WebGL context restored', {
                        level: 'info',
                        tags: { component: 'CodyLogoScene' },
                    });
                    if (sceneRef.current) {
                        sceneRef.current.animationId = requestAnimationFrame(animate);
                    }
                };

                renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
                renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

                // Cleanup
                return () => {
                    mounted = false;
                    window.removeEventListener('resize', handleResize);
                    renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
                    renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
                    
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
                console.error('Error initializing background scene:', err);
                Sentry.captureException(err instanceof Error ? err : new Error('Scene initialization failed'), {
                    tags: { component: 'CodyLogoScene' },
                });
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
    }, [isVisible, mounted]);

    // Consistent style object for SSR - inline to avoid hydration issues
    // suppressHydrationWarning because Three.js canvas is added client-side only
    return (
        <div
            ref={containerRef}
            suppressHydrationWarning
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
                pointerEvents: "none",
                background: "transparent",
            }}
        />
    );
}