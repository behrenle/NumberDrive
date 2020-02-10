const AbstractNode = require("./AbstractNode");

class Number extends AbstractNode {
  constructor(value, sign = "+") {
    super();
    this.type = "number";
    this.sign = sign;
    this.addElement(value);
  }
}

module.exports = Number;
