class AbstractNode {
  constructor(elements = []) {
    this.elements = elements;
    this.type = "AbstractNode";
  }

  addElement(element) {
    this.elements.push(element);
  }

  stringify() {
    var lines = [];
    lines.push(this.type + ":");
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
}
