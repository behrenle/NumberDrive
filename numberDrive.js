import FailedParsingException from "./exceptions/FailedParsingException.js";
import Script from "./script.js";
import Manual from "./manual.js";
import parse from "./parse.js";
import prelude from "./prelude.js";

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

export default NumberDrive;
