export default {
    constants: [
        {
            synopsis: "memory",
            description: "A vector of all user defined symbol names."
        }
    ],
    functions: [
        {
            synopsis: "exp(x)",
            description: "Equivalent to e^x."
        },
        {
            synopsis: "binom(n, p, k)",
            description: "Binomial distribution"
        },
        {
            synopsis: "cbinom(n, p, k)",
            description: "Binomial cumulative distribution"
        },
        {
            synopsis: "sqrt(v)",
            description: "Calculates the square root of v.<br>v>=0"
        },
        {
            synopsis: "root(v, n)",
            description: "Computes the nth root of v.<br> n, v >= 0"
        },
        {
            synopsis: "delete(symbol)",
            description: "Deletes a user defined symbol.<br>Returns 1 if the deletion was successful, otherwise 0."
        },
        {
            synopsis: "normal(x)",
            description: "Gaussian distribution"
        },
        {
            synopsis: "cnormal(x)",
            description: "Cumulative Gaussian distribution"
        },
        {
            synopsis: "binco(n, k)",
            description: "Computes n over k (binomial coefficient)."
        },
        {
            synopsis: "abs(x)",
            description: "Computes the absolute value of a number or the length of a vector."
        },
        {
            synopsis: "min(value_1 [, value_2 [, ...]])",
            description: "n. a."
        },
        {
            synopsis: "max(value_1 [, value_2 [, ...]])",
            description: "n. a."
        },
        {
            synopsis: "ln(value)",
            description: "n. a."
        },
        {
            synopsis: "log(value, base)",
            description: "n. a."
        }
    ]
};
