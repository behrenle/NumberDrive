import {evaluate} from "./index";
import {createNumberFromValue, createSum, createSymbol} from "../create";
import {addItem} from "../utils/stack";
import {createMeta} from "../utils/meta";

const emptyStack = [{}];

test("evalNumber", () => {
    expect(evaluate({
        type: "number",
        value: -2,
        meta: {
            multiply: -1,
            positive: 1
        }
    }, emptyStack)).toStrictEqual({
        type: "number",
        value: 0.5,
        meta: {
            multiply: 1,
            positive: -1,
        }
    });
});

test("evalSum#1", () => {
    const children = [createNumberFromValue(-2), createNumberFromValue(2)];
    const sum = createSum(children, {positive: 1, multiply: 1});
    expect(evaluate(sum, emptyStack)).toStrictEqual(createNumberFromValue(0));
});

test("evalSum#2", () => {
    const children = [createNumberFromValue(-2), createNumberFromValue(3)];
    const sum = createSum(children, {positive: -1, multiply: 1});
    expect(evaluate(sum, emptyStack)).toStrictEqual(createNumberFromValue(-1));
});

test("evalSymbol", () => {
    const symbol = createSymbol("foo", createMeta(1, 1));
    const value = createNumberFromValue(-2);
    const stack = addItem(emptyStack, "foo", value);
    expect(evaluate(symbol, stack)).toStrictEqual(value);
});