const constructors = require("../constructors");
const gFuncTools   = require("./gFuncTools");
const Decimal      = constructors.Decimal;
const Scope        = require("../scope/Scope");

// config stuff
const scanN     = Math.pow(10, 4);
const closeZero = new constructors.Decimal("10e-40");

function scan(expr, start, stop, varName) {
  var increment = Decimal.div(
    Decimal.sub(stop, start),
    scanN
  );

  var points = [],
      vScope = new Scope,
      value  = new constructors.Number(constructors);

  vScope.setValue(varName, value);
  expr.getStack().push(vScope);

  for (var currX = new Decimal(start); !currX.gt(stop); currX = currX.plus(increment)) {
    value.setSign(Decimal.sign(currX));
    value.setValue(currX.abs());
    points.push([
      value.getDecimalValue(),
      expr.evaluate().getDecimalValue()
    ]);
  }

  return points;
}

function filterSignFlips(points) {
  var flips = [];

  for (var i = 1; i < points.length; i++) {
    if (
      (
        points[i][1].gte(0) &&
        !points[i - 1][1].gte(0)
      ) || (
        !points[i][1].gte(0) &&
        points[i - 1][1].gte(0)
      )
    ) {
      flips.push([points[i - 1][0], points[i + 1][0]]);
    }
  }

  return flips;
}

module.exports = {
  nsolve: function(parameters, stack) {
    var params   = gFuncTools.paramCheck(parameters, ["equation", "number", "number"]),
        rExpr    = params[0].new("Sum"),
        subExpr1 = params[0].getElement(0).clone(),
        subExpr2 = params[0].getElement(1).clone();

    // build expression
    subExpr2.applySign(-1);
    rExpr.push(subExpr1);
    rExpr.push(subExpr2);
    var expr = rExpr.breakDown().summarize();

    // limits
    var leftLimit  = constructors.Decimal.min(params[1].getDecimalValue(), params[2].getDecimalValue()),
        rightLimit = constructors.Decimal.max(params[1].getDecimalValue(), params[2].getDecimalValue());

    // check var count
    var varName;
    if (expr.getSymbolNames().length == 1) {
      varName = expr.getSymbolNames()[0];
    } else {
      throw "invalid variable count";
    }

    console.log(expr.serialize());

    var points = scan(expr, leftLimit, rightLimit, varName);

    console.log("flips:")
    console.log(filterSignFlips(points).map(x => [x[0].toString(), x[1].toString()]));
  }
};
