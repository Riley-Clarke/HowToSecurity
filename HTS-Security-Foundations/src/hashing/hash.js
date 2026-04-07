const crypto = require("crypto")
const password = require("./password")

function sha256(input) {
    return crypto.createHash("sha256").update(input).digest("hex")
}

function sha512(input) {
    return crypto.createHash("sha512").update(input).digest("hex")
}

function md5(input) {
    return crypto.createHash("md5").update(input).digest("hex")
}

module.exports = {
    sha256,
    sha512,
    md5,
    password,
}