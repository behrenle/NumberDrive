import AbstractContainer from "./AbstractContainer.js";
import { registerNode } from "./AbstractNode.js";
import DevideByZeroException from "../exceptions/DivideByZeroException.js";

class Product extends AbstractContainer {
  constructor(sign, mulSign) {
    super([], sign, mulSign);
    this.type = "product";
    this.connectionStrength = 2;
  }

  evaluate() {
    // added Number(1) to prevent empty product evaluation
    let elements = [this.new("Number", 1), ...this.getElements()];
    let result = elements
      .map((element) => element.evaluate())
      .reduce((acc, value) => {
        if (!value)
          return acc;

        let leftType = acc.getType(),
            rightType = value.getType(),
            devide = value.getMulSign().equals(-1);

        if (leftType == "number" && rightType == "number") {
          if (value.getValue().equals(0) && devide)
            throw new DevideByZeroException();

          return acc.mulNumber(value);
        }

        if (leftType == "tensor" && rightType == "number")
          return acc.mulNumber(value).evaluate();

        if (leftType == "number" && rightType == "tensor" && !devide)
          return value.mulNumber(acc).evaluate();

        if (leftType == "tensor" && rightType == "tensor" && !devide)
          return acc.mulTensor(value).evaluate();

        throw "undefined operation";
      });

    result.applySigns(this);
    return result;
  }

  squashSigns() {
    for (var element of this.getElements()) {
      this.applySign(element.getSign());
      element.setSign(1);
    }
  }

  getCoefficient() {
    var evaluables = this.new("Product", this.getSign(), this.getMulSign());
    evaluables.setElements(this.getEvaluables());
    evaluables.squashSigns();
    return evaluables.evaluate();
  }

