(function() {
  var Emitter, ExpressionsRegistry, ref, vm,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = [], Emitter = ref[0], vm = ref[1];

  module.exports = ExpressionsRegistry = (function() {
    ExpressionsRegistry.deserialize = function(serializedData, expressionsType) {
      var data, handle, name, ref1, registry;
      if (vm == null) {
        vm = require('vm');
      }
      registry = new ExpressionsRegistry(expressionsType);
      ref1 = serializedData.expressions;
      for (name in ref1) {
        data = ref1[name];
        handle = vm.runInNewContext(data.handle.replace('function', "handle = function"), {
          console: console,
          require: require
        });
        registry.createExpression(name, data.regexpString, data.priority, data.scopes, handle);
      }
      registry.regexpStrings['none'] = serializedData.regexpString;
      return registry;
    };

    function ExpressionsRegistry(expressionsType1) {
      this.expressionsType = expressionsType1;
      if (Emitter == null) {
        Emitter = require('event-kit').Emitter;
      }
      this.colorExpressions = {};
      this.emitter = new Emitter;
      this.regexpStrings = {};
    }

    ExpressionsRegistry.prototype.dispose = function() {
      return this.emitter.dispose();
    };

    ExpressionsRegistry.prototype.onDidAddExpression = function(callback) {
      return this.emitter.on('did-add-expression', callback);
    };

    ExpressionsRegistry.prototype.onDidRemoveExpression = function(callback) {
      return this.emitter.on('did-remove-expression', callback);
    };

    ExpressionsRegistry.prototype.onDidUpdateExpressions = function(callback) {
      return this.emitter.on('did-update-expressions', callback);
    };

    ExpressionsRegistry.prototype.getExpressions = function() {
      var e, k;
      return ((function() {
        var ref1, results;
        ref1 = this.colorExpressions;
        results = [];
        for (k in ref1) {
          e = ref1[k];
          results.push(e);
        }
        return results;
      }).call(this)).sort(function(a, b) {
        return b.priority - a.priority;
      });
    };

    ExpressionsRegistry.prototype.getExpressionsForScope = function(scope) {
      var expressions, matchScope;
      expressions = this.getExpressions();
      if (scope === '*') {
        return expressions;
      }
      matchScope = function(a) {
        return function(b) {
          var aa, ab, ba, bb, ref1, ref2;
          ref1 = a.split(':'), aa = ref1[0], ab = ref1[1];
          ref2 = b.split(':'), ba = ref2[0], bb = ref2[1];
          return aa === ba && ((ab == null) || (bb == null) || ab === bb);
        };
      };
      return expressions.filter(function(e) {
        return indexOf.call(e.scopes, '*') >= 0 || e.scopes.some(matchScope(scope));
      });
    };

    ExpressionsRegistry.prototype.getExpression = function(name) {
      return this.colorExpressions[name];
    };

    ExpressionsRegistry.prototype.getRegExp = function() {
      var base;
      return (base = this.regexpStrings)['none'] != null ? base['none'] : base['none'] = this.getExpressions().map(function(e) {
        return "(" + e.regexpString + ")";
      }).join('|');
    };

    ExpressionsRegistry.prototype.getRegExpForScope = function(scope) {
      var base;
      return (base = this.regexpStrings)[scope] != null ? base[scope] : base[scope] = this.getExpressionsForScope(scope).map(function(e) {
        return "(" + e.regexpString + ")";
      }).join('|');
    };

    ExpressionsRegistry.prototype.createExpression = function(name, regexpString, priority, scopes, handle) {
      var newExpression;
      if (priority == null) {
        priority = 0;
      }
      if (scopes == null) {
        scopes = ['*'];
      }
      if (typeof priority === 'function') {
        handle = priority;
        scopes = ['*'];
        priority = 0;
      } else if (typeof priority === 'object') {
        if (typeof scopes === 'function') {
          handle = scopes;
        }
        scopes = priority;
        priority = 0;
      }
      if (!(scopes.length === 1 && scopes[0] === '*')) {
        scopes.push('pigments');
      }
      newExpression = new this.expressionsType({
        name: name,
        regexpString: regexpString,
        scopes: scopes,
        priority: priority,
        handle: handle
      });
      return this.addExpression(newExpression);
    };

    ExpressionsRegistry.prototype.addExpression = function(expression, batch) {
      if (batch == null) {
        batch = false;
      }
      this.regexpStrings = {};
      this.colorExpressions[expression.name] = expression;
      if (!batch) {
        this.emitter.emit('did-add-expression', {
          name: expression.name,
          registry: this
        });
        this.emitter.emit('did-update-expressions', {
          name: expression.name,
          registry: this
        });
      }
      return expression;
    };

    ExpressionsRegistry.prototype.createExpressions = function(expressions) {
      return this.addExpressions(expressions.map((function(_this) {
        return function(e) {
          var expression, handle, name, priority, regexpString, scopes;
          name = e.name, regexpString = e.regexpString, handle = e.handle, priority = e.priority, scopes = e.scopes;
          if (priority == null) {
            priority = 0;
          }
          expression = new _this.expressionsType({
            name: name,
            regexpString: regexpString,
            scopes: scopes,
            handle: handle
          });
          expression.priority = priority;
          return expression;
        };
      })(this)));
    };

    ExpressionsRegistry.prototype.addExpressions = function(expressions) {
      var expression, i, len;
      for (i = 0, len = expressions.length; i < len; i++) {
        expression = expressions[i];
        this.addExpression(expression, true);
        this.emitter.emit('did-add-expression', {
          name: expression.name,
          registry: this
        });
      }
      return this.emitter.emit('did-update-expressions', {
        registry: this
      });
    };

    ExpressionsRegistry.prototype.removeExpression = function(name) {
      delete this.colorExpressions[name];
      this.regexpStrings = {};
      this.emitter.emit('did-remove-expression', {
        name: name,
        registry: this
      });
      return this.emitter.emit('did-update-expressions', {
        name: name,
        registry: this
      });
    };

    ExpressionsRegistry.prototype.serialize = function() {
      var expression, key, out, ref1, ref2;
      out = {
        regexpString: this.getRegExp(),
        expressions: {}
      };
      ref1 = this.colorExpressions;
      for (key in ref1) {
        expression = ref1[key];
        out.expressions[key] = {
          name: expression.name,
          regexpString: expression.regexpString,
          priority: expression.priority,
          scopes: expression.scopes,
          handle: (ref2 = expression.handle) != null ? ref2.toString() : void 0
        };
      }
      return out;
    };

    return ExpressionsRegistry;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2V4cHJlc3Npb25zLXJlZ2lzdHJ5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEscUNBQUE7SUFBQTs7RUFBQSxNQUFnQixFQUFoQixFQUFDLGdCQUFELEVBQVU7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNKLG1CQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsY0FBRCxFQUFpQixlQUFqQjtBQUNaLFVBQUE7O1FBQUEsS0FBTSxPQUFBLENBQVEsSUFBUjs7TUFFTixRQUFBLEdBQWUsSUFBQSxtQkFBQSxDQUFvQixlQUFwQjtBQUVmO0FBQUEsV0FBQSxZQUFBOztRQUNFLE1BQUEsR0FBUyxFQUFFLENBQUMsZUFBSCxDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsVUFBcEIsRUFBZ0MsbUJBQWhDLENBQW5CLEVBQXlFO1VBQUMsU0FBQSxPQUFEO1VBQVUsU0FBQSxPQUFWO1NBQXpFO1FBQ1QsUUFBUSxDQUFDLGdCQUFULENBQTBCLElBQTFCLEVBQWdDLElBQUksQ0FBQyxZQUFyQyxFQUFtRCxJQUFJLENBQUMsUUFBeEQsRUFBa0UsSUFBSSxDQUFDLE1BQXZFLEVBQStFLE1BQS9FO0FBRkY7TUFJQSxRQUFRLENBQUMsYUFBYyxDQUFBLE1BQUEsQ0FBdkIsR0FBaUMsY0FBYyxDQUFDO2FBRWhEO0lBWFk7O0lBY0QsNkJBQUMsZ0JBQUQ7TUFBQyxJQUFDLENBQUEsa0JBQUQ7O1FBQ1osVUFBVyxPQUFBLENBQVEsV0FBUixDQUFvQixDQUFDOztNQUVoQyxJQUFDLENBQUEsZ0JBQUQsR0FBb0I7TUFDcEIsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLGFBQUQsR0FBaUI7SUFMTjs7a0NBT2IsT0FBQSxHQUFTLFNB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QWhCLEdBQ0U7VUFBQSxJQUFBLEVBQU0sVUFBVSxDQUFDLElBQWpCO1VBQ0EsWUFBQSxFQUFjLFVBQVUsQ0FBQyxZQUR6QjtVQUVBLFFBQUEsRUFBVSxVQUFVLENBQUMsUUFGckI7VUFHQSxNQUFBLEVBQVEsVUFBVSxDQUFDLE1BSG5CO1VBSUEsTUFBQSwyQ0FBeUIsQ0FBRSxRQUFuQixDQUFBLFVBSlI7O0FBRko7YUFRQTtJQWJTOzs7OztBQTVHYiIsInNvdXJjZXNDb250ZW50IjpbIltFbWl0dGVyLCB2bV0gPSBbXVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBFeHByZXNzaW9uc1JlZ2lzdHJ5XG4gIEBkZXNlcmlhbGl6ZTogKHNlcmlhbGl6ZWREYXRhLCBleHByZXNzaW9uc1R5cGUpIC0+XG4gICAgdm0gPz0gcmVxdWlyZSAndm0nXG5cbiAgICByZWdpc3RyeSA9IG5ldyBFeHByZXNzaW9uc1JlZ2lzdHJ5KGV4cHJlc3Npb25zVHlwZSlcblxuICAgIGZvciBuYW1lLCBkYXRhIG9mIHNlcmlhbGl6ZWREYXRhLmV4cHJlc3Npb25zXG4gICAgICBoYW5kbGUgPSB2bS5ydW5Jbk5ld0NvbnRleHQoZGF0YS5oYW5kbGUucmVwbGFjZSgnZnVuY3Rpb24nLCBcImhhbmRsZSA9IGZ1bmN0aW9uXCIpLCB7Y29uc29sZSwgcmVxdWlyZX0pXG4gICAgICByZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uKG5hbWUsIGRhdGEucmVnZXhwU3RyaW5nLCBkYXRhLnByaW9yaXR5LCBkYXRhLnNjb3BlcywgaGFuZGxlKVxuXG4gICAgcmVnaXN0cnkucmVnZXhwU3RyaW5nc1snbm9uZSddID0gc2VyaWFsaXplZERhdGEucmVnZXhwU3RyaW5nXG5cbiAgICByZWdpc3RyeVxuXG4gICMgVGhlIHtPYmplY3R9IHdoZXJlIGNvbG9yIGV4cHJlc3Npb24gaGFuZGxlcnMgYXJlIHN0b3JlZFxuICBjb25zdHJ1Y3RvcjogKEBleHByZXNzaW9uc1R5cGUpIC0+XG4gICAgRW1pdHRlciA/PSByZXF1aXJlKCdldmVudC1raXQnKS5FbWl0dGVyXG5cbiAgICBAY29sb3JFeHByZXNzaW9ucyA9IHt9XG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlclxuICAgIEByZWdleHBTdHJpbmdzID0ge31cblxuICBkaXNwb3NlOiAtPlxuICAgIEBlbWl0dGVyLmRpc3Bvc2UoKVxuXG4gIG9uRGlkQWRkRXhwcmVzc2lvbjogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtYWRkLWV4cHJlc3Npb24nLCBjYWxsYmFja1xuXG4gIG9uRGlkUmVtb3ZlRXhwcmVzc2lvbjogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtcmVtb3ZlLWV4cHJlc3Npb24nLCBjYWxsYmFja1xuXG4gIG9uRGlkVXBkYXRlRXhwcmVzc2lvbnM6IChjYWxsYmFjaykgLT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLXVwZGF0ZS1leHByZXNzaW9ucycsIGNhbGxiYWNrXG5cbiAgZ2V0RXhwcmVzc2lvbnM6IC0+XG4gICAgKGUgZm9yIGssZSBvZiBAY29sb3JFeHByZXNzaW9ucykuc29ydCgoYSxiKSAtPiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eSlcblxuICBnZXRFeHByZXNzaW9uc0ZvclNjb3BlOiAoc2NvcGUpIC0+XG4gICAgZXhwcmVzc2lvbnMgPSBAZ2V0RXhwcmVzc2lvbnMoKVxuXG4gICAgcmV0dXJuIGV4cHJlc3Npb25zIGlmIHNjb3BlIGlzICcqJ1xuXG4gICAgbWF0Y2hTY29wZSA9IChhKSAtPiAoYikgLT5cbiAgICAgIFthYSwgYWJdID0gYS5zcGxpdCgnOicpXG4gICAgICBbYmEsIGJiXSA9IGIuc3BsaXQoJzonKVxuXG4gICAgICBhYSBpcyBiYSBhbmQgKG5vdCBhYj8gb3Igbm90IGJiPyBvciBhYiBpcyBiYilcblxuICAgIGV4cHJlc3Npb25zLmZpbHRlciAoZSkgLT5cbiAgICAgICcqJyBpbiBlLnNjb3BlcyBvciBlLnNjb3Blcy5zb21lKG1hdGNoU2NvcGUoc2NvcGUpKVxuXG4gIGdldEV4cHJlc3Npb246IChuYW1lKSAtPiBAY29sb3JFeHByZXNzaW9uc1tuYW1lXVxuXG4gIGdldFJlZ0V4cDogLT5cbiAgICBAcmVnZXhwU3RyaW5nc1snbm9uZSddID89IEBnZXRFeHByZXNzaW9ucygpLm1hcCgoZSkgLT5cbiAgICAgIFwiKCN7ZS5yZWdleHBTdHJpbmd9KVwiKS5qb2luKCd8JylcblxuICBnZXRSZWdFeHBGb3JTY29wZTogKHNjb3BlKSAtPlxuICAgIEByZWdleHBTdHJpbmdzW3Njb3BlXSA/PSBAZ2V0RXhwcmVzc2lvbnNGb3JTY29wZShzY29wZSkubWFwKChlKSAtPlxuICAgICAgXCIoI3tlLnJlZ2V4cFN0cmluZ30pXCIpLmpvaW4oJ3wnKVxuXG4gIGNyZWF0ZUV4cHJlc3Npb246IChuYW1lLCByZWdleHBTdHJpbmcsIHByaW9yaXR5PTAsIHNjb3Blcz1bJyonXSwgaGFuZGxlKSAtPlxuICAgIGlmIHR5cGVvZiBwcmlvcml0eSBpcyAnZnVuY3Rpb24nXG4gICAgICBoYW5kbGUgPSBwcmlvcml0eVxuICAgICAgc2NvcGVzID0gWycqJ11cbiAgICAgIHByaW9yaXR5ID0gMFxuICAgIGVsc2UgaWYgdHlwZW9mIHByaW9yaXR5IGlzICdvYmplY3QnXG4gICAgICBoYW5kbGUgPSBzY29wZXMgaWYgdHlwZW9mIHNjb3BlcyBpcyAnZnVuY3Rpb24nXG4gICAgICBzY29wZXMgPSBwcmlvcml0eVxuICAgICAgcHJpb3JpdHkgPSAwXG5cbiAgICBzY29wZXMucHVzaCgncGlnbWVudHMnKSB1bmxlc3Mgc2NvcGVzLmxlbmd0aCBpcyAxIGFuZCBzY29wZXNbMF0gaXMgJyonXG5cbiAgICBuZXdFeHByZXNzaW9uID0gbmV3IEBleHByZXNzaW9uc1R5cGUoe25hbWUsIHJlZ2V4cFN0cmluZywgc2NvcGVzLCBwcmlvcml0eSwgaGFuZGxlfSlcbiAgICBAYWRkRXhwcmVzc2lvbiBuZXdFeHByZXNzaW9uXG5cbiAgYWRkRXhwcmVzc2lvbjogKGV4cHJlc3Npb24sIGJhdGNoPWZhbHNlKSAtPlxuICAgIEByZWdleHBTdHJpbmdzID0ge31cbiAgICBAY29sb3JFeHByZXNzaW9uc1tleHByZXNzaW9uLm5hbWVdID0gZXhwcmVzc2lvblxuXG4gICAgdW5sZXNzIGJhdGNoXG4gICAgICBAZW1pdHRlci5lbWl0ICdkaWQtYWRkLWV4cHJlc3Npb24nLCB7bmFtZTogZXhwcmVzc2lvbi5uYW1lLCByZWdpc3RyeTogdGhpc31cbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC11cGRhdGUtZXhwcmVzc2lvbnMnLCB7bmFtZTogZXhwcmVzc2lvbi5uYW1lLCByZWdpc3RyeTogdGhpc31cbiAgICBleHByZXNzaW9uXG5cbiAgY3JlYXRlRXhwcmVzc2lvbnM6IChleHByZXNzaW9ucykgLT5cbiAgICBAYWRkRXhwcmVzc2lvbnMgZXhwcmVzc2lvbnMubWFwIChlKSA9PlxuICAgICAge25hbWUsIHJlZ2V4cFN0cmluZywgaGFuZGxlLCBwcmlvcml0eSwgc2NvcGVzfSA9IGVcbiAgICAgIHByaW9yaXR5ID89IDBcbiAgICAgIGV4cHJlc3Npb24gPSBuZXcgQGV4cHJlc3Npb25zVHlwZSh7bmFtZSwgcmVnZXhwU3RyaW5nLCBzY29wZXMsIGhhbmRsZX0pXG4gICAgICBleHByZXNzaW9uLnByaW9yaXR5ID0gcHJpb3JpdHlcbiAgICAgIGV4cHJlc3Npb25cblxuICBhZGRFeHByZXNzaW9uczogKGV4cHJlc3Npb25zKSAtPlxuICAgIGZvciBleHByZXNzaW9uIGluIGV4cHJlc3Npb25zXG4gICAgICBAYWRkRXhwcmVzc2lvbihleHByZXNzaW9uLCB0cnVlKVxuICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWFkZC1leHByZXNzaW9uJywge25hbWU6IGV4cHJlc3Npb24ubmFtZSwgcmVnaXN0cnk6IHRoaXN9XG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXVwZGF0ZS1leHByZXNzaW9ucycsIHtyZWdpc3RyeTogdGhpc31cblxuICByZW1vdmVFeHByZXNzaW9uOiAobmFtZSkgLT5cbiAgICBkZWxldGUgQGNvbG9yRXhwcmVzc2lvbnNbbmFtZV1cbiAgICBAcmVnZXhwU3RyaW5ncyA9IHt9XG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXJlbW92ZS1leHByZXNzaW9uJywge25hbWUsIHJlZ2lzdHJ5OiB0aGlzfVxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC11cGRhdGUtZXhwcmVzc2lvbnMnLCB7bmFtZSwgcmVnaXN0cnk6IHRoaXN9XG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIG91dCA9XG4gICAgICByZWdleHBTdHJpbmc6IEBnZXRSZWdFeHAoKVxuICAgICAgZXhwcmVzc2lvbnM6IHt9XG5cbiAgICBmb3Iga2V5LCBleHByZXNzaW9uIG9mIEBjb2xvckV4cHJlc3Npb25zXG4gICAgICBvdXQuZXhwcmVzc2lvbnNba2V5XSA9XG4gICAgICAgIG5hbWU6IGV4cHJlc3Npb24ubmFtZVxuICAgICAgICByZWdleHBTdHJpbmc6IGV4cHJlc3Npb24ucmVnZXhwU3RyaW5nXG4gICAgICAgIHByaW9yaXR5OiBleHByZXNzaW9uLnByaW9yaXR5XG4gICAgICAgIHNjb3BlczogZXhwcmVzc2lvbi5zY29wZXNcbiAgICAgICAgaGFuZGxlOiBleHByZXNzaW9uLmhhbmRsZT8udG9TdHJpbmcoKVxuXG4gICAgb3V0XG4iXX0=
