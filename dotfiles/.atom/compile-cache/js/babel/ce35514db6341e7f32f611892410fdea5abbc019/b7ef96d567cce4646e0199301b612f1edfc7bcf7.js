var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var Validate = require('./validate');
var Helpers = require('./helpers');

var MessageRegistry = (function () {
  function MessageRegistry() {
    var _this = this;

    _classCallCheck(this, MessageRegistry);

    this.hasChanged = false;
    this.shouldRefresh = true;
    this.publicMessages = [];
    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();
    this.linterResponses = new Map();
    this.messages = new Map();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter.ignoredMessageTypes', function (value) {
      return _this.ignoredMessageTypes = value || [];
    }));

    var UpdateMessages = function UpdateMessages() {
      if (_this.shouldRefresh) {
        if (_this.hasChanged) {
          _this.hasChanged = false;
          _this.updatePublic();
        }
        Helpers.requestUpdateFrame(UpdateMessages);
      }
    };
    Helpers.requestUpdateFrame(UpdateMessages);
  }

  _createClass(MessageRegistry, [{
    key: 'set',
    value: function set(_ref) {
      var _this2 = this;

      var linter = _ref.linter;
      var messages = _ref.messages;
      var editorLinter = _ref.editorLinter;

      if (linter.deactivated) {
        return;
      }
      try {
        Validate.messages(messages, linter);
      } catch (e) {
        return Helpers.error(e);
      }
      messages = messages.filter(function (i) {
        return _this2.ignoredMessageTypes.indexOf(i.type) === -1;
      });
      if (linter.scope === 'file') {
        if (!editorLinter) {
          throw new Error('Given editor is not really an editor');
        }
        if (!editorLinter.editor.isAlive()) {
          return;
        }
        if (!this.messages.has(editorLinter)) {
          this.messages.set(editorLinter, new Map());
        }
        this.messages.get(editorLinter).set(linter, messages);
      } else {
        // It's project
        this.linterResponses.set(linter, messages);
      }
      this.hasChanged = true;
    }
  }, {
    key: 'updatePublic',
    value: function updatePublic() {
      var latestMessages = [];
      var publicMessages = [];
      var added = [];
      var removed = [];
      var currentKeys = undefined;
      var lastKeys = undefined;

      this.linterResponses.forEach(function (messages) {
        return latestMessages = latestMessages.concat(messages);
      });
      this.messages.forEach(function (bufferMessages) {
        return bufferMessages.forEach(function (messages) {
          return latestMessages = latestMessages.concat(messages);
        });
      });

      currentKeys = latestMessages.map(function (i) {
        return i.key;
      });
      lastKeys = this.publicMessages.map(function (i) {
        return i.key;
      });

      for (var i of latestMessages) {
        if (lastKeys.indexOf(i.key) === -1) {
          added.push(i);
          publicMessages.push(i);
        }
      }

      for (var i of this.publicMessages) {
        if (currentKeys.indexOf(i.key) === -1) {
          removed.push(i);
        } else publicMessages.push(i);
      }this.publicMessages = publicMessages;
      this.emitter.emit('did-update-messages', { added: added, removed: removed, messages: publicMessages });
    }
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'deleteMessages',
    value: function deleteMessages(linter) {
      if (linter.scope === 'file') {
        this.messages.forEach(function (r) {
          return r['delete'](linter);
        });
        this.hasChanged = true;
      } else if (this.linterResponses.has(linter)) {
        this.linterResponses['delete'](linter);
        this.hasChanged = true;
      }
    }
  }, {
    key: 'deleteEditorMessages',
    value: function deleteEditorMessages(editorLinter) {
      if (this.messages.has(editorLinter)) {
        this.messages['delete'](editorLinter);
        this.hasChanged = true;
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.shouldRefresh = false;
      this.subscriptions.dispose();
      this.linterResponses.clear();
      this.messages.clear();
    }
  }]);

  return MessageRegistry;
})();

