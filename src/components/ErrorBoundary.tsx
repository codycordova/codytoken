"use client";

import React, { Component, type ReactNode } from "react";
import * as Sentry from "@sentry/nextjs";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            background: "#0a0a0a",
            color: "#e0e0e0",
          }}
        >
          <div
            style={{
              maxWidth: 600,
              background: "rgba(34,34,64,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <h1 style={{ color: "#ff6b6b", marginBottom: "1rem" }}>
              Something went wrong
            </h1>
            <p style={{ color: "#a5b4fc", marginBottom: "1.5rem" }}>
              We&apos;re sorry, but something unexpected happened. The error has been logged and we&apos;ll look into it.
            </p>
            {this.state.error && (
              <details
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 8,
                  textAlign: "left",
                  fontSize: "0.9rem",
                }}
              >
                <summary style={{ cursor: "pointer", color: "#9cc1ff" }}>
                  Error details
                </summary>
                <pre
                  style={{
                    marginTop: "0.5rem",
                    color: "#ffb4b4",
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{
                marginTop: "1.5rem",
                padding: "0.75rem 1.5rem",
                background: "linear-gradient(135deg, #ff4dc4, #7f9cf5)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

