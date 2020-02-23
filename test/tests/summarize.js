const Test = require("../Test");

class SummarizeTest extends Test {
  constructor(inStr, outStr) {
    super("SummarizeTest", inStr, outStr);
    this.summarized = this.input.breakDown().summarize();
    this.expected = this.output.breakDown().summarize();
  }

  test() {
    this.succeeded = this.summarized.equals(this.expected);
  }

  additionalDumps() {
    var dumpStr = "";
    dumpStr += "summarized:\n"
             + this.summarized.stringify().join("\n") + "\n\n";
    dumpStr += "expected:\n"
             + this.expected.stringify().join("\n") + "\n\n";
    return dumpStr;
  }
}

module.exports = {
  get: function() {
    var tests = [];
    var testData = [
      "(a - b) (a - b)", "a^2 - 2 a b + b^2",
      "(a + b) (a - b)", "a^2 - b^2",
      "(a + b) (a + b)", "a^2 + 2 a b + b^2",
      "x x x x x", "x^5",
      "x^2 / x^3", "1/x",
      "x^3 / x^2", "x",
      "x^2 x^4", "x^6",
      "a + c + 2a", "3a + c",
      "2a - 5a + c", "-3a + c",
    ];

    for (var i = 0; i < testData.length; i += 2) {
      tests.push(new SummarizeTest(testData[i], testData[i + 1]));
    }

    return tests;
  }
}
