'use strict'

const Sequelize = require('sequelize')
const db = require('./db')

const todoSchema = {
  title: Sequelize.TEXT,
  completed: Sequelize.BOOLEAN
}

const Todo = db.define('Todo', todoSchema)

module.exports = Todo
