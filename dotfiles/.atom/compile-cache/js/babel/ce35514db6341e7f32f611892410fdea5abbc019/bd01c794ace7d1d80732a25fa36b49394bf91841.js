Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _underscorePlus = require('underscore-plus');

'use babel';

var ConfigView = require('./atom-ternjs-config-view');

var Config = (function () {
  function Config() {
    _classCallCheck(this, Config);

    this.disposables = [];

    this.config = undefined;
    this.projectConfig = undefined;
    this.editors = [];

    this.configClearHandler = this.clear.bind(this);
    _atomTernjsEvents2['default'].on('config-clear', this.configClearHandler);

    this.registerCommands();
  }

  _createClass(Config, [{
    key: 'registerCommands',
    value: function registerCommands() {

      this.disposables.push(atom.commands.add('atom-workspace', 'atom-ternjs:openConfig', this.show.bind(this)));
    }
  }, {
    key: 'getContent',
    value: function getContent(filePath, projectRoot) {

      var root = undefined;

      if (projectRoot) {

        root = _atomTernjsManager2['default'].server && _atomTernjsManager2['default'].server.projectDir;
      } else {

        root = '';
      }

      var content = (0, _atomTernjsHelper.getFileContent)(filePath, root);

      if (!content) {

        return;
      }

      try {

        content = JSON.parse(content);
      } catch (e) {

        atom.notifications.addInfo('Error parsing .tern-project. Please check if it is a valid JSON file.', {

          dismissable: true
        });
        return;
      }

      return content;
    }
  }, {
    key: 'prepareLibs',
    value: function prepareLibs(configDefault) {

      var libs = {};

      for (var index in configDefault.libs) {

        if (this.projectConfig.libs && this.projectConfig.libs.indexOf(configDefault.libs[index]) > -1) {

          libs[configDefault.libs[index]] = {

            _active: true
          };
        } else {

          libs[configDefault.libs[index]] = {

            _active: false
          };
        }
      }

      this.config.libs = libs;
    }
  }, {
    key: 'prepareEcma',
    value: function prepareEcma(configDefault) {

      var ecmaVersions = {};

      for (var lib of Object.keys(configDefault.ecmaVersions)) {

        ecmaVersions[lib] = configDefault.ecmaVersions[lib];
      }

      this.config.ecmaVersions = ecmaVersions;

      if (this.config.ecmaVersion) {

        for (var lib of Object.keys(this.config.ecmaVersions)) {

          if (lib === 'ecmaVersion' + this.config.ecmaVersion) {

            this.config.ecmaVersions[lib] = true;
          } else {

            this.config.ecmaVersions[lib] = false;
          }
        }
      }
    }
  }, {
    key: 'preparePlugins',
    value: function preparePlugins(availablePlugins) {

      if (!this.config.plugins) {

        this.config.plugins = {};
      }

      // check if there are unknown plugins in .tern-config
      for (var plugin of Object.keys(this.config.plugins)) {

        if (!availablePlugins[plugin]) {

          availablePlugins[plugin] = plugin;
        }
      }

      for (var plugin of Object.keys(availablePlugins)) {

        if (this.config.plugins[plugin]) {

          this.config.plugins[plugin] = this.mergeConfigObjects(availablePlugins[plugin], this.config.plugins[plugin]);
          this.config.plugins[plugin]._active = true;
        } else {

          this.config.plugins[plugin] = availablePlugins[plugin];
          this.config.plugins[plugin]._active = false;
        }
      }
    }
  }, {
    key: 'registerEvents',
    value: function registerEvents() {
      var _this = this;

      var close = this.configView.getClose();
      var cancel = this.configView.getCancel();

      close.addEventListener('click', function (e) {

        _this.updateConfig();
        _this.hide();
      });

      cancel.addEventListener('click', function (e) {

        _this.destroyEditors();
        _this.hide();
      });
    }
  }, {
    key: 'mergeConfigObjects',
    value: function mergeConfigObjects(obj1, obj2) {

      return (0, _underscorePlus.deepExtend)({}, obj1, obj2);
    }
  }, {
    key: 'hide',
    value: function hide() {

      if (!this.configPanel || !this.configPanel.visible) {

        return;
      }

      this.configPanel.hide();

      (0, _atomTernjsHelper.focusEditor)();
    }
  }, {
    key: 'clear',
    value: function clear() {

      this.hide();
      this.destroyEditors();
      this.config = undefined;
      this.projectConfig = undefined;

      if (!this.configView) {

        return;
      }

      this.configView.removeContent();
    }
  }, {
    key: 'gatherData',
    value: function gatherData() {

      var configDefault = this.getContent('../config/tern-config.json', false);
      var pluginsTern = this.getContent('../config/tern-plugins.json', false);

      if (!configDefault) {

        console.error('Could not load: tern-config.json');
        return;
      }

      this.projectConfig = this.getContent('/.tern-project', true);
      this.config = this.projectConfig || {};

      if (!this.projectConfig) {

        this.projectConfig = {};
        this.config = (0, _underscorePlus.clone)(configDefault);
      }

      this.prepareEcma(configDefault);
      this.prepareLibs(configDefault);
      this.preparePlugins(pluginsTern);

      if (!this.config.loadEagerly) {

        this.config.loadEagerly = [];
      }

      if (!this.config.dontLoad) {

        this.config.dontLoad = [];
      }

      return true;
    }
  }, {
    key: 'removeEditor',
    value: function removeEditor(editor) {

      if (!editor) {

        return;
      }

      var idx = this.editors.indexOf(editor);

      if (idx === -1) {

        return;
      }

      this.editors.splice(idx, 1);
    }
  }, {
    key: 'destroyEditors',
    value: function destroyEditors() {

      for (var editor of this.editors) {

        var buffer = editor.getModel().getBuffer();
        buffer.destroy();
      }

      this.editors = [];
    }
  }, {
    key: 'updateConfig',
    value: function updateConfig() {

      this.config.loadEagerly = [];
      this.config.dontLoad = [];

      for (var editor of this.editors) {

        var buffer = editor.getModel().getBuffer();
        var text = buffer.getText().trim();

        if (text === '') {

          continue;
        }

        this.config[editor.__ternjs_section].push(text);
      }

      this.destroyEditors();

      var newConfig = this.buildNewConfig();
      var newConfigJSON = JSON.stringify(newConfig, null, 2);

      (0, _atomTernjsHelper.updateTernFile)(newConfigJSON, true);
    }
  }, {
    key: 'buildNewConfig',
    value: function buildNewConfig() {

      var newConfig = {};

      for (var key of Object.keys(this.config.ecmaVersions)) {

        if (this.config.ecmaVersions[key]) {

          newConfig.ecmaVersion = Number(key[key.length - 1]);
          break;
        }
      }

      if (!(0, _underscorePlus.isEmpty)(this.config.libs)) {

        newConfig.libs = [];

        for (var key of Object.keys(this.config.libs)) {

          if (this.config.libs[key]._active) {

            newConfig.libs.push(key);
          }
        }
      }

      if (this.config.loadEagerly.length !== 0) {

        newConfig.loadEagerly = this.config.loadEagerly;
      }

      if (this.config.dontLoad.length !== 0) {

        newConfig.dontLoad = this.config.dontLoad;
      }

      if (!(0, _underscorePlus.isEmpty)(this.config.plugins)) {

        newConfig.plugins = {};

        for (var key of Object.keys(this.config.plugins)) {

          if (this.config.plugins[key]._active) {

            delete this.config.plugins[key]._active;
            newConfig.plugins[key] = this.config.plugins[key];
          }
        }
      }

      return newConfig;
    }
  }, {
    key: 'initConfigView',
    value: function initConfigView() {

      this.configView = new ConfigView();
      this.configView.initialize(this);

      this.configPanel = atom.workspace.addRightPanel({

        item: this.configView,
        priority: 0
      });
      this.configPanel.hide();

      this.registerEvents();
    }
  }, {
    key: 'show',
    value: function show() {

      if (!this.configView) {

        this.initConfigView();
      }

      this.clear();

      if (!this.gatherData()) {

        return;
      }

      atom.views.getView(this.configPanel).classList.add('atom-ternjs-config-panel');

      this.configView.buildOptionsMarkup();
      this.configPanel.show();
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);

      if (this.configView) {

        this.configView.destroy();
      }
      this.configView = undefined;

      if (this.configPanel) {

        this.configPanel.destroy();
      }
      this.configPanel = undefined;
    }
  }]);

  return Config;
})();

