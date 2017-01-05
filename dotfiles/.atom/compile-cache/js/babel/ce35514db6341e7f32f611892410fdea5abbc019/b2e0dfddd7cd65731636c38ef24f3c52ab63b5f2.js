'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Promise = require('bluebird');
var readdir = Promise.promisify(require('fs').readdir);
var path = require('path');
var fuzzaldrin = require('fuzzaldrin');
var escapeRegExp = require('lodash.escaperegexp');
var get = require('lodash.get');
var findBabelConfig = require('find-babel-config');
var internalModules = require('./utils/internal-modules');

var LINE_REGEXP = /require|import|export\s+(?:\*|{[a-zA-Z0-9_$,\s]+})+\s+from|}\s*from\s*['"]/;
var SELECTOR = ['.source.js .string.quoted',

// for babel-language plugin
'.source.js .punctuation.definition.string.end', '.source.js .punctuation.definition.string.begin', '.source.ts .string.quoted', '.source.coffee .string.quoted'];
var SELECTOR_DISABLE = ['.source.js .comment', '.source.js .keyword', '.source.ts .comment', '.source.ts .keyword'];

var CompletionProvider = (function () {
  function CompletionProvider() {
    _classCallCheck(this, CompletionProvider);

    this.selector = SELECTOR.join(', ');
    this.disableForSelector = SELECTOR_DISABLE.join(', ');
    this.inclusionPriority = 1;
  }

  _createClass(CompletionProvider, [{
    key: 'getSuggestions',
    value: function getSuggestions(_ref) {
      var _this = this;

      var editor = _ref.editor;
      var bufferPosition = _ref.bufferPosition;
      var prefix = _ref.prefix;

      var line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      if (!LINE_REGEXP.test(line)) {
        return [];
      }

      var realPrefix = this.getRealPrefix(prefix, line);
      if (!realPrefix) {
        return [];
      }

      if (realPrefix[0] === '.') {
        return this.lookupLocal(realPrefix, path.dirname(editor.getPath()));
      }

      var vendors = atom.config.get('autocomplete-modules.vendors');

      var promises = vendors.map(function (vendor) {
        return _this.lookupGlobal(realPrefix, vendor);
      });

      var webpack = atom.config.get('autocomplete-modules.webpack');
      if (webpack) {
        promises.push(this.lookupWebpack(realPrefix));
      }

      var babelPluginModuleResolver = atom.config.get('autocomplete-modules.babelPluginModuleResolver');
      if (babelPluginModuleResolver) {
        promises.push(this.lookupbabelPluginModuleResolver(realPrefix));
      }

      return Promise.all(promises).then(function (suggestions) {
        var _ref2;

        return (_ref2 = []).concat.apply(_ref2, _toConsumableArray(suggestions));
      });
    }
  }, {
    key: 'getRealPrefix',
    value: function getRealPrefix(prefix, line) {
      try {
        var realPrefixRegExp = new RegExp('[\'"]((?:.+?)*' + escapeRegExp(prefix) + ')');
        var realPrefixMathes = realPrefixRegExp.exec(line);
        if (!realPrefixMathes) {
          return false;
        }

        return realPrefixMathes[1];
      } catch (e) {
        return false;
      }
    }
  }, {
    key: 'filterSuggestions',
    value: function filterSuggestions(prefix, suggestions) {
      return fuzzaldrin.filter(suggestions, prefix, {
        key: 'text'
      });
    }
  }, {
    key: 'lookupLocal',
    value: function lookupLocal(prefix, dirname) {
      var _this2 = this;

      var filterPrefix = prefix.replace(path.dirname(prefix), '').replace('/', '');
      if (filterPrefix[filterPrefix.length - 1] === '/') {
        filterPrefix = '';
      }

      var includeExtension = atom.config.get('autocomplete-modules.includeExtension');
      var lookupDirname = path.resolve(dirname, prefix);
      if (filterPrefix) {
        lookupDirname = lookupDirname.replace(new RegExp(escapeRegExp(filterPrefix) + '$'), '');
      }

      return readdir(lookupDirname)['catch'](function (e) {
        if (e.code !== 'ENOENT') {
          throw e;
        }

        return [];
      }).filter(function (filename) {
        return filename[0] !== '.';
      }).map(function (pathname) {
        return {
          text: includeExtension ? pathname : _this2.normalizeLocal(pathname),
          displayText: pathname,
          type: 'import'
        };
      }).then(function (suggestions) {
        return _this2.filterSuggestions(filterPrefix, suggestions);
      });
    }
  }, {
    key: 'normalizeLocal',
    value: function normalizeLocal(filename) {
      return filename.replace(/\.(js|es6|jsx|coffee|ts|tsx)$/, '');
    }
  }, {
    key: 'lookupGlobal',
    value: function lookupGlobal(prefix) {
      var _this3 = this;

      var vendor = arguments.length <= 1 || arguments[1] === undefined ? 'node_modules' : arguments[1];

      var projectPath = atom.project.getPaths()[0];
      if (!projectPath) {
        return Promise.resolve([]);
      }

      var vendorPath = path.join(projectPath, vendor);
      if (prefix.indexOf('/') !== -1) {
        return this.lookupLocal('./' + prefix, vendorPath);
      }

      return readdir(vendorPath)['catch'](function (e) {
        if (e.code !== 'ENOENT') {
          throw e;
        }

        return [];
      }).then(function (libs) {
        return [].concat(_toConsumableArray(internalModules), _toConsumableArray(libs));
      }).map(function (lib) {
        return {
          text: lib,
          replacementPrefix: prefix,
          type: 'import'
        };
      }).then(function (suggestions) {
        return _this3.filterSuggestions(prefix, suggestions);
      });
    }
  }, {
    key: 'lookupWebpack',
    value: function lookupWebpack(prefix) {
      var _this4 = this;

      var projectPath = atom.project.getPaths()[0];
      if (!projectPath) {
        return Promise.resolve([]);
      }

      var vendors = atom.config.get('autocomplete-modules.vendors');
      var webpackConfig = this.fetchWebpackConfig(projectPath);

      var webpackRoot = get(webpackConfig, 'resolve.root', '');
      var moduleSearchPaths = get(webpackConfig, 'resolve.modulesDirectories', []);
      moduleSearchPaths = moduleSearchPaths.filter(function (item) {
        return vendors.indexOf(item) === -1;
      });

      return Promise.all(moduleSearchPaths.map(function (searchPath) {
        return _this4.lookupLocal(prefix, path.join(webpackRoot, searchPath));
      })).then(function (suggestions) {
        var _ref3;

        return (_ref3 = []).concat.apply(_ref3, _toConsumableArray(suggestions));
      });
    }
  }, {
    key: 'fetchWebpackConfig',
    value: function fetchWebpackConfig(rootPath) {
      var webpackConfigFilename = atom.config.get('autocomplete-modules.webpackConfigFilename');
      var webpackConfigPath = path.join(rootPath, webpackConfigFilename);

      try {
        return require(webpackConfigPath); // eslint-disable-line
      } catch (error) {
        return {};
      }
    }
  }, {
    key: 'lookupbabelPluginModuleResolver',
    value: function lookupbabelPluginModuleResolver(prefix) {
      var _this5 = this;

      var projectPath = atom.project.getPaths()[0];
      if (projectPath) {
        return findBabelConfig(projectPath).then(function (_ref4) {
          var config = _ref4.config;

          if (config && Array.isArray(config.plugins)) {
            var _ret = (function () {
              // Grab the v1 (module-alias) or v2 (module-resolver) plugin configuration
              var pluginConfig = config.plugins.find(function (p) {
                return p[0] === 'module-alias' || p[0] === 'babel-plugin-module-alias';
              }) || config.plugins.find(function (p) {
                return p[0] === 'module-resolver' || p[0] === 'babel-plugin-module-resolver';
              });
              if (!pluginConfig) {
                return {
                  v: []
                };
              }

              // Only v2 of the plugin supports custom root directories
              var rootPromises = [];
              if (!Array.isArray(pluginConfig[1])) {
                var rootDirs = pluginConfig[1].root || [];
                rootPromises = rootPromises.concat(rootDirs.map(function (r) {
                  var rootDirPath = path.join(projectPath, r);
                  return _this5.lookupLocal('./' + prefix, rootDirPath);
                }));
              }

              // determine the right prefix for the alias config
              // `realPrefix` is the prefix we want to use to find the right file/suggestions
              // when the prefix is a sub module (eg. module/subfile),
              // `modulePrefix` will be "module", and `realPrefix` will be "subfile"
              var prefixSplit = prefix.split('/');
              var modulePrefix = prefixSplit[0];
              var realPrefix = prefixSplit.pop();
              var moduleSearchPath = prefixSplit.join('/');

              // get the alias configs for the specific module
              var aliasConfig = Array.isArray(pluginConfig[1])
              // v1 of the plugin is an array
              ? pluginConfig[1].filter(function (alias) {
                return alias.expose.startsWith(modulePrefix);
              })
              // otherwise it's v2 (an object)
              : Object.keys(pluginConfig[1].alias || {}).filter(function (expose) {
                return expose.startsWith(modulePrefix);
              }).map(function (exp) {
                return {
                  expose: exp,
                  src: pluginConfig[1].alias[exp]
                };
              });

              return {
                v: Promise.all(rootPromises.concat(aliasConfig.map(function (alias) {
                  // The search path is the parent directory of the source directory specified in .babelrc
                  // then we append the `moduleSearchPath` to get the real search path
                  var searchPath = path.join(path.dirname(path.resolve(projectPath, alias.src)), moduleSearchPath);

                  return _this5.lookupLocal(realPrefix, searchPath);
                }))).then(function (suggestions) {
                  var _ref5;

                  return (_ref5 = []).concat.apply(_ref5, _toConsumableArray(suggestions));
                }).then(function (suggestions) {
                  // make sure the suggestions are from the compatible alias
                  if (prefix === realPrefix && aliasConfig.length) {
                    return suggestions.filter(function (sugg) {
                      return aliasConfig.find(function (a) {
                        return a.expose === sugg.text;
                      });
                    });
                  }
                  return suggestions;
                })
              };
            })();

            if (typeof _ret === 'object') return _ret.v;
          }

          return [];
        });
      }
    }
  }]);

  return CompletionProvider;
})();

module.exports = CompletionProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1tb2R1bGVzL3NyYy9jb21wbGV0aW9uLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7QUFFWixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDekQsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN6QyxJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUNwRCxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbEMsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDckQsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7O0FBRTVELElBQU0sV0FBVyxHQUFHLDRFQUE0RSxDQUFDO0FBQ2pHLElBQU0sUUFBUSxHQUFHLENBQ2YsMkJBQTJCOzs7QUFHM0IsK0NBQStDLEVBQy9DLGlEQUFpRCxFQUVqRCwyQkFBMkIsRUFDM0IsK0JBQStCLENBQ2hDLENBQUM7QUFDRixJQUFNLGdCQUFnQixHQUFHLENBQ3ZCLHFCQUFxQixFQUNyQixxQkFBcUIsRUFDckIscUJBQXFCLEVBQ3JCLHFCQUFxQixDQUN0QixDQUFDOztJQUVJLGtCQUFrQjtBQUNYLFdBRFAsa0JBQWtCLEdBQ1I7MEJBRFYsa0JBQWtCOztBQUVwQixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxD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cnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLW1vZHVsZXMvc3JjL2NvbXBsZXRpb24tcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5jb25zdCByZWFkZGlyID0gUHJvbWlzZS5wcm9taXNpZnkocmVxdWlyZSgnZnMnKS5yZWFkZGlyKTtcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCBmdXp6YWxkcmluID0gcmVxdWlyZSgnZnV6emFsZHJpbicpO1xuY29uc3QgZXNjYXBlUmVnRXhwID0gcmVxdWlyZSgnbG9kYXNoLmVzY2FwZXJlZ2V4cCcpO1xuY29uc3QgZ2V0ID0gcmVxdWlyZSgnbG9kYXNoLmdldCcpO1xuY29uc3QgZmluZEJhYmVsQ29uZmlnID0gcmVxdWlyZSgnZmluZC1iYWJlbC1jb25maWcnKTtcbmNvbnN0IGludGVybmFsTW9kdWxlcyA9IHJlcXVpcmUoJy4vdXRpbHMvaW50ZXJuYWwtbW9kdWxlcycpO1xuXG5jb25zdCBMSU5FX1JFR0VYUCA9IC9yZXF1aXJlfGltcG9ydHxleHBvcnRcXHMrKD86XFwqfHtbYS16QS1aMC05XyQsXFxzXSt9KStcXHMrZnJvbXx9XFxzKmZyb21cXHMqWydcIl0vO1xuY29uc3QgU0VMRUNUT1IgPSBbXG4gICcuc291cmNlLmpzIC5zdHJpbmcucXVvdGVkJyxcblxuICAvLyBmb3IgYmFiZWwtbGFuZ3VhZ2UgcGx1Z2luXG4gICcuc291cmNlLmpzIC5wdW5jdHVhdGlvbi5kZWZpbml0aW9uLnN0cmluZy5lbmQnLFxuICAnLnNvdXJjZS5qcyAucHVuY3R1YXRpb24uZGVmaW5pdGlvbi5zdHJpbmcuYmVnaW4nLFxuXG4gICcuc291cmNlLnRzIC5zdHJpbmcucXVvdGVkJyxcbiAgJy5zb3VyY2UuY29mZmVlIC5zdHJpbmcucXVvdGVkJ1xuXTtcbmNvbnN0IFNFTEVDVE9SX0RJU0FCTEUgPSBbXG4gICcuc291cmNlLmpzIC5jb21tZW50JyxcbiAgJy5zb3VyY2UuanMgLmtleXdvcmQnLFxuICAnLnNvdXJjZS50cyAuY29tbWVudCcsXG4gICcuc291cmNlLnRzIC5rZXl3b3JkJ1xuXTtcblxuY2xhc3MgQ29tcGxldGlvblByb3ZpZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWxlY3RvciA9IFNFTEVDVE9SLmpvaW4oJywgJyk7XG4gICAgdGhpcy5kaXNhYmxlRm9yU2VsZWN0b3IgPSBTRUxFQ1RPUl9ESVNBQkxFLmpvaW4oJywgJyk7XG4gICAgdGhpcy5pbmNsdXNpb25Qcmlvcml0eSA9IDE7XG4gIH1cblxuICBnZXRTdWdnZXN0aW9ucyh7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgcHJlZml4fSkge1xuICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pO1xuICAgIGlmICghTElORV9SRUdFWFAudGVzdChsaW5lKSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IHJlYWxQcmVmaXggPSB0aGlzLmdldFJlYWxQcmVmaXgocHJlZml4LCBsaW5lKTtcbiAgICBpZiAoIXJlYWxQcmVmaXgpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBpZiAocmVhbFByZWZpeFswXSA9PT0gJy4nKSB7XG4gICAgICByZXR1cm4gdGhpcy5sb29rdXBMb2NhbChyZWFsUHJlZml4LCBwYXRoLmRpcm5hbWUoZWRpdG9yLmdldFBhdGgoKSkpO1xuICAgIH1cblxuICAgIGNvbnN0IHZlbmRvcnMgPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1tb2R1bGVzLnZlbmRvcnMnKTtcblxuICAgIGNvbnN0IHByb21pc2VzID0gdmVuZG9ycy5tYXAoXG4gICAgICAodmVuZG9yKSA9PiB0aGlzLmxvb2t1cEdsb2JhbChyZWFsUHJlZml4LCB2ZW5kb3IpXG4gICAgKTtcblxuICAgIGNvbnN0IHdlYnBhY2sgPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1tb2R1bGVzLndlYnBhY2snKTtcbiAgICBpZiAod2VicGFjaykge1xuICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLmxvb2t1cFdlYnBhY2socmVhbFByZWZpeCkpO1xuICAgIH1cblxuICAgIGNvbnN0IGJhYmVsUGx1Z2luTW9kdWxlUmVzb2x2ZXIgPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1tb2R1bGVzLmJhYmVsUGx1Z2luTW9kdWxlUmVzb2x2ZXInKTtcbiAgICBpZiAoYmFiZWxQbHVnaW5Nb2R1bGVSZXNvbHZlcikge1xuICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLmxvb2t1cGJhYmVsUGx1Z2luTW9kdWxlUmVzb2x2ZXIocmVhbFByZWZpeCkpO1xuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihcbiAgICAgIChzdWdnZXN0aW9ucykgPT4gW10uY29uY2F0KC4uLnN1Z2dlc3Rpb25zKVxuICAgICk7XG4gIH1cblxuICBnZXRSZWFsUHJlZml4KHByZWZpeCwgbGluZSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZWFsUHJlZml4UmVnRXhwID0gbmV3IFJlZ0V4cChgWydcIl0oKD86Lis/KSoke2VzY2FwZVJlZ0V4cChwcmVmaXgpfSlgKTtcbiAgICAgIGNvbnN0IHJlYWxQcmVmaXhNYXRoZXMgPSByZWFsUHJlZml4UmVnRXhwLmV4ZWMobGluZSk7XG4gICAgICBpZiAoIXJlYWxQcmVmaXhNYXRoZXMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVhbFByZWZpeE1hdGhlc1sxXTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZmlsdGVyU3VnZ2VzdGlvbnMocHJlZml4LCBzdWdnZXN0aW9ucykge1xuICAgIHJldHVybiBmdXp6YWxkcmluLmZpbHRlcihzdWdnZXN0aW9ucywgcHJlZml4LCB7XG4gICAgICBrZXk6ICd0ZXh0J1xuICAgIH0pO1xuICB9XG5cbiAgbG9va3VwTG9jYWwocHJlZml4LCBkaXJuYW1lKSB7XG4gICAgbGV0IGZpbHRlclByZWZpeCA9IHByZWZpeC5yZXBsYWNlKHBhdGguZGlybmFtZShwcmVmaXgpLCAnJykucmVwbGFjZSgnLycsICcnKTtcbiAgICBpZiAoZmlsdGVyUHJlZml4W2ZpbHRlclByZWZpeC5sZW5ndGggLSAxXSA9PT0gJy8nKSB7XG4gICAgICBmaWx0ZXJQcmVmaXggPSAnJztcbiAgICB9XG5cbiAgICBjb25zdCBpbmNsdWRlRXh0ZW5zaW9uID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtbW9kdWxlcy5pbmNsdWRlRXh0ZW5zaW9uJyk7XG4gICAgbGV0IGxvb2t1cERpcm5hbWUgPSBwYXRoLnJlc29sdmUoZGlybmFtZSwgcHJlZml4KTtcbiAgICBpZiAoZmlsdGVyUHJlZml4KSB7XG4gICAgICBsb29rdXBEaXJuYW1lID0gbG9va3VwRGlybmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoYCR7ZXNjYXBlUmVnRXhwKGZpbHRlclByZWZpeCl9JGApLCAnJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlYWRkaXIobG9va3VwRGlybmFtZSkuY2F0Y2goKGUpID0+IHtcbiAgICAgIGlmIChlLmNvZGUgIT09ICdFTk9FTlQnKSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbXTtcbiAgICB9KS5maWx0ZXIoXG4gICAgICAoZmlsZW5hbWUpID0+IGZpbGVuYW1lWzBdICE9PSAnLidcbiAgICApLm1hcCgocGF0aG5hbWUpID0+ICh7XG4gICAgICB0ZXh0OiBpbmNsdWRlRXh0ZW5zaW9uID8gcGF0aG5hbWUgOiB0aGlzLm5vcm1hbGl6ZUxvY2FsKHBhdGhuYW1lKSxcbiAgICAgIGRpc3BsYXlUZXh0OiBwYXRobmFtZSxcbiAgICAgIHR5cGU6ICdpbXBvcnQnXG4gICAgfSkpLnRoZW4oXG4gICAgICAoc3VnZ2VzdGlvbnMpID0+IHRoaXMuZmlsdGVyU3VnZ2VzdGlvbnMoZmlsdGVyUHJlZml4LCBzdWdnZXN0aW9ucylcbiAgICApO1xuICB9XG5cbiAgbm9ybWFsaXplTG9jYWwoZmlsZW5hbWUpIHtcbiAgICByZXR1cm4gZmlsZW5hbWUucmVwbGFjZSgvXFwuKGpzfGVzNnxqc3h8Y29mZmVlfHRzfHRzeCkkLywgJycpO1xuICB9XG5cbiAgbG9va3VwR2xvYmFsKHByZWZpeCwgdmVuZG9yID0gJ25vZGVfbW9kdWxlcycpIHtcbiAgICBjb25zdCBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdO1xuICAgIGlmICghcHJvamVjdFBhdGgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgIH1cblxuICAgIGNvbnN0IHZlbmRvclBhdGggPSBwYXRoLmpvaW4ocHJvamVjdFBhdGgsIHZlbmRvcik7XG4gICAgaWYgKHByZWZpeC5pbmRleE9mKCcvJykgIT09IC0xKSB7XG4gICAgICByZXR1cm4gdGhpcy5sb29rdXBMb2NhbChgLi8ke3ByZWZpeH1gLCB2ZW5kb3JQYXRoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVhZGRpcih2ZW5kb3JQYXRoKS5jYXRjaCgoZSkgPT4ge1xuICAgICAgaWYgKGUuY29kZSAhPT0gJ0VOT0VOVCcpIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFtdO1xuICAgIH0pLnRoZW4oXG4gICAgICAobGlicykgPT4gWy4uLmludGVybmFsTW9kdWxlcywgLi4ubGlic11cbiAgICApLm1hcCgobGliKSA9PiAoe1xuICAgICAgdGV4dDogbGliLFxuICAgICAgcmVwbGFjZW1lbnRQcmVmaXg6IHByZWZpeCxcbiAgICAgIHR5cGU6ICdpbXBvcnQnXG4gICAgfSkpLnRoZW4oXG4gICAgICAoc3VnZ2VzdGlvbnMpID0+IHRoaXMuZmlsdGVyU3VnZ2VzdGlvbnMocHJlZml4LCBzdWdnZXN0aW9ucylcbiAgICApO1xuICB9XG5cbiAgbG9va3VwV2VicGFjayhwcmVmaXgpIHtcbiAgICBjb25zdCBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdO1xuICAgIGlmICghcHJvamVjdFBhdGgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgIH1cblxuICAgIGNvbnN0IHZlbmRvcnMgPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1tb2R1bGVzLnZlbmRvcnMnKTtcbiAgICBjb25zdCB3ZWJwYWNrQ29uZmlnID0gdGhpcy5mZXRjaFdlYnBhY2tDb25maWcocHJvamVjdFBhdGgpO1xuXG4gICAgY29uc3Qgd2VicGFja1Jvb3QgPSBnZXQod2VicGFja0NvbmZpZywgJ3Jlc29sdmUucm9vdCcsICcnKTtcbiAgICBsZXQgbW9kdWxlU2VhcmNoUGF0aHMgPSBnZXQod2VicGFja0NvbmZpZywgJ3Jlc29sdmUubW9kdWxlc0RpcmVjdG9yaWVzJywgW10pO1xuICAgIG1vZHVsZVNlYXJjaFBhdGhzID0gbW9kdWxlU2VhcmNoUGF0aHMuZmlsdGVyKFxuICAgICAgKGl0ZW0pID0+IHZlbmRvcnMuaW5kZXhPZihpdGVtKSA9PT0gLTFcbiAgICApO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKG1vZHVsZVNlYXJjaFBhdGhzLm1hcChcbiAgICAgIChzZWFyY2hQYXRoKSA9PiB0aGlzLmxvb2t1cExvY2FsKHByZWZpeCwgcGF0aC5qb2luKHdlYnBhY2tSb290LCBzZWFyY2hQYXRoKSlcbiAgICApKS50aGVuKFxuICAgICAgKHN1Z2dlc3Rpb25zKSA9PiBbXS5jb25jYXQoLi4uc3VnZ2VzdGlvbnMpXG4gICAgKTtcbiAgfVxuXG4gIGZldGNoV2VicGFja0NvbmZpZyhyb290UGF0aCkge1xuICAgIGNvbnN0IHdlYnBhY2tDb25maWdGaWxlbmFtZSA9IGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLW1vZHVsZXMud2VicGFja0NvbmZpZ0ZpbGVuYW1lJyk7XG4gICAgY29uc3Qgd2VicGFja0NvbmZpZ1BhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsIHdlYnBhY2tDb25maWdGaWxlbmFtZSk7XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHJlcXVpcmUod2VicGFja0NvbmZpZ1BhdGgpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH1cblxuICBsb29rdXBiYWJlbFBsdWdpbk1vZHVsZVJlc29sdmVyKHByZWZpeCkge1xuICAgIGNvbnN0IHByb2plY3RQYXRoID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF07XG4gICAgaWYgKHByb2plY3RQYXRoKSB7XG4gICAgICByZXR1cm4gZmluZEJhYmVsQ29uZmlnKHByb2plY3RQYXRoKS50aGVuKCh7Y29uZmlnfSkgPT4ge1xuICAgICAgICBpZiAoY29uZmlnICYmIEFycmF5LmlzQXJyYXkoY29uZmlnLnBsdWdpbnMpKSB7XG4gICAgICAgICAgLy8gR3JhYiB0aGUgdjEgKG1vZHVsZS1hbGlhcykgb3IgdjIgKG1vZHVsZS1yZXNvbHZlcikgcGx1Z2luIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICBjb25zdCBwbHVnaW5Db25maWcgPSBjb25maWcucGx1Z2lucy5maW5kKHAgPT4gcFswXSA9PT0gJ21vZHVsZS1hbGlhcycgfHwgcFswXSA9PT0gJ2JhYmVsLXBsdWdpbi1tb2R1bGUtYWxpYXMnKSB8fFxuICAgICAgICAgICAgY29uZmlnLnBsdWdpbnMuZmluZChwID0+IHBbMF0gPT09ICdtb2R1bGUtcmVzb2x2ZXInIHx8IHBbMF0gPT09ICdiYWJlbC1wbHVnaW4tbW9kdWxlLXJlc29sdmVyJyk7XG4gICAgICAgICAgaWYgKCFwbHVnaW5Db25maWcpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBPbmx5IHYyIG9mIHRoZSBwbHVnaW4gc3VwcG9ydHMgY3VzdG9tIHJvb3QgZGlyZWN0b3JpZXNcbiAgICAgICAgICBsZXQgcm9vdFByb21pc2VzID0gW107XG4gICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHBsdWdpbkNvbmZpZ1sxXSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvb3REaXJzID0gcGx1Z2luQ29uZmlnWzFdLnJvb3QgfHwgW107XG4gICAgICAgICAgICByb290UHJvbWlzZXMgPSByb290UHJvbWlzZXMuY29uY2F0KHJvb3REaXJzLm1hcChyID0+IHtcbiAgICAgICAgICAgICAgY29uc3Qgcm9vdERpclBhdGggPSBwYXRoLmpvaW4ocHJvamVjdFBhdGgsIHIpO1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb29rdXBMb2NhbChgLi8ke3ByZWZpeH1gLCByb290RGlyUGF0aCk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gZGV0ZXJtaW5lIHRoZSByaWdodCBwcmVmaXggZm9yIHRoZSBhbGlhcyBjb25maWdcbiAgICAgICAgICAvLyBgcmVhbFByZWZpeGAgaXMgdGhlIHByZWZpeCB3ZSB3YW50IHRvIHVzZSB0byBmaW5kIHRoZSByaWdodCBmaWxlL3N1Z2dlc3Rpb25zXG4gICAgICAgICAgLy8gd2hlbiB0aGUgcHJlZml4IGlzIGEgc3ViIG1vZHVsZSAoZWcuIG1vZHVsZS9zdWJmaWxlKSxcbiAgICAgICAgICAvLyBgbW9kdWxlUHJlZml4YCB3aWxsIGJlIFwibW9kdWxlXCIsIGFuZCBgcmVhbFByZWZpeGAgd2lsbCBiZSBcInN1YmZpbGVcIlxuICAgICAgICAgIGNvbnN0IHByZWZpeFNwbGl0ID0gcHJlZml4LnNwbGl0KCcvJyk7XG4gICAgICAgICAgY29uc3QgbW9kdWxlUHJlZml4ID0gcHJlZml4U3BsaXRbMF07XG4gICAgICAgICAgY29uc3QgcmVhbFByZWZpeCA9IHByZWZpeFNwbGl0LnBvcCgpO1xuICAgICAgICAgIGNvbnN0IG1vZHVsZVNlYXJjaFBhdGggPSBwcmVmaXhTcGxpdC5qb2luKCcvJyk7XG5cbiAgICAgICAgICAvLyBnZXQgdGhlIGFsaWFzIGNvbmZpZ3MgZm9yIHRoZSBzcGVjaWZpYyBtb2R1bGVcbiAgICAgICAgICBjb25zdCBhbGlhc0NvbmZpZyA9IEFycmF5LmlzQXJyYXkocGx1Z2luQ29uZmlnWzFdKVxuICAgICAgICAgICAgLy8gdjEgb2YgdGhlIHBsdWdpbiBpcyBhbiBhcnJheVxuICAgICAgICAgICAgPyBwbHVnaW5Db25maWdbMV0uZmlsdGVyKGFsaWFzID0+IGFsaWFzLmV4cG9zZS5zdGFydHNXaXRoKG1vZHVsZVByZWZpeCkpXG4gICAgICAgICAgICAvLyBvdGhlcndpc2UgaXQncyB2MiAoYW4gb2JqZWN0KVxuICAgICAgICAgICAgOiBPYmplY3Qua2V5cyhwbHVnaW5Db25maWdbMV0uYWxpYXMgfHwge30pXG4gICAgICAgICAgICAgIC5maWx0ZXIoZXhwb3NlID0+IGV4cG9zZS5zdGFydHNXaXRoKG1vZHVsZVByZWZpeCkpXG4gICAgICAgICAgICAgIC5tYXAoZXhwID0+ICh7XG4gICAgICAgICAgICAgICAgZXhwb3NlOiBleHAsXG4gICAgICAgICAgICAgICAgc3JjOiBwbHVnaW5Db25maWdbMV0uYWxpYXNbZXhwXVxuICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocm9vdFByb21pc2VzLmNvbmNhdChhbGlhc0NvbmZpZy5tYXAoXG4gICAgICAgICAgICAoYWxpYXMpID0+IHtcbiAgICAgICAgICAgICAgLy8gVGhlIHNlYXJjaCBwYXRoIGlzIHRoZSBwYXJlbnQgZGlyZWN0b3J5IG9mIHRoZSBzb3VyY2UgZGlyZWN0b3J5IHNwZWNpZmllZCBpbiAuYmFiZWxyY1xuICAgICAgICAgICAgICAvLyB0aGVuIHdlIGFwcGVuZCB0aGUgYG1vZHVsZVNlYXJjaFBhdGhgIHRvIGdldCB0aGUgcmVhbCBzZWFyY2ggcGF0aFxuICAgICAgICAgICAgICBjb25zdCBzZWFyY2hQYXRoID0gcGF0aC5qb2luKFxuICAgICAgICAgICAgICAgIHBhdGguZGlybmFtZShwYXRoLnJlc29sdmUocHJvamVjdFBhdGgsIGFsaWFzLnNyYykpLFxuICAgICAgICAgICAgICAgIG1vZHVsZVNlYXJjaFBhdGhcbiAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb29rdXBMb2NhbChyZWFsUHJlZml4LCBzZWFyY2hQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApKSkudGhlbihcbiAgICAgICAgICAgIChzdWdnZXN0aW9ucykgPT4gW10uY29uY2F0KC4uLnN1Z2dlc3Rpb25zKVxuICAgICAgICAgICkudGhlbihzdWdnZXN0aW9ucyA9PiB7XG4gICAgICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIHN1Z2dlc3Rpb25zIGFyZSBmcm9tIHRoZSBjb21wYXRpYmxlIGFsaWFzXG4gICAgICAgICAgICBpZiAocHJlZml4ID09PSByZWFsUHJlZml4ICYmIGFsaWFzQ29uZmlnLmxlbmd0aCkge1xuICAgICAgICAgICAgICByZXR1cm4gc3VnZ2VzdGlvbnMuZmlsdGVyKHN1Z2cgPT5cbiAgICAgICAgICAgICAgICBhbGlhc0NvbmZpZy5maW5kKGEgPT4gYS5leHBvc2UgPT09IHN1Z2cudGV4dClcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdWdnZXN0aW9ucztcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBsZXRpb25Qcm92aWRlcjtcbiJdfQ==