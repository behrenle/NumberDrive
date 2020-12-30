import {evaluate} from "./index";
import {createSum} from "../create";
import {createNumberFromValue} from "../create/number";

test("evalNumber", () => {
    expect(evaluate({
        type: "number",
        value: -2,
        meta: {
            multiply: -1,
            positive: 1
        }
    })).toStrictEqual({
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
    expect(evaluate(sum)).toStrictEqual(createNumberFromValue(0));
})

test("evalSum#2", () => {
    const children = [createNumberFromValue(-2), createNumberFromValue(3)];
    const sum = createSum(children, {positive: -1, multiply: 1});
    expect(evaluate(sum)).toStrictEqual(createNumberFromValue(-1));
})