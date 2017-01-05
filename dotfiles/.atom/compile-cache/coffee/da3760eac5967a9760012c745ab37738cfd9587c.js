(function() {
  var Palette;

  module.exports = Palette = (function() {
    Palette.deserialize = function(state) {
      return new Palette(state.variables);
    };

    function Palette(variables) {
      this.variables = variables != null ? variables : [];
    }

    Palette.prototype.getTitle = function() {
      return 'Palette';
    };

    Palette.prototype.getURI = function() {
      return 'pigments://palette';
    };

    Palette.prototype.getIconName = function() {
      return "pigments";
    };

    Palette.prototype.sortedByColor = function() {
      return this.variables.slice().sort((function(_this) {
        return function(arg, arg1) {
          var a, b;
          a = arg.color;
          b = arg1.color;
          return _this.compareColors(a, b);
        };
      })(this));
    };

    Palette.prototype.sortedByName = function() {
      var collator;
      collator = new Intl.Collator("en-US", {
        numeric: true
      });
      return this.variables.slice().sort(function(arg, arg1) {
        var a, b;
        a = arg.name;
        b = arg1.name;
        return collator.compare(a, b);
      });
    };

    Palette.prototype.getColorsNames = function() {
      return this.variables.map(function(v) {
        return v.name;
      });
    };

    Palette.prototype.getColorsCount = function() {
      return this.variables.length;
    };

    Palette.prototype.eachColor = function(iterator) {
      var i, len, ref, results, v;
      ref = this.variables;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        v = ref[i];
        results.push(iterator(v));
      }
      return results;
    };

    Palette.prototype.compareColors = function(a, b) {
      var aHue, aLightness, aSaturation, bHue, bLightness, bSaturation, ref, ref1;
      ref = a.hsl, aHue = ref[0], aSaturation = ref[1], aLightness = ref[2];
      ref1 = b.hsl, bHue = ref1[0], bSaturation = ref1[1], bLightness = ref1[2];
      if (aHue < bHue) {
        return -1;
      } else if (aHue > bHue) {
        return 1;
      } else if (aSaturation < bSaturation) {
        return -1;
      } else if (aSaturation > bSaturation) {
        return 1;
      } else if (aLightness < bLightness) {
        return -1;
      } else if (aLightness > bLightness) {
        return 1;
      } else {
        return 0;
      }
    };

    Palette.prototype.serialize = function() {
      return {
        deserializer: 'Palette',
        variables: this.variables
      };
    };

    return Palette;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3BhbGV0dGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ0osT0FBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLEtBQUQ7YUFBZSxJQUFBLE9BQUEsQ0FBUSxLQUFLLENBQUMsU0FBZDtJQUFmOztJQUVELGlCQUFDLFNBQUQ7TUFBQyxJQUFDLENBQUEsZ0NBQUQsWUFBVztJQUFaOztzQkFFYixRQUFBLEdBQVUsU0FBQTthQUFHO0lBQUg7O3NCQUVWLE1BQUEsR0FBUSxTQUFBO2FBQUc7SUFBSDs7c0JBRVIsV0FBQSxHQUFhLFNBQUE7YUFBRztJQUFIOztzQkFFYixhQUFBLEdBQWUsU0FBQTthQUNiLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FBWCxDQUFBLENBQWtCLENBQUMsSUFBbkIsQ0FBd0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQsRUFBWSxJQUFaO0FBQTBCLGNBQUE7VUFBbEIsSUFBUCxJQUFDO1VBQWlCLElBQVAsS0FBQztpQkFBYSxLQUFDLENBQUEsYUFBRCxDQUFlLENBQWYsRUFBaUIsQ0FBakI7UUFBMUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhCO0lBRGE7O3NCQUdmLFlBQUEsR0FBYyxTQUFBO0FBQ1osVUFBQTtNQUFBLFFBQUEsR0FBZSxJQUFBLElBQUksQ0FBQyxRQUFMLENBQWMsT0FBZCxFQUF1QjtRQUFBLE9BQUEsRUFBUyxJQUFUO09BQXZCO2FBQ2YsSUFBQyxDQUFBLFNBQVMsQ0FBQyxLQUFYLENBQUEsQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixTQUFDLEdBQUQsRUFBVyxJQUFYO0FBQXdCLFlBQUE7UUFBakIsSUFBTixJQUFDO1FBQWUsSUFBTixLQUFDO2VBQVksUUFBUSxDQUFDLE9BQVQsQ0FBaUIsQ0FBakIsRUFBbUIsQ0FBbkI7TUFBeEIsQ0FBeEI7SUFGWTs7c0JBSWQsY0FBQSxHQUFnQixTQUFBO2FBQUcsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsU0FBQyxDQUFEO2VBQU8sQ0FBQyxDQUFDO01BQVQsQ0FBZjtJQUFIOztzQkFFaEIsY0FBQSxHQUFnQixTQUFBO2FBQUcsSUFBQyxDQUFBLFNBQVMsQ0FBQztJQUFkOztzQkFFaEIsU0FBQSxHQUFXLFNBQUMsUUFBRDtBQUFjLFVBQUE7QUFBQTtBQUFBO1dBQUEscUNBQUE7O3FCQUFBLFFBQUEsQ0FBUyxDQUFUO0FBQUE7O0lBQWQ7O3NCQUVYLGFBQUEsR0FBZSxTQUFDLENBQUQsRUFBRyxDQUFIO0FBQ2IsVUFBQTtNQUFBLE1BQWtDLENBQUMsQ0FBQyxHQUFwQyxFQUFDLGFBQUQsRUFBTyxvQkFBUCxFQUFvQjtNQUNwQixPQUFrQyxDQUFDLENBQUMsR0FBcEMsRUFBQyxjQUFELEVBQU8scUJBQVAsRUFBb0I7TUFDcEIsSUFBRyxJQUFBLEdBQU8sSUFBVjtlQUNFLENBQUMsRUFESDtPQUFBLE1BRUssSUFBRyxJQUFBLEdBQU8sSUFBVjtlQUNILEVBREc7T0FBQSxNQUVBLElBQUcsV0FBQSxHQUFjLFdBQWpCO2VBQ0gsQ0FBQyxFQURFO09BQUEsTUFFQSxJQUFHLFdBQUEsR0FBYyxXQUFqQjtlQUNILEVBREc7T0FBQSxNQUVBLElBQUcsVUFBQSxHQUFhLFVBQWhCO2VBQ0gsQ0FBQyxFQURFO09BQUEsTUFFQSxJQUFHLFVBQUEsR0FBYSxVQUFoQjtlQUNILEVBREc7T0FBQSxNQUFBO2VBR0gsRUFIRzs7SUFiUTs7c0JBa0JmLFNBQUEsR0FBVyxTQUFBO2FBQ1Q7UUFDRSxZQUFBLEVBQWMsU0FEaEI7UUFFRyxXQUFELElBQUMsQ0FBQSxTQUZIOztJQURTOzs7OztBQTNDYiIsInNvdXJjZXNDb250ZW50IjpbIlxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgUGFsZXR0ZVxuICBAZGVzZXJpYWxpemU6IChzdGF0ZSkgLT4gbmV3IFBhbGV0dGUoc3RhdGUudmFyaWFibGVzKVxuXG4gIGNvbnN0cnVjdG9yOiAoQHZhcmlhYmxlcz1bXSkgLT5cblxuICBnZXRUaXRsZTogLT4gJ1BhbGV0dGUnXG5cbiAgZ2V0VVJJOiAtPiAncGlnbWVudHM6Ly9wYWxldHRlJ1xuXG4gIGdldEljb25OYW1lOiAtPiBcInBpZ21lbnRzXCJcblxuICBzb3J0ZWRCeUNvbG9yOiAtPlxuICAgIEB2YXJpYWJsZXMuc2xpY2UoKS5zb3J0ICh7Y29sb3I6YX0sIHtjb2xvcjpifSkgPT4gQGNvbXBhcmVDb2xvcnMoYSxiKVxuXG4gIHNvcnRlZEJ5TmFtZTogLT5cbiAgICBjb2xsYXRvciA9IG5ldyBJbnRsLkNvbGxhdG9yKFwiZW4tVVNcIiwgbnVtZXJpYzogdHJ1ZSlcbiAgICBAdmFyaWFibGVzLnNsaWNlKCkuc29ydCAoe25hbWU6YX0sIHtuYW1lOmJ9KSAtPiBjb2xsYXRvci5jb21wYXJlKGEsYilcblxuICBnZXRDb2xvcnNOYW1lczogLT4gQHZhcmlhYmxlcy5tYXAgKHYpIC0+IHYubmFtZVxuXG4gIGdldENvbG9yc0NvdW50OiAtPiBAdmFyaWFibGVzLmxlbmd0aFxuXG4gIGVhY2hDb2xvcjogKGl0ZXJhdG9yKSAtPiBpdGVyYXRvcih2KSBmb3IgdiBpbiBAdmFyaWFibGVzXG5cbiAgY29tcGFyZUNvbG9yczogKGEsYikgLT5cbiAgICBbYUh1ZSwgYVNhdHVyYXRpb24sIGFMaWdodG5lc3NdID0gYS5oc2xcbiAgICBbYkh1ZSwgYlNhdHVyYXRpb24sIGJMaWdodG5lc3NdID0gYi5oc2xcbiAgICBpZiBhSHVlIDwgYkh1ZVxuICAgICAgLTFcbiAgICBlbHNlIGlmIGFIdWUgPiBiSHVlXG4gICAgICAxXG4gICAgZWxzZSBpZiBhU2F0dXJhdGlvbiA8IGJTYXR1cmF0aW9uXG4gICAgICAtMVxuICAgIGVsc2UgaWYgYVNhdHVyYXRpb24gPiBiU2F0dXJhdGlvblxuICAgICAgMVxuICAgIGVsc2UgaWYgYUxpZ2h0bmVzcyA8IGJMaWdodG5lc3NcbiAgICAgIC0xXG4gICAgZWxzZSBpZiBhTGlnaHRuZXNzID4gYkxpZ2h0bmVzc1xuICAgICAgMVxuICAgIGVsc2VcbiAgICAgIDBcblxuICBzZXJpYWxpemU6IC0+XG4gICAge1xuICAgICAgZGVzZXJpYWxpemVyOiAnUGFsZXR0ZSdcbiAgICAgIEB2YXJpYWJsZXNcbiAgICB9XG4iXX0=
