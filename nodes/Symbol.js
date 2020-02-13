const AbstractNode = require("./AbstractNode");

class Symbol extends AbstractNode {
  constructor(name, sign, mulSign) {
    super([], sign, mulSign);
    this.type = "symbol";
    this.push(name);
  }

  evaluate(scope) {
    if (scope[this.getName()]) {
      var value = scope[this.getName()].clone();
      value.applySign(this.getSign());
      value.setMulSign(this.getMulSign());
      return value;
    }
    return this;
  }

  getName() {
    return this.elements[0];
  }
}

module.exports = Symbol;
