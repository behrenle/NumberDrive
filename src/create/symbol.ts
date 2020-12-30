import {NodeMetadata, Symbol} from "../types";

export const createSymbol = (name: string, meta: NodeMetadata): Symbol => {
    return {type: "symbol", name, meta};
};
