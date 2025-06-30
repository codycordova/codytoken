"use client";
import React from "react";
import CodyLogoScene from "./CodyLogoScene";

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
            <CodyLogoScene />
        </div>
    );
}
