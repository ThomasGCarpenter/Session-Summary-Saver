const System = require('../../../system')
const { AccessManager, ErrorManager } = require('../../services')

async function signUp(request, response) {
  try {
    const {
      userName,
      password
    } = request.body

    await AccessManager.signUp({
      userName,
      password
    }, request)

    response.status(200).json({ message: 'User successfully signed up.' })
  } catch (error) {
    ErrorManager.handleError(error)

    const clientErrorMessage = ErrorManager.determineClientErrorMessage({
      error,
      defaultMessage: 'Something went wrong Signing Up.'
    })

    response.status(500).json({ message: clientErrorMessage })
  }
}

module.exports = signUp
