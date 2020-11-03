function checkType(param, type) {
    let pType = param.getType();
    if (type == "term") {
        return pType != "equation" && pType != "definition" && pType != "tensor";
    } else {
        return pType == type;
    }
}

function checkTypes(param, types) {
    let pType = param.getType();
    for (let type of types) {
        if (pType == type)
            return true;
    }
    return false;
}

function createError(position, param, type) {
    let firstMessagePart = `invalid parameter (#${position + 1}): expected`;
    let lastMessagePart = `got ${param.getType()}`;
    let middleMessagePart;
    if (typeof type == "string") {
        middleMessagePart = type;
    } else if (type instanceof Array) {
        middleMessagePart = `{${type.join()}}`;
    } else {
        throw `INTERNAL ERROR: unknown type: ${typeof type}`;
    }
    throw `${firstMessagePart} ${middleMessagePart} ${lastMessagePart}`;
}

function checkSingleType(params, type) {
    params.forEach((param, pos) => {
        if (!checkType(param, type)) {
            createError(pos, param, type);
        }
    });
}

function checkMultipleTypes(params, types) {
    if (params.length != types.length)
        throw `invalid number of parameters: expected ${types.length} got ${params.length}`;
    params.forEach((param, pos) => {
        let type = types[pos];
        if (type instanceof Array) {
            if (checkTypes(param, type)) {
                return;
            }
        } else {
            if (checkType(param, type)) {
                return;
            }
        }
        createError(pos, param, type);
    });
}

export default {
    checkParameters: (params, expected) => {
        let evaluatedParams = params.map(param => {
            if (param.isEvaluable()) {
                return param.evaluate();
            }
            return param;
        });

        if (typeof expected == "string")
            checkSingleType(evaluatedParams, expected);

        if (expected instanceof Array)
            checkMultipleTypes(evaluatedParams, expected);

        return evaluatedParams;
    }
};
