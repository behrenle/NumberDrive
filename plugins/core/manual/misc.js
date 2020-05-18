export default {
  "constants": [
    {
      "name": "memory",
      "description": "A vector of all user defined symbol names."
    }
  ],
  "functions": [
    {
      "name": "exp",
      "synopsis": "exp(x)",
      "description": "Equivalent to e^x."
    },
    {
      "name": "binom",
      "synopsis": "binom(n, p, k)",
      "description": "Binomial distribution"
    },
    {
      "name": "cbinom",
      "synopsis": "cbinom(n, p, k)",
      "description": "Binomial cumulative distribution"
    },
    {
      "name": "sqrt",
      "synopsis": "sqrt(v)",
      "description": "Calculates the square root of v.<br>v>=0"
    },
    {
      "name": "root",
      "synopsis": "root(v, n)",
      "description": "Computes the nth root of v.<br> n, v >= 0"
    },
    {
      "name": "delete",
      "synopsis": "delete(symbol)",
      "description": "Deletes a user defined symbol.<br>Returns 1 if the deletion was successful, otherwise 0."
    },
    {
      "name": "normal",
      "synopsis": "normal(x)",
      "description": "Gaussian distribution"
    },
    {
      "name": "cnormal",
      "synopsis": "cnormal(x)",
      "description": "Cumulative Gaussian distribution"
    },
    {
      "name": "binco",
      "synopsis": "binco(n, k)",
      "description": "Computes n over k (binomial coefficient)."
    },
    {
      "name": "abs",
      "synopsis": "abs(x)",
      "description": "Computes the absolute value of x."
    },
    {
      "name": "min",
      "synopsis": "min(value_1 [, value_2 [, ...]])",
      "description": "n. a."
    },
    {
      "name": "max",
      "synopsis": "max(value_1 [, value_2 [, ...]])",
      "description": "n. a."
    },
    {
      "name": "ln",
      "synopsis": "ln(value)",
      "description": "n. a."
    },
    {
      "name": "log",
      "synopsis": "log(value, base)",
      "description": "n. a."
    }
  ]
};
