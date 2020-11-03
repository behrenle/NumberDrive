import AstBuilder from "./astBuilder.js";
import Parser from '@behrenle/number-drive-parser';

export default (string) => {
    return AstBuilder.build(Parser.parse(string));
};
