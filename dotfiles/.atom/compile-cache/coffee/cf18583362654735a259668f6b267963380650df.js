(function() {
  var PigmentsAPI;

  module.exports = PigmentsAPI = (function() {
    function PigmentsAPI(project) {
      this.project = project;
    }

    PigmentsAPI.prototype.getProject = function() {
      return this.project;
    };

    PigmentsAPI.prototype.getPalette = function() {
      return this.project.getPalette();
    };

    PigmentsAPI.prototype.getVariables = function() {
      return this.project.getVariables();
    };

    PigmentsAPI.prototype.getColorVariables = function() {
      return this.project.getColorVariables();
    };

    PigmentsAPI.prototype.observeColorBuffers = function(callback) {
      return this.project.observeColorBuffers(callback);
    };

    return PigmentsAPI;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3BpZ21lbnRzLWFwaS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBOztFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyxxQkFBQyxPQUFEO01BQUMsSUFBQyxDQUFBLFVBQUQ7SUFBRDs7MEJBRWIsVUFBQSxHQUFZLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSjs7MEJBRVosVUFBQSxHQUFZLFNBQUE7YUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLFVBQVQsQ0FBQTtJQUFIOzswQkFFWixZQUFBLEdBQWMsU0FBQTthQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFBO0lBQUg7OzBCQUVkLGlCQUFBLEdBQW1CLFNBQUE7YUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLGlCQUFULENBQUE7SUFBSDs7MEJBRW5CLG1CQUFBLEdBQXFCLFNBQUMsUUFBRDthQUFjLElBQUMsQ0FBQSxPQUFPLENBQUMsbUJBQVQsQ0FBNkIsUUFBN0I7SUFBZDs7Ozs7QUFadkIiLCJzb3VyY2VzQ29udGVudCI6WyJcbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFBpZ21lbnRzQVBJXG4gIGNvbnN0cnVjdG9yOiAoQHByb2plY3QpIC0+XG5cbiAgZ2V0UHJvamVjdDogLT4gQHByb2plY3RcblxuICBnZXRQYWxldHRlOiAtPiBAcHJvamVjdC5nZXRQYWxldHRlKClcblxuICBnZXRWYXJpYWJsZXM6IC0+IEBwcm9qZWN0LmdldFZhcmlhYmxlcygpXG5cbiAgZ2V0Q29sb3JWYXJpYWJsZXM6IC0+IEBwcm9qZWN0LmdldENvbG9yVmFyaWFibGVzKClcblxuICBvYnNlcnZlQ29sb3JCdWZmZXJzOiAoY2FsbGJhY2spIC0+IEBwcm9qZWN0Lm9ic2VydmVDb2xvckJ1ZmZlcnMoY2FsbGJhY2spXG4iXX0=
