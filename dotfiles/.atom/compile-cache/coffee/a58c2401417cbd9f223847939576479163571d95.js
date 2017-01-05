(function() {
  var Task;

  Task = null;

  module.exports = {
    startTask: function(paths, registry, callback) {
      var results, taskPath;
      if (Task == null) {
        Task = require('atom').Task;
      }
      results = [];
      taskPath = require.resolve('./tasks/scan-paths-handler');
      this.task = Task.once(taskPath, [paths, registry.serialize()], (function(_this) {
        return function() {
          _this.task = null;
          return callback(results);
        };
      })(this));
      this.task.on('scan-paths:path-scanned', function(result) {
        return results = results.concat(result);
      });
      return this.task;
    },
    terminateRunningTask: function() {
      var ref;
      return (ref = this.task) != null ? ref.terminate() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3BhdGhzLXNjYW5uZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU87O0VBRVAsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFNBQUEsRUFBVyxTQUFDLEtBQUQsRUFBUSxRQUFSLEVBQWtCLFFBQWxCO0FBQ1QsVUFBQTs7UUFBQSxPQUFRLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQzs7TUFFeEIsT0FBQSxHQUFVO01BQ1YsUUFBQSxHQUFXLE9BQU8sQ0FBQyxPQUFSLENBQWdCLDRCQUFoQjtNQUVYLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxDQUFDLElBQUwsQ0FDTixRQURNLEVBRU4sQ0FBQyxLQUFELEVBQVEsUUFBUSxDQUFDLFNBQVQsQ0FBQSxDQUFSLENBRk0sRUFHTixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDRSxLQUFDLENBQUEsSUFBRCxHQUFRO2lCQUNSLFFBQUEsQ0FBUyxPQUFUO1FBRkY7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSE07TUFRUixJQUFDLENBQUEsSUFBSSxDQUFDLEVBQU4sQ0FBUyx5QkFBVCxFQUFvQyxTQUFDLE1BQUQ7ZUFDbEMsT0FBQSxHQUFVLE9BQU8sQ0FBQyxNQUFSLENBQWUsTUFBZjtNQUR3QixDQUFwQzthQUdBLElBQUMsQ0FBQTtJQWpCUSxDQUFYO0lBbUJBLG9CQUFBLEVBQXNCLFNBQUE7QUFDcEIsVUFBQTs0Q0FBSyxDQUFFLFNBQVAsQ0FBQTtJQURvQixDQW5CdEI7O0FBSEYiLCJzb3VyY2VzQ29udGVudCI6WyJUYXNrID0gbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHN0YXJ0VGFzazogKHBhdGhzLCByZWdpc3RyeSwgY2FsbGJhY2spIC0+XG4gICAgVGFzayA/PSByZXF1aXJlKCdhdG9tJykuVGFza1xuXG4gICAgcmVzdWx0cyA9IFtdXG4gICAgdGFza1BhdGggPSByZXF1aXJlLnJlc29sdmUoJy4vdGFza3Mvc2Nhbi1wYXRocy1oYW5kbGVyJylcblxuICAgIEB0YXNrID0gVGFzay5vbmNlKFxuICAgICAgdGFza1BhdGgsXG4gICAgICBbcGF0aHMsIHJlZ2lzdHJ5LnNlcmlhbGl6ZSgpXSxcbiAgICAgID0+XG4gICAgICAgIEB0YXNrID0gbnVsbFxuICAgICAgICBjYWxsYmFjayhyZXN1bHRzKVxuICAgIClcblxuICAgIEB0YXNrLm9uICdzY2FuLXBhdGhzOnBhdGgtc2Nhbm5lZCcsIChyZXN1bHQpIC0+XG4gICAgICByZXN1bHRzID0gcmVzdWx0cy5jb25jYXQocmVzdWx0KVxuXG4gICAgQHRhc2tcblxuICB0ZXJtaW5hdGVSdW5uaW5nVGFzazogLT5cbiAgICBAdGFzaz8udGVybWluYXRlKClcbiJdfQ==
