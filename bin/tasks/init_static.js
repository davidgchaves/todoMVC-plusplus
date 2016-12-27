'use strict'

const path = require('path')
const fs = require('fs-extra')

module.exports = function (grunt) {
  let log = str => { grunt.log.write(`[init_static]: ${str}`) }

  grunt.registerTask(
    'init_static',
    'Initialize static asset directory with unprocessed assets',
    function (environment) {
      const publicPath = path.resolve(__dirname, '..', '..', 'public')
      const staticPath = path.resolve(__dirname, '..', '..', 'src', 'browser', 'static')
      fs.removeSync(publicPath)
      fs.mkdirSync(publicPath)
      fs.copySync(staticPath, publicPath)
      log(`Static asset directory initialized at ${publicPath}`)
    })
}
