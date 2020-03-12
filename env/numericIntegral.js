const constructors = require("../constructors");
const gFuncTools   = require("./gFuncTools");
const Decimal      = constructors.Decimal;
const Scope        = require("../scope/Scope");

const sectionsN    = 8*Math.pow(10, 3);

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
for (var i = 1; i < weightPosPairStrs.length; i += 2) {
  weightPosPairs.push([
    new Decimal(weightPosPairStrs[i - 1]),
    new Decimal(weightPosPairStrs[i]),
  ]);
}


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

  // remove vScope
  expr.getStack().pop();

  return points;
}

module.exports = {

  // uses simpson's rule to approx
  nintegral: function(parameters, stack) {
    var params = gFuncTools.paramCheck(parameters, ["term", "number", "number"]),
        expr   = params[0].breakDown().summarize();

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

    console.log("scanning...")
    var points  = scan(expr, leftLimit, rightLimit, varName),
        h       = rightLimit.minus(leftLimit).div(sectionsN),
        r       = new Decimal(0);

    console.log("adding...")
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
