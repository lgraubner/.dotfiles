
/*
Requires https://github.com/erniebrodeur/ruby-beautify
 */

(function() {
  "use strict";
  var Beautifier, RubyBeautify,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = RubyBeautify = (function(superClass) {
    extend(RubyBeautify, superClass);

    function RubyBeautify() {
      return RubyBeautify.__super__.constructor.apply(this, arguments);
    }

    RubyBeautify.prototype.name = "Ruby Beautify";

    RubyBeautify.prototype.link = "https://github.com/erniebrodeur/ruby-beautify";

    RubyBeautify.prototype.options = {
      Ruby: {
        indent_size: true,
        indent_char: true
      }
    };

    RubyBeautify.prototype.beautify = function(text, language, options) {
      return this.run("rbeautify", [options.indent_char === '\t' ? "--tabs" : "--spaces", "--indent_count", options.indent_size, this.tempFile("input", text)], {
        help: {
          link: "https://github.com/erniebrodeur/ruby-beautify"
        }
      });
    };

    return RubyBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcnVieS1iZWF1dGlmeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQTtBQUpBLE1BQUEsd0JBQUE7SUFBQTs7O0VBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7OzJCQUNyQixJQUFBLEdBQU07OzJCQUNOLElBQUEsR0FBTTs7MkJBRU4sT0FBQSxHQUFTO01BQ1AsSUFBQSxFQUNFO1FBQUEsV0FBQSxFQUFhLElBQWI7UUFDQSxXQUFBLEVBQWEsSUFEYjtPQUZLOzs7MkJBTVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLLFdBQUwsRUFBa0IsQ0FDYixPQUFPLENBQUMsV0FBUixLQUF1QixJQUExQixHQUFvQyxRQUFwQyxHQUFrRCxVQURsQyxFQUVoQixnQkFGZ0IsRUFFRSxPQUFPLENBQUMsV0FGVixFQUdoQixJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FIZ0IsQ0FBbEIsRUFJSztRQUFBLElBQUEsRUFBTTtVQUNQLElBQUEsRUFBTSwrQ0FEQztTQUFOO09BSkw7SUFEUTs7OztLQVZnQztBQVA1QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9naXRodWIuY29tL2VybmllYnJvZGV1ci9ydWJ5LWJlYXV0aWZ5XG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJ1YnlCZWF1dGlmeSBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJSdWJ5IEJlYXV0aWZ5XCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vZXJuaWVicm9kZXVyL3J1YnktYmVhdXRpZnlcIlxuXG4gIG9wdGlvbnM6IHtcbiAgICBSdWJ5OlxuICAgICAgaW5kZW50X3NpemU6IHRydWVcbiAgICAgIGluZGVudF9jaGFyOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBydW4oXCJyYmVhdXRpZnlcIiwgW1xuICAgICAgaWYgb3B0aW9ucy5pbmRlbnRfY2hhciBpcyAnXFx0JyB0aGVuIFwiLS10YWJzXCIgZWxzZSBcIi0tc3BhY2VzXCJcbiAgICAgIFwiLS1pbmRlbnRfY291bnRcIiwgb3B0aW9ucy5pbmRlbnRfc2l6ZVxuICAgICAgQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dClcbiAgICAgIF0sIGhlbHA6IHtcbiAgICAgICAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vZXJuaWVicm9kZXVyL3J1YnktYmVhdXRpZnlcIlxuICAgICAgfSlcbiJdfQ==
