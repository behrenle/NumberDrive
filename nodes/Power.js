const AbstractNode = require("./AbstractNode");
const Number = require("./Number");

class Power extends AbstractNode {
  constructor(sign, mulSign) {
    super([], sign, mulSign);
    this.type = "power";
  }

  evaluate() {
    var result = this.elements[0].evaluate().power(this.elements[1].evaluate());
    result.setMulSign(this.getMulSign());
    result.applySign(this.getSign());
    return result;
  }
}

module.exports = Power;
