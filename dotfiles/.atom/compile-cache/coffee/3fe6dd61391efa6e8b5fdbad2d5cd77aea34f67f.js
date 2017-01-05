(function() {
  var Commands, CompositeDisposable, EditorLinter, EditorRegistry, Emitter, Helpers, IndieRegistry, Linter, LinterRegistry, LinterViews, MessageRegistry, Path, ref;

  Path = require('path');

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter;

  LinterViews = require('./linter-views');

  MessageRegistry = require('./message-registry');

  EditorRegistry = require('./editor-registry');

  EditorLinter = require('./editor-linter');

  LinterRegistry = require('./linter-registry');

  IndieRegistry = require('./indie-registry');

  Helpers = require('./helpers');

  Commands = require('./commands');

  Linter = (function() {
    function Linter(state) {
      var base;
      this.state = state;
      if ((base = this.state).scope == null) {
        base.scope = 'File';
      }
      this.lintOnFly = true;
      this.emitter = new Emitter;
      this.linters = new LinterRegistry;
      this.indieLinters = new IndieRegistry();
      this.editors = new EditorRegistry;
      this.messages = new MessageRegistry();
      this.views = new LinterViews(this.state.scope, this.editors);
      this.commands = new Commands(this);
      this.subscriptions = new CompositeDisposable(this.views, this.editors, this.linters, this.messages, this.commands, this.indieLinters);
      this.indieLinters.observe((function(_this) {
        return function(indieLinter) {
          return indieLinter.onDidDestroy(function() {
            return _this.messages.deleteMessages(indieLinter);
          });
        };
      })(this));
      this.indieLinters.onDidUpdateMessages((function(_this) {
        return function(arg) {
          var linter, messages;
          linter = arg.linter, messages = arg.messages;
          return _this.messages.set({
            linter: linter,
            messages: messages
          });
        };
      })(this));
      this.linters.onDidUpdateMessages((function(_this) {
        return function(arg) {
          var editor, linter, messages;
          linter = arg.linter, messages = arg.messages, editor = arg.editor;
          return _this.messages.set({
            linter: linter,
            messages: messages,
            editorLinter: _this.editors.ofTextEditor(editor)
          });
        };
      })(this));
      this.messages.onDidUpdateMessages((function(_this) {
        return function(messages) {
          return _this.views.render(messages);
        };
      })(this));
      this.views.onDidUpdateScope((function(_this) {
        return function(scope) {
          return _this.state.scope = scope;
        };
      })(this));
      this.subscriptions.add(atom.config.observe('linter.lintOnFly', (function(_this) {
        return function(value) {
          return _this.lintOnFly = value;
        };
      })(this)));
      this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.commands.lint();
        };
      })(this)));
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.createEditorLinter(editor);
        };
      })(this)));
    }

    Linter.prototype.addLinter = function(linter) {
      return this.linters.addLinter(linter);
    };

    Linter.prototype.deleteLinter = function(linter) {
      if (!this.hasLinter(linter)) {
        return;
      }
      this.linters.deleteLinter(linter);
      return this.deleteMessages(linter);
    };

    Linter.prototype.hasLinter = function(linter) {
      return this.linters.hasLinter(linter);
    };

    Linter.prototype.getLinters = function() {
      return this.linters.getLinters();
    };

    Linter.prototype.setMessages = function(linter, messages) {
      return this.messages.set({
        linter: linter,
        messages: messages
      });
    };

    Linter.prototype.deleteMessages = function(linter) {
      return this.messages.deleteMessages(linter);
    };

    Linter.prototype.getMessages = function() {
      return this.messages.publicMessages;
    };

    Linter.prototype.onDidUpdateMessages = function(callback) {
      return this.messages.onDidUpdateMessages(callback);
    };

    Linter.prototype.getActiveEditorLinter = function() {
      return this.editors.ofActiveTextEditor();
    };

    Linter.prototype.getEditorLinter = function(editor) {
      return this.editors.ofTextEditor(editor);
    };

    Linter.prototype.getEditorLinterByPath = function(path) {
      return this.editors.ofPath(path);
    };

    Linter.prototype.eachEditorLinter = function(callback) {
      return this.editors.forEach(callback);
    };

    Linter.prototype.observeEditorLinters = function(callback) {
      return this.editors.observe(callback);
    };

    Linter.prototype.createEditorLinter = function(editor) {
      var editorLinter;
      if (this.editors.has(editor)) {
        return;
      }
      editorLinter = this.editors.create(editor);
      editorLinter.onShouldUpdateBubble((function(_this) {
        return function() {
          return _this.views.renderBubble(editorLinter);
        };
      })(this));
      editorLinter.onShouldLint((function(_this) {
        return function(onChange) {
          return _this.linters.lint({
            onChange: onChange,
            editorLinter: editorLinter
          });
        };
      })(this));
      editorLinter.onDidDestroy((function(_this) {
        return function() {
          return _this.messages.deleteEditorMessages(editorLinter);
        };
      })(this));
      editorLinter.onDidCalculateLineMessages((function(_this) {
        return function() {
          _this.views.updateCounts();
          if (_this.state.scope === 'Line') {
            return _this.views.bottomPanel.refresh();
          }
        };
      })(this));
      return this.views.notifyEditorLinter(editorLinter);
    };

    Linter.prototype.deactivate = function() {
      return this.subscriptions.dispose();
    };

    return Linter;

  })();

  module.exports = Linter;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9saW50ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsTUFBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQyw2Q0FBRCxFQUFzQjs7RUFDdEIsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUjs7RUFDZCxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUjs7RUFDbEIsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVI7O0VBQ2pCLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVI7O0VBQ2YsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVI7O0VBQ2pCLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSOztFQUNoQixPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVI7O0VBQ1YsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztFQUVMO0lBRVMsZ0JBQUMsS0FBRDtBQUNYLFVBQUE7TUFEWSxJQUFDLENBQUEsUUFBRDs7WUFDTixDQUFDLFFBQVM7O01BR2hCLElBQUMsQ0FBQSxTQUFELEdBQWE7TUFHYixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUk7TUFDZixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUk7TUFDZixJQUFDLENBQUEsWUFBRCxHQUFvQixJQUFBLGFBQUEsQ0FBQTtNQUNwQixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUk7TUFDZixJQUFDLENBQUEsUUFBRCxHQUFnQixJQUFBLGVBQUEsQ0FBQTtNQUNoQixJQUFDLENBQUEsS0FBRCxHQUFhLElBQUEsV0FBQSxDQUFZLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBbkIsRUFBMEIsSUFBQyxDQUFBLE9BQTNCO01BQ2IsSUFBQyxDQUFBLFFBQUQsR0FBZ0IsSUFB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cEIsVUFBQSxHQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtJQURVOzs7Ozs7RUFHZCxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQTVHakIiLCJzb3VyY2VzQ29udGVudCI6WyJQYXRoID0gcmVxdWlyZSAncGF0aCdcbntDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyfSA9IHJlcXVpcmUgJ2F0b20nXG5MaW50ZXJWaWV3cyA9IHJlcXVpcmUgJy4vbGludGVyLXZpZXdzJ1xuTWVzc2FnZVJlZ2lzdHJ5ID0gcmVxdWlyZSAnLi9tZXNzYWdlLXJlZ2lzdHJ5J1xuRWRpdG9yUmVnaXN0cnkgPSByZXF1aXJlICcuL2VkaXRvci1yZWdpc3RyeSdcbkVkaXRvckxpbnRlciA9IHJlcXVpcmUgJy4vZWRpdG9yLWxpbnRlcidcbkxpbnRlclJlZ2lzdHJ5ID0gcmVxdWlyZSAnLi9saW50ZXItcmVnaXN0cnknXG5JbmRpZVJlZ2lzdHJ5ID0gcmVxdWlyZSAnLi9pbmRpZS1yZWdpc3RyeSdcbkhlbHBlcnMgPSByZXF1aXJlICcuL2hlbHBlcnMnXG5Db21tYW5kcyA9IHJlcXVpcmUgJy4vY29tbWFuZHMnXG5cbmNsYXNzIExpbnRlclxuICAjIFN0YXRlIGlzIGFuIG9iamVjdCBieSBkZWZhdWx0OyBuZXZlciBudWxsIG9yIHVuZGVmaW5lZFxuICBjb25zdHJ1Y3RvcjogKEBzdGF0ZSkgIC0+XG4gICAgQHN0YXRlLnNjb3BlID89ICdGaWxlJ1xuXG4gICAgIyBQdWJsaWMgU3R1ZmZcbiAgICBAbGludE9uRmx5ID0gdHJ1ZSAjIEEgZGVmYXVsdCBhcnQgdmFsdWUsIHRvIGJlIGltbWVkaWF0ZWx5IHJlcGxhY2VkIGJ5IHRoZSBvYnNlcnZlIGNvbmZpZyBiZWxvd1xuXG4gICAgIyBQcml2YXRlIFN0dWZmXG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlclxuICAgIEBsaW50ZXJzID0gbmV3IExpbnRlclJlZ2lzdHJ5XG4gICAgQGluZGllTGludGVycyA9IG5ldyBJbmRpZVJlZ2lzdHJ5KClcbiAgICBAZWRpdG9ycyA9IG5ldyBFZGl0b3JSZWdpc3RyeVxuICAgIEBtZXNzYWdlcyA9IG5ldyBNZXNzYWdlUmVnaXN0cnkoKVxuICAgIEB2aWV3cyA9IG5ldyBMaW50ZXJWaWV3cyhAc3RhdGUuc2NvcGUsIEBlZGl0b3JzKVxuICAgIEBjb21tYW5kcyA9IG5ldyBDb21tYW5kcyh0aGlzKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShAdmlld3MsIEBlZGl0b3JzLCBAbGludGVycywgQG1lc3NhZ2VzLCBAY29tbWFuZHMsIEBpbmRpZUxpbnRlcnMpXG5cbiAgICBAaW5kaWVMaW50ZXJzLm9ic2VydmUgKGluZGllTGludGVyKSA9PlxuICAgICAgaW5kaWVMaW50ZXIub25EaWREZXN0cm95ID0+XG4gICAgICAgIEBtZXNzYWdlcy5kZWxldGVNZXNzYWdlcyhpbmRpZUxpbnRlcilcbiAgICBAaW5kaWVMaW50ZXJzLm9uRGlkVXBkYXRlTWVzc2FnZXMgKHtsaW50ZXIsIG1lc3NhZ2VzfSkgPT5cbiAgICAgIEBtZXNzYWdlcy5zZXQoe2xpbnRlciwgbWVzc2FnZXN9KVxuICAgIEBsaW50ZXJzLm9uRGlkVXBkYXRlTWVzc2FnZXMgKHtsaW50ZXIsIG1lc3NhZ2VzLCBlZGl0b3J9KSA9PlxuICAgICAgQG1lc3NhZ2VzLnNldCh7bGludGVyLCBtZXNzYWdlcywgZWRpdG9yTGludGVyOiBAZWRpdG9ycy5vZlRleHRFZGl0b3IoZWRpdG9yKX0pXG4gICAgQG1lc3NhZ2VzLm9uRGlkVXBkYXRlTWVzc2FnZXMgKG1lc3NhZ2VzKSA9PlxuICAgICAgQHZpZXdzLnJlbmRlcihtZXNzYWdlcylcbiAgICBAdmlld3Mub25EaWRVcGRhdGVTY29wZSAoc2NvcGUpID0+XG4gICAgICBAc3RhdGUuc2NvcGUgPSBzY29wZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ2xpbnRlci5saW50T25GbHknLCAodmFsdWUpID0+XG4gICAgICBAbGludE9uRmx5ID0gdmFsdWVcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHMgPT5cbiAgICAgIEBjb21tYW5kcy5saW50KClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgPT4gQGNyZWF0ZUVkaXRvckxpbnRlcihlZGl0b3IpXG5cbiAgYWRkTGludGVyOiAobGludGVyKSAtPlxuICAgIEBsaW50ZXJzLmFkZExpbnRlcihsaW50ZXIpXG5cbiAgZGVsZXRlTGludGVyOiAobGludGVyKSAtPlxuICAgIHJldHVybiB1bmxlc3MgQGhhc0xpbnRlcihsaW50ZXIpXG4gICAgQGxpbnRlcnMuZGVsZXRlTGludGVyKGxpbnRlcilcbiAgICBAZGVsZXRlTWVzc2FnZXMobGludGVyKVxuXG4gIGhhc0xpbnRlcjogKGxpbnRlcikgLT5cbiAgICBAbGludGVycy5oYXNMaW50ZXIobGludGVyKVxuXG4gIGdldExpbnRlcnM6IC0+XG4gICAgQGxpbnRlcnMuZ2V0TGludGVycygpXG5cbiAgc2V0TWVzc2FnZXM6IChsaW50ZXIsIG1lc3NhZ2VzKSAtPlxuICAgIEBtZXNzYWdlcy5zZXQoe2xpbnRlciwgbWVzc2FnZXN9KVxuXG4gIGRlbGV0ZU1lc3NhZ2VzOiAobGludGVyKSAtPlxuICAgIEBtZXNzYWdlcy5kZWxldGVNZXNzYWdlcyhsaW50ZXIpXG5cbiAgZ2V0TWVzc2FnZXM6IC0+XG4gICAgQG1lc3NhZ2VzLnB1YmxpY01lc3NhZ2VzXG5cbiAgb25EaWRVcGRhdGVNZXNzYWdlczogKGNhbGxiYWNrKSAtPlxuICAgIEBtZXNzYWdlcy5vbkRpZFVwZGF0ZU1lc3NhZ2VzKGNhbGxiYWNrKVxuXG4gIGdldEFjdGl2ZUVkaXRvckxpbnRlcjogLT5cbiAgICBAZWRpdG9ycy5vZkFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gIGdldEVkaXRvckxpbnRlcjogKGVkaXRvcikgLT5cbiAgICBAZWRpdG9ycy5vZlRleHRFZGl0b3IoZWRpdG9yKVxuXG4gIGdldEVkaXRvckxpbnRlckJ5UGF0aDogKHBhdGgpIC0+XG4gICAgQGVkaXRvcnMub2ZQYXRoKHBhdGgpXG5cbiAgZWFjaEVkaXRvckxpbnRlcjogKGNhbGxiYWNrKSAtPlxuICAgIEBlZGl0b3JzLmZvckVhY2goY2FsbGJhY2spXG5cbiAgb2JzZXJ2ZUVkaXRvckxpbnRlcnM6IChjYWxsYmFjaykgLT5cbiAgICBAZWRpdG9ycy5vYnNlcnZlKGNhbGxiYWNrKVxuXG4gIGNyZWF0ZUVkaXRvckxpbnRlcjogKGVkaXRvcikgLT5cbiAgICByZXR1cm4gaWYgQGVkaXRvcnMuaGFzKGVkaXRvcilcblxuICAgIGVkaXRvckxpbnRlciA9IEBlZGl0b3JzLmNyZWF0ZShlZGl0b3IpXG4gICAgZWRpdG9yTGludGVyLm9uU2hvdWxkVXBkYXRlQnViYmxlID0+XG4gICAgICBAdmlld3MucmVuZGVyQnViYmxlKGVkaXRvckxpbnRlcilcbiAgICBlZGl0b3JMaW50ZXIub25TaG91bGRMaW50IChvbkNoYW5nZSkgPT5cbiAgICAgIEBsaW50ZXJzLmxpbnQoe29uQ2hhbmdlLCBlZGl0b3JMaW50ZXJ9KVxuICAgIGVkaXRvckxpbnRlci5vbkRpZERlc3Ryb3kgPT5cbiAgICAgIEBtZXNzYWdlcy5kZWxldGVFZGl0b3JNZXNzYWdlcyhlZGl0b3JMaW50ZXIpXG4gICAgZWRpdG9yTGludGVyLm9uRGlkQ2FsY3VsYXRlTGluZU1lc3NhZ2VzID0+XG4gICAgICBAdmlld3MudXBkYXRlQ291bnRzKClcbiAgICAgIEB2aWV3cy5ib3R0b21QYW5lbC5yZWZyZXNoKCkgaWYgQHN0YXRlLnNjb3BlIGlzICdMaW5lJ1xuICAgIEB2aWV3cy5ub3RpZnlFZGl0b3JMaW50ZXIoZWRpdG9yTGludGVyKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cbm1vZHVsZS5leHBvcnRzID0gTGludGVyXG4iXX0=
