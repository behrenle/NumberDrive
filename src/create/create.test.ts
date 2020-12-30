import {createNumber, createNumberFromValue} from "./number";
import {createSum} from "./sum";
import {createMeta} from "../utils/meta";
import {createSymbol} from "./symbol";
import {Sum, Symbol} from "../types";

test("createNumber", () => {
    expect(createNumber(-2, {positive: 1, multiply: -1}))
        .toStrictEqual({type: "number", value: 0.5, meta: {positive: -1, multiply: 1}});
});

test("createNumberFromValue", () => {
    expect(createNumberFromValue(-2))
        .toStrictEqual({type: "number", value: 2, meta: {positive: -1, multiply: 1}});
})

test("createSum", () => {
    const num1 = createNumberFromValue(-1);
    const num2 = createNumberFromValue(2);
    const sum = createSum([num1, num2], createMeta(1, -1));
    const eql = {type: "sum", children: [num1, num2], meta: createMeta(1, -1)} as Sum;
    expect(sum).toStrictEqual(eql);
});

test("createSymbol", () => {
    expect(createSymbol("foo", createMeta(-1, 1)))
        .toStrictEqual({
            type: "symbol",
            meta: createMeta(-1, 1),
            name: "foo"
        } as Symbol);
});