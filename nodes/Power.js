const AbstractNode = require("./AbstractNode");
const Number = require("./Number");

class Power extends AbstractNode {
  constructor(sign, mulSign) {
    super([], sign, mulSign);
    this.type = "power";
  }

  evaluate() {
    return this.elements[0].evaluate().power(this.elements[1].evaluate());
  }
}

module.exports = Power;
