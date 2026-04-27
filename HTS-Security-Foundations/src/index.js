const hashing = require("./hashing")
const sqlInjectionLab = require("./labs/sqlInjection")
const tokens = require("./tokens")

module.exports = {
    hash: hashing,
    tokens,
    labs: {
        sqlInjection: sqlInjectionLab,
    },
}