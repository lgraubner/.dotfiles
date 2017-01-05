'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CompletionProvider = require('./completion-provider');

var AutocompleteModulesPlugin = (function () {
  function AutocompleteModulesPlugin() {
    _classCallCheck(this, AutocompleteModulesPlugin);

    this.config = {
      includeExtension: {
        order: 1,
        title: 'Include file extension',
        description: "Include the file's extension when filling in the completion.",
        type: 'boolean',
        'default': false
      },
      vendors: {
        order: 2,
        title: 'Vendor directories',
        description: 'A list of directories to search for modules relative to the project root.',
        type: 'array',
        'default': ['node_modules'],
        items: {
          type: 'string'
        }
      },
      webpack: {
        order: 3,
        title: 'Webpack support',
        description: 'Attempts to use the given webpack configuration file resolution settings to search for modules.',
        type: 'boolean',
        'default': false
      },
      webpackConfigFilename: {
        order: 4,
        title: 'Webpack configuration filename',
        description: 'When "Webpack support" is enabled this is the config file used to supply module search paths.',
        type: 'string',
        'default': 'webpack.config.js'
      },
      babelPluginModuleResolver: {
        order: 5,
        title: 'Babel Plugin Module Resolver support',
        description: 'Use the <a href="https://github.com/tleunen/babel-plugin-module-resolver">Babel Plugin Module Resolver</a> configuration located in your `.babelrc` or in the babel configuration in `package.json`.',
        type: 'boolean',
        'default': false
      }
    };
  }

  _createClass(AutocompleteModulesPlugin, [{
    key: 'activate',
    value: function activate() {
      this.completionProvider = new CompletionProvider();
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      delete this.completionProvider;
      this.completionProvider = null;
    }
  }, {
    key: 'getCompletionProvider',
    value: function getCompletionProvider() {
      return this.completionProvider;
    }
  }]);

  return AutocompleteModulesPlugin;
})();

