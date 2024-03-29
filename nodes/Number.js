import AbstractNode, {registerNode} from "./AbstractNode.js";
import Decimal from 'decimal.js';

class Number extends AbstractNode {
    constructor(value = 0, sign, mulSign) {
        super(sign, mulSign);
        this.type = "number";
        var rawValue = this.new("Decimal", value);
        this.applySign(Decimal.sign(rawValue));
        this.setValue(rawValue.abs());
    }

    evaluate() {
        if (this.getMulSign().equals(-1)) {
            let result = this.new("Number");
            result.setSign(this.getSign());
            result.setValue(new Decimal(1).div(this.getValue()));
            return result;
        }
        return this;
    }

    addNumber(number) {
        return this.new("Number", Decimal.add(
            Decimal.mul(this.getValue(), this.getSign()),
            Decimal.mul(number.getValue(), number.getSign())
        ));
    }

    mulNumber(number) {
        return this.new("Number", Decimal.mul(
            Decimal.mul(this.getSign(), number.getSign()),
            Decimal.mul(
                Decimal.pow(this.getValue(), this.getMulSign()),
                Decimal.pow(number.getValue(), number.getMulSign())
            )
        ));
    }

    power(number) {
        return this.new("Number",
            Decimal.pow(
                Decimal.mul(
                    this.getSign(),
                    this.getValue()
                ),
                Decimal.mul(
                    number.getValue(),
                    number.getSign()
                )
            )
        );
    }

    getValue() {
        return this.value;
    }

    getDecimalValue() {
        if (this.getMulSign().equals(-1)) {
            return new Decimal(1).div(
                Decimal.mul(
                    this.getSign(),
                    this.getValue()
                )
            );
        }
        return Decimal.mul(
            this.getSign(),
            this.getValue()
        );
    }

    setValue(value) {
        this.value = value;
    }

    serialize(mode) {
        const sigDigits = this.getStack().getSetting("sigDigits" || 6);
        const magnitude = Decimal.log10(this.getValue().abs()).floor();
        if (this.getValue().equals(0))
            return "0";

        if (!magnitude.abs().gte(sigDigits)) {
            let resultStr = "";

            if (magnitude >= 0) {
                const decimalIndicatorDigit = magnitude.toNumber() + 1 === sigDigits ? 1 : 0;
                resultStr = this.getValue().toSD(sigDigits + decimalIndicatorDigit).toString();
            } else {
                resultStr = this.getValue().toSD(sigDigits).toString();
            }

            if (!mode && this.getSign().equals(-1))
                return "-" + resultStr;

            return resultStr;
        } else {
            let result = this.getSign() >= 0 ? "" : "-";
            const mantisse = new Decimal(10).pow(-magnitude).mul(this.getValue());
            result += mantisse.toSD(sigDigits) + " * 10^";
            if (magnitude < 0) {
                result += "(" + magnitude.toString() + ")";
            } else {
                result += magnitude.toString();
            }
            return result;
        }
    }

    equals(node) {
        return node instanceof Number ?
            this.getValue().equals(node.getValue())
            && this.getSign().equals(node.getSign())
            && this.getMulSign().equals(node.getMulSign())
            : false;
    }

    stringify() {
        var lines = [];
        lines.push(this.stringifyHead());
        lines.push("  " + this.getValue());
        return lines;
    }
}

registerNode("Number", Number);
export default Number;
