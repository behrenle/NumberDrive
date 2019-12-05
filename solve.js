const Eval = require('./eval.js');

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
  var rNode = {...node};
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
  var c = Eval.evalNode(cNode);
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
  }
}

function simplifySum(node, scope) {
  var rNode = {...node};
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
  return rNode;
}

function simplifySumOnce(node, scope = {}) {
  // product-simplify each summand
  var simplifiedSummands = [];
  for (var i = 0; i < node.elements.length; i++) {
    if (node.elements[i].type == "product") {
      simplifiedSummands.push(
        simplifyProduct(node.elements[i])
      );
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

        // get new elements
        var summandElements = [];
        if (c1.mode) {
          summandElements = simplifiedSummands[i].elements.slice(
            1, simplifiedSummands[i].elements.length
          );
        } else {
          summandElements = simplifiedSummands[i].elements;
        }

        // create new summand
        var newSummand = {
          type: "product",
          sign: "+", //simplifiedSummands[i].sign,
          mulSign: simplifiedSummands[i].mulSign,
        };
        newSummand.elements = [];
        newSummand.elements.push({
          type: "number", value: c, mulSign: "*",
        });
        //console.log(JSON.stringify(newSummand.elements));
        newSummand.elements = newSummand.elements.concat(summandElements);
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
    sign: node.sign,
    mulSign: node.mulSign,
    elements: combinedSummands
  };
}

function simplifyEquation(node, scope = {}) {
  // setup
  var term1 = node.elements[0].type == "sum"
    ? {...simplifySum(node.elements[0])}
    : (node.elements[0].type == "product"
        ? {...simplifyProduct(node.elements[0])}
        : node.elements[0]
      );
  var term2 = node.elements[1].type == "sum"
    ? {...simplifySum(node.elements[1])}
    : (node.elements[1].type == "product"
        ? {...simplifyProduct(node.elements[1])}
        : node.elements[1]
      );
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

const Parser = require("./parser.js");
var n1 = Parser.parse("2*x + 4 * y = 7");
var n2 = Parser.parse("3*x");
//console.log(compareNodes(n1, n2));
//console.log(isMultipleOf(n1,n2));
//console.log(getCoefficient(n2));
//console.log(simplifyProduct(n1));
//console.log(JSON.stringify(n1, null, 2));
console.log("------------------------------------------");
console.log(JSON.stringify(simplifyEquation(n1), null, 2));
console.log("------------------------------------------");
