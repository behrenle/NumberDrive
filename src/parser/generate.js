import pegjs from "pegjs";
import fs from "fs";

const currentDir = "src/parser/"
const grammarSource = fs.readFileSync(currentDir + 'grammar.peg', 'utf8');
const parserSource = pegjs.generate(grammarSource, {
    output: "source",
    format: "commonjs",
});

fs.writeFileSync(currentDir + 'parser.js', parserSource);
