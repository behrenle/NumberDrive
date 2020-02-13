const AbstractNode = require("./AbstractNode");
const Decimal = require('decimal.js');
Decimal.precision = 64;

class Number extends AbstractNode {
  constructor(value = 0, sign, mulSign) {
    super([], sign, mulSign);
    this.type = "number";
    var rawValue = new Decimal(value);
    this.applySign(Decimal.sign(rawValue));
    this.push(rawValue.abs());
  }

  addNumber(number) {
    return new Number(Decimal.add(
      Decimal.mul(this.getValue(), this.getSign()),
      Decimal.mul(number.getValue(), number.getSign())
    ));
  }

  mulNumber(number) {
    return new Number(Decimal.mul(
      Decimal.mul(this.getSign(), number.getSign()),
      Decimal.mul(
        Decimal.pow(this.getValue(), this.getMulSign()),
        Decimal.pow(number.getValue(), number.getMulSign())
      )
    ));
  }

  power(number) {
    return new Number(Decimal.pow(
      this.getValue(), number.getValue()
    ));
  }

  getValue() {
    return this.elements[0];
  }

  serialize() {
    return this.getValue().toString();
  }

  equals(node) {
    return node instanceof Number ?
           this.getValue().equals(node.getValue())
           && this.getSign().equals(node.getSign())
           && this.getMulSign().equals(node.getMulSign())
           : false;
  }
}

module.exports = Number;
