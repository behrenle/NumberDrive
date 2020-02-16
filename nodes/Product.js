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
    result.applySign(this.getSign());
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
        result = result.mulSum(sum);
      }
    }
    if (newElements.length > 1) {
      this.setElements(newElements);
      if (result) {
        return result.mulNonSum(this);
      }
      return this;
    } else if (newElements.length == 1){
      if (result) {
        return result.mulNonSum(newElements[0]);
      }
      return newElements[0];
    } else {
      return result;
    }
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
              var node1 = nEvals[i];
              var node2 = nEvals[k];
              if (node1.getType() == "power" && node2.getType() == "power") {
                // if base1 == base2 && exp1.evaluable && exp2.evaluable
                // new exp --> exp1 +/- exp2
              } else if (node1.getType() == "power" && node2.getType() == "symbol") {
                // ++/-- power exponent by one if exponent is evaluable
              } else if (node1.getType() == "symbol" && node2.getType() == "symbol") {
                // x / x -> 1, x * x -> x^2
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
            // handle if nextNEvals has no elements
            //   if evals.length == 0 then
            //     evals.push( new number 1)
            //     -> do not return empty product
            nEvals = nextNEvals;
            break;
          }
        }
        // overwrite
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
      //console.log("ELSEEEEEEEEEE")
      var element = result.getElement(0);
      element.applySign(result.getSign());
      element.applyMulSign(result.getMulSign());
      return element;
    }

    return result;
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
