'use strict';

function assign () {
  var stack = Array.prototype.slice.call(arguments);
  var item;
  var result = stack.shift();
  var key;
  while (stack.length) {
    item = stack.shift();
    for (key in item) {
      if (item.hasOwnProperty(key)) {
        if (result[key] && typeof result[key] === 'object') {
          result[key] = assign(result[key], item[key]);
        } else {
          result[key] = item[key];
        }
      }
    }
  }
  return result;
}

module.exports = assign;
