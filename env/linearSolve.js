const constructors = require("../constructors");
const gFuncTools   = require("./gFuncTools");

function getCoeffs(node) {
  if (node.getType() == "sum") {
    var coeffs = [];
    for (var e of node.getElements()) {
      coeffs = coeffs.concat(getCoeffs(e));
    }
    return coeffs;
  } else if (node.getType() == "product") {
    if (node.getElements().length == 2) {
      if (
        node.getElement(0).getType() == "number"
        && node.getElement(1).getType() == "symbol"
      ) {
        var coeff = node.getElement(0).clone();
        coeff.applySign(node.getSign());
        coeff.applySign(node.getElement(1).getSign());
        return [{
          name: node.getElement(1).getName(),
          coeff: coeff,
        }];
      }
    }
  } else if (node.getType() == "symbol") {
    return [{
      name: node.getName(),
      coeff: node.new("Number", node.getSign().toNumber())
    }];
  }
  throw "node is not linear";
}

module.exports = {
  solve: function(parameters, stack) {
    // check parameters
    var eqns   = [];

    for (var parameter of parameters) {
      if (parameter.getType() != "equation") {
        throw "invalid argument expected equation";
      }
      eqns.push(parameter.norm());
    }

    // check if equation is linear
    var eqnCoeffs = [],
        consts    = [];

    for (var eqn of eqns) {
      eqnCoeffs.push(getCoeffs(eqn.getElement(0)));
      consts.push(eqn.getElement(1));
    }

    // get all symbol names
    var varNames = [];
    for (var eqnCoeff of eqnCoeffs) {
      for (var coeff of eqnCoeff) {
        if (!varNames.includes(coeff.name)) {
          varNames.push(coeff.name);
        }
      }
    }

    if (varNames.length != eqns.length) {
      throw "variables count does not match equation count";
    }

    // create coeff matrix
    var coeffMatrix = new constructors.Tensor(
      constructors,
      [varNames.length, varNames.length]
    );

    for (var line = 0; line < eqnCoeffs.length; line++) {
      for (var coeff of eqnCoeffs[line]) {
        var row = varNames.indexOf(coeff.name);
        coeffMatrix.setElement([row, line], coeff.coeff);
      }
    }

    // solve with cramer rule
    var cmDet = coeffMatrix.det().evaluate();
    if (cmDet.getValue().equals(0)) {
      throw "can't solve linear equation system";
    }

    var result = new constructors.Tensor(
      constructors, [varNames.length]
    );

    for (var i = 0; i < varNames.length; i++) {
      var bottomDet = cmDet.clone();
      var cloneCm   = coeffMatrix.clone();
      for (var j = 0; j < varNames.length; j++) {
        cloneCm.setElement([i, j], consts[j]);
      }
      var topDet = cloneCm.det().evaluate();
      var resultItem = new constructors.Equation(constructors);
      resultItem.push(new constructors.Symbol(constructors, varNames[i]));
      var value = new constructors.Product(constructors);
      value.push(topDet);
      bottomDet.applyMulSign(-1);
      value.push(bottomDet);
      resultItem.push(value.evaluate());
      result.setElement(i, resultItem);
    }

    return result;
  }
};
