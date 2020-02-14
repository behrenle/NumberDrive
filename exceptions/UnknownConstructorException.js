const Exception = require("./Exception");

class UnknownConstructorException extends Exception {
  constructor(name) {
    super("UnknownConstructorException", name);
  }
}

module.exports = UnknownConstructorException;
