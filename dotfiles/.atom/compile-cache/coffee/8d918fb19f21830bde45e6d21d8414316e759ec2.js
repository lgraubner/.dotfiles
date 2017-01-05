
/*
Requires http://uncrustify.sourceforge.net/
 */

(function() {
  "use strict";
  var Beautifier, Uncrustify, _, cfg, expandHomeDir, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('../beautifier');

  cfg = require("./cfg");

  path = require("path");

  expandHomeDir = require('expand-home-dir');

  _ = require('lodash');

  module.exports = Uncrustify = (function(superClass) {
    extend(Uncrustify, superClass);

    function Uncrustify() {
      return Uncrustify.__super__.constructor.apply(this, arguments);
    }

    Uncrustify.prototype.name = "Uncrustify";

    Uncrustify.prototype.link = "https://github.com/uncrustify/uncrustify";

    Uncrustify.prototype.options = {
      Apex: true,
      C: true,
      "C++": true,
      "C#": true,
      "Objective-C": true,
      D: true,
      Pawn: true,
      Vala: true,
      Java: true,
      Arduino: true
    };

    Uncrustify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var basePath, configPath, editor, expandedConfigPath, projectPath;
        configPath = options.configPath;
        if (!configPath) {
          return cfg(options, function(error, cPath) {
            if (error) {
              throw error;
            }
            return resolve(cPath);
          });
        } else {
          editor = atom.workspace.getActiveTextEditor();
          if (editor != null) {
            basePath = path.dirname(editor.getPath());
            projectPath = atom.workspace.project.getPaths()[0];
            expandedConfigPath = expandHomeDir(configPath);
            configPath = path.resolve(projectPath, expandedConfigPath);
            return resolve(configPath);
          } else {
            return reject(new Error("No Uncrustify Config Path set! Please configure Uncrustify with Atom Beautify."));
          }
        }
      }).then((function(_this) {
        return function(configPath) {
          var lang, outputFile;
          lang = "C";
          switch (language) {
            case "Apex":
              lang = "Apex";
              break;
            case "C":
              lang = "C";
              break;
            case "C++":
              lang = "CPP";
              break;
            case "C#":
              lang = "CS";
              break;
            case "Objective-C":
            case "Objective-C++":
              lang = "OC+";
              break;
            case "D":
              lang = "D";
              break;
            case "Pawn":
              lang = "PAWN";
              break;
            case "Vala":
              lang = "VALA";
              break;
            case "Java":
              lang = "JAVA";
              break;
            case "Arduino":
              lang = "CPP";
          }
          return _this.run("uncrustify", ["-c", configPath, "-f", _this.tempFile("input", text), "-o", outputFile = _this.tempFile("output", text), "-l", lang], {
            help: {
              link: "http://sourceforge.net/projects/uncrustify/"
            }
          }).then(function() {
            return _this.readFile(outputFile);
          });
        };
      })(this));
    };

    return Uncrustify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvdW5jcnVzdGlmeS9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFHQTtBQUhBLE1BQUEsbURBQUE7SUFBQTs7O0VBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSOztFQUNiLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUjs7RUFDTixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsYUFBQSxHQUFnQixPQUFBLENBQVEsaUJBQVI7O0VBQ2hCLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7RUFFSixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7Ozt5QkFDckIsSUFBQSxHQUFNOzt5QkFDTixJQUFBLEdBQU07O3lCQUNOLE9BQUEsR0FBUztNQUNQLElBQUEsRUFBTSxJQURDO01BRVAsQ0FBQSxFQUFHLElBRkk7TUFHUCxLQUFBLEVBQU8sSUFIQTtNQUlQLElBQUEsRUFBTSxJQUpDO01BS1AsYUFBQSxFQUFlLElBTFI7TUFNUCxDQUFBLEVBQUcsSUFOSTtNQU9QLElBQUEsRUFBTSxJQVBDO01BUVAsSUFBQSxFQUFNLElBUkM7TUFTUCxJQUFBLEVBQU0sSUFUQztNQVVQLE9BQUEsRUFBUyxJQVZGOzs7eUJBYVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFFUixhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2xCLFlBQUE7UUFBQSxVQUFBLEdBQWEsT0FBTyxDQUFDO1FBQ3JCLElBQUEsQ0FBTyxVQUFQO2lCQUVFLEdBQUEsQ0FBSSxPQUFKLEVBQWEsU0FBQyxLQUFELEVBQVEsS0FBUjtZQUNYLElBQWUsS0FBZjtBQUFBLG9CQUFNLE1BQU47O21CQUNBLE9BQUEsQ0FBUSxLQUFSO1VBRlcsQ0FBYixFQUZGO1NBQUEsTUFBQTtVQU9FLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7VUFDVCxJQUFHLGNBQUg7WUFDRSxRQUFBLEdBQVcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWI7WUFDWCxXQUFBLEdBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBdkIsQ0FBQSxDQUFrQyxDQUFBLENBQUE7WUFHaEQsa0JBQUEsR0FBcUIsYUFBQSxDQUFjLFVBQWQ7WUFDckIsVUFBQSxHQUFhLElBQUksQ0FBQyxPQUFMLENBQWEsV0FBYixFQUEwQixrQkFBMUI7bUJBQ2IsT0FBQSxDQUFRLFVBQVIsRUFQRjtXQUFBLE1BQUE7bUJBU0UsTUFBQSxDQUFXLElBQUEsS0FBQSxDQUFNLGdGQUFOLENBQVgsRUFURjtXQVJGOztNQUZrQixDQUFULENBcUJYLENBQUMsSUFyQlUsQ0FxQkwsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLFVBQUQ7QUFJSixjQUFBO1VBQUEsSUFBQSxHQUFPO0FBQ1Asa0JBQU8sUUFBUDtBQUFBLGlCQUNPLE1BRFA7Y0FFSSxJQUFBLEdBQU87QUFESjtBQURQLGlCQUdPLEdBSFA7Y0FJSSxJQUFBLEdBQU87QUFESjtBQUhQLGlCQUtPLEtBTFA7Y0FNSSxJQUFBLEdBQU87QUFESjtBQUxQLGlCQU9PLElBUFA7Y0FRSSxJQUFBLEdBQU87QUFESjtBQVBQLGlCQVNPLGFBVFA7QUFBQSxpQkFTc0IsZUFUdEI7Y0FVSSxJQUFBLEdBQU87QUFEVztBQVR0QixpQkFXTyxHQVhQO2NBWUksSUFBQSxHQUFPO0FBREo7QUFYUCxpQkFhTyxNQWJQO2NBY0ksSUFBQSxHQUFPO0FBREo7QUFiUCxpQkFlTyxNQWZQO2NBZ0JJLElBQUEsR0FBTztBQURKO0FBZlAsaUJBaUJPLE1BakJQO2NBa0JJLElBQUEsR0FBTztBQURKO0FBakJQLGlCQW1CTyxTQW5CUDtjQW9CSSxJQUFBLEdBQU87QUFwQlg7aUJBc0JBLEtBQUMsQ0FBQSxHQUFELENBQUssWUFBTCxFQUFtQixDQUNqQixJQURpQixFQUVqQixVQUZpQixFQUdqQixJQUhpQixFQUlqQixLQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FKaUIsRUFLakIsSUFMaUIsRUFNakIsVUFBQSxHQUFhLEtBQUMsQ0FBQSxRQUFELENBQVUsUUFBVixFQUFvQixJQUFwQixDQU5JLEVBT2pCLElBUGlCLEVBUWpCLElBUmlCLENBQW5CLEVBU0s7WUFBQSxJQUFBLEVBQU07Y0FDUCxJQUFBLEVBQU0sNkNBREM7YUFBTjtXQVRMLENBWUUsQ0FBQyxJQVpILENBWVEsU0FBQTttQkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLFVBQVY7VUFESSxDQVpSO1FBM0JJO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQXJCSztJQUZIOzs7O0tBaEI4QjtBQVYxQyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cDovL3VuY3J1c3RpZnkuc291cmNlZm9yZ2UubmV0L1xuIyMjXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4uL2JlYXV0aWZpZXInKVxuY2ZnID0gcmVxdWlyZShcIi4vY2ZnXCIpXG5wYXRoID0gcmVxdWlyZShcInBhdGhcIilcbmV4cGFuZEhvbWVEaXIgPSByZXF1aXJlKCdleHBhbmQtaG9tZS1kaXInKVxuXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVW5jcnVzdGlmeSBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJVbmNydXN0aWZ5XCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vdW5jcnVzdGlmeS91bmNydXN0aWZ5XCJcbiAgb3B0aW9uczoge1xuICAgIEFwZXg6IHRydWVcbiAgICBDOiB0cnVlXG4gICAgXCJDKytcIjogdHJ1ZVxuICAgIFwiQyNcIjogdHJ1ZVxuICAgIFwiT2JqZWN0aXZlLUNcIjogdHJ1ZVxuICAgIEQ6IHRydWVcbiAgICBQYXduOiB0cnVlXG4gICAgVmFsYTogdHJ1ZVxuICAgIEphdmE6IHRydWVcbiAgICBBcmR1aW5vOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgICMgY29uc29sZS5sb2coJ3VuY3J1c3RpZnkuYmVhdXRpZnknLCBsYW5ndWFnZSwgb3B0aW9ucylcbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICBjb25maWdQYXRoID0gb3B0aW9ucy5jb25maWdQYXRoXG4gICAgICB1bmxlc3MgY29uZmlnUGF0aFxuICAgICAgICAjIE5vIGN1c3RvbSBjb25maWcgcGF0aFxuICAgICAgICBjZmcgb3B0aW9ucywgKGVycm9yLCBjUGF0aCkgLT5cbiAgICAgICAgICB0aHJvdyBlcnJvciBpZiBlcnJvclxuICAgICAgICAgIHJlc29sdmUgY1BhdGhcbiAgICAgIGVsc2VcbiAgICAgICAgIyBIYXMgY3VzdG9tIGNvbmZpZyBwYXRoXG4gICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBpZiBlZGl0b3I/XG4gICAgICAgICAgYmFzZVBhdGggPSBwYXRoLmRpcm5hbWUoZWRpdG9yLmdldFBhdGgoKSlcbiAgICAgICAgICBwcm9qZWN0UGF0aCA9IGF0b20ud29ya3NwYWNlLnByb2plY3QuZ2V0UGF0aHMoKVswXVxuICAgICAgICAgICMgY29uc29sZS5sb2coYmFzZVBhdGgpO1xuICAgICAgICAgICMgRXhwYW5kIEhvbWUgRGlyZWN0b3J5IGluIENvbmZpZyBQYXRoXG4gICAgICAgICAgZXhwYW5kZWRDb25maWdQYXRoID0gZXhwYW5kSG9tZURpcihjb25maWdQYXRoKVxuICAgICAgICAgIGNvbmZpZ1BhdGggPSBwYXRoLnJlc29sdmUocHJvamVjdFBhdGgsIGV4cGFuZGVkQ29uZmlnUGF0aClcbiAgICAgICAgICByZXNvbHZlIGNvbmZpZ1BhdGhcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJObyBVbmNydXN0aWZ5IENvbmZpZyBQYXRoIHNldCEgUGxlYXNlIGNvbmZpZ3VyZSBVbmNydXN0aWZ5IHdpdGggQXRvbSBCZWF1dGlmeS5cIikpXG4gICAgKVxuICAgIC50aGVuKChjb25maWdQYXRoKSA9PlxuXG5cbiAgICAgICMgU2VsZWN0IFVuY3J1c3RpZnkgbGFuZ3VhZ2VcbiAgICAgIGxhbmcgPSBcIkNcIiAjIERlZmF1bHQgaXMgQ1xuICAgICAgc3dpdGNoIGxhbmd1YWdlXG4gICAgICAgIHdoZW4gXCJBcGV4XCJcbiAgICAgICAgICBsYW5nID0gXCJBcGV4XCJcbiAgICAgICAgd2hlbiBcIkNcIlxuICAgICAgICAgIGxhbmcgPSBcIkNcIlxuICAgICAgICB3aGVuIFwiQysrXCJcbiAgICAgICAgICBsYW5nID0gXCJDUFBcIlxuICAgICAgICB3aGVuIFwiQyNcIlxuICAgICAgICAgIGxhbmcgPSBcIkNTXCJcbiAgICAgICAgd2hlbiBcIk9iamVjdGl2ZS1DXCIsIFwiT2JqZWN0aXZlLUMrK1wiXG4gICAgICAgICAgbGFuZyA9IFwiT0MrXCJcbiAgICAgICAgd2hlbiBcIkRcIlxuICAgICAgICAgIGxhbmcgPSBcIkRcIlxuICAgICAgICB3aGVuIFwiUGF3blwiXG4gICAgICAgICAgbGFuZyA9IFwiUEFXTlwiXG4gICAgICAgIHdoZW4gXCJWYWxhXCJcbiAgICAgICAgICBsYW5nID0gXCJWQUxBXCJcbiAgICAgICAgd2hlbiBcIkphdmFcIlxuICAgICAgICAgIGxhbmcgPSBcIkpBVkFcIlxuICAgICAgICB3aGVuIFwiQXJkdWlub1wiXG4gICAgICAgICAgbGFuZyA9IFwiQ1BQXCJcblxuICAgICAgQHJ1bihcInVuY3J1c3RpZnlcIiwgW1xuICAgICAgICBcIi1jXCJcbiAgICAgICAgY29uZmlnUGF0aFxuICAgICAgICBcIi1mXCJcbiAgICAgICAgQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dClcbiAgICAgICAgXCItb1wiXG4gICAgICAgIG91dHB1dEZpbGUgPSBAdGVtcEZpbGUoXCJvdXRwdXRcIiwgdGV4dClcbiAgICAgICAgXCItbFwiXG4gICAgICAgIGxhbmdcbiAgICAgICAgXSwgaGVscDoge1xuICAgICAgICAgIGxpbms6IFwiaHR0cDovL3NvdXJjZWZvcmdlLm5ldC9wcm9qZWN0cy91bmNydXN0aWZ5L1wiXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKD0+XG4gICAgICAgICAgQHJlYWRGaWxlKG91dHB1dEZpbGUpXG4gICAgICAgIClcbiAgICApXG4iXX0=
