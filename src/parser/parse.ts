import {parse} from "./parser";
import {Node} from "../types";

export default (input: string) => {
    return parse(input) as Node;
}
