(function() {
  var $, CompositeDisposable, Conflict, ConflictedEditor, Emitter, NavigationView, ResolverView, SideView, _, ref;

  $ = require('space-pen').$;

  _ = require('underscore-plus');

  ref = require('atom'), Emitter = ref.Emitter, CompositeDisposable = ref.CompositeDisposable;

  Conflict = require('./conflict').Conflict;

  SideView = require('./view/side-view').SideView;

  NavigationView = require('./view/navigation-view').NavigationView;

  ResolverView = require('./view/resolver-view').ResolverView;

  ConflictedEditor = (function() {
    function ConflictedEditor(state, pkg, editor) {
      this.state = state;
      this.pkg = pkg;
      this.editor = editor;
      this.subs = new CompositeDisposable;
      this.coveringViews = [];
      this.conflicts = [];
    }

    ConflictedEditor.prototype.mark = function() {
      var c, cv, i, j, len, len1, ref1, ref2;
      this.conflicts = Conflict.all(this.state, this.editor);
      this.coveringViews = [];
      ref1 = this.conflicts;
      for (i = 0, len = ref1.length; i < len; i++) {
        c = ref1[i];
        this.coveringViews.push(new SideView(c.ours, this.editor));
        if (c.base != null) {
          this.coveringViews.push(new SideView(c.base, this.editor));
        }
        this.coveringViews.push(new NavigationView(c.navigator, this.editor));
        this.coveringViews.push(new SideView(c.theirs, this.editor));
        this.subs.add(c.onDidResolveConflict((function(_this) {
          return function() {
            var resolvedCount, unresolved, v;
            unresolved = (function() {
              var j, len1, ref2, results;
              ref2 = this.coveringViews;
              results = [];
              for (j = 0, len1 = ref2.length; j < len1; j++) {
                v = ref2[j];
                if (!v.conflict().isResolved()) {
                  results.push(v);
                }
              }
              return results;
            }).call(_this);
            resolvedCount = _this.conflicts.length - Math.floor(unresolved.length / 3);
            return _this.pkg.didResolveConflict({
              file: _this.editor.getPath(),
              total: _this.conflicts.length,
              resolved: resolvedCount,
              source: _this
            });
          };
        })(this)));
      }
      if (this.conflicts.length > 0) {
        atom.views.getView(this.editor).classList.add('conflicted');
        ref2 = this.coveringViews;
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          cv = ref2[j];
          cv.decorate();
        }
        this.installEvents();
        return this.focusConflict(this.conflicts[0]);
      } else {
        this.pkg.didResolveConflict({
          file: this.editor.getPath(),
          total: 1,
          resolved: 1,
          source: this
        });
        return this.conflictsResolved();
      }
    };

    ConflictedEditor.prototype.installEvents = function() {
      this.subs.add(this.editor.onDidStopChanging((function(_this) {
        return function() {
          return _this.detectDirty();
        };
      })(this)));
      this.subs.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.cleanup();
        };
      })(this)));
      this.subs.add(atom.commands.add('atom-text-editor', {
        'merge-conflicts:accept-current': (function(_this) {
          return function() {
            return _this.acceptCurrent();
          };
        })(this),
        'merge-conflicts:accept-ours': (function(_this) {
          return function() {
            return _this.acceptOurs();
          };
        })(this),
        'merge-conflicts:accept-theirs': (function(_this) {
          return function() {
            return _this.acceptTheirs();
          };
        })(this),
        'merge-conflicts:ours-then-theirs': (function(_this) {
          return function() {
            return _this.acceptOursThenTheirs();
          };
        })(this),
        'merge-conflicts:theirs-then-ours': (function(_this) {
          return function() {
            return _this.acceptTheirsThenOurs();
          };
        })(this),
        'merge-conflicts:next-unresolved': (function(_this) {
          return function() {
            return _this.nextUnresolved();
          };
        })(this),
        'merge-conflicts:previous-unresolved': (function(_this) {
          return function() {
            return _this.previousUnresolved();
          };
        })(this),
        'merge-conflicts:revert-current': (function(_this) {
          return function() {
            return _this.revertCurrent();
          };
        })(this)
      }));
      this.subs.add(this.pkg.onDidResolveConflict((function(_this) {
        return function(arg) {
          var file, resolved, total;
          total = arg.total, resolved = arg.resolved, file = arg.file;
          if (file === _this.editor.getPath() && total === resolved) {
            return _this.conflictsResolved();
          }
        };
      })(this)));
      this.subs.add(this.pkg.onDidCompleteConflictResolution((function(_this) {
        return function() {
          return _this.cleanup();
        };
      })(this)));
      return this.subs.add(this.pkg.onDidQuitConflictResolution((function(_this) {
        return function() {
          return _this.cleanup();
        };
      })(this)));
    };

    ConflictedEditor.prototype.cleanup = function() {
      var c, i, j, k, len, len1, len2, m, ref1, ref2, ref3, v;
      if (this.editor != null) {
        atom.views.getView(this.editor).classList.remove('conflicted');
      }
      ref1 = this.conflicts;
      for (i = 0, len = ref1.length; i < len; i++) {
        c = ref1[i];
        ref2 = c.markers();
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          m = ref2[j];
          m.destroy();
        }
      }
      ref3 = this.coveringViews;
      for (k = 0, len2 = ref3.length; k < len2; k++) {
        v = ref3[k];
        v.remove();
      }
      return this.subs.dispose();
    };

    ConflictedEditor.prototype.conflictsResolved = function() {
      return atom.workspace.addTopPanel({
        item: new ResolverView(this.editor, this.state, this.pkg)
      });
    };

    ConflictedEditor.prototype.detectDirty = function() {
      var c, i, j, k, len, len1, len2, potentials, ref1, ref2, ref3, results, v;
      potentials = [];
      ref1 = this.editor.getCursors();
      for (i = 0, len = ref1.length; i < len; i++) {
        c = ref1[i];
        ref2 = this.coveringViews;
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          v = ref2[j];
          if (v.includesCursor(c)) {
            potentials.push(v);
          }
        }
      }
      ref3 = _.uniq(potentials);
      results = [];
      for (k = 0, len2 = ref3.length; k < len2; k++) {
        v = ref3[k];
        results.push(v.detectDirty());
      }
      return results;
    };

    ConflictedEditor.prototype.acceptCurrent = function() {
      var duplicates, i, len, seen, side, sides;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      sides = this.active();
      duplicates = [];
      seen = {};
      for (i = 0, len = sides.length; i < len; i++) {
        side = sides[i];
        if (side.conflict in seen) {
          duplicates.push(side);
          duplicates.push(seen[side.conflict]);
        }
        seen[side.conflict] = side;
      }
      sides = _.difference(sides, duplicates);
      return this.editor.transact(function() {
        var j, len1, results;
        results = [];
        for (j = 0, len1 = sides.length; j < len1; j++) {
          side = sides[j];
          results.push(side.resolve());
        }
        return results;
      });
    };

    ConflictedEditor.prototype.acceptOurs = function() {
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      return this.editor.transact((function(_this) {
        return function() {
          var i, len, ref1, results, side;
          ref1 = _this.active();
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            side = ref1[i];
            results.push(side.conflict.ours.resolve());
          }
          return results;
        };
      })(this));
    };

    ConflictedEditor.prototype.acceptTheirs = function() {
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      return this.editor.transact((function(_this) {
        return function() {
          var i, len, ref1, results, side;
          ref1 = _this.active();
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            side = ref1[i];
            results.push(side.conflict.theirs.resolve());
          }
          return results;
        };
      })(this));
    };

    ConflictedEditor.prototype.acceptOursThenTheirs = function() {
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      return this.editor.transact((function(_this) {
        return function() {
          var i, len, ref1, results, side;
          ref1 = _this.active();
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            side = ref1[i];
            results.push(_this.combineSides(side.conflict.ours, side.conflict.theirs));
          }
          return results;
        };
      })(this));
    };

    ConflictedEditor.prototype.acceptTheirsThenOurs = function() {
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      return this.editor.transact((function(_this) {
        return function() {
          var i, len, ref1, results, side;
          ref1 = _this.active();
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            side = ref1[i];
            results.push(_this.combineSides(side.conflict.theirs, side.conflict.ours));
          }
          return results;
        };
      })(this));
    };

    ConflictedEditor.prototype.nextUnresolved = function() {
      var c, final, firstAfter, i, lastCursor, len, n, orderedCursors, p, pos, ref1, target;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      final = _.last(this.active());
      if (final != null) {
        n = final.conflict.navigator.nextUnresolved();
        if (n != null) {
          return this.focusConflict(n);
        }
      } else {
        orderedCursors = _.sortBy(this.editor.getCursors(), function(c) {
          return c.getBufferPosition().row;
        });
        lastCursor = _.last(orderedCursors);
        if (lastCursor == null) {
          return;
        }
        pos = lastCursor.getBufferPosition();
        firstAfter = null;
        ref1 = this.conflicts;
        for (i = 0, len = ref1.length; i < len; i++) {
          c = ref1[i];
          p = c.ours.marker.getBufferRange().start;
          if (p.isGreaterThanOrEqual(pos) && (firstAfter == null)) {
            firstAfter = c;
          }
        }
        if (firstAfter == null) {
          return;
        }
        if (firstAfter.isResolved()) {
          target = firstAfter.navigator.nextUnresolved();
        } else {
          target = firstAfter;
        }
        if (target == null) {
          return;
        }
        return this.focusConflict(target);
      }
    };

    ConflictedEditor.prototype.previousUnresolved = function() {
      var c, firstCursor, i, initial, lastBefore, len, orderedCursors, p, pos, ref1, target;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      initial = _.first(this.active());
      if (initial != null) {
        p = initial.conflict.navigator.previousUnresolved();
        if (p != null) {
          return this.focusConflict(p);
        }
      } else {
        orderedCursors = _.sortBy(this.editor.getCursors(), function(c) {
          return c.getBufferPosition().row;
        });
        firstCursor = _.first(orderedCursors);
        if (firstCursor == null) {
          return;
        }
        pos = firstCursor.getBufferPosition();
        lastBefore = null;
        ref1 = this.conflicts;
        for (i = 0, len = ref1.length; i < len; i++) {
          c = ref1[i];
          p = c.ours.marker.getBufferRange().start;
          if (p.isLessThanOrEqual(pos)) {
            lastBefore = c;
          }
        }
        if (lastBefore == null) {
          return;
        }
        if (lastBefore.isResolved()) {
          target = lastBefore.navigator.previousUnresolved();
        } else {
          target = lastBefore;
        }
        if (target == null) {
          return;
        }
        return this.focusConflict(target);
      }
    };

    ConflictedEditor.prototype.revertCurrent = function() {
      var i, len, ref1, results, side, view;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      ref1 = this.active();
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        side = ref1[i];
        results.push((function() {
          var j, len1, ref2, results1;
          ref2 = this.coveringViews;
          results1 = [];
          for (j = 0, len1 = ref2.length; j < len1; j++) {
            view = ref2[j];
            if (view.conflict() === side.conflict) {
              if (view.isDirty()) {
                results1.push(view.revert());
              } else {
                results1.push(void 0);
              }
            }
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    ConflictedEditor.prototype.active = function() {
      var c, i, j, len, len1, matching, p, positions, ref1;
      positions = (function() {
        var i, len, ref1, results;
        ref1 = this.editor.getCursors();
        results = [];
        for (i = 0, len = ref1.length; i < len; i++) {
          c = ref1[i];
          results.push(c.getBufferPosition());
        }
        return results;
      }).call(this);
      matching = [];
      ref1 = this.conflicts;
      for (i = 0, len = ref1.length; i < len; i++) {
        c = ref1[i];
        for (j = 0, len1 = positions.length; j < len1; j++) {
          p = positions[j];
          if (c.ours.marker.getBufferRange().containsPoint(p)) {
            matching.push(c.ours);
          }
          if (c.theirs.marker.getBufferRange().containsPoint(p)) {
            matching.push(c.theirs);
          }
        }
      }
      return matching;
    };

    ConflictedEditor.prototype.combineSides = function(first, second) {
      var e, insertPoint, text;
      text = this.editor.getTextInBufferRange(second.marker.getBufferRange());
      e = first.marker.getBufferRange().end;
      insertPoint = this.editor.setTextInBufferRange([e, e], text).end;
      first.marker.setHeadBufferPosition(insertPoint);
      first.followingMarker.setTailBufferPosition(insertPoint);
      return first.resolve();
    };

    ConflictedEditor.prototype.focusConflict = function(conflict) {
      var st;
      st = conflict.ours.marker.getBufferRange().start;
      this.editor.scrollToBufferPosition(st, {
        center: true
      });
      return this.editor.setCursorBufferPosition(st, {
        autoscroll: false
      });
    };

    return ConflictedEditor;

  })();

  module.exports = {
    ConflictedEditor: ConflictedEditor
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi9jb25mbGljdGVkLWVkaXRvci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLElBQUssT0FBQSxDQUFRLFdBQVI7O0VBQ04sQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFDSixNQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLHFCQUFELEVBQVU7O0VBRVQsV0FBWSxPQUFBLENBQVEsWUFBUjs7RUFFWixXQUFZLE9BQUEsQ0FBUSxrQkFBUjs7RUFDWixpQkFBa0IsT0FBQSxDQUFRLHdCQUFSOztFQUNsQixlQUFnQixPQUFBLENBQVEsc0JBQVI7O0VBSVg7SUFTUywwQkFBQyxLQUFELEVBQVMsR0FBVCxFQUFlLE1BQWY7TUFBQyxJQUFDLENBQUEsUUFBRDtNQUFRLElBQUMsQ0FBQSxNQUFEO01BQU0sSUFBQyxDQUFBLFNBQUQ7TUFDMUIsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJO01BQ1osSUFBQyxDQUFBLGFBQUQsR0FBaUI7TUFDakIsSUFBQyxDQUFBLFNBQUQsR0FBYTtJQUhGOzsrQkFZYixJQUFBLEdBQU0sU0FBQTtBQUNKLFVBQUE7TUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLFFBQVEsQ0FBQyxHQUFULENBQWEsSUFBQyxDQUFBLEtBQWQsRUFBcUIsSUFBQyxDQUFBLE1BQXRCO01BRWIsSUFBQyxDQUFBLGFBQUQsR0FBaUI7QUFDakI7QUFBQSxXQUFBLHNDQUFBOztRQUNFLElBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUF3QixJQUFBLFFBQUEsQ0FBUyxDQUFDLENBQUMsSUFBWCxFQUFpQixJQUFDLENBQUEsTUFBbEIsQ0FBeEI7UUFDQSxJQUFxRCxjQUFyRDtVQUFBLElBQUMsQ0FBQSxhQUFhLENBQUMsSUFB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dXJjZXNDb250ZW50IjpbInskfSA9IHJlcXVpcmUgJ3NwYWNlLXBlbidcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG57RW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG57Q29uZmxpY3R9ID0gcmVxdWlyZSAnLi9jb25mbGljdCdcblxue1NpZGVWaWV3fSA9IHJlcXVpcmUgJy4vdmlldy9zaWRlLXZpZXcnXG57TmF2aWdhdGlvblZpZXd9ID0gcmVxdWlyZSAnLi92aWV3L25hdmlnYXRpb24tdmlldydcbntSZXNvbHZlclZpZXd9ID0gcmVxdWlyZSAnLi92aWV3L3Jlc29sdmVyLXZpZXcnXG5cbiMgUHVibGljOiBNZWRpYXRlIGNvbmZsaWN0LXJlbGF0ZWQgZGVjb3JhdGlvbnMgYW5kIGV2ZW50cyBvbiBiZWhhbGYgb2YgYSBzcGVjaWZpYyBUZXh0RWRpdG9yLlxuI1xuY2xhc3MgQ29uZmxpY3RlZEVkaXRvclxuXG4gICMgUHVibGljOiBJbnN0YW50aWF0ZSBhIG5ldyBDb25mbGljdGVkRWRpdG9yIHRvIG1hbmFnZSB0aGUgZGVjb3JhdGlvbnMgYW5kIGV2ZW50cyBvZiBhIHNwZWNpZmljXG4gICMgVGV4dEVkaXRvci5cbiAgI1xuICAjIHN0YXRlIFtNZXJnZVN0YXRlXSAtIE1lcmdlLXdpZGUgY29uZmxpY3Qgc3RhdGUuXG4gICMgcGtnIFtFbWl0dGVyXSAtIFRoZSBwYWNrYWdlIG9iamVjdCBjb250YWluaW5nIGV2ZW50IGRpc3BhdGNoIGFuZCBzdWJzY3JpcHRpb24gbWV0aG9kcy5cbiAgIyBlZGl0b3IgW1RleHRFZGl0b3JdIC0gQW4gZWRpdG9yIGNvbnRhaW5pbmcgdGV4dCB0aGF0LCBwcmVzdW1hYmx5LCBpbmNsdWRlcyBjb25mbGljdCBtYXJrZXJzLlxuICAjXG4gIGNvbnN0cnVjdG9yOiAoQHN0YXRlLCBAcGtnLCBAZWRpdG9yKSAtPlxuICAgIEBzdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAY292ZXJpbmdWaWV3cyA9IFtdXG4gICAgQGNvbmZsaWN0cyA9IFtdXG5cbiAgIyBQdWJsaWM6IExvY2F0ZSBDb25mbGljdHMgd2l0aGluIHRoaXMgc3BlY2lmaWMgVGV4dEVkaXRvci5cbiAgI1xuICAjIEluc3RhbGwgYSBwYWlyIG9mIFNpZGVWaWV3cyBhbmQgYSBOYXZpZ2F0aW9uVmlldyBmb3IgZWFjaCBDb25mbGljdCBkaXNjb3ZlcmVkIHdpdGhpbiB0aGVcbiAgIyBlZGl0b3IncyB0ZXh0LiBTdWJzY3JpYmUgdG8gcGFja2FnZSBldmVudHMgcmVsYXRlZCB0byByZWxldmFudCBDb25mbGljdHMgYW5kIGJyb2FkY2FzdFxuICAjIHBlci1lZGl0b3IgcHJvZ3Jlc3MgZXZlbnRzIGFzIHRoZXkgYXJlIHJlc29sdmVkLiBJbnN0YWxsIEF0b20gY29tbWFuZHMgcmVsYXRlZCB0byBjb25mbGljdFxuICAjIG5hdmlnYXRpb24gYW5kIHJlc29sdXRpb24uXG4gICNcbiAgbWFyazogLT5cbiAgICBAY29uZmxpY3RzID0gQ29uZmxpY3QuYWxsKEBzdGF0ZSwgQGVkaXRvcilcblxuICAgIEBjb3ZlcmluZ1ZpZXdzID0gW11cbiAgICBmb3IgYyBpbiBAY29uZmxpY3RzXG4gICAgICBAY292ZXJpbmdWaWV3cy5wdXNoIG5ldyBTaWRlVmlldyhjLm91cnMsIEBlZGl0b3IpXG4gICAgICBAY292ZXJpbmdWaWV3cy5wdXNoIG5ldyBTaWRlVmlldyhjLmJhc2UsIEBlZGl0b3IpIGlmIGMuYmFzZT9cbiAgICAgIEBjb3ZlcmluZ1ZpZXdzLnB1c2ggbmV3IE5hdmlnYXRpb25WaWV3KGMubmF2aWdhdG9yLCBAZWRpdG9yKVxuICAgICAgQGNvdmVyaW5nVmlld3MucHVzaCBuZXcgU2lkZVZpZXcoYy50aGVpcnMsIEBlZGl0b3IpXG5cbiAgICAgIEBzdWJzLmFkZCBjLm9uRGlkUmVzb2x2ZUNvbmZsaWN0ID0+XG4gICAgICAgIHVucmVzb2x2ZWQgPSAodiBmb3IgdiBpbiBAY292ZXJpbmdWaWV3cyB3aGVuIG5vdCB2LmNvbmZsaWN0KCkuaXNSZXNvbHZlZCgpKVxuICAgICAgICByZXNvbHZlZENvdW50ID0gQGNvbmZsaWN0cy5sZW5ndGggLSBNYXRoLmZsb29yKHVucmVzb2x2ZWQubGVuZ3RoIC8gMylcbiAgICAgICAgQHBrZy5kaWRSZXNvbHZlQ29uZmxpY3RcbiAgICAgICAgICBmaWxlOiBAZWRpdG9yLmdldFBhdGgoKSxcbiAgICAgICAgICB0b3RhbDogQGNvbmZsaWN0cy5sZW5ndGgsIHJlc29sdmVkOiByZXNvbHZlZENvdW50LFxuICAgICAgICAgIHNvdXJjZTogdGhpc1xuXG4gICAgaWYgQGNvbmZsaWN0cy5sZW5ndGggPiAwXG4gICAgICBhdG9tLnZpZXdzLmdldFZpZXcoQGVkaXRvcikuY2xhc3NMaXN0LmFkZCAnY29uZmxpY3RlZCdcblxuICAgICAgY3YuZGVjb3JhdGUoKSBmb3IgY3YgaW4gQGNvdmVyaW5nVmlld3NcbiAgICAgIEBpbnN0YWxsRXZlbnRzKClcbiAgICAgIEBmb2N1c0NvbmZsaWN0IEBjb25mbGljdHNbMF1cbiAgICBlbHNlXG4gICAgICBAcGtnLmRpZFJlc29sdmVDb25mbGljdFxuICAgICAgICBmaWxlOiBAZWRpdG9yLmdldFBhdGgoKSxcbiAgICAgICAgdG90YWw6IDEsIHJlc29sdmVkOiAxLFxuICAgICAgICBzb3VyY2U6IHRoaXNcbiAgICAgIEBjb25mbGljdHNSZXNvbHZlZCgpXG5cbiAgIyBQcml2YXRlOiBJbnN0YWxsIEF0b20gY29tbWFuZHMgcmVsYXRlZCB0byBDb25mbGljdCByZXNvbHV0aW9uIGFuZCBuYXZpZ2F0aW9uIG9uIHRoZSBUZXh0RWRpdG9yLlxuICAjXG4gICMgTGlzdGVuIGZvciBwYWNrYWdlLWdsb2JhbCBldmVudHMgdGhhdCByZWxhdGUgdG8gdGhlIGxvY2FsIENvbmZsaWN0cyBhbmQgZGlzcGF0Y2ggdGhlbVxuICAjIGFwcHJvcHJpYXRlbHkuXG4gICNcbiAgaW5zdGFsbEV2ZW50czogLT5cbiAgICBAc3Vicy5hZGQgQGVkaXRvci5vbkRpZFN0b3BDaGFuZ2luZyA9PiBAZGV0ZWN0RGlydHkoKVxuICAgIEBzdWJzLmFkZCBAZWRpdG9yLm9uRGlkRGVzdHJveSA9PiBAY2xlYW51cCgpXG5cbiAgICBAc3Vicy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLFxuICAgICAgJ21lcmdlLWNvbmZsaWN0czphY2NlcHQtY3VycmVudCc6ID0+IEBhY2NlcHRDdXJyZW50KCksXG4gICAgICAnbWVyZ2UtY29uZmxpY3RzOmFjY2VwdC1vdXJzJzogPT4gQGFjY2VwdE91cnMoKSxcbiAgICAgICdtZXJnZS1jb25mbGljdHM6YWNjZXB0LXRoZWlycyc6ID0+IEBhY2NlcHRUaGVpcnMoKSxcbiAgICAgICdtZXJnZS1jb25mbGljdHM6b3Vycy10aGVuLXRoZWlycyc6ID0+IEBhY2NlcHRPdXJzVGhlblRoZWlycygpLFxuICAgICAgJ21lcmdlLWNvbmZsaWN0czp0aGVpcnMtdGhlbi1vdXJzJzogPT4gQGFjY2VwdFRoZWlyc1RoZW5PdXJzKCksXG4gICAgICAnbWVyZ2UtY29uZmxpY3RzOm5leHQtdW5yZXNvbHZlZCc6ID0+IEBuZXh0VW5yZXNvbHZlZCgpLFxuICAgICAgJ21lcmdlLWNvbmZsaWN0czpwcmV2aW91cy11bnJlc29sdmVkJzogPT4gQHByZXZpb3VzVW5yZXNvbHZlZCgpLFxuICAgICAgJ21lcmdlLWNvbmZsaWN0czpyZXZlcnQtY3VycmVudCc6ID0+IEByZXZlcnRDdXJyZW50KClcblxuICAgIEBzdWJzLmFkZCBAcGtnLm9uRGlkUmVzb2x2ZUNvbmZsaWN0ICh7dG90YWwsIHJlc29sdmVkLCBmaWxlfSkgPT5cbiAgICAgIGlmIGZpbGUgaXMgQGVkaXRvci5nZXRQYXRoKCkgYW5kIHRvdGFsIGlzIHJlc29sdmVkXG4gICAgICAgIEBjb25mbGljdHNSZXNvbHZlZCgpXG5cbiAgICBAc3Vicy5hZGQgQHBrZy5vbkRpZENvbXBsZXRlQ29uZmxpY3RSZXNvbHV0aW9uID0+IEBjbGVhbnVwKClcbiAgICBAc3Vicy5hZGQgQHBrZy5vbkRpZFF1aXRDb25mbGljdFJlc29sdXRpb24gPT4gQGNsZWFudXAoKVxuXG4gICMgUHJpdmF0ZTogVW5kbyBhbnkgY2hhbmdlcyBkb25lIHRvIHRoZSB1bmRlcmx5aW5nIFRleHRFZGl0b3IuXG4gICNcbiAgY2xlYW51cDogLT5cbiAgICBhdG9tLnZpZXdzLmdldFZpZXcoQGVkaXRvcikuY2xhc3NMaXN0LnJlbW92ZSAnY29uZmxpY3RlZCcgaWYgQGVkaXRvcj9cblxuICAgIGZvciBjIGluIEBjb25mbGljdHNcbiAgICAgIG0uZGVzdHJveSgpIGZvciBtIGluIGMubWFya2VycygpXG5cbiAgICB2LnJlbW92ZSgpIGZvciB2IGluIEBjb3ZlcmluZ1ZpZXdzXG5cbiAgICBAc3Vicy5kaXNwb3NlKClcblxuICAjIFByaXZhdGU6IEV2ZW50IGhhbmRsZXIgaW52b2tlZCB3aGVuIGFsbCBjb25mbGljdHMgaW4gdGhpcyBmaWxlIGhhdmUgYmVlbiByZXNvbHZlZC5cbiAgI1xuICBjb25mbGljdHNSZXNvbHZlZDogLT5cbiAgICBhdG9tLndvcmtzcGFjZS5hZGRUb3BQYW5lbCBpdGVtOiBuZXcgUmVzb2x2ZXJWaWV3KEBlZGl0b3IsIEBzdGF0ZSwgQHBrZylcblxuICBkZXRlY3REaXJ0eTogLT5cbiAgICAjIE9ubHkgZGV0ZWN0IGRpcnR5IHJlZ2lvbnMgd2l0aGluIENvdmVyaW5nVmlld3MgdGhhdCBoYXZlIGEgY3Vyc29yIHdpdGhpbiB0aGVtLlxuICAgIHBvdGVudGlhbHMgPSBbXVxuICAgIGZvciBjIGluIEBlZGl0b3IuZ2V0Q3Vyc29ycygpXG4gICAgICBmb3IgdiBpbiBAY292ZXJpbmdWaWV3c1xuICAgICAgICBwb3RlbnRpYWxzLnB1c2godikgaWYgdi5pbmNsdWRlc0N1cnNvcihjKVxuXG4gICAgdi5kZXRlY3REaXJ0eSgpIGZvciB2IGluIF8udW5pcShwb3RlbnRpYWxzKVxuXG4gICMgUHJpdmF0ZTogQ29tbWFuZCB0aGF0IGFjY2VwdHMgZWFjaCBzaWRlIG9mIGEgY29uZmxpY3QgdGhhdCBjb250YWlucyBhIGN1cnNvci5cbiAgI1xuICAjIENvbmZsaWN0cyB3aXRoIGN1cnNvcnMgaW4gYm90aCBzaWRlcyB3aWxsIGJlIGlnbm9yZWQuXG4gICNcbiAgYWNjZXB0Q3VycmVudDogLT5cbiAgICByZXR1cm4gdW5sZXNzIEBlZGl0b3IgaXMgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICBzaWRlcyA9IEBhY3RpdmUoKVxuXG4gICAgIyBEbyBub3RoaW5nIGlmIHlvdSBoYXZlIGN1cnNvcnMgaW4gKmJvdGgqIHNpZGVzIG9mIGEgc2luZ2xlIGNvbmZsaWN0LlxuICAgIGR1cGxpY2F0ZXMgPSBbXVxuICAgIHNlZW4gPSB7fVxuICAgIGZvciBzaWRlIGluIHNpZGVzXG4gICAgICBpZiBzaWRlLmNvbmZsaWN0IG9mIHNlZW5cbiAgICAgICAgZHVwbGljYXRlcy5wdXNoIHNpZGVcbiAgICAgICAgZHVwbGljYXRlcy5wdXNoIHNlZW5bc2lkZS5jb25mbGljdF1cbiAgICAgIHNlZW5bc2lkZS5jb25mbGljdF0gPSBzaWRlXG4gICAgc2lkZXMgPSBfLmRpZmZlcmVuY2Ugc2lkZXMsIGR1cGxpY2F0ZXNcblxuICAgIEBlZGl0b3IudHJhbnNhY3QgLT5cbiAgICAgIHNpZGUucmVzb2x2ZSgpIGZvciBzaWRlIGluIHNpZGVzXG5cbiAgIyBQcml2YXRlOiBDb21tYW5kIHRoYXQgYWNjZXB0cyB0aGUgXCJvdXJzXCIgc2lkZSBvZiB0aGUgYWN0aXZlIGNvbmZsaWN0LlxuICAjXG4gIGFjY2VwdE91cnM6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAZWRpdG9yIGlzIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBlZGl0b3IudHJhbnNhY3QgPT5cbiAgICAgIHNpZGUuY29uZmxpY3Qub3Vycy5yZXNvbHZlKCkgZm9yIHNpZGUgaW4gQGFjdGl2ZSgpXG5cbiAgIyBQcml2YXRlOiBDb21tYW5kIHRoYXQgYWNjZXB0cyB0aGUgXCJ0aGVpcnNcIiBzaWRlIG9mIHRoZSBhY3RpdmUgY29uZmxpY3QuXG4gICNcbiAgYWNjZXB0VGhlaXJzOiAtPlxuICAgIHJldHVybiB1bmxlc3MgQGVkaXRvciBpcyBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBzaWRlLmNvbmZsaWN0LnRoZWlycy5yZXNvbHZlKCkgZm9yIHNpZGUgaW4gQGFjdGl2ZSgpXG5cbiAgIyBQcml2YXRlOiBDb21tYW5kIHRoYXQgdXNlcyBhIGNvbXBvc2l0ZSByZXNvbHV0aW9uIG9mIHRoZSBcIm91cnNcIiBzaWRlIGZvbGxvd2VkIGJ5IHRoZSBcInRoZWlyc1wiXG4gICMgc2lkZSBvZiB0aGUgYWN0aXZlIGNvbmZsaWN0LlxuICAjXG4gIGFjY2VwdE91cnNUaGVuVGhlaXJzOiAtPlxuICAgIHJldHVybiB1bmxlc3MgQGVkaXRvciBpcyBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBmb3Igc2lkZSBpbiBAYWN0aXZlKClcbiAgICAgICAgQGNvbWJpbmVTaWRlcyBzaWRlLmNvbmZsaWN0Lm91cnMsIHNpZGUuY29uZmxpY3QudGhlaXJzXG5cbiAgIyBQcml2YXRlOiBDb21tYW5kIHRoYXQgdXNlcyBhIGNvbXBvc2l0ZSByZXNvbHV0aW9uIG9mIHRoZSBcInRoZWlyc1wiIHNpZGUgZm9sbG93ZWQgYnkgdGhlIFwib3Vyc1wiXG4gICMgc2lkZSBvZiB0aGUgYWN0aXZlIGNvbmZsaWN0LlxuICAjXG4gIGFjY2VwdFRoZWlyc1RoZW5PdXJzOiAtPlxuICAgIHJldHVybiB1bmxlc3MgQGVkaXRvciBpcyBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBmb3Igc2lkZSBpbiBAYWN0aXZlKClcbiAgICAgICAgQGNvbWJpbmVTaWRlcyBzaWRlLmNvbmZsaWN0LnRoZWlycywgc2lkZS5jb25mbGljdC5vdXJzXG5cbiAgIyBQcml2YXRlOiBDb21tYW5kIHRoYXQgbmF2aWdhdGVzIHRvIHRoZSBuZXh0IHVucmVzb2x2ZWQgY29uZmxpY3QgaW4gdGhlIGVkaXRvci5cbiAgI1xuICAjIElmIHRoZSBjdXJzb3IgaXMgb24gb3IgYWZ0ZXIgdGhlIGZpbmFsIHVucmVzb2x2ZWQgY29uZmxpY3QgaW4gdGhlIGVkaXRvciwgbm90aGluZyBoYXBwZW5zLlxuICAjXG4gIG5leHRVbnJlc29sdmVkOiAtPlxuICAgIHJldHVybiB1bmxlc3MgQGVkaXRvciBpcyBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBmaW5hbCA9IF8ubGFzdCBAYWN0aXZlKClcbiAgICBpZiBmaW5hbD9cbiAgICAgIG4gPSBmaW5hbC5jb25mbGljdC5uYXZpZ2F0b3IubmV4dFVucmVzb2x2ZWQoKVxuICAgICAgQGZvY3VzQ29uZmxpY3QobikgaWYgbj9cbiAgICBlbHNlXG4gICAgICBvcmRlcmVkQ3Vyc29ycyA9IF8uc29ydEJ5IEBlZGl0b3IuZ2V0Q3Vyc29ycygpLCAoYykgLT5cbiAgICAgICAgYy5nZXRCdWZmZXJQb3NpdGlvbigpLnJvd1xuICAgICAgbGFzdEN1cnNvciA9IF8ubGFzdCBvcmRlcmVkQ3Vyc29yc1xuICAgICAgcmV0dXJuIHVubGVzcyBsYXN0Q3Vyc29yP1xuXG4gICAgICBwb3MgPSBsYXN0Q3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICAgIGZpcnN0QWZ0ZXIgPSBudWxsXG4gICAgICBmb3IgYyBpbiBAY29uZmxpY3RzXG4gICAgICAgIHAgPSBjLm91cnMubWFya2VyLmdldEJ1ZmZlclJhbmdlKCkuc3RhcnRcbiAgICAgICAgaWYgcC5pc0dyZWF0ZXJUaGFuT3JFcXVhbChwb3MpIGFuZCBub3QgZmlyc3RBZnRlcj9cbiAgICAgICAgICBmaXJzdEFmdGVyID0gY1xuICAgICAgcmV0dXJuIHVubGVzcyBmaXJzdEFmdGVyP1xuXG4gICAgICBpZiBmaXJzdEFmdGVyLmlzUmVzb2x2ZWQoKVxuICAgICAgICB0YXJnZXQgPSBmaXJzdEFmdGVyLm5hdmlnYXRvci5uZXh0VW5yZXNvbHZlZCgpXG4gICAgICBlbHNlXG4gICAgICAgIHRhcmdldCA9IGZpcnN0QWZ0ZXJcbiAgICAgIHJldHVybiB1bmxlc3MgdGFyZ2V0P1xuXG4gICAgICBAZm9jdXNDb25mbGljdCB0YXJnZXRcblxuICAjIFByaXZhdGU6IENvbW1hbmQgdGhhdCBuYXZpZ2F0ZXMgdG8gdGhlIHByZXZpb3VzIHVucmVzb2x2ZWQgY29uZmxpY3QgaW4gdGhlIGVkaXRvci5cbiAgI1xuICAjIElmIHRoZSBjdXJzb3IgaXMgb24gb3IgYmVmb3JlIHRoZSBmaXJzdCB1bnJlc29sdmVkIGNvbmZsaWN0IGluIHRoZSBlZGl0b3IsIG5vdGhpbmcgaGFwcGVucy5cbiAgI1xuICBwcmV2aW91c1VucmVzb2x2ZWQ6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAZWRpdG9yIGlzIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGluaXRpYWwgPSBfLmZpcnN0IEBhY3RpdmUoKVxuICAgIGlmIGluaXRpYWw/XG4gICAgICBwID0gaW5pdGlhbC5jb25mbGljdC5uYXZpZ2F0b3IucHJldmlvdXNVbnJlc29sdmVkKClcbiAgICAgIEBmb2N1c0NvbmZsaWN0KHApIGlmIHA/XG4gICAgZWxzZVxuICAgICAgb3JkZXJlZEN1cnNvcnMgPSBfLnNvcnRCeSBAZWRpdG9yLmdldEN1cnNvcnMoKSwgKGMpIC0+XG4gICAgICAgIGMuZ2V0QnVmZmVyUG9zaXRpb24oKS5yb3dcbiAgICAgIGZpcnN0Q3Vyc29yID0gXy5maXJzdCBvcmRlcmVkQ3Vyc29yc1xuICAgICAgcmV0dXJuIHVubGVzcyBmaXJzdEN1cnNvcj9cblxuICAgICAgcG9zID0gZmlyc3RDdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgICAgbGFzdEJlZm9yZSA9IG51bGxcbiAgICAgIGZvciBjIGluIEBjb25mbGljdHNcbiAgICAgICAgcCA9IGMub3Vycy5tYXJrZXIuZ2V0QnVmZmVyUmFuZ2UoKS5zdGFydFxuICAgICAgICBpZiBwLmlzTGVzc1RoYW5PckVxdWFsIHBvc1xuICAgICAgICAgIGxhc3RCZWZvcmUgPSBjXG4gICAgICByZXR1cm4gdW5sZXNzIGxhc3RCZWZvcmU/XG5cbiAgICAgIGlmIGxhc3RCZWZvcmUuaXNSZXNvbHZlZCgpXG4gICAgICAgIHRhcmdldCA9IGxhc3RCZWZvcmUubmF2aWdhdG9yLnByZXZpb3VzVW5yZXNvbHZlZCgpXG4gICAgICBlbHNlXG4gICAgICAgIHRhcmdldCA9IGxhc3RCZWZvcmVcbiAgICAgIHJldHVybiB1bmxlc3MgdGFyZ2V0P1xuXG4gICAgICBAZm9jdXNDb25mbGljdCB0YXJnZXRcblxuICAjIFByaXZhdGU6IFJldmVydCBtYW51YWwgZWRpdHMgdG8gdGhlIGN1cnJlbnQgc2lkZSBvZiB0aGUgYWN0aXZlIGNvbmZsaWN0LlxuICAjXG4gIHJldmVydEN1cnJlbnQ6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAZWRpdG9yIGlzIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGZvciBzaWRlIGluIEBhY3RpdmUoKVxuICAgICAgZm9yIHZpZXcgaW4gQGNvdmVyaW5nVmlld3Mgd2hlbiB2aWV3LmNvbmZsaWN0KCkgaXMgc2lkZS5jb25mbGljdFxuICAgICAgICB2aWV3LnJldmVydCgpIGlmIHZpZXcuaXNEaXJ0eSgpXG5cbiAgIyBQcml2YXRlOiBDb2xsZWN0IGEgbGlzdCBvZiBlYWNoIFNpZGUgb2YgYW55IENvbmZsaWN0IHdpdGhpbiB0aGUgZWRpdG9yIHRoYXQgY29udGFpbnMgYSBjdXJzb3IuXG4gICNcbiAgIyBSZXR1cm5zIFtBcnJheTxTaWRlPl1cbiAgI1xuICBhY3RpdmU6IC0+XG4gICAgcG9zaXRpb25zID0gKGMuZ2V0QnVmZmVyUG9zaXRpb24oKSBmb3IgYyBpbiBAZWRpdG9yLmdldEN1cnNvcnMoKSlcbiAgICBtYXRjaGluZyA9IFtdXG4gICAgZm9yIGMgaW4gQGNvbmZsaWN0c1xuICAgICAgZm9yIHAgaW4gcG9zaXRpb25zXG4gICAgICAgIGlmIGMub3Vycy5tYXJrZXIuZ2V0QnVmZmVyUmFuZ2UoKS5jb250YWluc1BvaW50IHBcbiAgICAgICAgICBtYXRjaGluZy5wdXNoIGMub3Vyc1xuICAgICAgICBpZiBjLnRoZWlycy5tYXJrZXIuZ2V0QnVmZmVyUmFuZ2UoKS5jb250YWluc1BvaW50IHBcbiAgICAgICAgICBtYXRjaGluZy5wdXNoIGMudGhlaXJzXG4gICAgbWF0Y2hpbmdcblxuICAjIFByaXZhdGU6IFJlc29sdmUgYSBjb25mbGljdCBieSBjb21iaW5pbmcgaXRzIHR3byBTaWRlcyBpbiBhIHNwZWNpZmljIG9yZGVyLlxuICAjXG4gICMgZmlyc3QgW1NpZGVdIFRoZSBTaWRlIHRoYXQgc2hvdWxkIG9jY3VyIGZpcnN0IGluIHRoZSByZXNvbHZlZCB0ZXh0LlxuICAjIHNlY29uZCBbU2lkZV0gVGhlIFNpZGUgYmVsb25naW5nIHRvIHRoZSBzYW1lIENvbmZsaWN0IHRoYXQgc2hvdWxkIG9jY3VyIHNlY29uZCBpbiB0aGUgcmVzb2x2ZWRcbiAgIyAgIHRleHQuXG4gICNcbiAgY29tYmluZVNpZGVzOiAoZmlyc3QsIHNlY29uZCkgLT5cbiAgICB0ZXh0ID0gQGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZSBzZWNvbmQubWFya2VyLmdldEJ1ZmZlclJhbmdlKClcbiAgICBlID0gZmlyc3QubWFya2VyLmdldEJ1ZmZlclJhbmdlKCkuZW5kXG4gICAgaW5zZXJ0UG9pbnQgPSBAZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKFtlLCBlXSwgdGV4dCkuZW5kXG4gICAgZmlyc3QubWFya2VyLnNldEhlYWRCdWZmZXJQb3NpdGlvbiBpbnNlcnRQb2ludFxuICAgIGZpcnN0LmZvbGxvd2luZ01hcmtlci5zZXRUYWlsQnVmZmVyUG9zaXRpb24gaW5zZXJ0UG9pbnRcbiAgICBmaXJzdC5yZXNvbHZlKClcblxuICAjIFByaXZhdGU6IFNjcm9sbCB0aGUgZWRpdG9yIGFuZCBwbGFjZSB0aGUgY3Vyc29yIGF0IHRoZSBiZWdpbm5pbmcgb2YgYSBtYXJrZWQgY29uZmxpY3QuXG4gICNcbiAgIyBjb25mbGljdCBbQ29uZmxpY3RdIEFueSBjb25mbGljdCB3aXRoaW4gdGhlIGN1cnJlbnQgZWRpdG9yLlxuICAjXG4gIGZvY3VzQ29uZmxpY3Q6IChjb25mbGljdCkgLT5cbiAgICBzdCA9IGNvbmZsaWN0Lm91cnMubWFya2VyLmdldEJ1ZmZlclJhbmdlKCkuc3RhcnRcbiAgICBAZWRpdG9yLnNjcm9sbFRvQnVmZmVyUG9zaXRpb24gc3QsIGNlbnRlcjogdHJ1ZVxuICAgIEBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gc3QsIGF1dG9zY3JvbGw6IGZhbHNlXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgQ29uZmxpY3RlZEVkaXRvcjogQ29uZmxpY3RlZEVkaXRvclxuIl19
