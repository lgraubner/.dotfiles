(function() {
  var GitNotFoundErrorView, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  View = require('space-pen').View;

  GitNotFoundErrorView = (function(superClass) {
    extend(GitNotFoundErrorView, superClass);

    function GitNotFoundErrorView() {
      return GitNotFoundErrorView.__super__.constructor.apply(this, arguments);
    }

    GitNotFoundErrorView.content = function(err) {
      return this.div({
        "class": 'overlay from-top padded merge-conflict-error merge-conflicts-message'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'panel'
          }, function() {
            _this.div({
              "class": 'panel-heading no-path'
            }, function() {
              _this.code('git');
              return _this.text("can't be found in any of the default locations!");
            });
            _this.div({
              "class": 'panel-heading wrong-path'
            }, function() {
              _this.code('git');
              _this.text("can't be found at ");
              _this.code(atom.config.get('merge-conflicts.gitPath'));
              return _this.text('!');
            });
            return _this.div({
              "class": 'panel-body'
            }, function() {
              _this.div({
                "class": 'block'
              }, 'Please specify the correct path in the merge-conflicts package settings.');
              return _this.div({
                "class": 'block'
              }, function() {
                _this.button({
                  "class": 'btn btn-error inline-block-tight',
                  click: 'openSettings'
                }, 'Open Settings');
                return _this.button({
                  "class": 'btn inline-block-tight',
                  click: 'notRightNow'
                }, 'Not Right Now');
              });
            });
          });
        };
      })(this));
    };

    GitNotFoundErrorView.prototype.initialize = function(err) {
      if (atom.config.get('merge-conflicts.gitPath')) {
        this.find('.no-path').hide();
        return this.find('.wrong-path').show();
      } else {
        this.find('.no-path').show();
        return this.find('.wrong-path').hide();
      }
    };

    GitNotFoundErrorView.prototype.openSettings = function() {
      atom.workspace.open('atom://config/packages');
      return this.remove();
    };

    GitNotFoundErrorView.prototype.notRightNow = function() {
      return this.remove();
    };

    return GitNotFoundErrorView;

  })(View);

  module.exports = {
    handleErr: function(err) {
      if (err == null) {
        return false;
      }
      if (err.isGitError) {
        atom.workspace.addTopPanel({
          item: new GitNotFoundErrorView(err)
        });
      } else {
        atom.notifications.addError(err.message);
        console.error(err.message, err.trace);
      }
      return true;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi92aWV3L2Vycm9yLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwwQkFBQTtJQUFBOzs7RUFBQyxPQUFRLE9BQUEsQ0FBUSxXQUFSOztFQUVIOzs7Ozs7O0lBRUosb0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxHQUFEO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sc0VBQVA7T0FBTCxFQUFvRixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ2xGLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLE9BQVA7V0FBTCxFQUFxQixTQUFBO1lBQ25CLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHVCQUFQO2FBQUwsRUFBcUMsU0FBQTtjQUNuQyxLQUFDLENBQUEsSUFBRCxDQUFNLEtBQU47cUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTSxpREFBTjtZQUZtQyxDQUFyQztZQUdBLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLDBCQUFQO2FBQUwsRUFBd0MsU0FBQTtjQUN0QyxLQUFDLENBQUEsSUFBRCxDQUFNLEtBQU47Y0FDQSxLQUFDLENBQUEsSUFBRCxDQUFNLG9CQUFOO2NBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCLENBQU47cUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTSxHQUFOO1lBSnNDLENBQXhDO21CQUtBLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFlBQVA7YUFBTCxFQUEwQixTQUFBO2NBQ3hCLEtBQUMsQ0FBQSxHQUFELENBQUs7Z0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxPQUFQO2VBQUwsRUFDRSwwRUFERjtxQkFFQSxLQUFDLENBQUEsR0FBRCxDQUFLO2dCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sT0FBUDtlQUFMLEVBQXFCLFNBQUE7Z0JBQ25CLEtBQUMsQ0FBQSxNQUFELENBQVE7a0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxrQ0FBUDtrQkFBMkMsS0FBQSxFQUFPLGNBQWxEO2lCQUFSLEVBQTBFLGVBQTFFO3VCQUNBLEtBQUMsQ0FBQSxNQUFELENBQVE7a0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyx3QkFBUDtrQkFBaUMsS0FBQSxFQUFPLGFBQXhDO2lCQUFSLEVBQStELGVBQS9EO2NBRm1CLENBQXJCO1lBSHdCLENBQTFCO1VBVG1CLENBQXJCO1FBRGtGO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwRjtJQURROzttQ0FrQlYsVUFBQSxHQUFZLFNBQUMsR0FBRDtNQUNWLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHlCQUFoQixDQUFIO1FBQ0UsSUFBQyxDQUFBLElBQUQsQ0FBTSxVQUFOLENBQWlCLENBQUMsSUFBbEIsQ0FBQTtlQUNBLElBQUMsQ0FBQSxJQUFELENBQU0sYUFBTixDQUFvQixDQUFDLElBQXJCLENBQUEsRUFGRjtPQUFBLE1BQUE7UUFJRSxJQUFDLENBQUEsSUFBRCxDQUFNLFVBQU4sQ0FBaUIsQ0FBQyxJQUFsQixDQUFBO2VBQ0EsSUFBQyxDQUFBLElBQUQsQ0FBTSxhQUFOLENBQW9CLENBQUMsSUFBckIsQ0FBQSxFQUxGOztJQURVOzttQ0FRWixZQUFBLEdBQWMsU0FBQTtNQUNaLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQix3QkFBcEI7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO0lBRlk7O21DQUlkLFdBQUEsR0FBYSxTQUFBO2FBQ1gsSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQURXOzs7O0tBaENvQjs7RUFtQ25DLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxTQUFBLEVBQVcsU0FBQyxHQUFEO01BQ1QsSUFBb0IsV0FBcEI7QUFBQSxlQUFPLE1BQVA7O01BRUEsSUFBRyxHQUFHLENBQUMsVUFBUDtRQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBZixDQUEyQjtVQUFBLElBQUEsRUFBVSxJQUFBLG9CQUFBLENBQXFCLEdBQXJCLENBQVY7U0FBM0IsRUFERjtPQUFBLE1BQUE7UUFHRSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLEdBQUcsQ0FBQyxPQUFoQztRQUNBLE9BQU8sQ0FBQyxLQUFSLENBQWMsR0FBRyxDQUFDLE9BQWxCLEVBQTJCLEdBQUcsQ0FBQyxLQUEvQixFQUpGOzthQUtBO0lBUlMsQ0FBWDs7QUF0Q0YiLCJzb3VyY2VzQ29udGVudCI6WyJ7Vmlld30gPSByZXF1aXJlICdzcGFjZS1wZW4nXG5cbmNsYXNzIEdpdE5vdEZvdW5kRXJyb3JWaWV3IGV4dGVuZHMgVmlld1xuXG4gIEBjb250ZW50OiAoZXJyKSAtPlxuICAgIEBkaXYgY2xhc3M6ICdvdmVybGF5IGZyb20tdG9wIHBhZGRlZCBtZXJnZS1jb25mbGljdC1lcnJvciBtZXJnZS1jb25mbGljdHMtbWVzc2FnZScsID0+XG4gICAgICBAZGl2IGNsYXNzOiAncGFuZWwnLCA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAncGFuZWwtaGVhZGluZyBuby1wYXRoJywgPT5cbiAgICAgICAgICBAY29kZSAnZ2l0J1xuICAgICAgICAgIEB0ZXh0IFwiY2FuJ3QgYmUgZm91bmQgaW4gYW55IG9mIHRoZSBkZWZhdWx0IGxvY2F0aW9ucyFcIlxuICAgICAgICBAZGl2IGNsYXNzOiAncGFuZWwtaGVhZGluZyB3cm9uZy1wYXRoJywgPT5cbiAgICAgICAgICBAY29kZSAnZ2l0J1xuICAgICAgICAgIEB0ZXh0IFwiY2FuJ3QgYmUgZm91bmQgYXQgXCJcbiAgICAgICAgICBAY29kZSBhdG9tLmNvbmZpZy5nZXQgJ21lcmdlLWNvbmZsaWN0cy5naXRQYXRoJ1xuICAgICAgICAgIEB0ZXh0ICchJ1xuICAgICAgICBAZGl2IGNsYXNzOiAncGFuZWwtYm9keScsID0+XG4gICAgICAgICAgQGRpdiBjbGFzczogJ2Jsb2NrJyxcbiAgICAgICAgICAgICdQbGVhc2Ugc3BlY2lmeSB0aGUgY29ycmVjdCBwYXRoIGluIHRoZSBtZXJnZS1jb25mbGljdHMgcGFja2FnZSBzZXR0aW5ncy4nXG4gICAgICAgICAgQGRpdiBjbGFzczogJ2Jsb2NrJywgPT5cbiAgICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gYnRuLWVycm9yIGlubGluZS1ibG9jay10aWdodCcsIGNsaWNrOiAnb3BlblNldHRpbmdzJywgJ09wZW4gU2V0dGluZ3MnXG4gICAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuIGlubGluZS1ibG9jay10aWdodCcsIGNsaWNrOiAnbm90UmlnaHROb3cnLCAnTm90IFJpZ2h0IE5vdydcblxuICBpbml0aWFsaXplOiAoZXJyKSAtPlxuICAgIGlmIGF0b20uY29uZmlnLmdldCAnbWVyZ2UtY29uZmxpY3RzLmdpdFBhdGgnXG4gICAgICBAZmluZCgnLm5vLXBhdGgnKS5oaWRlKClcbiAgICAgIEBmaW5kKCcud3JvbmctcGF0aCcpLnNob3coKVxuICAgIGVsc2VcbiAgICAgIEBmaW5kKCcubm8tcGF0aCcpLnNob3coKVxuICAgICAgQGZpbmQoJy53cm9uZy1wYXRoJykuaGlkZSgpXG5cbiAgb3BlblNldHRpbmdzOiAtPlxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4gJ2F0b206Ly9jb25maWcvcGFja2FnZXMnXG4gICAgQHJlbW92ZSgpXG5cbiAgbm90UmlnaHROb3c6IC0+XG4gICAgQHJlbW92ZSgpXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgaGFuZGxlRXJyOiAoZXJyKSAtPlxuICAgIHJldHVybiBmYWxzZSB1bmxlc3MgZXJyP1xuXG4gICAgaWYgZXJyLmlzR2l0RXJyb3JcbiAgICAgIGF0b20ud29ya3NwYWNlLmFkZFRvcFBhbmVsIGl0ZW06IG5ldyBHaXROb3RGb3VuZEVycm9yVmlldyhlcnIpXG4gICAgZWxzZVxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIGVyci5tZXNzYWdlXG4gICAgICBjb25zb2xlLmVycm9yIGVyci5tZXNzYWdlLCBlcnIudHJhY2VcbiAgICB0cnVlXG4iXX0=
