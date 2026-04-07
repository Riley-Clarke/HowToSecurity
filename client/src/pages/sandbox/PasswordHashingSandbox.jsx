import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Sandbox.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function joinHexLines(lines) {
  return lines.map((l) => l.trim()).join("");
}

// Published MD5 collision pair (128 bytes each), as shown in Peter Selinger's MD5 collision demo.
const MD5_COLLISION_A_HEX = joinHexLines([
  "d131dd02c5e6eec4693d9a0698aff95c2fcab58712467eab4004583eb8fb7f89",
  "55ad340609f4b30283e488832571415a085125e8f7cdc99fd91dbdf280373c5b",
  "d8823e3156348f5bae6dacd436c919c6dd53e2b487da03fd02396306d248cda0",
  "e99f33420f577ee8ce54b67080a80d1ec69821bcb6a8839396f9652b6ff72a70",
]);

const MD5_COLLISION_B_HEX = joinHexLines([
  "d131dd02c5e6eec4693d9a0698aff95c2fcab50712467eab4004583eb8fb7f89",
  "55ad340609f4b30283e4888325f1415a085125e8f7cdc99fd91dbd7280373c5b",
  "d8823e3156348f5bae6dacd436c919c6dd53e23487da03fd02396306d248cda0",
  "e99f33420f577ee8ce54b67080280d1ec69821bcb6a8839396f965ab6ff72a70",
]);

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

