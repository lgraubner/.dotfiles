(function() {
  var CompositeDisposable, Emitter, HighlightedAreaView, Range, StatusBarView, _, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ref = require('atom'), Range = ref.Range, CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter;

  _ = require('underscore-plus');

  StatusBarView = require('./status-bar-view');

  module.exports = HighlightedAreaView = (function() {
    function HighlightedAreaView() {
      this.listenForStatusBarChange = bind(this.listenForStatusBarChange, this);
      this.removeStatusBar = bind(this.removeStatusBar, this);
      this.setupStatusBar = bind(this.setupStatusBar, this);
      this.removeMarkers = bind(this.removeMarkers, this);
      this.handleSelection = bind(this.handleSelection, this);
      this.debouncedHandleSelection = bind(this.debouncedHandleSelection, this);
      this.setStatusBar = bind(this.setStatusBar, this);
      this.enable = bind(this.enable, this);
      this.disable = bind(this.disable, this);
      this.onDidRemoveAllMarkers = bind(this.onDidRemoveAllMarkers, this);
      this.onDidAddMarker = bind(this.onDidAddMarker, this);
      this.destroy = bind(this.destroy, this);
      this.emitter = new Emitter;
      this.views = [];
      this.enable();
      this.listenForTimeoutChange();
      this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          _this.debouncedHandleSelection();
          return _this.subscribeToActiveTextEditor();
        };
      })(this));
      this.subscribeToActiveTextEditor();
      this.listenForStatusBarChange();
    }

    HighlightedAreaView.prototype.destroy = function() {
      var ref1, ref2, ref3;
      clearTimeout(this.handleSelectionTimeout);
      this.activeItemSubscription.dispose();
      if ((ref1 = this.selectionSubscription) != null) {
        ref1.dispose();
      }
      if ((ref2 = this.statusBarView) != null) {
        ref2.removeElement();
      }
      if ((ref3 = this.statusBarTile) != null) {
        ref3.destroy();
      }
      return this.statusBarTile = null;
    };

    HighlightedAreaView.prototype.onDidAddMarker = function(callback) {
      return this.emitter.on('did-add-marker', callback);
    };

    HighlightedAreaView.prototype.onDidRemoveAllMarkers = function(callback) {
      return this.emitter.on('did-remove-all-markers', callback);
    };

    HighlightedAreaView.prototype.disable = function() {
      this.disabled = true;
      return this.removeMarkers();
    };

    HighlightedAreaView.prototype.enable = function() {
      this.disabled = false;
      return this.debouncedHandleSelection();
    };

    HighlightedAreaView.prototype.setStatusBar = function(statusBar) {
      this.statusBar = statusBar;
      return this.setupStatusBar();
    };

    HighlightedAreaView.prototype.debouncedHandleSelection = function() {
      clearTimeout(this.handleSelectionTimeout);
      return this.handleSelectionTimeout = setTimeout((function(_this) {
        return function() {
          return _this.handleSelection();
        };
      })(this), atom.config.get('highlight-selected.timeout'));
    };

    HighlightedAreaView.prototype.listenForTimeoutChange = function() {
      return atom.config.onDidChange('highlight-selected.timeout', (function(_this) {
        return function() {
          return _this.debouncedHandleSelection();
        };
      })(this));
    };

    HighlightedAreaView.prototype.subscribeToActiveTextEditor = function() {
      var editor, ref1;
      if ((ref1 = this.selectionSubscription) != null) {
        ref1.dispose();
      }
      editor = this.getActiveEditor();
      if (!editor) {
        return;
      }
      this.selectionSubscription = new CompositeDisposable;
      this.selectionSubscription.add(editor.onDidAddSelection(this.debouncedHandleSelection));
      this.selectionSubscription.add(editor.onDidChangeSelectionRange(this.debouncedHandleSelection));
      return this.handleSelection();
    };

    HighlightedAreaView.prototype.getActiveEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    HighlightedAreaView.prototype.handleSelection = function() {
      var editor, range, ref1, ref2, regex, regexFlags, regexSearch, result, resultCount, text;
      this.removeMarkers();
      if (this.disabled) {
        return;
      }
      editor = this.getActiveEditor();
      if (!editor) {
        return;
      }
      if (editor.getLastSelection().isEmpty()) {
        return;
      }
      if (!this.isWordSelected(editor.getLastSelection())) {
        return;
      }
      this.selections = editor.getSelections();
      text = _.escapeRegExp(this.selections[0].getText());
      regex = new RegExp("\\S*\\w*\\b", 'gi');
      result = regex.exec(text);
      if (result == null) {
        return;
      }
      if (result[0].length < atom.config.get('highlight-selected.minimumLength') || result.index !== 0 || result[0] !== result.input) {
        return;
      }
      regexFlags = 'g';
      if (atom.config.get('highlight-selected.ignoreCase')) {
        regexFlags = 'gi';
      }
      range = [[0, 0], editor.getEofBufferPosition()];
      this.ranges = [];
      regexSearch = result[0];
      if (atom.config.get('highlight-selected.onlyHighlightWholeWords')) {
        if (regexSearch.indexOf("\$") !== -1 && ((ref1 = editor.getGrammar()) != null ? ref1.name : void 0) === 'PHP') {
          regexSearch = regexSearch.replace("\$", "\$\\b");
        } else {
          regexSearch = "\\b" + regexSearch;
        }
        regexSearch = regexSearch + "\\b";
      }
      resultCount = 0;
      editor.scanInBufferRange(new RegExp(regexSearch, regexFlags), range, (function(_this) {
        return function(result) {
          var decoration, marker;
          resultCount += 1;
          if (!_this.showHighlightOnSelectedWord(result.range, _this.selections)) {
            marker = editor.markBufferRange(result.range);
            decoration = editor.decorateMarker(marker, {
              type: 'highlight',
              "class": _this.makeClasses()
            });
            _this.views.push(marker);
            return _this.emitter.emit('did-add-marker', marker);
          }
        };
      })(this));
      return (ref2 = this.statusBarElement) != null ? ref2.updateCount(resultCount) : void 0;
    };

    HighlightedAreaView.prototype.makeClasses = function() {
      var className;
      className = 'highlight-selected';
      if (atom.config.get('highlight-selected.lightTheme')) {
        className += ' light-theme';
      }
      if (atom.config.get('highlight-selected.highlightBackground')) {
        className += ' background';
      }
      return className;
    };

    HighlightedAreaView.prototype.showHighlightOnSelectedWord = function(range, selections) {
      var i, len, outcome, selection, selectionRange;
      if (!atom.config.get('highlight-selected.hideHighlightOnSelectedWord')) {
        return false;
      }
      outcome = false;
      for (i = 0, len = selections.length; i < len; i++) {
        selection = selections[i];
        selectionRange = selection.getBufferRange();
        outcome = (range.start.column === selectionRange.start.column) && (range.start.row === selectionRange.start.row) && (range.end.column === selectionRange.end.column) && (range.end.row === selectionRange.end.row);
        if (outcome) {
          break;
        }
      }
      return outcome;
    };

    HighlightedAreaView.prototype.removeMarkers = function() {
      var i, len, ref1, ref2, view;
      if (this.views == null) {
        return;
      }
      if (this.views.length === 0) {
        return;
      }
      ref1 = this.views;
      for (i = 0, len = ref1.length; i < len; i++) {
        view = ref1[i];
        view.destroy();
        view = null;
      }
      this.views = [];
      if ((ref2 = this.statusBarElement) != null) {
        ref2.updateCount(this.views.length);
      }
      return this.emitter.emit('did-remove-all-markers');
    };

    HighlightedAreaView.prototype.isWordSelected = function(selection) {
      var lineRange, nonWordCharacterToTheLeft, nonWordCharacterToTheRight, selectionRange;
      if (selection.getBufferRange().isSingleLine()) {
        selectionRange = selection.getBufferRange();
        lineRange = this.getActiveEditor().bufferRangeForBufferRow(selectionRange.start.row);
        nonWordCharacterToTheLeft = _.isEqual(selectionRange.start, lineRange.start) || this.isNonWordCharacterToTheLeft(selection);
        nonWordCharacterToTheRight = _.isEqual(selectionRange.end, lineRange.end) || this.isNonWordCharacterToTheRight(selection);
        return nonWordCharacterToTheLeft && nonWordCharacterToTheRight;
      } else {
        return false;
      }
    };

    HighlightedAreaView.prototype.isNonWordCharacter = function(character) {
      var nonWordCharacters;
      nonWordCharacters = atom.config.get('editor.nonWordCharacters');
      return new RegExp("[ \t" + (_.escapeRegExp(nonWordCharacters)) + "]").test(character);
    };

    HighlightedAreaView.prototype.isNonWordCharacterToTheLeft = function(selection) {
      var range, selectionStart;
      selectionStart = selection.getBufferRange().start;
      range = Range.fromPointWithDelta(selectionStart, 0, -1);
      return this.isNonWordCharacter(this.getActiveEditor().getTextInBufferRange(range));
    };

    HighlightedAreaView.prototype.isNonWordCharacterToTheRight = function(selection) {
      var range, selectionEnd;
      selectionEnd = selection.getBufferRange().end;
      range = Range.fromPointWithDelta(selectionEnd, 0, 1);
      return this.isNonWordCharacter(this.getActiveEditor().getTextInBufferRange(range));
    };

    HighlightedAreaView.prototype.setupStatusBar = function() {
      if (this.statusBarElement != null) {
        return;
      }
      if (!atom.config.get('highlight-selected.showInStatusBar')) {
        return;
      }
      this.statusBarElement = new StatusBarView();
      return this.statusBarTile = this.statusBar.addLeftTile({
        item: this.statusBarElement.getElement(),
        priority: 100
      });
    };

    HighlightedAreaView.prototype.removeStatusBar = function() {
      var ref1;
      if (this.statusBarElement == null) {
        return;
      }
      if ((ref1 = this.statusBarTile) != null) {
        ref1.destroy();
      }
      this.statusBarTile = null;
      return this.statusBarElement = null;
    };

    HighlightedAreaView.prototype.listenForStatusBarChange = function() {
      return atom.config.onDidChange('highlight-selected.showInStatusBar', (function(_this) {
        return function(changed) {
          if (changed.newValue) {
            return _this.setupStatusBar();
          } else {
            return _this.removeStatusBar();
          }
        };
      })(this));
    };

    return HighlightedAreaView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvaGlnaGxpZ2h0LXNlbGVjdGVkL2xpYi9oaWdobGlnaHRlZC1hcmVhLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwrRUFBQTtJQUFBOztFQUFBLE1BQXdDLE9BQUEsQ0FBUSxNQUFSLENBQXhDLEVBQUMsaUJBQUQsRUFBUSw2Q0FBUixFQUE2Qjs7RUFDN0IsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFDSixhQUFBLEdBQWdCLE9BQUEsQ0FBUSxtQkFBUjs7RUFFaEIsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUVTLDZCQUFBOzs7Ozs7Ozs7Ozs7O01BQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLEtBQUQsR0FBUztNQUNULElBQUMsQ0FBQSxNQUFELENBQUE7TUFDQSxJQUFDLENBQUEsc0JBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxzQkFBRCxHQUEwQixJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNqRSxLQUFDLENBQUEsd0JBQUQsQ0FBQTtpQkFDQSxLQUFDLENBQUEsMkJBQUQsQ0FBQTtRQUZpRTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekM7TUFHMUIsSUFBQyxDQUFBLDJCQUFELENBQUE7TUFDQSxJQUFDLENBQUEsd0JBQUQsQ0FBQTtJQVRXOztrQ0FXYixPQUFBLEdBQVMsU0FBQTtBQUNQLFVBQUE7TUFBQSxZQUFBLENBQWEsSUFBQyxDQUFBLHNCQUFkO01BQ0EsSUFBQyxDQUFBLHNCQUFzQixDQUFDLE9BQXhCLENBQUE7O1lBQ3NCLENBQUUsT0FBeEIsQ0FBQTs7O1lBQ2MsQ0FBRSxhQUFoQixDQUFBOzs7WUFDYyxDQUFFLE9BQWhCLENBQUE7O2FBQ0Es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QyxHQUFaLENBQWdCLG9DQUFoQixDQUFkO0FBQUEsZUFBQTs7TUFDQSxJQUFDLENBQUEsZ0JBQUQsR0FBd0IsSUFBQSxhQUFBLENBQUE7YUFDeEIsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBQyxDQUFBLFNBQVMsQ0FBQyxXQUFYLENBQ2Y7UUFBQSxJQUFBLEVBQU0sSUFBQyxDQUFBLGdCQUFnQixDQUFDLFVBQWxCLENBQUEsQ0FBTjtRQUFzQyxRQUFBLEVBQVUsR0FBaEQ7T0FEZTtJQUpIOztrQ0FPaEIsZUFBQSxHQUFpQixTQUFBO0FBQ2YsVUFBQTtNQUFBLElBQWMsNkJBQWQ7QUFBQSxlQUFBOzs7WUFDYyxDQUFFLE9BQWhCLENBQUE7O01BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUI7YUFDakIsSUFBQyxDQUFBLGdCQUFELEdBQW9CO0lBSkw7O2tDQU1qQix3QkFBQSxHQUEwQixTQUFBO2FBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUF3QixvQ0FBeEIsRUFBOEQsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7VUFDNUQsSUFBRyxPQUFPLENBQUMsUUFBWDttQkFDRSxLQUFDLENBQUEsY0FBRCxDQUFBLEVBREY7V0FBQSxNQUFBO21CQUdFLEtBQUMsQ0FBQSxlQUFELENBQUEsRUFIRjs7UUFENEQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlEO0lBRHdCOzs7OztBQXhNNUIiLCJzb3VyY2VzQ29udGVudCI6WyJ7UmFuZ2UsIENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXJ9ID0gcmVxdWlyZSAnYXRvbSdcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5TdGF0dXNCYXJWaWV3ID0gcmVxdWlyZSAnLi9zdGF0dXMtYmFyLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEhpZ2hsaWdodGVkQXJlYVZpZXdcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG4gICAgQHZpZXdzID0gW11cbiAgICBAZW5hYmxlKClcbiAgICBAbGlzdGVuRm9yVGltZW91dENoYW5nZSgpXG4gICAgQGFjdGl2ZUl0ZW1TdWJzY3JpcHRpb24gPSBhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtID0+XG4gICAgICBAZGVib3VuY2VkSGFuZGxlU2VsZWN0aW9uKClcbiAgICAgIEBzdWJzY3JpYmVUb0FjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBzdWJzY3JpYmVUb0FjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBsaXN0ZW5Gb3JTdGF0dXNCYXJDaGFuZ2UoKVxuXG4gIGRlc3Ryb3k6ID0+XG4gICAgY2xlYXJUaW1lb3V0KEBoYW5kbGVTZWxlY3Rpb25UaW1lb3V0KVxuICAgIEBhY3RpdmVJdGVtU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgIEBzZWxlY3Rpb25TdWJzY3JpcHRpb24/LmRpc3Bvc2UoKVxuICAgIEBzdGF0dXNCYXJWaWV3Py5yZW1vdmVFbGVtZW50KClcbiAgICBAc3RhdHVzQmFyVGlsZT8uZGVzdHJveSgpXG4gICAgQHN0YXR1c0JhclRpbGUgPSBudWxsXG5cbiAgb25EaWRBZGRNYXJrZXI6IChjYWxsYmFjaykgPT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLWFkZC1tYXJrZXInLCBjYWxsYmFja1xuXG4gIG9uRGlkUmVtb3ZlQWxsTWFya2VyczogKGNhbGxiYWNrKSA9PlxuICAgIEBlbWl0dGVyLm9uICdkaWQtcmVtb3ZlLWFsbC1tYXJrZXJzJywgY2FsbGJhY2tcblxuICBkaXNhYmxlOiA9PlxuICAgIEBkaXNhYmxlZCA9IHRydWVcbiAgICBAcmVtb3ZlTWFya2VycygpXG5cbiAgZW5hYmxlOiA9PlxuICAgIEBkaXNhYmxlZCA9IGZhbHNlXG4gICAgQGRlYm91bmNlZEhhbmRsZVNlbGVjdGlvbigpXG5cbiAgc2V0U3RhdHVzQmFyOiAoc3RhdHVzQmFyKSA9PlxuICAgIEBzdGF0dXNCYXIgPSBzdGF0dXNCYXJcbiAgICBAc2V0dXBTdGF0dXNCYXIoKVxuXG4gIGRlYm91bmNlZEhhbmRsZVNlbGVjdGlvbjogPT5cbiAgICBjbGVhclRpbWVvdXQoQGhhbmRsZVNlbGVjdGlvblRpbWVvdXQpXG4gICAgQGhhbmRsZVNlbGVjdGlvblRpbWVvdXQgPSBzZXRUaW1lb3V0ID0+XG4gICAgICBAaGFuZGxlU2VsZWN0aW9uKClcbiAgICAsIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLnRpbWVvdXQnKVxuXG4gIGxpc3RlbkZvclRpbWVvdXRDaGFuZ2U6IC0+XG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ2hpZ2hsaWdodC1zZWxlY3RlZC50aW1lb3V0JywgPT5cbiAgICAgIEBkZWJvdW5jZWRIYW5kbGVTZWxlY3Rpb24oKVxuXG4gIHN1YnNjcmliZVRvQWN0aXZlVGV4dEVkaXRvcjogLT5cbiAgICBAc2VsZWN0aW9uU3Vic2NyaXB0aW9uPy5kaXNwb3NlKClcblxuICAgIGVkaXRvciA9IEBnZXRBY3RpdmVFZGl0b3IoKVxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yXG5cbiAgICBAc2VsZWN0aW9uU3Vic2NyaXB0aW9uID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIEBzZWxlY3Rpb25TdWJzY3JpcHRpb24uYWRkKFxuICAgICAgZWRpdG9yLm9uRGlkQWRkU2VsZWN0aW9uIEBkZWJvdW5jZWRIYW5kbGVTZWxlY3Rpb25cbiAgICApXG4gICAgQHNlbGVjdGlvblN1YnNjcmlwdGlvbi5hZGQoXG4gICAgICBlZGl0b3Iub25EaWRDaGFuZ2VTZWxlY3Rpb25SYW5nZSBAZGVib3VuY2VkSGFuZGxlU2VsZWN0aW9uXG4gICAgKVxuICAgIEBoYW5kbGVTZWxlY3Rpb24oKVxuXG4gIGdldEFjdGl2ZUVkaXRvcjogLT5cbiAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICBoYW5kbGVTZWxlY3Rpb246ID0+XG4gICAgQHJlbW92ZU1hcmtlcnMoKVxuXG4gICAgcmV0dXJuIGlmIEBkaXNhYmxlZFxuXG4gICAgZWRpdG9yID0gQGdldEFjdGl2ZUVkaXRvcigpXG4gICAgcmV0dXJuIHVubGVzcyBlZGl0b3JcbiAgICByZXR1cm4gaWYgZWRpdG9yLmdldExhc3RTZWxlY3Rpb24oKS5pc0VtcHR5KClcbiAgICByZXR1cm4gdW5sZXNzIEBpc1dvcmRTZWxlY3RlZChlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpKVxuXG4gICAgQHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG5cbiAgICB0ZXh0ID0gXy5lc2NhcGVSZWdFeHAoQHNlbGVjdGlvbnNbMF0uZ2V0VGV4dCgpKVxuICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIlxcXFxTKlxcXFx3KlxcXFxiXCIsICdnaScpXG4gICAgcmVzdWx0ID0gcmVnZXguZXhlYyh0ZXh0KVxuXG4gICAgcmV0dXJuIHVubGVzcyByZXN1bHQ/XG4gICAgcmV0dXJuIGlmIHJlc3VsdFswXS5sZW5ndGggPCBhdG9tLmNvbmZpZy5nZXQoXG4gICAgICAnaGlnaGxpZ2h0LXNlbGVjdGVkLm1pbmltdW1MZW5ndGgnKSBvclxuICAgICAgICAgICAgICByZXN1bHQuaW5kZXggaXNudCAwIG9yXG4gICAgICAgICAgICAgIHJlc3VsdFswXSBpc250IHJlc3VsdC5pbnB1dFxuXG4gICAgcmVnZXhGbGFncyA9ICdnJ1xuICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLmlnbm9yZUNhc2UnKVxuICAgICAgcmVnZXhGbGFncyA9ICdnaSdcblxuICAgIHJhbmdlID0gIFtbMCwgMF0sIGVkaXRvci5nZXRFb2ZCdWZmZXJQb3NpdGlvbigpXVxuXG4gICAgQHJhbmdlcyA9IFtdXG4gICAgcmVnZXhTZWFyY2ggPSByZXN1bHRbMF1cblxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLm9ubHlIaWdobGlnaHRXaG9sZVdvcmRzJylcbiAgICAgIGlmIHJlZ2V4U2VhcmNoLmluZGV4T2YoXCJcXCRcIikgaXNudCAtMSBcXFxuICAgICAgYW5kIGVkaXRvci5nZXRHcmFtbWFyKCk/Lm5hbWUgaXMgJ1BIUCdcbiAgICAgICAgcmVnZXhTZWFyY2ggPSByZWdleFNlYXJjaC5yZXBsYWNlKFwiXFwkXCIsIFwiXFwkXFxcXGJcIilcbiAgICAgIGVsc2VcbiAgICAgICAgcmVnZXhTZWFyY2ggPSAgXCJcXFxcYlwiICsgcmVnZXhTZWFyY2hcbiAgICAgIHJlZ2V4U2VhcmNoID0gcmVnZXhTZWFyY2ggKyBcIlxcXFxiXCJcblxuICAgIHJlc3VsdENvdW50ID0gMFxuICAgIGVkaXRvci5zY2FuSW5CdWZmZXJSYW5nZSBuZXcgUmVnRXhwKHJlZ2V4U2VhcmNoLCByZWdleEZsYWdzKSwgcmFuZ2UsXG4gICAgICAocmVzdWx0KSA9PlxuICAgICAgICByZXN1bHRDb3VudCArPSAxXG4gICAgICAgIHVubGVzcyBAc2hvd0hpZ2hsaWdodE9uU2VsZWN0ZWRXb3JkKHJlc3VsdC5yYW5nZSwgQHNlbGVjdGlvbnMpXG4gICAgICAgICAgbWFya2VyID0gZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShyZXN1bHQucmFuZ2UpXG4gICAgICAgICAgZGVjb3JhdGlvbiA9IGVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsXG4gICAgICAgICAgICB7dHlwZTogJ2hpZ2hsaWdodCcsIGNsYXNzOiBAbWFrZUNsYXNzZXMoKX0pXG4gICAgICAgICAgQHZpZXdzLnB1c2ggbWFya2VyXG4gICAgICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWFkZC1tYXJrZXInLCBtYXJrZXJcblxuICAgIEBzdGF0dXNCYXJFbGVtZW50Py51cGRhdGVDb3VudChyZXN1bHRDb3VudClcblxuICBtYWtlQ2xhc3NlczogLT5cbiAgICBjbGFzc05hbWUgPSAnaGlnaGxpZ2h0LXNlbGVjdGVkJ1xuICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLmxpZ2h0VGhlbWUnKVxuICAgICAgY2xhc3NOYW1lICs9ICcgbGlnaHQtdGhlbWUnXG5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5oaWdobGlnaHRCYWNrZ3JvdW5kJylcbiAgICAgIGNsYXNzTmFtZSArPSAnIGJhY2tncm91bmQnXG4gICAgY2xhc3NOYW1lXG5cbiAgc2hvd0hpZ2hsaWdodE9uU2VsZWN0ZWRXb3JkOiAocmFuZ2UsIHNlbGVjdGlvbnMpIC0+XG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBhdG9tLmNvbmZpZy5nZXQoXG4gICAgICAnaGlnaGxpZ2h0LXNlbGVjdGVkLmhpZGVIaWdobGlnaHRPblNlbGVjdGVkV29yZCcpXG4gICAgb3V0Y29tZSA9IGZhbHNlXG4gICAgZm9yIHNlbGVjdGlvbiBpbiBzZWxlY3Rpb25zXG4gICAgICBzZWxlY3Rpb25SYW5nZSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICBvdXRjb21lID0gKHJhbmdlLnN0YXJ0LmNvbHVtbiBpcyBzZWxlY3Rpb25SYW5nZS5zdGFydC5jb2x1bW4pIGFuZFxuICAgICAgICAgICAgICAgIChyYW5nZS5zdGFydC5yb3cgaXMgc2VsZWN0aW9uUmFuZ2Uuc3RhcnQucm93KSBhbmRcbiAgICAgICAgICAgICAgICAocmFuZ2UuZW5kLmNvbHVtbiBpcyBzZWxlY3Rpb25SYW5nZS5lbmQuY29sdW1uKSBhbmRcbiAgICAgICAgICAgICAgICAocmFuZ2UuZW5kLnJvdyBpcyBzZWxlY3Rpb25SYW5nZS5lbmQucm93KVxuICAgICAgYnJlYWsgaWYgb3V0Y29tZVxuICAgIG91dGNvbWVcblxuICByZW1vdmVNYXJrZXJzOiA9PlxuICAgIHJldHVybiB1bmxlc3MgQHZpZXdzP1xuICAgIHJldHVybiBpZiBAdmlld3MubGVuZ3RoIGlzIDBcbiAgICBmb3IgdmlldyBpbiBAdmlld3NcbiAgICAgIHZpZXcuZGVzdHJveSgpXG4gICAgICB2aWV3ID0gbnVsbFxuICAgIEB2aWV3cyA9IFtdXG4gICAgQHN0YXR1c0JhckVsZW1lbnQ/LnVwZGF0ZUNvdW50KEB2aWV3cy5sZW5ndGgpXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXJlbW92ZS1hbGwtbWFya2VycydcblxuICBpc1dvcmRTZWxlY3RlZDogKHNlbGVjdGlvbikgLT5cbiAgICBpZiBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKS5pc1NpbmdsZUxpbmUoKVxuICAgICAgc2VsZWN0aW9uUmFuZ2UgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgbGluZVJhbmdlID0gQGdldEFjdGl2ZUVkaXRvcigpLmJ1ZmZlclJhbmdlRm9yQnVmZmVyUm93KFxuICAgICAgICBzZWxlY3Rpb25SYW5nZS5zdGFydC5yb3cpXG4gICAgICBub25Xb3JkQ2hhcmFjdGVyVG9UaGVMZWZ0ID1cbiAgICAgICAgXy5pc0VxdWFsKHNlbGVjdGlvblJhbmdlLnN0YXJ0LCBsaW5lUmFuZ2Uuc3RhcnQpIG9yXG4gICAgICAgIEBpc05vbldvcmRDaGFyYWN0ZXJUb1RoZUxlZnQoc2VsZWN0aW9uKVxuICAgICAgbm9uV29yZENoYXJhY3RlclRvVGhlUmlnaHQgPVxuICAgICAgICBfLmlzRXF1YWwoc2VsZWN0aW9uUmFuZ2UuZW5kLCBsaW5lUmFuZ2UuZW5kKSBvclxuICAgICAgICBAaXNOb25Xb3JkQ2hhcmFjdGVyVG9UaGVSaWdodChzZWxlY3Rpb24pXG5cbiAgICAgIG5vbldvcmRDaGFyYWN0ZXJUb1RoZUxlZnQgYW5kIG5vbldvcmRDaGFyYWN0ZXJUb1RoZVJpZ2h0XG4gICAgZWxzZVxuICAgICAgZmFsc2VcblxuICBpc05vbldvcmRDaGFyYWN0ZXI6IChjaGFyYWN0ZXIpIC0+XG4gICAgbm9uV29yZENoYXJhY3RlcnMgPSBhdG9tLmNvbmZpZy5nZXQoJ2VkaXRvci5ub25Xb3JkQ2hhcmFjdGVycycpXG4gICAgbmV3IFJlZ0V4cChcIlsgXFx0I3tfLmVzY2FwZVJlZ0V4cChub25Xb3JkQ2hhcmFjdGVycyl9XVwiKS50ZXN0KGNoYXJhY3RlcilcblxuICBpc05vbldvcmRDaGFyYWN0ZXJUb1RoZUxlZnQ6IChzZWxlY3Rpb24pIC0+XG4gICAgc2VsZWN0aW9uU3RhcnQgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKS5zdGFydFxuICAgIHJhbmdlID0gUmFuZ2UuZnJvbVBvaW50V2l0aERlbHRhKHNlbGVjdGlvblN0YXJ0LCAwLCAtMSlcbiAgICBAaXNOb25Xb3JkQ2hhcmFjdGVyKEBnZXRBY3RpdmVFZGl0b3IoKS5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSkpXG5cbiAgaXNOb25Xb3JkQ2hhcmFjdGVyVG9UaGVSaWdodDogKHNlbGVjdGlvbikgLT5cbiAgICBzZWxlY3Rpb25FbmQgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKS5lbmRcbiAgICByYW5nZSA9IFJhbmdlLmZyb21Qb2ludFdpdGhEZWx0YShzZWxlY3Rpb25FbmQsIDAsIDEpXG4gICAgQGlzTm9uV29yZENoYXJhY3RlcihAZ2V0QWN0aXZlRWRpdG9yKCkuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UpKVxuXG4gIHNldHVwU3RhdHVzQmFyOiA9PlxuICAgIHJldHVybiBpZiBAc3RhdHVzQmFyRWxlbWVudD9cbiAgICByZXR1cm4gdW5sZXNzIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLnNob3dJblN0YXR1c0JhcicpXG4gICAgQHN0YXR1c0JhckVsZW1lbnQgPSBuZXcgU3RhdHVzQmFyVmlldygpXG4gICAgQHN0YXR1c0JhclRpbGUgPSBAc3RhdHVzQmFyLmFkZExlZnRUaWxlKFxuICAgICAgaXRlbTogQHN0YXR1c0JhckVsZW1lbnQuZ2V0RWxlbWVudCgpLCBwcmlvcml0eTogMTAwKVxuXG4gIHJlbW92ZVN0YXR1c0JhcjogPT5cbiAgICByZXR1cm4gdW5sZXNzIEBzdGF0dXNCYXJFbGVtZW50P1xuICAgIEBzdGF0dXNCYXJUaWxlPy5kZXN0cm95KClcbiAgICBAc3RhdHVzQmFyVGlsZSA9IG51bGxcbiAgICBAc3RhdHVzQmFyRWxlbWVudCA9IG51bGxcblxuICBsaXN0ZW5Gb3JTdGF0dXNCYXJDaGFuZ2U6ID0+XG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ2hpZ2hsaWdodC1zZWxlY3RlZC5zaG93SW5TdGF0dXNCYXInLCAoY2hhbmdlZCkgPT5cbiAgICAgIGlmIGNoYW5nZWQubmV3VmFsdWVcbiAgICAgICAgQHNldHVwU3RhdHVzQmFyKClcbiAgICAgIGVsc2VcbiAgICAgICAgQHJlbW92ZVN0YXR1c0JhcigpXG4iXX0=
