const Exception = require("./Exception");

class InvalidTensorFormatException extends Exception {
  constructor() {
    super("InvalidTensorFormatException");
  }
}

module.exports = InvalidTensorFormatException;
