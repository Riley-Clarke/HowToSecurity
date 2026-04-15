import React from "react";
import "./modules/Modules.css";
import externalResources from "./glossary.externalResources.json";
import definitions from "./glossary.definitions.json";

export default function Glossary() {
  return (
    <div className="module-container">
      <h1 className="module-header">Resources & Glossary</h1>
      <p className="module-body">
        A quick reference for external resources linked throughout the modules, plus short definitions for terms used on
        this site.
      </p>

      <h2 className="module-header">External resources</h2>
      <ul className="module-body" style={{ marginTop: 0 }}>
        {externalResources.map((r) => (
          <li key={r.url}>
            <a href={r.url} target="_blank" rel="noreferrer">
              {r.label}
            </a>
          </li>
        ))}
      </ul>

      <h2 className="module-header">Glossary</h2>
      <div className="module-body" style={{ display: "grid", gap: 10 }}>
        {definitions.map((d) => (
          <div key={d.term}>
            <b>{d.term}:</b> {d.def}
          </div>
        ))}
      </div>
    </div>
  );
}

