import {NodeMetadata, Number} from "../types";
import {isMultiply} from "../utils/meta";

export const createNumber = (v: number, m: NodeMetadata): Number => {
    let value = v;
    let meta = {...m};

    if (value < 0) {
        meta.positive *= -1;
        value = Math.abs(value);
    }

    if (!isMultiply(meta)) {
        meta.multiply = 1;
        value = 1 / value;
    }

    return {type: "number", value, meta};
};

export const createNumberFromValue = (v: number): Number => {
    return createNumber(v, {positive: 1, multiply: 1});
}