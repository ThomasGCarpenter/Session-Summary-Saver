class AuthenticationError extends Error {
  constructor(message) {
    super(message)

    Error.captureStackTrace(this, AuthenticationError)

    this.type = 'AuthenticationError'
    this.message = message
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message)

    Error.captureStackTrace(this, ValidationError)

    this.type = 'ValidationError'
    this.message = message
  }
}

class DatabaseError extends Error {
  constructor(message) {
    super(message)

    Error.captureStackTrace(this, DatabaseError)

    this.type = 'DatabaseError'
    this.message = message
  }
}

function throwIfInvalid({ test, message }) {
  if (test === false) {
    throw new ValidationError(message)
  }
}

function handleError(error) {
  console.log(error)
}

function determineClientErrorMessage({ error, defaultMessage }) {
  if (
    error.type === 'AuthenticationError' ||
    error.type === 'ValidationError' ||
    error.type === 'DatabaseError'
  ) {
    return error.message
  }

  return defaultMessage
}

const ErrorManager = {
  AuthenticationError,
  ValidationError,
  DatabaseError,

  throwIfInvalid,
  handleError,
  determineClientErrorMessage
}

module.exports = ErrorManager
