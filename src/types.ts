export interface NodeMetadata {
    positive: 1 | -1;
    multiply: 1 | -1;
}

export interface Number {
    type: "number",
    meta: NodeMetadata,
    value: number,
}

export interface Sum {
    type: "sum",
    meta: NodeMetadata,
    children: Node[];
}

export type Node = Number | Sum;