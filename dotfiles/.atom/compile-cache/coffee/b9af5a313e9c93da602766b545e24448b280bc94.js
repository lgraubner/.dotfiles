(function() {
  var defaultIndentChar, defaultIndentSize, defaultIndentWithTabs, ref, ref1, scope, softTabs, tabLength;

  scope = ['source.python'];

  tabLength = (ref = typeof atom !== "undefined" && atom !== null ? atom.config.get('editor.tabLength', {
    scope: scope
  }) : void 0) != null ? ref : 4;

  softTabs = (ref1 = typeof atom !== "undefined" && atom !== null ? atom.config.get('editor.softTabs', {
    scope: scope
  }) : void 0) != null ? ref1 : true;

  defaultIndentSize = (softTabs ? tabLength : 1);

  defaultIndentChar = (softTabs ? " " : "\t");

  defaultIndentWithTabs = !softTabs;

  module.exports = {
    name: "Python",
    namespace: "python",

    /*
    Supported Grammars
     */
    grammars: ["Python"],

    /*
    Supported extensions
     */
    extensions: ["py"],
    options: {
      max_line_length: {
        type: 'integer',
        "default": 79,
        description: "set maximum allowed line length"
      },
      indent_size: {
        type: 'integer',
        "default": defaultIndentSize,
        minimum: 0,
        description: "Indentation size/length"
      },
      ignore: {
        type: 'array',
        "default": ["E24"],
        items: {
          type: 'string'
        },
        description: "do not fix these errors/warnings"
      },
      sort_imports: {
        type: 'boolean',
        "default": false,
        description: "sort imports (requires isort installed)"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL3B5dGhvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBOztFQUFBLEtBQUEsR0FBUSxDQUFDLGVBQUQ7O0VBQ1IsU0FBQTs7K0JBQWlFOztFQUNqRSxRQUFBOztnQ0FBK0Q7O0VBQy9ELGlCQUFBLEdBQW9CLENBQUksUUFBSCxHQUFpQixTQUFqQixHQUFnQyxDQUFqQzs7RUFDcEIsaUJBQUEsR0FBb0IsQ0FBSSxRQUFILEdBQWlCLEdBQWpCLEdBQTBCLElBQTNCOztFQUNwQixxQkFBQSxHQUF3QixDQUFJOztFQUU1QixNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUVmLElBQUEsRUFBTSxRQUZTO0lBR2YsU0FBQSxFQUFXLFFBSEk7O0FBS2Y7OztJQUdBLFFBQUEsRUFBVSxDQUNSLFFBRFEsQ0FSSzs7QUFZZjs7O0lBR0EsVUFBQSxFQUFZLENBQ1YsSUFEVSxDQWZHO0lBbUJmLE9BQUEsRUFDRTtNQUFBLGVBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQURUO1FBRUEsV0FBQSxFQUFhLGlDQUZiO09BREY7TUFJQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsaUJBRFQ7UUFFQSxPQUFBLEVBQVMsQ0FGVDtRQUdBLFdBQUEsRUFBYSx5QkFIYjtPQUxGO01BU0EsTUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLE9BQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQUMsS0FBRCxDQURUO1FBRUEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0FIRjtRQUlBLFdBQUEsRUFBYSxrQ0FKYjtPQVZGO01BZUEsWUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEseUNBRmI7T0FoQkY7S0FwQmE7O0FBUGpCIiwic291cmNlc0NvbnRlbnQiOlsiIyBHZXQgQXRvbSBkZWZhdWx0c1xuc2NvcGUgPSBbJ3NvdXJjZS5weXRob24nXVxudGFiTGVuZ3RoID0gYXRvbT8uY29uZmlnLmdldCgnZWRpdG9yLnRhYkxlbmd0aCcsIHNjb3BlOiBzY29wZSkgPyA0XG5zb2Z0VGFicyA9IGF0b20/LmNvbmZpZy5nZXQoJ2VkaXRvci5zb2Z0VGFicycsIHNjb3BlOiBzY29wZSkgPyB0cnVlXG5kZWZhdWx0SW5kZW50U2l6ZSA9IChpZiBzb2Z0VGFicyB0aGVuIHRhYkxlbmd0aCBlbHNlIDEpXG5kZWZhdWx0SW5kZW50Q2hhciA9IChpZiBzb2Z0VGFicyB0aGVuIFwiIFwiIGVsc2UgXCJcXHRcIilcbmRlZmF1bHRJbmRlbnRXaXRoVGFicyA9IG5vdCBzb2Z0VGFic1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBuYW1lOiBcIlB5dGhvblwiXG4gIG5hbWVzcGFjZTogXCJweXRob25cIlxuXG4gICMjI1xuICBTdXBwb3J0ZWQgR3JhbW1hcnNcbiAgIyMjXG4gIGdyYW1tYXJzOiBbXG4gICAgXCJQeXRob25cIlxuICBdXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBleHRlbnNpb25zXG4gICMjI1xuICBleHRlbnNpb25zOiBbXG4gICAgXCJweVwiXG4gIF1cblxuICBvcHRpb25zOlxuICAgIG1heF9saW5lX2xlbmd0aDpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogNzlcbiAgICAgIGRlc2NyaXB0aW9uOiBcInNldCBtYXhpbXVtIGFsbG93ZWQgbGluZSBsZW5ndGhcIlxuICAgIGluZGVudF9zaXplOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiBkZWZhdWx0SW5kZW50U2l6ZVxuICAgICAgbWluaW11bTogMFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gc2l6ZS9sZW5ndGhcIlxuICAgIGlnbm9yZTpcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IFtcIkUyNFwiXVxuICAgICAgaXRlbXM6XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZXNjcmlwdGlvbjogXCJkbyBub3QgZml4IHRoZXNlIGVycm9ycy93YXJuaW5nc1wiXG4gICAgc29ydF9pbXBvcnRzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwic29ydCBpbXBvcnRzIChyZXF1aXJlcyBpc29ydCBpbnN0YWxsZWQpXCJcblxufVxuIl19
