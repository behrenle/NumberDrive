import {Number, Stack} from "../types";
import {isMultiply} from "../utils/meta";

const evalNumber = (number: Number, stack: Stack): Number => {
    let value = number.value;
    let meta = {...number.meta};

    if (value < 0) {
        meta.positive *= -1;
        value = Math.abs(value);
    }

    if (!isMultiply(meta)) {
        meta.multiply = 1;
        value = 1 / value;
    }

    return {type: "number", value, meta};
}

export default evalNumber;