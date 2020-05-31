import Nodes from "../../constructors.js";
import tools from "../../pluginTools.js";
import Scope from "../../scope/Scope.js";
import manual from "./manual/nsolve.js";
import Decimal from 'decimal.js';

const scanN = Math.pow(10, 3);
const closeZero = new Nodes.Decimal("10e-24");
const limitDelta = new Nodes.Decimal("10e-3");
const maxIterations = 128;

function scan(expr, start, stop, varName) {
  let increment = Decimal.div(
    Decimal.sub(stop, start),
    scanN
  );

  let points = [],
      vScope = new Scope,
      value  = new Nodes.Number();

  vScope.setValue(varName, value);
  expr.getStack().push(vScope);

  for (let currX = new Decimal(start); !currX.gt(stop); currX = currX.plus(increment)) {
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
  let flips = [];

  for (let i = 1; i < points.length - 1; i++) {
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
  let leftLimit  = flip[0],
      rightLimit = flip[1],
      value      = new Nodes.Number(),
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

  for (let i = 0; i < maxIterations; i++) {
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
  let dips = [];

  for (let i = 1; i < points.length - 1; i++) {
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

const funcs = {
  nsolve: function(parameters, stack) {
    let params, leftLimitRaw, rightLimitRaw;
    if (parameters.length == 1) {
      params        = tools.checkParameters(parameters, ["equation"]),
      leftLimitRaw  = new Decimal(-20);
      rightLimitRaw = new Decimal(20);
    } else {
      params        = tools.checkParameters(parameters, ["equation", "number", "number"]),
      leftLimitRaw  = params[1].getDecimalValue();
      rightLimitRaw = params[2].getDecimalValue();
    }
    let rExpr    = params[0].new("Sum"),
        subExpr1 = params[0].getElement(0).clone(),
        subExpr2 = params[0].getElement(1).clone();

    // build expression
    subExpr2.applySign(-1);
    rExpr.push(subExpr1);
    rExpr.push(subExpr2);
    let expr = rExpr.breakDown().summarize();

    // limits
    let leftLimit  = Decimal.min(leftLimitRaw, rightLimitRaw).minus(limitDelta),
        rightLimit = Decimal.max(leftLimitRaw, rightLimitRaw).plus(limitDelta);

    // check let count
    let varName;
    if (expr.getSymbolNames().length == 1) {
      varName = expr.getSymbolNames()[0];
    } else {
      throw "invalid variable count";
    }

    let points  = scan(expr, leftLimit, rightLimit, varName),
        flips   = filterSignFlips(points),
        dips    = filterAbsDips(points),
        results = [];

    // evaluate sign flips
    for (let flip of flips) {
      let result = analyzeInterval(expr, varName, flip, true);
      if (result)
        results.push(result);
    }

    // evaluate sign flips
    for (let dip of dips) {
      let result = analyzeInterval(expr, varName, dip, false);
      if (result)
        results.push(result);
    }

    // create results vector
    let resultVec = new Nodes.Tensor([results.length]);
    for (let i = 0; i < results.length; i++) {
      resultVec.setElement(i, new Nodes.Number(results[i]));
    }

    // remove evaluation scope
    expr.getStack().pop();

    // return results haha
    return resultVec;
  }
};

export default {
  name: "core-nsolve",
  genericFunctions: funcs,
  inlineDefinitions: [],
  manual: manual
};
