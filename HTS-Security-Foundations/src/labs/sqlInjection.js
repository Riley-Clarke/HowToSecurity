const Database = require("better-sqlite3")

function createSqlInjectionLab(options = {}) {
  const maxRowsTotal = typeof options.maxRowsTotal === "number" ? options.maxRowsTotal : 300
  const maxResultRows = typeof options.maxResultRows === "number" ? options.maxResultRows : 200
  const maxSqlChars = typeof options.maxSqlChars === "number" ? options.maxSqlChars : 2000

  let db = null

  function openDb() {
    const instance = new Database(":memory:")
    instance.pragma("foreign_keys = ON")
    return instance
  }

  function seed(instance) {
    instance.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL
      );

      CREATE TABLE notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ownerUserId INTEGER NOT NULL,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        FOREIGN KEY(ownerUserId) REFERENCES users(id)
      );
    `)

    const insertUser = instance.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)")
    insertUser.run("alice", "alice123", "user")
    insertUser.run("bob", "bob123", "user")
    insertUser.run("admin", "admin123", "admin")

    const insertNote = instance.prepare("INSERT INTO notes (ownerUserId, title, body) VALUES (?, ?, ?)")
    insertNote.run(1, "Welcome", "This is Alice's first note.")
    insertNote.run(2, "Hello", "Bob wrote this note.")
    insertNote.run(1, "Todo", "Buy milk. Learn SQL injection prevention.")
  }

  function ensureDb() {
    if (!db) {
      db = openDb()
      seed(db)
    }
    return db
  }

  function reset() {
    if (db) db.close()
    db = openDb()
    seed(db)
  }

  function getSchema() {
    const instance = ensureDb()
    const rows = instance
      .prepare(
        `
      SELECT name, sql
      FROM sqlite_master
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name;
    `
      )
      .all()
    return rows
  }

  function getRowCountTotal() {
    const instance = ensureDb()
    const tables = instance
      .prepare(
        `
      SELECT name
      FROM sqlite_master
      WHERE type='table' AND name NOT LIKE 'sqlite_%';
    `
      )
      .all()
    let total = 0
    for (const t of tables) {
      const cnt = instance.prepare(`SELECT COUNT(*) AS c FROM "${t.name}"`).get()
      total += Number(cnt.c) || 0
    }
    return total
  }

  function enforceLimitsOrThrow() {
    const total = getRowCountTotal()
    if (total > maxRowsTotal) {
      throw new Error(`Row limit exceeded (${total} > ${maxRowsTotal}). Reset the sandbox to continue.`)
    }
  }

  function normalizeSql(sql) {
    if (typeof sql !== "string") throw new TypeError("sql must be a string")
    const trimmed = sql.trim()
    if (!trimmed) throw new Error("SQL is empty")
    if (trimmed.length > maxSqlChars) throw new Error(`SQL too long (max ${maxSqlChars} characters)`)

    // Keep this a single-statement sandbox. Multi-statement execution makes it too easy to go overboard.
    // (Users can still do anything they want, but one statement at a time.)
    const semiCount = (trimmed.match(/;/g) || []).length
    if (semiCount > 1) throw new Error("Only one SQL statement at a time")
    if (semiCount === 1 && !trimmed.endsWith(";")) throw new Error("Only one SQL statement at a time")

    // Disallow a couple of SQLite features that can have side effects outside the lab.
    if (/\bATTACH\b/i.test(trimmed)) throw new Error("ATTACH is disabled in this sandbox")
    if (/\bDETACH\b/i.test(trimmed)) throw new Error("DETACH is disabled in this sandbox")
    if (/\bVACUUM\b/i.test(trimmed)) throw new Error("VACUUM is disabled in this sandbox")
    if (/\bload_extension\b/i.test(trimmed)) throw new Error("Extension loading is disabled in this sandbox")

    return trimmed
  }

  function executeRaw(sql) {
    const instance = ensureDb()
    const normalized = normalizeSql(sql)

    const stmt = instance.prepare(normalized)
    let result = { columns: [], rows: [], changes: 0, lastInsertRowid: null }

    if (stmt.reader) {
      const rows = stmt.all()
      const limitedRows = rows.slice(0, maxResultRows)
      const columns = limitedRows.length > 0 ? Object.keys(limitedRows[0]) : []
      result = { columns, rows: limitedRows, changes: 0, lastInsertRowid: null, truncated: rows.length > maxResultRows }
    } else {
      const info = stmt.run()
      result = {
        columns: [],
        rows: [],
        changes: info.changes || 0,
        lastInsertRowid: info.lastInsertRowid ?? null,
      }
      enforceLimitsOrThrow()
    }

    return result
  }

  function vulnerableLogin(username, password) {
    const instance = ensureDb()
    const u = typeof username === "string" ? username : String(username ?? "")
    const p = typeof password === "string" ? password : String(password ?? "")

    // Intentionally vulnerable: user input is concatenated directly into SQL.
    const query = `SELECT id, username, role FROM users WHERE username = '${u}' AND password = '${p}'`
    const rows = instance.prepare(query).all()

    return {
      query,
      rows: rows.slice(0, maxResultRows),
      truncated: rows.length > maxResultRows,
      success: rows.length > 0,
    }
  }

  return {
    reset,
    getSchema,
    getRowCountTotal,
    executeRaw,
    vulnerableLogin,
    limits: { maxRowsTotal, maxResultRows, maxSqlChars },
  }
}

module.exports = { createSqlInjectionLab }

