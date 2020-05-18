import AbstractContainer from "./AbstractContainer.js";
import { registerNode } from "./AbstractNode.js";
import Number from "./Number.js";

class Power extends AbstractContainer {
  constructor(sign, mulSign) {
    super([], sign, mulSign);
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
    } else if (base.getType() == "tensor" && exp.getType() == "number") {
      var result = this.new("Product", this.getSign(), this.getMulSign());
      var expVal = exp.getDecimalValue().toNumber();
      if (expVal < 0 || expVal % 1 != 0) {
        throw "Power: illegal exponent";
      }
      for (var i = 0; i < expVal; i++) {
        result.push(base);
      }
      return result.evaluate();
    }

    throw "Power: incompatible types";
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
    } else if (this.getBase().getType() == "sum" && this.getExponent().getType() == "number") {
      let exponentValue = this.getExponent().getDecimalValue();
      if (exponentValue.mod(1).equals(0)) {
        let result = this.new("Product");
        for (let i = 0; i < exponentValue.toNumber(); i++) {
          result.push(this.getBase().clone());
        }
        result.applySigns(this);
        return result.breakDown();
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

registerNode(Power);
export default Power;
