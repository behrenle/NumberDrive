import {Stack} from "./types";
import parse from "./parser/parse";
import {evalNode} from "./eval";

export const evaluate = (input: string, stack: Stack) => {
    return evalNode(parse(input), stack);
}

