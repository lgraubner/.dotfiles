(function() {
  var exec, fs, path;

  exec = require('child_process');

  fs = require('fs');

  path = require('path');

  module.exports = {
    executablePath: 'php',
    selector: '.source.php',
    disableForSelector: '.source.php .comment',
    inclusionPriority: 1,
    excludeLowerPriority: true,
    loadCompletions: function() {
      this.completions = {};
      fs.readFile(path.resolve(__dirname, '..', 'completions.json'), (function(_this) {
        return function(error, content) {
          if (error == null) {
            _this.completions = JSON.parse(content);
          }
        };
      })(this));
      this.funtions = {};
      return fs.readFile(path.resolve(__dirname, '..', 'functions.json'), (function(_this) {
        return function(error, content) {
          if (error == null) {
            _this.funtions = JSON.parse(content);
          }
        };
      })(this));
    },
    execute: function(arg, force) {
      var editor, phpEx, proc;
      editor = arg.editor;
      if (force == null) {
        force = false;
      }
      if (!force) {
        if ((this.userVars != null) && this.lastPath === editor.getPath()) {
          return;
        }
      }
      this.compileData = '';
      phpEx = 'get_user_all.php';
      proc = exec.spawn(this.executablePath, [__dirname + '/php/' + phpEx]);
      proc.stdin.write(editor.getText());
      proc.stdin.end();
      proc.stdout.on('data', (function(_this) {
        return function(data) {
          return _this.compileData = _this.compileData + data;
        };
      })(this));
      proc.stderr.on('data', function(data) {
        return console.log('err: ' + data);
      });
      return proc.on('close', (function(_this) {
        return function(code) {
          var error;
          try {
            _this.userSuggestions = JSON.parse(_this.compileData);
          } catch (error1) {
            error = error1;
          }
          return _this.lastPath = editor.getPath();
        };
      })(this));
    },
    getSuggestions: function(request) {
      return new Promise((function(_this) {
        return function(resolve) {
          var typeEx;
          typeEx = true;
          if (_this.notShowAutocomplete(request)) {
            return resolve([]);
          } else if (_this.isAll(request)) {
            _this.execute(request, typeEx);
            return resolve(_this.getAllCompletions(request));
          } else if (_this.isVariable(request)) {
            _this.execute(request, typeEx);
            return resolve(_this.getVarsCompletions(request));
          } else if (_this.isFunCon(request)) {
            _this.execute(request, typeEx);
            return resolve(_this.getCompletions(request));
          } else {
            return resolve([]);
          }
        };
      })(this));
    },
    onDidInsertSuggestion: function(arg) {
      var editor, suggestion, triggerPosition;
      editor = arg.editor, triggerPosition = arg.triggerPosition, suggestion = arg.suggestion;
    },
    dispose: function() {},
    notShowAutocomplete: function(request) {
      var scopes;
      if (request.prefix === '') {
        return true;
      }
      scopes = request.scopeDescriptor.getScopesArray();
      if (scopes.indexOf('keyword.operator.assignment.php') !== -1 || scopes.indexOf('keyword.operator.comparison.php') !== -1 || scopes.indexOf('keyword.operator.logical.php') !== -1 || scopes.indexOf('string.quoted.double.php') !== -1 || scopes.indexOf('string.quoted.single.php') !== -1) {
        return true;
      }
      if (this.isInString(request) && this.isFunCon(request)) {
        return true;
      }
    },
    isInString: function(arg) {
      var scopeDescriptor, scopes;
      scopeDescriptor = arg.scopeDescriptor;
      scopes = scopeDescriptor.getScopesArray();
      if (scopes.indexOf('string.quoted.single.php') !== -1 || scopes.indexOf('string.quoted.double.php') !== -1) {
        return true;
      }
    },
    isAll: function(arg) {
      var scopeDescriptor, scopes;
      scopeDescriptor = arg.scopeDescriptor;
      scopes = scopeDescriptor.getScopesArray();
      if (scopes.length === 3 || scopes.indexOf('meta.array.php') !== -1) {
        return true;
      }
    },
    isVariable: function(arg) {
      var scopeDescriptor, scopes;
      scopeDescriptor = arg.scopeDescriptor;
      scopes = scopeDescriptor.getScopesArray();
      if (scopes.indexOf('variable.other.php') !== -1) {
        return true;
      }
    },
    isFunCon: function(arg) {
      var scopeDescriptor, scopes;
      scopeDescriptor = arg.scopeDescriptor;
      scopes = scopeDescriptor.getScopesArray();
      if (scopes.indexOf('constant.other.php') !== -1 || scopes.indexOf('keyword.control.php') !== -1 || scopes.indexOf('storage.type.php') !== -1 || scopes.indexOf('support.function.construct.php')) {
        return true;
      }
    },
    getAllCompletions: function(arg) {
      var completions, constants, editor, func, i, j, k, keyword, l, len, len1, len2, len3, len4, len5, lowerCasePrefix, m, n, prefix, ref, ref1, ref2, ref3, ref4, ref5, userFunc, userVar, variable;
      editor = arg.editor, prefix = arg.prefix;
      completions = [];
      lowerCasePrefix = prefix.toLowerCase();
      if (this.userSuggestions != null) {
        ref = this.userSuggestions.user_vars;
        for (i = 0, len = ref.length; i < len; i++) {
          userVar = ref[i];
          if (userVar.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
            completions.push(this.buildCompletion(userVar));
          }
        }
      }
      ref1 = this.completions.variables;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        variable = ref1[j];
        if (variable.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(variable));
        }
      }
      ref2 = this.completions.constants;
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        constants = ref2[k];
        if (constants.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(constants));
        }
      }
      ref3 = this.completions.keywords;
      for (l = 0, len3 = ref3.length; l < len3; l++) {
        keyword = ref3[l];
        if (keyword.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(keyword));
        }
      }
      if (this.userSuggestions != null) {
        ref4 = this.userSuggestions.user_functions;
        for (m = 0, len4 = ref4.length; m < len4; m++) {
          userFunc = ref4[m];
          if (userFunc.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
            completions.push(this.buildCompletion(userFunc));
          }
        }
      }
      ref5 = this.funtions.functions;
      for (n = 0, len5 = ref5.length; n < len5; n++) {
        func = ref5[n];
        if (func.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(func));
        }
      }
      return completions;
    },
    getCompletions: function(arg) {
      var completions, constants, editor, func, i, j, k, keyword, l, len, len1, len2, len3, lowerCasePrefix, prefix, ref, ref1, ref2, ref3, userFunc;
      editor = arg.editor, prefix = arg.prefix;
      completions = [];
      lowerCasePrefix = prefix.toLowerCase();
      ref = this.completions.constants;
      for (i = 0, len = ref.length; i < len; i++) {
        constants = ref[i];
        if (constants.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(constants));
        }
      }
      ref1 = this.completions.keywords;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        keyword = ref1[j];
        if (keyword.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(keyword));
        }
      }
      if (this.userSuggestions != null) {
        ref2 = this.userSuggestions.user_functions;
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          userFunc = ref2[k];
          if (userFunc.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
            completions.push(this.buildCompletion(userFunc));
          }
        }
      }
      ref3 = this.funtions.functions;
      for (l = 0, len3 = ref3.length; l < len3; l++) {
        func = ref3[l];
        if (func.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(func));
        }
      }
      return completions;
    },
    getVarsCompletions: function(arg) {
      var completions, editor, i, j, len, len1, lowerCasePrefix, prefix, ref, ref1, userVar, variable;
      editor = arg.editor, prefix = arg.prefix;
      completions = [];
      lowerCasePrefix = prefix.toLowerCase();
      if (this.userSuggestions != null) {
        ref = this.userSuggestions.user_vars;
        for (i = 0, len = ref.length; i < len; i++) {
          userVar = ref[i];
          if (userVar.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
            completions.push(this.buildCompletion(userVar));
          }
        }
      }
      ref1 = this.completions.variables;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        variable = ref1[j];
        if (variable.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(variable));
        }
      }
      return completions;
    },
    buildCompletion: function(suggestion) {
      return {
        text: suggestion.text,
        type: suggestion.type,
        displayText: suggestion.displayText != null ? suggestion.displayText : suggestion.displayText = null,
        snippet: suggestion.snippet != null ? suggestion.snippet : suggestion.snippet = null,
        leftLabel: suggestion.leftLabel != null ? suggestion.leftLabel : suggestion.leftLabel = null,
        description: suggestion.description != null ? suggestion.description : suggestion.description = "PHP <" + suggestion.text + "> " + suggestion.type,
        descriptionMoreURL: suggestion.descriptionMoreURL != null ? suggestion.descriptionMoreURL : suggestion.descriptionMoreURL = null
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBocC9saWIvcHJvdmlkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsY0FBQSxFQUFnQixLQUFoQjtJQUdBLFFBQUEsRUFBVSxhQUhWO0lBSUEsa0JBQUEsRUFBb0Isc0JBSnBCO0lBVUEsaUJBQUEsRUFBbUIsQ0FWbkI7SUFXQSxvQkFBQSxFQUFzQixJQVh0QjtJQWNBLGVBQUEsRUFBaUIsU0FBQTtNQUNmLElBQUMsQ0FBQSxXQUFELEdBQWU7TUFDZixFQUFFLENBQUMsUUFBSCxDQUFZLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixFQUF3QixJQUF4QixFQUE4QixrQkFBOUIsQ0FBWixFQUErRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLE9BQVI7VUFDN0QsSUFBMEMsYUFBMUM7WUFBQSxLQUFDLENBQUEsV0FBRCxHQUFlLElBQUksQ0FBQyxLQUFMLENBQVcsT0FBWCxFQUFmOztRQUQ2RDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0Q7TUFJQSxJQUFDLENBQUEsUUFBRCxHQUFZO2FBQ1osRUFBRSxDQUFDLFFBQUgsQ0FBWSxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBd0IsSUFBeEIsRUFBOEIsZ0JBQTlCLENBQVosRUFBNkQsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQsRUFBUSxPQUFSO1VBQzNELElBQXVDLGFBQXZDO1lBQUEsS0FBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLENBQUMs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QUFaLENBQWlCLElBQUMsQ0FBQSxlQUFELENBQWlCLE9BQWpCLENBQWpCOztBQURGLFNBREY7O0FBSUE7QUFBQSxXQUFBLHdDQUFBOztZQUE0QyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQWQsQ0FBQSxDQUEyQixDQUFDLE9BQTVCLENBQW9DLGVBQXBDLENBQUEsS0FBd0Q7VUFDbEcsV0FBVyxDQUFDLElBQVosQ0FBaUIsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsUUFBakIsQ0FBakI7O0FBREY7YUFHQTtJQVhrQixDQWpLcEI7SUErS0EsZUFBQSxFQUFpQixTQUFDLFVBQUQ7YUFDZjtRQUFBLElBQUEsRUFBTSxVQUFVLENBQUMsSUFBakI7UUFDQSxJQUFBLEVBQU0sVUFBVSxDQUFDLElBRGpCO1FBRUEsV0FBQSxtQ0FBYSxVQUFVLENBQUMsY0FBWCxVQUFVLENBQUMsY0FBZSxJQUZ2QztRQUdBLE9BQUEsK0JBQVMsVUFBVSxDQUFDLFVBQVgsVUFBVSxDQUFDLFVBQVcsSUFIL0I7UUFJQSxTQUFBLGlDQUFXLFVBQVUsQ0FBQyxZQUFYLFVBQVUsQ0FBQyxZQUFhLElBSm5DO1FBS0EsV0FBQSxtQ0FBYSxVQUFVLENBQUMsY0FBWCxVQUFVLENBQUMsY0FBZSxPQUFBLEdBQVEsVUFBVSxDQUFDLElBQW5CLEdBQXdCLElBQXhCLEdBQTRCLFVBQVUsQ0FBQyxJQUw5RTtRQU1BLGtCQUFBLDBDQUFvQixVQUFVLENBQUMscUJBQVgsVUFBVSxDQUFDLHFCQUFzQixJQU5yRDs7SUFEZSxDQS9LakI7O0FBTEYiLCJzb3VyY2VzQ29udGVudCI6WyJleGVjID0gcmVxdWlyZSAnY2hpbGRfcHJvY2VzcydcbmZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcblxubW9kdWxlLmV4cG9ydHMgPVxuICBleGVjdXRhYmxlUGF0aDogJ3BocCdcblxuICAjIFRoaXMgd2lsbCB3b3JrIG9uIEphdmFTY3JpcHQgYW5kIENvZmZlZVNjcmlwdCBmaWxlcywgYnV0IG5vdCBpbiBqcyBjb21tZW50cy5cbiAgc2VsZWN0b3I6ICcuc291cmNlLnBocCdcbiAgZGlzYWJsZUZvclNlbGVjdG9yOiAnLnNvdXJjZS5waHAgLmNvbW1lbnQnXG4gICMga2V5d29yZC5vcGVyYXRvci5jbGFzcy5waHBcblxuICAjIFRoaXMgd2lsbCB0YWtlIHByaW9yaXR5IG92ZXIgdGhlIGRlZmF1bHQgcHJvdmlkZXIsIHdoaWNoIGhhcyBhIHByaW9yaXR5IG9mIDAuXG4gICMgYGV4Y2x1ZGVMb3dlclByaW9yaXR5YCB3aWxsIHN1cHByZXNzIGFueSBwcm92aWRlcnMgd2l0aCBhIGxvd2VyIHByaW9yaXR5XG4gICMgaS5lLiBUaGUgZGVmYXVsdCBwcm92aWRlciB3aWxsIGJlIHN1cHByZXNzZWRcbiAgaW5jbHVzaW9uUHJpb3JpdHk6IDFcbiAgZXhjbHVkZUxvd2VyUHJpb3JpdHk6IHRydWVcblxuICAjIExvYWQgQ29tcGxldGlvbnMgZnJvbSBqc29uXG4gIGxvYWRDb21wbGV0aW9uczogLT5cbiAgICBAY29tcGxldGlvbnMgPSB7fVxuICAgIGZzLnJlYWRGaWxlIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsICdjb21wbGV0aW9ucy5qc29uJyksIChlcnJvciwgY29udGVudCkgPT5cbiAgICAgIEBjb21wbGV0aW9ucyA9IEpTT04ucGFyc2UoY29udGVudCkgdW5sZXNzIGVycm9yP1xuICAgICAgcmV0dXJuXG5cbiAgICBAZnVudGlvbnMgPSB7fVxuICAgIGZzLnJlYWRGaWxlIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsICdmdW5jdGlvbnMuanNvbicpLCAoZXJyb3IsIGNvbnRlbnQpID0+XG4gICAgICBAZnVudGlvbnMgPSBKU09OLnBhcnNlKGNvbnRlbnQpIHVubGVzcyBlcnJvcj9cbiAgICAgIHJldHVyblxuXG4gIGV4ZWN1dGU6ICh7ZWRpdG9yfSwgZm9yY2UgPSBmYWxzZSkgLT5cbiAgICBpZiAhZm9yY2VcbiAgICAgIHJldHVybiBpZiBAdXNlclZhcnM/IGFuZCBAbGFzdFBhdGggPT0gZWRpdG9yLmdldFBhdGgoKVxuXG4gICAgQGNvbXBpbGVEYXRhID0gJydcbiAgICBwaHBFeCA9ICdnZXRfdXNlcl9hbGwucGhwJ1xuXG4gICAgcHJvYyA9IGV4ZWMuc3Bhd24gdGhpcy5leGVjdXRhYmxlUGF0aCwgW19fZGlybmFtZSArICcvcGhwLycgKyBwaHBFeF1cblxuICAgIHByb2Muc3RkaW4ud3JpdGUoZWRpdG9yLmdldFRleHQoKSlcbiAgICBwcm9jLnN0ZGluLmVuZCgpXG5cbiAgICBwcm9jLnN0ZG91dC5vbiAnZGF0YScsIChkYXRhKSA9PlxuICAgICAgQGNvbXBpbGVEYXRhID0gQGNvbXBpbGVEYXRhICsgZGF0YVxuXG4gICAgcHJvYy5zdGRlcnIub24gJ2RhdGEnLCAoZGF0YSkgLT5cbiAgICAgIGNvbnNvbGUubG9nICdlcnI6ICcgKyBkYXRhXG5cbiAgICBwcm9jLm9uICdjbG9zZScsIChjb2RlKSA9PlxuICAgICAgdHJ5XG4gICAgICAgIEB1c2VyU3VnZ2VzdGlvbnMgPSBKU09OLnBhcnNlKEBjb21waWxlRGF0YSlcbiAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICMgY29uc29sZS5sb2cgZXJyb3JcblxuICAgICAgQGxhc3RQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgICAgIyBAbGFzdFRpbWVFeCA9IG5ldyBEYXRlKClcblxuICAjIFJlcXVpcmVkOiBSZXR1cm4gYSBwcm9taXNlLCBhbiBhcnJheSBvZiBzdWdnZXN0aW9ucywgb3IgbnVsbC5cbiAgIyB7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgc2NvcGVEZXNjcmlwdG9yLCBwcmVmaXh9XG4gIGdldFN1Z2dlc3Rpb25zOiAocmVxdWVzdCkgLT5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgPT5cbiAgICAgICMgaWYgQGxhc3RUaW1lRXg/IGFuZCBNYXRoLmZsb29yKChuZXcgRGF0ZSgpIC0gQGxhc3RUaW1lRXgpIC8gNjAwMDApIDwgMVxuICAgICAgIyAgIHR5cGVFeCA9IGZhbHNlXG4gICAgICAjIGVsc2VcbiAgICAgICMgICB0eXBlRXggPSB0cnVlXG5cbiAgICAgIHR5cGVFeCA9IHRydWVcblxuICAgICAgaWYgQG5vdFNob3dBdXRvY29tcGxldGUocmVxdWVzdClcbiAgICAgICAgcmVzb2x2ZShbXSlcbiAgICAgIGVsc2UgaWYgQGlzQWxsKHJlcXVlc3QpXG4gICAgICAgIEBleGVjdXRlKHJlcXVlc3QsIHR5cGVFeClcbiAgICAgICAgcmVzb2x2ZShAZ2V0QWxsQ29tcGxldGlvbnMocmVxdWVzdCkpXG4gICAgICBlbHNlIGlmIEBpc1ZhcmlhYmxlKHJlcXVlc3QpXG4gICAgICAgIEBleGVjdXRlKHJlcXVlc3QsIHR5cGVFeClcbiAgICAgICAgcmVzb2x2ZShAZ2V0VmFyc0NvbXBsZXRpb25zKHJlcXVlc3QpKVxuICAgICAgZWxzZSBpZiBAaXNGdW5Db24ocmVxdWVzdClcbiAgICAgICAgQGV4ZWN1dGUocmVxdWVzdCwgdHlwZUV4KVxuICAgICAgICByZXNvbHZlKEBnZXRDb21wbGV0aW9ucyhyZXF1ZXN0KSlcbiAgICAgIGVsc2VcbiAgICAgICAgcmVzb2x2ZShbXSlcblxuICAjIChvcHRpb25hbCk6IGNhbGxlZCBfYWZ0ZXJfIHRoZSBzdWdnZXN0aW9uIGByZXBsYWNlbWVudFByZWZpeGAgaXMgcmVwbGFjZWRcbiAgIyBieSB0aGUgc3VnZ2VzdGlvbiBgdGV4dGAgaW4gdGhlIGJ1ZmZlclxuICBvbkRpZEluc2VydFN1Z2dlc3Rpb246ICh7ZWRpdG9yLCB0cmlnZ2VyUG9zaXRpb24sIHN1Z2dlc3Rpb259KSAtPlxuXG4gICMgKG9wdGlvbmFsKTogY2FsbGVkIHdoZW4geW91ciBwcm92aWRlciBuZWVkcyB0byBiZSBjbGVhbmVkIHVwLiBVbnN1YnNjcmliZVxuICAjIGZyb20gdGhpbmdzLCBraWxsIGFueSBwcm9jZXNzZXMsIGV0Yy5cbiAgZGlzcG9zZTogLT5cblxuICBub3RTaG93QXV0b2NvbXBsZXRlOiAocmVxdWVzdCkgLT5cbiAgICByZXR1cm4gdHJ1ZSBpZiByZXF1ZXN0LnByZWZpeCBpcyAnJ1xuICAgIHNjb3BlcyA9IHJlcXVlc3Quc2NvcGVEZXNjcmlwdG9yLmdldFNjb3Blc0FycmF5KClcbiAgICByZXR1cm4gdHJ1ZSBpZiBzY29wZXMuaW5kZXhPZigna2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnBocCcpIGlzbnQgLTEgb3JcbiAgICAgIHNjb3Blcy5pbmRleE9mKCdrZXl3b3JkLm9wZXJhdG9yLmNvbXBhcmlzb24ucGhwJykgaXNudCAtMSBvclxuICAgICAgc2NvcGVzLmluZGV4T2YoJ2tleXdvcmQub3BlcmF0b3IubG9naWNhbC5waHAnKSBpc250IC0xIG9yXG4gICAgICBzY29wZXMuaW5kZXhPZignc3RyaW5nLnF1b3RlZC5kb3VibGUucGhwJykgaXNudCAtMSBvclxuICAgICAgc2NvcGVzLmluZGV4T2YoJ3N0cmluZy5xdW90ZWQuc2luZ2xlLnBocCcpIGlzbnQgLTFcbiAgICByZXR1cm4gdHJ1ZSBpZiBAaXNJblN0cmluZyhyZXF1ZXN0KSBhbmQgQGlzRnVuQ29uKHJlcXVlc3QpXG5cbiAgaXNJblN0cmluZzogKHtzY29wZURlc2NyaXB0b3J9KSAtPlxuICAgIHNjb3BlcyA9IHNjb3BlRGVzY3JpcHRvci5nZXRTY29wZXNBcnJheSgpXG4gICAgcmV0dXJuIHRydWUgaWYgc2NvcGVzLmluZGV4T2YoJ3N0cmluZy5xdW90ZWQuc2luZ2xlLnBocCcpIGlzbnQgLTEgb3JcbiAgICAgIHNjb3Blcy5pbmRleE9mKCdzdHJpbmcucXVvdGVkLmRvdWJsZS5waHAnKSBpc250IC0xXG5cbiAgaXNBbGw6ICh7c2NvcGVEZXNjcmlwdG9yfSkgLT5cbiAgICBzY29wZXMgPSBzY29wZURlc2NyaXB0b3IuZ2V0U2NvcGVzQXJyYXkoKVxuICAgIHJldHVybiB0cnVlIGlmIHNjb3Blcy5sZW5ndGggaXMgMyBvclxuICAgICAgc2NvcGVzLmluZGV4T2YoJ21ldGEuYXJyYXkucGhwJykgaXNudCAtMVxuXG4gIGlzVmFyaWFibGU6ICh7c2NvcGVEZXNjcmlwdG9yfSkgLT5cbiAgICBzY29wZXMgPSBzY29wZURlc2NyaXB0b3IuZ2V0U2NvcGVzQXJyYXkoKVxuICAgIHJldHVybiB0cnVlIGlmIHNjb3Blcy5pbmRleE9mKCd2YXJpYWJsZS5vdGhlci5waHAnKSBpc250IC0xXG5cbiAgaXNGdW5Db246ICh7c2NvcGVEZXNjcmlwdG9yfSkgLT5cbiAgICBzY29wZXMgPSBzY29wZURlc2NyaXB0b3IuZ2V0U2NvcGVzQXJyYXkoKVxuICAgIHJldHVybiB0cnVlIGlmIHNjb3Blcy5pbmRleE9mKCdjb25zdGFudC5vdGhlci5waHAnKSBpc250IC0xIG9yXG4gICAgICBzY29wZXMuaW5kZXhPZigna2V5d29yZC5jb250cm9sLnBocCcpIGlzbnQgLTEgb3JcbiAgICAgIHNjb3Blcy5pbmRleE9mKCdzdG9yYWdlLnR5cGUucGhwJykgaXNudCAtMSBvclxuICAgICAgc2NvcGVzLmluZGV4T2YoJ3N1cHBvcnQuZnVuY3Rpb24uY29uc3RydWN0LnBocCcpXG5cbiAgZ2V0QWxsQ29tcGxldGlvbnM6ICh7ZWRpdG9yLCBwcmVmaXh9KSAtPlxuICAgIGNvbXBsZXRpb25zID0gW11cbiAgICBsb3dlckNhc2VQcmVmaXggPSBwcmVmaXgudG9Mb3dlckNhc2UoKVxuXG4gICAgaWYgQHVzZXJTdWdnZXN0aW9ucz9cbiAgICAgIGZvciB1c2VyVmFyIGluIEB1c2VyU3VnZ2VzdGlvbnMudXNlcl92YXJzIHdoZW4gdXNlclZhci50ZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihsb3dlckNhc2VQcmVmaXgpIGlzIDBcbiAgICAgICAgY29tcGxldGlvbnMucHVzaChAYnVpbGRDb21wbGV0aW9uKHVzZXJWYXIpKVxuXG4gICAgZm9yIHZhcmlhYmxlIGluIEBjb21wbGV0aW9ucy52YXJpYWJsZXMgd2hlbiB2YXJpYWJsZS50ZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihsb3dlckNhc2VQcmVmaXgpIGlzIDBcbiAgICAgIGNvbXBsZXRpb25zLnB1c2goQGJ1aWxkQ29tcGxldGlvbih2YXJpYWJsZSkpXG5cbiAgICBmb3IgY29uc3RhbnRzIGluIEBjb21wbGV0aW9ucy5jb25zdGFudHMgd2hlbiBjb25zdGFudHMudGV4dC50b0xvd2VyQ2FzZSgpLmluZGV4T2YobG93ZXJDYXNlUHJlZml4KSBpcyAwXG4gICAgICBjb21wbGV0aW9ucy5wdXNoKEBidWlsZENvbXBsZXRpb24oY29uc3RhbnRzKSlcblxuICAgIGZvciBrZXl3b3JkIGluIEBjb21wbGV0aW9ucy5rZXl3b3JkcyB3aGVuIGtleXdvcmQudGV4dC50b0xvd2VyQ2FzZSgpLmluZGV4T2YobG93ZXJDYXNlUHJlZml4KSBpcyAwXG4gICAgICBjb21wbGV0aW9ucy5wdXNoKEBidWlsZENvbXBsZXRpb24oa2V5d29yZCkpXG5cbiAgICBpZiBAdXNlclN1Z2dlc3Rpb25zP1xuICAgICAgZm9yIHVzZXJGdW5jIGluIEB1c2VyU3VnZ2VzdGlvbnMudXNlcl9mdW5jdGlvbnMgd2hlbiB1c2VyRnVuYy50ZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihsb3dlckNhc2VQcmVmaXgpIGlzIDBcbiAgICAgICAgY29tcGxldGlvbnMucHVzaChAYnVpbGRDb21wbGV0aW9uKHVzZXJGdW5jKSlcblxuICAgIGZvciBmdW5jIGluIEBmdW50aW9ucy5mdW5jdGlvbnMgd2hlbiBmdW5jLnRleHQudG9Mb3dlckNhc2UoKS5pbmRleE9mKGxvd2VyQ2FzZVByZWZpeCkgaXMgMFxuICAgICAgY29tcGxldGlvbnMucHVzaChAYnVpbGRDb21wbGV0aW9uKGZ1bmMpKVxuXG4gICAgY29tcGxldGlvbnNcblxuICBnZXRDb21wbGV0aW9uczogKHtlZGl0b3IsIHByZWZpeH0pIC0+XG4gICAgY29tcGxldGlvbnMgPSBbXVxuICAgIGxvd2VyQ2FzZVByZWZpeCA9IHByZWZpeC50b0xvd2VyQ2FzZSgpXG5cbiAgICBmb3IgY29uc3RhbnRzIGluIEBjb21wbGV0aW9ucy5jb25zdGFudHMgd2hlbiBjb25zdGFudHMudGV4dC50b0xvd2VyQ2FzZSgpLmluZGV4T2YobG93ZXJDYXNlUHJlZml4KSBpcyAwXG4gICAgICBjb21wbGV0aW9ucy5wdXNoKEBidWlsZENvbXBsZXRpb24oY29uc3RhbnRzKSlcblxuICAgIGZvciBrZXl3b3JkIGluIEBjb21wbGV0aW9ucy5rZXl3b3JkcyB3aGVuIGtleXdvcmQudGV4dC50b0xvd2VyQ2FzZSgpLmluZGV4T2YobG93ZXJDYXNlUHJlZml4KSBpcyAwXG4gICAgICBjb21wbGV0aW9ucy5wdXNoKEBidWlsZENvbXBsZXRpb24oa2V5d29yZCkpXG5cbiAgICBpZiBAdXNlclN1Z2dlc3Rpb25zP1xuICAgICAgZm9yIHVzZXJGdW5jIGluIEB1c2VyU3VnZ2VzdGlvbnMudXNlcl9mdW5jdGlvbnMgd2hlbiB1c2VyRnVuYy50ZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihsb3dlckNhc2VQcmVmaXgpIGlzIDBcbiAgICAgICAgY29tcGxldGlvbnMucHVzaChAYnVpbGRDb21wbGV0aW9uKHVzZXJGdW5jKSlcblxuICAgIGZvciBmdW5jIGluIEBmdW50aW9ucy5mdW5jdGlvbnMgd2hlbiBmdW5jLnRleHQudG9Mb3dlckNhc2UoKS5pbmRleE9mKGxvd2VyQ2FzZVByZWZpeCkgaXMgMFxuICAgICAgY29tcGxldGlvbnMucHVzaChAYnVpbGRDb21wbGV0aW9uKGZ1bmMpKVxuXG4gICAgY29tcGxldGlvbnNcblxuICBnZXRWYXJzQ29tcGxldGlvbnM6ICh7ZWRpdG9yLCBwcmVmaXh9KSAtPlxuICAgIGNvbXBsZXRpb25zID0gW11cbiAgICBsb3dlckNhc2VQcmVmaXggPSBwcmVmaXgudG9Mb3dlckNhc2UoKVxuXG4gICAgaWYgQHVzZXJTdWdnZXN0aW9ucz9cbiAgICAgIGZvciB1c2VyVmFyIGluIEB1c2VyU3VnZ2VzdGlvbnMudXNlcl92YXJzIHdoZW4gdXNlclZhci50ZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihsb3dlckNhc2VQcmVmaXgpIGlzIDBcbiAgICAgICAgY29tcGxldGlvbnMucHVzaChAYnVpbGRDb21wbGV0aW9uKHVzZXJWYXIpKVxuXG4gICAgZm9yIHZhcmlhYmxlIGluIEBjb21wbGV0aW9ucy52YXJpYWJsZXMgd2hlbiB2YXJpYWJsZS50ZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihsb3dlckNhc2VQcmVmaXgpIGlzIDBcbiAgICAgIGNvbXBsZXRpb25zLnB1c2goQGJ1aWxkQ29tcGxldGlvbih2YXJpYWJsZSkpXG5cbiAgICBjb21wbGV0aW9uc1xuXG5cbiAgYnVpbGRDb21wbGV0aW9uOiAoc3VnZ2VzdGlvbikgLT5cbiAgICB0ZXh0OiBzdWdnZXN0aW9uLnRleHRcbiAgICB0eXBlOiBzdWdnZXN0aW9uLnR5cGVcbiAgICBkaXNwbGF5VGV4dDogc3VnZ2VzdGlvbi5kaXNwbGF5VGV4dCA/PSBudWxsXG4gICAgc25pcHBldDogc3VnZ2VzdGlvbi5zbmlwcGV0ID89IG51bGxcbiAgICBsZWZ0TGFiZWw6IHN1Z2dlc3Rpb24ubGVmdExhYmVsID89IG51bGxcbiAgICBkZXNjcmlwdGlvbjogc3VnZ2VzdGlvbi5kZXNjcmlwdGlvbiA/PSBcIlBIUCA8I3tzdWdnZXN0aW9uLnRleHR9PiAje3N1Z2dlc3Rpb24udHlwZX1cIlxuICAgIGRlc2NyaXB0aW9uTW9yZVVSTDogc3VnZ2VzdGlvbi5kZXNjcmlwdGlvbk1vcmVVUkwgPz0gbnVsbFxuIl19
