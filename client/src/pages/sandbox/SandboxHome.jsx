import React from "react";
import { Link } from "react-router-dom";
import "./Sandbox.css";

export default function SandboxHome() {
  return (
    <div style={{ padding: "2rem" }}>
      <div className="sandbox-container">
        <h1 className="sandbox-header">Sandbox</h1>
        <p className="sandbox-body">
          Sandboxes are hands-on labs attached to learning modules. Each sandbox is focused on a single topic so you can
          experiment safely and see results immediately.
        </p>

        <p className="sandbox-body">
          <b>Password Hashing</b>
          <br />
          Compare bcrypt (secure password hashing) vs MD5 and a “DIY” hash (insecure), and see an MD5 collision demo.
          <br />
          <Link to="/sandbox/password-hashing" style={{ color: "#203446", textDecoration: "none", fontWeight: 600 }}>
            → Open Password Hashing Sandbox
          </Link>
        </p>

        <p className="sandbox-body">
          <b>More coming soon:</b> SQL injection, XSS, and additional module sandboxes.
        </p>
      </div>
    </div>
  );
}

