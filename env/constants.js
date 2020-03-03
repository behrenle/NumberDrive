const constructors = require("../constructors");

module.exports = {
  pi: new constructors.Number(
    constructors,
    constructors.Decimal.asin(1)
  ),
  e:  new constructors.Number(
    constructors,
    constructors.Decimal.exp(1)
  ),
}
