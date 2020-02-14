const AbstractNode = require("./AbstractNode");

class Number extends AbstractNode {
  constructor(constructors, value = 0, sign, mulSign) {
    super(constructors, sign, mulSign);
    this.constructors.Decimal.precision = 64;
    this.type = "number";
    var rawValue = this.new("Decimal", value);
    this.applySign(this.constructors.Decimal.sign(rawValue));
    this.setValue(rawValue.abs());
  }

  addNumber(number) {
    return this.new("Number", this.constructors.Decimal.add(
      this.constructors.Decimal.mul(this.getValue(), this.getSign()),
      this.constructors.Decimal.mul(number.getValue(), number.getSign())
    ));
  }

  mulNumber(number) {
    return this.new("Number", this.constructors.Decimal.mul(
      this.constructors.Decimal.mul(this.getSign(), number.getSign()),
      this.constructors.Decimal.mul(
        this.constructors.Decimal.pow(this.getValue(), this.getMulSign()),
        this.constructors.Decimal.pow(number.getValue(), number.getMulSign())
      )
    ));
  }

  power(number) {
    return this.new("Number", this.constructors.Decimal.pow(
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
