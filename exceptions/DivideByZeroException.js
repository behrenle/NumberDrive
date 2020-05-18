import Exception from "./Exception.js";

class DevideByZeroException extends Exception {
  constructor() {
    super("DevideByZeroException");
  }
}

export default DevideByZeroException;
