const AbstractContainer = require("./AbstractContainer");
const Number = require("./Number");

class Sum extends AbstractContainer {
  constructor(sign, mulSign) {
    super([], sign, mulSign);
    this.type = "sum";
  }

  evaluate(scope) {
    var result = new Number(0);
    for (var element of this.elements) {
      var value = element.evaluate(scope);
      if (value.getType() == "number") {
        result = result.addNumber(value);
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
    var result = new Sum(this.getSign(), this.getMulSign());
    if (evaluables.length > 0) {
      var value = new Sum();
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
    for (var i = 0; i < this.elements.length; i++) {
      if (!(i == 0 && this.elements[i].getSignString() == "+")) {
        output += this.elements[i].getSignString() + " ";
      }
      output += this.elements[i].serialize();
      if (i < this.elements.length - 1) {
        output += " ";
      }
    }
    return output;
  }
}

module.exports = Sum;
