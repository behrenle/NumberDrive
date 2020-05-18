import tools from "../../pluginTools.js";
import manual from "./manual/tensor.js";
import Decimal from 'decimal.js';

const funcs = {
  dims: function(parameters, stack) {
    let param  = tools.checkParameters(parameters, ["tensor"])[0],
        result = param.new("Tensor", [param.getDimensions().length]);

    for (let i = 0; i < param.getDimensions().length; i++) {
      result.setElement(i, param.new("Number", param.getDimensions()[i]));
    }

    return result;
  },

  set: function(parameters, stack) {
    let params = tools.checkParameters(parameters, ["tensor", "tensor", "number"]),
        dest   = params[0],
        coords = params[1],
        value  = params[2];

    let realCoords = gFuncTools.indexCheck(dest, coords);

    dest.setElement(realCoords, value);

    return dest;
  },

  get: function(parameters, stack) {
    let params = tools.checkParameters(parameters, ["tensor", "tensor"]),
        dest   = params[0],
        coords = params[1];

    let realCoords = gFuncTools.indexCheck(dest, coords);

    return dest.getElement(realCoords);
  },

  det: function(parameters, stack) {
    let param = tools.checkParameters(parameters, ["tensor"])[0];
    return param.det().evaluate();
  },

  cross: function(parameters, stack) {
    let params = tools.checkParameters(parameters, ["tensor", "tensor"]),
        vec1 = params[0],
        vec2 = params[1];

    let dims1 = vec1.getDimensions(),
        dims2 = vec2.getDimensions();

    if (dims1.length != 1 && dims2.length != 1)
      throw "invalid input dimensions";

    if (dims1[0] != dims2[0])
      throw "invalid input dimensions";

    if (dims1[0] != 3)
      throw "invalid input dimensions";

    let a = vec1.getElements().map(x => x.getDecimalValue());
    let b = vec2.getElements().map(x => x.getDecimalValue());

    let r1 = Decimal.sub(
      Decimal.mul(
        a[1], b[2]
      ),
      Decimal.mul(
        a[2], b[1]
      )
    );
    let r2 = Decimal.sub(
      Decimal.mul(
        a[2], b[0]
      ),
      Decimal.mul(
        a[0], b[2]
      )
    );
    let r3 = Decimal.sub(
      Decimal.mul(
        a[0], b[1]
      ),
      Decimal.mul(
        a[1], b[0]
      )
    );

    result = params[0].new("Tensor", [3]);
    result.setElement(0, params[0].new("Number", r1));
    result.setElement(1, params[0].new("Number", r2));
    result.setElement(2, params[0].new("Number", r3));

    return result;
  }
}

export default {
  name: "core-tensor",
  genericFunctions: funcs,
  inlineDefinitions: [],
  manual
};
