const AbstractContainer = require("./AbstractContainer");
const Number = require("./Number");

class Power extends AbstractContainer {
  constructor(sign, mulSign) {
    super([], sign, mulSign);
    this.type = "power";
    this.connectionStrength = 3;
  }

  evaluate(scope) {
    var base = this.getBase().evaluate(scope);
    var exp  = this.getExponent().evaluate(scope);

    if (base.getType() == "number" && exp.getType() == "number") {
      return base.power(exp);
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
