(function() {
  var CompositeDisposable, PigmentsProvider, _, ref, variablesRegExp;

  ref = [], CompositeDisposable = ref[0], variablesRegExp = ref[1], _ = ref[2];

  module.exports = PigmentsProvider = (function() {
    function PigmentsProvider(pigments) {
      this.pigments = pigments;
      if (CompositeDisposable == null) {
        CompositeDisposable = require('atom').CompositeDisposable;
      }
      this.subscriptions = new CompositeDisposable;
      this.selector = atom.config.get('pigments.autocompleteScopes').join(',');
      this.subscriptions.add(atom.config.observe('pigments.autocompleteScopes', (function(_this) {
        return function(scopes) {
          return _this.selector = scopes.join(',');
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.extendAutocompleteToVariables', (function(_this) {
        return function(extendAutocompleteToVariables) {
          _this.extendAutocompleteToVariables = extendAutocompleteToVariables;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.extendAutocompleteToColorValue', (function(_this) {
        return function(extendAutocompleteToColorValue) {
          _this.extendAutocompleteToColorValue = extendAutocompleteToColorValue;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.autocompleteSuggestionsFromValue', (function(_this) {
        return function(autocompleteSuggestionsFromValue) {
          _this.autocompleteSuggestionsFromValue = autocompleteSuggestionsFromValue;
        };
      })(this)));
    }

    PigmentsProvider.prototype.dispose = function() {
      this.disposed = true;
      this.subscriptions.dispose();
      return this.pigments = null;
    };

    PigmentsProvider.prototype.getProject = function() {
      if (this.disposed) {
        return;
      }
      return this.pigments.getProject();
    };

    PigmentsProvider.prototype.getSuggestions = function(arg) {
      var bufferPosition, editor, prefix, project, suggestions, variables;
      editor = arg.editor, bufferPosition = arg.bufferPosition;
      if (this.disposed) {
        return;
      }
      prefix = this.getPrefix(editor, bufferPosition);
      project = this.getProject();
      if (!(prefix != null ? prefix.length : void 0)) {
        return;
      }
      if (project == null) {
        return;
      }
      if (this.extendAutocompleteToVariables) {
        variables = project.getVariables();
      } else {
        variables = project.getColorVariables();
      }
      suggestions = this.findSuggestionsForPrefix(variables, prefix);
      return suggestions;
    };

    PigmentsProvider.prototype.getPrefix = function(editor, bufferPosition) {
      var line, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
      if (variablesRegExp == null) {
        variablesRegExp = require('./regexes').variables;
      }
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      if (this.autocompleteSuggestionsFromValue) {
        return (ref1 = (ref2 = (ref3 = (ref4 = (ref5 = line.match(/(?:#[a-fA-F0-9]*|rgb.+)$/)) != null ? ref5[0] : void 0) != null ? ref4 : (ref6 = line.match(new RegExp("(" + variablesRegExp + ")$"))) != null ? ref6[0] : void 0) != null ? ref3 : (ref7 = line.match(/:\s*([^\s].+)$/)) != null ? ref7[1] : void 0) != null ? ref2 : (ref8 = line.match(/^\s*([^\s].+)$/)) != null ? ref8[1] : void 0) != null ? ref1 : '';
      } else {
        return ((ref9 = line.match(new RegExp("(" + variablesRegExp + ")$"))) != null ? ref9[0] : void 0) || '';
      }
    };

    PigmentsProvider.prototype.findSuggestionsForPrefix = function(variables, prefix) {
      var matchedVariables, matchesColorValue, re, suggestions;
      if (variables == null) {
        return [];
      }
      if (_ == null) {
        _ = require('underscore-plus');
      }
      re = RegExp("^" + (_.escapeRegExp(prefix).replace(/,\s*/, '\\s*,\\s*')));
      suggestions = [];
      matchesColorValue = function(v) {
        var res;
        res = re.test(v.value);
        if (v.color != null) {
          res || (res = v.color.suggestionValues.some(function(s) {
            return re.test(s);
          }));
        }
        return res;
      };
      matchedVariables = variables.filter((function(_this) {
        return function(v) {
          return !v.isAlternate && re.test(v.name) || (_this.autocompleteSuggestionsFromValue && matchesColorValue(v));
        };
      })(this));
      matchedVariables.forEach((function(_this) {
        return function(v) {
          var color, rightLabelHTML;
          if (v.isColor) {
            color = v.color.alpha === 1 ? '#' + v.color.hex : v.color.toCSS();
            rightLabelHTML = "<span class='color-suggestion-preview' style='background: " + (v.color.toCSS()) + "'></span>";
            if (_this.extendAutocompleteToColorValue) {
              rightLabelHTML = color + " " + rightLabelHTML;
            }
            return suggestions.push({
              text: v.name,
              rightLabelHTML: rightLabelHTML,
              replacementPrefix: prefix,
              className: 'color-suggestion'
            });
          } else {
            return suggestions.push({
              text: v.name,
              rightLabel: v.value,
              replacementPrefix: prefix,
              className: 'pigments-suggestion'
            });
          }
        };
      })(this));
      return suggestions;
    };

    return PigmentsProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3BpZ21lbnRzLXByb3ZpZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFFSSxFQUZKLEVBQ0UsNEJBREYsRUFDdUIsd0JBRHZCLEVBQ3dDOztFQUd4QyxNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1MsMEJBQUMsUUFBRDtNQUFDLElBQUMsQ0FBQSxXQUFEOztRQUNaLHNCQUF1QixPQUFBLENBQVEsTUFBUixDQUFlLENBQUM7O01BRXZDLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDckIsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLENBQThDLENBQUMsSUFBL0MsQ0FBb0QsR0FBcEQ7TUFFWixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLDZCQUFwQixFQUFtRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRDtpQkFDcEUsS0FBQyxDQUFBLFFBQUQsR0FBWSxNQUFNLENBQUMsSUFBUCxDQUFZLEdBQVo7UUFEd0Q7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5ELENBQW5CO01BRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQix3Q0FBcEIsRUFBOEQsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLDZCQUFEO1VBQUMsS0FBQyxDQUFBLGdDQUFEO1FBQUQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlELENBQW5CO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFv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QUMsQ0FBQyxJQUFWLENBQXRCLElBQ0EsQ0FBQyxLQUFDLENBQUEsZ0NBQUQsSUFBc0MsaUJBQUEsQ0FBa0IsQ0FBbEIsQ0FBdkM7UUFGa0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpCO01BSW5CLGdCQUFnQixDQUFDLE9BQWpCLENBQXlCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO0FBQ3ZCLGNBQUE7VUFBQSxJQUFHLENBQUMsQ0FBQyxPQUFMO1lBQ0UsS0FBQSxHQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBUixLQUFpQixDQUFwQixHQUEyQixHQUFBLEdBQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUF6QyxHQUFrRCxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQVIsQ0FBQTtZQUMxRCxjQUFBLEdBQWlCLDREQUFBLEdBQTRELENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFSLENBQUEsQ0FBRCxDQUE1RCxHQUE2RTtZQUM5RixJQUFpRCxLQUFDLENBQUEsOEJBQWxEO2NBQUEsY0FBQSxHQUFvQixLQUFELEdBQU8sR0FBUCxHQUFVLGVBQTdCOzttQkFFQSxXQUFXLENBQUMsSUFBWixDQUFpQjtjQUNmLElBQUEsRUFBTSxDQUFDLENBQUMsSUFETztjQUVmLGdCQUFBLGNBRmU7Y0FHZixpQkFBQSxFQUFtQixNQUhKO2NBSWYsU0FBQSxFQUFXLGtCQUpJO2FBQWpCLEVBTEY7V0FBQSxNQUFBO21CQVlFLFdBQVcsQ0FBQyxJQUFaLENBQWlCO2NBQ2YsSUFBQSxFQUFNLENBQUMsQ0FBQyxJQURPO2NBRWYsVUFBQSxFQUFZLENBQUMsQ0FBQyxLQUZDO2NBR2YsaUJBQUEsRUFBbUIsTUFISjtjQUlmLFNBQUEsRUFBVyxxQkFKSTthQUFqQixFQVpGOztRQUR1QjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekI7YUFvQkE7SUFyQ3dCOzs7OztBQXpENUIiLCJzb3VyY2VzQ29udGVudCI6WyJbXG4gIENvbXBvc2l0ZURpc3Bvc2FibGUsIHZhcmlhYmxlc1JlZ0V4cCwgX1xuXSA9IFtdXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFBpZ21lbnRzUHJvdmlkZXJcbiAgY29uc3RydWN0b3I6IChAcGlnbWVudHMpIC0+XG4gICAgQ29tcG9zaXRlRGlzcG9zYWJsZSA/PSByZXF1aXJlKCdhdG9tJykuQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzZWxlY3RvciA9IGF0b20uY29uZmlnLmdldCgncGlnbWVudHMuYXV0b2NvbXBsZXRlU2NvcGVzJykuam9pbignLCcpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAncGlnbWVudHMuYXV0b2NvbXBsZXRlU2NvcGVzJywgKHNjb3BlcykgPT5cbiAgICAgIEBzZWxlY3RvciA9IHNjb3Blcy5qb2luKCcsJylcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAncGlnbWVudHMuZXh0ZW5kQXV0b2NvbXBsZXRlVG9WYXJpYWJsZXMnLCAoQGV4dGVuZEF1dG9jb21wbGV0ZVRvVmFyaWFibGVzKSA9PlxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdwaWdtZW50cy5leHRlbmRBdXRvY29tcGxldGVUb0NvbG9yVmFsdWUnLCAoQGV4dGVuZEF1dG9jb21wbGV0ZVRvQ29sb3JWYWx1ZSkgPT5cblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdwaWdtZW50cy5hdXRvY29tcGxldGVTdWdnZXN0aW9uc0Zyb21WYWx1ZScsIChAYXV0b2NvbXBsZXRlU3VnZ2VzdGlvbnNGcm9tVmFsdWUpID0+XG5cbiAgZGlzcG9zZTogLT5cbiAgICBAZGlzcG9zZWQgPSB0cnVlXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgQHBpZ21lbnRzID0gbnVsbFxuXG4gIGdldFByb2plY3Q6IC0+XG4gICAgcmV0dXJuIGlmIEBkaXNwb3NlZFxuICAgIEBwaWdtZW50cy5nZXRQcm9qZWN0KClcblxuICBnZXRTdWdnZXN0aW9uczogKHtlZGl0b3IsIGJ1ZmZlclBvc2l0aW9ufSkgLT5cbiAgICByZXR1cm4gaWYgQGRpc3Bvc2VkXG4gICAgcHJlZml4ID0gQGdldFByZWZpeChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKVxuICAgIHByb2plY3QgPSBAZ2V0UHJvamVjdCgpXG5cbiAgICByZXR1cm4gdW5sZXNzIHByZWZpeD8ubGVuZ3RoXG4gICAgcmV0dXJuIHVubGVzcyBwcm9qZWN0P1xuXG4gICAgaWYgQGV4dGVuZEF1dG9jb21wbGV0ZVRvVmFyaWFibGVzXG4gICAgICB2YXJpYWJsZXMgPSBwcm9qZWN0LmdldFZhcmlhYmxlcygpXG4gICAgZWxzZVxuICAgICAgdmFyaWFibGVzID0gcHJvamVjdC5nZXRDb2xvclZhcmlhYmxlcygpXG5cbiAgICBzdWdnZXN0aW9ucyA9IEBmaW5kU3VnZ2VzdGlvbnNGb3JQcmVmaXgodmFyaWFibGVzLCBwcmVmaXgpXG4gICAgc3VnZ2VzdGlvbnNcblxuICBnZXRQcmVmaXg6IChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSAtPlxuICAgIHZhcmlhYmxlc1JlZ0V4cCA/PSByZXF1aXJlKCcuL3JlZ2V4ZXMnKS52YXJpYWJsZXNcbiAgICBsaW5lID0gZWRpdG9yLmdldFRleHRJblJhbmdlKFtbYnVmZmVyUG9zaXRpb24ucm93LCAwXSwgYnVmZmVyUG9zaXRpb25dKVxuXG4gICAgaWYgQGF1dG9jb21wbGV0ZVN1Z2dlc3Rpb25zRnJvbVZhbHVlXG4gICAgICBsaW5lLm1hdGNoKC8oPzojW2EtZkEtRjAtOV0qfHJnYi4rKSQvKT9bMF0gP1xuICAgICAgbGluZS5tYXRjaChuZXcgUmVnRXhwKFwiKCN7dmFyaWFibGVzUmVnRXhwfSkkXCIpKT9bMF0gP1xuICAgICAgbGluZS5tYXRjaCgvOlxccyooW15cXHNdLispJC8pP1sxXSA/XG4gICAgICBsaW5lLm1hdGNoKC9eXFxzKihbXlxcc10uKykkLyk/WzFdID9cbiAgICAgICcnXG4gICAgZWxzZVxuICAgICAgbGluZS5tYXRjaChuZXcgUmVnRXhwKFwiKCN7dmFyaWFibGVzUmVnRXhwfSkkXCIpKT9bMF0gb3IgJydcblxuICBmaW5kU3VnZ2VzdGlvbnNGb3JQcmVmaXg6ICh2YXJpYWJsZXMsIHByZWZpeCkgLT5cbiAgICByZXR1cm4gW10gdW5sZXNzIHZhcmlhYmxlcz9cblxuICAgIF8gPz0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xuXG4gICAgcmUgPSAvLy9eI3tfLmVzY2FwZVJlZ0V4cChwcmVmaXgpLnJlcGxhY2UoLyxcXHMqLywgJ1xcXFxzKixcXFxccyonKX0vLy9cblxuICAgIHN1Z2dlc3Rpb25zID0gW11cbiAgICBtYXRjaGVzQ29sb3JWYWx1ZSA9ICh2KSAtPlxuICAgICAgcmVzID0gcmUudGVzdCh2LnZhbHVlKVxuICAgICAgcmVzIHx8PSB2LmNvbG9yLnN1Z2dlc3Rpb25WYWx1ZXMuc29tZSgocykgLT4gcmUudGVzdChzKSkgaWYgdi5jb2xvcj9cbiAgICAgIHJlc1xuXG4gICAgbWF0Y2hlZFZhcmlhYmxlcyA9IHZhcmlhYmxlcy5maWx0ZXIgKHYpID0+XG4gICAgICBub3Qgdi5pc0FsdGVybmF0ZSBhbmQgcmUudGVzdCh2Lm5hbWUpIG9yXG4gICAgICAoQGF1dG9jb21wbGV0ZVN1Z2dlc3Rpb25zRnJvbVZhbHVlIGFuZCBtYXRjaGVzQ29sb3JWYWx1ZSh2KSlcblxuICAgIG1hdGNoZWRWYXJpYWJsZXMuZm9yRWFjaCAodikgPT5cbiAgICAgIGlmIHYuaXNDb2xvclxuICAgICAgICBjb2xvciA9IGlmIHYuY29sb3IuYWxwaGEgPT0gMSB0aGVuICcjJyArIHYuY29sb3IuaGV4IGVsc2Ugdi5jb2xvci50b0NTUygpO1xuICAgICAgICByaWdodExhYmVsSFRNTCA9IFwiPHNwYW4gY2xhc3M9J2NvbG9yLXN1Z2dlc3Rpb24tcHJldmlldycgc3R5bGU9J2JhY2tncm91bmQ6ICN7di5jb2xvci50b0NTUygpfSc+PC9zcGFuPlwiXG4gICAgICAgIHJpZ2h0TGFiZWxIVE1MID0gXCIje2NvbG9yfSAje3JpZ2h0TGFiZWxIVE1MfVwiIGlmIEBleHRlbmRBdXRvY29tcGxldGVUb0NvbG9yVmFsdWVcblxuICAgICAgICBzdWdnZXN0aW9ucy5wdXNoIHtcbiAgICAgICAgICB0ZXh0OiB2Lm5hbWVcbiAgICAgICAgICByaWdodExhYmVsSFRNTFxuICAgICAgICAgIHJlcGxhY2VtZW50UHJlZml4OiBwcmVmaXhcbiAgICAgICAgICBjbGFzc05hbWU6ICdjb2xvci1zdWdnZXN0aW9uJ1xuICAgICAgICB9XG4gICAgICBlbHNlXG4gICAgICAgIHN1Z2dlc3Rpb25zLnB1c2gge1xuICAgICAgICAgIHRleHQ6IHYubmFtZVxuICAgICAgICAgIHJpZ2h0TGFiZWw6IHYudmFsdWVcbiAgICAgICAgICByZXBsYWNlbWVudFByZWZpeDogcHJlZml4XG4gICAgICAgICAgY2xhc3NOYW1lOiAncGlnbWVudHMtc3VnZ2VzdGlvbidcbiAgICAgICAgfVxuXG4gICAgc3VnZ2VzdGlvbnNcbiJdfQ==
