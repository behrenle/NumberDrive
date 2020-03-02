const AbstractContainer = require("./AbstractContainer");

class FunctionCall extends AbstractContainer {
  constructor(constructors, name, sign, mulSign) {
    super(constructors, [], sign, mulSign);
    this.type = "functionCall";
    this.name = name;
  }

  getName() {
    return this.name;
  }

  evaluate() {
    if (this.getStack().exists(this.getName())) {
      var obj = this.getStack().getValue(this.getName());
      if (obj.getType() == "function") {
        return obj.call(this.getElements(), this.getStack());
      }
      throw this.getName() + " is not a function";
    }
    throw this.getName() + " does not exist";
  }
}

module.exports = FunctionCall;
