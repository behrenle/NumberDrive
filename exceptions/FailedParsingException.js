import Exception from "./Exception.js";

class FailedParsingException extends Exception {
  constructor(e) {
    super(e.name, e.message);
  }
}

export default FailedParsingException;
