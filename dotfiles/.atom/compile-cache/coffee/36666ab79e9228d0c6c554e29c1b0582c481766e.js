(function() {
  var BufferVariablesScanner, ColorContext, ExpressionsRegistry, VariableExpression, VariableScanner, VariablesChunkSize;

  VariableScanner = require('../variable-scanner');

  ColorContext = require('../color-context');

  VariableExpression = require('../variable-expression');

  ExpressionsRegistry = require('../expressions-registry');

  VariablesChunkSize = 100;

  BufferVariablesScanner = (function() {
    function BufferVariablesScanner(config) {
      var registry, scope;
      this.buffer = config.buffer, registry = config.registry, scope = config.scope;
      registry = ExpressionsRegistry.deserialize(registry, VariableExpression);
      this.scanner = new VariableScanner({
        registry: registry,
        scope: scope
      });
      this.results = [];
    }

    BufferVariablesScanner.prototype.scan = function() {
      var lastIndex, results;
      lastIndex = 0;
      while (results = this.scanner.search(this.buffer, lastIndex)) {
        this.results = this.results.concat(results);
        if (this.results.length >= VariablesChunkSize) {
          this.flushVariables();
        }
        lastIndex = results.lastIndex;
      }
      return this.flushVariables();
    };

    BufferVariablesScanner.prototype.flushVariables = function() {
      emit('scan-buffer:variables-found', this.results);
      return this.results = [];
    };

    return BufferVariablesScanner;

  })();

  module.exports = function(config) {
    return new BufferVariablesScanner(config).scan();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3Rhc2tzL3NjYW4tYnVmZmVyLXZhcmlhYmxlcy1oYW5kbGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsZUFBQSxHQUFrQixPQUFBLENBQVEscUJBQVI7O0VBQ2xCLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVI7O0VBQ2Ysa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHdCQUFSOztFQUNyQixtQkFBQSxHQUFzQixPQUFBLENBQVEseUJBQVI7O0VBRXRCLGtCQUFBLEdBQXFCOztFQUVmO0lBQ1MsZ0NBQUMsTUFBRDtBQUNYLFVBQUE7TUFBQyxJQUFDLENBQUEsZ0JBQUEsTUFBRixFQUFVLDBCQUFWLEVBQW9CO01BQ3BCLFFBQUEsR0FBVyxtQkFBbUIsQ0FBQyxXQUFwQixDQUFnQyxRQUFoQyxFQUEwQyxrQkFBMUM7TUFDWCxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsZUFBQSxDQUFnQjtRQUFDLFVBQUEsUUFBRDtRQUFXLE9BQUEsS0FBWDtPQUFoQjtNQUNmLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFKQTs7cUNBTWIsSUFBQSxHQUFNLFNBQUE7QUFDSixVQUFBO01BQUEsU0FBQSxHQUFZO0FBQ1osYUFBTSxPQUFBLEdBQVUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQWdCLElBQUMsQ0FBQSxNQUFqQixFQUF5QixTQUF6QixDQUFoQjtRQUNFLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQWdCLE9BQWhCO1FBRVgsSUFBcUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULElBQW1CLGtCQUF4QztVQUFBLElBQUMsQ0FBQSxjQUFELENBQUEsRUFBQTs7UUFDQyxZQUFhO01BSmhCO2FBTUEsSUFBQyxDQUFBLGNBQUQsQ0FBQTtJQVJJOztxQ0FVTixjQUFBLEdBQWdCLFNBQUE7TUFDZCxJQUFBLENBQUssNkJBQUwsRUFBb0MsSUFBQyxDQUFBLE9BQXJDO2FBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUZHOzs7Ozs7RUFJbEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxNQUFEO1dBQ1gsSUFBQSxzQkFBQSxDQUF1QixNQUF2QixDQUE4QixDQUFDLElBQS9CLENBQUE7RUFEVztBQTVCakIiLCJzb3VyY2VzQ29udGVudCI6WyJWYXJpYWJsZVNjYW5uZXIgPSByZXF1aXJlICcuLi92YXJpYWJsZS1zY2FubmVyJ1xuQ29sb3JDb250ZXh0ID0gcmVxdWlyZSAnLi4vY29sb3ItY29udGV4dCdcblZhcmlhYmxlRXhwcmVzc2lvbiA9IHJlcXVpcmUgJy4uL3ZhcmlhYmxlLWV4cHJlc3Npb24nXG5FeHByZXNzaW9uc1JlZ2lzdHJ5ID0gcmVxdWlyZSAnLi4vZXhwcmVzc2lvbnMtcmVnaXN0cnknXG5cblZhcmlhYmxlc0NodW5rU2l6ZSA9IDEwMFxuXG5jbGFzcyBCdWZmZXJWYXJpYWJsZXNTY2FubmVyXG4gIGNvbnN0cnVjdG9yOiAoY29uZmlnKSAtPlxuICAgIHtAYnVmZmVyLCByZWdpc3RyeSwgc2NvcGV9ID0gY29uZmlnXG4gICAgcmVnaXN0cnkgPSBFeHByZXNzaW9uc1JlZ2lzdHJ5LmRlc2VyaWFsaXplKHJlZ2lzdHJ5LCBWYXJpYWJsZUV4cHJlc3Npb24pXG4gICAgQHNjYW5uZXIgPSBuZXcgVmFyaWFibGVTY2FubmVyKHtyZWdpc3RyeSwgc2NvcGV9KVxuICAgIEByZXN1bHRzID0gW11cblxuICBzY2FuOiAtPlxuICAgIGxhc3RJbmRleCA9IDBcbiAgICB3aGlsZSByZXN1bHRzID0gQHNjYW5uZXIuc2VhcmNoKEBidWZmZXIsIGxhc3RJbmRleClcbiAgICAgIEByZXN1bHRzID0gQHJlc3VsdHMuY29uY2F0KHJlc3VsdHMpXG5cbiAgICAgIEBmbHVzaFZhcmlhYmxlcygpIGlmIEByZXN1bHRzLmxlbmd0aCA+PSBWYXJpYWJsZXNDaHVua1NpemVcbiAgICAgIHtsYXN0SW5kZXh9ID0gcmVzdWx0c1xuXG4gICAgQGZsdXNoVmFyaWFibGVzKClcblxuICBmbHVzaFZhcmlhYmxlczogLT5cbiAgICBlbWl0KCdzY2FuLWJ1ZmZlcjp2YXJpYWJsZXMtZm91bmQnLCBAcmVzdWx0cylcbiAgICBAcmVzdWx0cyA9IFtdXG5cbm1vZHVsZS5leHBvcnRzID0gKGNvbmZpZykgLT5cbiAgbmV3IEJ1ZmZlclZhcmlhYmxlc1NjYW5uZXIoY29uZmlnKS5zY2FuKClcbiJdfQ==
