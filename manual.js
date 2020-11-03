import plugins from "./pluginLoader.js";

const manual = {
    constants: [],
    functions: [],
};

plugins.forEach((plugin) => {
    manual.constants = manual.constants.concat(
        plugin.manual.constants.map((constant) => {
            constant.plugin = plugin.name;
            return constant;
        })
    );
    manual.functions = manual.functions.concat(
        plugin.manual.functions.map((func) => {
            func.plugin = plugin.name;
            return func;
        })
    );
});

export default manual;
