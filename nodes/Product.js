const AbstractContainer = require("./AbstractContainer");
const DevideByZeroException = require("../exceptions/DivideByZeroException");

class Product extends AbstractContainer {
  constructor(constructors, sign, mulSign) {
    super(constructors, [], sign, mulSign);
    this.type = "product";
    this.connectionStrength = 2;
  }

  evaluate() {
    var result = this.new("Number", 1);
    for (var element of this.getElements()) {
      var value = element.evaluate();
      if (value.getType() == "number") {
        if (value.getValue().equals(0) && value.getMulSign().equals(-1)) {
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

  isMultipleOf(node) {
    if (node.type == "product") {
      var thisNonEvaluables = this.new("Product");
      var nodeNonEvaluables = this.new("Product");
      thisNonEvaluables.setElements(this.getNonEvaluables());
      nodeNonEvaluables.setElements(node.getNonEvaluables());

      // replace with break down-------------------
      var thisSimplified = thisNonEvaluables.simplify();
      var nodeSimplified = nodeNonEvaluables.simplify();
      // ------------------------------------------

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

  breakDown() {
    var newElements = [];
    var sums = [];
    if (this.isEvaluable()) {
      return this.evaluate();
    }
    for (var rawElement of this.getElements()) {
      rawElement.applyMulSign(this.getMulSign());
      var element = rawElement.breakDown();
      if (element.getType() == "product") {
        for (var subElement of element.getElements()) {
          subElement.applyMulSign(element.getMulSign());
          newElements.push(subElement);
        }
      } else if (element.getType() == "sum") {
        sums.push(element);
      } else {
        newElements.push(element)
      }
    }
    this.resetMulSign();
    var result;
    if (sums.length > 0) {
      result = sums[0];
      sums.splice(0, 1); // remove first element
      for (var sum of sums) {
        result = result.mulSum(sum, Product, scope);
      }
    }
    if (newElements.length > 1) {
      this.setElements(newElements);
      if (result) {
        return result.mulNonSum(this, Product);
      }
      return this;
    } else if (newElements.length == 1){
      if (result) {
        return result.mulNonSum(newElements[0], Product);
      }
      return newElements[0];
    } else {
      return result;
    }
  }

  getSerializeSeperator(element, first) {
    var seperator = element.getMulSignString();
    if (seperator == "/") {
      if (first) {
        return seperator + " ";
      }
      return " " + seperator + " ";
    }
    if (!first) {
      return " ";
    }
    return "";
  }
}

module.exports = Product;