exports['default'] = new Config();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztpQ0FJb0IsdUJBQXVCOzs7O2dDQUN2QixzQkFBc0I7Ozs7Z0NBTW5DLHNCQUFzQjs7OEJBTXRCLGlCQUFpQjs7QUFqQnhCLFdBQVcsQ0FBQzs7QUFFWixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7SUFpQmxELE1BQU07QUFFQyxXQUZQLE1BQU0sR0FFSTswQkFGVixNQUFNOztBQUlSLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDOztBQUV0QixRQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUN4QixRQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQztBQUMvQixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hELGtDQUFRLEVBQUUsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7O0FBRXBELFFBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0dBQ3pCOztlQWRHLE1BQU07O1dBZ0JNLDRCQUFHOztBQUVqQixVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSx3QkFBd0IsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDNUc7OztXQUVTLG9CQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUU7O0FBRWhDLFVBQUksSUFBSSxZQUFBLENBQUM7O0FBRVQsVUFBSSxXQUFXLEVBQUU7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QUFDRCxVQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQzs7QUFFNUIsVUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFOztBQUVwQixZQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQzVCO0FBQ0QsVUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7S0FDOUI7OztTQXBZRyxNQUFNOzs7cUJBdVlHLElBQUksTUFBTSxFQUFFIiwiZmlsZSI6Ii9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY29uc3QgQ29uZmlnVmlldyA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtY29uZmlnLXZpZXcnKTtcblxuaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1tYW5hZ2VyJztcbmltcG9ydCBlbWl0dGVyIGZyb20gJy4vYXRvbS10ZXJuanMtZXZlbnRzJztcbmltcG9ydCB7XG4gIGdldEZpbGVDb250ZW50LFxuICBmb2N1c0VkaXRvcixcbiAgdXBkYXRlVGVybkZpbGUsXG4gIGRpc3Bvc2VBbGxcbn0gZnJvbSAnLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuXG5pbXBvcnQge1xuICBkZWVwRXh0ZW5kLFxuICBjbG9uZSxcbiAgaXNFbXB0eVxufSBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuXG5jbGFzcyBDb25maWcge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuXG4gICAgdGhpcy5jb25maWcgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5wcm9qZWN0Q29uZmlnID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZWRpdG9ycyA9IFtdO1xuXG4gICAgdGhpcy5jb25maWdDbGVhckhhbmRsZXIgPSB0aGlzLmNsZWFyLmJpbmQodGhpcyk7XG4gICAgZW1pdHRlci5vbignY29uZmlnLWNsZWFyJywgdGhpcy5jb25maWdDbGVhckhhbmRsZXIpO1xuXG4gICAgdGhpcy5yZWdpc3RlckNvbW1hbmRzKCk7XG4gIH1cblxuICByZWdpc3RlckNvbW1hbmRzKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdhdG9tLXRlcm5qczpvcGVuQ29uZmlnJywgdGhpcy5zaG93LmJpbmQodGhpcykpKTtcbiAgfVxuXG4gIGdldENvbnRlbnQoZmlsZVBhdGgsIHByb2plY3RSb290KSB7XG5cbiAgICBsZXQgcm9vdDtcblxuICAgIGlmIChwcm9qZWN0Um9vdCkge1xuXG4gICAgICByb290ID0gbWFuYWdlci5zZXJ2ZXIgJiYgbWFuYWdlci5zZXJ2ZXIucHJvamVjdERpcjtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHJvb3QgPSAnJztcbiAgICB9XG5cbiAgICBsZXQgY29udGVudCA9IGdldEZpbGVDb250ZW50KGZpbGVQYXRoLCByb290KTtcblxuICAgIGlmICghY29udGVudCkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcblxuICAgICAgY29udGVudCA9IEpTT04ucGFyc2UoY29udGVudCk7XG5cbiAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdFcnJvciBwYXJzaW5nIC50ZXJuLXByb2plY3QuIFBsZWFzZSBjaGVjayBpZiBpdCBpcyBhIHZhbGlkIEpTT04gZmlsZS4nLCB7XG5cbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgcHJlcGFyZUxpYnMoY29uZmlnRGVmYXVsdCkge1xuXG4gICAgbGV0IGxpYnMgPSB7fTtcblxuICAgIGZvciAoY29uc3QgaW5kZXggaW4gY29uZmlnRGVmYXVsdC5saWJzKSB7XG5cbiAgICAgIGlmICh0aGlzLnByb2plY3RDb25maWcubGlicyAmJiB0aGlzLnByb2plY3RDb25maWcubGlicy5pbmRleE9mKGNvbmZpZ0RlZmF1bHQubGlic1tpbmRleF0pID4gLTEpIHtcblxuICAgICAgICBsaWJzW2NvbmZpZ0RlZmF1bHQubGlic1tpbmRleF1dID0ge1xuXG4gICAgICAgICAgX2FjdGl2ZTogdHJ1ZVxuICAgICAgICB9O1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIGxpYnNbY29uZmlnRGVmYXVsdC5saWJzW2luZGV4XV0gPSB7XG5cbiAgICAgICAgICBfYWN0aXZlOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY29uZmlnLmxpYnMgPSBsaWJzO1xuICB9XG5cbiAgcHJlcGFyZUVjbWEoY29uZmlnRGVmYXVsdCkge1xuXG4gICAgbGV0IGVjbWFWZXJzaW9ucyA9IHt9O1xuXG4gICAgZm9yIChsZXQgbGliIG9mIE9iamVjdC5rZXlzKGNvbmZpZ0RlZmF1bHQuZWNtYVZlcnNpb25zKSkge1xuXG4gICAgICBlY21hVmVyc2lvbnNbbGliXSA9IGNvbmZpZ0RlZmF1bHQuZWNtYVZlcnNpb25zW2xpYl07XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWcuZWNtYVZlcnNpb25zID0gZWNtYVZlcnNpb25zO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmVjbWFWZXJzaW9uKSB7XG5cbiAgICAgIGZvciAobGV0IGxpYiBvZiBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZy5lY21hVmVyc2lvbnMpKSB7XG5cbiAgICAgICAgaWYgKGxpYiA9PT0gJ2VjbWFWZXJzaW9uJyArIHRoaXMuY29uZmlnLmVjbWFWZXJzaW9uKSB7XG5cbiAgICAgICAgICB0aGlzLmNvbmZpZy5lY21hVmVyc2lvbnNbbGliXSA9IHRydWU7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIHRoaXMuY29uZmlnLmVjbWFWZXJzaW9uc1tsaWJdID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcmVwYXJlUGx1Z2lucyhhdmFpbGFibGVQbHVnaW5zKSB7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnLnBsdWdpbnMpIHtcblxuICAgICAgdGhpcy5jb25maWcucGx1Z2lucyA9IHt9O1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIHRoZXJlIGFyZSB1bmtub3duIHBsdWdpbnMgaW4gLnRlcm4tY29uZmlnXG4gICAgZm9yIChjb25zdCBwbHVnaW4gb2YgT2JqZWN0LmtleXModGhpcy5jb25maWcucGx1Z2lucykpIHtcblxuICAgICAgaWYgKCFhdmFpbGFibGVQbHVnaW5zW3BsdWdpbl0pIHtcblxuICAgICAgICBhdmFpbGFibGVQbHVnaW5zW3BsdWdpbl0gPSBwbHVnaW47XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBwbHVnaW4gb2YgT2JqZWN0LmtleXMoYXZhaWxhYmxlUGx1Z2lucykpIHtcblxuICAgICAgaWYgKHRoaXMuY29uZmlnLnBsdWdpbnNbcGx1Z2luXSkge1xuXG4gICAgICAgIHRoaXMuY29uZmlnLnBsdWdpbnNbcGx1Z2luXSA9IHRoaXMubWVyZ2VDb25maWdPYmplY3RzKGF2YWlsYWJsZVBsdWdpbnNbcGx1Z2luXSwgdGhpcy5jb25maWcucGx1Z2luc1twbHVnaW5dKTtcbiAgICAgICAgdGhpcy5jb25maWcucGx1Z2luc1twbHVnaW5dLl9hY3RpdmUgPSB0cnVlO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIHRoaXMuY29uZmlnLnBsdWdpbnNbcGx1Z2luXSA9IGF2YWlsYWJsZVBsdWdpbnNbcGx1Z2luXTtcbiAgICAgICAgdGhpcy5jb25maWcucGx1Z2luc1twbHVnaW5dLl9hY3RpdmUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZWdpc3RlckV2ZW50cygpIHtcblxuICAgIGxldCBjbG9zZSA9IHRoaXMuY29uZmlnVmlldy5nZXRDbG9zZSgpO1xuICAgIGxldCBjYW5jZWwgPSB0aGlzLmNvbmZpZ1ZpZXcuZ2V0Q2FuY2VsKCk7XG5cbiAgICBjbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cbiAgICAgIHRoaXMudXBkYXRlQ29uZmlnKCk7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9KTtcblxuICAgIGNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cbiAgICAgIHRoaXMuZGVzdHJveUVkaXRvcnMoKTtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgbWVyZ2VDb25maWdPYmplY3RzKG9iajEsIG9iajIpIHtcblxuICAgIHJldHVybiBkZWVwRXh0ZW5kKHt9LCBvYmoxLCBvYmoyKTtcbiAgfVxuXG4gIGhpZGUoKSB7XG5cbiAgICBpZiAoXG4gICAgICAhdGhpcy5jb25maWdQYW5lbCB8fFxuICAgICAgIXRoaXMuY29uZmlnUGFuZWwudmlzaWJsZVxuICAgICkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWdQYW5lbC5oaWRlKCk7XG5cbiAgICBmb2N1c0VkaXRvcigpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG5cbiAgICB0aGlzLmhpZGUoKTtcbiAgICB0aGlzLmRlc3Ryb3lFZGl0b3JzKCk7XG4gICAgdGhpcy5jb25maWcgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5wcm9qZWN0Q29uZmlnID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZ1ZpZXcpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnVmlldy5yZW1vdmVDb250ZW50KCk7XG4gIH1cblxuICBnYXRoZXJEYXRhKCkge1xuXG4gICAgY29uc3QgY29uZmlnRGVmYXVsdCA9IHRoaXMuZ2V0Q29udGVudCgnLi4vY29uZmlnL3Rlcm4tY29uZmlnLmpzb24nLCBmYWxzZSk7XG4gICAgY29uc3QgcGx1Z2luc1Rlcm4gPSB0aGlzLmdldENvbnRlbnQoJy4uL2NvbmZpZy90ZXJuLXBsdWdpbnMuanNvbicsIGZhbHNlKTtcblxuICAgIGlmICghY29uZmlnRGVmYXVsdCkge1xuXG4gICAgICBjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgbG9hZDogdGVybi1jb25maWcuanNvbicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucHJvamVjdENvbmZpZyA9IHRoaXMuZ2V0Q29udGVudCgnLy50ZXJuLXByb2plY3QnLCB0cnVlKTtcbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMucHJvamVjdENvbmZpZyB8fCB7fTtcblxuICAgIGlmICghdGhpcy5wcm9qZWN0Q29uZmlnKSB7XG5cbiAgICAgIHRoaXMucHJvamVjdENvbmZpZyA9IHt9O1xuICAgICAgdGhpcy5jb25maWcgPSBjbG9uZShjb25maWdEZWZhdWx0KTtcbiAgICB9XG5cbiAgICB0aGlzLnByZXBhcmVFY21hKGNvbmZpZ0RlZmF1bHQpO1xuICAgIHRoaXMucHJlcGFyZUxpYnMoY29uZmlnRGVmYXVsdCk7XG4gICAgdGhpcy5wcmVwYXJlUGx1Z2lucyhwbHVnaW5zVGVybik7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnLmxvYWRFYWdlcmx5KSB7XG5cbiAgICAgIHRoaXMuY29uZmlnLmxvYWRFYWdlcmx5ID0gW107XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5kb250TG9hZCkge1xuXG4gICAgICB0aGlzLmNvbmZpZy5kb250TG9hZCA9IFtdO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmVtb3ZlRWRpdG9yKGVkaXRvcikge1xuXG4gICAgaWYgKCFlZGl0b3IpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBpZHggPSB0aGlzLmVkaXRvcnMuaW5kZXhPZihlZGl0b3IpO1xuXG4gICAgaWYgKGlkeCA9PT0gLTEpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZWRpdG9ycy5zcGxpY2UoaWR4LCAxKTtcbiAgfVxuXG5cbiAgZGVzdHJveUVkaXRvcnMoKSB7XG5cbiAgICBmb3IgKGxldCBlZGl0b3Igb2YgdGhpcy5lZGl0b3JzKSB7XG5cbiAgICAgIGxldCBidWZmZXIgPSBlZGl0b3IuZ2V0TW9kZWwoKS5nZXRCdWZmZXIoKTtcbiAgICAgIGJ1ZmZlci5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy5lZGl0b3JzID0gW107XG4gIH1cblxuICB1cGRhdGVDb25maWcoKSB7XG5cbiAgICB0aGlzLmNvbmZpZy5sb2FkRWFnZXJseSA9IFtdO1xuICAgIHRoaXMuY29uZmlnLmRvbnRMb2FkID0gW107XG5cbiAgICBmb3IgKGxldCBlZGl0b3Igb2YgdGhpcy5lZGl0b3JzKSB7XG5cbiAgICAgIGxldCBidWZmZXIgPSBlZGl0b3IuZ2V0TW9kZWwoKS5nZXRCdWZmZXIoKTtcbiAgICAgIGxldCB0ZXh0ID0gYnVmZmVyLmdldFRleHQoKS50cmltKCk7XG5cbiAgICAgIGlmICh0ZXh0ID09PSAnJykge1xuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbmZpZ1tlZGl0b3IuX190ZXJuanNfc2VjdGlvbl0ucHVzaCh0ZXh0KTtcbiAgICB9XG5cbiAgICB0aGlzLmRlc3Ryb3lFZGl0b3JzKCk7XG5cbiAgICBsZXQgbmV3Q29uZmlnID0gdGhpcy5idWlsZE5ld0NvbmZpZygpO1xuICAgIGxldCBuZXdDb25maWdKU09OID0gSlNPTi5zdHJpbmdpZnkobmV3Q29uZmlnLCBudWxsLCAyKTtcblxuICAgIHVwZGF0ZVRlcm5GaWxlKG5ld0NvbmZpZ0pTT04sIHRydWUpO1xuICB9XG5cbiAgYnVpbGROZXdDb25maWcoKSB7XG5cbiAgICBsZXQgbmV3Q29uZmlnID0ge307XG5cbiAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5jb25maWcuZWNtYVZlcnNpb25zKSkge1xuXG4gICAgICBpZiAodGhpcy5jb25maWcuZWNtYVZlcnNpb25zW2tleV0pIHtcblxuICAgICAgICBuZXdDb25maWcuZWNtYVZlcnNpb24gPSBOdW1iZXIoa2V5W2tleS5sZW5ndGggLSAxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghaXNFbXB0eSh0aGlzLmNvbmZpZy5saWJzKSkge1xuXG4gICAgICBuZXdDb25maWcubGlicyA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5jb25maWcubGlicykpIHtcblxuICAgICAgICBpZiAodGhpcy5jb25maWcubGlic1trZXldLl9hY3RpdmUpIHtcblxuICAgICAgICAgIG5ld0NvbmZpZy5saWJzLnB1c2goa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbmZpZy5sb2FkRWFnZXJseS5sZW5ndGggIT09IDApIHtcblxuICAgICAgbmV3Q29uZmlnLmxvYWRFYWdlcmx5ID0gdGhpcy5jb25maWcubG9hZEVhZ2VybHk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29uZmlnLmRvbnRMb2FkLmxlbmd0aCAhPT0gMCkge1xuXG4gICAgICBuZXdDb25maWcuZG9udExvYWQgPSB0aGlzLmNvbmZpZy5kb250TG9hZDtcbiAgICB9XG5cbiAgICBpZiAoIWlzRW1wdHkodGhpcy5jb25maWcucGx1Z2lucykpIHtcblxuICAgICAgbmV3Q29uZmlnLnBsdWdpbnMgPSB7fTtcblxuICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5jb25maWcucGx1Z2lucykpIHtcblxuICAgICAgICBpZiAodGhpcy5jb25maWcucGx1Z2luc1trZXldLl9hY3RpdmUpIHtcblxuICAgICAgICAgIGRlbGV0ZSB0aGlzLmNvbmZpZy5wbHVnaW5zW2tleV0uX2FjdGl2ZTtcbiAgICAgICAgICBuZXdDb25maWcucGx1Z2luc1trZXldID0gdGhpcy5jb25maWcucGx1Z2luc1trZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0NvbmZpZztcbiAgfVxuXG4gIGluaXRDb25maWdWaWV3KCkge1xuXG4gICAgdGhpcy5jb25maWdWaWV3ID0gbmV3IENvbmZpZ1ZpZXcoKTtcbiAgICB0aGlzLmNvbmZpZ1ZpZXcuaW5pdGlhbGl6ZSh0aGlzKTtcblxuICAgIHRoaXMuY29uZmlnUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRSaWdodFBhbmVsKHtcblxuICAgICAgaXRlbTogdGhpcy5jb25maWdWaWV3LFxuICAgICAgcHJpb3JpdHk6IDBcbiAgICB9KTtcbiAgICB0aGlzLmNvbmZpZ1BhbmVsLmhpZGUoKTtcblxuICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcbiAgfVxuXG4gIHNob3coKSB7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnVmlldykge1xuXG4gICAgICB0aGlzLmluaXRDb25maWdWaWV3KCk7XG4gICAgfVxuXG4gICAgdGhpcy5jbGVhcigpO1xuXG4gICAgaWYgKCF0aGlzLmdhdGhlckRhdGEoKSkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMuY29uZmlnUGFuZWwpLmNsYXNzTGlzdC5hZGQoJ2F0b20tdGVybmpzLWNvbmZpZy1wYW5lbCcpO1xuXG4gICAgdGhpcy5jb25maWdWaWV3LmJ1aWxkT3B0aW9uc01hcmt1cCgpO1xuICAgIHRoaXMuY29uZmlnUGFuZWwuc2hvdygpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIGRpc3Bvc2VBbGwodGhpcy5kaXNwb3NhYmxlcyk7XG5cbiAgICBpZiAodGhpcy5jb25maWdWaWV3KSB7XG5cbiAgICAgIHRoaXMuY29uZmlnVmlldy5kZXN0cm95KCk7XG4gICAgfVxuICAgIHRoaXMuY29uZmlnVmlldyA9IHVuZGVmaW5lZDtcblxuICAgIGlmICh0aGlzLmNvbmZpZ1BhbmVsKSB7XG5cbiAgICAgIHRoaXMuY29uZmlnUGFuZWwuZGVzdHJveSgpO1xuICAgIH1cbiAgICB0aGlzLmNvbmZpZ1BhbmVsID0gdW5kZWZpbmVkO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBDb25maWcoKTtcbiJdfQ==