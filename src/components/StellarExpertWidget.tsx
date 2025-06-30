"use client";

import React, { useEffect, useRef, useState } from 'react';

interface WidgetProps {
    src: string;
    title: string;
}

export default function StellarExpertWidget({ src, title }: WidgetProps) {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true); // Ensures iframe only renders on a client

        const handleResize = (event: MessageEvent) => {
            const iframe = iframeRef.current;
            if (iframe && event.source === iframe.contentWindow && event.data.widget === iframe.src) {
                iframe.style.height = `${event.data.height}px`;
            }
        };
        window.addEventListener("message", handleResize);
        return () => window.removeEventListener("message", handleResize);
    }, []);

    if (!mounted) {
        // Don't render anything on the server
        return null;
    }

    return (
        <div className="iframe-container">
            <iframe
                ref={iframeRef}
                title={title}
                src={src}
                style={{
                    border: 'none',
                    overflow: 'hidden',
                    maxWidth: '100%',
                    minWidth: '300px',
                    maxHeight: '100%',
                    minHeight: '200px',
                    width: '100%'
                }}
                onLoad={() => {
                    const iframe = iframeRef.current;
                    window.addEventListener('message', function ({ data, source }) {
                        if (iframe && source === iframe.contentWindow && data.widget === iframe.src) {
                            iframe.style.height = data.height + 'px';
                        }
                    }, false);
                }}
                allowFullScreen
            />
        </div>
    );
}
