Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _uiBottomPanel = require('./ui/bottom-panel');

var _uiBottomPanel2 = _interopRequireDefault(_uiBottomPanel);

var _uiBottomContainer = require('./ui/bottom-container');

var _uiBottomContainer2 = _interopRequireDefault(_uiBottomContainer);

var _uiMessageElement = require('./ui/message-element');

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _uiMessageBubble = require('./ui/message-bubble');

'use babel';

var LinterViews = (function () {
  function LinterViews(scope, editorRegistry) {
    var _this = this;

    _classCallCheck(this, LinterViews);

    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();
    this.bottomPanel = new _uiBottomPanel2['default'](scope);
    this.bottomContainer = _uiBottomContainer2['default'].create(scope);
    this.editors = editorRegistry;
    this.bottomBar = null; // To be added when status-bar service is consumed
    this.bubble = null;

    this.subscriptions.add(this.bottomPanel);
    this.subscriptions.add(this.bottomContainer);
    this.subscriptions.add(this.emitter);

    this.count = {
      Line: 0,
      File: 0,
      Project: 0
    };
    this.messages = [];
    this.subscriptions.add(atom.config.observe('linter.showErrorInline', function (showBubble) {
      return _this.showBubble = showBubble;
    }));
    this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem(function (paneItem) {
      var isEditor = false;
      _this.editors.forEach(function (editorLinter) {
        isEditor = (editorLinter.active = editorLinter.editor === paneItem) || isEditor;
      });
      _this.updateCounts();
      _this.bottomPanel.refresh();
      _this.bottomContainer.visibility = isEditor;
    }));
    this.subscriptions.add(this.bottomContainer.onDidChangeTab(function (scope) {
      _this.emitter.emit('did-update-scope', scope);
      atom.config.set('linter.showErrorPanel', true);
      _this.bottomPanel.refresh(scope);
    }));
    this.subscriptions.add(this.bottomContainer.onShouldTogglePanel(function () {
      atom.config.set('linter.showErrorPanel', !atom.config.get('linter.showErrorPanel'));
    }));

    this._renderBubble = this.renderBubble;
    this.subscriptions.add(atom.config.observe('linter.inlineTooltipInterval', function (bubbleInterval) {
      return _this.renderBubble = _helpers2['default'].debounce(_this._renderBubble, bubbleInterval);
    }));
  }

  _createClass(LinterViews, [{
    key: 'render',
    value: function render(_ref) {
      var added = _ref.added;
      var removed = _ref.removed;
      var messages = _ref.messages;

      this.messages = messages;
      this.notifyEditorLinters({ added: added, removed: removed });
      this.bottomPanel.setMessages({ added: added, removed: removed });
      this.updateCounts();
    }
  }, {
    key: 'updateCounts',
    value: function updateCounts() {
      var activeEditorLinter = this.editors.ofActiveTextEditor();

      this.count.Project = this.messages.length;
      this.count.File = activeEditorLinter ? activeEditorLinter.getMessages().size : 0;
      this.count.Line = activeEditorLinter ? activeEditorLinter.countLineMessages : 0;
      this.bottomContainer.setCount(this.count);
    }
  }, {
    key: 'renderBubble',
    value: function renderBubble(editorLinter) {
      var _this2 = this;

      if (!this.showBubble || !editorLinter.messages.size) {
        this.removeBubble();
        return;
      }
      var point = editorLinter.editor.getCursorBufferPosition();
      if (this.bubble && editorLinter.messages.has(this.bubble.message) && this.bubble.range.containsPoint(point)) {
        return; // The marker remains the same
      }
      this.removeBubble();
      for (var message of editorLinter.messages) {
        if (message.range && message.range.containsPoint(point)) {
          var range = _atom.Range.fromObject([point, point]);
          var marker = editorLinter.editor.markBufferRange(range, { invalidate: 'inside' });
          this.bubble = { message: message, range: range, marker: marker };
          marker.onDidDestroy(function () {
            _this2.bubble = null;
          });
          editorLinter.editor.decorateMarker(marker, {
            type: 'overlay',
            item: (0, _uiMessageBubble.create)(message)
          });
          break;
        }
      }
    }
  }, {
    key: 'removeBubble',
    value: function removeBubble() {
      if (this.bubble) {
        this.bubble.marker.destroy();
        this.bubble = null;
      }
    }
  }, {
    key: 'notifyEditorLinters',
    value: function notifyEditorLinters(_ref2) {
      var _this3 = this;

      var added = _ref2.added;
      var removed = _ref2.removed;

      var editorLinter = undefined;
      removed.forEach(function (message) {
        if (message.filePath && (editorLinter = _this3.editors.ofPath(message.filePath))) {
          editorLinter.deleteMessage(message);
        }
      });
      added.forEach(function (message) {
        if (message.filePath && (editorLinter = _this3.editors.ofPath(message.filePath))) {
          editorLinter.addMessage(message);
        }
      });
      editorLinter = this.editors.ofActiveTextEditor();
      if (editorLinter) {
        editorLinter.calculateLineMessages(null);
        this.renderBubble(editorLinter);
      } else {
        this.removeBubble();
      }
    }
  }, {
    key: 'notifyEditorLinter',
    value: function notifyEditorLinter(editorLinter) {
      var path = editorLinter.editor.getPath();
      if (!path) return;
      this.messages.forEach(function (message) {
        if (message.filePath && message.filePath === path) {
          editorLinter.addMessage(message);
        }
      });
    }
  }, {
    key: 'attachBottom',
    value: function attachBottom(statusBar) {
      var _this4 = this;

      this.subscriptions.add(atom.config.observe('linter.statusIconPosition', function (position) {
        if (_this4.bottomBar) {
          _this4.bottomBar.destroy();
        }
        _this4.bottomBar = statusBar['add' + position + 'Tile']({
          item: _this4.bottomContainer,
          priority: position === 'Left' ? -100 : 100
        });
      }));
    }
  }, {
    key: 'onDidUpdateScope',
    value: function onDidUpdateScope(callback) {
      return this.emitter.on('did-update-scope', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      // No need to notify editors of this, we're being disposed means the package is
      // being deactivated. They'll be disposed automatically by the registry.
      this.subscriptions.dispose();
      if (this.bottomBar) {
        this.bottomBar.destroy();
      }
      this.removeBubble();
    }
  }]);

  return LinterViews;
})();

