(function() {
  var CompositeDisposable, CoveringView, SideView,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  CoveringView = require('./covering-view').CoveringView;

  SideView = (function(superClass) {
    extend(SideView, superClass);

    function SideView() {
      return SideView.__super__.constructor.apply(this, arguments);
    }

    SideView.content = function(side, editor) {
      return this.div({
        "class": "side " + (side.klass()) + " " + side.position + " ui-site-" + (side.site())
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'controls'
          }, function() {
            _this.label({
              "class": 'text-highlight'
            }, side.ref);
            _this.span({
              "class": 'text-subtle'
            }, "// " + (side.description()));
            return _this.span({
              "class": 'pull-right'
            }, function() {
              _this.button({
                "class": 'btn btn-xs inline-block-tight revert',
                click: 'revert',
                outlet: 'revertBtn'
              }, 'Revert');
              return _this.button({
                "class": 'btn btn-xs inline-block-tight',
                click: 'useMe',
                outlet: 'useMeBtn'
              }, 'Use Me');
            });
          });
        };
      })(this));
    };

    SideView.prototype.initialize = function(side1, editor) {
      this.side = side1;
      this.subs = new CompositeDisposable;
      this.decoration = null;
      SideView.__super__.initialize.call(this, editor);
      this.detectDirty();
      this.prependKeystroke(this.side.eventName(), this.useMeBtn);
      return this.prependKeystroke('merge-conflicts:revert-current', this.revertBtn);
    };

    SideView.prototype.attached = function() {
      SideView.__super__.attached.apply(this, arguments);
      this.decorate();
      return this.subs.add(this.side.conflict.onDidResolveConflict((function(_this) {
        return function() {
          _this.deleteMarker(_this.side.refBannerMarker);
          if (!_this.side.wasChosen()) {
            _this.deleteMarker(_this.side.marker);
          }
          _this.remove();
          return _this.cleanup();
        };
      })(this)));
    };

    SideView.prototype.cleanup = function() {
      SideView.__super__.cleanup.apply(this, arguments);
      return this.subs.dispose();
    };

    SideView.prototype.cover = function() {
      return this.side.refBannerMarker;
    };

    SideView.prototype.decorate = function() {
      var args, ref;
      if ((ref = this.decoration) != null) {
        ref.destroy();
      }
      if (this.side.conflict.isResolved() && !this.side.wasChosen()) {
        return;
      }
      args = {
        type: 'line',
        "class": this.side.lineClass()
      };
      return this.decoration = this.editor.decorateMarker(this.side.marker, args);
    };

    SideView.prototype.conflict = function() {
      return this.side.conflict;
    };

    SideView.prototype.isDirty = function() {
      return this.side.isDirty;
    };

    SideView.prototype.includesCursor = function(cursor) {
      var h, m, p, ref, t;
      m = this.side.marker;
      ref = [m.getHeadBufferPosition(), m.getTailBufferPosition()], h = ref[0], t = ref[1];
      p = cursor.getBufferPosition();
      return t.isLessThanOrEqual(p) && h.isGreaterThanOrEqual(p);
    };

    SideView.prototype.useMe = function() {
      this.editor.transact((function(_this) {
        return function() {
          return _this.side.resolve();
        };
      })(this));
      return this.decorate();
    };

    SideView.prototype.revert = function() {
      this.editor.setTextInBufferRange(this.side.marker.getBufferRange(), this.side.originalText);
      return this.decorate();
    };

    SideView.prototype.detectDirty = function() {
      var currentText;
      currentText = this.editor.getTextInBufferRange(this.side.marker.getBufferRange());
      this.side.isDirty = currentText !== this.side.originalText;
      this.decorate();
      this.removeClass('dirty');
      if (this.side.isDirty) {
        return this.addClass('dirty');
      }
    };

    SideView.prototype.toString = function() {
      return "{SideView of: " + this.side + "}";
    };

    return SideView;

  })(CoveringView);

  module.exports = {
    SideView: SideView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi92aWV3L3NpZGUtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDJDQUFBO0lBQUE7OztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDdkIsZUFBZ0IsT0FBQSxDQUFRLGlCQUFSOztFQUVYOzs7Ozs7O0lBRUosUUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLElBQUQsRUFBTyxNQUFQO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sT0FBQSxHQUFPLENBQUMsSUFBSSxDQUFDLEtBQUwsQ0FBQSxDQUFELENBQVAsR0FBcUIsR0FBckIsR0FBd0IsSUFBSSxDQUFDLFFBQTdCLEdBQXNDLFdBQXRDLEdBQWdELENBQUMsSUFBSSxDQUFDLElBQUwsQ0FBQSxDQUFELENBQXZEO09BQUwsRUFBNEUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUMxRSxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxVQUFQO1dBQUwsRUFBd0IsU0FBQTtZQUN0QixLQUFDLENBQUEsS0FBRCxDQUFPO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxnQkFBUDthQUFQLEVBQWdDLElBQUksQ0FBQyxHQUFyQztZQUNBLEtBQUMsQ0FBQSxJQUFELENBQU07Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGFBQVA7YUFBTixFQUE0QixLQUFBLEdBQUssQ0FBQyxJQUFJLENBQUMsV0FBTCxDQUFBLENBQUQsQ0FBakM7bUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sWUFBUDthQUFOLEVBQTJCLFNBQUE7Y0FDekIsS0FBQyxDQUFBLE1BQUQsQ0FBUTtn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b250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57Q292ZXJpbmdWaWV3fSA9IHJlcXVpcmUgJy4vY292ZXJpbmctdmlldydcblxuY2xhc3MgU2lkZVZpZXcgZXh0ZW5kcyBDb3ZlcmluZ1ZpZXdcblxuICBAY29udGVudDogKHNpZGUsIGVkaXRvcikgLT5cbiAgICBAZGl2IGNsYXNzOiBcInNpZGUgI3tzaWRlLmtsYXNzKCl9ICN7c2lkZS5wb3NpdGlvbn0gdWktc2l0ZS0je3NpZGUuc2l0ZSgpfVwiLCA9PlxuICAgICAgQGRpdiBjbGFzczogJ2NvbnRyb2xzJywgPT5cbiAgICAgICAgQGxhYmVsIGNsYXNzOiAndGV4dC1oaWdobGlnaHQnLCBzaWRlLnJlZlxuICAgICAgICBAc3BhbiBjbGFzczogJ3RleHQtc3VidGxlJywgXCIvLyAje3NpZGUuZGVzY3JpcHRpb24oKX1cIlxuICAgICAgICBAc3BhbiBjbGFzczogJ3B1bGwtcmlnaHQnLCA9PlxuICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gYnRuLXhzIGlubGluZS1ibG9jay10aWdodCByZXZlcnQnLCBjbGljazogJ3JldmVydCcsIG91dGxldDogJ3JldmVydEJ0bicsICdSZXZlcnQnXG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBidG4teHMgaW5saW5lLWJsb2NrLXRpZ2h0JywgY2xpY2s6ICd1c2VNZScsIG91dGxldDogJ3VzZU1lQnRuJywgJ1VzZSBNZSdcblxuICBpbml0aWFsaXplOiAoQHNpZGUsIGVkaXRvcikgLT5cbiAgICBAc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGRlY29yYXRpb24gPSBudWxsXG5cbiAgICBzdXBlciBlZGl0b3JcblxuICAgIEBkZXRlY3REaXJ0eSgpXG4gICAgQHByZXBlbmRLZXlzdHJva2UgQHNpZGUuZXZlbnROYW1lKCksIEB1c2VNZUJ0blxuICAgIEBwcmVwZW5kS2V5c3Ryb2tlICdtZXJnZS1jb25mbGljdHM6cmV2ZXJ0LWN1cnJlbnQnLCBAcmV2ZXJ0QnRuXG5cbiAgYXR0YWNoZWQ6IC0+XG4gICAgc3VwZXJcblxuICAgIEBkZWNvcmF0ZSgpXG4gICAgQHN1YnMuYWRkIEBzaWRlLmNvbmZsaWN0Lm9uRGlkUmVzb2x2ZUNvbmZsaWN0ID0+XG4gICAgICBAZGVsZXRlTWFya2VyIEBzaWRlLnJlZkJhbm5lck1hcmtlclxuICAgICAgQGRlbGV0ZU1hcmtlciBAc2lkZS5tYXJrZXIgdW5sZXNzIEBzaWRlLndhc0Nob3NlbigpXG4gICAgICBAcmVtb3ZlKClcbiAgICAgIEBjbGVhbnVwKClcblxuICBjbGVhbnVwOiAtPlxuICAgIHN1cGVyXG4gICAgQHN1YnMuZGlzcG9zZSgpXG5cbiAgY292ZXI6IC0+IEBzaWRlLnJlZkJhbm5lck1hcmtlclxuXG4gIGRlY29yYXRlOiAtPlxuICAgIEBkZWNvcmF0aW9uPy5kZXN0cm95KClcblxuICAgIHJldHVybiBpZiBAc2lkZS5jb25mbGljdC5pc1Jlc29sdmVkKCkgJiYgIUBzaWRlLndhc0Nob3NlbigpXG5cbiAgICBhcmdzID1cbiAgICAgIHR5cGU6ICdsaW5lJ1xuICAgICAgY2xhc3M6IEBzaWRlLmxpbmVDbGFzcygpXG4gICAgQGRlY29yYXRpb24gPSBAZWRpdG9yLmRlY29yYXRlTWFya2VyKEBzaWRlLm1hcmtlciwgYXJncylcblxuICBjb25mbGljdDogLT4gQHNpZGUuY29uZmxpY3RcblxuICBpc0RpcnR5OiAtPiBAc2lkZS5pc0RpcnR5XG5cbiAgaW5jbHVkZXNDdXJzb3I6IChjdXJzb3IpIC0+XG4gICAgbSA9IEBzaWRlLm1hcmtlclxuICAgIFtoLCB0XSA9IFttLmdldEhlYWRCdWZmZXJQb3NpdGlvbigpLCBtLmdldFRhaWxCdWZmZXJQb3NpdGlvbigpXVxuICAgIHAgPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgIHQuaXNMZXNzVGhhbk9yRXF1YWwocCkgYW5kIGguaXNHcmVhdGVyVGhhbk9yRXF1YWwocClcblxuICB1c2VNZTogLT5cbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBAc2lkZS5yZXNvbHZlKClcbiAgICBAZGVjb3JhdGUoKVxuXG4gIHJldmVydDogLT5cbiAgICBAZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlIEBzaWRlLm1hcmtlci5nZXRCdWZmZXJSYW5nZSgpLCBAc2lkZS5vcmlnaW5hbFRleHRcbiAgICBAZGVjb3JhdGUoKVxuXG4gIGRldGVjdERpcnR5OiAtPlxuICAgIGN1cnJlbnRUZXh0ID0gQGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZSBAc2lkZS5tYXJrZXIuZ2V0QnVmZmVyUmFuZ2UoKVxuICAgIEBzaWRlLmlzRGlydHkgPSBjdXJyZW50VGV4dCBpc250IEBzaWRlLm9yaWdpbmFsVGV4dFxuXG4gICAgQGRlY29yYXRlKClcblxuICAgIEByZW1vdmVDbGFzcyAnZGlydHknXG4gICAgQGFkZENsYXNzICdkaXJ0eScgaWYgQHNpZGUuaXNEaXJ0eVxuXG4gIHRvU3RyaW5nOiAtPiBcIntTaWRlVmlldyBvZjogI3tAc2lkZX19XCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBTaWRlVmlldzogU2lkZVZpZXdcbiJdfQ==
