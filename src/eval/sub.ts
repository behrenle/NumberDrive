import {Num, Stack, Sub} from "../types";
import {createNum} from "../create";
import {evalChildren} from "./index";
import {isNum} from "../utils/nodeType";

const subNumbers = (leftNumber: Num, rightNumber: Num) => createNum(leftNumber.value - rightNumber.value);

const evalSub = (sub: Sub, stack: Stack) => {
    const [lChild, rChild] = evalChildren(sub, stack);

    if (isNum(lChild) && isNum(rChild))
        return subNumbers(lChild as Num, rChild as Num);

    throw `sub: incompatible types: ${lChild.type}, ${rChild.type}`;
}

export default evalSub;