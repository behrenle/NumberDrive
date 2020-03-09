const constructors = require("../constructors");
const gFuncTools   = require("./gFuncTools");
const Decimal      = constructors.Decimal;
const Scope        = require("../scope/Scope");

// config stuff
const scanN         = Math.pow(10, 3);
const closeZero     = new constructors.Decimal("10e-32");
const maxIterations = 128;

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

function analyzeInterval(expr, varName, flip, mode) {
  var leftLimit  = flip[0],
      rightLimit = flip[1],
      value      = new constructors.Number(constructors),
      result, nextLimit, leftValue, rightValue, nextValue;

  expr.getStack().setValue(varName, value);

  // calculate leftValue
  value.setSign(Decimal.sign(leftLimit));
  value.setValue(Decimal.abs(leftLimit));
  leftValue = expr.evaluate().getDecimalValue();

  // calculate rightValue
  value.setSign(Decimal.sign(rightLimit));
  value.setValue(Decimal.abs(rightLimit));
  rightValue = expr.evaluate().getDecimalValue();

  for (var i = 0; i < maxIterations; i++) {
    // return if zero
    if (!Decimal.abs(rightValue).gt(closeZero)) {
      return rightLimit;
    } else if (!Decimal.abs(leftValue).gt(closeZero)) {
      return leftLimit;
    }

    // new limits for next iteration
    nextLimit = Decimal.div(leftLimit.plus(rightLimit), 2);
    value.setSign(Decimal.sign(nextLimit));
    value.setValue(Decimal.abs(nextLimit));
    nextValue = expr.evaluate().getDecimalValue();

    if (mode) {

      // sign flip mode
      if (Decimal.sign(nextValue) == Decimal.sign(leftValue)) {
        leftLimit = nextLimit;
        leftValue = nextValue;
      } else {
        rightLimit = nextLimit;
        rightValue = nextValue;
      }

    } else {

      // abs dip mode
      if (Decimal.abs(leftValue).gte(Decimal.abs(rightValue))) {
        leftLimit = nextLimit;
        leftValue = nextValue;
      } else {
        rightLimit = nextLimit;
        rightValue = nextValue;
      }

    }
  }
}

function filterAbsDips(points) {
  var dips = [];

  for (var i = 1; i < points.length - 1; i++) {
    if (
      (points[i][1].gte(0) && (
        !points[i][1].gte(points[i - 1][1])
        && !points[i][1].gte(points[i + 1][1])
      )) || (!points[i][1].gte(0) && (
        points[i][1].gt(points[i - 1][1])
        && points[i][1].gt(points[i + 1][1])
      ))
    ) {
      dips.push([points[i - 1][0], points[i + 1][0]]);
    }
  }

  return dips;
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

    var points  = scan(expr, leftLimit, rightLimit, varName),
        flips   = filterSignFlips(points),
        dips    = filterAbsDips(points),
        results = [];

    // evaluate sign flips
    for (var flip of flips) {
      result = analyzeInterval(expr, varName, flip, true);
      if (result)
        results.push(result);
    }

    // evaluate sign flips
    for (var dip of dips) {
      result = analyzeInterval(expr, varName, dip, false);
      if (result)
        results.push(result);
    }

    // create results vector
    resultVec = new constructors.Tensor(constructors, [results.length]);
    for (var i = 0; i < results.length; i++) {
      resultVec.setElement(i, new constructors.Number(
        constructors, results[i]
      ));
    }

    // remove evaluation scope
    expr.getStack().pop();

    // return results haha
    return resultVec;
  }
};
