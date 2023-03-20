const List = require('./list');
const Validator = require('./validator');
const DateUtilities = require('./date');

function getUniqueId() {
  return Date.now() + Math.random().toString().slice(2).substr(0, 6);
}

module.exports = Object.assign({ getUniqueId }, List, Validator, DateUtilities);
