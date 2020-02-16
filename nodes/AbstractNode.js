const IllegalArgumentException = require("../exceptions/IllegalArgumentException");
const UnknownConstructorException = require("../exceptions/UnknownConstructorException");
const Stack = require("../scope/Stack.js");

class AbstractNode {
  constructor(constructors, sign, mulSign) {
    this.constructors = constructors;
    this.type = "AbstractNode";
    this.stack = new Stack();
    this.sign = new this.constructors.Decimal(1);
    this.mulSign = new this.constructors.Decimal(1);
    this.setSign(sign);
    this.setMulSign(mulSign);
  }

  squashSigns() {}

  getCoefficient() {
    return this.new("Number", this.getSign());
  }

  setStack(stack) {
    this.stack = stack;
  }

  getStack() {
    return this.stack;
  }

  pushScope(scope) {
    this.getStack().push(scope);
  }

  popScope() {
    this.getStack().pop();
  }

  new(type, ...args) {
    if (typeof type == "string") {
      if (this.constructors[type]) {
        switch (type) {
          case "Decimal":
            return new this.constructors.Decimal(...args);

          default:
            var node =  new this.constructors[type](
              this.constructors,
              ...args
            );
            node.setStack(this.getStack());
            return node;
        }
      } else {
        throw new UnknownConstructorException(type);
      }
    } else {
      throw new IllegalArgumentException("string", type);
    }
  }

  simplify(scope) {
    return this;
  }

  breakDown(scope) {
    return this.simplify(scope);
  }

  summarize(scope) {
    return this.simplify(scope);
  }

  isEvaluable(scope) {
    return true;
  }

  getType() {
    return this.type;
  }

  stringify() {
    return [this.type];
  }

  output() {
    var lines = this.stringify();
    for (var line of lines) {
      console.log(line);
    }
  }

  evaluate() {
    return this;
  }

  equals(otherNode) {
    return JSON.stringify(this) == JSON.stringify(otherNode);
  }

  getSign() {
    return this.sign;
  }

  getSignString() {
    return this.sign.equals(new this.constructors.Decimal(-1)) ? "-" : "+";
  }

  resetSign() {
    this.applySign(this.getSign());
  }

  isNegative() {
    return this.getSign().equals(new this.constructors.Decimal(-1));
  }

  getMulSign() {
    return this.mulSign;
  }

  resetMulSign() {
    this.applyMulSign(this.getMulSign());
  }

  getMulSignString() {
    return this.mulSign.equals(new this.constructors.Decimal(-1)) ? "/" : "*";
  }

  setSign(s) {
    if (s) {
      if (
        new this.constructors.Decimal(1).equals(s)
        || new this.constructors.Decimal(-1).equals(s)
      ) {
        this.sign = new this.constructors.Decimal(s);
        return;
      }
    }
    this.setSign(new this.constructors.Decimal(1));
  }

  setMulSign(s) {
    if (s) {
      if (
          new this.constructors.Decimal(1).equals(s)
          || new this.constructors.Decimal(-1).equals(s)
        ) {
        this.mulSign = new this.constructors.Decimal(s);
        return;
      }
    }
    this.setSign(new this.constructors.Decimal(1));
  }

  applySign(s) {
    this.setSign(this.constructors.Decimal.mul(
      this.getSign(), s
    ));
  }

  applyMulSign(s) {
    this.setMulSign(this.constructors.Decimal.mul(
      this.getMulSign(), s
    ));
  }

  clone() {
    var cloneOBJ = new this.constructor();
    return Object.assign(cloneOBJ, this);
  }

  stringifyHead() {
    return this.type + ":" + " ("
    + (this.getSign().equals(-1) ? "-" : "+") + " "
    + (this.getMulSign().equals(-1) ? "/" : "*")
    + ")";
  }
}

module.exports = AbstractNode;
