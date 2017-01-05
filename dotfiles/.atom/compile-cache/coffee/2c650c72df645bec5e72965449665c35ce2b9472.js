(function() {
  var BlendModes, Color, ColorContext, ColorExpression, ColorParser, SVGColors, clamp, clampInt, comma, float, floatOrPercent, hexadecimal, int, intOrPercent, namePrefixes, notQuote, optionalPercent, pe, percent, ps, ref, scopeFromFileName, split, variables,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = [], Color = ref[0], ColorParser = ref[1], ColorExpression = ref[2], SVGColors = ref[3], BlendModes = ref[4], int = ref[5], float = ref[6], percent = ref[7], optionalPercent = ref[8], intOrPercent = ref[9], floatOrPercent = ref[10], comma = ref[11], notQuote = ref[12], hexadecimal = ref[13], ps = ref[14], pe = ref[15], variables = ref[16], namePrefixes = ref[17], split = ref[18], clamp = ref[19], clampInt = ref[20], scopeFromFileName = ref[21];

  module.exports = ColorContext = (function() {
    function ColorContext(options) {
      var colorVariables, expr, i, j, len, len1, ref1, ref2, ref3, sorted, v;
      if (options == null) {
        options = {};
      }
      this.sortPaths = bind(this.sortPaths, this);
      if (Color == null) {
        Color = require('./color');
        SVGColors = require('./svg-colors');
        BlendModes = require('./blend-modes');
        if (ColorExpression == null) {
          ColorExpression = require('./color-expression');
        }
        ref1 = require('./regexes'), int = ref1.int, float = ref1.float, percent = ref1.percent, optionalPercent = ref1.optionalPercent, intOrPercent = ref1.intOrPercent, floatOrPercent = ref1.floatOrPercent, comma = ref1.comma, notQuote = ref1.notQuote, hexadecimal = ref1.hexadecimal, ps = ref1.ps, pe = ref1.pe, variables = ref1.variables, namePrefixes = ref1.namePrefixes;
        ColorContext.prototype.SVGColors = SVGColors;
        ColorContext.prototype.Color = Color;
        ColorContext.prototype.BlendModes = BlendModes;
        ColorContext.prototype.int = int;
        ColorContext.prototype.float = float;
        ColorContext.prototype.percent = percent;
        ColorContext.prototype.optionalPercent = optionalPercent;
        ColorContext.prototype.intOrPercent = intOrPercent;
        ColorContext.prototype.floatOrPercent = floatOrPercent;
        ColorContext.prototype.comma = comma;
        ColorContext.prototype.notQuote = notQuote;
        ColorContext.prototype.hexadecimal = hexadecimal;
        ColorContext.prototype.ps = ps;
        ColorContext.prototype.pe = pe;
        ColorContext.prototype.variablesRE = variables;
        ColorContext.prototype.namePrefixes = namePrefixes;
      }
      variables = options.variables, colorVariables = options.colorVariables, this.referenceVariable = options.referenceVariable, this.referencePath = options.referencePath, this.rootPaths = options.rootPaths, this.parser = options.parser, this.colorVars = options.colorVars, this.vars = options.vars, this.defaultVars = options.defaultVars, this.defaultColorVars = options.defaultColorVars, sorted = options.sorted, this.registry = options.registry, this.sassScopeSuffix = options.sassScopeSuffix;
      if (variables == null) {
        variables = [];
      }
      if (colorVariables == null) {
        colorVariables = [];
      }
      if (this.rootPaths == null) {
        this.rootPaths = [];
      }
      if (this.referenceVariable != null) {
        if (this.referencePath == null) {
          this.referencePath = this.referenceVariable.path;
        }
      }
      if (this.sorted) {
        this.variables = variables;
        this.colorVariables = colorVariables;
      } else {
        this.variables = variables.slice().sort(this.sortPaths);
        this.colorVariables = colorVariables.slice().sort(this.sortPaths);
      }
      if (this.vars == null) {
        this.vars = {};
        this.colorVars = {};
        this.defaultVars = {};
        this.defaultColorVars = {};
        ref2 = this.variables;
        for (i = 0, len = ref2.length; i < len; i++) {
          v = ref2[i];
          if (!v["default"]) {
            this.vars[v.name] = v;
          }
          if (v["default"]) {
            this.defaultVars[v.name] = v;
          }
        }
        ref3 = this.colorVariables;
        for (j = 0, len1 = ref3.length; j < len1; j++) {
          v = ref3[j];
          if (!v["default"]) {
            this.colorVars[v.name] = v;
          }
          if (v["default"]) {
            this.defaultColorVars[v.name] = v;
          }
        }
      }
      if ((this.registry.getExpression('pigments:variables') == null) && this.colorVariables.length > 0) {
        expr = ColorExpression.colorExpressionForColorVariables(this.colorVariables);
        this.registry.addExpression(expr);
      }
      if (this.parser == null) {
        if (ColorParser == null) {
          ColorParser = require('./color-parser');
        }
        this.parser = new ColorParser(this.registry, this);
      }
      this.usedVariables = [];
      this.resolvedVariables = [];
    }

    ColorContext.prototype.sortPaths = function(a, b) {
      var rootA, rootB, rootReference;
      if (this.referencePath != null) {
        if (a.path === b.path) {
          return 0;
        }
        if (a.path === this.referencePath) {
          return 1;
        }
        if (b.path === this.referencePath) {
          return -1;
        }
        rootReference = this.rootPathForPath(this.referencePath);
        rootA = this.rootPathForPath(a.path);
        rootB = this.rootPathForPath(b.path);
        if (rootA === rootB) {
          return 0;
        }
        if (rootA === rootReference) {
          return 1;
        }
        if (rootB === rootReference) {
          return -1;
        }
        return 0;
      } else {
        return 0;
      }
    };

    ColorContext.prototype.rootPathForPath = function(path) {
      var i, len, ref1, root;
      ref1 = this.rootPaths;
      for (i = 0, len = ref1.length; i < len; i++) {
        root = ref1[i];
        if (path.indexOf(root + "/") === 0) {
          return root;
        }
      }
    };

    ColorContext.prototype.clone = function() {
      return new ColorContext({
        variables: this.variables,
        colorVariables: this.colorVariables,
        referenceVariable: this.referenceVariable,
        parser: this.parser,
        vars: this.vars,
        colorVars: this.colorVars,
        defaultVars: this.defaultVars,
        defaultColorVars: this.defaultColorVars,
        sorted: true
      });
    };

    ColorContext.prototype.containsVariable = function(variableName) {
      return indexOf.call(this.getVariablesNames(), variableName) >= 0;
    };

    ColorContext.prototype.hasColorVariables = function() {
      return this.colorVariables.length > 0;
    };

    ColorContext.prototype.getVariables = function() {
      return this.variables;
    };

    ColorContext.prototype.getColorVariables = function() {
      return this.colorVariables;
    };

    ColorContext.prototype.getVariablesNames = function() {
      return this.varNames != null ? this.varNames : this.varNames = Object.keys(this.vars);
    };

    ColorContext.prototype.getVariablesCount = function() {
      return this.varCount != null ? this.varCount : this.varCount = this.getVariablesNames().length;
    };

    ColorContext.prototype.readUsedVariables = function() {
      var i, len, ref1, usedVariables, v;
      usedVariables = [];
      ref1 = this.usedVariables;
      for (i = 0, len = ref1.length; i < len; i++) {
        v = ref1[i];
        if (indexOf.call(usedVariables, v) < 0) {
          usedVariables.push(v);
        }
      }
      this.usedVariables = [];
      this.resolvedVariables = [];
      return usedVariables;
    };

    ColorContext.prototype.getValue = function(value) {
      var lastRealValue, lookedUpValues, realValue, ref1, ref2;
      ref1 = [], realValue = ref1[0], lastRealValue = ref1[1];
      lookedUpValues = [value];
      while ((realValue = (ref2 = this.vars[value]) != null ? ref2.value : void 0) && indexOf.call(lookedUpValues, realValue) < 0) {
        this.usedVariables.push(value);
        value = lastRealValue = realValue;
        lookedUpValues.push(realValue);
      }
      if (indexOf.call(lookedUpValues, realValue) >= 0) {
        return void 0;
      } else {
        return lastRealValue;
      }
    };

    ColorContext.prototype.readColorExpression = function(value) {
      if (this.colorVars[value] != null) {
        this.usedVariables.push(value);
        return this.colorVars[value].value;
      } else if (this.defaultColorVars[value] != null) {
        this.usedVariables.push(value);
        return this.defaultColorVars[value].value;
      } else {
        return value;
      }
    };

    ColorContext.prototype.readColor = function(value, keepAllVariables) {
      var realValue, ref1, result, scope;
      if (keepAllVariables == null) {
        keepAllVariables = false;
      }
      if (indexOf.call(this.usedVariables, value) >= 0 && !(indexOf.call(this.resolvedVariables, value) >= 0)) {
        return;
      }
      realValue = this.readColorExpression(value);
      if ((realValue == null) || indexOf.call(this.usedVariables, realValue) >= 0) {
        return;
      }
      scope = this.colorVars[value] != null ? this.scopeFromFileName(this.colorVars[value].path) : '*';
      this.usedVariables = this.usedVariables.filter(function(v) {
        return v !== realValue;
      });
      result = this.parser.parse(realValue, scope, false);
      if (result != null) {
        if (result.invalid && (this.defaultColorVars[realValue] != null)) {
          result = this.readColor(this.defaultColorVars[realValue].value);
          value = realValue;
        }
      } else if (this.defaultColorVars[value] != null) {
        this.usedVariables.push(value);
        result = this.readColor(this.defaultColorVars[value].value);
      } else {
        if (this.vars[value] != null) {
          this.usedVariables.push(value);
        }
      }
      if (result != null) {
        this.resolvedVariables.push(value);
        if (keepAllVariables || indexOf.call(this.usedVariables, value) < 0) {
          result.variables = ((ref1 = result.variables) != null ? ref1 : []).concat(this.readUsedVariables());
        }
      }
      return result;
    };

    ColorContext.prototype.scopeFromFileName = function(path) {
      var scope;
      if (scopeFromFileName == null) {
        scopeFromFileName = require('./scope-from-file-name');
      }
      scope = scopeFromFileName(path);
      if (scope === 'sass' || scope === 'scss') {
        scope = [scope, this.sassScopeSuffix].join(':');
      }
      return scope;
    };

    ColorContext.prototype.readFloat = function(value) {
      var res;
      res = parseFloat(value);
      if (isNaN(res) && (this.vars[value] != null)) {
        this.usedVariables.push(value);
        res = this.readFloat(this.vars[value].value);
      }
      if (isNaN(res) && (this.defaultVars[value] != null)) {
        this.usedVariables.push(value);
        res = this.readFloat(this.defaultVars[value].value);
      }
      return res;
    };

    ColorContext.prototype.readInt = function(value, base) {
      var res;
      if (base == null) {
        base = 10;
      }
      res = parseInt(value, base);
      if (isNaN(res) && (this.vars[value] != null)) {
        this.usedVariables.push(value);
        res = this.readInt(this.vars[value].value);
      }
      if (isNaN(res) && (this.defaultVars[value] != null)) {
        this.usedVariables.push(value);
        res = this.readInt(this.defaultVars[value].value);
      }
      return res;
    };

    ColorContext.prototype.readPercent = function(value) {
      if (!/\d+/.test(value) && (this.vars[value] != null)) {
        this.usedVariables.push(value);
        value = this.readPercent(this.vars[value].value);
      }
      if (!/\d+/.test(value) && (this.defaultVars[value] != null)) {
        this.usedVariables.push(value);
        value = this.readPercent(this.defaultVars[value].value);
      }
      return Math.round(parseFloat(value) * 2.55);
    };

    ColorContext.prototype.readIntOrPercent = function(value) {
      var res;
      if (!/\d+/.test(value) && (this.vars[value] != null)) {
        this.usedVariables.push(value);
        value = this.readIntOrPercent(this.vars[value].value);
      }
      if (!/\d+/.test(value) && (this.defaultVars[value] != null)) {
        this.usedVariables.push(value);
        value = this.readIntOrPercent(this.defaultVars[value].value);
      }
      if (value == null) {
        return 0/0;
      }
      if (typeof value === 'number') {
        return value;
      }
      if (value.indexOf('%') !== -1) {
        res = Math.round(parseFloat(value) * 2.55);
      } else {
        res = parseInt(value);
      }
      return res;
    };

    ColorContext.prototype.readFloatOrPercent = function(value) {
      var res;
      if (!/\d+/.test(value) && (this.vars[value] != null)) {
        this.usedVariables.push(value);
        value = this.readFloatOrPercent(this.vars[value].value);
      }
      if (!/\d+/.test(value) && (this.defaultVars[value] != null)) {
        this.usedVariables.push(value);
        value = this.readFloatOrPercent(this.defaultVars[value].value);
      }
      if (value == null) {
        return 0/0;
      }
      if (typeof value === 'number') {
        return value;
      }
      if (value.indexOf('%') !== -1) {
        res = parseFloat(value) / 100;
      } else {
        res = parseFloat(value);
        if (res > 1) {
          res = res / 100;
        }
        res;
      }
      return res;
    };

    ColorContext.prototype.split = function(value) {
      var ref1;
      if (split == null) {
        ref1 = require('./utils'), split = ref1.split, clamp = ref1.clamp, clampInt = ref1.clampInt;
      }
      return split(value);
    };

    ColorContext.prototype.clamp = function(value) {
      var ref1;
      if (clamp == null) {
        ref1 = require('./utils'), split = ref1.split, clamp = ref1.clamp, clampInt = ref1.clampInt;
      }
      return clamp(value);
    };

    ColorContext.prototype.clampInt = function(value) {
      var ref1;
      if (clampInt == null) {
        ref1 = require('./utils'), split = ref1.split, clamp = ref1.clamp, clampInt = ref1.clampInt;
      }
      return clampInt(value);
    };

    ColorContext.prototype.isInvalid = function(color) {
      return !Color.isValid(color);
    };

    ColorContext.prototype.readParam = function(param, block) {
      var _, name, re, ref1, value;
      re = RegExp("\\$(\\w+):\\s*((-?" + this.float + ")|" + this.variablesRE + ")");
      if (re.test(param)) {
        ref1 = re.exec(param), _ = ref1[0], name = ref1[1], value = ref1[2];
        return block(name, value);
      }
    };

    ColorContext.prototype.contrast = function(base, dark, light, threshold) {
      var ref1;
      if (dark == null) {
        dark = new Color('black');
      }
      if (light == null) {
        light = new Color('white');
      }
      if (threshold == null) {
        threshold = 0.43;
      }
      if (dark.luma > light.luma) {
        ref1 = [dark, light], light = ref1[0], dark = ref1[1];
      }
      if (base.luma > threshold) {
        return dark;
      } else {
        return light;
      }
    };

    ColorContext.prototype.mixColors = function(color1, color2, amount, round) {
      var color, inverse;
      if (amount == null) {
        amount = 0.5;
      }
      if (round == null) {
        round = Math.floor;
      }
      if (!((color1 != null) && (color2 != null) && !isNaN(amount))) {
        return new Color(0/0, 0/0, 0/0, 0/0);
      }
      inverse = 1 - amount;
      color = new Color;
      color.rgba = [round(color1.red * amount + color2.red * inverse), round(color1.green * amount + color2.green * inverse), round(color1.blue * amount + color2.blue * inverse), color1.alpha * amount + color2.alpha * inverse];
      return color;
    };

    return ColorContext;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLWNvbnRleHQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwyUEFBQTtJQUFBOzs7RUFBQSxNQUtJLEVBTEosRUFDRSxjQURGLEVBQ1Msb0JBRFQsRUFDc0Isd0JBRHRCLEVBQ3VDLGtCQUR2QyxFQUNrRCxtQkFEbEQsRUFFRSxZQUZGLEVBRU8sY0FGUCxFQUVjLGdCQUZkLEVBRXVCLHdCQUZ2QixFQUV3QyxxQkFGeEMsRUFFc0Qsd0JBRnRELEVBRXNFLGVBRnRFLEVBR0Usa0JBSEYsRUFHWSxxQkFIWixFQUd5QixZQUh6QixFQUc2QixZQUg3QixFQUdpQyxtQkFIakMsRUFHNEMsc0JBSDVDLEVBSUUsZUFKRixFQUlTLGVBSlQsRUFJZ0Isa0JBSmhCLEVBSTBCOztFQUcxQixNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1Msc0JBQUMsT0FBRDtBQUNYLFVBQUE7O1FBRFksVUFBUTs7O01BQ3BCLElBQU8sYUFBUDtRQUNFLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUjtRQUNSLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUjtRQUNaLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUjs7VUFDYixrQkFBbUIsT0FBQSxDQUFRLG9CQUFSOztRQUVuQixPQUdJLE9BQUEsQ0FBUSxXQUFSLENBSEosRUFDRSxjQURGLEVBQ08sa0JBRFAsRUFDYyxzQkFEZCxFQUN1QixzQ0FEdkIsRUFDd0MsZ0NBRHhDLEVBQ3NELG9DQUR0RCxFQUVFLGtCQUZGLEVBRVMsd0JBRlQsRUFFbUIsOEJBRm5CLEVBRWdDLFlBRmhDLEVBRW9DLFlBRnBDLEVBRXdDLDBCQUZ4QyxFQUVtRDtRQUduRCxZQUFZLENBQUEsU0FBRSxDQUFBLFNBQWQsR0FBMEI7UUFDMUIsWUFBWSxDQUFBLFNBQUUs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RUFBWDs7TUFFQSxPQUFBLEdBQVUsQ0FBQSxHQUFJO01BQ2QsS0FBQSxHQUFRLElBQUk7TUFFWixLQUFLLENBQUMsSUFBTixHQUFhLENBQ1gsS0FBQSxDQUFNLE1BQU0sQ0FBQyxHQUFQLEdBQWEsTUFBYixHQUFzQixNQUFNLENBQUMsR0FBUCxHQUFhLE9BQXpDLENBRFcsRUFFWCxLQUFBLENBQU0sTUFBTSxDQUFDLEtBQVAsR0FBZSxNQUFmLEdBQXdCLE1BQU0sQ0FBQyxLQUFQLEdBQWUsT0FBN0MsQ0FGVyxFQUdYLEtBQUEsQ0FBTSxNQUFNLENBQUMsSUFBUCxHQUFjLE1BQWQsR0FBdUIsTUFBTSxDQUFDLElBQVAsR0FBYyxPQUEzQyxDQUhXLEVBSVgsTUFBTSxDQUFDLEtBQVAsR0FBZSxNQUFmLEdBQXdCLE1BQU0sQ0FBQyxLQUFQLEdBQWUsT0FKNUI7YUFPYjtJQWJTOzs7OztBQXJVYiIsInNvdXJjZXNDb250ZW50IjpbIltcbiAgQ29sb3IsIENvbG9yUGFyc2VyLCBDb2xvckV4cHJlc3Npb24sIFNWR0NvbG9ycywgQmxlbmRNb2RlcyxcbiAgaW50LCBmbG9hdCwgcGVyY2VudCwgb3B0aW9uYWxQZXJjZW50LCBpbnRPclBlcmNlbnQsIGZsb2F0T3JQZXJjZW50LCBjb21tYSxcbiAgbm90UXVvdGUsIGhleGFkZWNpbWFsLCBwcywgcGUsIHZhcmlhYmxlcywgbmFtZVByZWZpeGVzLFxuICBzcGxpdCwgY2xhbXAsIGNsYW1wSW50LCBzY29wZUZyb21GaWxlTmFtZVxuXSA9IFtdXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIENvbG9yQ29udGV4dFxuICBjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG4gICAgdW5sZXNzIENvbG9yP1xuICAgICAgQ29sb3IgPSByZXF1aXJlICcuL2NvbG9yJ1xuICAgICAgU1ZHQ29sb3JzID0gcmVxdWlyZSAnLi9zdmctY29sb3JzJ1xuICAgICAgQmxlbmRNb2RlcyA9IHJlcXVpcmUgJy4vYmxlbmQtbW9kZXMnXG4gICAgICBDb2xvckV4cHJlc3Npb24gPz0gcmVxdWlyZSAnLi9jb2xvci1leHByZXNzaW9uJ1xuXG4gICAgICB7XG4gICAgICAgIGludCwgZmxvYXQsIHBlcmNlbnQsIG9wdGlvbmFsUGVyY2VudCwgaW50T3JQZXJjZW50LCBmbG9hdE9yUGVyY2VudFxuICAgICAgICBjb21tYSwgbm90UXVvdGUsIGhleGFkZWNpbWFsLCBwcywgcGUsIHZhcmlhYmxlcywgbmFtZVByZWZpeGVzXG4gICAgICB9ID0gcmVxdWlyZSAnLi9yZWdleGVzJ1xuXG4gICAgICBDb2xvckNvbnRleHQ6OlNWR0NvbG9ycyA9IFNWR0NvbG9yc1xuICAgICAgQ29sb3JDb250ZXh0OjpDb2xvciA9IENvbG9yXG4gICAgICBDb2xvckNvbnRleHQ6OkJsZW5kTW9kZXMgPSBCbGVuZE1vZGVzXG4gICAgICBDb2xvckNvbnRleHQ6OmludCA9IGludFxuICAgICAgQ29sb3JDb250ZXh0OjpmbG9hdCA9IGZsb2F0XG4gICAgICBDb2xvckNvbnRleHQ6OnBlcmNlbnQgPSBwZXJjZW50XG4gICAgICBDb2xvckNvbnRleHQ6Om9wdGlvbmFsUGVyY2VudCA9IG9wdGlvbmFsUGVyY2VudFxuICAgICAgQ29sb3JDb250ZXh0OjppbnRPclBlcmNlbnQgPSBpbnRPclBlcmNlbnRcbiAgICAgIENvbG9yQ29udGV4dDo6ZmxvYXRPclBlcmNlbnQgPSBmbG9hdE9yUGVyY2VudFxuICAgICAgQ29sb3JDb250ZXh0Ojpjb21tYSA9IGNvbW1hXG4gICAgICBDb2xvckNvbnRleHQ6Om5vdFF1b3RlID0gbm90UXVvdGVcbiAgICAgIENvbG9yQ29udGV4dDo6aGV4YWRlY2ltYWwgPSBoZXhhZGVjaW1hbFxuICAgICAgQ29sb3JDb250ZXh0OjpwcyA9IHBzXG4gICAgICBDb2xvckNvbnRleHQ6OnBlID0gcGVcbiAgICAgIENvbG9yQ29udGV4dDo6dmFyaWFibGVzUkUgPSB2YXJpYWJsZXNcbiAgICAgIENvbG9yQ29udGV4dDo6bmFtZVByZWZpeGVzID0gbmFtZVByZWZpeGVzXG5cbiAgICB7dmFyaWFibGVzLCBjb2xvclZhcmlhYmxlcywgQHJlZmVyZW5jZVZhcmlhYmxlLCBAcmVmZXJlbmNlUGF0aCwgQHJvb3RQYXRocywgQHBhcnNlciwgQGNvbG9yVmFycywgQHZhcnMsIEBkZWZhdWx0VmFycywgQGRlZmF1bHRDb2xvclZhcnMsIHNvcnRlZCwgQHJlZ2lzdHJ5LCBAc2Fzc1Njb3BlU3VmZml4fSA9IG9wdGlvbnNcblxuICAgIHZhcmlhYmxlcyA/PSBbXVxuICAgIGNvbG9yVmFyaWFibGVzID89IFtdXG4gICAgQHJvb3RQYXRocyA/PSBbXVxuICAgIEByZWZlcmVuY2VQYXRoID89IEByZWZlcmVuY2VWYXJpYWJsZS5wYXRoIGlmIEByZWZlcmVuY2VWYXJpYWJsZT9cblxuICAgIGlmIEBzb3J0ZWRcbiAgICAgIEB2YXJpYWJsZXMgPSB2YXJpYWJsZXNcbiAgICAgIEBjb2xvclZhcmlhYmxlcyA9IGNvbG9yVmFyaWFibGVzXG4gICAgZWxzZVxuICAgICAgQHZhcmlhYmxlcyA9IHZhcmlhYmxlcy5zbGljZSgpLnNvcnQoQHNvcnRQYXRocylcbiAgICAgIEBjb2xvclZhcmlhYmxlcyA9IGNvbG9yVmFyaWFibGVzLnNsaWNlKCkuc29ydChAc29ydFBhdGhzKVxuXG4gICAgdW5sZXNzIEB2YXJzP1xuICAgICAgQHZhcnMgPSB7fVxuICAgICAgQGNvbG9yVmFycyA9IHt9XG4gICAgICBAZGVmYXVsdFZhcnMgPSB7fVxuICAgICAgQGRlZmF1bHRDb2xvclZhcnMgPSB7fVxuXG4gICAgICBmb3IgdiBpbiBAdmFyaWFibGVzXG4gICAgICAgIEB2YXJzW3YubmFtZV0gPSB2IHVubGVzcyB2LmRlZmF1bHRcbiAgICAgICAgQGRlZmF1bHRWYXJzW3YubmFtZV0gPSB2IGlmIHYuZGVmYXVsdFxuXG4gICAgICBmb3IgdiBpbiBAY29sb3JWYXJpYWJsZXNcbiAgICAgICAgQGNvbG9yVmFyc1t2Lm5hbWVdID0gdiB1bmxlc3Mgdi5kZWZhdWx0XG4gICAgICAgIEBkZWZhdWx0Q29sb3JWYXJzW3YubmFtZV0gPSB2IGlmIHYuZGVmYXVsdFxuXG4gICAgaWYgbm90IEByZWdpc3RyeS5nZXRFeHByZXNzaW9uKCdwaWdtZW50czp2YXJpYWJsZXMnKT8gYW5kIEBjb2xvclZhcmlhYmxlcy5sZW5ndGggPiAwXG4gICAgICBleHByID0gQ29sb3JFeHByZXNzaW9uLmNvbG9yRXhwcmVzc2lvbkZvckNvbG9yVmFyaWFibGVzKEBjb2xvclZhcmlhYmxlcylcbiAgICAgIEByZWdpc3RyeS5hZGRFeHByZXNzaW9uKGV4cHIpXG5cbiAgICB1bmxlc3MgQHBhcnNlcj9cbiAgICAgIENvbG9yUGFyc2VyID89IHJlcXVpcmUgJy4vY29sb3ItcGFyc2VyJ1xuICAgICAgQHBhcnNlciA9IG5ldyBDb2xvclBhcnNlcihAcmVnaXN0cnksIHRoaXMpXG5cbiAgICBAdXNlZFZhcmlhYmxlcyA9IFtdXG4gICAgQHJlc29sdmVkVmFyaWFibGVzID0gW11cblxuICBzb3J0UGF0aHM6IChhLGIpID0+XG4gICAgaWYgQHJlZmVyZW5jZVBhdGg/XG4gICAgICByZXR1cm4gMCBpZiBhLnBhdGggaXMgYi5wYXRoXG4gICAgICByZXR1cm4gMSBpZiBhLnBhdGggaXMgQHJlZmVyZW5jZVBhdGhcbiAgICAgIHJldHVybiAtMSBpZiBiLnBhdGggaXMgQHJlZmVyZW5jZVBhdGhcblxuICAgICAgcm9vdFJlZmVyZW5jZSA9IEByb290UGF0aEZvclBhdGgoQHJlZmVyZW5jZVBhdGgpXG4gICAgICByb290QSA9IEByb290UGF0aEZvclBhdGgoYS5wYXRoKVxuICAgICAgcm9vdEIgPSBAcm9vdFBhdGhGb3JQYXRoKGIucGF0aClcblxuICAgICAgcmV0dXJuIDAgaWYgcm9vdEEgaXMgcm9vdEJcbiAgICAgIHJldHVybiAxIGlmIHJvb3RBIGlzIHJvb3RSZWZlcmVuY2VcbiAgICAgIHJldHVybiAtMSBpZiByb290QiBpcyByb290UmVmZXJlbmNlXG5cbiAgICAgIDBcbiAgICBlbHNlXG4gICAgICAwXG5cbiAgcm9vdFBhdGhGb3JQYXRoOiAocGF0aCkgLT5cbiAgICByZXR1cm4gcm9vdCBmb3Igcm9vdCBpbiBAcm9vdFBhdGhzIHdoZW4gcGF0aC5pbmRleE9mKFwiI3tyb290fS9cIikgaXMgMFxuXG4gIGNsb25lOiAtPlxuICAgIG5ldyBDb2xvckNvbnRleHQoe1xuICAgICAgQHZhcmlhYmxlc1xuICAgICAgQGNvbG9yVmFyaWFibGVzXG4gICAgICBAcmVmZXJlbmNlVmFyaWFibGVcbiAgICAgIEBwYXJzZXJcbiAgICAgIEB2YXJzXG4gICAgICBAY29sb3JWYXJzXG4gICAgICBAZGVmYXVsdFZhcnNcbiAgICAgIEBkZWZhdWx0Q29sb3JWYXJzXG4gICAgICBzb3J0ZWQ6IHRydWVcbiAgICB9KVxuXG4gICMjICAgICMjICAgICAjIyAgICAjIyMgICAgIyMjIyMjIyMgICAjIyMjIyNcbiAgIyMgICAgIyMgICAgICMjICAgIyMgIyMgICAjIyAgICAgIyMgIyMgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICAjIyAgICMjICAjIyAgICAgIyMgIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAjIyMjIyMjIyAgICMjIyMjI1xuICAjIyAgICAgIyMgICAjIyAgIyMjIyMjIyMjICMjICAgIyMgICAgICAgICAjI1xuICAjIyAgICAgICMjICMjICAgIyMgICAgICMjICMjICAgICMjICAjIyAgICAjI1xuICAjIyAgICAgICAjIyMgICAgIyMgICAgICMjICMjICAgICAjIyAgIyMjIyMjXG5cbiAgY29udGFpbnNWYXJpYWJsZTogKHZhcmlhYmxlTmFtZSkgLT4gdmFyaWFibGVOYW1lIGluIEBnZXRWYXJpYWJsZXNOYW1lcygpXG5cbiAgaGFzQ29sb3JWYXJpYWJsZXM6IC0+IEBjb2xvclZhcmlhYmxlcy5sZW5ndGggPiAwXG5cbiAgZ2V0VmFyaWFibGVzOiAtPiBAdmFyaWFibGVzXG5cbiAgZ2V0Q29sb3JWYXJpYWJsZXM6IC0+IEBjb2xvclZhcmlhYmxlc1xuXG4gIGdldFZhcmlhYmxlc05hbWVzOiAtPiBAdmFyTmFtZXMgPz0gT2JqZWN0LmtleXMoQHZhcnMpXG5cbiAgZ2V0VmFyaWFibGVzQ291bnQ6IC0+IEB2YXJDb3VudCA/PSBAZ2V0VmFyaWFibGVzTmFtZXMoKS5sZW5ndGhcblxuICByZWFkVXNlZFZhcmlhYmxlczogLT5cbiAgICB1c2VkVmFyaWFibGVzID0gW11cbiAgICB1c2VkVmFyaWFibGVzLnB1c2ggdiBmb3IgdiBpbiBAdXNlZFZhcmlhYmxlcyB3aGVuIHYgbm90IGluIHVzZWRWYXJpYWJsZXNcbiAgICBAdXNlZFZhcmlhYmxlcyA9IFtdXG4gICAgQHJlc29sdmVkVmFyaWFibGVzID0gW11cbiAgICB1c2VkVmFyaWFibGVzXG5cbiAgIyMgICAgIyMgICAgICMjICAgICMjIyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMjIyMjIyMgICMjIyMjI1xuICAjIyAgICAjIyAgICAgIyMgICAjIyAjIyAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAjI1xuICAjIyAgICAjIyAgICAgIyMgICMjICAgIyMgICMjICAgICAgICMjICAgICAjIyAjIyAgICAgICAjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAgICMjICAgICAjIyAjIyMjIyMgICAgIyMjIyMjXG4gICMjICAgICAjIyAgICMjICAjIyMjIyMjIyMgIyMgICAgICAgIyMgICAgICMjICMjICAgICAgICAgICAgICMjXG4gICMjICAgICAgIyMgIyMgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjICAgICAgICMjICAgICMjXG4gICMjICAgICAgICMjIyAgICAjIyAgICAgIyMgIyMjIyMjIyMgICMjIyMjIyMgICMjIyMjIyMjICAjIyMjIyNcblxuICBnZXRWYWx1ZTogKHZhbHVlKSAtPlxuICAgIFtyZWFsVmFsdWUsIGxhc3RSZWFsVmFsdWVdID0gW11cbiAgICBsb29rZWRVcFZhbHVlcyA9IFt2YWx1ZV1cblxuICAgIHdoaWxlIChyZWFsVmFsdWUgPSBAdmFyc1t2YWx1ZV0/LnZhbHVlKSBhbmQgcmVhbFZhbHVlIG5vdCBpbiBsb29rZWRVcFZhbHVlc1xuICAgICAgQHVzZWRWYXJpYWJsZXMucHVzaCh2YWx1ZSlcbiAgICAgIHZhbHVlID0gbGFzdFJlYWxWYWx1ZSA9IHJlYWxWYWx1ZVxuICAgICAgbG9va2VkVXBWYWx1ZXMucHVzaChyZWFsVmFsdWUpXG5cbiAgICBpZiByZWFsVmFsdWUgaW4gbG9va2VkVXBWYWx1ZXMgdGhlbiB1bmRlZmluZWQgZWxzZSBsYXN0UmVhbFZhbHVlXG5cbiAgcmVhZENvbG9yRXhwcmVzc2lvbjogKHZhbHVlKSAtPlxuICAgIGlmIEBjb2xvclZhcnNbdmFsdWVdP1xuICAgICAgQHVzZWRWYXJpYWJsZXMucHVzaCh2YWx1ZSlcbiAgICAgIEBjb2xvclZhcnNbdmFsdWVdLnZhbHVlXG4gICAgZWxzZSBpZiBAZGVmYXVsdENvbG9yVmFyc1t2YWx1ZV0/XG4gICAgICBAdXNlZFZhcmlhYmxlcy5wdXNoKHZhbHVlKVxuICAgICAgQGRlZmF1bHRDb2xvclZhcnNbdmFsdWVdLnZhbHVlXG4gICAgZWxzZVxuICAgICAgdmFsdWVcblxuICByZWFkQ29sb3I6ICh2YWx1ZSwga2VlcEFsbFZhcmlhYmxlcz1mYWxzZSkgLT5cbiAgICByZXR1cm4gaWYgdmFsdWUgaW4gQHVzZWRWYXJpYWJsZXMgYW5kIG5vdCAodmFsdWUgaW4gQHJlc29sdmVkVmFyaWFibGVzKVxuXG4gICAgcmVhbFZhbHVlID0gQHJlYWRDb2xvckV4cHJlc3Npb24odmFsdWUpXG5cbiAgICByZXR1cm4gaWYgbm90IHJlYWxWYWx1ZT8gb3IgcmVhbFZhbHVlIGluIEB1c2VkVmFyaWFibGVzXG5cbiAgICBzY29wZSA9IGlmIEBjb2xvclZhcnNbdmFsdWVdP1xuICAgICAgQHNjb3BlRnJvbUZpbGVOYW1lKEBjb2xvclZhcnNbdmFsdWVdLnBhdGgpXG4gICAgZWxzZVxuICAgICAgJyonXG5cbiAgICBAdXNlZFZhcmlhYmxlcyA9IEB1c2VkVmFyaWFibGVzLmZpbHRlciAodikgLT4gdiBpc250IHJlYWxWYWx1ZVxuICAgIHJlc3VsdCA9IEBwYXJzZXIucGFyc2UocmVhbFZhbHVlLCBzY29wZSwgZmFsc2UpXG5cbiAgICBpZiByZXN1bHQ/XG4gICAgICBpZiByZXN1bHQuaW52YWxpZCBhbmQgQGRlZmF1bHRDb2xvclZhcnNbcmVhbFZhbHVlXT9cbiAgICAgICAgcmVzdWx0ID0gQHJlYWRDb2xvcihAZGVmYXVsdENvbG9yVmFyc1tyZWFsVmFsdWVdLnZhbHVlKVxuICAgICAgICB2YWx1ZSA9IHJlYWxWYWx1ZVxuXG4gICAgZWxzZSBpZiBAZGVmYXVsdENvbG9yVmFyc1t2YWx1ZV0/XG4gICAgICBAdXNlZFZhcmlhYmxlcy5wdXNoKHZhbHVlKVxuICAgICAgcmVzdWx0ID0gQHJlYWRDb2xvcihAZGVmYXVsdENvbG9yVmFyc1t2YWx1ZV0udmFsdWUpXG5cbiAgICBlbHNlXG4gICAgICBAdXNlZFZhcmlhYmxlcy5wdXNoKHZhbHVlKSBpZiBAdmFyc1t2YWx1ZV0/XG5cbiAgICBpZiByZXN1bHQ/XG4gICAgICBAcmVzb2x2ZWRWYXJpYWJsZXMucHVzaCh2YWx1ZSlcbiAgICAgIGlmIGtlZXBBbGxWYXJpYWJsZXMgb3IgdmFsdWUgbm90IGluIEB1c2VkVmFyaWFibGVzXG4gICAgICAgIHJlc3VsdC52YXJpYWJsZXMgPSAocmVzdWx0LnZhcmlhYmxlcyA/IFtdKS5jb25jYXQoQHJlYWRVc2VkVmFyaWFibGVzKCkpXG5cbiAgICByZXR1cm4gcmVzdWx0XG5cbiAgc2NvcGVGcm9tRmlsZU5hbWU6IChwYXRoKSAtPlxuICAgIHNjb3BlRnJvbUZpbGVOYW1lID89IHJlcXVpcmUgJy4vc2NvcGUtZnJvbS1maWxlLW5hbWUnXG5cbiAgICBzY29wZSA9IHNjb3BlRnJvbUZpbGVOYW1lKHBhdGgpXG5cbiAgICBpZiBzY29wZSBpcyAnc2Fzcycgb3Igc2NvcGUgaXMgJ3Njc3MnXG4gICAgICBzY29wZSA9IFtzY29wZSwgQHNhc3NTY29wZVN1ZmZpeF0uam9pbignOicpXG5cbiAgICBzY29wZVxuXG4gIHJlYWRGbG9hdDogKHZhbHVlKSAtPlxuICAgIHJlcyA9IHBhcnNlRmxvYXQodmFsdWUpXG5cbiAgICBpZiBpc05hTihyZXMpIGFuZCBAdmFyc1t2YWx1ZV0/XG4gICAgICBAdXNlZFZhcmlhYmxlcy5wdXNoIHZhbHVlXG4gICAgICByZXMgPSBAcmVhZEZsb2F0KEB2YXJzW3ZhbHVlXS52YWx1ZSlcblxuICAgIGlmIGlzTmFOKHJlcykgYW5kIEBkZWZhdWx0VmFyc1t2YWx1ZV0/XG4gICAgICBAdXNlZFZhcmlhYmxlcy5wdXNoIHZhbHVlXG4gICAgICByZXMgPSBAcmVhZEZsb2F0KEBkZWZhdWx0VmFyc1t2YWx1ZV0udmFsdWUpXG5cbiAgICByZXNcblxuICByZWFkSW50OiAodmFsdWUsIGJhc2U9MTApIC0+XG4gICAgcmVzID0gcGFyc2VJbnQodmFsdWUsIGJhc2UpXG5cbiAgICBpZiBpc05hTihyZXMpIGFuZCBAdmFyc1t2YWx1ZV0/XG4gICAgICBAdXNlZFZhcmlhYmxlcy5wdXNoIHZhbHVlXG4gICAgICByZXMgPSBAcmVhZEludChAdmFyc1t2YWx1ZV0udmFsdWUpXG5cbiAgICBpZiBpc05hTihyZXMpIGFuZCBAZGVmYXVsdFZhcnNbdmFsdWVdP1xuICAgICAgQHVzZWRWYXJpYWJsZXMucHVzaCB2YWx1ZVxuICAgICAgcmVzID0gQHJlYWRJbnQoQGRlZmF1bHRWYXJzW3ZhbHVlXS52YWx1ZSlcblxuICAgIHJlc1xuXG4gIHJlYWRQZXJjZW50OiAodmFsdWUpIC0+XG4gICAgaWYgbm90IC9cXGQrLy50ZXN0KHZhbHVlKSBhbmQgQHZhcnNbdmFsdWVdP1xuICAgICAgQHVzZWRWYXJpYWJsZXMucHVzaCB2YWx1ZVxuICAgICAgdmFsdWUgPSBAcmVhZFBlcmNlbnQoQHZhcnNbdmFsdWVdLnZhbHVlKVxuXG4gICAgaWYgbm90IC9cXGQrLy50ZXN0KHZhbHVlKSBhbmQgQGRlZmF1bHRWYXJzW3ZhbHVlXT9cbiAgICAgIEB1c2VkVmFyaWFibGVzLnB1c2ggdmFsdWVcbiAgICAgIHZhbHVlID0gQHJlYWRQZXJjZW50KEBkZWZhdWx0VmFyc1t2YWx1ZV0udmFsdWUpXG5cbiAgICBNYXRoLnJvdW5kKHBhcnNlRmxvYXQodmFsdWUpICogMi41NSlcblxuICByZWFkSW50T3JQZXJjZW50OiAodmFsdWUpIC0+XG4gICAgaWYgbm90IC9cXGQrLy50ZXN0KHZhbHVlKSBhbmQgQHZhcnNbdmFsdWVdP1xuICAgICAgQHVzZWRWYXJpYWJsZXMucHVzaCB2YWx1ZVxuICAgICAgdmFsdWUgPSBAcmVhZEludE9yUGVyY2VudChAdmFyc1t2YWx1ZV0udmFsdWUpXG5cbiAgICBpZiBub3QgL1xcZCsvLnRlc3QodmFsdWUpIGFuZCBAZGVmYXVsdFZhcnNbdmFsdWVdP1xuICAgICAgQHVzZWRWYXJpYWJsZXMucHVzaCB2YWx1ZVxuICAgICAgdmFsdWUgPSBAcmVhZEludE9yUGVyY2VudChAZGVmYXVsdFZhcnNbdmFsdWVdLnZhbHVlKVxuXG4gICAgcmV0dXJuIE5hTiB1bmxlc3MgdmFsdWU/XG4gICAgcmV0dXJuIHZhbHVlIGlmIHR5cGVvZiB2YWx1ZSBpcyAnbnVtYmVyJ1xuXG4gICAgaWYgdmFsdWUuaW5kZXhPZignJScpIGlzbnQgLTFcbiAgICAgIHJlcyA9IE1hdGgucm91bmQocGFyc2VGbG9hdCh2YWx1ZSkgKiAyLjU1KVxuICAgIGVsc2VcbiAgICAgIHJlcyA9IHBhcnNlSW50KHZhbHVlKVxuXG4gICAgcmVzXG5cbiAgcmVhZEZsb2F0T3JQZXJjZW50OiAodmFsdWUpIC0+XG4gICAgaWYgbm90IC9cXGQrLy50ZXN0KHZhbHVlKSBhbmQgQHZhcnNbdmFsdWVdP1xuICAgICAgQHVzZWRWYXJpYWJsZXMucHVzaCB2YWx1ZVxuICAgICAgdmFsdWUgPSBAcmVhZEZsb2F0T3JQZXJjZW50KEB2YXJzW3ZhbHVlXS52YWx1ZSlcblxuICAgIGlmIG5vdCAvXFxkKy8udGVzdCh2YWx1ZSkgYW5kIEBkZWZhdWx0VmFyc1t2YWx1ZV0/XG4gICAgICBAdXNlZFZhcmlhYmxlcy5wdXNoIHZhbHVlXG4gICAgICB2YWx1ZSA9IEByZWFkRmxvYXRPclBlcmNlbnQoQGRlZmF1bHRWYXJzW3ZhbHVlXS52YWx1ZSlcblxuICAgIHJldHVybiBOYU4gdW5sZXNzIHZhbHVlP1xuICAgIHJldHVybiB2YWx1ZSBpZiB0eXBlb2YgdmFsdWUgaXMgJ251bWJlcidcblxuICAgIGlmIHZhbHVlLmluZGV4T2YoJyUnKSBpc250IC0xXG4gICAgICByZXMgPSBwYXJzZUZsb2F0KHZhbHVlKSAvIDEwMFxuICAgIGVsc2VcbiAgICAgIHJlcyA9IHBhcnNlRmxvYXQodmFsdWUpXG4gICAgICByZXMgPSByZXMgLyAxMDAgaWYgcmVzID4gMVxuICAgICAgcmVzXG5cbiAgICByZXNcblxuICAjIyAgICAjIyAgICAgIyMgIyMjIyMjIyMgIyMjIyAjIyAgICAgICAgIyMjIyMjXG4gICMjICAgICMjICAgICAjIyAgICAjIyAgICAgIyMgICMjICAgICAgICMjICAgICMjXG4gICMjICAgICMjICAgICAjIyAgICAjIyAgICAgIyMgICMjICAgICAgICMjXG4gICMjICAgICMjICAgICAjIyAgICAjIyAgICAgIyMgICMjICAgICAgICAjIyMjIyNcbiAgIyMgICAgIyMgICAgICMjICAgICMjICAgICAjIyAgIyMgICAgICAgICAgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICAgICMjICAgICAjIyAgIyMgICAgICAgIyMgICAgIyNcbiAgIyMgICAgICMjIyMjIyMgICAgICMjICAgICMjIyMgIyMjIyMjIyMgICMjIyMjI1xuXG4gIHNwbGl0OiAodmFsdWUpIC0+XG4gICAge3NwbGl0LCBjbGFtcCwgY2xhbXBJbnR9ID0gcmVxdWlyZSAnLi91dGlscycgdW5sZXNzIHNwbGl0P1xuICAgIHNwbGl0KHZhbHVlKVxuXG4gIGNsYW1wOiAodmFsdWUpIC0+XG4gICAge3NwbGl0LCBjbGFtcCwgY2xhbXBJbnR9ID0gcmVxdWlyZSAnLi91dGlscycgdW5sZXNzIGNsYW1wP1xuICAgIGNsYW1wKHZhbHVlKVxuXG4gIGNsYW1wSW50OiAodmFsdWUpIC0+XG4gICAge3NwbGl0LCBjbGFtcCwgY2xhbXBJbnR9ID0gcmVxdWlyZSAnLi91dGlscycgdW5sZXNzIGNsYW1wSW50P1xuICAgIGNsYW1wSW50KHZhbHVlKVxuXG4gIGlzSW52YWxpZDogKGNvbG9yKSAtPiBub3QgQ29sb3IuaXNWYWxpZChjb2xvcilcblxuICByZWFkUGFyYW06IChwYXJhbSwgYmxvY2spIC0+XG4gICAgcmUgPSAvLy9cXCQoXFx3Kyk6XFxzKigoLT8je0BmbG9hdH0pfCN7QHZhcmlhYmxlc1JFfSkvLy9cbiAgICBpZiByZS50ZXN0KHBhcmFtKVxuICAgICAgW18sIG5hbWUsIHZhbHVlXSA9IHJlLmV4ZWMocGFyYW0pXG5cbiAgICAgIGJsb2NrKG5hbWUsIHZhbHVlKVxuXG4gIGNvbnRyYXN0OiAoYmFzZSwgZGFyaz1uZXcgQ29sb3IoJ2JsYWNrJyksIGxpZ2h0PW5ldyBDb2xvcignd2hpdGUnKSwgdGhyZXNob2xkPTAuNDMpIC0+XG4gICAgW2xpZ2h0LCBkYXJrXSA9IFtkYXJrLCBsaWdodF0gaWYgZGFyay5sdW1hID4gbGlnaHQubHVtYVxuXG4gICAgaWYgYmFzZS5sdW1hID4gdGhyZXNob2xkXG4gICAgICBkYXJrXG4gICAgZWxzZVxuICAgICAgbGlnaHRcblxuICBtaXhDb2xvcnM6IChjb2xvcjEsIGNvbG9yMiwgYW1vdW50PTAuNSwgcm91bmQ9TWF0aC5mbG9vcikgLT5cbiAgICByZXR1cm4gbmV3IENvbG9yKE5hTiwgTmFOLCBOYU4sIE5hTikgdW5sZXNzIGNvbG9yMT8gYW5kIGNvbG9yMj8gYW5kIG5vdCBpc05hTihhbW91bnQpXG5cbiAgICBpbnZlcnNlID0gMSAtIGFtb3VudFxuICAgIGNvbG9yID0gbmV3IENvbG9yXG5cbiAgICBjb2xvci5yZ2JhID0gW1xuICAgICAgcm91bmQoY29sb3IxLnJlZCAqIGFtb3VudCArIGNvbG9yMi5yZWQgKiBpbnZlcnNlKVxuICAgICAgcm91bmQoY29sb3IxLmdyZWVuICogYW1vdW50ICsgY29sb3IyLmdyZWVuICogaW52ZXJzZSlcbiAgICAgIHJvdW5kKGNvbG9yMS5ibHVlICogYW1vdW50ICsgY29sb3IyLmJsdWUgKiBpbnZlcnNlKVxuICAgICAgY29sb3IxLmFscGhhICogYW1vdW50ICsgY29sb3IyLmFscGhhICogaW52ZXJzZVxuICAgIF1cblxuICAgIGNvbG9yXG5cbiAgIyMgICAgIyMjIyMjIyMgICMjIyMjIyMjICAjIyMjIyMgICAjIyMjIyMjIyAjIyAgICAgIyMgIyMjIyMjIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAgICMjICAgICMjICAjIyAgICAgICAgIyMgICAjIyAgIyMgICAgICMjXG4gICMjICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgICAgIyMgICAgICAgICAjIyAjIyAgICMjICAgICAjI1xuICAjIyAgICAjIyMjIyMjIyAgIyMjIyMjICAgIyMgICAjIyMjICMjIyMjIyAgICAgICMjIyAgICAjIyMjIyMjI1xuICAjIyAgICAjIyAgICMjICAgIyMgICAgICAgIyMgICAgIyMgICMjICAgICAgICAgIyMgIyMgICAjI1xuICAjIyAgICAjIyAgICAjIyAgIyMgICAgICAgIyMgICAgIyMgICMjICAgICAgICAjIyAgICMjICAjI1xuICAjIyAgICAjIyAgICAgIyMgIyMjIyMjIyMgICMjIyMjIyAgICMjIyMjIyMjICMjICAgICAjIyAjI1xuIl19
