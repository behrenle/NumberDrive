import {createAdd, createDiv, createMul, createNum, createPow, createSub, createSym} from "../create";
import serialize from "./serialize";

test("serializeNum", () => {
    const num = createNum(3.14);
    expect(serialize(num)).toBe("3.14");
});

test("serializeSym", () => {
    const sym = createSym("hello");
    expect(serialize(sym)).toBe("hello");
});

test("serializeAdd", () => {
    expect(serialize(createAdd(
        createNum(2),
        createNum(3)
    ))).toBe("2 + 3");
});

test("serializeSub", () => {
    expect(serialize(createSub(
        createNum(2),
        createNum(3)
    ))).toBe("2 - 3");
});

test("serializeMul", () => {
    expect(serialize(createMul(
        createNum(2),
        createNum(3)
    ))).toBe("2 * 3");
});


test("serializeDiv", () => {
    expect(serialize(createDiv(
        createNum(2),
        createNum(3)
    ))).toBe("2 / 3");
});

test("serializePow", () => {
    expect(serialize(createPow(
        createNum(2),
        createNum(3)
    ))).toBe("2^3");
});

test("serializeWithBrackets#1", () => {
    expect(serialize(
        createPow(
            createMul(
                createNum(1),
                createNum(2)
            ),
            createMul(
                createDiv(
                    createNum(4),
                    createNum(5)
                ),
                createAdd(
                    createNum(6),
                    createSub(
                        createNum(7),
                        createNum(8)
                    )
                )
            )
        )
    )).toBe("(1 * 2)^(4 / 5 * (6 + 7 - 8))");
});

test("serializeWithBrackets#2", () => {
    expect(serialize(
        createAdd(
            createNum(1),
            createSub(
                createNum(2),
                createAdd(
                    createNum(3),
                    createNum(4)
                )
            )
        )
    )).toBe("1 + 2 - (3 + 4)");
});

