import {Node, OperatorNode} from "../types";
import {leftChild, rightChild} from "./node";

const connectionStrengths = {
    add: 1,
    sub: 2,
    mul: 3,
    div: 4,
    pow: 5,
    sym: 6,
    num: 6,
};

const serialize = (node: Node): string => {
    switch (node.type) {
        case "num":
            return node.value.toString();

        case "sym":
            return node.name;

        case "add":
            return serializeOperator(node, " + ");

        case "sub":
            return serializeOperator(node, " - ");

        case "mul":
            return serializeOperator(node, " * ");

        case "div":
            return serializeOperator(node, " / ");

        case "pow":
            return serializeOperator(node, "^");
    }
};

const serializeOperator = (node: OperatorNode, operatorSymbol: string): string => {
    const nodeConnectionStrength = connectionStrengths[node.type];
    const lChildStr = serializeOperatorChild(leftChild(node), nodeConnectionStrength);
    const rChildStr = serializeOperatorChild(rightChild(node), nodeConnectionStrength);
    return lChildStr + operatorSymbol + rChildStr;
};

const serializeOperatorChild = (child: Node, parentConnectionStrength: number): string => {
    const serializedChild = serialize(child);
    const childConnectionStrength = connectionStrengths[child.type];
    return childConnectionStrength < parentConnectionStrength ? `(${serializedChild})` : serializedChild;
};

export default serialize;