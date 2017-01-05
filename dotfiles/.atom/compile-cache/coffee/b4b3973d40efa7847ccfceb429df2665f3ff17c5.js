(function() {
  var path;

  path = require('path');

  module.exports = function(p) {
    if (p == null) {
      return;
    }
    if (p.match(/\/\.pigments$/)) {
      return 'pigments';
    } else {
      return path.extname(p).slice(1);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3Njb3BlLWZyb20tZmlsZS1uYW1lLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsQ0FBRDtJQUNmLElBQWMsU0FBZDtBQUFBLGFBQUE7O0lBQ0EsSUFBRyxDQUFDLENBQUMsS0FBRixDQUFRLGVBQVIsQ0FBSDthQUFpQyxXQUFqQztLQUFBLE1BQUE7YUFBaUQsSUFBSSxDQUFDLE9BQUwsQ0FBYSxDQUFiLENBQWdCLFVBQWpFOztFQUZlO0FBRGpCIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5tb2R1bGUuZXhwb3J0cyA9IChwKSAtPlxuICByZXR1cm4gdW5sZXNzIHA/XG4gIGlmIHAubWF0Y2goL1xcL1xcLnBpZ21lbnRzJC8pIHRoZW4gJ3BpZ21lbnRzJyBlbHNlIHBhdGguZXh0bmFtZShwKVsxLi4tMV1cbiJdfQ==