module.exports = new AutocompleteModulesPlugin();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1tb2R1bGVzL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7O0FBRVosSUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7SUFFdEQseUJBQXlCO0FBQ2xCLFdBRFAseUJBQXlCLEdBQ2Y7MEJBRFYseUJBQXlCOztBQUUzQixRQUFJLENBQUMsTUFBTSxHQUFHO0FBQ1osc0JBQWdCLEVBQUU7QUFDaEIsYUFBSyxFQUFFLENBQUM7QUFDUixhQUFLLEVBQUUsd0JBQXdCO0FBQy9CLG1CQUFXLEVBQUUsOERBQThEO0FBQzNFLFlBQUksRUFBRSxTQUFTO0FBQ2YsbUJBQVMsS0FBSztPQUNmO0FBQ0QsYUFBTyxFQUFFO0FBQ1AsYUFBSyxFQUFFLENBQUM7QUFDUixhQUFLLEVBQUUsb0JBQW9CO0FBQzNCLG1CQUFXLEVBQUUsMkVBQTJFO0FBQ3hGLFlBQUksRUFBRSxPQUFPO0FBQ2IsbUJBQVMsQ0FBQyxjQUFjLENBQUM7QUFDekIsYUFBSyxFQUFFO0FBQ0wsY0FBSSxFQUFFLFFBQVE7U0FDZjtPQUNGO0FBQ0QsYUFBTyxFQUFFO0FBQ1AsYUFBSyxFQUFFLENBQUM7QUFDUixhQUFLLEVBQUUsaUJBQWlCO0FBQ3hCLG1CQUFXLEVBQUUsaUdBQWlHO0FBQzlHLFlBQUksRUFBRSxTQUFTO0FBQ2YsbUJBQVMsS0FBSztPQUNmO0FBQ0QsMkJBQXFCLEVBQUU7QUFDckIsYUFBSyxFQUFFLENBQUM7QUFDUixhQUFLLEVBQUUsZ0NBQWdDO0FBQ3ZDLG1CQUFXLEVBQUUsK0ZBQStGO0FBQzVHLFlBQUksRUFBRSxRQUFRO0FBQ2QsbUJBQVMsbUJBQW1CO09BQzdCO0FBQ0QsK0JBQXlCLEVBQUU7QUFDekIsYUFBSyxFQUFFLENBQUM7QUFDUixhQUFLLEVBQUUsc0NBQXNDO0FBQzdDLG1CQUFXLEVBQUUsc01BQXNNO0FBQ25OLFlBQUksRUFBRSxTQUFTO0FBQ2YsbUJBQVMsS0FBSztPQUNmO0tBQ0YsQ0FBQztHQUNIOztlQTFDRyx5QkFBeUI7O1dBNENyQixvQkFBRztBQUNULFVBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7S0FDcEQ7OztXQUVTLHNCQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsa0JBQWtCLENBQUM7QUFDL0IsVUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztLQUNoQzs7O1dBRW9CLGlDQUFHO0FBQ3RCLGFBQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO0tBQ2hDOzs7U0F2REcseUJBQXlCOzs7QUEwRC9CLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSx5QkFBeUIsRUFBRSxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1tb2R1bGVzL3NyYy9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmNvbnN0IENvbXBsZXRpb25Qcm92aWRlciA9IHJlcXVpcmUoJy4vY29tcGxldGlvbi1wcm92aWRlcicpO1xuXG5jbGFzcyBBdXRvY29tcGxldGVNb2R1bGVzUGx1Z2luIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICBpbmNsdWRlRXh0ZW5zaW9uOiB7XG4gICAgICAgIG9yZGVyOiAxLFxuICAgICAgICB0aXRsZTogJ0luY2x1ZGUgZmlsZSBleHRlbnNpb24nLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJJbmNsdWRlIHRoZSBmaWxlJ3MgZXh0ZW5zaW9uIHdoZW4gZmlsbGluZyBpbiB0aGUgY29tcGxldGlvbi5cIixcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgfSxcbiAgICAgIHZlbmRvcnM6IHtcbiAgICAgICAgb3JkZXI6IDIsXG4gICAgICAgIHRpdGxlOiAnVmVuZG9yIGRpcmVjdG9yaWVzJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdBIGxpc3Qgb2YgZGlyZWN0b3JpZXMgdG8gc2VhcmNoIGZvciBtb2R1bGVzIHJlbGF0aXZlIHRvIHRoZSBwcm9qZWN0IHJvb3QuJyxcbiAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgZGVmYXVsdDogWydub2RlX21vZHVsZXMnXSxcbiAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgd2VicGFjazoge1xuICAgICAgICBvcmRlcjogMyxcbiAgICAgICAgdGl0bGU6ICdXZWJwYWNrIHN1cHBvcnQnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0F0dGVtcHRzIHRvIHVzZSB0aGUgZ2l2ZW4gd2VicGFjayBjb25maWd1cmF0aW9uIGZpbGUgcmVzb2x1dGlvbiBzZXR0aW5ncyB0byBzZWFyY2ggZm9yIG1vZHVsZXMuJyxcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgfSxcbiAgICAgIHdlYnBhY2tDb25maWdGaWxlbmFtZToge1xuICAgICAgICBvcmRlcjogNCxcbiAgICAgICAgdGl0bGU6ICdXZWJwYWNrIGNvbmZpZ3VyYXRpb24gZmlsZW5hbWUnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1doZW4gXCJXZWJwYWNrIHN1cHBvcnRcIiBpcyBlbmFibGVkIHRoaXMgaXMgdGhlIGNvbmZpZyBmaWxlIHVzZWQgdG8gc3VwcGx5IG1vZHVsZSBzZWFyY2ggcGF0aHMuJyxcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGRlZmF1bHQ6ICd3ZWJwYWNrLmNvbmZpZy5qcydcbiAgICAgIH0sXG4gICAgICBiYWJlbFBsdWdpbk1vZHVsZVJlc29sdmVyOiB7XG4gICAgICAgIG9yZGVyOiA1LFxuICAgICAgICB0aXRsZTogJ0JhYmVsIFBsdWdpbiBNb2R1bGUgUmVzb2x2ZXIgc3VwcG9ydCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVXNlIHRoZSA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3RsZXVuZW4vYmFiZWwtcGx1Z2luLW1vZHVsZS1yZXNvbHZlclwiPkJhYmVsIFBsdWdpbiBNb2R1bGUgUmVzb2x2ZXI8L2E+IGNvbmZpZ3VyYXRpb24gbG9jYXRlZCBpbiB5b3VyIGAuYmFiZWxyY2Agb3IgaW4gdGhlIGJhYmVsIGNvbmZpZ3VyYXRpb24gaW4gYHBhY2thZ2UuanNvbmAuJyxcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmNvbXBsZXRpb25Qcm92aWRlciA9IG5ldyBDb21wbGV0aW9uUHJvdmlkZXIoKTtcbiAgfVxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgZGVsZXRlIHRoaXMuY29tcGxldGlvblByb3ZpZGVyO1xuICAgIHRoaXMuY29tcGxldGlvblByb3ZpZGVyID0gbnVsbDtcbiAgfVxuXG4gIGdldENvbXBsZXRpb25Qcm92aWRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5jb21wbGV0aW9uUHJvdmlkZXI7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQXV0b2NvbXBsZXRlTW9kdWxlc1BsdWdpbigpO1xuIl19