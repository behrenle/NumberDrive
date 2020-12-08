export default {
    constants: [],
    functions: [
        {
            synopsis: {
                en: "nderive(f(x), x, g?)",
                de: "nderive(f(x); x; g?)"
            },
            description: {
                en: "Calculates the value of the g-th derivative of f at the specified position x. if g is not specified: g = 1",
                de: "Ableitung der Funktion f an der Stelle x. Wird Grad g nicht angegeben, wird die erste Ableitung berechnet."
            }
        }
    ]
};
