'use strict'

const Vue = require('vue')
const todoStorage = require('../util/store')
let socket = io()

let filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.completed),
  completed: todos => todos.filter(todo => todo.completed)
}

let app = {
  // the root element that will be compiled
  el: '.todoapp',

  // app initial state
  data: {
    todos: [],
    newTodo: '',
    editedTodo: null,
    visibility: 'all'
  },

  // Initialize TODOs from database
  created () {
    this.socket = io()
    let self = this
    this.socket.on(
      'todoAdded',
      todo => {
        let found = false
        for (let t of self.todos) {
          if (t.id === todo.id) {
            found = true
            break
          }
        }
        if (!found) self.todos.push(todo)
      }
    )
    todoStorage.fetch((err, todos) => {
      if (err) {
        console.log(err)
        return
      }
      this.todos = todos
    })
  },

  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    filteredTodos: function () {
      return filters[this.visibility](this.todos)
    },
    remaining: function () {
      return filters.active(this.todos).length
    },
    allDone: {
      get: function () {
        return this.remaining === 0
      },
      set: function (value) {
        this.todos.forEach(todo => { todo.completed = value })
      }
    }
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    addTodo: function () {
      const value = this.newTodo && this.newTodo.trim()
      if (!value) { return }
      this.todos.push({ title: value, completed: false })
      todoStorage.save(
        this.todos,
        err => { if (err) console.log(err) }
      )
      this.newTodo = ''
    },

    removeTodo: function (todo) {
      this.todos.$remove(todo)
      todoStorage.remove(
        [todo],
        err => { if (err) console.log(err) }
      )
    },

    editTodo: function (todo) {
      this.beforeEditCache = todo.title
      this.editedTodo = todo
    },

    doneEdit: function (todo) {
      if (!this.editedTodo) { return }
      this.editedTodo = null
      todo.title = todo.title.trim()
      todo.modified = true
      if (!todo.title) {
        this.removeTodo(todo)
      } else {
        todoStorage.save(
          this.todos,
          err => { if (err) console.log(err) }
        )
      }
    },

    complete: function (todo) {
      todo.modified = true
      todoStorage.save(
        this.todos,
        err => { if (err) console.log(err) }
      )
    },

    cancelEdit: function (todo) {
      this.editedTodo = null
      todo.title = this.beforeEditCache
    },

    removeCompleted: function () {
      // remove them in the database async
      todoStorage.remove(
        filters.completed(this.todos),
        err => { if (err) console.log(err) }
      )
      this.todos = filters.active(this.todos)
    }
  },

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // http://vuejs.org/guide/custom-directive.html
  directives: {
    'todo-focus': function (value) {
      if (!value) { return }
      const el = this.el
      Vue.nextTick(() => el.focus())
    }
  }
}

module.exports = app
