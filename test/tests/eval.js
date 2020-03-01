const Test = require("../Test");

class EvalTest extends Test {
  constructor(inStr, outStr) {
    super("EvalTest", inStr, outStr);
    this.inputEval = this.input.evaluate();
    this.outputEval = this.output.evaluate();
  }

  test() {
    this.succeeded = this.inputEval.equals(this.outputEval);
  }

  additionalDumps() {
    var dumpStr = "";
    dumpStr += "input.eval.serialize: " + this.inputEval.serialize() + "\n\n";
    dumpStr += "output.eval.serialize: " + this.outputEval.serialize() + "\n\n";
    return dumpStr;
  }
}

module.exports = {
  get: function() {
    var tests = [];
    var testData = [
      "1 + 2 - 3", "0",
      "2 * 3 / 3", "2",
      "2^3", "8",
      "2 - 2 * 3", "-4",
      "2 - 3^2", "-7",
      "2 * 3^2", "18",
      "25 - 5 * 5 ^ 2 / 5", "0",
      "[1,2,3] + [4,5,6]", "[5, 7, 9]",
      "[1,2,3] - [1,2,3]", "[0, 0, 0]",
      "-[1,2,3] - [1,2,3]", "[-2,-4,-6]",
      "[1,2,3] * 2", "[2,4,6]",
      "2 * [1,2,3]", "[2,4,6]",
      "[1,2,3] * (-2)", "[-2,-4,-6]",
      "(-2) * [1,2,3]", "[-2,-4,-6]",
      "[1,2,3] * [1,2,3]", "14",
      "(-[1,2,3]) * [1,2,3]", "-14",
    ]
    for (var i = 0; i < testData.length; i += 2) {
      tests.push(new EvalTest(testData[i], testData[i + 1]));
    }
    return tests;
  }
}
