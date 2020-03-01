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
    this.elements = new Array(this.length).fill(this.new("Number", 0));
  }

  evaluate() {
    var result = this.new("Tensor", this.getDimensions(), this.getSign(), this.getMulSign());
    for (var i = 0; i < this.getElements().length; i++) {
      result.setElement(i, this.getElement(i).evaluate());
    }
    return result;
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
    var index = coords instanceof Array
                ? this.coords2Index(coords)
                : coords;
    this.elements[index] = value;
  }

  getElement(coords) {
    var index = coords instanceof Array
                ? this.coords2Index(coords)
                : coords;
    return this.elements[index];
  }

  getIndeces() {
    var indices = [];
    for (var i = 0; i < this.dims.reduce((acc, curr) => acc * curr); i++) {
      indices.push(this.index2Coords(i));
    }
    return indices;
  }

  getDimensions() {
    return this.dims;
  }

  dimEquals(dims) {
    if (dims.length == this.getDimensions().length) {
      for (var i = 0; i < dims.length; i++) {
        if (dims[i] != this.getDimensions()[i])
          return false;
      }
      return true;
    }
    return false;
  }

  getRank() {
    return this.getDimensions().length;
  }

  addTensor(tensor) {
    if (this.dimEquals(tensor.getDimensions())) {
      var result = this.new("Tensor", this.getDimensions());
      for (var i = 0; i < this.getElements().length; i++) {
        var element = this.new("Sum"),
            value1  = this.getElement(i),
            value2  = tensor.getElement(i);

        value1.applySign(this.getSign());
        value2.applySign(tensor.getSign());

        element.push(value1);
        element.push(value2);

        result.setElement(i, element);
      }
      return result;
    }
    throw "incompatible dimensions";
  }

  mulTensor(tensor) {
    if (this.getMulSign().equals(-1) || tensor.getMulSign().equals(-1)) {
      throw "undefined operation: tensor division";
    }
    if (this.getRank() == 1 && tensor.getRank() == 1 && this.dimEquals(tensor.getDimensions())) {
      var result = this.new("Sum");
      for (var i = 0; i < this.getElements().length; i++) {
        var summand = this.new("Product");
        var value1 = this.getElement(i);
        var value2 = tensor.getElement(i);
        value1.applySign(this.getSign());
        value2.applySign(tensor.getSign());
        summand.push(value1);
        summand.push(value2);
        result.push(summand);
      }
      return result;
    }
    throw "incompatible dimensions";
  }

  mulNumber(number) {
    if (this.getMulSign().equals(-1)) {
      throw "undefined operation: tensor division";
    }
    var result = this.new("Tensor", this.getDimensions());
    for (var i = 0; i < this.getElements().length; i++) {
      var element = this.new("Product"),
          value1  = this.getElement(i);

      value1.applySign(this.getSign());
      element.push(value1);
      element.push(number);
      result.setElement(i, element);
    }
    return result;
  }

  serialize(mode) {
    var str = "";
    if (!mode)
      str += this.getSignString() == "-" ? "-" : "";
    str += "[";
    for (var i = 0; i < this.getElements().length; i++) {
      if (i > 0)
        str += ", ";
      str += this.getElement(i).serialize();
    }
    str += "]";
    return str;
  }
}

module.exports = Tensor;
