const { AccessManager, ErrorManager } = require('../../services')

async function getUser(request, response) {
  try {
    const resolvedUser = await AccessManager.getUser(request)

    if (resolvedUser) {
      const userResponse = {
        userId: resolvedUser.userId,
        userName: resolvedUser.userName,
      }

      response.status(200).json(userResponse)
    } else {
      response.status(200).json(null)
    }
  } catch (error) {
    ErrorManager.handleError(error)

    const clientErrorMessage = ErrorManager.determineClientErrorMessage({
      error,
      defaultMessage: 'Something went wrong getting Authenticated User.'
    })

    response.status(500).json({ message: clientErrorMessage })
  }
}

module.exports = getUser
