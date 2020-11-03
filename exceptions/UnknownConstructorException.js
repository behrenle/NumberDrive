import Exception from "./Exception.js";

class UnknownConstructorException extends Exception {
    constructor(name) {
        super("UnknownConstructorException", name);
    }
}

export default UnknownConstructorException;
