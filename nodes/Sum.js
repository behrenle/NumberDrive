const AbstractNode = require("./AbstractNode");
const Number = require("./Number");
const Symbol = require("./Symbol");

class Sum extends AbstractNode {
  constructor(sign, mulSign) {
    super([], sign, mulSign);
    this.type = "sum";
  }

  evaluate(scope) {
    var result = new Number(0);
    var symbols = [];
    for (var element of this.elements) {
      var value = element.evaluate(scope);
      if (value instanceof Symbol) {
        symbols.push(value);
      } else {
        result = result.addNumber(value);
      }
    }
    if (symbols.length == 0) {
      result.setMulSign(this.getMulSign());
      result.applySign(this.getSign());
      return result;
    } else {
      var node = new Sum(this.getSign(), this.getMulSign());
      node.push(result);
      for (var symbol of symbols) {
        node.push(symbol);
      }
      return node;
    }
  }
}

module.exports = Sum;
