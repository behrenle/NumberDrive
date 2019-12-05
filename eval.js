const Parser = require('./parser.js');
const Tensor = require('./tensor.js');

function eval(str, scope = {}, debug = false) {
  var root = Parser.parse(str);
  if (debug) {
    console.log(JSON.stringify(root,null,2));
  }
  return evalNode(root, scope);
}

function evalNode(node, scope) {
  switch (node.type) {
    case "definition":
      if (node.elements[0].type == "symbol") {
        var v = evalNode(node.elements[1]);
        scope[node.elements[0].value] = v;
        return v;
      } else if (node.elements[0].type == "function") {
        var name = node.elements[0].name;
        var params = [];
        for (var i = 0; i < node.elements[0].elements.length; i++) {
          var param = node.elements[0].elements[i];
          if (param.type != "symbol") {
            throw "parameter must be a symbol";
          }
          if (params.includes()) {
            throw "parameter duplicate found.";
          }
          params.push(param.value);
        }
        scope[name] = new UserFunction(name, params, node.elements[1]);
        return "defined " + name + " successfully";
      }
      throw "unsupported identifier";

    case "number":
      return node.value;

    case "equation":
      return node;

    case "symbol":
      if (scope[node.value] != null) {
        if (typeof scope[node.value] == "function") {
          throw node.value + " is a function";
        }
        return scope[node.value];
      }
      throw "unknown symbol: " + node.value;

    case "function":
      if (scope[node.name] != null) {
        if (typeof scope[node.name] == "function") {
          var params = [];
          for (var i = 0; i < node.elements.length; i++) {
            params.push(evalNode(node.elements[i], scope));
          }
          return scope[node.name](...params, scope);
        } else if (scope[node.name] instanceof UserFunction) {
          var params = [];
          for (var i = 0; i < node.elements.length; i++) {
            params.push(evalNode(node.elements[i], scope));
          }
          return scope[node.name].call(params, scope);
        }
        throw node.name + " is not a function";
      }
      throw "unknown function: " + node.name;

    case "list":
      var list = [];
      for (var i = 0; i < node.elements.length; i++) {
        list.push(evalNode(node.elements[i], scope));
      }
      return list;

    case "sum":
      if (typeof evalNode(node.elements[0], scope) == "number") {
        return sumScalar(node, scope);
      } else if (evalNode(node.elements[0], scope) instanceof Array) {
        var v = Tensor.zeros(Tensor.getDimensions(evalNode(node.elements[0], scope)));
        for (var i = 0; i < node.elements.length; i++) {
          v = Tensor.addTensors(
            v, evalNode(node.elements[i], scope),
            "+", node.elements[i].sign
          );
        }
        return v;
      } else {
        throw "unsupported types";
      }

    case "product":
      var v = 1;
      for (var i = 0; i < node.elements.length; i++) {
        if (typeof v == "number" && typeof evalNode(node.elements[i], scope) == "number") {
          if (node.elements[i].mulSign == "*") {
            v *= evalNode(node.elements[i], scope);
          } else {
            v /= evalNode(node.elements[i], scope);
          }
        } else if (typeof v == "number" && evalNode(node.elements[i], scope) instanceof Array) {
          v = Tensor.mulScalarTensor(v, evalNode(node.elements[i], scope));
        } else if (typeof evalNode(node.elements[i], scope) == "number" && v instanceof Array) {
          if (node.elements[i].mulSign == "*") {
            v = Tensor.mulScalarTensor(evalNode(node.elements[i], scope), v);
          } else {
            v = Tensor.mulScalarTensor(evalNode(node.elements[i], scope), v, "/");
          }
        } else if (v instanceof Array && evalNode(node.elements[i], scope) instanceof Array) {
          var w = evalNode(node.elements[i], scope);
          var dims1 = Tensor.getDimensions(v);
          var dims2 = Tensor.getDimensions(w);
          var mulMode = Tensor.getMulMode(v, w);
          if (mulMode == "vec") {
            v = Tensor.mulVectors(v, w);
          } else if (mulMode == "mat") {
            v = Tensor.mulMatrices(v, w);
          } else if (mulMode == "matvec") {
            v = Tensor.transposeMatrix(
              Tensor.mulMatrices(
                v, Tensor.transposeVector(w)
              )
            )[0];
          } else if (mulMode == "vecmat") {
            v = Tensor.mulMatrices(
              Tensor.transposeMatrix(
                Tensor.transposeVector(v)
              ), w
            )[0];
          } else {
            throw "mul: incompatible tensors";
          }
        }
      }
      return v;

    case "power":
      var base = evalNode(node.base, scope);
      var exp  = evalNode(node.exp, scope);
      if (typeof base == "number" && typeof exp == "number") {
        return Math.pow(base, exp);
      } else if (base instanceof Array && typeof exp == "number") {
        var dim = Tensor.getDimensions(base);
        var rank = Tensor.getRank(base);
        if (Number.isInteger(exp) && exp > 0) {
          if (exp == 1) {
            return base;
          }
          if (rank == 1) {
            var v = Tensor.copyOf(base);
            for (var i = 1; i < exp; i++) {
              var mulMode = Tensor.getMulMode(v, base);
              if (mulMode == "vec") {
                v = Tensor.mulVectors(v, base);
              } else if (mulMode == "numten") {
                v = Tensor.mulScalarTensor(v, base);
              }
            }
            return v;
          } else if (rank == 2) {
            if (dim[0] == dim[1]) {
              var v = Tensor.copyOf(base);
              for (var i = 1; i < exp; i++) {
                v = Tensor.mulMatrices(v, base);
              }
              return v;
            }
            throw "pow: no square matrix found";
          } else {
            throw "pow: unsupported tensor of rank " + rank;
          }
        }
        throw "pow: non integer exponent or <= 0";
      }
      throw "pow: incompatible types";
  }
  throw "unsupported node type: " + node.type;
}

function sumScalar(node, scope) {
  var v = 0;
  for (var i = 0; i < node.elements.length; i++)  {
    var r = evalNode(node.elements[i], scope);
    if (typeof r == "number") {
      if (node.elements[i].sign == "-") {
        v -= r;
      } else {
        v += r;
      }
    } else {
      throw "sum: incompatible types";
    }
  }
  return v;
}

class UserFunction {
  constructor(name, params, term) {
    console.log(name, params, term);
    this.name = name;
    this.params = params;
    this.term = term;
  }

  call(params, scope) {
    var nScope = {...scope};
    nScope[this.name] = null; // prevent calling recursively
    if (this.params.length != params.length) {
      throw "call user function: invalid number of parameters";
    }
    for (var i = 0; i < this.params.length; i++) {
      nScope[this.params[i]] = params[i];
    }
    return evalNode(this.term, nScope);
  }
}

module.exports = {
  eval: eval,
  evalNode: evalNode
};
