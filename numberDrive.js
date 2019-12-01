const Eval = require('./eval.js');
const defaults = require('./defaults.js');

module.exports = {
  eval: function(str) {
    return Eval.eval(str, defaults);
  },
};
