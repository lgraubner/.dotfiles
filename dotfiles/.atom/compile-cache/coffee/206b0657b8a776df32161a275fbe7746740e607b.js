(function() {
  var $, CompositeDisposable, ConflictedEditor, MergeConflictsView, MergeState, ResolverView, View, _, handleErr, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('space-pen'), $ = ref.$, View = ref.View;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ = require('underscore-plus');

  MergeState = require('../merge-state').MergeState;

  ConflictedEditor = require('../conflicted-editor').ConflictedEditor;

  ResolverView = require('./resolver-view').ResolverView;

  handleErr = require('./error-view').handleErr;

  MergeConflictsView = (function(superClass) {
    extend(MergeConflictsView, superClass);

    function MergeConflictsView() {
      return MergeConflictsView.__super__.constructor.apply(this, arguments);
    }

    MergeConflictsView.instance = null;

    MergeConflictsView.contextApis = [];

    MergeConflictsView.content = function(state, pkg) {
      return this.div({
        "class": 'merge-conflicts tool-panel panel-bottom padded clearfix'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-heading'
          }, function() {
            _this.text('Conflicts');
            _this.span({
              "class": 'pull-right icon icon-fold',
              click: 'minimize'
            }, 'Hide');
            return _this.span({
              "class": 'pull-right icon icon-unfold',
              click: 'restore'
            }, 'Show');
          });
          return _this.div({
            outlet: 'body'
          }, function() {
            _this.div({
              "class": 'conflict-list'
            }, function() {
              return _this.ul({
                "class": 'block list-group',
                outlet: 'pathList'
              }, function() {
                var i, len, message, p, ref1, ref2, results;
                ref1 = state.conflicts;
                results = [];
                for (i = 0, len = ref1.length; i < len; i++) {
                  ref2 = ref1[i], p = ref2.path, message = ref2.message;
                  results.push(_this.li({
                    click: 'navigate',
                    "data-path": p,
                    "class": 'list-item navigate'
                  }, function() {
                    _this.span({
                      "class": 'inline-block icon icon-diff-modified status-modified path'
                    }, p);
                    return _this.div({
                      "class": 'pull-right'
                    }, function() {
                      _this.button({
                        click: 'resolveFile',
                        "class": 'btn btn-xs btn-success inline-block-tight stage-ready',
                        style: 'display: none'
                      }, state.context.resolveText);
                      _this.span({
                        "class": 'inline-block text-subtle'
                      }, message);
                      _this.progress({
                        "class": 'inline-block',
                        max: 100,
                        value: 0
                      });
                      return _this.span({
                        "class": 'inline-block icon icon-dash staged'
                      });
                    });
                  }));
                }
                return results;
              });
            });
            return _this.div({
              "class": 'footer block pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-sm',
                click: 'quit'
              }, 'Quit');
            });
          });
        };
      })(this));
    };

    MergeConflictsView.prototype.initialize = function(state1, pkg1) {
      this.state = state1;
      this.pkg = pkg1;
      this.subs = new CompositeDisposable;
      this.subs.add(this.pkg.onDidResolveConflict((function(_this) {
        return function(event) {
          var found, i, len, li, listElement, p, progress, ref1;
          p = _this.state.relativize(event.file);
          found = false;
          ref1 = _this.pathList.children();
          for (i = 0, len = ref1.length; i < len; i++) {
            listElement = ref1[i];
            li = $(listElement);
            if (li.data('path') === p) {
              found = true;
              progress = li.find('progress')[0];
              progress.max = event.total;
              progress.value = event.resolved;
              if (event.total === event.resolved) {
                li.find('.stage-ready').show();
              }
            }
          }
          if (!found) {
            return console.error("Unrecognized conflict path: " + p);
          }
        };
      })(this)));
      this.subs.add(this.pkg.onDidResolveFile((function(_this) {
        return function() {
          return _this.refresh();
        };
      })(this)));
      return this.subs.add(atom.commands.add(this.element, {
        'merge-conflicts:entire-file-ours': this.sideResolver('ours'),
        'merge-conflicts:entire-file-theirs': this.sideResolver('theirs')
      }));
    };

    MergeConflictsView.prototype.navigate = function(event, element) {
      var fullPath, repoPath;
      repoPath = element.find(".path").text();
      fullPath = this.state.join(repoPath);
      return atom.workspace.open(fullPath);
    };

    MergeConflictsView.prototype.minimize = function() {
      this.addClass('minimized');
      return this.body.hide('fast');
    };

    MergeConflictsView.prototype.restore = function() {
      this.removeClass('minimized');
      return this.body.show('fast');
    };

    MergeConflictsView.prototype.quit = function() {
      this.pkg.didQuitConflictResolution();
      this.finish();
      return this.state.context.quit(this.state.isRebase);
    };

    MergeConflictsView.prototype.refresh = function() {
      return this.state.reread()["catch"](handleErr).then((function(_this) {
        return function() {
          var i, icon, item, len, p, ref1;
          ref1 = _this.pathList.find('li');
          for (i = 0, len = ref1.length; i < len; i++) {
            item = ref1[i];
            p = $(item).data('path');
            icon = $(item).find('.staged');
            icon.removeClass('icon-dash icon-check text-success');
            if (_.contains(_this.state.conflictPaths(), p)) {
              icon.addClass('icon-dash');
            } else {
              icon.addClass('icon-check text-success');
              _this.pathList.find("li[data-path='" + p + "'] .stage-ready").hide();
            }
          }
          if (!_this.state.isEmpty()) {
            return;
          }
          _this.pkg.didCompleteConflictResolution();
          _this.finish();
          return _this.state.context.complete(_this.state.isRebase);
        };
      })(this));
    };

    MergeConflictsView.prototype.finish = function() {
      this.subs.dispose();
      return this.hide('fast', (function(_this) {
        return function() {
          MergeConflictsView.instance = null;
          return _this.remove();
        };
      })(this));
    };

    MergeConflictsView.prototype.sideResolver = function(side) {
      return (function(_this) {
        return function(event) {
          var p;
          p = $(event.target).closest('li').data('path');
          return _this.state.context.checkoutSide(side, p).then(function() {
            var full;
            full = _this.state.join(p);
            _this.pkg.didResolveConflict({
              file: full,
              total: 1,
              resolved: 1
            });
            return atom.workspace.open(p);
          })["catch"](function(err) {
            return handleErr(err);
          });
        };
      })(this);
    };

    MergeConflictsView.prototype.resolveFile = function(event, element) {
      var e, filePath, i, len, ref1, repoPath;
      repoPath = element.closest('li').data('path');
      filePath = this.state.join(repoPath);
      ref1 = atom.workspace.getTextEditors();
      for (i = 0, len = ref1.length; i < len; i++) {
        e = ref1[i];
        if (e.getPath() === filePath) {
          e.save();
        }
      }
      return this.state.context.resolveFile(repoPath).then((function(_this) {
        return function() {
          return _this.pkg.didResolveFile({
            file: filePath
          });
        };
      })(this))["catch"](function(err) {
        return handleErr(err);
      });
    };

    MergeConflictsView.registerContextApi = function(contextApi) {
      return this.contextApis.push(contextApi);
    };

    MergeConflictsView.showForContext = function(context, pkg) {
      if (this.instance) {
        this.instance.finish();
      }
      return MergeState.read(context).then((function(_this) {
        return function(state) {
          if (state.isEmpty()) {
            return;
          }
          return _this.openForState(state, pkg);
        };
      })(this))["catch"](handleErr);
    };

    MergeConflictsView.hideForContext = function(context) {
      if (!this.instance) {
        return;
      }
      if (this.instance.state.context !== context) {
        return;
      }
      return this.instance.finish();
    };

    MergeConflictsView.detect = function(pkg) {
      if (this.instance != null) {
        return;
      }
      return Promise.all(this.contextApis.map((function(_this) {
        return function(contextApi) {
          return contextApi.getContext();
        };
      })(this))).then((function(_this) {
        return function(contexts) {
          return Promise.all(_.filter(contexts, Boolean).sort(function(context1, context2) {
            return context2.priority - context1.priority;
          }).map(function(context) {
            return MergeState.read(context);
          }));
        };
      })(this)).then((function(_this) {
        return function(states) {
          var state;
          state = states.find(function(state) {
            return !state.isEmpty();
          });
          if (state == null) {
            atom.notifications.addInfo("Nothing to Merge", {
              detail: "No conflicts here!",
              dismissable: true
            });
            return;
          }
          return _this.openForState(state, pkg);
        };
      })(this))["catch"](handleErr);
    };

    MergeConflictsView.openForState = function(state, pkg) {
      var view;
      view = new MergeConflictsView(state, pkg);
      this.instance = view;
      atom.workspace.addBottomPanel({
        item: view
      });
      return this.instance.subs.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.markConflictsIn(state, editor, pkg);
        };
      })(this)));
    };

    MergeConflictsView.markConflictsIn = function(state, editor, pkg) {
      var e, fullPath, repoPath;
      if (state.isEmpty()) {
        return;
      }
      fullPath = editor.getPath();
      repoPath = state.relativize(fullPath);
      if (repoPath == null) {
        return;
      }
      if (!_.contains(state.conflictPaths(), repoPath)) {
        return;
      }
      e = new ConflictedEditor(state, pkg, editor);
      return e.mark();
    };

    return MergeConflictsView;

  })(View);

  module.exports = {
    MergeConflictsView: MergeConflictsView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi92aWV3L21lcmdlLWNvbmZsaWN0cy12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsK0dBQUE7SUFBQTs7O0VBQUEsTUFBWSxPQUFBLENBQVEsV0FBUixDQUFaLEVBQUMsU0FBRCxFQUFJOztFQUNILHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFFSCxhQUFjLE9BQUEsQ0FBUSxnQkFBUjs7RUFDZCxtQkFBb0IsT0FBQSxDQUFRLHNCQUFSOztFQUVwQixlQUFnQixPQUFBLENBQVEsaUJBQVI7O0VBQ2hCLFlBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRVI7Ozs7Ozs7SUFFSixrQkFBQyxDQUFBLFFBQUQsR0FBVzs7SUFDWCxrQkFBQyxDQUFBLFdBQUQsR0FBYzs7SUFFZCxrQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLEtBQUQsRUFBUSxHQUFSO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8seURBQVA7T0FBTCxFQUF1RSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDckUsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sZUFBUDtXQUFMLEVBQTZCLFNBQUE7WUFDM0IsS0FBQyxDQUFBLElBQUQsQ0FBTSxXQUFOO1lBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sMkJBQVA7Y0FBb0MsS0FBQSxFQUFPLFVBQTNDO2FBQU4sRUFBNkQsTUFBN0Q7bUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sNkJBQVA7Y0FBc0MsS0FBQSxF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QUFBLEdBQVcsTUFBTSxDQUFDLE9BQVAsQ0FBQTtNQUNYLFFBQUEsR0FBVyxLQUFLLENBQUMsVUFBTixDQUFpQixRQUFqQjtNQUNYLElBQWMsZ0JBQWQ7QUFBQSxlQUFBOztNQUVBLElBQUEsQ0FBYyxDQUFDLENBQUMsUUFBRixDQUFXLEtBQUssQ0FBQyxhQUFOLENBQUEsQ0FBWCxFQUFrQyxRQUFsQyxDQUFkO0FBQUEsZUFBQTs7TUFFQSxDQUFBLEdBQVEsSUFBQSxnQkFBQSxDQUFpQixLQUFqQixFQUF3QixHQUF4QixFQUE2QixNQUE3QjthQUNSLENBQUMsQ0FBQyxJQUFGLENBQUE7SUFWZ0I7Ozs7S0FsS2E7O0VBK0tqQyxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsa0JBQUEsRUFBb0Isa0JBQXBCOztBQTFMRiIsInNvdXJjZXNDb250ZW50IjpbInskLCBWaWV3fSA9IHJlcXVpcmUgJ3NwYWNlLXBlbidcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xuXG57TWVyZ2VTdGF0ZX0gPSByZXF1aXJlICcuLi9tZXJnZS1zdGF0ZSdcbntDb25mbGljdGVkRWRpdG9yfSA9IHJlcXVpcmUgJy4uL2NvbmZsaWN0ZWQtZWRpdG9yJ1xuXG57UmVzb2x2ZXJWaWV3fSA9IHJlcXVpcmUgJy4vcmVzb2x2ZXItdmlldydcbntoYW5kbGVFcnJ9ID0gcmVxdWlyZSAnLi9lcnJvci12aWV3J1xuXG5jbGFzcyBNZXJnZUNvbmZsaWN0c1ZpZXcgZXh0ZW5kcyBWaWV3XG5cbiAgQGluc3RhbmNlOiBudWxsXG4gIEBjb250ZXh0QXBpczogW11cblxuICBAY29udGVudDogKHN0YXRlLCBwa2cpIC0+XG4gICAgQGRpdiBjbGFzczogJ21lcmdlLWNvbmZsaWN0cyB0b29sLXBhbmVsIHBhbmVsLWJvdHRvbSBwYWRkZWQgY2xlYXJmaXgnLCA9PlxuICAgICAgQGRpdiBjbGFzczogJ3BhbmVsLWhlYWRpbmcnLCA9PlxuICAgICAgICBAdGV4dCAnQ29uZmxpY3RzJ1xuICAgICAgICBAc3BhbiBjbGFzczogJ3B1bGwtcmlnaHQgaWNvbiBpY29uLWZvbGQnLCBjbGljazogJ21pbmltaXplJywgJ0hpZGUnXG4gICAgICAgIEBzcGFuIGNsYXNzOiAncHVsbC1yaWdodCBpY29uIGljb24tdW5mb2xkJywgY2xpY2s6ICdyZXN0b3JlJywgJ1Nob3cnXG4gICAgICBAZGl2IG91dGxldDogJ2JvZHknLCA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAnY29uZmxpY3QtbGlzdCcsID0+XG4gICAgICAgICAgQHVsIGNsYXNzOiAnYmxvY2sgbGlzdC1ncm91cCcsIG91dGxldDogJ3BhdGhMaXN0JywgPT5cbiAgICAgICAgICAgIGZvciB7cGF0aDogcCwgbWVzc2FnZX0gaW4gc3RhdGUuY29uZmxpY3RzXG4gICAgICAgICAgICAgIEBsaSBjbGljazogJ25hdmlnYXRlJywgXCJkYXRhLXBhdGhcIjogcCwgY2xhc3M6ICdsaXN0LWl0ZW0gbmF2aWdhdGUnLCA9PlxuICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnaW5saW5lLWJsb2NrIGljb24gaWNvbi1kaWZmLW1vZGlmaWVkIHN0YXR1cy1tb2RpZmllZCBwYXRoJywgcFxuICAgICAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdwdWxsLXJpZ2h0JywgPT5cbiAgICAgICAgICAgICAgICAgIEBidXR0b24gY2xpY2s6ICdyZXNvbHZlRmlsZScsIGNsYXNzOiAnYnRuIGJ0bi14cyBidG4tc3VjY2VzcyBpbmxpbmUtYmxvY2stdGlnaHQgc3RhZ2UtcmVhZHknLCBzdHlsZTogJ2Rpc3BsYXk6IG5vbmUnLCBzdGF0ZS5jb250ZXh0LnJlc29sdmVUZXh0XG4gICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJ2lubGluZS1ibG9jayB0ZXh0LXN1YnRsZScsIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgIEBwcm9ncmVzcyBjbGFzczogJ2lubGluZS1ibG9jaycsIG1heDogMTAwLCB2YWx1ZTogMFxuICAgICAgICAgICAgICAgICAgQHNwYW4gY2xhc3M6ICdpbmxpbmUtYmxvY2sgaWNvbiBpY29uLWRhc2ggc3RhZ2VkJ1xuICAgICAgICBAZGl2IGNsYXNzOiAnZm9vdGVyIGJsb2NrIHB1bGwtcmlnaHQnLCA9PlxuICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gYnRuLXNtJywgY2xpY2s6ICdxdWl0JywgJ1F1aXQnXG5cbiAgaW5pdGlhbGl6ZTogKEBzdGF0ZSwgQHBrZykgLT5cbiAgICBAc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAc3Vicy5hZGQgQHBrZy5vbkRpZFJlc29sdmVDb25mbGljdCAoZXZlbnQpID0+XG4gICAgICBwID0gQHN0YXRlLnJlbGF0aXZpemUgZXZlbnQuZmlsZVxuICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgZm9yIGxpc3RFbGVtZW50IGluIEBwYXRoTGlzdC5jaGlsZHJlbigpXG4gICAgICAgIGxpID0gJChsaXN0RWxlbWVudClcbiAgICAgICAgaWYgbGkuZGF0YSgncGF0aCcpIGlzIHBcbiAgICAgICAgICBmb3VuZCA9IHRydWVcblxuICAgICAgICAgIHByb2dyZXNzID0gbGkuZmluZCgncHJvZ3Jlc3MnKVswXVxuICAgICAgICAgIHByb2dyZXNzLm1heCA9IGV2ZW50LnRvdGFsXG4gICAgICAgICAgcHJvZ3Jlc3MudmFsdWUgPSBldmVudC5yZXNvbHZlZFxuXG4gICAgICAgICAgbGkuZmluZCgnLnN0YWdlLXJlYWR5Jykuc2hvdygpIGlmIGV2ZW50LnRvdGFsIGlzIGV2ZW50LnJlc29sdmVkXG5cbiAgICAgIHVubGVzcyBmb3VuZFxuICAgICAgICBjb25zb2xlLmVycm9yIFwiVW5yZWNvZ25pemVkIGNvbmZsaWN0IHBhdGg6ICN7cH1cIlxuXG4gICAgQHN1YnMuYWRkIEBwa2cub25EaWRSZXNvbHZlRmlsZSA9PiBAcmVmcmVzaCgpXG5cbiAgICBAc3Vicy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgQGVsZW1lbnQsXG4gICAgICAnbWVyZ2UtY29uZmxpY3RzOmVudGlyZS1maWxlLW91cnMnOiBAc2lkZVJlc29sdmVyKCdvdXJzJyksXG4gICAgICAnbWVyZ2UtY29uZmxpY3RzOmVudGlyZS1maWxlLXRoZWlycyc6IEBzaWRlUmVzb2x2ZXIoJ3RoZWlycycpXG5cbiAgbmF2aWdhdGU6IChldmVudCwgZWxlbWVudCkgLT5cbiAgICByZXBvUGF0aCA9IGVsZW1lbnQuZmluZChcIi5wYXRoXCIpLnRleHQoKVxuICAgIGZ1bGxQYXRoID0gQHN0YXRlLmpvaW4gcmVwb1BhdGhcbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGZ1bGxQYXRoKVxuXG4gIG1pbmltaXplOiAtPlxuICAgIEBhZGRDbGFzcyAnbWluaW1pemVkJ1xuICAgIEBib2R5LmhpZGUgJ2Zhc3QnXG5cbiAgcmVzdG9yZTogLT5cbiAgICBAcmVtb3ZlQ2xhc3MgJ21pbmltaXplZCdcbiAgICBAYm9keS5zaG93ICdmYXN0J1xuXG4gIHF1aXQ6IC0+XG4gICAgQHBrZy5kaWRRdWl0Q29uZmxpY3RSZXNvbHV0aW9uKClcbiAgICBAZmluaXNoKClcbiAgICBAc3RhdGUuY29udGV4dC5xdWl0KEBzdGF0ZS5pc1JlYmFzZSlcblxuICByZWZyZXNoOiAtPlxuICAgIEBzdGF0ZS5yZXJlYWQoKS5jYXRjaChoYW5kbGVFcnIpLnRoZW4gPT5cbiAgICAgICMgQW55IGZpbGVzIHRoYXQgd2VyZSBwcmVzZW50LCBidXQgYXJlbid0IHRoZXJlIGFueSBtb3JlLCBoYXZlIGJlZW4gcmVzb2x2ZWQuXG4gICAgICBmb3IgaXRlbSBpbiBAcGF0aExpc3QuZmluZCgnbGknKVxuICAgICAgICBwID0gJChpdGVtKS5kYXRhKCdwYXRoJylcbiAgICAgICAgaWNvbiA9ICQoaXRlbSkuZmluZCgnLnN0YWdlZCcpXG4gICAgICAgIGljb24ucmVtb3ZlQ2xhc3MgJ2ljb24tZGFzaCBpY29uLWNoZWNrIHRleHQtc3VjY2VzcydcbiAgICAgICAgaWYgXy5jb250YWlucyBAc3RhdGUuY29uZmxpY3RQYXRocygpLCBwXG4gICAgICAgICAgaWNvbi5hZGRDbGFzcyAnaWNvbi1kYXNoJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgaWNvbi5hZGRDbGFzcyAnaWNvbi1jaGVjayB0ZXh0LXN1Y2Nlc3MnXG4gICAgICAgICAgQHBhdGhMaXN0LmZpbmQoXCJsaVtkYXRhLXBhdGg9JyN7cH0nXSAuc3RhZ2UtcmVhZHlcIikuaGlkZSgpXG5cbiAgICAgIHJldHVybiB1bmxlc3MgQHN0YXRlLmlzRW1wdHkoKVxuICAgICAgQHBrZy5kaWRDb21wbGV0ZUNvbmZsaWN0UmVzb2x1dGlvbigpXG4gICAgICBAZmluaXNoKClcbiAgICAgIEBzdGF0ZS5jb250ZXh0LmNvbXBsZXRlKEBzdGF0ZS5pc1JlYmFzZSlcblxuICBmaW5pc2g6IC0+XG4gICAgQHN1YnMuZGlzcG9zZSgpXG4gICAgQGhpZGUgJ2Zhc3QnLCA9PlxuICAgICAgTWVyZ2VDb25mbGljdHNWaWV3Lmluc3RhbmNlID0gbnVsbFxuICAgICAgQHJlbW92ZSgpXG5cbiAgc2lkZVJlc29sdmVyOiAoc2lkZSkgLT5cbiAgICAoZXZlbnQpID0+XG4gICAgICBwID0gJChldmVudC50YXJnZXQpLmNsb3Nlc3QoJ2xpJykuZGF0YSgncGF0aCcpXG4gICAgICBAc3RhdGUuY29udGV4dC5jaGVja291dFNpZGUoc2lkZSwgcClcbiAgICAgIC50aGVuID0+XG4gICAgICAgIGZ1bGwgPSBAc3RhdGUuam9pbiBwXG4gICAgICAgIEBwa2cuZGlkUmVzb2x2ZUNvbmZsaWN0IGZpbGU6IGZ1bGwsIHRvdGFsOiAxLCByZXNvbHZlZDogMVxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuIHBcbiAgICAgIC5jYXRjaCAoZXJyKSAtPlxuICAgICAgICBoYW5kbGVFcnIoZXJyKVxuXG4gIHJlc29sdmVGaWxlOiAoZXZlbnQsIGVsZW1lbnQpIC0+XG4gICAgcmVwb1BhdGggPSBlbGVtZW50LmNsb3Nlc3QoJ2xpJykuZGF0YSgncGF0aCcpXG4gICAgZmlsZVBhdGggPSBAc3RhdGUuam9pbiByZXBvUGF0aFxuXG4gICAgZm9yIGUgaW4gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKVxuICAgICAgZS5zYXZlKCkgaWYgZS5nZXRQYXRoKCkgaXMgZmlsZVBhdGhcblxuICAgIEBzdGF0ZS5jb250ZXh0LnJlc29sdmVGaWxlKHJlcG9QYXRoKVxuICAgIC50aGVuID0+XG4gICAgICBAcGtnLmRpZFJlc29sdmVGaWxlIGZpbGU6IGZpbGVQYXRoXG4gICAgLmNhdGNoIChlcnIpIC0+XG4gICAgICBoYW5kbGVFcnIoZXJyKVxuXG4gIEByZWdpc3RlckNvbnRleHRBcGk6IChjb250ZXh0QXBpKSAtPlxuICAgIEBjb250ZXh0QXBpcy5wdXNoKGNvbnRleHRBcGkpXG5cbiAgQHNob3dGb3JDb250ZXh0OiAoY29udGV4dCwgcGtnKSAtPlxuICAgIGlmIEBpbnN0YW5jZVxuICAgICAgQGluc3RhbmNlLmZpbmlzaCgpXG4gICAgTWVyZ2VTdGF0ZS5yZWFkKGNvbnRleHQpLnRoZW4gKHN0YXRlKSA9PlxuICAgICAgcmV0dXJuIGlmIHN0YXRlLmlzRW1wdHkoKVxuICAgICAgQG9wZW5Gb3JTdGF0ZShzdGF0ZSwgcGtnKVxuICAgIC5jYXRjaCBoYW5kbGVFcnJcblxuICBAaGlkZUZvckNvbnRleHQ6IChjb250ZXh0KSAtPlxuICAgIHJldHVybiB1bmxlc3MgQGluc3RhbmNlXG4gICAgcmV0dXJuIHVubGVzcyBAaW5zdGFuY2Uuc3RhdGUuY29udGV4dCA9PSBjb250ZXh0XG4gICAgQGluc3RhbmNlLmZpbmlzaCgpXG5cbiAgQGRldGVjdDogKHBrZykgLT5cbiAgICByZXR1cm4gaWYgQGluc3RhbmNlP1xuXG4gICAgUHJvbWlzZS5hbGwoQGNvbnRleHRBcGlzLm1hcCAoY29udGV4dEFwaSkgPT4gY29udGV4dEFwaS5nZXRDb250ZXh0KCkpXG4gICAgLnRoZW4gKGNvbnRleHRzKSA9PlxuICAgICAgIyBmaWx0ZXIgb3V0IG51bGxzIGFuZCB0YWtlIHRoZSBoaWdoZXN0IHByaW9yaXR5IGNvbnRleHQuXG4gICAgICBQcm9taXNlLmFsbChcbiAgICAgICAgXy5maWx0ZXIoY29udGV4dHMsIEJvb2xlYW4pXG4gICAgICAgIC5zb3J0IChjb250ZXh0MSwgY29udGV4dDIpID0+IGNvbnRleHQyLnByaW9yaXR5IC0gY29udGV4dDEucHJpb3JpdHlcbiAgICAgICAgLm1hcCAoY29udGV4dCkgPT4gTWVyZ2VTdGF0ZS5yZWFkIGNvbnRleHRcbiAgICAgIClcbiAgICAudGhlbiAoc3RhdGVzKSA9PlxuICAgICAgc3RhdGUgPSBzdGF0ZXMuZmluZCAoc3RhdGUpIC0+IG5vdCBzdGF0ZS5pc0VtcHR5KClcbiAgICAgIHVubGVzcyBzdGF0ZT9cbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8gXCJOb3RoaW5nIHRvIE1lcmdlXCIsXG4gICAgICAgICAgZGV0YWlsOiBcIk5vIGNvbmZsaWN0cyBoZXJlIVwiLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgIHJldHVyblxuICAgICAgQG9wZW5Gb3JTdGF0ZShzdGF0ZSwgcGtnKVxuICAgIC5jYXRjaCBoYW5kbGVFcnJcblxuICBAb3BlbkZvclN0YXRlOiAoc3RhdGUsIHBrZykgLT5cbiAgICB2aWV3ID0gbmV3IE1lcmdlQ29uZmxpY3RzVmlldyhzdGF0ZSwgcGtnKVxuICAgIEBpbnN0YW5jZSA9IHZpZXdcbiAgICBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbCBpdGVtOiB2aWV3XG5cbiAgICBAaW5zdGFuY2Uuc3Vicy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICBAbWFya0NvbmZsaWN0c0luIHN0YXRlLCBlZGl0b3IsIHBrZ1xuXG4gIEBtYXJrQ29uZmxpY3RzSW46IChzdGF0ZSwgZWRpdG9yLCBwa2cpIC0+XG4gICAgcmV0dXJuIGlmIHN0YXRlLmlzRW1wdHkoKVxuXG4gICAgZnVsbFBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgcmVwb1BhdGggPSBzdGF0ZS5yZWxhdGl2aXplIGZ1bGxQYXRoXG4gICAgcmV0dXJuIHVubGVzcyByZXBvUGF0aD9cblxuICAgIHJldHVybiB1bmxlc3MgXy5jb250YWlucyBzdGF0ZS5jb25mbGljdFBhdGhzKCksIHJlcG9QYXRoXG5cbiAgICBlID0gbmV3IENvbmZsaWN0ZWRFZGl0b3Ioc3RhdGUsIHBrZywgZWRpdG9yKVxuICAgIGUubWFyaygpXG5cblxubW9kdWxlLmV4cG9ydHMgPVxuICBNZXJnZUNvbmZsaWN0c1ZpZXc6IE1lcmdlQ29uZmxpY3RzVmlld1xuIl19
