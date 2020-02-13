const AbstractNode = require("./AbstractNode");
const Number = require("./Number");
const Symbol = require("./Symbol");
const Power = require("./Power");

class Product extends AbstractNode {
  constructor(sign, mulSign) {
    super([], sign, mulSign);
    this.type = "product";
  }

  evaluate(scope) {
    var result = new Number(1);
    var symbols = [];
    for (var element of this.elements) {
      var value = element.evaluate(scope);
      if (value instanceof Symbol || value instanceof Power) {
        symbols.push(value);
      } else {
        result = result.mulNumber(value);
      }
    }
    if (symbols.length == 0) {
      result.setMulSign(this.getMulSign());
      result.applySign(this.getSign());
      return result;
    } else {
      var node = new Product(this.getSign(), this.getMulSign());
      node.push(result);
      for (var symbol of symbols) {
        node.push(symbol);
      }
      return node;
    }
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
