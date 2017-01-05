
/*
Requires https://github.com/hhatto/autopep8
 */

(function() {
  "use strict";
  var Beautifier, ErlTidy,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = ErlTidy = (function(superClass) {
    extend(ErlTidy, superClass);

    function ErlTidy() {
      return ErlTidy.__super__.constructor.apply(this, arguments);
    }

    ErlTidy.prototype.name = "erl_tidy";

    ErlTidy.prototype.link = "http://erlang.org/doc/man/erl_tidy.html";

    ErlTidy.prototype.options = {
      Erlang: true
    };

    ErlTidy.prototype.beautify = function(text, language, options) {
      var tempFile;
      tempFile = void 0;
      return this.tempFile("input", text).then((function(_this) {
        return function(path) {
          tempFile = path;
          return _this.run("erl", [["-eval", 'erl_tidy:file("' + tempFile + '")'], ["-noshell", "-s", "init", "stop"]], {
            help: {
              link: "http://erlang.org/doc/man/erl_tidy.html"
            }
          });
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return ErlTidy;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvZXJsX3RpZHkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLG1CQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OztzQkFFckIsSUFBQSxHQUFNOztzQkFDTixJQUFBLEdBQU07O3NCQUVOLE9BQUEsR0FBUztNQUNQLE1BQUEsRUFBUSxJQUREOzs7c0JBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixVQUFBO01BQUEsUUFBQSxHQUFXO2FBQ1gsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7VUFDNUIsUUFBQSxHQUFXO2lCQUNYLEtBQUMsQ0FBQSxHQUFELENBQUssS0FBTCxFQUFZLENBQ1YsQ0FBQyxPQUFELEVBQVUsaUJBQUEsR0FBb0IsUUFBcEIsR0FBK0IsSUFBekMsQ0FEVSxFQUVWLENBQUMsVUFBRCxFQUFhLElBQWIsRUFBbUIsTUFBbkIsRUFBMkIsTUFBM0IsQ0FGVSxDQUFaLEVBSUU7WUFBRSxJQUFBLEVBQU07Y0FBRSxJQUFBLEVBQU0seUNBQVI7YUFBUjtXQUpGO1FBRjRCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QixDQVFDLENBQUMsSUFSRixDQVFPLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDTCxLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVY7UUFESztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FSUDtJQUZROzs7O0tBVDJCO0FBUHZDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwczovL2dpdGh1Yi5jb20vaGhhdHRvL2F1dG9wZXA4XG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEVybFRpZHkgZXh0ZW5kcyBCZWF1dGlmaWVyXG5cbiAgbmFtZTogXCJlcmxfdGlkeVwiXG4gIGxpbms6IFwiaHR0cDovL2VybGFuZy5vcmcvZG9jL21hbi9lcmxfdGlkeS5odG1sXCJcblxuICBvcHRpb25zOiB7XG4gICAgRXJsYW5nOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIHRlbXBGaWxlID0gdW5kZWZpbmVkXG4gICAgQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dCkudGhlbigocGF0aCkgPT5cbiAgICAgIHRlbXBGaWxlID0gcGF0aFxuICAgICAgQHJ1bihcImVybFwiLCBbXG4gICAgICAgIFtcIi1ldmFsXCIsICdlcmxfdGlkeTpmaWxlKFwiJyArIHRlbXBGaWxlICsgJ1wiKSddXG4gICAgICAgIFtcIi1ub3NoZWxsXCIsIFwiLXNcIiwgXCJpbml0XCIsIFwic3RvcFwiXVxuICAgICAgICBdLFxuICAgICAgICB7IGhlbHA6IHsgbGluazogXCJodHRwOi8vZXJsYW5nLm9yZy9kb2MvbWFuL2VybF90aWR5Lmh0bWxcIiB9IH1cbiAgICAgICAgKVxuICAgICkudGhlbig9PlxuICAgICAgQHJlYWRGaWxlKHRlbXBGaWxlKVxuICAgIClcbiJdfQ==
