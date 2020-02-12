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

  push(element) {
    this.elements.push(element);
  }

  stringify() {
    var lines = [];
    lines.push(this.type + ":" + " (" + (this.sign == -1 ? "-" : "+") + ")");
    for (var element of this.elements) {
      var elementLines;
      if (element instanceof AbstractNode) {
        elementLines = element.stringify().map(x => "  " + x);
      } else {
        elementLines = ["  " + element];
      }
      lines = lines.concat(elementLines);
    }
    return lines;
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

  getMulSign() {
    return this.mulSign;
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
}

module.exports = AbstractNode;
