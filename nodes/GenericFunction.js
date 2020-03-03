const AbstractContainer = require("./AbstractContainer");

class GenericFunction extends AbstractContainer {
  constructor(constructors, evalFunc) { // function is signless
    super(constructors, [], 1, 1);
    this.type = "genericFunction";
    this.evalFunc = evalFunc;
  }

  call(elements, stack) {
    return this.evalFunc(elements, stack);
  }
}

module.exports = GenericFunction;
