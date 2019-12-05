const Eval = require('./eval.js');

function copyOf(node) {
  return JSON.parse(JSON.stringify(node));
}

function sign(s) {
  return s == "-" ? -1 : 1;
}

function uSign(n) {
  return n == -1 ? "-" : "+";
}

function combineSigns(s1, s2) {
  return sign(s1) * sign(s2);
}

function uCombineSigns(s1, s2) {
  return uSign(combineSigns(s1, s2));
}

function compareNodes(node1, node2) {
  if (node1.type == node2.type) {
    if (node1.type == "number" || node1.type == "symbol") {
      return node1.value == node2.value;
    } else if (node1.type == "power") {
      if (
        compareNodes(node1.base, node2.base)
        && compareNodes(node1.exp, node2.exp)
      ) {
        return true;
      }
    } else if (
      node1.type == "sum"
      || node1.type == "product"
      || node1.type == "equation"
    ) {
      if (node1.elements.length == node2.elements.length) {
        for (var i = 0; i < node1.elements.length; i++) {
          if (!compareNodes(node1.elements[i], node2.elements[i])) {
            return false;
          }
        }
        return true;
      }
    }
  }
  return false;
}

function getVariables(node, scope = {}) {
  if (node.type == "symbol") {
    if (scope[node.value] == null) {
      return [{
        symbol: node.value,
        expFunc: false,
        exp: 1,
      }];
    }
    return [];
  } else if (node.type == "number") {
    return [];
  } else if (
    node.type == "sum"
    || node.type == "product"
    || node.type == "equation"
  ) {
    var vars = [];
    for (var i = 0; i < node.elements.length; i++) {
      var nVars = getVariables(node.elements[i]);
      if (node.elements[i].mulSign == "/") {
        for (var j = 0; j < nVars.length; j++) {
          if (nVars[j]) {
            nVars[j].exp = -nVars[j].exp;
          }
        }
      }
      vars = vars.concat(nVars);
    }
    return vars;
  } else if (node.type == "power") {
    var vars = getVariables(node.base);
    var eVars = getVariables(node.exp);
    var eValue;
    if (eVars.length == 0) {
      var eValue = Eval.evalNode(node.exp, scope);
    }
    for (var i = 0; i < vars.length; i++) {
      if (eVars.length == 0) {
        vars[i].exp = eValue;
      } else {
        vars[i].exp = null;
        vars[i].expFunc = true;
      }
    }
    return vars;
  }
}

function includesTensor(node, scope = {}) {
  if (node.type == "list") {
    return true;
  } else if (node.type == "symbol") {
    if (scope[node.value]) {
      if (scope[node.value] instanceof Array) {
        return true;
      }
    }
  } else if (node.type == "power") {
    if (includesTensor(node.base, scope) || includesTensor(node.exp, scope)) {
      return true;
    }
  }
  if (node.elements != null) {
    for (var i = 0; i < node.elements.length; i++) {
      if (includesTensor(node.elements[i], scope)) {
        return true;
      }
    }
  }
  return false;
}

function simplifyProduct(node, scope) {
  var rNode = copyOf(node);
  if (includesTensor(node)) {
    throw "simplifyProduct: tensors are not supported";
  }
  var cElements = []; // constants, numbers
  var vElements = []; // variables
  for (var i = 0; i < node.elements.length; i++) {
    if (getVariables(node.elements[i], scope).length == 0) {
      cElements.push(node.elements[i]);
    } else {
      vElements.push(node.elements[i]);
    }
  }

  var cNode = {
    type: "product",
    sign: "+",
    mulsign: "*",
    elements: cElements,
  }
  var c = Eval.evalNode(cNode, scope);
  rNode.elements = [{
    type: "number",
    sign: "+",
    mulSign: "*",
    value: c,
  }].concat(vElements);
  return rNode;
}

