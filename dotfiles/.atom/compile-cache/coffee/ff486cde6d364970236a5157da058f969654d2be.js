(function() {
  var Commands, CompositeDisposable,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  CompositeDisposable = require('atom').CompositeDisposable;

  Commands = (function() {
    function Commands(linter) {
      this.linter = linter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'linter:next-error': (function(_this) {
          return function() {
            return _this.nextError();
          };
        })(this),
        'linter:previous-error': (function(_this) {
          return function() {
            return _this.previousError();
          };
        })(this),
        'linter:toggle': (function(_this) {
          return function() {
            return _this.toggleLinter();
          };
        })(this),
        'linter:togglePanel': (function(_this) {
          return function() {
            return _this.togglePanel();
          };
        })(this),
        'linter:set-bubble-transparent': (function(_this) {
          return function() {
            return _this.setBubbleTransparent();
          };
        })(this),
        'linter:expand-multiline-messages': (function(_this) {
          return function() {
            return _this.expandMultilineMessages();
          };
        })(this),
        'linter:lint': (function(_this) {
          return function() {
            return _this.lint();
          };
        })(this)
      }));
      this.index = null;
    }

    Commands.prototype.togglePanel = function() {
      return atom.config.set('linter.showErrorPanel', !atom.config.get('linter.showErrorPanel'));
    };

    Commands.prototype.toggleLinter = function() {
      var activeEditor, editorLinter;
      activeEditor = atom.workspace.getActiveTextEditor();
      if (!activeEditor) {
        return;
      }
      editorLinter = this.linter.getEditorLinter(activeEditor);
      if (editorLinter) {
        return editorLinter.dispose();
      } else {
        this.linter.createEditorLinter(activeEditor);
        return this.lint();
      }
    };

    Commands.prototype.setBubbleTransparent = function() {
      var bubble;
      bubble = document.getElementById('linter-inline');
      if (bubble) {
        bubble.classList.add('transparent');
        document.addEventListener('keyup', this.setBubbleOpaque);
        return window.addEventListener('blur', this.setBubbleOpaque);
      }
    };

    Commands.prototype.setBubbleOpaque = function() {
      var bubble;
      bubble = document.getElementById('linter-inline');
      if (bubble) {
        bubble.classList.remove('transparent');
      }
      document.removeEventListener('keyup', this.setBubbleOpaque);
      return window.removeEventListener('blur', this.setBubbleOpaque);
    };

    Commands.prototype.expandMultilineMessages = function() {
      var elem, i, len, ref;
      ref = document.getElementsByTagName('linter-multiline-message');
      for (i = 0, len = ref.length; i < len; i++) {
        elem = ref[i];
        elem.classList.add('expanded');
      }
      document.addEventListener('keyup', this.collapseMultilineMessages);
      return window.addEventListener('blur', this.collapseMultilineMessages);
    };

    Commands.prototype.collapseMultilineMessages = function() {
      var elem, i, len, ref;
      ref = document.getElementsByTagName('linter-multiline-message');
      for (i = 0, len = ref.length; i < len; i++) {
        elem = ref[i];
        elem.classList.remove('expanded');
      }
      document.removeEventListener('keyup', this.collapseMultilineMessages);
      return window.removeEventListener('blur', this.collapseMultilineMessages);
    };

    Commands.prototype.lint = function() {
      var error, ref;
      try {
        return (ref = this.linter.getActiveEditorLinter()) != null ? ref.lint(false) : void 0;
      } catch (error1) {
        error = error1;
        return atom.notifications.addError(error.message, {
          detail: error.stack,
          dismissable: true
        });
      }
    };

    Commands.prototype.getMessage = function(index) {
      var messages;
      messages = this.linter.views.messages;
      return messages[modulo(index, messages.length)];
    };

    Commands.prototype.nextError = function() {
      var message;
      if (this.index != null) {
        this.index++;
      } else {
        this.index = 0;
      }
      message = this.getMessage(this.index);
      if (!(message != null ? message.filePath : void 0)) {
        return;
      }
      if (!(message != null ? message.range : void 0)) {
        return;
      }
      return atom.workspace.open(message.filePath).then(function() {
        return atom.workspace.getActiveTextEditor().setCursorBufferPosition(message.range.start);
      });
    };

    Commands.prototype.previousError = function() {
      var message;
      if (this.index != null) {
        this.index--;
      } else {
        this.index = 0;
      }
      message = this.getMessage(this.index);
      if (!(message != null ? message.filePath : void 0)) {
        return;
      }
      if (!(message != null ? message.range : void 0)) {
        return;
      }
      return atom.workspace.open(message.filePath).then(function() {
        return atom.workspace.getActiveTextEditor().setCursorBufferPosition(message.range.start);
      });
    };

    Commands.prototype.dispose = function() {
      this.messages = null;
      return this.subscriptions.dispose();
    };

    return Commands;

  })();

  module.exports = Commands;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9jb21tYW5kcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDZCQUFBO0lBQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUVsQjtJQUNTLGtCQUFDLE1BQUQ7TUFBQyxJQUFDLENBQUEsU0FBRDtNQUNaLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDakI7UUFBQSxtQkFBQSxFQUFxQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxTQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckI7UUFDQSx1QkFBQSxFQUF5QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxhQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEekI7UUFFQSxlQUFBLEVBQWlCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFlBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZqQjtRQUdBLG9CQUFBLEVBQXNCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFdBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUh0QjtRQUlBLCtCQUFBLEVBQWlDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLG9CQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKakM7UUFLQSxrQ0FB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cUMsQ0FBQyxJQUF0QyxDQUEyQyxTQUFBO2VBQ3pDLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFvQyxDQUFDLHVCQUFyQyxDQUE2RCxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQTNFO01BRHlDLENBQTNDO0lBUmE7O3VCQVdmLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBQyxDQUFBLFFBQUQsR0FBWTthQUNaLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO0lBRk87Ozs7OztFQUlYLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBaEdqQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbmNsYXNzIENvbW1hbmRzXG4gIGNvbnN0cnVjdG9yOiAoQGxpbnRlcikgLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsXG4gICAgICAnbGludGVyOm5leHQtZXJyb3InOiA9PiBAbmV4dEVycm9yKClcbiAgICAgICdsaW50ZXI6cHJldmlvdXMtZXJyb3InOiA9PiBAcHJldmlvdXNFcnJvcigpXG4gICAgICAnbGludGVyOnRvZ2dsZSc6ID0+IEB0b2dnbGVMaW50ZXIoKVxuICAgICAgJ2xpbnRlcjp0b2dnbGVQYW5lbCc6ID0+IEB0b2dnbGVQYW5lbCgpXG4gICAgICAnbGludGVyOnNldC1idWJibGUtdHJhbnNwYXJlbnQnOiA9PiBAc2V0QnViYmxlVHJhbnNwYXJlbnQoKVxuICAgICAgJ2xpbnRlcjpleHBhbmQtbXVsdGlsaW5lLW1lc3NhZ2VzJzogPT4gQGV4cGFuZE11bHRpbGluZU1lc3NhZ2VzKClcbiAgICAgICdsaW50ZXI6bGludCc6ID0+IEBsaW50KClcblxuICAgICMgRGVmYXVsdCB2YWx1ZXNcbiAgICBAaW5kZXggPSBudWxsXG5cbiAgdG9nZ2xlUGFuZWw6IC0+XG4gICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXIuc2hvd0Vycm9yUGFuZWwnLCBub3QgYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIuc2hvd0Vycm9yUGFuZWwnKSlcblxuICB0b2dnbGVMaW50ZXI6IC0+XG4gICAgYWN0aXZlRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgcmV0dXJuIHVubGVzcyBhY3RpdmVFZGl0b3JcbiAgICBlZGl0b3JMaW50ZXIgPSBAbGludGVyLmdldEVkaXRvckxpbnRlcihhY3RpdmVFZGl0b3IpXG4gICAgaWYgZWRpdG9yTGludGVyXG4gICAgICBlZGl0b3JMaW50ZXIuZGlzcG9zZSgpXG4gICAgZWxzZVxuICAgICAgQGxpbnRlci5jcmVhdGVFZGl0b3JMaW50ZXIoYWN0aXZlRWRpdG9yKVxuICAgICAgQGxpbnQoKVxuXG5cbiAgc2V0QnViYmxlVHJhbnNwYXJlbnQ6IC0+XG4gICAgYnViYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbnRlci1pbmxpbmUnKVxuICAgIGlmIGJ1YmJsZVxuICAgICAgYnViYmxlLmNsYXNzTGlzdC5hZGQgJ3RyYW5zcGFyZW50J1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAna2V5dXAnLCBAc2V0QnViYmxlT3BhcXVlXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAnYmx1cicsIEBzZXRCdWJibGVPcGFxdWVcblxuICBzZXRCdWJibGVPcGFxdWU6IC0+XG4gICAgYnViYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbnRlci1pbmxpbmUnKVxuICAgIGlmIGJ1YmJsZVxuICAgICAgYnViYmxlLmNsYXNzTGlzdC5yZW1vdmUgJ3RyYW5zcGFyZW50J1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIgJ2tleXVwJywgQHNldEJ1YmJsZU9wYXF1ZVxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyICdibHVyJywgQHNldEJ1YmJsZU9wYXF1ZVxuXG4gIGV4cGFuZE11bHRpbGluZU1lc3NhZ2VzOiAtPlxuICAgIGZvciBlbGVtIGluIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lICdsaW50ZXItbXVsdGlsaW5lLW1lc3NhZ2UnXG4gICAgICBlbGVtLmNsYXNzTGlzdC5hZGQgJ2V4cGFuZGVkJ1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgJ2tleXVwJywgQGNvbGxhcHNlTXVsdGlsaW5lTWVzc2FnZXNcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAnYmx1cicsIEBjb2xsYXBzZU11bHRpbGluZU1lc3NhZ2VzXG5cbiAgY29sbGFwc2VNdWx0aWxpbmVNZXNzYWdlczogLT5cbiAgICBmb3IgZWxlbSBpbiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSAnbGludGVyLW11bHRpbGluZS1tZXNzYWdlJ1xuICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlICdleHBhbmRlZCdcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyICdrZXl1cCcsIEBjb2xsYXBzZU11bHRpbGluZU1lc3NhZ2VzXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIgJ2JsdXInLCBAY29sbGFwc2VNdWx0aWxpbmVNZXNzYWdlc1xuXG4gIGxpbnQ6IC0+XG4gICAgdHJ5XG4gICAgICBAbGludGVyLmdldEFjdGl2ZUVkaXRvckxpbnRlcigpPy5saW50KGZhbHNlKVxuICAgIGNhdGNoIGVycm9yXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgZXJyb3IubWVzc2FnZSwge2RldGFpbDogZXJyb3Iuc3RhY2ssIGRpc21pc3NhYmxlOiB0cnVlfVxuXG4gIGdldE1lc3NhZ2U6IChpbmRleCkgLT5cbiAgICBtZXNzYWdlcyA9IEBsaW50ZXIudmlld3MubWVzc2FnZXNcbiAgICAjIFVzZSB0aGUgZGl2aWRlbmQgaW5kZXBlbmRlbnQgbW9kdWxvIHNvIHRoYXQgdGhlIGluZGV4IHN0YXlzIGluc2lkZSB0aGVcbiAgICAjIGFycmF5J3MgYm91bmRzLCBldmVuIHdoZW4gbmVnYXRpdmUuXG4gICAgIyBUaGF0IHdheSB0aGUgaW5kZXggY2FuIGJlICsrIGFuIC0tIHdpdGhvdXQgY2FyaW5nIGFib3V0IHRoZSBhcnJheSBib3VuZHMuXG4gICAgbWVzc2FnZXNbaW5kZXggJSUgbWVzc2FnZXMubGVuZ3RoXVxuXG4gIG5leHRFcnJvcjogLT5cbiAgICBpZiBAaW5kZXg/XG4gICAgICBAaW5kZXgrK1xuICAgIGVsc2VcbiAgICAgIEBpbmRleCA9IDBcbiAgICBtZXNzYWdlID0gQGdldE1lc3NhZ2UoQGluZGV4KVxuICAgIHJldHVybiB1bmxlc3MgbWVzc2FnZT8uZmlsZVBhdGhcbiAgICByZXR1cm4gdW5sZXNzIG1lc3NhZ2U/LnJhbmdlXG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbihtZXNzYWdlLmZpbGVQYXRoKS50aGVuIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24obWVzc2FnZS5yYW5nZS5zdGFydClcblxuICBwcmV2aW91c0Vycm9yOiAtPlxuICAgIGlmIEBpbmRleD9cbiAgICAgIEBpbmRleC0tXG4gICAgZWxzZVxuICAgICAgQGluZGV4ID0gMFxuICAgIG1lc3NhZ2UgPSBAZ2V0TWVzc2FnZShAaW5kZXgpXG4gICAgcmV0dXJuIHVubGVzcyBtZXNzYWdlPy5maWxlUGF0aFxuICAgIHJldHVybiB1bmxlc3MgbWVzc2FnZT8ucmFuZ2VcbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKG1lc3NhZ2UuZmlsZVBhdGgpLnRoZW4gLT5cbiAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihtZXNzYWdlLnJhbmdlLnN0YXJ0KVxuXG4gIGRpc3Bvc2U6IC0+XG4gICAgQG1lc3NhZ2VzID0gbnVsbFxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1hbmRzXG4iXX0=
