(function() {
  var CompositeDisposable, provider;

  CompositeDisposable = require('atom').CompositeDisposable;

  provider = require('./provider');

  module.exports = {
    config: {
      executablePath: {
        type: 'string',
        title: 'PHP Executable Path',
        "default": 'php'
      }
    },
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('autocomplete-php.executablePath', function(executablePath) {
        return provider.executablePath = executablePath;
      }));
      return provider.loadCompletions();
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    getProvider: function() {
      return provider;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBocC9saWIvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztFQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQ0U7TUFBQSxjQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLEtBQUEsRUFBTyxxQkFEUDtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FGVDtPQURGO0tBREY7SUFNQSxRQUFBLEVBQVUsU0FBQTtNQUNSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixpQ0FBcEIsRUFDakIsU0FBQyxjQUFEO2VBQ0UsUUFBUSxDQUFDLGNBQVQsR0FBMEI7TUFENUIsQ0FEaUIsQ0FBbkI7YUFHQSxRQUFRLENBQUMsZUFBVCxDQUFBO0lBTFEsQ0FOVjtJQWFBLFVBQUEsRUFBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7SUFEVSxDQWJaO0lBZ0JBLFdBQUEsRUFBYSxTQUFBO2FBQUc7SUFBSCxDQWhCYjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5wcm92aWRlciA9IHJlcXVpcmUgJy4vcHJvdmlkZXInXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIGV4ZWN1dGFibGVQYXRoOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIHRpdGxlOiAnUEhQIEV4ZWN1dGFibGUgUGF0aCdcbiAgICAgIGRlZmF1bHQ6ICdwaHAnICMgTGV0IE9TJ3MgJFBBVEggaGFuZGxlIHRoZSByZXN0XG5cbiAgYWN0aXZhdGU6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdhdXRvY29tcGxldGUtcGhwLmV4ZWN1dGFibGVQYXRoJyxcbiAgICAgIChleGVjdXRhYmxlUGF0aCkgLT5cbiAgICAgICAgcHJvdmlkZXIuZXhlY3V0YWJsZVBhdGggPSBleGVjdXRhYmxlUGF0aFxuICAgIHByb3ZpZGVyLmxvYWRDb21wbGV0aW9ucygpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxuICBnZXRQcm92aWRlcjogLT4gcHJvdmlkZXJcbiJdfQ==
