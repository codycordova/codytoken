"use client";

import React from 'react';
import './CodyLogoScene.css';

// Static background component - no 3D rendering needed
// This creates a simple cosmic/stellar background effect
export default function CodyLogoScene() {
  return (
    <div className="cody-logo-scene-static">
      <div className="cody-logo-scene-stars" />
    </div>
  );
}
