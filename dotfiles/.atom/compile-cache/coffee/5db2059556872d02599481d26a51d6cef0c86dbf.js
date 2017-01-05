(function() {
  var Color, ColorExpression, createVariableRegExpString, ref;

  ref = [], createVariableRegExpString = ref[0], Color = ref[1];

  module.exports = ColorExpression = (function() {
    ColorExpression.colorExpressionForContext = function(context) {
      return this.colorExpressionForColorVariables(context.getColorVariables());
    };

    ColorExpression.colorExpressionRegexpForColorVariables = function(colorVariables) {
      if (createVariableRegExpString == null) {
        createVariableRegExpString = require('./regexes').createVariableRegExpString;
      }
      return createVariableRegExpString(colorVariables);
    };

    ColorExpression.colorExpressionForColorVariables = function(colorVariables) {
      var paletteRegexpString;
      paletteRegexpString = this.colorExpressionRegexpForColorVariables(colorVariables);
      return new ColorExpression({
        name: 'pigments:variables',
        regexpString: paletteRegexpString,
        scopes: ['*'],
        priority: 1,
        handle: function(match, expression, context) {
          var _, baseColor, evaluated, name;
          _ = match[0], _ = match[1], name = match[2];
          if (name == null) {
            name = match[0];
          }
          evaluated = context.readColorExpression(name);
          if (evaluated === name) {
            return this.invalid = true;
          }
          baseColor = context.readColor(evaluated);
          this.colorExpression = name;
          this.variables = baseColor != null ? baseColor.variables : void 0;
          if (context.isInvalid(baseColor)) {
            return this.invalid = true;
          }
          return this.rgba = baseColor.rgba;
        }
      });
    };

    function ColorExpression(arg) {
      this.name = arg.name, this.regexpString = arg.regexpString, this.scopes = arg.scopes, this.priority = arg.priority, this.handle = arg.handle;
      this.regexp = new RegExp("^" + this.regexpString + "$");
    }

    ColorExpression.prototype.match = function(expression) {
      return this.regexp.test(expression);
    };

    ColorExpression.prototype.parse = function(expression, context) {
      var color;
      if (!this.match(expression)) {
        return null;
      }
      if (Color == null) {
        Color = require('./color');
      }
      color = new Color();
      color.colorExpression = expression;
      color.expressionHandler = this.name;
      this.handle.call(color, this.regexp.exec(expression), expression, context);
      return color;
    };

    ColorExpression.prototype.search = function(text, start) {
      var lastIndex, match, range, re, ref1, results;
      if (start == null) {
        start = 0;
      }
      results = void 0;
      re = new RegExp(this.regexpString, 'g');
      re.lastIndex = start;
      if (ref1 = re.exec(text), match = ref1[0], ref1) {
        lastIndex = re.lastIndex;
        range = [lastIndex - match.length, lastIndex];
        results = {
          range: range,
          match: text.slice(range[0], range[1])
        };
      }
      return results;
    };

    return ColorExpression;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLWV4cHJlc3Npb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFzQyxFQUF0QyxFQUFDLG1DQUFELEVBQTZCOztFQUU3QixNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ0osZUFBQyxDQUFBLHlCQUFELEdBQTRCLFNBQUMsT0FBRDthQUMxQixJQUFDLENBQUEsZ0NBQUQsQ0FBa0MsT0FBTyxDQUFDLGlCQUFSLENBQUEsQ0FBbEM7SUFEMEI7O0lBRzVCLGVBQUMsQ0FBQSxzQ0FBRCxHQUF5QyxTQUFDLGNBQUQ7TUFDdkMsSUFBTyxrQ0FBUDtRQUNHLDZCQUE4QixPQUFBLENBQVEsV0FBUiw2QkFEakM7O2FBR0EsMEJBQUEsQ0FBMkIsY0FBM0I7SUFKdUM7O0lBTXpDLGVBQUMsQ0FBQSxnQ0FBRCxHQUFtQyxTQUFDLGNBQUQ7QUFDakMsVUFBQTtNQUFBLG1CQUFBLEdBQXNCLElBQUMsQ0FBQSxzQ0FBRCxDQUF3QyxjQUF4QzthQUVsQixJQUFBLGVBQUEsQ0FDRjtRQUFBLElBQUEsRUFBTSxvQkFBTjtRQUNBLFlBQUEsRUFBYyxtQkFEZDtRQUVBLE1BQUEsRUFBUSxDQUFDLEdBQUQsQ0FGUjtRQUdBLFFBQUEsRUFBVSxDQUhWO1FBSUEsTUFBQSxFQUFRLFNBQUMsS0FBRCxFQUFRLFVBQVIsRUFBb0IsT0FBcEI7QUFDTixjQUFBO1VBQUMsWUFBRCxFQUFJLFlBQUosRUFBTTtVQUVOLElBQXVCLFlBQXZCO1lBQUEsSUFBQSxHQUFPLEtBQU0sQ0FBQSxDQUFBLEVBQWI7O1VBRUEsU0FBQSxHQUFZLE9BQU8sQ0FBQyxtQkFBUixDQUE0QixJQUE1QjtVQUNaLElBQTBCLFNBQUEsS0FBYSxJQUF2QztBQUFBLG1CQUFPLElBQUMsQ0FBQSxPQUFELEdBQVcsS0FBbEI7O1VBRUEsU0FBQSxHQUFZLE9BQU8sQ0FBQyxTQUFSLENBQWtCLFNBQWxCO1VBQ1osSUFBQyxDQUFBLGVBQUQsR0FBbUI7VUFDbkIsSUFBQyxDQUFBLFNBQUQsdUJBQWEsU0FBUyxDQUFFO1VBRXhCLElBQTBCLE9BQU8sQ0FBQyxTQUFSLENBQWtCLFNBQWxCLENBQTFCO0FBQUEsbUJBQU8sSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUFsQjs7aUJBRUEsSUFBQyxDQUFBLElBQUQsR0FBUSxTQUFTLENBQUM7UUFkWixDQUpSO09BREU7SUFINkI7O0lBd0J0Qix5QkFBQyxHQUFEO01BQUUsSUFBQyxDQUFBLFdBQUEsTUFBTSxJQUFDLENBQUEsbUJBQUEsY0FBYyxJQUFDLENBQUEsYUFBQSxRQUFRLElBQUMsQ0FBQSxlQUFBLFVBQVUsSUFBQyxDQUFBLGFBQUE7TUFDeEQsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLE1BQUEsQ0FBTyxHQUFBLEdBQUksSUFBQyxDQUFBLFlBQUwsR0FBa0IsR0FBekI7SUFESDs7OEJBR2IsS0FBQSxHQUFPLFNBQUMsVUFBRDthQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxVQUFiO0lBQWhCOzs4QkFFUCxLQUFBLEdBQU8sU0FBQyxVQUFELEVBQWEsT0FBYjtBQUNMLFVBQUE7TUFBQSxJQUFBLENBQW1CLElBQUMsQ0FBQSxLQUFELENBQU8sVUFBUCxDQUFuQjtBQUFBLGVBQU8sS0FBUDs7O1FBRUEsUUFBUyxPQUFBLENBQVEsU0FBUjs7TUFFVCxLQUFBLEdBQVksSUFBQSxLQUFBLENBQUE7TUFDWixLQUFLLENBQUMsZUFBTixHQUF3QjtNQUN4QixLQUFLLENBQUMsaUJBQU4sR0FBMEIsSUFBQyxDQUFBO01BQzNCLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLEtBQWIsRUFBb0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsVUFBYixDQUFwQixFQUE4QyxVQUE5QyxFQUEwRCxPQUExRDthQUNBO0lBVEs7OzhCQVdQLE1BQUEsR0FBUSxTQUFDLElBQUQsRUFBTyxLQUFQO0FBQ04sVUFBQTs7UUFEYSxRQUFNOztNQUNuQixPQUFBLEdBQVU7TUFDVixFQUFBLEdBQVMsSUFBQSxNQUFBLENBQU8sSUFBQyxDQUFBLFlBQVIsRUFBc0IsR0FBdEI7TUFDVCxFQUFFLENBQUMsU0FBSCxHQUFlO01BQ2YsSUFBRyxPQUFVLEVBQUUsQ0FBQyxJQUFILENBQVEsSUFBUixDQUFWLEVBQUMsZUFBRCxFQUFBLElBQUg7UUFDRyxZQUFhO1FBQ2QsS0FBQSxHQUFRLENBQUMsU0FBQSxHQUFZLEtBQUssQ0FBQyxNQUFuQixFQUEyQixTQUEzQjtRQUNSLE9BQUEsR0FDRTtVQUFBLEtBQUEsRUFBTyxLQUFQO1VBQ0EsS0FBQSxFQUFPLElBQUssMEJBRFo7VUFKSjs7YUFPQTtJQVhNOzs7OztBQXJEViIsInNvdXJjZXNDb250ZW50IjpbIltjcmVhdGVWYXJpYWJsZVJlZ0V4cFN0cmluZywgQ29sb3JdID0gW11cblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQ29sb3JFeHByZXNzaW9uXG4gIEBjb2xvckV4cHJlc3Npb25Gb3JDb250ZXh0OiAoY29udGV4dCkgLT5cbiAgICBAY29sb3JFeHByZXNzaW9uRm9yQ29sb3JWYXJpYWJsZXMoY29udGV4dC5nZXRDb2xvclZhcmlhYmxlcygpKVxuXG4gIEBjb2xvckV4cHJlc3Npb25SZWdleHBGb3JDb2xvclZhcmlhYmxlczogKGNvbG9yVmFyaWFibGVzKSAtPlxuICAgIHVubGVzcyBjcmVhdGVWYXJpYWJsZVJlZ0V4cFN0cmluZz9cbiAgICAgIHtjcmVhdGVWYXJpYWJsZVJlZ0V4cFN0cmluZ30gPSByZXF1aXJlICcuL3JlZ2V4ZXMnXG5cbiAgICBjcmVhdGVWYXJpYWJsZVJlZ0V4cFN0cmluZyhjb2xvclZhcmlhYmxlcylcblxuICBAY29sb3JFeHByZXNzaW9uRm9yQ29sb3JWYXJpYWJsZXM6IChjb2xvclZhcmlhYmxlcykgLT5cbiAgICBwYWxldHRlUmVnZXhwU3RyaW5nID0gQGNvbG9yRXhwcmVzc2lvblJlZ2V4cEZvckNvbG9yVmFyaWFibGVzKGNvbG9yVmFyaWFibGVzKVxuXG4gICAgbmV3IENvbG9yRXhwcmVzc2lvblxuICAgICAgbmFtZTogJ3BpZ21lbnRzOnZhcmlhYmxlcydcbiAgICAgIHJlZ2V4cFN0cmluZzogcGFsZXR0ZVJlZ2V4cFN0cmluZ1xuICAgICAgc2NvcGVzOiBbJyonXVxuICAgICAgcHJpb3JpdHk6IDFcbiAgICAgIGhhbmRsZTogKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICAgICAgICBbXywgXyxuYW1lXSA9IG1hdGNoXG5cbiAgICAgICAgbmFtZSA9IG1hdGNoWzBdIHVubGVzcyBuYW1lP1xuXG4gICAgICAgIGV2YWx1YXRlZCA9IGNvbnRleHQucmVhZENvbG9yRXhwcmVzc2lvbihuYW1lKVxuICAgICAgICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGV2YWx1YXRlZCBpcyBuYW1lXG5cbiAgICAgICAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3IoZXZhbHVhdGVkKVxuICAgICAgICBAY29sb3JFeHByZXNzaW9uID0gbmFtZVxuICAgICAgICBAdmFyaWFibGVzID0gYmFzZUNvbG9yPy52YXJpYWJsZXNcblxuICAgICAgICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICAgICAgICBAcmdiYSA9IGJhc2VDb2xvci5yZ2JhXG5cbiAgY29uc3RydWN0b3I6ICh7QG5hbWUsIEByZWdleHBTdHJpbmcsIEBzY29wZXMsIEBwcmlvcml0eSwgQGhhbmRsZX0pIC0+XG4gICAgQHJlZ2V4cCA9IG5ldyBSZWdFeHAoXCJeI3tAcmVnZXhwU3RyaW5nfSRcIilcblxuICBtYXRjaDogKGV4cHJlc3Npb24pIC0+IEByZWdleHAudGVzdCBleHByZXNzaW9uXG5cbiAgcGFyc2U6IChleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICAgIHJldHVybiBudWxsIHVubGVzcyBAbWF0Y2goZXhwcmVzc2lvbilcblxuICAgIENvbG9yID89IHJlcXVpcmUgJy4vY29sb3InXG5cbiAgICBjb2xvciA9IG5ldyBDb2xvcigpXG4gICAgY29sb3IuY29sb3JFeHByZXNzaW9uID0gZXhwcmVzc2lvblxuICAgIGNvbG9yLmV4cHJlc3Npb25IYW5kbGVyID0gQG5hbWVcbiAgICBAaGFuZGxlLmNhbGwoY29sb3IsIEByZWdleHAuZXhlYyhleHByZXNzaW9uKSwgZXhwcmVzc2lvbiwgY29udGV4dClcbiAgICBjb2xvclxuXG4gIHNlYXJjaDogKHRleHQsIHN0YXJ0PTApIC0+XG4gICAgcmVzdWx0cyA9IHVuZGVmaW5lZFxuICAgIHJlID0gbmV3IFJlZ0V4cChAcmVnZXhwU3RyaW5nLCAnZycpXG4gICAgcmUubGFzdEluZGV4ID0gc3RhcnRcbiAgICBpZiBbbWF0Y2hdID0gcmUuZXhlYyh0ZXh0KVxuICAgICAge2xhc3RJbmRleH0gPSByZVxuICAgICAgcmFuZ2UgPSBbbGFzdEluZGV4IC0gbWF0Y2gubGVuZ3RoLCBsYXN0SW5kZXhdXG4gICAgICByZXN1bHRzID1cbiAgICAgICAgcmFuZ2U6IHJhbmdlXG4gICAgICAgIG1hdGNoOiB0ZXh0W3JhbmdlWzBdLi4ucmFuZ2VbMV1dXG5cbiAgICByZXN1bHRzXG4iXX0=
