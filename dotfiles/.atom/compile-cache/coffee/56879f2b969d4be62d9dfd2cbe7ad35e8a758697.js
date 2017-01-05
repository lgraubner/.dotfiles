(function() {
  module.exports = {
    general: {
      title: 'General',
      type: 'object',
      collapsed: true,
      order: -1,
      description: 'General options for Atom Beautify',
      properties: {
        analytics: {
          title: 'Anonymous Analytics',
          type: 'boolean',
          "default": true,
          description: "[Google Analytics](http://www.google.com/analytics/) is used to track what languages are being used the most and causing the most errors, as well as other stats such as performance. Everything is anonymized and no personal information, such as source code, is sent. See https://github.com/Glavin001/atom-beautify/issues/47 for more details."
        },
        _analyticsUserId: {
          title: 'Analytics User Id',
          type: 'string',
          "default": "",
          description: "Unique identifier for this user for tracking usage analytics"
        },
        loggerLevel: {
          title: "Logger Level",
          type: 'string',
          "default": 'warn',
          description: 'Set the level for the logger',
          "enum": ['verbose', 'debug', 'info', 'warn', 'error']
        },
        beautifyEntireFileOnSave: {
          title: "Beautify Entire File On Save",
          type: 'boolean',
          "default": true,
          description: "When beautifying on save, use the entire file, even if there is selected text in the editor. Important: The `beautify on save` option for the specific language must be enabled for this to be applicable. This option is not `beautify on save`."
        },
        muteUnsupportedLanguageErrors: {
          title: "Mute Unsupported Language Errors",
          type: 'boolean',
          "default": false,
          description: "Do not show \"Unsupported Language\" errors when they occur"
        },
        muteAllErrors: {
          title: "Mute All Errors",
          type: 'boolean',
          "default": false,
          description: "Do not show any/all errors when they occur"
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvY29uZmlnLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQ2YsT0FBQSxFQUNFO01BQUEsS0FBQSxFQUFPLFNBQVA7TUFDQSxJQUFBLEVBQU0sUUFETjtNQUVBLFNBQUEsRUFBVyxJQUZYO01BR0EsS0FBQSxFQUFPLENBQUMsQ0FIUjtNQUlBLFdBQUEsRUFBYSxtQ0FKYjtNQUtBLFVBQUEsRUFDRTtRQUFBLFNBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxxQkFBUDtVQUNBLElBQUEsRUFBTyxTQURQO1VBRUEsQ0FBQSxPQUFBLENBQUEsRUFBVSxJQUZWO1VBR0EsV0FBQSxFQUFjLHNWQUhkO1NBREY7UUFVQSxnQkFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLG1CQUFQO1VBQ0EsSUFBQSxFQUFPLFFBRFA7VUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFVLEVBRlY7VUFHQSxXQUFBLEVBQWMsOERBSGQ7U0FYRjtRQWVBLFdBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxjQUFQO1VBQ0EsSUFBQSxFQUFPLFFBRFA7VUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFVLE1BRlY7VUFHQSxXQUFBLEVBQWMsOEJBSGQ7VUFJQSxDQUFBLElBQUEsQ0FBQSxFQUFPLENBQUMsU0FBRCxFQUFZLE9BQVosRUFBcUIsTUFBckIsRUFBNkIsTUFBN0IsRUFBcUMsT0FBckMsQ0FKUDtTQWhCRjtRQXFCQSx3QkFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLDhCQUFQO1VBQ0EsSUFBQSxFQUFPLFNBRFA7VUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFVLElBRlY7VUFHQSxXQUFBLEVBQWMsbVBBSGQ7U0F0QkY7UUEwQkEsNkJBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxrQ0FBUDtVQUNBLElBQUEsRUFBTyxTQURQO1VBRUEsQ0FBQSxPQUFBLENBQUEsRUFBVSxLQUZWO1VBR0EsV0FBQSxFQUFjLDZEQUhkO1NBM0JGO1FBK0JBLGFBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxpQkFBUDtVQUNBLElBQUEsRUFBTyxTQURQO1VBRUEsQ0FBQSxPQUFBLENBQUEsRUFBVSxLQUZWO1VBR0EsV0FBQSxFQUFjLDRDQUhkO1NBaENGO09BTkY7S0FGYTs7QUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2VuZXJhbDpcbiAgICB0aXRsZTogJ0dlbmVyYWwnXG4gICAgdHlwZTogJ29iamVjdCdcbiAgICBjb2xsYXBzZWQ6IHRydWVcbiAgICBvcmRlcjogLTFcbiAgICBkZXNjcmlwdGlvbjogJ0dlbmVyYWwgb3B0aW9ucyBmb3IgQXRvbSBCZWF1dGlmeSdcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgYW5hbHl0aWNzIDpcbiAgICAgICAgdGl0bGU6ICdBbm9ueW1vdXMgQW5hbHl0aWNzJ1xuICAgICAgICB0eXBlIDogJ2Jvb2xlYW4nXG4gICAgICAgIGRlZmF1bHQgOiB0cnVlXG4gICAgICAgIGRlc2NyaXB0aW9uIDogXCJbR29vZ2xlXG4gICAgICAgICAgICAgICAgQW5hbHl0aWNzXShodHRwOi8vd3d3Lmdvb2dsZS5jb20vYW5hbHl0aWNzLykgaXMgdXNlZCB0byB0cmFjayB3aGF0IGxhbmd1YWdlcyBhcmUgYmVpbmdcbiAgICAgICAgICAgICAgICB1c2VkIHRoZSBtb3N0IGFuZCBjYXVzaW5nIHRoZSBtb3N0IGVycm9ycywgYXMgd2VsbCBhcyBvdGhlciBzdGF0cyBzdWNoIGFzIHBlcmZvcm1hbmNlLlxuICAgICAgICAgICAgICAgIEV2ZXJ5dGhpbmcgaXMgYW5vbnltaXplZCBhbmQgbm8gcGVyc29uYWxcbiAgICAgICAgICAgICAgICBpbmZvcm1hdGlvbiwgc3VjaCBhcyBzb3VyY2UgY29kZSwgaXMgc2VudC5cbiAgICAgICAgICAgICAgICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL0dsYXZpbjAwMS9hdG9tLWJlYXV0aWZ5L2lzc3Vlcy80NyBmb3IgbW9yZSBkZXRhaWxzLlwiXG4gICAgICBfYW5hbHl0aWNzVXNlcklkIDpcbiAgICAgICAgdGl0bGU6ICdBbmFseXRpY3MgVXNlciBJZCdcbiAgICAgICAgdHlwZSA6ICdzdHJpbmcnXG4gICAgICAgIGRlZmF1bHQgOiBcIlwiXG4gICAgICAgIGRlc2NyaXB0aW9uIDogXCJVbmlxdWUgaWRlbnRpZmllciBmb3IgdGhpcyB1c2VyIGZvciB0cmFja2luZyB1c2FnZSBhbmFseXRpY3NcIlxuICAgICAgbG9nZ2VyTGV2ZWwgOlxuICAgICAgICB0aXRsZTogXCJMb2dnZXIgTGV2ZWxcIlxuICAgICAgICB0eXBlIDogJ3N0cmluZydcbiAgICAgICAgZGVmYXVsdCA6ICd3YXJuJ1xuICAgICAgICBkZXNjcmlwdGlvbiA6ICdTZXQgdGhlIGxldmVsIGZvciB0aGUgbG9nZ2VyJ1xuICAgICAgICBlbnVtIDogWyd2ZXJib3NlJywgJ2RlYnVnJywgJ2luZm8nLCAnd2FybicsICdlcnJvciddXG4gICAgICBiZWF1dGlmeUVudGlyZUZpbGVPblNhdmUgOlxuICAgICAgICB0aXRsZTogXCJCZWF1dGlmeSBFbnRpcmUgRmlsZSBPbiBTYXZlXCJcbiAgICAgICAgdHlwZSA6ICdib29sZWFuJ1xuICAgICAgICBkZWZhdWx0IDogdHJ1ZVxuICAgICAgICBkZXNjcmlwdGlvbiA6IFwiV2hlbiBiZWF1dGlmeWluZyBvbiBzYXZlLCB1c2UgdGhlIGVudGlyZSBmaWxlLCBldmVuIGlmIHRoZXJlIGlzIHNlbGVjdGVkIHRleHQgaW4gdGhlIGVkaXRvci4gSW1wb3J0YW50OiBUaGUgYGJlYXV0aWZ5IG9uIHNhdmVgIG9wdGlvbiBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIG11c3QgYmUgZW5hYmxlZCBmb3IgdGhpcyB0byBiZSBhcHBsaWNhYmxlLiBUaGlzIG9wdGlvbiBpcyBub3QgYGJlYXV0aWZ5IG9uIHNhdmVgLlwiXG4gICAgICBtdXRlVW5zdXBwb3J0ZWRMYW5ndWFnZUVycm9ycyA6XG4gICAgICAgIHRpdGxlOiBcIk11dGUgVW5zdXBwb3J0ZWQgTGFuZ3VhZ2UgRXJyb3JzXCJcbiAgICAgICAgdHlwZSA6ICdib29sZWFuJ1xuICAgICAgICBkZWZhdWx0IDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb24gOiBcIkRvIG5vdCBzaG93IFxcXCJVbnN1cHBvcnRlZCBMYW5ndWFnZVxcXCIgZXJyb3JzIHdoZW4gdGhleSBvY2N1clwiXG4gICAgICBtdXRlQWxsRXJyb3JzIDpcbiAgICAgICAgdGl0bGU6IFwiTXV0ZSBBbGwgRXJyb3JzXCJcbiAgICAgICAgdHlwZSA6ICdib29sZWFuJ1xuICAgICAgICBkZWZhdWx0IDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb24gOiBcIkRvIG5vdCBzaG93IGFueS9hbGwgZXJyb3JzIHdoZW4gdGhleSBvY2N1clwiXG4gICAgfVxuIl19
