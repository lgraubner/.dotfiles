
/*
Requires [dfmt](https://github.com/Hackerpilot/dfmt)
 */

(function() {
  "use strict";
  var Beautifier, Dfmt,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Dfmt = (function(superClass) {
    extend(Dfmt, superClass);

    function Dfmt() {
      return Dfmt.__super__.constructor.apply(this, arguments);
    }

    Dfmt.prototype.name = "dfmt";

    Dfmt.prototype.link = "https://github.com/Hackerpilot/dfmt";

    Dfmt.prototype.options = {
      D: false
    };

    Dfmt.prototype.beautify = function(text, language, options) {
      return this.run("dfmt", [this.tempFile("input", text)]);
    };

    return Dfmt;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvZGZtdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFHQTtBQUhBLE1BQUEsZ0JBQUE7SUFBQTs7O0VBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O21CQUNyQixJQUFBLEdBQU07O21CQUNOLElBQUEsR0FBTTs7bUJBRU4sT0FBQSxHQUFTO01BQ1AsQ0FBQSxFQUFHLEtBREk7OzttQkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssTUFBTCxFQUFhLENBQ1gsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBRFcsQ0FBYjtJQURROzs7O0tBUndCO0FBTnBDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBbZGZtdF0oaHR0cHM6Ly9naXRodWIuY29tL0hhY2tlcnBpbG90L2RmbXQpXG4jIyNcblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBEZm10IGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcImRmbXRcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9IYWNrZXJwaWxvdC9kZm10XCJcblxuICBvcHRpb25zOiB7XG4gICAgRDogZmFsc2VcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgQHJ1bihcImRmbXRcIiwgW1xuICAgICAgQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dClcbiAgICAgIF0pXG4iXX0=
