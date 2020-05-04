const NumberDrive = require("../numberDrive");
const TreeBuilderC = require("../TreeBuilder.js");
const TreeBuilder = new TreeBuilderC();
const Parser = require('@behrenle/number-drive-parser');
const assert = require("assert");

function parse(str) {
  return TreeBuilder.build(Parser.parse(str));
}

function executeTestBatch(categoryName, testArray, lambda) {
  console.group(`${categoryName}: Running ${testArray.length} tests:`);
  testArray.forEach((item, i) => {
    let parsedInput = parse(item[0]),
        parsedOutput = parse(item[1]);

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
    }
  });
  console.groupEnd();
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

Object.entries(tests).forEach((entry) => {
  let key = entry[0],
      value = entry[1];

  executeTestBatch(key, value.tests, value.lambda);
});
