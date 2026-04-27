import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Sandbox.css";

const SANDBOX_LOADERS = {
  "password-hashing": () => import("./PasswordHashingSandbox"),
  "sql-injection": () => import("./SqlInjectionSandbox"),
  jwt: () => import("./JwtSandbox"),
};

export default function SandboxRenderer() {
  const { sandboxId } = useParams();
  const [SandboxComponent, setSandboxComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadSandbox = async () => {
      setIsLoading(true);
      setLoadError(null);
      setSandboxComponent(null);

      try {
        const loader = sandboxId ? SANDBOX_LOADERS[sandboxId] : null;
        if (!loader) {
          if (!cancelled) setLoadError({ type: "not_found" });
          return;
        }

        const mod = await loader();
        if (cancelled) return;
        setSandboxComponent(() => mod.default);
        window.scrollTo(0, 0);
      } catch (err) {
        console.error("Sandbox not found:", err);
        if (!cancelled) setLoadError({ type: "load_failed" });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadSandbox();

    return () => {
      cancelled = true;
    };
  }, [sandboxId]);

  if (isLoading) {
    return (
      <div style={{ padding: "2rem" }}>
        <div className="sandbox-container">
          <h1 className="sandbox-header">Loading sandbox…</h1>
          <div className="sandbox-loading" aria-busy="true" aria-live="polite">
            <span className="sandbox-spinner" aria-hidden="true" />
            <span className="sandbox-body" style={{ margin: 0 }}>
              Please wait a moment.
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (loadError || !SandboxComponent) {
    return (
      <div style={{ padding: "2rem" }}>
        <div className="sandbox-container">
          <h1 className="sandbox-header">Sandbox Not Found</h1>
          <p className="sandbox-body">The requested sandbox could not be loaded.</p>
          <div className="sandbox-item">
            <Link to="/sandbox" style={{ color: "#203446", textDecoration: "none", fontWeight: 600 }}>
              ← Back to Sandbox
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <SandboxComponent />;
}

