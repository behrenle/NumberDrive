const Eval = require('./eval.js');
const Tensor = require('./tensor.js');

const regulaFalsiMaxIterations = 100;
const regulaFalsiEpsilon = Math.pow(10, -14);
const newtonDx = Math.pow(10, -14);
const newtonZeroEpsilon = Math.pow(10, -14);
const newtonZeroPointEpsilon = Math.pow(10, -4);
const nSolveScanN = Math.pow(10, 3);
const bisectionXEPS = Math.pow(10,-50);
const bisectionYEPS = Math.pow(10,-100);
const bisectionMAXIterations = 400;

function copyOf(node) {
  return JSON.parse(JSON.stringify(node));
}

function compare(node1, node2) {
  return JSON.stringify(node1) == JSON.stringify(node2);
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

function getVariablesSystem(eqArr, scope) {
  const vars = [];
  for (var i = 0; i < eqArr.length; i++) {
    // equation
    var eVars = getCoefficients(eqArr[i], scope);
    for (var j = 0; j < eVars.length; j++) {
      // summand
      for (var k = 0; k < eVars[j].v.length; k++) {
        // variable
        var alreadyInserted = false;
        for (var l = 0; l < vars.length; l++) {
          if (compare(vars[l], eVars[j].v[k].symbol)) {
            alreadyInserted = true;
          }
        }
        if (!alreadyInserted) {
          vars.push(eVars[j].v[k].symbol)
        }
      }
    }
  }
  return vars;
}

function solveLinearSystem() {
  var args = args = Array.prototype.slice.call(arguments);
  var equations = args.slice(0, args.length - 1);
  var scope = args[args.length -1];
  for (var i = 0; i < equations.length; i++) {
    if (!isLinear(equations[i], scope)) {
      throw "can not solve non-linear system";
    }
  }

  var vars = getVariablesSystem(equations, scope);
  var consts = [];
  var cMatrix = [];
  for (var i = 0; i < equations.length; i++) {
    var matRow = Tensor.zeros([vars.length]);
    var vConst = 0;
    var coeffs = getCoefficients(equations[i], scope);
    for (var j = 0; j < coeffs.length; j++) {
      if (coeffs[j].v.length == 0) {
        vConst = -coeffs[j].c.value;
      } else {
        matRow[vars.indexOf(coeffs[j].v[0].symbol)] = coeffs[j].c.value;
      }
    }
    cMatrix.push(matRow);
    consts.push(vConst);
  }
  if (Tensor.det(cMatrix) == 0) {
    throw "The equation system has no or no unique solution";
  }
  var solStr = "[";
  for (var i = 0; i < vars.length; i++) {
    var cMatrixI = Tensor.replaceCol(cMatrix, consts, i);
    var sol = Tensor.det(cMatrixI) / Tensor.det(cMatrix);
    solStr += vars[i] + " = " + sol;
    if (i < vars.length - 1) {
      solStr += ", ";
    }
  }
  solStr += "]";
  return solStr;
}

function getVariableSymbols(node, scope) {
  var vars = getVariables(node, scope);
  var symbols = [];
  for (var i = 0; i < vars.length; i++) {
    if (!symbols.includes(vars[i].symbol)) {
      symbols.push(vars[i].symbol);
    }
  }
  return symbols;
}

function evalTerm(node, scope, values) {
  var nScope = {...scope, ...values};
  return Eval.evalNode(node, nScope);
}

function scanInterval(node, scope, symbol, start, stop, steps) {
  var xValues = [];
  var yValues = [];
  for (
    var i = Math.min(start, stop);
    i <= Math.max(start,stop);
    i += Math.abs((start - stop) / steps)
  ) {
    xValues.push(i);
    var values = {};
    values[symbol] = i;
    yValues.push(evalTerm(node, scope, values));
  }
  return {
    xValues: xValues,
    yValues: yValues,
  }
}

function filterSignChange(values) {
  var changes = [];
  for (var i = 0; i < values.xValues.length - 1; i++) {
    var v1 = values.yValues[i];
    var v2 = values.yValues[i + 1];
    if (v1 < 0 && v2 > 0 || v1 > 0 && v2 < 0) {
      changes.push([
        values.xValues[i],
        values.xValues[i + 1],
      ]);
    } else if (v1 == 0) {
      changes.push([
        values.xValues[i],
      ]);
    } else if (v2 == 0) {
      changes.push([
        values.xValues[i + 1],
      ]);
    }
  }
  return changes;
}

function filterLocalApproach(values) {
  var approaches = [];
  for (var i = 1; i < values.xValues.length - 1; i++) {
    var v1 = values.yValues[i - 1];
    var v2 = values.yValues[i];
    var v3 = values.yValues[i + 1];
    if (
      (v1 > 0 && v2 > 0 && v3 > 0
      && v1 > v2 && v2 < v3)
      || (v1 < 0 && v2 < 0 && v3 < 0
      && v1 < v2 && v2 > v3)
    ) {
      console.log(v1,v2,v3);
      approaches.push([values.xValues[i - 1], values.xValues[i + 1]]);
    }
  }
  return approaches;
}

function regulaFalsi(node, scope, start, stop) {
  var symbols = getVariableSymbols(node);
  if (symbols.length != 1) {
    throw "regulaFalsi needs exactly one variable";
  }
  var varName = symbols[0];
  var p1 = [start, evalTerm(node, scope, {[varName]: Math.min(start, stop)})];
  var p2 = [stop, evalTerm(node, scope, {[varName]: Math.max(start, stop)})];
  for (var i = 0; i < regulaFalsiMaxIterations; i++) {
    var deltaX = p2[0] - p1[0];
    var deltaY = p2[1] - p1[1];
    var m = deltaY / deltaX;
    var b = p1[1] - m * p1[0];
    var newX = - b / m;
    var newY = evalTerm(node, scope, {[varName]: newX});
    if (newY == 0) {
      return [newX, newY];
    }
    if (newY < 0 && p2[1] < 0 || newY > 0 && p2[1] > 0) {
      p2 = [newX, newY];
    } else {
      p1 = [newX, newY];
    }
  }
  if (
    Math.abs(p1[1]) >= Math.abs(p2[1])
    && p2[1] < regulaFalsiEpsilon
  ) {
    return p2;
  } else if (
    Math.abs(p1[1]) < Math.abs(p2[1])
    && p1[1] < regulaFalsiEpsilon
  ) {
    return p1;
  }
}

function newton(node, scope, start, stop) {
  var symbols = getVariableSymbols(node);
  if (symbols.length != 1) {
    throw "newton algorithm needs exactly one variable";
  }
  var varName = symbols[0];
  var x = start;
  var y = evalTerm(node, scope, {[varName]: Math.min(start, stop)});
  for (var i = 0; i < 1000; i++) {
    var y = evalTerm(node, scope, {[varName]: x});
    var dy = evalTerm(node, scope, {[varName]: x + newtonDx}) - y;
    var m = dy / newtonDx;
    var b = y - m * x;

    if (x < Math.min(start, stop) || x > Math.max(start, stop)) {
      return;
    }
    // update x
    x = - b / m;
    if (Math.abs(x) < newtonZeroPointEpsilon && Math.abs(y) < newtonZeroPointEpsilon) {
      return [0,0];
    } else if (Math.abs(y) < newtonZeroEpsilon) {
      return [x,y]
    }
  }
}

function numericSolve(node, start, stop, scope) {
  if (node.type == "equation") {
    return numericSolve(
      simplifyEquation(node).elements[0],
      start, stop, scope
    );
  }
  var symbols = getVariableSymbols(node, scope);
  if (symbols.length != 1) {
    throw "nSolve requires exactly one variable";
  }
  var symbol = symbols[0];
  var scanValues = scanInterval(
    node, scope, symbol, start, stop, nSolveScanN
  );
  var signChanges = filterSignChange(scanValues);
  var approaches = filterLocalApproach(scanValues);
  console.log(JSON.stringify(approaches,null,2));
  var sols = [];
  for (var i = 0; i < signChanges.length; i++) {
    if (signChanges[i].length == 1) {
      sols.push(signChanges[i][0]);
    } else {
      var sol = regulaFalsi(
        node, scope,
        Math.min(signChanges[i][0], signChanges[i][1]),
        Math.max(signChanges[i][0], signChanges[i][1])
      );
      if (sol != null) {
        sols.push(sol[0]);
      }
    }
  }
  for (var i = 0; i < approaches.length; i++) {
    var sol = newton(
      node, scope,
      Math.min(approaches[i][0], approaches[i][1]),
      Math.max(approaches[i][0], approaches[i][1])
    );
    if (sol != null) {
      sols.push(sol[0]);
    }
  }
  return sols.sort();
}

/*
const Parser = require('./parser.js');
var n1 = Parser.parse("x^2");
console.log(bisection(n1, {}, -1, 2));
*/
module.exports = {
  solveLinearSystem: solveLinearSystem,
  numericSolve: numericSolve,
};
