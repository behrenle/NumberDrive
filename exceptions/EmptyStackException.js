const Exception = require("./Exception");

class EmptyStackException extends Exception {
  constructor() {
    super("EmptyStackException");
  }
}

module.exports = EmptyStackException;
