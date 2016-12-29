'use strict'

let io

// Initialize with provided socket.io instance
exports.init = _io => { io = _io }
exports.todoAdded = todo => io.emit('todoAdded', todo)
