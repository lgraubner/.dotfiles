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

var _atomTernjsHelper2 = require('././atom-ternjs-helper');

'use babel';

var DocumentationView = require('./atom-ternjs-documentation-view');

var Documentation = (function () {
  function Documentation() {
    _classCallCheck(this, Documentation);

    this.disposables = [];

    this.view = new DocumentationView();
    this.view.initialize(this);

    atom.views.getView(atom.workspace).appendChild(this.view);

    this.destroyDocumenationHandler = this.destroyOverlay.bind(this);
    _atomTernjsEvents2['default'].on('documentation-destroy-overlay', this.destroyDocumenationHandler);

    this.registerCommands();
  }

  _createClass(Documentation, [{
    key: 'registerCommands',
    value: function registerCommands() {

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:documentation', this.request.bind(this)));
    }
  }, {
    key: 'request',
    value: function request() {
      var _this = this;

      var editor = atom.workspace.getActiveTextEditor();

      if (!editor) {

        return;
      }

      var cursor = editor.getLastCursor();
      var position = cursor.getBufferPosition();

      _atomTernjsManager2['default'].client.update(editor).then(function (data) {

        _atomTernjsManager2['default'].client.documentation(atom.project.relativizePath(editor.getURI())[1], {

          line: position.row,
          ch: position.column

        }).then(function (data) {

          if (!data) {

            return;
          }

          _this.view.setData({

            doc: (0, _atomTernjsHelper2.replaceTags)(data.doc),
            origin: data.origin,
            type: (0, _atomTernjsHelper2.formatType)(data),
            url: data.url || ''
          });

          _this.show();
        });
      });
    }
  }, {
    key: 'show',
    value: function show() {

      if (!this.marker) {

        var editor = atom.workspace.getActiveTextEditor();
        var cursor = editor.getLastCursor();

        if (!editor || !cursor) {

          return;
        }

        this.marker = cursor.getMarker();

        if (!this.marker) {

          return;
        }

        this.overlayDecoration = editor.decorateMarker(this.marker, {

          type: 'overlay',
          item: this.view,
          'class': 'atom-ternjs-documentation',
          position: 'tale',
          invalidate: 'touch'
        });
      } else {

        this.marker.setProperties({

          type: 'overlay',
          item: this.view,
          'class': 'atom-ternjs-documentation',
          position: 'tale',
          invalidate: 'touch'
        });
      }
    }
  }, {
    key: 'destroyOverlay',
    value: function destroyOverlay() {

      if (this.overlayDecoration) {

        this.overlayDecoration.destroy();
      }

      this.overlayDecoration = null;
      this.marker = null;
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);

      this.destroyOverlay();

      if (this.view) {

        this.view.destroy();
        this.view = undefined;
      }
    }
  }]);

  return Documentation;
})();

