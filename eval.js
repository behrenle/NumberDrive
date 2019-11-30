const Parser = require('./parser.js');
const Tools = require('./tools.js');

function eval(str) {
  var root = Parser.parse(str);
  console.log(JSON.stringify(root, null, 2));
  return evalNode(root);
}

function evalNode(node) {
  switch (node.type) {
    case "number":
      return node.value;
      break;

    case "list":
      var list = [];
      for (var i = 0; i < node.elements.length; i++) {
        list.push(evalNode(node.elements[i]));
      }
      return list;

    case "sum":
      if (typeof evalNode(node.elements[0]) == "number") {
        return sumScalar(node);
      } else if (evalNode(node.elements[0]) instanceof Array) {
        return sumTensor(node);
      } else {
        throw "unsupported types";
      }

    case "product":
      var v = 1;
      for (var i = 0; i < node.elements.length; i++) {
        if (typeof v == "number" && typeof evalNode(node.elements[i]) == "number") {
          if (node.elements[i].mulSign == "*") {
            v *= evalNode(node.elements[i]);
          } else {
            v /= evalNode(node.elements[i]);
          }
        } else if (typeof v == "number" && evalNode(node.elements[i]) instanceof Array) {
          v = Tools.productScalarTensor(v, evalNode(node.elements[i]));
        } else if (typeof evalNode(node.elements[i]) == "number" && v instanceof Array) {
          if (node.elements[i].mulSign == "*") {
            v = Tools.productScalarTensor(evalNode(node.elements[i]), v);
          } else {
            v = Tools.productScalarTensor(evalNode(node.elements[i]), v, "/");
          }
        }
      }
      return v;
  }
}

function sumScalar(node) {
  var v = 0;
  for (var i = 0; i < node.elements.length; i++)  {
    var r = evalNode(node.elements[i]);
    if (typeof r == "number") {
      if (node.elements[i].sign == "-") {
        v -= r;
      } else {
        v += r;
      }
    } else {
      throw "sum: incompatible types";
    }
  }
  return v;
}

function sumTensor(node) {
  var dims = Tools.tensorDims(evalNode(node.elements[0]));
  var v = Tools.zeroTensor(dims);
  for (var i = 0; i < node.elements.length; i++) {
    v = Tools.sumTensorPair(v, evalNode(node.elements[i]), "+", node.elements[i].sign);
  }
  return v;
}

module.exports = {
  eval: eval,
  evalNode: evalNode
};
