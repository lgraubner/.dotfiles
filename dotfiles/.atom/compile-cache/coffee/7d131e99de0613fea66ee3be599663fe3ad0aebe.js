(function() {
  var $, CompositeDisposable, CoveringView, View, _, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('space-pen'), View = ref.View, $ = ref.$;

  _ = require('underscore-plus');

  CoveringView = (function(superClass) {
    extend(CoveringView, superClass);

    function CoveringView() {
      return CoveringView.__super__.constructor.apply(this, arguments);
    }

    CoveringView.prototype.initialize = function(editor) {
      this.editor = editor;
      this.coverSubs = new CompositeDisposable;
      this.overlay = this.editor.decorateMarker(this.cover(), {
        type: 'overlay',
        item: this,
        position: 'tail'
      });
      return this.coverSubs.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.cleanup();
        };
      })(this)));
    };

    CoveringView.prototype.attached = function() {
      var view;
      view = atom.views.getView(this.editor);
      this.parent().css({
        right: view.getVerticalScrollbarWidth()
      });
      this.css({
        'margin-top': -this.editor.getLineHeightInPixels()
      });
      return this.height(this.editor.getLineHeightInPixels());
    };

    CoveringView.prototype.cleanup = function() {
      var ref1;
      this.coverSubs.dispose();
      if ((ref1 = this.overlay) != null) {
        ref1.destroy();
      }
      return this.overlay = null;
    };

    CoveringView.prototype.cover = function() {
      return null;
    };

    CoveringView.prototype.conflict = function() {
      return null;
    };

    CoveringView.prototype.isDirty = function() {
      return false;
    };

    CoveringView.prototype.detectDirty = function() {
      return null;
    };

    CoveringView.prototype.decorate = function() {
      return null;
    };

    CoveringView.prototype.getModel = function() {
      return null;
    };

    CoveringView.prototype.buffer = function() {
      return this.editor.getBuffer();
    };

    CoveringView.prototype.includesCursor = function(cursor) {
      return false;
    };

    CoveringView.prototype.deleteMarker = function(marker) {
      this.buffer()["delete"](marker.getBufferRange());
      return marker.destroy();
    };

    CoveringView.prototype.scrollTo = function(positionOrNull) {
      if (positionOrNull != null) {
        return this.editor.setCursorBufferPosition(positionOrNull);
      }
    };

    CoveringView.prototype.prependKeystroke = function(eventName, element) {
      var bindings, e, i, len, original, results;
      bindings = atom.keymaps.findKeyBindings({
        command: eventName
      });
      results = [];
      for (i = 0, len = bindings.length; i < len; i++) {
        e = bindings[i];
        original = element.text();
        results.push(element.text(_.humanizeKeystroke(e.keystrokes) + (" " + original)));
      }
      return results;
    };

    return CoveringView;

  })(View);

  module.exports = {
    CoveringView: CoveringView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi92aWV3L2NvdmVyaW5nLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxrREFBQTtJQUFBOzs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLE1BQVksT0FBQSxDQUFRLFdBQVIsQ0FBWixFQUFDLGVBQUQsRUFBTzs7RUFDUCxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztFQUdFOzs7Ozs7OzJCQUVKLFVBQUEsR0FBWSxTQUFDLE1BQUQ7TUFBQyxJQUFDLENBQUEsU0FBRDtNQUNYLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBSTtNQUNqQixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsY0FBUixDQUF1QixJQUFDLENBQUEsS0FBRCxDQUFBLENBQXZCLEVBQ1Q7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLElBQUEsRUFBTSxJQUROO1FBRUEsUUFBQSxFQUFVLE1BRlY7T0FEUzthQUtYLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLElBQUMsQ0FBQSxNQUFNLENBQUMsWUFBUixDQUFxQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLE9BQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQixDQUFmO0lBUFU7OzJCQVNaLFFBQUEsR0FBVSxTQUFBO0FBQ1IsVUFBQTtNQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBQyxDQUFBLE1BQXBCO01BQ1AsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFTLENBQUMsR0FBVixDQUFjO1FBQUEsS0FBQSxFQUFPLElBQUksQ0FBQyx5QkFBTCxDQUFBLENBQVA7T0FBZDtNQUVBLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxZQUFBLEVBQWMsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLHFCQUFSLENBQUEsQ0FBZjtPQUFMO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBUSxJQUFDLENBQUEsTUFBTSxDQUFDLHFCQUFSLENBQUEsQ0FBUjtJQUxROzsyQkFPVixPQUFBLEdBQVMsU0FBQTtBQUNQLFVBQUE7TUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLE9BQVgsQ0FBQTs7WUFFUSxDQUFFLE9BQVYsQ0FBQTs7YUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXO0lBSko7OzJCQU9ULEtBQUEsR0FBTyxTQUFBO2FBQUc7SUFBSDs7MkJBR1AsUUFBQSxHQUFVLFNBQUE7YUFBRztJQUFIOzsyQkFFVixPQUFBLEdBQVMsU0FBQTthQUFHO0lBQUg7OzJCQUdULFdBQUEsR0FBYSxTQUFBO2FBQUc7SUFBSDs7MkJBR2IsUUFBQSxHQUFVLFNBQUE7YUFBRztJQUFIOzsyQkFFVixRQUFBLEdBQVUsU0FBQTthQUFHO0lBQUg7OzJCQUVWLE1BQUEsR0FBUSxTQUFBO2FBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUE7SUFBSDs7MkJBRVIsY0FBQSxHQUFnQixTQUFDLE1BQUQ7YUFBWTtJQUFaOzsyQkFFaEIsWUFBQSxHQUFjLFNBQUMsTUFBRDtNQUNaLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBUyxFQUFDLE1BQUQsRUFBVCxDQUFpQixNQUFNLENBQUMsY0FBUCxDQUFBLENBQWpCO2FBQ0EsTUFBTSxDQUFDLE9BQVAsQ0FBQTtJQUZZOzsyQkFJZCxRQUFBLEdBQVUsU0FBQyxjQUFEO01BQ1IsSUFBa0Qsc0JBQWxEO2VBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFnQyxjQUFoQyxFQUFBOztJQURROzsyQkFHVixnQkFBQSxHQUFrQixTQUFDLFNBQUQsRUFBWSxPQUFaO0FBQ2hCLFVBQUE7TUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFiLENBQTZCO1FBQUEsT0FBQSxFQUFTLFNBQVQ7T0FBN0I7QUFFWDtXQUFBLDBDQUFBOztRQUNFLFFBQUEsR0FBVyxPQUFPLENBQUMsSUFBUixDQUFBO3FCQUNYLE9BQU8sQ0FBQyxJQUFSLENBQWEsQ0FBQyxDQUFDLGlCQUFGLENBQW9CLENBQUMsQ0FBQyxVQUF0QixDQUFBLEdBQW9DLENBQUEsR0FBQSxHQUFJLFFBQUosQ0FBakQ7QUFGRjs7SUFIZ0I7Ozs7S0FuRE87O0VBMEQzQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsWUFBQSxFQUFjLFlBQWQ7O0FBaEVGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbntWaWV3LCAkfSA9IHJlcXVpcmUgJ3NwYWNlLXBlbidcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5cblxuY2xhc3MgQ292ZXJpbmdWaWV3IGV4dGVuZHMgVmlld1xuXG4gIGluaXRpYWxpemU6IChAZWRpdG9yKSAtPlxuICAgIEBjb3ZlclN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBvdmVybGF5ID0gQGVkaXRvci5kZWNvcmF0ZU1hcmtlciBAY292ZXIoKSxcbiAgICAgIHR5cGU6ICdvdmVybGF5JyxcbiAgICAgIGl0ZW06IHRoaXMsXG4gICAgICBwb3NpdGlvbjogJ3RhaWwnXG5cbiAgICBAY292ZXJTdWJzLmFkZCBAZWRpdG9yLm9uRGlkRGVzdHJveSA9PiBAY2xlYW51cCgpXG5cbiAgYXR0YWNoZWQ6IC0+XG4gICAgdmlldyA9IGF0b20udmlld3MuZ2V0VmlldyhAZWRpdG9yKVxuICAgIEBwYXJlbnQoKS5jc3MgcmlnaHQ6IHZpZXcuZ2V0VmVydGljYWxTY3JvbGxiYXJXaWR0aCgpXG5cbiAgICBAY3NzICdtYXJnaW4tdG9wJzogLUBlZGl0b3IuZ2V0TGluZUhlaWdodEluUGl4ZWxzKClcbiAgICBAaGVpZ2h0IEBlZGl0b3IuZ2V0TGluZUhlaWdodEluUGl4ZWxzKClcblxuICBjbGVhbnVwOiAtPlxuICAgIEBjb3ZlclN1YnMuZGlzcG9zZSgpXG5cbiAgICBAb3ZlcmxheT8uZGVzdHJveSgpXG4gICAgQG92ZXJsYXkgPSBudWxsXG5cbiAgIyBPdmVycmlkZSB0byBzcGVjaWZ5IHRoZSBtYXJrZXIgb2YgdGhlIGZpcnN0IGxpbmUgdGhhdCBzaG91bGQgYmUgY292ZXJlZC5cbiAgY292ZXI6IC0+IG51bGxcblxuICAjIE92ZXJyaWRlIHRvIHJldHVybiB0aGUgQ29uZmxpY3QgdGhhdCB0aGlzIHZpZXcgaXMgcmVzcG9uc2libGUgZm9yLlxuICBjb25mbGljdDogLT4gbnVsbFxuXG4gIGlzRGlydHk6IC0+IGZhbHNlXG5cbiAgIyBPdmVycmlkZSB0byBkZXRlcm1pbmUgaWYgdGhlIGNvbnRlbnQgb2YgdGhpcyBTaWRlIGhhcyBiZWVuIG1vZGlmaWVkLlxuICBkZXRlY3REaXJ0eTogLT4gbnVsbFxuXG4gICMgT3ZlcnJpZGUgdG8gYXBwbHkgYSBkZWNvcmF0aW9uIHRvIGEgbWFya2VyIGFzIGFwcHJvcHJpYXRlLlxuICBkZWNvcmF0ZTogLT4gbnVsbFxuXG4gIGdldE1vZGVsOiAtPiBudWxsXG5cbiAgYnVmZmVyOiAtPiBAZWRpdG9yLmdldEJ1ZmZlcigpXG5cbiAgaW5jbHVkZXNDdXJzb3I6IChjdXJzb3IpIC0+IGZhbHNlXG5cbiAgZGVsZXRlTWFya2VyOiAobWFya2VyKSAtPlxuICAgIEBidWZmZXIoKS5kZWxldGUgbWFya2VyLmdldEJ1ZmZlclJhbmdlKClcbiAgICBtYXJrZXIuZGVzdHJveSgpXG5cbiAgc2Nyb2xsVG86IChwb3NpdGlvbk9yTnVsbCkgLT5cbiAgICBAZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIHBvc2l0aW9uT3JOdWxsIGlmIHBvc2l0aW9uT3JOdWxsP1xuXG4gIHByZXBlbmRLZXlzdHJva2U6IChldmVudE5hbWUsIGVsZW1lbnQpIC0+XG4gICAgYmluZGluZ3MgPSBhdG9tLmtleW1hcHMuZmluZEtleUJpbmRpbmdzIGNvbW1hbmQ6IGV2ZW50TmFtZVxuXG4gICAgZm9yIGUgaW4gYmluZGluZ3NcbiAgICAgIG9yaWdpbmFsID0gZWxlbWVudC50ZXh0KClcbiAgICAgIGVsZW1lbnQudGV4dChfLmh1bWFuaXplS2V5c3Ryb2tlKGUua2V5c3Ryb2tlcykgKyBcIiAje29yaWdpbmFsfVwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIENvdmVyaW5nVmlldzogQ292ZXJpbmdWaWV3XG4iXX0=
