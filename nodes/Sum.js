const AbstractContainer = require("./AbstractContainer");

class Sum extends AbstractContainer {
  constructor(constructors, sign, mulSign) {
    super(constructors, [], sign, mulSign);
    this.type = "sum";
    this.connectionStrength = 1;
  }

  evaluate(scope) {
    var result = new this.constructors.Number(this.constructors, 0);
    for (var element of this.elements) {
      var value = element.evaluate(scope);
      if (value.getType() == "number") {
        result = result.addNumber(value);
      }
    }
    return result;
  }

  /*simplify(scope) {
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
  }*/

  normSign() {
    if (this.isNegative()) {
      for (var element of this.getElements()) {
        element.applySign(this.getSign());
      }
      this.applySign(this.getSign());
    }
  }

  mulSum(node, Product, scope) {
    this.normSign();
    node.normSign();
    var result = new this.constructors.Sum(this.constructors);
    for (var element of node.getElements()) {
      result.push(this.mulNonSum(element, Product));
    }
    return result.breakDown(scope);
  }

  mulNonSum(node, Product) {
    this.normSign();
    var result = new this.constructors.Sum(this.constructors);
    for (var element of this.getElements()) {
      var summand = new this.constructors.Product(this.constructors);//node.getSign(), node.getMulSign());
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

  breakDown(scope) {
    var newElements = [];
    if (this.isEvaluable(scope)) {
      return this.evaluate(scope);
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
