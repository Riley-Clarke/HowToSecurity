import React from 'react';
import './Modules.css';

const XSSAdvanced = () => {
  return (
    <div className="module-container">
      <h1 className="module-header">Advanced XSS Techniques</h1>
      <p className="module-body">
        Cross-Site Scripting (XSS) is a class of web vulnerabilities where an attacker gets their own script to run in
        another user&apos;s browser in the context of your site. This module goes beyond a quick definition: it covers the
        main XSS flavors teams encounter, how they differ, why they matter, and what defenses actually work in practice.
      </p>

      <h1 className="module-header">What XSS is trying to achieve</h1>
      <p className="module-body">
        Browsers trust HTML and JavaScript that your page loads. If untrusted data is treated as markup or code, an
        attacker can change what the page does for the victim: steal session cookies (when possible), redirect users,
        alter what they see on screen, or perform actions as that user if the site does not stop it. XSS is dangerous
        because it runs with the victim&apos;s session on your origin—the same cookies and logged-in state the real user has.
      </p>

      <h1 className="module-header">The three common XSS categories</h1>
      <p className="module-body">
        Security teams often group XSS by where the malicious input is introduced and where it becomes executable. The
        names vary slightly between sources, but these three cover most real-world cases:
      </p>
      <p className="module-body">
        <ul>
          <li>
            <b>Reflected XSS</b> — Untrusted input is echoed back in an HTTP response soon after it is submitted (for
            example in a search box or error message). The victim usually has to click a crafted link or submit a form;
            the payload &quot;bounces&quot; off the server into the page.
          </li>
          <li>
            <b>Stored XSS</b> — The payload is saved on the server (comments, profiles, tickets, chat messages) and later
            delivered to other users when they load a normal page. One submission can affect many victims over time.
          </li>
          <li>
            <b>DOM-based XSS</b> — The vulnerability lives primarily in client-side JavaScript: the server may return a
            static-looking page, but script on the page reads attacker-controlled data (URL fragment, query string,
            postMessage, storage) and writes it into the DOM without proper escaping. The server never had to reflect the full
            payload in HTML for exploitation to occur.
          </li>
        </ul>
      </p>

      <h1 className="module-header">DOM-based XSS in more detail</h1>
      <p className="module-body">
        DOM-based XSS is easy to miss in code review because the &quot;sink&quot; (where data becomes dangerous) is often a
        front-end API like <code>element.innerHTML</code>, <code>document.write</code>, or routing that injects HTML from
        the URL. The &quot;source&quot; might be <code>location.hash</code>, <code>location.search</code>, or data from
        another browser API. Defense requires treating those sources as untrusted whenever they can be influenced by an
        attacker and ensuring you never assign them to sinks that interpret HTML or JavaScript unless you strictly control
        and encode the content.
      </p>

      <h1 className="module-header">Payloads and filters (what developers hear about)</h1>
      <p className="module-body">
        Attackers adapt payloads to bypass weak filters: script tags, event handlers, SVG/math contexts, encoding tricks,
        and frameworks&apos; quirks. Relying on a blacklist of &quot;bad strings&quot; is brittle; context matters (HTML
        body vs attribute vs JavaScript vs CSS). The durable approach is to assume any user-influenced string can be
        hostile and to use framework-safe APIs and encoding rules designed for each context—not to play whack-a-mole with
        forbidden keywords.
      </p>

      <h1 className="module-header">Defense in depth</h1>
      <p className="module-body">
        No single checkbox fixes XSS everywhere. Effective programs combine several layers:
      </p>
      <p className="module-body">
        <ul>
          <li>
            <b>Output encoding / escaping</b> — When you insert untrusted data into HTML, attributes, URLs, or script
            contexts, encode it appropriately for that context so the browser treats it as text, not markup or code.
          </li>
          <li>
            <b>Prefer safe APIs</b> — Set text with properties like <code>textContent</code> instead of{" "}
            <code>innerHTML</code> when you only need plain text; use your framework&apos;s documented escaping paths.
          </li>
          <li>
            <b>Content Security Policy (CSP)</b> — HTTP headers (or meta tags where appropriate) can restrict where
            script may load from and whether inline script runs. CSP is not a substitute for encoding, but it sharply
            reduces what an injected snippet can do.
          </li>
          <li>
            <b>HttpOnly cookies</b> — Mark session cookies HttpOnly so JavaScript cannot read them directly, which limits
            some cookie-theft XSS scenarios (while other tokens in localStorage remain exposed if you put them there).
          </li>
          <li>
            <b>Input validation</b> — Helpful for business rules and reducing surprises, but validation alone does not
            replace correct output handling; attackers find edge cases.
          </li>
        </ul>
      </p>

      <h1 className="module-header">Why XSS still appears in serious applications</h1>
      <p className="module-body">
        Modern frameworks help, but XSS persists because apps combine many sources of untrusted data (URLs, JSON from APIs,
        third-party widgets, rich text editors, PDF/HTML previews) and many sinks. A single missed escape in a popular code
        path or a legacy endpoint can be enough. Regular security testing, dependency updates, and explicit CSP rollout
        reduce risk over time.
      </p>

      <h2 className="module-header">Further reading (reputable references)</h2>
      <p className="module-body">
        These references are widely used for XSS prevention guidance and deeper technical detail:
      </p>
      <ul className="module-body" style={{ marginTop: 0 }}>
        <li>
          OWASP Cross Site Scripting (XSS) Prevention Cheat Sheet:{" "}
          <a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" target="_blank" rel="noreferrer">
            cheatsheetseries.owasp.org
          </a>
        </li>
        <li>
          OWASP DOM based XSS Prevention Cheat Sheet:{" "}
          <a href="https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html" target="_blank" rel="noreferrer">
            cheatsheetseries.owasp.org
          </a>
        </li>
        <li>
          OWASP Top 10 2021 — A03:2021 Injection (includes XSS discussion in context):{" "}
          <a href="https://owasp.org/Top10/2021/A03_2021-Injection/" target="_blank" rel="noreferrer">
            owasp.org
          </a>
        </li>
        <li>
          CWE-79: Improper Neutralization of Input During Web Page Generation (&apos;Cross-site Scripting&apos;):{" "}
          <a href="https://cwe.mitre.org/data/definitions/79.html" target="_blank" rel="noreferrer">
            cwe.mitre.org
          </a>
        </li>
        <li>
          MDN — Content Security Policy (CSP):{" "}
          <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP" target="_blank" rel="noreferrer">
            developer.mozilla.org
          </a>
        </li>
      </ul>
    </div>
  );
};

XSSAdvanced.metadata = {
  title: 'Advanced XSS Techniques',
  description: 'Understand reflected, stored, and DOM-based XSS, practical defenses, and where to learn more.',
  difficulty: 'Advanced',
  estimatedTime: '45 minutes',
  tags: ['XSS', 'JavaScript', 'DOM', 'Security', 'Web'],
  prerequisites: ['JavaScript Fundamentals'],
  learningObjectives: [
    'Describe reflected, stored, and DOM-based XSS at a high level',
    'Explain why blacklists alone are insufficient and context matters',
    'List core defenses: encoding, safe APIs, CSP, and HttpOnly cookies',
    'Know where to find authoritative XSS prevention guidance',
  ]
};

export default XSSAdvanced;
