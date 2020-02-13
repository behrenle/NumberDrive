const AbstractNode = require("./AbstractNode");
const Number = require("./Number");

class Product extends AbstractNode {
  constructor(sign, mulSign) {
    super([], sign, mulSign);
    this.type = "product";
  }

  evaluate(scope) {
    var result = new Number(1);
    for (var element of this.elements) {
      result = result.mulNumber(element.evaluate(scope));
    }
    result.setMulSign(this.getMulSign());
    result.applySign(this.getSign());
    return result;
  }

  serialize() {
    var output = "";
    for (var i = 0; i < this.elements.length; i++) {
      if (!(i == 0 && this.elements[i].getMulSignString() == "*")) {
        output += " " + this.elements[i].getMulSignString() + " ";
      }
      output += this.elements[i].serialize();
    }
    return output;
  }
}

module.exports = Product;
