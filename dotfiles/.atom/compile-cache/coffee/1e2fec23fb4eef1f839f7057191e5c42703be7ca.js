(function() {
  var ColorScanner, countLines;

  countLines = null;

  module.exports = ColorScanner = (function() {
    function ColorScanner(arg) {
      this.context = (arg != null ? arg : {}).context;
      this.parser = this.context.parser;
      this.registry = this.context.registry;
    }

    ColorScanner.prototype.getRegExp = function() {
      return new RegExp(this.registry.getRegExp(), 'g');
    };

    ColorScanner.prototype.getRegExpForScope = function(scope) {
      return new RegExp(this.registry.getRegExpForScope(scope), 'g');
    };

    ColorScanner.prototype.search = function(text, scope, start) {
      var color, index, lastIndex, match, matchText, regexp;
      if (start == null) {
        start = 0;
      }
      if (countLines == null) {
        countLines = require('./utils').countLines;
      }
      regexp = this.getRegExpForScope(scope);
      regexp.lastIndex = start;
      if (match = regexp.exec(text)) {
        matchText = match[0];
        lastIndex = regexp.lastIndex;
        color = this.parser.parse(matchText, scope);
        if ((index = matchText.indexOf(color.colorExpression)) > 0) {
          lastIndex += -matchText.length + index + color.colorExpression.length;
          matchText = color.colorExpression;
        }
        return {
          color: color,
          match: matchText,
          lastIndex: lastIndex,
          range: [lastIndex - matchText.length, lastIndex],
          line: countLines(text.slice(0, +(lastIndex - matchText.length) + 1 || 9e9)) - 1
        };
      }
    };

    return ColorScanner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLXNjYW5uZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxVQUFBLEdBQWE7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLHNCQUFDLEdBQUQ7TUFBRSxJQUFDLENBQUEseUJBQUYsTUFBVyxJQUFUO01BQ2QsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsT0FBTyxDQUFDO01BQ25CLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLE9BQU8sQ0FBQztJQUZWOzsyQkFJYixTQUFBLEdBQVcsU0FBQTthQUNMLElBQUEsTUFBQSxDQUFPLElBQUMsQ0FBQSxRQUFRLENBQUMsU0FBVixDQUFBLENBQVAsRUFBOEIsR0FBOUI7SUFESzs7MkJBR1gsaUJBQUEsR0FBbUIsU0FBQyxLQUFEO2FBQ2IsSUFBQSxNQUFBLENBQU8sSUFBQyxDQUFBLFFBQVEsQ0FBQyxpQkFBVixDQUE0QixLQUE1QixDQUFQLEVBQTJDLEdBQTNDO0lBRGE7OzJCQUduQixNQUFBLEdBQVEsU0FBQyxJQUFELEVBQU8sS0FBUCxFQUFjLEtBQWQ7QUFDTixVQUFBOztRQURvQixRQUFNOztNQUMxQixJQUF3QyxrQkFBeEM7UUFBQyxhQUFjLE9BQUEsQ0FBUSxTQUFSLGFBQWY7O01BRUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixLQUFuQjtNQUNULE1BQU0sQ0FBQyxTQUFQLEdBQW1CO01BRW5CLElBQUcsS0FBQSxHQUFRLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBWixDQUFYO1FBQ0csWUFBYTtRQUNiLFlBQWE7UUFFZCxLQUFBLEdBQVEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLENBQWMsU0FBZCxFQUF5QixLQUF6QjtRQUlSLElBQUcsQ0FBQyxLQUFBLEdBQVEsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsS0FBSyxDQUFDLGVBQXhCLENBQVQsQ0FBQSxHQUFxRCxDQUF4RDtVQUNFLFNBQUEsSUFBYSxDQUFDLFNBQVMsQ0FBQyxNQUFYLEdBQW9CLEtBQXBCLEdBQTRCLEtBQUssQ0FBQyxlQUFlLENBQUM7VUFDL0QsU0FBQSxHQUFZLEtBQUssQ0FBQyxnQkFGcEI7O2VBSUE7VUFBQSxLQUFBLEVBQU8sS0FBUDtVQUNBLEtBQUEsRUFBTyxTQURQO1VBRUEsU0FBQSxFQUFXLFNBRlg7VUFHQSxLQUFBLEVBQU8sQ0FDTCxTQUFBLEdBQVksU0FBUyxDQUFDLE1BRGpCLEVBRUwsU0FGSyxDQUhQO1VBT0EsSUFBQSxFQUFNLFVBQUEsQ0FBVyxJQUFLLHFEQUFoQixDQUFBLEdBQW9ELENBUDFEO1VBWkY7O0lBTk07Ozs7O0FBZFYiLCJzb3VyY2VzQ29udGVudCI6WyJjb3VudExpbmVzID0gbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDb2xvclNjYW5uZXJcbiAgY29uc3RydWN0b3I6ICh7QGNvbnRleHR9PXt9KSAtPlxuICAgIEBwYXJzZXIgPSBAY29udGV4dC5wYXJzZXJcbiAgICBAcmVnaXN0cnkgPSBAY29udGV4dC5yZWdpc3RyeVxuXG4gIGdldFJlZ0V4cDogLT5cbiAgICBuZXcgUmVnRXhwKEByZWdpc3RyeS5nZXRSZWdFeHAoKSwgJ2cnKVxuXG4gIGdldFJlZ0V4cEZvclNjb3BlOiAoc2NvcGUpIC0+XG4gICAgbmV3IFJlZ0V4cChAcmVnaXN0cnkuZ2V0UmVnRXhwRm9yU2NvcGUoc2NvcGUpLCAnZycpXG5cbiAgc2VhcmNoOiAodGV4dCwgc2NvcGUsIHN0YXJ0PTApIC0+XG4gICAge2NvdW50TGluZXN9ID0gcmVxdWlyZSAnLi91dGlscycgdW5sZXNzIGNvdW50TGluZXM/XG5cbiAgICByZWdleHAgPSBAZ2V0UmVnRXhwRm9yU2NvcGUoc2NvcGUpXG4gICAgcmVnZXhwLmxhc3RJbmRleCA9IHN0YXJ0XG5cbiAgICBpZiBtYXRjaCA9IHJlZ2V4cC5leGVjKHRleHQpXG4gICAgICBbbWF0Y2hUZXh0XSA9IG1hdGNoXG4gICAgICB7bGFzdEluZGV4fSA9IHJlZ2V4cFxuXG4gICAgICBjb2xvciA9IEBwYXJzZXIucGFyc2UobWF0Y2hUZXh0LCBzY29wZSlcblxuICAgICAgIyByZXR1cm4gdW5sZXNzIGNvbG9yP1xuXG4gICAgICBpZiAoaW5kZXggPSBtYXRjaFRleHQuaW5kZXhPZihjb2xvci5jb2xvckV4cHJlc3Npb24pKSA+IDBcbiAgICAgICAgbGFzdEluZGV4ICs9IC1tYXRjaFRleHQubGVuZ3RoICsgaW5kZXggKyBjb2xvci5jb2xvckV4cHJlc3Npb24ubGVuZ3RoXG4gICAgICAgIG1hdGNoVGV4dCA9IGNvbG9yLmNvbG9yRXhwcmVzc2lvblxuXG4gICAgICBjb2xvcjogY29sb3JcbiAgICAgIG1hdGNoOiBtYXRjaFRleHRcbiAgICAgIGxhc3RJbmRleDogbGFzdEluZGV4XG4gICAgICByYW5nZTogW1xuICAgICAgICBsYXN0SW5kZXggLSBtYXRjaFRleHQubGVuZ3RoXG4gICAgICAgIGxhc3RJbmRleFxuICAgICAgXVxuICAgICAgbGluZTogY291bnRMaW5lcyh0ZXh0WzAuLmxhc3RJbmRleCAtIG1hdGNoVGV4dC5sZW5ndGhdKSAtIDFcbiJdfQ==
