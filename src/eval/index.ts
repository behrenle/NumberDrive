import {Node, Stack} from "../types";
import evalNum from "./num";
import evalSym from "./sym";
import evalAdd from "./add";

export const evalNode = (node: Node, stack: Stack): Node => {
    switch (node.type) {
        case "num":
            return evalNum(node);

        case "sym":
            return evalSym(node, stack);

        case "add":
            return evalAdd(node, stack);

        default:
            throw "unknown node type";
    }
};