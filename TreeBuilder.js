const UnknownNodeException = require("./exceptions/UnknownNodeException");
const InvalidTensorFormatException = require("./exceptions/InvalidTensorFormatException");

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

function dimEquals(dims1, dims2) {
  if (dims1 instanceof Array && dims2 instanceof Array) {
    if (dims1.length == dims2.length) {
      for (var i = 0; i < dims1.length; i++) {
        if (dims1[i] != dims2[i]) {
          return false;
        }
      }
      return true;
    }
  }
  return false;
}

function getDims(listNode) {
  if (listNode.type != "list" || listNode.elements.length == 0) {
    return [];
  }
  var dim = [listNode.elements.length],
      cDim = getDims(listNode.elements[0]);
  for (var i = 1; i < listNode.elements.length; i++) {
    if (!dimEquals(cDim, getDims(listNode.elements[i]))) {
      throw new InvalidTensorFormatException;
    }
  }
  return cDim.concat(dim); // column-major order
}

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

      case "list":
        return this.buildTensor(parseTreeNode);

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

  buildTensor(parseTreeNode) {
    var dims = getDims(parseTreeNode);
    console.log(dims);
    
  }
}

module.exports = TreeBuilder;
