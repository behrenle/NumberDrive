const Exception = require("./Exception");

class UnknownSymbolException extends Exception {
  constructor(symbol) {
    super("UnknownSymbolException", symbol.getName());
  }
}

module.exports = UnknownSymbolException;
