const Solve = require('./solve.js');

const epsilon = Math.pow(10, -14);

function roundUpFix(x, y, errY) {
  if (x <= y + errY && x >= y - errY) {
    return true;
  }
  return false;
}

// method copied from binomirechner.htm by U. Kalina
function nueberk(n, k) {
  var erg = 0;
  if (n < k) return -1;
    if (k ==0) {
      erg=1;
    }
  else {
    erg =n /k;
  }
  while(k >1) {
    n--;
    k--;
    erg=erg *n/k;
  }
  return Math.round(erg);
}

// method copied from binomirechner.htm by U. Kalina
function B(p, n, k) {
  return nueberk(n,k) * Math.pow(p, k) * Math.pow((1 - p), (n - k));
}

// method copied from binomirechner.htm by U. Kalina
function F(p, n, k) {
  var erg = 0;
  var i;
  for (i = 0; i <= k; i++) {
    erg = erg + B(p, n, i);
  }
  return erg;
}

function sin(x) {
  if (roundUpFix(Math.abs(x % Math.PI), 0, epsilon)) {
    return 0;
  } else {
    return Math.sin(x);
  }
}

function asin(x) {
  return Math.asin(x);
}

function cos(x) {
  if (roundUpFix(Math.abs(x % Math.PI), Math.PI / 2, epsilon)) {
    return 0;
  } else {
    return Math.cos(x);
  }
}

function acos(x) {
  return Math.acos(x);
}

function tan(x) {
  if (roundUpFix(Math.abs(x % Math.PI), 0, epsilon)) {
    return 0;
  } else {
    return Math.tan(x);
  }
}

function cot(x) {
  if (roundUpFix(Math.abs(x % Math.PI), Math.PI / 2, epsilon)) {
    return 0;
  } else {
    return 1 / Math.tan(x);
  }
}

function atan(x) {
  if (roundUpFix(x, 0, epsilon)) {
    return 0;
  } else {
    return Math.atan(x);
  }
}

function acot(x) {
  if (x > 0) {
    return atan(1 / x);
  } else if (x < 0) {
    return atan(1 / x) + Math.PI;
  } else {
    return Math.PI / 2;
  }
}

function exp(x) {
  return Math.pow(Math.E, x);
}

module.exports = {
  CONTAINS_DEFAULS: true,
  pi: Math.PI,
  e: Math.E,
  sin: sin,
  asin: asin,
  cos: cos,
  acos: acos,
  cot: cot,
  atan: atan,
  acot: acot,
  exp: exp,
  solveLinear: Solve.solveLinearSystem,
  nSolve: Solve.numericSolve,
  binco: nueberk,
  B: B,
  F: F,
}
