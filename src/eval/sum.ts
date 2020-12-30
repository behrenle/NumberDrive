import {Node, Number, Stack, Sum} from "../types";
import {evaluate} from "./index";
import {applyMetaToNode} from "../utils/meta";
import {createNumberFromValue} from "../create";

const addNumbers = (a: Number, b: Number): Number => {
    return createNumberFromValue(a.meta.positive * a.value + b.meta.positive * b.value);
};

const evalSum = (sum: Sum, stack: Stack): Node => {
    const children = sum.children.map(child => evaluate(child, stack));
    const result = children.reduce((acc: Node, value: Node): Node => {
        if (acc.type === "number" && value.type === "number")
            return addNumbers(acc as Number, value as Number);

        throw `incompatible sum items: ${acc.type}, ${value.type} `;
    });
    return applyMetaToNode(result, sum.meta);
};

export default evalSum;