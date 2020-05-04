const NumberDrive = require("../numberDrive");
const TreeBuilderC = require("../TreeBuilder.js");
const TreeBuilder  = new TreeBuilderC();
const Parser       = require('@behrenle/number-drive-parser');
const assert = require("assert");

function parse(str) {
  return TreeBuilder.build(Parser.parse(str));
}

function executeTestBatch(categoryName, testArray, testLambda) {
  console.group(`${categoryName}: Running ${testArray.length} tests:`);
  testArray.forEach((item, i) => {
    let parsedInput = parse(item[0]),
        parsedOutput = parse(item[1]);

    try {
      testLambda(parsedInput, parsedOutput);
    } catch (e) {
      console.error(`#${i} test failed: lambda(${parsedInput.serialize()}, ${parsedOutput.serialize()})`);
    }
  });
  console.groupEnd();
}

let evalLambda = (input, output) => {
  assert.equal(
    input.evaluate().serialize(),
    output.evaluate().serialize()
  );
}

const tests = {
  Evaluation: {
    tests: require("./tests/eval.json"),
    lambda: evalLambda,
  }
};

Object.entries(tests).forEach((entry) => {
  let key = entry[0],
      value = entry[1];

  executeTestBatch(key, value.tests, value.lambda);
});
