const Eval = require('./eval.js');
const Tensor = require('./tensor.js');
const Utils = require('./solve.js').utils;

function derive() {
  // check parameters
  var args = Array.prototype.slice.call(arguments);
  if (args.length != 3) {
    throw "derive: Invalid number of arguments. Usage: derive(expression, position)";
  }
  var scope = args[2];
  var expNode = args[0];
  var posNode = Eval.evalNode(args[1], scope);

  // check nodes
  if (posNode.type != "number") {
    throw "derive: position is not a number";
  }
  if (expNode.type == "equation" || expNode.type == "definition") {
    throw "derive: can't derive equation or definition";
  }
  


  // WIP:
  // * quadratic interpolation
  // * return result
}

function qInterpolate(x1, y1, x2, y2, x3, y3) {
  var a, b, c;
  a = (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1-y2)) / ((x1 - x2) * (x1 - x3) * (x3 - x2));
  b = (Math.pow(x1, 2) * (y2 - y3) + Math.pow(x2, 2) * (y3 - y1) + Math.pow(x3, 2) * (y1 - y2)) / ((x1 - x2) * (x1 - x3) * (x2 - x3));
  c = (Math.pow(x1, 2) * (x2 * y3 - x3 * y2) + x1 * (Math.pow(x3, 2) * y2 - Math.pow(x2, 2) * y3) + x2 * x3 * y1 * (x2 - x3)) / ((x1 - x2) * (x1 - x3) * (x2 - x3));
  return {a: a, b: b, c: c};
}

module.exports = {
  derive: derive,
};
