import {createNumber, createNumberFromValue} from "./number";

test("createNumber", () => {
    expect(createNumber(-2, {positive: 1, multiply: -1}))
        .toStrictEqual({type: "number", value: 0.5, meta: {positive: -1, multiply: 1}});
});

test("createNumberFromValue", () => {
    expect(createNumberFromValue(-2))
        .toStrictEqual({type: "number", value: 2, meta: {positive: -1, multiply: 1}});
})
