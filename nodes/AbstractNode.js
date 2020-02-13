const Decimal = require("decimal.js");

class AbstractNode {
  constructor(elements = [], sign, mulSign) {
    this.elements = elements;
    this.type = "AbstractNode";
    this.sign = new Decimal(1);
    this.mulSign = new Decimal(1);
    this.setSign(sign);
    this.setMulSign(mulSign);
  }

  simplify(scope) {
    return this;
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
    return this.sign.equals(new Decimal(-1)) ? "-" : "+";
  }

  getMulSign() {
    return this.mulSign;
  }

  getMulSignString() {
    return this.mulSign.equals(new Decimal(-1)) ? "/" : "*";
  }

  setSign(s) {
    if (s) {
      if (new Decimal(1).equals(s) || new Decimal(-1).equals(s)) {
        this.sign = s;
        return;
      }
    }
    this.setSign(new Decimal(1));
  }

  setMulSign(s) {
    if (s) {
      if (new Decimal(1).equals(s) || new Decimal(-1).equals(s)) {
        this.mulSign = s;
        return;
      }
    }
    this.setSign(new Decimal(1));
  }

  applySign(s) {
    this.setSign(Decimal.mul(
      this.getSign(), s
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
