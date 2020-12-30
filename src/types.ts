interface AbstractNode {
    type: string,
}

interface AbstractOperatorNode extends AbstractNode {
    children: [Node, Node],
}

export interface Num extends AbstractNode {
    type: "num",
    value: number
}

export interface Sym extends AbstractNode {
    type: "sym",
    name: string
}

export interface Add extends AbstractOperatorNode {
    type: "add"
}

export interface Sub extends AbstractOperatorNode {
    type: "sub"
}

export interface Mul extends AbstractOperatorNode {
    type: "mul"
}

export interface Div extends AbstractOperatorNode {
    type: "div"
}

export interface Pow extends AbstractOperatorNode {
    type: "pow"
}

export type Node = Num | Sym | Add | Sub | Mul | Div | Pow;

export interface StackFrame {
    [key: string]: Node
}

export type Stack = StackFrame[];