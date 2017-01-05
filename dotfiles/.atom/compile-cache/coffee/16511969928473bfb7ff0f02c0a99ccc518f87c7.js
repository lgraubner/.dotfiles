
/*
Requires https://github.com/bbatsov/rubocop
 */

(function() {
  "use strict";
  var Beautifier, Rubocop,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Rubocop = (function(superClass) {
    extend(Rubocop, superClass);

    function Rubocop() {
      return Rubocop.__super__.constructor.apply(this, arguments);
    }

    Rubocop.prototype.name = "Rubocop";

    Rubocop.prototype.link = "https://github.com/bbatsov/rubocop";

    Rubocop.prototype.options = {
      Ruby: {
        indent_size: true,
        rubocop_path: true
      }
    };

    Rubocop.prototype.beautify = function(text, language, options) {
      return this.Promise.all([options.rubocop_path ? this.which(options.rubocop_path) : void 0, this.which('rubocop')]).then((function(_this) {
        return function(paths) {
          var _, config, configFile, fs, path, rubocopPath, tempFile, yaml;
          _this.debug('rubocop paths', paths);
          _ = require('lodash');
          path = require('path');
          rubocopPath = _.find(paths, function(p) {
            return p && path.isAbsolute(p);
          });
          _this.verbose('rubocopPath', rubocopPath);
          _this.debug('rubocopPath', rubocopPath, paths);
          configFile = path.join(atom.project.getPaths()[0], ".rubocop.yml");
          fs = require('fs');
          if (fs.existsSync(configFile)) {
            _this.debug("rubocop", config, fs.readFileSync(configFile, 'utf8'));
          } else {
            yaml = require("yaml-front-matter");
            config = {
              "Style/IndentationWidth": {
                "Width": options.indent_size
              }
            };
            configFile = _this.tempFile("rubocop-config", yaml.safeDump(config));
            _this.debug("rubocop", config, configFile);
          }
          if (rubocopPath != null) {
            return _this.run(rubocopPath, ["--auto-correct", "--config", configFile, tempFile = _this.tempFile("temp", text)], {
              ignoreReturnCode: true
            }).then(function() {
              return _this.readFile(tempFile);
            });
          } else {
            return _this.run("rubocop", ["--auto-correct", "--config", configFile, tempFile = _this.tempFile("temp", text)], {
              ignoreReturnCode: true
            }).then(function() {
              return _this.readFile(tempFile);
            });
          }
        };
      })(this));
    };

    return Rubocop;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcnVib2NvcC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQTtBQUpBLE1BQUEsbUJBQUE7SUFBQTs7O0VBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3NCQUNyQixJQUFBLEdBQU07O3NCQUNOLElBQUEsR0FBTTs7c0JBRU4sT0FBQSxHQUFTO01BQ1AsSUFBQSxFQUNFO1FBQUEsV0FBQSxFQUFhLElBQWI7UUFDQSxZQUFBLEVBQWMsSUFEZDtPQUZLOzs7c0JBTVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7YUFDUixJQUFDLENBQUEsT0FBTyxDQUFDLEdBQVQsQ0FBYSxDQUNxQixPQUFPLENBQUMsWUFBeEMsR0FBQSxJQUFDLENBQUEsS0FBRCxDQUFPLE9BQU8sQ0FBQyxZQUFmLENBQUEsR0FBQSxNQURXLEVBRVgsSUFBQyxDQUFBLEtBQUQsQ0FBTyxTQUFQLENBRlcsQ0FBYixDQUdFLENBQUMsSUFISCxDQUdRLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO0FBQ04sY0FBQTtVQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sZUFBUCxFQUF3QixLQUF4QjtVQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjtVQUNKLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjtVQUVQLFdBQUEsR0FBYyxDQUFDLENBQUMsSUFBRixDQUFPLEtBQVAsRUFBYyxTQUFDLENBQUQ7bUJBQU8sQ0FBQSxJQUFNLElBQUksQ0FBQyxVQUFMLENBQWdCLENBQWhCO1VBQWIsQ0FBZDtVQUNkLEtBQUMsQ0FBQSxPQUFELENBQVMsYUFBVCxFQUF3QixXQUF4QjtVQUNBLEtBQUMsQ0FBQSxLQUFELENBQU8sYUFBUCxFQUFzQixXQUF0QixFQUFtQyxLQUFuQztVQUVBLFVBQUEsR0FBYSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxjQUF0QztVQUViLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjtVQUVMLElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxVQUFkLENBQUg7WUFDRSxLQUFDLENBQUEsS0FBRCxDQUFPLFNBQVAsRUFBa0IsTUFBbEIsRUFBMEIsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsVUFBaEIsRUFBNEIsTUFBNUIsQ0FBMUIsRUFERjtXQUFBLE1BQUE7WUFHRSxJQUFBLEdBQU8sT0FBQSxDQUFRLG1CQUFSO1lBRVAsTUFBQSxHQUFTO2NBQ1Asd0JBQUEsRUFDRTtnQkFBQSxPQUFBLEVBQVMsT0FBTyxDQUFDLFdBQWpCO2VBRks7O1lBS1QsVUFBQSxHQUFhLEtBQUMsQ0FBQSxRQUFELENBQVUsZ0JBQVYsRUFBNEIsSUFBSSxDQUFDLFFBQUwsQ0FBYyxNQUFkLENBQTVCO1lBQ2IsS0FBQyxDQUFBLEtBQUQsQ0FBTyxTQUFQLEVBQWtCLE1BQWxCLEVBQTBCLFVBQTFCLEVBWEY7O1VBY0EsSUFBRyxtQkFBSDttQkFDRSxLQUFDLENBQUEsR0FBRCxDQUFLLFdBQUwsRUFBa0IsQ0FDaEIsZ0JBRGdCLEVBRWhCLFVBRmdCLEVBRUosVUFGSSxFQUdoQixRQUFBLEdBQVcsS0FBQyxDQUFBLFFBQUQsQ0FBVSxNQUFWLEVBQWtCLElBQWxCLENBSEssQ0FBbEIsRUFJSztjQUFDLGdCQUFBLEVBQWtCLElBQW5CO2FBSkwsQ0FLRSxDQUFDLElBTEgsQ0FLUSxTQUFBO3FCQUNKLEtBQUMsQ0FBQSxRQUFELENBQVUsUUFBVjtZQURJLENBTFIsRUFERjtXQUFBLE1BQUE7bUJBVUUsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFMLEVBQWdCLENBQ2QsZ0JBRGMsRUFFZCxVQUZjLEVBRUYsVUFGRSxFQUdkLFFBQUEsR0FBVyxLQUFDLENBQUEsUUFBRCxDQUFVLE1BQVYsRUFBa0IsSUFBbEIsQ0FIRyxDQUFoQixFQUlLO2NBQUMsZ0JBQUEsRUFBa0IsSUFBbkI7YUFKTCxDQUtFLENBQUMsSUFMSCxDQUtRLFNBQUE7cUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1lBREksQ0FMUixFQVZGOztRQTNCTTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIUjtJQURROzs7O0tBVjJCO0FBUHZDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwczovL2dpdGh1Yi5jb20vYmJhdHNvdi9ydWJvY29wXG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJ1Ym9jb3AgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiUnVib2NvcFwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2JiYXRzb3YvcnVib2NvcFwiXG5cbiAgb3B0aW9uczoge1xuICAgIFJ1Ynk6XG4gICAgICBpbmRlbnRfc2l6ZTogdHJ1ZVxuICAgICAgcnVib2NvcF9wYXRoOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBQcm9taXNlLmFsbChbXG4gICAgICBAd2hpY2gob3B0aW9ucy5ydWJvY29wX3BhdGgpIGlmIG9wdGlvbnMucnVib2NvcF9wYXRoXG4gICAgICBAd2hpY2goJ3J1Ym9jb3AnKVxuICAgIF0pLnRoZW4oKHBhdGhzKSA9PlxuICAgICAgQGRlYnVnKCdydWJvY29wIHBhdGhzJywgcGF0aHMpXG4gICAgICBfID0gcmVxdWlyZSAnbG9kYXNoJ1xuICAgICAgcGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG4gICAgICAjIEdldCBmaXJzdCB2YWxpZCwgYWJzb2x1dGUgcGF0aFxuICAgICAgcnVib2NvcFBhdGggPSBfLmZpbmQocGF0aHMsIChwKSAtPiBwIGFuZCBwYXRoLmlzQWJzb2x1dGUocCkgKVxuICAgICAgQHZlcmJvc2UoJ3J1Ym9jb3BQYXRoJywgcnVib2NvcFBhdGgpXG4gICAgICBAZGVidWcoJ3J1Ym9jb3BQYXRoJywgcnVib2NvcFBhdGgsIHBhdGhzKVxuXG4gICAgICBjb25maWdGaWxlID0gcGF0aC5qb2luKGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdLCBcIi5ydWJvY29wLnltbFwiKVxuXG4gICAgICBmcyA9IHJlcXVpcmUgJ2ZzJ1xuXG4gICAgICBpZiBmcy5leGlzdHNTeW5jKGNvbmZpZ0ZpbGUpXG4gICAgICAgIEBkZWJ1ZyhcInJ1Ym9jb3BcIiwgY29uZmlnLCBmcy5yZWFkRmlsZVN5bmMoY29uZmlnRmlsZSwgJ3V0ZjgnKSlcbiAgICAgIGVsc2VcbiAgICAgICAgeWFtbCA9IHJlcXVpcmUoXCJ5YW1sLWZyb250LW1hdHRlclwiKVxuICAgICAgICAjIEdlbmVyYXRlIGNvbmZpZyBmaWxlXG4gICAgICAgIGNvbmZpZyA9IHtcbiAgICAgICAgICBcIlN0eWxlL0luZGVudGF0aW9uV2lkdGhcIjpcbiAgICAgICAgICAgIFwiV2lkdGhcIjogb3B0aW9ucy5pbmRlbnRfc2l6ZVxuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnRmlsZSA9IEB0ZW1wRmlsZShcInJ1Ym9jb3AtY29uZmlnXCIsIHlhbWwuc2FmZUR1bXAoY29uZmlnKSlcbiAgICAgICAgQGRlYnVnKFwicnVib2NvcFwiLCBjb25maWcsIGNvbmZpZ0ZpbGUpXG5cbiAgICAgICMgQ2hlY2sgaWYgUEhQLUNTLUZpeGVyIHBhdGggd2FzIGZvdW5kXG4gICAgICBpZiBydWJvY29wUGF0aD9cbiAgICAgICAgQHJ1bihydWJvY29wUGF0aCwgW1xuICAgICAgICAgIFwiLS1hdXRvLWNvcnJlY3RcIlxuICAgICAgICAgIFwiLS1jb25maWdcIiwgY29uZmlnRmlsZVxuICAgICAgICAgIHRlbXBGaWxlID0gQHRlbXBGaWxlKFwidGVtcFwiLCB0ZXh0KVxuICAgICAgICAgIF0sIHtpZ25vcmVSZXR1cm5Db2RlOiB0cnVlfSlcbiAgICAgICAgICAudGhlbig9PlxuICAgICAgICAgICAgQHJlYWRGaWxlKHRlbXBGaWxlKVxuICAgICAgICAgIClcbiAgICAgIGVsc2VcbiAgICAgICAgQHJ1bihcInJ1Ym9jb3BcIiwgW1xuICAgICAgICAgIFwiLS1hdXRvLWNvcnJlY3RcIlxuICAgICAgICAgIFwiLS1jb25maWdcIiwgY29uZmlnRmlsZVxuICAgICAgICAgIHRlbXBGaWxlID0gQHRlbXBGaWxlKFwidGVtcFwiLCB0ZXh0KVxuICAgICAgICAgIF0sIHtpZ25vcmVSZXR1cm5Db2RlOiB0cnVlfSlcbiAgICAgICAgICAudGhlbig9PlxuICAgICAgICAgICAgQHJlYWRGaWxlKHRlbXBGaWxlKVxuICAgICAgICAgIClcbilcbiJdfQ==
