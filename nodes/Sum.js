import AbstractContainer from "./AbstractContainer.js";
import {registerNode} from "./AbstractNode.js";

class Sum extends AbstractContainer {
    constructor(sign, mulSign) {
        super([], sign, mulSign);
        this.type = "sum";
        this.connectionStrength = 1;
    }

    evaluate() {
        let result = this.getElements()
            .map((element) => element.evaluate())
            .reduce((acc, value) => {
                if (acc.getType() == "number" && value.getType() == "number")
                    return acc.addNumber(value);

                if (acc.getType() == "tensor" && value.getType() == "tensor")
                    return acc.addTensor(value).evaluate();

                throw `sum: undefined operation: ${acc.getType()} + ${value.getType()}`;
            });

        result.applySigns(this);
        return result;
    }

    normSign() {
        if (this.isNegative()) {
            for (var element of this.getElements()) {
                element.applySign(this.getSign());
            }
            this.applySign(this.getSign());
        }
    }

    mulSum(node) {
        this.normSign();
        node.normSign();
        var result = this.new("Sum");
        for (var element of node.getElements()) {
            result.push(this.mulNonSum(element));
        }
        return result.breakDown();
    }

    mulNonSum(node) {
        var result = this.new("Sum");
        for (var element of this.getElements()) {
            var summand = this.new("Product");
            var e1 = element.clone();
            var e2 = node.clone();
            e1.applySign(this.getSign());
            if (e1.constructor.name == "AbstractContainer") {
                summand.applySign(e1.getSign());
                summand.setElements(e1.getElements());
            } else {
                summand.push(e1);
            }
            summand.push(e2);
            summand.squashSigns();
            result.push(summand);
        }
        return result.breakDown();
    }

    breakDown() {
        var newElements = [];
        if (this.isEvaluable()) {
            return this.evaluate();
        }
        for (var rawElement of this.getElements()) {
            rawElement.applySign(this.getSign());
            var element = rawElement.breakDown();
            if (element.getType() == "sum") {
                for (var subElement of element.getElements()) {
                    subElement.applySign(element.getSign());
                    newElements.push(subElement);
                }
            } else {
                newElements.push(element)
            }
        }
        this.setSign(1);
        if (newElements.length > 1) {
            this.setElements(newElements);
            return this;
        } else {
            var element = newElements[0];
            element.applySign(this.getSign());
            element.applyMulSign(this.getMulSign());
            return element;
        }
    }

    summarize() {
        this.normSign();
        var result = this.new("Sum", this.getSign(), this.getMulSign());
        var evals = this.getEvaluables();
        var nEvals = this.getNonEvaluables().map(x => x.summarize());

        // combine evals
        if (evals.length > 0) {
            var value = this.new("Sum");
            value.setElements(evals);
            result.push(value.evaluate());
        }

        // combine nEvals
        if (nEvals.length > 0) {
            var summarized;
            var summands;
            do {
                summarized = false;
                summands = [];
                for (var i = 0; i < nEvals.length; i++) {
                    if (!summarized) {
                        for (var k = 0; k < nEvals.length; k++) {
                            var node1 = nEvals[i],
                                node2 = nEvals[k];
                            var c1 = node1.getCoefficient(),
                                c2 = node2.getCoefficient();

                            if (
                                i != k && node1.getType() == "product"
                                && (
                                    node2.getType() == "product"
                                    || node2.getType() == "symbol"
                                )
                            ) {
                                if (node1.isMultipleOf(node2)) {
                                    var nEvals1 = node1.getNonEvaluables();
                                    var coeff = this.new("Sum");
                                    var comb = this.new("Product");
                                    coeff.push(c1);
                                    coeff.push(c2);
                                    coeff = coeff.evaluate();
                                    comb.setElements(
                                        [coeff].concat(nEvals1)
                                    );
                                    comb.squashSigns();

                                    for (var j = 0; j < nEvals.length; j++) {
                                        if (j != i && j != k) {
                                            summands.push(nEvals[j]);
                                        }
                                        if (j == i && !coeff.getValue().equals(0)) {
                                            summands.push(comb);
                                        }
                                    }

                                    nEvals = summands;
                                    summarized = true;
                                    break;
                                }
                            } else if (
                                i != k
                                && node1.getType() == "symbol"
                                && node2.getType() == "symbol"
                            ) {
                                if (node1.getName() == node2.getName()) {
                                    for (var j = 0; j < nEvals.length; j++) {
                                        if (j != i && j != k) {
                                            summands.push(nEvals[j]);
                                        }
                                        if (j == i) {
                                            if (node1.getSignString() == node2.getSignString()) {
                                                var c1 = node1.getCoefficient(),
                                                    c2 = node2.getCoefficient();
                                                var coeff = this.new("Sum");
                                                coeff.push(c1);
                                                coeff.push(c2);
                                                var comb = this.new("Product");
                                                comb.push(coeff.evaluate());
                                                comb.push(this.new("Symbol", node1.getName()));
                                                comb.squashSigns()
                                                summands.push(comb);
                                            }
                                        }
                                    }

                                    nEvals = summands;
                                    summarized = true;
                                    break;
                                }
                            }
                        }
                    } else {
                        break;
                    }
                }
            } while (summarized);
            result.setElements(
                result.getElements().concat(nEvals)
            )
        }
        if (result.getElements().length == 1) {
            let element = result.getElement(0);
            element.applySigns(result);
            return element;
        }
        return result;
    }

    serialize() {
        var str = "";
        for (var i = 0; i < this.getElements().length; i++) {
            var element = this.getElement(i);
            if (element.getSignString() == "+" && i > 0) {
                str += " + ";
            }
            if (element.getSignString() == "-") {
                if (i == 0) {
                    str += "-";
                } else {
                    str += " - ";
                }
            }
            if (element.connectionStrength <= this.connectionStrength) {
                str += "(" + element.serialize(true) + ")";
            } else {
                str += element.serialize(true);
            }
        }
        return str;
    }
}

registerNode("Sum", Sum);
export default Sum;
