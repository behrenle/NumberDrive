export default {
    constants: [],
    functions: [
        {
            synopsis: {
                en: "dims(tensor)",
                de: "dims(tensor)"
            },
            description: {
                en: "Returns a dimensions vector.",
                de: "Gibt einen Vektor mit den Dimensionen des übergebenen Tensors zurück."
            }
        },
        {
            synopsis: {
                en: "get(t, c)",
                de: "get(t; k)"
            },
            description: {
                en: "Returns the element of the tensor t at the coordinates c.",
                de: "Gibt das Element des Tensors t an den Koordinaten k zurück."
            }
        },
        {
            synopsis: {
                en: "set(t, c, v)",
                de: "set(t; c; v)"
            },
            description: {
                en: "Sets the value of t at coordinates c to v.",
                de: "Setzt den Wert von t an den Koordinaten c auf v."
            }
        },
        {
            synopsis: {
                en: "det(square_matrix)",
                de: "det(m)"
            },
            description: {
                en: "Calculate the determinant given a matrix",
                de: "Berechne die Determinante einer quadratischen Matrix m."
            }
        },
        {
            synopsis: {
                en: "cross([a1, a2, a3], [b1, b2, b3])",
                de: "cross([a1; a2; a3]; [b1; b2; b3])"
            },
            description: {
                en: "Calculate the vector product of a and b",
                de: "Berechne das Vektorprodukt der beiden Vektoren a und b."
            }
        }
    ]
};
