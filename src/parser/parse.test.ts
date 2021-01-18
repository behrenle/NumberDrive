import parse from "./parse";

test("test-parser", () => {
    if (typeof parse("++") !== "string")
        throw "expected syntax error";
})