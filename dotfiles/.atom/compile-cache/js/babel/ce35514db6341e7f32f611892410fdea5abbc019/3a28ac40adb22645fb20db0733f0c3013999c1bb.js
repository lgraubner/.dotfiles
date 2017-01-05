Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var EditorLinter = require('./editor-linter');

var EditorRegistry = (function () {
  function EditorRegistry() {
    _classCallCheck(this, EditorRegistry);

    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();
    this.editorLinters = new Map();

    this.subscriptions.add(this.emitter);
  }

  _createClass(EditorRegistry, [{
    key: 'create',
    value: function create(textEditor) {
      var _this = this;

      var editorLinter = new EditorLinter(textEditor);
      this.editorLinters.set(textEditor, editorLinter);
      this.emitter.emit('observe', editorLinter);
      editorLinter.onDidDestroy(function () {
        return _this.editorLinters['delete'](textEditor);
      });
      this.subscriptions.add(editorLinter);
      return editorLinter;
    }
  }, {
    key: 'has',
    value: function has(textEditor) {
      return this.editorLinters.has(textEditor);
    }
  }, {
    key: 'forEach',
    value: function forEach(textEditor) {
      this.editorLinters.forEach(textEditor);
    }
  }, {
    key: 'ofPath',
    value: function ofPath(path) {
      for (var editorLinter of this.editorLinters) {
        if (editorLinter[0].getPath() === path) {
          return editorLinter[1];
        }
      }
    }
  }, {
    key: 'ofTextEditor',
    value: function ofTextEditor(textEditor) {
      return this.editorLinters.get(textEditor);
    }
  }, {
    key: 'ofActiveTextEditor',
    value: function ofActiveTextEditor() {
      return this.ofTextEditor(atom.workspace.getActiveTextEditor());
    }
  }, {
    key: 'observe',
    value: function observe(callback) {
      this.forEach(callback);
      return this.emitter.on('observe', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.editorLinters.clear();
    }
  }]);

  return EditorRegistry;
})();

exports['default'] = EditorRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvZWRpdG9yLXJlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUUyQyxNQUFNOztBQUZqRCxXQUFXLENBQUE7O0FBR1gsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUE7O0lBRTFCLGNBQWM7QUFDdEIsV0FEUSxjQUFjLEdBQ25COzBCQURLLGNBQWM7O0FBRS9CLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTs7QUFFOUIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQ3JDOztlQVBrQixjQUFjOztXQVMzQixnQkFBQyxVQUFVLEVBQUU7OztBQUNqQixVQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUNqRCxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUE7QUFDaEQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFBO0FBQzFDLGtCQUFZLENBQUMsWUFBWSxDQUFDO2VBQ3hCLE1BQUssYUFBYSxVQUFPLENBQUMsVUFBVSxDQUFDO09BQUEsQ0FDdEMsQ0FBQTtBQUNELFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ3BDLGFBQU8sWUFBWSxDQUFBO0tBQ3BCOzs7V0FFRSxhQUFDLFVBQVUsRUFBRTtBQUNkLGFBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7S0FDMUM7OztXQUVNLGlCQUFDLFVBQVUsRUFBRTtBQUNsQixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtLQUN2Qzs7O1dBRUssZ0JBQUMsSUFBSSxFQUFFO0FBQ1gsV0FBSyxJQUFJLFlBQVksSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQzNDLFlBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLElBQUksRUFBRTtBQUN0QyxpQkFBTyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDdkI7T0FDRjtLQUNGOzs7V0FFVyxzQkFBQyxVQUFVLEVBQUU7QUFDdkIsYUFBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtLQUMxQzs7O1dBRWlCLDhCQUFHO0FBQ25CLGFBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQTtLQUMvRDs7O1dBRU0saUJBQUMsUUFBUSxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDdEIsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDNUM7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQzNCOzs7U0FwRGtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvZWRpdG9yLXJlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuY29uc3QgRWRpdG9yTGludGVyID0gcmVxdWlyZSgnLi9lZGl0b3ItbGludGVyJylcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdG9yUmVnaXN0cnkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuZWRpdG9yTGludGVycyA9IG5ldyBNYXAoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gIH1cblxuICBjcmVhdGUodGV4dEVkaXRvcikge1xuICAgIGNvbnN0IGVkaXRvckxpbnRlciA9IG5ldyBFZGl0b3JMaW50ZXIodGV4dEVkaXRvcilcbiAgICB0aGlzLmVkaXRvckxpbnRlcnMuc2V0KHRleHRFZGl0b3IsIGVkaXRvckxpbnRlcilcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnb2JzZXJ2ZScsIGVkaXRvckxpbnRlcilcbiAgICBlZGl0b3JMaW50ZXIub25EaWREZXN0cm95KCgpID0+XG4gICAgICB0aGlzLmVkaXRvckxpbnRlcnMuZGVsZXRlKHRleHRFZGl0b3IpXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yTGludGVyKVxuICAgIHJldHVybiBlZGl0b3JMaW50ZXJcbiAgfVxuXG4gIGhhcyh0ZXh0RWRpdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yTGludGVycy5oYXModGV4dEVkaXRvcilcbiAgfVxuXG4gIGZvckVhY2godGV4dEVkaXRvcikge1xuICAgIHRoaXMuZWRpdG9yTGludGVycy5mb3JFYWNoKHRleHRFZGl0b3IpXG4gIH1cblxuICBvZlBhdGgocGF0aCkge1xuICAgIGZvciAobGV0IGVkaXRvckxpbnRlciBvZiB0aGlzLmVkaXRvckxpbnRlcnMpIHtcbiAgICAgIGlmIChlZGl0b3JMaW50ZXJbMF0uZ2V0UGF0aCgpID09PSBwYXRoKSB7XG4gICAgICAgIHJldHVybiBlZGl0b3JMaW50ZXJbMV1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvZlRleHRFZGl0b3IodGV4dEVkaXRvcikge1xuICAgIHJldHVybiB0aGlzLmVkaXRvckxpbnRlcnMuZ2V0KHRleHRFZGl0b3IpXG4gIH1cblxuICBvZkFjdGl2ZVRleHRFZGl0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMub2ZUZXh0RWRpdG9yKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSlcbiAgfVxuXG4gIG9ic2VydmUoY2FsbGJhY2spIHtcbiAgICB0aGlzLmZvckVhY2goY2FsbGJhY2spXG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignb2JzZXJ2ZScsIGNhbGxiYWNrKVxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5lZGl0b3JMaW50ZXJzLmNsZWFyKClcbiAgfVxufVxuIl19