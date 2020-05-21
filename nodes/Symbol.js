import AbstractNode, { registerNode } from "./AbstractNode.js";
import UnknownSymbolException from "../exceptions/UnknownSymbolException.js";

class Symbol extends AbstractNode {
  constructor(name, sign, mulSign) {
    super(sign, mulSign);
    this.type = "symbol";
    this.name = name;
  }

  isEvaluable() {
    return this.hasValue();
  }

  getSymbolNames() {
    if (!this.hasValue()) {
      return [this.getName()];
    }
    return [];
  }

  evaluate() {
    if (this.hasValue()) {
      var type = this.getValue().getType();
      if (type == "genericFunction" || type == "function") {
        throw "attempt to evaluate function field";
      }
      var value = this.getValue().clone();
      value.applySign(this.getSign());
      value.applyMulSign(this.getMulSign());
      value.setStack(this.getStack());
      return value.evaluate();
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
    let serialStr = "";

    if (!mode && this.getSign().equals(-1))
      serialStr += "-";

    if (!mode && this.getMulSign().equals(-1))
      serialStr += "1 / "

    return serialStr + this.getName();
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

registerNode("Symbol", Symbol);
export default Symbol;
