const All = {};

All.get = function() {
  var tests = [];
  tests = tests.concat(require("./eval").get());
  return tests;
}

module.exports = All;