module.exports = MessageRegistry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbWVzc2FnZS1yZWdpc3RyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUMyQyxNQUFNOztBQURqRCxXQUFXLENBQUE7O0FBR1gsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ3RDLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTs7SUFFOUIsZUFBZTtBQUNSLFdBRFAsZUFBZSxHQUNMOzs7MEJBRFYsZUFBZTs7QUFFakIsUUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUE7QUFDdkIsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7QUFDekIsUUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUE7QUFDeEIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ2hDLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTs7QUFFekIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDRCQUE0QixFQUFFLFVBQUEsS0FBSzthQUFJLE1BQUssbUJBQW1CLEdBQUksS0FBSyxJQUFJLEVBQUUsQUFBQztLQUFBLENBQUMsQ0FBQyxDQUFBOztBQUU1SCxRQUFNLGNBQWMsR0FBRyxTQUFqQixjQUFjLEdBQVM7QUFDM0IsVUFBSSxNQUFLLGFBQWEsRUFBRTtBQUN0QixZQUFJLE1BQUssVUFBVSxFQUFFO0FBQ25CLGdCQUFLLFVBQVUs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TUFBTSxDQUFDLENBQUE7QUFDbkMsWUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7T0FDdkI7S0FDRjs7O1dBQ21CLDhCQUFDLFlBQVksRUFBRTtBQUNqQyxVQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO0FBQ25DLFlBQUksQ0FBQyxRQUFRLFVBQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUNsQyxZQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTtPQUN2QjtLQUNGOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFBO0FBQzFCLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUM1QixVQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQ3RCOzs7U0F0R0csZUFBZTs7O0FBeUdyQixNQUFNLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQSIsImZpbGUiOiIvVXNlcnMvbGFyc2dyYXVibmVyLy5kb3RmaWxlcy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL21lc3NhZ2UtcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuaW1wb3J0IHtFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuXG5jb25zdCBWYWxpZGF0ZSA9IHJlcXVpcmUoJy4vdmFsaWRhdGUnKVxuY29uc3QgSGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpXG5cbmNsYXNzIE1lc3NhZ2VSZWdpc3RyeSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaGFzQ2hhbmdlZCA9IGZhbHNlXG4gICAgdGhpcy5zaG91bGRSZWZyZXNoID0gdHJ1ZVxuICAgIHRoaXMucHVibGljTWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5saW50ZXJSZXNwb25zZXMgPSBuZXcgTWFwKClcbiAgICB0aGlzLm1lc3NhZ2VzID0gbmV3IE1hcCgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5pZ25vcmVkTWVzc2FnZVR5cGVzJywgdmFsdWUgPT4gdGhpcy5pZ25vcmVkTWVzc2FnZVR5cGVzID0gKHZhbHVlIHx8IFtdKSkpXG5cbiAgICBjb25zdCBVcGRhdGVNZXNzYWdlcyA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLnNob3VsZFJlZnJlc2gpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzQ2hhbmdlZCkge1xuICAgICAgICAgIHRoaXMuaGFzQ2hhbmdlZCA9IGZhbHNlXG4gICAgICAgICAgdGhpcy51cGRhdGVQdWJsaWMoKVxuICAgICAgICB9XG4gICAgICAgIEhlbHBlcnMucmVxdWVzdFVwZGF0ZUZyYW1lKFVwZGF0ZU1lc3NhZ2VzKVxuICAgICAgfVxuICAgIH1cbiAgICBIZWxwZXJzLnJlcXVlc3RVcGRhdGVGcmFtZShVcGRhdGVNZXNzYWdlcylcbiAgfVxuICBzZXQoe2xpbnRlciwgbWVzc2FnZXMsIGVkaXRvckxpbnRlcn0pIHtcbiAgICBpZiAobGludGVyLmRlYWN0aXZhdGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIFZhbGlkYXRlLm1lc3NhZ2VzKG1lc3NhZ2VzLCBsaW50ZXIpXG4gICAgfSBjYXRjaCAoZSkgeyByZXR1cm4gSGVscGVycy5lcnJvcihlKSB9XG4gICAgbWVzc2FnZXMgPSBtZXNzYWdlcy5maWx0ZXIoaSA9PiB0aGlzLmlnbm9yZWRNZXNzYWdlVHlwZXMuaW5kZXhPZihpLnR5cGUpID09PSAtMSlcbiAgICBpZiAobGludGVyLnNjb3BlID09PSAnZmlsZScpIHtcbiAgICAgIGlmICghZWRpdG9yTGludGVyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignR2l2ZW4gZWRpdG9yIGlzIG5vdCByZWFsbHkgYW4gZWRpdG9yJylcbiAgICAgIH1cbiAgICAgIGlmICghZWRpdG9yTGludGVyLmVkaXRvci5pc0FsaXZlKCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMubWVzc2FnZXMuaGFzKGVkaXRvckxpbnRlcikpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlcy5zZXQoZWRpdG9yTGludGVyLCBuZXcgTWFwKCkpXG4gICAgICB9XG4gICAgICB0aGlzLm1lc3NhZ2VzLmdldChlZGl0b3JMaW50ZXIpLnNldChsaW50ZXIsIG1lc3NhZ2VzKVxuICAgIH0gZWxzZSB7IC8vIEl0J3MgcHJvamVjdFxuICAgICAgdGhpcy5saW50ZXJSZXNwb25zZXMuc2V0KGxpbnRlciwgbWVzc2FnZXMpXG4gICAgfVxuICAgIHRoaXMuaGFzQ2hhbmdlZCA9IHRydWVcbiAgfVxuICB1cGRhdGVQdWJsaWMoKSB7XG4gICAgbGV0IGxhdGVzdE1lc3NhZ2VzID0gW11cbiAgICBsZXQgcHVibGljTWVzc2FnZXMgPSBbXVxuICAgIGxldCBhZGRlZCA9IFtdXG4gICAgbGV0IHJlbW92ZWQgPSBbXVxuICAgIGxldCBjdXJyZW50S2V5c1xuICAgIGxldCBsYXN0S2V5c1xuXG4gICAgdGhpcy5saW50ZXJSZXNwb25zZXMuZm9yRWFjaChtZXNzYWdlcyA9PiBsYXRlc3RNZXNzYWdlcyA9IGxhdGVzdE1lc3NhZ2VzLmNvbmNhdChtZXNzYWdlcykpXG4gICAgdGhpcy5tZXNzYWdlcy5mb3JFYWNoKGJ1ZmZlck1lc3NhZ2VzID0+XG4gICAgICBidWZmZXJNZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2VzID0+IGxhdGVzdE1lc3NhZ2VzID0gbGF0ZXN0TWVzc2FnZXMuY29uY2F0KG1lc3NhZ2VzKSlcbiAgICApXG5cbiAgICBjdXJyZW50S2V5cyA9IGxhdGVzdE1lc3NhZ2VzLm1hcChpID0+IGkua2V5KVxuICAgIGxhc3RLZXlzID0gdGhpcy5wdWJsaWNNZXNzYWdlcy5tYXAoaSA9PiBpLmtleSlcblxuICAgIGZvciAobGV0IGkgb2YgbGF0ZXN0TWVzc2FnZXMpIHtcbiAgICAgIGlmIChsYXN0S2V5cy5pbmRleE9mKGkua2V5KSA9PT0gLTEpIHtcbiAgICAgICAgYWRkZWQucHVzaChpKVxuICAgICAgICBwdWJsaWNNZXNzYWdlcy5wdXNoKGkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSBvZiB0aGlzLnB1YmxpY01lc3NhZ2VzKVxuICAgICAgaWYgKGN1cnJlbnRLZXlzLmluZGV4T2YoaS5rZXkpID09PSAtMSkge1xuICAgICAgICByZW1vdmVkLnB1c2goaSlcbiAgICAgIH0gZWxzZSBwdWJsaWNNZXNzYWdlcy5wdXNoKGkpXG5cbiAgICB0aGlzLnB1YmxpY01lc3NhZ2VzID0gcHVibGljTWVzc2FnZXNcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZS1tZXNzYWdlcycsIHthZGRlZCwgcmVtb3ZlZCwgbWVzc2FnZXM6IHB1YmxpY01lc3NhZ2VzfSlcbiAgfVxuICBvbkRpZFVwZGF0ZU1lc3NhZ2VzKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZS1tZXNzYWdlcycsIGNhbGxiYWNrKVxuICB9XG4gIGRlbGV0ZU1lc3NhZ2VzKGxpbnRlcikge1xuICAgIGlmIChsaW50ZXIuc2NvcGUgPT09ICdmaWxlJykge1xuICAgICAgdGhpcy5tZXNzYWdlcy5mb3JFYWNoKHIgPT4gci5kZWxldGUobGludGVyKSlcbiAgICAgIHRoaXMuaGFzQ2hhbmdlZCA9IHRydWVcbiAgICB9IGVsc2UgaWYodGhpcy5saW50ZXJSZXNwb25zZXMuaGFzKGxpbnRlcikpIHtcbiAgICAgIHRoaXMubGludGVyUmVzcG9uc2VzLmRlbGV0ZShsaW50ZXIpXG4gICAgICB0aGlzLmhhc0NoYW5nZWQgPSB0cnVlXG4gICAgfVxuICB9XG4gIGRlbGV0ZUVkaXRvck1lc3NhZ2VzKGVkaXRvckxpbnRlcikge1xuICAgIGlmICh0aGlzLm1lc3NhZ2VzLmhhcyhlZGl0b3JMaW50ZXIpKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzLmRlbGV0ZShlZGl0b3JMaW50ZXIpXG4gICAgICB0aGlzLmhhc0NoYW5nZWQgPSB0cnVlXG4gICAgfVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zaG91bGRSZWZyZXNoID0gZmFsc2VcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5saW50ZXJSZXNwb25zZXMuY2xlYXIoKVxuICAgIHRoaXMubWVzc2FnZXMuY2xlYXIoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZVJlZ2lzdHJ5XG4iXX0=