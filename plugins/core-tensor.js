const constructors = require("../constructors");
const tools = require("../pluginTools");
const Decimal = constructors.Decimal;

const funcs = {
  dimensions: function(parameters, stack) {
    let param  = tools.checkParameters(parameters, ["tensor"])[0],
        result = param.new("Tensor", [param.getDimensions().length]);

    for (let i = 0; i < param.getDimensions().length; i++) {
      result.setElement(i, param.new("Number", param.getDimensions()[i]));
    }

    return result;
  },

  set: function(parameters, stack) {
    let params = tools.checkParameters(parameters, ["tensor", "tensor", "number"]),
        dest   = params[0],
        coords = params[1],
        value  = params[2];

    let realCoords = gFuncTools.indexCheck(dest, coords);

    dest.setElement(realCoords, value);

    return dest;
  },

  get: function(parameters, stack) {
    let params = tools.checkParameters(parameters, ["tensor", "tensor"]),
        dest   = params[0],
        coords = params[1];

    let realCoords = gFuncTools.indexCheck(dest, coords);

    return dest.getElement(realCoords);
  },

  det: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["tensor"])[0];
    return param.det().evaluate();
  }
}

module.exports = {
  genericFunctions: funcs,
  inlineDefinitions: [],
};
