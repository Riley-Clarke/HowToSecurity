import React from "react";
import "./Modules.css";

const IncidentResponseBasics = () => {
  return (
    <div className="module-container">
      <h1 className="module-header">Incident Response Basics</h1>
      <p className="module-body">
        Even with good security, things can still go wrong. A user might get phished, a server might be misconfigured, or a
        vulnerability might be exploited. Incident response is the process of handling those situations in a structured way.
      </p>

      <h2 className="module-header">What is an "incident"?</h2>
      <p className="module-body">
        An incident is a security event that breaks your security rules or puts your systems or data at risk. A common
        example is an account takeover. Another example is malware on a computer that spreads to other machines.
      </p>

      <h2 className="module-header">Why incident response matters</h2>
      <p className="module-body">
        When a real incident happens, time and clarity matter. A plan helps you avoid panic decisions, reduce damage, and
        learn what to improve next time.
      </p>

      <h2 className="module-header">The basic incident response lifecycle</h2>
      <p className="module-body">
        Many teams think about incident response in phases:
        <ul>
          <li>
            Preparation: decide who does what, keep contact info, set up logging, and have tools ready
          </li>
          <li>
            Detection and analysis: notice something is wrong, confirm it, and understand what is happening
          </li>
          <li>
            Containment, eradication, and recovery: stop the damage, remove the cause, and restore normal operations
          </li>
          <li>
            Post incident activity: write down what happened and fix the root problems
          </li>
        </ul>
      </p>

      <h2 className="module-header">A beginner example</h2>
      <p className="module-body">
        Imagine you notice a lot of failed login attempts, then a successful login from a country your user has never been
        in.
      </p>
      <p className="module-body">
        <b>Preparation</b>: You already have logs, alerts, and a way to contact the user.
        <br />
        <b>Detection and analysis</b>: You confirm the login is real and not a false alarm.
        <br />
        <b>Containment</b>: You reset the password, revoke sessions, and turn on MFA.
        <br />
        <b>Recovery</b>: You make sure the user can safely regain access.
        <br />
        <b>Post incident</b>: You learn why it happened and improve login protection.
      </p>

      <h2 className="module-header">Common mistakes</h2>
      <p className="module-body">
        <b>- No clear ownership</b>
        <br />
        If nobody knows who is responsible, response will be slow.
        <br />
        <br />
        <b>- Not collecting the right data</b>
        <br />
        If you do not have logs, it is very hard to know what happened.
        <br />
        <br />
        <b>- Fixing only the symptom</b>
        <br />
        If you only clean up the obvious problem and do not address the root cause, it will happen again.
      </p>

      <h2 className="module-header">What you can do today</h2>
      <p className="module-body">
        If you are a beginner, you do not need a full enterprise program. You can still do a few helpful things:
        <ul>
          <li>Turn on logs for important actions (logins, password changes, admin actions)</li>
          <li>Make sure you know where logs go and how long you keep them</li>
          <li>Write down who to contact if something looks wrong</li>
          <li>Practice one simple scenario, like an account takeover</li>
        </ul>
      </p>

      <h2 className="module-header">Further reading (reputable references)</h2>
      <p className="module-body">
        This is one of the most commonly cited sources for incident response processes and guidance.
      </p>
      <ul className="module-body" style={{ marginTop: 0 }}>
        <li>
          NIST SP 800-61 Rev. 2, Computer Security Incident Handling Guide:{" "}
          <a href="https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final" target="_blank" rel="noreferrer">
            csrc.nist.gov
          </a>
        </li>
      </ul>
    </div>
  );
};

IncidentResponseBasics.metadata = {
  title: "Incident Response Basics",
  description: "Learn what incident response is and the basic phases teams use to detect, contain, and recover from incidents.",
  difficulty: "Beginner",
  estimatedTime: "20 minutes",
  tags: ["Incident Response", "Security", "Monitoring", "Logging"],
  prerequisites: [],
  learningObjectives: [
    "Define what a security incident is at a high level",
    "Explain the main phases of incident response",
    "Recognize common incident response mistakes",
    "List simple steps to prepare as a beginner",
  ],
};

export default IncidentResponseBasics;

