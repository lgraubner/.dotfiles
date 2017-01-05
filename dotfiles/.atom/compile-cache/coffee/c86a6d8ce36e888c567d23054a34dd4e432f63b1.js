
/*
Requires https://github.com/OCamlPro/ocp-indent
 */

(function() {
  "use strict";
  var Beautifier, OCPIndent,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = OCPIndent = (function(superClass) {
    extend(OCPIndent, superClass);

    function OCPIndent() {
      return OCPIndent.__super__.constructor.apply(this, arguments);
    }

    OCPIndent.prototype.name = "ocp-indent";

    OCPIndent.prototype.link = "https://www.typerex.org/ocp-indent.html";

    OCPIndent.prototype.options = {
      OCaml: true
    };

    OCPIndent.prototype.beautify = function(text, language, options) {
      return this.run("ocp-indent", [this.tempFile("input", text)], {
        help: {
          link: "https://www.typerex.org/ocp-indent.html"
        }
      });
    };

    return OCPIndent;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvb2NwLWluZGVudC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQTtBQUpBLE1BQUEscUJBQUE7SUFBQTs7O0VBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3dCQUNyQixJQUFBLEdBQU07O3dCQUNOLElBQUEsR0FBTTs7d0JBRU4sT0FBQSxHQUFTO01BQ1AsS0FBQSxFQUFPLElBREE7Ozt3QkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssWUFBTCxFQUFtQixDQUNqQixJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FEaUIsQ0FBbkIsRUFFSztRQUNELElBQUEsRUFBTTtVQUNKLElBQUEsRUFBTSx5Q0FERjtTQURMO09BRkw7SUFEUTs7OztLQVI2QjtBQVB6QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9naXRodWIuY29tL09DYW1sUHJvL29jcC1pbmRlbnRcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgT0NQSW5kZW50IGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIm9jcC1pbmRlbnRcIlxuICBsaW5rOiBcImh0dHBzOi8vd3d3LnR5cGVyZXgub3JnL29jcC1pbmRlbnQuaHRtbFwiXG5cbiAgb3B0aW9uczoge1xuICAgIE9DYW1sOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBydW4oXCJvY3AtaW5kZW50XCIsIFtcbiAgICAgIEB0ZW1wRmlsZShcImlucHV0XCIsIHRleHQpXG4gICAgICBdLCB7XG4gICAgICAgIGhlbHA6IHtcbiAgICAgICAgICBsaW5rOiBcImh0dHBzOi8vd3d3LnR5cGVyZXgub3JnL29jcC1pbmRlbnQuaHRtbFwiXG4gICAgICAgIH1cbiAgICAgIH0pXG4iXX0=
