(function() {
  var CompositeDisposable, Emitter, GitOps, MergeConflictsView, pkgApi, pkgEmitter, ref;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter;

  MergeConflictsView = require('./view/merge-conflicts-view').MergeConflictsView;

  GitOps = require('./git').GitOps;

  pkgEmitter = null;

  pkgApi = null;

  module.exports = {
    activate: function(state) {
      this.subs = new CompositeDisposable;
      this.emitter = new Emitter;
      MergeConflictsView.registerContextApi(GitOps);
      pkgEmitter = {
        onDidResolveConflict: (function(_this) {
          return function(callback) {
            return _this.onDidResolveConflict(callback);
          };
        })(this),
        didResolveConflict: (function(_this) {
          return function(event) {
            return _this.emitter.emit('did-resolve-conflict', event);
          };
        })(this),
        onDidResolveFile: (function(_this) {
          return function(callback) {
            return _this.onDidResolveFile(callback);
          };
        })(this),
        didResolveFile: (function(_this) {
          return function(event) {
            return _this.emitter.emit('did-resolve-file', event);
          };
        })(this),
        onDidQuitConflictResolution: (function(_this) {
          return function(callback) {
            return _this.onDidQuitConflictResolution(callback);
          };
        })(this),
        didQuitConflictResolution: (function(_this) {
          return function() {
            return _this.emitter.emit('did-quit-conflict-resolution');
          };
        })(this),
        onDidCompleteConflictResolution: (function(_this) {
          return function(callback) {
            return _this.onDidCompleteConflictResolution(callback);
          };
        })(this),
        didCompleteConflictResolution: (function(_this) {
          return function() {
            return _this.emitter.emit('did-complete-conflict-resolution');
          };
        })(this)
      };
      return this.subs.add(atom.commands.add('atom-workspace', 'merge-conflicts:detect', function() {
        return MergeConflictsView.detect(pkgEmitter);
      }));
    },
    deactivate: function() {
      this.subs.dispose();
      return this.emitter.dispose();
    },
    config: {
      gitPath: {
        type: 'string',
        "default": '',
        description: 'Absolute path to your git executable.'
      }
    },
    onDidResolveConflict: function(callback) {
      return this.emitter.on('did-resolve-conflict', callback);
    },
    onDidResolveFile: function(callback) {
      return this.emitter.on('did-resolve-file', callback);
    },
    onDidQuitConflictResolution: function(callback) {
      return this.emitter.on('did-quit-conflict-resolution', callback);
    },
    onDidCompleteConflictResolution: function(callback) {
      return this.emitter.on('did-complete-conflict-resolution', callback);
    },
    registerContextApi: function(contextApi) {
      return MergeConflictsView.registerContextApi(contextApi);
    },
    showForContext: function(context) {
      return MergeConflictsView.showForContext(context, pkgEmitter);
    },
    hideForContext: function(context) {
      return MergeConflictsView.hideForContext(context);
    },
    provideApi: function() {
      if (pkgApi === null) {
        pkgApi = Object.freeze({
          registerContextApi: this.registerContextApi,
          showForContext: this.showForContext,
          hideForContext: this.hideForContext,
          onDidResolveConflict: pkgEmitter.onDidResolveConflict,
          onDidResolveFile: pkgEmitter.onDidResolveConflict,
          onDidQuitConflictResolution: pkgEmitter.onDidQuitConflictResolution,
          onDidCompleteConflictResolution: pkgEmitter.onDidCompleteConflictResolution
        });
      }
      return pkgApi;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQyw2Q0FBRCxFQUFzQjs7RUFFckIscUJBQXNCLE9BQUEsQ0FBUSw2QkFBUjs7RUFDdEIsU0FBVSxPQUFBLENBQVEsT0FBUjs7RUFFWCxVQUFBLEdBQWE7O0VBQ2IsTUFBQSxHQUFTOztFQUVULE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BQ1IsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJO01BQ1osSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BRWYsa0JBQWtCLENBQUMsa0JBQW5CLENBQXNDLE1BQXRDO01BRUEsVUFBQSxHQUNFO1FBQUEsb0JBQUEsRUFBc0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxRQUFEO21CQUFjLEtBQUMsQ0FBQSxvQkFBRCxDQUFzQixRQUF0QjtVQUFkO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QjtRQUNBLGtCQUFBLEVBQW9CLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsS0FBRDttQkFBVyxLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxzQkFBZCxFQUFzQyxLQUF0QztVQUFYO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURwQjtRQUVBLGdCQUFBLEVBQWtCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsUUFBRDttQkFBYyxLQUFDLENBQUEsZ0JBQUQsQ0FBa0IsUUFBbEI7VUFBZDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGbEI7UUFHQSxjQUFBLEVBQWdCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsS0FBRDtt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QUMsb0JBTFI7VUFNckIsMkJBQUEsRUFBNkIsVUFBVSxDQUFDLDJCQU5uQjtVQU9yQiwrQkFBQSxFQUFpQyxVQUFVLENBQUMsK0JBUHZCO1NBQWQsRUFEWDs7YUFVQTtJQVhVLENBaEVaOztBQVZGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXJ9ID0gcmVxdWlyZSAnYXRvbSdcblxue01lcmdlQ29uZmxpY3RzVmlld30gPSByZXF1aXJlICcuL3ZpZXcvbWVyZ2UtY29uZmxpY3RzLXZpZXcnXG57R2l0T3BzfSA9IHJlcXVpcmUgJy4vZ2l0J1xuXG5wa2dFbWl0dGVyID0gbnVsbDtcbnBrZ0FwaSA9IG51bGw7XG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBzdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG5cbiAgICBNZXJnZUNvbmZsaWN0c1ZpZXcucmVnaXN0ZXJDb250ZXh0QXBpKEdpdE9wcyk7XG5cbiAgICBwa2dFbWl0dGVyID1cbiAgICAgIG9uRGlkUmVzb2x2ZUNvbmZsaWN0OiAoY2FsbGJhY2spID0+IEBvbkRpZFJlc29sdmVDb25mbGljdChjYWxsYmFjaylcbiAgICAgIGRpZFJlc29sdmVDb25mbGljdDogKGV2ZW50KSA9PiBAZW1pdHRlci5lbWl0ICdkaWQtcmVzb2x2ZS1jb25mbGljdCcsIGV2ZW50XG4gICAgICBvbkRpZFJlc29sdmVGaWxlOiAoY2FsbGJhY2spID0+IEBvbkRpZFJlc29sdmVGaWxlKGNhbGxiYWNrKVxuICAgICAgZGlkUmVzb2x2ZUZpbGU6IChldmVudCkgPT4gQGVtaXR0ZXIuZW1pdCAnZGlkLXJlc29sdmUtZmlsZScsIGV2ZW50XG4gICAgICBvbkRpZFF1aXRDb25mbGljdFJlc29sdXRpb246IChjYWxsYmFjaykgPT4gQG9uRGlkUXVpdENvbmZsaWN0UmVzb2x1dGlvbihjYWxsYmFjaylcbiAgICAgIGRpZFF1aXRDb25mbGljdFJlc29sdXRpb246ID0+IEBlbWl0dGVyLmVtaXQgJ2RpZC1xdWl0LWNvbmZsaWN0LXJlc29sdXRpb24nXG4gICAgICBvbkRpZENvbXBsZXRlQ29uZmxpY3RSZXNvbHV0aW9uOiAoY2FsbGJhY2spID0+IEBvbkRpZENvbXBsZXRlQ29uZmxpY3RSZXNvbHV0aW9uKGNhbGxiYWNrKVxuICAgICAgZGlkQ29tcGxldGVDb25mbGljdFJlc29sdXRpb246ID0+IEBlbWl0dGVyLmVtaXQgJ2RpZC1jb21wbGV0ZS1jb25mbGljdC1yZXNvbHV0aW9uJ1xuXG4gICAgQHN1YnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdtZXJnZS1jb25mbGljdHM6ZGV0ZWN0JywgLT5cbiAgICAgIE1lcmdlQ29uZmxpY3RzVmlldy5kZXRlY3QocGtnRW1pdHRlcilcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzLmRpc3Bvc2UoKVxuICAgIEBlbWl0dGVyLmRpc3Bvc2UoKVxuXG4gIGNvbmZpZzpcbiAgICBnaXRQYXRoOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICBkZXNjcmlwdGlvbjogJ0Fic29sdXRlIHBhdGggdG8geW91ciBnaXQgZXhlY3V0YWJsZS4nXG5cbiAgIyBJbnZva2UgYSBjYWxsYmFjayBlYWNoIHRpbWUgdGhhdCBhbiBpbmRpdmlkdWFsIGNvbmZsaWN0IGlzIHJlc29sdmVkLlxuICAjXG4gIG9uRGlkUmVzb2x2ZUNvbmZsaWN0OiAoY2FsbGJhY2spIC0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1yZXNvbHZlLWNvbmZsaWN0JywgY2FsbGJhY2tcblxuICAjIEludm9rZSBhIGNhbGxiYWNrIGVhY2ggdGltZSB0aGF0IGEgY29tcGxldGVkIGZpbGUgaXMgcmVzb2x2ZWQuXG4gICNcbiAgb25EaWRSZXNvbHZlRmlsZTogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtcmVzb2x2ZS1maWxlJywgY2FsbGJhY2tcblxuICAjIEludm9rZSBhIGNhbGxiYWNrIGlmIGNvbmZsaWN0IHJlc29sdXRpb24gaXMgcHJlbWF0dXJlbHkgZXhpdGVkLCB3aGlsZSBjb25mbGljdHMgcmVtYWluXG4gICMgdW5yZXNvbHZlZC5cbiAgI1xuICBvbkRpZFF1aXRDb25mbGljdFJlc29sdXRpb246IChjYWxsYmFjaykgLT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLXF1aXQtY29uZmxpY3QtcmVzb2x1dGlvbicsIGNhbGxiYWNrXG5cbiAgIyBJbnZva2UgYSBjYWxsYmFjayBpZiBjb25mbGljdCByZXNvbHV0aW9uIGlzIGNvbXBsZXRlZCBzdWNjZXNzZnVsbHksIHdpdGggYWxsIGNvbmZsaWN0cyByZXNvbHZlZFxuICAjIGFuZCBhbGwgZmlsZXMgcmVzb2x2ZWQuXG4gICNcbiAgb25EaWRDb21wbGV0ZUNvbmZsaWN0UmVzb2x1dGlvbjogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtY29tcGxldGUtY29uZmxpY3QtcmVzb2x1dGlvbicsIGNhbGxiYWNrXG5cbiAgIyBSZWdpc3RlciBhIHJlcG9zaXRvcnkgY29udGV4dCBwcm92aWRlciB0aGF0IHdpbGwgaGF2ZSBmdW5jdGlvbmFsaXR5IGZvclxuICAjIHJldHJpZXZpbmcgYW5kIHJlc29sdmluZyBjb25mbGljdHMuXG4gICNcbiAgcmVnaXN0ZXJDb250ZXh0QXBpOiAoY29udGV4dEFwaSkgLT5cbiAgICBNZXJnZUNvbmZsaWN0c1ZpZXcucmVnaXN0ZXJDb250ZXh0QXBpKGNvbnRleHRBcGkpXG5cblxuICBzaG93Rm9yQ29udGV4dDogKGNvbnRleHQpIC0+XG4gICAgTWVyZ2VDb25mbGljdHNWaWV3LnNob3dGb3JDb250ZXh0KGNvbnRleHQsIHBrZ0VtaXR0ZXIpXG5cbiAgaGlkZUZvckNvbnRleHQ6IChjb250ZXh0KSAtPlxuICAgIE1lcmdlQ29uZmxpY3RzVmlldy5oaWRlRm9yQ29udGV4dChjb250ZXh0KVxuXG4gIHByb3ZpZGVBcGk6IC0+XG4gICAgaWYgKHBrZ0FwaSA9PSBudWxsKVxuICAgICAgcGtnQXBpID0gT2JqZWN0LmZyZWV6ZSh7XG4gICAgICAgIHJlZ2lzdGVyQ29udGV4dEFwaTogQHJlZ2lzdGVyQ29udGV4dEFwaSxcbiAgICAgICAgc2hvd0ZvckNvbnRleHQ6IEBzaG93Rm9yQ29udGV4dCxcbiAgICAgICAgaGlkZUZvckNvbnRleHQ6IEBoaWRlRm9yQ29udGV4dCxcbiAgICAgICAgb25EaWRSZXNvbHZlQ29uZmxpY3Q6IHBrZ0VtaXR0ZXIub25EaWRSZXNvbHZlQ29uZmxpY3QsXG4gICAgICAgIG9uRGlkUmVzb2x2ZUZpbGU6IHBrZ0VtaXR0ZXIub25EaWRSZXNvbHZlQ29uZmxpY3QsXG4gICAgICAgIG9uRGlkUXVpdENvbmZsaWN0UmVzb2x1dGlvbjogcGtnRW1pdHRlci5vbkRpZFF1aXRDb25mbGljdFJlc29sdXRpb24sXG4gICAgICAgIG9uRGlkQ29tcGxldGVDb25mbGljdFJlc29sdXRpb246IHBrZ0VtaXR0ZXIub25EaWRDb21wbGV0ZUNvbmZsaWN0UmVzb2x1dGlvbixcbiAgICAgIH0pXG4gICAgcGtnQXBpXG4iXX0=
