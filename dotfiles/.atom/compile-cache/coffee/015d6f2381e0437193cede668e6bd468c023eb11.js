(function() {
  var RegionRenderer, UnderlineRenderer,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  RegionRenderer = require('./region-renderer');

  module.exports = UnderlineRenderer = (function(superClass) {
    extend(UnderlineRenderer, superClass);

    function UnderlineRenderer() {
      return UnderlineRenderer.__super__.constructor.apply(this, arguments);
    }

    UnderlineRenderer.prototype.render = function(colorMarker) {
      var color, i, len, region, regions;
      color = colorMarker != null ? colorMarker.color : void 0;
      if (color == null) {
        return {};
      }
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

    UnderlineRenderer.prototype.styleRegion = function(region, color) {
      region.classList.add('underline');
      return region.style.backgroundColor = color;
    };

    return UnderlineRenderer;

  })(RegionRenderer);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlbmRlcmVycy91bmRlcmxpbmUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxpQ0FBQTtJQUFBOzs7RUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUjs7RUFFakIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztnQ0FDSixNQUFBLEdBQVEsU0FBQyxXQUFEO0FBQ04sVUFBQTtNQUFBLEtBQUEseUJBQVEsV0FBVyxDQUFFO01BQ3JCLElBQWlCLGFBQWpCO0FBQUEsZUFBTyxHQUFQOztNQUVBLE9BQUEsR0FBVSxJQUFDLENBQUEsYUFBRCxDQUFlLFdBQWY7QUFFVixXQUFBLHlDQUFBOztZQUErRDtVQUEvRCxJQUFDLENBQUEsV0FBRCxDQUFhLE1BQWIsRUFBcUIsS0FBSyxDQUFDLEtBQU4sQ0FBQSxDQUFyQjs7QUFBQTthQUNBO1FBQUMsU0FBQSxPQUFEOztJQVBNOztnQ0FTUixXQUFBLEdBQWEsU0FBQyxNQUFELEVBQVMsS0FBVDtNQUNYLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBakIsQ0FBcUIsV0FBckI7YUFFQSxNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWIsR0FBK0I7SUFIcEI7Ozs7S0FWaUI7QUFIaEMiLCJzb3VyY2VzQ29udGVudCI6WyJSZWdpb25SZW5kZXJlciA9IHJlcXVpcmUgJy4vcmVnaW9uLXJlbmRlcmVyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBVbmRlcmxpbmVSZW5kZXJlciBleHRlbmRzIFJlZ2lvblJlbmRlcmVyXG4gIHJlbmRlcjogKGNvbG9yTWFya2VyKSAtPlxuICAgIGNvbG9yID0gY29sb3JNYXJrZXI/LmNvbG9yXG4gICAgcmV0dXJuIHt9IHVubGVzcyBjb2xvcj9cblxuICAgIHJlZ2lvbnMgPSBAcmVuZGVyUmVnaW9ucyhjb2xvck1hcmtlcilcblxuICAgIEBzdHlsZVJlZ2lvbihyZWdpb24sIGNvbG9yLnRvQ1NTKCkpIGZvciByZWdpb24gaW4gcmVnaW9ucyB3aGVuIHJlZ2lvbj9cbiAgICB7cmVnaW9uc31cblxuICBzdHlsZVJlZ2lvbjogKHJlZ2lvbiwgY29sb3IpIC0+XG4gICAgcmVnaW9uLmNsYXNzTGlzdC5hZGQoJ3VuZGVybGluZScpXG5cbiAgICByZWdpb24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3JcbiJdfQ==
