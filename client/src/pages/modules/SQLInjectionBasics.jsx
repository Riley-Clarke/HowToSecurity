import React from 'react';
import { Link } from "react-router-dom";
import './Modules.css';

const SQLInjectionBasics = () => {
  return (
    <div className="module-container">
      <h1 className="module-header">SQL Injection Basics</h1>
      <p className="module-body">
        SQL injection (SQLi) happens when an application treats untrusted user input as if it were trusted SQL code. This
        module explains what SQLi is, <b>why it happens</b>, how attackers exploit it, and how to prevent it in real
        applications.
      </p>

      <h2 className="module-header">What is SQL Injection?</h2>
      <p className="module-body">
        SQL injection is a vulnerability where an attacker can change the meaning of a database query by manipulating the
        input that gets included in the SQL. Instead of the database running the query the developer intended, it runs a
        query that the attacker shaped.
      </p>

      <p className="module-body">
        In plain terms: if your code builds SQL by stitching strings together, an attacker can often “break out” of the
        part that was supposed to be data and inject new SQL keywords (like <code>OR</code>, <code>UNION</code>,{" "}
        <code>DROP</code>, etc.).
      </p>

      <h2 className="module-header">Why does SQL injection happen?</h2>
      <p className="module-body">
        SQL injection is not a bug with the database, but is an issue with how the application handles user input.
      </p>
      <p className="module-body">
        1) Untrusted input (anything a user can influence: form fields, URLs, headers, cookies) is accepted.
        <br />
        2) That input is concatenated into a SQL string.
        <br />
        3) The database parses the final string as SQL, meaning the input can become executable syntax, not just
        a value.
      </p>

      <h2 className="module-header">A classic vulnerable pattern</h2>
      <p className="module-body">
        Consider a login query. A vulnerable implementation might try to do “find the user with this username AND this
        password” by building a SQL string:
      </p>
      <pre className="module-body" style={{ whiteSpace: "pre-wrap" }}>{`--  Vulnerable (string concatenation)
SELECT id, username, role
FROM users
WHERE username = '${"<username>"}' AND password = '${"<password>"}';`}</pre>
      <p className="module-body">
        If an attacker supplies a value that changes the logic, the query no longer means what you think it means. For
        example, a payload like <code>' OR '1'='1</code> can turn “must match username and password” into “always true”.
      </p>

      <h2 className="module-header">What can attackers do with SQL injection?</h2>
      <p className="module-body">
        The impact depends on the database, the query, and the privileges of the DB user your app connects with. Common
        outcomes include:
      </p>
      <p className="module-body">
        <b>- Unauthorized logins</b> (log in without the correct password).
        <br />
        <b>- Data access</b> (read tables you never meant to expose).
        <br />
        <b>- Data modification</b> (UPDATE/DELETE rows).
        <br />
        <b>- Database damage</b> (DROP tables) in the worst cases.
      </p>

      <h2 className="module-header">How to prevent SQL injection</h2>
      <p className="module-body">
        The best defense is to make sure user input is treated as <b>data</b>, not executable SQL. The standard solution
        is:
      </p>

      <h3 className="module-header">1) Use parameterized queries (prepared statements)</h3>
      <p className="module-body">
        Parameterization separates the SQL <i>template</i> from the user-provided values. The database receives the query
        structure and the values separately, so values can’t change the query’s syntax.
      </p>
      <pre className="module-body" style={{ whiteSpace: "pre-wrap" }}>{`--  Safe pattern (parameters)
SELECT id, username, role
FROM users
WHERE username = ? AND password = ?;`}</pre>
      <p className="module-body">
        Even if the user enters <code>' OR '1'='1</code>, it’s treated as a literal string value for the placeholder,
        not as SQL code.
      </p>

      <h3 className="module-header">2) Validate and constrain input (defense-in-depth)</h3>
      <p className="module-body">
        Validation is not a replacement for parameterization, but it helps reduce risk and mistakes. Examples:
        <br />
        <b>- Type constraints</b>: IDs should be integers, not arbitrary strings.
        <br />
        <b>- Length limits</b>: usernames shouldn’t be 10,000 characters.
        <br />
        <b>- Allow-lists</b> for things like sort direction (<code>ASC</code>/<code>DESC</code>) instead of trusting raw
        input.
      </p>

      <h3 className="module-header">3) Use least privilege for the DB account</h3>
      <p className="module-body">
        Your app’s database credentials should have only the permissions needed. If the app only needs SELECT/INSERT on a
        few tables, don’t connect as an admin. Least privilege doesn’t prevent SQLi, but it can drastically reduce impact.
      </p>

      <h2 className="module-header">Common pitfalls (things teams get wrong)</h2>
      <p className="module-body">
        <b>- “We escaped quotes so we’re safe”</b>: escaping is hard to do correctly across encodings, drivers, and edge
        cases. Parameterization is the reliable fix.
        <br />
        <b>- “We validate input so we’re safe”</b>: validation can miss cases, and it’s easy to forget on one endpoint.
        Use parameters regardless.
        <br />
        <b>- “We used parameters for values, but not for identifiers”</b>: table/column names can’t be parameterized in
        most drivers; if you need dynamic columns (sorting), use allow-lists and map user choices to known-safe strings.
        <br />
        <b>- Logging sensitive SQL</b>: printing full queries with user data can leak secrets into logs.
        <br />
        <b>- Storing plaintext passwords</b>: SQLi often exposes passwords. Even without SQLi, passwords should be hashed
        (bcrypt/argon2).
      </p>

      <h2 className="module-header">Try it in the sandbox</h2>
      <p className="module-body">
        You can practice safely in an intentionally insecure, resettable in-memory SQLite database sandbox.
      </p>
      <p className="module-body">
        <Link to="/sandbox/sql-injection" style={{ color: "#203446", textDecoration: "none", fontWeight: 700 }}>
          → Open the SQL Injection Sandbox
        </Link>
      </p>

      <h2 className="module-header">Further reading (reputable references)</h2>
      <p className="module-body">
        These references go deeper than this module and are widely used as industry guidance for SQL injection prevention
        and secure database access.
      </p>
      <ul className="module-body" style={{ marginTop: 0 }}>
        <li>
          OWASP Top 10 (Injection category context):{" "}
          <a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noreferrer">
            owasp.org/www-project-top-ten
          </a>
        </li>
        <li>
          OWASP SQL Injection Prevention Cheat Sheet:{" "}
          <a href="https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html" target="_blank" rel="noreferrer">
            cheatsheetseries.owasp.org
          </a>
        </li>
        <li>
          OWASP Query Parameterization Cheat Sheet:{" "}
          <a href="https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html" target="_blank" rel="noreferrer">
            cheatsheetseries.owasp.org
          </a>
        </li>
        <li>
          CWE-89: Improper Neutralization of Special Elements used in an SQL Command (SQL Injection):{" "}
          <a href="https://cwe.mitre.org/data/definitions/89.html" target="_blank" rel="noreferrer">
            cwe.mitre.org
          </a>
        </li>
      </ul>

      {/* Add your module content here */}
    </div>
  );
};

// Module metadata - this is what gets picked up by the LearningModules component
SQLInjectionBasics.metadata = {
  title: 'SQL Injection Basics',
  description: 'Learn the fundamentals of SQL injection attacks and prevention techniques.',
  difficulty: 'Beginner',
  estimatedTime: '15 minutes',
  tags: ['SQL', 'Injection', 'Security', 'Database'],
  prerequisites: [],
  learningObjectives: [
    'Understand what SQL injection is',
    'Identify vulnerable code patterns',
    'Learn proper input sanitization techniques',
    'Implement parameterized queries'
  ]
};

export default SQLInjectionBasics;