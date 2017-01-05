Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

'use babel';

var LinterRegistry = (function () {
  function LinterRegistry() {
    _classCallCheck(this, LinterRegistry);

    this.linters = new Set();
    this.locks = {
      Regular: new WeakSet(),
      Fly: new WeakSet()
    };

    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();
    this.subscriptions.add(this.emitter);
  }

  _createClass(LinterRegistry, [{
    key: 'getLinters',
    value: function getLinters() {
      return this.linters;
    }
  }, {
    key: 'hasLinter',
    value: function hasLinter(linter) {
      return this.linters.has(linter);
    }
  }, {
    key: 'addLinter',
    value: function addLinter(linter) {
      try {
        _validate2['default'].linter(linter);
        linter.deactivated = false;
        this.linters.add(linter);
      } catch (err) {
        _helpers2['default'].error(err);
      }
    }
  }, {
    key: 'deleteLinter',
    value: function deleteLinter(linter) {
      if (this.linters.has(linter)) {
        linter.deactivated = true;
        this.linters['delete'](linter);
      }
    }
  }, {
    key: 'lint',
    value: function lint(_ref) {
      var _this = this;

      var onChange = _ref.onChange;
      var editorLinter = _ref.editorLinter;

      var editor = editorLinter.editor;
      var lockKey = onChange ? 'Fly' : 'Regular';

      if (onChange && !atom.config.get('linter.lintOnFly') || // Lint-on-fly mismatch
      !editor.getPath() || // Not saved anywhere yet
      editor !== atom.workspace.getActiveTextEditor() || // Not active
      this.locks[lockKey].has(editorLinter) || // Already linting
      atom.config.get('linter.ignoreVCSIgnoredFiles') && _helpers2['default'].isPathIgnored(editor.getPath()) // Ignored by VCS
      ) {
          return;
        }

      this.locks[lockKey].add(editorLinter);
      var scopes = editor.scopeDescriptorForBufferPosition(editor.getCursorBufferPosition()).scopes;
      scopes.push('*');

      var promises = [];
      this.linters.forEach(function (linter) {
        if (_helpers2['default'].shouldTriggerLinter(linter, onChange, scopes)) {
          promises.push(new Promise(function (resolve) {
            resolve(linter.lint(editor));
          }).then(function (results) {
            if (results) {
              _this.emitter.emit('did-update-messages', { linter: linter, messages: results, editor: editor });
            }
          }, _helpers2['default'].error));
        }
      });
      return Promise.all(promises).then(function () {
        return _this.locks[lockKey]['delete'](editorLinter);
      });
    }
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.linters.clear();
      this.subscriptions.dispose();
    }
  }]);

  return LinterRegistry;
})();

