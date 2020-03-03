const constructors = require("../constructors");

module.exports = {
  sin: function(parameters, stack) {
    if (parameters.length == 1) {
      var parameter = parameters[0].evaluate();
      if (parameter.getType() == "number") {
        return parameter.new(
          "Number",
          constructors.Decimal.sin(
            constructors.Decimal.mul(
              parameter.getSign(),
              parameter.getValue()
            )
          )
        );
      }
      throw "invalid argument type";
    }
    throw "invalid number of arguments";
  },

  cos: function(parameters, stack) {
    if (parameters.length == 1) {
      var parameter = parameters[0].evaluate();
      if (parameter.getType() == "number") {
        return parameter.new(
          "Number",
          constructors.Decimal.cos(
            constructors.Decimal.mul(
              parameter.getSign(),
              parameter.getValue()
            )
          )
        );
      }
      throw "invalid argument type";
    }
    throw "invalid number of arguments";
  }
}
