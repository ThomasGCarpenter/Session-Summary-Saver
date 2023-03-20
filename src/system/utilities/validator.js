const check = require('check-types');

function isNonEmptyString(thing) {
  return check.nonEmptyString(thing);
}

function isNumber(thing) {
  return !check.emptyString(thing) && check.number(Number(thing));
}

function isPositiveInteger(thing) {
  return check.integer(thing) && check.positive(thing);
}

function isValidUserName(thing) {
  // const userKeyRegExp = /^[A-Z]\-[0-9]{2}\-[0-9]{2}[A-Z]?$/;
  // return userKeyRegExp.test(thing)
  return true
}



module.exports = {
  isNonEmptyString,
  isNumber,
  isPositiveInteger,
  isValidUserName
};