exports['default'] = LinterRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbGludGVyLXJlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRTJDLE1BQU07O3dCQUM1QixZQUFZOzs7O3VCQUNiLFdBQVc7Ozs7QUFKL0IsV0FBVyxDQUFBOztJQU1VLGNBQWM7QUFDdEIsV0FEUSxjQUFjLEdBQ25COzBCQURLLGNBQWM7O0FBRS9CLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN4QixRQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsYUFBTyxFQUFFLElBQUksT0FBTyxFQUFFO0FBQ3RCLFNBQUcsRUFBRSxJQUFJLE9BQU8sRUFBRTtLQUNuQixDQUFBOztBQUVELFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUNyQzs7ZUFYa0IsY0FBYzs7V0FZdkIsc0JBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUE7S0FDcEI7OztXQUNRLG1CQUFDLE1BQU0sRUFBRTtBQUNoQixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQ2hDOzs7V0FDUSxtQkFBQyxNQUFNLEVBQUU7QUFDaEIsVUFBSTtBQUNGLDhCQUFTLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUN2QixjQUFNLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtBQUMxQixZQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtPQUN6QixDQUFDLE9BQU8sR0FBRyxFQUFFO0FBQ1osNkJBQVEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO09B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b20vcGFja2FnZXMvbGludGVyL2xpYi9saW50ZXItcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQgVmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZSdcbmltcG9ydCBIZWxwZXJzIGZyb20gJy4vaGVscGVycydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGludGVyUmVnaXN0cnkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmxpbnRlcnMgPSBuZXcgU2V0KClcbiAgICB0aGlzLmxvY2tzID0ge1xuICAgICAgUmVndWxhcjogbmV3IFdlYWtTZXQoKSxcbiAgICAgIEZseTogbmV3IFdlYWtTZXQoKVxuICAgIH1cblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gIH1cbiAgZ2V0TGludGVycygpIHtcbiAgICByZXR1cm4gdGhpcy5saW50ZXJzXG4gIH1cbiAgaGFzTGludGVyKGxpbnRlcikge1xuICAgIHJldHVybiB0aGlzLmxpbnRlcnMuaGFzKGxpbnRlcilcbiAgfVxuICBhZGRMaW50ZXIobGludGVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIFZhbGlkYXRlLmxpbnRlcihsaW50ZXIpXG4gICAgICBsaW50ZXIuZGVhY3RpdmF0ZWQgPSBmYWxzZVxuICAgICAgdGhpcy5saW50ZXJzLmFkZChsaW50ZXIpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBIZWxwZXJzLmVycm9yKGVycilcbiAgICB9XG4gIH1cbiAgZGVsZXRlTGludGVyKGxpbnRlcikge1xuICAgIGlmICh0aGlzLmxpbnRlcnMuaGFzKGxpbnRlcikpIHtcbiAgICAgIGxpbnRlci5kZWFjdGl2YXRlZCA9IHRydWVcbiAgICAgIHRoaXMubGludGVycy5kZWxldGUobGludGVyKVxuICAgIH1cbiAgfVxuICBsaW50KHtvbkNoYW5nZSwgZWRpdG9yTGludGVyfSkge1xuICAgIGNvbnN0IGVkaXRvciA9IGVkaXRvckxpbnRlci5lZGl0b3JcbiAgICBjb25zdCBsb2NrS2V5ID0gb25DaGFuZ2UgPyAnRmx5JyA6ICdSZWd1bGFyJ1xuXG4gICAgaWYgKFxuICAgICAgKG9uQ2hhbmdlICYmICFhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci5saW50T25GbHknKSkgfHwgLy8gTGludC1vbi1mbHkgbWlzbWF0Y2hcbiAgICAgICFlZGl0b3IuZ2V0UGF0aCgpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IC8vIE5vdCBzYXZlZCBhbnl3aGVyZSB5ZXRcbiAgICAgIGVkaXRvciAhPT0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpICAgIHx8IC8vIE5vdCBhY3RpdmVcbiAgICAgIHRoaXMubG9ja3NbbG9ja0tleV0uaGFzKGVkaXRvckxpbnRlcikgICAgICAgICAgICAgIHx8IC8vIEFscmVhZHkgbGludGluZ1xuICAgICAgKGF0b20uY29uZmlnLmdldCgnbGludGVyLmlnbm9yZVZDU0lnbm9yZWRGaWxlcycpICYmXG4gICAgICAgIEhlbHBlcnMuaXNQYXRoSWdub3JlZChlZGl0b3IuZ2V0UGF0aCgpKSkgICAgICAgICAgICAvLyBJZ25vcmVkIGJ5IFZDU1xuICAgICkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5sb2Nrc1tsb2NrS2V5XS5hZGQoZWRpdG9yTGludGVyKVxuICAgIGNvbnN0IHNjb3BlcyA9IGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkuc2NvcGVzXG4gICAgc2NvcGVzLnB1c2goJyonKVxuXG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXVxuICAgIHRoaXMubGludGVycy5mb3JFYWNoKGxpbnRlciA9PiB7XG4gICAgICBpZiAoSGVscGVycy5zaG91bGRUcmlnZ2VyTGludGVyKGxpbnRlciwgb25DaGFuZ2UsIHNjb3BlcykpIHtcbiAgICAgICAgcHJvbWlzZXMucHVzaChuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgcmVzb2x2ZShsaW50ZXIubGludChlZGl0b3IpKVxuICAgICAgICB9KS50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgICAgIGlmIChyZXN1bHRzKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZS1tZXNzYWdlcycsIHtsaW50ZXIsIG1lc3NhZ2VzOiByZXN1bHRzLCBlZGl0b3J9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgSGVscGVycy5lcnJvcikpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT5cbiAgICAgIHRoaXMubG9ja3NbbG9ja0tleV0uZGVsZXRlKGVkaXRvckxpbnRlcilcbiAgICApXG4gIH1cbiAgb25EaWRVcGRhdGVNZXNzYWdlcyhjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMubGludGVycy5jbGVhcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG4iXX0=