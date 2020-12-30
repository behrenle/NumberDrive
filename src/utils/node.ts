import {OperatorNode, Node} from "../types";

export const leftChild = (node: OperatorNode): Node => node.children[0];
export const rightChild = (node: OperatorNode): Node => node.children[1];

