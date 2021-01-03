import {NumericOperatorNode, Node} from "../types";

export const leftChild = (node: NumericOperatorNode): Node => node.children[0];
export const rightChild = (node: NumericOperatorNode): Node => node.children[1];

