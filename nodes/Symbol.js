const AbstractNode = require("./AbstractNode");
const UnknownSymbolException = require("../exceptions/UnknownSymbolException");

class Symbol extends AbstractNode {
  constructor(name, sign, mulSign) {
    super([], sign, mulSign);
    this.type = "symbol";
    this.name = name;
  }

  isEvaluable(scope) {
    if (scope[this.getName()]) {
      return true;
    }
    return false;
  }

  evaluate(scope) {
    if (
      scope[this.getName()]
      && typeof scope[this.getName()] == "object"
      && scope[this.getName()].getType() == "number"
    ) {
      var value = scope[this.getName()].clone();
      value.applySign(this.getSign());
      value.setMulSign(this.getMulSign());
      return value;
    } else {
      throw new UnknownSymbolException(this);
    }
  }

  getName() {
    return this.name;
  }

  serialize() {
    return this.getName();
  }

  equals(node) {
    return node instanceof Symbol ? this.getName() == node.getName() : false;
  }

  stringify() {
    var lines = [];
    lines.push(this.stringifyHead());
    lines.push("  " + this.getName());
    return lines;
  }
}

module.exports = Symbol;
