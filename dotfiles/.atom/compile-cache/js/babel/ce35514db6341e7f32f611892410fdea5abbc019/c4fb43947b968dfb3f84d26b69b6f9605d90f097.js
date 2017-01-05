'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  ecmaVersion: {
    doc: 'The ECMAScript version to parse. Should be either 5, 6 or 7. Default is 6.'
  },
  libs: {
    browser: {
      doc: 'JavaScript'
    },
    jquery: {
      doc: 'JQuery'
    },
    underscore: {
      doc: 'underscore'
    },
    chai: {
      doc: 'chai'
    }
  },
  loadEagerly: {
    doc: 'loadEagerly allows you to force some files to always be loaded, it may be an array of filenames or glob patterns (i.e. foo/bar/*.js).'
  },
  dontLoad: {
    doc: 'The dontLoad option can be used to prevent Tern from loading certain files. It also takes an array of file names or glob patterns.'
  },
  plugins: {
    doc: 'Plugins used by this project. Currenty you can only activate the plugin from this view without setting up the options for it. After saving the config, plugins with default options are added to the .tern-project file. Unchecking the plugin will result in removing the plugin property entirely from the .tern-project file. Please refer to <a href=\"http://ternjs.net/doc/manual.html#plugins\">this page</a> for detailed information for the build in server plugins.'
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2NvbmZpZy90ZXJuLWNvbmZpZy1kb2NzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7cUJBRUc7QUFDYixhQUFXLEVBQUU7QUFDWCxPQUFHLEVBQUUsNEVBQTRFO0dBQ2xGO0FBQ0QsTUFBSSxFQUFFO0FBQ0osV0FBTyxFQUFFO0FBQ1AsU0FBRyxFQUFFLFlBQVk7S0FDbEI7QUFDRCxVQUFNLEVBQUU7QUFDTixTQUFHLEVBQUUsUUFBUTtLQUNkO0FBQ0QsY0FBVSxFQUFFO0FBQ1YsU0FBRyxFQUFFLFlBQVk7S0FDbEI7QUFDRCxRQUFJLEVBQUU7QUFDSixTQUFHLEVBQUUsTUFBTTtLQUNaO0dBQ0Y7QUFDRCxhQUFXLEVBQUU7QUFDWCxPQUFHLEVBQUUsdUlBQXVJO0dBQzdJO0FBQ0QsVUFBUSxFQUFFO0FBQ1IsT0FBRyxFQUFFLG9JQUFvSTtHQUMxSTtBQUNELFNBQU8sRUFBRTtBQUNQLE9BQUcsRUFBRSxnZEFBZ2Q7R0FDdGQ7Q0FDRiIsImZpbGUiOiIvVXNlcnMvbGFyc2dyYXVibmVyLy5kb3RmaWxlcy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9jb25maWcvdGVybi1jb25maWctZG9jcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGVjbWFWZXJzaW9uOiB7XG4gICAgZG9jOiAnVGhlIEVDTUFTY3JpcHQgdmVyc2lvbiB0byBwYXJzZS4gU2hvdWxkIGJlIGVpdGhlciA1LCA2IG9yIDcuIERlZmF1bHQgaXMgNi4nXG4gIH0sXG4gIGxpYnM6IHtcbiAgICBicm93c2VyOiB7XG4gICAgICBkb2M6ICdKYXZhU2NyaXB0J1xuICAgIH0sXG4gICAganF1ZXJ5OiB7XG4gICAgICBkb2M6ICdKUXVlcnknXG4gICAgfSxcbiAgICB1bmRlcnNjb3JlOiB7XG4gICAgICBkb2M6ICd1bmRlcnNjb3JlJ1xuICAgIH0sXG4gICAgY2hhaToge1xuICAgICAgZG9jOiAnY2hhaSdcbiAgICB9XG4gIH0sXG4gIGxvYWRFYWdlcmx5OiB7XG4gICAgZG9jOiAnbG9hZEVhZ2VybHkgYWxsb3dzIHlvdSB0byBmb3JjZSBzb21lIGZpbGVzIHRvIGFsd2F5cyBiZSBsb2FkZWQsIGl0IG1heSBiZSBhbiBhcnJheSBvZiBmaWxlbmFtZXMgb3IgZ2xvYiBwYXR0ZXJucyAoaS5lLiBmb28vYmFyLyouanMpLidcbiAgfSxcbiAgZG9udExvYWQ6IHtcbiAgICBkb2M6ICdUaGUgZG9udExvYWQgb3B0aW9uIGNhbiBiZSB1c2VkIHRvIHByZXZlbnQgVGVybiBmcm9tIGxvYWRpbmcgY2VydGFpbiBmaWxlcy4gSXQgYWxzbyB0YWtlcyBhbiBhcnJheSBvZiBmaWxlIG5hbWVzIG9yIGdsb2IgcGF0dGVybnMuJ1xuICB9LFxuICBwbHVnaW5zOiB7XG4gICAgZG9jOiAnUGx1Z2lucyB1c2VkIGJ5IHRoaXMgcHJvamVjdC4gQ3VycmVudHkgeW91IGNhbiBvbmx5IGFjdGl2YXRlIHRoZSBwbHVnaW4gZnJvbSB0aGlzIHZpZXcgd2l0aG91dCBzZXR0aW5nIHVwIHRoZSBvcHRpb25zIGZvciBpdC4gQWZ0ZXIgc2F2aW5nIHRoZSBjb25maWcsIHBsdWdpbnMgd2l0aCBkZWZhdWx0IG9wdGlvbnMgYXJlIGFkZGVkIHRvIHRoZSAudGVybi1wcm9qZWN0IGZpbGUuIFVuY2hlY2tpbmcgdGhlIHBsdWdpbiB3aWxsIHJlc3VsdCBpbiByZW1vdmluZyB0aGUgcGx1Z2luIHByb3BlcnR5IGVudGlyZWx5IGZyb20gdGhlIC50ZXJuLXByb2plY3QgZmlsZS4gUGxlYXNlIHJlZmVyIHRvIDxhIGhyZWY9XFxcImh0dHA6Ly90ZXJuanMubmV0L2RvYy9tYW51YWwuaHRtbCNwbHVnaW5zXFxcIj50aGlzIHBhZ2U8L2E+IGZvciBkZXRhaWxlZCBpbmZvcm1hdGlvbiBmb3IgdGhlIGJ1aWxkIGluIHNlcnZlciBwbHVnaW5zLidcbiAgfVxufTtcbiJdfQ==