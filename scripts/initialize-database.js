const Database = require('../src/server/services/database')

initializeDatabaseScript()

async function initializeDatabaseScript() {
  try {
    await Database.initializeDatabase()
    process.exit()
  } catch (error) {
    console.log(error)
    process.exit()
  }
}
