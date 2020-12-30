export interface NodeMetadata {
    positive: 1 | -1;
    multiply: 1 | -1;
}

interface AbstractNode {
    type: string,
}

interface NodeWithMetadata extends AbstractNode {
    meta: NodeMetadata
}

export interface Number extends NodeWithMetadata {
    type: "number",
    value: number,
}

export interface Sum extends NodeWithMetadata {
    type: "sum",
    children: Node[];
}

export interface Symbol extends NodeWithMetadata{
    type: "symbol",
    name: string
}

export type Node = Number | Symbol | Sum;