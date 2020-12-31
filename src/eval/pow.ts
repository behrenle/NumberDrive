import {Num, Pow, Stack} from "../types";
import {createNum} from "../create";
import {evalChildren} from "./index";
import {isNum} from "../utils/nodeType";

const powNumbers = (leftNumber: Num, rightNumber: Num) => createNum(Math.pow(
    leftNumber.value, rightNumber.value
));

const evalPow = (mul: Pow, stack: Stack) => {
    const [lChild, rChild] = evalChildren(mul, stack);

    if (isNum(lChild) && isNum(rChild))
        return powNumbers(lChild as Num, rChild as Num);

    throw `pow: incompatible types: ${lChild.type}, ${rChild.type}`;
};

export default evalPow;