function isMultipleOf(node1, node2, scope = {}) {
  var vars1 = getVariables(node1, scope);
  var vars2 = getVariables(node2, scope);
  if (vars1.length == vars2.length) {
    for (var i = 0; i < vars1.length; i++) {
      var includes = false;
      for (var j = 0; j < vars2.length; j++) {
        if (
          vars1[i].symbol == vars2[j].symbol &&
          vars1[i].exp == vars2[j].exp
        ) {
          includes = true;
          break;
        }
      }
      if (!includes) {
        return false;
      }
    }
    return true;
  }
  return false;
}

// use simplifyProduct befor passing the node to this function
function getCoefficient(node) {
  var s = node.sign == "-" ? -1 : 1;
  if (node.type == "product") {
    if (node.elements[0].type == "number") {
      return {
        value: s * node.elements[0].value,
        mode: true
      };
    }
    return {value: s * 1, mode: false};
  } else if (node.type == "symbol") {
    return {value: s * 1, mode: false};
  } else if (node.type == "number") {
    return {value: s * node.value, mode: false};
  }
}

function simplifySum(node, scope) {
  var rNode = copyOf(node);
  var l = rNode.elements.length;
  var i = 0;
  while (true) {
    rNode = simplifySumOnce(rNode, scope);
    if (l == rNode.elements.length) {
      break;
    }
    l = rNode.elements.length;
    i++;
  }
  if (rNode.elements.length == 1) {
    var summand = copyOf(rNode.elements[0]);
    summand.sign = uCombineSigns(summand.sign, node.sign);
    return summand;
  }
  return rNode;
}

function simplifySumOnce(node, scope = {}) {
  // product-simplify each summand
  var simplifiedSummands = [];
  for (var i = 0; i < node.elements.length; i++) {
    if (node.elements[i].type == "product") {
      simplifiedSummands.push(
        simplifyProduct(node.elements[i], scope)
      );
    } else if (
      node.elements[i].type == "symbol"
      && scope[node.elements[i].value] != null
    ) {
      simplifiedSummands.push({
        type: "number", sign: "+", mulSign: "*",
        value: scope[node.elements[i].value],
      });
    } else {
      simplifiedSummands.push(
        node.elements[i]
      );
    }
  }

  // combine summands
  var combinedSummands = [];
  var alreadyCombined = [];
  for (var i = 0; i < simplifiedSummands.length; i++) {
    for (var j = 0; j < simplifiedSummands.length; j++) {
      if (
        isMultipleOf(simplifiedSummands[i], simplifiedSummands[j])
        && !alreadyCombined.includes(i)
        && !alreadyCombined.includes(j)
        && i != j
      ) {
        // calculate new coefficient
        var c1 = getCoefficient(simplifiedSummands[i]);
        var c2 = getCoefficient(simplifiedSummands[j]);
        var c  = c1.value + c2.value;

        // create new summand
        var newSummand = {
          type: simplifiedSummands[i].type,
          sign: "+",
          mulSign: simplifiedSummands[i].mulSign,
        };

        if (simplifiedSummands[i].type == "product") {
          // get new elements
          var summandElements = [];
          if (c1.mode) {
            summandElements = simplifiedSummands[i].elements.slice(
              1, simplifiedSummands[i].elements.length
            );
          } else {
            summandElements = simplifiedSummands[i].elements;
          }

          // create elements
          newSummand.elements = [];
          newSummand.elements.push({
            type: "number", value: c, mulSign: "*",
          });
          newSummand.elements = newSummand.elements.concat(summandElements);
        } else if (simplifiedSummands[i].type == "symbol") {
          newSummand.type = "product";
          newSummand.elements = [];
          newSummand.elements.push({
            type: "number", sign: "+", mulSign: "*", value: c,
          });
          newSummand.elements.push(simplifiedSummands[i]);
        } else if (simplifiedSummands[i].type == "number") {
          newSummand.sign = "+";
          newSummand.value = c;
        }

        // insert combined summand
        combinedSummands.push(newSummand);

        // mark summands as already combined
        alreadyCombined.push(i, j);
      }
    }
  }

  // combine combined summands and non-combined summands
  for (var i = 0; i < simplifiedSummands.length; i++) {
    if (!alreadyCombined.includes(i)) {
      combinedSummands.push(simplifiedSummands[i]);
    }
  }

  // return simplified node
  return {
    type: "sum",
    sign: node.sign == undefined ? "+" : node.sign,
    mulSign: node.mulSign == undefined ? "*" : node.mulSign,
    elements: combinedSummands
  };
}

