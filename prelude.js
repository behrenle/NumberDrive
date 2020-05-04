const Scope = require("./scope/Scope");
const Stack = require("./scope/Stack");
const GenericFunction = require("./nodes/GenericFunction");
const constructors = require("./constructors");
const parse = require("./parse");

module.exports = (plugins) => {
  let stack = new Stack();
  stack.push(new Scope());

  // load generic functions
  plugins.forEach((plugin) => {
    Object.entries(plugin.genericFunctions || {}).forEach((entry) => {
      let name = entry[0],
          func = entry[1];

      stack.setValue(name, new GenericFunction(constructors, func));
  })});

  // load inline definitions
  plugins.forEach((plugin) => {
    if (plugin.inlineDefinitions)
      plugin.inlineDefinitions.forEach((defStr) => {
        let def = parse(defStr);
        def.setStack(stack);
        def.evaluate();
  })});

  return stack;
};
