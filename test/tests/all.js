const All = {};

All.get = function() {
  var tests = [];
  tests = tests.concat(require("./eval").get());
  tests = tests.concat(require("./summarize").get());
  return tests;
}

module.exports = All;
