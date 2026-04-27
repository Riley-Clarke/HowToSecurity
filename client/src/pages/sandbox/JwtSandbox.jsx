import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Sandbox.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function postJson(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

function base64UrlToJson(b64url) {
  const b64 = String(b64url || "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const json = atob(b64 + pad);
  return JSON.parse(json);
}

function tryDecodeJwt(token) {
  const raw = String(token || "").trim();
  const parts = raw.split(".");
  if (parts.length !== 3) return { ok: false, error: "Token must have 3 parts (header.payload.signature)." };
  try {
    return {
      ok: true,
      header: base64UrlToJson(parts[0]),
      payload: base64UrlToJson(parts[1]),
      signatureB64Url: parts[2],
    };
  } catch (e) {
    return { ok: false, error: "Failed to decode JWT parts (invalid base64url or JSON)." };
  }
}

function stringifyPretty(value) {
  return JSON.stringify(value, null, 2);
}

export default function JwtSandbox() {
  const [sub, setSub] = useState("user-123");
  const [admin, setAdmin] = useState(false);
  const [iss, setIss] = useState("howtosecurity");
  const [aud, setAud] = useState("howtosecurity-sandbox");
  const [expiresInSec, setExpiresInSec] = useState(120);

  const [issued, setIssued] = useState(null);
  const [token, setToken] = useState("");
  const [busyIssue, setBusyIssue] = useState(false);
  const [issueError, setIssueError] = useState("");

  const decoded = useMemo(() => tryDecodeJwt(token), [token]);

  const [tamperPayloadText, setTamperPayloadText] = useState("");
  const [tamperedToken, setTamperedToken] = useState("");
  const [tamperError, setTamperError] = useState("");

  const [verifyBusy, setVerifyBusy] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  async function issueToken() {
    setBusyIssue(true);
    setIssueError("");
    setIssued(null);
    setVerifyResult(null);
    setVerifyError("");
    try {
      const data = await postJson("/api/labs/jwt/issue", { sub, admin, iss, aud, expiresInSec });
      setIssued(data);
      setToken(data.token || "");
      setTamperPayloadText(stringifyPretty(data.decoded?.payload || {}));
      setTamperedToken("");
      setTamperError("");
    } catch (e) {
      setIssueError(e?.message || "Something went wrong");
    } finally {
      setBusyIssue(false);
    }
  }

  function buildTamperedToken() {
    setTamperError("");
    setTamperedToken("");
    setVerifyResult(null);
    setVerifyError("");

    const raw = String(token || "").trim();
    const parts = raw.split(".");
    if (parts.length !== 3) {
      setTamperError("You need a valid token first (header.payload.signature).");
      return;
    }

    let newPayloadObj;
    try {
      newPayloadObj = JSON.parse(tamperPayloadText);
    } catch (e) {
      setTamperError("Tampered payload must be valid JSON.");
      return;
    }

    const newPayloadB64Url = btoa(JSON.stringify(newPayloadObj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");

    // Keep the original signature on purpose (this should fail verification).
    setTamperedToken(`${parts[0]}.${newPayloadB64Url}.${parts[2]}`);
  }

  async function verifyOnServer(which) {
    setVerifyBusy(true);
    setVerifyError("");
    setVerifyResult(null);
    try {
      const tokenToVerify = which === "tampered" ? tamperedToken : token;
      const data = await postJson("/api/labs/jwt/verify", { token: tokenToVerify, expectedIss: iss, expectedAud: aud });
      setVerifyResult(data);
    } catch (e) {
      setVerifyError(e?.message || "Something went wrong");
    } finally {
      setVerifyBusy(false);
    }
  }

  const explainer = useMemo(
    () => [
      "JWTs are not encrypted by default — anyone who gets the token can read the payload.",
      "The signature is what prevents tampering: if you change payload bytes, signature verification fails.",
      "Servers should validate both the signature and key claims like exp, iss, and aud.",
    ],
    []
  );

  return (
    <div style={{ padding: "2rem" }}>
      <div className="sandbox-container">
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <h1 className="sandbox-header" style={{ marginBottom: 0 }}>
            JWT / Auth Tokens Sandbox
          </h1>
          <Link to="/sandbox" style={{ alignSelf: "center", color: "#203446", textDecoration: "none", fontWeight: 600 }}>
            ← Back to Sandbox
          </Link>
        </div>

        <p className="sandbox-body" style={{ marginTop: "1rem" }}>
          This lab issues a signed HS256 JWT on the server, then lets you decode it, tamper with claims, and verify what the
          server accepts.
        </p>
        <ul className="sandbox-body" style={{ marginTop: 0 }}>
          {explainer.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <h2 className="sandbox-header">1) Issue a token (server-signed HS256)</h2>
        <div className="sandbox-row">
          <div style={{ flex: "1 1 240px" }}>
            <p className="sandbox-body" style={{ marginBottom: 6 }}>
              <b>sub</b> (subject / user id)
            </p>
            <input className="sandbox-input" value={sub} onChange={(e) => setSub(e.target.value)} />
          </div>
          <div style={{ flex: "1 1 240px" }}>
            <p className="sandbox-body" style={{ marginBottom: 6 }}>
              <b>iss</b> (issuer)
            </p>
            <input className="sandbox-input" value={iss} onChange={(e) => setIss(e.target.value)} />
          </div>
          <div style={{ flex: "1 1 240px" }}>
            <p className="sandbox-body" style={{ marginBottom: 6 }}>
              <b>aud</b> (audience)
            </p>
            <input className="sandbox-input" value={aud} onChange={(e) => setAud(e.target.value)} />
          </div>
        </div>
        <div className="sandbox-row" style={{ marginTop: 12 }}>
          <label className="sandbox-body" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={admin} onChange={(e) => setAdmin(e.target.checked)} />
            <b>admin</b>
          </label>
          <div className="sandbox-body">
            <b>expiresInSec:</b>{" "}
            <input
              type="number"
              value={expiresInSec}
              onChange={(e) => setExpiresInSec(Number(e.target.value))}
              style={{ width: 110, padding: "0.4rem", marginLeft: 8 }}
              min={1}
              max={86400}
            />
          </div>
          <button className="sandbox-button" onClick={issueToken} disabled={busyIssue}>
            {busyIssue ? "Issuing…" : "Issue token"}
          </button>
        </div>

        {issueError ? (
          <div className="sandbox-error">
            <b>Error:</b> {issueError}
          </div>
        ) : null}

        {issued?.token ? (
          <>
            <p className="sandbox-body" style={{ marginTop: "1rem" }}>
              <b>Issued token</b>
            </p>
            <textarea
              className="sandbox-input"
              style={{ fontFamily: "monospace", height: 120 }}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              aria-label="JWT token"
            />
          </>
        ) : null}

        <h2 className="sandbox-header">2) Decode (client-side, for learning)</h2>
        <p className="sandbox-body">
          Decoding just means base64url-decoding the header/payload. It does <b>not</b> prove the token is trustworthy.
        </p>
        {decoded.ok ? (
          <>
            <p className="sandbox-body">
              <b>Header</b>
            </p>
            <pre className="sandbox-pre">{stringifyPretty(decoded.header)}</pre>
            <p className="sandbox-body">
              <b>Payload</b>
            </p>
            <pre className="sandbox-pre">{stringifyPretty(decoded.payload)}</pre>
          </>
        ) : (
          <div className="sandbox-error">
            <b>Decode error:</b> {decoded.error}
          </div>
        )}

        <h2 className="sandbox-header">3) Tamper with payload (keep old signature)</h2>
        <p className="sandbox-body">
          Try changing <b>admin</b> to <b>true</b>, or changing <b>aud</b>/<b>iss</b>. We intentionally keep the old signature,
          so a correct server should reject it.
        </p>
        <textarea
          className="sandbox-input"
          style={{ fontFamily: "monospace", height: 160 }}
          value={tamperPayloadText}
          onChange={(e) => setTamperPayloadText(e.target.value)}
          aria-label="Tampered payload JSON"
        />
        <div className="sandbox-row" style={{ marginTop: 12 }}>
          <button className="sandbox-button" onClick={buildTamperedToken} disabled={!token}>
            Build tampered token
          </button>
          {tamperError ? (
            <div className="sandbox-error" style={{ marginTop: 0 }}>
              <b>Error:</b> {tamperError}
            </div>
          ) : null}
        </div>

        {tamperedToken ? (
          <>
            <p className="sandbox-body" style={{ marginTop: "1rem" }}>
              <b>Tampered token</b> (old signature preserved)
            </p>
            <textarea
              className="sandbox-input"
              style={{ fontFamily: "monospace", height: 120 }}
              value={tamperedToken}
              onChange={(e) => setTamperedToken(e.target.value)}
              aria-label="Tampered JWT token"
            />
          </>
        ) : null}

        <h2 className="sandbox-header">4) Verify on server (signature + exp/iss/aud)</h2>
        <div className="sandbox-row">
          <button className="sandbox-button" onClick={() => verifyOnServer("original")} disabled={!token || verifyBusy}>
            {verifyBusy ? "Verifying…" : "Verify original"}
          </button>
          <button className="sandbox-button" onClick={() => verifyOnServer("tampered")} disabled={!tamperedToken || verifyBusy}>
            {verifyBusy ? "Verifying…" : "Verify tampered"}
          </button>
        </div>

        {verifyError ? (
          <div className="sandbox-error">
            <b>Error:</b> {verifyError}
          </div>
        ) : null}

        {verifyResult ? (
          <>
            <p className="sandbox-body" style={{ marginTop: "1rem" }}>
              <b>Result</b>
            </p>
            <pre className="sandbox-pre">{stringifyPretty(verifyResult)}</pre>
          </>
        ) : null}
      </div>
    </div>
  );
}

