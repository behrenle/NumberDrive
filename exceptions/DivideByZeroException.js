const Exception = require("./Exception");

class DevideByZeroException extends Exception {
  constructor() {
    super("DevideByZeroException");
  }
}

module.exports = DevideByZeroException;
