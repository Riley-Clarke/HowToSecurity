const bcrypt = require("bcrypt")
const crypto = require("crypto")

const DEFAULT_COST = 12
const MIN_COST = 10
const MAX_COST = 14

function clampCost(cost) {
    if (typeof cost !== "number" || !Number.isFinite(cost)) return DEFAULT_COST
    return Math.max(MIN_COST, Math.min(MAX_COST, Math.round(cost)))
}

function parseCostFromHash(bcryptHash) {
    // bcrypt hashes are like: $2b$12$<22charSalt><31charHash>
    if (typeof bcryptHash !== "string") return null
    const parts = bcryptHash.split("$")
    if (parts.length < 4) return null
    const costStr = parts[2]
    const cost = Number.parseInt(costStr, 10)
    return Number.isFinite(cost) ? cost : null
}

async function hashPassword(plainTextPassword, cost) {
    if (typeof plainTextPassword !== "string") {
        throw new TypeError("plainTextPassword must be a string")
    }
    const effectiveCost = clampCost(cost)
    return await bcrypt.hash(plainTextPassword, effectiveCost)
}

async function verifyPassword(plainTextPassword, bcryptHash) {
    if (typeof plainTextPassword !== "string") {
        throw new TypeError("plainTextPassword must be a string")
    }
    if (typeof bcryptHash !== "string") {
        throw new TypeError("bcryptHash must be a string")
    }
    return await bcrypt.compare(plainTextPassword, bcryptHash)
}

// Intentionally insecure: fast, deterministic, and uses a fixed pepper.
// This exists only for teaching why "rolling your own" password hashing is unsafe.
const FIXED_PEPPER = "HTS_DEMO_FIXED_PEPPER_DO_NOT_USE"

function insecureFastHash(input) {
    const asString = typeof input === "string" ? input : String(input)
    return crypto.createHash("md5").update(FIXED_PEPPER + asString, "utf8").digest("hex")
}

module.exports = {
    bcrypt: {
        DEFAULT_COST,
        MIN_COST,
        MAX_COST,
        clampCost,
        parseCostFromHash,
        hashPassword,
        verifyPassword,
    },
    insecure: {
        insecureFastHash,
    },
}

