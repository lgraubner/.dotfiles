'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  complete_strings: {
    doc: 'When enabled, this plugin will gather (short) strings in your code, and completing when inside a string will try to complete to previously seen strings. Takes a single option, maxLength, which controls the maximum length of string values to gather, and defaults to 15.',
    definition: {
      maxLength: {
        doc: '',
        type: 'number'
      }
    }
  },
  doc_comment: {
    doc: 'This plugin, which is enabled by default in the bin/tern server, parses comments before function declarations, variable declarations, and object properties. It will look for JSDoc-style type declarations, and try to parse them and add them to the inferred types, and it will treat the first sentence of comment text as the docstring for the defined variable or property.',
    definition: {
      fullDocs: {
        doc: 'Can be set to true to return the full comment text instead of the first sentence.',
        type: 'boolean'
      },
      strong: {
        doc: 'When enabled, types specified in comments take precedence over inferred types.',
        type: 'boolean'
      }
    }
  },
  node: {
    doc: 'The node.js plugin, called \"node\", provides variables that are part of the node environment, such as process and __dirname, and loads the commonjs and node_resolve plugins to allow node-style module loading. It defines types for the built-in modules that node.js provides (\"fs\", \"http\", etc).',
    definition: {
      dontLoad: {
        doc: 'Can be set to true to disable dynamic loading of required modules entirely, or to a regular expression to disable loading of files that match the expression.',
        type: 'string'
      },
      load: {
        doc: 'If dontLoad isn’t given, this setting is checked. If it is a regular expression, the plugin will only load files that match the expression.',
        type: 'string'
      },
      modules: {
        doc: 'Can be used to assign JSON type definitions to certain modules, so that those are loaded instead of the source code itself. If given, should be an object mapping module names to either JSON objects defining the types in the module, or a string referring to a file name (relative to the project directory) that contains the JSON data.',
        type: 'string'
      }
    }
  },
  node_resolve: {
    doc: 'This plugin defines the node.js module resolution strategy—things like defaulting to index.js when requiring a directory and searching node_modules directories. It depends on the modules plugin. Note that this plugin only does something meaningful when the Tern server is running on node.js itself.',
    definition: {}
  },
  modules: {
    doc: 'This is a supporting plugin to act as a dependency for other module-loading and module-resolving plugins.',
    definition: {
      dontLoad: {
        doc: 'Can be set to true to disable dynamic loading of required modules entirely, or to a regular expression to disable loading of files that match the expression.',
        type: 'string'
      },
      load: {
        doc: 'If dontLoad isn’t given, this setting is checked. If it is a regular expression, the plugin will only load files that match the expression.',
        type: 'string'
      },
      modules: {
        doc: 'Can be used to assign JSON type definitions to certain modules, so that those are loaded instead of the source code itself. If given, should be an object mapping module names to either JSON objects defining the types in the module, or a string referring to a file name (relative to the project directory) that contains the JSON data.',
        type: 'string'
      }
    }
  },
  es_modules: {
    doc: 'This plugin (es_modules) builds on top of the modules plugin to support ECMAScript 6’s import and export based module inclusion.',
    definition: {}
  },
  angular: {
    doc: 'Adds the angular object to the top-level environment, and tries to wire up some of the bizarre dependency management scheme from this library, so that dependency injections get the right types. Enabled with the name \"angular\".',
    definition: {}
  },
  requirejs: {
    doc: 'This plugin (\"requirejs\") teaches the server to understand RequireJS-style dependency management. It defines the global functions define and requirejs, and will do its best to resolve dependencies and give them their proper types.',
    defintions: {
      baseURL: {
        doc: 'The base path to prefix to dependency filenames.',
        type: 'string'
      },
      paths: {
        doc: 'An object mapping filename prefixes to specific paths. For example {\"acorn\": \"lib/acorn/\"}.',
        type: 'string'
      },
      override: {
        doc: 'An object that can be used to override some dependency names to refer to predetermined types. The value associated with a name can be a string starting with the character =, in which case the part after the = will be interpreted as a global variable (or dot-separated path) that contains the proper type. If it is a string not starting with =, it is interpreted as the path to the file that contains the code for the module. If it is an object, it is interpreted as JSON type definition.',
        type: 'string'
      }
    }
  },
  commonjs: {
    doc: 'This plugin implements CommonJS-style (require(\"foo\")) modules. It will wrap files in a file-local scope, and bind require, module, and exports in this scope. Does not implement a module resolution strategy (see for example the node_resolve plugin). Depends on the modules plugin.',
    definition: {}
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2NvbmZpZy90ZXJuLXBsdWdpbnMtZGVmaW50aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7O3FCQUVHO0FBQ2Isa0JBQWdCLEVBQUU7QUFDaEIsT0FBRyxFQUFFLDhRQUE4UTtBQUNuUixjQUFVLEVBQUU7QUFDVixlQUFTLEVBQUU7QUFDVCxXQUFHLEVBQUUsRUFBRTtBQUNQLFlBQUksRUFBRSxRQUFRO09BQ2Y7S0FDRjtHQUNGO0FBQ0QsYUFBVyxFQUFFO0FBQ1gsT0FBRyxFQUFFLG9YQUFvWDtBQUN6WCxjQUFVLEVBQUU7QUFDVixjQUFRLEVBQUU7QUFDUixXQUFHLEVBQUUsbUZBQW1GO0FBQ3hGLFlBQUksRUFBRSxTQUFTO09BQ2hCO0FBQ0QsWUFBTSxFQUFFO0FBQ04sV0FBRyxFQUFFLGdGQUFnRjtBQUNyRixZQUFJLEVBQUUsU0FBUztPQUNoQjtLQUNGO0dBQ0Y7QUFDRCxNQUFJLEVBQUU7QUFDSixPQUFHLEVBQUUsNFNBQTRTO0FBQ2pULGNBQVUsRUFBRTtBQUNWLGNBQVEsRUFBRTtBQUNSLFdBQUcsRUFBRSwrSkFBK0o7QUFDcEssWUFBSSxFQUFFLFFBQVE7T0FDZjtBQUNELFVBQUksRUFBRTtBQUNKLFdBQUcsRUFBRSw2SUFBNkk7QUFDbEosWUFBSSxFQUFFLFFBQVE7T0FDZjtBQUNELGFBQU8sRUFBRTtBQUNQLFdBQUcsRUFBRSwrVUFBK1U7QUFDcFYsWUFBSSxFQUFFLFFBQVE7T0FDZjtLQUNGO0dBQ0Y7QUFDRCxjQUFZLEVBQUU7QUFDWixPQUFHLEVBQUUsNFNBQTRTO0FBQ2pULGNBQVUsRUFBRSxFQUFFO0dBQ2Y7QUFDRCxTQUFPLEVBQUU7QUFDUCxPQUFHLEVBQUUsMkdBQTJHO0FBQ2hILGNBQVUsRUFBRTtBQUNWLGNBQVEsRUFBRTtBQUNSLFdBQUcsRUFBRSwrSkFBK0o7QUFDcEssWUFBSSxFQUFFLFFBQVE7T0FDZjtBQUNELFVBQUksRUFBRTtBQUNKLFdBQUcsRUFBRSw2SUFBNkk7QUFDbEosWUFBSSxFQUFFLFFBQVE7T0FDZjtBQUNELGFBQU8sRUFBRTtBQUNQLFdBQUcsRUFBRSwrVUFBK1U7QUFDcFYsWUFBSSxFQUFFLFFBQVE7T0FDZjtLQUNGO0dBQ0Y7QUFDRCxZQUFVLEVBQUU7QUFDVixPQUFHLEVBQUUsa0lBQWtJO0FBQ3ZJLGNBQVUsRUFBRSxFQUFFO0dBQ2Y7QUFDRCxTQUFPLEVBQUU7QUFDUCxPQUFHLEVBQUUsc09BQXNPO0FBQzNPLGNBQVUsRUFBRSxFQUFFO0dBQ2Y7QUFDRCxXQUFTLEVBQUU7QUFDVCxPQUFHLEVBQUUsME9BQTBPO0FBQy9PLGNBQVUsRUFBRTtBQUNWLGFBQU8sRUFBRTtBQUNQLFdBQUcsRUFBRSxrREFBa0Q7QUFDdkQsWUFBSSxFQUFFLFFBQVE7T0FDZjtBQUNELFdBQUssRUFBRTtBQUNMLFdBQUcsRUFBRSxpR0FBaUc7QUFDdEcsWUFBSSxFQUFFLFFBQVE7T0FDZjtBQUNELGNBQVEsRUFBRTtBQUNSLFdBQUcsRUFBRSx5ZUFBeWU7QUFDOWUsWUFBSSxFQUFFLFFBQVE7T0FDZjtLQUNGO0dBQ0Y7QUFDRCxVQUFRLEVBQUU7QUFDUixPQUFHLEVBQUUsNFJBQTRSO0FBQ2pTLGNBQVUsRUFBRSxFQUFFO0dBQ2Y7Q0FDRiIsImZpbGUiOiIvVXNlcnMvbGFyc2dyYXVibmVyLy5kb3RmaWxlcy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9jb25maWcvdGVybi1wbHVnaW5zLWRlZmludGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb21wbGV0ZV9zdHJpbmdzOiB7XG4gICAgZG9jOiAnV2hlbiBlbmFibGVkLCB0aGlzIHBsdWdpbiB3aWxsIGdhdGhlciAoc2hvcnQpIHN0cmluZ3MgaW4geW91ciBjb2RlLCBhbmQgY29tcGxldGluZyB3aGVuIGluc2lkZSBhIHN0cmluZyB3aWxsIHRyeSB0byBjb21wbGV0ZSB0byBwcmV2aW91c2x5IHNlZW4gc3RyaW5ncy4gVGFrZXMgYSBzaW5nbGUgb3B0aW9uLCBtYXhMZW5ndGgsIHdoaWNoIGNvbnRyb2xzIHRoZSBtYXhpbXVtIGxlbmd0aCBvZiBzdHJpbmcgdmFsdWVzIHRvIGdhdGhlciwgYW5kIGRlZmF1bHRzIHRvIDE1LicsXG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgbWF4TGVuZ3RoOiB7XG4gICAgICAgIGRvYzogJycsXG4gICAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBkb2NfY29tbWVudDoge1xuICAgIGRvYzogJ1RoaXMgcGx1Z2luLCB3aGljaCBpcyBlbmFibGVkIGJ5IGRlZmF1bHQgaW4gdGhlIGJpbi90ZXJuIHNlcnZlciwgcGFyc2VzIGNvbW1lbnRzIGJlZm9yZSBmdW5jdGlvbiBkZWNsYXJhdGlvbnMsIHZhcmlhYmxlIGRlY2xhcmF0aW9ucywgYW5kIG9iamVjdCBwcm9wZXJ0aWVzLiBJdCB3aWxsIGxvb2sgZm9yIEpTRG9jLXN0eWxlIHR5cGUgZGVjbGFyYXRpb25zLCBhbmQgdHJ5IHRvIHBhcnNlIHRoZW0gYW5kIGFkZCB0aGVtIHRvIHRoZSBpbmZlcnJlZCB0eXBlcywgYW5kIGl0IHdpbGwgdHJlYXQgdGhlIGZpcnN0IHNlbnRlbmNlIG9mIGNvbW1lbnQgdGV4dCBhcyB0aGUgZG9jc3RyaW5nIGZvciB0aGUgZGVmaW5lZCB2YXJpYWJsZSBvciBwcm9wZXJ0eS4nLFxuICAgIGRlZmluaXRpb246IHtcbiAgICAgIGZ1bGxEb2NzOiB7XG4gICAgICAgIGRvYzogJ0NhbiBiZSBzZXQgdG8gdHJ1ZSB0byByZXR1cm4gdGhlIGZ1bGwgY29tbWVudCB0ZXh0IGluc3RlYWQgb2YgdGhlIGZpcnN0IHNlbnRlbmNlLicsXG4gICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgfSxcbiAgICAgIHN0cm9uZzoge1xuICAgICAgICBkb2M6ICdXaGVuIGVuYWJsZWQsIHR5cGVzIHNwZWNpZmllZCBpbiBjb21tZW50cyB0YWtlIHByZWNlZGVuY2Ugb3ZlciBpbmZlcnJlZCB0eXBlcy4nLFxuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG5vZGU6IHtcbiAgICBkb2M6ICdUaGUgbm9kZS5qcyBwbHVnaW4sIGNhbGxlZCBcXFwibm9kZVxcXCIsIHByb3ZpZGVzIHZhcmlhYmxlcyB0aGF0IGFyZSBwYXJ0IG9mIHRoZSBub2RlIGVudmlyb25tZW50LCBzdWNoIGFzIHByb2Nlc3MgYW5kIF9fZGlybmFtZSwgYW5kIGxvYWRzIHRoZSBjb21tb25qcyBhbmQgbm9kZV9yZXNvbHZlIHBsdWdpbnMgdG8gYWxsb3cgbm9kZS1zdHlsZSBtb2R1bGUgbG9hZGluZy4gSXQgZGVmaW5lcyB0eXBlcyBmb3IgdGhlIGJ1aWx0LWluIG1vZHVsZXMgdGhhdCBub2RlLmpzIHByb3ZpZGVzIChcXFwiZnNcXFwiLCBcXFwiaHR0cFxcXCIsIGV0YykuJyxcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICBkb250TG9hZDoge1xuICAgICAgICBkb2M6ICdDYW4gYmUgc2V0IHRvIHRydWUgdG8gZGlzYWJsZSBkeW5hbWljIGxvYWRpbmcgb2YgcmVxdWlyZWQgbW9kdWxlcyBlbnRpcmVseSwgb3IgdG8gYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gZGlzYWJsZSBsb2FkaW5nIG9mIGZpbGVzIHRoYXQgbWF0Y2ggdGhlIGV4cHJlc3Npb24uJyxcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICBsb2FkOiB7XG4gICAgICAgIGRvYzogJ0lmIGRvbnRMb2FkIGlzbuKAmXQgZ2l2ZW4sIHRoaXMgc2V0dGluZyBpcyBjaGVja2VkLiBJZiBpdCBpcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiwgdGhlIHBsdWdpbiB3aWxsIG9ubHkgbG9hZCBmaWxlcyB0aGF0IG1hdGNoIHRoZSBleHByZXNzaW9uLicsXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgbW9kdWxlczoge1xuICAgICAgICBkb2M6ICdDYW4gYmUgdXNlZCB0byBhc3NpZ24gSlNPTiB0eXBlIGRlZmluaXRpb25zIHRvIGNlcnRhaW4gbW9kdWxlcywgc28gdGhhdCB0aG9zZSBhcmUgbG9hZGVkIGluc3RlYWQgb2YgdGhlIHNvdXJjZSBjb2RlIGl0c2VsZi4gSWYgZ2l2ZW4sIHNob3VsZCBiZSBhbiBvYmplY3QgbWFwcGluZyBtb2R1bGUgbmFtZXMgdG8gZWl0aGVyIEpTT04gb2JqZWN0cyBkZWZpbmluZyB0aGUgdHlwZXMgaW4gdGhlIG1vZHVsZSwgb3IgYSBzdHJpbmcgcmVmZXJyaW5nIHRvIGEgZmlsZSBuYW1lIChyZWxhdGl2ZSB0byB0aGUgcHJvamVjdCBkaXJlY3RvcnkpIHRoYXQgY29udGFpbnMgdGhlIEpTT04gZGF0YS4nLFxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgbm9kZV9yZXNvbHZlOiB7XG4gICAgZG9jOiAnVGhpcyBwbHVnaW4gZGVmaW5lcyB0aGUgbm9kZS5qcyBtb2R1bGUgcmVzb2x1dGlvbiBzdHJhdGVneeKAlHRoaW5ncyBsaWtlIGRlZmF1bHRpbmcgdG8gaW5kZXguanMgd2hlbiByZXF1aXJpbmcgYSBkaXJlY3RvcnkgYW5kIHNlYXJjaGluZyBub2RlX21vZHVsZXMgZGlyZWN0b3JpZXMuIEl0IGRlcGVuZHMgb24gdGhlIG1vZHVsZXMgcGx1Z2luLiBOb3RlIHRoYXQgdGhpcyBwbHVnaW4gb25seSBkb2VzIHNvbWV0aGluZyBtZWFuaW5nZnVsIHdoZW4gdGhlIFRlcm4gc2VydmVyIGlzIHJ1bm5pbmcgb24gbm9kZS5qcyBpdHNlbGYuJyxcbiAgICBkZWZpbml0aW9uOiB7fVxuICB9LFxuICBtb2R1bGVzOiB7XG4gICAgZG9jOiAnVGhpcyBpcyBhIHN1cHBvcnRpbmcgcGx1Z2luIHRvIGFjdCBhcyBhIGRlcGVuZGVuY3kgZm9yIG90aGVyIG1vZHVsZS1sb2FkaW5nIGFuZCBtb2R1bGUtcmVzb2x2aW5nIHBsdWdpbnMuJyxcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICBkb250TG9hZDoge1xuICAgICAgICBkb2M6ICdDYW4gYmUgc2V0IHRvIHRydWUgdG8gZGlzYWJsZSBkeW5hbWljIGxvYWRpbmcgb2YgcmVxdWlyZWQgbW9kdWxlcyBlbnRpcmVseSwgb3IgdG8gYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gZGlzYWJsZSBsb2FkaW5nIG9mIGZpbGVzIHRoYXQgbWF0Y2ggdGhlIGV4cHJlc3Npb24uJyxcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICBsb2FkOiB7XG4gICAgICAgIGRvYzogJ0lmIGRvbnRMb2FkIGlzbuKAmXQgZ2l2ZW4sIHRoaXMgc2V0dGluZyBpcyBjaGVja2VkLiBJZiBpdCBpcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiwgdGhlIHBsdWdpbiB3aWxsIG9ubHkgbG9hZCBmaWxlcyB0aGF0IG1hdGNoIHRoZSBleHByZXNzaW9uLicsXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgbW9kdWxlczoge1xuICAgICAgICBkb2M6ICdDYW4gYmUgdXNlZCB0byBhc3NpZ24gSlNPTiB0eXBlIGRlZmluaXRpb25zIHRvIGNlcnRhaW4gbW9kdWxlcywgc28gdGhhdCB0aG9zZSBhcmUgbG9hZGVkIGluc3RlYWQgb2YgdGhlIHNvdXJjZSBjb2RlIGl0c2VsZi4gSWYgZ2l2ZW4sIHNob3VsZCBiZSBhbiBvYmplY3QgbWFwcGluZyBtb2R1bGUgbmFtZXMgdG8gZWl0aGVyIEpTT04gb2JqZWN0cyBkZWZpbmluZyB0aGUgdHlwZXMgaW4gdGhlIG1vZHVsZSwgb3IgYSBzdHJpbmcgcmVmZXJyaW5nIHRvIGEgZmlsZSBuYW1lIChyZWxhdGl2ZSB0byB0aGUgcHJvamVjdCBkaXJlY3RvcnkpIHRoYXQgY29udGFpbnMgdGhlIEpTT04gZGF0YS4nLFxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgZXNfbW9kdWxlczoge1xuICAgIGRvYzogJ1RoaXMgcGx1Z2luIChlc19tb2R1bGVzKSBidWlsZHMgb24gdG9wIG9mIHRoZSBtb2R1bGVzIHBsdWdpbiB0byBzdXBwb3J0IEVDTUFTY3JpcHQgNuKAmXMgaW1wb3J0IGFuZCBleHBvcnQgYmFzZWQgbW9kdWxlIGluY2x1c2lvbi4nLFxuICAgIGRlZmluaXRpb246IHt9XG4gIH0sXG4gIGFuZ3VsYXI6IHtcbiAgICBkb2M6ICdBZGRzIHRoZSBhbmd1bGFyIG9iamVjdCB0byB0aGUgdG9wLWxldmVsIGVudmlyb25tZW50LCBhbmQgdHJpZXMgdG8gd2lyZSB1cCBzb21lIG9mIHRoZSBiaXphcnJlIGRlcGVuZGVuY3kgbWFuYWdlbWVudCBzY2hlbWUgZnJvbSB0aGlzIGxpYnJhcnksIHNvIHRoYXQgZGVwZW5kZW5jeSBpbmplY3Rpb25zIGdldCB0aGUgcmlnaHQgdHlwZXMuIEVuYWJsZWQgd2l0aCB0aGUgbmFtZSBcXFwiYW5ndWxhclxcXCIuJyxcbiAgICBkZWZpbml0aW9uOiB7fVxuICB9LFxuICByZXF1aXJlanM6IHtcbiAgICBkb2M6ICdUaGlzIHBsdWdpbiAoXFxcInJlcXVpcmVqc1xcXCIpIHRlYWNoZXMgdGhlIHNlcnZlciB0byB1bmRlcnN0YW5kIFJlcXVpcmVKUy1zdHlsZSBkZXBlbmRlbmN5IG1hbmFnZW1lbnQuIEl0IGRlZmluZXMgdGhlIGdsb2JhbCBmdW5jdGlvbnMgZGVmaW5lIGFuZCByZXF1aXJlanMsIGFuZCB3aWxsIGRvIGl0cyBiZXN0IHRvIHJlc29sdmUgZGVwZW5kZW5jaWVzIGFuZCBnaXZlIHRoZW0gdGhlaXIgcHJvcGVyIHR5cGVzLicsXG4gICAgZGVmaW50aW9uczoge1xuICAgICAgYmFzZVVSTDoge1xuICAgICAgICBkb2M6ICdUaGUgYmFzZSBwYXRoIHRvIHByZWZpeCB0byBkZXBlbmRlbmN5IGZpbGVuYW1lcy4nLFxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIHBhdGhzOiB7XG4gICAgICAgIGRvYzogJ0FuIG9iamVjdCBtYXBwaW5nIGZpbGVuYW1lIHByZWZpeGVzIHRvIHNwZWNpZmljIHBhdGhzLiBGb3IgZXhhbXBsZSB7XFxcImFjb3JuXFxcIjogXFxcImxpYi9hY29ybi9cXFwifS4nLFxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIG92ZXJyaWRlOiB7XG4gICAgICAgIGRvYzogJ0FuIG9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIG92ZXJyaWRlIHNvbWUgZGVwZW5kZW5jeSBuYW1lcyB0byByZWZlciB0byBwcmVkZXRlcm1pbmVkIHR5cGVzLiBUaGUgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIGEgbmFtZSBjYW4gYmUgYSBzdHJpbmcgc3RhcnRpbmcgd2l0aCB0aGUgY2hhcmFjdGVyID0sIGluIHdoaWNoIGNhc2UgdGhlIHBhcnQgYWZ0ZXIgdGhlID0gd2lsbCBiZSBpbnRlcnByZXRlZCBhcyBhIGdsb2JhbCB2YXJpYWJsZSAob3IgZG90LXNlcGFyYXRlZCBwYXRoKSB0aGF0IGNvbnRhaW5zIHRoZSBwcm9wZXIgdHlwZS4gSWYgaXQgaXMgYSBzdHJpbmcgbm90IHN0YXJ0aW5nIHdpdGggPSwgaXQgaXMgaW50ZXJwcmV0ZWQgYXMgdGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCBjb250YWlucyB0aGUgY29kZSBmb3IgdGhlIG1vZHVsZS4gSWYgaXQgaXMgYW4gb2JqZWN0LCBpdCBpcyBpbnRlcnByZXRlZCBhcyBKU09OIHR5cGUgZGVmaW5pdGlvbi4nLFxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgY29tbW9uanM6IHtcbiAgICBkb2M6ICdUaGlzIHBsdWdpbiBpbXBsZW1lbnRzIENvbW1vbkpTLXN0eWxlIChyZXF1aXJlKFxcXCJmb29cXFwiKSkgbW9kdWxlcy4gSXQgd2lsbCB3cmFwIGZpbGVzIGluIGEgZmlsZS1sb2NhbCBzY29wZSwgYW5kIGJpbmQgcmVxdWlyZSwgbW9kdWxlLCBhbmQgZXhwb3J0cyBpbiB0aGlzIHNjb3BlLiBEb2VzIG5vdCBpbXBsZW1lbnQgYSBtb2R1bGUgcmVzb2x1dGlvbiBzdHJhdGVneSAoc2VlIGZvciBleGFtcGxlIHRoZSBub2RlX3Jlc29sdmUgcGx1Z2luKS4gRGVwZW5kcyBvbiB0aGUgbW9kdWxlcyBwbHVnaW4uJyxcbiAgICBkZWZpbml0aW9uOiB7fVxuICB9XG59O1xuIl19