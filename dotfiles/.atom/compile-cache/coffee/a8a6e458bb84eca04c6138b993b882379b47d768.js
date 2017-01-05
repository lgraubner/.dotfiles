(function() {
  var ColorParser;

  module.exports = ColorParser = (function() {
    function ColorParser(registry, context) {
      this.registry = registry;
      this.context = context;
    }

    ColorParser.prototype.parse = function(expression, scope, collectVariables) {
      var e, i, len, ref, res;
      if (scope == null) {
        scope = '*';
      }
      if (collectVariables == null) {
        collectVariables = true;
      }
      if ((expression == null) || expression === '') {
        return void 0;
      }
      ref = this.registry.getExpressionsForScope(scope);
      for (i = 0, len = ref.length; i < len; i++) {
        e = ref[i];
        if (e.match(expression)) {
          res = e.parse(expression, this.context);
          if (collectVariables) {
            res.variables = this.context.readUsedVariables();
          }
          return res;
        }
      }
      return void 0;
    };

    return ColorParser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLXBhcnNlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBOztFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyxxQkFBQyxRQUFELEVBQVksT0FBWjtNQUFDLElBQUMsQ0FBQSxXQUFEO01BQVcsSUFBQyxDQUFBLFVBQUQ7SUFBWjs7MEJBRWIsS0FBQSxHQUFPLFNBQUMsVUFBRCxFQUFhLEtBQWIsRUFBd0IsZ0JBQXhCO0FBQ0wsVUFBQTs7UUFEa0IsUUFBTTs7O1FBQUssbUJBQWlCOztNQUM5QyxJQUF3QixvQkFBSixJQUFtQixVQUFBLEtBQWMsRUFBckQ7QUFBQSxlQUFPLE9BQVA7O0FBRUE7QUFBQSxXQUFBLHFDQUFBOztRQUNFLElBQUcsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxVQUFSLENBQUg7VUFDRSxHQUFBLEdBQU0sQ0FBQyxDQUFDLEtBQUYsQ0FBUSxVQUFSLEVBQW9CLElBQUMsQ0FBQSxPQUFyQjtVQUNOLElBQWdELGdCQUFoRDtZQUFBLEdBQUcsQ0FBQyxTQUFKLEdBQWdCLElBQUMsQ0FBQSxPQUFPLENBQUMsaUJBQVQsQ0FBQSxFQUFoQjs7QUFDQSxpQkFBTyxJQUhUOztBQURGO0FBTUEsYUFBTztJQVRGOzs7OztBQUpUIiwic291cmNlc0NvbnRlbnQiOlsiXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDb2xvclBhcnNlclxuICBjb25zdHJ1Y3RvcjogKEByZWdpc3RyeSwgQGNvbnRleHQpIC0+XG5cbiAgcGFyc2U6IChleHByZXNzaW9uLCBzY29wZT0nKicsIGNvbGxlY3RWYXJpYWJsZXM9dHJ1ZSkgLT5cbiAgICByZXR1cm4gdW5kZWZpbmVkIGlmIG5vdCBleHByZXNzaW9uPyBvciBleHByZXNzaW9uIGlzICcnXG5cbiAgICBmb3IgZSBpbiBAcmVnaXN0cnkuZ2V0RXhwcmVzc2lvbnNGb3JTY29wZShzY29wZSlcbiAgICAgIGlmIGUubWF0Y2goZXhwcmVzc2lvbilcbiAgICAgICAgcmVzID0gZS5wYXJzZShleHByZXNzaW9uLCBAY29udGV4dClcbiAgICAgICAgcmVzLnZhcmlhYmxlcyA9IEBjb250ZXh0LnJlYWRVc2VkVmFyaWFibGVzKCkgaWYgY29sbGVjdFZhcmlhYmxlc1xuICAgICAgICByZXR1cm4gcmVzXG5cbiAgICByZXR1cm4gdW5kZWZpbmVkXG4iXX0=
