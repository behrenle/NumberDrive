const AbstractNode = require("./AbstractNode");
const Number = require("./Number");

class Power extends AbstractNode {
  constructor(sign, mulSign) {
    super([], sign, mulSign);
    this.type = "power";
  }

  evaluate(scope) {
    var base = this.getBase().evaluate(scope);
    var exp  = this.getExponent().evaluate(scope);

    if (base.getType() == "number" && exp.getType() == "number") {
      return base.power(exp);
    }
  }
    /*var result;
    if (base instanceof Number && exp instanceof Number) {
      result = base.power(exp);
    } else {
      result = new Power();
      result.push(base);
      result.push(exp);
    }
    result.setMulSign(this.getMulSign());
    result.applySign(this.getSign());
    return result;
  }*/

  getBase() {
    return this.elements[0];
  }

  getExponent() {
    return this.elements[1];
  }

  serialize() {
    return this.getBase().serialize() + "^" + this.getExponent().serialize();
  }
}

module.exports = Power;
