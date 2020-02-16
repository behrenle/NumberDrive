const NumberDrive = require("../numberDrive");

class evalTest {
  constructor(inputStr, outputStr) {
    this.input = NumberDrive.parse(inputStr);
    this.output = NumberDrive.parse(outputStr);
  }

  test() {
    if (!this.input.evaluate().equals(this.output.evaluate())) {
      console.log("\nEval test failed:");
      console.log("\tinput: " + this.input.serialize());
      console.log("\toutput: " + this.output.serialize());
      console.log("\tresult: " + this.input.evaluate().serialize())
    }
  }
}

var input, output;

// test sum
new evalTest("1 + 2 - 3", "0").test();

// test product
new evalTest("2 * 3 / 3", "2").test();

// test power
new evalTest("2^3", "8").test();

// test sum and product
new evalTest("2 - 2 * 3", "-4").test();

// test sum and power
new evalTest("2 - 3^2", "-7").test();

// test product and power
new evalTest("2 * 3^2", "18").test();

// test sum, product and power
new evalTest("25 - 5 * 5 ^ 2 / 5", "0");
