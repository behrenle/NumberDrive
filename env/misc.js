const constructors = require("../constructors");
const gFuncTools   = require("./gFuncTools");
const Decimal      = constructors.Decimal;
const trigMaxPrecision = 32;

module.exports = {
  exp: function(parameters, stack) {
    var param = gFuncTools.paramCheck(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return param.new(
      "Number",
      value.exp()
    );
  },

  ln: function(parameters, stack) {
    var param = gFuncTools.paramCheck(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return param.new(
      "Number",
      value.ln()
    );
  },

  log: function(parameters, stack) {
    var params = gFuncTools.paramCheck(parameters, ["number", "number"]),
        value  = params[0].getDecimalValue(),
        base   = params[1].getDecimalValue();


    return params[0].new(
      "Number",
      value.log(base)
    );
  },

  min: function(parameters, stack) {
    var params = gFuncTools.paramCheckSingleType(parameters, "number"),
        values = params.map(x => x.getDecimalValue()),
        min    = values[0];

    for (var i = 1; i < values.length; i++) {
      if (min.gte(values[i])) {
        min = values[i];
      }
    }

    return new constructors.Number(constructors, min);
  }
}
