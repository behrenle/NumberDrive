import Nodes from "../../constructors.js";
import tools from "../../pluginTools.js";
import Scope from "../../scope/Scope.js";
import manual from "./manual/table.js";
import Decimal from 'decimal.js';

const funcs = {
  table: function(parameters, stack) {
    let params, expr, lLimit, uLimit, stepSize;
    if (parameters.length == 4) {
      params   = tools.checkParameters(parameters, ["term", "number", "number", "number"]);
      expr     = params[0].breakDown().summarize();
      lLimit   = params[1].getDecimalValue();
      uLimit   = params[2].getDecimalValue();
      stepSize = params[3].getDecimalValue();
    } else {
      params   = tools.checkParameters(parameters, ["term", "number", "number"]);
      expr     = params[0].breakDown().summarize();
      lLimit   = params[1].getDecimalValue();
      uLimit   = params[2].getDecimalValue();
      stepSize = new Decimal(1);
    }

    // check let count
    let varName;
    if (expr.getSymbolNames().length == 1) {
      varName = expr.getSymbolNames()[0];
    } else {
      throw "invalid variable count";
    }

    // check limits and stepSize
    if (
      (lLimit.gt(uLimit) && stepSize.gte(0))
      || (uLimit.gt(lLimit) && !stepSize.gt(0))
    ) {
      throw "invalid limits or step size";
    }

    let result = new Nodes.Tensor();
    let value  = new Nodes.Number(lLimit);
    let vScope = new Scope();
    vScope.setValue(varName, value);
    expr.getStack().push(vScope);

    for (let i = lLimit; !i.gt(uLimit); i = i.plus(stepSize)) {
      value.setSign(Decimal.sign(i));
      value.setValue(i.abs());
      result.push(new Nodes.Number(i));
      result.push(expr.evaluate());
    }

    result.reshape([2, result.getElements().length / 2]);
    expr.getStack().pop();

    return result;
  }
}

export default {
  name: "core-table",
  genericFunctions: funcs,
  inlineDefinitions: [],
  manual: manual
};
