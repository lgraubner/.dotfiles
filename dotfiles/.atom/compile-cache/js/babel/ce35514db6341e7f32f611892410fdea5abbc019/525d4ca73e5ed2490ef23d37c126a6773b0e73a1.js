Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _atomTernjsProvider = require('./atom-ternjs-provider');

var _atomTernjsProvider2 = _interopRequireDefault(_atomTernjsProvider);

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atomTernjsHelper = require('./atom-ternjs-helper');

'use babel';

var PackageConfig = (function () {
  function PackageConfig() {
    _classCallCheck(this, PackageConfig);

    this.disposables = [];
    this.defaultConfig = _config2['default'];

    this.options = {

      excludeLowerPriority: this.get('excludeLowerPriorityProviders'),
      inlineFnCompletion: this.get('inlineFnCompletion'),
      inlineFnCompletionDocumentation: this.get('inlineFnCompletionDocumentation'),
      useSnippets: this.get('useSnippets'),
      snippetsFirst: this.get('snippetsFirst'),
      useSnippetsAndFunction: this.get('useSnippetsAndFunction'),
      sort: this.get('sort'),
      guess: this.get('guess'),
      urls: this.get('urls'),
      origins: this.get('origins'),
      caseInsensitive: this.get('caseInsensitive'),
      documentation: this.get('documentation'),
      ternServerGetFileAsync: this.get('ternServerGetFileAsync'),
      ternServerDependencyBudget: this.get('ternServerDependencyBudget')
    };
  }

  _createClass(PackageConfig, [{
    key: 'get',
    value: function get(option) {

      var value = atom.config.get('atom-ternjs.' + option);

      if (value === undefined) {

        return this.defaultConfig[option]['default'];
      }

      return value;
    }
  }, {
    key: 'registerEvents',
    value: function registerEvents() {
      var _this = this;

      this.disposables.push(atom.config.observe('atom-ternjs.excludeLowerPriorityProviders', function (value) {

        _this.options.excludeLowerPriority = value;

        if (_atomTernjsProvider2['default']) {

          _atomTernjsProvider2['default'].excludeLowerPriority = value;
        }
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.snippetsFirst', function (value) {

        if (_atomTernjsProvider2['default']) {

          _atomTernjsProvider2['default'].suggestionPriority = value ? null : 2;
        }

        _this.options.snippetsFirst = value;
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.inlineFnCompletion', function (value) {

        _this.options.inlineFnCompletion = value;
        _atomTernjsEvents2['default'].emit('type-destroy-overlay');
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.ternServerGetFileAsync', function (value) {
        return _this.options.ternServerGetFileAsync = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.ternServerDependencyBudget', function (value) {
        return _this.options.ternServerDependencyBudget = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.inlineFnCompletionDocumentation', function (value) {
        return _this.options.inlineFnCompletionDocumentation = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.useSnippets', function (value) {
        return _this.options.useSnippets = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.useSnippetsAndFunction', function (value) {
        return _this.options.useSnippetsAndFunction = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.sort', function (value) {
        return _this.options.sort = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.guess', function (value) {
        return _this.options.guess = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.urls', function (value) {
        return _this.options.urls = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.origins', function (value) {
        return _this.options.origins = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.caseInsensitive', function (value) {
        return _this.options.caseInsensitive = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.documentation', function (value) {
        return _this.options.documentation = value;
      }));
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);
    }
  }]);

  return PackageConfig;
})();

