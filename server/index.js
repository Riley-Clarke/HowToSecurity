const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const foundations = require("../HTS-Security-Foundations/src");

app.get("/api/health", (req, res) => {
  res.json({ status: "Server running" });
});

function toSafeString(value) {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
}

app.post("/api/labs/password-hashing", async (req, res) => {
  try {
    const notes = {};

    const rawInput = toSafeString(req.body?.input);
    const maxChars = 512;
    const input =
      rawInput.length > maxChars ? (notes.inputTruncated = true, rawInput.slice(0, maxChars)) : rawInput;

    const requestedCost = Number(req.body?.bcryptCost);
    const costBeforeClamp = Number.isFinite(requestedCost) ? requestedCost : undefined;
    const cost = foundations.hash.password.bcrypt.clampCost(costBeforeClamp);
    if (costBeforeClamp !== undefined && costBeforeClamp !== cost) notes.costClamped = true;

    const md5Hex = foundations.hash.md5(input);
    const diyHex = foundations.hash.password.insecure.insecureFastHash(input);

    const bcryptHashA = await foundations.hash.password.bcrypt.hashPassword(input, cost);
    const bcryptHashB = await foundations.hash.password.bcrypt.hashPassword(input, cost);
    const bcryptCostParsed = foundations.hash.password.bcrypt.parseCostFromHash(bcryptHashA);
    const bcryptVerifies = await foundations.hash.password.bcrypt.verifyPassword(input, bcryptHashA);

    res.json({
      inputLength: input.length,
      notes,
      bcrypt: {
        cost,
        costParsedFromHash: bcryptCostParsed,
        hashA: bcryptHashA,
        hashB: bcryptHashB,
        verifies: bcryptVerifies,
      },
      insecure: {
        md5Hex,
        diyHex,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err?.message || "Bad Request" });
  }
});

function decodeToBuffer(value, encoding) {
  const str = toSafeString(value);
  if (encoding === "hex") return Buffer.from(str, "hex");
  if (encoding === "base64") return Buffer.from(str, "base64");
  return Buffer.from(str, "utf8");
}

app.post("/api/labs/md5", (req, res) => {
  try {
    const encoding = req.body?.encoding === "base64" || req.body?.encoding === "hex" ? req.body.encoding : "utf8";
    const buffer = decodeToBuffer(req.body?.input, encoding);

    const maxBytes = 4096;
    if (buffer.length > maxBytes) {
      return res.status(400).json({ error: `Input too large (max ${maxBytes} bytes)` });
    }

    const md5Hex = foundations.hash.md5(buffer);
    res.json({ encoding, byteLength: buffer.length, md5Hex });
  } catch (err) {
    res.status(400).json({ error: err?.message || "Bad Request" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});