import AbstractContainer from "./AbstractContainer.js";
import { registerNode } from "./AbstractNode.js";
import Scope from "../scope/Scope.js";

class Function extends AbstractContainer {
  constructor(parameters, expression) { // function is signless
    super([], 1, 1);
    this.type = "function";
    this.expression = expression;
    this.setElements(parameters);
  }

  getExpression() {
    return this.expression;
  }

  call(parameters, stack) {
    var callScope = new Scope();
    if (parameters.length == this.getElements().length) {
      for (var i = 0; i < parameters.length; i++) {
        callScope.setValue(this.getElement(i).getName(), parameters[i]);
      }
      stack.push(callScope);
      this.getExpression().setStack(stack);
      var result = this.getExpression().evaluate();
      stack.pop();
      return result;
    }
    throw "no matching parameter list";
  }
}

registerNode("Function", Function);
export default Function;
