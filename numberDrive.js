const Eval = require('./eval.js');
const defaults = require('./defaults.js');

module.exports = {
  eval: function(str, scope, debug) {
    var result;
    var nScope;
    if (scope) {
      if (scope.CONTAINS_DEFAULS) {
        nScope = scope;
      } else {
        nScope = Object.assign(scope, {...defaults});
      }
      result = Eval.eval(str, scope, debug);
    } else {
      result = Eval.eval(
        str,
        {...defaults},
        debug
      );
      nScope = defaults;
    }
    return {
      result: result,
      scope: nScope,
    };
  },
};
