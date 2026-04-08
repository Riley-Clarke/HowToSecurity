import React, { useEffect, useMemo, useState } from "react";
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

function getSandboxSessionId() {
  const key = "hts_sandbox_session_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const id = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now());
  window.localStorage.setItem(key, id);
  return id;
}

export default function SqlInjectionSandbox() {
  const sessionId = useMemo(() => getSandboxSessionId(), []);

  const [schema, setSchema] = useState([]);
  const [rowCountTotal, setRowCountTotal] = useState(0);
  const [limits, setLimits] = useState(null);

  const [sql, setSql] = useState("SELECT id, username, role FROM users;");
  const [sqlResult, setSqlResult] = useState(null);
  const [sqlBusy, setSqlBusy] = useState(false);
  const [sqlError, setSqlError] = useState("");

  const [username, setUsername] = useState("alice");
  const [password, setPassword] = useState("alice123");
  const [loginResult, setLoginResult] = useState(null);
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [resetBusy, setResetBusy] = useState(false);
  const [resetError, setResetError] = useState("");

  async function resetDb() {
    setResetBusy(true);
    setResetError("");
    try {
      const data = await postJson("/api/labs/sql-injection/reset", { sessionId });
      setSchema(data.schema || []);
      setRowCountTotal(data.rowCountTotal || 0);
      setLimits(data.limits || null);
      setSqlResult(null);
      setSqlError("");
      setLoginResult(null);
      setLoginError("");
    } catch (e) {
      setResetError(e?.message || "Something went wrong");
    } finally {
      setResetBusy(false);
    }
  }

  useEffect(() => {
    resetDb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runSql() {
    setSqlBusy(true);
    setSqlError("");
    setSqlResult(null);
    try {
      const data = await postJson("/api/labs/sql-injection/execute", { sessionId, sql });
      setSqlResult(data);
      setRowCountTotal(data.rowCountTotal || 0);
      setLimits(data.limits || limits);
    } catch (e) {
      setSqlError(e?.message || "Something went wrong");
    } finally {
      setSqlBusy(false);
    }
  }

  async function runLogin() {
    setLoginBusy(true);
    setLoginError("");
    setLoginResult(null);
    try {
      const data = await postJson("/api/labs/sql-injection/login", { sessionId, username, password });
      setLoginResult(data);
      setRowCountTotal(data.rowCountTotal || 0);
      setLimits(data.limits || limits);
    } catch (e) {
      setLoginError(e?.message || "Something went wrong");
    } finally {
      setLoginBusy(false);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <div className="sandbox-container">
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <h1 className="sandbox-header" style={{ marginBottom: 0 }}>
            SQL Injection Sandbox (SQLite in-memory)
          </h1>
          <Link to="/sandbox" className="sandbox-link" style={{ alignSelf: "center" }}>
            ← Back to Sandbox
          </Link>
        </div>

        <p className="sandbox-body" style={{ marginTop: "1rem" }}>
          This is an intentionally insecure, resettable SQLite database that lives only in server memory. You can run
          arbitrary SQL (one statement at a time) and try injection payloads safely.
        </p>

        <div className="sandbox-row">
          <button className="sandbox-button" onClick={resetDb} disabled={resetBusy}>
            {resetBusy ? "Resetting…" : "Reset database"}
          </button>
          <div className="sandbox-body">
            <b>Rows:</b> {rowCountTotal}
            {limits ? (
              <>
                {" "}
                <span style={{ marginLeft: 12 }}>
                  <b>Max rows:</b> {limits.maxRowsTotal}
                </span>
              </>
            ) : null}
          </div>
        </div>

        {resetError ? (
          <div className="sandbox-error">
            <b>Error:</b> {resetError}
          </div>
        ) : null}

        <h2 className="sandbox-header">1) Schema (prefilled)</h2>
        <p className="sandbox-body">
          This sandbox starts with a couple tables and a few rows. The data is intentionally simple so you can focus on
          how queries behave.
        </p>
        <pre className="sandbox-pre">
          {(schema || [])
            .map((t) => `-- ${t.name}\n${t.sql};\n`)
            .join("\n") || "Loading…"}
        </pre>

        <h2 className="sandbox-header">2) Vulnerable login (classic injection target)</h2>
        <p className="sandbox-body">
          This login is intentionally vulnerable: it builds a SQL string by concatenating what you type into the query.
          Try payloads like <code>' OR '1'='1</code> in either field and inspect the SQL it produced.
        </p>
        <div className="sandbox-row">
          <div style={{ flex: "1 1 260px" }}>
            <div className="sandbox-body">
              <b>Username</b>
            </div>
            <input className="sandbox-input" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <div className="sandbox-body">
              <b>Password</b>
            </div>
            <input className="sandbox-input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="sandbox-button" onClick={runLogin} disabled={loginBusy} style={{ alignSelf: "flex-end" }}>
            {loginBusy ? "Running…" : "Attempt login"}
          </button>
        </div>

        {loginError ? (
          <div className="sandbox-error">
            <b>Error:</b> {loginError}
          </div>
        ) : null}

        {loginResult ? (
          <>
            <p className="sandbox-body" style={{ marginTop: "1rem" }}>
              <b>Query that was executed (intentionally unsafe)</b>
            </p>
            <pre className="sandbox-pre">{loginResult.query}</pre>
            <p className="sandbox-body">
              <b>Login success?</b> {String(loginResult.success)}
            </p>
            <p className="sandbox-body">
              <b>Rows returned:</b>
            </p>
            <pre className="sandbox-pre">{JSON.stringify(loginResult.rows, null, 2)}</pre>
          </>
        ) : null}

        <h2 className="sandbox-header">3) SQL console (one statement)</h2>
        <p className="sandbox-body">
          Run whatever you want against the sandbox DB: SELECT/INSERT/UPDATE/DELETE/CREATE, etc. This is intentionally
          permissive, but it enforces a total-row cap so you can’t add thousands of rows.
        </p>
        <div className="sandbox-body">
          <b>SQL</b>
        </div>
        <textarea
          className="sandbox-input"
          style={{ fontFamily: "monospace", height: 120 }}
          value={sql}
          onChange={(e) => setSql(e.target.value)}
        />
        <div className="sandbox-row" style={{ marginTop: 12 }}>
          <button className="sandbox-button" onClick={runSql} disabled={sqlBusy}>
            {sqlBusy ? "Running…" : "Execute SQL"}
          </button>
        </div>

        {sqlError ? (
          <div className="sandbox-error">
            <b>Error:</b> {sqlError}
          </div>
        ) : null}

        {sqlResult ? (
          <>
            <p className="sandbox-body" style={{ marginTop: "1rem" }}>
              <b>Result</b>
            </p>
            {sqlResult.columns?.length ? (
              <pre className="sandbox-pre">{JSON.stringify({ columns: sqlResult.columns, rows: sqlResult.rows }, null, 2)}</pre>
            ) : (
              <pre className="sandbox-pre">
                {JSON.stringify(
                  { changes: sqlResult.changes, lastInsertRowid: sqlResult.lastInsertRowid, rowCountTotal: sqlResult.rowCountTotal },
                  null,
                  2
                )}
              </pre>
            )}
            {sqlResult.truncated ? (
              <p className="sandbox-body">
                <b>Note:</b> results were truncated for safety.
              </p>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}

