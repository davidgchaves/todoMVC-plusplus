'use strict'

const Router = require('director').Router

module.exports = app => {
  const router = new Router()
  const states = ['all', 'active', 'completed']

  states.forEach(visibility =>
    router.on(visibility, () => { app.visibility = visibility })
  )

  router.configure({
    notfound: () => {
      window.location.hash = ''
      app.visibility = 'all'
    }
  })

  router.init()
}
