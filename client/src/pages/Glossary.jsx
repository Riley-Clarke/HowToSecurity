import React, { useMemo, useState } from "react";
import "./modules/Modules.css";
import externalResources from "./glossary.externalResources.json";
import definitions from "./glossary.definitions.json";

export default function Glossary() {
  const [query, setQuery] = useState("");

  const filteredAndSortedDefinitions = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = q
      ? definitions.filter((d) => (d.term ?? "").toLowerCase().includes(q) || (d.def ?? "").toLowerCase().includes(q))
      : definitions;

    return [...filtered].sort((a, b) =>
      (a.term ?? "").localeCompare(b.term ?? "", undefined, { sensitivity: "base", numeric: true })
    );
  }, [query]);

  const groupedDefinitions = useMemo(() => {
    /** @type {Record<string, Array<{term: string, def: string}>>} */
    const groups = {};
    for (const d of filteredAndSortedDefinitions) {
      const first = (d.term ?? "").trim().charAt(0).toUpperCase();
      const letter = first >= "A" && first <= "Z" ? first : "#";
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(d);
    }
    return groups;
  }, [filteredAndSortedDefinitions]);

  const availableLetters = useMemo(() => new Set(Object.keys(groupedDefinitions)), [groupedDefinitions]);
  const letters = useMemo(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), []);

  return (
    <div className="module-container">
      <h1 className="module-header">Resources & Glossary</h1>
      <p className="module-body">
        A quick reference for external resources linked throughout the modules, plus short definitions for terms used on
        this site.
      </p>

      <h2 className="module-header">External resources</h2>
      <ul className="module-body" style={{ marginTop: 0 }}>
        {[...externalResources]
          .sort((a, b) => (a.label ?? "").localeCompare(b.label ?? "", undefined, { sensitivity: "base", numeric: true }))
          .map((r) => (
          <li key={r.url}>
            <a href={r.url} target="_blank" rel="noreferrer">
              {r.label}
            </a>
          </li>
        ))}
      </ul>

      <h2 className="module-header">Glossary</h2>
      <div className="module-body" style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 10 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search glossary terms…"
            aria-label="Search glossary"
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(0,0,0,0.15)",
              color: "inherit",
              maxWidth: 520,
            }}
          />

          <div
            aria-label="Jump to letter"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              alignItems: "center",
              position: "sticky",
              top: 0,
              padding: "8px 0",
              zIndex: 1,
            }}
          >
            {letters.map((l) => {
              const enabled = availableLetters.has(l);
              return (
                <a
                  key={l}
                  href={enabled ? `#glossary-${l}` : undefined}
                  onClick={(e) => {
                    if (!enabled) e.preventDefault();
                  }}
                  style={{
                    padding: "4px 8px",
                    borderRadius: 999,
                    border: enabled ? "1px solid #203446" : "1px solid rgba(32, 52, 70, 0.25)",
                    textDecoration: "none",
                    color: enabled ? "inherit" : "rgba(102, 102, 102, 0.5)",
                    pointerEvents: enabled ? "auto" : "none",
                    fontSize: 12,
                  }}
                >
                  {l}
                </a>
              );
            })}
            {availableLetters.has("#") ? (
              <a
                href="#glossary-%23"
                style={{
                  padding: "4px 8px",
                  borderRadius: 999,
                  border: "1px solid #203446",
                  textDecoration: "none",
                  color: "inherit",
                  fontSize: 12,
                }}
              >
                #
              </a>
            ) : null}
          </div>
        </div>

        {filteredAndSortedDefinitions.length === 0 ? (
          <div>No glossary entries match “{query.trim()}”.</div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {availableLetters.has("#") ? (
              <div id="glossary-%23">
                <div className="module-header" style={{ marginBottom: 6 }}>
                  #
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {(groupedDefinitions["#"] ?? []).map((d) => (
                    <div key={d.term}>
                      <b>{d.term}:</b> {d.def}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {letters
              .filter((l) => availableLetters.has(l))
              .map((l) => (
                <div key={l} id={`glossary-${l}`}>
                  <div className="module-header" style={{ marginBottom: 6 }}>
                    {l}
                  </div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {(groupedDefinitions[l] ?? []).map((d) => (
                      <div key={d.term}>
                        <b>{d.term}:</b> {d.def}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

