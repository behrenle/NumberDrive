import tools from "../../pluginTools.js";
import manual from "./manual/switch.js";

function switchFunc(parameters, stack) {
  let params = tools.checkParameters(parameters, ["number", "term", "term"]),
      switchParam = params[0].getDecimalValue(),
      expression1 = params[1],
      expression2 = params[2];

  if (switchParam.gte(0))
    return expression1.evaluate();

  return expression2.evaluate();
}

export default {
  name: "core-switch",
  genericFunctions: {
    ["switch"]: switchFunc,
  },
  inlineDefinitions: [],
  manual: manual
};
