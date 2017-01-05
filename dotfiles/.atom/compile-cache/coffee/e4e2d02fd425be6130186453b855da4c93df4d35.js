
/*
Requires https://github.com/hhatto/autopep8
 */

(function() {
  "use strict";
  var Autopep8, Beautifier,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Autopep8 = (function(superClass) {
    extend(Autopep8, superClass);

    function Autopep8() {
      return Autopep8.__super__.constructor.apply(this, arguments);
    }

    Autopep8.prototype.name = "autopep8";

    Autopep8.prototype.link = "https://github.com/hhatto/autopep8";

    Autopep8.prototype.options = {
      Python: true
    };

    Autopep8.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.run("autopep8", [tempFile = this.tempFile("input", text), "-i", options.max_line_length != null ? ["--max-line-length", "" + options.max_line_length] : void 0, options.indent_size != null ? ["--indent-size", "" + options.indent_size] : void 0, options.ignore != null ? ["--ignore", "" + (options.ignore.join(','))] : void 0], {
        help: {
          link: "https://github.com/hhatto/autopep8"
        }
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

    return Autopep8;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvYXV0b3BlcDguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLG9CQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7Ozt1QkFFckIsSUFBQSxHQUFNOzt1QkFDTixJQUFBLEdBQU07O3VCQUVOLE9BQUEsR0FBUztNQUNQLE1BQUEsRUFBUSxJQUREOzs7dUJBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixVQUFBO2FBQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxVQUFMLEVBQWlCLENBQ2YsUUFBQSxHQUFXLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQURJLEVBRWYsSUFGZSxFQUd3QywrQkFBdkQsR0FBQSxDQUFDLG1CQUFELEVBQXNCLEVBQUEsR0FBRyxPQUFPLENBQUMsZUFBakMsQ0FBQSxHQUFBLE1BSGUsRUFJK0IsMkJBQTlDLEdBQUEsQ0FBQyxlQUFELEVBQWlCLEVBQUEsR0FBRyxPQUFPLENBQUMsV0FBNUIsQ0FBQSxHQUFBLE1BSmUsRUFLK0Isc0JBQTlDLEdBQUEsQ0FBQyxVQUFELEVBQVksRUFBQSxHQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFmLENBQW9CLEdBQXBCLENBQUQsQ0FBZCxDQUFBLEdBQUEsTUFMZSxDQUFqQixFQU1LO1FBQUEsSUFBQSxFQUFNO1VBQ1AsSUFBQSxFQUFNLG9DQURDO1NBQU47T0FOTCxDQVNFLENBQUMsSUFUSCxDQVNRLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNKLElBQUcsT0FBTyxDQUFDLFlBQVg7bUJBQ0UsS0FBQyxDQUFBLEdBQUQsQ0FBSyxPQUFMLEVBQ0UsQ0FBQyxRQUFELENBREYsRUFFRTtjQUFBLElBQUEsRUFBTTtnQkFDSixJQUFBLEVBQU0seUNBREY7ZUFBTjthQUZGLENBS0EsQ0FBQyxJQUxELENBS00sU0FBQTtxQkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVY7WUFESSxDQUxOLEVBREY7V0FBQSxNQUFBO21CQVVFLEtBQUMsQ0FBQSxRQUFELENBQVUsUUFBVixFQVZGOztRQURJO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVRSO0lBRFE7Ozs7S0FUNEI7QUFQeEMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHBzOi8vZ2l0aHViLmNvbS9oaGF0dG8vYXV0b3BlcDhcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQXV0b3BlcDggZXh0ZW5kcyBCZWF1dGlmaWVyXG5cbiAgbmFtZTogXCJhdXRvcGVwOFwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2hoYXR0by9hdXRvcGVwOFwiXG5cbiAgb3B0aW9uczoge1xuICAgIFB5dGhvbjogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAcnVuKFwiYXV0b3BlcDhcIiwgW1xuICAgICAgdGVtcEZpbGUgPSBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgICAgXCItaVwiXG4gICAgICBbXCItLW1heC1saW5lLWxlbmd0aFwiLCBcIiN7b3B0aW9ucy5tYXhfbGluZV9sZW5ndGh9XCJdIGlmIG9wdGlvbnMubWF4X2xpbmVfbGVuZ3RoP1xuICAgICAgW1wiLS1pbmRlbnQtc2l6ZVwiLFwiI3tvcHRpb25zLmluZGVudF9zaXplfVwiXSBpZiBvcHRpb25zLmluZGVudF9zaXplP1xuICAgICAgW1wiLS1pZ25vcmVcIixcIiN7b3B0aW9ucy5pZ25vcmUuam9pbignLCcpfVwiXSBpZiBvcHRpb25zLmlnbm9yZT9cbiAgICAgIF0sIGhlbHA6IHtcbiAgICAgICAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vaGhhdHRvL2F1dG9wZXA4XCJcbiAgICAgIH0pXG4gICAgICAudGhlbig9PlxuICAgICAgICBpZiBvcHRpb25zLnNvcnRfaW1wb3J0c1xuICAgICAgICAgIEBydW4oXCJpc29ydFwiLFxuICAgICAgICAgICAgW3RlbXBGaWxlXSxcbiAgICAgICAgICAgIGhlbHA6IHtcbiAgICAgICAgICAgICAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vdGltb3RoeWNyb3NsZXkvaXNvcnRcIlxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4oPT5cbiAgICAgICAgICAgIEByZWFkRmlsZSh0ZW1wRmlsZSlcbiAgICAgICAgICApXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAcmVhZEZpbGUodGVtcEZpbGUpXG4gICAgICApXG4iXX0=
