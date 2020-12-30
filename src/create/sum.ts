import {Sum, NodeMetadata, Node} from "../types";

export const createSum = (children: Node[], meta: NodeMetadata): Sum => {
    return {type: "sum", children, meta};
}