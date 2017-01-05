
/*
Requires https://github.com/jaspervdj/stylish-haskell
 */

(function() {
  "use strict";
  var Beautifier, StylishHaskell,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = StylishHaskell = (function(superClass) {
    extend(StylishHaskell, superClass);

    function StylishHaskell() {
      return StylishHaskell.__super__.constructor.apply(this, arguments);
    }

    StylishHaskell.prototype.name = "stylish-haskell";

    StylishHaskell.prototype.link = "https://github.com/jaspervdj/stylish-haskell";

    StylishHaskell.prototype.options = {
      Haskell: true
    };

    StylishHaskell.prototype.beautify = function(text, language, options) {
      return this.run("stylish-haskell", [this.tempFile("input", text)], {
        help: {
          link: "https://github.com/jaspervdj/stylish-haskell"
        }
      });
    };

    return StylishHaskell;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvc3R5bGlzaC1oYXNrZWxsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSwwQkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7NkJBQ3JCLElBQUEsR0FBTTs7NkJBQ04sSUFBQSxHQUFNOzs2QkFFTixPQUFBLEdBQVM7TUFDUCxPQUFBLEVBQVMsSUFERjs7OzZCQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxpQkFBTCxFQUF3QixDQUN0QixJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FEc0IsQ0FBeEIsRUFFSztRQUNELElBQUEsRUFBTTtVQUNKLElBQUEsRUFBTSw4Q0FERjtTQURMO09BRkw7SUFEUTs7OztLQVJrQztBQVA5QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9naXRodWIuY29tL2phc3BlcnZkai9zdHlsaXNoLWhhc2tlbGxcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU3R5bGlzaEhhc2tlbGwgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwic3R5bGlzaC1oYXNrZWxsXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vamFzcGVydmRqL3N0eWxpc2gtaGFza2VsbFwiXG5cbiAgb3B0aW9uczoge1xuICAgIEhhc2tlbGw6IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgQHJ1bihcInN0eWxpc2gtaGFza2VsbFwiLCBbXG4gICAgICBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgICAgXSwge1xuICAgICAgICBoZWxwOiB7XG4gICAgICAgICAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vamFzcGVydmRqL3N0eWxpc2gtaGFza2VsbFwiXG4gICAgICAgIH1cbiAgICAgIH0pXG4iXX0=
