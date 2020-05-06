const Decimal = require("decimal.js");
const piStr = require("./pi.json")[0];
const eStr = Decimal.exp(1).toString();

module.exports = {
  name: "core-constants",
  inlineDefinitions: [
    "pi := acos(-1)",
    `e := ${eStr}`,
    `deg := ${new Decimal(piStr).div(180).toString()}`,
  ],
  manual: require("./manual/constants.json"),
};
