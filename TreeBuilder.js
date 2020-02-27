const UnknownNodeException = require("./exceptions/UnknownNodeException");

const constructors = {
  AbstractNode:      require("./nodes/AbstractNode"),
  AbstractContainer: require("./nodes/AbstractContainer"),
  Decimal:           require('decimal.js'),
  Number:            require("./nodes/Number"),
  Symbol:            require("./nodes/Symbol"),
  Sum:               require("./nodes/Sum"),
  Product:           require("./nodes/Product"),
  Power:             require("./nodes/Power"),
};

class TreeBuilder {
  getSign(parseTreeNode) {
    return parseTreeNode.sign == "-"
      ? new constructors.Decimal(-1)
      : new constructors.Decimal(1);
  }

  getMulSign(parseTreeNode) {
    return parseTreeNode.mulSign == "/"
      ? new constructors.Decimal(-1)
      : new constructors.Decimal(1);
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

      case "symbol":
        return this.buildSymbol(parseTreeNode);

      default:
        throw new UnknownNodeException(parseTreeNode);
    }
  }

  buildNumber(parseTreeNode) {
    return new constructors.Number(
      constructors,
      parseTreeNode.value,
      this.getSign(parseTreeNode),
      this.getMulSign(parseTreeNode)
    );
  }

  buildSum(parseTreeNode) {
    var node = new constructors.Sum(
      constructors,
      this.getSign(parseTreeNode),
      this.getMulSign(parseTreeNode)
    );
    for (var element of parseTreeNode.elements) {
      node.push(this.build(element));
    }
    return node;
  }

  buildProduct(parseTreeNode) {
    var node = new constructors.Product(
      constructors,
      this.getSign(parseTreeNode),
      this.getMulSign(parseTreeNode)
    );
    for (var element of parseTreeNode.elements) {
      node.push(this.build(element));
    }
    return node;
  }

  buildPower(parseTreeNode) {
    var node = new constructors.Power(
      constructors,
      this.getSign(parseTreeNode),
      this.getMulSign(parseTreeNode)
    );
    node.push(this.build(parseTreeNode.base));
    node.push(this.build(parseTreeNode.exp));
    return node;
  }

  buildSymbol(parseTreeNode) {
    return new constructors.Symbol(
      constructors,
      parseTreeNode.value,
      this.getSign(parseTreeNode),
      this.getMulSign(parseTreeNode)
    );
  }
}

module.exports = TreeBuilder;
