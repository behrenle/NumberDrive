const AbstractContainer = require("./AbstractContainer");
const Number = require("./Number");
const DevideByZeroException = require("../exceptions/DivideByZeroException");

class Product extends AbstractContainer {
  constructor(sign, mulSign) {
    super([], sign, mulSign);
    this.type = "product";
    this.connectionStrength = 1;
  }

  evaluate(scope) {
    var result = new Number(1);
    for (var element of this.getElements()) {
      var value = element.evaluate(scope);
      if (value.getType() == "number") {
        if (value.getValue().equals(0)) {
          throw new DevideByZeroException();
        }
        result = result.mulNumber(value);
      }
    }
    return result;
  }

  squashSigns() {
    for (var element of this.getElements()) {
      this.applySign(element.getSign());
      element.setSign(1);
    }
  }

  isMultipleOf(node, scope) {
    if (node.type == "product") {
      var thisNonEvaluables = new Product();
      var nodeNonEvaluables = new Product();
      thisNonEvaluables.setElements(this.getNonEvaluables(scope));
      nodeNonEvaluables.setElements(node.getNonEvaluables(scope));
      var thisSimplified = thisNonEvaluables.simplify(scope);
      var nodeSimplified = nodeNonEvaluables.simplify(scope);
      thisSimplified.squashSigns();
      nodeSimplified.squashSigns();
      thisSimplified.output();
      nodeSimplified.output();
      if (thisSimplified.equals(nodeSimplified)) {
        return true;
      }
    } else if (node.type == "symbol") {
      var nonEvaluables = this.getNonEvaluables(scope);
      if (nonEvaluables.length == 1) {
        if (nonEvaluables[0].getType() == "symbol") {
          if (nonEvaluables[0].getName() == node.getName()) {
            return true;
          }
        }
      }
    }
    return false;
  }

  breakDown(scope) {
    var newElements = [];
    if (this.isEvaluable(scope)) {
      return this.evaluate(scope);
    }
    for (var rawElement of this.getElements()) {
      rawElement.applyMulSign(this.getMulSign());
      var element = rawElement.breakDown(scope);
      if (element.getType() == "product") {
        for (var subElement of element.getElements()) {
          subElement.applyMulSign(element.getMulSign());
          newElements.push(subElement);
        }
      } else {
        newElements.push(element)
      }
    }
    this.setMulSign(1);
    if (newElements.length > 1) {
      this.setElements(newElements);
      return this;
    } else {
      return newElements[0];
    }
  }

  simplify(scope) {
    var evaluables = this.getEvaluables(scope);
    var nonEvaluables = this.getNonEvaluables(scope);
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
