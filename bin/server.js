'use strict'

const http = require('http')
const config = require('../config')
const app = require('../src/server/webapp')
const sockets = require('../src/server/sockets')
const log = require('../src/shared/log')

const server = http.createServer(app)
const io = require('socket.io')(server)
sockets.init(io)

server.listen(
  config.port,
  () => { log(`Express server listening on port *:${config.port}`) }
)
