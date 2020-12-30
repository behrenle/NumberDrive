import {Node} from "../types";
import evalNumber from "./number";
import evalSum from "./sum";

export const evaluate = (node: Node): Node => {
    switch (node.type) {
        case "number":
            return evalNumber(node);

        case "sum":
            return evalSum(node);

        default:
            throw "unknown node type";
    }
};