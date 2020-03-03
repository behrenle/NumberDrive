module.exports = {
  paramCheck: function(params, expectedTypes) {
    var eParams = this.paramEval(params);
    if (eParams.length == expectedTypes.length) {
      for (var i = 0; i < eParams.length; i++) {
        if (eParams[i].getType() != expectedTypes[i]) {
          throw "invalid argument type";
        }
      }
      return eParams;
    }
    throw "invalid number of arguments";
  },

  paramEval: function(params) {
    var eParams = [];
    for (var i = 0; i < params.length; i++) {
      eParams.push(params[i].evaluate());
    }
    return eParams;
  },

  indexCheck: function(tensor, coords) {
    var realCoords = [];

    if (coords.getDimensions().length != 1) {
      throw "invalid index dimensions";
    }

    if (coords.getDimensions()[0] != tensor.getDimensions().length) {
      throw "invalid index length";
    }

    for (var i = 0; i < coords.getElements().length; i++) {
      var coord = coords.getElements()[i];

      if (coord.getType() != "number") {
        throw "invalid index value type";
      }

      if (coord.getSign().equals(-1)) {
        throw "index value < 0";
      }

      if (!coord.getValue().isInt()) {
        throw "index value is not an integer";
      }

      if (
        coord.getValue().gt(tensor.getDimensions()[i])
        || !coord.getValue().gte(1)
      ) {
        throw "index out of bounds";
      }

      realCoords.push(coord.getValue().toNumber() - 1);
    }

    return realCoords;
  }
}
