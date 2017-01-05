Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _messageElement = require('./message-element');

'use babel';

var Interact = require('interact.js');

var BottomPanel = (function () {
  function BottomPanel(scope) {
    var _this = this;

    _classCallCheck(this, BottomPanel);

    this.subscriptions = new _atom.CompositeDisposable();

    this.visibility = false;
    this.visibleMessages = 0;
    this.alwaysTakeMinimumSpace = atom.config.get('linter.alwaysTakeMinimumSpace');
    this.errorPanelHeight = atom.config.get('linter.errorPanelHeight');
    this.configVisibility = atom.config.get('linter.showErrorPanel');
    this.scope = scope;
    this.editorMessages = new Map();
    this.messages = new Map();

    var element = document.createElement('linter-panel'); // TODO(steelbrain): Make this a `div`
    element.tabIndex = '-1';
    this.messagesElement = document.createElement('div');
    element.appendChild(this.messagesElement);
    this.panel = atom.workspace.addBottomPanel({ item: element, visible: false, priority: 500 });
    Interact(element).resizable({ edges: { top: true } }).on('resizemove', function (event) {
      event.target.style.height = event.rect.height + 'px';
    }).on('resizeend', function (event) {
      atom.config.set('linter.errorPanelHeight', event.target.clientHeight);
    });
    element.addEventListener('keydown', function (e) {
      if (e.which === 67 && e.ctrlKey) {
        atom.clipboard.write(getSelection().toString());
      }
    });

    this.subscriptions.add(atom.config.onDidChange('linter.alwaysTakeMinimumSpace', function (_ref) {
      var newValue = _ref.newValue;

      _this.alwaysTakeMinimumSpace = newValue;
      _this.updateHeight();
    }));

    this.subscriptions.add(atom.config.onDidChange('linter.errorPanelHeight', function (_ref2) {
      var newValue = _ref2.newValue;

      _this.errorPanelHeight = newValue;
      _this.updateHeight();
    }));

    this.subscriptions.add(atom.config.onDidChange('linter.showErrorPanel', function (_ref3) {
      var newValue = _ref3.newValue;

      _this.configVisibility = newValue;
      _this.updateVisibility();
    }));

    this.subscriptions.add(atom.workspace.observeActivePaneItem(function (paneItem) {
      _this.paneVisibility = paneItem === atom.workspace.getActiveTextEditor();
      _this.updateVisibility();
    }));

    // Container for messages with no filePath
    var defaultContainer = document.createElement('div');
    this.editorMessages.set(null, defaultContainer);
    this.messagesElement.appendChild(defaultContainer);
    if (scope !== 'Project') {
      defaultContainer.setAttribute('hidden', true);
    }
  }

  _createClass(BottomPanel, [{
    key: 'setMessages',
    value: function setMessages(_ref4) {
      var _this2 = this;

      var added = _ref4.added;
      var removed = _ref4.removed;

      if (removed.length) {
        this.removeMessages(removed);
      }
      if (added.length) {
        (function () {
          var activeFile = atom.workspace.getActiveTextEditor();
          activeFile = activeFile ? activeFile.getPath() : undefined;
          added.forEach(function (message) {
            if (!_this2.editorMessages.has(message.filePath)) {
              var container = document.createElement('div');
              _this2.editorMessages.set(message.filePath, container);
              _this2.messagesElement.appendChild(container);
              if (!(_this2.scope === 'Project' || activeFile === message.filePath)) {
                container.setAttribute('hidden', true);
              }
            }
            var messageElement = _messageElement.Message.fromMessage(message);
            _this2.messages.set(message, messageElement);
            _this2.editorMessages.get(message.filePath).appendChild(messageElement);
            if (messageElement.updateVisibility(_this2.scope).visibility) {
              _this2.visibleMessages++;
            }
          });
        })();
      }

      this.editorMessages.forEach(function (child, key) {
        // Never delete the default container
        if (key !== null && !child.childNodes.length) {
          child.remove();
          _this2.editorMessages['delete'](key);
        }
      });

      this.updateVisibility();
    }
  }, {
    key: 'removeMessages',
    value: function removeMessages(messages) {
      var _this3 = this;

      messages.forEach(function (message) {
        var messageElement = _this3.messages.get(message);
        _this3.messages['delete'](message);
        messageElement.remove();
        if (messageElement.visibility) {
          _this3.visibleMessages--;
        }
      });
    }
  }, {
    key: 'refresh',
    value: function refresh(scope) {
      var _this4 = this;

      if (scope) {
        this.scope = scope;
      } else scope = this.scope;
      this.visibleMessages = 0;

      this.messages.forEach(function (messageElement) {
        if (messageElement.updateVisibility(scope).visibility && scope === 'Line') {
          _this4.visibleMessages++;
        }
      });

      if (scope === 'File') {
        (function () {
          var activeFile = atom.workspace.getActiveTextEditor();
          activeFile = activeFile ? activeFile.getPath() : undefined;
          _this4.editorMessages.forEach(function (messagesElement, filePath) {
            if (filePath === activeFile) {
              messagesElement.removeAttribute('hidden');
              _this4.visibleMessages = messagesElement.childNodes.length;
            } else messagesElement.setAttribute('hidden', true);
          });
        })();
      } else if (scope === 'Project') {
        this.visibleMessages = this.messages.size;
        this.editorMessages.forEach(function (messageElement) {
          messageElement.removeAttribute('hidden');
        });
      }

      this.updateVisibility();
    }
  }, {
    key: 'updateHeight',
    value: function updateHeight() {
      var height = this.errorPanelHeight;

      if (this.alwaysTakeMinimumSpace) {
        // Add `1px` for the top border.
        height = Math.min(this.messagesElement.clientHeight + 1, height);
      }

      this.messagesElement.parentNode.style.height = height + 'px';
    }
  }, {
    key: 'getVisibility',
    value: function getVisibility() {
      return this.visibility;
    }
  }, {
    key: 'updateVisibility',
    value: function updateVisibility() {
      this.visibility = this.configVisibility && this.paneVisibility && this.visibleMessages > 0;

      if (this.visibility) {
        this.panel.show();
        this.updateHeight();
      } else {
        this.panel.hide();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.messages.clear();
      try {
        this.panel.destroy();
      } catch (err) {
        // Atom fails weirdly sometimes when doing this
      }
    }
  }]);

  return BottomPanel;
})();

exports['default'] = BottomPanel;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvYm90dG9tLXBhbmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUdrQyxNQUFNOzs4QkFDbEIsbUJBQW1COztBQUp6QyxXQUFXLENBQUE7O0FBRVgsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBOztJQUlsQixXQUFXO0FBQ25CLFdBRFEsV0FBVyxDQUNsQixLQUFLLEVBQUU7OzswQkFEQSxXQUFXOztBQUU1QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF1QixDQUFBOztBQUU1QyxRQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQTtBQUN2QixRQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQTtBQUN4QixRQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQTtBQUM5RSxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQTtBQUNsRSxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtBQUNoRSxRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtBQUNsQixRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDL0IsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBOztBQUV6QixRQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ3RELFdBQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0FBQ3ZCLFFBQUksQ0FBQyxlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENB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LFVBQUksSUFBSSxDQUFDLHNCQUFzQixFQUFFOztBQUUvQixjQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUE7T0FDakU7O0FBRUQsVUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBTSxNQUFNLE9BQUksQ0FBQTtLQUM3RDs7O1dBQ1kseUJBQUc7QUFDZCxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUE7S0FDdkI7OztXQUNlLDRCQUFHO0FBQ2pCLFVBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUE7O0FBRTFGLFVBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUNuQixZQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ2pCLFlBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtPQUNwQixNQUFNO0FBQ0wsWUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtPQUNsQjtLQUNGOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNyQixVQUFJO0FBQ0YsWUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNyQixDQUFDLE9BQU8sR0FBRyxFQUFFOztPQUViO0tBQ0Y7OztTQXJLa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi91aS9ib3R0b20tcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5jb25zdCBJbnRlcmFjdCA9IHJlcXVpcmUoJ2ludGVyYWN0LmpzJylcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCB7TWVzc2FnZX0gZnJvbSAnLi9tZXNzYWdlLWVsZW1lbnQnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvdHRvbVBhbmVsIHtcbiAgY29uc3RydWN0b3Ioc2NvcGUpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgdGhpcy52aXNpYmlsaXR5ID0gZmFsc2VcbiAgICB0aGlzLnZpc2libGVNZXNzYWdlcyA9IDBcbiAgICB0aGlzLmFsd2F5c1Rha2VNaW5pbXVtU3BhY2UgPSBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci5hbHdheXNUYWtlTWluaW11bVNwYWNlJylcbiAgICB0aGlzLmVycm9yUGFuZWxIZWlnaHQgPSBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci5lcnJvclBhbmVsSGVpZ2h0JylcbiAgICB0aGlzLmNvbmZpZ1Zpc2liaWxpdHkgPSBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci5zaG93RXJyb3JQYW5lbCcpXG4gICAgdGhpcy5zY29wZSA9IHNjb3BlXG4gICAgdGhpcy5lZGl0b3JNZXNzYWdlcyA9IG5ldyBNYXAoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBuZXcgTWFwKClcblxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW50ZXItcGFuZWwnKSAvLyBUT0RPKHN0ZWVsYnJhaW4pOiBNYWtlIHRoaXMgYSBgZGl2YFxuICAgIGVsZW1lbnQudGFiSW5kZXggPSAnLTEnXG4gICAgdGhpcy5tZXNzYWdlc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5tZXNzYWdlc0VsZW1lbnQpXG4gICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZEJvdHRvbVBhbmVsKHtpdGVtOiBlbGVtZW50LCB2aXNpYmxlOiBmYWxzZSwgcHJpb3JpdHk6IDUwMH0pXG4gICAgSW50ZXJhY3QoZWxlbWVudCkucmVzaXphYmxlKHtlZGdlczoge3RvcDogdHJ1ZX19KVxuICAgICAgLm9uKCdyZXNpemVtb3ZlJywgZXZlbnQgPT4ge1xuICAgICAgICBldmVudC50YXJnZXQuc3R5bGUuaGVpZ2h0ID0gYCR7ZXZlbnQucmVjdC5oZWlnaHR9cHhgXG4gICAgICB9KVxuICAgICAgLm9uKCdyZXNpemVlbmQnLCBldmVudCA9PiB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLmVycm9yUGFuZWxIZWlnaHQnLCBldmVudC50YXJnZXQuY2xpZW50SGVpZ2h0KVxuICAgICAgfSlcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoZS53aGljaCA9PT0gNjcgJiYgZS5jdHJsS2V5KSB7XG4gICAgICAgIGF0b20uY2xpcGJvYXJkLndyaXRlKGdldFNlbGVjdGlvbigpLnRvU3RyaW5nKCkpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2xpbnRlci5hbHdheXNUYWtlTWluaW11bVNwYWNlJywgKHtuZXdWYWx1ZX0pID0+IHtcbiAgICAgIHRoaXMuYWx3YXlzVGFrZU1pbmltdW1TcGFjZSA9IG5ld1ZhbHVlXG4gICAgICB0aGlzLnVwZGF0ZUhlaWdodCgpXG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdsaW50ZXIuZXJyb3JQYW5lbEhlaWdodCcsICh7bmV3VmFsdWV9KSA9PiB7XG4gICAgICB0aGlzLmVycm9yUGFuZWxIZWlnaHQgPSBuZXdWYWx1ZVxuICAgICAgdGhpcy51cGRhdGVIZWlnaHQoKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnbGludGVyLnNob3dFcnJvclBhbmVsJywgKHtuZXdWYWx1ZX0pID0+IHtcbiAgICAgIHRoaXMuY29uZmlnVmlzaWJpbGl0eSA9IG5ld1ZhbHVlXG4gICAgICB0aGlzLnVwZGF0ZVZpc2liaWxpdHkoKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlQWN0aXZlUGFuZUl0ZW0ocGFuZUl0ZW0gPT4ge1xuICAgICAgdGhpcy5wYW5lVmlzaWJpbGl0eSA9IHBhbmVJdGVtID09PSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIHRoaXMudXBkYXRlVmlzaWJpbGl0eSgpXG4gICAgfSkpXG5cbiAgICAvLyBDb250YWluZXIgZm9yIG1lc3NhZ2VzIHdpdGggbm8gZmlsZVBhdGhcbiAgICBjb25zdCBkZWZhdWx0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLmVkaXRvck1lc3NhZ2VzLnNldChudWxsLCBkZWZhdWx0Q29udGFpbmVyKVxuICAgIHRoaXMubWVzc2FnZXNFbGVtZW50LmFwcGVuZENoaWxkKGRlZmF1bHRDb250YWluZXIpXG4gICAgaWYgKHNjb3BlICE9PSAnUHJvamVjdCcpIHtcbiAgICAgIGRlZmF1bHRDb250YWluZXIuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKVxuICAgIH1cbiAgfVxuICBzZXRNZXNzYWdlcyh7YWRkZWQsIHJlbW92ZWR9KSB7XG4gICAgaWYgKHJlbW92ZWQubGVuZ3RoKSB7XG4gICAgICB0aGlzLnJlbW92ZU1lc3NhZ2VzKHJlbW92ZWQpXG4gICAgfVxuICAgIGlmIChhZGRlZC5sZW5ndGgpIHtcbiAgICAgIGxldCBhY3RpdmVGaWxlID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBhY3RpdmVGaWxlID0gYWN0aXZlRmlsZSA/IGFjdGl2ZUZpbGUuZ2V0UGF0aCgpIDogdW5kZWZpbmVkXG4gICAgICBhZGRlZC5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuZWRpdG9yTWVzc2FnZXMuaGFzKG1lc3NhZ2UuZmlsZVBhdGgpKSB7XG4gICAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgICB0aGlzLmVkaXRvck1lc3NhZ2VzLnNldChtZXNzYWdlLmZpbGVQYXRoLCBjb250YWluZXIpXG4gICAgICAgICAgdGhpcy5tZXNzYWdlc0VsZW1lbnQuYXBwZW5kQ2hpbGQoY29udGFpbmVyKVxuICAgICAgICAgIGlmICghKHRoaXMuc2NvcGUgPT09ICdQcm9qZWN0JyB8fCBhY3RpdmVGaWxlID09PSBtZXNzYWdlLmZpbGVQYXRoKSkge1xuICAgICAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWVzc2FnZUVsZW1lbnQgPSBNZXNzYWdlLmZyb21NZXNzYWdlKG1lc3NhZ2UpXG4gICAgICAgIHRoaXMubWVzc2FnZXMuc2V0KG1lc3NhZ2UsIG1lc3NhZ2VFbGVtZW50KVxuICAgICAgICB0aGlzLmVkaXRvck1lc3NhZ2VzLmdldChtZXNzYWdlLmZpbGVQYXRoKS5hcHBlbmRDaGlsZChtZXNzYWdlRWxlbWVudClcbiAgICAgICAgaWYgKG1lc3NhZ2VFbGVtZW50LnVwZGF0ZVZpc2liaWxpdHkodGhpcy5zY29wZSkudmlzaWJpbGl0eSkge1xuICAgICAgICAgIHRoaXMudmlzaWJsZU1lc3NhZ2VzKytcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLmVkaXRvck1lc3NhZ2VzLmZvckVhY2goKGNoaWxkLCBrZXkpID0+IHtcbiAgICAgIC8vIE5ldmVyIGRlbGV0ZSB0aGUgZGVmYXVsdCBjb250YWluZXJcbiAgICAgIGlmIChrZXkgIT09IG51bGwgJiYgIWNoaWxkLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgIGNoaWxkLnJlbW92ZSgpXG4gICAgICAgIHRoaXMuZWRpdG9yTWVzc2FnZXMuZGVsZXRlKGtleSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy51cGRhdGVWaXNpYmlsaXR5KClcbiAgfVxuICByZW1vdmVNZXNzYWdlcyhtZXNzYWdlcykge1xuICAgIG1lc3NhZ2VzLmZvckVhY2gobWVzc2FnZSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlRWxlbWVudCA9IHRoaXMubWVzc2FnZXMuZ2V0KG1lc3NhZ2UpXG4gICAgICB0aGlzLm1lc3NhZ2VzLmRlbGV0ZShtZXNzYWdlKVxuICAgICAgbWVzc2FnZUVsZW1lbnQucmVtb3ZlKClcbiAgICAgIGlmIChtZXNzYWdlRWxlbWVudC52aXNpYmlsaXR5KSB7XG4gICAgICAgIHRoaXMudmlzaWJsZU1lc3NhZ2VzLS1cbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIHJlZnJlc2goc2NvcGUpIHtcbiAgICBpZiAoc2NvcGUpIHtcbiAgICAgIHRoaXMuc2NvcGUgPSBzY29wZVxuICAgIH0gZWxzZSBzY29wZSA9IHRoaXMuc2NvcGVcbiAgICB0aGlzLnZpc2libGVNZXNzYWdlcyA9IDBcblxuICAgIHRoaXMubWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlRWxlbWVudCA9PiB7XG4gICAgICBpZiAobWVzc2FnZUVsZW1lbnQudXBkYXRlVmlzaWJpbGl0eShzY29wZSkudmlzaWJpbGl0eSAmJiBzY29wZSA9PT0gJ0xpbmUnKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZU1lc3NhZ2VzKytcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKHNjb3BlID09PSAnRmlsZScpIHtcbiAgICAgIGxldCBhY3RpdmVGaWxlID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBhY3RpdmVGaWxlID0gYWN0aXZlRmlsZSA/IGFjdGl2ZUZpbGUuZ2V0UGF0aCgpIDogdW5kZWZpbmVkXG4gICAgICB0aGlzLmVkaXRvck1lc3NhZ2VzLmZvckVhY2goKG1lc3NhZ2VzRWxlbWVudCwgZmlsZVBhdGgpID0+IHtcbiAgICAgICAgaWYgKGZpbGVQYXRoID09PSBhY3RpdmVGaWxlKSB7XG4gICAgICAgICAgbWVzc2FnZXNFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJylcbiAgICAgICAgICB0aGlzLnZpc2libGVNZXNzYWdlcyA9IG1lc3NhZ2VzRWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aFxuICAgICAgICB9IGVsc2UgbWVzc2FnZXNFbGVtZW50LnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChzY29wZSA9PT0gJ1Byb2plY3QnKSB7XG4gICAgICB0aGlzLnZpc2libGVNZXNzYWdlcyA9IHRoaXMubWVzc2FnZXMuc2l6ZVxuICAgICAgdGhpcy5lZGl0b3JNZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2VFbGVtZW50ID0+IHtcbiAgICAgICAgbWVzc2FnZUVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVZpc2liaWxpdHkoKVxuICB9XG4gIHVwZGF0ZUhlaWdodCgpIHtcbiAgICBsZXQgaGVpZ2h0ID0gdGhpcy5lcnJvclBhbmVsSGVpZ2h0XG5cbiAgICBpZiAodGhpcy5hbHdheXNUYWtlTWluaW11bVNwYWNlKSB7XG4gICAgICAvLyBBZGQgYDFweGAgZm9yIHRoZSB0b3AgYm9yZGVyLlxuICAgICAgaGVpZ2h0ID0gTWF0aC5taW4odGhpcy5tZXNzYWdlc0VsZW1lbnQuY2xpZW50SGVpZ2h0ICsgMSwgaGVpZ2h0KVxuICAgIH1cblxuICAgIHRoaXMubWVzc2FnZXNFbGVtZW50LnBhcmVudE5vZGUuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YFxuICB9XG4gIGdldFZpc2liaWxpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMudmlzaWJpbGl0eVxuICB9XG4gIHVwZGF0ZVZpc2liaWxpdHkoKSB7XG4gICAgdGhpcy52aXNpYmlsaXR5ID0gdGhpcy5jb25maWdWaXNpYmlsaXR5ICYmIHRoaXMucGFuZVZpc2liaWxpdHkgJiYgdGhpcy52aXNpYmxlTWVzc2FnZXMgPiAwXG5cbiAgICBpZiAodGhpcy52aXNpYmlsaXR5KSB7XG4gICAgICB0aGlzLnBhbmVsLnNob3coKVxuICAgICAgdGhpcy51cGRhdGVIZWlnaHQoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhbmVsLmhpZGUoKVxuICAgIH1cbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLm1lc3NhZ2VzLmNsZWFyKClcbiAgICB0cnkge1xuICAgICAgdGhpcy5wYW5lbC5kZXN0cm95KClcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIEF0b20gZmFpbHMgd2VpcmRseSBzb21ldGltZXMgd2hlbiBkb2luZyB0aGlzXG4gICAgfVxuICB9XG59XG4iXX0=