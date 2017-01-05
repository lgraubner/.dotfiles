(function() {
  var Helpers, Range, child_process, minimatch, path,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Range = require('atom').Range;

  path = require('path');

  child_process = require('child_process');

  minimatch = require('minimatch');

  Helpers = module.exports = {
    messageKey: function(message) {
      return (message.text || message.html) + '$' + message.type + '$' + (message["class"] || '') + '$' + (message.name || '') + '$' + message.filePath + '$' + (message.range ? message.range.start.column + ':' + message.range.start.row + ':' + message.range.end.column + ':' + message.range.end.row : '');
    },
    error: function(e) {
      return atom.notifications.addError(e.toString(), {
        detail: e.stack || '',
        dismissable: true
      });
    },
    shouldTriggerLinter: function(linter, onChange, scopes) {
      if (onChange && !linter.lintOnFly) {
        return false;
      }
      if (!scopes.some(function(entry) {
        return indexOf.call(linter.grammarScopes, entry) >= 0;
      })) {
        return false;
      }
      return true;
    },
    requestUpdateFrame: function(callback) {
      return setTimeout(callback, 100);
    },
    debounce: function(callback, delay) {
      var timeout;
      timeout = null;
      return function(arg) {
        clearTimeout(timeout);
        return timeout = setTimeout((function(_this) {
          return function() {
            return callback.call(_this, arg);
          };
        })(this), delay);
      };
    },
    isPathIgnored: function(filePath) {
      var i, j, len, projectPath, ref, repo;
      repo = null;
      ref = atom.project.getPaths();
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        projectPath = ref[i];
        if (filePath.indexOf(projectPath + path.sep) === 0) {
          repo = atom.project.getRepositories()[i];
          break;
        }
      }
      if (repo && repo.isProjectAtRoot() && repo.isPathIgnored(filePath)) {
        return true;
      }
      return minimatch(filePath, atom.config.get('linter.ignoreMatchedFiles'));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9oZWxwZXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsOENBQUE7SUFBQTs7RUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSOztFQUNWLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxlQUFSOztFQUNoQixTQUFBLEdBQVksT0FBQSxDQUFRLFdBQVI7O0VBRVosT0FBQSxHQUFVLE1BQU0sQ0FBQyxPQUFQLEdBQ1I7SUFBQSxVQUFBLEVBQVksU0FBQyxPQUFEO2FBQ1YsQ0FBQyxPQUFPLENBQUMsSUFBUixJQUFnQixPQUFPLENBQUMsSUFBekIsQ0FBQSxHQUFpQyxHQUFqQyxHQUF1QyxPQUFPLENBQUMsSUFBL0MsR0FBc0QsR0FBdEQsR0FBNEQsQ0FBQyxPQUFPLEVBQUMsS0FBRCxFQUFQLElBQWlCLEVBQWxCLENBQTVELEdBQW9GLEdBQXBGLEdBQTBGLENBQUMsT0FBTyxDQUFDLElBQVIsSUFBZ0IsRUFBakIsQ0FBMUYsR0FBaUgsR0FBakgsR0FBdUgsT0FBTyxDQUFDLFFBQS9ILEdBQTBJLEdBQTFJLEdBQWdKLENBQUksT0FBTyxDQUFDLEtBQVgsR0FBc0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBcEIsR0FBNkIsR0FBN0IsR0FBbUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBdkQsR0FBNkQsR0FBN0QsR0FBbUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBckYsR0FBOEYsR0FBOUYsR0FBb0csT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBNUksR0FBcUosRUFBdEo7SUFEdEksQ0FBWjtJQUVBLEtBQUEsRUFBTyxTQUFDLENBQUQ7YUFDTCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLENBQUMsQ0FBQyxRQUFGLENBQUEsQ0FBNUIsRUFBMEM7UUFBQyxNQUFBLEVBQVEsQ0FBQyxDQUFDLEtBQUYsSUFBVyxFQUFwQjtRQUF3QixXQUFBLEVBQWEsSUFBckM7T0FBMUM7SUFESyxDQUZQO0lBSUEsbUJBQUEsRUFBcUIsU0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixNQUFuQjtNQUluQixJQUFnQixRQUFBLElBQWEsQ0FBSSxNQUFNLENBQUMsU0FBeEM7QUFBQSxlQUFPLE1BQVA7O01BQ0EsSUFBQSxDQUFvQixNQUFNLENBQUMsSUFBUCxDQUFZLFNBQUMsS0FBRDtlQUFXLGFBQVMsTUFBTSxDQUFDLGFBQWhCLEVBQUEsS0FBQTtNQUFYLENBQVosQ0FBcEI7QUFBQSxlQUFPLE1BQVA7O0FBQ0EsYUFBTztJQU5ZLENBSnJCO0lBV0Esa0JBQUEsRUFBb0IsU0FBQyxRQUFEO2FBQ2xCLFVBQUEsQ0FBVyxRQUFYLEVBQXFCLEdBQXJCO0lBRGtCLENBWHBCO0lBYUEsUUFBQSxFQUFVLFNBQUMsUUFBRCxFQUFXLEtBQVg7QUFDUixVQUFBO01BQUEsT0FBQSxHQUFVO0FBQ1YsYUFBTyxTQUFDLEdBQUQ7UUFDTCxZQUFBLENBQWEsT0FBYjtlQUNBLE9BQUEsR0FBVSxVQUFBLENBQVcsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDbkIsUUFBUSxDQUFDLElBQVQsQ0FBYyxLQUFkLEVBQW9CLEdBQXBCO1VBRG1CO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYLEVBRVIsS0FGUTtNQUZMO0lBRkMsQ0FiVjtJQW9CQSxhQUFBLEVBQWUsU0FBQyxRQUFEO0FBQ2IsVUFBQTtNQUFBLElBQUEsR0FBTztBQUNQO0FBQUEsV0FBQSw2Q0FBQTs7UUFDRSxJQUFHLFFBQVEsQ0FBQyxPQUFULENBQWlCLFdBQUEsR0FBYyxJQUFJLENBQUMsR0FBcEMsQ0FBQSxLQUE0QyxDQUEvQztVQUNFLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWIsQ0FBQSxDQUErQixDQUFBLENBQUE7QUFDdEMsZ0JBRkY7O0FBREY7TUFJQSxJQUFlLElBQUEsSUFBUyxJQUFJLENBQUMsZUFBTCxDQUFBLENBQVQsSUFBb0MsSUFBSSxDQUFDLGFBQUwsQ0FBbUIsUUFBbkIsQ0FBbkQ7QUFBQSxlQUFPLEtBQVA7O0FBQ0EsYUFBTyxTQUFBLENBQVUsUUFBVixFQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkJBQWhCLENBQXBCO0lBUE0sQ0FwQmY7O0FBTkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7UmFuZ2V9ID0gcmVxdWlyZSgnYXRvbScpXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbmNoaWxkX3Byb2Nlc3MgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJylcbm1pbmltYXRjaCA9IHJlcXVpcmUoJ21pbmltYXRjaCcpXG5cbkhlbHBlcnMgPSBtb2R1bGUuZXhwb3J0cyA9XG4gIG1lc3NhZ2VLZXk6IChtZXNzYWdlKSAtPlxuICAgIChtZXNzYWdlLnRleHQgb3IgbWVzc2FnZS5odG1sKSArICckJyArIG1lc3NhZ2UudHlwZSArICckJyArIChtZXNzYWdlLmNsYXNzIG9yICcnKSArICckJyArIChtZXNzYWdlLm5hbWUgb3IgJycpICsgJyQnICsgbWVzc2FnZS5maWxlUGF0aCArICckJyArIChpZiBtZXNzYWdlLnJhbmdlIHRoZW4gbWVzc2FnZS5yYW5nZS5zdGFydC5jb2x1bW4gKyAnOicgKyBtZXNzYWdlLnJhbmdlLnN0YXJ0LnJvdyArICc6JyArIG1lc3NhZ2UucmFuZ2UuZW5kLmNvbHVtbiArICc6JyArIG1lc3NhZ2UucmFuZ2UuZW5kLnJvdyBlbHNlICcnKVxuICBlcnJvcjogKGUpIC0+XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGUudG9TdHJpbmcoKSwge2RldGFpbDogZS5zdGFjayBvciAnJywgZGlzbWlzc2FibGU6IHRydWV9KVxuICBzaG91bGRUcmlnZ2VyTGludGVyOiAobGludGVyLCBvbkNoYW5nZSwgc2NvcGVzKSAtPlxuICAgICMgVHJpZ2dlciBsaW50LW9uLUZseSBsaW50ZXJzIG9uIGJvdGggZXZlbnRzIGJ1dCBvbi1zYXZlIGxpbnRlcnMgb25seSBvbiBzYXZlXG4gICAgIyBCZWNhdXNlIHdlIHdhbnQgdG8gdHJpZ2dlciBvbkZseSBsaW50ZXJzIG9uIHNhdmUgd2hlbiB0aGVcbiAgICAjIHVzZXIgaGFzIGRpc2FibGVkIGxpbnRPbkZseSBmcm9tIGNvbmZpZ1xuICAgIHJldHVybiBmYWxzZSBpZiBvbkNoYW5nZSBhbmQgbm90IGxpbnRlci5saW50T25GbHlcbiAgICByZXR1cm4gZmFsc2UgdW5sZXNzIHNjb3Blcy5zb21lIChlbnRyeSkgLT4gZW50cnkgaW4gbGludGVyLmdyYW1tYXJTY29wZXNcbiAgICByZXR1cm4gdHJ1ZVxuICByZXF1ZXN0VXBkYXRlRnJhbWU6IChjYWxsYmFjaykgLT5cbiAgICBzZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDApXG4gIGRlYm91bmNlOiAoY2FsbGJhY2ssIGRlbGF5KSAtPlxuICAgIHRpbWVvdXQgPSBudWxsXG4gICAgcmV0dXJuIChhcmcpIC0+XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dClcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgYXJnKVxuICAgICAgLCBkZWxheSlcbiAgaXNQYXRoSWdub3JlZDogKGZpbGVQYXRoKSAtPlxuICAgIHJlcG8gPSBudWxsXG4gICAgZm9yIHByb2plY3RQYXRoLCBpIGluIGF0b20ucHJvamVjdC5nZXRQYXRocygpXG4gICAgICBpZiBmaWxlUGF0aC5pbmRleE9mKHByb2plY3RQYXRoICsgcGF0aC5zZXApIGlzIDBcbiAgICAgICAgcmVwbyA9IGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKVtpXVxuICAgICAgICBicmVha1xuICAgIHJldHVybiB0cnVlIGlmIHJlcG8gYW5kIHJlcG8uaXNQcm9qZWN0QXRSb290KCkgYW5kIHJlcG8uaXNQYXRoSWdub3JlZChmaWxlUGF0aClcbiAgICByZXR1cm4gbWluaW1hdGNoKGZpbGVQYXRoLCBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci5pZ25vcmVNYXRjaGVkRmlsZXMnKSlcbiJdfQ==
