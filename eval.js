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
      console.log(typeof evalNode(node.elements[0]));
      if (typeof evalNode(node.elements[0]) == "number") {
        return sumScalar(node);
      } else if (evalNode(node.elements[0]) instanceof Array) {
        return sumTensor(node);
      } else {
        throw "unsupported types";
      }
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
