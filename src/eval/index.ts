import {Node, NumericOperatorNode, Stack} from "../types";
import evalNum from "./num";
import evalSym from "./sym";
import evalAdd from "./add";
import {leftChild, rightChild} from "../utils/node";
import evalSub from "./sub";
import evalMul from "./mul";
import evalDiv from "./div";
import evalPow from "./pow";

export const evalNode = (node: Node, stack: Stack): Node => {
    switch (node.type) {
        case "num":
            return evalNum(node);

        case "sym":
            return evalSym(node, stack);

        case "add":
            return evalAdd(node, stack);

        case "sub":
            return evalSub(node, stack);

        case "mul":
            return evalMul(node, stack);

        case "div":
            return evalDiv(node, stack);

        case "pow":
            return evalPow(node, stack);

        default:
            throw "unknown node type";
    }
};

export const evalChildren = (node: NumericOperatorNode, stack: Stack): [Node, Node] => {
    return [evalNode(leftChild(node), stack), evalNode(rightChild(node), stack)];
}