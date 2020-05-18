import Exception from "./Exception.js";

class UnknownSymbolException extends Exception {
  constructor(symbol) {
    super("UnknownSymbolException", symbol.getName());
  }
}

export default UnknownSymbolException;
