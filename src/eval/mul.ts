import {Mul, Num, Stack} from "../types";
import {createNum} from "../create";
import {evalChildren} from "./index";
import {isNum} from "../utils/nodeType";

const mulNumbers = (leftNumber: Num, rightNumber: Num) => createNum(leftNumber.value * rightNumber.value);

const evalMul = (mul: Mul, stack: Stack) => {
    const [lChild, rChild] = evalChildren(mul, stack);

    if (isNum(lChild) && isNum(rChild))
        return mulNumbers(lChild as Num, rChild as Num);

    throw `mul: incompatible types: ${lChild.type}, ${rChild.type}`;
};

export default evalMul;