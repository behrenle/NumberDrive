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
        var valStr = this.getValue().toSignificantDigits(
            this.getStack().getSetting("sigDigits" || 6)
        ).toString()
        if (!mode && this.getSign().equals(-1)) {
            return "-" + valStr;
        } else {
            return valStr;
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
