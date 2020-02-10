class AbstractNode {
  constructor(elements = []) {
    this.elements = elements;
    this.type = "AbstractNode";
    this.sign = "+";
  }

  addElement(element) {
    this.elements.push(element);
  }

  stringify() {
    var lines = [];
    lines.push(this.type + ":" + " (" + this.sign + ")");
    for (var element of this.elements) {
      var elementLines;
      if (element instanceof AbstractNode) {
        elementLines = element.stringify().map(x => "  " + x);
      } else {
        elementLines = ["  " + element];
      }
      lines = lines.concat(elementLines);
    }
    return lines;
  }

  output() {
    var lines = this.stringify();
    for (var line of lines) {
      console.log(line);
    }
  }

  evaluate() {
    return this;
  }

  equals(otherNode) {
    return JSON.stringify(this) == JSON.stringify(otherNode);
  }
}

module.exports = AbstractNode;
