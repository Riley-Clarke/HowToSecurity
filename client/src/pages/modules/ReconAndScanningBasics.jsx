import React from "react";
import "./Modules.css";

const ReconAndScanningBasics = () => {
  return (
    <div className="module-container">
      <h1 className="module-header">Recon and Scanning Basics</h1>
      <p className="module-body">
        Before an attacker exploits something, they usually try to learn what is out there. This early stage is often called
        reconnaissance, or recon. In this module, you will learn what recon is, what a port scan is trying to find, and why
        defenders pay attention to scanning.
      </p>

      <h2 className="module-header">What is reconnaissance?</h2>
      <p className="module-body">
        Reconnaissance is the process of gathering information. In the real world, it is like walking around a building to
        see which doors exist and which ones are unlocked.
      </p>

      <p className="module-body">
        For computers, recon often tries to answer questions like:
        <ul>
          <li>What hosts exist on a network?</li>
          <li>Which ports are open?</li>
          <li>What services might be running?</li>
          <li>What software versions are exposed?</li>
        </ul>
      </p>

      <h2 className="module-header">What is a port scan?</h2>
      <p className="module-body">
        A port scan is a way to check which ports on a host respond. If a port responds in a certain way, it can suggest a
        service is listening there. Scans are a common first step because they are relatively fast and can reveal forgotten
        services.
      </p>

      <h2 className="module-header">Why scanning matters for security</h2>
      <p className="module-body">
        If a service is reachable, it can be attacked. Scanning helps attackers find targets, but it also helps defenders
        find problems. Many teams run scans on their own systems to catch mistakes like exposed admin panels, old services, or
        ports that should not be reachable.
      </p>

      <h2 className="module-header">A safe way to think about results</h2>
      <p className="module-body">
        Seeing an open port is not the same as seeing a confirmed vulnerability. It simply means there is something
        reachable. The next questions are:
      </p>
      <p className="module-body">
        <b>1) Is the service supposed to be reachable?</b>
        <br />
        If not, close the port or restrict access.
        <br />
        <br />
        <b>2) Is it configured safely?</b>
        <br />
        Remove default accounts, require strong authentication, and use encryption where appropriate.
        <br />
        <br />
        <b>3) Is it up to date?</b>
        <br />
        Patches matter, especially for internet facing services.
      </p>

      <h2 className="module-header">Detection (where IDS and IPS fit)</h2>
      <p className="module-body">
        Organizations often use monitoring tools to look for suspicious activity on networks and hosts. Some systems can
        detect recon activity like host scanning and port scanning. That can act as an early warning, especially on internal
        networks where scanning is less expected.
      </p>

      <h2 className="module-header">Beginner takeaways</h2>
      <p className="module-body">
        If you remember only a few things, remember these:
        <ul>
          <li>Recon is information gathering</li>
          <li>Port scanning is a common recon technique</li>
          <li>Open ports are not always bad, but they should be intentional</li>
          <li>Defenders also scan to find and fix exposure</li>
        </ul>
      </p>

      <h2 className="module-header">Further reading (reputable references)</h2>
      <p className="module-body">
        These sources include practical and widely used security guidance, and they mention reconnaissance activity such as
        host and port scans.
      </p>
      <ul className="module-body" style={{ marginTop: 0 }}>
        <li>
          NIST SP 800-94, Guide to Intrusion Detection and Prevention Systems (IDPS):{" "}
          <a href="https://csrc.nist.gov/publications/detail/sp/800-94/final" target="_blank" rel="noreferrer">
            csrc.nist.gov
          </a>
        </li>
        <li>
          NIST SP 800-41 Rev. 1, Guidelines on Firewalls and Firewall Policy (mentions controlling ports and deny by default):{" "}
          <a href="https://csrc.nist.gov/publications/detail/sp/800-41/rev-1/final" target="_blank" rel="noreferrer">
            csrc.nist.gov
          </a>
        </li>
      </ul>
    </div>
  );
};

ReconAndScanningBasics.metadata = {
  title: "Recon and Scanning Basics",
  description: "Learn what reconnaissance is, what port scanning looks for, and why defenders care about scanning.",
  difficulty: "Beginner",
  estimatedTime: "15 minutes",
  tags: ["Networking", "Reconnaissance", "Scanning", "Security"],
  prerequisites: [],
  learningObjectives: [
    "Define reconnaissance in a cybersecurity context",
    "Explain the goal of a port scan at a high level",
    "Describe how defenders use scanning to reduce exposure",
    "Understand where IDS and IPS can help detect scanning",
  ],
};

export default ReconAndScanningBasics;

