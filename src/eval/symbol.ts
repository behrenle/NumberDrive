import {Node, Stack, Symbol} from "../types";
import {getItem} from "../utils/stack";
import {evaluate} from "./index";
import {applyMetaToNode} from "../utils/meta";

const evalSymbol = (symbol: Symbol, stack: Stack): Node => {
    const item = getItem(stack, symbol.name);
    return evaluate(applyMetaToNode(item, symbol.meta), stack);
};

export default evalSymbol;