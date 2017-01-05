Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _atomTernjsHelper = require('./atom-ternjs-helper');

'use babel';

var Client = (function () {
  function Client(projectDir) {
    _classCallCheck(this, Client);

    this.projectDir = projectDir;
  }

  _createClass(Client, [{
    key: 'completions',
    value: function completions(file, end) {

      return this.post('query', {

        query: {

          type: 'completions',
          file: file,
          end: end,
          types: true,
          includeKeywords: true,
          sort: _atomTernjsPackageConfig2['default'].options.sort,
          guess: _atomTernjsPackageConfig2['default'].options.guess,
          docs: _atomTernjsPackageConfig2['default'].options.documentation,
          urls: _atomTernjsPackageConfig2['default'].options.urls,
          origins: _atomTernjsPackageConfig2['default'].options.origins,
          lineCharPositions: true,
          caseInsensitive: _atomTernjsPackageConfig2['default'].options.caseInsensitive
        }
      });
    }
  }, {
    key: 'documentation',
    value: function documentation(file, end) {

      return this.post('query', {

        query: {

          type: 'documentation',
          file: file,
          end: end
        }
      });
    }
  }, {
    key: 'refs',
    value: function refs(file, end) {

      return this.post('query', {

        query: {

          type: 'refs',
          file: file,
          end: end
        }
      });
    }
  }, {
    key: 'updateFull',
    value: function updateFull(editor, editorMeta) {

      if (editorMeta) {

        editorMeta.diffs = [];
      }

      return this.post('query', { files: [{

          type: 'full',
          name: atom.project.relativizePath(editor.getURI())[1],
          text: editor.getText()
        }] });
    }
  }, {
    key: 'updatePart',
    value: function updatePart(editor, editorMeta, start, text) {

      if (editorMeta) {

        editorMeta.diffs = [];
      }

      return this.post('query', [{

        type: 'full',
        name: atom.project.relativizePath(editor.getURI())[1],
        offset: {

          line: start,
          ch: 0
        },
        text: editor.getText()
      }]);
    }
  }, {
    key: 'update',
    value: function update(editor) {
      var _this = this;

      var editorMeta = _atomTernjsManager2['default'].getEditor(editor);
      var file = atom.project.relativizePath(editor.getURI())[1].replace(/\\/g, '/');

      // check if this file is excluded via dontLoad
      if (_atomTernjsManager2['default'].server && _atomTernjsManager2['default'].server.dontLoad(file)) {

        return Promise.resolve({});
      }

      // check if the file is registered, else return
      return this.files().then(function (data) {

        if (data.files) {

          for (var i = 0; i < data.files.length; i++) {

            data.files[i] = data.files[i].replace(/\\/g, '/');
          }
        }

        var registered = data.files && data.files.indexOf(file) > -1;

        if (editorMeta && editorMeta.diffs.length === 0 && registered) {

          return Promise.resolve({});
        }

        if (registered) {

          // const buffer = editor.getBuffer();
          // if buffer.getMaxCharacterIndex() > 5000
          //   start = 0
          //   end = 0
          //   text = ''
          //   for diff in editorMeta.diffs
          //     start = Math.max(0, diff.oldRange.start.row - 50)
          //     end = Math.min(buffer.getLineCount(), diff.oldRange.end.row + 5)
          //     text = buffer.getTextInRange([[start, 0], [end, buffer.lineLengthForRow(end)]])
          //   promise = this.updatePart(editor, editorMeta, start, text)
          // else
          return _this.updateFull(editor, editorMeta);
        } else {

          return Promise.resolve({});
        }
      })['catch'](function (err) {

        console.error(err);
      });
    }
  }, {
    key: 'rename',
    value: function rename(file, end, newName) {

      return this.post('query', {

        query: {

          type: 'rename',
          file: file,
          end: end,
          newName: newName
        }
      });
    }
  }, {
    key: 'type',
    value: function type(editor, position) {

      var file = atom.project.relativizePath(editor.getURI())[1];
      var end = {

        line: position.row,
        ch: position.column
      };

      return this.post('query', {

        query: {

          type: 'type',
          file: file,
          end: end,
          preferFunction: true
        }
      });
    }
  }, {
    key: 'definition',
    value: function definition() {

      var editor = atom.workspace.getActiveTextEditor();
      var cursor = editor.getLastCursor();
      var position = cursor.getBufferPosition();
      var file = atom.project.relativizePath(editor.getURI())[1];
      var end = {

        line: position.row,
        ch: position.column
      };

      return this.post('query', {

        query: {

          type: 'definition',
          file: file,
          end: end
        }

      }).then(function (data) {

        if (data && data.start) {

          (0, _atomTernjsHelper.setMarkerCheckpoint)();
          (0, _atomTernjsHelper.openFileAndGoTo)(data.start, data.file);
        }
      })['catch'](function (err) {

        console.error(err);
      });
    }
  }, {
    key: 'files',
    value: function files() {

      return this.post('query', {

        query: {

          type: 'files'
        }

      }).then(function (data) {

        return data;
      });
    }
  }, {
    key: 'post',
    value: function post(type, data) {

      var promise = _atomTernjsManager2['default'].server.request(type, data);

      return promise;
    }
  }]);

  return Client;
})();