exports['default'] = LinterViews;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbGludGVyLXZpZXdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRWtELE1BQU07OzZCQUNoQyxtQkFBbUI7Ozs7aUNBQ2YsdUJBQXVCOzs7O2dDQUM3QixzQkFBc0I7O3VCQUN4QixXQUFXOzs7OytCQUNNLHFCQUFxQjs7QUFQMUQsV0FBVyxDQUFBOztJQVNVLFdBQVc7QUFDbkIsV0FEUSxXQUFXLENBQ2xCLEtBQUssRUFBRSxjQUFjLEVBQUU7OzswQkFEaEIsV0FBVzs7QUFFNUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFdBQVcsR0FBRywrQkFBZ0IsS0FBSyxDQUFDLENBQUE7QUFDekMsUUFBSSxDQUFDLGVBQWUsR0FBRywrQkFBZ0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ3BELFFBQUksQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFBO0FBQzdCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBOztBQUVsQixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDeEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBQzVDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTs7QUFFcEMsUUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLFVBQUksRUFBRSxDQUFDO0FBQ1AsVUFBSSxFQUFFLENBQUM7QUFDUCxhQUFPLEVBQUUsQ0FBQztLQUNYLENBQUE7QUFDRCxRQUFJLENBQUMs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SCxDQUFDLENBQUMsQ0FBQTtLQUNKOzs7V0FFZSwwQkFBQyxRQUFRLEVBQUU7QUFDekIsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNyRDs7O1dBQ00sbUJBQUc7OztBQUdSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDekI7QUFDRCxVQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7S0FDcEI7OztTQWhKa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9saW50ZXItdmlld3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGUsIFJhbmdlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IEJvdHRvbVBhbmVsIGZyb20gJy4vdWkvYm90dG9tLXBhbmVsJ1xuaW1wb3J0IEJvdHRvbUNvbnRhaW5lciBmcm9tICcuL3VpL2JvdHRvbS1jb250YWluZXInXG5pbXBvcnQge01lc3NhZ2V9IGZyb20gJy4vdWkvbWVzc2FnZS1lbGVtZW50J1xuaW1wb3J0IEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHtjcmVhdGUgYXMgY3JlYXRlQnViYmxlfSBmcm9tICcuL3VpL21lc3NhZ2UtYnViYmxlJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW50ZXJWaWV3cyB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlLCBlZGl0b3JSZWdpc3RyeSkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5ib3R0b21QYW5lbCA9IG5ldyBCb3R0b21QYW5lbChzY29wZSlcbiAgICB0aGlzLmJvdHRvbUNvbnRhaW5lciA9IEJvdHRvbUNvbnRhaW5lci5jcmVhdGUoc2NvcGUpXG4gICAgdGhpcy5lZGl0b3JzID0gZWRpdG9yUmVnaXN0cnlcbiAgICB0aGlzLmJvdHRvbUJhciA9IG51bGwgLy8gVG8gYmUgYWRkZWQgd2hlbiBzdGF0dXMtYmFyIHNlcnZpY2UgaXMgY29uc3VtZWRcbiAgICB0aGlzLmJ1YmJsZSA9IG51bGxcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5ib3R0b21QYW5lbClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuYm90dG9tQ29udGFpbmVyKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuXG4gICAgdGhpcy5jb3VudCA9IHtcbiAgICAgIExpbmU6IDAsXG4gICAgICBGaWxlOiAwLFxuICAgICAgUHJvamVjdDogMFxuICAgIH1cbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5zaG93RXJyb3JJbmxpbmUnLCBzaG93QnViYmxlID0+XG4gICAgICB0aGlzLnNob3dCdWJibGUgPSBzaG93QnViYmxlXG4gICAgKSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0ocGFuZUl0ZW0gPT4ge1xuICAgICAgbGV0IGlzRWRpdG9yID0gZmFsc2VcbiAgICAgIHRoaXMuZWRpdG9ycy5mb3JFYWNoKGZ1bmN0aW9uKGVkaXRvckxpbnRlcikge1xuICAgICAgICBpc0VkaXRvciA9IChlZGl0b3JMaW50ZXIuYWN0aXZlID0gZWRpdG9yTGludGVyLmVkaXRvciA9PT0gcGFuZUl0ZW0pIHx8IGlzRWRpdG9yXG4gICAgICB9KVxuICAgICAgdGhpcy51cGRhdGVDb3VudHMoKVxuICAgICAgdGhpcy5ib3R0b21QYW5lbC5yZWZyZXNoKClcbiAgICAgIHRoaXMuYm90dG9tQ29udGFpbmVyLnZpc2liaWxpdHkgPSBpc0VkaXRvclxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5ib3R0b21Db250YWluZXIub25EaWRDaGFuZ2VUYWIoc2NvcGUgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUtc2NvcGUnLCBzY29wZSlcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLnNob3dFcnJvclBhbmVsJywgdHJ1ZSlcbiAgICAgIHRoaXMuYm90dG9tUGFuZWwucmVmcmVzaChzY29wZSlcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuYm90dG9tQ29udGFpbmVyLm9uU2hvdWxkVG9nZ2xlUGFuZWwoZnVuY3Rpb24oKSB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci5zaG93RXJyb3JQYW5lbCcsICFhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci5zaG93RXJyb3JQYW5lbCcpKVxuICAgIH0pKVxuXG4gICAgdGhpcy5fcmVuZGVyQnViYmxlID0gdGhpcy5yZW5kZXJCdWJibGVcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5pbmxpbmVUb29sdGlwSW50ZXJ2YWwnLCBidWJibGVJbnRlcnZhbCA9PlxuICAgICAgdGhpcy5yZW5kZXJCdWJibGUgPSBIZWxwZXJzLmRlYm91bmNlKHRoaXMuX3JlbmRlckJ1YmJsZSwgYnViYmxlSW50ZXJ2YWwpXG4gICAgKSlcbiAgfVxuICByZW5kZXIoe2FkZGVkLCByZW1vdmVkLCBtZXNzYWdlc30pIHtcbiAgICB0aGlzLm1lc3NhZ2VzID0gbWVzc2FnZXNcbiAgICB0aGlzLm5vdGlmeUVkaXRvckxpbnRlcnMoe2FkZGVkLCByZW1vdmVkfSlcbiAgICB0aGlzLmJvdHRvbVBhbmVsLnNldE1lc3NhZ2VzKHthZGRlZCwgcmVtb3ZlZH0pXG4gICAgdGhpcy51cGRhdGVDb3VudHMoKVxuICB9XG4gIHVwZGF0ZUNvdW50cygpIHtcbiAgICBjb25zdCBhY3RpdmVFZGl0b3JMaW50ZXIgPSB0aGlzLmVkaXRvcnMub2ZBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgIHRoaXMuY291bnQuUHJvamVjdCA9IHRoaXMubWVzc2FnZXMubGVuZ3RoXG4gICAgdGhpcy5jb3VudC5GaWxlID0gYWN0aXZlRWRpdG9yTGludGVyID8gYWN0aXZlRWRpdG9yTGludGVyLmdldE1lc3NhZ2VzKCkuc2l6ZSA6IDBcbiAgICB0aGlzLmNvdW50LkxpbmUgPSBhY3RpdmVFZGl0b3JMaW50ZXIgPyBhY3RpdmVFZGl0b3JMaW50ZXIuY291bnRMaW5lTWVzc2FnZXMgOiAwXG4gICAgdGhpcy5ib3R0b21Db250YWluZXIuc2V0Q291bnQodGhpcy5jb3VudClcbiAgfVxuICByZW5kZXJCdWJibGUoZWRpdG9yTGludGVyKSB7XG4gICAgaWYgKCF0aGlzLnNob3dCdWJibGUgfHwgIWVkaXRvckxpbnRlci5tZXNzYWdlcy5zaXplKSB7XG4gICAgICB0aGlzLnJlbW92ZUJ1YmJsZSgpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgcG9pbnQgPSBlZGl0b3JMaW50ZXIuZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICBpZiAodGhpcy5idWJibGUgJiYgZWRpdG9yTGludGVyLm1lc3NhZ2VzLmhhcyh0aGlzLmJ1YmJsZS5tZXNzYWdlKSAmJiB0aGlzLmJ1YmJsZS5yYW5nZS5jb250YWluc1BvaW50KHBvaW50KSkge1xuICAgICAgcmV0dXJuIC8vIFRoZSBtYXJrZXIgcmVtYWlucyB0aGUgc2FtZVxuICAgIH1cbiAgICB0aGlzLnJlbW92ZUJ1YmJsZSgpXG4gICAgZm9yIChsZXQgbWVzc2FnZSBvZiBlZGl0b3JMaW50ZXIubWVzc2FnZXMpIHtcbiAgICAgIGlmIChtZXNzYWdlLnJhbmdlICYmIG1lc3NhZ2UucmFuZ2UuY29udGFpbnNQb2ludChwb2ludCkpIHtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtwb2ludCwgcG9pbnRdKVxuICAgICAgICBjb25zdCBtYXJrZXIgPSBlZGl0b3JMaW50ZXIuZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShyYW5nZSwge2ludmFsaWRhdGU6ICdpbnNpZGUnfSlcbiAgICAgICAgdGhpcy5idWJibGUgPSB7bWVzc2FnZSwgcmFuZ2UsIG1hcmtlcn1cbiAgICAgICAgbWFya2VyLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5idWJibGUgPSBudWxsXG4gICAgICAgIH0pXG4gICAgICAgIGVkaXRvckxpbnRlci5lZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7XG4gICAgICAgICAgdHlwZTogJ292ZXJsYXknLFxuICAgICAgICAgIGl0ZW06IGNyZWF0ZUJ1YmJsZShtZXNzYWdlKVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZW1vdmVCdWJibGUoKSB7XG4gICAgaWYgKHRoaXMuYnViYmxlKSB7XG4gICAgICB0aGlzLmJ1YmJsZS5tYXJrZXIuZGVzdHJveSgpXG4gICAgICB0aGlzLmJ1YmJsZSA9IG51bGxcbiAgICB9XG4gIH1cbiAgbm90aWZ5RWRpdG9yTGludGVycyh7YWRkZWQsIHJlbW92ZWR9KSB7XG4gICAgbGV0IGVkaXRvckxpbnRlclxuICAgIHJlbW92ZWQuZm9yRWFjaChtZXNzYWdlID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLmZpbGVQYXRoICYmIChlZGl0b3JMaW50ZXIgPSB0aGlzLmVkaXRvcnMub2ZQYXRoKG1lc3NhZ2UuZmlsZVBhdGgpKSkge1xuICAgICAgICBlZGl0b3JMaW50ZXIuZGVsZXRlTWVzc2FnZShtZXNzYWdlKVxuICAgICAgfVxuICAgIH0pXG4gICAgYWRkZWQuZm9yRWFjaChtZXNzYWdlID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLmZpbGVQYXRoICYmIChlZGl0b3JMaW50ZXIgPSB0aGlzLmVkaXRvcnMub2ZQYXRoKG1lc3NhZ2UuZmlsZVBhdGgpKSkge1xuICAgICAgICBlZGl0b3JMaW50ZXIuYWRkTWVzc2FnZShtZXNzYWdlKVxuICAgICAgfVxuICAgIH0pXG4gICAgZWRpdG9yTGludGVyID0gdGhpcy5lZGl0b3JzLm9mQWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgKGVkaXRvckxpbnRlcikge1xuICAgICAgZWRpdG9yTGludGVyLmNhbGN1bGF0ZUxpbmVNZXNzYWdlcyhudWxsKVxuICAgICAgdGhpcy5yZW5kZXJCdWJibGUoZWRpdG9yTGludGVyKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbW92ZUJ1YmJsZSgpXG4gICAgfVxuICB9XG4gIG5vdGlmeUVkaXRvckxpbnRlcihlZGl0b3JMaW50ZXIpIHtcbiAgICBjb25zdCBwYXRoID0gZWRpdG9yTGludGVyLmVkaXRvci5nZXRQYXRoKClcbiAgICBpZiAoIXBhdGgpIHJldHVyblxuICAgIHRoaXMubWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICBpZiAobWVzc2FnZS5maWxlUGF0aCAmJiBtZXNzYWdlLmZpbGVQYXRoID09PSBwYXRoKSB7XG4gICAgICAgIGVkaXRvckxpbnRlci5hZGRNZXNzYWdlKG1lc3NhZ2UpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBhdHRhY2hCb3R0b20oc3RhdHVzQmFyKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuc3RhdHVzSWNvblBvc2l0aW9uJywgcG9zaXRpb24gPT4ge1xuICAgICAgaWYgKHRoaXMuYm90dG9tQmFyKSB7XG4gICAgICAgIHRoaXMuYm90dG9tQmFyLmRlc3Ryb3koKVxuICAgICAgfVxuICAgICAgdGhpcy5ib3R0b21CYXIgPSBzdGF0dXNCYXJbYGFkZCR7cG9zaXRpb259VGlsZWBdKHtcbiAgICAgICAgaXRlbTogdGhpcy5ib3R0b21Db250YWluZXIsXG4gICAgICAgIHByaW9yaXR5OiBwb3NpdGlvbiA9PT0gJ0xlZnQnID8gLTEwMCA6IDEwMFxuICAgICAgfSlcbiAgICB9KSlcbiAgfVxuXG4gIG9uRGlkVXBkYXRlU2NvcGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlLXNjb3BlJywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICAvLyBObyBuZWVkIHRvIG5vdGlmeSBlZGl0b3JzIG9mIHRoaXMsIHdlJ3JlIGJlaW5nIGRpc3Bvc2VkIG1lYW5zIHRoZSBwYWNrYWdlIGlzXG4gICAgLy8gYmVpbmcgZGVhY3RpdmF0ZWQuIFRoZXknbGwgYmUgZGlzcG9zZWQgYXV0b21hdGljYWxseSBieSB0aGUgcmVnaXN0cnkuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIGlmICh0aGlzLmJvdHRvbUJhcikge1xuICAgICAgdGhpcy5ib3R0b21CYXIuZGVzdHJveSgpXG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQnViYmxlKClcbiAgfVxufVxuIl19