import Decimal from 'decimal.js';
import AbstractNode from "./nodes/AbstractNode.js";
import AbstractContainer from "./nodes/AbstractContainer.js";
import Number from "./nodes/Number.js";
import Symbol from "./nodes/Symbol.js";
import Sum from "./nodes/Sum.js";
import Product from "./nodes/Product.js";
import Power from "./nodes/Power.js";
import Tensor from "./nodes/Tensor.js";
import Function from "./nodes/Function.js";
import FunctionCall from "./nodes/FunctionCall.js";
import Definition from "./nodes/Definition.js";
import Equation from "./nodes/Equation.js";

Decimal.precision = 25;

export default {
  Decimal,
  AbstractNode,
  AbstractContainer,
  Number,
  Symbol,
  Sum,
  Product,
  Power,
  Tensor,
  Function,
  FunctionCall,
  Definition,
  Equation
};
