const AbstractNode = require("./AbstractNode");
const Decimal = require('decimal.js');
Decimal.precision = 64;

class Number extends AbstractNode {
  constructor(value) {
    super();
    this.type = "number";
    this.push(new Decimal(value));
  }

  addNumber(number) {
    return new Number(Decimal.add(this.getValue(), number.getValue()));
  }

  getValue() {
    return this.elements[0];
  }
}

module.exports = Number;
