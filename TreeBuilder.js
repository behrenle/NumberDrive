const Decimal = require('decimal.js');
const Number = require("./nodes/Number");
const Sum = require("./nodes/Sum");
const Product = require("./nodes/Product");
const Power = require("./nodes/Power");

class TreeBuilder {
  getSign(parseTreeNode) {
    return parseTreeNode.sign == "-" ? new Decimal(-1) : new Decimal(1);
  }

  getMulSign(parseTreeNode) {
    return parseTreeNode.mulSign == "/" ? new Decimal(-1) : new Decimal(1);
  }

  build(parseTreeNode) {
    switch (parseTreeNode.type) {
      case "number":
        return this.buildNumber(parseTreeNode);

      case "sum":
        return this.buildSum(parseTreeNode);

      case "product":
        return this.buildProduct(parseTreeNode);

      case "power":
        return this.buildPower(parseTreeNode);
    }
  }

  buildNumber(parseTreeNode) {
    return new Number(
      parseTreeNode.value,
      this.getSign(parseTreeNode),
      this.getMulSign(parseTreeNode)
    );
  }

  buildSum(parseTreeNode) {
    var node = new Sum(
      this.getSign(parseTreeNode),
      this.getMulSign(parseTreeNode)
    );
    for (var element of parseTreeNode.elements) {
      node.push(this.build(element));
    }
    return node;
  }

  buildProduct(parseTreeNode) {
    var node = new Product(
      this.getSign(parseTreeNode),
      this.getMulSign(parseTreeNode)
    );
    for (var element of parseTreeNode.elements) {
      node.push(this.build(element));
    }
    return node;
  }

  buildPower(parseTreeNode) {
    var node = new Power();
    node.push(this.build(parseTreeNode.base));
    node.push(this.build(parseTreeNode.exp));
    return node;
  }
}

module.exports = TreeBuilder;
