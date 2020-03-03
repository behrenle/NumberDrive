const constructors = require("../constructors");
const gFuncTools   = require("./gFuncTools");
const Decimal      = constructors.Decimal;

module.exports = {
  dimensions: function(parameters, stack) {
    var param  = gFuncTools.paramCheck(parameters, ["tensor"])[0],
        result = param.new("Tensor", [param.getDimensions().length]);

    for (var i = 0; i < param.getDimensions().length; i++) {
      result.setElement(i, param.new("Number", param.getDimensions()[i]));
    }

    return result;
  },

  set: function(parameters, stack) {
    var params = gFuncTools.paramCheck(parameters, ["tensor", "tensor", "number"]),
        dest   = params[0],
        coords = params[1],
        value  = params[2];

    var realCoords = gFuncTools.indexCheck(dest, coords);

    dest.setElement(realCoords, value);

    return dest;
  },

  get: function(parameters, stack) {
    var params = gFuncTools.paramCheck(parameters, ["tensor", "tensor"]),
        dest   = params[0],
        coords = params[1];

    var realCoords = gFuncTools.indexCheck(dest, coords);

    return dest.getElement(realCoords);
  },
}
