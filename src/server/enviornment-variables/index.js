const { NODE_ENV } = process.env

if (NODE_ENV === 'DEVELOPMENT') {
  module.exports = require('./development')
} else if (NODE_ENV === 'TEST') {
  module.exports = require('./test')
} else if (NODE_ENV === 'PRODUCTION') {
  module.exports = require('./production')
} else {
  throw new Error('Invalid Node Environment Variables')
}
