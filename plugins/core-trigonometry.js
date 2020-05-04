const constructors = require("../constructors");
const tools = require("../pluginTools");
const Decimal = constructors.Decimal;
const trigMaxPrecision = 32;

function createResult(decimal) {
  let result;
  if (decimal.abs().greaterThan(new Decimal("1e-20"))) {
    result = decimal;
  } else {
    result = Decimal(0);
  }
  return new constructors.Number(
    constructors,
    result
  );
}

const funcs = {
  sin: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return createResult(Decimal.sin(value));
  },

  cos: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return createResult(Decimal.cos(value));
  },

  tan: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return createResult(Decimal.tan(value));
  },

  sinh: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return createResult(Decimal.sinh(value));
  },

  cosh: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return createResult(Decimal.cosh(value));
  },

  tanh: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return createResult(Decimal.tanh(value));
  },

  // inverse functions
  asin: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return createResult(Decimal.asin(value));
  },

  acos: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return createResult(Decimal.acos(value));
  },

  atan: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return createResult(Decimal.atan(value));
  },

  asinh: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return createResult(Decimal.asinh(value));
  },

  acosh: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return createResult(Decimal.acosh(value));
  },

  atanh: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return createResult(Decimal.atanh(value));
  },
}

module.exports = {
  genericFunctions: funcs,
  inlineDefinitions: [],
};
