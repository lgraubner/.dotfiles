(function() {
  var BackgroundRenderer, RegionRenderer,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  RegionRenderer = require('./region-renderer');

  module.exports = BackgroundRenderer = (function(superClass) {
    extend(BackgroundRenderer, superClass);

    function BackgroundRenderer() {
      return BackgroundRenderer.__super__.constructor.apply(this, arguments);
    }

    BackgroundRenderer.prototype.includeTextInRegion = true;

    BackgroundRenderer.prototype.render = function(colorMarker) {
      var color, colorText, i, l, len, region, regions;
      color = colorMarker != null ? colorMarker.color : void 0;
      if (color == null) {
        return {};
      }
      regions = this.renderRegions(colorMarker);
      l = color.luma;
      colorText = l > 0.43 ? 'black' : 'white';
      for (i = 0, len = regions.length; i < len; i++) {
        region = regions[i];
        if (region != null) {
          this.styleRegion(region, color.toCSS(), colorText);
        }
      }
      return {
        regions: regions
      };
    };

    BackgroundRenderer.prototype.styleRegion = function(region, color, textColor) {
      region.classList.add('background');
      region.style.backgroundColor = color;
      return region.style.color = textColor;
    };

    return BackgroundRenderer;

  })(RegionRenderer);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlbmRlcmVycy9iYWNrZ3JvdW5kLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsa0NBQUE7SUFBQTs7O0VBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVI7O0VBRWpCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7aUNBQ0osbUJBQUEsR0FBcUI7O2lDQUNyQixNQUFBLEdBQVEsU0FBQyxXQUFEO0FBQ04sVUFBQTtNQUFBLEtBQUEseUJBQVEsV0FBVyxDQUFFO01BRXJCLElBQWlCLGFBQWpCO0FBQUEsZUFBTyxHQUFQOztNQUVBLE9BQUEsR0FBVSxJQUFDLENBQUEsYUFBRCxDQUFlLFdBQWY7TUFFVixDQUFBLEdBQUksS0FBSyxDQUFDO01BRVYsU0FBQSxHQUFlLENBQUEsR0FBSSxJQUFQLEdBQWlCLE9BQWpCLEdBQThCO0FBQzFDLFdBQUEseUNBQUE7O1lBQTBFO1VBQTFFLElBQUMsQ0FBQSxXQUFELENBQWEsTUFBYixFQUFxQixLQUFLLENBQUMsS0FBTixDQUFBLENBQXJCLEVBQW9DLFNBQXBDOztBQUFBO2FBQ0E7UUFBQyxTQUFBLE9BQUQ7O0lBWE07O2lDQWFSLFdBQUEsR0FBYSxTQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLFNBQWhCO01BQ1gsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFqQixDQUFxQixZQUFyQjtNQUVBLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBYixHQUErQjthQUMvQixNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWIsR0FBcUI7SUFKVjs7OztLQWZrQjtBQUhqQyIsInNvdXJjZXNDb250ZW50IjpbIlJlZ2lvblJlbmRlcmVyID0gcmVxdWlyZSAnLi9yZWdpb24tcmVuZGVyZXInXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEJhY2tncm91bmRSZW5kZXJlciBleHRlbmRzIFJlZ2lvblJlbmRlcmVyXG4gIGluY2x1ZGVUZXh0SW5SZWdpb246IHRydWVcbiAgcmVuZGVyOiAoY29sb3JNYXJrZXIpIC0+XG4gICAgY29sb3IgPSBjb2xvck1hcmtlcj8uY29sb3JcblxuICAgIHJldHVybiB7fSB1bmxlc3MgY29sb3I/XG5cbiAgICByZWdpb25zID0gQHJlbmRlclJlZ2lvbnMoY29sb3JNYXJrZXIpXG5cbiAgICBsID0gY29sb3IubHVtYVxuXG4gICAgY29sb3JUZXh0ID0gaWYgbCA+IDAuNDMgdGhlbiAnYmxhY2snIGVsc2UgJ3doaXRlJ1xuICAgIEBzdHlsZVJlZ2lvbihyZWdpb24sIGNvbG9yLnRvQ1NTKCksIGNvbG9yVGV4dCkgZm9yIHJlZ2lvbiBpbiByZWdpb25zIHdoZW4gcmVnaW9uP1xuICAgIHtyZWdpb25zfVxuXG4gIHN0eWxlUmVnaW9uOiAocmVnaW9uLCBjb2xvciwgdGV4dENvbG9yKSAtPlxuICAgIHJlZ2lvbi5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kJylcblxuICAgIHJlZ2lvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvclxuICAgIHJlZ2lvbi5zdHlsZS5jb2xvciA9IHRleHRDb2xvclxuIl19
