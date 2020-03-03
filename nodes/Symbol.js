const AbstractNode = require("./AbstractNode");
const UnknownSymbolException = require("../exceptions/UnknownSymbolException");

class Symbol extends AbstractNode {
  constructor(constructors, name, sign, mulSign) {
    super(constructors, sign, mulSign);
    this.type = "symbol";
    this.name = name;
  }

  isEvaluable() {
    return this.hasValue();
  }

  evaluate() {
    if (this.hasValue()) {
      var type = this.getValue().getType();
      if (type == "genericFunction" || type == "function") {
        throw "attempt to evaluate function field";
      }
      var value = this.getValue().clone();
      value.applySign(this.getSign());
      value.setMulSign(this.getMulSign());
      return value;
    } else {
      throw new UnknownSymbolException(this);
    }
  }

  hasValue() {
    return this.getStack().getValue(this.getName()) instanceof AbstractNode;
  }

  getValue() {
    return this.getStack().getValue(this.getName());
  }

  getName() {
    return this.name;
  }

  serialize(mode) {
    if (!mode && this.getSign().equals(-1)) {
      return "-" + this.getName();
    } else {
      return this.getName();
    }
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
