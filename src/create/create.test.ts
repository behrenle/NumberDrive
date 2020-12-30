import {createAdd, createDiv, createMul, createNum, createPow, createSub, createSym} from "./index";

test("createNum", () => {
    expect(createNum(-2)).toStrictEqual({type: "num", value: -2})
});

test("createSym", () => {
    expect(createSym("foo")).toStrictEqual({type: "sym", name: "foo"});
});

test("createAdd", () => {
    const num = createNum(-2);
    const sym = createSym("foo");
    expect(createAdd(num, sym)).toStrictEqual({type: "add", children: [num, sym]});
});

test("createSub", () => {
    const num = createNum(-2);
    const sym = createSym("foo");
    expect(createSub(num, sym)).toStrictEqual({type: "sub", children: [num, sym]});
});

test("createMul", () => {
    const num = createNum(-2);
    const sym = createSym("foo");
    expect(createMul(num, sym)).toStrictEqual({type: "mul", children: [num, sym]});
});

test("createDiv", () => {
    const num = createNum(-2);
    const sym = createSym("foo");
    expect(createDiv(num, sym)).toStrictEqual({type: "div", children: [num, sym]});
});

test("createPow", () => {
    const num = createNum(-2);
    const sym = createSym("foo");
    expect(createPow(num, sym)).toStrictEqual({type: "pow", children: [num, sym]});
});