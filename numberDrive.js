const FailedParsingException = require("./exceptions/FailedParsingException");
const Script = require("./script");
const Manual = require("./manual.json");
const parse = require("./parse");
const prelude = require("./prelude");

const core_constants = require("./plugins/core-constants");

const NumberDrive = {
  Script: Script,
  Manual: Manual,
  evaluate: (string) => {
    let node = parse(string);
    node.setStack(prelude([core_constants]));
    return node.evaluate().serialize();
  },
  parse
};

module.exports = NumberDrive;
