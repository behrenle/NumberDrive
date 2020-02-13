class Exception {
  constructor(type, message) {
    this.type = type;
    this.message = message;
  }

  print() {
    console.log(
      this.type + ": " + this.message
    );
  }

  getType() {
    return this.type;
  }

  getMessage() {
    return this.message;
  }
}

module.exports = Exception;
