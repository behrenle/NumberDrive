import AbstractContainer from "./AbstractContainer.js";
import {registerNode} from "./AbstractNode.js";

class GenericFunction extends AbstractContainer {
    constructor(evalFunc) { // function is signless
        super([], 1, 1);
        this.type = "genericFunction";
        this.evalFunc = evalFunc;
    }

    call(elements, stack) {
        var result = this.evalFunc(elements, stack);
        result.setStack(stack);
        return result;
    }
}

registerNode("GenericFunction", GenericFunction);
export default GenericFunction;
