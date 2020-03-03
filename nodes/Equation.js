const AbstractContainer = require("./AbstractContainer");

class Equation extends AbstractContainer {
  constructor(constructors) { // equation is signless
    super(constructors, [], 1, 1);
    this.type = "equation";
  }

  evaluate() {
    return this;
  }

  serialize() {
    var str = "";
    str += this.getElement(0).serialize();
    str += " = ";
    str += this.getElement(1).serialize();
    return str;
  }
}

module.exports = Equation;
