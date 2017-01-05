(function() {
  var VariableParser;

  module.exports = VariableParser = (function() {
    function VariableParser(registry) {
      this.registry = registry;
    }

    VariableParser.prototype.parse = function(expression) {
      var e, i, len, ref;
      ref = this.registry.getExpressions();
      for (i = 0, len = ref.length; i < len; i++) {
        e = ref[i];
        if (e.match(expression)) {
          return e.parse(expression);
        }
      }
    };

    return VariableParser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3ZhcmlhYmxlLXBhcnNlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBOztFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyx3QkFBQyxRQUFEO01BQUMsSUFBQyxDQUFBLFdBQUQ7SUFBRDs7NkJBQ2IsS0FBQSxHQUFPLFNBQUMsVUFBRDtBQUNMLFVBQUE7QUFBQTtBQUFBLFdBQUEscUNBQUE7O1FBQ0UsSUFBOEIsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxVQUFSLENBQTlCO0FBQUEsaUJBQU8sQ0FBQyxDQUFDLEtBQUYsQ0FBUSxVQUFSLEVBQVA7O0FBREY7SUFESzs7Ozs7QUFIVCIsInNvdXJjZXNDb250ZW50IjpbIlxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgVmFyaWFibGVQYXJzZXJcbiAgY29uc3RydWN0b3I6IChAcmVnaXN0cnkpIC0+XG4gIHBhcnNlOiAoZXhwcmVzc2lvbikgLT5cbiAgICBmb3IgZSBpbiBAcmVnaXN0cnkuZ2V0RXhwcmVzc2lvbnMoKVxuICAgICAgcmV0dXJuIGUucGFyc2UoZXhwcmVzc2lvbikgaWYgZS5tYXRjaChleHByZXNzaW9uKVxuXG4gICAgcmV0dXJuXG4iXX0=