exports['default'] = Client;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1jbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztpQ0FFb0IsdUJBQXVCOzs7O3VDQUNqQiw4QkFBOEI7Ozs7Z0NBSWpELHNCQUFzQjs7QUFQN0IsV0FBVyxDQUFDOztJQVNTLE1BQU07QUFFZCxXQUZRLE1BQU0sQ0FFYixVQUFVLEVBQUU7MEJBRkwsTUFBTTs7QUFJdkIsUUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7R0FDOUI7O2VBTGtCLE1BQU07O1dBT2QscUJBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTs7QUFFckIsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTs7QUFFeEIsYUFBSyxFQUFFOztBQUVMLGNBQUksRUFBRSxhQUFhO0FBQ25CLGNBQUksRUFBRSxJQUFJO0FBQ1YsYUFBRyxFQUFFLEdBQUc7QUFDUixlQUFLLEVBQUUsSUFBSTtBQUNYLHlCQUFlLEVBQUUsSUFBSTtBQUNyQixjQUFJLEVBQUUscUNBQWMsT0FBTyxDQUFDLElBQUk7QUFDaEMsZUFBSyxFQUFFLHFDQUFjLE9BQU8sQ0FBQyxLQUFLO0FBQ2xDLGNBQUksRUFBRSxxQ0FBYyxPQUFPLENBQUMsYUFBYTtBQUN6QyxjQUFJLEVBQUUscUNBQWMsT0FBTyxDQUFDLElBQUk7QUFDaEMsaUJBQU8sRUFBRSxxQ0FBYyxPQUFPLENBQUMsT0FBTztBQUN0QywyQkFBaUIsRUFBRSxJQUFJO0FBQ3ZCLHlCQUFlLEVBQUUscUNBQWMsT0FBTyxDQUFDLGVBQWU7U0FDdkQ7T0FDRixDQUFDLENBQUM7S0FDSjs7O1dBRVksdUJBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTs7QUFFdkIsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTs7QUFFeEIsYUFBSyxFQUFFOztBQUVMLGNBQUksRUFBRSxl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QUM7S0FDSjs7O1dBRUcsY0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFOztBQUVmLFVBQU0sT0FBTyxHQUFHLCtCQUFRLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDOztBQUVuRCxhQUFPLE9BQU8sQ0FBQztLQUNoQjs7O1NBaFBrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiIvVXNlcnMvbGFyc2dyYXVibmVyLy5kb3RmaWxlcy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vYXRvbS10ZXJuanMtbWFuYWdlcic7XG5pbXBvcnQgcGFja2FnZUNvbmZpZyBmcm9tICcuL2F0b20tdGVybmpzLXBhY2thZ2UtY29uZmlnJztcbmltcG9ydCB7XG4gIHNldE1hcmtlckNoZWNrcG9pbnQsXG4gIG9wZW5GaWxlQW5kR29Ub1xufSBmcm9tICcuL2F0b20tdGVybmpzLWhlbHBlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudCB7XG5cbiAgY29uc3RydWN0b3IocHJvamVjdERpcikge1xuXG4gICAgdGhpcy5wcm9qZWN0RGlyID0gcHJvamVjdERpcjtcbiAgfVxuXG4gIGNvbXBsZXRpb25zKGZpbGUsIGVuZCkge1xuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7XG5cbiAgICAgIHF1ZXJ5OiB7XG5cbiAgICAgICAgdHlwZTogJ2NvbXBsZXRpb25zJyxcbiAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgZW5kOiBlbmQsXG4gICAgICAgIHR5cGVzOiB0cnVlLFxuICAgICAgICBpbmNsdWRlS2V5d29yZHM6IHRydWUsXG4gICAgICAgIHNvcnQ6IHBhY2thZ2VDb25maWcub3B0aW9ucy5zb3J0LFxuICAgICAgICBndWVzczogcGFja2FnZUNvbmZpZy5vcHRpb25zLmd1ZXNzLFxuICAgICAgICBkb2NzOiBwYWNrYWdlQ29uZmlnLm9wdGlvbnMuZG9jdW1lbnRhdGlvbixcbiAgICAgICAgdXJsczogcGFja2FnZUNvbmZpZy5vcHRpb25zLnVybHMsXG4gICAgICAgIG9yaWdpbnM6IHBhY2thZ2VDb25maWcub3B0aW9ucy5vcmlnaW5zLFxuICAgICAgICBsaW5lQ2hhclBvc2l0aW9uczogdHJ1ZSxcbiAgICAgICAgY2FzZUluc2Vuc2l0aXZlOiBwYWNrYWdlQ29uZmlnLm9wdGlvbnMuY2FzZUluc2Vuc2l0aXZlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBkb2N1bWVudGF0aW9uKGZpbGUsIGVuZCkge1xuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7XG5cbiAgICAgIHF1ZXJ5OiB7XG5cbiAgICAgICAgdHlwZTogJ2RvY3VtZW50YXRpb24nLFxuICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICBlbmQ6IGVuZFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmVmcyhmaWxlLCBlbmQpIHtcblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5Jywge1xuXG4gICAgICBxdWVyeToge1xuXG4gICAgICAgIHR5cGU6ICdyZWZzJyxcbiAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgZW5kOiBlbmRcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZUZ1bGwoZWRpdG9yLCBlZGl0b3JNZXRhKSB7XG5cbiAgICBpZiAoZWRpdG9yTWV0YSkge1xuXG4gICAgICBlZGl0b3JNZXRhLmRpZmZzID0gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7IGZpbGVzOiBbe1xuXG4gICAgICB0eXBlOiAnZnVsbCcsXG4gICAgICBuYW1lOiBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVsxXSxcbiAgICAgIHRleHQ6IGVkaXRvci5nZXRUZXh0KClcbiAgICB9XX0pO1xuICB9XG5cbiAgdXBkYXRlUGFydChlZGl0b3IsIGVkaXRvck1ldGEsIHN0YXJ0LCB0ZXh0KSB7XG5cbiAgICBpZiAoZWRpdG9yTWV0YSkge1xuXG4gICAgICBlZGl0b3JNZXRhLmRpZmZzID0gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCBbe1xuXG4gICAgICB0eXBlOiAnZnVsbCcsXG4gICAgICBuYW1lOiBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVsxXSxcbiAgICAgIG9mZnNldDoge1xuXG4gICAgICAgIGxpbmU6IHN0YXJ0LFxuICAgICAgICBjaDogMFxuICAgICAgfSxcbiAgICAgIHRleHQ6IGVkaXRvci5nZXRUZXh0KClcbiAgICB9XSk7XG4gIH1cblxuICB1cGRhdGUoZWRpdG9yKSB7XG5cbiAgICBjb25zdCBlZGl0b3JNZXRhID0gbWFuYWdlci5nZXRFZGl0b3IoZWRpdG9yKTtcbiAgICBjb25zdCBmaWxlID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSlbMV0ucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuXG4gICAgLy8gY2hlY2sgaWYgdGhpcyBmaWxlIGlzIGV4Y2x1ZGVkIHZpYSBkb250TG9hZFxuICAgIGlmIChcbiAgICAgIG1hbmFnZXIuc2VydmVyICYmXG4gICAgICBtYW5hZ2VyLnNlcnZlci5kb250TG9hZChmaWxlKVxuICAgICkge1xuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiB0aGUgZmlsZSBpcyByZWdpc3RlcmVkLCBlbHNlIHJldHVyblxuICAgIHJldHVybiB0aGlzLmZpbGVzKCkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICBpZiAoZGF0YS5maWxlcykge1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5maWxlcy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgZGF0YS5maWxlc1tpXSA9IGRhdGEuZmlsZXNbaV0ucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlZ2lzdGVyZWQgPSBkYXRhLmZpbGVzICYmIGRhdGEuZmlsZXMuaW5kZXhPZihmaWxlKSA+IC0xO1xuXG4gICAgICBpZiAoXG4gICAgICAgIGVkaXRvck1ldGEgJiZcbiAgICAgICAgZWRpdG9yTWV0YS5kaWZmcy5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgcmVnaXN0ZXJlZFxuICAgICAgKSB7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWdpc3RlcmVkKSB7XG5cbiAgICAgICAgLy8gY29uc3QgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpO1xuICAgICAgICAvLyBpZiBidWZmZXIuZ2V0TWF4Q2hhcmFjdGVySW5kZXgoKSA+IDUwMDBcbiAgICAgICAgLy8gICBzdGFydCA9IDBcbiAgICAgICAgLy8gICBlbmQgPSAwXG4gICAgICAgIC8vICAgdGV4dCA9ICcnXG4gICAgICAgIC8vICAgZm9yIGRpZmYgaW4gZWRpdG9yTWV0YS5kaWZmc1xuICAgICAgICAvLyAgICAgc3RhcnQgPSBNYXRoLm1heCgwLCBkaWZmLm9sZFJhbmdlLnN0YXJ0LnJvdyAtIDUwKVxuICAgICAgICAvLyAgICAgZW5kID0gTWF0aC5taW4oYnVmZmVyLmdldExpbmVDb3VudCgpLCBkaWZmLm9sZFJhbmdlLmVuZC5yb3cgKyA1KVxuICAgICAgICAvLyAgICAgdGV4dCA9IGJ1ZmZlci5nZXRUZXh0SW5SYW5nZShbW3N0YXJ0LCAwXSwgW2VuZCwgYnVmZmVyLmxpbmVMZW5ndGhGb3JSb3coZW5kKV1dKVxuICAgICAgICAvLyAgIHByb21pc2UgPSB0aGlzLnVwZGF0ZVBhcnQoZWRpdG9yLCBlZGl0b3JNZXRhLCBzdGFydCwgdGV4dClcbiAgICAgICAgLy8gZWxzZVxuICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVGdWxsKGVkaXRvciwgZWRpdG9yTWV0YSk7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG4gICAgICB9XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuXG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgfSk7XG4gIH1cblxuICByZW5hbWUoZmlsZSwgZW5kLCBuZXdOYW1lKSB7XG5cbiAgICByZXR1cm4gdGhpcy5wb3N0KCdxdWVyeScsIHtcblxuICAgICAgcXVlcnk6IHtcblxuICAgICAgICB0eXBlOiAncmVuYW1lJyxcbiAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgZW5kOiBlbmQsXG4gICAgICAgIG5ld05hbWU6IG5ld05hbWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHR5cGUoZWRpdG9yLCBwb3NpdGlvbikge1xuXG4gICAgY29uc3QgZmlsZSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChlZGl0b3IuZ2V0VVJJKCkpWzFdO1xuICAgIGNvbnN0IGVuZCA9IHtcblxuICAgICAgbGluZTogcG9zaXRpb24ucm93LFxuICAgICAgY2g6IHBvc2l0aW9uLmNvbHVtblxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5wb3N0KCdxdWVyeScsIHtcblxuICAgICAgcXVlcnk6IHtcblxuICAgICAgICB0eXBlOiAndHlwZScsXG4gICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgIGVuZDogZW5kLFxuICAgICAgICBwcmVmZXJGdW5jdGlvbjogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZGVmaW5pdGlvbigpIHtcblxuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBjb25zdCBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCk7XG4gICAgY29uc3QgZmlsZSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChlZGl0b3IuZ2V0VVJJKCkpWzFdO1xuICAgIGNvbnN0IGVuZCA9IHtcblxuICAgICAgbGluZTogcG9zaXRpb24ucm93LFxuICAgICAgY2g6IHBvc2l0aW9uLmNvbHVtblxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5wb3N0KCdxdWVyeScsIHtcblxuICAgICAgcXVlcnk6IHtcblxuICAgICAgICB0eXBlOiAnZGVmaW5pdGlvbicsXG4gICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgIGVuZDogZW5kXG4gICAgICB9XG5cbiAgICB9KS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgIGlmIChkYXRhICYmIGRhdGEuc3RhcnQpIHtcblxuICAgICAgICBzZXRNYXJrZXJDaGVja3BvaW50KCk7XG4gICAgICAgIG9wZW5GaWxlQW5kR29UbyhkYXRhLnN0YXJ0LCBkYXRhLmZpbGUpO1xuICAgICAgfVxuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcblxuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH0pO1xuICB9XG5cbiAgZmlsZXMoKSB7XG5cbiAgICByZXR1cm4gdGhpcy5wb3N0KCdxdWVyeScsIHtcblxuICAgICAgcXVlcnk6IHtcblxuICAgICAgICB0eXBlOiAnZmlsZXMnXG4gICAgICB9XG5cbiAgICB9KS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0pO1xuICB9XG5cbiAgcG9zdCh0eXBlLCBkYXRhKSB7XG5cbiAgICBjb25zdCBwcm9taXNlID0gbWFuYWdlci5zZXJ2ZXIucmVxdWVzdCh0eXBlLCBkYXRhKTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG59XG4iXX0=