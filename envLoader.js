const Scope = require("./scope/Scope");
const Stack = require("./scope/Stack");
const GenericFunction = require("./nodes/GenericFunction");
const constructors = require("./constructors");

const conf = {
  sin: true,
  cos: true,
}

const funcs = {
  ...require("./env/trigonometry.js"),
}

var stack = new Stack();
stack.push(new Scope()); // generic functions and constants scope

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

module.exports = stack;
