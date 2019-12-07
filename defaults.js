const Solve = require('./solve.js');
const Tensor = require('./tensor.js');
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

function cross(vector1, vector2) {
  if (vector1 instanceof Array && vector2 instanceof Array) {
    if (
      Tensor.getRank(vector1) == 1
      && Tensor.getRank(vector2) == 1
      && Tensor.getDimensions(vector1)[0] == 3
      && Tensor.getDimensions(vector2)[0] == 3
    ) {
      return [
        vector1[1] * vector2[2] - vector1[2] * vector2[1],
        vector1[2] * vector2[0] - vector1[0] * vector2[2],
        vector1[0] * vector2[1] - vector1[1] * vector2[0],
      ];
    }
  }
  throw "incompatible types";
}

module.exports = {
  CONTAINS_DEFAULS: true,
  // physics constats
  physics_c: 299792458,
  physics_e: 1.602176634 * Math.pow(10, -19),
  phycics_mu0: 1.25663706212 *  Math.pow(10, -6),
  physics_eps0: 8.8541878128 * Math.pow(10, -12),
  physics_G: 6.67430 *  Math.pow(10, -11),
  physics_m_planck: 2.176434 * Math.pow(10, -8),
  physics_kb: 1.380649 *  Math.pow(10, -23),
  physics_h: 6.62607015 *  Math.pow(10, -34),
  physics_me: 9.1093837015 *  Math.pow(10, -31),

  // math constatns
  pi: Math.PI,
  e: Math.E,
  deg: Math.PI / 180,

  // math functions
  sin: sin,
  asin: asin,
  cos: cos,
  acos: acos,
  cot: cot,
  atan: atan,
  acot: acot,
  exp: exp,
  binco: nueberk,
  B: B,
  F: F,
  cross: cross,

  // advanced stuff
  solveLinear: Solve.solveLinearSystem,
  nSolve: Solve.numericSolve,
}
