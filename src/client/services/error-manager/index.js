/* eslint-disable no-undef */

class ValidationError extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, ValidationError);

    this.type = 'ValidationError';
    this.message = message;
  }
}

function handleError(error) {
  console.log(error);
}

function determineErrorMessage({ error, defaultMessage }) {
  if (error.type === 'ValidationError') {
    return error.message;
  }

  // Error From Request Service
  let errorMessage;
  try {
    errorMessage = error.response.data.message;
  } catch (e) {
    errorMessage = defaultMessage;
  }

  return errorMessage;
}

const ErrorManager = {
  handleError,
  determineErrorMessage,
  ValidationError
};

export default ErrorManager;
