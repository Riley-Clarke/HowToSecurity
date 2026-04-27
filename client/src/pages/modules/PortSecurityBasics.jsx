import React from "react";
import "./Modules.css";

const PortSecurityBasics = () => {
  return (
    <div className="module-container">
      <h1 className="module-header">Port Security Basics</h1>
      <p className="module-body">
        When people say a computer has an "open port", they usually mean a program is listening for network traffic on a
        specific port number. This module explains what ports are, why open ports can be risky, and what simple habits help
        reduce your attack surface.
      </p>

      <h2 className="module-header">What is a port?</h2>
      <p className="module-body">
        A port is a number that helps a computer know which program should receive incoming network traffic. Your computer
        has one IP address, but it can run many services at once. Ports help separate them.
      </p>

      <p className="module-body">
        Examples you might have heard of:
        <ul>
          <li>Port 80 is commonly used for HTTP (web traffic)</li>
          <li>Port 443 is commonly used for HTTPS (encrypted web traffic)</li>
          <li>Port 22 is commonly used for SSH (remote login)</li>
        </ul>
      </p>

      <h2 className="module-header">TCP vs UDP (simple version)</h2>
      <p className="module-body">
        Many ports are used with either TCP or UDP. TCP is connection based and is focused on reliable delivery. UDP is
        message based and is often used when speed matters more than reliability. You do not need to memorize which services
        use which protocol yet, but it helps to know that a "port" often means TCP port or UDP port.
      </p>

      <h2 className="module-header">Why open ports matter</h2>
      <p className="module-body">
        If a service is listening on a port, it is reachable by anything that can route traffic to it. If that service has a
        bug, weak credentials, or insecure configuration, an attacker may be able to abuse it.
      </p>

      <p className="module-body">
        Open ports are not automatically bad. The problem is when a port is open for no reason, or open to the whole
        internet, or backed by a service you forgot about.
      </p>

      <h2 className="module-header">Common mistakes</h2>
      <p className="module-body">
        <b>- Leaving extra services running</b>
        <br />
        If your machine runs more services than it needs, you are increasing the number of places an attacker can poke at.
        <br />
        <br />
        <b>- "Allow all" firewall rules</b>
        <br />
        It is tempting to open a wide range of ports to "make it work". Later, those rules get forgotten.
        <br />
        <br />
        <b>- Default settings and default accounts</b>
        <br />
        Some services ship with default users, default passwords, or sample pages.
      </p>

      <h2 className="module-header">A simple security mindset</h2>
      <p className="module-body">
        A good baseline is: only allow the traffic you actually need. If a port does not need to be reachable, keep it
        closed. This idea is commonly described as "deny by default".
      </p>

      <p className="module-body">
        Another good baseline is: turn off features you do not use. If you are not using a service, disable it or remove it
        so it cannot be enabled by mistake later.
      </p>

      <h2 className="module-header">Beginner checklist</h2>
      <p className="module-body">
        You can use this list as a starting point:
        <ul>
          <li>Know what services your system is supposed to run</li>
          <li>Close ports for services you do not need</li>
          <li>Limit who can connect (internal network only, VPN only, specific IP ranges)</li>
          <li>Keep services patched and remove defaults</li>
          <li>Recheck after changes so you do not forget old rules</li>
        </ul>
      </p>

      <h2 className="module-header">Further reading (reputable references)</h2>
      <p className="module-body">
        These sources are widely used for accurate definitions and security guidance around ports, services, and firewall
        policy.
      </p>
      <ul className="module-body" style={{ marginTop: 0 }}>
        <li>
          NIST SP 800-41 Rev. 1, Guidelines on Firewalls and Firewall Policy:{" "}
          <a href="https://csrc.nist.gov/publications/detail/sp/800-41/rev-1/final" target="_blank" rel="noreferrer">
            csrc.nist.gov
          </a>
        </li>
        <li>
          NIST SP 800-53 Rev. 5, CM-7 Least Functionality (mentions disabling unnecessary ports, protocols, and services):{" "}
          <a href="https://csrc.nist.gov/projects/risk-management/sp800-53-controls/release-search#!/control?version=5.1&number=CM-7" target="_blank" rel="noreferrer">
            csrc.nist.gov
          </a>
        </li>
        <li>
          IANA Service Name and Transport Protocol Port Number Registry (port ranges and assignments):{" "}
          <a href="https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml" target="_blank" rel="noreferrer">
            iana.org
          </a>
        </li>
        <li>
          OWASP Top 10 2021, A05 Security Misconfiguration (mentions unnecessary ports and services):{" "}
          <a href="https://owasp.org/Top10/2021/A05_2021-Security_Misconfiguration/" target="_blank" rel="noreferrer">
            owasp.org
          </a>
        </li>
      </ul>
    </div>
  );
};

PortSecurityBasics.metadata = {
  title: "Port Security Basics",
  description: "Learn what ports are, why open ports matter, and simple ways to reduce your attack surface.",
  difficulty: "Beginner",
  estimatedTime: "15 minutes",
  tags: ["Networking", "Ports", "Firewalls", "Security"],
  prerequisites: [],
  learningObjectives: [
    "Explain what a port is in simple terms",
    "Describe why open ports can increase risk",
    "Recognize common port and firewall mistakes",
    "Apply deny by default thinking at a high level",
  ],
};

export default PortSecurityBasics;

