const AbstractNode = require("./AbstractNode");
const Number = require("./Number");
const Symbol = require("./Symbol");
const Product = require("./Product");
const Power = require("./Power");

class Sum extends AbstractNode {
  constructor(sign, mulSign) {
    super([], sign, mulSign);
    this.type = "sum";
  }

  evaluate(scope) {
    var result = new Number(0);
    var symbols = [];
    var countConst = 0;
    for (var element of this.elements) {
      var value = element.evaluate(scope);
      if (value instanceof Symbol ||
          value instanceof Product ||
          value instanceof Power
        ) {
        symbols.push(value);
      } else {
        result = result.addNumber(value);
        countConst++;
      }
    }
    if (symbols.length == 0) {
      result.setMulSign(this.getMulSign());
      result.applySign(this.getSign());
      return result;
    } else {
      var node = new Sum(this.getSign(), this.getMulSign());
      if (countConst > 0) {
        node.push(result);
      }
      for (var symbol of symbols) {
        node.push(symbol);
      }
      return node;
    }
  }

  serialize() {
    var output = "";
    for (var i = 0; i < this.elements.length; i++) {
      if (!(i == 0 && this.elements[i].getSignString() == "+")) {
        output += " " + this.elements[i].getSignString() + " ";
      }
      output += this.elements[i].serialize();
    }
    return output;
  }
}

module.exports = Sum;
