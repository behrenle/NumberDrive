import {Node, NodeMetadata} from "../types";

export const isPositive = (meta: NodeMetadata) => {
    return meta.positive === 1;
};

export const isMultiply = (meta: NodeMetadata) => {
    return meta.multiply === 1;
};

export const applyMeta = (meta1: NodeMetadata, meta2: NodeMetadata): NodeMetadata => {
    return {
        positive: meta1.positive * meta2.positive,
        multiply: meta1.multiply * meta2.multiply
    } as NodeMetadata;
};

export const applyMetaToNode = (node: Node, meta: NodeMetadata): Node => {
    return {
        ...node,
        meta: applyMeta(node.meta, meta)
    };
};