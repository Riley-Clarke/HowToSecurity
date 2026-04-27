const crypto = require("crypto");

function toSafeString(value) {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
}

function base64UrlEncode(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(toSafeString(input), "utf8");
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecodeToBuffer(value) {
  const str = toSafeString(value).replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (str.length % 4)) % 4;
  const padded = str + "=".repeat(padLen);
  return Buffer.from(padded, "base64");
}

function safeJsonParse(str) {
  try {
    return { ok: true, value: JSON.parse(str) };
  } catch (err) {
    return { ok: false, error: err };
  }
}

function decodeJwtParts(token) {
  const raw = toSafeString(token).trim();
  const parts = raw.split(".");
  if (parts.length !== 3) {
    return {
      ok: false,
      errors: ["Token must have 3 parts (header.payload.signature)."],
      header: null,
      payload: null,
      signatureB64Url: null,
    };
  }

  const [headerB64Url, payloadB64Url, signatureB64Url] = parts;
  const errors = [];

  let header = null;
  let payload = null;

  try {
    const headerBuf = base64UrlDecodeToBuffer(headerB64Url);
    const headerParsed = safeJsonParse(headerBuf.toString("utf8"));
    if (!headerParsed.ok) errors.push("Header is not valid JSON.");
    else header = headerParsed.value;
  } catch (err) {
    errors.push("Header is not valid base64url.");
  }

  try {
    const payloadBuf = base64UrlDecodeToBuffer(payloadB64Url);
    const payloadParsed = safeJsonParse(payloadBuf.toString("utf8"));
    if (!payloadParsed.ok) errors.push("Payload is not valid JSON.");
    else payload = payloadParsed.value;
  } catch (err) {
    errors.push("Payload is not valid base64url.");
  }

  return {
    ok: errors.length === 0,
    errors,
    header,
    payload,
    signatureB64Url,
  };
}

function signHs256({ header, payload, secret }) {
  const h = header && typeof header === "object" ? header : { alg: "HS256", typ: "JWT" };
  const p = payload && typeof payload === "object" ? payload : {};

  const headerB64Url = base64UrlEncode(JSON.stringify(h));
  const payloadB64Url = base64UrlEncode(JSON.stringify(p));
  const signingInput = `${headerB64Url}.${payloadB64Url}`;

  const sig = crypto.createHmac("sha256", toSafeString(secret)).update(signingInput).digest();
  const signatureB64Url = base64UrlEncode(sig);
  return `${signingInput}.${signatureB64Url}`;
}

function verifyHs256({ token, secret }) {
  const decoded = decodeJwtParts(token);
  const errors = [...(decoded.errors || [])];

  if (!decoded.signatureB64Url) {
    errors.push("Signature is missing.");
    return {
      ok: false,
      validSignature: false,
      errors,
      header: decoded.header,
      payload: decoded.payload,
    };
  }

  const raw = toSafeString(token).trim();
  const [headerB64Url, payloadB64Url, signatureB64Url] = raw.split(".");
  const signingInput = `${headerB64Url}.${payloadB64Url}`;

  let expectedSigBuf;
  try {
    expectedSigBuf = crypto.createHmac("sha256", toSafeString(secret)).update(signingInput).digest();
  } catch (err) {
    errors.push("Failed to compute expected signature.");
    return {
      ok: false,
      validSignature: false,
      errors,
      header: decoded.header,
      payload: decoded.payload,
    };
  }

  let providedSigBuf;
  try {
    providedSigBuf = base64UrlDecodeToBuffer(signatureB64Url);
  } catch (err) {
    errors.push("Signature is not valid base64url.");
    return {
      ok: false,
      validSignature: false,
      errors,
      header: decoded.header,
      payload: decoded.payload,
    };
  }

  const sameLength = providedSigBuf.length === expectedSigBuf.length;
  const validSignature =
    sameLength && crypto.timingSafeEqual(providedSigBuf, expectedSigBuf) && errors.length === 0;

  if (!validSignature && errors.length === 0) {
    errors.push("Invalid signature.");
  }

  return {
    ok: errors.length === 0 && validSignature,
    validSignature,
    errors,
    header: decoded.header,
    payload: decoded.payload,
  };
}

function validateRegisteredClaims({ payload, nowEpochSec, expectedIss, expectedAud, clockSkewSec }) {
  const failures = [];
  const p = payload && typeof payload === "object" ? payload : {};
  const now = Number.isFinite(Number(nowEpochSec)) ? Number(nowEpochSec) : Math.floor(Date.now() / 1000);
  const skew = Number.isFinite(Number(clockSkewSec)) ? Math.max(0, Number(clockSkewSec)) : 0;

  if (p.exp !== undefined) {
    const exp = Number(p.exp);
    if (!Number.isFinite(exp)) failures.push({ code: "exp_invalid", message: "exp must be a number (epoch seconds)." });
    else if (now > exp + skew) failures.push({ code: "exp_expired", message: "Token is expired (exp)." });
  }

  if (expectedIss !== undefined && expectedIss !== null && toSafeString(expectedIss) !== "") {
    const iss = p.iss;
    if (iss !== expectedIss) failures.push({ code: "iss_mismatch", message: "Issuer (iss) does not match." });
  }

  if (expectedAud !== undefined && expectedAud !== null && toSafeString(expectedAud) !== "") {
    const aud = p.aud;
    const expected = expectedAud;
    const match =
      aud === expected ||
      (Array.isArray(aud) && aud.some((a) => a === expected));
    if (!match) failures.push({ code: "aud_mismatch", message: "Audience (aud) does not match." });
  }

  return { valid: failures.length === 0, failures };
}

module.exports = {
  base64UrlEncode,
  base64UrlDecodeToBuffer,
  decodeJwtParts,
  signHs256,
  verifyHs256,
  validateRegisteredClaims,
};