export default function PasswordHashingSandbox() {
  const [input, setInput] = useState("correct horse battery staple");
  const [bcryptCost, setBcryptCost] = useState(12);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [collisionAHex, setCollisionAHex] = useState(MD5_COLLISION_A_HEX);
  const [collisionBHex, setCollisionBHex] = useState(MD5_COLLISION_B_HEX);
  const [collisionResult, setCollisionResult] = useState(null);
  const [collisionBusy, setCollisionBusy] = useState(false);
  const [collisionError, setCollisionError] = useState("");

  const bcryptExplainer = useMemo(
    () => [
      "bcrypt is designed for passwords: it is intentionally slow and includes a unique random salt.",
      "Hashing the same input twice should produce different bcrypt hashes (different salts).",
      "Verification works by hashing again and comparing — there is no decryption step.",
    ],
    []
  );

  const insecureExplainer = useMemo(
    () => [
      "MD5 is fast and deterministic. That is useful for checksums, but unsafe for password storage.",
      "A DIY password hash (even with a secret 'pepper') is still fast — attackers can guess at huge scale.",
    ],
    []
  );

  async function runHashing() {
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const data = await postJson("/api/labs/password-hashing", { input, bcryptCost });
      setResult(data);
    } catch (e) {
      setError(e?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function runCollisionDemo() {
    setCollisionBusy(true);
    setCollisionError("");
    setCollisionResult(null);
    try {
      const normalizeHex = (hex) => hex.replace(/\s+/g, "").toLowerCase();
      const aHex = normalizeHex(collisionAHex);
      const bHex = normalizeHex(collisionBHex);

      const [a, b] = await Promise.all([
        postJson("/api/labs/md5", { input: aHex, encoding: "hex" }),
        postJson("/api/labs/md5", { input: bHex, encoding: "hex" }),
      ]);
      setCollisionResult({
        md5A: a.md5Hex,
        md5B: b.md5Hex,
        sameHash: a.md5Hex === b.md5Hex,
      });
    } catch (e) {
      setCollisionError(e?.message || "Something went wrong");
    } finally {
      setCollisionBusy(false);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <div className="sandbox-container">
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <h1 className="sandbox-header" style={{ marginBottom: 0 }}>
            Password Hashing Sandbox
          </h1>
          <Link to="/sandbox" style={{ alignSelf: "center", color: "#203446", textDecoration: "none", fontWeight: 600 }}>
            ← Back to Sandbox
          </Link>
        </div>

        <p className="sandbox-body" style={{ marginTop: "1rem" }}>
          Enter a value, then compare bcrypt (secure password hashing) vs MD5 and a DIY fast hash (insecure).
        </p>

        <h2 className="sandbox-header">1) Input</h2>
        <p className="sandbox-body">
          Treat this like a password the user typed. In real systems you store a hash, not the raw password.
        </p>
        <input className="sandbox-input" value={input} onChange={(e) => setInput(e.target.value)} aria-label="Input" />

        <h2 className="sandbox-header">2) bcrypt cost</h2>
        <p className="sandbox-body">
          Cost controls how slow bcrypt is. Higher cost means more work per guess (for you and attackers).
        </p>
        <div className="sandbox-row">
          <input
            type="range"
            min={10}
            max={14}
            value={bcryptCost}
            onChange={(e) => setBcryptCost(Number(e.target.value))}
            aria-label="bcrypt cost"
          />
          <div className="sandbox-body">
            <b>Cost:</b> {bcryptCost}
          </div>
          <button className="sandbox-button" onClick={runHashing} disabled={busy}>
            {busy ? "Hashing…" : "Run demo"}
          </button>
        </div>

        {error ? (
          <div className="sandbox-error">
            <b>Error:</b> {error}
          </div>
        ) : null}

        {result ? (
          <>
            <h2 className="sandbox-header">3) Results</h2>

            <p className="sandbox-body">
              <b>Secure: bcrypt</b>
            </p>
            <ul className="sandbox-body" style={{ marginTop: 0 }}>
              {bcryptExplainer.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="sandbox-body">
              <b>Hash A</b>
            </p>
            <pre className="sandbox-pre">{result.bcrypt?.hashA}</pre>
            <p className="sandbox-body">
              <b>Hash B</b> (same input, hashed again)
            </p>
            <pre className="sandbox-pre">{result.bcrypt?.hashB}</pre>
            <p className="sandbox-body">
              <b>Verification:</b> {String(result.bcrypt?.verifies)}
            </p>

            <p className="sandbox-body" style={{ marginTop: "1rem" }}>
              <b>Insecure: MD5 and DIY</b>
            </p>
            <ul className="sandbox-body" style={{ marginTop: 0 }}>
              {insecureExplainer.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="sandbox-body">
              <b>MD5 (hex)</b>
            </p>
            <pre className="sandbox-pre">{result.insecure?.md5Hex}</pre>
            <p className="sandbox-body">
              <b>DIY fast hash (hex)</b>
            </p>
            <pre className="sandbox-pre">{result.insecure?.diyHex}</pre>
          </>
        ) : null}

        <h2 className="sandbox-header">4) MD5 collision demo</h2>
        <p className="sandbox-body">
          A collision means two different inputs produce the same hash. MD5 is collision-broken, so we can verify a known
          published collision pair (we are not generating one live).
        </p>
        <p className="sandbox-body">
          <b>Message A (hex)</b>
        </p>
        <textarea
          className="sandbox-input"
          style={{ fontFamily: "monospace", height: 140 }}
          value={collisionAHex}
          onChange={(e) => setCollisionAHex(e.target.value)}
          aria-label="MD5 collision message A hex"
        />
        <p className="sandbox-body">
          <b>Message B (hex)</b>
        </p>
        <textarea
          className="sandbox-input"
          style={{ fontFamily: "monospace", height: 140 }}
          value={collisionBHex}
          onChange={(e) => setCollisionBHex(e.target.value)}
          aria-label="MD5 collision message B hex"
        />
        <p className="sandbox-body">
          Tip: whitespace/newlines are ignored. For the classic demo pair, each message is 128 bytes (256 hex chars).
        </p>
        <button className="sandbox-button" onClick={runCollisionDemo} disabled={collisionBusy}>
          {collisionBusy ? "Hashing…" : "Compute collision MD5"}
        </button>

        {collisionError ? (
          <div className="sandbox-error">
            <b>Error:</b> {collisionError}
          </div>
        ) : null}

        {collisionResult ? (
          <>
            <p className="sandbox-body" style={{ marginTop: "1rem" }}>
              <b>MD5(A)</b>
            </p>
            <pre className="sandbox-pre">{collisionResult.md5A}</pre>
            <p className="sandbox-body">
              <b>MD5(B)</b>
            </p>
            <pre className="sandbox-pre">{collisionResult.md5B}</pre>
            <p className="sandbox-body">
              <b>Hashes identical?</b> {String(collisionResult.sameHash)} (expected: true)
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

