const constructors = require("../constructors");
const gFuncTools   = require("./gFuncTools");
const Decimal      = constructors.Decimal;
const Scope        = require("../scope/Scope");

const sectionsN    = 2*Math.pow(10, 4);

function scan(expr, start, stop, varName) {
  var increment = Decimal.div(
    Decimal.sub(stop, start),
    sectionsN * 2 + 1
  );

  var points = [],
      vScope = new Scope,
      value  = new constructors.Number(constructors);

  vScope.setValue(varName, value);
  expr.getStack().push(vScope);

  for (var currX = new Decimal(start); !currX.gt(stop); currX = currX.plus(increment)) {
    value.setSign(Decimal.sign(currX));
    value.setValue(currX.abs());
    points.push(
      expr.evaluate().getDecimalValue()
    );
  }

  return points;
}

module.exports = {

  // uses simpson's rule to approx
  nintegral: function(parameters, stack) {
    var params = gFuncTools.paramCheck(parameters, ["term", "number", "number"]),
        expr   = params[0].breakDown().summarize();
    console.log("test");
    // limits
    var leftLimit  = Decimal.min(params[1].getDecimalValue(), params[2].getDecimalValue()),
        rightLimit = Decimal.max(params[1].getDecimalValue(), params[2].getDecimalValue());

    // check var count
    var varName;
    if (expr.getSymbolNames().length == 1) {
      varName = expr.getSymbolNames()[0];
    } else {
      throw "invalid variable count";
    }

    var points  = scan(expr, leftLimit, rightLimit, varName),
        h       = rightLimit.minus(leftLimit).div(sectionsN),
        r       = new Decimal(0);

    r.add(points[0]);
    r.add(points[points.length - 1]);

    for (var n = 1; n <= sectionsN; n++) {
      if (n < sectionsN) {
        r = r.add(points[2 * n + 1].mul(2));
      }
      r = r.add(points[2 * n].mul(4));
    }

    return new constructors.Number(constructors, h.mul(r).div(6));
  }
}
