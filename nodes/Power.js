const AbstractContainer = require("./AbstractContainer");
const Number = require("./Number");

class Power extends AbstractContainer {
  constructor(constructors, sign, mulSign) {
    super(constructors, [], sign, mulSign);
    this.type = "power";
    this.connectionStrength = 3;
  }

  evaluate() {
    var base = this.getBase().evaluate();
    var exp  = this.getExponent().evaluate();

    if (base.getType() == "number" && exp.getType() == "number") {
      var result = base.power(exp);
      result.applySign(this.getSign());
      result.setMulSign(this.getMulSign());
      return result;
    }
  }

  getBase() {
    return this.getElement(0);
  }

  getExponent() {
    return this.getElement(1);
  }

  getSerializeSeperator(element, first) {
    return first ? "" : "^";
  }
}

module.exports = Power;
