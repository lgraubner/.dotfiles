(function() {
  var defaultIndentChar, defaultIndentSize, defaultIndentWithTabs, ref, ref1, scope, softTabs, tabLength;

  scope = ['source.css'];

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
    name: "CSS",
    namespace: "css",

    /*
    Supported Grammars
     */
    grammars: ["CSS"],

    /*
    Supported extensions
     */
    extensions: ["css"],
    defaultBeautifier: "JS Beautify",
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
      },
      selector_separator_newline: {
        type: 'boolean',
        "default": false,
        description: "Add a newline between multiple selectors"
      },
      newline_between_rules: {
        type: 'boolean',
        "default": true,
        description: "Add a newline between CSS rules"
      },
      preserve_newlines: {
        type: 'boolean',
        "default": false,
        description: "Retain empty lines. " + "Consecutive empty lines will be converted to a single empty line."
      },
      wrap_line_length: {
        type: 'integer',
        "default": 0,
        description: "Maximum amount of characters per line (0 = disable)"
      },
      end_with_newline: {
        type: 'boolean',
        "default": false,
        description: "End output with newline"
      },
      indent_comments: {
        type: 'boolean',
        "default": true,
        description: "Determines whether comments should be indented."
      },
      force_indentation: {
        type: 'boolean',
        "default": false,
        description: "if indentation should be forcefully applied to markup even if it disruptively adds unintended whitespace to the documents rendered output"
      },
      convert_quotes: {
        type: 'string',
        "default": "none",
        description: "Convert the quote characters delimiting strings from either double or single quotes to the other.",
        "enum": ["none", "double", "single"]
      },
      align_assignments: {
        type: 'boolean',
        "default": false,
        description: "If lists of assignments or properties should be vertically aligned for faster and easier reading."
      },
      no_lead_zero: {
        type: 'boolean',
        "default": false,
        description: "If in CSS values leading 0s immediately preceeding a decimal should be removed or prevented."
      },
      configPath: {
        title: "comb custom config file",
        type: 'string',
        "default": "",
        description: "Path to custom CSScomb config file, used in absense of a `.csscomb.json` or `.csscomb.cson` at the root of your project."
      },
      predefinedConfig: {
        title: "comb predefined config",
        type: 'string',
        "default": "csscomb",
        description: "Used if neither a project or custom config file exists.",
        "enum": ["csscomb", "yandex", "zen"]
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL2Nzcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBOztFQUFBLEtBQUEsR0FBUSxDQUFDLFlBQUQ7O0VBQ1IsU0FBQTs7K0JBQWlFOztFQUNqRSxRQUFBOztnQ0FBK0Q7O0VBQy9ELGlCQUFBLEdBQW9CLENBQUksUUFBSCxHQUFpQixTQUFqQixHQUFnQyxDQUFqQzs7RUFDcEIsaUJBQUEsR0FBb0IsQ0FBSSxRQUFILEdBQWlCLEdBQWpCLEdBQTBCLElBQTNCOztFQUNwQixxQkFBQSxHQUF3QixDQUFJOztFQUU1QixNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUVmLElBQUEsRUFBTSxLQUZTO0lBR2YsU0FBQSxFQUFXLEtBSEk7O0FBS2Y7OztJQUdBLFFBQUEsRUFBVSxDQUNSLEtBRFEsQ0FSSzs7QUFZZjs7O0lBR0EsVUFBQSxFQUFZLENBQ1YsS0FEVSxDQWZHO0lBbUJmLGlCQUFBLEVBQW1CLGFBbkJKO0lBcUJmLE9BQUEsRUFFRTtNQUFBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxpQkFEVDtRQUVBLE9BQUEsRUFBUyxDQUZUO1FBR0EsV0FBQSxFQUFhLHlCQUhiO09BREY7TUFLQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsaUJBRFQ7UUFFQSxPQUFBLEVBQVMsQ0FGVDtRQUdBLFdBQUEsRUFBYSx1QkFIYjtPQU5GO01BVUEsMEJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLDBDQUZiO09BWEY7TUFjQSxxQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsaUNBRmI7T0FmRjtNQWtCQSxpQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsc0JBQUEsR0FDWCxtRUFIRjtPQW5CRjtNQXdCQSxnQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBRFQ7UUFFQSxXQUFBLEVBQWEscURBRmI7T0F6QkY7TUE0QkEsZ0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLHlCQUZiO09BN0JGO01BZ0NBLGVBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLGlEQUZiO09BakNGO01Bb0NBLGlCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSwySUFGYjtPQXJDRjtNQTBDQSxjQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFEVDtRQUVBLFdBQUEsRUFBYSxtR0FGYjtRQUlBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixRQUFuQixDQUpOO09BM0NGO01BZ0RBLGlCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSxtR0FGYjtPQWpERjtNQXFEQSxZQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSw4RkFGYjtPQXRERjtNQTBEQSxVQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8seUJBQVA7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFGVDtRQUdBLFdBQUEsRUFBYSwwSEFIYjtPQTNERjtNQWdFQSxnQkFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLHdCQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLFNBRlQ7UUFHQSxXQUFBLEVBQWEseURBSGI7UUFJQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQUMsU0FBRCxFQUFZLFFBQVosRUFBc0IsS0FBdEIsQ0FKTjtPQWpFRjtLQXZCYTs7QUFQakIiLCJzb3VyY2VzQ29udGVudCI6WyIjIEdldCBBdG9tIGRlZmF1bHRzXG5zY29wZSA9IFsnc291cmNlLmNzcyddXG50YWJMZW5ndGggPSBhdG9tPy5jb25maWcuZ2V0KCdlZGl0b3IudGFiTGVuZ3RoJywgc2NvcGU6IHNjb3BlKSA/IDRcbnNvZnRUYWJzID0gYXRvbT8uY29uZmlnLmdldCgnZWRpdG9yLnNvZnRUYWJzJywgc2NvcGU6IHNjb3BlKSA/IHRydWVcbmRlZmF1bHRJbmRlbnRTaXplID0gKGlmIHNvZnRUYWJzIHRoZW4gdGFiTGVuZ3RoIGVsc2UgMSlcbmRlZmF1bHRJbmRlbnRDaGFyID0gKGlmIHNvZnRUYWJzIHRoZW4gXCIgXCIgZWxzZSBcIlxcdFwiKVxuZGVmYXVsdEluZGVudFdpdGhUYWJzID0gbm90IHNvZnRUYWJzXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIG5hbWU6IFwiQ1NTXCJcbiAgbmFtZXNwYWNlOiBcImNzc1wiXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBHcmFtbWFyc1xuICAjIyNcbiAgZ3JhbW1hcnM6IFtcbiAgICBcIkNTU1wiXG4gIF1cblxuICAjIyNcbiAgU3VwcG9ydGVkIGV4dGVuc2lvbnNcbiAgIyMjXG4gIGV4dGVuc2lvbnM6IFtcbiAgICBcImNzc1wiXG4gIF1cblxuICBkZWZhdWx0QmVhdXRpZmllcjogXCJKUyBCZWF1dGlmeVwiXG5cbiAgb3B0aW9uczpcbiAgICAjIENTU1xuICAgIGluZGVudF9zaXplOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiBkZWZhdWx0SW5kZW50U2l6ZVxuICAgICAgbWluaW11bTogMFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gc2l6ZS9sZW5ndGhcIlxuICAgIGluZGVudF9jaGFyOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IGRlZmF1bHRJbmRlbnRDaGFyXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBjaGFyYWN0ZXJcIlxuICAgIHNlbGVjdG9yX3NlcGFyYXRvcl9uZXdsaW5lOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiQWRkIGEgbmV3bGluZSBiZXR3ZWVuIG11bHRpcGxlIHNlbGVjdG9yc1wiXG4gICAgbmV3bGluZV9iZXR3ZWVuX3J1bGVzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBkZXNjcmlwdGlvbjogXCJBZGQgYSBuZXdsaW5lIGJldHdlZW4gQ1NTIHJ1bGVzXCJcbiAgICBwcmVzZXJ2ZV9uZXdsaW5lczpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlJldGFpbiBlbXB0eSBsaW5lcy4gXCIrXG4gICAgICAgIFwiQ29uc2VjdXRpdmUgZW1wdHkgbGluZXMgd2lsbCBiZSBjb252ZXJ0ZWQgdG8gXFxcbiAgICAgICAgICAgICAgICBhIHNpbmdsZSBlbXB0eSBsaW5lLlwiXG4gICAgd3JhcF9saW5lX2xlbmd0aDpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogMFxuICAgICAgZGVzY3JpcHRpb246IFwiTWF4aW11bSBhbW91bnQgb2YgY2hhcmFjdGVycyBwZXIgbGluZSAoMCA9IGRpc2FibGUpXCJcbiAgICBlbmRfd2l0aF9uZXdsaW5lOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiRW5kIG91dHB1dCB3aXRoIG5ld2xpbmVcIlxuICAgIGluZGVudF9jb21tZW50czpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgZGVzY3JpcHRpb246IFwiRGV0ZXJtaW5lcyB3aGV0aGVyIGNvbW1lbnRzIHNob3VsZCBiZSBpbmRlbnRlZC5cIlxuICAgIGZvcmNlX2luZGVudGF0aW9uOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiaWYgaW5kZW50YXRpb24gc2hvdWxkIGJlIGZvcmNlZnVsbHkgYXBwbGllZCB0byBcXFxuICAgICAgICAgICAgICAgIG1hcmt1cCBldmVuIGlmIGl0IGRpc3J1cHRpdmVseSBhZGRzIHVuaW50ZW5kZWQgd2hpdGVzcGFjZSBcXFxuICAgICAgICAgICAgICAgIHRvIHRoZSBkb2N1bWVudHMgcmVuZGVyZWQgb3V0cHV0XCJcbiAgICBjb252ZXJ0X3F1b3RlczpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcIm5vbmVcIlxuICAgICAgZGVzY3JpcHRpb246IFwiQ29udmVydCB0aGUgcXVvdGUgY2hhcmFjdGVycyBkZWxpbWl0aW5nIHN0cmluZ3MgXFxcbiAgICAgICAgICAgICAgICBmcm9tIGVpdGhlciBkb3VibGUgb3Igc2luZ2xlIHF1b3RlcyB0byB0aGUgb3RoZXIuXCJcbiAgICAgIGVudW06IFtcIm5vbmVcIiwgXCJkb3VibGVcIiwgXCJzaW5nbGVcIl1cbiAgICBhbGlnbl9hc3NpZ25tZW50czpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIklmIGxpc3RzIG9mIGFzc2lnbm1lbnRzIG9yIHByb3BlcnRpZXMgc2hvdWxkIGJlIFxcXG4gICAgICAgICAgICAgICAgdmVydGljYWxseSBhbGlnbmVkIGZvciBmYXN0ZXIgYW5kIGVhc2llciByZWFkaW5nLlwiXG4gICAgbm9fbGVhZF96ZXJvOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiSWYgaW4gQ1NTIHZhbHVlcyBsZWFkaW5nIDBzIGltbWVkaWF0ZWx5IHByZWNlZWRpbmcgXFxcbiAgICAgICAgICAgICAgICBhIGRlY2ltYWwgc2hvdWxkIGJlIHJlbW92ZWQgb3IgcHJldmVudGVkLlwiXG4gICAgY29uZmlnUGF0aDpcbiAgICAgIHRpdGxlOiBcImNvbWIgY3VzdG9tIGNvbmZpZyBmaWxlXCJcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcIlwiXG4gICAgICBkZXNjcmlwdGlvbjogXCJQYXRoIHRvIGN1c3RvbSBDU1Njb21iIGNvbmZpZyBmaWxlLCB1c2VkIGluIGFic2Vuc2Ugb2YgYSBcXFxuICAgICAgICAgICAgICAgIGAuY3NzY29tYi5qc29uYCBvciBgLmNzc2NvbWIuY3NvbmAgYXQgdGhlIHJvb3Qgb2YgeW91ciBwcm9qZWN0LlwiXG4gICAgcHJlZGVmaW5lZENvbmZpZzpcbiAgICAgIHRpdGxlOiBcImNvbWIgcHJlZGVmaW5lZCBjb25maWdcIlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiY3NzY29tYlwiXG4gICAgICBkZXNjcmlwdGlvbjogXCJVc2VkIGlmIG5laXRoZXIgYSBwcm9qZWN0IG9yIGN1c3RvbSBjb25maWcgZmlsZSBleGlzdHMuXCJcbiAgICAgIGVudW06IFtcImNzc2NvbWJcIiwgXCJ5YW5kZXhcIiwgXCJ6ZW5cIl1cbn1cbiJdfQ==
