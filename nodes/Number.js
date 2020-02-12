const AbstractNode = require("./AbstractNode");
const Decimal = require('decimal.js');
Decimal.precision = 64;

class Number extends AbstractNode {
  constructor(value, sign) {
    super();
    this.type = "number";
    var rawValue = new Decimal(value);
    this.sign = Decimal.sign(rawValue);
    if (sign) {
      this.sign = Decimal.mul(this.sign, sign);
    }
    this.push(rawValue.abs());
  }

  addNumber(number) {
    return new Number(Decimal.add(
      Decimal.mul(this.getValue(), this.getSign()),
      Decimal.mul(number.getValue(), number.getSign())
    ));
  }

  getValue() {
    return this.elements[0];
  }

  getSign() {
    return this.sign;
  }
}

module.exports = Number;
