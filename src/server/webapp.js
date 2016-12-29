'use strict'

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./controllers/routes')
const morgan = require('morgan')
const noShenanigans = require('./middlewares/noShenanigans')
// Basic Rollbar Usage
// const rollbar = require('rollbar')

let app = express()

// Configure view engine and views directory
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('x-powered-by', false)

// Configure middleware
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: false }))

// Static file serving happens everywhere but in production
if (process.env.NODE_ENV !== 'production') {
  const staticPath = path.join(__dirname, '..', '..', 'public')
  app.use('/static', express.static(staticPath))
}

// Add the "No Shenanigans" header to all responses under the "/todos" path
app.use('/todos', noShenanigans())

// Mount application routes
routes(app)

// Rollbar Middleware
// app.use(rollbar.errorHandler('TYPE-YOUR-KEY-HERE'))

// Export Express webapp instance
module.exports = app
