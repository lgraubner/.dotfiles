(function() {
  var CompositeDisposable, SyncedSidebar;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = SyncedSidebar = {
    subscriptions: null,
    activate: function(state) {
      if (this.subscriptions) {
        return;
      }
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.revealActiveFile();
        };
      })(this)));
      atom.commands.add('body', {
        'pane:show-previous-item': function() {
          return atom.views.getView(atom.workspace).focus();
        }
      });
      return atom.commands.add('body', {
        'pane:show-next-item': function() {
          return atom.views.getView(atom.workspace).focus();
        }
      });
    },
    deactivate: function() {
      this.subscriptions.dispose();
      return this.subscriptions = null;
    },
    revealActiveFile: function() {
      var selectedListItem, treeView;
      treeView = atom.views.getView(atom.workspace).querySelector('.tree-view');
      if (treeView) {
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'tree-view:reveal-active-file');
        selectedListItem = treeView.querySelector('.list-tree .selected');
        if (selectedListItem) {
          return selectedListItem.scrollIntoViewIfNeeded();
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvc3luY2VkLXNpZGViYXIvbGliL3N5bmNlZC1zaWRlYmFyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUFpQixhQUFBLEdBQ2Y7SUFBQSxhQUFBLEVBQWUsSUFBZjtJQUVBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFFUixJQUFHLElBQUMsQ0FBQSxhQUFKO0FBQ0UsZUFERjs7TUFHQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BR3JCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsZ0JBQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QyxDQUFuQjtNQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixNQUFsQixFQUEwQjtRQUFBLHlCQUFBLEVBQTJCLFNBQUE7aUJBQ25ELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBa0MsQ0FBQyxLQUFuQyxDQUFBO1FBRG1ELENBQTNCO09BQTFCO2FBR0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLE1BQWxCLEVBQTBCO1FBQUEscUJBQUEsRUFBdUIsU0FBQTtpQkFDL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFrQyxDQUFDLEtBQW5DLENBQUE7UUFEK0MsQ0FBdkI7T0FBMUI7SUFiUSxDQUZWO0lBa0JBLFVBQUEsRUFBWSxTQUFBO01BQ1YsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7YUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQjtJQUZQLENBbEJaO0lBc0JBLGdCQUFBLEVBQWtCLFNBQUE7QUFDaEIsVUFBQTtNQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQWtDLENBQUMsYUFBbkMsQ0FBaUQsWUFBakQ7TUFHWCxJQUFHLFFBQUg7UUFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUF2QixFQUEyRCw4QkFBM0Q7UUFFQSxnQkFBQSxHQUFtQixRQUFRLENBQUMsYUFBVCxDQUF1QixzQkFBdkI7UUFFbkIsSUFBRyxnQkFBSDtpQkFDRSxnQkFBZ0IsQ0FBQyxzQkFBakIsQ0FBQSxFQURGO1NBTEY7O0lBSmdCLENBdEJsQjs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID0gU3luY2VkU2lkZWJhciA9XG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgICNjaGVjayBpZiBzdWJzY3JpcHRpb25zIGFscmVhZHkgZXhpc3RcbiAgICBpZiBAc3Vic2NyaXB0aW9uc1xuICAgICAgcmV0dXJuXG5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICAjIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtID0+IEByZXZlYWxBY3RpdmVGaWxlKClcblxuICAgIGF0b20uY29tbWFuZHMuYWRkICdib2R5JywgJ3BhbmU6c2hvdy1wcmV2aW91cy1pdGVtJzogLT5cbiAgICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSkuZm9jdXMoKVxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2JvZHknLCAncGFuZTpzaG93LW5leHQtaXRlbSc6IC0+XG4gICAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLmZvY3VzKClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIEBzdWJzY3JpcHRpb25zID0gbnVsbFxuXG4gIHJldmVhbEFjdGl2ZUZpbGU6IC0+XG4gICAgdHJlZVZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLnF1ZXJ5U2VsZWN0b3IoJy50cmVlLXZpZXcnKVxuXG4gICAgI2NoZWNrIGlmIHBhbmVsIGlzIG9wZW5cbiAgICBpZiB0cmVlVmlld1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLCAndHJlZS12aWV3OnJldmVhbC1hY3RpdmUtZmlsZScpXG5cbiAgICAgIHNlbGVjdGVkTGlzdEl0ZW0gPSB0cmVlVmlldy5xdWVyeVNlbGVjdG9yKCcubGlzdC10cmVlIC5zZWxlY3RlZCcpXG5cbiAgICAgIGlmIHNlbGVjdGVkTGlzdEl0ZW1cbiAgICAgICAgc2VsZWN0ZWRMaXN0SXRlbS5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKClcbiJdfQ==
