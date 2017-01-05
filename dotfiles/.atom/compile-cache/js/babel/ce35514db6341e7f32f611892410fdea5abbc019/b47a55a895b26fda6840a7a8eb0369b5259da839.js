Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscorePlus = require('underscore-plus');

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atomTernjsDocumentation = require('./atom-ternjs-documentation');

var _atomTernjsDocumentation2 = _interopRequireDefault(_atomTernjsDocumentation);

var _atomTernjsReference = require('./atom-ternjs-reference');

var _atomTernjsReference2 = _interopRequireDefault(_atomTernjsReference);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _atomTernjsType = require('./atom-ternjs-type');

var _atomTernjsType2 = _interopRequireDefault(_atomTernjsType);

var _atomTernjsConfig = require('./atom-ternjs-config');

var _atomTernjsConfig2 = _interopRequireDefault(_atomTernjsConfig);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _atomTernjsProvider = require('./atom-ternjs-provider');

var _atomTernjsProvider2 = _interopRequireDefault(_atomTernjsProvider);

var _atomTernjsRename = require('./atom-ternjs-rename');

var _atomTernjsRename2 = _interopRequireDefault(_atomTernjsRename);

'use babel';

var Server = require('./atom-ternjs-server');
var Client = require('./atom-ternjs-client');

