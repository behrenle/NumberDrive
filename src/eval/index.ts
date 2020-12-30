import {Node, Stack} from "../types";
import evalNumber from "./number";
import evalSum from "./sum";
import evalSymbol from "./symbol";

export const evaluate = (node: Node, stack: Stack): Node => {
    switch (node.type) {
        case "number":
            return evalNumber(node, stack);

        case "sum":
            return evalSum(node, stack);

        case "symbol":
            return evalSymbol(node, stack);

        default:
            throw "unknown node type";
    }
};