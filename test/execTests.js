const NumberDrive = require("../numberDrive");
const tests = require("./tests.json");

const TreeBuilderC = require("../TreeBuilder.js");
const TreeBuilder  = new TreeBuilderC();
const Parser       = require('@behrenle/number-drive-parser');

const assert = require("assert");

function eval(str) {
  return TreeBuilder.build(Parser.parse(str)).evaluate();
}

console.group(`Running ${tests.length} tests:`);

tests.forEach((item, i) => {
  let evalInputSerialized = eval(item[0]).serialize(),
      evalOutputSerialized = eval(item[1]).serialize();

  try {
    assert.equal(evalInputSerialized, evalOutputSerialized);
  } catch (e) {
    console.error(`#${i} test failed: ${evalInputSerialized} != ${evalOutputSerialized}`);
  }
});

console.groupEnd();
