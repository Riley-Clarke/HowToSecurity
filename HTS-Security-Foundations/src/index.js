const hashing = require("./hashing")
const sqlInjectionLab = require("./labs/sqlInjection")

module.exports = {
    hash: hashing,
    labs: {
        sqlInjection: sqlInjectionLab,
    },
}