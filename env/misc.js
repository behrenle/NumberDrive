const constructors = require("../constructors");
const gFuncTools   = require("./gFuncTools");
const Decimal      = constructors.Decimal;
const trigMaxPrecision = 32;

module.exports = {
  binco: function(parameters, stack) {
    let params = gFuncTools.paramCheck(parameters, ["number", "number"]),
        n = params[0].getDecimalValue().toNumber(),
        k = params[1].getDecimalValue().toNumber();

    if (n % 1 != 0 || k % 1 != 0) {
      throw "binco: invalid parameters";
    }

    if (n < k) {
      throw "binco: invalid parameters: n < k";
    }

    let result;
    if (k == 0) {
      result = 1;
    } else {
      result = n / k
    }
    for (let i = 1; i < k; i++) {
      result *= (n - i) / (k - i);
    }

    return params[0].new("Number", result);
  },

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
      if (min.gt(values[i])) {
        min = values[i];
      }
    }

    return new constructors.Number(constructors, min);
  },

  max: function(parameters, stack) {
    var params = gFuncTools.paramCheckSingleType(parameters, "number"),
        values = params.map(x => x.getDecimalValue()),
        max    = values[0];

    for (var i = 1; i < values.length; i++) {
      if (!max.gte(values[i])) {
        max = values[i];
      }
    }

    return new constructors.Number(constructors, max);
  },

  sqrt: function(parameters, stack) {
    var params = gFuncTools.paramCheck(parameters, ["number"]),
        value  = params[0].getDecimalValue();

    if (value.isNegative()) {
      throw "sqrt: invalid parameters";
    }

    return params[0].new("Number", value.sqrt());
  },

  root: function(parameters, stack) {
    var params = gFuncTools.paramCheck(parameters, ["number", "number"]),
        value  = params[0].getDecimalValue(),
        grade  = params[1].getDecimalValue();

    var result = value.toPower(
      grade.toPower(-1)
    );

    if (result.isNaN()) {
      throw "root: invalid parameters";
    }

    return params[0].new("Number", result);
  },

  delete: function(parameters, stack) {
    if (parameters.length == 1) {
      if (parameters[0] instanceof constructors.Symbol) {
        var topScope = stack.getTopScope();
        var name = parameters[0].getName();
        if (topScope.getValue(name)) {
          topScope.deleteValue(name);
          return new constructors.Number(constructors, 1);
        }
        return new constructors.Number(constructors, 0);
      }
      throw "invalid argument type";
    }
    throw "invalid number of arguments";
  }
}
