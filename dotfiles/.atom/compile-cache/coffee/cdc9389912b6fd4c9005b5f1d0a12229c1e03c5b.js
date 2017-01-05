(function() {
  var VariableParser, VariableScanner, countLines, ref;

  ref = [], VariableParser = ref[0], countLines = ref[1];

  module.exports = VariableScanner = (function() {
    function VariableScanner(params) {
      if (params == null) {
        params = {};
      }
      if (VariableParser == null) {
        VariableParser = require('./variable-parser');
      }
      this.parser = params.parser, this.registry = params.registry, this.scope = params.scope;
      if (this.parser == null) {
        this.parser = new VariableParser(this.registry);
      }
    }

    VariableScanner.prototype.getRegExp = function() {
      return new RegExp(this.registry.getRegExpForScope(this.scope), 'gm');
    };

    VariableScanner.prototype.search = function(text, start) {
      var i, index, lastIndex, len, line, lineCountIndex, match, matchText, regexp, result, v;
      if (start == null) {
        start = 0;
      }
      if (this.registry.getExpressionsForScope(this.scope).length === 0) {
        return;
      }
      if (countLines == null) {
        countLines = require('./utils').countLines;
      }
      regexp = this.getRegExp();
      regexp.lastIndex = start;
      while (match = regexp.exec(text)) {
        matchText = match[0];
        index = match.index;
        lastIndex = regexp.lastIndex;
        result = this.parser.parse(matchText);
        if (result != null) {
          result.lastIndex += index;
          if (result.length > 0) {
            result.range[0] += index;
            result.range[1] += index;
            line = -1;
            lineCountIndex = 0;
            for (i = 0, len = result.length; i < len; i++) {
              v = result[i];
              v.range[0] += index;
              v.range[1] += index;
              line = v.line = line + countLines(text.slice(lineCountIndex, +v.range[0] + 1 || 9e9));
              lineCountIndex = v.range[0];
            }
            return result;
          } else {
            regexp.lastIndex = result.lastIndex;
          }
        }
      }
      return void 0;
    };

    return VariableScanner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3ZhcmlhYmxlLXNjYW5uZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUErQixFQUEvQixFQUFDLHVCQUFELEVBQWlCOztFQUVqQixNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1MseUJBQUMsTUFBRDs7UUFBQyxTQUFPOzs7UUFDbkIsaUJBQWtCLE9BQUEsQ0FBUSxtQkFBUjs7TUFFakIsSUFBQyxDQUFBLGdCQUFBLE1BQUYsRUFBVSxJQUFDLENBQUEsa0JBQUEsUUFBWCxFQUFxQixJQUFDLENBQUEsZUFBQTs7UUFDdEIsSUFBQyxDQUFBLFNBQWMsSUFBQSxjQUFBLENBQWUsSUFBQyxDQUFBLFFBQWhCOztJQUpKOzs4QkFNYixTQUFBLEdBQVcsU0FBQTthQUNMLElBQUEsTUFBQSxDQUFPLElBQUMsQ0FBQSxRQUFRLENBQUMsaUJBQVYsQ0FBNEIsSUFBQyxDQUFBLEtBQTdCLENBQVAsRUFBNEMsSUFBNUM7SUFESzs7OEJBR1gsTUFBQSxHQUFRLFNBQUMsSUFBRCxFQUFPLEtBQVA7QUFDTixVQUFBOztRQURhLFFBQU07O01BQ25CLElBQVUsSUFBQyxDQUFBLFFBQVEsQ0FBQyxzQkFBVixDQUFpQyxJQUFDLENBQUEsS0FBbEMsQ0FBd0MsQ0FBQyxNQUF6QyxLQUFtRCxDQUE3RDtBQUFBLGVBQUE7OztRQUVBLGFBQWMsT0FBQSxDQUFRLFNBQVIsQ0FBa0IsQ0FBQzs7TUFFakMsTUFBQSxHQUFTLElBQUMsQ0FBQSxTQUFELENBQUE7TUFDVCxNQUFNLENBQUMsU0FBUCxHQUFtQjtBQUVuQixhQUFNLEtBQUEsR0FBUSxNQUFNLENBQUMsSUFBUCxDQUFZLElBQVosQ0FBZDtRQUNHLFlBQWE7UUFDYixRQUFTO1FBQ1QsWUFBYTtRQUVkLE1BQUEsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsQ0FBYyxTQUFkO1FBRVQsSUFBRyxjQUFIO1VBQ0UsTUFBTSxDQUFDLFNBQVAsSUFBb0I7VUFFcEIsSUFBRyxNQUFNLENBQUMsTUFBUCxHQUFnQixDQUFuQjtZQUNFLE1BQU0sQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFiLElBQW1CO1lBQ25CLE1BQU0sQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFiLElBQW1CO1lBRW5CLElBQUEsR0FBTyxDQUFDO1lBQ1IsY0FBQSxHQUFpQjtBQUVqQixpQkFBQSx3Q0FBQTs7Y0FDRSxDQUFDLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBUixJQUFjO2NBQ2QsQ0FBQyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQVIsSUFBYztjQUNkLElBQUEsR0FBTyxDQUFDLENBQUMsSUFBRixHQUFTLElBQUEsR0FBTyxVQUFBLENBQVcsSUFBSyw4Q0FBaEI7Y0FDdkIsY0FBQSxHQUFpQixDQUFDLENBQUMsS0FBTSxDQUFBLENBQUE7QUFKM0I7QUFNQSxtQkFBTyxPQWJUO1dBQUEsTUFBQTtZQWVFLE1BQU0sQ0FBQyxTQUFQLEdBQW1CLE1BQU0sQ0FBQyxVQWY1QjtXQUhGOztNQVBGO0FBMkJBLGFBQU87SUFuQ0Q7Ozs7O0FBYlYiLCJzb3VyY2VzQ29udGVudCI6WyJbVmFyaWFibGVQYXJzZXIsIGNvdW50TGluZXNdID0gW11cblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgVmFyaWFibGVTY2FubmVyXG4gIGNvbnN0cnVjdG9yOiAocGFyYW1zPXt9KSAtPlxuICAgIFZhcmlhYmxlUGFyc2VyID89IHJlcXVpcmUgJy4vdmFyaWFibGUtcGFyc2VyJ1xuXG4gICAge0BwYXJzZXIsIEByZWdpc3RyeSwgQHNjb3BlfSA9IHBhcmFtc1xuICAgIEBwYXJzZXIgPz0gbmV3IFZhcmlhYmxlUGFyc2VyKEByZWdpc3RyeSlcblxuICBnZXRSZWdFeHA6IC0+XG4gICAgbmV3IFJlZ0V4cChAcmVnaXN0cnkuZ2V0UmVnRXhwRm9yU2NvcGUoQHNjb3BlKSwgJ2dtJylcblxuICBzZWFyY2g6ICh0ZXh0LCBzdGFydD0wKSAtPlxuICAgIHJldHVybiBpZiBAcmVnaXN0cnkuZ2V0RXhwcmVzc2lvbnNGb3JTY29wZShAc2NvcGUpLmxlbmd0aCBpcyAwXG5cbiAgICBjb3VudExpbmVzID89IHJlcXVpcmUoJy4vdXRpbHMnKS5jb3VudExpbmVzXG5cbiAgICByZWdleHAgPSBAZ2V0UmVnRXhwKClcbiAgICByZWdleHAubGFzdEluZGV4ID0gc3RhcnRcblxuICAgIHdoaWxlIG1hdGNoID0gcmVnZXhwLmV4ZWModGV4dClcbiAgICAgIFttYXRjaFRleHRdID0gbWF0Y2hcbiAgICAgIHtpbmRleH0gPSBtYXRjaFxuICAgICAge2xhc3RJbmRleH0gPSByZWdleHBcblxuICAgICAgcmVzdWx0ID0gQHBhcnNlci5wYXJzZShtYXRjaFRleHQpXG5cbiAgICAgIGlmIHJlc3VsdD9cbiAgICAgICAgcmVzdWx0Lmxhc3RJbmRleCArPSBpbmRleFxuXG4gICAgICAgIGlmIHJlc3VsdC5sZW5ndGggPiAwXG4gICAgICAgICAgcmVzdWx0LnJhbmdlWzBdICs9IGluZGV4XG4gICAgICAgICAgcmVzdWx0LnJhbmdlWzFdICs9IGluZGV4XG5cbiAgICAgICAgICBsaW5lID0gLTFcbiAgICAgICAgICBsaW5lQ291bnRJbmRleCA9IDBcblxuICAgICAgICAgIGZvciB2IGluIHJlc3VsdFxuICAgICAgICAgICAgdi5yYW5nZVswXSArPSBpbmRleFxuICAgICAgICAgICAgdi5yYW5nZVsxXSArPSBpbmRleFxuICAgICAgICAgICAgbGluZSA9IHYubGluZSA9IGxpbmUgKyBjb3VudExpbmVzKHRleHRbbGluZUNvdW50SW5kZXguLnYucmFuZ2VbMF1dKVxuICAgICAgICAgICAgbGluZUNvdW50SW5kZXggPSB2LnJhbmdlWzBdXG5cbiAgICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZWdleHAubGFzdEluZGV4ID0gcmVzdWx0Lmxhc3RJbmRleFxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuIl19
