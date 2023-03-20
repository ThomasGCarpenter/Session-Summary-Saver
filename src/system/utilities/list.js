const _cloneDeep = require('lodash.clonedeep');
const _isEqual = require('lodash.isequal');

function cloneDeep(thing) {
  return _cloneDeep(thing);
}

function isEqual(thing1, thing2) {
  return _isEqual(thing1, thing2);
}

function sortAscending(list, field) {
  return cloneDeep(list).sort((a, b) => {
    const fields = field.split('.');

    let valueA;
    let valueB;
    if (fields.length === 2) {
      valueA = a[fields[0]][fields[1]];
      valueB = b[fields[0]][fields[1]];
    } else {
      valueA = a[fields[0]];
      valueB = b[fields[0]];
    }

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) {
      return -1;
    } else if (valueA > valueB) {
      return 1;
    } else {
      return 0;
    }
  });
}

function sortDescending(list, field) {
  return cloneDeep(list).sort((a, b) => {
    const fields = field.split('.');

    let valueA;
    let valueB;
    if (fields.length === 2) {
      valueA = a[fields[0]][fields[1]];
      valueB = b[fields[0]][fields[1]];
    } else {
      valueA = a[fields[0]];
      valueB = b[fields[0]];
    }

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) {
      return 1;
    } else if (valueA > valueB) {
      return -1;
    } else {
      return 0;
    }
  });
}

module.exports = {
  cloneDeep,
  isEqual,
  sortAscending,
  sortDescending
};
