import Decimal from 'decimal.js';
import piStr from "./pi.js";
import manual from "./manual/constants.js";

const eStr = Decimal.exp(1).toString();

export default {
  name: "core-constants",
  inlineDefinitions: [
    "pi := acos(-1)",
    `e := ${eStr}`,
    `deg := ${new Decimal(piStr).div(180).toString()}`,
  ],
  manual: manual
};