var Manager = (function () {
  function Manager() {
    _classCallCheck(this, Manager);

    this.initCalled = false;
    this.initialised = false;

    this.disposables = [];
    this.grammars = ['JavaScript', 'Babel ES6 JavaScript'];

    this.clients = [];
    this.client = undefined;
    this.servers = [];
    this.server = undefined;

    this.editors = [];
  }

  _createClass(Manager, [{
    key: 'init',
    value: function init() {
      var _this = this;

      _atomTernjsPackageConfig2['default'].registerEvents();
      this.initServers();

      this.disposables.push(atom.project.onDidChangePaths(function (paths) {

        _this.destroyServer(paths);
        _this.checkPaths(paths);
        _this.setActiveServerAndClient();
      }));

      this.initCalled = true;
    }
  }, {
    key: 'activate',
    value: function activate() {

      this.initialised = true;
      this.registerEvents();
      this.registerCommands();
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);

      for (var server of this.servers) {

        server.destroy();
        server = undefined;
      }
      this.servers = [];
      this.clients = [];

      this.server = undefined;
      this.client = undefined;

      _atomTernjsDocumentation2['default'] && _atomTernjsDocumentation2['default'].destroy();
      _atomTernjsReference2['default'] && _atomTernjsReference2['default'].destroy();
      _atomTernjsType2['default'] && _atomTernjsType2['default'].destroy();
      _atomTernjsPackageConfig2['default'] && _atomTernjsPackageConfig2['default'].destroy();
      _atomTernjsRename2['default'] && _atomTernjsRename2['default'].destroy();
      _atomTernjsConfig2['default'] && _atomTernjsConfig2['default'].destroy();
      _atomTernjsProvider2['default'] && _atomTernjsProvider2['default'].destroy();

      this.initialised = false;
      this.initCalled = false;
    }
  }, {
    key: 'initServers',
    value: function initServers() {
      var _this2 = this;

      var projectDirectories = atom.project.getDirectories();

      projectDirectories.forEach(function (projectDirectory) {

        var directory = atom.project.relativizePath(projectDirectory.path)[0];

        if ((0, _atomTernjsHelper.isDirectory)(directory)) {

          _this2.startServer(directory);
        }
      });
    }
  }, {
    key: 'startServer',
    value: function startServer(dir) {

      if (this.getServerForProject(dir)) {

        return;
      }

      var client = this.getClientForProject(dir);

      if (!client) {

        var clientIdx = this.clients.push(new Client(dir)) - 1;
        client = this.clients[clientIdx];
      }

      this.servers.push(new Server(dir, client));

      if (this.servers.length === this.clients.length) {

        if (!this.initialised) {

          this.activate();
        }

        this.setActiveServerAndClient(dir);
      }
    }
  }, {
    key: 'setActiveServerAndClient',
    value: function setActiveServerAndClient(URI) {

      if (!URI) {

        var activePane = atom.workspace.getActivePaneItem();

        if (activePane && activePane.getURI) {

          URI = activePane.getURI();
        } else {

          this.server = undefined;
          this.client = undefined;

          return;
        }
      }

      var dir = atom.project.relativizePath(URI)[0];
      var server = this.getServerForProject(dir);
      var client = this.getClientForProject(dir);

      if (server && client) {

        this.server = server;
        _atomTernjsConfig2['default'].gatherData();
        this.client = client;
      } else {

        this.server = undefined;
        _atomTernjsConfig2['default'].clear();
        this.client = undefined;
      }
    }
  }, {
    key: 'checkPaths',
    value: function checkPaths(paths) {

      for (var path of paths) {

        var dir = atom.project.relativizePath(path)[0];

        if ((0, _atomTernjsHelper.isDirectory)(dir)) {

          this.startServer(dir);
        }
      }
    }
  }, {
    key: 'destroyServer',
    value: function destroyServer(paths) {

      if (this.servers.length === 0) {

        return;
      }

      var serverIdx = undefined;

      for (var i = 0; i < this.servers.length; i++) {

        if (paths.indexOf(this.servers[i].projectDir) === -1) {

          serverIdx = i;
          break;
        }
      }

      if (serverIdx === undefined) {

        return;
      }

      var server = this.servers[serverIdx];
      var client = this.getClientForProject(server.projectDir);
      client = undefined;

      server.destroy();
      server = undefined;

      this.servers.splice(serverIdx, 1);
    }
  }, {
    key: 'getServerForProject',
    value: function getServerForProject(projectDir) {

      for (var server of this.servers) {

        if (server.projectDir === projectDir) {

          return server;
        }
      }

      return false;
    }
  }, {
    key: 'getClientForProject',
    value: function getClientForProject(projectDir) {

      for (var client of this.clients) {

        if (client.projectDir === projectDir) {

          return client;
        }
      }

      return false;
    }
  }, {
    key: 'getEditor',
    value: function getEditor(editor) {

      for (var _editor of this.editors) {

        if (_editor.id === editor.id) {

          return _editor;
        }
      }
    }
  }, {
    key: 'isValidEditor',
    value: function isValidEditor(editor) {

      if (!editor || !editor.getGrammar || editor.mini) {

        return;
      }

      if (!editor.getGrammar()) {

        return;
      }

      if (this.grammars.indexOf(editor.getGrammar().name) === -1) {

        return false;
      }

      return true;
    }
  }, {
    key: 'onDidChangeCursorPosition',
    value: function onDidChangeCursorPosition(editor, e) {

      if (_atomTernjsPackageConfig2['default'].options.inlineFnCompletion) {

        _atomTernjsType2['default'].queryType(editor, e.cursor);
      }
    }
  }, {
    key: 'registerEvents',
    value: function registerEvents() {
      var _this3 = this;

      this.disposables.push(atom.workspace.observeTextEditors(function (editor) {

        if (!_this3.isValidEditor(editor)) {

          return;
        }

        // Register valid editor
        _this3.editors.push({

          id: editor.id,
          diffs: []
        });

        if (!_this3.initCalled) {

          _this3.init();
        }

        var editorView = atom.views.getView(editor);

        if (editorView) {

          _this3.disposables.push(editorView.addEventListener('click', function (e) {

            if (!e[_atomTernjsHelper.accessKey] || editor.getSelectedText() !== '') {

              return;
            }

            if (_this3.client) {

              _this3.client.definition();
            }
          }));
        }

        var scrollView = undefined;

        if (!editorView.shadowRoot) {

          scrollView = editorView.querySelector('.scroll-view');
        } else {

          scrollView = editorView.shadowRoot.querySelector('.scroll-view');
        }

        if (scrollView) {

          _this3.disposables.push(scrollView.addEventListener('mousemove', function (e) {

            if (!e[_atomTernjsHelper.accessKey]) {

              return;
            }

            if (e.target.classList.contains('line')) {

              return;
            }

            e.target.classList.add('atom-ternjs-hover');
          }));

          _this3.disposables.push(scrollView.addEventListener('mouseout', function (e) {

            e.target.classList.remove('atom-ternjs-hover');
          }));
        }

        _this3.disposables.push(editor.onDidChangeCursorPosition(function (e) {

          _atomTernjsEvents2['default'].emit('type-destroy-overlay');
          _atomTernjsEvents2['default'].emit('documentation-destroy-overlay');
        }));

        _this3.disposables.push(editor.onDidChangeCursorPosition((0, _underscorePlus.debounce)(_this3.onDidChangeCursorPosition.bind(_this3, editor), 300)));

        _this3.disposables.push(editor.getBuffer().onDidSave(function (e) {

          if (_this3.client) {

            _this3.client.update(editor);
          }
        }));

        _this3.disposables.push(editor.getBuffer().onDidChange(function (e) {

          _this3.getEditor(editor).diffs.push(e);
        }));
      }));

      this.disposables.push(atom.workspace.onDidChangeActivePaneItem(function (item) {

        _atomTernjsEvents2['default'].emit('config-clear');
        _atomTernjsEvents2['default'].emit('type-destroy-overlay');
        _atomTernjsEvents2['default'].emit('documentation-destroy-overlay');
        _atomTernjsEvents2['default'].emit('rename-hide');

        if (!_this3.isValidEditor(item)) {

          _atomTernjsEvents2['default'].emit('reference-hide');
        } else {

          _this3.setActiveServerAndClient(item.getURI());
        }
      }));
    }
  }, {
    key: 'registerCommands',
    value: function registerCommands() {
      var _this4 = this;

      this.disposables.push(atom.commands.add('atom-text-editor', 'core:cancel', function (e) {

        _atomTernjsEvents2['default'].emit('config-clear');
        _atomTernjsEvents2['default'].emit('type-destroy-overlay');
        _atomTernjsEvents2['default'].emit('documentation-destroy-overlay');
        _atomTernjsEvents2['default'].emit('reference-hide');
        _atomTernjsEvents2['default'].emit('rename-hide');
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:listFiles', function (e) {

        if (_this4.client) {

          _this4.client.files().then(function (data) {

            console.dir(data);
          });
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:flush', function (e) {

        if (_this4.server) {

          _this4.server.flush();
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:markerCheckpointBack', function (e) {

        (0, _atomTernjsHelper.markerCheckpointBack)();
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:definition', function (e) {

        if (_this4.client) {

          _this4.client.definition();
        }
      }));

      this.disposables.push(atom.commands.add('atom-workspace', 'atom-ternjs:restart', function (e) {

        _this4.restartServer();
      }));
    }
  }, {
    key: 'restartServer',
    value: function restartServer() {

      if (!this.server) {

        return;
      }

      var dir = this.server.projectDir;
      var serverIdx = undefined;

      for (var i = 0; i < this.servers.length; i++) {

        if (dir === this.servers[i].projectDir) {

          serverIdx = i;
          break;
        }
      }

      if (this.server) {

        this.server.destroy();
      }

      this.server = undefined;
      this.servers.splice(serverIdx, 1);
      this.startServer(dir);
    }
  }]);

  return Manager;
})();

exports['default'] = new Manager();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OEJBS3VCLGlCQUFpQjs7Z0NBQ3BCLHNCQUFzQjs7Ozt1Q0FDaEIsNkJBQTZCOzs7O21DQUNqQyx5QkFBeUI7Ozs7dUNBQ3JCLDhCQUE4Qjs7Ozs4QkFDdkMsb0JBQW9COzs7O2dDQUNsQixzQkFBc0I7Ozs7Z0NBTWxDLHNCQUFzQjs7a0NBQ1Isd0JBQXdCOzs7O2dDQUMxQixzQkFBc0I7Ozs7QUFuQnpDLFdBQVcsQ0FBQzs7QUFFWixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUMvQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7SUFrQnpDLE9BQU87QUFFQSxXQUZQLE9BQU8sR0FFRzswQkFGVixPQUFPOztBQUlULFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDOztBQUV6QixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUN0QixRQUFJLENBQUMsUUFBUSxHQUFHLENBQ2QsWUFBWSxFQUNaLHNCQUFzQixDQUN2QixDQUFDOztBQUVGLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDOztBQUV4QixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztHQUNuQjs7ZUFuQkcsT0FBTzs7V0FxQlAsZ0JBQUc7OztBQUVMLDJDQUFjLGNBQWMsRUFBRSxDQUFDO0FBQy9CLFVBQUksQ0FBQyxX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QUFFLENBQUM7U0FDMUI7T0FDRixDQUFDLENBQUMsQ0FBQzs7QUFFSixVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxVQUFDLENBQUMsRUFBSzs7QUFFdEYsZUFBSyxhQUFhLEVBQUUsQ0FBQztPQUN0QixDQUFDLENBQUMsQ0FBQztLQUNMOzs7V0FFWSx5QkFBRzs7QUFFZCxVQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTs7QUFFaEIsZUFBTztPQUNSOztBQUVELFVBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ2pDLFVBQUksU0FBUyxZQUFBLENBQUM7O0FBRWQsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOztBQUU1QyxZQUFJLEdBQUcsS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRTs7QUFFdEMsbUJBQVMsR0FBRyxDQUFDLENBQUM7QUFDZCxnQkFBTTtTQUNQO09BQ0Y7O0FBRUQsVUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFOztBQUVmLFlBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDdkI7O0FBRUQsVUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFDeEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFVBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDdkI7OztTQXJjRyxPQUFPOzs7cUJBd2NFLElBQUksT0FBTyxFQUFFIiwiZmlsZSI6Ii9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmNvbnN0IFNlcnZlciA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtc2VydmVyJyk7XG5jb25zdCBDbGllbnQgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLWNsaWVudCcpO1xuXG5pbXBvcnQge2RlYm91bmNlfSBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuaW1wb3J0IGVtaXR0ZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1ldmVudHMnO1xuaW1wb3J0IGRvY3VtZW50YXRpb24gZnJvbSAnLi9hdG9tLXRlcm5qcy1kb2N1bWVudGF0aW9uJztcbmltcG9ydCByZWZlcmVuY2UgZnJvbSAnLi9hdG9tLXRlcm5qcy1yZWZlcmVuY2UnO1xuaW1wb3J0IHBhY2thZ2VDb25maWcgZnJvbSAnLi9hdG9tLXRlcm5qcy1wYWNrYWdlLWNvbmZpZyc7XG5pbXBvcnQgdHlwZSBmcm9tICcuL2F0b20tdGVybmpzLXR5cGUnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2F0b20tdGVybmpzLWNvbmZpZyc7XG5pbXBvcnQge1xuICBhY2Nlc3NLZXksXG4gIGlzRGlyZWN0b3J5LFxuICBtYXJrZXJDaGVja3BvaW50QmFjayxcbiAgZGlzcG9zZUFsbFxufSBmcm9tICcuL2F0b20tdGVybmpzLWhlbHBlcic7XG5pbXBvcnQgcHJvdmlkZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1wcm92aWRlcic7XG5pbXBvcnQgcmVuYW1lIGZyb20gJy4vYXRvbS10ZXJuanMtcmVuYW1lJztcblxuY2xhc3MgTWFuYWdlciB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB0aGlzLmluaXRDYWxsZWQgPSBmYWxzZTtcbiAgICB0aGlzLmluaXRpYWxpc2VkID0gZmFsc2U7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gW107XG4gICAgdGhpcy5ncmFtbWFycyA9IFtcbiAgICAgICdKYXZhU2NyaXB0JyxcbiAgICAgICdCYWJlbCBFUzYgSmF2YVNjcmlwdCdcbiAgICBdO1xuXG4gICAgdGhpcy5jbGllbnRzID0gW107XG4gICAgdGhpcy5jbGllbnQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zZXJ2ZXJzID0gW107XG4gICAgdGhpcy5zZXJ2ZXIgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLmVkaXRvcnMgPSBbXTtcbiAgfVxuXG4gIGluaXQoKSB7XG5cbiAgICBwYWNrYWdlQ29uZmlnLnJlZ2lzdGVyRXZlbnRzKCk7XG4gICAgdGhpcy5pbml0U2VydmVycygpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzKChwYXRocykgPT4ge1xuXG4gICAgICB0aGlzLmRlc3Ryb3lTZXJ2ZXIocGF0aHMpO1xuICAgICAgdGhpcy5jaGVja1BhdGhzKHBhdGhzKTtcbiAgICAgIHRoaXMuc2V0QWN0aXZlU2VydmVyQW5kQ2xpZW50KCk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5pbml0Q2FsbGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGFjdGl2YXRlKCkge1xuXG4gICAgdGhpcy5pbml0aWFsaXNlZCA9IHRydWU7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50cygpO1xuICAgIHRoaXMucmVnaXN0ZXJDb21tYW5kcygpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIGRpc3Bvc2VBbGwodGhpcy5kaXNwb3NhYmxlcyk7XG5cbiAgICBmb3IgKGxldCBzZXJ2ZXIgb2YgdGhpcy5zZXJ2ZXJzKSB7XG5cbiAgICAgIHNlcnZlci5kZXN0cm95KCk7XG4gICAgICBzZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRoaXMuc2VydmVycyA9IFtdO1xuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuXG4gICAgdGhpcy5zZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jbGllbnQgPSB1bmRlZmluZWQ7XG5cbiAgICBkb2N1bWVudGF0aW9uICYmIGRvY3VtZW50YXRpb24uZGVzdHJveSgpO1xuICAgIHJlZmVyZW5jZSAmJiByZWZlcmVuY2UuZGVzdHJveSgpO1xuICAgIHR5cGUgJiYgdHlwZS5kZXN0cm95KCk7XG4gICAgcGFja2FnZUNvbmZpZyAmJiBwYWNrYWdlQ29uZmlnLmRlc3Ryb3koKTtcbiAgICByZW5hbWUgJiYgcmVuYW1lLmRlc3Ryb3koKTtcbiAgICBjb25maWcgJiYgY29uZmlnLmRlc3Ryb3koKTtcbiAgICBwcm92aWRlciAmJiBwcm92aWRlci5kZXN0cm95KCk7XG5cbiAgICB0aGlzLmluaXRpYWxpc2VkID0gZmFsc2U7XG4gICAgdGhpcy5pbml0Q2FsbGVkID0gZmFsc2U7XG4gIH1cblxuICBpbml0U2VydmVycygpIHtcblxuICAgIGNvbnN0IHByb2plY3REaXJlY3RvcmllcyA9IGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpO1xuXG4gICAgcHJvamVjdERpcmVjdG9yaWVzLmZvckVhY2goKHByb2plY3REaXJlY3RvcnkpID0+IHtcblxuICAgICAgY29uc3QgZGlyZWN0b3J5ID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKHByb2plY3REaXJlY3RvcnkucGF0aClbMF07XG5cbiAgICAgIGlmIChpc0RpcmVjdG9yeShkaXJlY3RvcnkpKSB7XG5cbiAgICAgICAgdGhpcy5zdGFydFNlcnZlcihkaXJlY3RvcnkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RhcnRTZXJ2ZXIoZGlyKSB7XG5cbiAgICBpZiAodGhpcy5nZXRTZXJ2ZXJGb3JQcm9qZWN0KGRpcikpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBjbGllbnQgPSB0aGlzLmdldENsaWVudEZvclByb2plY3QoZGlyKTtcblxuICAgIGlmICghY2xpZW50KSB7XG5cbiAgICAgIGxldCBjbGllbnRJZHggPSB0aGlzLmNsaWVudHMucHVzaChuZXcgQ2xpZW50KGRpcikpIC0gMTtcbiAgICAgIGNsaWVudCA9IHRoaXMuY2xpZW50c1tjbGllbnRJZHhdO1xuICAgIH1cblxuICAgIHRoaXMuc2VydmVycy5wdXNoKG5ldyBTZXJ2ZXIoZGlyLCBjbGllbnQpKTtcblxuICAgIGlmICh0aGlzLnNlcnZlcnMubGVuZ3RoID09PSB0aGlzLmNsaWVudHMubGVuZ3RoKSB7XG5cbiAgICAgIGlmICghdGhpcy5pbml0aWFsaXNlZCkge1xuXG4gICAgICAgIHRoaXMuYWN0aXZhdGUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRBY3RpdmVTZXJ2ZXJBbmRDbGllbnQoZGlyKTtcbiAgICB9XG4gIH1cblxuICBzZXRBY3RpdmVTZXJ2ZXJBbmRDbGllbnQoVVJJKSB7XG5cbiAgICBpZiAoIVVSSSkge1xuXG4gICAgICBsZXQgYWN0aXZlUGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCk7XG5cbiAgICAgIGlmIChhY3RpdmVQYW5lICYmIGFjdGl2ZVBhbmUuZ2V0VVJJKSB7XG5cbiAgICAgICAgVVJJID0gYWN0aXZlUGFuZS5nZXRVUkkoKTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICB0aGlzLnNlcnZlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5jbGllbnQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBkaXIgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoVVJJKVswXTtcbiAgICBsZXQgc2VydmVyID0gdGhpcy5nZXRTZXJ2ZXJGb3JQcm9qZWN0KGRpcik7XG4gICAgbGV0IGNsaWVudCA9IHRoaXMuZ2V0Q2xpZW50Rm9yUHJvamVjdChkaXIpO1xuXG4gICAgaWYgKHNlcnZlciAmJiBjbGllbnQpIHtcblxuICAgICAgdGhpcy5zZXJ2ZXIgPSBzZXJ2ZXI7XG4gICAgICBjb25maWcuZ2F0aGVyRGF0YSgpO1xuICAgICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICB0aGlzLnNlcnZlciA9IHVuZGVmaW5lZDtcbiAgICAgIGNvbmZpZy5jbGVhcigpO1xuICAgICAgdGhpcy5jbGllbnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgY2hlY2tQYXRocyhwYXRocykge1xuXG4gICAgZm9yIChsZXQgcGF0aCBvZiBwYXRocykge1xuXG4gICAgICBsZXQgZGlyID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKHBhdGgpWzBdO1xuXG4gICAgICBpZiAoaXNEaXJlY3RvcnkoZGlyKSkge1xuXG4gICAgICAgIHRoaXMuc3RhcnRTZXJ2ZXIoZGlyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXN0cm95U2VydmVyKHBhdGhzKSB7XG5cbiAgICBpZiAodGhpcy5zZXJ2ZXJzLmxlbmd0aCA9PT0gMCkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHNlcnZlcklkeDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zZXJ2ZXJzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgIGlmIChwYXRocy5pbmRleE9mKHRoaXMuc2VydmVyc1tpXS5wcm9qZWN0RGlyKSA9PT0gLTEpIHtcblxuICAgICAgICBzZXJ2ZXJJZHggPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2VydmVySWR4ID09PSB1bmRlZmluZWQpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBzZXJ2ZXIgPSB0aGlzLnNlcnZlcnNbc2VydmVySWR4XTtcbiAgICBsZXQgY2xpZW50ID0gdGhpcy5nZXRDbGllbnRGb3JQcm9qZWN0KHNlcnZlci5wcm9qZWN0RGlyKTtcbiAgICBjbGllbnQgPSB1bmRlZmluZWQ7XG5cbiAgICBzZXJ2ZXIuZGVzdHJveSgpO1xuICAgIHNlcnZlciA9IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuc2VydmVycy5zcGxpY2Uoc2VydmVySWR4LCAxKTtcbiAgfVxuXG4gIGdldFNlcnZlckZvclByb2plY3QocHJvamVjdERpcikge1xuXG4gICAgZm9yIChsZXQgc2VydmVyIG9mIHRoaXMuc2VydmVycykge1xuXG4gICAgICBpZiAoc2VydmVyLnByb2plY3REaXIgPT09IHByb2plY3REaXIpIHtcblxuICAgICAgICByZXR1cm4gc2VydmVyO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldENsaWVudEZvclByb2plY3QocHJvamVjdERpcikge1xuXG4gICAgZm9yIChsZXQgY2xpZW50IG9mIHRoaXMuY2xpZW50cykge1xuXG4gICAgICBpZiAoY2xpZW50LnByb2plY3REaXIgPT09IHByb2plY3REaXIpIHtcblxuICAgICAgICByZXR1cm4gY2xpZW50O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldEVkaXRvcihlZGl0b3IpIHtcblxuICAgIGZvciAobGV0IF9lZGl0b3Igb2YgdGhpcy5lZGl0b3JzKSB7XG5cbiAgICAgIGlmIChfZWRpdG9yLmlkID09PSBlZGl0b3IuaWQpIHtcblxuICAgICAgICByZXR1cm4gX2VkaXRvcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpc1ZhbGlkRWRpdG9yKGVkaXRvcikge1xuXG4gICAgaWYgKCFlZGl0b3IgfHwgIWVkaXRvci5nZXRHcmFtbWFyIHx8IGVkaXRvci5taW5pKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWVkaXRvci5nZXRHcmFtbWFyKCkpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmdyYW1tYXJzLmluZGV4T2YoZWRpdG9yLmdldEdyYW1tYXIoKS5uYW1lKSA9PT0gLTEpIHtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgb25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbihlZGl0b3IsIGUpIHtcblxuICAgIGlmIChwYWNrYWdlQ29uZmlnLm9wdGlvbnMuaW5saW5lRm5Db21wbGV0aW9uKSB7XG5cbiAgICAgIHR5cGUucXVlcnlUeXBlKGVkaXRvciwgZS5jdXJzb3IpO1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyRXZlbnRzKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygoZWRpdG9yKSA9PiB7XG5cbiAgICAgIGlmICghdGhpcy5pc1ZhbGlkRWRpdG9yKGVkaXRvcikpIHtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFJlZ2lzdGVyIHZhbGlkIGVkaXRvclxuICAgICAgdGhpcy5lZGl0b3JzLnB1c2goe1xuXG4gICAgICAgIGlkOiBlZGl0b3IuaWQsXG4gICAgICAgIGRpZmZzOiBbXVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghdGhpcy5pbml0Q2FsbGVkKSB7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICB9XG5cbiAgICAgIGxldCBlZGl0b3JWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcik7XG5cbiAgICAgIGlmIChlZGl0b3JWaWV3KSB7XG5cbiAgICAgICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGVkaXRvclZpZXcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIWVbYWNjZXNzS2V5XSB8fFxuICAgICAgICAgICAgZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpICE9PSAnJ1xuICAgICAgICAgICkge1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMuY2xpZW50KSB7XG5cbiAgICAgICAgICAgIHRoaXMuY2xpZW50LmRlZmluaXRpb24oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHNjcm9sbFZpZXc7XG5cbiAgICAgIGlmICghZWRpdG9yVmlldy5zaGFkb3dSb290KSB7XG5cbiAgICAgICAgc2Nyb2xsVmlldyA9IGVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignLnNjcm9sbC12aWV3Jyk7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgc2Nyb2xsVmlldyA9IGVkaXRvclZpZXcuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCcuc2Nyb2xsLXZpZXcnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNjcm9sbFZpZXcpIHtcblxuICAgICAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goc2Nyb2xsVmlldy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZSkgPT4ge1xuXG4gICAgICAgICAgaWYgKCFlW2FjY2Vzc0tleV0pIHtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2xpbmUnKSkge1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgnYXRvbS10ZXJuanMtaG92ZXInKTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChzY3JvbGxWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKGUpID0+IHtcblxuICAgICAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2F0b20tdGVybmpzLWhvdmVyJyk7XG4gICAgICAgIH0pKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uKChlKSA9PiB7XG5cbiAgICAgICAgZW1pdHRlci5lbWl0KCd0eXBlLWRlc3Ryb3ktb3ZlcmxheScpO1xuICAgICAgICBlbWl0dGVyLmVtaXQoJ2RvY3VtZW50YXRpb24tZGVzdHJveS1vdmVybGF5Jyk7XG4gICAgICB9KSk7XG5cbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChlZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbihkZWJvdW5jZSh0aGlzLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24uYmluZCh0aGlzLCBlZGl0b3IpLCAzMDApKSk7XG5cbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChlZGl0b3IuZ2V0QnVmZmVyKCkub25EaWRTYXZlKChlKSA9PiB7XG5cbiAgICAgICAgaWYgKHRoaXMuY2xpZW50KSB7XG5cbiAgICAgICAgICB0aGlzLmNsaWVudC51cGRhdGUoZWRpdG9yKTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuXG4gICAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkQ2hhbmdlKChlKSA9PiB7XG5cbiAgICAgICAgdGhpcy5nZXRFZGl0b3IoZWRpdG9yKS5kaWZmcy5wdXNoKGUpO1xuICAgICAgfSkpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtKChpdGVtKSA9PiB7XG5cbiAgICAgIGVtaXR0ZXIuZW1pdCgnY29uZmlnLWNsZWFyJyk7XG4gICAgICBlbWl0dGVyLmVtaXQoJ3R5cGUtZGVzdHJveS1vdmVybGF5Jyk7XG4gICAgICBlbWl0dGVyLmVtaXQoJ2RvY3VtZW50YXRpb24tZGVzdHJveS1vdmVybGF5Jyk7XG4gICAgICBlbWl0dGVyLmVtaXQoJ3JlbmFtZS1oaWRlJyk7XG5cbiAgICAgIGlmICghdGhpcy5pc1ZhbGlkRWRpdG9yKGl0ZW0pKSB7XG5cbiAgICAgICAgZW1pdHRlci5lbWl0KCdyZWZlcmVuY2UtaGlkZScpO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIHRoaXMuc2V0QWN0aXZlU2VydmVyQW5kQ2xpZW50KGl0ZW0uZ2V0VVJJKCkpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29tbWFuZHMoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnY29yZTpjYW5jZWwnLCAoZSkgPT4ge1xuXG4gICAgICBlbWl0dGVyLmVtaXQoJ2NvbmZpZy1jbGVhcicpO1xuICAgICAgZW1pdHRlci5lbWl0KCd0eXBlLWRlc3Ryb3ktb3ZlcmxheScpO1xuICAgICAgZW1pdHRlci5lbWl0KCdkb2N1bWVudGF0aW9uLWRlc3Ryb3ktb3ZlcmxheScpO1xuICAgICAgZW1pdHRlci5lbWl0KCdyZWZlcmVuY2UtaGlkZScpO1xuICAgICAgZW1pdHRlci5lbWl0KCdyZW5hbWUtaGlkZScpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpsaXN0RmlsZXMnLCAoZSkgPT4ge1xuXG4gICAgICBpZiAodGhpcy5jbGllbnQpIHtcblxuICAgICAgICB0aGlzLmNsaWVudC5maWxlcygpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICAgIGNvbnNvbGUuZGlyKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnYXRvbS10ZXJuanM6Zmx1c2gnLCAoZSkgPT4ge1xuXG4gICAgICBpZiAodGhpcy5zZXJ2ZXIpIHtcblxuICAgICAgICB0aGlzLnNlcnZlci5mbHVzaCgpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczptYXJrZXJDaGVja3BvaW50QmFjaycsIChlKSA9PiB7XG5cbiAgICAgIG1hcmtlckNoZWNrcG9pbnRCYWNrKCk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2F0b20tdGVybmpzOmRlZmluaXRpb24nLCAoZSkgPT4ge1xuXG4gICAgICBpZiAodGhpcy5jbGllbnQpIHtcblxuICAgICAgICB0aGlzLmNsaWVudC5kZWZpbml0aW9uKCk7XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdhdG9tLXRlcm5qczpyZXN0YXJ0JywgKGUpID0+IHtcblxuICAgICAgdGhpcy5yZXN0YXJ0U2VydmVyKCk7XG4gICAgfSkpO1xuICB9XG5cbiAgcmVzdGFydFNlcnZlcigpIHtcblxuICAgIGlmICghdGhpcy5zZXJ2ZXIpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBkaXIgPSB0aGlzLnNlcnZlci5wcm9qZWN0RGlyO1xuICAgIGxldCBzZXJ2ZXJJZHg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2VydmVycy5sZW5ndGg7IGkrKykge1xuXG4gICAgICBpZiAoZGlyID09PSB0aGlzLnNlcnZlcnNbaV0ucHJvamVjdERpcikge1xuXG4gICAgICAgIHNlcnZlcklkeCA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnNlcnZlcikge1xuXG4gICAgICB0aGlzLnNlcnZlci5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zZXJ2ZXJzLnNwbGljZShzZXJ2ZXJJZHgsIDEpO1xuICAgIHRoaXMuc3RhcnRTZXJ2ZXIoZGlyKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgTWFuYWdlcigpO1xuIl19