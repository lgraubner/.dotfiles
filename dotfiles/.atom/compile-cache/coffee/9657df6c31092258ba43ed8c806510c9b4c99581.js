
/*
Requires [formatR](https://github.com/yihui/formatR)
 */

(function() {
  var Beautifier, R, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  path = require("path");

  "use strict";

  Beautifier = require('../beautifier');

  module.exports = R = (function(superClass) {
    extend(R, superClass);

    function R() {
      return R.__super__.constructor.apply(this, arguments);
    }

    R.prototype.name = "formatR";

    R.prototype.link = "https://github.com/yihui/formatR";

    R.prototype.options = {
      R: true
    };

    R.prototype.beautify = function(text, language, options) {
      var r_beautifier;
      r_beautifier = path.resolve(__dirname, "formatR.r");
      return this.run("Rscript", [r_beautifier, options.indent_size, this.tempFile("input", text), '>', this.tempFile("input", text)]);
    };

    return R;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvZm9ybWF0Ui9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7QUFBQSxNQUFBLG1CQUFBO0lBQUE7OztFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUDs7RUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7Z0JBQ3JCLElBQUEsR0FBTTs7Z0JBQ04sSUFBQSxHQUFNOztnQkFFTixPQUFBLEdBQVM7TUFDUCxDQUFBLEVBQUcsSUFESTs7O2dCQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBQ1IsVUFBQTtNQUFBLFlBQUEsR0FBZSxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBd0IsV0FBeEI7YUFDZixJQUFDLENBQUEsR0FBRCxDQUFLLFNBQUwsRUFBZ0IsQ0FDZCxZQURjLEVBRWQsT0FBTyxDQUFDLFdBRk0sRUFHZCxJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FIYyxFQUlkLEdBSmMsRUFLZCxJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FMYyxDQUFoQjtJQUZROzs7O0tBUnFCO0FBUmpDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBbZm9ybWF0Ul0oaHR0cHM6Ly9naXRodWIuY29tL3lpaHVpL2Zvcm1hdFIpXG4jIyNcbnBhdGggPSByZXF1aXJlKFwicGF0aFwiKVxuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4uL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFIgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiZm9ybWF0UlwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL3lpaHVpL2Zvcm1hdFJcIlxuXG4gIG9wdGlvbnM6IHtcbiAgICBSOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIHJfYmVhdXRpZmllciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiZm9ybWF0Ui5yXCIpXG4gICAgQHJ1bihcIlJzY3JpcHRcIiwgW1xuICAgICAgcl9iZWF1dGlmaWVyLFxuICAgICAgb3B0aW9ucy5pbmRlbnRfc2l6ZSxcbiAgICAgIEB0ZW1wRmlsZShcImlucHV0XCIsIHRleHQpLFxuICAgICAgJz4nLFxuICAgICAgQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dClcbiAgICAgIF0pXG4iXX0=
