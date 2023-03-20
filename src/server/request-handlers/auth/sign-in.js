const System = require('../../../system')
const { AccessManager, ErrorManager } = require('../../services')

async function signIn(request, response) {
  try {
    const { userName, password } = request.body
    ErrorManager.throwIfInvalid({
      test: System.Utilities.isValidUserName(userName),
      message: 'Sorry. UserName or Password is incorrect.'
    })
    ErrorManager.throwIfInvalid({
      test: System.Utilities.isNonEmptyString(password),
      message: 'Sorry. UserName or Password is incorrect.'
    })

    await AccessManager.signIn({ userName, password }, request)

    response.status(200).json({ message: 'User successfully signed in.' })
  } catch (error) {
    ErrorManager.handleError(error)

    const clientErrorMessage = ErrorManager.determineClientErrorMessage({
      error,
      defaultMessage: 'Something went wrong Signing In.'
    })

    response.status(500).json({ message: clientErrorMessage })
  }
}

module.exports = signIn
