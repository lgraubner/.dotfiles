(function() {
  var CompositeDisposable, CoveringView, NavigationView,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  CoveringView = require('./covering-view').CoveringView;

  NavigationView = (function(superClass) {
    extend(NavigationView, superClass);

    function NavigationView() {
      return NavigationView.__super__.constructor.apply(this, arguments);
    }

    NavigationView.content = function(navigator, editor) {
      return this.div({
        "class": 'controls navigation'
      }, (function(_this) {
        return function() {
          _this.text(' ');
          return _this.span({
            "class": 'pull-right'
          }, function() {
            _this.button({
              "class": 'btn btn-xs',
              click: 'up',
              outlet: 'prevBtn'
            }, 'prev');
            return _this.button({
              "class": 'btn btn-xs',
              click: 'down',
              outlet: 'nextBtn'
            }, 'next');
          });
        };
      })(this));
    };

    NavigationView.prototype.initialize = function(navigator1, editor) {
      this.navigator = navigator1;
      this.subs = new CompositeDisposable;
      NavigationView.__super__.initialize.call(this, editor);
      this.prependKeystroke('merge-conflicts:previous-unresolved', this.prevBtn);
      this.prependKeystroke('merge-conflicts:next-unresolved', this.nextBtn);
      return this.subs.add(this.navigator.conflict.onDidResolveConflict((function(_this) {
        return function() {
          _this.deleteMarker(_this.cover());
          _this.remove();
          return _this.cleanup();
        };
      })(this)));
    };

    NavigationView.prototype.cleanup = function() {
      NavigationView.__super__.cleanup.apply(this, arguments);
      return this.subs.dispose();
    };

    NavigationView.prototype.cover = function() {
      return this.navigator.separatorMarker;
    };

    NavigationView.prototype.up = function() {
      var ref;
      return this.scrollTo((ref = this.navigator.previousUnresolved()) != null ? ref.scrollTarget() : void 0);
    };

    NavigationView.prototype.down = function() {
      var ref;
      return this.scrollTo((ref = this.navigator.nextUnresolved()) != null ? ref.scrollTarget() : void 0);
    };

    NavigationView.prototype.conflict = function() {
      return this.navigator.conflict;
    };

    NavigationView.prototype.toString = function() {
      return "{NavView of: " + (this.conflict()) + "}";
    };

    return NavigationView;

  })(CoveringView);

  module.exports = {
    NavigationView: NavigationView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi92aWV3L25hdmlnYXRpb24tdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLGlEQUFBO0lBQUE7OztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDdkIsZUFBZ0IsT0FBQSxDQUFRLGlCQUFSOztFQUVYOzs7Ozs7O0lBRUosY0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLFNBQUQsRUFBWSxNQUFaO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8scUJBQVA7T0FBTCxFQUFtQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDakMsS0FBQyxDQUFBLElBQUQsQ0FBTSxHQUFOO2lCQUNBLEtBQUMsQ0FBQSxJQUFELENBQU07WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFlBQVA7V0FBTixFQUEyQixTQUFBO1lBQ3pCLEtBQUMsQ0FBQSxNQUFELENBQVE7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFlBQVA7Y0FBcUIsS0FBQSxFQUFPLElBQTVCO2NBQWtDLE1BQUEsRUFBUSxTQUExQzthQUFSLEVBQTZELE1BQTdEO21CQUNBLEtBQUMsQ0FBQSxNQUFELENBQVE7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFlBQVA7Y0FBcUIsS0FBQSxFQUFPLE1BQTVCO2NBQW9DLE1BQUEsRUFBUSxTQUE1QzthQUFSLEVBQStELE1BQS9EO1VBRnlCLENBQTNCO1FBRmlDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQztJQURROzs2QkFPVixVQUFBLEdBQVksU0FBQyxVQUFELEVBQWEsTUFBYjtNQUFDLElBQUMsQ0FBQSxZQUFEO01BQ1gsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJO01BRVosK0NBQU0sTUFBTjtNQUVBLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixxQ0FBbEIsRUFBeUQsSUFBQyxDQUFBLE9BQTFEO01BQ0EsSUFBQyxDQUFBLGdCQUFELENBQWtCLGlDQUFsQixFQUFxRCxJQUFDLENBQUEsT0FBdEQ7YUFFQSxJQUFDLENBQUEsSUFBSSxDQUFDLEdBQU4sQ0FBVSxJQUFDLENBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxvQkFBcEIsQ0FBeUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ2pELEtBQUMsQ0FBQSxZQUFELENBQWMsS0FBQyxDQUFBLEtBQUQsQ0FBQSxDQUFkO1VBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBQTtpQkFDQSxLQUFDLENBQUEsT0FBRCxDQUFBO1FBSGlEO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QyxDQUFWO0lBUlU7OzZCQWFaLE9BQUEsR0FBUyxTQUFBO01BQ1AsNkNBQUEsU0FBQTthQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBO0lBRk87OzZCQUlULEtBQUEsR0FBTyxTQUFBO2FBQUcsSUFBQyxDQUFBLFNBQVMsQ0FBQztJQUFkOzs2QkFFUCxFQUFBLEdBQUksU0FBQTtBQUFHLFVBQUE7YUFBQSxJQUFDLENBQUEsUUFBRCwwREFBeUMsQ0FBRSxZQUFqQyxDQUFBLFVBQVY7SUFBSDs7NkJBRUosSUFBQSxHQUFNLFNBQUE7QUFBRyxVQUFBO2FBQUEsSUFBQyxDQUFBLFFBQUQsc0RBQXFDLENBQUUsWUFBN0IsQ0FBQSxVQUFWO0lBQUg7OzZCQUVOLFFBQUEsR0FBVSxTQUFBO2FBQUcsSUFBQyxDQUFBLFNBQVMsQ0FBQztJQUFkOzs2QkFFVixRQUFBLEdBQVUsU0FBQTthQUFHLGVBQUEsR0FBZSxDQUFDLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBRCxDQUFmLEdBQTRCO0lBQS9COzs7O0tBbENpQjs7RUFvQzdCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxjQUFBLEVBQWdCLGNBQWhCOztBQXhDRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57Q292ZXJpbmdWaWV3fSA9IHJlcXVpcmUgJy4vY292ZXJpbmctdmlldydcblxuY2xhc3MgTmF2aWdhdGlvblZpZXcgZXh0ZW5kcyBDb3ZlcmluZ1ZpZXdcblxuICBAY29udGVudDogKG5hdmlnYXRvciwgZWRpdG9yKSAtPlxuICAgIEBkaXYgY2xhc3M6ICdjb250cm9scyBuYXZpZ2F0aW9uJywgPT5cbiAgICAgIEB0ZXh0ICcgJ1xuICAgICAgQHNwYW4gY2xhc3M6ICdwdWxsLXJpZ2h0JywgPT5cbiAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBidG4teHMnLCBjbGljazogJ3VwJywgb3V0bGV0OiAncHJldkJ0bicsICdwcmV2J1xuICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuIGJ0bi14cycsIGNsaWNrOiAnZG93bicsIG91dGxldDogJ25leHRCdG4nLCAnbmV4dCdcblxuICBpbml0aWFsaXplOiAoQG5hdmlnYXRvciwgZWRpdG9yKSAtPlxuICAgIEBzdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIHN1cGVyIGVkaXRvclxuXG4gICAgQHByZXBlbmRLZXlzdHJva2UgJ21lcmdlLWNvbmZsaWN0czpwcmV2aW91cy11bnJlc29sdmVkJywgQHByZXZCdG5cbiAgICBAcHJlcGVuZEtleXN0cm9rZSAnbWVyZ2UtY29uZmxpY3RzOm5leHQtdW5yZXNvbHZlZCcsIEBuZXh0QnRuXG5cbiAgICBAc3Vicy5hZGQgQG5hdmlnYXRvci5jb25mbGljdC5vbkRpZFJlc29sdmVDb25mbGljdCA9PlxuICAgICAgQGRlbGV0ZU1hcmtlciBAY292ZXIoKVxuICAgICAgQHJlbW92ZSgpXG4gICAgICBAY2xlYW51cCgpXG5cbiAgY2xlYW51cDogLT5cbiAgICBzdXBlclxuICAgIEBzdWJzLmRpc3Bvc2UoKVxuXG4gIGNvdmVyOiAtPiBAbmF2aWdhdG9yLnNlcGFyYXRvck1hcmtlclxuXG4gIHVwOiAtPiBAc2Nyb2xsVG8gQG5hdmlnYXRvci5wcmV2aW91c1VucmVzb2x2ZWQoKT8uc2Nyb2xsVGFyZ2V0KClcblxuICBkb3duOiAtPiBAc2Nyb2xsVG8gQG5hdmlnYXRvci5uZXh0VW5yZXNvbHZlZCgpPy5zY3JvbGxUYXJnZXQoKVxuXG4gIGNvbmZsaWN0OiAtPiBAbmF2aWdhdG9yLmNvbmZsaWN0XG5cbiAgdG9TdHJpbmc6IC0+IFwie05hdlZpZXcgb2Y6ICN7QGNvbmZsaWN0KCl9fVwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgTmF2aWdhdGlvblZpZXc6IE5hdmlnYXRpb25WaWV3XG4iXX0=
