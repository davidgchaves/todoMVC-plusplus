'use strict'

const l = (method, str) => {
  if (!console || !console[method]) return
  console[method](`[todomvc++] ${str}`)
}

const log = (str) => l('log', str)
log.error = (str) => l('error', str)

module.exports = log
