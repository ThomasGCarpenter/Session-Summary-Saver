// Start Server
const http = require('http')
const { PORT } = require('../server/enviornment-variables')
const clientInterface = require('./client-interface')
const { Database, ErrorManager } = require('./services')

async function startServer() {
  try {
    await Database.initializeDatabase()
    await Database.createPool()

    const server = http.createServer(clientInterface)

    server.listen(PORT, onServerListen)
    server.on('error', onServerError)
  } catch (error) {
    console.log(error)
  }
}

function onServerListen() {
  console.log('Server listening on port ' + PORT)
}

function onServerError(error) {
  console.log(error)
}

startServer()
