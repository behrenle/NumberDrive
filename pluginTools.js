function checkType(param, eType) {
  let pType = param.getType();
  if (eType == "term") {
    if (pType != "equation" && pType != "definition" && pType != "tensor")
      return param;
  } else {
    let eParam = param.evaluate();
    if (eParam.getType() == eType)
      return eParam;

    pType = eParam.getType();
  }
  throw `expected ${eType} got ${pType}`;
}

function checkMultipleTypes(params, types) {
  if (params.length != types.length)
    throw `invalid number of parameters: expected ${types.length} got ${params.length}`;

  return params.map((param, i) => {
    let eType  = types[i],
        eParam;

    try {
      eParam = checkType(param, types[i]);
    } catch (error) {
      throw `invalid parameter (#${i}): ${error}`
    }
    return eParam;
  });
}

function checkSingleType(params, eType) {
  return params.map((param, i) => {
    let eParam;
    try {
      eParam = checkType(param, eType);
    } catch (error) {
      throw `invalid parameter (#${i}): ${error}`
    }
    return eParam
  });
}

module.exports = {
  checkParameters: (params, expected) => {
    if (typeof expected == "string")
      return checkSingleType(params, expected);

    if (expected instanceof Array)
      return checkMultipleTypes(params, expected);

    throw "invalid arguments";
  }
}
