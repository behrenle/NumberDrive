const AbstractNode = require("./AbstractNode");
const Number = require("./Number");

class Power extends AbstractNode {
  constructor() {
    super();
    this.type = "power";
  }

  evaluate() {
    return this.elements[0].power(this.elements[1]);
  }
}

module.exports = Power;
