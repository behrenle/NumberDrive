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
}
