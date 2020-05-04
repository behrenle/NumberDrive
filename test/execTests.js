const NumberDrive = require("../numberDrive");
const assert = require("assert");

function executeTestBatch(categoryName, testArray, lambda) {
  let failedTests = 0;
  console.group(`${categoryName}: Running ${testArray.length} tests:`);
  testArray.forEach((item, i) => {
    let parsedInput = NumberDrive.parse(item[0]),
        parsedOutput = NumberDrive.parse(item[1]);

    let result = lambda(parsedInput),
        expected = lambda(parsedOutput);

    try {
      assert.equal(result.equals(expected), true);
    } catch (e) {
      console.group(`\n#${i} test failed:`);
      console.table({
        input: item[0],
        output: item[1],
        ["test(input)"]: result.serialize(),
        ["test(output)"]: expected.serialize(),
      });
      console.groupEnd();
      failedTests++;
    }
  });
  console.groupEnd();
  return failedTests;
}

let evalTest = (node) => {
  return node.evaluate();
}

let summarizeTest = (node) => {
  return node.breakDown().summarize();
}

const tests = {
  Evaluation: {
    tests: require("./tests/evaluate.json"),
    lambda: evalTest
  },
  Summarize: {
    tests: require("./tests/summarize.json"),
    lambda: summarizeTest
  }
};

let failedTests = 0,
    totalTests = 0;

Object.entries(tests).forEach((entry) => {
  let key = entry[0],
      value = entry[1];

  totalTests += value.tests.length;
  failedTests += executeTestBatch(key, value.tests, value.lambda);
});

console.log(`${failedTests} of ${totalTests} tests failed`);
