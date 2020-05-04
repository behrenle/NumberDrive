const AstBuilder = new (require("./TreeBuilder.js"))();
const Parser = require('@behrenle/number-drive-parser');

module.exports = (string) => {
  try {
    return AstBuilder.build(Parser.parse(string));
  } catch (e) {
    return "SyntaxError";
  }
}
