const RequestHandlers = require('../request-handlers')

module.exports = function initializeAPI(app) {
  // Auth
  app.post('/auth/signUp', RequestHandlers.Auth.signUp)
  app.post('/auth/signIn', RequestHandlers.Auth.signIn)
  app.post('/auth/signOut', RequestHandlers.Auth.signOut)

  app.post('/auth/user', RequestHandlers.Auth.getUser)

  app.post('*', function unknownRoute(request, response) {
    response.status(500).send({ message: 'Invalid Request' })
  })
}
