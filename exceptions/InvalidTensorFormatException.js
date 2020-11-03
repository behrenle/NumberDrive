import Exception from "./Exception.js";

class InvalidTensorFormatException extends Exception {
    constructor() {
        super("InvalidTensorFormatException");
    }
}

export default InvalidTensorFormatException;
