'use strict'

const Vue = require('vue')
const appView = require('./views/todos')
const router = require('./util/routes')

// Create main Vue app
const app = new Vue(appView)

// Configure router
router(app)
