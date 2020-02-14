const AbstractContainer = require("./AbstractContainer");

class Sum extends AbstractContainer {
  constructor(constructors, sign, mulSign) {
    super(constructors, [], sign, mulSign);
    this.type = "sum";
    this.connectionStrength = 1;
  }

  evaluate() {
    var result = this.new("Number", 0);
    for (var element of this.elements) {
      var value = element.evaluate();
      if (value.getType() == "number") {
        result = result.addNumber(value);
      }
    }
    return result;
  }

  normSign() {
    if (this.isNegative()) {
      for (var element of this.getElements()) {
        element.applySign(this.getSign());
      }
      this.applySign(this.getSign());
    }
  }

  mulSum(node) {
    this.normSign();
    node.normSign();
    var result = this.new("Sum");
    for (var element of node.getElements()) {
      result.push(this.mulNonSum(element));
    }
    return result.breakDown();
  }

  mulNonSum(node) {
    this.normSign();
    var result = this.new("Sum");
    for (var element of this.getElements()) {
      var summand = new this.new("Product");
      summand.applySign(node.getSign());
      summand.applySign(element.getSign());
      node.resetSign();
      element.resetSign();
      if (node.type == "product") {
        summand.setElements(node.getElements());
      } else {
        summand.push(node);
      }
      summand.push(element);
      result.push(summand);
    }
    return result;
  }

  breakDown() {
    var newElements = [];
    if (this.isEvaluable()) {
      return this.evaluate();
    }
    for (var rawElement of this.getElements()) {
      rawElement.applySign(this.getSign());
      var element = rawElement.breakDown(scope);
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

  getSerializeSeperator(element, first) {
    var seperator = element.getSignString();
    if (first) {
      if (seperator == "+") {
        return "";
      }
      return seperator + " ";
    }
    return " " + seperator + " ";
  }
}

module.exports = Sum;
