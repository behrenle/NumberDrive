const AstBuilder = require("./astBuilder.js");
const Parser = require('@behrenle/number-drive-parser');

module.exports = (string) => {
  try {
    return AstBuilder.build(Parser.parse(string));
  } catch (e) {
    return "SyntaxError";
  }
}
