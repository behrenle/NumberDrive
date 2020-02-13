const AbstractContainer = require("./AbstractContainer");
const Number = require("./Number");
//const Symbol = require("./Symbol");
//const Power = require("./Power");
//const Sum = require("./Sum");

class Product extends AbstractContainer {
  constructor(sign, mulSign) {
    super([], sign, mulSign);
    this.type = "product";
  }

  evaluate(scope) {
    var result = new Number(1);
    for (var element of this.getElements()) {
      var value = element.evaluate(scope);
      if (value.getType() == "number") {
        result.mulNumber(value);
      }
    }
    return result;
  }

  /*evaluate(scope) {
    var result = new Number(1);
    var sums = [];
    var symbols = [];
    var countConst = 0;
    console.log(typeof Sum);
    console.log(typeof Power);
    for (var element of this.elements) {
      var value = element.evaluate(scope);
      if (value instanceof Symbol || value instanceof Power) {
        symbols.push(value);
      } else if (value instanceof Sum) {
        sums.push(value);
      } else {
        result = result.mulNumber(value);
        countConst++;
      }
    }

    // WIP: klammern auflösen...
    // sum times sum
    if (sums.length > 0) {
      // multiply sums with each others
      console.log("sumslength",sums.length);
      while (sums.length > 1) {

      }
    }






    if (symbols.length == 0) {
      result.setMulSign(this.getMulSign());
      result.applySign(this.getSign());
      return result;
    } else {
      var node = new Product(this.getSign(), this.getMulSign());
      if (countConst > 0) {
        node.push(result);
      }
      for (var symbol of symbols) {
        node.push(symbol);
      }
      return node;
    }
  }*/

  serialize() {
    var output = "";
    for (var i = 0; i < this.getLength(); i++) {
      output += this.getElement(i).getMulSignString() == "*" ? "" : "/ ";
      output += this.getElement(i).serialize();
      if (i < this.getLength() - 1) {
        output += " ";
      }
    }
    return output;
  }
}

module.exports = Product;
