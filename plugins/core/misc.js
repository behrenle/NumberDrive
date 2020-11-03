import Nodes from "../../constructors.js";
import tools from "../../pluginTools.js";
import utils from "../../utils.js";
import manual from "./manual/misc.js";
import Decimal from 'decimal.js';

const binco = utils.binco;

function binomial(p, n, k) {
    return binco(n, k)
        .mul(Math.pow(p, k))
        .mul(Math.pow((1 - p), (n - k)));
}

function cBinomial(p, n, k) {
    return Array(k + 1)
        .fill(0)
        .map((_, i) => binomial(p, n, i))
        .reduce((acc, inc) => acc.plus(inc), new Decimal(0));
}

const funcs = {
    cbinom: function (parameters, stack) {
        let params = tools.checkParameters(parameters, ["number", "number", "number"]),
            n = params[0].getDecimalValue().toNumber(),
            p = params[1].getDecimalValue().toNumber(),
            k = params[2].getDecimalValue().toNumber();

        if (p < 0 || p > 1) {
            throw "binomial: p out of bounds";
        }

        return params[0].new("Number", cBinomial(p, n, k));
    },

    binom: function (parameters, stack) {
        let params = tools.checkParameters(parameters, ["number", "number", "number"]),
            n = params[0].getDecimalValue().toNumber(),
            p = params[1].getDecimalValue().toNumber(),
            k = params[2].getDecimalValue().toNumber();

        if (p < 0 || p > 1) {
            throw "binomial: p out of bounds";
        }

        return params[0].new("Number", binomial(p, n, k));
    },

    binco: function (parameters, stack) {
        let params = tools.checkParameters(parameters, ["number", "number"]),
            n = params[0].getDecimalValue().toNumber(),
            k = params[1].getDecimalValue().toNumber();

        return params[0].new("Number", binco(n, k));
    },

    exp: function (parameters, stack) {
        let param = tools.checkParameters(parameters, ["number"])[0],
            value = param.getDecimalValue();

        return param.new("Number", value.exp());
    },

    ln: function (parameters, stack) {
        let param = tools.checkParameters(parameters, ["number"])[0],
            value = param.getDecimalValue();

        return param.new("Number", value.ln());
    },

    log: function (parameters, stack) {
        let params = tools.checkParameters(parameters, ["number", "number"]),
            value = params[0].getDecimalValue(),
            base = params[1].getDecimalValue();

        return params[0].new("Number", value.log(base));
    },

    min: function (parameters, stack) {
        let params = tools.checkParameters(parameters, "number"),
            values = params.map(x => x.getDecimalValue()),
            min = values[0];

        values.forEach((item, i) => {
            if (min.gt(item)) min = item;
        });

        return new Nodes.Number(min);
    },

    max: function (parameters, stack) {
        let params = tools.checkParameters(parameters, "number"),
            values = params.map(x => x.getDecimalValue()),
            max = values[0];

        values.forEach((item, i) => {
            if (!max.gte(item)) max = item;
        });

        return new Nodes.Number(max);
    },

    sqrt: function (parameters, stack) {
        let params = tools.checkParameters(parameters, ["number"]),
            value = params[0].getDecimalValue();

        if (value.isNegative())
            throw "sqrt: invalid parameters";

        return params[0].new("Number", value.sqrt());
    },

    root: function (parameters, stack) {
        let params = tools.checkParameters(parameters, ["number", "number"]),
            value = params[0].getDecimalValue(),
            grade = params[1].getDecimalValue(),
            result = value.toPower(grade.toPower(-1));

        if (result.isNaN()) {
            throw "root: invalid parameters";
        }

        return params[0].new("Number", result);
    },

    delete: function (parameters, stack) {
        if (parameters.length == 1) {
            if (parameters[0] instanceof Nodes.Symbol) {
                let topScope = stack.getTopScope();
                let name = parameters[0].getName();
                if (topScope.getValue(name)) {
                    topScope.deleteValue(name);
                    return new Nodes.Number(1);
                }
                return new Nodes.Number(0);
            }
            throw "invalid argument type";
        }
        throw "invalid number of arguments";
    },

    abs: function (parameters, stack) {
        let params = tools.checkParameters(parameters, [["number", "tensor"]]),
            value = params[0];

        if (value.getType() == "number") {
            return value.new("Number", value.getDecimalValue().abs());
        } else {
            if (value.getRank() != 1)
                throw `abs: invalid parameter expected number or vector got tensor of rank ${value.getRank()}`;

            if (!value.isEvaluable())
                throw `abs: invalid parameter: vector is not evaluable`;

            let result = new Decimal(0);
            value.getElements().forEach(item => {
                if (item.getType() != "number")
                    throw `abs: invalid parameter: vector elements can not be evaluated to numbers`;

                let v = item.getDecimalValue();
                result = result.plus(Decimal.mul(v, v));
            });
            return value.new("Number", Decimal.sqrt(result));
        }
    }
}

export default {
    name: "core-misc",
    genericFunctions: funcs,
    inlineDefinitions: [
        "normal(x) := 1 / sqrt(2*pi) * exp(x^2 / 2)",
        "cnormal(x) := 0.5 * (1 + erf(x / sqrt(2)))",
    ],
    manual: manual
};
