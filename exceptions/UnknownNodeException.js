import Exception from "./Exception.js";

class UnknownNodeException extends Exception {
    constructor(node) {
        super("UnknownNodeException", node.type);
    }
}

export default UnknownNodeException;
