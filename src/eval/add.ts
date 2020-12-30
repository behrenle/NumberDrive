import {Add, Num, Stack} from "../types";
import {createNum} from "../create";
import {isNum} from "../utils/nodeType";
import {evalChildren} from "./index";

const addNumbers = (leftNumber: Num, rightNumber: Num) => createNum(leftNumber.value + rightNumber.value);

const evalAdd = (add: Add, stack: Stack) => {
    const [lChild, rChild] = evalChildren(add, stack);

    if (isNum(rChild) && isNum(lChild))
        return addNumbers(lChild as Num, rChild as Num);

    throw `sum: incompatible types: ${lChild.type}, ${rChild.type}`;
};

export default evalAdd;