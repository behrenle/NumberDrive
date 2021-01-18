import {parse} from "./parser";
import {Node} from "../types";

type Result = Node | string;

export default (input: string): Result => {
    try {
        return parse(input) as Node;
    } catch (e) {
        return e.message;
    }
}

