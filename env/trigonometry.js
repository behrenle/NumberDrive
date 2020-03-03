const constructors = require("../constructors");
const gFuncTools   = require("./gFuncTools");
const Decimal      = constructors.Decimal;
const trigMaxPrecision = 32;


module.exports = {
  sin: function(parameters, stack) {
    var param = gFuncTools.paramCheck(parameters, ["number"])[0],
        value = Decimal.mul(param.getSign(), param.getValue());

    return param.new(
      "Number",
      Decimal.sin(value).toDecimalPlaces(trigMaxPrecision)
    );
  },

  cos: function(parameters, stack) {
    var param = gFuncTools.paramCheck(parameters, ["number"])[0],
        value = Decimal.mul(param.getSign(), param.getValue());

    return param.new(
      "Number",
      Decimal.cos(value).toDecimalPlaces(trigMaxPrecision)
    );
  }
}
