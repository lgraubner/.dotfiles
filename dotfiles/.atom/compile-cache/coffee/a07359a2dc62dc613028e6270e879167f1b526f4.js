
/*
Requires [puppet-link](http://puppet-lint.com/)
 */

(function() {
  "use strict";
  var Beautifier, PuppetFix,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = PuppetFix = (function(superClass) {
    extend(PuppetFix, superClass);

    function PuppetFix() {
      return PuppetFix.__super__.constructor.apply(this, arguments);
    }

    PuppetFix.prototype.name = "puppet-lint";

    PuppetFix.prototype.link = "http://puppet-lint.com/";

    PuppetFix.prototype.options = {
      Puppet: true
    };

    PuppetFix.prototype.cli = function(options) {
      if (options.puppet_path == null) {
        return new Error("'puppet-lint' path is not set!" + " Please set this in the Atom Beautify package settings.");
      } else {
        return options.puppet_path;
      }
    };

    PuppetFix.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.run("puppet-lint", ['--fix', tempFile = this.tempFile("input", text)], {
        ignoreReturnCode: true,
        help: {
          link: "http://puppet-lint.com/"
        }
      }).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return PuppetFix;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcHVwcGV0LWZpeC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFHQTtBQUhBLE1BQUEscUJBQUE7SUFBQTs7O0VBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3dCQUVyQixJQUFBLEdBQU07O3dCQUNOLElBQUEsR0FBTTs7d0JBRU4sT0FBQSxHQUFTO01BQ1AsTUFBQSxFQUFRLElBREQ7Ozt3QkFJVCxHQUFBLEdBQUssU0FBQyxPQUFEO01BQ0gsSUFBTywyQkFBUDtBQUNFLGVBQVcsSUFBQSxLQUFBLENBQU0sZ0NBQUEsR0FDZix5REFEUyxFQURiO09BQUEsTUFBQTtBQUlFLGVBQU8sT0FBTyxDQUFDLFlBSmpCOztJQURHOzt3QkFPTCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7YUFBQSxJQUFDLENBQUEsR0FBRCxDQUFLLGFBQUwsRUFBb0IsQ0FDbEIsT0FEa0IsRUFFbEIsUUFBQSxHQUFXLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQUZPLENBQXBCLEVBR0s7UUFDRCxnQkFBQSxFQUFrQixJQURqQjtRQUVELElBQUEsRUFBTTtVQUNKLElBQUEsRUFBTSx5QkFERjtTQUZMO09BSEwsQ0FTRSxDQUFDLElBVEgsQ0FTUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1FBREk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBVFI7SUFEUTs7OztLQWhCNkI7QUFOekMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIFtwdXBwZXQtbGlua10oaHR0cDovL3B1cHBldC1saW50LmNvbS8pXG4jIyNcblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQdXBwZXRGaXggZXh0ZW5kcyBCZWF1dGlmaWVyXG4gICMgdGhpcyBpcyB3aGF0IGRpc3BsYXlzIGFzIHlvdXIgRGVmYXVsdCBCZWF1dGlmaWVyIGluIExhbmd1YWdlIENvbmZpZ1xuICBuYW1lOiBcInB1cHBldC1saW50XCJcbiAgbGluazogXCJodHRwOi8vcHVwcGV0LWxpbnQuY29tL1wiXG5cbiAgb3B0aW9uczoge1xuICAgIFB1cHBldDogdHJ1ZVxuICB9XG5cbiAgY2xpOiAob3B0aW9ucykgLT5cbiAgICBpZiBub3Qgb3B0aW9ucy5wdXBwZXRfcGF0aD9cbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCIncHVwcGV0LWxpbnQnIHBhdGggaXMgbm90IHNldCFcIiArXG4gICAgICAgIFwiIFBsZWFzZSBzZXQgdGhpcyBpbiB0aGUgQXRvbSBCZWF1dGlmeSBwYWNrYWdlIHNldHRpbmdzLlwiKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBvcHRpb25zLnB1cHBldF9wYXRoXG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAcnVuKFwicHVwcGV0LWxpbnRcIiwgW1xuICAgICAgJy0tZml4J1xuICAgICAgdGVtcEZpbGUgPSBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgICAgXSwge1xuICAgICAgICBpZ25vcmVSZXR1cm5Db2RlOiB0cnVlXG4gICAgICAgIGhlbHA6IHtcbiAgICAgICAgICBsaW5rOiBcImh0dHA6Ly9wdXBwZXQtbGludC5jb20vXCJcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC50aGVuKD0+XG4gICAgICAgIEByZWFkRmlsZSh0ZW1wRmlsZSlcbiAgICAgIClcbiJdfQ==
