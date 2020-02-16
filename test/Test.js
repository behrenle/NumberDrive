const NumberDrive = require("../numberDrive");
const path = require("path");
const fs = require("fs");
const dumpDir = path.dirname(require.main.filename) + "/dumps/";
var nextID = 0;

class Test {
  constructor(type = "Test", inputStr = "", outputStr = "") {
    this.type = type;
    this.inputStr = inputStr;
    this.outputStr = outputStr;
    this.succeeded = false;
    this.ID = nextID;
    nextID++;
    try {
      this.input = NumberDrive.parse(inputStr);
      this.output = NumberDrive.parse(outputStr);
    } catch (e) {
      this.parseError = e;
    }
  }

  test() {
    this.succeeded = true;
  }

  additionalDumps() {
    return "";
  }

  dump() {
    var dumpStr = this.type + " dump:\n",
        outStr  = "Output Tree:\n",
        inStr   = "Input Tree:\n",
        outSerial = "Output serialized:\n",
        inSerial  = "Input serialized:\n";

    dumpStr += "Type: " + this.type + "\n";

    if (this.parseError) {
      dumpStr += "ParseError: " + this.parseError.stringify() + "\n";
    } else {
      outStr += this.output.stringify().join("\n") + "\n";
      inStr  += this.input.stringify().join("\n") + "\n";
      outSerial += this.output.serialize() + "\n";
      inSerial  += this.input.serialize() + "\n";
    }

    dumpStr += [
      "Input string: " + this.inputStr + "\n",
      "Expected output string: " + this.outputStr + "\n",
      inSerial, outSerial, inStr, outStr,
      this.additionalDumps()
    ].join("\n");

    fs.writeFile(
      dumpDir + "dump_" + this.ID + ".txt",
      dumpStr, function(err) {
        if (err) {
          console.error(err);
        }
      }
    );
  }
}

module.exports = Test;
