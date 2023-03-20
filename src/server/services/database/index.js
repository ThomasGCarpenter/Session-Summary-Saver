/*eslint no-control-regex: "off", no-useless-escape: "off" */
const mysql = require('mysql2/promise')
const mysqlEscape = require('mysql2').escape
const fs = require('fs')
const path = require('path')

const System = require('../../../system')
const {
  DATABASE_NAME,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD
} = require('../../enviornment-variables')

module.exports = (function initializeDatabaseService() {
  let pool = null

  /* Prepare SQL statements, prevent injections */
  function prepareId(id) {
    if (!id || id === null) {
      return null
    }

    if (System.Utilities.isPositiveInteger(Number(id))) {
      return mysqlEscape(id)
    }

    throw new Error(`${id} is not a valid Id`)
  }

  function prepareString(str) {
    if (str === null) {
      return null
    }

    return mysqlEscape(str)
  }

  function prepareNumber(num) {
    // Ensure it's a number, can have a decimal point and negative sign
    if (System.Utilities.isNumber(num)) {
      return mysqlEscape(num)
    }

    throw new Error(`${num} is not a valid Number`)
  }

  // Create connection for scripting/testing purposes
  async function createTemporaryConnection() {
    const connection = await mysql.createConnection({
      host: DATABASE_HOST,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
      port: DATABASE_PORT,
      multipleStatements: true
    })

    async function closeConnection() {
      await connection.destroy()
    }

    return {
      connection,
      closeConnection
    }
  }

  // Create Tables that do not exist
  async function initializeDatabase() {
    const initializeDatabaseSQL = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf8'
    )

    const initializationConnection = await mysql.createConnection({
      host: DATABASE_HOST,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
      port: DATABASE_PORT,
      multipleStatements: true
    })

    await initializationConnection.query(initializeDatabaseSQL)

    await initializationConnection.destroy()

    console.log('Initialized Database')
  }

  // Create connection pool
  async function createPool() {
    pool = await mysql.createPool({
      connectionLimit: 10,
      host: DATABASE_HOST,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
      port: DATABASE_PORT
    })

    console.log('Created Connection Pool')

    pool.on('error', function onConnectionPoolError(err) {
      Logger.error('Unexpected error on idle client', err.message)
      process.exit(-1)
    })

    return pool
  }

  // Close connection pool
  async function closePool() {
    await pool.end()
    pool = null
  }

  // Execute a query that returns a list of records
  async function getAll(query) {
    const [rows] = await pool.query(query)
    return rows
  }

  // Execute a query that returns exactly one record
  async function get(query) {
    const [rows] = await pool.query(query)
    return rows[0]
  }

  // Execute a query that mutates data
  async function run(query) {
    const [rows] = await pool.query(query)
    return rows
  }

  async function transaction() {
    const connection = await pool.getConnection()

    async function begin() {
      await connection.query('BEGIN;')
    }

    async function run(query) {
      const [result] = await connection.query(query)
      return result
    }

    async function commit() {
      await connection.query('COMMIT;')
      await connection.release()
    }

    async function rollBack() {
      await connection.query('ROLLBACK;')
      await connection.release()
    }

    return {
      begin,
      run,
      commit,
      rollBack
    }
  }

  const Database = {
    prepareId,
    prepareString,
    prepareNumber,
    createTemporaryConnection,
    initializeDatabase,
    createPool,
    closePool,
    getAll,
    get,
    run,
    transaction
  }

  return Database
})()
