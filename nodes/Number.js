const AbstractNode = require("./AbstractNode");
const Decimal = require('decimal.js');
Decimal.precision = 64;

class Number extends AbstractNode {
  constructor(value = 0, sign, mulSign) {
    super([], sign, mulSign);
    this.type = "number";
    var rawValue = new Decimal(value);
    this.applySign(Decimal.sign(rawValue));
    this.setValue(rawValue.abs());
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
    return this.value;
  }

  setValue(value) {
    this.value = value;
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

  stringify() {
    var lines = [];
    lines.push(this.stringifyHead());
    lines.push("  " + this.getValue());
    return lines;
  }
}

module.exports = Number;
