(function() {
  var defaultIndentChar, defaultIndentSize, defaultIndentWithTabs, ref, ref1, scope, softTabs, tabLength;

  scope = ['source.ruby'];

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
    name: "Ruby",
    namespace: "ruby",

    /*
    Supported Grammars
     */
    grammars: ["Ruby", "Ruby on Rails"],

    /*
    Supported extensions
     */
    extensions: ["rb"],
    options: {
      indent_size: {
        type: 'integer',
        "default": defaultIndentSize,
        minimum: 0,
        description: "Indentation size/length"
      },
      rubocop_path: {
        title: "Rubocop Path",
        type: 'string',
        "default": "",
        description: "Path to the `rubocop` CLI executable"
      },
      indent_char: {
        type: 'string',
        "default": defaultIndentChar,
        description: "Indentation character",
        "enum": [" ", "\t"]
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL3J1YnkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQTs7RUFBQSxLQUFBLEdBQVEsQ0FBQyxhQUFEOztFQUNSLFNBQUE7OytCQUFpRTs7RUFDakUsUUFBQTs7Z0NBQStEOztFQUMvRCxpQkFBQSxHQUFvQixDQUFJLFFBQUgsR0FBaUIsU0FBakIsR0FBZ0MsQ0FBakM7O0VBQ3BCLGlCQUFBLEdBQW9CLENBQUksUUFBSCxHQUFpQixHQUFqQixHQUEwQixJQUEzQjs7RUFDcEIscUJBQUEsR0FBd0IsQ0FBSTs7RUFFNUIsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFFZixJQUFBLEVBQU0sTUFGUztJQUdmLFNBQUEsRUFBVyxNQUhJOztBQUtmOzs7SUFHQSxRQUFBLEVBQVUsQ0FDUixNQURRLEVBRVIsZUFGUSxDQVJLOztBQWFmOzs7SUFHQSxVQUFBLEVBQVksQ0FDVixJQURVLENBaEJHO0lBb0JmLE9BQUEsRUFDRTtNQUFBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxpQkFEVDtRQUVBLE9BQUEsRUFBUyxDQUZUO1FBR0EsV0FBQSxFQUFhLHlCQUhiO09BREY7TUFLQSxZQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sY0FBUDtRQUNBLElBQUEsRUFBTSxRQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQUZUO1FBR0EsV0FBQSxFQUFhLHNDQUhiO09BTkY7TUFVQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsaUJBRFQ7UUFFQSxXQUFBLEVBQWEsdUJBRmI7UUFHQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQUMsR0FBRCxFQUFNLElBQU4sQ0FITjtPQVhGO0tBckJhOztBQVBqQiIsInNvdXJjZXNDb250ZW50IjpbIiMgR2V0IEF0b20gZGVmYXVsdHNcbnNjb3BlID0gWydzb3VyY2UucnVieSddXG50YWJMZW5ndGggPSBhdG9tPy5jb25maWcuZ2V0KCdlZGl0b3IudGFiTGVuZ3RoJywgc2NvcGU6IHNjb3BlKSA/IDRcbnNvZnRUYWJzID0gYXRvbT8uY29uZmlnLmdldCgnZWRpdG9yLnNvZnRUYWJzJywgc2NvcGU6IHNjb3BlKSA/IHRydWVcbmRlZmF1bHRJbmRlbnRTaXplID0gKGlmIHNvZnRUYWJzIHRoZW4gdGFiTGVuZ3RoIGVsc2UgMSlcbmRlZmF1bHRJbmRlbnRDaGFyID0gKGlmIHNvZnRUYWJzIHRoZW4gXCIgXCIgZWxzZSBcIlxcdFwiKVxuZGVmYXVsdEluZGVudFdpdGhUYWJzID0gbm90IHNvZnRUYWJzXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIG5hbWU6IFwiUnVieVwiXG4gIG5hbWVzcGFjZTogXCJydWJ5XCJcblxuICAjIyNcbiAgU3VwcG9ydGVkIEdyYW1tYXJzXG4gICMjI1xuICBncmFtbWFyczogW1xuICAgIFwiUnVieVwiXG4gICAgXCJSdWJ5IG9uIFJhaWxzXCJcbiAgXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgZXh0ZW5zaW9uc1xuICAjIyNcbiAgZXh0ZW5zaW9uczogW1xuICAgIFwicmJcIlxuICBdXG5cbiAgb3B0aW9uczpcbiAgICBpbmRlbnRfc2l6ZTpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogZGVmYXVsdEluZGVudFNpemVcbiAgICAgIG1pbmltdW06IDBcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudGF0aW9uIHNpemUvbGVuZ3RoXCJcbiAgICBydWJvY29wX3BhdGg6XG4gICAgICB0aXRsZTogXCJSdWJvY29wIFBhdGhcIlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiXCJcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlBhdGggdG8gdGhlIGBydWJvY29wYCBDTEkgZXhlY3V0YWJsZVwiXG4gICAgaW5kZW50X2NoYXI6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogZGVmYXVsdEluZGVudENoYXJcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudGF0aW9uIGNoYXJhY3RlclwiXG4gICAgICBlbnVtOiBbXCIgXCIsIFwiXFx0XCJdXG5cblxufVxuIl19
