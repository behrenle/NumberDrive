const FailedParsingException = require("./exceptions/FailedParsingException");
const Script = require("./script");
const Manual = require("./manual.js");
const parse = require("./parse");
const prelude = require("./prelude");

const NumberDrive = {
  Script: Script,
  Manual: Manual,
  evaluate: (string) => {
    let node = parse(string);
    node.setStack(prelude());
    return node.evaluate().serialize();
  },
  parse
};

module.exports = NumberDrive;
