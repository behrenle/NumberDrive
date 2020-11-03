import Nodes from "../../constructors.js";
import tools from "../../pluginTools.js";
import utils from "../../utils.js";
import Scope from "../../scope/Scope.js";
import manual from "./manual/nderive.js";
import Decimal from 'decimal.js';

const h = new Decimal("10e-6");

const funcs = {
    nderive: function (parameters, stack) {
        let params, grade;
        if (parameters.length == 2) {
            params = tools.checkParameters(parameters, ["term", "number"]);
            grade = 1;
        } else {
            params = tools.checkParameters(parameters, ["term", "number", "number"]);
            grade = params[2].getDecimalValue().toNumber();
            if (grade % 1 != 0 || grade < 0) {
                throw "invalid grade: Expected integer greater than zero";
            }
        }
        let expr = params[0].breakDown().summarize(),
            pos = params[1].getDecimalValue();

        // check let count
        let varName;
        if (expr.getSymbolNames().length == 1) {
            varName = expr.getSymbolNames()[0];
        } else {
            throw "invalid variable count";
        }

        // prepare evaluation
        let vScope = new Scope(),
            value = new Nodes.Number();

        vScope.setValue(varName, value);
        expr.getStack().push(vScope);

        // calculate result
        let result = new Decimal(0),
            eValue, rValue;

        for (let i = 0; i <= grade; i++) {
            let c1 = new Decimal(-1).pow(i),
                c2 = utils.binco(grade, i).toNumber();

            eValue = pos.add(
                new Decimal(grade).sub(
                    new Decimal(2 * i)
                ).mul(h));
            value.setSign(Decimal.sign(eValue));
            value.setValue(eValue.abs());
            rValue = expr.evaluate().getDecimalValue();

            result = result.add(rValue.mul(c1.mul(c2)));
        }

        // remove scope
        expr.getStack().pop();

        return new Nodes.Number(result.div(h.mul(2).pow(grade)));
    }
}

export default {
    name: "core-nderive",
    genericFunctions: funcs,
    inlineDefinitions: [],
    manual: manual
};
