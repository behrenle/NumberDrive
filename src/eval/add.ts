import {Add, Node, Num, Stack} from "../types";
import {createNum} from "../create";
import {isNum} from "../utils/nodeType";
import {leftChild, rightChild} from "../utils/node";
import {evalNode} from "./index";

const addNumbers = (leftNumber: Num, rightNumber: Num) => createNum(leftNumber.value + rightNumber.value);

const evalAdd = (add: Add, stack: Stack): Node => {
    const lChild = evalNode(leftChild(add), stack);
    const rChild = evalNode(rightChild(add), stack);

    if (isNum(rChild) && isNum(lChild))
        return addNumbers(lChild as Num, rChild as Num);

    throw `sum: incompatible types: ${lChild.type}, ${rChild.type}`;
};

export default evalAdd;