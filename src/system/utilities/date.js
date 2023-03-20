const moment = require('moment');

function getLocalToday() {
  return moment().toISOString(true).substr(0, 10);
}

function getLocalDate(date) {
  return moment(date).toISOString(true).substr(0, 10);
}

function standardizeDate(date) {
  return date.toISOString().substr(0, 10);
}

function formatDate({ date, format }) {
  return moment(date).format(format);
}

function getUTCTimestamp(date) {
  if (date) {
    return moment.utc(date).valueOf();
  }
  return moment.utc().valueOf();
}

function addDays({ date, numberOfDays }) {
  const newDate = moment.utc(date).add(numberOfDays, 'days');
  return standardizeDate(newDate);
}

function getDifferenceInDays(date1, date2) {
  const utcDate1 = moment.utc(date1);
  const utcDate2 = moment.utc(date2);

  // Make positive regardless of date order
  return Math.abs(utcDate1.diff(utcDate2, 'days'));
}

function getDifferenceInDaysInclusive(date1, date2) {
  return getDifferenceInDays(date1, date2) + 1;
}

module.exports = {
  getLocalToday,
  getLocalDate,
  standardizeDate,
  formatDate,
  getUTCTimestamp,
  addDays,
  getDifferenceInDays,
  getDifferenceInDaysInclusive
};
