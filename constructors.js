const Decimal = require('decimal.js');

Decimal.precision = 25;

module.exports = {
  AbstractNode:      require("./nodes/AbstractNode"),
  AbstractContainer: require("./nodes/AbstractContainer"),
  Decimal:           Decimal,
  Number:            require("./nodes/Number"),
  Symbol:            require("./nodes/Symbol"),
  Sum:               require("./nodes/Sum"),
  Product:           require("./nodes/Product"),
  Power:             require("./nodes/Power"),
  Tensor:            require("./nodes/Tensor"),
  Function:          require("./nodes/Function"),
  FunctionCall:      require("./nodes/FunctionCall"),
  Definition:        require("./nodes/Definition"),
  Equation:          require("./nodes/Equation"),
};
