class Exception {
  constructor(type, message) {
    this.type = type;
    this.message = message;
  }

  stringify() {
    return this.type + (this.message ? ": " + this.message : "");
  }

  print() {
    console.log(this.stringify());
  }

  getType() {
    return this.type;
  }

  getMessage() {
    return this.message;
  }
}

export default Exception;
