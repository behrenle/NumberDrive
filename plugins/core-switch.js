const tools = require("../pluginTools");

function switchFunc(parameters, stack) {
  let params = tools.checkParameters(parameters, ["number", "term", "term"]),
      switchParam = params[0].getDecimalValue(),
      expression1 = params[1];
      expression2 = params[2];

  if (switchParam.gte(0))
    return expression1.evaluate();

  return expression2.evaluate();
}

module.exports = {
  name: "core-switch",
  genericFunctions: {
    ["switch"]: switchFunc,
  },
  inlineDefinitions: [],
};
