import AbstractContainer from "./AbstractContainer.js";
import { registerNode } from "./AbstractNode.js";

class Tensor extends AbstractContainer {
  constructor(dims = [0], sign, mulSign) {
    super([], sign, mulSign);
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
    } else if (this.getRank() == 2 && tensor.getRank() == 2) {
      if (this.getDimensions()[0] == tensor.getDimensions()[1]) {
        var width  = tensor.getDimensions()[0],
            height = this.getDimensions()[1],
            result = this.new("Tensor", [width, height]);

        for (var x = 0; x < width; x++) {
          for (var y = 0; y < height; y++) {
            var element = this.new("Sum");
            for (var i = 0; i < this.getDimensions()[0]; i++) {
              var summand = this.new("Product");
              summand.applySign(this.getSign());
              summand.applySign(tensor.getSign());
              summand.push(this.getElement([i, y]));
              summand.push(tensor.getElement([x, i]));
              element.push(summand);
            }
            result.setElement([x, y], element);
          }
        }

        return result;
      }
    } else if (this.getRank() == 2 && tensor.getRank() == 1) {
      var length = tensor.getDimensions().reduce((a, c) => a * c);
      tensor.reshape([1, length]);
      var result = this.mulTensor(tensor)
      result.reshape([result.getElements().length]);
      return result;
    } else if (this.getRank() == 1 && tensor.getRank() == 2) {
      var length = this.getDimensions().reduce((a, c) => a * c);
      this.reshape([length, 1]);
      var result = this.mulTensor(tensor);
      result.reshape([result.getElements().length]);
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

  reshape(newDims) {
    if (newDims.reduce((a, v) => a * v) == this.getElements().length) {
      this.dims = newDims;
    } else {
      throw "unable to reshape: incompatible dimensions";
    }
  }

  transpose() {
    if (this.getRank() > 1) {
      var revDims = this.getDimensions().slice(0, this.getDimensions().length).reverse();
      var result = this.new("Tensor", revDims, this.getSign(), this.getMulSign());
      for (var i = 0; i < this.getElements().length; i++) {
        var coords = this.index2Coords(i);
        var rCoords = this.index2Coords(i);
        rCoords.reverse();
        result.setElement(rCoords, this.getElement(coords));
      }
      return result;
    } else {
      this.reshape([1, this.getElements().length]);
      return this;
    }
  }

  serialize(mode) {
    var str = "";
    if (!mode)
      str += this.getSignString() == "-" ? "-" : "";

    str += "[".repeat(this.getDimensions().length);
    var lastIndex = new Array(this.getDimensions().length -1).fill(0),
        first     = true,
        index;

    for (var i = 0; i < this.getElements().length; i++) {
      index = this.index2Coords(i);
      for (var j = lastIndex.length - 1; j >= 0 ; j--) {
        if (lastIndex[j] != index[j + 1]) {
          first = true;
          str  += "]".repeat(j + 1);
          str  += ", ";
          str  += "[".repeat(j + 1);
          break;
        }
      }

      if (!first)
        str += ", ";
      first = false;
      str += this.getElement(i).serialize();

      lastIndex = index.slice(1, index.length);
    }

    str += "]".repeat(this.getDimensions().length);
    return str;
  }

  det() {
    if (this.getRank() == 2) {
      var dims = this.getDimensions();
      if (dims[0] == dims[1]) {
        if (dims[0] > 0) {
          if (dims[0] == 1) {
            return this.getElement(0);
          } else {
            var result = this.new("Sum");
            var j = 0;

            for (var i = 0; i < dims[0]; i++) {
              var summand = this.new("Product");
              var s       = this.new("Power");
              var sE      = this.new("Sum");

              // sign
              s.push(this.new("Number", -1));
              sE.push(this.new("Number", i));
              sE.push(this.new("Number", j));
              sE.push(this.new("Number", 2)); // correct js index offset
              s.push(sE);
              summand.push(s);

              // current element
              summand.push(this.getElement([i, j]));

              // create sub-matrix
              var subTensor = this.new("Tensor", [dims[0] - 1, dims[0] - 1]);
              for (var k = 0; k < this.getElements().length; k++) {
                var coords = this.index2Coords(k);
                if (coords[0] != i && coords[1] != j) {
                  var realCoords = [
                    coords[0] < i ? coords[0] : coords[0] - 1,
                    coords[1] < j ? coords[1] : coords[1] - 1
                  ];
                  subTensor.setElement(realCoords, this.getElement(k));
                }
              }

              // insert sub det
              summand.push(subTensor.det());
              result.push(summand);
            }
            return result;
          }
        }
        throw "det: det of empty matrix is undefined";
      }
      throw "det: not a square matrix";
    }
    throw "det: not a matrix";
  }
}

registerNode("Tensor", Tensor);
export default Tensor;
