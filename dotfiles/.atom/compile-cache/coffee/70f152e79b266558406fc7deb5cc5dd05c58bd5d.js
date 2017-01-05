
/*
Requires https://github.com/FriendsOfPHP/PHP-CS-Fixer
 */

(function() {
  "use strict";
  var Beautifier, PHPCSFixer, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  module.exports = PHPCSFixer = (function(superClass) {
    extend(PHPCSFixer, superClass);

    function PHPCSFixer() {
      return PHPCSFixer.__super__.constructor.apply(this, arguments);
    }

    PHPCSFixer.prototype.name = 'PHP-CS-Fixer';

    PHPCSFixer.prototype.link = "https://github.com/FriendsOfPHP/PHP-CS-Fixer";

    PHPCSFixer.prototype.options = {
      PHP: true
    };

    PHPCSFixer.prototype.beautify = function(text, language, options, context) {
      var configFile, tempFile;
      this.debug('php-cs-fixer', options);
      configFile = (context != null) && (context.filePath != null) ? this.findFile(path.dirname(context.filePath), '.php_cs') : void 0;
      if (this.isWindows) {
        return this.Promise.all([options.cs_fixer_path ? this.which(options.cs_fixer_path) : void 0, this.which('php-cs-fixer')]).then((function(_this) {
          return function(paths) {
            var _, phpCSFixerPath, tempFile;
            _this.debug('php-cs-fixer paths', paths);
            _ = require('lodash');
            phpCSFixerPath = _.find(paths, function(p) {
              return p && path.isAbsolute(p);
            });
            _this.verbose('phpCSFixerPath', phpCSFixerPath);
            _this.debug('phpCSFixerPath', phpCSFixerPath, paths);
            if (phpCSFixerPath != null) {
              return _this.run("php", [phpCSFixerPath, "fix", options.level ? "--level=" + options.level : void 0, options.fixers ? "--fixers=" + options.fixers : void 0, configFile ? "--config-file=" + configFile : void 0, tempFile = _this.tempFile("temp", text)], {
                ignoreReturnCode: true,
                help: {
                  link: "https://github.com/FriendsOfPHP/PHP-CS-Fixer"
                }
              }).then(function() {
                return _this.readFile(tempFile);
              });
            } else {
              _this.verbose('php-cs-fixer not found!');
              return _this.Promise.reject(_this.commandNotFoundError('php-cs-fixer', {
                link: "https://github.com/FriendsOfPHP/PHP-CS-Fixer",
                program: "php-cs-fixer.phar",
                pathOption: "PHP - CS Fixer Path"
              }));
            }
          };
        })(this));
      } else {
        return this.run("php-cs-fixer", ["fix", options.level ? "--level=" + options.level : void 0, options.fixers ? "--fixers=" + options.fixers : void 0, configFile ? "--config-file=" + configFile : void 0, tempFile = this.tempFile("temp", text)], {
          ignoreReturnCode: true,
          help: {
            link: "https://github.com/FriendsOfPHP/PHP-CS-Fixer"
          }
        }).then((function(_this) {
          return function() {
            return _this.readFile(tempFile);
          };
        })(this));
      }
    };

    return PHPCSFixer;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcGhwLWNzLWZpeGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSw0QkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBQ2IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3lCQUVyQixJQUFBLEdBQU07O3lCQUNOLElBQUEsR0FBTTs7eUJBRU4sT0FBQSxHQUNFO01BQUEsR0FBQSxFQUFLLElBQUw7Ozt5QkFFRixRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixFQUEwQixPQUExQjtBQUNSLFVBQUE7TUFBQSxJQUFDLENBQUEsS0FBRCxDQUFPLGNBQVAsRUFBdUIsT0FBdkI7TUFFQSxVQUFBLEdBQWdCLGlCQUFBLElBQWEsMEJBQWhCLEdBQXVDLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxPQUFPLENBQUMsUUFBckIsQ0FBVixFQUEwQyxTQUExQyxDQUF2QyxHQUFBO01BRWIsSUFBRyxJQUFDLENBQUEsU0FBSjtlQUVFLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBVCxDQUFhLENBQ3NCLE9BQU8sQ0FBQyxhQUF6QyxHQUFBLElBQUMsQ0FBQSxLQUFELENBQU8sT0FBTyxDQUFDLGFBQWYsQ0FBQSxHQUFBLE1BRFcsRUFFWCxJQUFDLENBQUEsS0FBRCxDQUFPLGNBQVAsQ0FGVyxDQUFiLENBR0UsQ0FBQyxJQUhILENBR1EsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxLQUFEO0FBQ04sZ0JBQUE7WUFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLG9CQUFQLEVBQTZCLEtBQTdCO1lBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSO1lBRUosY0FBQSxHQUFpQixDQUFDLENBQUMsSUFBRixDQUFPLEtBQVAsRUFBYyxTQUFDLENBQUQ7cUJBQU8sQ0FBQSxJQUFNLElBQUksQ0FBQyxVQUFMLENBQWdCLENBQWhCO1lBQWIsQ0FBZDtZQUNqQixLQUFDLENBQUEsT0FBRCxDQUFTLGdCQUFULEVBQTJCLGNBQTNCO1lBQ0EsS0FBQyxDQUFBLEtBQUQsQ0FBTyxnQkFBUCxFQUF5QixjQUF6QixFQUF5QyxLQUF6QztZQUVBLElBQUcsc0JBQUg7cUJBRUUsS0FBQyxDQUFBLEdBQUQsQ0FBSyxLQUFMLEVBQVksQ0FDVixjQURVLEVBRVYsS0FGVSxFQUdvQixPQUFPLENBQUMsS0FBdEMsR0FBQSxVQUFBLEdBQVcsT0FBTyxDQUFDLEtBQW5CLEdBQUEsTUFIVSxFQUlzQixPQUFPLENBQUMsTUFBeEMsR0FBQSxXQUFBLEdBQVksT0FBTyxDQUFDLE1BQXBCLEdBQUEsTUFKVSxFQUt1QixVQUFqQyxHQUFBLGdCQUFBLEdBQWlCLFVBQWpCLEdBQUEsTUFMVSxFQU1WLFFBQUEsR0FBVyxLQUFDLENBQUEsUUFBRCxDQUFVLE1BQVYsRUFBa0IsSUFBbEIsQ0FORCxDQUFaLEVBT0s7Z0JBQ0QsZ0JBQUEsRUFBa0IsSUFEakI7Z0JBRUQsSUFBQSxFQUFNO2tCQUNKLElBQUEsRUFBTSw4Q0FERjtpQkFGTDtlQVBMLENBYUUsQ0FBQyxJQWJILENBYVEsU0FBQTt1QkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVY7Y0FESSxDQWJSLEVBRkY7YUFBQSxNQUFBO2NBbUJFLEtBQUMsQ0FBQSxPQUFELENBQVMseUJBQVQ7cUJBRUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQWdCLEtBQUMsQ0FBQSxvQkFBRCxDQUNkLGNBRGMsRUFFZDtnQkFDQSxJQUFBLEVBQU0sOENBRE47Z0JBRUEsT0FBQSxFQUFTLG1CQUZUO2dCQUdBLFVBQUEsRUFBWSxxQkFIWjtlQUZjLENBQWhCLEVBckJGOztVQVJNO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUhSLEVBRkY7T0FBQSxNQUFBO2VBNENFLElBQUMsQ0FBQSxHQUFELENBQUssY0FBTCxFQUFxQixDQUNuQixLQURtQixFQUVXLE9BQU8sQ0FBQyxLQUF0QyxHQUFBLFVBQUEsR0FBVyxPQUFPLENBQUMsS0FBbkIsR0FBQSxNQUZtQixFQUdhLE9BQU8sQ0FBQyxNQUF4QyxHQUFBLFdBQUEsR0FBWSxPQUFPLENBQUMsTUFBcEIsR0FBQSxNQUhtQixFQUljLFVBQWpDLEdBQUEsZ0JBQUEsR0FBaUIsVUFBakIsR0FBQSxNQUptQixFQUtuQixRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxNQUFWLEVBQWtCLElBQWxCLENBTFEsQ0FBckIsRUFNSztVQUNELGdCQUFBLEVBQWtCLElBRGpCO1VBRUQsSUFBQSxFQUFNO1lBQ0osSUFBQSxFQUFNLDhDQURGO1dBRkw7U0FOTCxDQVlFLENBQUMsSUFaSCxDQVlRLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1VBREk7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBWlIsRUE1Q0Y7O0lBTFE7Ozs7S0FSOEI7QUFSMUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHBzOi8vZ2l0aHViLmNvbS9GcmllbmRzT2ZQSFAvUEhQLUNTLUZpeGVyXG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBIUENTRml4ZXIgZXh0ZW5kcyBCZWF1dGlmaWVyXG5cbiAgbmFtZTogJ1BIUC1DUy1GaXhlcidcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vRnJpZW5kc09mUEhQL1BIUC1DUy1GaXhlclwiXG5cbiAgb3B0aW9uczpcbiAgICBQSFA6IHRydWVcblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zLCBjb250ZXh0KSAtPlxuICAgIEBkZWJ1ZygncGhwLWNzLWZpeGVyJywgb3B0aW9ucylcblxuICAgIGNvbmZpZ0ZpbGUgPSBpZiBjb250ZXh0PyBhbmQgY29udGV4dC5maWxlUGF0aD8gdGhlbiBAZmluZEZpbGUocGF0aC5kaXJuYW1lKGNvbnRleHQuZmlsZVBhdGgpLCAnLnBocF9jcycpXG5cbiAgICBpZiBAaXNXaW5kb3dzXG4gICAgICAjIEZpbmQgcGhwLWNzLWZpeGVyLnBoYXIgc2NyaXB0XG4gICAgICBAUHJvbWlzZS5hbGwoW1xuICAgICAgICBAd2hpY2gob3B0aW9ucy5jc19maXhlcl9wYXRoKSBpZiBvcHRpb25zLmNzX2ZpeGVyX3BhdGhcbiAgICAgICAgQHdoaWNoKCdwaHAtY3MtZml4ZXInKVxuICAgICAgXSkudGhlbigocGF0aHMpID0+XG4gICAgICAgIEBkZWJ1ZygncGhwLWNzLWZpeGVyIHBhdGhzJywgcGF0aHMpXG4gICAgICAgIF8gPSByZXF1aXJlICdsb2Rhc2gnXG4gICAgICAgICMgR2V0IGZpcnN0IHZhbGlkLCBhYnNvbHV0ZSBwYXRoXG4gICAgICAgIHBocENTRml4ZXJQYXRoID0gXy5maW5kKHBhdGhzLCAocCkgLT4gcCBhbmQgcGF0aC5pc0Fic29sdXRlKHApIClcbiAgICAgICAgQHZlcmJvc2UoJ3BocENTRml4ZXJQYXRoJywgcGhwQ1NGaXhlclBhdGgpXG4gICAgICAgIEBkZWJ1ZygncGhwQ1NGaXhlclBhdGgnLCBwaHBDU0ZpeGVyUGF0aCwgcGF0aHMpXG4gICAgICAgICMgQ2hlY2sgaWYgUEhQLUNTLUZpeGVyIHBhdGggd2FzIGZvdW5kXG4gICAgICAgIGlmIHBocENTRml4ZXJQYXRoP1xuICAgICAgICAgICMgRm91bmQgUEhQLUNTLUZpeGVyIHBhdGhcbiAgICAgICAgICBAcnVuKFwicGhwXCIsIFtcbiAgICAgICAgICAgIHBocENTRml4ZXJQYXRoXG4gICAgICAgICAgICBcImZpeFwiXG4gICAgICAgICAgICBcIi0tbGV2ZWw9I3tvcHRpb25zLmxldmVsfVwiIGlmIG9wdGlvbnMubGV2ZWxcbiAgICAgICAgICAgIFwiLS1maXhlcnM9I3tvcHRpb25zLmZpeGVyc31cIiBpZiBvcHRpb25zLmZpeGVyc1xuICAgICAgICAgICAgXCItLWNvbmZpZy1maWxlPSN7Y29uZmlnRmlsZX1cIiBpZiBjb25maWdGaWxlXG4gICAgICAgICAgICB0ZW1wRmlsZSA9IEB0ZW1wRmlsZShcInRlbXBcIiwgdGV4dClcbiAgICAgICAgICAgIF0sIHtcbiAgICAgICAgICAgICAgaWdub3JlUmV0dXJuQ29kZTogdHJ1ZVxuICAgICAgICAgICAgICBoZWxwOiB7XG4gICAgICAgICAgICAgICAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vRnJpZW5kc09mUEhQL1BIUC1DUy1GaXhlclwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbig9PlxuICAgICAgICAgICAgICBAcmVhZEZpbGUodGVtcEZpbGUpXG4gICAgICAgICAgICApXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAdmVyYm9zZSgncGhwLWNzLWZpeGVyIG5vdCBmb3VuZCEnKVxuICAgICAgICAgICMgQ291bGQgbm90IGZpbmQgUEhQLUNTLUZpeGVyIHBhdGhcbiAgICAgICAgICBAUHJvbWlzZS5yZWplY3QoQGNvbW1hbmROb3RGb3VuZEVycm9yKFxuICAgICAgICAgICAgJ3BocC1jcy1maXhlcidcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL0ZyaWVuZHNPZlBIUC9QSFAtQ1MtRml4ZXJcIlxuICAgICAgICAgICAgcHJvZ3JhbTogXCJwaHAtY3MtZml4ZXIucGhhclwiXG4gICAgICAgICAgICBwYXRoT3B0aW9uOiBcIlBIUCAtIENTIEZpeGVyIFBhdGhcIlxuICAgICAgICAgICAgfSlcbiAgICAgICAgICApXG4gICAgICApXG4gICAgZWxzZVxuICAgICAgQHJ1bihcInBocC1jcy1maXhlclwiLCBbXG4gICAgICAgIFwiZml4XCJcbiAgICAgICAgXCItLWxldmVsPSN7b3B0aW9ucy5sZXZlbH1cIiBpZiBvcHRpb25zLmxldmVsXG4gICAgICAgIFwiLS1maXhlcnM9I3tvcHRpb25zLmZpeGVyc31cIiBpZiBvcHRpb25zLmZpeGVyc1xuICAgICAgICBcIi0tY29uZmlnLWZpbGU9I3tjb25maWdGaWxlfVwiIGlmIGNvbmZpZ0ZpbGVcbiAgICAgICAgdGVtcEZpbGUgPSBAdGVtcEZpbGUoXCJ0ZW1wXCIsIHRleHQpXG4gICAgICAgIF0sIHtcbiAgICAgICAgICBpZ25vcmVSZXR1cm5Db2RlOiB0cnVlXG4gICAgICAgICAgaGVscDoge1xuICAgICAgICAgICAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vRnJpZW5kc09mUEhQL1BIUC1DUy1GaXhlclwiXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAudGhlbig9PlxuICAgICAgICAgIEByZWFkRmlsZSh0ZW1wRmlsZSlcbiAgICAgICAgKVxuIl19
