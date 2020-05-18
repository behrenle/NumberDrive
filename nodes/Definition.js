import AbstractContainer from "./AbstractContainer.js";
import { registerNode } from "./AbstractNode.js";

class Definition extends AbstractContainer {
  constructor() { // definition is signless
    super([], 1, 1);
    this.type = "definition";
  }

  evaluate() {
    if (this.getLabel().getType() == "symbol") {
      var value = this.getValue().evaluate();
      this.getStack().setValue(this.getLabel().getName(), value);
      return value;
    } else if (this.getLabel().getType() == "functionCall") {
      this.getStack().setValue(
        this.getLabel().getName(),
        this.new(
          "Function",
          this.getLabel().getElements(),
          this.getValue()
        )
      );
      return this;
    }
    throw "Definition: invalid label";
  }

  setLabel(label) {
    this.setElement(0, label);
  }

  setValue(value) {
    this.setElement(1, value);
  }

  getLabel() {
    return this.getElement(0);
  }

  getValue() {
    return this.getElement(1);
  }

  serialize() {
    var str = "";
    str += this.getLabel().serialize();
    str += " := ";
    str += this.getValue().serialize();
    return str;
  }
}

registerNode("Definition", Definition);

export default Definition;
