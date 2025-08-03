"use client";
import React, { Suspense } from "react";
import CodyLogoScene from "./CodyLogoScene";

// Error boundary for WebGL issues
class WebGLErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch() {
        console.warn('WebGL Error caught');
        // Don't crash the app, just log the error
    }

    render() {
        if (this.state.hasError) {
            // Return a fallback or null instead of crashing
            return null;
        }

        return this.props.children;
    }
}

export default function BackgroundLayer() {
    return (
        <div
            style={{
                position: "fixed",
                zIndex: 0,
                top: 0, left: 0, width: "100vw", height: "100vh",
                pointerEvents: "none",
                overflow: "hidden",
            }}
        >
            <WebGLErrorBoundary>
                <Suspense fallback={null}>
                    <CodyLogoScene />
                </Suspense>
            </WebGLErrorBoundary>
        </div>
    );
}
