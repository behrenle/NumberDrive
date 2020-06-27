import Scope from "./Scope.js";
import EmptyStackException from "../exceptions/EmptyStackException.js";
import IllegalArgumentException from "../exceptions/IllegalArgumentException.js";
import Nodes from "../constructors.js";

class Stack {
  constructor() {
    this.scopes = [];
    this.settings = {
      sigDigits: 6,
    };
  }

  getTopScope() {
    return this.scopes[this.scopes.length - 1];
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
    if (name == "memory") {
      let result = new Nodes.Tensor();
      let topScope = this.getTopScope();
      for (var name of Object.keys(topScope.values)) {
        if (name == "memory") {
          continue;
        }
        let value = this.getValue(name);
        if (value.getType() != "function") {
          result.push(new Nodes.Symbol(name));
        } else {
          let func = new Nodes.FunctionCall(name, 1, 1);
          func.setElements(value.getElements().map(x => x.clone()));
          result.push(func);
        }
      }
      result.reshape([result.getElements().length]);
      result.setStack(this);
      return result;
    }

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

export default Stack;
