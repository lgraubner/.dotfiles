
/*
Requires http://hhvm.com/
 */

(function() {
  "use strict";
  var Beautifier, HhFormat,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = HhFormat = (function(superClass) {
    extend(HhFormat, superClass);

    function HhFormat() {
      return HhFormat.__super__.constructor.apply(this, arguments);
    }

    HhFormat.prototype.name = "hh_format";

    HhFormat.prototype.link = "http://hhvm.com/";

    HhFormat.prototype.options = {
      PHP: false
    };

    HhFormat.prototype.beautify = function(text, language, options) {
      return this.run("hh_format", [this.tempFile("input", text)], {
        help: {
          link: "http://hhvm.com/"
        }
      }).then(function(output) {
        if (output.trim()) {
          return output;
        } else {
          return this.Promise.resolve(new Error("hh_format returned an empty output."));
        }
      });
    };

    return HhFormat;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvaGhfZm9ybWF0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSxvQkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7dUJBQ3JCLElBQUEsR0FBTTs7dUJBQ04sSUFBQSxHQUFNOzt1QkFFTixPQUFBLEdBQ0U7TUFBQSxHQUFBLEVBQUssS0FBTDs7O3VCQUVGLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxXQUFMLEVBQWtCLENBQ2hCLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQURnQixDQUFsQixFQUdBO1FBQ0UsSUFBQSxFQUFNO1VBQ0osSUFBQSxFQUFNLGtCQURGO1NBRFI7T0FIQSxDQU9FLENBQUMsSUFQSCxDQU9RLFNBQUMsTUFBRDtRQUdOLElBQUcsTUFBTSxDQUFDLElBQVAsQ0FBQSxDQUFIO2lCQUNFLE9BREY7U0FBQSxNQUFBO2lCQUdFLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFxQixJQUFBLEtBQUEsQ0FBTSxxQ0FBTixDQUFyQixFQUhGOztNQUhNLENBUFI7SUFEUTs7OztLQVA0QjtBQVB4QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cDovL2hodm0uY29tL1xuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBIaEZvcm1hdCBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJoaF9mb3JtYXRcIlxuICBsaW5rOiBcImh0dHA6Ly9oaHZtLmNvbS9cIlxuXG4gIG9wdGlvbnM6XG4gICAgUEhQOiBmYWxzZVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgQHJ1bihcImhoX2Zvcm1hdFwiLCBbXG4gICAgICBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgIF0sXG4gICAge1xuICAgICAgaGVscDoge1xuICAgICAgICBsaW5rOiBcImh0dHA6Ly9oaHZtLmNvbS9cIlxuICAgICAgfVxuICAgIH0pLnRoZW4oKG91dHB1dCkgLT5cbiAgICAgICMgaGhfZm9ybWF0IGNhbiBleGl0IHdpdGggc3RhdHVzIDAgYW5kIG5vIG91dHB1dCBmb3Igc29tZSBmaWxlcyB3aGljaFxuICAgICAgIyBpdCBkb2Vzbid0IGZvcm1hdC4gIEluIHRoYXQgY2FzZSB3ZSBqdXN0IHJldHVybiBvcmlnaW5hbCB0ZXh0LlxuICAgICAgaWYgb3V0cHV0LnRyaW0oKVxuICAgICAgICBvdXRwdXRcbiAgICAgIGVsc2VcbiAgICAgICAgQFByb21pc2UucmVzb2x2ZShuZXcgRXJyb3IoXCJoaF9mb3JtYXQgcmV0dXJuZWQgYW4gZW1wdHkgb3V0cHV0LlwiKSlcbiAgICApXG4iXX0=
