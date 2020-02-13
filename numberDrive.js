const Parser = require('@behrenle/number-drive-parser');
const TreeBuilder = require("./TreeBuilder.js");

const NumberDrive = {
  builder: new TreeBuilder,
  outputInput: false,
  outputParseTree: false,
  outputTree: false,
  outputResult: false,
};

NumberDrive.evalString = function(str, scope = {}) {
  var parseTree = Parser.parse(str);
  var tree      = this.builder.build(parseTree);
  var result    = tree.evaluate(scope);
  if (this.outputInput) {
    console.log("Input:");
    console.log(str + "\n");
  }
  if (this.outputParseTree) {
    console.log("ParseTree:");
    console.log(JSON.stringify(parseTree, 0, 2) + "\n");
  }
  if (this.outputTree) {
    console.log("Tree:");
    tree.output();
    console.log();
  }
  if (this.outputResult) {
    console.log("Result:");
    result.output();
  }
  return result;
}

NumberDrive.setDebugOutputs = function(input, parseTree, tree, result) {
  this.outputInput = input ? true : false;
  this.outputParseTree = parseTree ? true : false;
  this.outputTree = tree ? true : false;
  this.outputResult = result ? true : false;
}

module.exports = NumberDrive;
