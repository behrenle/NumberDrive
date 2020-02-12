const AbstractNode = require("./AbstractNode");

class Symbol extends AbstractNode {
  constructor(name, sign, mulSign) {
    super([], sign, mulSign);
    this.type = "symbol";
    this.name = name;
  }

  evaluate(scope) {
    if (scope[this.name]) {
      var value = scope[this.name].clone();
      value.applySign(this.getSign());
      value.setMulSign(this.getMulSign());
      return value;
    }
    return this;
  }
}

module.exports = Symbol;
