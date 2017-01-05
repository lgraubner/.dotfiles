Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _resolveFrom = require('resolve-from');

var _resolveFrom2 = _interopRequireDefault(_resolveFrom);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

'use babel';

var Server = (function () {
  function Server(projectRoot, client) {
    _classCallCheck(this, Server);

    this.client = client;

    this.child = null;

    this.resolves = {};
    this.rejects = {};

    this.projectDir = projectRoot;
    this.distDir = _path2['default'].resolve(__dirname, '../node_modules/tern');

    this.defaultConfig = {

      libs: [],
      loadEagerly: false,
      plugins: {

        doc_comment: true
      },
      ecmaScript: true,
      ecmaVersion: 6,
      dependencyBudget: 20000
    };

    var homeDir = process.env.HOME || process.env.USERPROFILE;

    if (homeDir && _fs2['default'].existsSync(_path2['default'].resolve(homeDir, '.tern-config'))) {

      this.defaultConfig = this.readProjectFile(_path2['default'].resolve(homeDir, '.tern-config'));
    }

    this.projectFileName = '.tern-project';
    this.disableLoadingLocal = false;

    this.init();
  }

  _createClass(Server, [{
    key: 'init',
    value: function init() {
      var _this = this;

      if (!this.projectDir) {

        return;
      }

      this.config = this.readProjectFile(_path2['default'].resolve(this.projectDir, this.projectFileName));

      if (!this.config) {

        this.config = this.defaultConfig;
      }

      this.config.async = _atomTernjsPackageConfig2['default'].options.ternServerGetFileAsync;
      this.config.dependencyBudget = _atomTernjsPackageConfig2['default'].options.ternServerDependencyBudget;

      if (!this.config.plugins['doc_comment']) {

        this.config.plugins['doc_comment'] = true;
      }

      var defs = this.findDefs(this.projectDir, this.config);
      var plugins = this.loadPlugins(this.projectDir, this.config);
      var files = [];

      if (this.config.loadEagerly) {

        this.config.loadEagerly.forEach(function (pat) {

          _glob2['default'].sync(pat, { cwd: _this.projectDir }).forEach(function (file) {

            files.push(file);
          });
        });
      }

      this.child = _child_process2['default'].fork(_path2['default'].resolve(__dirname, './atom-ternjs-server-worker.js'));
      this.child.on('message', this.onWorkerMessage.bind(this));
      this.child.on('error', this.onError);
      this.child.on('disconnect', this.onDisconnect);
      this.child.send({

        type: 'init',
        dir: this.projectDir,
        config: this.config,
        defs: defs,
        plugins: plugins,
        files: files
      });
    }
  }, {
    key: 'onError',
    value: function onError(e) {

      atom.notifications.addError('Child process error: ' + e, {

        dismissable: true
      });
    }
  }, {
    key: 'onDisconnect',
    value: function onDisconnect(e) {

      console.warn(e);
    }
  }, {
    key: 'request',
    value: function request(type, data) {
      var _this2 = this;

      var requestID = _nodeUuid2['default'].v1();

      return new Promise(function (resolve, reject) {

        _this2.resolves[requestID] = resolve;
        _this2.rejects[requestID] = reject;

        _this2.child.send({

          type: type,
          id: requestID,
          data: data
        });
      });
    }
  }, {
    key: 'flush',
    value: function flush() {

      this.request('flush', {}).then(function () {

        atom.notifications.addInfo('All files fetched and analyzed.');
      });
    }
  }, {
    key: 'dontLoad',
    value: function dontLoad(file) {

      if (!this.config.dontLoad) {

        return;
      }

      return this.config.dontLoad.some(function (pat) {

        return (0, _minimatch2['default'])(file, pat);
      });
    }
  }, {
    key: 'onWorkerMessage',
    value: function onWorkerMessage(e) {

      if (e.error && e.error.isUncaughtException) {

        atom.notifications.addError('UncaughtException: ' + e.error.message + '. Restarting Server...', {

          dismissable: false
        });

        for (var key in this.rejects) {

          this.rejects[key]({});
        }

        this.resolves = {};
        this.rejects = {};

        _atomTernjsManager2['default'].restartServer();

        return;
      }

      var isError = e.error !== 'null' && e.error !== 'undefined';

      if (isError) {

        console.error(e);
      }

      if (!e.type && this.resolves[e.id]) {

        if (isError) {

          this.rejects[e.id](e.error);
        } else {

          this.resolves[e.id](e.data);
        }

        delete this.resolves[e.id];
        delete this.rejects[e.id];
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      if (!this.child) {

        return;
      }

      this.child.disconnect();
      this.child = undefined;
    }
  }, {
    key: 'readJSON',
    value: function readJSON(fileName) {

      if ((0, _atomTernjsHelper.fileExists)(fileName) !== undefined) {

        return false;
      }

      var file = _fs2['default'].readFileSync(fileName, 'utf8');

      try {

        return JSON.parse(file);
      } catch (e) {

        atom.notifications.addError('Bad JSON in ' + fileName + ': ' + e.message, {

          dismissable: true
        });
        this.destroy();
      }
    }
  }, {
    key: 'mergeObjects',
    value: function mergeObjects(base, value) {

      if (!base) {

        return value;
      }

      if (!value) {

        return base;
      }

      var result = {};

      for (var prop in base) {

        result[prop] = base[prop];
      }

      for (var prop in value) {

        result[prop] = value[prop];
      }

      return result;
    }
  }, {
    key: 'readProjectFile',
    value: function readProjectFile(fileName) {

      var data = this.readJSON(fileName);

      if (!data) {

        return false;
      }

      for (var option in this.defaultConfig) {

        if (!data.hasOwnProperty(option)) {

          data[option] = this.defaultConfig[option];
        } else if (option === 'plugins') {

          data[option] = this.mergeObjects(this.defaultConfig[option], data[option]);
        }
      }

      return data;
    }
  }, {
    key: 'findFile',
    value: function findFile(file, projectDir, fallbackDir) {

      var local = _path2['default'].resolve(projectDir, file);

      if (!this.disableLoadingLocal && _fs2['default'].existsSync(local)) {

        return local;
      }

      var shared = _path2['default'].resolve(fallbackDir, file);

      if (_fs2['default'].existsSync(shared)) {

        return shared;
      }
    }
  }, {
    key: 'findDefs',
    value: function findDefs(projectDir, config) {

      var defs = [];
      var src = config.libs.slice();

      if (config.ecmaScript && src.indexOf('ecmascript') === -1) {

        src.unshift('ecmascript');
      }

      for (var i = 0; i < src.length; ++i) {

        var file = src[i];

        if (!/\.json$/.test(file)) {

          file = file + '.json';
        }

        var found = this.findFile(file, projectDir, _path2['default'].resolve(this.distDir, 'defs')) || (0, _resolveFrom2['default'])(projectDir, 'tern-' + src[i]);

        if (!found) {

          try {

            found = require.resolve('tern-' + src[i]);
          } catch (e) {

            atom.notifications.addError('Failed to find library ' + src[i] + '\n', {

              dismissable: true
            });
            continue;
          }
        }

        if (found) {

          defs.push(this.readJSON(found));
        }
      }

      return defs;
    }
  }, {
    key: 'loadPlugins',
    value: function loadPlugins(projectDir, config) {

      var plugins = config.plugins;
      var options = {};
      this.config.pluginImports = [];

      for (var plugin in plugins) {

        var val = plugins[plugin];

        if (!val) {

          continue;
        }

        var found = this.findFile(plugin + '.js', projectDir, _path2['default'].resolve(this.distDir, 'plugin')) || (0, _resolveFrom2['default'])(projectDir, 'tern-' + plugin);

        if (!found) {

          try {

            found = require.resolve('tern-' + plugin);
          } catch (e) {

            console.warn(e);
          }
        }

        if (!found) {

          try {

            found = require.resolve(this.projectDir + '/node_modules/tern-' + plugin);
          } catch (e) {

            atom.notifications.addError('Failed to find plugin ' + plugin + '\n', {

              dismissable: true
            });
            continue;
          }
        }

        this.config.pluginImports.push(found);
        options[_path2['default'].basename(plugin)] = val;
      }

      return options;
    }
  }]);

  return Server;
})();

exports['default'] = Server;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztpQ0FFb0IsdUJBQXVCOzs7O2dDQUNsQixzQkFBc0I7O2tCQUNoQyxJQUFJOzs7O29CQUNGLE1BQU07Ozs7b0JBQ04sTUFBTTs7Ozs2QkFDUixlQUFlOzs7O3lCQUNSLFdBQVc7Ozs7d0JBQ2hCLFdBQVc7Ozs7MkJBQ0osY0FBYzs7Ozt1Q0FDWiw4QkFBOEI7Ozs7QUFYeEQsV0FBVyxDQUFDOztJQWFTLE1BQU07QUFFZCxXQUZRLE1BQU0sQ0FFYixXQUFXLEVBQUUsTUFBTSxFQUFFOzBCQUZkLE1BQU07O0FBSXZCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVyQixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDO0FBQzlCLFFBQUksQ0FBQyxPQUFPLEdBQUcsa0JBQUssT0FBTyxDQUFDLFNBQVMsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDOztBQUUvRCxRQUFJLENBQUMsYUFBYSxHQUFHOztBQUVuQixVQUFJLEVBQUUsRUFBRTtBQUNSLGlCQUFXLEVBQUUsS0FBSztBQUNsQixhQUFPLEVBQUU7O0FBRVAsbUJBQVcsRUFBRSxJQUFJO09BQ2xCO0FBQ0QsZ0JBQVUsRUFBRSxJQUFJO0FBQ2hCLGlCQUFXLEVBQUUsQ0FBQztBQUNkLHNCQUFnQixFQUFFLEtBQUs7S0FDeEIsQ0FBQzs7QUFFRixRQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FB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V0FFM0UsQ0FBQyxPQUFPLENBQUMsRUFBRTs7QUFFVixnQkFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLDRCQUEwQixNQUFNLFNBQU07O0FBRS9ELHlCQUFXLEVBQUUsSUFBSTthQUNsQixDQUFDLENBQUM7QUFDSCxxQkFBUztXQUNWO1NBQ0Y7O0FBRUQsWUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RDLGVBQU8sQ0FBQyxrQkFBSyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7T0FDdEM7O0FBRUQsYUFBTyxPQUFPLENBQUM7S0FDaEI7OztTQXpZa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgbWFuYWdlciBmcm9tICcuL2F0b20tdGVybmpzLW1hbmFnZXInO1xuaW1wb3J0IHtmaWxlRXhpc3RzfSBmcm9tICcuL2F0b20tdGVybmpzLWhlbHBlcic7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCBjcCBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBtaW5pbWF0Y2ggZnJvbSAnbWluaW1hdGNoJztcbmltcG9ydCB1dWlkIGZyb20gJ25vZGUtdXVpZCc7XG5pbXBvcnQgcmVzb2x2ZUZyb20gZnJvbSAncmVzb2x2ZS1mcm9tJztcbmltcG9ydCBwYWNrYWdlQ29uZmlnIGZyb20gJy4vYXRvbS10ZXJuanMtcGFja2FnZS1jb25maWcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXIge1xuXG4gIGNvbnN0cnVjdG9yKHByb2plY3RSb290LCBjbGllbnQpIHtcblxuICAgIHRoaXMuY2xpZW50ID0gY2xpZW50O1xuXG4gICAgdGhpcy5jaGlsZCA9IG51bGw7XG5cbiAgICB0aGlzLnJlc29sdmVzID0ge307XG4gICAgdGhpcy5yZWplY3RzID0ge307XG5cbiAgICB0aGlzLnByb2plY3REaXIgPSBwcm9qZWN0Um9vdDtcbiAgICB0aGlzLmRpc3REaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vbm9kZV9tb2R1bGVzL3Rlcm4nKTtcblxuICAgIHRoaXMuZGVmYXVsdENvbmZpZyA9IHtcblxuICAgICAgbGliczogW10sXG4gICAgICBsb2FkRWFnZXJseTogZmFsc2UsXG4gICAgICBwbHVnaW5zOiB7XG5cbiAgICAgICAgZG9jX2NvbW1lbnQ6IHRydWVcbiAgICAgIH0sXG4gICAgICBlY21hU2NyaXB0OiB0cnVlLFxuICAgICAgZWNtYVZlcnNpb246IDYsXG4gICAgICBkZXBlbmRlbmN5QnVkZ2V0OiAyMDAwMFxuICAgIH07XG5cbiAgICBjb25zdCBob21lRGlyID0gcHJvY2Vzcy5lbnYuSE9NRSB8fCBwcm9jZXNzLmVudi5VU0VSUFJPRklMRTtcblxuICAgIGlmIChob21lRGlyICYmIGZzLmV4aXN0c1N5bmMocGF0aC5yZXNvbHZlKGhvbWVEaXIsICcudGVybi1jb25maWcnKSkpIHtcblxuICAgICAgdGhpcy5kZWZhdWx0Q29uZmlnID0gdGhpcy5yZWFkUHJvamVjdEZpbGUocGF0aC5yZXNvbHZlKGhvbWVEaXIsICcudGVybi1jb25maWcnKSk7XG4gICAgfVxuXG4gICAgdGhpcy5wcm9qZWN0RmlsZU5hbWUgPSAnLnRlcm4tcHJvamVjdCc7XG4gICAgdGhpcy5kaXNhYmxlTG9hZGluZ0xvY2FsID0gZmFsc2U7XG5cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIGluaXQoKSB7XG5cbiAgICBpZiAoIXRoaXMucHJvamVjdERpcikge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLnJlYWRQcm9qZWN0RmlsZShwYXRoLnJlc29sdmUodGhpcy5wcm9qZWN0RGlyLCB0aGlzLnByb2plY3RGaWxlTmFtZSkpO1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZykge1xuXG4gICAgICB0aGlzLmNvbmZpZyA9IHRoaXMuZGVmYXVsdENvbmZpZztcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZy5hc3luYyA9IHBhY2thZ2VDb25maWcub3B0aW9ucy50ZXJuU2VydmVyR2V0RmlsZUFzeW5jO1xuICAgIHRoaXMuY29uZmlnLmRlcGVuZGVuY3lCdWRnZXQgPSBwYWNrYWdlQ29uZmlnLm9wdGlvbnMudGVyblNlcnZlckRlcGVuZGVuY3lCdWRnZXQ7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnLnBsdWdpbnNbJ2RvY19jb21tZW50J10pIHtcblxuICAgICAgdGhpcy5jb25maWcucGx1Z2luc1snZG9jX2NvbW1lbnQnXSA9IHRydWU7XG4gICAgfVxuXG4gICAgbGV0IGRlZnMgPSB0aGlzLmZpbmREZWZzKHRoaXMucHJvamVjdERpciwgdGhpcy5jb25maWcpO1xuICAgIGxldCBwbHVnaW5zID0gdGhpcy5sb2FkUGx1Z2lucyh0aGlzLnByb2plY3REaXIsIHRoaXMuY29uZmlnKTtcbiAgICBsZXQgZmlsZXMgPSBbXTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5sb2FkRWFnZXJseSkge1xuXG4gICAgICB0aGlzLmNvbmZpZy5sb2FkRWFnZXJseS5mb3JFYWNoKChwYXQpID0+IHtcblxuICAgICAgICBnbG9iLnN5bmMocGF0LCB7IGN3ZDogdGhpcy5wcm9qZWN0RGlyIH0pLmZvckVhY2goZnVuY3Rpb24oZmlsZSkge1xuXG4gICAgICAgICAgZmlsZXMucHVzaChmaWxlKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmNoaWxkID0gY3AuZm9yayhwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9hdG9tLXRlcm5qcy1zZXJ2ZXItd29ya2VyLmpzJykpO1xuICAgIHRoaXMuY2hpbGQub24oJ21lc3NhZ2UnLCB0aGlzLm9uV29ya2VyTWVzc2FnZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmNoaWxkLm9uKCdlcnJvcicsIHRoaXMub25FcnJvcik7XG4gICAgdGhpcy5jaGlsZC5vbignZGlzY29ubmVjdCcsIHRoaXMub25EaXNjb25uZWN0KTtcbiAgICB0aGlzLmNoaWxkLnNlbmQoe1xuXG4gICAgICB0eXBlOiAnaW5pdCcsXG4gICAgICBkaXI6IHRoaXMucHJvamVjdERpcixcbiAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICBkZWZzOiBkZWZzLFxuICAgICAgcGx1Z2luczogcGx1Z2lucyxcbiAgICAgIGZpbGVzOiBmaWxlc1xuICAgIH0pO1xuICB9XG5cbiAgb25FcnJvcihlKSB7XG5cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYENoaWxkIHByb2Nlc3MgZXJyb3I6ICR7ZX1gLCB7XG5cbiAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBvbkRpc2Nvbm5lY3QoZSkge1xuXG4gICAgY29uc29sZS53YXJuKGUpO1xuICB9XG5cbiAgcmVxdWVzdCh0eXBlLCBkYXRhKSB7XG5cbiAgICBsZXQgcmVxdWVzdElEID0gdXVpZC52MSgpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgdGhpcy5yZXNvbHZlc1tyZXF1ZXN0SURdID0gcmVzb2x2ZTtcbiAgICAgIHRoaXMucmVqZWN0c1tyZXF1ZXN0SURdID0gcmVqZWN0O1xuXG4gICAgICB0aGlzLmNoaWxkLnNlbmQoe1xuXG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIGlkOiByZXF1ZXN0SUQsXG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZmx1c2goKSB7XG5cbiAgICB0aGlzLnJlcXVlc3QoJ2ZsdXNoJywge30pLnRoZW4oKCkgPT4ge1xuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnQWxsIGZpbGVzIGZldGNoZWQgYW5kIGFuYWx5emVkLicpO1xuICAgIH0pO1xuICB9XG5cbiAgZG9udExvYWQoZmlsZSkge1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5kb250TG9hZCkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLmRvbnRMb2FkLnNvbWUoKHBhdCkgPT4ge1xuXG4gICAgICByZXR1cm4gbWluaW1hdGNoKGZpbGUsIHBhdCk7XG4gICAgfSk7XG4gIH1cblxuICBvbldvcmtlck1lc3NhZ2UoZSkge1xuXG4gICAgaWYgKGUuZXJyb3IgJiYgZS5lcnJvci5pc1VuY2F1Z2h0RXhjZXB0aW9uKSB7XG5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgVW5jYXVnaHRFeGNlcHRpb246ICR7ZS5lcnJvci5tZXNzYWdlfS4gUmVzdGFydGluZyBTZXJ2ZXIuLi5gLCB7XG5cbiAgICAgICAgZGlzbWlzc2FibGU6IGZhbHNlXG4gICAgICB9KTtcblxuICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5yZWplY3RzKSB7XG5cbiAgICAgICAgdGhpcy5yZWplY3RzW2tleV0oe30pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlc29sdmVzID0ge307XG4gICAgICB0aGlzLnJlamVjdHMgPSB7fTtcblxuICAgICAgbWFuYWdlci5yZXN0YXJ0U2VydmVyKCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpc0Vycm9yID0gZS5lcnJvciAhPT0gJ251bGwnICYmIGUuZXJyb3IgIT09ICd1bmRlZmluZWQnO1xuXG4gICAgaWYgKGlzRXJyb3IpIHtcblxuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICB9XG5cbiAgICBpZiAoIWUudHlwZSAmJiB0aGlzLnJlc29sdmVzW2UuaWRdKSB7XG5cbiAgICAgIGlmIChpc0Vycm9yKSB7XG5cbiAgICAgICAgdGhpcy5yZWplY3RzW2UuaWRdKGUuZXJyb3IpO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIHRoaXMucmVzb2x2ZXNbZS5pZF0oZS5kYXRhKTtcbiAgICAgIH1cblxuICAgICAgZGVsZXRlIHRoaXMucmVzb2x2ZXNbZS5pZF07XG4gICAgICBkZWxldGUgdGhpcy5yZWplY3RzW2UuaWRdO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICBpZiAoIXRoaXMuY2hpbGQpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY2hpbGQuZGlzY29ubmVjdCgpO1xuICAgIHRoaXMuY2hpbGQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICByZWFkSlNPTihmaWxlTmFtZSkge1xuXG4gICAgaWYgKGZpbGVFeGlzdHMoZmlsZU5hbWUpICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBmaWxlID0gZnMucmVhZEZpbGVTeW5jKGZpbGVOYW1lLCAndXRmOCcpO1xuXG4gICAgdHJ5IHtcblxuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZmlsZSk7XG5cbiAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgQmFkIEpTT04gaW4gJHtmaWxlTmFtZX06ICR7ZS5tZXNzYWdlfWAsIHtcblxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cblxuICBtZXJnZU9iamVjdHMoYmFzZSwgdmFsdWUpIHtcblxuICAgIGlmICghYmFzZSkge1xuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKCF2YWx1ZSkge1xuXG4gICAgICByZXR1cm4gYmFzZTtcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0ID0ge307XG5cbiAgICBmb3IgKGNvbnN0IHByb3AgaW4gYmFzZSkge1xuXG4gICAgICByZXN1bHRbcHJvcF0gPSBiYXNlW3Byb3BdO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgcHJvcCBpbiB2YWx1ZSkge1xuXG4gICAgICByZXN1bHRbcHJvcF0gPSB2YWx1ZVtwcm9wXTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcmVhZFByb2plY3RGaWxlKGZpbGVOYW1lKSB7XG5cbiAgICBsZXQgZGF0YSA9IHRoaXMucmVhZEpTT04oZmlsZU5hbWUpO1xuXG4gICAgaWYgKCFkYXRhKSB7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBvcHRpb24gaW4gdGhpcy5kZWZhdWx0Q29uZmlnKSB7XG5cbiAgICAgIGlmICghZGF0YS5oYXNPd25Qcm9wZXJ0eShvcHRpb24pKSB7XG5cbiAgICAgICAgZGF0YVtvcHRpb25dID0gdGhpcy5kZWZhdWx0Q29uZmlnW29wdGlvbl07XG5cbiAgICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSAncGx1Z2lucycpIHtcblxuICAgICAgICBkYXRhW29wdGlvbl0gPSB0aGlzLm1lcmdlT2JqZWN0cyh0aGlzLmRlZmF1bHRDb25maWdbb3B0aW9uXSwgZGF0YVtvcHRpb25dKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGZpbmRGaWxlKGZpbGUsIHByb2plY3REaXIsIGZhbGxiYWNrRGlyKSB7XG5cbiAgICBsZXQgbG9jYWwgPSBwYXRoLnJlc29sdmUocHJvamVjdERpciwgZmlsZSk7XG5cbiAgICBpZiAoIXRoaXMuZGlzYWJsZUxvYWRpbmdMb2NhbCAmJiBmcy5leGlzdHNTeW5jKGxvY2FsKSkge1xuXG4gICAgICByZXR1cm4gbG9jYWw7XG4gICAgfVxuXG4gICAgbGV0IHNoYXJlZCA9IHBhdGgucmVzb2x2ZShmYWxsYmFja0RpciwgZmlsZSk7XG5cbiAgICBpZiAoZnMuZXhpc3RzU3luYyhzaGFyZWQpKSB7XG5cbiAgICAgIHJldHVybiBzaGFyZWQ7XG4gICAgfVxuICB9XG5cbiAgZmluZERlZnMocHJvamVjdERpciwgY29uZmlnKSB7XG5cbiAgICBsZXQgZGVmcyA9IFtdO1xuICAgIGxldCBzcmMgPSBjb25maWcubGlicy5zbGljZSgpO1xuXG4gICAgaWYgKGNvbmZpZy5lY21hU2NyaXB0ICYmIHNyYy5pbmRleE9mKCdlY21hc2NyaXB0JykgPT09IC0xKSB7XG5cbiAgICAgIHNyYy51bnNoaWZ0KCdlY21hc2NyaXB0Jyk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcmMubGVuZ3RoOyArK2kpIHtcblxuICAgICAgbGV0IGZpbGUgPSBzcmNbaV07XG5cbiAgICAgIGlmICghL1xcLmpzb24kLy50ZXN0KGZpbGUpKSB7XG5cbiAgICAgICAgZmlsZSA9IGAke2ZpbGV9Lmpzb25gO1xuICAgICAgfVxuXG4gICAgICBsZXQgZm91bmQgPVxuICAgICAgICB0aGlzLmZpbmRGaWxlKGZpbGUsIHByb2plY3REaXIsIHBhdGgucmVzb2x2ZSh0aGlzLmRpc3REaXIsICdkZWZzJykpIHx8XG4gICAgICAgIHJlc29sdmVGcm9tKHByb2plY3REaXIsIGB0ZXJuLSR7c3JjW2ldfWApXG4gICAgICAgIDtcblxuICAgICAgaWYgKCFmb3VuZCkge1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICBmb3VuZCA9IHJlcXVpcmUucmVzb2x2ZShgdGVybi0ke3NyY1tpXX1gKTtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYEZhaWxlZCB0byBmaW5kIGxpYnJhcnkgJHtzcmNbaV19XFxuYCwge1xuXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmb3VuZCkge1xuXG4gICAgICAgIGRlZnMucHVzaCh0aGlzLnJlYWRKU09OKGZvdW5kKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZnM7XG4gIH1cblxuICBsb2FkUGx1Z2lucyhwcm9qZWN0RGlyLCBjb25maWcpIHtcblxuICAgIGxldCBwbHVnaW5zID0gY29uZmlnLnBsdWdpbnM7XG4gICAgbGV0IG9wdGlvbnMgPSB7fTtcbiAgICB0aGlzLmNvbmZpZy5wbHVnaW5JbXBvcnRzID0gW107XG5cbiAgICBmb3IgKGxldCBwbHVnaW4gaW4gcGx1Z2lucykge1xuXG4gICAgICBsZXQgdmFsID0gcGx1Z2luc1twbHVnaW5dO1xuXG4gICAgICBpZiAoIXZhbCkge1xuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgZm91bmQgPVxuICAgICAgICB0aGlzLmZpbmRGaWxlKGAke3BsdWdpbn0uanNgLCBwcm9qZWN0RGlyLCBwYXRoLnJlc29sdmUodGhpcy5kaXN0RGlyLCAncGx1Z2luJykpIHx8XG4gICAgICAgIHJlc29sdmVGcm9tKHByb2plY3REaXIsIGB0ZXJuLSR7cGx1Z2lufWApXG4gICAgICAgIDtcblxuICAgICAgaWYgKCFmb3VuZCkge1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICBmb3VuZCA9IHJlcXVpcmUucmVzb2x2ZShgdGVybi0ke3BsdWdpbn1gKTtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgICBjb25zb2xlLndhcm4oZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFmb3VuZCkge1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICBmb3VuZCA9IHJlcXVpcmUucmVzb2x2ZShgJHt0aGlzLnByb2plY3REaXJ9L25vZGVfbW9kdWxlcy90ZXJuLSR7cGx1Z2lufWApO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgRmFpbGVkIHRvIGZpbmQgcGx1Z2luICR7cGx1Z2lufVxcbmAsIHtcblxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbmZpZy5wbHVnaW5JbXBvcnRzLnB1c2goZm91bmQpO1xuICAgICAgb3B0aW9uc1twYXRoLmJhc2VuYW1lKHBsdWdpbildID0gdmFsO1xuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zO1xuICB9XG59XG4iXX0=