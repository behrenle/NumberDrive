const epsilon = Math.pow(10, -14);

function roundUpFix(x, y, errY) {
  if (x <= y + errY && x >= y - errY) {
    return true;
  }
  return false;
}

function sin(x) {
  if (roundUpFix(Math.abs(x % Math.PI), 0, epsilon)) {
    return 0;
  } else {
    return Math.sin(x);
  }
}

function cos(x) {
  if (roundUpFix(Math.abs(x % Math.PI), Math.PI / 2, epsilon)) {
    return 0;
  } else {
    return Math.cos(x);
  }
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
  pi: Math.PI,
  e: Math.E,
  sin: sin,
  cos: cos,
  cot: cot,
  atan: atan,
  acot: acot,
  exp: exp,
}
