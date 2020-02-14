const AbstractNode = require("./AbstractNode");
const UnknownSymbolException = require("../exceptions/UnknownSymbolException");

class Symbol extends AbstractNode {
  constructor(constructors, name, sign, mulSign) {
    super(constructors, sign, mulSign);
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
    if (this.hasValue(scope)) {
      var value = this.getValue(scope);
      value.applySign(this.getSign());
      value.setMulSign(this.getMulSign());
      return value;
    } else {
      throw new UnknownSymbolException(this);
    }
  }

  hasValue(scope) {
    return scope[this.getName()] instanceof AbstractNode;
  }

  getValue(scope) {
    return scope[this.getName()].clone();
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
