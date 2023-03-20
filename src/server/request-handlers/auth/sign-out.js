const { AccessManager, ErrorManager } = require('../../services')

async function signOut(request, response) {
  try {
    await AccessManager.signOut(request)

    response.status(200).json({ message: 'User successfully signed out.' })
  } catch (error) {
    ErrorManager.handleError(error)

    const clientErrorMessage = ErrorManager.determineClientErrorMessage({
      error,
      defaultMessage: 'Something went wrong signing out User.'
    })

    response.status(500).json({ message: clientErrorMessage })
  }
}

module.exports = signOut
