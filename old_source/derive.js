const Eval = require('./eval.js');
const Tensor = require('./tensor.js');
const Utils = require('./solve.js').utils;

// TEST IMPORT Parser
const Parser = require('@behrenle/number-drive-parser');
//--------------------

const DERIVE_DELTA = Math.pow(10, -12);

function derive() {
  // check parameters
  var args = Array.prototype.slice.call(arguments);
  if (args.length != 3) {
    throw "derive: Invalid number of arguments. Usage: derive(expression, position)";
  }
  var scope = args[2];
  var expNode = args[0];
  var pos     = Eval.evalNode(args[1], scope);

  // check nodes
  if (typeof pos != "number") {
    throw "derive: position is not a number";
  }
  if (expNode.type == "equation" || expNode.type == "definition") {
    throw "derive: can't derive equation or definition";
  }

  // get variable symbol
  var varSymbols = Utils.getVariableSymbols(expNode, scope);
  if (varSymbols.length != 1) {
    throw "derive: expected one variable got " + varSymbols.length;
  }

  // interpolate
  console.log(pos - DERIVE_DELTA,pos, pos + DERIVE_DELTA, DERIVE_DELTA);
  var iParams = qInterpolate(
    pos - DERIVE_DELTA, Eval.evalNode(expNode, {...scope, ...{[varSymbols[0]]: pos - DERIVE_DELTA}}),
    pos,                Eval.evalNode(expNode, {...scope, ...{[varSymbols[0]]: pos}}),
    pos + DERIVE_DELTA, Eval.evalNode(expNode, {...scope, ...{[varSymbols[0]]: pos + DERIVE_DELTA}})
  );
  console.log(iParams);
  return 2 * iParams.a * pos + iParams.b;
}

function qInterpolate(x1, y1, x2, y2, x3, y3) {
  var a, b, c;
  a = (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1-y2)) / ((x1 - x2) * (x1 - x3) * (x3 - x2));
  b = (Math.pow(x1, 2) * (y2 - y3) + Math.pow(x2, 2) * (y3 - y1) + Math.pow(x3, 2) * (y1 - y2)) / ((x1 - x2) * (x1 - x3) * (x2 - x3));
  c = (Math.pow(x1, 2) * (x2 * y3 - x3 * y2) + x1 * (Math.pow(x3, 2) * y2 - Math.pow(x2, 2) * y3) + x2 * x3 * y1 * (x2 - x3)) / ((x1 - x2) * (x1 - x3) * (x2 - x3));
  return {a: a, b: b, c: c};
}

var testNode = Parser.parse("sin(x)");
var testPos = Parser.parse("2");
console.log(derive(testNode, testPos, {sin: function(x) {
  console.log(x, Math.sin(x));
  return Math.sin(x);
}}));


module.exports = {
  derive: derive,
};
