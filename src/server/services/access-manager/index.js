const { promisify } = require('util')
const crypto = require('crypto')
const bcrypt = require('bcrypt-nodejs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const {
  CLIENT_HOST_PORT,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  SESSION_KEY,
  SESSION_SECRET
} = require('../../enviornment-variables')
const Database = require('../database')
const ErrorManager = require('../error-manager')

function initializeAccessManager(app) {
  // Allow requests from all clients (Cross Origin Resource Sharing)
  app.use(function enableCORS(req, res, next) {
    const hostName = `http://localhost:${CLIENT_HOST_PORT}`
    //const hostName = `http://192.168.1.154:${CLIENT_HOST_PORT}`
    //const hostName = `http://localhost:${CLIENT_HOST_PORT}`
    res.header('Access-Control-Allow-Origin', hostName)
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
  })

  passportInitialization()
  sessionInitialization(app)
}

function passportInitialization() {
  // Passport serialization functions encode and decode session
  // information between client requests.

  // Provides some identifying token that can be saved in the users session.
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // Given only a user's ID, we must return the user object as `req.user`.
  passport.deserializeUser(async (id, done) => {
    const preparedUserId = Database.prepareId(id)
    const query = `
      SELECT
        users.id AS userId,
        username
      FROM users
      WHERE users.id = ${preparedUserId};
    `
    try {
      const user = await Database.get(query)
      done(null, user)
    } catch (err) {
      done(err)
    }
  })

  function comparePassword({ candidatePassword, storedPassword }) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(candidatePassword, storedPassword, (err, isMatch) => {
        if (err) {
          reject(err)
        }

        resolve(isMatch)
      })
    })
  }

  // Instructs Passport how to authenticate a user using a locally saved username
  // and password combination.
  passport.use(
    new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
      const preparedUserName = Database.prepareString(username)
      const existingUserQuery = `
        SELECT
          id,
          username,
          password
        FROM users 
        WHERE username = ${preparedUserName};
      `

      let user
      return Database.get(existingUserQuery)
        .then((foundUser) => {
          if (foundUser) {
            user = foundUser

            return comparePassword({
              candidatePassword: password,
              storedPassword: user.password
            })
          }
          return null
        })
        .then((isMatch) => {
          if (isMatch) {
            return done(null, user)
          }

          return done(null, false, 'Sorry. Email or Password is incorrect.')
        })
        .catch((error) => {
          ErrorManager.handleError(error)
          done(error)
        })
    })
  )
}

function sessionInitialization(app) {
  // Authenticated user sessions.
  const sessionStore = new MySQLStore({
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME
  })

  app.use(
    session({
      key: SESSION_KEY,
      secret: SESSION_SECRET,
      store: sessionStore,
      resave: false,
      saveUninitialized: false
    })
  )

  app.use(passport.initialize())
  app.use(passport.session())
}

async function signUp({ userName, password }, request) {
  try {
    const preparedUserName = Database.prepareString(userName)

    // Check the User Name doesn't already exist
    const userNameRecord = await Database.get(`
      SELECT username
      FROM users
      WHERE username = ${preparedUserName};
    `)
    if (userNameRecord) {
      throw new ErrorManager.ValidationError(
        'User Name already exists. Please select another.'
      )
    }

    const encryptedPassword = await encryptPassword(password)
    const preparedEncryptedPassword = Database.prepareString(encryptedPassword)

    // Create User Record
    const result = await Database.run(`
      INSERT INTO users (
        username,
        password
      ) VALUES (
        ${preparedUserName},
        ${preparedEncryptedPassword}
      );
    `)
    const userId = result.insertId

    const user = {
      id: userId,
      userName
    }
    // Create Authenticated Session for new user
    const loginPromise = promisify(request.login.bind(request))
    await loginPromise(user)
  } catch (err) {
    console.log(err)
    throw err
  }
}

function signIn({ username, password }, request) {
  return new Promise(function signInPromise(resolve, reject) {
    passport.authenticate(
      'local',
      function afterPassportAuthenticate(error, user) {
        if (error) {
          reject(error)
        }
        if (!user) {
          reject(
            new ErrorManager.AuthenticationError(
              'Sorry. UserName or Password is incorrect.'
            )
          )
        }

        request.login(user, function afterPassportLogin() {
          resolve(user)
        })
      }
    )({ body: { username, password } })
  })
}

async function signOut(request) {
  await Database.run(`
    DELETE FROM sessions
    WHERE session_id = ${Database.prepareString(request.sessionID)};
  `)
}

async function getUser(request) {
  if (request.user) {
    return request.user
  }
  return null
}

async function authenticate(req, res, next) {
  const { user } = req

  if (Boolean(user) === false) {
    return res.status(401).send({
      errorMessage: 'You must be logged in.'
    })
  }

  next()
}

function throwIfNotAuthenticated({ user, message }) {
  if (Boolean(user) === false) {
    throw new ErrorManager.AuthenticationError(message)
  }
}

function encryptPassword(password) {
  const saltLength = 10

  return new Promise(function encryptPasswordPromise(resolve, reject) {
    bcrypt.genSalt(saltLength, function saltCb(err, salt) {
      if (err) {
        reject(err)
      }

      bcrypt.hash(password, salt, null, function hashCb(err, hash) {
        if (err) {
          reject(err)
        }

        resolve(hash)
      })
    })
  })
}

function generatePasswordReset() {
  const resetPasswordToken = crypto.randomBytes(20).toString('hex')
  const resetPasswordExpires = Date.now() + 3600000 //expires in an hour

  return {
    resetPasswordToken,
    resetPasswordExpires
  }
}

async function resetPassword(request) {
  try {
    const { userId, token, password } = request.body

    const preparedResetPasswordToken = Database.prepareString(token)

    // Check the User Name doesn't already exist
    const foundUser = await Database.get(`
      SELECT id, email
      FROM users
      WHERE resetPasswordToken = ${preparedResetPasswordToken}
        AND resetPasswordExpires > ${Database.prepareNumber(Date.now())};
    `)
    if (!foundUser) {
      throw new Error('Password reset token is invalid or has expired')
    }

    const preparedUserId = Database.prepareId(foundUser.id)
    const encryptedPassword = await AccessManager.encryptPassword(password)
    const preparedEncryptedPassword = Database.prepareString(encryptedPassword)

    await Database.run(`
      UPDATE users
      SET password = ${preparedEncryptedPassword},
        resetPasswordToken = NULL,
        resetPasswordExpires = NULL
      WHERE id = ${preparedUserId};
    `)
  } catch (err) {
    console.log(err)
    throw err
  }
}

const AccessManager = {
  initialize: initializeAccessManager,
  generatePasswordReset,
  encryptPassword,
  signUp,
  signIn,
  signOut,
  getUser,
  resetPassword,
  authenticate,
  throwIfNotAuthenticated
}

module.exports = AccessManager
