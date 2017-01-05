(function() {
  var VariableExpression;

  module.exports = VariableExpression = (function() {
    VariableExpression.DEFAULT_HANDLE = function(match, solver) {
      var _, end, name, start, value;
      _ = match[0], name = match[1], value = match[2];
      start = _.indexOf(name);
      end = _.indexOf(value) + value.length;
      solver.appendResult(name, value, start, end);
      return solver.endParsing(end);
    };

    function VariableExpression(arg) {
      this.name = arg.name, this.regexpString = arg.regexpString, this.scopes = arg.scopes, this.priority = arg.priority, this.handle = arg.handle;
      this.regexp = new RegExp("" + this.regexpString, 'm');
      if (this.handle == null) {
        this.handle = this.constructor.DEFAULT_HANDLE;
      }
    }

    VariableExpression.prototype.match = function(expression) {
      return this.regexp.test(expression);
    };

    VariableExpression.prototype.parse = function(expression) {
      var lastIndex, match, matchText, parsingAborted, results, solver, startIndex;
      parsingAborted = false;
      results = [];
      match = this.regexp.exec(expression);
      if (match != null) {
        matchText = match[0];
        lastIndex = this.regexp.lastIndex;
        startIndex = lastIndex - matchText.length;
        solver = {
          endParsing: function(end) {
            var start;
            start = expression.indexOf(matchText);
            results.lastIndex = end;
            results.range = [start, end];
            return results.match = matchText.slice(start, end);
          },
          abortParsing: function() {
            return parsingAborted = true;
          },
          appendResult: function(name, value, start, end, arg) {
            var isAlternate, isDefault, noNamePrefix, range, reName, ref;
            ref = arg != null ? arg : {}, isAlternate = ref.isAlternate, noNamePrefix = ref.noNamePrefix, isDefault = ref.isDefault;
            range = [start, end];
            reName = name.replace('$', '\\$');
            if (!RegExp(reName + "(?![-_])").test(value)) {
              return results.push({
                name: name,
                value: value,
                range: range,
                isAlternate: isAlternate,
                noNamePrefix: noNamePrefix,
                "default": isDefault
              });
            }
          }
        };
        this.handle(match, solver);
      }
      if (parsingAborted) {
        return void 0;
      } else {
        return results;
      }
    };

    return VariableExpression;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3ZhcmlhYmxlLWV4cHJlc3Npb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ0osa0JBQUMsQ0FBQSxjQUFELEdBQWlCLFNBQUMsS0FBRCxFQUFRLE1BQVI7QUFDZixVQUFBO01BQUMsWUFBRCxFQUFJLGVBQUosRUFBVTtNQUNWLEtBQUEsR0FBUSxDQUFDLENBQUMsT0FBRixDQUFVLElBQVY7TUFDUixHQUFBLEdBQU0sQ0FBQyxDQUFDLE9BQUYsQ0FBVSxLQUFWLENBQUEsR0FBbUIsS0FBSyxDQUFDO01BQy9CLE1BQU0sQ0FBQyxZQUFQLENBQW9CLElBQXBCLEVBQTBCLEtBQTFCLEVBQWlDLEtBQWpDLEVBQXdDLEdBQXhDO2FBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEI7SUFMZTs7SUFPSiw0QkFBQyxHQUFEO01BQUUsSUFBQyxDQUFBLFdBQUEsTUFBTSxJQUFDLENBQUEsbUJBQUEsY0FBYyxJQUFDLENBQUEsYUFBQSxRQUFRLElBQUMsQ0FBQSxlQUFBLFVBQVUsSUFBQyxDQUFBLGFBQUE7TUFDeEQsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLE1BQUEsQ0FBTyxFQUFBLEdBQUcsSUFBQyxDQUFBLFlBQVgsRUFBMkIsR0FBM0I7O1FBQ2QsSUFBQyxDQUFBLFNBQVUsSUFBQyxDQUFBLFdBQVcsQ0FBQzs7SUFGYjs7aUNBSWIsS0FBQSxHQUFPLFNBQUMsVUFBRDthQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxVQUFiO0lBQWhCOztpQ0FFUCxLQUFBLEdBQU8sU0FBQyxVQUFEO0FBQ0wsVUFBQTtNQUFBLGNBQUEsR0FBaUI7TUFDakIsT0FBQSxHQUFVO01BRVYsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLFVBQWI7TUFDUixJQUFHLGFBQUg7UUFFRyxZQUFhO1FBQ2IsWUFBYSxJQUFDLENBQUE7UUFDZixVQUFBLEdBQWEsU0FBQSxHQUFZLFNBQVMsQ0FBQztRQUVuQyxNQUFBLEdBQ0U7VUFBQSxVQUFBLEVBQVksU0FBQyxHQUFEO0FBQ1YsZ0JBQUE7WUFBQSxLQUFBLEdBQVEsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsU0FBbkI7WUFDUixPQUFPLENBQUMsU0FBUixHQUFvQjtZQUNwQixPQUFPLENBQUMsS0FBUixHQUFnQixDQUFDLEtBQUQsRUFBTyxHQUFQO21CQUNoQixPQUFPLENBQUMsS0FBUixHQUFnQixTQUFVO1VBSmhCLENBQVo7VUFLQSxZQUFBLEVBQWMsU0FBQTttQkFDWixjQUFBLEdBQWlCO1VBREwsQ0FMZDtVQU9BLFlBQUEsRUFBYyxTQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsS0FBZCxFQUFxQixHQUFyQixFQUEwQixHQUExQjtBQUNaLGdCQUFBO2dDQURzQyxNQUF1QyxJQUF0QywrQkFBYSxpQ0FBYztZQUNsRSxLQUFBLEdBQVEsQ0FBQyxLQUFELEVBQVEsR0FBUjtZQUNSLE1BQUEsR0FBUyxJQUFJLENBQUMsT0FBTCxDQUFhLEdBQWIsRUFBa0IsS0FBbEI7WUFDVCxJQUFBLENBQU8sTUFBQSxDQUFLLE1BQUQsR0FBUSxVQUFaLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsS0FBN0IsQ0FBUDtxQkFDRSxPQUFPLENBQUMsSUFBUixDQUFhO2dCQUNYLE1BQUEsSUFEVztnQkFDTCxPQUFBLEtBREs7Z0JBQ0UsT0FBQSxLQURGO2dCQUNTLGFBQUEsV0FEVDtnQkFDc0IsY0FBQSxZQUR0QjtnQkFFWCxDQUFBLE9BQUEsQ0FBQSxFQUFTLFNBRkU7ZUFBYixFQURGOztVQUhZLENBUGQ7O1FBZ0JGLElBQUMsQ0FBQSxNQUFELENBQVEsS0FBUixFQUFlLE1BQWYsRUF2QkY7O01BeUJBLElBQUcsY0FBSDtlQUF1QixPQUF2QjtPQUFBLE1BQUE7ZUFBc0MsUUFBdEM7O0lBOUJLOzs7OztBQWZUIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgVmFyaWFibGVFeHByZXNzaW9uXG4gIEBERUZBVUxUX0hBTkRMRTogKG1hdGNoLCBzb2x2ZXIpIC0+XG4gICAgW18sIG5hbWUsIHZhbHVlXSA9IG1hdGNoXG4gICAgc3RhcnQgPSBfLmluZGV4T2YobmFtZSlcbiAgICBlbmQgPSBfLmluZGV4T2YodmFsdWUpICsgdmFsdWUubGVuZ3RoXG4gICAgc29sdmVyLmFwcGVuZFJlc3VsdChuYW1lLCB2YWx1ZSwgc3RhcnQsIGVuZClcbiAgICBzb2x2ZXIuZW5kUGFyc2luZyhlbmQpXG5cbiAgY29uc3RydWN0b3I6ICh7QG5hbWUsIEByZWdleHBTdHJpbmcsIEBzY29wZXMsIEBwcmlvcml0eSwgQGhhbmRsZX0pIC0+XG4gICAgQHJlZ2V4cCA9IG5ldyBSZWdFeHAoXCIje0ByZWdleHBTdHJpbmd9XCIsICdtJylcbiAgICBAaGFuZGxlID89IEBjb25zdHJ1Y3Rvci5ERUZBVUxUX0hBTkRMRVxuXG4gIG1hdGNoOiAoZXhwcmVzc2lvbikgLT4gQHJlZ2V4cC50ZXN0IGV4cHJlc3Npb25cblxuICBwYXJzZTogKGV4cHJlc3Npb24pIC0+XG4gICAgcGFyc2luZ0Fib3J0ZWQgPSBmYWxzZVxuICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgbWF0Y2ggPSBAcmVnZXhwLmV4ZWMoZXhwcmVzc2lvbilcbiAgICBpZiBtYXRjaD9cblxuICAgICAgW21hdGNoVGV4dF0gPSBtYXRjaFxuICAgICAge2xhc3RJbmRleH0gPSBAcmVnZXhwXG4gICAgICBzdGFydEluZGV4ID0gbGFzdEluZGV4IC0gbWF0Y2hUZXh0Lmxlbmd0aFxuXG4gICAgICBzb2x2ZXIgPVxuICAgICAgICBlbmRQYXJzaW5nOiAoZW5kKSAtPlxuICAgICAgICAgIHN0YXJ0ID0gZXhwcmVzc2lvbi5pbmRleE9mKG1hdGNoVGV4dClcbiAgICAgICAgICByZXN1bHRzLmxhc3RJbmRleCA9IGVuZFxuICAgICAgICAgIHJlc3VsdHMucmFuZ2UgPSBbc3RhcnQsZW5kXVxuICAgICAgICAgIHJlc3VsdHMubWF0Y2ggPSBtYXRjaFRleHRbc3RhcnQuLi5lbmRdXG4gICAgICAgIGFib3J0UGFyc2luZzogLT5cbiAgICAgICAgICBwYXJzaW5nQWJvcnRlZCA9IHRydWVcbiAgICAgICAgYXBwZW5kUmVzdWx0OiAobmFtZSwgdmFsdWUsIHN0YXJ0LCBlbmQsIHtpc0FsdGVybmF0ZSwgbm9OYW1lUHJlZml4LCBpc0RlZmF1bHR9PXt9KSAtPlxuICAgICAgICAgIHJhbmdlID0gW3N0YXJ0LCBlbmRdXG4gICAgICAgICAgcmVOYW1lID0gbmFtZS5yZXBsYWNlKCckJywgJ1xcXFwkJylcbiAgICAgICAgICB1bmxlc3MgLy8vI3tyZU5hbWV9KD8hWy1fXSkvLy8udGVzdCh2YWx1ZSlcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCB7XG4gICAgICAgICAgICAgIG5hbWUsIHZhbHVlLCByYW5nZSwgaXNBbHRlcm5hdGUsIG5vTmFtZVByZWZpeFxuICAgICAgICAgICAgICBkZWZhdWx0OiBpc0RlZmF1bHRcbiAgICAgICAgICAgIH1cblxuICAgICAgQGhhbmRsZShtYXRjaCwgc29sdmVyKVxuXG4gICAgaWYgcGFyc2luZ0Fib3J0ZWQgdGhlbiB1bmRlZmluZWQgZWxzZSByZXN1bHRzXG4iXX0=
