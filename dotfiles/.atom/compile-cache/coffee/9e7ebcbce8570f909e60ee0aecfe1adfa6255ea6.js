
/*
Requires https://github.com/avh4/elm-format
 */

(function() {
  "use strict";
  var Beautifier, ElmFormat,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = ElmFormat = (function(superClass) {
    extend(ElmFormat, superClass);

    function ElmFormat() {
      return ElmFormat.__super__.constructor.apply(this, arguments);
    }

    ElmFormat.prototype.name = "elm-format";

    ElmFormat.prototype.link = "https://github.com/avh4/elm-format";

    ElmFormat.prototype.options = {
      Elm: true
    };

    ElmFormat.prototype.beautify = function(text, language, options) {
      var tempfile;
      return tempfile = this.tempFile("input", text, ".elm").then((function(_this) {
        return function(name) {
          return _this.run("elm-format", ['--yes', name], {
            help: {
              link: 'https://github.com/avh4/elm-format#installation-'
            }
          }).then(function() {
            return _this.readFile(name);
          });
        };
      })(this));
    };

    return ElmFormat;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvZWxtLWZvcm1hdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFHQTtBQUhBLE1BQUEscUJBQUE7SUFBQTs7O0VBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3dCQUNyQixJQUFBLEdBQU07O3dCQUNOLElBQUEsR0FBTTs7d0JBRU4sT0FBQSxHQUFTO01BQ1AsR0FBQSxFQUFLLElBREU7Ozt3QkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7YUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLEVBQXlCLE1BQXpCLENBQ1gsQ0FBQyxJQURVLENBQ0wsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7aUJBQ0osS0FBQyxDQUFBLEdBQUQsQ0FBSyxZQUFMLEVBQW1CLENBQ2pCLE9BRGlCLEVBRWpCLElBRmlCLENBQW5CLEVBSUU7WUFBRSxJQUFBLEVBQU07Y0FBRSxJQUFBLEVBQU0sa0RBQVI7YUFBUjtXQUpGLENBTUEsQ0FBQyxJQU5ELENBTU0sU0FBQTttQkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLElBQVY7VUFESSxDQU5OO1FBREk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREs7SUFESDs7OztLQVI2QjtBQU56QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9naXRodWIuY29tL2F2aDQvZWxtLWZvcm1hdFxuIyMjXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRWxtRm9ybWF0IGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcImVsbS1mb3JtYXRcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9hdmg0L2VsbS1mb3JtYXRcIlxuXG4gIG9wdGlvbnM6IHtcbiAgICBFbG06IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgdGVtcGZpbGUgPSBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0LCBcIi5lbG1cIilcbiAgICAudGhlbiAobmFtZSkgPT5cbiAgICAgIEBydW4oXCJlbG0tZm9ybWF0XCIsIFtcbiAgICAgICAgJy0teWVzJyxcbiAgICAgICAgbmFtZVxuICAgICAgICBdLFxuICAgICAgICB7IGhlbHA6IHsgbGluazogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hdmg0L2VsbS1mb3JtYXQjaW5zdGFsbGF0aW9uLScgfSB9XG4gICAgICApXG4gICAgICAudGhlbiAoKSA9PlxuICAgICAgICBAcmVhZEZpbGUobmFtZSlcbiJdfQ==
