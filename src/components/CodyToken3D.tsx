'use client';

import React from 'react';
import Image from 'next/image';

// Static image path - replace with your rendered image from the GLB model
// You can generate this by taking a screenshot of the 3D model or using a tool like Blender
// For now, using the existing logo as a placeholder until you create a static render
const STATIC_IMAGE_URL = '/cclogo.png';

export default function CodyToken3D() {
  return (
    <div 
      style={{
        height: '400px',
        width: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '320px',
          height: '320px',
          maxWidth: '80vw',
          maxHeight: '80vw',
        }}
      >
        <Image
          src={STATIC_IMAGE_URL}
          alt="CODY Token"
          fill
          style={{
            objectFit: 'contain',
          }}
          priority
        />
      </div>
    </div>
  );
}
