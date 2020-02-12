const AbstractNode = require("./AbstractNode");
const Decimal = require('decimal.js');
Decimal.precision = 64;

class Number extends AbstractNode {
  constructor(value, sign, mulSign) {
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
}

module.exports = Number;
