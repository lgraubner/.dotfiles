(function() {
  "use strict";
  var Beautifier, CoffeeFormatter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = CoffeeFormatter = (function(superClass) {
    extend(CoffeeFormatter, superClass);

    function CoffeeFormatter() {
      return CoffeeFormatter.__super__.constructor.apply(this, arguments);
    }

    CoffeeFormatter.prototype.name = "Coffee Formatter";

    CoffeeFormatter.prototype.link = "https://github.com/Glavin001/Coffee-Formatter";

    CoffeeFormatter.prototype.options = {
      CoffeeScript: true
    };

    CoffeeFormatter.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var CF, curr, i, len, lines, p, result, resultArr;
        CF = require("coffee-formatter");
        lines = text.split("\n");
        resultArr = [];
        i = 0;
        len = lines.length;
        while (i < len) {
          curr = lines[i];
          p = CF.formatTwoSpaceOperator(curr);
          p = CF.formatOneSpaceOperator(p);
          p = CF.shortenSpaces(p);
          resultArr.push(p);
          i++;
        }
        result = resultArr.join("\n");
        return resolve(result);
      });
    };

    return CoffeeFormatter;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvY29mZmVlLWZvcm1hdHRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsMkJBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7OzhCQUVyQixJQUFBLEdBQU07OzhCQUNOLElBQUEsR0FBTTs7OEJBRU4sT0FBQSxHQUFTO01BQ1AsWUFBQSxFQUFjLElBRFA7Ozs4QkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUVSLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFFbEIsWUFBQTtRQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsa0JBQVI7UUFDTCxLQUFBLEdBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYO1FBQ1IsU0FBQSxHQUFZO1FBQ1osQ0FBQSxHQUFJO1FBQ0osR0FBQSxHQUFNLEtBQUssQ0FBQztBQUVaLGVBQU0sQ0FBQSxHQUFJLEdBQVY7VUFDRSxJQUFBLEdBQU8sS0FBTSxDQUFBLENBQUE7VUFDYixDQUFBLEdBQUksRUFBRSxDQUFDLHNCQUFILENBQTBCLElBQTFCO1VBQ0osQ0FBQSxHQUFJLEVBQUUsQ0FBQyxzQkFBSCxDQUEwQixDQUExQjtVQUNKLENBQUEsR0FBSSxFQUFFLENBQUMsYUFBSCxDQUFpQixDQUFqQjtVQUNKLFNBQVMsQ0FBQyxJQUFWLENBQWUsQ0FBZjtVQUNBLENBQUE7UUFORjtRQU9BLE1BQUEsR0FBUyxTQUFTLENBQUMsSUFBVixDQUFlLElBQWY7ZUFDVCxPQUFBLENBQVEsTUFBUjtNQWhCa0IsQ0FBVDtJQUZIOzs7O0tBVG1DO0FBSC9DIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIENvZmZlZUZvcm1hdHRlciBleHRlbmRzIEJlYXV0aWZpZXJcblxuICBuYW1lOiBcIkNvZmZlZSBGb3JtYXR0ZXJcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9HbGF2aW4wMDEvQ29mZmVlLUZvcm1hdHRlclwiXG5cbiAgb3B0aW9uczoge1xuICAgIENvZmZlZVNjcmlwdDogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cblxuICAgIHJldHVybiBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgLT5cblxuICAgICAgQ0YgPSByZXF1aXJlKFwiY29mZmVlLWZvcm1hdHRlclwiKVxuICAgICAgbGluZXMgPSB0ZXh0LnNwbGl0KFwiXFxuXCIpXG4gICAgICByZXN1bHRBcnIgPSBbXVxuICAgICAgaSA9IDBcbiAgICAgIGxlbiA9IGxpbmVzLmxlbmd0aFxuXG4gICAgICB3aGlsZSBpIDwgbGVuXG4gICAgICAgIGN1cnIgPSBsaW5lc1tpXVxuICAgICAgICBwID0gQ0YuZm9ybWF0VHdvU3BhY2VPcGVyYXRvcihjdXJyKVxuICAgICAgICBwID0gQ0YuZm9ybWF0T25lU3BhY2VPcGVyYXRvcihwKVxuICAgICAgICBwID0gQ0Yuc2hvcnRlblNwYWNlcyhwKVxuICAgICAgICByZXN1bHRBcnIucHVzaCBwXG4gICAgICAgIGkrK1xuICAgICAgcmVzdWx0ID0gcmVzdWx0QXJyLmpvaW4oXCJcXG5cIilcbiAgICAgIHJlc29sdmUgcmVzdWx0XG5cbiAgICApXG4iXX0=
