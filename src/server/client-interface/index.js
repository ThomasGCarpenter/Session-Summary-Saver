/* eslint no-unused-vars: "off" */

// Configure Server
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const { AccessManager, ErrorManager } = require('../services')

const app = express()

app.disable('x-powered-by')

// Handle JSON content in request bodies
const jsonParser = bodyParser.json({ type: 'application/json' })
app.use(jsonParser)

// Identity and Access Management Initialization.
AccessManager.initialize(app)

// API Initialization. Bind Request Handlers to HTTP Requests.
require('./api')(app)

// Serve Web App from API Server, will be removed when
// we split App server to only be API, and have web app served from
// a CDN
// Serve static content
app.use(express.static(path.join(__dirname, '../../../public')))

app.get('/*', function getWebApp(req, res) {
  res.sendFile(path.join(__dirname, '../../../public/index.html'))
})

// Catch All Error Handling
app.use(function lastErrorHandler(error, req, res, next) {
  ErrorManager.handleError(error)
  res.status(500).send({ message: 'Something is wrong with the server.' })
})

module.exports = app
