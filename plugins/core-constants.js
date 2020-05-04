const Decimal = require("decimal.js");

const piStr = "3.141592653589793238462643383";
const eStr = Decimal.exp(1).toString();

module.exports = {
  inlineDefinitions: [
    `pi := ${piStr}`,
    `e := ${eStr}`,
    `deg := ${new Decimal(piStr).div(180).toString()}`,
  ],
};
