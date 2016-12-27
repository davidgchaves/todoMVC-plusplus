const noShenanigans = () =>
  (request, response, next) => {
    response.set('X-Shenanigans', 'None')
    next()
  }

module.exports = noShenanigans
