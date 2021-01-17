export default {
    constants: [
        {
            synopsis: {
                en: "memory",
                de: "memory"
            },
            description: {
                en: "A vector of all user defined symbol names.",
                de: "Liste aller durch den Anwender definierten Variablen."
            }
        }
    ],
    functions: [
        {
            synopsis: {
                en: "exp(x)",
                de: "exp(x)"
            },
            description: {
                en: "Equivalent to e^x.",
                de: "Exponentionalfunktion e^x mit Basis e."
            }
        },
        {
            synopsis: {
                en: "binom(n, p, k)",
                de: "binom(n; p; k)"
            },
            description: {
                en: "Binomial distribution",
                de: "Binomialverteilung mit Parametern n, p und k."
            }
        },
        {
            synopsis: {
                en: "cbinom(n, p, k)",
                de: "cbinom(n; p; k)"
            },
            description: {
                en: "Binomial cumulative distribution",
                de: "Kumulierte Binomialverteilung mit Parametern n, p und k."
            }
        },
        {
            synopsis: {
                en: "sqrt(v)",
                de: "sqrt(a)"
            },
            description: {
                en: "Calculates the square root of v.<br>v>=0",
                de: "Quadratwurzel von a."
            }
        },
        {
            synopsis: {
                en: "root(v, n)",
                de: "root(a; n)"
            },
            description: {
                en: "Computes the nth root of v.<br> n, v >= 0",
                de: "n-te Wurzel von a."
            }
        },
        {
            synopsis: {
                en: "delete(a)",
                de: "delete(a)"
            },
            description: {
                en: "Delete the variable a.<br>Returns 1 if the deletion was successful, otherwise 0.",
                de: "Lösche die Variable a.<br>Ergebnis ist 1 falls die Löschung erfolgreich war, sonst 0."
            }
        },
        {
            synopsis: {
                en: "normal(x)",
                de: "normal(x)"
            },
            description: {
                en: "Gaussian distribution",
                de: "Standardnormalverteilung mit Erwartungswert 0 und Varianz 1."
            }
        },
        {
            synopsis: {
                en: "cnormal(x)",
                de: "cnormal(x)"
            },
            description: {
                en: "Cumulative Gaussian distribution",
                de: "Kumulierte Standardnormalverteilung mit Erwartungswert 0 und Varianz 1."
            }
        },
        {
            synopsis: {
                en: "binco(n, k)",
                de: "binco(n; k)"
            },
            description: {
                en: "Computes n over k (binomial coefficient).",
                de: "Binomialkoeffizient mit Parametern n und k."
            }
        },
        {
            synopsis: {
                en: "abs(x)",
                de: "abs(a)"
            },
            description: {
                en: "Computes the absolute value of a number or the length of a vector.",
                de: "Betrag von a."
            }
        },
        {
            synopsis: {
                en: "min(v, ...)",
                de: "min(v; ...)"
            },
            description: {
                en: "returns the minimum of all passed parameters",
                de: "Gibt das Minimum aller übergebenen Werte zurück."
            }
        },
        {
            synopsis: {
                en: "max(v, ...)",
                de: "max(v; ...)"
            },
            description: {
                en: "returns the maximum of all passed parameters",
                de: "Gibt das Maximum aller übergebenen Werte zurück."
            }
        },
        {
            synopsis: {
                en: "ln(v)",
                de: "ln(v)"
            },
            description: {
                en: "Natural logarithm of v.",
                de: "Logarithmus zur Basis e von v."
            }
        },
        {
            synopsis: {
                en: "log(v, b)",
                de: "log(v; b)"
            },
            description: {
                en: "Logarithm of v to base b",
                de: "Logarithmus zur Basis b von v."
            }
        },
        {
            synopsis: {
                en: "fact(n)",
                de: "fact(n)
            },
            description: {
                en: "Factorial of n",
                de: "Fakultät von n"
            }
        }
    ]
};
