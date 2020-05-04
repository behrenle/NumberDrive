const Scope        = require("./scope/Scope");
const Exception = require("./exceptions/Exception");
const parse = require("./parse");
const prelude = require("./prelude");

function transformGerman2English(str) {
  return str
    //.replace(/(?<=\d)\,(?=\d)/g, ".")
    .replace(/,/g, ".")
    .replace(/;/g, ",");
}

function transformEnglish2German(str) {
  return str
    .replace(/,/g, ";")
    .replace(/\./g, ",");
    //.replace(/(?<=\d)\.(?=\d)/g, ",");
}

class Script {
  constructor(lang) {
    this.lang = lang ? lang : "en";
    this.inputs = [];
    this.outputs = [];

    // generate stack and setup user scope
    this.ENV = prelude();
    this.ENV.push(new Scope());
  }

  getSetting(...args) {
    return this.getENV().getSetting(...args);
  }

  setSetting(...args) {
    this.getENV().setSetting(...args);
  }

  getENV() {
    return this.ENV;
  }

  clearUserScope() {
    this.ENV.pop();
    this.ENV.push(new Scope());
  }

  clearHistory() {
    this.inputs = [];
    this.outputs = [];
  }

  clearAll() {
    this.clearUserScope();
    this.clearHistory();
  }

  setLanguage(lang) {
    this.lang = lang == "de" ? "de" : "en";
  }

  getLength() {
    return this.inputs.length;
  }

  getItems() {
    var items = [];
    for (var i = 0; i < this.inputs.length; i++) {
      items.push(this.getItem(i));
    }
    return items;
  }

  getItem(index) {
    if (!this.inputs[index]) {
      throw "index out of bounds";
    }
    return {
      index: index,
      input: this.getInput(index),
      output: this.getOutput(index)
    };
  }

  getInput(index) {
    return this.lang == "de"
      ? transformEnglish2German(this.inputs[index])
      : this.inputs[index];
  }

  getOutput(index) {
    return this.lang == "de"
      ? transformEnglish2German(this.outputs[index])
      : this.outputs[index];
  }

  pushString(rawStr) {
    let str = this.lang == "en" ? rawStr : transformGerman2English(rawStr);
    this.inputs.push(str);
    try {
      let node = parse(str)
      try {
        node.setStack(this.getENV());
        let result = node.evaluate();
        this.outputs.push(result.serialize());
      } catch (runtimeError) {
        this.outputs.push(runtimeError);
      }
    } catch (syntaxError) {
      this.outputs.push(syntaxError);
    }
  }

  output() {
    for (var i = 0; i < this.getLength(); i++) {
      console.log(
        "#" + i + ": " +
        this.getInput(i) + "\n> " + this.getOutput(i) + "\n"
      );
    }
  }
}

module.exports = Script;
