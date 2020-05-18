import AbstractContainer from "./AbstractContainer.js";

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
      let obj = this.getStack().getValue(this.getName());
      let result;
      if (obj.getType() == "function") {
        result = obj.call(
          this.getElements().map(x => x.evaluate()),
          this.getStack()
        );
      } else if (obj.getType() == "genericFunction") {
        result = obj.call(
          this.getElements(),
          this.getStack()
        );
      }
      if (result) {
        result.applySign(this.getSign());
        result.applyMulSign(this.getMulSign());
        return result;
      }
      throw this.getName() + " is not a function";
    }
    throw this.getName() + " does not exist";
  }

  serialize() {
    var str = "";
    str += this.getName() + "(";
    for (var i = 0; i < this.getElements().length; i++) {
      str += this.getElement(i).serialize();
      if (i < this.getElements().length - 1) {
        str += ", ";
      }
    }
    str += ")";
    return str;
  }
}

export default FunctionCall;
