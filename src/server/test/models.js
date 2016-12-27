/* eslint-env node, mocha */
'use strict'

const assert = require('chai').assert
const db = require('../models/db')
const Todo = require('../models/todo')

const resetTestDB = done => {
  db
    .drop()
    .then(() => db.sync({ force: true }))
    .then(() => done())
    .catch((err) => console.log(err))
}

before(resetTestDB)

describe('The Todo Model', () => {
  it('accepts text for the TODO item', () => {
    const title = 'this is a super todo'
    const completed = false
    return Todo
      .create({ title, completed })
      .then(todo => {
        assert.equal(todo.title, title, 'Todo text does not match')
        assert.equal(todo.completed, completed, 'Completed todo status does not match')
      })
  })
})
