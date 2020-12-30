import {Node, Stack, Symbol} from "../types";
import {getItem} from "../utils/stack";

const evalSymbol = (symbol: Symbol, stack: Stack): Node => {
    return getItem(stack, symbol.name);
};

export default evalSymbol;