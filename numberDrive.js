const Eval = require('./eval.js');
//const str = "[[3,2,1],[3,2,1],[3,2,1],[3,2,1],[3,2,1]]*[[1,0,0],[0,1,0],[0,0,1]]";
//const str = "2*[1,2,3]*[[1,0,0],[0,1,0],[0,0,1]]/2";
const str = "x^2";

var scope = {
  x: 2,
  f: function(x) {
    return x*x;
  }
};

console.log(str);
console.log(Eval.eval(str, scope, true));
//console.log(Eval.eval("2*2"));
