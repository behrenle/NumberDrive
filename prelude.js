import Scope from "./scope/Scope.js";
import Stack from "./scope/Stack.js";
import GenericFunction from "./nodes/GenericFunction.js";
import parse from "./parse.js";
import plugins from "./pluginLoader.js";

export default () => {
  let stack = new Stack();
  stack.push(new Scope());

  // load generic functions
  plugins.forEach((plugin) => {
    Object.entries(plugin.genericFunctions || {}).forEach((entry) => {
      let name = entry[0],
          func = entry[1];

      stack.setValue(name, new GenericFunction(func));
  })});

  // load inline definitions and constants with special precision
  plugins.forEach((plugin) => {
    if (plugin.inlineDefinitions)
      plugin.inlineDefinitions.forEach((defStr) => {
        let def = parse(defStr);
        def.setStack(stack);
        def.evaluate();
  })});


  return stack;
};
