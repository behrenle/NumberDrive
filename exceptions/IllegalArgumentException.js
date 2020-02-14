const Exception = require("./Exception");

class IllegalArgumentException extends Exception {
  constructor(expected, got) {
    super(
      "IllegalArgumentException",
      "expected " + expected + " got " + typeof got
      + (typeof got == "object" ? " (" + got.constructor.name + ")" : "")
    );
    this.got = got;
  }
}

module.exports = IllegalArgumentException;
