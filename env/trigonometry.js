const constructors = require("../constructors");
const tools = require("../pluginTools");
const Decimal = constructors.Decimal;
const trigMaxPrecision = 32;


module.exports = {
  sin: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return param.new(
      "Number",
      Decimal.sin(value).toDecimalPlaces(trigMaxPrecision)
    );
  },

  cos: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return param.new(
      "Number",
      Decimal.cos(value).toDecimalPlaces(trigMaxPrecision)
    );
  },

  tan: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();


    return param.new(
      "Number",
      Decimal.tan(value).toDecimalPlaces(trigMaxPrecision)
    );
  },

  sinh: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return param.new(
      "Number",
      Decimal.sinh(value).toDecimalPlaces(trigMaxPrecision)
    );
  },

  cosh: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return param.new(
      "Number",
      Decimal.cosh(value).toDecimalPlaces(trigMaxPrecision)
    );
  },

  tanh: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return param.new(
      "Number",
      Decimal.tanh(value).toDecimalPlaces(trigMaxPrecision)
    );
  },

  // inverse functions
  asin: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return param.new(
      "Number",
      Decimal.asin(value).toDecimalPlaces(trigMaxPrecision)
    );
  },

  acos: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return param.new(
      "Number",
      Decimal.acos(value).toDecimalPlaces(trigMaxPrecision)
    );
  },

  atan: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return param.new(
      "Number",
      Decimal.atan(value).toDecimalPlaces(trigMaxPrecision)
    );
  },

  asinh: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return param.new(
      "Number",
      Decimal.asinh(value).toDecimalPlaces(trigMaxPrecision)
    );
  },

  acosh: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return param.new(
      "Number",
      Decimal.acosh(value).toDecimalPlaces(trigMaxPrecision)
    );
  },

  atanh: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["number"])[0],
        value = param.getDecimalValue();

    return param.new(
      "Number",
      Decimal.atanh(value).toDecimalPlaces(trigMaxPrecision)
    );
  },
}
