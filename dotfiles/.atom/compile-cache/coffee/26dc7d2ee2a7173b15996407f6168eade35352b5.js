(function() {
  var CompositeDisposable, ResolverView, View, handleErr,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  View = require('space-pen').View;

  handleErr = require('./error-view').handleErr;

  ResolverView = (function(superClass) {
    extend(ResolverView, superClass);

    function ResolverView() {
      return ResolverView.__super__.constructor.apply(this, arguments);
    }

    ResolverView.content = function(editor, state, pkg) {
      var resolveText;
      resolveText = state.context.resolveText;
      return this.div({
        "class": 'overlay from-top resolver'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'block text-highlight'
          }, "We're done here");
          _this.div({
            "class": 'block'
          }, function() {
            _this.div({
              "class": 'block text-info'
            }, function() {
              return _this.text("You've dealt with all of the conflicts in this file.");
            });
            return _this.div({
              "class": 'block text-info'
            }, function() {
              _this.span({
                outlet: 'actionText'
              }, "Save and " + resolveText);
              return _this.text(' this file?');
            });
          });
          _this.div({
            "class": 'pull-left'
          }, function() {
            return _this.button({
              "class": 'btn btn-primary',
              click: 'dismiss'
            }, 'Maybe Later');
          });
          return _this.div({
            "class": 'pull-right'
          }, function() {
            return _this.button({
              "class": 'btn btn-primary',
              click: 'resolve'
            }, resolveText);
          });
        };
      })(this));
    };

    ResolverView.prototype.initialize = function(editor1, state1, pkg1) {
      this.editor = editor1;
      this.state = state1;
      this.pkg = pkg1;
      this.subs = new CompositeDisposable();
      this.refresh();
      this.subs.add(this.editor.onDidSave((function(_this) {
        return function() {
          return _this.refresh();
        };
      })(this)));
      return this.subs.add(atom.commands.add(this.element, 'merge-conflicts:quit', (function(_this) {
        return function() {
          return _this.dismiss();
        };
      })(this)));
    };

    ResolverView.prototype.detached = function() {
      return this.subs.dispose();
    };

    ResolverView.prototype.getModel = function() {
      return null;
    };

    ResolverView.prototype.relativePath = function() {
      return this.state.relativize(this.editor.getURI());
    };

    ResolverView.prototype.refresh = function() {
      return this.state.context.isResolvedFile(this.relativePath()).then((function(_this) {
        return function(resolved) {
          var modified, needsResolve, needsSaved, resolveText;
          modified = _this.editor.isModified();
          needsSaved = modified;
          needsResolve = modified || !resolved;
          if (!(needsSaved || needsResolve)) {
            _this.hide('fast', function() {
              return _this.remove();
            });
            _this.pkg.didResolveFile({
              file: _this.editor.getURI()
            });
            return;
          }
          resolveText = _this.state.context.resolveText;
          if (needsSaved) {
            return _this.actionText.text("Save and " + (resolveText.toLowerCase()));
          } else if (needsResolve) {
            return _this.actionText.text(resolveText);
          }
        };
      })(this))["catch"](handleErr);
    };

    ResolverView.prototype.resolve = function() {
      return Promise.resolve(this.editor.save()).then((function(_this) {
        return function() {
          return _this.state.context.resolveFile(_this.relativePath()).then(function() {
            return _this.refresh();
          })["catch"](handleErr);
        };
      })(this));
    };

    ResolverView.prototype.dismiss = function() {
      return this.hide('fast', (function(_this) {
        return function() {
          return _this.remove();
        };
      })(this));
    };

    return ResolverView;

  })(View);

  module.exports = {
    ResolverView: ResolverView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi92aWV3L3Jlc29sdmVyLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxrREFBQTtJQUFBOzs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3ZCLE9BQVEsT0FBQSxDQUFRLFdBQVI7O0VBRVIsWUFBYSxPQUFBLENBQVEsY0FBUjs7RUFFUjs7Ozs7OztJQUVKLFlBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixHQUFoQjtBQUNSLFVBQUE7TUFBQSxXQUFBLEdBQWMsS0FBSyxDQUFDLE9BQU8sQ0FBQzthQUM1QixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTywyQkFBUDtPQUFMLEVBQXlDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUN2QyxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxzQkFBUDtXQUFMLEVBQW9DLGlCQUFwQztVQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLE9BQVA7V0FBTCxFQUFxQixTQUFBO1lBQ25CLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGlCQUFQO2FBQUwsRUFBK0IsU0FBQTtxQkFDN0IsS0FBQyxDQUFBLElBQUQsQ0FBTSxzREFBTjtZQUQ2QixDQUEvQjttQkFFQSxLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxpQkFBUDthQUFMLEVBQStCLFNBQUE7Y0FDN0IsS0FBQyxDQUFBLElBQUQsQ0FBTTtnQkFBQSxNQUFBLEVBQVEsWUFBUjtlQUFOLEVBQTRCLFdBQUEsR0FBWSxXQUF4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V0FBQSxNQUVLLElBQUcsWUFBSDttQkFDSCxLQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBaUIsV0FBakIsRUFERzs7UUFkRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETixDQWlCQSxFQUFDLEtBQUQsRUFqQkEsQ0FpQk8sU0FqQlA7SUFETzs7MkJBb0JULE9BQUEsR0FBUyxTQUFBO2FBRVAsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQUEsQ0FBaEIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ25DLEtBQUMsQ0FBQSxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQWYsQ0FBMkIsS0FBQyxDQUFBLFlBQUQsQ0FBQSxDQUEzQixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUE7bUJBQ0osS0FBQyxDQUFBLE9BQUQsQ0FBQTtVQURJLENBRE4sQ0FHQSxFQUFDLEtBQUQsRUFIQSxDQUdPLFNBSFA7UUFEbUM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJDO0lBRk87OzJCQVFULE9BQUEsR0FBUyxTQUFBO2FBQ1AsSUFBQyxDQUFBLElBQUQsQ0FBTSxNQUFOLEVBQWMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxNQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZDtJQURPOzs7O0tBNURnQjs7RUErRDNCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxZQUFBLEVBQWMsWUFBZDs7QUFyRUYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xue1ZpZXd9ID0gcmVxdWlyZSAnc3BhY2UtcGVuJ1xuXG57aGFuZGxlRXJyfSA9IHJlcXVpcmUgJy4vZXJyb3ItdmlldydcblxuY2xhc3MgUmVzb2x2ZXJWaWV3IGV4dGVuZHMgVmlld1xuXG4gIEBjb250ZW50OiAoZWRpdG9yLCBzdGF0ZSwgcGtnKSAtPlxuICAgIHJlc29sdmVUZXh0ID0gc3RhdGUuY29udGV4dC5yZXNvbHZlVGV4dFxuICAgIEBkaXYgY2xhc3M6ICdvdmVybGF5IGZyb20tdG9wIHJlc29sdmVyJywgPT5cbiAgICAgIEBkaXYgY2xhc3M6ICdibG9jayB0ZXh0LWhpZ2hsaWdodCcsIFwiV2UncmUgZG9uZSBoZXJlXCJcbiAgICAgIEBkaXYgY2xhc3M6ICdibG9jaycsID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICdibG9jayB0ZXh0LWluZm8nLCA9PlxuICAgICAgICAgIEB0ZXh0IFwiWW91J3ZlIGRlYWx0IHdpdGggYWxsIG9mIHRoZSBjb25mbGljdHMgaW4gdGhpcyBmaWxlLlwiXG4gICAgICAgIEBkaXYgY2xhc3M6ICdibG9jayB0ZXh0LWluZm8nLCA9PlxuICAgICAgICAgIEBzcGFuIG91dGxldDogJ2FjdGlvblRleHQnLCBcIlNhdmUgYW5kICN7cmVzb2x2ZVRleHR9XCJcbiAgICAgICAgICBAdGV4dCAnIHRoaXMgZmlsZT8nXG4gICAgICBAZGl2IGNsYXNzOiAncHVsbC1sZWZ0JywgPT5cbiAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBidG4tcHJpbWFyeScsIGNsaWNrOiAnZGlzbWlzcycsICdNYXliZSBMYXRlcidcbiAgICAgIEBkaXYgY2xhc3M6ICdwdWxsLXJpZ2h0JywgPT5cbiAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBidG4tcHJpbWFyeScsIGNsaWNrOiAncmVzb2x2ZScsIHJlc29sdmVUZXh0XG5cbiAgaW5pdGlhbGl6ZTogKEBlZGl0b3IsIEBzdGF0ZSwgQHBrZykgLT5cbiAgICBAc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIEByZWZyZXNoKClcbiAgICBAc3Vicy5hZGQgQGVkaXRvci5vbkRpZFNhdmUgPT4gQHJlZnJlc2goKVxuXG4gICAgQHN1YnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIEBlbGVtZW50LCAnbWVyZ2UtY29uZmxpY3RzOnF1aXQnLCA9PiBAZGlzbWlzcygpXG5cbiAgZGV0YWNoZWQ6IC0+IEBzdWJzLmRpc3Bvc2UoKVxuXG4gIGdldE1vZGVsOiAtPiBudWxsXG5cbiAgcmVsYXRpdmVQYXRoOiAtPlxuICAgIEBzdGF0ZS5yZWxhdGl2aXplIEBlZGl0b3IuZ2V0VVJJKClcblxuICByZWZyZXNoOiAtPlxuICAgIEBzdGF0ZS5jb250ZXh0LmlzUmVzb2x2ZWRGaWxlIEByZWxhdGl2ZVBhdGgoKVxuICAgIC50aGVuIChyZXNvbHZlZCkgPT5cbiAgICAgIG1vZGlmaWVkID0gQGVkaXRvci5pc01vZGlmaWVkKClcblxuICAgICAgbmVlZHNTYXZlZCA9IG1vZGlmaWVkXG4gICAgICBuZWVkc1Jlc29sdmUgPSBtb2RpZmllZCBvciBub3QgcmVzb2x2ZWRcblxuICAgICAgdW5sZXNzIG5lZWRzU2F2ZWQgb3IgbmVlZHNSZXNvbHZlXG4gICAgICAgIEBoaWRlICdmYXN0JywgPT4gQHJlbW92ZSgpXG4gICAgICAgIEBwa2cuZGlkUmVzb2x2ZUZpbGUgZmlsZTogQGVkaXRvci5nZXRVUkkoKVxuICAgICAgICByZXR1cm5cblxuICAgICAgcmVzb2x2ZVRleHQgPSBAc3RhdGUuY29udGV4dC5yZXNvbHZlVGV4dFxuICAgICAgaWYgbmVlZHNTYXZlZFxuICAgICAgICBAYWN0aW9uVGV4dC50ZXh0IFwiU2F2ZSBhbmQgI3tyZXNvbHZlVGV4dC50b0xvd2VyQ2FzZSgpfVwiXG4gICAgICBlbHNlIGlmIG5lZWRzUmVzb2x2ZVxuICAgICAgICBAYWN0aW9uVGV4dC50ZXh0IHJlc29sdmVUZXh0XG4gICAgLmNhdGNoIGhhbmRsZUVyclxuXG4gIHJlc29sdmU6IC0+XG4gICAgIyBTdXBvcnQgYXN5bmMgc2F2ZSBpbXBsZW1lbnRhdGlvbnMuXG4gICAgUHJvbWlzZS5yZXNvbHZlKEBlZGl0b3Iuc2F2ZSgpKS50aGVuID0+XG4gICAgICBAc3RhdGUuY29udGV4dC5yZXNvbHZlRmlsZSBAcmVsYXRpdmVQYXRoKClcbiAgICAgIC50aGVuID0+XG4gICAgICAgIEByZWZyZXNoKClcbiAgICAgIC5jYXRjaCBoYW5kbGVFcnJcblxuICBkaXNtaXNzOiAtPlxuICAgIEBoaWRlICdmYXN0JywgPT4gQHJlbW92ZSgpXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgUmVzb2x2ZXJWaWV3OiBSZXNvbHZlclZpZXdcbiJdfQ==
