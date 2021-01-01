import pegjs from "pegjs";
import tspegjs from "ts-pegjs";
import fs from "fs";
import path from "path";

const grammarSource = fs.readFileSync(path.resolve(__dirname, 'grammar.peg'), 'utf8');

const parserSource = pegjs.generate(grammarSource, {
    output: "source",
    format: "commonjs",
    plugins: [tspegjs],
    "tspegjs": {
        "noTslint": false,
        "tslintIgnores": "rule1,rule2",
        "customHeader": "// import lib\nimport { Lib } from 'mylib';"
    }
});

fs.writeFileSync(path.resolve(__dirname, 'parser.ts'), parserSource);