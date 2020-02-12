const AbstractNode = require("./AbstractNode");
const Number = require("./Number");

class Power extends AbstractNode {
  constructor(sign, mulSign) {
    super([], sign, mulSign);
    this.type = "power";
  }

  evaluate(scope) {
    var result = this.elements[0].evaluate(scope).power(this.elements[1].evaluate(scope));
    result.setMulSign(this.getMulSign());
    result.applySign(this.getSign());
    return result;
  }
}

module.exports = Power;
