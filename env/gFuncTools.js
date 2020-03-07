module.exports = {
  paramCheck: function(params, expectedTypes) {
    var eParams = [];
    if (params.length == expectedTypes.length) {
      for (var i = 0; i < params.length; i++) {
        if (expectedTypes[i] == "term") {
          if (
            params[i].getType() == "equation"
            || params[i].getType() == "definition"
            || params[i].getType() == "tensor"
          ) {
            throw "invalid argument type";
          }
          eParams.push(params[i]);

        } else {
          var value = params[i].evaluate();
          if (value.getType() != expectedTypes[i]) {
            throw "invalid argument type";
          }
          eParams.push(value)
        }
      }
      return eParams;
    }
    throw "invalid number of arguments";
  },

  binco: function(n, k) {
     var result = 1;
     if (n < k) {
       throw "invalid input: n < k!";
     }
     while (k > 0) {
       result *= n / k;
       n--; k--;
     }
     return Math.round(result);
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
