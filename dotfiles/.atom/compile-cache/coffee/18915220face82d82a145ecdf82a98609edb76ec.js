(function() {
  var defaultIndentChar, defaultIndentSize, defaultIndentWithTabs, ref, ref1, scope, softTabs, tabLength;

  scope = ['text.html'];

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
    name: "R",
    namespace: "r",

    /*
    Supported Grammars
     */
    grammars: ["R"],

    /*
    Supported extensions
     */
    extensions: ["r", "R"],
    options: {
      indent_size: {
        type: 'integer',
        "default": defaultIndentSize,
        description: "Indentation size/length"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL3IuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQTs7RUFBQSxLQUFBLEdBQVEsQ0FBQyxXQUFEOztFQUNSLFNBQUE7OytCQUFpRTs7RUFDakUsUUFBQTs7Z0NBQStEOztFQUMvRCxpQkFBQSxHQUFvQixDQUFJLFFBQUgsR0FBaUIsU0FBakIsR0FBZ0MsQ0FBakM7O0VBQ3BCLGlCQUFBLEdBQW9CLENBQUksUUFBSCxHQUFpQixHQUFqQixHQUEwQixJQUEzQjs7RUFDcEIscUJBQUEsR0FBd0IsQ0FBSTs7RUFFNUIsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFFZixJQUFBLEVBQU0sR0FGUztJQUdmLFNBQUEsRUFBVyxHQUhJOztBQUtmOzs7SUFHQSxRQUFBLEVBQVUsQ0FDUixHQURRLENBUks7O0FBWWY7OztJQUdBLFVBQUEsRUFBWSxDQUNWLEdBRFUsRUFFVixHQUZVLENBZkc7SUFvQmYsT0FBQSxFQUNFO01BQUEsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGlCQURUO1FBRUEsV0FBQSxFQUFhLHlCQUZiO09BREY7S0FyQmE7O0FBUGpCIiwic291cmNlc0NvbnRlbnQiOlsiIyBHZXQgQXRvbSBkZWZhdWx0c1xuc2NvcGUgPSBbJ3RleHQuaHRtbCddXG50YWJMZW5ndGggPSBhdG9tPy5jb25maWcuZ2V0KCdlZGl0b3IudGFiTGVuZ3RoJywgc2NvcGU6IHNjb3BlKSA/IDRcbnNvZnRUYWJzID0gYXRvbT8uY29uZmlnLmdldCgnZWRpdG9yLnNvZnRUYWJzJywgc2NvcGU6IHNjb3BlKSA/IHRydWVcbmRlZmF1bHRJbmRlbnRTaXplID0gKGlmIHNvZnRUYWJzIHRoZW4gdGFiTGVuZ3RoIGVsc2UgMSlcbmRlZmF1bHRJbmRlbnRDaGFyID0gKGlmIHNvZnRUYWJzIHRoZW4gXCIgXCIgZWxzZSBcIlxcdFwiKVxuZGVmYXVsdEluZGVudFdpdGhUYWJzID0gbm90IHNvZnRUYWJzXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIG5hbWU6IFwiUlwiXG4gIG5hbWVzcGFjZTogXCJyXCJcblxuICAjIyNcbiAgU3VwcG9ydGVkIEdyYW1tYXJzXG4gICMjI1xuICBncmFtbWFyczogW1xuICAgIFwiUlwiXG5dXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBleHRlbnNpb25zXG4gICMjI1xuICBleHRlbnNpb25zOiBbXG4gICAgXCJyXCJcbiAgICBcIlJcIlxuICBdXG5cbiAgb3B0aW9uczpcbiAgICBpbmRlbnRfc2l6ZTpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogZGVmYXVsdEluZGVudFNpemVcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudGF0aW9uIHNpemUvbGVuZ3RoXCJcblxufVxuIl19
