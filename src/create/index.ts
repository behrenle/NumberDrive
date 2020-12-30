import {Add, Div, Mul, Node, Num, Pow, Sub, Sym} from "../types";

export const createNum = (value: number): Num => {
    return {type: "num", value};
};

export const createSym = (name: string): Sym => {
    return {type: "sym", name};
};

export const createAdd = (leftChild: Node, rightChild: Node): Add => {
    return {type: "add", children: [leftChild, rightChild]};
};

export const createSub = (leftChild: Node, rightChild: Node): Sub => {
    return {type: "sub", children: [leftChild, rightChild]};
};

export const createMul = (leftChild: Node, rightChild: Node): Mul => {
    return {type: "mul", children: [leftChild, rightChild]};
};

export const createDiv = (leftChild: Node, rightChild: Node): Div => {
    return {type: "div", children: [leftChild, rightChild]};
};

export const createPow = (leftChild: Node, rightChild: Node): Pow => {
    return {type: "pow", children: [leftChild, rightChild]};
};