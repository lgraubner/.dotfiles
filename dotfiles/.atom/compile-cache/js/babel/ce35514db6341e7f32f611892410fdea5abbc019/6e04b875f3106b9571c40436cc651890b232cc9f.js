Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atom = require('atom');

var _underscorePlus = require('underscore-plus');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomTernjsHelper = require('./atom-ternjs-helper');

'use babel';

var RenameView = require('./atom-ternjs-rename-view');

var Rename = (function () {
  function Rename() {
    _classCallCheck(this, Rename);

    this.disposables = [];

    this.renameView = new RenameView();
    this.renameView.initialize(this);

    this.renamePanel = atom.workspace.addBottomPanel({

      item: this.renameView,
      priority: 0
    });

    this.renamePanel.hide();

    atom.views.getView(this.renamePanel).classList.add('atom-ternjs-rename-panel', 'panel-bottom');

    this.hideHandler = this.hide.bind(this);
    _atomTernjsEvents2['default'].on('rename-hide', this.hideHandler);

    this.registerCommands();
  }

  _createClass(Rename, [{
    key: 'registerCommands',
    value: function registerCommands() {

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:rename', this.show.bind(this)));
    }
  }, {
    key: 'hide',
    value: function hide() {

      if (!this.renamePanel || !this.renamePanel.visible) {

        return;
      }

      this.renamePanel.hide();

      (0, _atomTernjsHelper.focusEditor)();
    }
  }, {
    key: 'show',
    value: function show() {

      var codeEditor = atom.workspace.getActiveTextEditor();
      var currentNameRange = codeEditor.getLastCursor().getCurrentWordBufferRange({ includeNonWordCharacters: false });
      var currentName = codeEditor.getTextInBufferRange(currentNameRange);

      this.renameView.nameEditor.getModel().setText(currentName);
      this.renameView.nameEditor.getModel().selectAll();

      this.renamePanel.show();
      this.renameView.nameEditor.focus();
    }
  }, {
    key: 'updateAllAndRename',
    value: function updateAllAndRename(newName) {
      var _this = this;

      if (!_atomTernjsManager2['default'].client) {

        this.hide();

        return;
      }

      var idx = 0;
      var editors = atom.workspace.getTextEditors();

      for (var editor of editors) {

        if (!_atomTernjsManager2['default'].isValidEditor(editor) || atom.project.relativizePath(editor.getURI())[0] !== _atomTernjsManager2['default'].client.projectDir) {

          idx++;

          continue;
        }

        _atomTernjsManager2['default'].client.update(editor).then(function (data) {

          if (++idx === editors.length) {

            var activeEditor = atom.workspace.getActiveTextEditor();
            var cursor = activeEditor.getLastCursor();

            if (!cursor) {

              return;
            }

            var position = cursor.getBufferPosition();

            _atomTernjsManager2['default'].client.rename(atom.project.relativizePath(activeEditor.getURI())[1], { line: position.row, ch: position.column }, newName).then(function (data) {

              if (!data) {

                return;
              }

              _this.rename(data);
            })['catch'](function (error) {

              atom.notifications.addError(error, {

                dismissable: false
              });
            });
          }
        });
      }
    }
  }, {
    key: 'rename',
    value: function rename(data) {

      var dir = _atomTernjsManager2['default'].server.projectDir;

      if (!dir) {

        return;
      }

      var translateColumnBy = data.changes[0].text.length - data.name.length;

      for (var change of data.changes) {

        change.file = change.file.replace(/^.\//, '');
        change.file = _path2['default'].resolve(atom.project.relativizePath(dir)[0], change.file);
      }

      var changes = (0, _underscorePlus.uniq)(data.changes, function (item) {

        return JSON.stringify(item);
      });

      var currentFile = false;
      var arr = [];
      var idx = 0;

      for (var change of changes) {

        if (currentFile !== change.file) {

          currentFile = change.file;
          idx = arr.push([]) - 1;
        }

        arr[idx].push(change);
      }

      for (var arrObj of arr) {

        this.openFilesAndRename(arrObj, translateColumnBy);
      }

      this.hide();
    }
  }, {
    key: 'openFilesAndRename',
    value: function openFilesAndRename(obj, translateColumnBy) {
      var _this2 = this;

      atom.workspace.open(obj[0].file).then(function (textEditor) {

        var currentColumnOffset = 0;
        var idx = 0;
        var buffer = textEditor.getBuffer();
        var checkpoint = buffer.createCheckpoint();

        for (var change of obj) {

          _this2.setTextInRange(buffer, change, currentColumnOffset, idx === obj.length - 1, textEditor);
          currentColumnOffset += translateColumnBy;

          idx++;
        }

        buffer.groupChangesSinceCheckpoint(checkpoint);
      });
    }
  }, {
    key: 'setTextInRange',
    value: function setTextInRange(buffer, change, offset, moveCursor, textEditor) {

      change.start += offset;
      change.end += offset;
      var position = buffer.positionForCharacterIndex(change.start);
      length = change.end - change.start;
      var end = position.translate(new _atom.Point(0, length));
      var range = new _atom.Range(position, end);
      buffer.setTextInRange(range, change.text);

      if (!moveCursor) {

        return;
      }

      var cursor = textEditor.getLastCursor();

      cursor && cursor.setBufferPosition(position);
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);

      this.renameView && this.renameView.destroy();
      this.renameView = null;

      this.renamePanel && this.renamePanel.destroy();
      this.renamePanel = null;
    }
  }]);

  return Rename;
})();

