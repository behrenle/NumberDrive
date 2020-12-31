import {evalNode} from "./index";
import {createAdd, createMul, createNum, createSub, createSym} from "../create";

const emptyStack = [{}];

test("evalNum", () => {
    const num = createNum(-2.12345);
    expect(evalNode(num, emptyStack)).toStrictEqual(num);
});

test("evalSym", () => {
    const sym = createSym("fooBar");
    const num = createNum(2.76);
    const stack = [{"fooBar": num}];
    expect(evalNode(sym, stack)).toStrictEqual(num);
});

test("evalAdd", () => {
    const sym = createSym("fooBar");
    const num = createNum(2);
    const num2 = createNum(3);
    const num3 = createNum(5);
    const add = createAdd(sym, num2);
    const stack = [{"fooBar": num}];
    expect(evalNode(add, stack)).toStrictEqual(num3);
});

test("evalSub", () => {
    const sym = createSym("fooBar");
    const num = createNum(2);
    const num2 = createNum(3);
    const num3 = createNum(-1);
    const sub = createSub(sym, num2);
    const stack = [{"fooBar": num}];
    expect(evalNode(sub, stack)).toStrictEqual(num3);
});

test("evalMul", () => {
    const sym = createSym("fooBar");
    const num = createNum(-2);
    const num2 = createNum(3);
    const num3 = createNum(-6);
    const sub = createMul(sym, num2);
    const stack = [{"fooBar": num}];
    expect(evalNode(sub, stack)).toStrictEqual(num3);
});