import UnknownNodeException from "./exceptions/UnknownNodeException.js";
import InvalidTensorFormatException from "./exceptions/InvalidTensorFormatException.js";
import Nodes from "./constructors.js";
import Decimal from 'decimal.js';

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
  return cDim.concat(dim);
}

function getTensorElements(listNode) {
  if (listNode.elements[0].type == "list") {
    var elements = [];
    for (var element of listNode.elements) {
      var subElements = getTensorElements(element);
      elements = elements.concat(subElements);
    }
    return elements;
  }
  return listNode.elements;
}

class AstBuilder {
  constructor() {}

  getSign(parseTreeNode) {
    return parseTreeNode.sign == "-"
      ? new Decimal(-1)
      : new Decimal(1);
  }

  getMulSign(parseTreeNode) {
    return parseTreeNode.mulSign == "/"
      ? new Decimal(-1)
      : new Decimal(1);
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

      case "function":
        return this.buildFunctionCall(parseTreeNode);

      case "definition":
        return this.buildDefinition(parseTreeNode);

      case "equation":
        return this.buildEquation(parseTreeNode);

      default:
        throw new UnknownNodeException(parseTreeNode);
    }
  }

  buildNumber(parseTreeNode) {
    return new Nodes.Number(
      parseTreeNode.value,
      this.getSign(parseTreeNode),
      this.getMulSign(parseTreeNode)
    );
  }

  buildSum(parseTreeNode) {
    var node = new Nodes.Sum(
      this.getSign(parseTreeNode),
      this.getMulSign(parseTreeNode)
    );
    for (var element of parseTreeNode.elements) {
      node.push(this.build(element));
    }
    return node;
  }

  buildProduct(parseTreeNode) {
    var node = new Nodes.Product(
      this.getSign(parseTreeNode),
      this.getMulSign(parseTreeNode)
    );
    for (var element of parseTreeNode.elements) {
      node.push(this.build(element));
    }
    return node;
  }

  buildPower(parseTreeNode) {
    var node = new Nodes.Power(
      this.getSign(parseTreeNode),
      this.getMulSign(parseTreeNode)
    );
    node.push(this.build(parseTreeNode.elements[0]));
    node.push(this.build(parseTreeNode.elements[1]));
    return node;
  }

  buildSymbol(parseTreeNode) {
    return new Nodes.Symbol(
      parseTreeNode.value,
      this.getSign(parseTreeNode),
      this.getMulSign(parseTreeNode)
    );
  }

  buildTensor(parseTreeNode) {
    var dims = getDims(parseTreeNode);
    var node = new Nodes.Tensor(
      dims,
      this.getSign(parseTreeNode),
      this.getMulSign(parseTreeNode)
    );
    node.elements = getTensorElements(parseTreeNode).map(
      n => this.build(n)
    );
    return node;
  }

  buildFunctionCall(parseTreeNode) {
    var node = new Nodes.FunctionCall(
      parseTreeNode.name,
      this.getSign(parseTreeNode),
      this.getMulSign(parseTreeNode)
    );
    node.setElements(parseTreeNode.elements.map(
      n => this.build(n)
    ));
    return node;
  }

  buildDefinition(parseTreeNode) {
    var node = new Nodes.Definition();
    node.setElements(parseTreeNode.elements.map(
      n => this.build(n)
    ));
    return node;
  }

  buildEquation(parseTreeNode) {
    var node = new Nodes.Equation();
    node.setElements(parseTreeNode.elements.map(
      n => this.build(n)
    ));
    return node;
  }
}

export default new AstBuilder();
