const Stack        = require("./scope/Stack");
const Scope        = require("./scope/Scope");
const ENV          = require("./envLoader");
const TreeBuilderC = require("./TreeBuilder.js");
const TreeBuilder  = new TreeBuilderC();
const Parser       = require('@behrenle/number-drive-parser');
const FailedParsingException = require("./exceptions/FailedParsingException");
const Exception = require("./exceptions/Exception");


class Script {
  constructor() {
    // setup script environment
    this.ENV = new Stack();
    for (var scope of ENV.scopes) {
      this.ENV.push(scope);
    }

    // setup user scope
    this.ENV.push(new Scope());

    // setup internal script structre
    this.inputs  = [];
    this.outputs = [];
  }

  getENV() {
    return this.ENV;
  }

  getLength() {
    return this.inputs.length;
  }

  getItem(index) {
    if (!this.inputs[index]) {
      throw "index out of bounds";
    }
    return {
      input: this.inputs[index],
      output: this.outputs[index]
    };
  }

  push(node) {
    var inputStr, outputStr;

    inputStr = node.serialize();
    node.setStack(this.getENV());

    try {
      outputStr = node.evaluate().serialize();
    } catch (e) {
      if (e instanceof Exception) {
        outputStr = e.stringify();
      } else {
        outputStr = e;
      }
    }

    this.inputs.push(inputStr);
    this.outputs.push(outputStr);
  }

  pushString(str) {
    try {
      var parseTreeNode = Parser.parse(str),
          astNode       = TreeBuilder.build(parseTreeNode);

      this.push(astNode);
    } catch (e) {
      this.inputs.push(str);
      this.outputs.push(new FailedParsingException(e).stringify());
    }
  }

  output() {
    for (var i = 0; i < this.getLength(); i++) {
      console.log(
        "#" + i + ": " +
        this.inputs[i] + "\n> " + this.outputs[i] + "\n"
      );
    }
  }
}

module.exports = Script;
