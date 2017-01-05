(function() {
  var OutlineRenderer, RegionRenderer,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  RegionRenderer = require('./region-renderer');

  module.exports = OutlineRenderer = (function(superClass) {
    extend(OutlineRenderer, superClass);

    function OutlineRenderer() {
      return OutlineRenderer.__super__.constructor.apply(this, arguments);
    }

    OutlineRenderer.prototype.render = function(colorMarker) {
      var color, i, len, range, region, regions, rowSpan;
      range = colorMarker.getScreenRange();
      color = colorMarker.color;
      if (range.isEmpty() || (color == null)) {
        return {};
      }
      rowSpan = range.end.row - range.start.row;
      regions = this.renderRegions(colorMarker);
      for (i = 0, len = regions.length; i < len; i++) {
        region = regions[i];
        if (region != null) {
          this.styleRegion(region, color.toCSS());
        }
      }
      return {
        regions: regions
      };
    };

    OutlineRenderer.prototype.styleRegion = function(region, color) {
      region.classList.add('outline');
      return region.style.borderColor = color;
    };

    return OutlineRenderer;

  })(RegionRenderer);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlbmRlcmVycy9vdXRsaW5lLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsK0JBQUE7SUFBQTs7O0VBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVI7O0VBRWpCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7OEJBQ0osTUFBQSxHQUFRLFNBQUMsV0FBRDtBQUNOLFVBQUE7TUFBQSxLQUFBLEdBQVEsV0FBVyxDQUFDLGNBQVosQ0FBQTtNQUNSLEtBQUEsR0FBUSxXQUFXLENBQUM7TUFDcEIsSUFBYSxLQUFLLENBQUMsT0FBTixDQUFBLENBQUEsSUFBdUIsZUFBcEM7QUFBQSxlQUFPLEdBQVA7O01BRUEsT0FBQSxHQUFVLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBVixHQUFnQixLQUFLLENBQUMsS0FBSyxDQUFDO01BQ3RDLE9BQUEsR0FBVSxJQUFDLENBQUEsYUFBRCxDQUFlLFdBQWY7QUFFVixXQUFBLHlDQUFBOztZQUErRDtVQUEvRCxJQUFDLENBQUEsV0FBRCxDQUFhLE1BQWIsRUFBcUIsS0FBSyxDQUFDLEtBQU4sQ0FBQSxDQUFyQjs7QUFBQTthQUNBO1FBQUMsU0FBQSxPQUFEOztJQVRNOzs4QkFXUixXQUFBLEdBQWEsU0FBQyxNQUFELEVBQVMsS0FBVDtNQUNYLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBakIsQ0FBcUIsU0FBckI7YUFDQSxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQWIsR0FBMkI7SUFGaEI7Ozs7S0FaZTtBQUg5QiIsInNvdXJjZXNDb250ZW50IjpbIlJlZ2lvblJlbmRlcmVyID0gcmVxdWlyZSAnLi9yZWdpb24tcmVuZGVyZXInXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIE91dGxpbmVSZW5kZXJlciBleHRlbmRzIFJlZ2lvblJlbmRlcmVyXG4gIHJlbmRlcjogKGNvbG9yTWFya2VyKSAtPlxuICAgIHJhbmdlID0gY29sb3JNYXJrZXIuZ2V0U2NyZWVuUmFuZ2UoKVxuICAgIGNvbG9yID0gY29sb3JNYXJrZXIuY29sb3JcbiAgICByZXR1cm4ge30gaWYgcmFuZ2UuaXNFbXB0eSgpIG9yIG5vdCBjb2xvcj9cblxuICAgIHJvd1NwYW4gPSByYW5nZS5lbmQucm93IC0gcmFuZ2Uuc3RhcnQucm93XG4gICAgcmVnaW9ucyA9IEByZW5kZXJSZWdpb25zKGNvbG9yTWFya2VyKVxuXG4gICAgQHN0eWxlUmVnaW9uKHJlZ2lvbiwgY29sb3IudG9DU1MoKSkgZm9yIHJlZ2lvbiBpbiByZWdpb25zIHdoZW4gcmVnaW9uP1xuICAgIHtyZWdpb25zfVxuXG4gIHN0eWxlUmVnaW9uOiAocmVnaW9uLCBjb2xvcikgLT5cbiAgICByZWdpb24uY2xhc3NMaXN0LmFkZCgnb3V0bGluZScpXG4gICAgcmVnaW9uLnN0eWxlLmJvcmRlckNvbG9yID0gY29sb3JcbiJdfQ==
