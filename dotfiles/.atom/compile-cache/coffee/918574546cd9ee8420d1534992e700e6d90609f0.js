(function() {
  var ExpressionsRegistry, VariableExpression, registry, sass_handler;

  ExpressionsRegistry = require('./expressions-registry');

  VariableExpression = require('./variable-expression');

  module.exports = registry = new ExpressionsRegistry(VariableExpression);

  registry.createExpression('pigments:less', '^[ \\t]*(@[a-zA-Z0-9\\-_]+)\\s*:\\s*([^;\\n\\r]+);?', ['less']);

  registry.createExpression('pigments:scss_params', '^[ \\t]*@(mixin|include|function)\\s+[a-zA-Z0-9\\-_]+\\s*\\([^\\)]+\\)', ['scss', 'sass', 'haml'], function(match, solver) {
    match = match[0];
    return solver.endParsing(match.length - 1);
  });

  sass_handler = function(match, solver) {
    var all_hyphen, all_underscore;
    solver.appendResult(match[1], match[2], 0, match[0].length, {
      isDefault: match[3] != null
    });
    if (match[1].match(/[-_]/)) {
      all_underscore = match[1].replace(/-/g, '_');
      all_hyphen = match[1].replace(/_/g, '-');
      if (match[1] !== all_underscore) {
        solver.appendResult(all_underscore, match[2], 0, match[0].length, {
          isAlternate: true,
          isDefault: match[3] != null
        });
      }
      if (match[1] !== all_hyphen) {
        solver.appendResult(all_hyphen, match[2], 0, match[0].length, {
          isAlternate: true,
          isDefault: match[3] != null
        });
      }
    }
    return solver.endParsing(match[0].length);
  };

  registry.createExpression('pigments:scss', '^[ \\t]*(\\$[a-zA-Z0-9\\-_]+)\\s*:\\s*(.*?)(\\s*!default)?\\s*;', ['scss', 'haml'], sass_handler);

  registry.createExpression('pigments:sass', '^[ \\t]*(\\$[a-zA-Z0-9\\-_]+)\\s*:\\s*([^\\{]*?)(\\s*!default)?\\s*(?:$|\\/)', ['sass', 'haml'], sass_handler);

  registry.createExpression('pigments:css_vars', '(--[^\\s:]+):\\s*([^\\n;]+);', ['css'], function(match, solver) {
    solver.appendResult("var(" + match[1] + ")", match[2], 0, match[0].length);
    return solver.endParsing(match[0].length);
  });

  registry.createExpression('pigments:stylus_hash', '^[ \\t]*([a-zA-Z_$][a-zA-Z0-9\\-_]*)\\s*=\\s*\\{([^=]*)\\}', ['styl', 'stylus'], function(match, solver) {
    var buffer, char, commaSensitiveBegin, commaSensitiveEnd, content, current, i, inCommaSensitiveContext, key, len, name, ref, ref1, scope, scopeBegin, scopeEnd, value;
    buffer = '';
    ref = match, match = ref[0], name = ref[1], content = ref[2];
    current = match.indexOf(content);
    scope = [name];
    scopeBegin = /\{/;
    scopeEnd = /\}/;
    commaSensitiveBegin = /\(|\[/;
    commaSensitiveEnd = /\)|\]/;
    inCommaSensitiveContext = false;
    for (i = 0, len = content.length; i < len; i++) {
      char = content[i];
      if (scopeBegin.test(char)) {
        scope.push(buffer.replace(/[\s:]/g, ''));
        buffer = '';
      } else if (scopeEnd.test(char)) {
        scope.pop();
        if (scope.length === 0) {
          return solver.endParsing(current);
        }
      } else if (commaSensitiveBegin.test(char)) {
        buffer += char;
        inCommaSensitiveContext = true;
      } else if (inCommaSensitiveContext) {
        buffer += char;
        inCommaSensitiveContext = !commaSensitiveEnd.test(char);
      } else if (/[,\n]/.test(char)) {
        buffer = buffer.replace(/\s+/g, '');
        if (buffer.length) {
          ref1 = buffer.split(/\s*:\s*/), key = ref1[0], value = ref1[1];
          solver.appendResult(scope.concat(key).join('.'), value, current - buffer.length - 1, current);
        }
        buffer = '';
      } else {
        buffer += char;
      }
      current++;
    }
    scope.pop();
    if (scope.length === 0) {
      return solver.endParsing(current + 1);
    } else {
      return solver.abortParsing();
    }
  });

  registry.createExpression('pigments:stylus', '^[ \\t]*([a-zA-Z_$][a-zA-Z0-9\\-_]*)\\s*=(?!=)\\s*([^\\n\\r;]*);?$', ['styl', 'stylus']);

  registry.createExpression('pigments:latex', '\\\\definecolor(\\{[^\\}]+\\})\\{([^\\}]+)\\}\\{([^\\}]+)\\}', ['tex'], function(match, solver) {
    var _, mode, name, value, values;
    _ = match[0], name = match[1], mode = match[2], value = match[3];
    value = (function() {
      switch (mode) {
        case 'RGB':
          return "rgb(" + value + ")";
        case 'gray':
          return "gray(" + (Math.round(parseFloat(value) * 100)) + "%)";
        case 'rgb':
          values = value.split(',').map(function(n) {
            return Math.floor(n * 255);
          });
          return "rgb(" + (values.join(',')) + ")";
        case 'cmyk':
          return "cmyk(" + value + ")";
        case 'HTML':
          return "#" + value;
        default:
          return value;
      }
    })();
    solver.appendResult(name, value, 0, _.length, {
      noNamePrefix: true
    });
    return solver.endParsing(_.length);
  });

  registry.createExpression('pigments:latex_mix', '\\\\definecolor(\\{[^\\}]+\\})(\\{[^\\}\\n!]+[!][^\\}\\n]+\\})', ['tex'], function(match, solver) {
    var _, name, value;
    _ = match[0], name = match[1], value = match[2];
    solver.appendResult(name, value, 0, _.length, {
      noNamePrefix: true
    });
    return solver.endParsing(_.length);
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3ZhcmlhYmxlLWV4cHJlc3Npb25zLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHdCQUFSOztFQUN0QixrQkFBQSxHQUFxQixPQUFBLENBQVEsdUJBQVI7O0VBRXJCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFFBQUEsR0FBZSxJQUFBLG1CQUFBLENBQW9CLGtCQUFwQjs7RUFFaEMsUUFBUSxDQUFDLGdCQUFULENBQTBCLGVBQTFCLEVBQTJDLHFEQUEzQyxFQUFrRyxDQUFDLE1BQUQsQ0FBbEc7O0VBR0EsUUFBUSxDQUFDLGdCQUFULENBQTBCLHNCQUExQixFQUFrRCx3RUFBbEQsRUFBNEgsQ0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixNQUFqQixDQUE1SCxFQUFzSixTQUFDLEtBQUQsRUFBUSxNQUFSO0lBQ25KLFFBQVM7V0FDVixNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFLLENBQUMsTUFBTixHQUFlLENBQWpDO0VBRm9KLENBQXRKOztFQUlBLFlBQUEsR0FBZSxTQUFDLEtBQUQsRUFBUSxNQUFSO0FBQ2IsUUFBQTtJQUFBLE1BQU0sQ0FBQyxZQUFQLENBQW9CLEtBQU0sQ0FBQSxDQUFBLENBQTFCLEVBQThCLEtBQU0sQ0FBQSxDQUFBLENBQXBDLEVBQXdDLENBQXhDLEVBQTJDLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFwRCxFQUE0RDtNQUFBLFNBQUEsRUFBVyxnQkFBWDtLQUE1RDtJQUVBLElBQUcsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQVQsQ0FBZSxNQUFmLENBQUg7TUFDRSxjQUFBLEdBQWlCLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFULENBQWlCLElBQWpCLEVBQXVCLEdBQXZCO01BQ2pCLFVBQUEsR0FBYSxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBVCxDQUFpQixJQUFqQixFQUF1QixHQUF2QjtNQUViLElBQUcsS0FBTSxDQUFBLENBQUEsQ0FBTixLQUFjLGNBQWpCO1FBQ0UsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsY0FBcEIsRUFBb0MsS0FBTSxDQUFBLENBQUEsQ0FBMUMsRUFBOEMsQ0FBOUMsRUFBaUQsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQTFELEVBQWtFO1VBQUEsV0FBQSxFQUFhLElBQWI7VUFBbUIsU0FBQSxFQUFXLGdCQUE5QjtTQUFsRSxFQURGOztNQUVBLElBQUcsS0FBTSxDQUFBLENBQUEsQ0FBTixLQUFjLFVBQWpCO1FBQ0UsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsVUFBcEIsRUFBZ0MsS0FBTSxDQUFBLENBQUEsQ0FBdEMsRUFBMEMsQ0FBMUMsRUFBNkMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQXRELEVBQThEO1VBQUEsV0FBQSxFQUFhLElBQWI7VUFBbUIsU0FBQSxFQUFXLGdCQUE5QjtTQUE5RCxFQURGO09BTkY7O1dBU0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQTNCO0VBWmE7O0VBY2YsUUFBUSxDQUFDLGdCQUFULENBQTBCLGVBQTFCLEVBQTJDLGlFQUEzQyxFQUE4RyxDQUFDLE1BQUQsRUFBUyxNQUFULENBQTlHLEVBQWdJLFlBQWhJOztFQUVBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixlQUExQixFQUEyQyw4RUFBM0MsRUFBMkgsQ0FBQyxNQUFELEVBQVMsTUFBVCxDQUEzSCxFQUE2SSxZQUE3STs7RUFFQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsbUJBQTFCLEVBQStDLDhCQUEvQyxFQUErRSxDQUFDLEtBQUQsQ0FBL0UsRUFBd0YsU0FBQyxLQUFELEVBQVEsTUFBUjtJQUN0RixNQUFNLENBQUMsWUFBUCxDQUFvQixNQUFBLEdBQU8sS0FBTSxDQUFBLENBQUEsQ0FBYixHQUFnQixHQUFwQyxFQUF3QyxLQUFNLENBQUEsQ0FBQSxDQUE5QyxFQUFrRCxDQUFsRCxFQUFxRCxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBOUQ7V0FDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBM0I7RUFGc0YsQ0FBeEY7O0VBSUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLHNCQUExQixFQUFrRCw0REFBbEQsRUFBZ0gsQ0FBQyxNQUFELEVBQVMsUUFBVCxDQUFoSCxFQUFvSSxTQUFDLEtBQUQsRUFBUSxNQUFSO0FBQ2xJLFFBQUE7SUFBQSxNQUFBLEdBQVM7SUFDVCxNQUF5QixLQUF6QixFQUFDLGNBQUQsRUFBUSxhQUFSLEVBQWM7SUFDZCxPQUFBLEdBQVUsS0FBSyxDQUFDLE9BQU4sQ0FBYyxPQUFkO0lBQ1YsS0FBQSxHQUFRLENBQUMsSUFBRDtJQUNSLFVBQUEsR0FBYTtJQUNiLFFBQUEsR0FBVztJQUNYLG1CQUFBLEdBQXNCO0lBQ3RCLGlCQUFBLEdBQW9CO0lBQ3BCLHVCQUFBLEdBQTBCO0FBQzFCLFNBQUEseUNBQUE7O01BQ0UsSUFBRyxVQUFVLENBQUMsSUFBWCxDQUFnQixJQUFoQixDQUFIO1FBQ0UsS0FBSyxDQUFDLElBQU4sQ0FBVyxNQUFNLENBQUMsT0FBUCxDQUFlLFFBQWYsRUFBeUIsRUFBekIsQ0FBWDtRQUNBLE1BQUEsR0FBUyxHQUZYO09BQUEsTUFHSyxJQUFHLFFBQVEsQ0FBQyxJQUFULENBQWMsSUFBZCxDQUFIO1FBQ0gsS0FBSyxDQUFDLEdBQU4sQ0FBQTtRQUNBLElBQXFDLEtBQUssQ0FBQyxNQUFOLEtBQWdCLENBQXJEO0FBQUEsaUJBQU8sTUFBTSxDQUFDLFVBQVAsQ0FBa0IsT0FBbEIsRUFBUDtTQUZHO09BQUEsTUFHQSxJQUFHLG1CQUFtQixDQUFDLElBQXBCLENBQXlCLElBQXpCLENBQUg7UUFDSCxNQUFBLElBQVU7UUFDVix1QkFBQSxHQUEwQixLQUZ2QjtPQUFBLE1BR0EsSUFBRyx1QkFBSDtRQUNILE1BQUEsSUFBVTtRQUNWLHVCQUFBLEdBQTBCLENBQUMsaUJBQWlCLENBQUMsSUFBbEIsQ0FBdUIsSUFBdkIsRUFGeEI7T0FBQSxNQUdBLElBQUcsT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFiLENBQUg7UUFDSCxNQUFBLEdBQVMsTUFBTSxDQUFDLE9BQVAsQ0FBZSxNQUFmLEVBQXVCLEVBQXZCO1FBQ1QsSUFBRyxNQUFNLENBQUMsTUFBVjtVQUNFLE9BQWUsTUFBTSxDQUFDLEtBQVAsQ0FBYSxTQUFiLENBQWYsRUFBQyxhQUFELEVBQU07VUFFTixNQUFNLENBQUMsWUFBUCxDQUFvQixLQUFLLENBQUMsTUFBTixDQUFhLEdBQWIsQ0FBaUIsQ0FBQyxJQUFsQixDQUF1QixHQUF2QixDQUFwQixFQUFpRCxLQUFqRCxFQUF3RCxPQUFBLEdBQVUsTUFBTSxDQUFDLE1BQWpCLEdBQTBCLENBQWxGLEVBQXFGLE9BQXJGLEVBSEY7O1FBS0EsTUFBQSxHQUFTLEdBUE47T0FBQSxNQUFBO1FBU0gsTUFBQSxJQUFVLEtBVFA7O01BV0wsT0FBQTtBQXhCRjtJQTBCQSxLQUFLLENBQUMsR0FBTixDQUFBO0lBQ0EsSUFBRyxLQUFLLENBQUMsTUFBTixLQUFnQixDQUFuQjthQUNFLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE9BQUEsR0FBVSxDQUE1QixFQURGO0tBQUEsTUFBQTthQUdFLE1BQU0sQ0FBQyxZQUFQLENBQUEsRUFIRjs7RUFyQ2tJLENBQXBJOztFQTBDQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsaUJBQTFCLEVBQTZDLG9FQUE3QyxFQUFtSCxDQUFDLE1BQUQsRUFBUyxRQUFULENBQW5IOztFQUVBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixnQkFBMUIsRUFBNEMsOERBQTVDLEVBQTRHLENBQUMsS0FBRCxDQUE1RyxFQUFxSCxTQUFDLEtBQUQsRUFBUSxNQUFSO0FBQ25ILFFBQUE7SUFBQyxZQUFELEVBQUksZUFBSixFQUFVLGVBQVYsRUFBZ0I7SUFFaEIsS0FBQTtBQUFRLGNBQU8sSUFBUDtBQUFBLGFBQ0QsS0FEQztpQkFDVSxNQUFBLEdBQU8sS0FBUCxHQUFhO0FBRHZCLGFBRUQsTUFGQztpQkFFVyxPQUFBLEdBQU8sQ0FBQyxJQUFJLENBQUMsS0FBTCxDQUFXLFVBQUEsQ0FBVyxLQUFYLENBQUEsR0FBb0IsR0FBL0IsQ0FBRCxDQUFQLEdBQTRDO0FBRnZELGFBR0QsS0FIQztVQUlKLE1BQUEsR0FBUyxLQUFLLENBQUMsS0FBTixDQUFZLEdBQVosQ0FBZ0IsQ0FBQyxHQUFqQixDQUFxQixTQUFDLENBQUQ7bUJBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFBLEdBQUksR0FBZjtVQUFQLENBQXJCO2lCQUNULE1BQUEsR0FBTSxDQUFDLE1BQU0sQ0FBQyxJQUFQLENBQVksR0FBWixDQUFELENBQU4sR0FBd0I7QUFMcEIsYUFNRCxNQU5DO2lCQU1XLE9BQUEsR0FBUSxLQUFSLEdBQWM7QUFOekIsYUFPRCxNQVBDO2lCQU9XLEdBQUEsR0FBSTtBQVBmO2lCQVFEO0FBUkM7O0lBVVIsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsSUFBcEIsRUFBMEIsS0FBMUIsRUFBaUMsQ0FBakMsRUFBb0MsQ0FBQyxDQUFDLE1BQXRDLEVBQThDO01BQUEsWUFBQSxFQUFjLElBQWQ7S0FBOUM7V0FDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFDLENBQUMsTUFBcEI7RUFkbUgsQ0FBckg7O0VBZ0JBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixvQkFBMUIsRUFBZ0QsZ0VBQWhELEVBQWtILENBQUMsS0FBRCxDQUFsSCxFQUEySCxTQUFDLEtBQUQsRUFBUSxNQUFSO0FBQ3pILFFBQUE7SUFBQyxZQUFELEVBQUksZUFBSixFQUFVO0lBRVYsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsSUFBcEIsRUFBMEIsS0FBMUIsRUFBaUMsQ0FBakMsRUFBb0MsQ0FBQyxDQUFDLE1BQXRDLEVBQThDO01BQUEsWUFBQSxFQUFjLElBQWQ7S0FBOUM7V0FDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFDLENBQUMsTUFBcEI7RUFKeUgsQ0FBM0g7QUE5RkEiLCJzb3VyY2VzQ29udGVudCI6WyJFeHByZXNzaW9uc1JlZ2lzdHJ5ID0gcmVxdWlyZSAnLi9leHByZXNzaW9ucy1yZWdpc3RyeSdcblZhcmlhYmxlRXhwcmVzc2lvbiA9IHJlcXVpcmUgJy4vdmFyaWFibGUtZXhwcmVzc2lvbidcblxubW9kdWxlLmV4cG9ydHMgPSByZWdpc3RyeSA9IG5ldyBFeHByZXNzaW9uc1JlZ2lzdHJ5KFZhcmlhYmxlRXhwcmVzc2lvbilcblxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6bGVzcycsICdeWyBcXFxcdF0qKEBbYS16QS1aMC05XFxcXC1fXSspXFxcXHMqOlxcXFxzKihbXjtcXFxcblxcXFxyXSspOz8nLCBbJ2xlc3MnXVxuXG4jIEl0IGNhdGNoZXMgc2VxdWVuY2VzIGxpa2UgYEBtaXhpbiBmb28oJGZvbzogMTApYCBhbmQgaWdub3JlcyB0aGVtLlxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6c2Nzc19wYXJhbXMnLCAnXlsgXFxcXHRdKkAobWl4aW58aW5jbHVkZXxmdW5jdGlvbilcXFxccytbYS16QS1aMC05XFxcXC1fXStcXFxccypcXFxcKFteXFxcXCldK1xcXFwpJywgWydzY3NzJywgJ3Nhc3MnLCAnaGFtbCddLCAobWF0Y2gsIHNvbHZlcikgLT5cbiAgW21hdGNoXSA9IG1hdGNoXG4gIHNvbHZlci5lbmRQYXJzaW5nKG1hdGNoLmxlbmd0aCAtIDEpXG5cbnNhc3NfaGFuZGxlciA9IChtYXRjaCwgc29sdmVyKSAtPlxuICBzb2x2ZXIuYXBwZW5kUmVzdWx0KG1hdGNoWzFdLCBtYXRjaFsyXSwgMCwgbWF0Y2hbMF0ubGVuZ3RoLCBpc0RlZmF1bHQ6IG1hdGNoWzNdPylcblxuICBpZiBtYXRjaFsxXS5tYXRjaCgvWy1fXS8pXG4gICAgYWxsX3VuZGVyc2NvcmUgPSBtYXRjaFsxXS5yZXBsYWNlKC8tL2csICdfJylcbiAgICBhbGxfaHlwaGVuID0gbWF0Y2hbMV0ucmVwbGFjZSgvXy9nLCAnLScpXG5cbiAgICBpZiBtYXRjaFsxXSBpc250IGFsbF91bmRlcnNjb3JlXG4gICAgICBzb2x2ZXIuYXBwZW5kUmVzdWx0KGFsbF91bmRlcnNjb3JlLCBtYXRjaFsyXSwgMCwgbWF0Y2hbMF0ubGVuZ3RoLCBpc0FsdGVybmF0ZTogdHJ1ZSwgaXNEZWZhdWx0OiBtYXRjaFszXT8pXG4gICAgaWYgbWF0Y2hbMV0gaXNudCBhbGxfaHlwaGVuXG4gICAgICBzb2x2ZXIuYXBwZW5kUmVzdWx0KGFsbF9oeXBoZW4sIG1hdGNoWzJdLCAwLCBtYXRjaFswXS5sZW5ndGgsIGlzQWx0ZXJuYXRlOiB0cnVlLCBpc0RlZmF1bHQ6IG1hdGNoWzNdPylcblxuICBzb2x2ZXIuZW5kUGFyc2luZyhtYXRjaFswXS5sZW5ndGgpXG5cbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOnNjc3MnLCAnXlsgXFxcXHRdKihcXFxcJFthLXpBLVowLTlcXFxcLV9dKylcXFxccyo6XFxcXHMqKC4qPykoXFxcXHMqIWRlZmF1bHQpP1xcXFxzKjsnLCBbJ3Njc3MnLCAnaGFtbCddLCBzYXNzX2hhbmRsZXJcblxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6c2FzcycsICdeWyBcXFxcdF0qKFxcXFwkW2EtekEtWjAtOVxcXFwtX10rKVxcXFxzKjpcXFxccyooW15cXFxce10qPykoXFxcXHMqIWRlZmF1bHQpP1xcXFxzKig/OiR8XFxcXC8pJywgWydzYXNzJywgJ2hhbWwnXSwgc2Fzc19oYW5kbGVyXG5cbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmNzc192YXJzJywgJygtLVteXFxcXHM6XSspOlxcXFxzKihbXlxcXFxuO10rKTsnLCBbJ2NzcyddLCAobWF0Y2gsIHNvbHZlcikgLT5cbiAgc29sdmVyLmFwcGVuZFJlc3VsdChcInZhcigje21hdGNoWzFdfSlcIiwgbWF0Y2hbMl0sIDAsIG1hdGNoWzBdLmxlbmd0aClcbiAgc29sdmVyLmVuZFBhcnNpbmcobWF0Y2hbMF0ubGVuZ3RoKVxuXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpzdHlsdXNfaGFzaCcsICdeWyBcXFxcdF0qKFthLXpBLVpfJF1bYS16QS1aMC05XFxcXC1fXSopXFxcXHMqPVxcXFxzKlxcXFx7KFtePV0qKVxcXFx9JywgWydzdHlsJywgJ3N0eWx1cyddLCAobWF0Y2gsIHNvbHZlcikgLT5cbiAgYnVmZmVyID0gJydcbiAgW21hdGNoLCBuYW1lLCBjb250ZW50XSA9IG1hdGNoXG4gIGN1cnJlbnQgPSBtYXRjaC5pbmRleE9mKGNvbnRlbnQpXG4gIHNjb3BlID0gW25hbWVdXG4gIHNjb3BlQmVnaW4gPSAvXFx7L1xuICBzY29wZUVuZCA9IC9cXH0vXG4gIGNvbW1hU2Vuc2l0aXZlQmVnaW4gPSAvXFwofFxcWy9cbiAgY29tbWFTZW5zaXRpdmVFbmQgPSAvXFwpfFxcXS9cbiAgaW5Db21tYVNlbnNpdGl2ZUNvbnRleHQgPSBmYWxzZVxuICBmb3IgY2hhciBpbiBjb250ZW50XG4gICAgaWYgc2NvcGVCZWdpbi50ZXN0KGNoYXIpXG4gICAgICBzY29wZS5wdXNoIGJ1ZmZlci5yZXBsYWNlKC9bXFxzOl0vZywgJycpXG4gICAgICBidWZmZXIgPSAnJ1xuICAgIGVsc2UgaWYgc2NvcGVFbmQudGVzdChjaGFyKVxuICAgICAgc2NvcGUucG9wKClcbiAgICAgIHJldHVybiBzb2x2ZXIuZW5kUGFyc2luZyhjdXJyZW50KSBpZiBzY29wZS5sZW5ndGggaXMgMFxuICAgIGVsc2UgaWYgY29tbWFTZW5zaXRpdmVCZWdpbi50ZXN0KGNoYXIpXG4gICAgICBidWZmZXIgKz0gY2hhclxuICAgICAgaW5Db21tYVNlbnNpdGl2ZUNvbnRleHQgPSB0cnVlXG4gICAgZWxzZSBpZiBpbkNvbW1hU2Vuc2l0aXZlQ29udGV4dFxuICAgICAgYnVmZmVyICs9IGNoYXJcbiAgICAgIGluQ29tbWFTZW5zaXRpdmVDb250ZXh0ID0gIWNvbW1hU2Vuc2l0aXZlRW5kLnRlc3QoY2hhcilcbiAgICBlbHNlIGlmIC9bLFxcbl0vLnRlc3QoY2hhcilcbiAgICAgIGJ1ZmZlciA9IGJ1ZmZlci5yZXBsYWNlKC9cXHMrL2csICcnKVxuICAgICAgaWYgYnVmZmVyLmxlbmd0aFxuICAgICAgICBba2V5LCB2YWx1ZV0gPSBidWZmZXIuc3BsaXQoL1xccyo6XFxzKi8pXG5cbiAgICAgICAgc29sdmVyLmFwcGVuZFJlc3VsdChzY29wZS5jb25jYXQoa2V5KS5qb2luKCcuJyksIHZhbHVlLCBjdXJyZW50IC0gYnVmZmVyLmxlbmd0aCAtIDEsIGN1cnJlbnQpXG5cbiAgICAgIGJ1ZmZlciA9ICcnXG4gICAgZWxzZVxuICAgICAgYnVmZmVyICs9IGNoYXJcblxuICAgIGN1cnJlbnQrK1xuXG4gIHNjb3BlLnBvcCgpXG4gIGlmIHNjb3BlLmxlbmd0aCBpcyAwXG4gICAgc29sdmVyLmVuZFBhcnNpbmcoY3VycmVudCArIDEpXG4gIGVsc2VcbiAgICBzb2x2ZXIuYWJvcnRQYXJzaW5nKClcblxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6c3R5bHVzJywgJ15bIFxcXFx0XSooW2EtekEtWl8kXVthLXpBLVowLTlcXFxcLV9dKilcXFxccyo9KD8hPSlcXFxccyooW15cXFxcblxcXFxyO10qKTs/JCcsIFsnc3R5bCcsICdzdHlsdXMnXVxuXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpsYXRleCcsICdcXFxcXFxcXGRlZmluZWNvbG9yKFxcXFx7W15cXFxcfV0rXFxcXH0pXFxcXHsoW15cXFxcfV0rKVxcXFx9XFxcXHsoW15cXFxcfV0rKVxcXFx9JywgWyd0ZXgnXSwgKG1hdGNoLCBzb2x2ZXIpIC0+XG4gIFtfLCBuYW1lLCBtb2RlLCB2YWx1ZV0gPSBtYXRjaFxuXG4gIHZhbHVlID0gc3dpdGNoIG1vZGVcbiAgICB3aGVuICdSR0InIHRoZW4gXCJyZ2IoI3t2YWx1ZX0pXCJcbiAgICB3aGVuICdncmF5JyB0aGVuIFwiZ3JheSgje01hdGgucm91bmQocGFyc2VGbG9hdCh2YWx1ZSkgKiAxMDApfSUpXCJcbiAgICB3aGVuICdyZ2InXG4gICAgICB2YWx1ZXMgPSB2YWx1ZS5zcGxpdCgnLCcpLm1hcCAobikgLT4gTWF0aC5mbG9vcihuICogMjU1KVxuICAgICAgXCJyZ2IoI3t2YWx1ZXMuam9pbignLCcpfSlcIlxuICAgIHdoZW4gJ2NteWsnIHRoZW4gXCJjbXlrKCN7dmFsdWV9KVwiXG4gICAgd2hlbiAnSFRNTCcgdGhlbiBcIiMje3ZhbHVlfVwiXG4gICAgZWxzZSB2YWx1ZVxuXG4gIHNvbHZlci5hcHBlbmRSZXN1bHQobmFtZSwgdmFsdWUsIDAsIF8ubGVuZ3RoLCBub05hbWVQcmVmaXg6IHRydWUpXG4gIHNvbHZlci5lbmRQYXJzaW5nKF8ubGVuZ3RoKVxuXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpsYXRleF9taXgnLCAnXFxcXFxcXFxkZWZpbmVjb2xvcihcXFxce1teXFxcXH1dK1xcXFx9KShcXFxce1teXFxcXH1cXFxcbiFdK1shXVteXFxcXH1cXFxcbl0rXFxcXH0pJywgWyd0ZXgnXSwgKG1hdGNoLCBzb2x2ZXIpIC0+XG4gIFtfLCBuYW1lLCB2YWx1ZV0gPSBtYXRjaFxuXG4gIHNvbHZlci5hcHBlbmRSZXN1bHQobmFtZSwgdmFsdWUsIDAsIF8ubGVuZ3RoLCBub05hbWVQcmVmaXg6IHRydWUpXG4gIHNvbHZlci5lbmRQYXJzaW5nKF8ubGVuZ3RoKVxuIl19