exports['default'] = new PackageConfig();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1wYWNrYWdlLWNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3NCQUV5QixVQUFVOzs7O2tDQUNkLHdCQUF3Qjs7OztnQ0FDekIsc0JBQXNCOzs7O2dDQUNqQixzQkFBc0I7O0FBTC9DLFdBQVcsQ0FBQzs7SUFPTixhQUFhO0FBRU4sV0FGUCxhQUFhLEdBRUg7MEJBRlYsYUFBYTs7QUFJZixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUN0QixRQUFJLENBQUMsYUFBYSxzQkFBZSxDQUFDOztBQUVsQyxRQUFJLENBQUMsT0FBTyxHQUFHOztBQUViLDBCQUFvQixFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUM7QUFDL0Qsd0JBQWtCLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQztBQUNsRCxxQ0FBK0IsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDO0FBQzVFLGlCQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUM7QUFDcEMsbUJBQWEsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztBQUN4Qyw0QkFBc0IsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDO0FBQzFELFVBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztBQUN0QixXQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7QUFDeEIsVUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQ3RCLGFBQU8sRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztBQUM1QixxQkFBZSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENB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QUksYUFBYSxFQUFFIiwiZmlsZSI6Ii9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1wYWNrYWdlLWNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgZGVmYXVsQ29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCBwcm92aWRlciBmcm9tICcuL2F0b20tdGVybmpzLXByb3ZpZGVyJztcbmltcG9ydCBlbWl0dGVyIGZyb20gJy4vYXRvbS10ZXJuanMtZXZlbnRzJztcbmltcG9ydCB7ZGlzcG9zZUFsbH0gZnJvbSAnLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuXG5jbGFzcyBQYWNrYWdlQ29uZmlnIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcbiAgICB0aGlzLmRlZmF1bHRDb25maWcgPSBkZWZhdWxDb25maWc7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSB7XG5cbiAgICAgIGV4Y2x1ZGVMb3dlclByaW9yaXR5OiB0aGlzLmdldCgnZXhjbHVkZUxvd2VyUHJpb3JpdHlQcm92aWRlcnMnKSxcbiAgICAgIGlubGluZUZuQ29tcGxldGlvbjogdGhpcy5nZXQoJ2lubGluZUZuQ29tcGxldGlvbicpLFxuICAgICAgaW5saW5lRm5Db21wbGV0aW9uRG9jdW1lbnRhdGlvbjogdGhpcy5nZXQoJ2lubGluZUZuQ29tcGxldGlvbkRvY3VtZW50YXRpb24nKSxcbiAgICAgIHVzZVNuaXBwZXRzOiB0aGlzLmdldCgndXNlU25pcHBldHMnKSxcbiAgICAgIHNuaXBwZXRzRmlyc3Q6IHRoaXMuZ2V0KCdzbmlwcGV0c0ZpcnN0JyksXG4gICAgICB1c2VTbmlwcGV0c0FuZEZ1bmN0aW9uOiB0aGlzLmdldCgndXNlU25pcHBldHNBbmRGdW5jdGlvbicpLFxuICAgICAgc29ydDogdGhpcy5nZXQoJ3NvcnQnKSxcbiAgICAgIGd1ZXNzOiB0aGlzLmdldCgnZ3Vlc3MnKSxcbiAgICAgIHVybHM6IHRoaXMuZ2V0KCd1cmxzJyksXG4gICAgICBvcmlnaW5zOiB0aGlzLmdldCgnb3JpZ2lucycpLFxuICAgICAgY2FzZUluc2Vuc2l0aXZlOiB0aGlzLmdldCgnY2FzZUluc2Vuc2l0aXZlJyksXG4gICAgICBkb2N1bWVudGF0aW9uOiB0aGlzLmdldCgnZG9jdW1lbnRhdGlvbicpLFxuICAgICAgdGVyblNlcnZlckdldEZpbGVBc3luYzogdGhpcy5nZXQoJ3Rlcm5TZXJ2ZXJHZXRGaWxlQXN5bmMnKSxcbiAgICAgIHRlcm5TZXJ2ZXJEZXBlbmRlbmN5QnVkZ2V0OiB0aGlzLmdldCgndGVyblNlcnZlckRlcGVuZGVuY3lCdWRnZXQnKVxuICAgIH07XG4gIH1cblxuICBnZXQob3B0aW9uKSB7XG5cbiAgICBjb25zdCB2YWx1ZSA9IGF0b20uY29uZmlnLmdldChgYXRvbS10ZXJuanMuJHtvcHRpb259YCk7XG5cbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICByZXR1cm4gdGhpcy5kZWZhdWx0Q29uZmlnW29wdGlvbl0uZGVmYXVsdDtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICByZWdpc3RlckV2ZW50cygpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLXRlcm5qcy5leGNsdWRlTG93ZXJQcmlvcml0eVByb3ZpZGVycycsICh2YWx1ZSkgPT4ge1xuXG4gICAgICB0aGlzLm9wdGlvbnMuZXhjbHVkZUxvd2VyUHJpb3JpdHkgPSB2YWx1ZTtcblxuICAgICAgaWYgKHByb3ZpZGVyKSB7XG5cbiAgICAgICAgcHJvdmlkZXIuZXhjbHVkZUxvd2VyUHJpb3JpdHkgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMuc25pcHBldHNGaXJzdCcsICh2YWx1ZSkgPT4ge1xuXG4gICAgICBpZiAocHJvdmlkZXIpIHtcblxuICAgICAgICBwcm92aWRlci5zdWdnZXN0aW9uUHJpb3JpdHkgPSB2YWx1ZSA/IG51bGwgOiAyO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuc25pcHBldHNGaXJzdCA9IHZhbHVlO1xuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLXRlcm5qcy5pbmxpbmVGbkNvbXBsZXRpb24nLCAodmFsdWUpID0+IHtcblxuICAgICAgdGhpcy5vcHRpb25zLmlubGluZUZuQ29tcGxldGlvbiA9IHZhbHVlO1xuICAgICAgZW1pdHRlci5lbWl0KCd0eXBlLWRlc3Ryb3ktb3ZlcmxheScpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLXRlcm5qcy50ZXJuU2VydmVyR2V0RmlsZUFzeW5jJywgdmFsdWUgPT4gdGhpcy5vcHRpb25zLnRlcm5TZXJ2ZXJHZXRGaWxlQXN5bmMgPSB2YWx1ZSkpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLXRlcm5qcy50ZXJuU2VydmVyRGVwZW5kZW5jeUJ1ZGdldCcsIHZhbHVlID0+IHRoaXMub3B0aW9ucy50ZXJuU2VydmVyRGVwZW5kZW5jeUJ1ZGdldCA9IHZhbHVlKSk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLmlubGluZUZuQ29tcGxldGlvbkRvY3VtZW50YXRpb24nLCB2YWx1ZSA9PiB0aGlzLm9wdGlvbnMuaW5saW5lRm5Db21wbGV0aW9uRG9jdW1lbnRhdGlvbiA9IHZhbHVlKSk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLnVzZVNuaXBwZXRzJywgdmFsdWUgPT4gdGhpcy5vcHRpb25zLnVzZVNuaXBwZXRzID0gdmFsdWUpKTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMudXNlU25pcHBldHNBbmRGdW5jdGlvbicsIHZhbHVlID0+IHRoaXMub3B0aW9ucy51c2VTbmlwcGV0c0FuZEZ1bmN0aW9uID0gdmFsdWUpKTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMuc29ydCcsIHZhbHVlID0+IHRoaXMub3B0aW9ucy5zb3J0ID0gdmFsdWUpKTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMuZ3Vlc3MnLCB2YWx1ZSA9PiB0aGlzLm9wdGlvbnMuZ3Vlc3MgPSB2YWx1ZSkpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLXRlcm5qcy51cmxzJywgdmFsdWUgPT4gdGhpcy5vcHRpb25zLnVybHMgPSB2YWx1ZSkpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLXRlcm5qcy5vcmlnaW5zJywgdmFsdWUgPT4gdGhpcy5vcHRpb25zLm9yaWdpbnMgPSB2YWx1ZSkpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLXRlcm5qcy5jYXNlSW5zZW5zaXRpdmUnLCB2YWx1ZSA9PiB0aGlzLm9wdGlvbnMuY2FzZUluc2Vuc2l0aXZlID0gdmFsdWUpKTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMuZG9jdW1lbnRhdGlvbicsIHZhbHVlID0+IHRoaXMub3B0aW9ucy5kb2N1bWVudGF0aW9uID0gdmFsdWUpKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICBkaXNwb3NlQWxsKHRoaXMuZGlzcG9zYWJsZXMpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBQYWNrYWdlQ29uZmlnKCk7XG4iXX0=