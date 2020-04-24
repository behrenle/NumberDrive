const Scope = require("./scope/Scope");
const Stack = require("./scope/Stack");
const GenericFunction = require("./nodes/GenericFunction");
const constructors = require("./constructors");
const TreeBuilderC = require("./TreeBuilder.js");
const TreeBuilder  = new TreeBuilderC();
const Parser       = require('@behrenle/number-drive-parser');


const conf = {
  // constants
  pi:  true,
  e:   true,
  deg: true,

  // trigonometric functions
  sin: true,
  cos: true,
  tan: true,
  sinh: true,
  cosh: true,
  tanh: true,
  asin: true,
  acos: true,
  atan: true,
  asinh: true,
  acosh: true,
  atanh: true,

  // tensor functions
  dimensions: true,
  get:        true,
  set:        true,
  det:        true,

  // advanced functions
  solve: true,
  nsolve: true,
  nintegral: true,
  nderive: true,

  // table
  table: true,

  // misc
  exp: true,
  ln:  true,
  log: true,
  min: true,
  max: true,
  sqrt: true,
  root: true,
  delete: true,

  // probability
  normal: true,
  binco: true
}

const funcs = {
  ...require("./env/trigonometry"),
  ...require("./env/tensor"),
  ...require("./env/linearSolve"),
  ...require("./env/numericSolve"),
  ...require("./env/numericIntegral"),
  ...require("./env/numericDerivative"),
  ...require("./env/table"),
  ...require("./env/misc"),
}

const consts = {
  ...require("./env/constants"),
}

var stack = new Stack();
stack.push(new Scope()); // generic functions and constants scope

// load generic functions
var funcKeys = Object.keys(funcs);
for (var name of funcKeys ) {
  if (conf[name]) {
    stack.setValue(
      name,
      new GenericFunction(
        constructors,
        funcs[name]
      )
    );
  }
}

// load constatns
var constKeys = Object.keys(consts);
for (var name of constKeys) {
  if (conf[name]) {
    stack.setValue(name, consts[name]);
  }
}

// load inline functions and constants
stack.push(new Scope());
var inlineDefs = require("./env/inlineDefs.json");

for (var def of inlineDefs) {
  for (var dep of def.deps) {
    if (!conf[dep]) {
      continue;
    }
  }
  var ptNode  = Parser.parse(def.def);
  var astNode = TreeBuilder.build(ptNode);
  astNode.setStack(stack);
  astNode.evaluate();
}

module.exports = stack;
