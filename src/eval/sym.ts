import {Sym, Stack} from "../types";
import {getItem} from "../utils/stack";

const evalSym = (sym: Sym, stack: Stack) => getItem(stack, sym.name);

export default evalSym;