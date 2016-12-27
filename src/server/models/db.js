'use strict'

const Sequelize = require('sequelize')
const config = require('../../../config')

// Create shared DB instance to be used across models
const db = new Sequelize(
  config.databaseUrl,
  config.databaseOptions
)

module.exports = db
