'use strict'

var $ = require('jquery')

module.exports = {
  // Fetch todos from server
  fetch (callback) {
    $.ajax('/todos')
      .done(data => callback(null, data))
      .fail((xhr, status, error) => callback(error))
  },

  // Save list of todos on the server
  save (todos, callback) {
    todos.forEach(todo => {
      if (!todo.id) {
        // new Todo!
        $.ajax('/todos', {
          method: 'POST',
          data: {
            title: todo.title,
            completed: todo.completed
          }
        })
        .done(data => {
          todo.id = data.id
          callback(null)
        })
        .fail((xhr, status, error) => callback(error))
      } else if (todo.id && todo.modified) {
        // update
        $.ajax(`/todos/${todo.id}`, {
          method: 'PUT',
          data: {
            title: todo.title,
            completed: todo.completed
          }
        })
        .done(data => {
          todo.modified = false
          callback(null)
        })
        .fail((xhr, status, error) => callback(error))
      }
    })
  },

  // Remove a TODO from the database
  remove (todos, callback) {
    todos.forEach(todo =>
      $.ajax('/todos/' + todo.id, { method: 'DELETE' })
        .done(data => callback(null))
        .fail((xhr, status, error) => callback(error))
    )
  }
}
