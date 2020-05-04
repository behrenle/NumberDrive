const FailedParsingException = require("./exceptions/FailedParsingException");
const Script = require("./script");
const Manual = require("./manual.json");
const parse = require("./parse");

const NumberDrive = {
  Script: Script,
  Manual: Manual,
  evaluate: (string) => {
    let node = parse(string);
    return node.evaluate().serialize();
  },
  parse
};

module.exports = NumberDrive;
