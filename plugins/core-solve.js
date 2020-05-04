const constructors = require("../constructors");
const tools = require("../pluginTools");

function getCoeffs(node) {
  if (node.getType() == "sum") {
    let coeffs = [];
    for (let e of node.getElements()) {
      coeffs = coeffs.concat(getCoeffs(e));
    }
    return coeffs;
  } else if (node.getType() == "product") {
    if (node.getElements().length == 2) {
      if (
        node.getElement(0).getType() == "number"
        && node.getElement(1).getType() == "symbol"
      ) {
        let coeff = node.getElement(0).clone();
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

const funcs = {
  solve: function(parameters, stack) {
    let eqns = tools.checkParameters(parameters, "equation").map(
      (eqn) => eqn.norm()
    );

    // check if equation is linear
    let eqnCoeffs = [],
        consts    = [];

    eqns.forEach((eqn) => {
      eqnCoeffs.push(getCoeffs(eqn.getElement(0)));
      consts.push(eqn.getElement(1));
    });

    // get all symbol names
    let varNames = [];
    eqnCoeffs.forEach((eqnCoeff) => {
    eqnCoeff.forEach((coeff) => {
      if (!varNames.includes(coeff.name))
        varNames.push(coeff.name);
    })});

    if (varNames.length != eqns.length)
      throw "variables count does not match equation count";

    // create coeff matrix
    let coeffMatrix = new constructors.Tensor(
      constructors,
      [varNames.length, varNames.length]
    );

    eqnCoeffs.forEach((eqnCoeff, line) => {
      eqnCoeff.forEach((coeff) => {
        let row = varNames.indexOf(coeff.name);
        coeffMatrix.setElement([row, line], coeff.coeff);
    })});

    // solve with cramer rule
    let cmDet = coeffMatrix.det().evaluate();
    if (cmDet.getValue().equals(0)) {
      throw "can't solve linear equation system";
    }

    let result = new constructors.Tensor(
      constructors, [varNames.length]
    );

    for (let i = 0; i < varNames.length; i++) {
      let bottomDet = cmDet.clone();
      let cloneCm   = coeffMatrix.clone();
      for (let j = 0; j < varNames.length; j++) {
        cloneCm.setElement([i, j], consts[j]);
      }
      let topDet = cloneCm.det().evaluate();
      let resultItem = new constructors.Equation(constructors);
      resultItem.push(new constructors.Symbol(constructors, varNames[i]));
      let value = new constructors.Product(constructors);
      value.push(topDet);
      bottomDet.applyMulSign(-1);
      value.push(bottomDet);
      resultItem.push(value.evaluate());
      result.setElement(i, resultItem);
    }

    return result;
  }
};

module.exports = {
  genericFunctions: funcs,
  inlineDefinitions: [],
};
