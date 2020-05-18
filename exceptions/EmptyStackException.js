import Exception from "./Exception.js";

class EmptyStackException extends Exception {
  constructor() {
    super("EmptyStackException");
  }
}

export default EmptyStackException;
