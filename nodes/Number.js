const AbstractNode = require("./AbstractNode");

class Number extends AbstractNode {
  constructor(value, sign = "+") {
    super();
    this.type = "number";
    this.sign = sign;
    this.addElement(value);
  }

  addNumber(number) {
    var nValue = this.getValue() + number.getValue();
    return new Number(Math.abs(nValue), nValue < 0 ? "-" : "+");
  }

  getValue() {
    return this.elements[0] * this.getSign();
  }
}

module.exports = Number;
