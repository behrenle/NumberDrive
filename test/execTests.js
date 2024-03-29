import NumberDrive from "../numberDrive.js";
import prelude from "../prelude.js";
import assert from "assert";

import evaluateTests from "./tests/evaluate.js";
import summarizeTests from "./tests/summarize.js";

function executeTestBatch(categoryName, testArray, lambda) {
    let failedTests = 0;
    console.group(`${categoryName}: Running ${testArray.length} tests:`);
    testArray.forEach((item, i) => {
        let stack = prelude();

        let parsedInput, parsedOutput;
        try {
            parsedInput = NumberDrive.parse(item[0]);
            parsedOutput = NumberDrive.parse(item[1]);
        } catch (e) {
            throw `SyntaxError: ${e.message}`;
        }

        parsedInput.setStack(stack);
        parsedOutput.setStack(stack);

        let result = lambda(parsedInput),
            expected = lambda(parsedOutput);

        try {
            assert.equal(
                result.equals(expected) || result.serialize() === expected.serialize(),
                true
            );
        } catch (e) {
            console.group(`\n#${i} test failed:`);
            console.table({
                input: item[0],
                output: item[1],
                ["test(input)"]: result.serialize(),
                ["test(output)"]: expected.serialize(),
                ["constructor1"]: result.serialize().constructor.name,
                ["constructor2"]: expected.serialize().constructor.name
            });
            console.groupEnd();
            failedTests++;
        }
    });
    console.groupEnd();
    return failedTests;
}

let evalTest = (node) => {
    return node.evaluate();
}

let summarizeTest = (node) => {
    return node.breakDown().summarize();
}

const tests = {
    Evaluation: {
        tests: evaluateTests,
        lambda: evalTest
    },
    Summarize: {
        tests: summarizeTests,
        lambda: summarizeTest
    }
};

let failedTests = 0,
    totalTests = 0;

Object.entries(tests).forEach((entry) => {
    let key = entry[0],
        value = entry[1];

    totalTests += value.tests.length;
    failedTests += executeTestBatch(key, value.tests, value.lambda);
});

console.log(`${failedTests} of ${totalTests} tests failed`);
