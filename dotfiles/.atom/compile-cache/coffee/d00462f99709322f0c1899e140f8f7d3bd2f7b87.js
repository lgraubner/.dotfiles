(function() {
  var Navigator;

  Navigator = (function() {
    function Navigator(separatorMarker) {
      var ref;
      this.separatorMarker = separatorMarker;
      ref = [null, null, null], this.conflict = ref[0], this.previous = ref[1], this.next = ref[2];
    }

    Navigator.prototype.linkToPrevious = function(c) {
      this.previous = c;
      if (c != null) {
        return c.navigator.next = this.conflict;
      }
    };

    Navigator.prototype.nextUnresolved = function() {
      var current;
      current = this.next;
      while ((current != null) && current.isResolved()) {
        current = current.navigator.next;
      }
      return current;
    };

    Navigator.prototype.previousUnresolved = function() {
      var current;
      current = this.previous;
      while ((current != null) && current.isResolved()) {
        current = current.navigator.previous;
      }
      return current;
    };

    Navigator.prototype.markers = function() {
      return [this.separatorMarker];
    };

    return Navigator;

  })();

  module.exports = {
    Navigator: Navigator
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi9uYXZpZ2F0b3IuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBTTtJQUVTLG1CQUFDLGVBQUQ7QUFDWCxVQUFBO01BRFksSUFBQyxDQUFBLGtCQUFEO01BQ1osTUFBZ0MsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsQ0FBaEMsRUFBQyxJQUFDLENBQUEsaUJBQUYsRUFBWSxJQUFDLENBQUEsaUJBQWIsRUFBdUIsSUFBQyxDQUFBO0lBRGI7O3dCQUdiLGNBQUEsR0FBZ0IsU0FBQyxDQUFEO01BQ2QsSUFBQyxDQUFBLFFBQUQsR0FBWTtNQUNaLElBQWdDLFNBQWhDO2VBQUEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFaLEdBQW1CLElBQUMsQ0FBQSxTQUFwQjs7SUFGYzs7d0JBSWhCLGNBQUEsR0FBZ0IsU0FBQTtBQUNkLFVBQUE7TUFBQSxPQUFBLEdBQVUsSUFBQyxDQUFBO0FBQ1gsYUFBTSxpQkFBQSxJQUFhLE9BQU8sQ0FBQyxVQUFSLENBQUEsQ0FBbkI7UUFDRSxPQUFBLEdBQVUsT0FBTyxDQUFDLFNBQVMsQ0FBQztNQUQ5QjthQUVBO0lBSmM7O3dCQU1oQixrQkFBQSxHQUFvQixTQUFBO0FBQ2xCLFVBQUE7TUFBQSxPQUFBLEdBQVUsSUFBQyxDQUFBO0FBQ1gsYUFBTSxpQkFBQSxJQUFhLE9BQU8sQ0FBQyxVQUFSLENBQUEsQ0FBbkI7UUFDRSxPQUFBLEdBQVUsT0FBTyxDQUFDLFNBQVMsQ0FBQztNQUQ5QjthQUVBO0lBSmtCOzt3QkFNcEIsT0FBQSxHQUFTLFNBQUE7YUFBRyxDQUFDLElBQUMsQ0FBQSxlQUFGO0lBQUg7Ozs7OztFQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxTQUFBLEVBQVcsU0FBWDs7QUF4QkYiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBOYXZpZ2F0b3JcblxuICBjb25zdHJ1Y3RvcjogKEBzZXBhcmF0b3JNYXJrZXIpIC0+XG4gICAgW0Bjb25mbGljdCwgQHByZXZpb3VzLCBAbmV4dF0gPSBbbnVsbCwgbnVsbCwgbnVsbF1cblxuICBsaW5rVG9QcmV2aW91czogKGMpIC0+XG4gICAgQHByZXZpb3VzID0gY1xuICAgIGMubmF2aWdhdG9yLm5leHQgPSBAY29uZmxpY3QgaWYgYz9cblxuICBuZXh0VW5yZXNvbHZlZDogLT5cbiAgICBjdXJyZW50ID0gQG5leHRcbiAgICB3aGlsZSBjdXJyZW50PyBhbmQgY3VycmVudC5pc1Jlc29sdmVkKClcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5hdmlnYXRvci5uZXh0XG4gICAgY3VycmVudFxuXG4gIHByZXZpb3VzVW5yZXNvbHZlZDogLT5cbiAgICBjdXJyZW50ID0gQHByZXZpb3VzXG4gICAgd2hpbGUgY3VycmVudD8gYW5kIGN1cnJlbnQuaXNSZXNvbHZlZCgpXG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uYXZpZ2F0b3IucHJldmlvdXNcbiAgICBjdXJyZW50XG5cbiAgbWFya2VyczogLT4gW0BzZXBhcmF0b3JNYXJrZXJdXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgTmF2aWdhdG9yOiBOYXZpZ2F0b3JcbiJdfQ==
