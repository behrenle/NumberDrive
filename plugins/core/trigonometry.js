import constructors from "../../constructors.js";
import tools from "../../pluginTools.js";
import manual from "./manual/trigonometry.js";

const trigMaxPrecision = 32;
const Decimal = constructors.Decimal;

function createResult(decimal) {
  let result;
  if (decimal.abs().greaterThan(new Decimal("1e-20"))) {
    result = decimal;
  } else {
    result = new Decimal(0);
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

export default {
  name: "core-trigonometry",
  genericFunctions: funcs,
  inlineDefinitions: [
    "sindeg(x):=sin(x*deg)",
    "cosdeg(x):=cos(x*deg)",
    "tandeg(x):=tan(x*deg)",
    "asindeg(x):=asin(x)/deg",
    "acosdeg(x):=acos(x)/deg",
    "atandeg(x):=atan(x)/deg",
  ],
  manual
};
