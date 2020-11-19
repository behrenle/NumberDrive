export default {
    constants: [],
    functions: [
        {
            synopsis: {
                en: "table(f(x), min_x, max_x [, step_size])",
                de: "table(f(x), min_x, max_x [, s])"
            },
            description: {
                en: "Calculates a list of [x, f(x)] pairs. <br> min_x <= x <= max_x <br> | x_n - x_{n + 1} | = step_size <br> default step_size = 1",
                de: "Erstelle eine Wertetabelle mit Wertepaaren [x, f(x)]. <br> Die Wertetabelle wird im Intervall von min_x bis max_x erstellt. Schrittweite s, Default ist s=1."
            }
        }
    ]
};
