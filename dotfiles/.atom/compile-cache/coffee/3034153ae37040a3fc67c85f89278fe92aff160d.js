(function() {
  var defaultIndentChar, defaultIndentSize, defaultIndentWithTabs, ref, ref1, scope, softTabs, tabLength;

  scope = ['text.jade'];

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
    name: "Jade",
    namespace: "jade",
    fallback: ['html'],

    /*
    Supported Grammars
     */
    grammars: ["Jade", "Pug"],

    /*
    Supported extensions
     */
    extensions: ["jade", "pug"],
    options: [
      {
        indent_size: {
          type: 'integer',
          "default": defaultIndentSize,
          minimum: 0,
          description: "Indentation size/length"
        },
        indent_char: {
          type: 'string',
          "default": defaultIndentChar,
          description: "Indentation character"
        },
        omit_div: {
          type: 'boolean',
          "default": false,
          description: "Whether to omit/remove the 'div' tags."
        }
      }
    ],
    defaultBeautifier: "Pug Beautify"
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL2phZGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQTs7RUFBQSxLQUFBLEdBQVEsQ0FBQyxXQUFEOztFQUNSLFNBQUE7OytCQUFpRTs7RUFDakUsUUFBQTs7Z0NBQStEOztFQUMvRCxpQkFBQSxHQUFvQixDQUFJLFFBQUgsR0FBaUIsU0FBakIsR0FBZ0MsQ0FBakM7O0VBQ3BCLGlCQUFBLEdBQW9CLENBQUksUUFBSCxHQUFpQixHQUFqQixHQUEwQixJQUEzQjs7RUFDcEIscUJBQUEsR0FBd0IsQ0FBSTs7RUFFNUIsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFFZixJQUFBLEVBQU0sTUFGUztJQUdmLFNBQUEsRUFBVyxNQUhJO0lBSWYsUUFBQSxFQUFVLENBQUMsTUFBRCxDQUpLOztBQU1mOzs7SUFHQSxRQUFBLEVBQVUsQ0FDUixNQURRLEVBQ0EsS0FEQSxDQVRLOztBQWFmOzs7SUFHQSxVQUFBLEVBQVksQ0FDVixNQURVLEVBQ0YsS0FERSxDQWhCRztJQW9CZixPQUFBLEVBQVM7TUFDUDtRQUFBLFdBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxTQUFOO1VBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxpQkFEVDtVQUVBLE9BQUEsRUFBUyxDQUZUO1VBR0EsV0FBQSxFQUFhLHlCQUhiO1NBREY7UUFLQSxXQUFBLEVBQ0U7VUFBQSxJQUFBLEVBQU0sUUFBTjtVQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsaUJBRFQ7VUFFQSxXQUFBLEVBQWEsdUJBRmI7U0FORjtRQVNBLFFBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxTQUFOO1VBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1VBRUEsV0FBQSxFQUFhLHdDQUZiO1NBVkY7T0FETztLQXBCTTtJQW9DZixpQkFBQSxFQUFtQixjQXBDSjs7QUFQakIiLCJzb3VyY2VzQ29udGVudCI6WyIjIEdldCBBdG9tIGRlZmF1bHRzXG5zY29wZSA9IFsndGV4dC5qYWRlJ11cbnRhYkxlbmd0aCA9IGF0b20/LmNvbmZpZy5nZXQoJ2VkaXRvci50YWJMZW5ndGgnLCBzY29wZTogc2NvcGUpID8gNFxuc29mdFRhYnMgPSBhdG9tPy5jb25maWcuZ2V0KCdlZGl0b3Iuc29mdFRhYnMnLCBzY29wZTogc2NvcGUpID8gdHJ1ZVxuZGVmYXVsdEluZGVudFNpemUgPSAoaWYgc29mdFRhYnMgdGhlbiB0YWJMZW5ndGggZWxzZSAxKVxuZGVmYXVsdEluZGVudENoYXIgPSAoaWYgc29mdFRhYnMgdGhlbiBcIiBcIiBlbHNlIFwiXFx0XCIpXG5kZWZhdWx0SW5kZW50V2l0aFRhYnMgPSBub3Qgc29mdFRhYnNcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgbmFtZTogXCJKYWRlXCJcbiAgbmFtZXNwYWNlOiBcImphZGVcIlxuICBmYWxsYmFjazogWydodG1sJ11cblxuICAjIyNcbiAgU3VwcG9ydGVkIEdyYW1tYXJzXG4gICMjI1xuICBncmFtbWFyczogW1xuICAgIFwiSmFkZVwiLCBcIlB1Z1wiXG4gIF1cblxuICAjIyNcbiAgU3VwcG9ydGVkIGV4dGVuc2lvbnNcbiAgIyMjXG4gIGV4dGVuc2lvbnM6IFtcbiAgICBcImphZGVcIiwgXCJwdWdcIlxuICBdXG5cbiAgb3B0aW9uczogW1xuICAgIGluZGVudF9zaXplOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiBkZWZhdWx0SW5kZW50U2l6ZVxuICAgICAgbWluaW11bTogMFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gc2l6ZS9sZW5ndGhcIlxuICAgIGluZGVudF9jaGFyOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IGRlZmF1bHRJbmRlbnRDaGFyXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBjaGFyYWN0ZXJcIlxuICAgIG9taXRfZGl2OlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiV2hldGhlciB0byBvbWl0L3JlbW92ZSB0aGUgJ2RpdicgdGFncy5cIlxuICBdXG5cbiAgZGVmYXVsdEJlYXV0aWZpZXI6IFwiUHVnIEJlYXV0aWZ5XCJcblxufVxuIl19
