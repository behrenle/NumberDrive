const Exception = require("./Exception");

class UnknownNodeException extends Exception {
  constructor(node) {
    super("UnknownNodeException", node.type);
  }
}

module.exports = UnknownNodeException;
