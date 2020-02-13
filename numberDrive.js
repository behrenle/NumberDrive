const Parser = require('@behrenle/number-drive-parser');
const TreeBuilder = require("./TreeBuilder.js");
const FailedParsingException = require("./exceptions/FailedParsingException");

const NumberDrive = {
  builder: new TreeBuilder,
  outputInput: false,
  outputParseTree: false,
  outputTree: false,
  outputResult: false,
};

NumberDrive.evalString = function(str, scope = {}) {
  if (this.outputInput) {
    console.log("Input:");
    console.log(str + "\n");
  }

  try {
    var parseTree = Parser.parse(str);
    if (this.outputParseTree) {
      console.log("ParseTree:");
      console.log(JSON.stringify(parseTree, 0, 2) + "\n");
    }
  } catch (e) {
    throw new FailedParsingException(e);
  }

  var tree      = this.builder.build(parseTree);
  if (this.outputTree) {
    console.log("Tree:");
    tree.output();
    console.log();
  }

  var result    = tree.evaluate(scope);
  if (this.outputResult) {
    console.log("Result:");
    console.log(result.serialize());
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
