const path = require("path"),
      fs   = require("fs");

var testNames = process.argv.slice(2, process.argv.length),
    testsDir  = path.dirname(require.main.filename) + "/tests/",
    dumpDir   = path.dirname(require.main.filename) + "/dumps/",
    tests     = [];

if (testNames.length == 0) {
  testNames.push("all");
}

if (!fs.existsSync(dumpDir)) {
  fs.mkdirSync(dumpDir);
}

for (var testName of testNames) {
  var testPath = testsDir + testName + ".js";
  if (fs.existsSync(testPath)) {
    tests = tests.concat(require(testPath).get());
  }
}

console.log("Running " + tests.length + " tests...");
var failed = 0;

for (var test of tests) {
  test.test();
  if (!test.succeeded) {
    test.dump();
    failed++;
  }
}

console.log(failed + " of " + tests.length + " tests failed.")
