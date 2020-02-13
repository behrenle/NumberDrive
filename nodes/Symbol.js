const AbstractNode = require("./AbstractNode");
const UnknownSymbolException = require("../exceptions/UnknownSymbolException");

class Symbol extends AbstractNode {
  constructor(name, sign, mulSign) {
    super([], sign, mulSign);
    this.type = "symbol";
    this.push(name);
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
    return this.elements[0];
  }

  serialize() {
    return this.getName();
  }

  equals(node) {
    return node instanceof Symbol ? this.getName() == node.getName() : false;
  }
}

module.exports = Symbol;
