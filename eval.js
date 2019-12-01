const Parser = require('./parser.js');
const Tensor = require('./tensor.js');

function eval(str) {
  var root = Parser.parse(str);
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
        var v = Tensor.zeros(Tensor.getDimensions(evalNode(node.elements[0])));
        for (var i = 0; i < node.elements.length; i++) {
          v = Tensor.sumTensors(v, evalNode(node.elements[i]));
        }
        return v;
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
          v = Tensor.mulScalarTensor(v, evalNode(node.elements[i]));
        } else if (typeof evalNode(node.elements[i]) == "number" && v instanceof Array) {
          if (node.elements[i].mulSign == "*") {
            v = Tensor.mulScalarTensor(evalNode(node.elements[i]), v);
          } else {
            v = Tensor.mulScalarTensor(evalNode(node.elements[i]), v, "/");
          }
        } else if (v instanceof Array && evalNode(node.elements[i]) instanceof Array) {
          var w = evalNode(node.elements[i]);
          var dims1 = Tensor.getDimensions(v);
          var dims2 = Tensor.getDimensions(w);
          var mulMode = Tensor.getMulMode(v, w);
          if (mulMode == "vec") {
            v = Tensor.mulVectors(v, w);
          } else if (mulMode == "mat") {
            v = Tensor.mulMatrices(v, w);
          } else if (mulMode == "matvec") {
            v = Tensor.transposeMatrix(
              Tensor.mulMatrices(
                v, Tensor.transposeVector(w)
              )
            )[0];
          } else if (mulMode == "vecmat") {
            v = Tensor.mulMatrices(
              Tensor.transposeMatrix(
                Tensor.transposeVector(v)
              ), w
            )[0];
          } else {
            throw "mul: incompatible tensors";
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

module.exports = {
  eval: eval,
  evalNode: evalNode
};
