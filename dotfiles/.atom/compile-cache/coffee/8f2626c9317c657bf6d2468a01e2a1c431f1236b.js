(function() {
  var CompositeDisposable, actionDecorator, atomActionName, editorProxy, emmet, emmetActions, fs, getUserHome, isValidTabContext, k, loadExtensions, multiSelectionActionDecorator, path, ref, registerInteractiveActions, resources, runAction, singleSelectionActions, toggleCommentSyntaxes, v;

  path = require('path');

  fs = require('fs');

  CompositeDisposable = require('atom').CompositeDisposable;

  emmet = require('emmet');

  emmetActions = require('emmet/lib/action/main');

  resources = require('emmet/lib/assets/resources');

  editorProxy = require('./editor-proxy');

  singleSelectionActions = ['prev_edit_point', 'next_edit_point', 'merge_lines', 'reflect_css_value', 'select_next_item', 'select_previous_item', 'wrap_with_abbreviation', 'update_tag'];

  toggleCommentSyntaxes = ['html', 'css', 'less', 'scss'];

  ref = atom.config.get('emmet.stylus');
  for (k in ref) {
    v = ref[k];
    emmet.preferences.set('stylus.' + k, v);
  }

  getUserHome = function() {
    if (process.platform === 'win32') {
      return process.env.USERPROFILE;
    }
    return process.env.HOME;
  };

  isValidTabContext = function() {
    var contains, scopes;
    if (editorProxy.getGrammar() === 'html') {
      scopes = editorProxy.getCurrentScope();
      contains = function(regexp) {
        return scopes.filter(function(s) {
          return regexp.test(s);
        }).length;
      };
      if (contains(/\.js\.embedded\./)) {
        return contains(/^string\./);
      }
    }
    return true;
  };

  actionDecorator = function(action) {
    return function(evt) {
      editorProxy.setup(this.getModel());
      return editorProxy.editor.transact((function(_this) {
        return function() {
          return runAction(action, evt);
        };
      })(this));
    };
  };

  multiSelectionActionDecorator = function(action) {
    return function(evt) {
      editorProxy.setup(this.getModel());
      return editorProxy.editor.transact((function(_this) {
        return function() {
          return editorProxy.exec(function(i) {
            runAction(action, evt);
            if (evt.keyBindingAborted) {
              return false;
            }
          });
        };
      })(this));
    };
  };

  runAction = function(action, evt) {
    var activeEditor, result, se, syntax;
    syntax = editorProxy.getSyntax();
    if (action === 'expand_abbreviation_with_tab') {
      activeEditor = editorProxy.editor;
      if (!isValidTabContext() || !activeEditor.getLastSelection().isEmpty()) {
        return evt.abortKeyBinding();
      }
      if (activeEditor.snippetExpansion) {
        se = activeEditor.snippetExpansion;
        if (se.tabStopIndex + 1 >= se.tabStopMarkers.length) {
          se.destroy();
        } else {
          return evt.abortKeyBinding();
        }
      }
    }
    if (action === 'toggle_comment' && (toggleCommentSyntaxes.indexOf(syntax) === -1 || !atom.config.get('emmet.useEmmetComments'))) {
      return evt.abortKeyBinding();
    }
    if (action === 'insert_formatted_line_break_only') {
      if (!atom.config.get('emmet.formatLineBreaks')) {
        return evt.abortKeyBinding();
      }
      result = emmet.run(action, editorProxy);
      if (!result) {
        return evt.abortKeyBinding();
      } else {
        return true;
      }
    }
    return emmet.run(action, editorProxy);
  };

  atomActionName = function(name) {
    return 'emmet:' + name.replace(/_/g, '-');
  };

  registerInteractiveActions = function(actions) {
    var j, len, name, ref1, results;
    ref1 = ['wrap_with_abbreviation', 'update_tag', 'interactive_expand_abbreviation'];
    results = [];
    for (j = 0, len = ref1.length; j < len; j++) {
      name = ref1[j];
      results.push((function(name) {
        var atomAction;
        atomAction = atomActionName(name);
        return actions[atomAction] = function(evt) {
          var interactive;
          editorProxy.setup(this.getModel());
          interactive = require('./interactive');
          return interactive.run(name, editorProxy);
        };
      })(name));
    }
    return results;
  };

  loadExtensions = function() {
    var extPath, files;
    extPath = atom.config.get('emmet.extensionsPath');
    console.log('Loading Emmet extensions from', extPath);
    if (!extPath) {
      return;
    }
    if (extPath[0] === '~') {
      extPath = getUserHome() + extPath.substr(1);
    }
    if (fs.existsSync(extPath)) {
      emmet.resetUserData();
      files = fs.readdirSync(extPath);
      files = files.map(function(item) {
        return path.join(extPath, item);
      }).filter(function(file) {
        return !fs.statSync(file).isDirectory();
      });
      return emmet.loadExtensions(files);
    } else {
      return console.warn('Emmet: no such extension folder:', extPath);
    }
  };

  module.exports = {
    config: {
      extensionsPath: {
        type: 'string',
        "default": '~/emmet'
      },
      formatLineBreaks: {
        type: 'boolean',
        "default": true
      },
      useEmmetComments: {
        type: 'boolean',
        "default": false,
        description: 'disable to use atom native commenting system'
      }
    },
    activate: function(state) {
      var action, atomAction, cmd, j, len, ref1;
      this.state = state;
      this.subscriptions = new CompositeDisposable;
      if (!this.actions) {
        this.subscriptions.add(atom.config.observe('emmet.extensionsPath', loadExtensions));
        this.actions = {};
        registerInteractiveActions(this.actions);
        ref1 = emmetActions.getList();
        for (j = 0, len = ref1.length; j < len; j++) {
          action = ref1[j];
          atomAction = atomActionName(action.name);
          if (this.actions[atomAction] != null) {
            continue;
          }
          cmd = singleSelectionActions.indexOf(action.name) !== -1 ? actionDecorator(action.name) : multiSelectionActionDecorator(action.name);
          this.actions[atomAction] = cmd;
        }
      }
      return this.subscriptions.add(atom.commands.add('atom-text-editor', this.actions));
    },
    deactivate: function() {
      return atom.config.transact((function(_this) {
        return function() {
          return _this.subscriptions.dispose();
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvZW1tZXQvbGliL2VtbWV0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDSixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUjs7RUFDUixZQUFBLEdBQWUsT0FBQSxDQUFRLHVCQUFSOztFQUNmLFNBQUEsR0FBWSxPQUFBLENBQVEsNEJBQVI7O0VBRVosV0FBQSxHQUFlLE9BQUEsQ0FBUSxnQkFBUjs7RUFHZixzQkFBQSxHQUF5QixDQUN2QixpQkFEdUIsRUFDSixpQkFESSxFQUNlLGFBRGYsRUFFdkIsbUJBRnVCLEVBRUYsa0JBRkUsRUFFa0Isc0JBRmxCLEVBR3ZCLHdCQUh1QixFQUdHLFlBSEg7O0VBTXpCLHFCQUFBLEdBQXdCLENBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsTUFBaEIsRUFBd0IsTUFBeEI7O0FBRXhCO0FBQUEsT0FBQSxRQUFBOztJQUNJLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBbEIsQ0FBc0IsU0FBQSxHQUFZLENBQWxDLEVBQXFDLENBQXJDO0FBREo7O0VBR0EsV0FBQSxHQUFjLFNBQUE7SUFDWixJQUFHLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLE9BQXZCO0FBQ0UsYUFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBRHJCOztXQUdBLE9BQU8sQ0FBQyxHQUFHLENBQUM7RUFKQTs7RUFNZCxpQkFBQSxHQUFvQixTQUFBO0FBQ2xCLFFBQUE7SUFBQSxJQUFHLFdBQVcsQ0FBQyxVQUFaLENBQUEsQ0FBQSxLQUE0QixNQUEvQjtNQUVFLE1BQUEsR0FBUyxXQUFXLENBQUMsZUFBWixDQUFBO01BQ1Qs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QUFNLENBQUMsSUFBckM7VUFDcEcsSUFBQyxDQUFBLE9BQVEsQ0FBQSxVQUFBLENBQVQsR0FBdUI7QUFMekIsU0FKRjs7YUFXQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyxJQUFDLENBQUEsT0FBdkMsQ0FBbkI7SUFiUSxDQVpWO0lBMkJBLFVBQUEsRUFBWSxTQUFBO2FBQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFaLENBQXFCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQjtJQURVLENBM0JaOztBQS9IRiIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcydcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbmVtbWV0ID0gcmVxdWlyZSAnZW1tZXQnXG5lbW1ldEFjdGlvbnMgPSByZXF1aXJlICdlbW1ldC9saWIvYWN0aW9uL21haW4nXG5yZXNvdXJjZXMgPSByZXF1aXJlICdlbW1ldC9saWIvYXNzZXRzL3Jlc291cmNlcydcblxuZWRpdG9yUHJveHkgID0gcmVxdWlyZSAnLi9lZGl0b3ItcHJveHknXG4jIGludGVyYWN0aXZlICA9IHJlcXVpcmUgJy4vaW50ZXJhY3RpdmUnXG5cbnNpbmdsZVNlbGVjdGlvbkFjdGlvbnMgPSBbXG4gICdwcmV2X2VkaXRfcG9pbnQnLCAnbmV4dF9lZGl0X3BvaW50JywgJ21lcmdlX2xpbmVzJyxcbiAgJ3JlZmxlY3RfY3NzX3ZhbHVlJywgJ3NlbGVjdF9uZXh0X2l0ZW0nLCAnc2VsZWN0X3ByZXZpb3VzX2l0ZW0nLFxuICAnd3JhcF93aXRoX2FiYnJldmlhdGlvbicsICd1cGRhdGVfdGFnJ1xuXVxuXG50b2dnbGVDb21tZW50U3ludGF4ZXMgPSBbJ2h0bWwnLCAnY3NzJywgJ2xlc3MnLCAnc2NzcyddXG5cbmZvciBrLCB2IG9mICBhdG9tLmNvbmZpZy5nZXQgJ2VtbWV0LnN0eWx1cydcbiAgICBlbW1ldC5wcmVmZXJlbmNlcy5zZXQoJ3N0eWx1cy4nICsgaywgdik7XG5cbmdldFVzZXJIb21lID0gKCkgLT5cbiAgaWYgcHJvY2Vzcy5wbGF0Zm9ybSBpcyAnd2luMzInXG4gICAgcmV0dXJuIHByb2Nlc3MuZW52LlVTRVJQUk9GSUxFXG5cbiAgcHJvY2Vzcy5lbnYuSE9NRVxuXG5pc1ZhbGlkVGFiQ29udGV4dCA9ICgpIC0+XG4gIGlmIGVkaXRvclByb3h5LmdldEdyYW1tYXIoKSBpcyAnaHRtbCdcbiAgICAjIEhUTUwgbWF5IGNvbnRhaW4gZW1iZWRkZWQgZ3JhbW1hcnNcbiAgICBzY29wZXMgPSBlZGl0b3JQcm94eS5nZXRDdXJyZW50U2NvcGUoKVxuICAgIGNvbnRhaW5zID0gKHJlZ2V4cCkgLT4gc2NvcGVzLmZpbHRlcigocykgLT4gcmVnZXhwLnRlc3QgcykubGVuZ3RoXG5cbiAgICBpZiBjb250YWlucyAvXFwuanNcXC5lbWJlZGRlZFxcLi9cbiAgICAgICMgaW4gSlMsIGFsbG93IFRhYiBleHBhbmRlciBvbmx5IGluc2lkZSBzdHJpbmdcbiAgICAgIHJldHVybiBjb250YWlucyAvXnN0cmluZ1xcLi9cblxuICByZXR1cm4gdHJ1ZVxuXG5cbiMgRW1tZXQgYWN0aW9uIGRlY29yYXRvcjogY3JlYXRlcyBhIGNvbW1hbmQgZnVuY3Rpb25cbiMgZm9yIEF0b20gYW5kIGV4ZWN1dGVzIEVtbWV0IGFjdGlvbiBhcyBzaW5nbGVcbiMgdW5kbyBjb21tYW5kXG4jIEBwYXJhbSAge09iamVjdH0gYWN0aW9uIEFjdGlvbiB0byBwZXJmb3JtXG4jIEByZXR1cm4ge0Z1bmN0aW9ufVxuYWN0aW9uRGVjb3JhdG9yID0gKGFjdGlvbikgLT5cbiAgKGV2dCkgLT5cbiAgICBlZGl0b3JQcm94eS5zZXR1cCBAZ2V0TW9kZWwoKVxuICAgIGVkaXRvclByb3h5LmVkaXRvci50cmFuc2FjdCA9PlxuICAgICAgcnVuQWN0aW9uIGFjdGlvbiwgZXZ0XG5cbiMgU2FtZSBhcyBgYWN0aW9uRGVjb3JhdG9yKClgIGJ1dCBleGVjdXRlcyBhY3Rpb25cbiMgd2l0aCBtdWx0aXBsZSBzZWxlY3Rpb25zXG4jIEBwYXJhbSAge09iamVjdH0gYWN0aW9uIEFjdGlvbiB0byBwZXJmb3JtXG4jIEByZXR1cm4ge0Z1bmN0aW9ufVxubXVsdGlTZWxlY3Rpb25BY3Rpb25EZWNvcmF0b3IgPSAoYWN0aW9uKSAtPlxuICAoZXZ0KSAtPlxuICAgIGVkaXRvclByb3h5LnNldHVwKEBnZXRNb2RlbCgpKVxuICAgIGVkaXRvclByb3h5LmVkaXRvci50cmFuc2FjdCA9PlxuICAgICAgZWRpdG9yUHJveHkuZXhlYyAoaSkgLT5cbiAgICAgICAgcnVuQWN0aW9uIGFjdGlvbiwgZXZ0XG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBldnQua2V5QmluZGluZ0Fib3J0ZWRcblxucnVuQWN0aW9uID0gKGFjdGlvbiwgZXZ0KSAtPlxuICBzeW50YXggPSBlZGl0b3JQcm94eS5nZXRTeW50YXgoKVxuICBpZiBhY3Rpb24gaXMgJ2V4cGFuZF9hYmJyZXZpYXRpb25fd2l0aF90YWInXG4gICAgIyBkbyBub3QgaGFuZGxlIFRhYiBrZXkgaWY6XG4gICAgIyAtMS4gc3ludGF4IGlzIHVua25vd24tIChubyBsb25nZXIgdmFsaWQsIGRlZmluZWQgYnkga2V5bWFwIHNlbGVjdG9yKVxuICAgICMgMi4gdGhlcmXigJlzIGEgc2VsZWN0aW9uICh1c2VyIHdhbnRzIHRvIGluZGVudCBpdClcbiAgICAjIDMuIGhhcyBleHBhbmRlZCBzbmlwcGV0IChlLmcuIGhhcyB0YWJzdG9wcylcbiAgICBhY3RpdmVFZGl0b3IgPSBlZGl0b3JQcm94eS5lZGl0b3I7XG4gICAgaWYgbm90IGlzVmFsaWRUYWJDb250ZXh0KCkgb3Igbm90IGFjdGl2ZUVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCkuaXNFbXB0eSgpXG4gICAgICByZXR1cm4gZXZ0LmFib3J0S2V5QmluZGluZygpXG4gICAgaWYgYWN0aXZlRWRpdG9yLnNuaXBwZXRFeHBhbnNpb25cbiAgICAgICMgaW4gY2FzZSBvZiBzbmlwcGV0IGV4cGFuc2lvbjogZXhwYW5kIGFiYnJldmlhdGlvbiBpZiB3ZSBjdXJyZW50bHkgb24gbGFzdFxuICAgICAgIyB0YWJzdG9wXG4gICAgICBzZSA9IGFjdGl2ZUVkaXRvci5zbmlwcGV0RXhwYW5zaW9uXG4gICAgICBpZiBzZS50YWJTdG9wSW5kZXggKyAxID49IHNlLnRhYlN0b3BNYXJrZXJzLmxlbmd0aFxuICAgICAgICBzZS5kZXN0cm95KClcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGV2dC5hYm9ydEtleUJpbmRpbmcoKVxuXG4gIGlmIGFjdGlvbiBpcyAndG9nZ2xlX2NvbW1lbnQnIGFuZCAodG9nZ2xlQ29tbWVudFN5bnRheGVzLmluZGV4T2Yoc3ludGF4KSBpcyAtMSBvciBub3QgYXRvbS5jb25maWcuZ2V0ICdlbW1ldC51c2VFbW1ldENvbW1lbnRzJylcbiAgICByZXR1cm4gZXZ0LmFib3J0S2V5QmluZGluZygpXG5cbiAgaWYgYWN0aW9uIGlzICdpbnNlcnRfZm9ybWF0dGVkX2xpbmVfYnJlYWtfb25seSdcbiAgICBpZiBub3QgYXRvbS5jb25maWcuZ2V0ICdlbW1ldC5mb3JtYXRMaW5lQnJlYWtzJ1xuICAgICAgcmV0dXJuIGV2dC5hYm9ydEtleUJpbmRpbmcoKVxuXG4gICAgcmVzdWx0ID0gZW1tZXQucnVuIGFjdGlvbiwgZWRpdG9yUHJveHlcbiAgICByZXR1cm4gaWYgbm90IHJlc3VsdCB0aGVuIGV2dC5hYm9ydEtleUJpbmRpbmcoKSBlbHNlIHRydWVcblxuICBlbW1ldC5ydW4gYWN0aW9uLCBlZGl0b3JQcm94eVxuXG5hdG9tQWN0aW9uTmFtZSA9IChuYW1lKSAtPlxuICAnZW1tZXQ6JyArIG5hbWUucmVwbGFjZSgvXy9nLCAnLScpXG5cbnJlZ2lzdGVySW50ZXJhY3RpdmVBY3Rpb25zID0gKGFjdGlvbnMpIC0+XG4gIGZvciBuYW1lIGluIFsnd3JhcF93aXRoX2FiYnJldmlhdGlvbicsICd1cGRhdGVfdGFnJywgJ2ludGVyYWN0aXZlX2V4cGFuZF9hYmJyZXZpYXRpb24nXVxuICAgIGRvIChuYW1lKSAtPlxuICAgICAgYXRvbUFjdGlvbiA9IGF0b21BY3Rpb25OYW1lIG5hbWVcbiAgICAgIGFjdGlvbnNbYXRvbUFjdGlvbl0gPSAoZXZ0KSAtPlxuICAgICAgICBlZGl0b3JQcm94eS5zZXR1cChAZ2V0TW9kZWwoKSlcbiAgICAgICAgaW50ZXJhY3RpdmUgPSByZXF1aXJlICcuL2ludGVyYWN0aXZlJ1xuICAgICAgICBpbnRlcmFjdGl2ZS5ydW4obmFtZSwgZWRpdG9yUHJveHkpXG5cbmxvYWRFeHRlbnNpb25zID0gKCkgLT5cbiAgZXh0UGF0aCA9IGF0b20uY29uZmlnLmdldCAnZW1tZXQuZXh0ZW5zaW9uc1BhdGgnXG4gIGNvbnNvbGUubG9nICdMb2FkaW5nIEVtbWV0IGV4dGVuc2lvbnMgZnJvbScsIGV4dFBhdGhcbiAgcmV0dXJuIHVubGVzcyBleHRQYXRoXG5cbiAgaWYgZXh0UGF0aFswXSBpcyAnfidcbiAgICBleHRQYXRoID0gZ2V0VXNlckhvbWUoKSArIGV4dFBhdGguc3Vic3RyIDFcblxuICBpZiBmcy5leGlzdHNTeW5jIGV4dFBhdGhcbiAgICBlbW1ldC5yZXNldFVzZXJEYXRhKClcbiAgICBmaWxlcyA9IGZzLnJlYWRkaXJTeW5jIGV4dFBhdGhcbiAgICBmaWxlcyA9IGZpbGVzXG4gICAgICAubWFwKChpdGVtKSAtPiBwYXRoLmpvaW4gZXh0UGF0aCwgaXRlbSlcbiAgICAgIC5maWx0ZXIoKGZpbGUpIC0+IG5vdCBmcy5zdGF0U3luYyhmaWxlKS5pc0RpcmVjdG9yeSgpKVxuXG4gICAgZW1tZXQubG9hZEV4dGVuc2lvbnMoZmlsZXMpXG4gIGVsc2VcbiAgICBjb25zb2xlLndhcm4gJ0VtbWV0OiBubyBzdWNoIGV4dGVuc2lvbiBmb2xkZXI6JywgZXh0UGF0aFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbmZpZzpcbiAgICBleHRlbnNpb25zUGF0aDpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnfi9lbW1ldCdcbiAgICBmb3JtYXRMaW5lQnJlYWtzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgdXNlRW1tZXRDb21tZW50czpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiAnZGlzYWJsZSB0byB1c2UgYXRvbSBuYXRpdmUgY29tbWVudGluZyBzeXN0ZW0nXG5cbiAgYWN0aXZhdGU6IChAc3RhdGUpIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIHVubGVzcyBAYWN0aW9uc1xuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ2VtbWV0LmV4dGVuc2lvbnNQYXRoJywgbG9hZEV4dGVuc2lvbnNcbiAgICAgIEBhY3Rpb25zID0ge31cbiAgICAgIHJlZ2lzdGVySW50ZXJhY3RpdmVBY3Rpb25zIEBhY3Rpb25zXG4gICAgICBmb3IgYWN0aW9uIGluIGVtbWV0QWN0aW9ucy5nZXRMaXN0KClcbiAgICAgICAgYXRvbUFjdGlvbiA9IGF0b21BY3Rpb25OYW1lIGFjdGlvbi5uYW1lXG4gICAgICAgIGlmIEBhY3Rpb25zW2F0b21BY3Rpb25dP1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIGNtZCA9IGlmIHNpbmdsZVNlbGVjdGlvbkFjdGlvbnMuaW5kZXhPZihhY3Rpb24ubmFtZSkgaXNudCAtMSB0aGVuIGFjdGlvbkRlY29yYXRvcihhY3Rpb24ubmFtZSkgZWxzZSBtdWx0aVNlbGVjdGlvbkFjdGlvbkRlY29yYXRvcihhY3Rpb24ubmFtZSlcbiAgICAgICAgQGFjdGlvbnNbYXRvbUFjdGlvbl0gPSBjbWRcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsIEBhY3Rpb25zXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBhdG9tLmNvbmZpZy50cmFuc2FjdCA9PiBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiJdfQ==
