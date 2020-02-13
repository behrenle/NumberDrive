const Exception = require("./Exception");

class FailedParsingException extends Exception {
  constructor(e) {
    super(e.name, e.message);
  }
}
