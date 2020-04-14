const Scope = require("./Scope");
const EmptyStackException = require("../exceptions/EmptyStackException");
const IllegalArgumentException = require("../exceptions/IllegalArgumentException");

class Stack {
  constructor() {
    this.scopes = [];
    this.settings = {
      sigDigits: 6,
    };
  }

  getSetting(name) {
    return this.settings[name];
  }

  setSetting(name, value) {
    this.settings[name] = value;
  }

  exists(name) {
    for (var i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i].exists(name)) {
        return true;
      }
    }
    return false;
  }

  getValue(name) {
    for (var i = this.scopes.length - 1; i >= 0; i--) {
      var scope = this.scopes[i];
      if (scope.getValue(name)) {
        return scope.getValue(name);
      }
    }
  }

  setValue(name, value) {
    if (this.scopes.length < 1) {
      throw new EmptyStackException();
    }
    this.scopes[this.scopes.length - 1].setValue(name, value);
  }

  push(scope) {
    if (scope instanceof Scope) {
      this.scopes.push(scope)
      return;
    }
    throw new IllegalArgumentException("Scope", scope);
  }

  pop() {
    return this.scopes.pop();
  }
}

module.exports = Stack;
