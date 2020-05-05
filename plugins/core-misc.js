const constructors = require("../constructors");
const Decimal = constructors.Decimal;
const tools = require("../pluginTools");
const utils = require("../utils");
const binco = utils.binco;

function binomial(p, n, k) {
  return binco(n, k) * Math.pow(p, k) * Math.pow((1 - p), (n - k));
}

function cBinomial(p, n, k) {
  return Array(k + 1)
    .fill()
    .map((_, i) => binomial(p, n, i))
    .reduce((acc, inc) => acc += inc);
}

const funcs = {
  cbinom: function(parameters, stack) {
    let params = tools.checkParameters(parameters, ["number", "number", "number"]),
        n = params[0].getDecimalValue().toNumber(),
        p = params[1].getDecimalValue().toNumber(),
        k = params[2].getDecimalValue().toNumber();

    if (p < 0 || p > 1) {
      throw "binomial: p out of bounds";
    }

    return params[0].new("Number", cBinomial(p, n, k));
  },

  binom: function(parameters, stack) {
    let params = tools.checkParameters(parameters, ["number", "number", "number"]),
        n = params[0].getDecimalValue().toNumber(),
        p = params[1].getDecimalValue().toNumber(),
        k = params[2].getDecimalValue().toNumber();

    if (p < 0 || p > 1) {
      throw "binomial: p out of bounds";
    }

    return params[0].new("Number", binomial(p, n, k));
  },

  binco: function(parameters, stack) {
    let params = tools.checkParameters(parameters, ["number", "number"]),
        n = params[0].getDecimalValue().toNumber(),
        k = params[1].getDecimalValue().toNumber();

    return params[0].new("Number", binco(n, k));
  },

  exp: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return param.new("Number", value.exp());
  },

  ln: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return param.new("Number", value.ln());
  },

  log: function(parameters, stack) {
    let params = tools.checkParameters(parameters, ["number", "number"]),
        value  = params[0].getDecimalValue(),
        base   = params[1].getDecimalValue();

    return params[0].new("Number", value.log(base));
  },

  min: function(parameters, stack) {
    let params = tools.checkParameters(parameters, "number"),
        values = params.map(x => x.getDecimalValue()),
        min    = values[0];

    values.forEach((item, i) => {
      if (min.gt(item)) min = item;
    });

    return new constructors.Number(constructors, min);
  },

  max: function(parameters, stack) {
    let params = tools.checkParameters(parameters, "number"),
        values = params.map(x => x.getDecimalValue()),
        max    = values[0];

    values.forEach((item, i) => {
      if (!max.gte(item)) max = item;
    });

    return new constructors.Number(constructors, max);
  },

  sqrt: function(parameters, stack) {
    let params = tools.checkParameters(parameters, ["number"]),
        value  = params[0].getDecimalValue();

    if (value.isNegative())
      throw "sqrt: invalid parameters";

    return params[0].new("Number", value.sqrt());
  },

  root: function(parameters, stack) {
    let params = tools.checkParameters(parameters, ["number", "number"]),
        value  = params[0].getDecimalValue(),
        grade  = params[1].getDecimalValue(),
        result = value.toPower(grade.toPower(-1));

    if (result.isNaN()) {
      throw "root: invalid parameters";
    }

    return params[0].new("Number", result);
  },

  delete: function(parameters, stack) {
    if (parameters.length == 1) {
      if (parameters[0] instanceof constructors.Symbol) {
        let topScope = stack.getTopScope();
        let name = parameters[0].getName();
        if (topScope.getValue(name)) {
          topScope.deleteValue(name);
          return new constructors.Number(constructors, 1);
        }
        return new constructors.Number(constructors, 0);
      }
      throw "invalid argument type";
    }
    throw "invalid number of arguments";
  },

  abs: function(parameters, stack) {
    let params = tools.checkParameters(parameters, ["number"]),
        value = params[0];

    return value.new("Number", value.getDecimalValue().abs());
  }
}

module.exports = {
  name: "core-misc",
  genericFunctions: funcs,
  inlineDefinitions: [
    "normal(x) := 1 / sqrt(2*pi) * exp(x^2 / 2)",
    "cnormal(x) := 0.5 * (1 + erf(x / sqrt(2)))",
  ],
};