exports['default'] = new Rename();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1yZW5hbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztnQ0FJb0Isc0JBQXNCOzs7O2lDQUN0Qix1QkFBdUI7Ozs7b0JBSXBDLE1BQU07OzhCQUNNLGlCQUFpQjs7b0JBQ25CLE1BQU07Ozs7Z0NBSWhCLHNCQUFzQjs7QUFmN0IsV0FBVyxDQUFDOztBQUVaLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDOztJQWVsRCxNQUFNO0FBRUMsV0FGUCxNQUFNLEdBRUk7MEJBRlYsTUFBTTs7QUFJUixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7QUFFdEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0FBQ25DLFFBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVqQyxRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDOztBQUUvQyxVQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVU7QUFDckIsY0FBUSxFQUFFLENBQUM7S0FDWixDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFeEIsUUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEVBQUUsY0FBYyxDQUFDLENBQUM7O0FBRS9GLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEMsa0NBQVEsRUFBRSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRTVDLFFBQUks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QUFDL0MsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7S0FDekI7OztTQXBORyxNQUFNOzs7cUJBdU5HLElBQUksTUFBTSxFQUFFIiwiZmlsZSI6Ii9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1yZW5hbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY29uc3QgUmVuYW1lVmlldyA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtcmVuYW1lLXZpZXcnKTtcblxuaW1wb3J0IGVtaXR0ZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1ldmVudHMnO1xuaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1tYW5hZ2VyJztcbmltcG9ydCB7XG4gIFBvaW50LFxuICBSYW5nZVxufSBmcm9tICdhdG9tJztcbmltcG9ydCB7dW5pcX0gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtcbiAgZGlzcG9zZUFsbCxcbiAgZm9jdXNFZGl0b3Jcbn0gZnJvbSAnLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuXG5jbGFzcyBSZW5hbWUge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuXG4gICAgdGhpcy5yZW5hbWVWaWV3ID0gbmV3IFJlbmFtZVZpZXcoKTtcbiAgICB0aGlzLnJlbmFtZVZpZXcuaW5pdGlhbGl6ZSh0aGlzKTtcblxuICAgIHRoaXMucmVuYW1lUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbCh7XG5cbiAgICAgIGl0ZW06IHRoaXMucmVuYW1lVmlldyxcbiAgICAgIHByaW9yaXR5OiAwXG4gICAgfSk7XG5cbiAgICB0aGlzLnJlbmFtZVBhbmVsLmhpZGUoKTtcblxuICAgIGF0b20udmlld3MuZ2V0Vmlldyh0aGlzLnJlbmFtZVBhbmVsKS5jbGFzc0xpc3QuYWRkKCdhdG9tLXRlcm5qcy1yZW5hbWUtcGFuZWwnLCAncGFuZWwtYm90dG9tJyk7XG5cbiAgICB0aGlzLmhpZGVIYW5kbGVyID0gdGhpcy5oaWRlLmJpbmQodGhpcyk7XG4gICAgZW1pdHRlci5vbigncmVuYW1lLWhpZGUnLCB0aGlzLmhpZGVIYW5kbGVyKTtcblxuICAgIHRoaXMucmVnaXN0ZXJDb21tYW5kcygpO1xuICB9XG5cbiAgcmVnaXN0ZXJDb21tYW5kcygpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpyZW5hbWUnLCB0aGlzLnNob3cuYmluZCh0aGlzKSkpO1xuICB9XG5cbiAgaGlkZSgpIHtcblxuICAgIGlmIChcbiAgICAgICF0aGlzLnJlbmFtZVBhbmVsIHx8XG4gICAgICAhdGhpcy5yZW5hbWVQYW5lbC52aXNpYmxlXG4gICAgKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnJlbmFtZVBhbmVsLmhpZGUoKTtcblxuICAgIGZvY3VzRWRpdG9yKCk7XG4gIH1cblxuICBzaG93KCkge1xuXG4gICAgY29uc3QgY29kZUVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBjb25zdCBjdXJyZW50TmFtZVJhbmdlID0gY29kZUVkaXRvci5nZXRMYXN0Q3Vyc29yKCkuZ2V0Q3VycmVudFdvcmRCdWZmZXJSYW5nZSh7aW5jbHVkZU5vbldvcmRDaGFyYWN0ZXJzOiBmYWxzZX0pO1xuICAgIGNvbnN0IGN1cnJlbnROYW1lID0gY29kZUVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShjdXJyZW50TmFtZVJhbmdlKTtcblxuICAgIHRoaXMucmVuYW1lVmlldy5uYW1lRWRpdG9yLmdldE1vZGVsKCkuc2V0VGV4dChjdXJyZW50TmFtZSk7XG4gICAgdGhpcy5yZW5hbWVWaWV3Lm5hbWVFZGl0b3IuZ2V0TW9kZWwoKS5zZWxlY3RBbGwoKTtcblxuICAgIHRoaXMucmVuYW1lUGFuZWwuc2hvdygpO1xuICAgIHRoaXMucmVuYW1lVmlldy5uYW1lRWRpdG9yLmZvY3VzKCk7XG4gIH1cblxuICB1cGRhdGVBbGxBbmRSZW5hbWUobmV3TmFtZSkge1xuXG4gICAgaWYgKCFtYW5hZ2VyLmNsaWVudCkge1xuXG4gICAgICB0aGlzLmhpZGUoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBpZHggPSAwO1xuICAgIGNvbnN0IGVkaXRvcnMgPSBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpO1xuXG4gICAgZm9yIChjb25zdCBlZGl0b3Igb2YgZWRpdG9ycykge1xuXG4gICAgICBpZiAoXG4gICAgICAgICFtYW5hZ2VyLmlzVmFsaWRFZGl0b3IoZWRpdG9yKSB8fFxuICAgICAgICBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVswXSAhPT0gbWFuYWdlci5jbGllbnQucHJvamVjdERpclxuICAgICAgKSB7XG5cbiAgICAgICAgaWR4Kys7XG5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIG1hbmFnZXIuY2xpZW50LnVwZGF0ZShlZGl0b3IpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICBpZiAoKytpZHggPT09IGVkaXRvcnMubGVuZ3RoKSB7XG5cbiAgICAgICAgICBjb25zdCBhY3RpdmVFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgICAgICAgY29uc3QgY3Vyc29yID0gYWN0aXZlRWRpdG9yLmdldExhc3RDdXJzb3IoKTtcblxuICAgICAgICAgIGlmICghY3Vyc29yKSB7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpO1xuXG4gICAgICAgICAgbWFuYWdlci5jbGllbnQucmVuYW1lKGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChhY3RpdmVFZGl0b3IuZ2V0VVJJKCkpWzFdLCB7bGluZTogcG9zaXRpb24ucm93LCBjaDogcG9zaXRpb24uY29sdW1ufSwgbmV3TmFtZSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcblxuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucmVuYW1lKGRhdGEpO1xuXG4gICAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG5cbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihlcnJvciwge1xuXG4gICAgICAgICAgICAgIGRpc21pc3NhYmxlOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbmFtZShkYXRhKSB7XG5cbiAgICBjb25zdCBkaXIgPSBtYW5hZ2VyLnNlcnZlci5wcm9qZWN0RGlyO1xuXG4gICAgaWYgKCFkaXIpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRyYW5zbGF0ZUNvbHVtbkJ5ID0gZGF0YS5jaGFuZ2VzWzBdLnRleHQubGVuZ3RoIC0gZGF0YS5uYW1lLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGNoYW5nZSBvZiBkYXRhLmNoYW5nZXMpIHtcblxuICAgICAgY2hhbmdlLmZpbGUgPSBjaGFuZ2UuZmlsZS5yZXBsYWNlKC9eLlxcLy8sICcnKTtcbiAgICAgIGNoYW5nZS5maWxlID0gcGF0aC5yZXNvbHZlKGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChkaXIpWzBdLCBjaGFuZ2UuZmlsZSk7XG4gICAgfVxuXG4gICAgbGV0IGNoYW5nZXMgPSB1bmlxKGRhdGEuY2hhbmdlcywgKGl0ZW0pID0+IHtcblxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgbGV0IGN1cnJlbnRGaWxlID0gZmFsc2U7XG4gICAgbGV0IGFyciA9IFtdO1xuICAgIGxldCBpZHggPSAwO1xuXG4gICAgZm9yIChjb25zdCBjaGFuZ2Ugb2YgY2hhbmdlcykge1xuXG4gICAgICBpZiAoY3VycmVudEZpbGUgIT09IGNoYW5nZS5maWxlKSB7XG5cbiAgICAgICAgY3VycmVudEZpbGUgPSBjaGFuZ2UuZmlsZTtcbiAgICAgICAgaWR4ID0gYXJyLnB1c2goW10pIC0gMTtcbiAgICAgIH1cblxuICAgICAgYXJyW2lkeF0ucHVzaChjaGFuZ2UpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgYXJyT2JqIG9mIGFycikge1xuXG4gICAgICB0aGlzLm9wZW5GaWxlc0FuZFJlbmFtZShhcnJPYmosIHRyYW5zbGF0ZUNvbHVtbkJ5KTtcbiAgICB9XG5cbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIG9wZW5GaWxlc0FuZFJlbmFtZShvYmosIHRyYW5zbGF0ZUNvbHVtbkJ5KSB7XG5cbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKG9ialswXS5maWxlKS50aGVuKCh0ZXh0RWRpdG9yKSA9PiB7XG5cbiAgICAgIGxldCBjdXJyZW50Q29sdW1uT2Zmc2V0ID0gMDtcbiAgICAgIGxldCBpZHggPSAwO1xuICAgICAgY29uc3QgYnVmZmVyID0gdGV4dEVkaXRvci5nZXRCdWZmZXIoKTtcbiAgICAgIGNvbnN0IGNoZWNrcG9pbnQgPSBidWZmZXIuY3JlYXRlQ2hlY2twb2ludCgpO1xuXG4gICAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBvYmopIHtcblxuICAgICAgICB0aGlzLnNldFRleHRJblJhbmdlKGJ1ZmZlciwgY2hhbmdlLCBjdXJyZW50Q29sdW1uT2Zmc2V0LCBpZHggPT09IG9iai5sZW5ndGggLSAxLCB0ZXh0RWRpdG9yKTtcbiAgICAgICAgY3VycmVudENvbHVtbk9mZnNldCArPSB0cmFuc2xhdGVDb2x1bW5CeTtcblxuICAgICAgICBpZHgrKztcbiAgICAgIH1cblxuICAgICAgYnVmZmVyLmdyb3VwQ2hhbmdlc1NpbmNlQ2hlY2twb2ludChjaGVja3BvaW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldFRleHRJblJhbmdlKGJ1ZmZlciwgY2hhbmdlLCBvZmZzZXQsIG1vdmVDdXJzb3IsIHRleHRFZGl0b3IpIHtcblxuICAgIGNoYW5nZS5zdGFydCArPSBvZmZzZXQ7XG4gICAgY2hhbmdlLmVuZCArPSBvZmZzZXQ7XG4gICAgY29uc3QgcG9zaXRpb24gPSBidWZmZXIucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleChjaGFuZ2Uuc3RhcnQpO1xuICAgIGxlbmd0aCA9IGNoYW5nZS5lbmQgLSBjaGFuZ2Uuc3RhcnQ7XG4gICAgY29uc3QgZW5kID0gcG9zaXRpb24udHJhbnNsYXRlKG5ldyBQb2ludCgwLCBsZW5ndGgpKTtcbiAgICBjb25zdCByYW5nZSA9IG5ldyBSYW5nZShwb3NpdGlvbiwgZW5kKTtcbiAgICBidWZmZXIuc2V0VGV4dEluUmFuZ2UocmFuZ2UsIGNoYW5nZS50ZXh0KTtcblxuICAgIGlmICghbW92ZUN1cnNvcikge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY3Vyc29yID0gdGV4dEVkaXRvci5nZXRMYXN0Q3Vyc29yKCk7XG5cbiAgICBjdXJzb3IgJiYgY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICBkaXNwb3NlQWxsKHRoaXMuZGlzcG9zYWJsZXMpO1xuXG4gICAgdGhpcy5yZW5hbWVWaWV3ICYmIHRoaXMucmVuYW1lVmlldy5kZXN0cm95KCk7XG4gICAgdGhpcy5yZW5hbWVWaWV3ID0gbnVsbDtcblxuICAgIHRoaXMucmVuYW1lUGFuZWwgJiYgdGhpcy5yZW5hbWVQYW5lbC5kZXN0cm95KCk7XG4gICAgdGhpcy5yZW5hbWVQYW5lbCA9IG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFJlbmFtZSgpO1xuIl19