function simplify(node, scope) {
  if (node.type == "sum") {
    return simplifySum(node, scope);
  } else if (node.type == "product") {
    return simplifyProduct(node, scope);
  } else if (
    node.type == "symbol"
    && scope[node.value] != null
    && typeof scope[node.value] == "number"
  ) {
    return {
      type: "number",
      sign: node.sign,
      mulSign: node.mulSign,
      value: scope[node.value],
    };
  } else if (node.type == "number") {
    return node;
  } else if (node.type == "equation") {
    return simplifyEquation(node, scope);
  }
  throw "simplify: incompatible node type";
}

function simplifyEquation(node, scope = {}) {
  // setup
  var term1 = simplify(node.elements[0], scope);
  var term2 = simplify(node.elements[1], scope);
  var term  = {
    type: "equation",
    sign: "+",
    mulSign: "*",
    elements: [],
  };

  // combine term1 and term2 to term
  // insert all summands of term1
  if (term1.type == "sum") {
    for (var i = 0; i < term1.elements.length; i ++) {
      term.elements.push(term1.elements[i]);
    }
  } else {
    term.elements.push(term1);
  }

  // insert all summands of term2
  if (term2.type == "sum") {
    for (var i = 0; i < term2.elements.length; i ++) {
      var newSummand = term2.elements[i];
      newSummand.sign = newSummand.sign == "-" ? "+" : "-";
      term.elements.push(newSummand);
    }
  } else {
    // invert sign and push
    var newSummand = term2;
    newSummand.sign = newSummand.sign == "-" ? "+" : "-";
    term.elements.push(newSummand);
  }

  // return simplified equation node
  return {
    type: "equation",
    sign: "+",
    mulSign: "*",
    elements: [
      simplifySum(term, scope),
      {
        type: "number",
        value: "0",
        sign: "+",
        mulSign: "*"
      }
    ]
  };
}

function getCoefficients(node, scope = {}) {
  var coefficients = [];
  var sNode = simplify(node, scope);
  if (sNode.type == "equation") {
    return getCoefficients(sNode.elements[0]);
  }
  if (sNode.elements) {
    for (var i = 0; i < sNode.elements.length; i++) {
      coefficients.push({
        c: getCoefficient(sNode.elements[i]),
        v: getVariables(sNode.elements[i]),
      });
    }
  } else {
    coefficients.push({
      c: getCoefficient(sNode),
      v: getVariables(sNode),
    });
  }
  return coefficients;
}

function isLinear(node, scope = {}) {
  var c = getCoefficients(node, scope);
  for (var i = 0; i < c.length; i++) {
    if (c[i].v.length > 1) {
      return false;
    }
    if (c[i].v.length == 1) {
      if (c[i].v[0].exp > 1) {
        return false;
      }
    }
  }
  return true;
}

const Parser = require("./parser.js");
var n1 = Parser.parse("n*2*x + 2*y = n*7");
var n2 = Parser.parse("3*x");
//console.log(compareNodes(n1, n2));
//console.log(isMultipleOf(n1,n2));
//console.log(getCoefficient(n2));
//console.log(simplifyProduct(n1));
//console.log(JSON.stringify(n1, null, 2));
var scope = {n: 5};
console.log("------------------------------------------");
console.log(JSON.stringify(getCoefficients(n1, scope), null, 2));
console.log(isLinear(n1, scope))
console.log("------------------------------------------");
