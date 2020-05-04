const constructors = require("../constructors");
const tools = require("../pluginTools");
const utils = require("../utils");
const Decimal = constructors.Decimal;
const Scope = require("../scope/Scope");

const h = new Decimal("10e-6");

const funcs = {
  nderive: function(parameters, stack) {
    let params, grade;
    if (parameters.length == 2) {
      params = tools.checkParameters(parameters, ["term", "number"]);
      grade  = 1;
    } else {
      params = tools.checkParameters(parameters, ["term", "number", "number"]);
      grade  = params[2].getDecimalValue().toNumber();
      if (grade % 1 != 0 || grade < 0) {
        throw "invalid grade: Expected integer greater than zero";
      }
    }
    let expr = params[0].breakDown().summarize(),
        pos  = params[1].getDecimalValue();

    // check let count
    let varName;
    if (expr.getSymbolNames().length == 1) {
      varName = expr.getSymbolNames()[0];
    } else {
      throw "invalid variable count";
    }

    // prepare evaluation
    let vScope = new Scope(),
        value  = new constructors.Number(constructors);

    vScope.setValue(varName, value);
    expr.getStack().push(vScope);

    // calculate result
    let result = new constructors.Decimal(0),
        eValue, rValue;

    for (let i = 0; i <= grade; i++) {
      let c1 = new constructors.Decimal(-1).pow(i),
          c2 = utils.binco(grade, i);

      eValue = pos.add(
        new Decimal(grade).
        sub(
          new Decimal(2 * i)
        ).mul(h));
      value.setSign(Decimal.sign(eValue));
      value.setValue(eValue.abs());
      rValue = expr.evaluate().getDecimalValue();

      result = result.add(rValue.mul(c1.mul(c2)));
    }

    // remove scope
    expr.getStack().pop();

    return new constructors.Number(constructors, result.div(h.mul(2).pow(grade)));
  }
}

module.exports = {
  name: "core-nderive",
  genericFunctions: funcs,
  inlineDefinitions: [],
};
