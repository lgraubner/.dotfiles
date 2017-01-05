(function() {
  var Color, ColorContext, ColorExpression, Emitter, VariablesCollection, nextId, ref, registry,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = [], Emitter = ref[0], ColorExpression = ref[1], ColorContext = ref[2], Color = ref[3], registry = ref[4];

  nextId = 0;

  module.exports = VariablesCollection = (function() {
    VariablesCollection.deserialize = function(state) {
      return new VariablesCollection(state);
    };

    Object.defineProperty(VariablesCollection.prototype, 'length', {
      get: function() {
        return this.variables.length;
      },
      enumerable: true
    });

    function VariablesCollection(state) {
      if (Emitter == null) {
        Emitter = require('atom').Emitter;
      }
      this.emitter = new Emitter;
      this.reset();
      this.initialize(state != null ? state.content : void 0);
    }

    VariablesCollection.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    VariablesCollection.prototype.onceInitialized = function(callback) {
      var disposable;
      if (callback == null) {
        return;
      }
      if (this.initialized) {
        return callback();
      } else {
        return disposable = this.emitter.on('did-initialize', function() {
          disposable.dispose();
          return callback();
        });
      }
    };

    VariablesCollection.prototype.initialize = function(content) {
      var iteration;
      if (content == null) {
        content = [];
      }
      iteration = (function(_this) {
        return function(cb) {
          var end, start, v;
          start = new Date;
          end = new Date;
          while (content.length > 0 && end - start < 100) {
            v = content.shift();
            _this.restoreVariable(v);
          }
          if (content.length > 0) {
            return requestAnimationFrame(function() {
              return iteration(cb);
            });
          } else {
            return typeof cb === "function" ? cb() : void 0;
          }
        };
      })(this);
      return iteration((function(_this) {
        return function() {
          _this.initialized = true;
          return _this.emitter.emit('did-initialize');
        };
      })(this));
    };

    VariablesCollection.prototype.reset = function() {
      this.variables = [];
      this.variableNames = [];
      this.colorVariables = [];
      this.variablesByPath = {};
      return this.dependencyGraph = {};
    };

    VariablesCollection.prototype.getVariables = function() {
      return this.variables.slice();
    };

    VariablesCollection.prototype.getNonColorVariables = function() {
      return this.getVariables().filter(function(v) {
        return !v.isColor;
      });
    };

    VariablesCollection.prototype.getVariablesForPath = function(path) {
      var ref1;
      return (ref1 = this.variablesByPath[path]) != null ? ref1 : [];
    };

    VariablesCollection.prototype.getVariableByName = function(name) {
      return this.collectVariablesByName([name]).pop();
    };

    VariablesCollection.prototype.getVariableById = function(id) {
      var i, len, ref1, v;
      ref1 = this.variables;
      for (i = 0, len = ref1.length; i < len; i++) {
        v = ref1[i];
        if (v.id === id) {
          return v;
        }
      }
    };

    VariablesCollection.prototype.getVariablesForPaths = function(paths) {
      var i, len, p, res;
      res = [];
      for (i = 0, len = paths.length; i < len; i++) {
        p = paths[i];
        if (p in this.variablesByPath) {
          res = res.concat(this.variablesByPath[p]);
        }
      }
      return res;
    };

    VariablesCollection.prototype.getColorVariables = function() {
      return this.colorVariables.slice();
    };

    VariablesCollection.prototype.find = function(properties) {
      var ref1;
      return (ref1 = this.findAll(properties)) != null ? ref1[0] : void 0;
    };

    VariablesCollection.prototype.findAll = function(properties) {
      var keys;
      if (properties == null) {
        properties = {};
      }
      keys = Object.keys(properties);
      if (keys.length === 0) {
        return null;
      }
      return this.variables.filter(function(v) {
        return keys.every(function(k) {
          var a, b, ref1;
          if (((ref1 = v[k]) != null ? ref1.isEqual : void 0) != null) {
            return v[k].isEqual(properties[k]);
          } else if (Array.isArray(b = properties[k])) {
            a = v[k];
            return a.length === b.length && a.every(function(value) {
              return indexOf.call(b, value) >= 0;
            });
          } else {
            return v[k] === properties[k];
          }
        });
      });
    };

    VariablesCollection.prototype.updateCollection = function(collection, paths) {
      var created, destroyed, i, j, l, len, len1, len2, name1, path, pathsCollection, pathsToDestroy, ref1, ref2, ref3, ref4, ref5, ref6, ref7, remainingPaths, results, updated, v;
      pathsCollection = {};
      remainingPaths = [];
      for (i = 0, len = collection.length; i < len; i++) {
        v = collection[i];
        if (pathsCollection[name1 = v.path] == null) {
          pathsCollection[name1] = [];
        }
        pathsCollection[v.path].push(v);
        if (ref1 = v.path, indexOf.call(remainingPaths, ref1) < 0) {
          remainingPaths.push(v.path);
        }
      }
      results = {
        created: [],
        destroyed: [],
        updated: []
      };
      for (path in pathsCollection) {
        collection = pathsCollection[path];
        ref2 = this.updatePathCollection(path, collection, true) || {}, created = ref2.created, updated = ref2.updated, destroyed = ref2.destroyed;
        if (created != null) {
          results.created = results.created.concat(created);
        }
        if (updated != null) {
          results.updated = results.updated.concat(updated);
        }
        if (destroyed != null) {
          results.destroyed = results.destroyed.concat(destroyed);
        }
      }
      if (paths != null) {
        pathsToDestroy = collection.length === 0 ? paths : paths.filter(function(p) {
          return indexOf.call(remainingPaths, p) < 0;
        });
        for (j = 0, len1 = pathsToDestroy.length; j < len1; j++) {
          path = pathsToDestroy[j];
          ref3 = this.updatePathCollection(path, collection, true) || {}, created = ref3.created, updated = ref3.updated, destroyed = ref3.destroyed;
          if (created != null) {
            results.created = results.created.concat(created);
          }
          if (updated != null) {
            results.updated = results.updated.concat(updated);
          }
          if (destroyed != null) {
            results.destroyed = results.destroyed.concat(destroyed);
          }
        }
      }
      results = this.updateDependencies(results);
      if (((ref4 = results.created) != null ? ref4.length : void 0) === 0) {
        delete results.created;
      }
      if (((ref5 = results.updated) != null ? ref5.length : void 0) === 0) {
        delete results.updated;
      }
      if (((ref6 = results.destroyed) != null ? ref6.length : void 0) === 0) {
        delete results.destroyed;
      }
      if (results.destroyed != null) {
        ref7 = results.destroyed;
        for (l = 0, len2 = ref7.length; l < len2; l++) {
          v = ref7[l];
          this.deleteVariableReferences(v);
        }
      }
      return this.emitChangeEvent(results);
    };

    VariablesCollection.prototype.updatePathCollection = function(path, collection, batch) {
      var destroyed, i, j, len, len1, pathCollection, results, status, v;
      if (batch == null) {
        batch = false;
      }
      pathCollection = this.variablesByPath[path] || [];
      results = this.addMany(collection, true);
      destroyed = [];
      for (i = 0, len = pathCollection.length; i < len; i++) {
        v = pathCollection[i];
        status = this.getVariableStatusInCollection(v, collection)[0];
        if (status === 'created') {
          destroyed.push(this.remove(v, true));
        }
      }
      if (destroyed.length > 0) {
        results.destroyed = destroyed;
      }
      if (batch) {
        return results;
      } else {
        results = this.updateDependencies(results);
        for (j = 0, len1 = destroyed.length; j < len1; j++) {
          v = destroyed[j];
          this.deleteVariableReferences(v);
        }
        return this.emitChangeEvent(results);
      }
    };

    VariablesCollection.prototype.add = function(variable, batch) {
      var previousVariable, ref1, status;
      if (batch == null) {
        batch = false;
      }
      ref1 = this.getVariableStatus(variable), status = ref1[0], previousVariable = ref1[1];
      variable["default"] || (variable["default"] = variable.path.match(/\/.pigments$/));
      switch (status) {
        case 'moved':
          previousVariable.range = variable.range;
          previousVariable.bufferRange = variable.bufferRange;
          return void 0;
        case 'updated':
          return this.updateVariable(previousVariable, variable, batch);
        case 'created':
          return this.createVariable(variable, batch);
      }
    };

    VariablesCollection.prototype.addMany = function(variables, batch) {
      var i, len, res, results, status, v, variable;
      if (batch == null) {
        batch = false;
      }
      results = {};
      for (i = 0, len = variables.length; i < len; i++) {
        variable = variables[i];
        res = this.add(variable, true);
        if (res != null) {
          status = res[0], v = res[1];
          if (results[status] == null) {
            results[status] = [];
          }
          results[status].push(v);
        }
      }
      if (batch) {
        return results;
      } else {
        return this.emitChangeEvent(this.updateDependencies(results));
      }
    };

    VariablesCollection.prototype.remove = function(variable, batch) {
      var results;
      if (batch == null) {
        batch = false;
      }
      variable = this.find(variable);
      if (variable == null) {
        return;
      }
      this.variables = this.variables.filter(function(v) {
        return v !== variable;
      });
      if (variable.isColor) {
        this.colorVariables = this.colorVariables.filter(function(v) {
          return v !== variable;
        });
      }
      if (batch) {
        return variable;
      } else {
        results = this.updateDependencies({
          destroyed: [variable]
        });
        this.deleteVariableReferences(variable);
        return this.emitChangeEvent(results);
      }
    };

    VariablesCollection.prototype.removeMany = function(variables, batch) {
      var destroyed, i, j, len, len1, results, v, variable;
      if (batch == null) {
        batch = false;
      }
      destroyed = [];
      for (i = 0, len = variables.length; i < len; i++) {
        variable = variables[i];
        destroyed.push(this.remove(variable, true));
      }
      results = {
        destroyed: destroyed
      };
      if (batch) {
        return results;
      } else {
        results = this.updateDependencies(results);
        for (j = 0, len1 = destroyed.length; j < len1; j++) {
          v = destroyed[j];
          if (v != null) {
            this.deleteVariableReferences(v);
          }
        }
        return this.emitChangeEvent(results);
      }
    };

    VariablesCollection.prototype.deleteVariablesForPaths = function(paths) {
      return this.removeMany(this.getVariablesForPaths(paths));
    };

    VariablesCollection.prototype.deleteVariableReferences = function(variable) {
      var a, dependencies;
      dependencies = this.getVariableDependencies(variable);
      a = this.variablesByPath[variable.path];
      a.splice(a.indexOf(variable), 1);
      a = this.variableNames;
      a.splice(a.indexOf(variable.name), 1);
      this.removeDependencies(variable.name, dependencies);
      return delete this.dependencyGraph[variable.name];
    };

    VariablesCollection.prototype.getContext = function() {
      if (ColorContext == null) {
        ColorContext = require('./color-context');
      }
      if (registry == null) {
        registry = require('./color-expressions');
      }
      return new ColorContext({
        variables: this.variables,
        colorVariables: this.colorVariables,
        registry: registry
      });
    };

    VariablesCollection.prototype.evaluateVariables = function(variables, callback) {
      var iteration, remainingVariables, updated;
      updated = [];
      remainingVariables = variables.slice();
      iteration = (function(_this) {
        return function(cb) {
          var end, isColor, start, v, wasColor;
          start = new Date;
          end = new Date;
          while (remainingVariables.length > 0 && end - start < 100) {
            v = remainingVariables.shift();
            wasColor = v.isColor;
            _this.evaluateVariableColor(v, wasColor);
            isColor = v.isColor;
            if (isColor !== wasColor) {
              updated.push(v);
              if (isColor) {
                _this.buildDependencyGraph(v);
              }
              end = new Date;
            }
          }
          if (remainingVariables.length > 0) {
            return requestAnimationFrame(function() {
              return iteration(cb);
            });
          } else {
            return typeof cb === "function" ? cb() : void 0;
          }
        };
      })(this);
      return iteration((function(_this) {
        return function() {
          if (updated.length > 0) {
            _this.emitChangeEvent(_this.updateDependencies({
              updated: updated
            }));
          }
          return typeof callback === "function" ? callback(updated) : void 0;
        };
      })(this));
    };

    VariablesCollection.prototype.updateVariable = function(previousVariable, variable, batch) {
      var added, newDependencies, previousDependencies, ref1, removed;
      previousDependencies = this.getVariableDependencies(previousVariable);
      previousVariable.value = variable.value;
      previousVariable.range = variable.range;
      previousVariable.bufferRange = variable.bufferRange;
      this.evaluateVariableColor(previousVariable, previousVariable.isColor);
      newDependencies = this.getVariableDependencies(previousVariable);
      ref1 = this.diffArrays(previousDependencies, newDependencies), removed = ref1.removed, added = ref1.added;
      this.removeDependencies(variable.name, removed);
      this.addDependencies(variable.name, added);
      if (batch) {
        return ['updated', previousVariable];
      } else {
        return this.emitChangeEvent(this.updateDependencies({
          updated: [previousVariable]
        }));
      }
    };

    VariablesCollection.prototype.restoreVariable = function(variable) {
      var base, name1;
      if (Color == null) {
        Color = require('./color');
      }
      this.variableNames.push(variable.name);
      this.variables.push(variable);
      variable.id = nextId++;
      if (variable.isColor) {
        variable.color = new Color(variable.color);
        variable.color.variables = variable.variables;
        this.colorVariables.push(variable);
        delete variable.variables;
      }
      if ((base = this.variablesByPath)[name1 = variable.path] == null) {
        base[name1] = [];
      }
      this.variablesByPath[variable.path].push(variable);
      return this.buildDependencyGraph(variable);
    };

    VariablesCollection.prototype.createVariable = function(variable, batch) {
      var base, name1;
      this.variableNames.push(variable.name);
      this.variables.push(variable);
      variable.id = nextId++;
      if ((base = this.variablesByPath)[name1 = variable.path] == null) {
        base[name1] = [];
      }
      this.variablesByPath[variable.path].push(variable);
      this.evaluateVariableColor(variable);
      this.buildDependencyGraph(variable);
      if (batch) {
        return ['created', variable];
      } else {
        return this.emitChangeEvent(this.updateDependencies({
          created: [variable]
        }));
      }
    };

    VariablesCollection.prototype.evaluateVariableColor = function(variable, wasColor) {
      var color, context;
      if (wasColor == null) {
        wasColor = false;
      }
      context = this.getContext();
      color = context.readColor(variable.value, true);
      if (color != null) {
        if (wasColor && color.isEqual(variable.color)) {
          return false;
        }
        variable.color = color;
        variable.isColor = true;
        if (indexOf.call(this.colorVariables, variable) < 0) {
          this.colorVariables.push(variable);
        }
        return true;
      } else if (wasColor) {
        delete variable.color;
        variable.isColor = false;
        this.colorVariables = this.colorVariables.filter(function(v) {
          return v !== variable;
        });
        return true;
      }
    };

    VariablesCollection.prototype.getVariableStatus = function(variable) {
      if (this.variablesByPath[variable.path] == null) {
        return ['created', variable];
      }
      return this.getVariableStatusInCollection(variable, this.variablesByPath[variable.path]);
    };

    VariablesCollection.prototype.getVariableStatusInCollection = function(variable, collection) {
      var i, len, status, v;
      for (i = 0, len = collection.length; i < len; i++) {
        v = collection[i];
        status = this.compareVariables(v, variable);
        switch (status) {
          case 'identical':
            return ['unchanged', v];
          case 'move':
            return ['moved', v];
          case 'update':
            return ['updated', v];
        }
      }
      return ['created', variable];
    };

    VariablesCollection.prototype.compareVariables = function(v1, v2) {
      var sameLine, sameName, sameRange, sameValue;
      sameName = v1.name === v2.name;
      sameValue = v1.value === v2.value;
      sameLine = v1.line === v2.line;
      sameRange = v1.range[0] === v2.range[0] && v1.range[1] === v2.range[1];
      if ((v1.bufferRange != null) && (v2.bufferRange != null)) {
        sameRange && (sameRange = v1.bufferRange.isEqual(v2.bufferRange));
      }
      if (sameName && sameValue) {
        if (sameRange) {
          return 'identical';
        } else {
          return 'move';
        }
      } else if (sameName) {
        if (sameRange || sameLine) {
          return 'update';
        } else {
          return 'different';
        }
      }
    };

    VariablesCollection.prototype.buildDependencyGraph = function(variable) {
      var a, base, dependencies, dependency, i, len, ref1, results1;
      dependencies = this.getVariableDependencies(variable);
      results1 = [];
      for (i = 0, len = dependencies.length; i < len; i++) {
        dependency = dependencies[i];
        a = (base = this.dependencyGraph)[dependency] != null ? base[dependency] : base[dependency] = [];
        if (ref1 = variable.name, indexOf.call(a, ref1) < 0) {
          results1.push(a.push(variable.name));
        } else {
          results1.push(void 0);
        }
      }
      return results1;
    };

    VariablesCollection.prototype.getVariableDependencies = function(variable) {
      var dependencies, i, len, ref1, ref2, ref3, v, variables;
      dependencies = [];
      if (ref1 = variable.value, indexOf.call(this.variableNames, ref1) >= 0) {
        dependencies.push(variable.value);
      }
      if (((ref2 = variable.color) != null ? (ref3 = ref2.variables) != null ? ref3.length : void 0 : void 0) > 0) {
        variables = variable.color.variables;
        for (i = 0, len = variables.length; i < len; i++) {
          v = variables[i];
          if (indexOf.call(dependencies, v) < 0) {
            dependencies.push(v);
          }
        }
      }
      return dependencies;
    };

    VariablesCollection.prototype.collectVariablesByName = function(names) {
      var i, len, ref1, ref2, v, variables;
      variables = [];
      ref1 = this.variables;
      for (i = 0, len = ref1.length; i < len; i++) {
        v = ref1[i];
        if (ref2 = v.name, indexOf.call(names, ref2) >= 0) {
          variables.push(v);
        }
      }
      return variables;
    };

    VariablesCollection.prototype.removeDependencies = function(from, to) {
      var dependencies, i, len, results1, v;
      results1 = [];
      for (i = 0, len = to.length; i < len; i++) {
        v = to[i];
        if (dependencies = this.dependencyGraph[v]) {
          dependencies.splice(dependencies.indexOf(from), 1);
          if (dependencies.length === 0) {
            results1.push(delete this.dependencyGraph[v]);
          } else {
            results1.push(void 0);
          }
        } else {
          results1.push(void 0);
        }
      }
      return results1;
    };

    VariablesCollection.prototype.addDependencies = function(from, to) {
      var base, i, len, results1, v;
      results1 = [];
      for (i = 0, len = to.length; i < len; i++) {
        v = to[i];
        if ((base = this.dependencyGraph)[v] == null) {
          base[v] = [];
        }
        results1.push(this.dependencyGraph[v].push(from));
      }
      return results1;
    };

    VariablesCollection.prototype.updateDependencies = function(arg) {
      var created, createdVariableNames, dependencies, destroyed, dirtyVariableNames, dirtyVariables, i, j, l, len, len1, len2, name, updated, variable, variables;
      created = arg.created, updated = arg.updated, destroyed = arg.destroyed;
      this.updateColorVariablesExpression();
      variables = [];
      dirtyVariableNames = [];
      if (created != null) {
        variables = variables.concat(created);
        createdVariableNames = created.map(function(v) {
          return v.name;
        });
      } else {
        createdVariableNames = [];
      }
      if (updated != null) {
        variables = variables.concat(updated);
      }
      if (destroyed != null) {
        variables = variables.concat(destroyed);
      }
      variables = variables.filter(function(v) {
        return v != null;
      });
      for (i = 0, len = variables.length; i < len; i++) {
        variable = variables[i];
        if (dependencies = this.dependencyGraph[variable.name]) {
          for (j = 0, len1 = dependencies.length; j < len1; j++) {
            name = dependencies[j];
            if (indexOf.call(dirtyVariableNames, name) < 0 && indexOf.call(createdVariableNames, name) < 0) {
              dirtyVariableNames.push(name);
            }
          }
        }
      }
      dirtyVariables = this.collectVariablesByName(dirtyVariableNames);
      for (l = 0, len2 = dirtyVariables.length; l < len2; l++) {
        variable = dirtyVariables[l];
        if (this.evaluateVariableColor(variable, variable.isColor)) {
          if (updated == null) {
            updated = [];
          }
          updated.push(variable);
        }
      }
      return {
        created: created,
        destroyed: destroyed,
        updated: updated
      };
    };

    VariablesCollection.prototype.emitChangeEvent = function(arg) {
      var created, destroyed, updated;
      created = arg.created, destroyed = arg.destroyed, updated = arg.updated;
      if ((created != null ? created.length : void 0) || (destroyed != null ? destroyed.length : void 0) || (updated != null ? updated.length : void 0)) {
        this.updateColorVariablesExpression();
        return this.emitter.emit('did-change', {
          created: created,
          destroyed: destroyed,
          updated: updated
        });
      }
    };

    VariablesCollection.prototype.updateColorVariablesExpression = function() {
      var colorVariables;
      if (registry == null) {
        registry = require('./color-expressions');
      }
      colorVariables = this.getColorVariables();
      if (colorVariables.length > 0) {
        if (ColorExpression == null) {
          ColorExpression = require('./color-expression');
        }
        return registry.addExpression(ColorExpression.colorExpressionForColorVariables(colorVariables));
      } else {
        return registry.removeExpression('pigments:variables');
      }
    };

    VariablesCollection.prototype.diffArrays = function(a, b) {
      var added, i, j, len, len1, removed, v;
      removed = [];
      added = [];
      for (i = 0, len = a.length; i < len; i++) {
        v = a[i];
        if (indexOf.call(b, v) < 0) {
          removed.push(v);
        }
      }
      for (j = 0, len1 = b.length; j < len1; j++) {
        v = b[j];
        if (indexOf.call(a, v) < 0) {
          added.push(v);
        }
      }
      return {
        removed: removed,
        added: added
      };
    };

    VariablesCollection.prototype.serialize = function() {
      return {
        deserializer: 'VariablesCollection',
        content: this.variables.map(function(v) {
          var res;
          res = {
            name: v.name,
            value: v.value,
            path: v.path,
            range: v.range,
            line: v.line
          };
          if (v.isAlternate) {
            res.isAlternate = true;
          }
          if (v.noNamePrefix) {
            res.noNamePrefix = true;
          }
          if (v["default"]) {
            res["default"] = true;
          }
          if (v.isColor) {
            res.isColor = true;
            res.color = v.color.serialize();
            if (v.color.variables != null) {
              res.variables = v.color.variables;
            }
          }
          return res;
        })
      };
    };

    return VariablesCollection;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3ZhcmlhYmxlcy1jb2xsZWN0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEseUZBQUE7SUFBQTs7RUFBQSxNQUE0RCxFQUE1RCxFQUFDLGdCQUFELEVBQVUsd0JBQVYsRUFBMkIscUJBQTNCLEVBQXlDLGNBQXpDLEVBQWdEOztFQUVoRCxNQUFBLEdBQVM7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNKLG1CQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsS0FBRDthQUNSLElBQUEsbUJBQUEsQ0FBb0IsS0FBcEI7SUFEUTs7SUFHZCxNQUFNLENBQUMsY0FBUCxDQUFzQixtQkFBQyxDQUFBLFNBQXZCLEVBQWtDLFFBQWxDLEVBQTRDO01BQzFDLEdBQUEsRUFBSyxTQUFBO2VBQUcsSUFBQyxDQUFBLFNBQVMsQ0FBQztNQUFkLENBRHFDO01BRTFDLFVBQUEsRUFBWSxJQUY4QjtLQUE1Qzs7SUFLYSw2QkFBQyxLQUFEOztRQUNYLFVBQVcsT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDOztNQUUzQixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUk7TUFFZixJQUFDLENBQUEsS0FBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFVBQUQsaUJBQVksS0FBSyxDQUFFLGdCQUFuQjtJQU5XOztrQ0FRYixXQUFBLEdBQWEsU0FBQyxRQUFEO2FBQ1gsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksWUFBWixFQUEwQixRQUExQjtJQURXOztrQ0FHYixlQUFBLEdBQWlCLFNBQUMsUUFBRDtBQUNmLFVBQUE7TUFBQSxJQUFjLGdCQUFkO0FBQUEsZUFBQTs7TUFDQSxJQUFHLElBQUMsQ0FBQSxXQUFKO2VBQ0UsUUFBQSxDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsVUFBQSxH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U0FBUyxDQUFDLEdBQVgsQ0FBZSxTQUFDLENBQUQ7QUFDdEIsY0FBQTtVQUFBLEdBQUEsR0FBTTtZQUNKLElBQUEsRUFBTSxDQUFDLENBQUMsSUFESjtZQUVKLEtBQUEsRUFBTyxDQUFDLENBQUMsS0FGTDtZQUdKLElBQUEsRUFBTSxDQUFDLENBQUMsSUFISjtZQUlKLEtBQUEsRUFBTyxDQUFDLENBQUMsS0FKTDtZQUtKLElBQUEsRUFBTSxDQUFDLENBQUMsSUFMSjs7VUFRTixJQUEwQixDQUFDLENBQUMsV0FBNUI7WUFBQSxHQUFHLENBQUMsV0FBSixHQUFrQixLQUFsQjs7VUFDQSxJQUEyQixDQUFDLENBQUMsWUFBN0I7WUFBQSxHQUFHLENBQUMsWUFBSixHQUFtQixLQUFuQjs7VUFDQSxJQUFzQixDQUFDLEVBQUMsT0FBRCxFQUF2QjtZQUFBLEdBQUcsRUFBQyxPQUFELEVBQUgsR0FBYyxLQUFkOztVQUVBLElBQUcsQ0FBQyxDQUFDLE9BQUw7WUFDRSxHQUFHLENBQUMsT0FBSixHQUFjO1lBQ2QsR0FBRyxDQUFDLEtBQUosR0FBWSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVIsQ0FBQTtZQUNaLElBQXFDLHlCQUFyQztjQUFBLEdBQUcsQ0FBQyxTQUFKLEdBQWdCLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBeEI7YUFIRjs7aUJBS0E7UUFsQnNCLENBQWYsQ0FGWDs7SUFEUzs7Ozs7QUFuZGIiLCJzb3VyY2VzQ29udGVudCI6WyJbRW1pdHRlciwgQ29sb3JFeHByZXNzaW9uLCBDb2xvckNvbnRleHQsIENvbG9yLCByZWdpc3RyeV0gPSBbXVxuXG5uZXh0SWQgPSAwXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFZhcmlhYmxlc0NvbGxlY3Rpb25cbiAgQGRlc2VyaWFsaXplOiAoc3RhdGUpIC0+XG4gICAgbmV3IFZhcmlhYmxlc0NvbGxlY3Rpb24oc3RhdGUpXG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5IEBwcm90b3R5cGUsICdsZW5ndGgnLCB7XG4gICAgZ2V0OiAtPiBAdmFyaWFibGVzLmxlbmd0aFxuICAgIGVudW1lcmFibGU6IHRydWVcbiAgfVxuXG4gIGNvbnN0cnVjdG9yOiAoc3RhdGUpIC0+XG4gICAgRW1pdHRlciA/PSByZXF1aXJlKCdhdG9tJykuRW1pdHRlclxuXG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlclxuXG4gICAgQHJlc2V0KClcbiAgICBAaW5pdGlhbGl6ZShzdGF0ZT8uY29udGVudClcblxuICBvbkRpZENoYW5nZTogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtY2hhbmdlJywgY2FsbGJhY2tcblxuICBvbmNlSW5pdGlhbGl6ZWQ6IChjYWxsYmFjaykgLT5cbiAgICByZXR1cm4gdW5sZXNzIGNhbGxiYWNrP1xuICAgIGlmIEBpbml0aWFsaXplZFxuICAgICAgY2FsbGJhY2soKVxuICAgIGVsc2VcbiAgICAgIGRpc3Bvc2FibGUgPSBAZW1pdHRlci5vbiAnZGlkLWluaXRpYWxpemUnLCAtPlxuICAgICAgICBkaXNwb3NhYmxlLmRpc3Bvc2UoKVxuICAgICAgICBjYWxsYmFjaygpXG5cbiAgaW5pdGlhbGl6ZTogKGNvbnRlbnQ9W10pIC0+XG4gICAgaXRlcmF0aW9uID0gKGNiKSA9PlxuICAgICAgc3RhcnQgPSBuZXcgRGF0ZVxuICAgICAgZW5kID0gbmV3IERhdGVcblxuICAgICAgd2hpbGUgY29udGVudC5sZW5ndGggPiAwIGFuZCBlbmQgLSBzdGFydCA8IDEwMFxuICAgICAgICB2ID0gY29udGVudC5zaGlmdCgpXG4gICAgICAgIEByZXN0b3JlVmFyaWFibGUodilcblxuICAgICAgaWYgY29udGVudC5sZW5ndGggPiAwXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgtPiBpdGVyYXRpb24oY2IpKVxuICAgICAgZWxzZVxuICAgICAgICBjYj8oKVxuXG4gICAgaXRlcmF0aW9uID0+XG4gICAgICBAaW5pdGlhbGl6ZWQgPSB0cnVlXG4gICAgICBAZW1pdHRlci5lbWl0KCdkaWQtaW5pdGlhbGl6ZScpXG5cbiAgcmVzZXQ6IC0+XG4gICAgQHZhcmlhYmxlcyA9IFtdXG4gICAgQHZhcmlhYmxlTmFtZXMgPSBbXVxuICAgIEBjb2xvclZhcmlhYmxlcyA9IFtdXG4gICAgQHZhcmlhYmxlc0J5UGF0aCA9IHt9XG4gICAgQGRlcGVuZGVuY3lHcmFwaCA9IHt9XG5cbiAgZ2V0VmFyaWFibGVzOiAtPiBAdmFyaWFibGVzLnNsaWNlKClcblxuICBnZXROb25Db2xvclZhcmlhYmxlczogLT4gQGdldFZhcmlhYmxlcygpLmZpbHRlciAodikgLT4gbm90IHYuaXNDb2xvclxuXG4gIGdldFZhcmlhYmxlc0ZvclBhdGg6IChwYXRoKSAtPiBAdmFyaWFibGVzQnlQYXRoW3BhdGhdID8gW11cblxuICBnZXRWYXJpYWJsZUJ5TmFtZTogKG5hbWUpIC0+IEBjb2xsZWN0VmFyaWFibGVzQnlOYW1lKFtuYW1lXSkucG9wKClcblxuICBnZXRWYXJpYWJsZUJ5SWQ6IChpZCkgLT4gcmV0dXJuIHYgZm9yIHYgaW4gQHZhcmlhYmxlcyB3aGVuIHYuaWQgaXMgaWRcblxuICBnZXRWYXJpYWJsZXNGb3JQYXRoczogKHBhdGhzKSAtPlxuICAgIHJlcyA9IFtdXG5cbiAgICBmb3IgcCBpbiBwYXRocyB3aGVuIHAgb2YgQHZhcmlhYmxlc0J5UGF0aFxuICAgICAgcmVzID0gcmVzLmNvbmNhdChAdmFyaWFibGVzQnlQYXRoW3BdKVxuXG4gICAgcmVzXG5cbiAgZ2V0Q29sb3JWYXJpYWJsZXM6IC0+IEBjb2xvclZhcmlhYmxlcy5zbGljZSgpXG5cbiAgZmluZDogKHByb3BlcnRpZXMpIC0+IEBmaW5kQWxsKHByb3BlcnRpZXMpP1swXVxuXG4gIGZpbmRBbGw6IChwcm9wZXJ0aWVzPXt9KSAtPlxuICAgIGtleXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKVxuICAgIHJldHVybiBudWxsIGlmIGtleXMubGVuZ3RoIGlzIDBcblxuICAgIEB2YXJpYWJsZXMuZmlsdGVyICh2KSAtPiBrZXlzLmV2ZXJ5IChrKSAtPlxuICAgICAgaWYgdltrXT8uaXNFcXVhbD9cbiAgICAgICAgdltrXS5pc0VxdWFsKHByb3BlcnRpZXNba10pXG4gICAgICBlbHNlIGlmIEFycmF5LmlzQXJyYXkoYiA9IHByb3BlcnRpZXNba10pXG4gICAgICAgIGEgPSB2W2tdXG4gICAgICAgIGEubGVuZ3RoIGlzIGIubGVuZ3RoIGFuZCBhLmV2ZXJ5ICh2YWx1ZSkgLT4gdmFsdWUgaW4gYlxuICAgICAgZWxzZVxuICAgICAgICB2W2tdIGlzIHByb3BlcnRpZXNba11cblxuICB1cGRhdGVDb2xsZWN0aW9uOiAoY29sbGVjdGlvbiwgcGF0aHMpIC0+XG4gICAgcGF0aHNDb2xsZWN0aW9uID0ge31cbiAgICByZW1haW5pbmdQYXRocyA9IFtdXG5cbiAgICBmb3IgdiBpbiBjb2xsZWN0aW9uXG4gICAgICBwYXRoc0NvbGxlY3Rpb25bdi5wYXRoXSA/PSBbXVxuICAgICAgcGF0aHNDb2xsZWN0aW9uW3YucGF0aF0ucHVzaCh2KVxuICAgICAgcmVtYWluaW5nUGF0aHMucHVzaCh2LnBhdGgpIHVubGVzcyB2LnBhdGggaW4gcmVtYWluaW5nUGF0aHNcblxuICAgIHJlc3VsdHMgPSB7XG4gICAgICBjcmVhdGVkOiBbXVxuICAgICAgZGVzdHJveWVkOiBbXVxuICAgICAgdXBkYXRlZDogW11cbiAgICB9XG5cbiAgICBmb3IgcGF0aCwgY29sbGVjdGlvbiBvZiBwYXRoc0NvbGxlY3Rpb25cbiAgICAgIHtjcmVhdGVkLCB1cGRhdGVkLCBkZXN0cm95ZWR9ID0gQHVwZGF0ZVBhdGhDb2xsZWN0aW9uKHBhdGgsIGNvbGxlY3Rpb24sIHRydWUpIG9yIHt9XG5cbiAgICAgIHJlc3VsdHMuY3JlYXRlZCA9IHJlc3VsdHMuY3JlYXRlZC5jb25jYXQoY3JlYXRlZCkgaWYgY3JlYXRlZD9cbiAgICAgIHJlc3VsdHMudXBkYXRlZCA9IHJlc3VsdHMudXBkYXRlZC5jb25jYXQodXBkYXRlZCkgaWYgdXBkYXRlZD9cbiAgICAgIHJlc3VsdHMuZGVzdHJveWVkID0gcmVzdWx0cy5kZXN0cm95ZWQuY29uY2F0KGRlc3Ryb3llZCkgaWYgZGVzdHJveWVkP1xuXG4gICAgaWYgcGF0aHM/XG4gICAgICBwYXRoc1RvRGVzdHJveSA9IGlmIGNvbGxlY3Rpb24ubGVuZ3RoIGlzIDBcbiAgICAgICAgcGF0aHNcbiAgICAgIGVsc2VcbiAgICAgICAgcGF0aHMuZmlsdGVyIChwKSAtPiBwIG5vdCBpbiByZW1haW5pbmdQYXRoc1xuXG4gICAgICBmb3IgcGF0aCBpbiBwYXRoc1RvRGVzdHJveVxuICAgICAgICB7Y3JlYXRlZCwgdXBkYXRlZCwgZGVzdHJveWVkfSA9IEB1cGRhdGVQYXRoQ29sbGVjdGlvbihwYXRoLCBjb2xsZWN0aW9uLCB0cnVlKSBvciB7fVxuXG4gICAgICAgIHJlc3VsdHMuY3JlYXRlZCA9IHJlc3VsdHMuY3JlYXRlZC5jb25jYXQoY3JlYXRlZCkgaWYgY3JlYXRlZD9cbiAgICAgICAgcmVzdWx0cy51cGRhdGVkID0gcmVzdWx0cy51cGRhdGVkLmNvbmNhdCh1cGRhdGVkKSBpZiB1cGRhdGVkP1xuICAgICAgICByZXN1bHRzLmRlc3Ryb3llZCA9IHJlc3VsdHMuZGVzdHJveWVkLmNvbmNhdChkZXN0cm95ZWQpIGlmIGRlc3Ryb3llZD9cblxuICAgIHJlc3VsdHMgPSBAdXBkYXRlRGVwZW5kZW5jaWVzKHJlc3VsdHMpXG5cbiAgICBkZWxldGUgcmVzdWx0cy5jcmVhdGVkIGlmIHJlc3VsdHMuY3JlYXRlZD8ubGVuZ3RoIGlzIDBcbiAgICBkZWxldGUgcmVzdWx0cy51cGRhdGVkIGlmIHJlc3VsdHMudXBkYXRlZD8ubGVuZ3RoIGlzIDBcbiAgICBkZWxldGUgcmVzdWx0cy5kZXN0cm95ZWQgaWYgcmVzdWx0cy5kZXN0cm95ZWQ/Lmxlbmd0aCBpcyAwXG5cbiAgICBpZiByZXN1bHRzLmRlc3Ryb3llZD9cbiAgICAgIEBkZWxldGVWYXJpYWJsZVJlZmVyZW5jZXModikgZm9yIHYgaW4gcmVzdWx0cy5kZXN0cm95ZWRcblxuICAgIEBlbWl0Q2hhbmdlRXZlbnQocmVzdWx0cylcblxuICB1cGRhdGVQYXRoQ29sbGVjdGlvbjogKHBhdGgsIGNvbGxlY3Rpb24sIGJhdGNoPWZhbHNlKSAtPlxuICAgIHBhdGhDb2xsZWN0aW9uID0gQHZhcmlhYmxlc0J5UGF0aFtwYXRoXSBvciBbXVxuXG4gICAgcmVzdWx0cyA9IEBhZGRNYW55KGNvbGxlY3Rpb24sIHRydWUpXG5cbiAgICBkZXN0cm95ZWQgPSBbXVxuICAgIGZvciB2IGluIHBhdGhDb2xsZWN0aW9uXG4gICAgICBbc3RhdHVzXSA9IEBnZXRWYXJpYWJsZVN0YXR1c0luQ29sbGVjdGlvbih2LCBjb2xsZWN0aW9uKVxuICAgICAgZGVzdHJveWVkLnB1c2goQHJlbW92ZSh2LCB0cnVlKSkgaWYgc3RhdHVzIGlzICdjcmVhdGVkJ1xuXG4gICAgcmVzdWx0cy5kZXN0cm95ZWQgPSBkZXN0cm95ZWQgaWYgZGVzdHJveWVkLmxlbmd0aCA+IDBcblxuICAgIGlmIGJhdGNoXG4gICAgICByZXN1bHRzXG4gICAgZWxzZVxuICAgICAgcmVzdWx0cyA9IEB1cGRhdGVEZXBlbmRlbmNpZXMocmVzdWx0cylcbiAgICAgIEBkZWxldGVWYXJpYWJsZVJlZmVyZW5jZXModikgZm9yIHYgaW4gZGVzdHJveWVkXG4gICAgICBAZW1pdENoYW5nZUV2ZW50KHJlc3VsdHMpXG5cbiAgYWRkOiAodmFyaWFibGUsIGJhdGNoPWZhbHNlKSAtPlxuICAgIFtzdGF0dXMsIHByZXZpb3VzVmFyaWFibGVdID0gQGdldFZhcmlhYmxlU3RhdHVzKHZhcmlhYmxlKVxuXG4gICAgdmFyaWFibGUuZGVmYXVsdCB8fD0gdmFyaWFibGUucGF0aC5tYXRjaCAvXFwvLnBpZ21lbnRzJC9cblxuICAgIHN3aXRjaCBzdGF0dXNcbiAgICAgIHdoZW4gJ21vdmVkJ1xuICAgICAgICBwcmV2aW91c1ZhcmlhYmxlLnJhbmdlID0gdmFyaWFibGUucmFuZ2VcbiAgICAgICAgcHJldmlvdXNWYXJpYWJsZS5idWZmZXJSYW5nZSA9IHZhcmlhYmxlLmJ1ZmZlclJhbmdlXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgIHdoZW4gJ3VwZGF0ZWQnXG4gICAgICAgIEB1cGRhdGVWYXJpYWJsZShwcmV2aW91c1ZhcmlhYmxlLCB2YXJpYWJsZSwgYmF0Y2gpXG4gICAgICB3aGVuICdjcmVhdGVkJ1xuICAgICAgICBAY3JlYXRlVmFyaWFibGUodmFyaWFibGUsIGJhdGNoKVxuXG4gIGFkZE1hbnk6ICh2YXJpYWJsZXMsIGJhdGNoPWZhbHNlKSAtPlxuICAgIHJlc3VsdHMgPSB7fVxuXG4gICAgZm9yIHZhcmlhYmxlIGluIHZhcmlhYmxlc1xuICAgICAgcmVzID0gQGFkZCh2YXJpYWJsZSwgdHJ1ZSlcbiAgICAgIGlmIHJlcz9cbiAgICAgICAgW3N0YXR1cywgdl0gPSByZXNcblxuICAgICAgICByZXN1bHRzW3N0YXR1c10gPz0gW11cbiAgICAgICAgcmVzdWx0c1tzdGF0dXNdLnB1c2godilcblxuICAgIGlmIGJhdGNoXG4gICAgICByZXN1bHRzXG4gICAgZWxzZVxuICAgICAgQGVtaXRDaGFuZ2VFdmVudChAdXBkYXRlRGVwZW5kZW5jaWVzKHJlc3VsdHMpKVxuXG4gIHJlbW92ZTogKHZhcmlhYmxlLCBiYXRjaD1mYWxzZSkgLT5cbiAgICB2YXJpYWJsZSA9IEBmaW5kKHZhcmlhYmxlKVxuXG4gICAgcmV0dXJuIHVubGVzcyB2YXJpYWJsZT9cblxuICAgIEB2YXJpYWJsZXMgPSBAdmFyaWFibGVzLmZpbHRlciAodikgLT4gdiBpc250IHZhcmlhYmxlXG4gICAgaWYgdmFyaWFibGUuaXNDb2xvclxuICAgICAgQGNvbG9yVmFyaWFibGVzID0gQGNvbG9yVmFyaWFibGVzLmZpbHRlciAodikgLT4gdiBpc250IHZhcmlhYmxlXG5cbiAgICBpZiBiYXRjaFxuICAgICAgcmV0dXJuIHZhcmlhYmxlXG4gICAgZWxzZVxuICAgICAgcmVzdWx0cyA9IEB1cGRhdGVEZXBlbmRlbmNpZXMoZGVzdHJveWVkOiBbdmFyaWFibGVdKVxuXG4gICAgICBAZGVsZXRlVmFyaWFibGVSZWZlcmVuY2VzKHZhcmlhYmxlKVxuICAgICAgQGVtaXRDaGFuZ2VFdmVudChyZXN1bHRzKVxuXG4gIHJlbW92ZU1hbnk6ICh2YXJpYWJsZXMsIGJhdGNoPWZhbHNlKSAtPlxuICAgIGRlc3Ryb3llZCA9IFtdXG4gICAgZm9yIHZhcmlhYmxlIGluIHZhcmlhYmxlc1xuICAgICAgZGVzdHJveWVkLnB1c2ggQHJlbW92ZSh2YXJpYWJsZSwgdHJ1ZSlcblxuICAgIHJlc3VsdHMgPSB7ZGVzdHJveWVkfVxuXG4gICAgaWYgYmF0Y2hcbiAgICAgIHJlc3VsdHNcbiAgICBlbHNlXG4gICAgICByZXN1bHRzID0gQHVwZGF0ZURlcGVuZGVuY2llcyhyZXN1bHRzKVxuICAgICAgQGRlbGV0ZVZhcmlhYmxlUmVmZXJlbmNlcyh2KSBmb3IgdiBpbiBkZXN0cm95ZWQgd2hlbiB2P1xuICAgICAgQGVtaXRDaGFuZ2VFdmVudChyZXN1bHRzKVxuXG4gIGRlbGV0ZVZhcmlhYmxlc0ZvclBhdGhzOiAocGF0aHMpIC0+IEByZW1vdmVNYW55KEBnZXRWYXJpYWJsZXNGb3JQYXRocyhwYXRocykpXG5cbiAgZGVsZXRlVmFyaWFibGVSZWZlcmVuY2VzOiAodmFyaWFibGUpIC0+XG4gICAgZGVwZW5kZW5jaWVzID0gQGdldFZhcmlhYmxlRGVwZW5kZW5jaWVzKHZhcmlhYmxlKVxuXG4gICAgYSA9IEB2YXJpYWJsZXNCeVBhdGhbdmFyaWFibGUucGF0aF1cbiAgICBhLnNwbGljZShhLmluZGV4T2YodmFyaWFibGUpLCAxKVxuXG4gICAgYSA9IEB2YXJpYWJsZU5hbWVzXG4gICAgYS5zcGxpY2UoYS5pbmRleE9mKHZhcmlhYmxlLm5hbWUpLCAxKVxuICAgIEByZW1vdmVEZXBlbmRlbmNpZXModmFyaWFibGUubmFtZSwgZGVwZW5kZW5jaWVzKVxuXG4gICAgZGVsZXRlIEBkZXBlbmRlbmN5R3JhcGhbdmFyaWFibGUubmFtZV1cblxuICBnZXRDb250ZXh0OiAtPlxuICAgIENvbG9yQ29udGV4dCA/PSByZXF1aXJlICcuL2NvbG9yLWNvbnRleHQnXG4gICAgcmVnaXN0cnkgPz0gcmVxdWlyZSAnLi9jb2xvci1leHByZXNzaW9ucydcblxuICAgIG5ldyBDb2xvckNvbnRleHQoe0B2YXJpYWJsZXMsIEBjb2xvclZhcmlhYmxlcywgcmVnaXN0cnl9KVxuXG4gIGV2YWx1YXRlVmFyaWFibGVzOiAodmFyaWFibGVzLCBjYWxsYmFjaykgLT5cbiAgICB1cGRhdGVkID0gW11cbiAgICByZW1haW5pbmdWYXJpYWJsZXMgPSB2YXJpYWJsZXMuc2xpY2UoKVxuXG4gICAgaXRlcmF0aW9uID0gKGNiKSA9PlxuICAgICAgc3RhcnQgPSBuZXcgRGF0ZVxuICAgICAgZW5kID0gbmV3IERhdGVcblxuICAgICAgd2hpbGUgcmVtYWluaW5nVmFyaWFibGVzLmxlbmd0aCA+IDAgYW5kIGVuZCAtIHN0YXJ0IDwgMTAwXG4gICAgICAgIHYgPSByZW1haW5pbmdWYXJpYWJsZXMuc2hpZnQoKVxuICAgICAgICB3YXNDb2xvciA9IHYuaXNDb2xvclxuICAgICAgICBAZXZhbHVhdGVWYXJpYWJsZUNvbG9yKHYsIHdhc0NvbG9yKVxuICAgICAgICBpc0NvbG9yID0gdi5pc0NvbG9yXG5cbiAgICAgICAgaWYgaXNDb2xvciBpc250IHdhc0NvbG9yXG4gICAgICAgICAgdXBkYXRlZC5wdXNoKHYpXG4gICAgICAgICAgQGJ1aWxkRGVwZW5kZW5jeUdyYXBoKHYpIGlmIGlzQ29sb3JcblxuICAgICAgICAgIGVuZCA9IG5ldyBEYXRlXG5cbiAgICAgIGlmIHJlbWFpbmluZ1ZhcmlhYmxlcy5sZW5ndGggPiAwXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgtPiBpdGVyYXRpb24oY2IpKVxuICAgICAgZWxzZVxuICAgICAgICBjYj8oKVxuXG4gICAgaXRlcmF0aW9uID0+XG4gICAgICBAZW1pdENoYW5nZUV2ZW50KEB1cGRhdGVEZXBlbmRlbmNpZXMoe3VwZGF0ZWR9KSkgaWYgdXBkYXRlZC5sZW5ndGggPiAwXG4gICAgICBjYWxsYmFjaz8odXBkYXRlZClcblxuICB1cGRhdGVWYXJpYWJsZTogKHByZXZpb3VzVmFyaWFibGUsIHZhcmlhYmxlLCBiYXRjaCkgLT5cbiAgICBwcmV2aW91c0RlcGVuZGVuY2llcyA9IEBnZXRWYXJpYWJsZURlcGVuZGVuY2llcyhwcmV2aW91c1ZhcmlhYmxlKVxuICAgIHByZXZpb3VzVmFyaWFibGUudmFsdWUgPSB2YXJpYWJsZS52YWx1ZVxuICAgIHByZXZpb3VzVmFyaWFibGUucmFuZ2UgPSB2YXJpYWJsZS5yYW5nZVxuICAgIHByZXZpb3VzVmFyaWFibGUuYnVmZmVyUmFuZ2UgPSB2YXJpYWJsZS5idWZmZXJSYW5nZVxuXG4gICAgQGV2YWx1YXRlVmFyaWFibGVDb2xvcihwcmV2aW91c1ZhcmlhYmxlLCBwcmV2aW91c1ZhcmlhYmxlLmlzQ29sb3IpXG4gICAgbmV3RGVwZW5kZW5jaWVzID0gQGdldFZhcmlhYmxlRGVwZW5kZW5jaWVzKHByZXZpb3VzVmFyaWFibGUpXG5cbiAgICB7cmVtb3ZlZCwgYWRkZWR9ID0gQGRpZmZBcnJheXMocHJldmlvdXNEZXBlbmRlbmNpZXMsIG5ld0RlcGVuZGVuY2llcylcbiAgICBAcmVtb3ZlRGVwZW5kZW5jaWVzKHZhcmlhYmxlLm5hbWUsIHJlbW92ZWQpXG4gICAgQGFkZERlcGVuZGVuY2llcyh2YXJpYWJsZS5uYW1lLCBhZGRlZClcblxuICAgIGlmIGJhdGNoXG4gICAgICByZXR1cm4gWyd1cGRhdGVkJywgcHJldmlvdXNWYXJpYWJsZV1cbiAgICBlbHNlXG4gICAgICBAZW1pdENoYW5nZUV2ZW50KEB1cGRhdGVEZXBlbmRlbmNpZXModXBkYXRlZDogW3ByZXZpb3VzVmFyaWFibGVdKSlcblxuICByZXN0b3JlVmFyaWFibGU6ICh2YXJpYWJsZSkgLT5cbiAgICBDb2xvciA/PSByZXF1aXJlICcuL2NvbG9yJ1xuXG4gICAgQHZhcmlhYmxlTmFtZXMucHVzaCh2YXJpYWJsZS5uYW1lKVxuICAgIEB2YXJpYWJsZXMucHVzaCB2YXJpYWJsZVxuICAgIHZhcmlhYmxlLmlkID0gbmV4dElkKytcblxuICAgIGlmIHZhcmlhYmxlLmlzQ29sb3JcbiAgICAgIHZhcmlhYmxlLmNvbG9yID0gbmV3IENvbG9yKHZhcmlhYmxlLmNvbG9yKVxuICAgICAgdmFyaWFibGUuY29sb3IudmFyaWFibGVzID0gdmFyaWFibGUudmFyaWFibGVzXG4gICAgICBAY29sb3JWYXJpYWJsZXMucHVzaCh2YXJpYWJsZSlcbiAgICAgIGRlbGV0ZSB2YXJpYWJsZS52YXJpYWJsZXNcblxuICAgIEB2YXJpYWJsZXNCeVBhdGhbdmFyaWFibGUucGF0aF0gPz0gW11cbiAgICBAdmFyaWFibGVzQnlQYXRoW3ZhcmlhYmxlLnBhdGhdLnB1c2godmFyaWFibGUpXG5cbiAgICBAYnVpbGREZXBlbmRlbmN5R3JhcGgodmFyaWFibGUpXG5cbiAgY3JlYXRlVmFyaWFibGU6ICh2YXJpYWJsZSwgYmF0Y2gpIC0+XG4gICAgQHZhcmlhYmxlTmFtZXMucHVzaCh2YXJpYWJsZS5uYW1lKVxuICAgIEB2YXJpYWJsZXMucHVzaCB2YXJpYWJsZVxuICAgIHZhcmlhYmxlLmlkID0gbmV4dElkKytcblxuICAgIEB2YXJpYWJsZXNCeVBhdGhbdmFyaWFibGUucGF0aF0gPz0gW11cbiAgICBAdmFyaWFibGVzQnlQYXRoW3ZhcmlhYmxlLnBhdGhdLnB1c2godmFyaWFibGUpXG5cbiAgICBAZXZhbHVhdGVWYXJpYWJsZUNvbG9yKHZhcmlhYmxlKVxuICAgIEBidWlsZERlcGVuZGVuY3lHcmFwaCh2YXJpYWJsZSlcblxuICAgIGlmIGJhdGNoXG4gICAgICByZXR1cm4gWydjcmVhdGVkJywgdmFyaWFibGVdXG4gICAgZWxzZVxuICAgICAgQGVtaXRDaGFuZ2VFdmVudChAdXBkYXRlRGVwZW5kZW5jaWVzKGNyZWF0ZWQ6IFt2YXJpYWJsZV0pKVxuXG4gIGV2YWx1YXRlVmFyaWFibGVDb2xvcjogKHZhcmlhYmxlLCB3YXNDb2xvcj1mYWxzZSkgLT5cbiAgICBjb250ZXh0ID0gQGdldENvbnRleHQoKVxuICAgIGNvbG9yID0gY29udGV4dC5yZWFkQ29sb3IodmFyaWFibGUudmFsdWUsIHRydWUpXG5cbiAgICBpZiBjb2xvcj9cbiAgICAgIHJldHVybiBmYWxzZSBpZiB3YXNDb2xvciBhbmQgY29sb3IuaXNFcXVhbCh2YXJpYWJsZS5jb2xvcilcblxuICAgICAgdmFyaWFibGUuY29sb3IgPSBjb2xvclxuICAgICAgdmFyaWFibGUuaXNDb2xvciA9IHRydWVcblxuICAgICAgQGNvbG9yVmFyaWFibGVzLnB1c2godmFyaWFibGUpIHVubGVzcyB2YXJpYWJsZSBpbiBAY29sb3JWYXJpYWJsZXNcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICBlbHNlIGlmIHdhc0NvbG9yXG4gICAgICBkZWxldGUgdmFyaWFibGUuY29sb3JcbiAgICAgIHZhcmlhYmxlLmlzQ29sb3IgPSBmYWxzZVxuICAgICAgQGNvbG9yVmFyaWFibGVzID0gQGNvbG9yVmFyaWFibGVzLmZpbHRlciAodikgLT4gdiBpc250IHZhcmlhYmxlXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gIGdldFZhcmlhYmxlU3RhdHVzOiAodmFyaWFibGUpIC0+XG4gICAgcmV0dXJuIFsnY3JlYXRlZCcsIHZhcmlhYmxlXSB1bmxlc3MgQHZhcmlhYmxlc0J5UGF0aFt2YXJpYWJsZS5wYXRoXT9cbiAgICBAZ2V0VmFyaWFibGVTdGF0dXNJbkNvbGxlY3Rpb24odmFyaWFibGUsIEB2YXJpYWJsZXNCeVBhdGhbdmFyaWFibGUucGF0aF0pXG5cbiAgZ2V0VmFyaWFibGVTdGF0dXNJbkNvbGxlY3Rpb246ICh2YXJpYWJsZSwgY29sbGVjdGlvbikgLT5cbiAgICBmb3IgdiBpbiBjb2xsZWN0aW9uXG4gICAgICBzdGF0dXMgPSBAY29tcGFyZVZhcmlhYmxlcyh2LCB2YXJpYWJsZSlcblxuICAgICAgc3dpdGNoIHN0YXR1c1xuICAgICAgICB3aGVuICdpZGVudGljYWwnIHRoZW4gcmV0dXJuIFsndW5jaGFuZ2VkJywgdl1cbiAgICAgICAgd2hlbiAnbW92ZScgdGhlbiByZXR1cm4gWydtb3ZlZCcsIHZdXG4gICAgICAgIHdoZW4gJ3VwZGF0ZScgdGhlbiByZXR1cm4gWyd1cGRhdGVkJywgdl1cblxuICAgIHJldHVybiBbJ2NyZWF0ZWQnLCB2YXJpYWJsZV1cblxuICBjb21wYXJlVmFyaWFibGVzOiAodjEsIHYyKSAtPlxuICAgIHNhbWVOYW1lID0gdjEubmFtZSBpcyB2Mi5uYW1lXG4gICAgc2FtZVZhbHVlID0gdjEudmFsdWUgaXMgdjIudmFsdWVcbiAgICBzYW1lTGluZSA9IHYxLmxpbmUgaXMgdjIubGluZVxuICAgIHNhbWVSYW5nZSA9IHYxLnJhbmdlWzBdIGlzIHYyLnJhbmdlWzBdIGFuZCB2MS5yYW5nZVsxXSBpcyB2Mi5yYW5nZVsxXVxuXG4gICAgaWYgdjEuYnVmZmVyUmFuZ2U/IGFuZCB2Mi5idWZmZXJSYW5nZT9cbiAgICAgIHNhbWVSYW5nZSAmJj0gdjEuYnVmZmVyUmFuZ2UuaXNFcXVhbCh2Mi5idWZmZXJSYW5nZSlcblxuICAgIGlmIHNhbWVOYW1lIGFuZCBzYW1lVmFsdWVcbiAgICAgIGlmIHNhbWVSYW5nZVxuICAgICAgICAnaWRlbnRpY2FsJ1xuICAgICAgZWxzZVxuICAgICAgICAnbW92ZSdcbiAgICBlbHNlIGlmIHNhbWVOYW1lXG4gICAgICBpZiBzYW1lUmFuZ2Ugb3Igc2FtZUxpbmVcbiAgICAgICAgJ3VwZGF0ZSdcbiAgICAgIGVsc2VcbiAgICAgICAgJ2RpZmZlcmVudCdcblxuICBidWlsZERlcGVuZGVuY3lHcmFwaDogKHZhcmlhYmxlKSAtPlxuICAgIGRlcGVuZGVuY2llcyA9IEBnZXRWYXJpYWJsZURlcGVuZGVuY2llcyh2YXJpYWJsZSlcbiAgICBmb3IgZGVwZW5kZW5jeSBpbiBkZXBlbmRlbmNpZXNcbiAgICAgIGEgPSBAZGVwZW5kZW5jeUdyYXBoW2RlcGVuZGVuY3ldID89IFtdXG4gICAgICBhLnB1c2godmFyaWFibGUubmFtZSkgdW5sZXNzIHZhcmlhYmxlLm5hbWUgaW4gYVxuXG4gIGdldFZhcmlhYmxlRGVwZW5kZW5jaWVzOiAodmFyaWFibGUpIC0+XG4gICAgZGVwZW5kZW5jaWVzID0gW11cbiAgICBkZXBlbmRlbmNpZXMucHVzaCh2YXJpYWJsZS52YWx1ZSkgaWYgdmFyaWFibGUudmFsdWUgaW4gQHZhcmlhYmxlTmFtZXNcblxuICAgIGlmIHZhcmlhYmxlLmNvbG9yPy52YXJpYWJsZXM/Lmxlbmd0aCA+IDBcbiAgICAgIHZhcmlhYmxlcyA9IHZhcmlhYmxlLmNvbG9yLnZhcmlhYmxlc1xuXG4gICAgICBmb3IgdiBpbiB2YXJpYWJsZXNcbiAgICAgICAgZGVwZW5kZW5jaWVzLnB1c2godikgdW5sZXNzIHYgaW4gZGVwZW5kZW5jaWVzXG5cbiAgICBkZXBlbmRlbmNpZXNcblxuICBjb2xsZWN0VmFyaWFibGVzQnlOYW1lOiAobmFtZXMpIC0+XG4gICAgdmFyaWFibGVzID0gW11cbiAgICB2YXJpYWJsZXMucHVzaCB2IGZvciB2IGluIEB2YXJpYWJsZXMgd2hlbiB2Lm5hbWUgaW4gbmFtZXNcbiAgICB2YXJpYWJsZXNcblxuICByZW1vdmVEZXBlbmRlbmNpZXM6IChmcm9tLCB0bykgLT5cbiAgICBmb3IgdiBpbiB0b1xuICAgICAgaWYgZGVwZW5kZW5jaWVzID0gQGRlcGVuZGVuY3lHcmFwaFt2XVxuICAgICAgICBkZXBlbmRlbmNpZXMuc3BsaWNlKGRlcGVuZGVuY2llcy5pbmRleE9mKGZyb20pLCAxKVxuXG4gICAgICAgIGRlbGV0ZSBAZGVwZW5kZW5jeUdyYXBoW3ZdIGlmIGRlcGVuZGVuY2llcy5sZW5ndGggaXMgMFxuXG4gIGFkZERlcGVuZGVuY2llczogKGZyb20sIHRvKSAtPlxuICAgIGZvciB2IGluIHRvXG4gICAgICBAZGVwZW5kZW5jeUdyYXBoW3ZdID89IFtdXG4gICAgICBAZGVwZW5kZW5jeUdyYXBoW3ZdLnB1c2goZnJvbSlcblxuICB1cGRhdGVEZXBlbmRlbmNpZXM6ICh7Y3JlYXRlZCwgdXBkYXRlZCwgZGVzdHJveWVkfSkgLT5cbiAgICBAdXBkYXRlQ29sb3JWYXJpYWJsZXNFeHByZXNzaW9uKClcblxuICAgIHZhcmlhYmxlcyA9IFtdXG4gICAgZGlydHlWYXJpYWJsZU5hbWVzID0gW11cblxuICAgIGlmIGNyZWF0ZWQ/XG4gICAgICB2YXJpYWJsZXMgPSB2YXJpYWJsZXMuY29uY2F0KGNyZWF0ZWQpXG4gICAgICBjcmVhdGVkVmFyaWFibGVOYW1lcyA9IGNyZWF0ZWQubWFwICh2KSAtPiB2Lm5hbWVcbiAgICBlbHNlXG4gICAgICBjcmVhdGVkVmFyaWFibGVOYW1lcyA9IFtdXG5cbiAgICB2YXJpYWJsZXMgPSB2YXJpYWJsZXMuY29uY2F0KHVwZGF0ZWQpIGlmIHVwZGF0ZWQ/XG4gICAgdmFyaWFibGVzID0gdmFyaWFibGVzLmNvbmNhdChkZXN0cm95ZWQpIGlmIGRlc3Ryb3llZD9cbiAgICB2YXJpYWJsZXMgPSB2YXJpYWJsZXMuZmlsdGVyICh2KSAtPiB2P1xuXG4gICAgZm9yIHZhcmlhYmxlIGluIHZhcmlhYmxlc1xuICAgICAgaWYgZGVwZW5kZW5jaWVzID0gQGRlcGVuZGVuY3lHcmFwaFt2YXJpYWJsZS5uYW1lXVxuICAgICAgICBmb3IgbmFtZSBpbiBkZXBlbmRlbmNpZXNcbiAgICAgICAgICBpZiBuYW1lIG5vdCBpbiBkaXJ0eVZhcmlhYmxlTmFtZXMgYW5kIG5hbWUgbm90IGluIGNyZWF0ZWRWYXJpYWJsZU5hbWVzXG4gICAgICAgICAgICBkaXJ0eVZhcmlhYmxlTmFtZXMucHVzaChuYW1lKVxuXG4gICAgZGlydHlWYXJpYWJsZXMgPSBAY29sbGVjdFZhcmlhYmxlc0J5TmFtZShkaXJ0eVZhcmlhYmxlTmFtZXMpXG5cbiAgICBmb3IgdmFyaWFibGUgaW4gZGlydHlWYXJpYWJsZXNcbiAgICAgIGlmIEBldmFsdWF0ZVZhcmlhYmxlQ29sb3IodmFyaWFibGUsIHZhcmlhYmxlLmlzQ29sb3IpXG4gICAgICAgIHVwZGF0ZWQgPz0gW11cbiAgICAgICAgdXBkYXRlZC5wdXNoKHZhcmlhYmxlKVxuXG4gICAge2NyZWF0ZWQsIGRlc3Ryb3llZCwgdXBkYXRlZH1cblxuICBlbWl0Q2hhbmdlRXZlbnQ6ICh7Y3JlYXRlZCwgZGVzdHJveWVkLCB1cGRhdGVkfSkgLT5cbiAgICBpZiBjcmVhdGVkPy5sZW5ndGggb3IgZGVzdHJveWVkPy5sZW5ndGggb3IgdXBkYXRlZD8ubGVuZ3RoXG4gICAgICBAdXBkYXRlQ29sb3JWYXJpYWJsZXNFeHByZXNzaW9uKClcbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1jaGFuZ2UnLCB7Y3JlYXRlZCwgZGVzdHJveWVkLCB1cGRhdGVkfVxuXG4gIHVwZGF0ZUNvbG9yVmFyaWFibGVzRXhwcmVzc2lvbjogLT5cbiAgICByZWdpc3RyeSA/PSByZXF1aXJlICcuL2NvbG9yLWV4cHJlc3Npb25zJ1xuXG4gICAgY29sb3JWYXJpYWJsZXMgPSBAZ2V0Q29sb3JWYXJpYWJsZXMoKVxuICAgIGlmIGNvbG9yVmFyaWFibGVzLmxlbmd0aCA+IDBcbiAgICAgIENvbG9yRXhwcmVzc2lvbiA/PSByZXF1aXJlICcuL2NvbG9yLWV4cHJlc3Npb24nXG5cbiAgICAgIHJlZ2lzdHJ5LmFkZEV4cHJlc3Npb24oQ29sb3JFeHByZXNzaW9uLmNvbG9yRXhwcmVzc2lvbkZvckNvbG9yVmFyaWFibGVzKGNvbG9yVmFyaWFibGVzKSlcbiAgICBlbHNlXG4gICAgICByZWdpc3RyeS5yZW1vdmVFeHByZXNzaW9uKCdwaWdtZW50czp2YXJpYWJsZXMnKVxuXG4gIGRpZmZBcnJheXM6IChhLGIpIC0+XG4gICAgcmVtb3ZlZCA9IFtdXG4gICAgYWRkZWQgPSBbXVxuXG4gICAgcmVtb3ZlZC5wdXNoKHYpIGZvciB2IGluIGEgd2hlbiB2IG5vdCBpbiBiXG4gICAgYWRkZWQucHVzaCh2KSBmb3IgdiBpbiBiIHdoZW4gdiBub3QgaW4gYVxuXG4gICAge3JlbW92ZWQsIGFkZGVkfVxuXG4gIHNlcmlhbGl6ZTogLT5cbiAgICB7XG4gICAgICBkZXNlcmlhbGl6ZXI6ICdWYXJpYWJsZXNDb2xsZWN0aW9uJ1xuICAgICAgY29udGVudDogQHZhcmlhYmxlcy5tYXAgKHYpIC0+XG4gICAgICAgIHJlcyA9IHtcbiAgICAgICAgICBuYW1lOiB2Lm5hbWVcbiAgICAgICAgICB2YWx1ZTogdi52YWx1ZVxuICAgICAgICAgIHBhdGg6IHYucGF0aFxuICAgICAgICAgIHJhbmdlOiB2LnJhbmdlXG4gICAgICAgICAgbGluZTogdi5saW5lXG4gICAgICAgIH1cblxuICAgICAgICByZXMuaXNBbHRlcm5hdGUgPSB0cnVlIGlmIHYuaXNBbHRlcm5hdGVcbiAgICAgICAgcmVzLm5vTmFtZVByZWZpeCA9IHRydWUgaWYgdi5ub05hbWVQcmVmaXhcbiAgICAgICAgcmVzLmRlZmF1bHQgPSB0cnVlIGlmIHYuZGVmYXVsdFxuXG4gICAgICAgIGlmIHYuaXNDb2xvclxuICAgICAgICAgIHJlcy5pc0NvbG9yID0gdHJ1ZVxuICAgICAgICAgIHJlcy5jb2xvciA9IHYuY29sb3Iuc2VyaWFsaXplKClcbiAgICAgICAgICByZXMudmFyaWFibGVzID0gdi5jb2xvci52YXJpYWJsZXMgaWYgdi5jb2xvci52YXJpYWJsZXM/XG5cbiAgICAgICAgcmVzXG4gICAgfVxuIl19
