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

        <div className="sandbox-entry">
          <div>
            <p className="sandbox-entry-title">Password Hashing</p>
            <p className="sandbox-body sandbox-entry-desc">
              Compare bcrypt (secure password hashing) vs MD5 and a “DIY” hash (insecure), and see an MD5 collision demo.
            </p>
          </div>
          <div className="sandbox-entry-action">
            <Link to="/sandbox/password-hashing" className="sandbox-link">
              Open →
            </Link>
          </div>
        </div>

        <div className="sandbox-entry">
          <div>
            <p className="sandbox-entry-title">SQL Injection</p>
            <p className="sandbox-body sandbox-entry-desc">
              Use a resettable in-memory SQLite database to run queries, test payloads, and see how vulnerable string
              concatenation can be exploited.
            </p>
          </div>
          <div className="sandbox-entry-action">
            <Link to="/sandbox/sql-injection" className="sandbox-link">
              Open →
            </Link>
          </div>
        </div>

        <p className="sandbox-body">
          <b>More coming soon</b>
        </p>
      </div>
    </div>
  );
}

