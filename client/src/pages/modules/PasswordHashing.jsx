import React from "react";
import { Link } from "react-router-dom";
import "./Modules.css";

const PasswordHashing = () => {
  return (
    <div className="module-container">
      <h1 className="module-header">Password Hashing: Secure vs Insecure</h1>
      <p className="module-body">
        This module explains what password hashing is, why “just hashing a password” is not enough, and how to compare a
        secure approach (bcrypt) with insecure approaches (MD5 and DIY hashing). When you’re ready, you can jump into the
        interactive sandbox.
      </p>

      <h2 className="module-header">What problem are we solving?</h2>
      <p className="module-body">
        When a user creates an account, your system needs a way to check their password later — but storing raw passwords
        is unsafe. Instead, you store a <b>password hash</b>: a one-way transform of the password that you can verify by
        hashing again and comparing.
      </p>

      <p className="module-body">
        <b>Goal:</b> If an attacker steals your database, it should still be expensive for them to guess passwords. That
        means your password hashing must be intentionally slow and include a unique salt per password.
      </p>

      <h2 className="module-header">Secure approach: bcrypt</h2>
      <p className="module-body">
        bcrypt is designed specifically for password storage. It includes a random salt and a tunable <b>work factor</b>
        (cost). Two important properties fall out of that design:
      </p>
      <p className="module-body">
        <b>Salted:</b> The same password hashed twice should produce different outputs, because each hash includes a new
        random salt. This prevents many “precomputed” attacks (like rainbow tables).
      </p>
      <p className="module-body">
        <b>Slow on purpose:</b> Attackers can’t try billions of guesses per second like they can with fast hashes.
      </p>

      <h2 className="module-header">Insecure approach: MD5 / DIY hashing</h2>
      <p className="module-body">
        MD5 is a fast general-purpose hash. For passwords, “fast” is a problem: it makes large-scale guessing attacks
        cheaper. Even if you “customize” MD5 (for example, <code>MD5(pepper + password)</code>), the result is still fast
        and still not adaptive — so it doesn’t meaningfully change the attacker’s economics.
      </p>

      <h2 className="module-header">Try it interactively</h2>
      <p className="module-body">
        The sandbox lets you enter an input and see bcrypt vs MD5 vs a DIY hash side-by-side. It also includes a safe MD5
        collision demo using published test vectors (two different inputs with the same MD5).
      </p>
      <p className="module-body">
        <Link to="/sandbox/password-hashing" style={{ color: "#203446", textDecoration: "none", fontWeight: 600 }}>
          → Open the Password Hashing Sandbox
        </Link>
      </p>

      <h2 className="module-header">Further reading (reputable references)</h2>
      <p className="module-body">
        If you want a deeper, more formal treatment of password storage and hash selection, these are strong starting
        points:
      </p>
      <ul className="module-body" style={{ marginTop: 0 }}>
        <li>
          OWASP Password Storage Cheat Sheet:{" "}
          <a href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" target="_blank" rel="noreferrer">
            cheatsheetseries.owasp.org
          </a>
        </li>
        <li>
          NIST SP 800-63B (Digital Identity Guidelines) – Authentication and memorized secrets:{" "}
          <a href="https://pages.nist.gov/800-63-3/sp800-63b.html" target="_blank" rel="noreferrer">
            pages.nist.gov/800-63-3
          </a>
        </li>
        <li>
          bcrypt paper (Provos &amp; Mazières, 1999):{" "}
          <a href="https://www.usenix.org/legacy/events/usenix99/provos/provos.pdf" target="_blank" rel="noreferrer">
            usenix.org (PDF)
          </a>
        </li>
        <li>
          MD5 collision demo (why MD5 is broken for integrity):{" "}
          <a href="https://mathstat.dal.ca/~selinger/md5collision/" target="_blank" rel="noreferrer">
            mathstat.dal.ca/~selinger
          </a>
        </li>
      </ul>
    </div>
  );
};

PasswordHashing.metadata = {
  title: "Password Hashing: Secure vs Insecure",
  description: "Compare bcrypt (secure) vs MD5/DIY hashing (insecure), then try the interactive sandbox.",
  difficulty: "Beginner",
  estimatedTime: "10 minutes",
  tags: ["Passwords", "Hashing", "Authentication", "Security"],
  prerequisites: [],
  learningObjectives: [
    "Explain why password hashing is different from general-purpose hashing",
    "Describe bcrypt salt and cost at a high level",
    "Recognize why MD5/DIY hashing are unsafe for password storage",
    "Use the sandbox to compare outputs and behaviors",
  ],
};

export default PasswordHashing;

