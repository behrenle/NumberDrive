export default {
    constants: [],
    functions: [
        {
            synopsis: {
                en: "table(f(x), u, v, w?)",
                de: "table(f(x); u; v; w?)"
            },
            description: {
                en: "Calculates a list of [x, f(x)] pairs. <br> u <= x <= v <br> | x_n - x_{n + 1} | = w <br> default w = 1",
                de: "Erstelle eine Wertetabelle mit Wertepaaren [x, f(x)]. <br> Die Wertetabelle wird im Intervall von u bis v erstellt. Schrittweite w, Default ist w = 1."
            }
        }
    ]
};
