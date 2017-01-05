(function() {
  var BaseSide, OurSide, Side, TheirSide,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Side = (function() {
    function Side(originalText, ref, marker, refBannerMarker, position) {
      this.originalText = originalText;
      this.ref = ref;
      this.marker = marker;
      this.refBannerMarker = refBannerMarker;
      this.position = position;
      this.conflict = null;
      this.isDirty = false;
      this.followingMarker = null;
    }

    Side.prototype.resolve = function() {
      return this.conflict.resolveAs(this);
    };

    Side.prototype.wasChosen = function() {
      return this.conflict.resolution === this;
    };

    Side.prototype.lineClass = function() {
      if (this.wasChosen()) {
        return 'conflict-resolved';
      } else if (this.isDirty) {
        return 'conflict-dirty';
      } else {
        return "conflict-" + (this.klass());
      }
    };

    Side.prototype.markers = function() {
      return [this.marker, this.refBannerMarker];
    };

    Side.prototype.toString = function() {
      var chosenMark, dirtyMark, text;
      text = this.originalText.replace(/[\n\r]/, ' ');
      if (text.length > 20) {
        text = text.slice(0, 18) + "...";
      }
      dirtyMark = this.isDirty ? ' dirty' : '';
      chosenMark = this.wasChosen() ? ' chosen' : '';
      return "[" + (this.klass()) + ": " + text + " :" + dirtyMark + chosenMark + "]";
    };

    return Side;

  })();

  OurSide = (function(superClass) {
    extend(OurSide, superClass);

    function OurSide() {
      return OurSide.__super__.constructor.apply(this, arguments);
    }

    OurSide.prototype.site = function() {
      return 1;
    };

    OurSide.prototype.klass = function() {
      return 'ours';
    };

    OurSide.prototype.description = function() {
      return 'our changes';
    };

    OurSide.prototype.eventName = function() {
      return 'merge-conflicts:accept-ours';
    };

    return OurSide;

  })(Side);

  TheirSide = (function(superClass) {
    extend(TheirSide, superClass);

    function TheirSide() {
      return TheirSide.__super__.constructor.apply(this, arguments);
    }

    TheirSide.prototype.site = function() {
      return 2;
    };

    TheirSide.prototype.klass = function() {
      return 'theirs';
    };

    TheirSide.prototype.description = function() {
      return 'their changes';
    };

    TheirSide.prototype.eventName = function() {
      return 'merge-conflicts:accept-theirs';
    };

    return TheirSide;

  })(Side);

  BaseSide = (function(superClass) {
    extend(BaseSide, superClass);

    function BaseSide() {
      return BaseSide.__super__.constructor.apply(this, arguments);
    }

    BaseSide.prototype.site = function() {
      return 3;
    };

    BaseSide.prototype.klass = function() {
      return 'base';
    };

    BaseSide.prototype.description = function() {
      return 'merged base';
    };

    BaseSide.prototype.eventName = function() {
      return 'merge-conflicts:accept-base';
    };

    return BaseSide;

  })(Side);

  module.exports = {
    Side: Side,
    OurSide: OurSide,
    TheirSide: TheirSide,
    BaseSide: BaseSide
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi9zaWRlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsa0NBQUE7SUFBQTs7O0VBQU07SUFDUyxjQUFDLFlBQUQsRUFBZ0IsR0FBaEIsRUFBc0IsTUFBdEIsRUFBK0IsZUFBL0IsRUFBaUQsUUFBakQ7TUFBQyxJQUFDLENBQUEsZUFBRDtNQUFlLElBQUMsQ0FBQSxNQUFEO01BQU0sSUFBQyxDQUFBLFNBQUQ7TUFBUyxJQUFDLENBQUEsa0JBQUQ7TUFBa0IsSUFBQyxDQUFBLFdBQUQ7TUFDNUQsSUFBQyxDQUFBLFFBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxPQUFELEdBQVc7TUFDWCxJQUFDLENBQUEsZUFBRCxHQUFtQjtJQUhSOzttQkFLYixPQUFBLEdBQVMsU0FBQTthQUFHLElBQUMsQ0FBQSxRQUFRLENBQUMsU0FBVixDQUFvQixJQUFwQjtJQUFIOzttQkFFVCxTQUFBLEdBQVcsU0FBQTthQUFHLElBQUMsQ0FBQSxRQUFRLENBQUMsVUFBVixLQUF3QjtJQUEzQjs7bUJBRVgsU0FBQSxHQUFXLFNBQUE7TUFDVCxJQUFHLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBSDtlQUNFLG9CQURGO09BQUEsTUFFSyxJQUFHLElBQUMsQ0FBQSxPQUFKO2VBQ0gsaUJBREc7T0FBQSxNQUFBO2VBR0gsV0FBQSxHQUFXLENBQUMsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFELEVBSFI7O0lBSEk7O21CQVFYLE9BQUEsR0FBUyxTQUFBO2FBQUcsQ0FBQyxJQUFDLENBQUEsTUFBRixFQUFVLElBQUMsQ0FBQSxlQUFYO0lBQUg7O21CQUVULFFBQUEsR0FBVSxTQUFBO0FBQ1IsVUFBQTtNQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBc0IsUUFBdEIsRUFBZ0MsR0FBaEM7TUFDUCxJQUFHLElBQUksQ0FBQyxNQUFMLEdBQWMsRUFBakI7UUFDRSxJQUFBLEdBQU8sSUFBSyxhQUFMLEdBQWMsTUFEdkI7O01BRUEsU0FBQSxHQUFlLElBQUMsQ0FBQSxPQUFKLEdBQWlCLFFBQWpCLEdBQStCO01BQzNDLFVBQUEsR0FBZ0IsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFILEdBQXFCLFNBQXJCLEdBQW9DO2FBQ2pELEdBQUEsR0FBRyxDQUFDLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBRCxDQUFILEdBQWEsSUFBYixHQUFpQixJQUFqQixHQUFzQixJQUF0QixHQUEwQixTQUExQixHQUFzQyxVQUF0QyxHQUFpRDtJQU56Qzs7Ozs7O0VBU047Ozs7Ozs7c0JBRUosSUFBQSxHQUFNLFNBQUE7YUFBRztJQUFIOztzQkFFTixLQUFBLEdBQU8sU0FBQTthQUFHO0lBQUg7O3NCQUVQLFdBQUEsR0FBYSxTQUFBO2FBQUc7SUFBSDs7c0JBRWIsU0FBQSxHQUFXLFNBQUE7YUFBRztJQUFIOzs7O0tBUlM7O0VBVWhCOzs7Ozs7O3dCQUVKLElBQUEsR0FBTSxTQUFBO2FBQUc7SUFBSDs7d0JBRU4sS0FBQSxHQUFPLFNBQUE7YUFBRztJQUFIOzt3QkFFUCxXQUFBLEdBQWEsU0FBQTthQUFHO0lBQUg7O3dCQUViLFNBQUEsR0FBVyxTQUFBO2FBQUc7SUFBSDs7OztLQVJXOztFQVVsQjs7Ozs7Ozt1QkFFSixJQUFBLEdBQU0sU0FBQTthQUFHO0lBQUg7O3VCQUVOLEtBQUEsR0FBTyxTQUFBO2FBQUc7SUFBSDs7dUJBRVAsV0FBQSxHQUFhLFNBQUE7YUFBRztJQUFIOzt1QkFFYixTQUFBLEdBQVcsU0FBQTthQUFHO0lBQUg7Ozs7S0FSVTs7RUFVdkIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLElBQUEsRUFBTSxJQUFOO0lBQ0EsT0FBQSxFQUFTLE9BRFQ7SUFFQSxTQUFBLEVBQVcsU0FGWDtJQUdBLFFBQUEsRUFBVSxRQUhWOztBQTVERiIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNpZGVcbiAgY29uc3RydWN0b3I6IChAb3JpZ2luYWxUZXh0LCBAcmVmLCBAbWFya2VyLCBAcmVmQmFubmVyTWFya2VyLCBAcG9zaXRpb24pIC0+XG4gICAgQGNvbmZsaWN0ID0gbnVsbFxuICAgIEBpc0RpcnR5ID0gZmFsc2VcbiAgICBAZm9sbG93aW5nTWFya2VyID0gbnVsbFxuXG4gIHJlc29sdmU6IC0+IEBjb25mbGljdC5yZXNvbHZlQXMgdGhpc1xuXG4gIHdhc0Nob3NlbjogLT4gQGNvbmZsaWN0LnJlc29sdXRpb24gaXMgdGhpc1xuXG4gIGxpbmVDbGFzczogLT5cbiAgICBpZiBAd2FzQ2hvc2VuKClcbiAgICAgICdjb25mbGljdC1yZXNvbHZlZCdcbiAgICBlbHNlIGlmIEBpc0RpcnR5XG4gICAgICAnY29uZmxpY3QtZGlydHknXG4gICAgZWxzZVxuICAgICAgXCJjb25mbGljdC0je0BrbGFzcygpfVwiXG5cbiAgbWFya2VyczogLT4gW0BtYXJrZXIsIEByZWZCYW5uZXJNYXJrZXJdXG5cbiAgdG9TdHJpbmc6IC0+XG4gICAgdGV4dCA9IEBvcmlnaW5hbFRleHQucmVwbGFjZSgvW1xcblxccl0vLCAnICcpXG4gICAgaWYgdGV4dC5sZW5ndGggPiAyMFxuICAgICAgdGV4dCA9IHRleHRbMC4uMTddICsgXCIuLi5cIlxuICAgIGRpcnR5TWFyayA9IGlmIEBpc0RpcnR5IHRoZW4gJyBkaXJ0eScgZWxzZSAnJ1xuICAgIGNob3Nlbk1hcmsgPSBpZiBAd2FzQ2hvc2VuKCkgdGhlbiAnIGNob3NlbicgZWxzZSAnJ1xuICAgIFwiWyN7QGtsYXNzKCl9OiAje3RleHR9IDoje2RpcnR5TWFya30je2Nob3Nlbk1hcmt9XVwiXG5cblxuY2xhc3MgT3VyU2lkZSBleHRlbmRzIFNpZGVcblxuICBzaXRlOiAtPiAxXG5cbiAga2xhc3M6IC0+ICdvdXJzJ1xuXG4gIGRlc2NyaXB0aW9uOiAtPiAnb3VyIGNoYW5nZXMnXG5cbiAgZXZlbnROYW1lOiAtPiAnbWVyZ2UtY29uZmxpY3RzOmFjY2VwdC1vdXJzJ1xuXG5jbGFzcyBUaGVpclNpZGUgZXh0ZW5kcyBTaWRlXG5cbiAgc2l0ZTogLT4gMlxuXG4gIGtsYXNzOiAtPiAndGhlaXJzJ1xuXG4gIGRlc2NyaXB0aW9uOiAtPiAndGhlaXIgY2hhbmdlcydcblxuICBldmVudE5hbWU6IC0+ICdtZXJnZS1jb25mbGljdHM6YWNjZXB0LXRoZWlycydcblxuY2xhc3MgQmFzZVNpZGUgZXh0ZW5kcyBTaWRlXG5cbiAgc2l0ZTogLT4gM1xuXG4gIGtsYXNzOiAtPiAnYmFzZSdcblxuICBkZXNjcmlwdGlvbjogLT4gJ21lcmdlZCBiYXNlJ1xuXG4gIGV2ZW50TmFtZTogLT4gJ21lcmdlLWNvbmZsaWN0czphY2NlcHQtYmFzZSdcblxubW9kdWxlLmV4cG9ydHMgPVxuICBTaWRlOiBTaWRlXG4gIE91clNpZGU6IE91clNpZGVcbiAgVGhlaXJTaWRlOiBUaGVpclNpZGVcbiAgQmFzZVNpZGU6IEJhc2VTaWRlXG4iXX0=
