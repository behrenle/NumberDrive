const AbstractContainer = require("./AbstractContainer");

class Definition extends AbstractContainer {
  constructor(constructors) { // definition is signless
    super(constructors, [], 1, 1);
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

module.exports = Definition;
