(function() {
  var defaultIndentChar, defaultIndentSize, defaultIndentWithTabs, ref, ref1, softTabs, tabLength;

  tabLength = (ref = typeof atom !== "undefined" && atom !== null ? atom.config.get('editor.tabLength') : void 0) != null ? ref : 4;

  softTabs = (ref1 = typeof atom !== "undefined" && atom !== null ? atom.config.get('editor.softTabs') : void 0) != null ? ref1 : true;

  defaultIndentSize = (softTabs ? tabLength : 1);

  defaultIndentChar = (softTabs ? " " : "\t");

  defaultIndentWithTabs = !softTabs;

  module.exports = {
    name: "gherkin",
    namespace: "gherkin",
    grammars: ["Gherkin"],
    extensions: ["feature"],
    options: {
      indent_size: {
        type: 'integer',
        "default": defaultIndentSize,
        minimum: 0,
        description: "Indentation size/length"
      },
      indent_char: {
        type: 'string',
        "default": defaultIndentChar,
        minimum: 0,
        description: "Indentation character"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL2doZXJraW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQTs7RUFBQSxTQUFBLHVIQUFtRDs7RUFDbkQsUUFBQSx3SEFBaUQ7O0VBQ2pELGlCQUFBLEdBQW9CLENBQUksUUFBSCxHQUFpQixTQUFqQixHQUFnQyxDQUFqQzs7RUFDcEIsaUJBQUEsR0FBb0IsQ0FBSSxRQUFILEdBQWlCLEdBQWpCLEdBQTBCLElBQTNCOztFQUNwQixxQkFBQSxHQUF3QixDQUFJOztFQUU1QixNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUVmLElBQUEsRUFBTSxTQUZTO0lBR2YsU0FBQSxFQUFXLFNBSEk7SUFLZixRQUFBLEVBQVUsQ0FDUixTQURRLENBTEs7SUFTZixVQUFBLEVBQVksQ0FDVixTQURVLENBVEc7SUFhZixPQUFBLEVBQ0U7TUFBQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsaUJBRFQ7UUFFQSxPQUFBLEVBQVMsQ0FGVDtRQUdBLFdBQUEsRUFBYSx5QkFIYjtPQURGO01BS0EsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGlCQURUO1FBRUEsT0FBQSxFQUFTLENBRlQ7UUFHQSxXQUFBLEVBQWEsdUJBSGI7T0FORjtLQWRhOztBQU5qQiIsInNvdXJjZXNDb250ZW50IjpbIiMgR2V0IEF0b20gZGVmYXVsdHNcbnRhYkxlbmd0aCA9IGF0b20/LmNvbmZpZy5nZXQoJ2VkaXRvci50YWJMZW5ndGgnKSA/IDRcbnNvZnRUYWJzID0gYXRvbT8uY29uZmlnLmdldCgnZWRpdG9yLnNvZnRUYWJzJykgPyB0cnVlXG5kZWZhdWx0SW5kZW50U2l6ZSA9IChpZiBzb2Z0VGFicyB0aGVuIHRhYkxlbmd0aCBlbHNlIDEpXG5kZWZhdWx0SW5kZW50Q2hhciA9IChpZiBzb2Z0VGFicyB0aGVuIFwiIFwiIGVsc2UgXCJcXHRcIilcbmRlZmF1bHRJbmRlbnRXaXRoVGFicyA9IG5vdCBzb2Z0VGFic1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBuYW1lOiBcImdoZXJraW5cIlxuICBuYW1lc3BhY2U6IFwiZ2hlcmtpblwiXG5cbiAgZ3JhbW1hcnM6IFtcbiAgICBcIkdoZXJraW5cIlxuICBdXG5cbiAgZXh0ZW5zaW9uczogW1xuICAgIFwiZmVhdHVyZVwiXG4gIF1cblxuICBvcHRpb25zOlxuICAgIGluZGVudF9zaXplOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiBkZWZhdWx0SW5kZW50U2l6ZVxuICAgICAgbWluaW11bTogMFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gc2l6ZS9sZW5ndGhcIlxuICAgIGluZGVudF9jaGFyOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IGRlZmF1bHRJbmRlbnRDaGFyXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBjaGFyYWN0ZXJcIlxufVxuIl19
