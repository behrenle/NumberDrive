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
      if (nonEvaluables.length > 0) {
        result.push(value.evaluate(scope));
      } else {
        return value.evaluate(scope);
      }
    }
    if (nonEvaluables.length > 0) {
      if (nonEvaluables.length == 1 && evaluables.length == 0) {
        return nonEvaluables[0];
      }
      result.setElements(result.getElements().concat(nonEvaluables));
    }
    return result;
  }

  breakDown(scope) {
    var newElements = [];
    for (var rawElement of this.getElements()) {
      var element = rawElement.breakDown(scope);
      element.applySign(this.getSign());
      if (element.getType() == "sum") {
        for (var subElement of element.getElements()) {
          subElement.applySign(element.getSign());
          newElements.push(subElement);
        }
      } else {
        newElements.push(element)
      }
    }
    this.setSign(1);
    if (newElements.length > 1) {
      this.setElements(newElements);
      return this;
    } else {
      return newElements[0];
    }
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
