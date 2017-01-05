
/*
Requires https://www.gnu.org/software/emacs/
 */

(function() {
  "use strict";
  var Beautifier, FortranBeautifier, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('../beautifier');

  path = require("path");

  module.exports = FortranBeautifier = (function(superClass) {
    extend(FortranBeautifier, superClass);

    function FortranBeautifier() {
      return FortranBeautifier.__super__.constructor.apply(this, arguments);
    }

    FortranBeautifier.prototype.name = "Fortran Beautifier";

    FortranBeautifier.prototype.link = "https://github.com/Glavin001/atom-beautify/blob/master/src/beautifiers/fortran-beautifier/emacs-fortran-formating-script.lisp";

    FortranBeautifier.prototype.options = {
      Fortran: true
    };

    FortranBeautifier.prototype.beautify = function(text, language, options) {
      var args, emacs_path, emacs_script_path, tempFile;
      this.debug('fortran-beautifier', options);
      emacs_path = options.emacs_path;
      emacs_script_path = options.emacs_script_path;
      if (!emacs_script_path) {
        emacs_script_path = path.resolve(__dirname, "emacs-fortran-formating-script.lisp");
      }
      this.debug('fortran-beautifier', 'emacs script path: ' + emacs_script_path);
      args = ['--batch', '-l', emacs_script_path, '-f', 'f90-batch-indent-region', tempFile = this.tempFile("temp", text)];
      if (emacs_path) {
        return this.run(emacs_path, args, {
          ignoreReturnCode: false
        }).then((function(_this) {
          return function() {
            return _this.readFile(tempFile);
          };
        })(this));
      } else {
        return this.run("emacs", args, {
          ignoreReturnCode: false
        }).then((function(_this) {
          return function() {
            return _this.readFile(tempFile);
          };
        })(this));
      }
    };

    return FortranBeautifier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvZm9ydHJhbi1iZWF1dGlmaWVyL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSxtQ0FBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVI7O0VBQ2IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O2dDQUNyQixJQUFBLEdBQU07O2dDQUNOLElBQUEsR0FBTTs7Z0NBRU4sT0FBQSxHQUFTO01BQ1AsT0FBQSxFQUFTLElBREY7OztnQ0FJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7TUFBQSxJQUFDLENBQUEsS0FBRCxDQUFPLG9CQUFQLEVBQTZCLE9BQTdCO01BRUEsVUFBQSxHQUFhLE9BQU8sQ0FBQztNQUNyQixpQkFBQSxHQUFvQixPQUFPLENBQUM7TUFFNUIsSUFBRyxDQUFJLGlCQUFQO1FBQ0UsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLHFDQUF4QixFQUR0Qjs7TUFHQSxJQUFDLENBQUEsS0FBRCxDQUFPLG9CQUFQLEVBQTZCLHFCQUFBLEdBQXdCLGlCQUFyRDtNQUVBLElBQUEsR0FBTyxDQUNMLFNBREssRUFFTCxJQUZLLEVBR0wsaUJBSEssRUFJTCxJQUpLLEVBS0wseUJBTEssRUFNTCxRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxNQUFWLEVBQWtCLElBQWxCLENBTk47TUFTUCxJQUFHLFVBQUg7ZUFDRSxJQUFDLENBQUEsR0FBRCxDQUFLLFVBQUwsRUFBaUIsSUFBakIsRUFBdUI7VUFBQyxnQkFBQSxFQUFrQixLQUFuQjtTQUF2QixDQUNFLENBQUMsSUFESCxDQUNRLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1VBREk7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFIsRUFERjtPQUFBLE1BQUE7ZUFNRSxJQUFDLENBQUEsR0FBRCxDQUFLLE9BQUwsRUFBYyxJQUFkLEVBQW9CO1VBQUMsZ0JBQUEsRUFBa0IsS0FBbkI7U0FBcEIsQ0FDRSxDQUFDLElBREgsQ0FDUSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUNKLEtBQUMsQ0FBQSxRQUFELENBQVUsUUFBVjtVQURJO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURSLEVBTkY7O0lBcEJROzs7O0tBUnFDO0FBUmpEIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwczovL3d3dy5nbnUub3JnL3NvZnR3YXJlL2VtYWNzL1xuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi4vYmVhdXRpZmllcicpXG5wYXRoID0gcmVxdWlyZShcInBhdGhcIilcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBGb3J0cmFuQmVhdXRpZmllciBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJGb3J0cmFuIEJlYXV0aWZpZXJcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9HbGF2aW4wMDEvYXRvbS1iZWF1dGlmeS9ibG9iL21hc3Rlci9zcmMvYmVhdXRpZmllcnMvZm9ydHJhbi1iZWF1dGlmaWVyL2VtYWNzLWZvcnRyYW4tZm9ybWF0aW5nLXNjcmlwdC5saXNwXCJcblxuICBvcHRpb25zOiB7XG4gICAgRm9ydHJhbjogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAZGVidWcoJ2ZvcnRyYW4tYmVhdXRpZmllcicsIG9wdGlvbnMpXG5cbiAgICBlbWFjc19wYXRoID0gb3B0aW9ucy5lbWFjc19wYXRoXG4gICAgZW1hY3Nfc2NyaXB0X3BhdGggPSBvcHRpb25zLmVtYWNzX3NjcmlwdF9wYXRoXG5cbiAgICBpZiBub3QgZW1hY3Nfc2NyaXB0X3BhdGhcbiAgICAgIGVtYWNzX3NjcmlwdF9wYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJlbWFjcy1mb3J0cmFuLWZvcm1hdGluZy1zY3JpcHQubGlzcFwiKVxuXG4gICAgQGRlYnVnKCdmb3J0cmFuLWJlYXV0aWZpZXInLCAnZW1hY3Mgc2NyaXB0IHBhdGg6ICcgKyBlbWFjc19zY3JpcHRfcGF0aClcblxuICAgIGFyZ3MgPSBbXG4gICAgICAnLS1iYXRjaCdcbiAgICAgICctbCdcbiAgICAgIGVtYWNzX3NjcmlwdF9wYXRoXG4gICAgICAnLWYnXG4gICAgICAnZjkwLWJhdGNoLWluZGVudC1yZWdpb24nXG4gICAgICB0ZW1wRmlsZSA9IEB0ZW1wRmlsZShcInRlbXBcIiwgdGV4dClcbiAgICAgIF1cblxuICAgIGlmIGVtYWNzX3BhdGhcbiAgICAgIEBydW4oZW1hY3NfcGF0aCwgYXJncywge2lnbm9yZVJldHVybkNvZGU6IGZhbHNlfSlcbiAgICAgICAgLnRoZW4oPT5cbiAgICAgICAgICBAcmVhZEZpbGUodGVtcEZpbGUpXG4gICAgICAgIClcbiAgICBlbHNlXG4gICAgICBAcnVuKFwiZW1hY3NcIiwgYXJncywge2lnbm9yZVJldHVybkNvZGU6IGZhbHNlfSlcbiAgICAgICAgLnRoZW4oPT5cbiAgICAgICAgICBAcmVhZEZpbGUodGVtcEZpbGUpXG4gICAgICAgIClcbiJdfQ==
