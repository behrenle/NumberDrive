function tensorNodeDims(node) {
  if (node.type == "list") {
    var dims = [];
    dims.push(node.elements.length);
    var nextDim = tensorNodeDims(node.elements[0]);
    for (var i = 0; i < node.elements.length; i++) {
      if (compare(nextDim, tensorNodeDims(node.elements[i])) == false) {
        return false;
      }
    }
    if (nextDim != false) {
      return dims.concat(nextDim);
    }
    return dims;
  }
  return false;
}

function tensorDims(array) {
  if (array instanceof Array) {
    var dims = [];
    dims.push(array.length);
    var nextDim = tensorDims(array[0]);
    for (var i = 0; i < array.length; i++) {
      if (compare(nextDim, tensorDims(array[i])) == false) {
        return false;
      }
    }
    if (nextDim != false) {
      return dims.concat(nextDim);
    }
    return dims;
  }
  return false;
}

function zeroTensor(dims) {
  if (dims.length > 0) {
    return array = new Array(dims[0]).fill(
      zeroTensor(dims.slice(1, dims.length))
    );
  }
  return 0;
}

function compare(a1,a2) {
  if (a1 instanceof Array && a2 instanceof Array) {
    if (a1.length == a2.length) {
      for (var i = 0; i < a1.length; i ++) {
        if (a1[i] instanceof Array) {
          if (compare(a1[i], a2[i]) == false) {
            return false
          }
        } else {
          if (a1[i] != a2[i]) {
            return false;
          }
        }
      }
    } else {
      return false;
    }
  } else {
    return a1 == a2;
  }
  return true;
}

function sumTensorPair(tensor1, tensor2, sign1 = "+", sign2 = "+") {
  if (compare(tensorDims(tensor1), tensorDims(tensor2))) {
    if (tensorDims(tensor1).length > 1) {
      var v = [];
      for (var i = 0; i < tensor1.length; i++) {
        v[i] = sumTensorPair(tensor1[i], tensor2[i], sign1, sign2);
      }
      return v;
    } else {
      var s1 = sign1 == "+" ? 1 : -1;
      var s2 = sign2 == "+" ? 1 : -1;
      var v = [];
      for (var i = 0; i < tensor1.length; i++) {
        v.push(s1 * tensor1[i] + s2 * tensor2[i]);
      }
      return v;
    }
  }
  throw "sumTensor: incompatible dimensions";
}

function productScalarTensor(scalar, tensor, mulSign = "*") {
  if (tensorDims(tensor).length == 1) {
    if (mulSign == "*") {
      return tensor.map(x => x * scalar);
    }
    return tensor.map(x => x / scalar);
  } else {
    return tensor.map(x => productScalarTensor(scalar, x));
  }
}

function productVectorPair(vec1, vec2) {
  var v = 0;
  for (var i = 0; i < vec1.length; i++) {
    v += vec1[i] * vec2[i];
  }
  return v;
}

module.exports = {
  tensorNodeDims: tensorNodeDims,
  tensorDims: tensorDims,
  compare: compare,
  zeroTensor: zeroTensor,
  sumTensorPair: sumTensorPair,
  productScalarTensor: productScalarTensor,
  productVectorPair: productVectorPair,
};
