(function() {
  "use strict";
  var Beautifier, LatexBeautify, fs, path, temp,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  fs = require("fs");

  temp = require("temp").track();

  module.exports = LatexBeautify = (function(superClass) {
    extend(LatexBeautify, superClass);

    function LatexBeautify() {
      return LatexBeautify.__super__.constructor.apply(this, arguments);
    }

    LatexBeautify.prototype.name = "Latex Beautify";

    LatexBeautify.prototype.link = "https://github.com/cmhughes/latexindent.pl";

    LatexBeautify.prototype.options = {
      LaTeX: true
    };

    LatexBeautify.prototype.buildConfigFile = function(options) {
      var config, delim, i, indentChar, len, ref;
      indentChar = options.indent_char;
      if (options.indent_with_tabs) {
        indentChar = "\\t";
      }
      config = "defaultIndent: \"" + indentChar + "\"\nalwaysLookforSplitBraces: " + (+options.always_look_for_split_braces) + "\nalwaysLookforSplitBrackets: " + (+options.always_look_for_split_brackets) + "\nindentPreamble: " + (+options.indent_preamble) + "\nremoveTrailingWhitespace: " + (+options.remove_trailing_whitespace) + "\nlookForAlignDelims:\n";
      ref = options.align_columns_in_environments;
      for (i = 0, len = ref.length; i < len; i++) {
        delim = ref[i];
        config += "\t" + delim + ": 1\n";
      }
      return config;
    };

    LatexBeautify.prototype.setUpDir = function(dirPath, text, config) {
      this.texFile = path.join(dirPath, "latex.tex");
      fs.writeFile(this.texFile, text, function(err) {
        if (err) {
          return reject(err);
        }
      });
      this.configFile = path.join(dirPath, "localSettings.yaml");
      fs.writeFile(this.configFile, config, function(err) {
        if (err) {
          return reject(err);
        }
      });
      this.logFile = path.join(dirPath, "indent.log");
      return fs.writeFile(this.logFile, "", function(err) {
        if (err) {
          return reject(err);
        }
      });
    };

    LatexBeautify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        return temp.mkdir("latex", function(err, dirPath) {
          if (err) {
            return reject(err);
          }
          return resolve(dirPath);
        });
      }).then((function(_this) {
        return function(dirPath) {
          var run;
          _this.setUpDir(dirPath, text, _this.buildConfigFile(options));
          return run = _this.run("latexindent", ["-o", "-s", "-l", "-c=" + dirPath, _this.texFile, _this.texFile], {
            help: {
              link: "https://github.com/cmhughes/latexindent.pl"
            }
          });
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.readFile(_this.texFile);
        };
      })(this));
    };

    return LatexBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvbGF0ZXgtYmVhdXRpZnkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLHlDQUFBO0lBQUE7OztFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFDYixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsS0FBaEIsQ0FBQTs7RUFHUCxNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7Ozs0QkFDckIsSUFBQSxHQUFNOzs0QkFDTixJQUFBLEdBQU07OzRCQUVOLE9BQUEsR0FBUztNQUNQLEtBQUEsRUFBTyxJQURBOzs7NEJBTVQsZUFBQSxHQUFpQixTQUFDLE9BQUQ7QUFDZixVQUFBO01BQUEsVUFBQSxHQUFhLE9BQU8sQ0FBQztNQUNyQixJQUFHLE9BQU8sQ0FBQyxnQkFBWDtRQUNFLFVBQUEsR0FBYSxNQURmOztNQUdBLE1BQUEsR0FBUyxtQkFBQSxHQUNtQixVQURuQixHQUM4QixnQ0FEOUIsR0FFMkIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw0QkFBVixDQUYzQixHQUVrRSxnQ0FGbEUsR0FHNkIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw4QkFBVixDQUg3QixHQUdzRSxvQkFIdEUsR0FJaUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFWLENBSmpCLEdBSTJDLDhCQUozQyxHQUsyQixDQUFDLENBQUMsT0FBTyxDQUFDLDBCQUFWLENBTDNCLEdBS2dFO0FBR3pFO0FBQUEsV0FBQSxxQ0FBQTs7UUFDRSxNQUFBLElBQVUsSUFBQSxHQUFLLEtBQUwsR0FBVztBQUR2QjtBQUVBLGFBQU87SUFmUTs7NEJBcUJqQixRQUFBLEdBQVUsU0FBQyxPQUFELEVBQVUsSUFBVixFQUFnQixNQUFoQjtNQUNSLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLEVBQW1CLFdBQW5CO01BQ1gsRUFBRSxDQUFDLFNBQUgsQ0FBYSxJQUFDLENBQUEsT0FBZCxFQUF1QixJQUF2QixFQUE2QixTQUFDLEdBQUQ7UUFDM0IsSUFBc0IsR0FBdEI7QUFBQSxpQkFBTyxNQUFBLENBQU8sR0FBUCxFQUFQOztNQUQyQixDQUE3QjtNQUVBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLEVBQW1CLG9CQUFuQjtNQUNkLEVBQUUsQ0FBQyxTQUFILENBQWEsSUFBQyxDQUFBLFVBQWQsRUFBMEIsTUFBMUIsRUFBa0MsU0FBQyxHQUFEO1FBQ2hDLElBQXNCLEdBQXRCO0FBQUEsaUJBQU8sTUFBQSxDQUFPLEdBQVAsRUFBUDs7TUFEZ0MsQ0FBbEM7TUFFQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixFQUFtQixZQUFuQjthQUNYLEVBQUUsQ0FBQyxTQUFILENBQWEsSUFBQyxDQUFBLE9BQWQsRUFBdUIsRUFBdkIsRUFBMkIsU0FBQyxHQUFEO1FBQ3pCLElBQXNCLEdBQXRCO0FBQUEsaUJBQU8sTUFBQSxDQUFPLEdBQVAsRUFBUDs7TUFEeUIsQ0FBM0I7SUFSUTs7NEJBWVYsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7YUFDSixJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsU0FBQyxPQUFELEVBQVUsTUFBVjtlQUNYLElBQUksQ0FBQyxLQUFMLENBQVcsT0FBWCxFQUFvQixTQUFDLEdBQUQsRUFBTSxPQUFOO1VBQ2xCLElBQXNCLEdBQXRCO0FBQUEsbUJBQU8sTUFBQSxDQUFPLEdBQVAsRUFBUDs7aUJBQ0EsT0FBQSxDQUFRLE9BQVI7UUFGa0IsQ0FBcEI7TUFEVyxDQUFULENBTUosQ0FBQyxJQU5HLENBTUUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7QUFDSixjQUFBO1VBQUEsS0FBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLEVBQXlCLEtBQUMsQ0FBQSxlQUFELENBQWlCLE9BQWpCLENBQXpCO2lCQUNBLEdBQUEsR0FBTSxLQUFDLENBQUEsR0FBRCxDQUFLLGFBQUwsRUFBb0IsQ0FDeEIsSUFEd0IsRUFFeEIsSUFGd0IsRUFHeEIsSUFId0IsRUFJeEIsS0FBQSxHQUFRLE9BSmdCLEVBS3hCLEtBQUMsQ0FBQSxPQUx1QixFQU14QixLQUFDLENBQUEsT0FOdUIsQ0FBcEIsRUFPSDtZQUFBLElBQUEsRUFBTTtjQUNQLElBQUEsRUFBTSw0Q0FEQzthQUFOO1dBUEc7UUFGRjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FORixDQW1CSixDQUFDLElBbkJHLENBbUJHLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDTCxLQUFDLENBQUEsUUFBRCxDQUFVLEtBQUMsQ0FBQSxPQUFYO1FBREs7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBbkJIO0lBREk7Ozs7S0EzQ2lDO0FBUDdDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuZnMgPSByZXF1aXJlKFwiZnNcIilcbnRlbXAgPSByZXF1aXJlKFwidGVtcFwiKS50cmFjaygpXG5cblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBMYXRleEJlYXV0aWZ5IGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIkxhdGV4IEJlYXV0aWZ5XCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vY21odWdoZXMvbGF0ZXhpbmRlbnQucGxcIlxuXG4gIG9wdGlvbnM6IHtcbiAgICBMYVRlWDogdHJ1ZVxuICB9XG5cbiAgIyBUaGVyZSBhcmUgdG9vIG1hbnkgb3B0aW9ucyB3aXRoIGxhdGV4bWssIEkgaGF2ZSB0cmllZCB0byBzbGltIHRoaXMgZG93biB0byB0aGUgbW9zdCB1c2VmdWwgb25lcy5cbiAgIyBUaGlzIG1ldGhvZCBjcmVhdGVzIGEgY29uZmlndXJhdGlvbiBmaWxlIGZvciBsYXRleGluZGVudC5cbiAgYnVpbGRDb25maWdGaWxlOiAob3B0aW9ucykgLT5cbiAgICBpbmRlbnRDaGFyID0gb3B0aW9ucy5pbmRlbnRfY2hhclxuICAgIGlmIG9wdGlvbnMuaW5kZW50X3dpdGhfdGFic1xuICAgICAgaW5kZW50Q2hhciA9IFwiXFxcXHRcIlxuICAgICMgK3RydWUgPSAxIGFuZCArZmFsc2UgPSAwXG4gICAgY29uZmlnID0gXCJcIlwiXG4gICAgICAgICAgICAgZGVmYXVsdEluZGVudDogXFxcIiN7aW5kZW50Q2hhcn1cXFwiXG4gICAgICAgICAgICAgYWx3YXlzTG9va2ZvclNwbGl0QnJhY2VzOiAjeytvcHRpb25zLmFsd2F5c19sb29rX2Zvcl9zcGxpdF9icmFjZXN9XG4gICAgICAgICAgICAgYWx3YXlzTG9va2ZvclNwbGl0QnJhY2tldHM6ICN7K29wdGlvbnMuYWx3YXlzX2xvb2tfZm9yX3NwbGl0X2JyYWNrZXRzfVxuICAgICAgICAgICAgIGluZGVudFByZWFtYmxlOiAjeytvcHRpb25zLmluZGVudF9wcmVhbWJsZX1cbiAgICAgICAgICAgICByZW1vdmVUcmFpbGluZ1doaXRlc3BhY2U6ICN7K29wdGlvbnMucmVtb3ZlX3RyYWlsaW5nX3doaXRlc3BhY2V9XG4gICAgICAgICAgICAgbG9va0ZvckFsaWduRGVsaW1zOlxcblxuICAgICAgICAgICAgIFwiXCJcIlxuICAgIGZvciBkZWxpbSBpbiBvcHRpb25zLmFsaWduX2NvbHVtbnNfaW5fZW52aXJvbm1lbnRzXG4gICAgICBjb25maWcgKz0gXCJcXHQje2RlbGltfTogMVxcblwiXG4gICAgcmV0dXJuIGNvbmZpZ1xuXG4gICMgTGF0ZXhpbmRlbnQgYWNjZXB0cyBjb25maWd1cmF0aW9uIF9maWxlc18gb25seS5cbiAgIyBUaGlzIGZpbGUgaGFzIHRvIGJlIG5hbWVkIGxvY2FsU2V0dGluZ3MueWFtbCBhbmQgYmUgaW4gdGhlIHNhbWUgZm9sZGVyIGFzIHRoZSB0ZXggZmlsZS5cbiAgIyBJdCBhbHNvIGluc2lzdHMgb24gY3JlYXRpbmcgYSBsb2cgZmlsZSBzb21ld2hlcmUuXG4gICMgU28gd2Ugc2V0IHVwIGEgZGlyZWN0b3J5IHdpdGggYWxsIHRoZSBmaWxlcyBpbiBwbGFjZS5cbiAgc2V0VXBEaXI6IChkaXJQYXRoLCB0ZXh0LCBjb25maWcpIC0+XG4gICAgQHRleEZpbGUgPSBwYXRoLmpvaW4oZGlyUGF0aCwgXCJsYXRleC50ZXhcIilcbiAgICBmcy53cml0ZUZpbGUgQHRleEZpbGUsIHRleHQsIChlcnIpIC0+XG4gICAgICByZXR1cm4gcmVqZWN0KGVycikgaWYgZXJyXG4gICAgQGNvbmZpZ0ZpbGUgPSBwYXRoLmpvaW4oZGlyUGF0aCwgXCJsb2NhbFNldHRpbmdzLnlhbWxcIilcbiAgICBmcy53cml0ZUZpbGUgQGNvbmZpZ0ZpbGUsIGNvbmZpZywgKGVycikgLT5cbiAgICAgIHJldHVybiByZWplY3QoZXJyKSBpZiBlcnJcbiAgICBAbG9nRmlsZSA9IHBhdGguam9pbihkaXJQYXRoLCBcImluZGVudC5sb2dcIilcbiAgICBmcy53cml0ZUZpbGUgQGxvZ0ZpbGUsIFwiXCIsIChlcnIpIC0+XG4gICAgICByZXR1cm4gcmVqZWN0KGVycikgaWYgZXJyXG5cbiAgI0JlYXV0aWZpZXIgZG9lcyBub3QgY3VycmVudGx5IGhhdmUgYSBtZXRob2QgZm9yIGNyZWF0aW5nIGRpcmVjdG9yaWVzLCBzbyB3ZSBjYWxsIHRlbXAgZGlyZWN0bHkuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICB0ZW1wLm1rZGlyKFwibGF0ZXhcIiwgKGVyciwgZGlyUGF0aCkgLT5cbiAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpIGlmIGVyclxuICAgICAgICByZXNvbHZlKGRpclBhdGgpXG4gICAgICApXG4gICAgKVxuICAgIC50aGVuKChkaXJQYXRoKT0+XG4gICAgICBAc2V0VXBEaXIoZGlyUGF0aCwgdGV4dCwgQGJ1aWxkQ29uZmlnRmlsZShvcHRpb25zKSlcbiAgICAgIHJ1biA9IEBydW4gXCJsYXRleGluZGVudFwiLCBbXG4gICAgICAgIFwiLW9cIiAgICAgICAgICAgICNPdXRwdXQgdG8gdGhlIHNhbWUgbG9jYXRpb24gYXMgZmlsZSwgLXcgY3JlYXRlcyBhIGJhY2t1cCBmaWxlLCB3aGVyZWFzIHRoaXMgZG9lcyBub3RcbiAgICAgICAgXCItc1wiICAgICAgICAgICAgI1NpbGVudCBtb2RlXG4gICAgICAgIFwiLWxcIiAgICAgICAgICAgICNUZWxsIGxhdGV4aW5kZW50IHdlIGhhdmUgYSBsb2NhbCBjb25maWd1cmF0aW9uIGZpbGVcbiAgICAgICAgXCItYz1cIiArIGRpclBhdGggI1RlbGwgbGF0ZXhpbmRlbnQgdG8gcGxhY2UgdGhlIGxvZyBmaWxlIGluIHRoaXMgZGlyZWN0b3J5XG4gICAgICAgIEB0ZXhGaWxlXG4gICAgICAgIEB0ZXhGaWxlXG4gICAgICBdLCBoZWxwOiB7XG4gICAgICAgIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2NtaHVnaGVzL2xhdGV4aW5kZW50LnBsXCJcbiAgICAgIH1cbiAgICApXG4gICAgLnRoZW4oID0+XG4gICAgICBAcmVhZEZpbGUoQHRleEZpbGUpXG4gICAgKVxuIl19
