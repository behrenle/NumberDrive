function compare(tensor1, tensor2) {
  if (tensor1 instanceof Array && tensor2 instanceof Array) {
    if (tensor1.length == tensor2.length) {
      for (var i = 0; i < tensor1.length; i++) {
        if (tensor1[i] instanceof Array && tensor2[i] instanceof Array) {
          if (compare(tensor1[i], tensor2[i]) == false) {
            return false;
          }
        } else if (typeof tensor1[i] == typeof tensor2[i]) {
          if (tensor1[i] != tensor2[i]) {
            return false;
          }
        } else {
          return false;
        }
      }
      return true;
    }
  } else {
    return tensor1 == tensor2;
  }
  return false;
}

function getDimensions(tensor) {
  if (tensor instanceof Array) {
    var dims = [];
    dims.push(tensor.length);
    if (tensor[0] instanceof Array) {
      for (var i = 0; i < tensor.length; i++) {
        if (compare(getDimensions(tensor[0]), getDimensions(tensor[i])) == false) {
          return false;
        }
      }
      return getDimensions(tensor[0]).concat(dims);
    } else {
      return dims;
    }
  }
  return false;
}

function getRank(tensor) {
  var r = getDimensions(tensor);
  if (r == false) {
    return 0;
  } else {
    return r.length;
  }
}

function get(tensor, iTensor) {
  if (iTensor.length == 1) {
    return tensor[iTensor[0]];
  } else {
    return get(
      tensor[iTensor[iTensor.length - 1]],
      iTensor.slice(0, iTensor.length - 1)
    );
  }
}

function set(tensor, iTensor, value) {
  var nTensor = tensor.slice(); // create copy
  if (iTensor.length == 1) {
    nTensor[iTensor[0]] = value;
    return nTensor;
  } else {
    nTensor[iTensor[iTensor.length - 1]] = set(
      nTensor[iTensor[iTensor.length - 1]],
      iTensor.slice(0, iTensor.length - 1),
      value
    );
    return nTensor;
  }
}

function getIndizes(dims) {
  var r = [];
  if (dims.length == 1) {
    for (var i = 0; i < dims[0]; i++) {
      r.push([i]);
    }
  } else {
    var nextR = getIndizes(dims.slice(0, dims.length - 1));
    for (var i = 0; i < dims[dims.length - 1]; i++) {
      for (var k = 0; k < nextR.length; k++) {
        r.push([k].concat(i));
      }
    }
  }
  return r;
}

function zeros(dims) {
  if (dims.length == 1) {
    return new Array(dims[0]).fill(0);
  } else {
    return new Array(dims[dims.length - 1]).fill(
      zeros(dims.slice(0, dims.length - 1))
    );
  }
}

function addTensors(tensor1, tensor2, sign1 = "+", sign2 = "+") {
  var s1 = sign1 == "+" ? 1 : -1;
  var s2 = sign2 == "+" ? 1 : -1;
  if (compare(getDimensions(tensor1), getDimensions(tensor2))) {
    var dims = getDimensions(tensor1);
    var indizes = getIndizes(dims);
    var rTensor = zeros(dims);
    for (var i = 0; i < indizes.length; i++) {
      rTensor = set(
        rTensor,
        indizes[i],
        s1 * get(tensor1, indizes[i]) + s2 * get(tensor2, indizes[i])
      );
    }
    return rTensor;
  }
  throw "incompatible dimensions";
}

function mulVectors(vec1, vec2) {
  if (
    compare(getDimensions(vec1), getDimensions(vec2))
    && getRank(vec1) == 1
  ) {
    var r = 0;
    for (var i = 0; i < vec1.length; i++) {
      r += vec1[i] * vec2[i];
    }
    return r;
  }
}

function getMatrixRow(mat, r) {
  return mat[r];
}

function getMatrixColumn(mat, c) {
  var col = [];
  for (var i = 0; i < mat.length; i++) {
    col.push(mat[i][c]);
  }
  return col;
}

function mulMatrices(mat1, mat2) {
  if (
    getRank(mat1) == 2 && getRank(mat2) == 2
    && getDimensions(mat1)[0] == getDimensions(mat2)[1]
  ) {
    var dims1 = getDimensions(mat1);
    var dims2 = getDimensions(mat2);
    var rWidth = dims2[0];
    var rHeight = dims1[1];
    var r = zeros([rWidth, rHeight]);

    for (var x = 0; x < rWidth; x++) {
      for (var y = 0; y < rHeight; y++) {
        var row = getMatrixRow(mat1, y);
        var col = getMatrixColumn(mat2, x);
        r = set(r, [x, y], mulVectors(row, col));
      }
    }
    return r;
  }
  return false;
}

function transposeMatrix(mat) {
  var nMat = [];
  var dims = getDimensions(mat);
  for (var i = 0; i < dims[0]; i++) {
    nMat.push(getMatrixColumn(mat, i));
  }
  return nMat;
}

function transposeVector(vec) {
  var mat = [];
  for (var i = 0; i < vec.length; i++) {
    mat.push([vec[i]]);
  }
  return mat;
}

function mulScalarTensor(scalar, tensor, scalarMulSign = "*") {
  var r = zeros(getDimensions(tensor));
  var indizes = getIndizes(getDimensions(tensor));
  for (var i = 0; i < indizes.length; i++) {
    if (scalarMulSign == "*") {
      r = set(r, indizes[i], get(tensor, indizes[i]) * scalar);
    } else {
      r = set(r, indizes[i], get(tensor, indizes[i]) / scalar);
    }
  }
  return r;
}

function getMulMode(tensor1, tensor2) {
  var dim1 = getDimensions(tensor1);
  var dim2 = getDimensions(tensor2);
  var rank1 = getRank(tensor1);
  var rank2 = getRank(tensor2);
  if (compare(dim1, dim2) && rank1 == 1) {
    return "vec";
  } else if (rank1 == 2 && rank2 == 2 && dim1[0] == dim2[1]) {
    return "mat";
  } else if (rank1 == 2 && rank2 == 1 && dim1[0] == dim2[0]) {
    return "matvec";
  } else if (rank1 == 1 && rank2 == 2 && dim1[0] == dim2[1]) {
    return "vecmat";
  } else if (rank1 == 0 && rank2 > 0) {
    return "numten";
  } else if (rank1 > 0 && rank2 == 0) {
    return "tennum";
  } else if (rank1 == 0 && rank2 == 0) {
    return "numnum";
  }
}

function copyOf(tensor) {
  return tensor.slice();
}

module.exports = {
  compare: compare,
  getDimensions: getDimensions,
  getRank: getRank,
  get: get,
  set: set,
  getIndizes: getIndizes,
  zeros: zeros,
  addTensors: addTensors,
  mulVectors: mulVectors,
  getMatrixRow: getMatrixRow,
  getMatrixColumn: getMatrixColumn,
  mulMatrices: mulMatrices,
  transposeMatrix: transposeMatrix,
  transposeVector: transposeVector,
  mulScalarTensor: mulScalarTensor,
  getMulMode: getMulMode,
  copyOf: copyOf,
}
