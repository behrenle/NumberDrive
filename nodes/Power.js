const AbstractContainer = require("./AbstractContainer");
const Number = require("./Number");

class Power extends AbstractContainer {
  constructor(constructors, sign, mulSign) {
    super(constructors, [], sign, mulSign);
    this.type = "power";
    this.connectionStrength = 3;
  }

  evaluate() {
    var base = this.getBase().evaluate();
    var exp  = this.getExponent().evaluate();

    if (base.getType() == "number" && exp.getType() == "number") {
      var result = base.power(exp);
      result.applySign(this.getSign());
      result.setMulSign(this.getMulSign());
      return result;
    }
  }

  breakDown() {
    this.setBase(this.getBase().breakDown());
    this.setExponent(this.getExponent().breakDown());
    if (this.getBase().getType() == "product") {
      var result = this.new("Product", this.getSign(), this.getMulSign());
      for (var element of this.getBase().getElements()) {
        var p = this.new("Power", 1, element.getMulSign());
        element.setMulSign(1);
        p.setBase(element);
        p.setExponent(this.getExponent());
        result.push(p);
      }
      return result;
    } else if (this.getBase().getType() == "power") {
      if (this.getBase().getSign().equals(1)) {
        var result = this.new("Power");
        var newExp = this.new("Product");
        newExp.push(this.getBase().getExponent());
        newExp.push(this.getExponent());
        result.setBase(this.getBase().getBase());
        result.setExponent(newExp);
        return result;
      }
    }
    return this;
  }

  getBase() {
    return this.getElement(0);
  }

  setBase(base) {
    this.setElement(0, base);
  }

  getExponent() {
    return this.getElement(1);
  }

  setExponent(exp) {
    this.setElement(1, exp);
  }

  serialize() {
    var str = "";
    if (this.getBase() instanceof AbstractContainer || this.getBase().getSignString() == "-") {
      str += "(";
      str += this.getBase().getSignString() == "-" ? "-" : "";
      str += this.getBase().serialize(true);
      str += ")";
    } else {
      str += this.getBase().serialize(true);
    }
    str += "^";
    if (this.getExponent() instanceof AbstractContainer || this.getExponent().getSignString() == "-") {
      str += "(";
      str += this.getExponent().getSignString() == "-" ? "-" : "";
      str += this.getExponent().serialize(true);
      str += ")";
    } else {
      str += this.getExponent().serialize(true);
    }
    return str;
  }
}

module.exports = Power;
