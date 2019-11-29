const Parser = require('./parser.js');

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

    case "sum":
      console.log(typeof evalNode(node.elements[0]));
      if (typeof evalNode(node.elements[0]) == "number") {
        return sumScalar(node);
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

module.exports = {
  eval: eval,
  evalNode: evalNode
};
