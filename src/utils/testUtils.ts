import {evaluate} from "../index";

export const testEval = (input: string, output: string, stack = []) => {
    return () => {
        expect(evaluate(input, stack)).toStrictEqual(evaluate(output, stack));
    };
}