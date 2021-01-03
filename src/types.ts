interface AbstractNode {
    type: string,
}

export interface AbstractOperatorNode extends AbstractNode {
    children: [Node, Node],
}

export interface Num extends AbstractNode {
    type: "num",
    value: number
}

export interface Bool extends AbstractNode {
    type: "bool",
    value: boolean
}

export interface Sym extends AbstractNode {
    type: "sym",
    name: string
}

export interface Vec extends AbstractNode {
    type: "vec",
    children: Node[]
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

export interface Eq extends AbstractOperatorNode {
    type: "eq"
}

export interface Lt extends AbstractOperatorNode {
    type: "lt"
}

export interface Lte extends AbstractOperatorNode {
    type: "lte"
}

export interface Gt extends AbstractOperatorNode {
    type: "gt"
}

export interface Gte extends AbstractOperatorNode {
    type: "gte"
}

export interface And extends AbstractOperatorNode {
    type: "and"
}

export interface Or extends AbstractOperatorNode {
    type: "or"
}

export interface Not extends AbstractNode {
    type: "not",
    value: Node
}

// intermediate nodes
export interface CallOrMul extends AbstractOperatorNode {
    type: "callOrMul"
}

// other nodes
interface FuncSigChild {
    type: "number" | "tensor" | "boolean" | "any",
    name: string
}

export interface FuncSig extends AbstractNode {
    type: "funcSig",
    children: FuncSigChild[]
}

export interface Def extends AbstractNode {
    type: "def",
    target: FuncSig | Symbol,
    value: Node
}


export type RelationNode = Eq | Lt | Lte | Gt | Gte;
export type AtomicNode = Num | Sym | Vec | Bool;
export type NumericOperatorNode = Add | Sub | Mul | Div | Pow;
export type BooleanOperatorNode = And | Or | Not;
export type Node = AtomicNode
    | NumericOperatorNode
    | RelationNode
    | BooleanOperatorNode
    | FuncSig
    | Def;

export interface StackFrame {
    [key: string]: Node
}

export type Stack = StackFrame[];