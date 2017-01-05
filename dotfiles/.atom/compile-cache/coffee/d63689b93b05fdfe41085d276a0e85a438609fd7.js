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
    name: "HTML",
    namespace: "html",

    /*
    Supported Grammars
     */
    grammars: ["HTML"],

    /*
    Supported extensions
     */
    extensions: ["html"],
    options: {
      indent_inner_html: {
        type: 'boolean',
        "default": false,
        description: "Indent <head> and <body> sections."
      },
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
      brace_style: {
        type: 'string',
        "default": "collapse",
        "enum": ["collapse", "expand", "end-expand", "none"],
        description: "[collapse|expand|end-expand|none]"
      },
      indent_scripts: {
        type: 'string',
        "default": "normal",
        "enum": ["keep", "separate", "normal"],
        description: "[keep|separate|normal]"
      },
      wrap_line_length: {
        type: 'integer',
        "default": 250,
        description: "Maximum characters per line (0 disables)"
      },
      wrap_attributes: {
        type: 'string',
        "default": "auto",
        "enum": ["auto", "force"],
        description: "Wrap attributes to new lines [auto|force]"
      },
      wrap_attributes_indent_size: {
        type: 'integer',
        "default": defaultIndentSize,
        minimum: 0,
        description: "Indent wrapped attributes to after N characters"
      },
      preserve_newlines: {
        type: 'boolean',
        "default": true,
        description: "Preserve line-breaks"
      },
      max_preserve_newlines: {
        type: 'integer',
        "default": 10,
        description: "Number of line-breaks to be preserved in one chunk"
      },
      unformatted: {
        type: 'array',
        "default": ['a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'button', 'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'map', 'mark', 'math', 'meter', 'noscript', 'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'svg', 'template', 'textarea', 'time', 'u', 'var', 'video', 'wbr', 'text', 'acronym', 'address', 'big', 'dt', 'ins', 'small', 'strike', 'tt', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        items: {
          type: 'string'
        },
        description: "List of tags (defaults to inline) that should not be reformatted"
      },
      end_with_newline: {
        type: 'boolean',
        "default": false,
        description: "End output with newline"
      },
      extra_liners: {
        type: 'array',
        "default": ['head', 'body', '/html'],
        items: {
          type: 'string'
        },
        description: "List of tags (defaults to [head,body,/html] that should have an extra newline before them."
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL2h0bWwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQTs7RUFBQSxLQUFBLEdBQVEsQ0FBQyxXQUFEOztFQUNSLFNBQUE7OytCQUFpRTs7RUFDakUsUUFBQTs7Z0NBQStEOztFQUMvRCxpQkFBQSxHQUFvQixDQUFJLFFBQUgsR0FBaUIsU0FBakIsR0FBZ0MsQ0FBakM7O0VBQ3BCLGlCQUFBLEdBQW9CLENBQUksUUFBSCxHQUFpQixHQUFqQixHQUEwQixJQUEzQjs7RUFDcEIscUJBQUEsR0FBd0IsQ0FBSTs7RUFFNUIsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFFZixJQUFBLEVBQU0sTUFGUztJQUdmLFNBQUEsRUFBVyxNQUhJOztBQUtmOzs7SUFHQSxRQUFBLEVBQVUsQ0FDUixNQURRLENBUks7O0FBWWY7OztJQUdBLFVBQUEsRUFBWSxDQUNWLE1BRFUsQ0FmRztJQW1CZixPQUFBLEVBQ0U7TUFBQSxpQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsb0NBRmI7T0FERjtNQUlBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxpQkFEVDtRQUVBLE9BQUEsRUFBUyxDQUZUO1FBR0EsV0FBQSxFQUFhLHlCQUhiO09BTEY7TUFTQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsaUJBRFQ7UUFFQSxXQUFBLEVBQWEsdUJBRmI7T0FWRjtNQWFBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxVQURU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QSxFQUNFO1FBQUEsSUFBQSxFQUFNLE9BQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsT0FBakIsQ0FEVDtRQUVBLEtBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxRQUFOO1NBSEY7UUFJQSxXQUFBLEVBQWEsNEZBSmI7T0FsRUY7S0FwQmE7O0FBUGpCIiwic291cmNlc0NvbnRlbnQiOlsiIyBHZXQgQXRvbSBkZWZhdWx0c1xuc2NvcGUgPSBbJ3RleHQuaHRtbCddXG50YWJMZW5ndGggPSBhdG9tPy5jb25maWcuZ2V0KCdlZGl0b3IudGFiTGVuZ3RoJywgc2NvcGU6IHNjb3BlKSA/IDRcbnNvZnRUYWJzID0gYXRvbT8uY29uZmlnLmdldCgnZWRpdG9yLnNvZnRUYWJzJywgc2NvcGU6IHNjb3BlKSA/IHRydWVcbmRlZmF1bHRJbmRlbnRTaXplID0gKGlmIHNvZnRUYWJzIHRoZW4gdGFiTGVuZ3RoIGVsc2UgMSlcbmRlZmF1bHRJbmRlbnRDaGFyID0gKGlmIHNvZnRUYWJzIHRoZW4gXCIgXCIgZWxzZSBcIlxcdFwiKVxuZGVmYXVsdEluZGVudFdpdGhUYWJzID0gbm90IHNvZnRUYWJzXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIG5hbWU6IFwiSFRNTFwiXG4gIG5hbWVzcGFjZTogXCJodG1sXCJcblxuICAjIyNcbiAgU3VwcG9ydGVkIEdyYW1tYXJzXG4gICMjI1xuICBncmFtbWFyczogW1xuICAgIFwiSFRNTFwiXG4gIF1cblxuICAjIyNcbiAgU3VwcG9ydGVkIGV4dGVuc2lvbnNcbiAgIyMjXG4gIGV4dGVuc2lvbnM6IFtcbiAgICBcImh0bWxcIlxuICBdXG5cbiAgb3B0aW9uczpcbiAgICBpbmRlbnRfaW5uZXJfaHRtbDpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudCA8aGVhZD4gYW5kIDxib2R5PiBzZWN0aW9ucy5cIlxuICAgIGluZGVudF9zaXplOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiBkZWZhdWx0SW5kZW50U2l6ZVxuICAgICAgbWluaW11bTogMFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gc2l6ZS9sZW5ndGhcIlxuICAgIGluZGVudF9jaGFyOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IGRlZmF1bHRJbmRlbnRDaGFyXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBjaGFyYWN0ZXJcIlxuICAgIGJyYWNlX3N0eWxlOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiY29sbGFwc2VcIlxuICAgICAgZW51bTogW1wiY29sbGFwc2VcIiwgXCJleHBhbmRcIiwgXCJlbmQtZXhwYW5kXCIsIFwibm9uZVwiXVxuICAgICAgZGVzY3JpcHRpb246IFwiW2NvbGxhcHNlfGV4cGFuZHxlbmQtZXhwYW5kfG5vbmVdXCJcbiAgICBpbmRlbnRfc2NyaXB0czpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcIm5vcm1hbFwiXG4gICAgICBlbnVtOiBbXCJrZWVwXCIsIFwic2VwYXJhdGVcIiwgXCJub3JtYWxcIl1cbiAgICAgIGRlc2NyaXB0aW9uOiBcIltrZWVwfHNlcGFyYXRlfG5vcm1hbF1cIlxuICAgIHdyYXBfbGluZV9sZW5ndGg6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDI1MFxuICAgICAgZGVzY3JpcHRpb246IFwiTWF4aW11bSBjaGFyYWN0ZXJzIHBlciBsaW5lICgwIGRpc2FibGVzKVwiXG4gICAgd3JhcF9hdHRyaWJ1dGVzOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiYXV0b1wiXG4gICAgICBlbnVtOiBbXCJhdXRvXCIsIFwiZm9yY2VcIl1cbiAgICAgIGRlc2NyaXB0aW9uOiBcIldyYXAgYXR0cmlidXRlcyB0byBuZXcgbGluZXMgW2F1dG98Zm9yY2VdXCJcbiAgICB3cmFwX2F0dHJpYnV0ZXNfaW5kZW50X3NpemU6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IGRlZmF1bHRJbmRlbnRTaXplXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnQgd3JhcHBlZCBhdHRyaWJ1dGVzIHRvIGFmdGVyIE4gY2hhcmFjdGVyc1wiXG4gICAgcHJlc2VydmVfbmV3bGluZXM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlByZXNlcnZlIGxpbmUtYnJlYWtzXCJcbiAgICBtYXhfcHJlc2VydmVfbmV3bGluZXM6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDEwXG4gICAgICBkZXNjcmlwdGlvbjogXCJOdW1iZXIgb2YgbGluZS1icmVha3MgdG8gYmUgcHJlc2VydmVkIGluIG9uZSBjaHVua1wiXG4gICAgdW5mb3JtYXR0ZWQ6XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbXG4gICAgICAgICAgICAnYScsICdhYmJyJywgJ2FyZWEnLCAnYXVkaW8nLCAnYicsICdiZGknLCAnYmRvJywgJ2JyJywgJ2J1dHRvbicsICdjYW52YXMnLCAnY2l0ZScsXG4gICAgICAgICAgICAnY29kZScsICdkYXRhJywgJ2RhdGFsaXN0JywgJ2RlbCcsICdkZm4nLCAnZW0nLCAnZW1iZWQnLCAnaScsICdpZnJhbWUnLCAnaW1nJyxcbiAgICAgICAgICAgICdpbnB1dCcsICdpbnMnLCAna2JkJywgJ2tleWdlbicsICdsYWJlbCcsICdtYXAnLCAnbWFyaycsICdtYXRoJywgJ21ldGVyJywgJ25vc2NyaXB0JyxcbiAgICAgICAgICAgICdvYmplY3QnLCAnb3V0cHV0JywgJ3Byb2dyZXNzJywgJ3EnLCAncnVieScsICdzJywgJ3NhbXAnLCAnc2VsZWN0JywgJ3NtYWxsJyxcbiAgICAgICAgICAgICdzcGFuJywgJ3N0cm9uZycsICdzdWInLCAnc3VwJywgJ3N2ZycsICd0ZW1wbGF0ZScsICd0ZXh0YXJlYScsICd0aW1lJywgJ3UnLCAndmFyJyxcbiAgICAgICAgICAgICd2aWRlbycsICd3YnInLCAndGV4dCcsXG4gICAgICAgICAgICAnYWNyb255bScsICdhZGRyZXNzJywgJ2JpZycsICdkdCcsICdpbnMnLCAnc21hbGwnLCAnc3RyaWtlJywgJ3R0JyxcbiAgICAgICAgICAgICdwcmUnLFxuICAgICAgICAgICAgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2J1xuICAgICAgICBdXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkxpc3Qgb2YgdGFncyAoZGVmYXVsdHMgdG8gaW5saW5lKSB0aGF0IHNob3VsZCBub3QgYmUgcmVmb3JtYXR0ZWRcIlxuICAgIGVuZF93aXRoX25ld2xpbmU6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJFbmQgb3V0cHV0IHdpdGggbmV3bGluZVwiXG4gICAgZXh0cmFfbGluZXJzOlxuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogWydoZWFkJywgJ2JvZHknLCAnL2h0bWwnXVxuICAgICAgaXRlbXM6XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZXNjcmlwdGlvbjogXCJMaXN0IG9mIHRhZ3MgKGRlZmF1bHRzIHRvIFtoZWFkLGJvZHksL2h0bWxdIHRoYXQgc2hvdWxkIGhhdmUgYW4gZXh0cmEgbmV3bGluZSBiZWZvcmUgdGhlbS5cIlxuXG59XG4iXX0=
