(function() {
  var defaultIndentSize, ref, ref1, scope, softTabs, tabLength;

  scope = ['source.sh', 'source.bash'];

  tabLength = (ref = typeof atom !== "undefined" && atom !== null ? atom.config.get('editor.tabLength', {
    scope: scope
  }) : void 0) != null ? ref : 2;

  softTabs = (ref1 = typeof atom !== "undefined" && atom !== null ? atom.config.get('editor.softTabs', {
    scope: scope
  }) : void 0) != null ? ref1 : true;

  defaultIndentSize = (softTabs ? tabLength : 1);

  module.exports = {
    name: "Bash",
    namespace: "bash",

    /*
    Supported Grammars
     */
    grammars: ["Shell Script"],
    defaultBeautifier: "beautysh",

    /*
    Supported extensions
     */
    extensions: ["bash", "sh"],
    options: {
      indent_size: {
        type: 'integer',
        "default": defaultIndentSize,
        minimum: 0,
        description: "Indentation size/length"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL2Jhc2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxLQUFBLEdBQVEsQ0FBQyxXQUFELEVBQWMsYUFBZDs7RUFDUixTQUFBOzsrQkFBaUU7O0VBQ2pFLFFBQUE7O2dDQUErRDs7RUFDL0QsaUJBQUEsR0FBb0IsQ0FBSSxRQUFILEdBQWlCLFNBQWpCLEdBQWdDLENBQWpDOztFQUVwQixNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUVmLElBQUEsRUFBTSxNQUZTO0lBR2YsU0FBQSxFQUFXLE1BSEk7O0FBS2Y7OztJQUdBLFFBQUEsRUFBVSxDQUNSLGNBRFEsQ0FSSztJQVlmLGlCQUFBLEVBQW1CLFVBWko7O0FBY2Y7OztJQUdBLFVBQUEsRUFBWSxDQUNWLE1BRFUsRUFFVixJQUZVLENBakJHO0lBc0JmLE9BQUEsRUFDRTtNQUFBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxpQkFEVDtRQUVBLE9BQUEsRUFBUyxDQUZUO1FBR0EsV0FBQSxFQUFhLHlCQUhiO09BREY7S0F2QmE7O0FBTGpCIiwic291cmNlc0NvbnRlbnQiOlsic2NvcGUgPSBbJ3NvdXJjZS5zaCcsICdzb3VyY2UuYmFzaCddXG50YWJMZW5ndGggPSBhdG9tPy5jb25maWcuZ2V0KCdlZGl0b3IudGFiTGVuZ3RoJywgc2NvcGU6IHNjb3BlKSA/IDJcbnNvZnRUYWJzID0gYXRvbT8uY29uZmlnLmdldCgnZWRpdG9yLnNvZnRUYWJzJywgc2NvcGU6IHNjb3BlKSA/IHRydWVcbmRlZmF1bHRJbmRlbnRTaXplID0gKGlmIHNvZnRUYWJzIHRoZW4gdGFiTGVuZ3RoIGVsc2UgMSlcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgbmFtZTogXCJCYXNoXCJcbiAgbmFtZXNwYWNlOiBcImJhc2hcIlxuXG4gICMjI1xuICBTdXBwb3J0ZWQgR3JhbW1hcnNcbiAgIyMjXG4gIGdyYW1tYXJzOiBbXG4gICAgXCJTaGVsbCBTY3JpcHRcIlxuICBdXG5cbiAgZGVmYXVsdEJlYXV0aWZpZXI6IFwiYmVhdXR5c2hcIlxuXG4gICMjI1xuICBTdXBwb3J0ZWQgZXh0ZW5zaW9uc1xuICAjIyNcbiAgZXh0ZW5zaW9uczogW1xuICAgIFwiYmFzaFwiXG4gICAgXCJzaFwiXG4gIF1cblxuICBvcHRpb25zOlxuICAgIGluZGVudF9zaXplOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiBkZWZhdWx0SW5kZW50U2l6ZVxuICAgICAgbWluaW11bTogMFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gc2l6ZS9sZW5ndGhcIlxuXG59XG4iXX0=
