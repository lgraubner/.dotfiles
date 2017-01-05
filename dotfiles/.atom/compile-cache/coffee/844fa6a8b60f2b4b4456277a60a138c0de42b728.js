
/*
Requires https://github.com/google/yapf
 */

(function() {
  "use strict";
  var Beautifier, Yapf,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Yapf = (function(superClass) {
    extend(Yapf, superClass);

    function Yapf() {
      return Yapf.__super__.constructor.apply(this, arguments);
    }

    Yapf.prototype.name = "yapf";

    Yapf.prototype.link = "https://github.com/google/yapf";

    Yapf.prototype.options = {
      Python: false
    };

    Yapf.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.run("yapf", ["-i", tempFile = this.tempFile("input", text)], {
        help: {
          link: "https://github.com/google/yapf"
        },
        ignoreReturnCode: true
      }).then((function(_this) {
        return function() {
          if (options.sort_imports) {
            return _this.run("isort", [tempFile], {
              help: {
                link: "https://github.com/timothycrosley/isort"
              }
            }).then(function() {
              return _this.readFile(tempFile);
            });
          } else {
            return _this.readFile(tempFile);
          }
        };
      })(this));
    };

    return Yapf;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMveWFwZi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQTtBQUpBLE1BQUEsZ0JBQUE7SUFBQTs7O0VBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O21CQUVyQixJQUFBLEdBQU07O21CQUNOLElBQUEsR0FBTTs7bUJBRU4sT0FBQSxHQUFTO01BQ1AsTUFBQSxFQUFRLEtBREQ7OzttQkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7YUFBQSxJQUFDLENBQUEsR0FBRCxDQUFLLE1BQUwsRUFBYSxDQUNYLElBRFcsRUFFWCxRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBRkEsQ0FBYixFQUdLO1FBQUEsSUFBQSxFQUFNO1VBQ1AsSUFBQSxFQUFNLGdDQURDO1NBQU47UUFFQSxnQkFBQSxFQUFrQixJQUZsQjtPQUhMLENBTUUsQ0FBQyxJQU5ILENBTVEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ0osSUFBRyxPQUFPLENBQUMsWUFBWDttQkFDRSxLQUFDLENBQUEsR0FBRCxDQUFLLE9BQUwsRUFDRSxDQUFDLFFBQUQsQ0FERixFQUVFO2NBQUEsSUFBQSxFQUFNO2dCQUNKLElBQUEsRUFBTSx5Q0FERjtlQUFOO2FBRkYsQ0FLQSxDQUFDLElBTEQsQ0FLTSxTQUFBO3FCQUNKLEtBQUMsQ0FBQSxRQUFELENBQVUsUUFBVjtZQURJLENBTE4sRUFERjtXQUFBLE1BQUE7bUJBVUUsS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWLEVBVkY7O1FBREk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTlI7SUFEUTs7OztLQVR3QjtBQVBwQyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS95YXBmXG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFlhcGYgZXh0ZW5kcyBCZWF1dGlmaWVyXG5cbiAgbmFtZTogXCJ5YXBmXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL3lhcGZcIlxuXG4gIG9wdGlvbnM6IHtcbiAgICBQeXRob246IGZhbHNlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBydW4oXCJ5YXBmXCIsIFtcbiAgICAgIFwiLWlcIlxuICAgICAgdGVtcEZpbGUgPSBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgICAgXSwgaGVscDoge1xuICAgICAgICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUveWFwZlwiXG4gICAgICB9LCBpZ25vcmVSZXR1cm5Db2RlOiB0cnVlKVxuICAgICAgLnRoZW4oPT5cbiAgICAgICAgaWYgb3B0aW9ucy5zb3J0X2ltcG9ydHNcbiAgICAgICAgICBAcnVuKFwiaXNvcnRcIixcbiAgICAgICAgICAgIFt0ZW1wRmlsZV0sXG4gICAgICAgICAgICBoZWxwOiB7XG4gICAgICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL3RpbW90aHljcm9zbGV5L2lzb3J0XCJcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKD0+XG4gICAgICAgICAgICBAcmVhZEZpbGUodGVtcEZpbGUpXG4gICAgICAgICAgKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQHJlYWRGaWxlKHRlbXBGaWxlKVxuICAgICAgKVxuIl19
