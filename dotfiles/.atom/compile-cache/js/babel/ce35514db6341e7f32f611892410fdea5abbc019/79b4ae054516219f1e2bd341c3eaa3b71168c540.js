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

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _underscorePlus = require('underscore-plus');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _atomTernjsHelper = require('./atom-ternjs-helper');

'use babel';

var ReferenceView = require('./atom-ternjs-reference-view');

var Reference = (function () {
  function Reference() {
    _classCallCheck(this, Reference);

    this.disposables = [];
    this.references = [];

    this.referenceView = new ReferenceView();
    this.referenceView.initialize(this);

    this.referencePanel = atom.workspace.addBottomPanel({

      item: this.referenceView,
      priority: 0
    });

    this.referencePanel.hide();

    atom.views.getView(this.referencePanel).classList.add('atom-ternjs-reference-panel', 'panel-bottom');

    this.hideHandler = this.hide.bind(this);
    _atomTernjsEvents2['default'].on('reference-hide', this.hideHandler);

    this.registerCommands();
  }

  _createClass(Reference, [{
    key: 'registerCommands',
    value: function registerCommands() {

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:references', this.findReference.bind(this)));
    }
  }, {
    key: 'goToReference',
    value: function goToReference(idx) {

      var ref = this.references.refs[idx];

      (0, _atomTernjsHelper.openFileAndGoTo)(ref.start, ref.file);
    }
  }, {
    key: 'findReference',
    value: function findReference() {
      var _this = this;

      var editor = atom.workspace.getActiveTextEditor();
      var cursor = editor.getLastCursor();

      if (!_atomTernjsManager2['default'].client || !editor || !cursor) {

        return;
      }

      var position = cursor.getBufferPosition();

      _atomTernjsManager2['default'].client.update(editor).then(function (data) {
        _atomTernjsManager2['default'].client.refs(atom.project.relativizePath(editor.getURI())[1], { line: position.row, ch: position.column }).then(function (data) {

          if (!data) {

            atom.notifications.addInfo('No references found.', { dismissable: false });

            return;
          }

          _this.references = data;

          for (var reference of data.refs) {

            reference.file = reference.file.replace(/^.\//, '');
            reference.file = _path2['default'].resolve(atom.project.relativizePath(_atomTernjsManager2['default'].server.projectDir)[0], reference.file);
          }

          data.refs = (0, _underscorePlus.uniq)(data.refs, function (item) {

            return JSON.stringify(item);
          });

          data = _this.gatherMeta(data);
          _this.referenceView.buildItems(data);
          _this.referencePanel.show();
        });
      });
    }
  }, {
    key: 'gatherMeta',
    value: function gatherMeta(data) {

      for (var item of data.refs) {

        var content = _fs2['default'].readFileSync(item.file, 'utf8');
        var buffer = new _atom.TextBuffer({ text: content });

        item.position = buffer.positionForCharacterIndex(item.start);
        item.lineText = buffer.lineForRow(item.position.row);

        buffer.destroy();
      }

      return data;
    }
  }, {
    key: 'hide',
    value: function hide() {

      if (!this.referencePanel || !this.referencePanel.visible) {

        return;
      }

      this.referencePanel.hide();

      (0, _atomTernjsHelper.focusEditor)();
    }
  }, {
    key: 'show',
    value: function show() {

      this.referencePanel.show();
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      this.referenceView && this.referenceView.destroy();
      this.referenceView = null;

      this.referencePanel && this.referencePanel.destroy();
      this.referencePanel = null;
    }
  }]);

  return Reference;
})();

exports['default'] = new Reference();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1yZWZlcmVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztpQ0FJb0IsdUJBQXVCOzs7O2dDQUN2QixzQkFBc0I7Ozs7a0JBQzNCLElBQUk7Ozs7OEJBQ0EsaUJBQWlCOztvQkFDbkIsTUFBTTs7OztvQkFDRSxNQUFNOztnQ0FJeEIsc0JBQXNCOztBQWI3QixXQUFXLENBQUM7O0FBRVosSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUM7O0lBYXhELFNBQVM7QUFFRixXQUZQLFNBQVMsR0FFQzswQkFGVixTQUFTOztBQUlYLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUVyQixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7QUFDekMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXBDLFFBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7O0FBRWxELFVBQUksRUFBRSxJQUFJLENBQUMsYUFBYTtBQUN4QixjQUFRLEVBQUUsQ0FBQztLQUNaLENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUUzQixRQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSxjQUFjLENBQUMsQ0FBQzs7QUFFckcsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QyxrQ0FBUSxFQUFF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RUFBRSxNQUFNLENBQUMsQ0FBQztBQUNuRCxZQUFNLE1BQU0sR0FBRyxxQkFBZSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDOztBQUVqRCxZQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0QsWUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXJELGNBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUNsQjs7QUFFRCxhQUFPLElBQUksQ0FBQztLQUNiOzs7V0FFRyxnQkFBRzs7QUFFTCxVQUNFLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFDcEIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFDNUI7O0FBRUEsZUFBTztPQUNSOztBQUVELFVBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRTNCLDBDQUFhLENBQUM7S0FDZjs7O1dBRUcsZ0JBQUc7O0FBRUwsVUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUM1Qjs7O1dBRU0sbUJBQUc7O0FBRVIsVUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ25ELFVBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDOztBQUUxQixVQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDckQsVUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7S0FDNUI7OztTQS9IRyxTQUFTOzs7cUJBa0lBLElBQUksU0FBUyxFQUFFIiwiZmlsZSI6Ii9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1yZWZlcmVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY29uc3QgUmVmZXJlbmNlVmlldyA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtcmVmZXJlbmNlLXZpZXcnKTtcblxuaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1tYW5hZ2VyJztcbmltcG9ydCBlbWl0dGVyIGZyb20gJy4vYXRvbS10ZXJuanMtZXZlbnRzJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQge3VuaXF9IGZyb20gJ3VuZGVyc2NvcmUtcGx1cyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7VGV4dEJ1ZmZlcn0gZnJvbSAnYXRvbSc7XG5pbXBvcnQge1xuICBvcGVuRmlsZUFuZEdvVG8sXG4gIGZvY3VzRWRpdG9yXG59IGZyb20gJy4vYXRvbS10ZXJuanMtaGVscGVyJztcblxuY2xhc3MgUmVmZXJlbmNlIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcbiAgICB0aGlzLnJlZmVyZW5jZXMgPSBbXTtcblxuICAgIHRoaXMucmVmZXJlbmNlVmlldyA9IG5ldyBSZWZlcmVuY2VWaWV3KCk7XG4gICAgdGhpcy5yZWZlcmVuY2VWaWV3LmluaXRpYWxpemUodGhpcyk7XG5cbiAgICB0aGlzLnJlZmVyZW5jZVBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwoe1xuXG4gICAgICBpdGVtOiB0aGlzLnJlZmVyZW5jZVZpZXcsXG4gICAgICBwcmlvcml0eTogMFxuICAgIH0pO1xuXG4gICAgdGhpcy5yZWZlcmVuY2VQYW5lbC5oaWRlKCk7XG5cbiAgICBhdG9tLnZpZXdzLmdldFZpZXcodGhpcy5yZWZlcmVuY2VQYW5lbCkuY2xhc3NMaXN0LmFkZCgnYXRvbS10ZXJuanMtcmVmZXJlbmNlLXBhbmVsJywgJ3BhbmVsLWJvdHRvbScpO1xuXG4gICAgdGhpcy5oaWRlSGFuZGxlciA9IHRoaXMuaGlkZS5iaW5kKHRoaXMpO1xuICAgIGVtaXR0ZXIub24oJ3JlZmVyZW5jZS1oaWRlJywgdGhpcy5oaWRlSGFuZGxlcik7XG5cbiAgICB0aGlzLnJlZ2lzdGVyQ29tbWFuZHMoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29tbWFuZHMoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnYXRvbS10ZXJuanM6cmVmZXJlbmNlcycsIHRoaXMuZmluZFJlZmVyZW5jZS5iaW5kKHRoaXMpKSk7XG4gIH1cblxuICBnb1RvUmVmZXJlbmNlKGlkeCkge1xuXG4gICAgY29uc3QgcmVmID0gdGhpcy5yZWZlcmVuY2VzLnJlZnNbaWR4XTtcblxuICAgIG9wZW5GaWxlQW5kR29UbyhyZWYuc3RhcnQsIHJlZi5maWxlKTtcbiAgfVxuXG4gIGZpbmRSZWZlcmVuY2UoKSB7XG5cbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgY29uc3QgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKTtcblxuICAgIGlmIChcbiAgICAgICFtYW5hZ2VyLmNsaWVudCB8fFxuICAgICAgIWVkaXRvciB8fFxuICAgICAgIWN1cnNvclxuICAgICkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcG9zaXRpb24gPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKTtcblxuICAgIG1hbmFnZXIuY2xpZW50LnVwZGF0ZShlZGl0b3IpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIG1hbmFnZXIuY2xpZW50LnJlZnMoYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSlbMV0sIHtsaW5lOiBwb3NpdGlvbi5yb3csIGNoOiBwb3NpdGlvbi5jb2x1bW59KS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgaWYgKCFkYXRhKSB7XG5cbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnTm8gcmVmZXJlbmNlcyBmb3VuZC4nLCB7IGRpc21pc3NhYmxlOiBmYWxzZSB9KTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVmZXJlbmNlcyA9IGRhdGE7XG5cbiAgICAgICAgZm9yIChsZXQgcmVmZXJlbmNlIG9mIGRhdGEucmVmcykge1xuXG4gICAgICAgICAgcmVmZXJlbmNlLmZpbGUgPSByZWZlcmVuY2UuZmlsZS5yZXBsYWNlKC9eLlxcLy8sICcnKTtcbiAgICAgICAgICByZWZlcmVuY2UuZmlsZSA9IHBhdGgucmVzb2x2ZShhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgobWFuYWdlci5zZXJ2ZXIucHJvamVjdERpcilbMF0sIHJlZmVyZW5jZS5maWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGEucmVmcyA9IHVuaXEoZGF0YS5yZWZzLCAoaXRlbSkgPT4ge1xuXG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGl0ZW0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkYXRhID0gdGhpcy5nYXRoZXJNZXRhKGRhdGEpO1xuICAgICAgICB0aGlzLnJlZmVyZW5jZVZpZXcuYnVpbGRJdGVtcyhkYXRhKTtcbiAgICAgICAgdGhpcy5yZWZlcmVuY2VQYW5lbC5zaG93KCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGdhdGhlck1ldGEoZGF0YSkge1xuXG4gICAgZm9yIChsZXQgaXRlbSBvZiBkYXRhLnJlZnMpIHtcblxuICAgICAgY29uc3QgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhpdGVtLmZpbGUsICd1dGY4Jyk7XG4gICAgICBjb25zdCBidWZmZXIgPSBuZXcgVGV4dEJ1ZmZlcih7IHRleHQ6IGNvbnRlbnQgfSk7XG5cbiAgICAgIGl0ZW0ucG9zaXRpb24gPSBidWZmZXIucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleChpdGVtLnN0YXJ0KTtcbiAgICAgIGl0ZW0ubGluZVRleHQgPSBidWZmZXIubGluZUZvclJvdyhpdGVtLnBvc2l0aW9uLnJvdyk7XG5cbiAgICAgIGJ1ZmZlci5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBoaWRlKCkge1xuXG4gICAgaWYgKFxuICAgICAgIXRoaXMucmVmZXJlbmNlUGFuZWwgfHxcbiAgICAgICF0aGlzLnJlZmVyZW5jZVBhbmVsLnZpc2libGVcbiAgICApIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucmVmZXJlbmNlUGFuZWwuaGlkZSgpO1xuXG4gICAgZm9jdXNFZGl0b3IoKTtcbiAgfVxuXG4gIHNob3coKSB7XG5cbiAgICB0aGlzLnJlZmVyZW5jZVBhbmVsLnNob3coKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICB0aGlzLnJlZmVyZW5jZVZpZXcgJiYgdGhpcy5yZWZlcmVuY2VWaWV3LmRlc3Ryb3koKTtcbiAgICB0aGlzLnJlZmVyZW5jZVZpZXcgPSBudWxsO1xuXG4gICAgdGhpcy5yZWZlcmVuY2VQYW5lbCAmJiB0aGlzLnJlZmVyZW5jZVBhbmVsLmRlc3Ryb3koKTtcbiAgICB0aGlzLnJlZmVyZW5jZVBhbmVsID0gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgUmVmZXJlbmNlKCk7XG4iXX0=