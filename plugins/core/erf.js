import tools from "../../pluginTools.js";
import manual from "./manual/erf.js";

export default {
  name: "core-erf",
  genericFunctions: {},
  inlineDefinitions: [
    "__erf_t(x) := 1 / (1 + 0.5 * abs(x))",
    "__erf_tau(x, t) := t * exp(-x^2 - 1.26551223 + 1.00002368 * t + 0.37409196 * t^2 + 0.09678418 * t^3 - 0.18628806 * t^4 + 0.27886807 * t^5 - 1.13520398 * t^6 + 1.48851587 * t^7 - 0.82215223 * t^8 + 0.17087277 * t^9)",
    "erf(x) := switch(x, 2 - __erf_tau(x, __erf_t(x)), __erf_tau(-x, __erf_t(x))) - 1",
  ],
  manual
};
