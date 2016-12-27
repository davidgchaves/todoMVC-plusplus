const sockets = require('../sockets')
const Todo = require('../models/todo')

// Render home page
exports.index = (req, res) =>
  res.render('index', { env: process.env.NODE_ENV })

// Fetch all TODOs
exports.all = (req, res) =>
  Todo
    .findAll({ limit: 1000, order: [ ['createdAt', 'ASC'] ] })
    .then(todos => res.send(todos))
    .catch(error => res.status(500).send(error))

// Update a TODO
exports.update = (req, res) =>
  Todo
    .findById(req.param('id'))
    .then(todo => {
      if (!todo) return res.status(404)
      todo.completed = req.body.completed === 'true'
      todo.title = req.body.title
      return todo.save()
    })
    .then(todo => res.send(todo))
    .catch(error => res.status(500).send(error))

// Create a TODO
exports.create = (req, res) =>
  Todo
    .create({
      completed: req.body.completed === 'true',
      title: req.body.title
    })
    .then(todo => {
      res.send(todo)
      sockets.todoAdded(todo)
    })
    .catch(error => res.status(500).send(error))

exports.remove = (req, res) =>
  Todo
    .destroy({ where: { id: req.param('id') } })
    .then(() => res.send())
    .catch(error => res.status(500).send(error))
