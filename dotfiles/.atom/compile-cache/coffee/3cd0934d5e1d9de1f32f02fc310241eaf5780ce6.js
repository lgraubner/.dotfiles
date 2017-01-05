(function() {
  var DotRenderer, SquareDotRenderer,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  DotRenderer = require('./dot');

  module.exports = SquareDotRenderer = (function(superClass) {
    extend(SquareDotRenderer, superClass);

    function SquareDotRenderer() {
      return SquareDotRenderer.__super__.constructor.apply(this, arguments);
    }

    SquareDotRenderer.prototype.render = function(colorMarker) {
      var properties;
      properties = SquareDotRenderer.__super__.render.apply(this, arguments);
      properties["class"] += ' square';
      return properties;
    };

    return SquareDotRenderer;

  })(DotRenderer);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlbmRlcmVycy9zcXVhcmUtZG90LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsOEJBQUE7SUFBQTs7O0VBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxPQUFSOztFQUVkLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7Z0NBQ0osTUFBQSxHQUFRLFNBQUMsV0FBRDtBQUNOLFVBQUE7TUFBQSxVQUFBLEdBQWEsK0NBQUEsU0FBQTtNQUNiLFVBQVUsRUFBQyxLQUFELEVBQVYsSUFBb0I7YUFDcEI7SUFITTs7OztLQURzQjtBQUhoQyIsInNvdXJjZXNDb250ZW50IjpbIkRvdFJlbmRlcmVyID0gcmVxdWlyZSAnLi9kb3QnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFNxdWFyZURvdFJlbmRlcmVyIGV4dGVuZHMgRG90UmVuZGVyZXJcbiAgcmVuZGVyOiAoY29sb3JNYXJrZXIpIC0+XG4gICAgcHJvcGVydGllcyA9IHN1cGVyXG4gICAgcHJvcGVydGllcy5jbGFzcyArPSAnIHNxdWFyZSdcbiAgICBwcm9wZXJ0aWVzXG4iXX0=
