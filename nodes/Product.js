const AbstractContainer = require("./AbstractContainer");
const Number = require("./Number");

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
        result = result.mulNumber(value);
      }
    }
    return result;
  }

  simplify(scope) {
    var evaluables = [];
    var nonEvaluables = [];
    for (var element of this.getElements()) {
      var value = element.simplify(scope);
      if (value.isEvaluable(scope)) {
        evaluables.push(value);
      } else {
        nonEvaluables.push(value);
      }
    }
    var result = new Product(this.getSign(), this.getMulSign());
    if (evaluables.length > 0) {
      var value = new Product();
      value.setElements(evaluables);
      result.push(value.evaluate(scope));
    }
    if (nonEvaluables.length > 0) {
      result.setElements(result.getElements().concat(nonEvaluables));
    }
    return result;
  }

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
