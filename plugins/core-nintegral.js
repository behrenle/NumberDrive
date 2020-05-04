const constructors = require("../constructors");
const tools = require("../pluginTools");
const Decimal = constructors.Decimal;
const Scope = require("../scope/Scope");

// conf
const splitSections = 150;

// data for Gauß-Kronrod-Quadratur
// see https://de.wikipedia.org/wiki/Gau%C3%9F-Quadratur#Adaptive_Gau%C3%9F-Kronrod-Quadratur
const weightPosPairs    = [],
      weightPosPairStrs = [
  "0.991455371120812639206854697526329",  "0.022935322010529224963732008058970",
  "0.949107912342758524526189684047851",  "0.063092092629978553290700663189204",
  "0.864864423359769072789712788640926",  "0.104790010322250183839876322541518",
  "0.741531185599394439863864773280788",  "0.140653259715525918745189590510238",
  "0.586087235467691130294144838258730",  "0.169004726639267902826583426598550",
  "0.405845151377397166906606412076961",  "0.190350578064785409913256402421014",
  "0.207784955007898467600689403773245",  "0.204432940075298892414161999234649",
  "0",                                    "0.209482141084727828012999174891714",
  "-0.207784955007898467600689403773245", "0.204432940075298892414161999234649",
  "-0.405845151377397166906606412076961", "0.190350578064785409913256402421014",
  "-0.586087235467691130294144838258730", "0.169004726639267902826583426598550",
  "-0.741531185599394439863864773280788", "0.140653259715525918745189590510238",
  "-0.864864423359769072789712788640926", "0.104790010322250183839876322541518",
  "-0.949107912342758524526189684047851", "0.063092092629978553290700663189204",
  "-0.991455371120812639206854697526329", "0.022935322010529224963732008058970"
];

// create Decimal objects for each value
for (let i = 1; i < weightPosPairStrs.length; i += 2) {
  weightPosPairs.push([
    new Decimal(weightPosPairStrs[i - 1]),
    new Decimal(weightPosPairStrs[i]),
  ]);
}

// transformation from [-1, 1] -> [a, b]
function transformPairValues(a, b) {
  let v1 = b.minus(a).div(2),
      v2 = a.plus(b).div(2);

  let newPairs = [];
  for (let i = 0; i < weightPosPairs.length; i++) {
    newPairs.push([
      weightPosPairs[i][0].mul(v1).plus(v2),
      weightPosPairs[i][1].mul(v1)
    ]);
  }
  return newPairs;
}

// split integration interval into smaller ones for improved accuracy
function splitInterval(a, b) {
  let intervals = [],
      iLength   = b.minus(a).div(splitSections);

  for (let i = 0; i < splitSections; i++) {
    intervals.push([
      iLength.mul(i).plus(a),
      iLength.mul(i + 1).plus(a)
    ]);
  }

  return intervals;
}

function integrate(expr, a, b, varName) {
  let vScope = new Scope,
      value  = new constructors.Number(constructors),
      result = new Decimal(0);

  vScope.setValue(varName, value);
  expr.getStack().push(vScope);

  // split intervals
  let splits = splitInterval(a, b);

  // calculate positions and weights
  let wpPairs = [];
  for (let i = 0; i < splits.length; i++) {
    wpPairs = wpPairs.concat(transformPairValues(splits[i][0], splits[i][1]));
  }

  // evaluate expr
  for (let i = 0; i < wpPairs.length; i++) {
    value.setSign(Decimal.sign(wpPairs[i][0]));
    value.setValue(wpPairs[i][0].abs());
    result = result.plus(expr.evaluate().getDecimalValue().mul(wpPairs[i][1]));
  }
  expr.getStack().pop();

  return result;
}

const funcs = {
  nintegral: function(parameters, stack) {
    let params = tools.checkParameters(parameters, ["term", "number", "number"]),
        expr   = params[0].breakDown().summarize();

    // limits
    let leftLimit  = Decimal.min(params[1].getDecimalValue(), params[2].getDecimalValue()),
        rightLimit = Decimal.max(params[1].getDecimalValue(), params[2].getDecimalValue());

    // check let count
    let varName;
    if (expr.getSymbolNames().length == 1) {
      varName = expr.getSymbolNames()[0];
    } else {
      throw "invalid variable count";
    }

    return new constructors.Number(constructors, integrate(expr, leftLimit, rightLimit, varName));
  }
}

module.exports = {
  name: "core-nintegral",
  genericFunctions: funcs,
  inlineDefinitions: [],
};
