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
}

module.exports = Tensor;