exports['default'] = new Documentation();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1kb2N1bWVudGF0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7aUNBSW9CLHVCQUF1Qjs7OztnQ0FDdkIsc0JBQXNCOzs7O2dDQUNqQixzQkFBc0I7O2lDQUl4Qyx3QkFBd0I7O0FBVi9CLFdBQVcsQ0FBQzs7QUFFWixJQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDOztJQVVoRSxhQUFhO0FBRU4sV0FGUCxhQUFhLEdBRUg7MEJBRlYsYUFBYTs7QUFJZixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7QUFFdEIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUM7QUFDcEMsUUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTNCLFFBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUUxRCxRQUFJLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakUsa0NBQVEsRUFBRSxDQUFDLCtCQUErQixFQUFFLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDOztBQUU3RSxRQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztHQUN6Qjs7ZUFmRyxhQUFhOztXQWlCRCw0QkFBRzs7QUFFakIsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMs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QUksRUFBRTs7QUFFYixZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3BCLFlBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO09BQ3ZCO0tBQ0Y7OztTQTVIRyxhQUFhOzs7cUJBK0hKLElBQUksYUFBYSxFQUFFIiwiZmlsZSI6Ii9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1kb2N1bWVudGF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmNvbnN0IERvY3VtZW50YXRpb25WaWV3ID0gcmVxdWlyZSgnLi9hdG9tLXRlcm5qcy1kb2N1bWVudGF0aW9uLXZpZXcnKTtcblxuaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1tYW5hZ2VyJztcbmltcG9ydCBlbWl0dGVyIGZyb20gJy4vYXRvbS10ZXJuanMtZXZlbnRzJztcbmltcG9ydCB7ZGlzcG9zZUFsbH0gZnJvbSAnLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuaW1wb3J0IHtcbiAgcmVwbGFjZVRhZ3MsXG4gIGZvcm1hdFR5cGVcbn0gZnJvbSAnLi8uL2F0b20tdGVybmpzLWhlbHBlcic7XG5cbmNsYXNzIERvY3VtZW50YXRpb24ge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuXG4gICAgdGhpcy52aWV3ID0gbmV3IERvY3VtZW50YXRpb25WaWV3KCk7XG4gICAgdGhpcy52aWV3LmluaXRpYWxpemUodGhpcyk7XG5cbiAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLmFwcGVuZENoaWxkKHRoaXMudmlldyk7XG5cbiAgICB0aGlzLmRlc3Ryb3lEb2N1bWVuYXRpb25IYW5kbGVyID0gdGhpcy5kZXN0cm95T3ZlcmxheS5iaW5kKHRoaXMpO1xuICAgIGVtaXR0ZXIub24oJ2RvY3VtZW50YXRpb24tZGVzdHJveS1vdmVybGF5JywgdGhpcy5kZXN0cm95RG9jdW1lbmF0aW9uSGFuZGxlcik7XG5cbiAgICB0aGlzLnJlZ2lzdGVyQ29tbWFuZHMoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29tbWFuZHMoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnYXRvbS10ZXJuanM6ZG9jdW1lbnRhdGlvbicsIHRoaXMucmVxdWVzdC5iaW5kKHRoaXMpKSk7XG4gIH1cblxuICByZXF1ZXN0KCkge1xuXG4gICAgbGV0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuICAgIGlmICghZWRpdG9yKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKTtcbiAgICBsZXQgcG9zaXRpb24gPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKTtcblxuICAgIG1hbmFnZXIuY2xpZW50LnVwZGF0ZShlZGl0b3IpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgbWFuYWdlci5jbGllbnQuZG9jdW1lbnRhdGlvbihhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVsxXSwge1xuXG4gICAgICAgIGxpbmU6IHBvc2l0aW9uLnJvdyxcbiAgICAgICAgY2g6IHBvc2l0aW9uLmNvbHVtblxuXG4gICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgaWYgKCFkYXRhKSB7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnZpZXcuc2V0RGF0YSh7XG5cbiAgICAgICAgICBkb2M6IHJlcGxhY2VUYWdzKGRhdGEuZG9jKSxcbiAgICAgICAgICBvcmlnaW46IGRhdGEub3JpZ2luLFxuICAgICAgICAgIHR5cGU6IGZvcm1hdFR5cGUoZGF0YSksXG4gICAgICAgICAgdXJsOiBkYXRhLnVybCB8fCAnJ1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc2hvdygpIHtcblxuICAgIGlmICghdGhpcy5tYXJrZXIpIHtcblxuICAgICAgbGV0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICAgIGxldCBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpO1xuXG4gICAgICBpZiAoIWVkaXRvciB8fCAhY3Vyc29yKSB7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm1hcmtlciA9IGN1cnNvci5nZXRNYXJrZXIoKTtcblxuICAgICAgaWYgKCF0aGlzLm1hcmtlcikge1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vdmVybGF5RGVjb3JhdGlvbiA9IGVkaXRvci5kZWNvcmF0ZU1hcmtlcih0aGlzLm1hcmtlciwge1xuXG4gICAgICAgIHR5cGU6ICdvdmVybGF5JyxcbiAgICAgICAgaXRlbTogdGhpcy52aWV3LFxuICAgICAgICBjbGFzczogJ2F0b20tdGVybmpzLWRvY3VtZW50YXRpb24nLFxuICAgICAgICBwb3NpdGlvbjogJ3RhbGUnLFxuICAgICAgICBpbnZhbGlkYXRlOiAndG91Y2gnXG4gICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHRoaXMubWFya2VyLnNldFByb3BlcnRpZXMoe1xuXG4gICAgICAgIHR5cGU6ICdvdmVybGF5JyxcbiAgICAgICAgaXRlbTogdGhpcy52aWV3LFxuICAgICAgICBjbGFzczogJ2F0b20tdGVybmpzLWRvY3VtZW50YXRpb24nLFxuICAgICAgICBwb3NpdGlvbjogJ3RhbGUnLFxuICAgICAgICBpbnZhbGlkYXRlOiAndG91Y2gnXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBkZXN0cm95T3ZlcmxheSgpIHtcblxuICAgIGlmICh0aGlzLm92ZXJsYXlEZWNvcmF0aW9uKSB7XG5cbiAgICAgIHRoaXMub3ZlcmxheURlY29yYXRpb24uZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHRoaXMub3ZlcmxheURlY29yYXRpb24gPSBudWxsO1xuICAgIHRoaXMubWFya2VyID0gbnVsbDtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICBkaXNwb3NlQWxsKHRoaXMuZGlzcG9zYWJsZXMpO1xuXG4gICAgdGhpcy5kZXN0cm95T3ZlcmxheSgpO1xuXG4gICAgaWYgKHRoaXMudmlldykge1xuXG4gICAgICB0aGlzLnZpZXcuZGVzdHJveSgpO1xuICAgICAgdGhpcy52aWV3ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgRG9jdW1lbnRhdGlvbigpO1xuIl19