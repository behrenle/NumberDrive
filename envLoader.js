const Scope = require("./scope/Scope");
const Stack = require("./scope/Stack");
const GenericFunction = require("./nodes/GenericFunction");
const constructors = require("./constructors");

const conf = {
  // constants
  pi:  true,
  e:   true,

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
}

const funcs = {
  ...require("./env/trigonometry"),
  ...require("./env/tensor"),
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

module.exports = stack;
