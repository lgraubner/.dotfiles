
/*
Requires https://github.com/nrc/rustfmt
 */

(function() {
  "use strict";
  var Beautifier, Rustfmt, path, versionCheckState,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  versionCheckState = false;

  module.exports = Rustfmt = (function(superClass) {
    extend(Rustfmt, superClass);

    function Rustfmt() {
      return Rustfmt.__super__.constructor.apply(this, arguments);
    }

    Rustfmt.prototype.name = "rustfmt";

    Rustfmt.prototype.link = "https://github.com/nrc/rustfmt";

    Rustfmt.prototype.options = {
      Rust: true
    };

    Rustfmt.prototype.beautify = function(text, language, options, context) {
      var cwd, help, p, program;
      cwd = context.filePath && path.dirname(context.filePath);
      program = options.rustfmt_path || "rustfmt";
      help = {
        link: "https://github.com/nrc/rustfmt",
        program: "rustfmt",
        pathOption: "Rust - Rustfmt Path"
      };
      p = versionCheckState === program ? this.Promise.resolve() : this.run(program, ["--version"], {
        help: help
      }).then(function(stdout) {
        if (/^0\.(?:[0-4]\.[0-9])/.test(stdout.trim())) {
          versionCheckState = false;
          throw new Error("rustfmt version 0.5.0 or newer required");
        } else {
          versionCheckState = program;
          return void 0;
        }
      });
      return p.then((function(_this) {
        return function() {
          return _this.run(program, [], {
            cwd: cwd,
            help: help,
            onStdin: function(stdin) {
              return stdin.end(text);
            }
          });
        };
      })(this));
    };

    return Rustfmt;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcnVzdGZtdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQTtBQUpBLE1BQUEsNENBQUE7SUFBQTs7O0VBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUNiLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxpQkFBQSxHQUFvQjs7RUFFcEIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7c0JBQ3JCLElBQUEsR0FBTTs7c0JBQ04sSUFBQSxHQUFNOztzQkFFTixPQUFBLEdBQVM7TUFDUCxJQUFBLEVBQU0sSUFEQzs7O3NCQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEVBQTBCLE9BQTFCO0FBQ1IsVUFBQTtNQUFBLEdBQUEsR0FBTSxPQUFPLENBQUMsUUFBUixJQUFxQixJQUFJLENBQUMsT0FBTCxDQUFhLE9BQU8sQ0FBQyxRQUFyQjtNQUMzQixPQUFBLEdBQVUsT0FBTyxDQUFDLFlBQVIsSUFBd0I7TUFDbEMsSUFBQSxHQUFPO1FBQ0wsSUFBQSxFQUFNLGdDQUREO1FBRUwsT0FBQSxFQUFTLFNBRko7UUFHTCxVQUFBLEVBQVkscUJBSFA7O01BU1AsQ0FBQSxHQUFPLGlCQUFBLEtBQXFCLE9BQXhCLEdBQ0YsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULENBQUEsQ0FERSxHQUdGLElBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxFQUFjLENBQUMsV0FBRCxDQUFkLEVBQTZCO1FBQUEsSUFBQSxFQUFNLElBQU47T0FBN0IsQ0FDRSxDQUFDLElBREgsQ0FDUSxTQUFDLE1BQUQ7UUFDSixJQUFHLHNCQUFzQixDQUFDLElBQXZCLENBQTRCLE1BQU0sQ0FBQyxJQUFQLENBQUEsQ0FBNUIsQ0FBSDtVQUNFLGlCQUFBLEdBQW9CO0FBQ3BCLGdCQUFVLElBQUEsS0FBQSxDQUFNLHlDQUFOLEVBRlo7U0FBQSxNQUFBO1VBSUUsaUJBQUEsR0FBb0I7aUJBQ3BCLE9BTEY7O01BREksQ0FEUjthQVVGLENBQUMsQ0FBQyxJQUFGLENBQU8sQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNMLEtBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxFQUFjLEVBQWQsRUFBa0I7WUFDaEIsR0FBQSxFQUFLLEdBRFc7WUFFaEIsSUFBQSxFQUFNLElBRlU7WUFHaEIsT0FBQSxFQUFTLFNBQUMsS0FBRDtxQkFDUCxLQUFLLENBQUMsR0FBTixDQUFVLElBQVY7WUFETyxDQUhPO1dBQWxCO1FBREs7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVA7SUF6QlE7Ozs7S0FSMkI7QUFWdkMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHBzOi8vZ2l0aHViLmNvbS9ucmMvcnVzdGZtdFxuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcbnBhdGggPSByZXF1aXJlKCdwYXRoJylcblxudmVyc2lvbkNoZWNrU3RhdGUgPSBmYWxzZVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJ1c3RmbXQgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwicnVzdGZtdFwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL25yYy9ydXN0Zm10XCJcblxuICBvcHRpb25zOiB7XG4gICAgUnVzdDogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucywgY29udGV4dCkgLT5cbiAgICBjd2QgPSBjb250ZXh0LmZpbGVQYXRoIGFuZCBwYXRoLmRpcm5hbWUgY29udGV4dC5maWxlUGF0aFxuICAgIHByb2dyYW0gPSBvcHRpb25zLnJ1c3RmbXRfcGF0aCBvciBcInJ1c3RmbXRcIlxuICAgIGhlbHAgPSB7XG4gICAgICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9ucmMvcnVzdGZtdFwiXG4gICAgICBwcm9ncmFtOiBcInJ1c3RmbXRcIlxuICAgICAgcGF0aE9wdGlvbjogXCJSdXN0IC0gUnVzdGZtdCBQYXRoXCJcbiAgICB9XG5cbiAgICAjIDAuNS4wIGlzIGEgcmVsYXRpdmVseSBuZXcgdmVyc2lvbiBhdCB0aGUgcG9pbnQgb2Ygd3JpdGluZyxcbiAgICAjIGJ1dCBpcyBlc3NlbnRpYWwgZm9yIHRoaXMgdG8gd29yayB3aXRoIHN0ZGluLlxuICAgICMgPT4gQ2hlY2sgZm9yIGl0IHNwZWNpZmljYWxseS5cbiAgICBwID0gaWYgdmVyc2lvbkNoZWNrU3RhdGUgPT0gcHJvZ3JhbVxuICAgICAgQFByb21pc2UucmVzb2x2ZSgpXG4gICAgZWxzZVxuICAgICAgQHJ1bihwcm9ncmFtLCBbXCItLXZlcnNpb25cIl0sIGhlbHA6IGhlbHApXG4gICAgICAgIC50aGVuKChzdGRvdXQpIC0+XG4gICAgICAgICAgaWYgL14wXFwuKD86WzAtNF1cXC5bMC05XSkvLnRlc3Qoc3Rkb3V0LnRyaW0oKSlcbiAgICAgICAgICAgIHZlcnNpb25DaGVja1N0YXRlID0gZmFsc2VcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInJ1c3RmbXQgdmVyc2lvbiAwLjUuMCBvciBuZXdlciByZXF1aXJlZFwiKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHZlcnNpb25DaGVja1N0YXRlID0gcHJvZ3JhbVxuICAgICAgICAgICAgdW5kZWZpbmVkXG4gICAgICAgIClcblxuICAgIHAudGhlbig9PlxuICAgICAgQHJ1bihwcm9ncmFtLCBbXSwge1xuICAgICAgICBjd2Q6IGN3ZFxuICAgICAgICBoZWxwOiBoZWxwXG4gICAgICAgIG9uU3RkaW46IChzdGRpbikgLT5cbiAgICAgICAgICBzdGRpbi5lbmQgdGV4dFxuICAgICAgfSlcbiAgICApXG4iXX0=
