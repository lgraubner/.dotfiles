
/*
Requires [perltidy](http://perltidy.sourceforge.net)
 */

(function() {
  "use strict";
  var Beautifier, PerlTidy,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = PerlTidy = (function(superClass) {
    extend(PerlTidy, superClass);

    function PerlTidy() {
      return PerlTidy.__super__.constructor.apply(this, arguments);
    }

    PerlTidy.prototype.name = "Perltidy";

    PerlTidy.prototype.link = "http://perltidy.sourceforge.net/";

    PerlTidy.prototype.options = {
      Perl: true
    };

    PerlTidy.prototype.cli = function(options) {
      if (options.perltidy_path == null) {
        return new Error("'Perl Perltidy Path' not set!" + " Please set this in the Atom Beautify package settings.");
      } else {
        return options.perltidy_path;
      }
    };

    PerlTidy.prototype.beautify = function(text, language, options) {
      var ref;
      return this.run("perltidy", ['--standard-output', '--standard-error-output', '--quiet', ((ref = options.perltidy_profile) != null ? ref.length : void 0) ? "--profile=" + options.perltidy_profile : void 0, this.tempFile("input", text)], {
        help: {
          link: "http://perltidy.sourceforge.net/"
        }
      });
    };

    return PerlTidy;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcGVybHRpZHkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBR0E7QUFIQSxNQUFBLG9CQUFBO0lBQUE7OztFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7Ozt1QkFDckIsSUFBQSxHQUFNOzt1QkFDTixJQUFBLEdBQU07O3VCQUVOLE9BQUEsR0FBUztNQUNQLElBQUEsRUFBTSxJQURDOzs7dUJBSVQsR0FBQSxHQUFLLFNBQUMsT0FBRDtNQUNILElBQU8sNkJBQVA7QUFDRSxlQUFXLElBQUEsS0FBQSxDQUFNLCtCQUFBLEdBQ2YseURBRFMsRUFEYjtPQUFBLE1BQUE7QUFJRSxlQUFPLE9BQU8sQ0FBQyxjQUpqQjs7SUFERzs7dUJBT0wsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixVQUFBO2FBQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxVQUFMLEVBQWlCLENBQ2YsbUJBRGUsRUFFZix5QkFGZSxFQUdmLFNBSGUsaURBSW9ELENBQUUsZ0JBQXJFLEdBQUEsWUFBQSxHQUFhLE9BQU8sQ0FBQyxnQkFBckIsR0FBQSxNQUplLEVBS2YsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBTGUsQ0FBakIsRUFNSztRQUFBLElBQUEsRUFBTTtVQUNQLElBQUEsRUFBTSxrQ0FEQztTQUFOO09BTkw7SUFEUTs7OztLQWY0QjtBQU54QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgW3Blcmx0aWR5XShodHRwOi8vcGVybHRpZHkuc291cmNlZm9yZ2UubmV0KVxuIyMjXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGVybFRpZHkgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiUGVybHRpZHlcIlxuICBsaW5rOiBcImh0dHA6Ly9wZXJsdGlkeS5zb3VyY2Vmb3JnZS5uZXQvXCJcblxuICBvcHRpb25zOiB7XG4gICAgUGVybDogdHJ1ZVxuICB9XG5cbiAgY2xpOiAob3B0aW9ucykgLT5cbiAgICBpZiBub3Qgb3B0aW9ucy5wZXJsdGlkeV9wYXRoP1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIidQZXJsIFBlcmx0aWR5IFBhdGgnIG5vdCBzZXQhXCIgK1xuICAgICAgICBcIiBQbGVhc2Ugc2V0IHRoaXMgaW4gdGhlIEF0b20gQmVhdXRpZnkgcGFja2FnZSBzZXR0aW5ncy5cIilcbiAgICBlbHNlXG4gICAgICByZXR1cm4gb3B0aW9ucy5wZXJsdGlkeV9wYXRoXG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAcnVuKFwicGVybHRpZHlcIiwgW1xuICAgICAgJy0tc3RhbmRhcmQtb3V0cHV0J1xuICAgICAgJy0tc3RhbmRhcmQtZXJyb3Itb3V0cHV0J1xuICAgICAgJy0tcXVpZXQnXG4gICAgICBcIi0tcHJvZmlsZT0je29wdGlvbnMucGVybHRpZHlfcHJvZmlsZX1cIiBpZiBvcHRpb25zLnBlcmx0aWR5X3Byb2ZpbGU/Lmxlbmd0aFxuICAgICAgQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dClcbiAgICAgIF0sIGhlbHA6IHtcbiAgICAgICAgbGluazogXCJodHRwOi8vcGVybHRpZHkuc291cmNlZm9yZ2UubmV0L1wiXG4gICAgICB9KVxuIl19
