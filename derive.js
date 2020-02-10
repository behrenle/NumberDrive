const Eval = require('./eval.js');
const Tensor = require('./tensor.js');
const Utils = require('./solve.js').utils;

function derive() {
  // check parameters
  var args = Array.prototype.slice.call(arguments);
  if (args.length != 3) {
    throw "Invalid number of arguments. Usage: derive(expression, position)";
  }
  var scope = args[2];
  var expNode = args[0];
  var posNode = Eval.evalNode(args[1], scope);

  // WIP:
  // * check nodes
  // * quadratic interpolation
  // * return result
}

module.exports = {
  derive: derive,
};
