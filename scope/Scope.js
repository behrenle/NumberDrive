class Scope {
  constructor(values) {
    this.values = typeof values == "object" ? values : {};
  }

  exists(name) {
    return this.values[name] ? true : false;
  }

  getValue(name) {
    return this.values[name];
  }

  setValue(name, value) {
    this.values[name] = name;
  }
}

module.exports = Scope;
