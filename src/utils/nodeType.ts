import {Node} from "../types";

const eq = (u: string, v: string) => u === v;

export const isNum = (node: Node) => eq(node.type, "num");
export const isSym = (node: Node) => eq(node.type, "sym");
export const isAdd = (node: Node) => eq(node.type, "add");
export const isSub = (node: Node) => eq(node.type, "sub");
export const isMul = (node: Node) => eq(node.type, "mul");
export const isDiv = (node: Node) => eq(node.type, "div");
export const isPow = (node: Node) => eq(node.type, "pow");
