import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Sandbox.css";

const SANDBOX_LOADERS = {
  "password-hashing": () => import("./PasswordHashingSandbox"),
};

export default function SandboxRenderer() {
  const { sandboxId } = useParams();
  const [SandboxComponent, setSandboxComponent] = useState(null);

  useEffect(() => {
    const loadSandbox = async () => {
      try {
        const loader = sandboxId ? SANDBOX_LOADERS[sandboxId] : null;
        if (!loader) {
          setSandboxComponent(null);
          return;
        }

        const mod = await loader();
        setSandboxComponent(() => mod.default);
        window.scrollTo(0, 0);
      } catch (err) {
        console.error("Sandbox not found:", err);
        setSandboxComponent(null);
      }
    };

    loadSandbox();
  }, [sandboxId]);

  if (!SandboxComponent) {
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

