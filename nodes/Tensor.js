const AbstractContainer = require("./AbstractContainer");

class Tensor extends AbstractContainer {
  constructor(constructors, dims, sign, mulSign) {
    super(constructors, [], sign, mulSign);
    this.type = "tensor";
    this.connectionStrength = 4;
    this.dims = dims;
    this.length = 1;
    for (var dim of dims) {
      this.length *= dim;
    }
    this.elements = new Array(this.length);
  }

  coords2Index(coords) {
    if (coords.length == this.dims.length) {
      var index = 0;
      for (var i = 0; i < this.dims.length; i ++) {
        var pIndex = 1;
        for (var j = 0; j < i; j++) {
          pIndex *= this.dims[j];
        }
        index += pIndex * coords[i];
      }
      return index;
    }
    throw "invalid coordinate format";
  }

  index2Coords(index) {
    var coords = new Array(this.dims.length).fill(0);
    for (var coord = this.dims.length - 1; coord >= 0; coord--) {
      var subTensorLength = 1;
      for (var i = 0; i < coord; i++) {
        subTensorLength *= this.dims[i];
      }
      var v = Math.floor(index / subTensorLength);
      if (v > 0) {
        coords[i] = v;
        index -= v * subTensorLength;
      }
    }
    return coords;
  }

  setElement(coords, value) {
    this.elements[this.coords2Index(coords)] = value;
  }

  getElement(coords) {
    return this.elements[this.coords2Index(coords)];
  }

  getIndeces() {
    var indices = [];
    for (var i = 0; i < this.dims.reduce((acc, curr) => acc * curr); i++) {
      indices.push(this.index2Coords(i));
    }
    return indices;
  }
}

module.exports = Tensor;
