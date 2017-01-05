(function() {
  var Task;

  Task = null;

  module.exports = {
    startTask: function(config, callback) {
      var dirtied, removed, task, taskPath;
      if (Task == null) {
        Task = require('atom').Task;
      }
      dirtied = [];
      removed = [];
      taskPath = require.resolve('./tasks/load-paths-handler');
      task = Task.once(taskPath, config, function() {
        return callback({
          dirtied: dirtied,
          removed: removed
        });
      });
      task.on('load-paths:paths-found', function(paths) {
        return dirtied.push.apply(dirtied, paths);
      });
      task.on('load-paths:paths-lost', function(paths) {
        return removed.push.apply(removed, paths);
      });
      return task;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3BhdGhzLWxvYWRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTzs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsU0FBQSxFQUFXLFNBQUMsTUFBRCxFQUFTLFFBQVQ7QUFDVCxVQUFBOztRQUFBLE9BQVEsT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDOztNQUV4QixPQUFBLEdBQVU7TUFDVixPQUFBLEdBQVU7TUFDVixRQUFBLEdBQVcsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsNEJBQWhCO01BRVgsSUFBQSxHQUFPLElBQUksQ0FBQyxJQUFMLENBQ0wsUUFESyxFQUVMLE1BRkssRUFHTCxTQUFBO2VBQUcsUUFBQSxDQUFTO1VBQUMsU0FBQSxPQUFEO1VBQVUsU0FBQSxPQUFWO1NBQVQ7TUFBSCxDQUhLO01BTVAsSUFBSSxDQUFDLEVBQUwsQ0FBUSx3QkFBUixFQUFrQyxTQUFDLEtBQUQ7ZUFBVyxPQUFPLENBQUMsSUFBUixnQkFBYSxLQUFiO01BQVgsQ0FBbEM7TUFDQSxJQUFJLENBQUMsRUFBTCxDQUFRLHVCQUFSLEVBQWlDLFNBQUMsS0FBRDtlQUFXLE9BQU8sQ0FBQyxJQUFSLGdCQUFhLEtBQWI7TUFBWCxDQUFqQzthQUVBO0lBaEJTLENBQVg7O0FBSEYiLCJzb3VyY2VzQ29udGVudCI6WyJUYXNrID0gbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHN0YXJ0VGFzazogKGNvbmZpZywgY2FsbGJhY2spIC0+XG4gICAgVGFzayA/PSByZXF1aXJlKCdhdG9tJykuVGFza1xuXG4gICAgZGlydGllZCA9IFtdXG4gICAgcmVtb3ZlZCA9IFtdXG4gICAgdGFza1BhdGggPSByZXF1aXJlLnJlc29sdmUoJy4vdGFza3MvbG9hZC1wYXRocy1oYW5kbGVyJylcblxuICAgIHRhc2sgPSBUYXNrLm9uY2UoXG4gICAgICB0YXNrUGF0aCxcbiAgICAgIGNvbmZpZyxcbiAgICAgIC0+IGNhbGxiYWNrKHtkaXJ0aWVkLCByZW1vdmVkfSlcbiAgICApXG5cbiAgICB0YXNrLm9uICdsb2FkLXBhdGhzOnBhdGhzLWZvdW5kJywgKHBhdGhzKSAtPiBkaXJ0aWVkLnB1c2gocGF0aHMuLi4pXG4gICAgdGFzay5vbiAnbG9hZC1wYXRoczpwYXRocy1sb3N0JywgKHBhdGhzKSAtPiByZW1vdmVkLnB1c2gocGF0aHMuLi4pXG5cbiAgICB0YXNrXG4iXX0=
