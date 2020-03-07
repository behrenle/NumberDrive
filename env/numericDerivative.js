const constructors = require("../constructors");
const gFuncTools   = require("./gFuncTools");
const Decimal      = constructors.Decimal;
const Scope        = require("../scope/Scope");

const h = new Decimal("10e-6");

module.exports = {
  nderive: function(parameters, stack, grade) {
    var params, grade;
    if (parameters.length == 2) {
      params = gFuncTools.paramCheck(parameters, ["term", "number"]);
      grade  = 1;
    } else {
      params = gFuncTools.paramCheck(parameters, ["term", "number", "number"]);
      grade  = params[2].getDecimalValue().toNumber();
      if (grade % 1 != 0 || grade < 0) {
        throw "invalid grade number";
      }
    }
    var expr = params[0].breakDown().summarize(),
        pos  = params[1].getDecimalValue();

    // check var count
    var varName;
    if (expr.getSymbolNames().length == 1) {
      varName = expr.getSymbolNames()[0];
    } else {
      throw "invalid variable count";
    }

    // prepare evaluation
    var vScope = new Scope(),
        value  = new constructors.Number(constructors);

    vScope.setValue(varName, value);
    expr.getStack().push(vScope);

    // calculate result
    var result = new constructors.Decimal(0),
        eValue, rValue;

    for (var i = 0; i <= grade; i++) {
      var c1 = new constructors.Decimal(-1).pow(i),
          c2 = gFuncTools.binco(grade, i);

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

    return new constructors.Number(constructors, result.div(h.mul(2).pow(grade)));
  }
}
