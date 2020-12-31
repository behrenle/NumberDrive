import {Div, Num, Stack} from "../types";
import {createNum} from "../create";
import {evalChildren} from "./index";
import {isNum} from "../utils/nodeType";

const divNumbers = (leftNumber: Num, rightNumber: Num) => createNum(leftNumber.value / rightNumber.value);

const evalDiv = (mul: Div, stack: Stack) => {
    const [lChild, rChild] = evalChildren(mul, stack);

    if (isNum(lChild) && isNum(rChild))
        return divNumbers(lChild as Num, rChild as Num);

    throw `div: incompatible types: ${lChild.type}, ${rChild.type}`;
};

export default evalDiv;