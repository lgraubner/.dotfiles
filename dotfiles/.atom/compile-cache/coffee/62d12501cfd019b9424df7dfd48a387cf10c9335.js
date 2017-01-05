(function() {
  var BufferColorsScanner, ColorContext, ColorExpression, ColorScanner, ColorsChunkSize, ExpressionsRegistry;

  ColorScanner = require('../color-scanner');

  ColorContext = require('../color-context');

  ColorExpression = require('../color-expression');

  ExpressionsRegistry = require('../expressions-registry');

  ColorsChunkSize = 100;

  BufferColorsScanner = (function() {
    function BufferColorsScanner(config) {
      var colorVariables, registry, variables;
      this.buffer = config.buffer, variables = config.variables, colorVariables = config.colorVariables, this.bufferPath = config.bufferPath, this.scope = config.scope, registry = config.registry;
      registry = ExpressionsRegistry.deserialize(registry, ColorExpression);
      this.context = new ColorContext({
        variables: variables,
        colorVariables: colorVariables,
        referencePath: this.bufferPath,
        registry: registry
      });
      this.scanner = new ColorScanner({
        context: this.context
      });
      this.results = [];
    }

    BufferColorsScanner.prototype.scan = function() {
      var lastIndex, result;
      if (this.bufferPath == null) {
        return;
      }
      lastIndex = 0;
      while (result = this.scanner.search(this.buffer, this.scope, lastIndex)) {
        this.results.push(result);
        if (this.results.length >= ColorsChunkSize) {
          this.flushColors();
        }
        lastIndex = result.lastIndex;
      }
      return this.flushColors();
    };

    BufferColorsScanner.prototype.flushColors = function() {
      emit('scan-buffer:colors-found', this.results);
      return this.results = [];
    };

    return BufferColorsScanner;

  })();

  module.exports = function(config) {
    return new BufferColorsScanner(config).scan();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3Rhc2tzL3NjYW4tYnVmZmVyLWNvbG9ycy1oYW5kbGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUjs7RUFDZixZQUFBLEdBQWUsT0FBQSxDQUFRLGtCQUFSOztFQUNmLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSOztFQUNsQixtQkFBQSxHQUFzQixPQUFBLENBQVEseUJBQVI7O0VBQ3RCLGVBQUEsR0FBa0I7O0VBRVo7SUFDUyw2QkFBQyxNQUFEO0FBQ1gsVUFBQTtNQUFDLElBQUMsQ0FBQSxnQkFBQSxNQUFGLEVBQVUsNEJBQVYsRUFBcUIsc0NBQXJCLEVBQXFDLElBQUMsQ0FBQSxvQkFBQSxVQUF0QyxFQUFrRCxJQUFDLENBQUEsZUFBQSxLQUFuRCxFQUEwRDtNQUMxRCxRQUFBLEdBQVcsbUJBQW1CLENBQUMsV0FBcEIsQ0FBZ0MsUUFBaEMsRUFBMEMsZUFBMUM7TUFDWCxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsWUFBQSxDQUFhO1FBQUMsV0FBQSxTQUFEO1FBQVksZ0JBQUEsY0FBWjtRQUE0QixhQUFBLEVBQWUsSUFBQyxDQUFBLFVBQTVDO1FBQXdELFVBQUEsUUFBeEQ7T0FBYjtNQUNmLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxZQUFBLENBQWE7UUFBRSxTQUFELElBQUMsQ0FBQSxPQUFGO09BQWI7TUFDZixJQUFDLENBQUEsT0FBRCxHQUFXO0lBTEE7O2tDQU9iLElBQUEsR0FBTSxTQUFBO0FBQ0osVUFBQTtNQUFBLElBQWMsdUJBQWQ7QUFBQSxlQUFBOztNQUNBLFNBQUEsR0FBWTtBQUNaLGFBQU0sTUFBQSxHQUFTLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixJQUFDLENBQUEsTUFBakIsRUFBeUIsSUFBQyxDQUFBLEtBQTFCLEVBQWlDLFNBQWpDLENBQWY7UUFDRSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxNQUFkO1FBRUEsSUFBa0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULElBQW1CLGVBQXJDO1VBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBQSxFQUFBOztRQUNDLFlBQWE7TUFKaEI7YUFNQSxJQUFDLENBQUEsV0FBRCxDQUFBO0lBVEk7O2tDQVdOLFdBQUEsR0FBYSxTQUFBO01BQ1gsSUFBQSxDQUFLLDBCQUFMLEVBQWlDLElBQUMsQ0FBQSxPQUFsQzthQUNBLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFGQTs7Ozs7O0VBSWYsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxNQUFEO1dBQ1gsSUFBQSxtQkFBQSxDQUFvQixNQUFwQixDQUEyQixDQUFDLElBQTVCLENBQUE7RUFEVztBQTdCakIiLCJzb3VyY2VzQ29udGVudCI6WyJDb2xvclNjYW5uZXIgPSByZXF1aXJlICcuLi9jb2xvci1zY2FubmVyJ1xuQ29sb3JDb250ZXh0ID0gcmVxdWlyZSAnLi4vY29sb3ItY29udGV4dCdcbkNvbG9yRXhwcmVzc2lvbiA9IHJlcXVpcmUgJy4uL2NvbG9yLWV4cHJlc3Npb24nXG5FeHByZXNzaW9uc1JlZ2lzdHJ5ID0gcmVxdWlyZSAnLi4vZXhwcmVzc2lvbnMtcmVnaXN0cnknXG5Db2xvcnNDaHVua1NpemUgPSAxMDBcblxuY2xhc3MgQnVmZmVyQ29sb3JzU2Nhbm5lclxuICBjb25zdHJ1Y3RvcjogKGNvbmZpZykgLT5cbiAgICB7QGJ1ZmZlciwgdmFyaWFibGVzLCBjb2xvclZhcmlhYmxlcywgQGJ1ZmZlclBhdGgsIEBzY29wZSwgcmVnaXN0cnl9ID0gY29uZmlnXG4gICAgcmVnaXN0cnkgPSBFeHByZXNzaW9uc1JlZ2lzdHJ5LmRlc2VyaWFsaXplKHJlZ2lzdHJ5LCBDb2xvckV4cHJlc3Npb24pXG4gICAgQGNvbnRleHQgPSBuZXcgQ29sb3JDb250ZXh0KHt2YXJpYWJsZXMsIGNvbG9yVmFyaWFibGVzLCByZWZlcmVuY2VQYXRoOiBAYnVmZmVyUGF0aCwgcmVnaXN0cnl9KVxuICAgIEBzY2FubmVyID0gbmV3IENvbG9yU2Nhbm5lcih7QGNvbnRleHR9KVxuICAgIEByZXN1bHRzID0gW11cblxuICBzY2FuOiAtPlxuICAgIHJldHVybiB1bmxlc3MgQGJ1ZmZlclBhdGg/XG4gICAgbGFzdEluZGV4ID0gMFxuICAgIHdoaWxlIHJlc3VsdCA9IEBzY2FubmVyLnNlYXJjaChAYnVmZmVyLCBAc2NvcGUsIGxhc3RJbmRleClcbiAgICAgIEByZXN1bHRzLnB1c2gocmVzdWx0KVxuXG4gICAgICBAZmx1c2hDb2xvcnMoKSBpZiBAcmVzdWx0cy5sZW5ndGggPj0gQ29sb3JzQ2h1bmtTaXplXG4gICAgICB7bGFzdEluZGV4fSA9IHJlc3VsdFxuXG4gICAgQGZsdXNoQ29sb3JzKClcblxuICBmbHVzaENvbG9yczogLT5cbiAgICBlbWl0KCdzY2FuLWJ1ZmZlcjpjb2xvcnMtZm91bmQnLCBAcmVzdWx0cylcbiAgICBAcmVzdWx0cyA9IFtdXG5cbm1vZHVsZS5leHBvcnRzID0gKGNvbmZpZykgLT5cbiAgbmV3IEJ1ZmZlckNvbG9yc1NjYW5uZXIoY29uZmlnKS5zY2FuKClcbiJdfQ==
