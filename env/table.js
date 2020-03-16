const constructors = require("../constructors");
const gFuncTools   = require("./gFuncTools");
const Decimal      = constructors.Decimal;
const Scope        = require("../scope/Scope");

module.exports = {
  table: function(parameters, stack) {
    var params, expr, lLimit, uLimit, stepSize;
    if (parameters.length == 4) {
      params   = gFuncTools.paramCheck(parameters, ["term", "number", "number", "number"]);
      expr     = params[0].breakDown().summarize();
      lLimit   = params[1].getDecimalValue();
      uLimit   = params[2].getDecimalValue();
      stepSize = params[3].getDecimalValue();
    } else {
      params   = gFuncTools.paramCheck(parameters, ["term", "number", "number"]);
      expr     = params[0].breakDown().summarize();
      lLimit   = params[1].getDecimalValue();
      uLimit   = params[2].getDecimalValue();
      stepSize = new Decimal(1);
    }

    // check var count
    var varName;
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

    var result = new constructors.Tensor(constructors);
    var value  = new constructors.Number(constructors, lLimit);
    expr.getStack().setValue(varName, value);

    for (var i = lLimit; !i.gt(uLimit); i = i.plus(stepSize)) {
      value.setSign(Decimal.sign(i));
      value.setValue(i.abs());
      result.push(new constructors.Number(constructors, i));
      result.push(expr.evaluate());
    }

    result.reshape([2, result.getElements().length / 2]);

    return result;
  }
}
