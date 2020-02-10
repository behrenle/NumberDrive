const AbstractNode = require("./AbstractNode");

class Number extends AbstractNode {
  constructor(numberObject) {
    super();
    if (numberObject.type != "number") {
      throw "number: expected number object";
    }
    this.type = "number";
    this.addElement(numberObject.value);
  }
}

module.exports = Number;
