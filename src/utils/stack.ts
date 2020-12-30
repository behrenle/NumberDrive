import {Node, Stack, StackFrame} from "../types";

export const createStack = (): Stack => {
    return [];
};

export const pushStackFrame = (stack: Stack, stackFrame: StackFrame): Stack => {
    return [...stack, stackFrame];
};

export const popStackFrame = (stack: Stack): Stack => {
    return stack.slice(0, stack.length - 1);
};

export const getItem = (stack: Stack, key: string): Node => {
    for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i][key] !== undefined)
            return stack[i][key];
    }
    throw `unknown symbol "${key}"`;
};

export const addItem = (stack: Stack, key: string, node: Node): Stack => {
    if (stack.length === 0)
        throw "no stack frame available";

    return stack.map((stackFrame: StackFrame, index: number) => {
        if (index < stack.length - 1)
            return stackFrame;

        return {...stackFrame, [key]: node};
    });
};