  isMultipleOf(node) {
    if (node.type == "product") {
      this.squashSigns();
      node.squashSigns();
      var thisNonEvaluables = this.new("Product");
      var nodeNonEvaluables = this.new("Product");
      thisNonEvaluables.setElements(this.getNonEvaluables());
      nodeNonEvaluables.setElements(node.getNonEvaluables());
      var thisBrokeDown = thisNonEvaluables.breakDown();
      var nodeBrokeDown = nodeNonEvaluables.breakDown();
      if (thisBrokeDown.equals(nodeBrokeDown)) {
        return true;
      }
    } else if (node.type == "symbol") {
      var nonEvaluables = this.getNonEvaluables();
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
    if (this.isEvaluable()) {
      return this.evaluate();
    }

    let elements = this.getElements().map(
      (element) => element.breakDown());
    let sumElements = elements.filter(
      (element) => element.getType() == "sum");
    let productElements = elements.filter(
      (element) => element.getType() == "product");
    let otherElements = elements.filter(
      (element) => element.getType() != "sum" && element.getType() != "product");

    // multiply sums by each other
    let sumResult;
    if (sumElements.length > 0)
      sumResult = sumElements.reduce(
        (acc, value) => acc.mulSum(value));

    // combine products and append otherElements
    let productResult = this.new("Product");
    productElements.forEach((product) => {
      product.getElement(0).applySign(product.getSign());
      product.getElements().forEach((item) => {
        let newItem = item.clone()
        newItem.applyMulSign(product.getMulSign());
        productResult.push(newItem);
    })});
    otherElements.forEach((element) => productResult.push(element));

    // compose result
    let result;
    if (sumResult) {
      if (productResult.getLength() > 0) {
        result = sumResult.mulNonSum(productResult);
      } else {
        result = sumResult;
      }
    } else {
      result = productResult;
    }
    result.applySigns(this);
    return result;
  }

  summarize() {
    var result = this.new("Product", this.getSign(), this.getMulSign());
    var evals = this.getEvaluables();
    var nEvals = this.getNonEvaluables();

    // combine evals
    var comb = this.new("Product");
    comb.setElements(evals);
    result.push(comb.evaluate());

    // combine nEvals
    if (nEvals.length > 0) {
      // ... handle while condition
      var simplified, nextNEvals;
      do {
        simplified = false;
        nextNEvals = [];
        for (var i = 0; i < nEvals.length; i++) {
          for (var k = 0; k < nEvals.length; k++) {
            if (i != k) {
              var node1 = nEvals[i],
                  node2 = nEvals[k];

              if (node1.getType() == "power" && node2.getType() == "power") {
                var base1 = node1.getBase(),
                    base2 = node2.getBase();
                if (base1.getType() == "symbol" && base1.equals(base2)) {
                  var exp1 = node1.getExponent(),
                      exp2 = node2.getExponent();
                  if (exp1.isEvaluable() && exp2.isEvaluable()) {
                    var newExp = this.new("Sum");
                    exp1.applySign(node1.getMulSign());
                    exp2.applySign(node2.getMulSign());
                    newExp.push(exp1);
                    newExp.push(exp2);
                    newExp = newExp.evaluate();
                    var comb = this.new("Power");
                    comb.setBase(this.new("Symbol", base1.getName()));
                    comb.setExponent(newExp);
                    comb.applySign(node1.getSign());
                    comb.applySign(node2.getSign());
                    for (var j = 0; j < nEvals.length; j++) {
                      if (i != j && k != j) {
                        nextNEvals.push(nEvals[j]);
                      } else if (i == j) {
                        if (newExp.getValue() == 1) {
                          var nComb = comb.getBase();
                          nComb.applySign(comb.getSign());
                          nComb.applyMulSign(newExp.getSign());
                          nComb.applyMulSign(comb.getMulSign());
                          nextNEvals.push(nComb);
                        } else if (!newExp.getValue().equals(0)) {
                          nextNEvals.push(comb);
                        }
                      }
                    }
                    simplified = true;
                    break;
                  }
                }
              } else if (node1.getType() == "power" && node2.getType() == "symbol") {
                // ++/-- power exponent by one if exponent is evaluable
                var base = node1.getBase();
                if (base.getType() == "symbol" && base.getSign().equals(1)) {
                  if (base.getName() == node2.getName()) {
                    var exp = node1.getExponent();
                    if (exp.isEvaluable()) {
                      var newExp = this.new("Sum");
                      exp.applySign(node1.getMulSign());
                      newExp.push(exp);
                      newExp.push(this.new("Number", node2.getMulSign()));
                      newExp = newExp.evaluate();
                      var comb = this.new("Power");
                      comb.setBase(base);
                      comb.setExponent(newExp);
                      comb.applySign(node1.getSign());
                      comb.applySign(node2.getSign());
                      for (var j = 0; j < nEvals.length; j++) {
                        if (i != j && k != j) {
                          nextNEvals.push(nEvals[j]);
                        } else if (i == j) {
                          if (newExp.getValue() == 1) {
                            var nComb = comb.getBase();
                            nComb.applySign(comb.getSign());
                            nComb.applyMulSign(newExp.getSign());
                            nComb.applyMulSign(comb.getMulSign());
                            nextNEvals.push(nComb);
                          } else if (!newExp.getValue().equals(0)) {
                            nextNEvals.push(comb);
                          }
                        }
                      }
                      simplified = true;
                      break;
                    }
                  }
                }
              } else if (node1.getType() == "symbol" && node2.getType() == "symbol") {
                if (node1.getName() == node2.getName()) {
                  if (node1.getMulSign().equals(node2.getMulSign())) {
                    var cmb = this.new("Power");
                    cmb.applySign(node1.getSign());
                    cmb.applySign(node2.getSign());
                    cmb.setBase(this.new("Symbol", node1.getName()));
                    if (node1.getMulSign().equals(1)) {
                      cmb.setExponent(this.new("Number", 2));
                    } else {
                      cmb.setExponent(this.new("Number", -2));
                    }
                    for (var j = 0; j < nEvals.length; j++) {
                      if (j != i && j != k) {
                        nextNEvals.push(nEvals[j]);
                      } else if (j == i) {
                        nextNEvals.push(cmb);
                      }
                    }
                    simplified = true;
                    break;
                  } else {
                    result.getElement(0).applySign(node1.getSign());
                    result.getElement(0).applySign(node2.getSign());
                    for (var j = 0; j < nEvals.length; j++) {
                      if (j != i & j != k) {
                        nextNEvals.push(nEvals[j]);
                      }
                    }
                    simplified = true;
                    break;
                  }
                }
              }
            }
          }
          if (simplified) {
            nEvals = nextNEvals;
            break;
          }
        }
      } while(simplified);
      result.setElements(result.getElements().concat(nEvals));
    }
    result.squashSigns();
    if (result.getElements().length > 1) {
      if (result.getElement(0).getValue().equals(1)) {
        result.applySign(result.getElement(0).getSign());
        result.setElements(
          result.getElements().slice(1, result.getElements().length)
        );
      }
    }
    if (result.getElements().length == 1) {
      var element = result.getElement(0);
      element.applySign(result.getSign());
      element.applyMulSign(result.getMulSign());
      return element;
    }

    return result;
  }

  serialize() {
    var str = "";
    for (var i = 0; i < this.getElements().length; i++) {
      var element = this.getElement(i);
      if (element.getMulSignString() == "*" && i > 0) {
        str += " * ";
      }
      if (element.getMulSignString() == "/") {
        if (i == 0) {
          str += "/ ";
        } else {
          str += " / ";
        }
      }
      if (element.connectionStrength <= this.connectionStrength || element.getSignString() == "-") {
        str += "(" + (element.getSignString() == "-" ? "-" : "") + element.serialize(true) + ")";
      } else {
        str += element.serialize(true);
      }
    }
    return str;
  }
}

registerNode(Product);
export default Product;
