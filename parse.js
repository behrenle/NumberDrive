const AstBuilder = require("./astBuilder.js");
const Parser = require('@behrenle/number-drive-parser');

module.exports = (string) => {
  return AstBuilder.build(Parser.parse(string));
}
