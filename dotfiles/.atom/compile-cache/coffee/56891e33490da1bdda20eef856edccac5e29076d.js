(function() {
  var Disposable, Linter;

  Disposable = require('atom').Disposable;

  module.exports = Linter = {
    instance: null,
    config: {
      lintOnFly: {
        title: 'Lint As You Type',
        description: 'Lint files while typing, without the need to save',
        type: 'boolean',
        "default": true,
        order: 1
      },
      lintOnFlyInterval: {
        title: 'Lint As You Type Interval',
        description: 'Interval at which providers are triggered as you type (in ms)',
        type: 'integer',
        "default": 300,
        order: 1
      },
      ignoredMessageTypes: {
        description: 'Comma separated list of message types to completely ignore',
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        },
        order: 2
      },
      ignoreVCSIgnoredFiles: {
        title: 'Do Not Lint Files Ignored by VCS',
        description: 'E.g., ignore files specified in .gitignore',
        type: 'boolean',
        "default": true,
        order: 2
      },
      ignoreMatchedFiles: {
        title: 'Do Not Lint Files that match this Glob',
        type: 'string',
        "default": '/**/*.min.{js,css}',
        order: 2
      },
      showErrorInline: {
        title: 'Show Inline Error Tooltips',
        type: 'boolean',
        "default": true,
        order: 3
      },
      inlineTooltipInterval: {
        title: 'Inline Tooltip Interval',
        description: 'Interval at which inline tooltip is updated (in ms)',
        type: 'integer',
        "default": 60,
        order: 3
      },
      gutterEnabled: {
        title: 'Highlight Error Lines in Gutter',
        type: 'boolean',
        "default": true,
        order: 3
      },
      gutterPosition: {
        title: 'Position of Gutter Highlights',
        "enum": ['Left', 'Right'],
        "default": 'Right',
        order: 3,
        type: 'string'
      },
      underlineIssues: {
        title: 'Underline Issues',
        type: 'boolean',
        "default": true,
        order: 3
      },
      showProviderName: {
        title: 'Show Provider Name (When Available)',
        type: 'boolean',
        "default": true,
        order: 3
      },
      showErrorPanel: {
        title: 'Show Error Panel',
        description: 'Show a list of errors at the bottom of the editor',
        type: 'boolean',
        "default": true,
        order: 4
      },
      errorPanelHeight: {
        title: 'Error Panel Height',
        description: 'Height of the error panel (in px)',
        type: 'number',
        "default": 150,
        order: 4
      },
      alwaysTakeMinimumSpace: {
        title: 'Automatically Reduce Error Panel Height',
        description: 'Reduce panel height when it exceeds the height of the error list',
        type: 'boolean',
        "default": true,
        order: 4
      },
      displayLinterInfo: {
        title: 'Display Linter Info in the Status Bar',
        description: 'Whether to show any linter information in the status bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      displayLinterStatus: {
        title: 'Display Linter Status Info in Status Bar',
        description: 'The `No Issues` or `X Issues` widget',
        type: 'boolean',
        "default": true,
        order: 5
      },
      showErrorTabLine: {
        title: 'Show "Line" Tab in the Status Bar',
        type: 'boolean',
        "default": false,
        order: 5
      },
      showErrorTabFile: {
        title: 'Show "File" Tab in the Status Bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      showErrorTabProject: {
        title: 'Show "Project" Tab in the Status Bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      statusIconScope: {
        title: 'Scope of Linter Messages to Show in Status Icon',
        type: 'string',
        "enum": ['File', 'Line', 'Project'],
        "default": 'Project',
        order: 5
      },
      statusIconPosition: {
        title: 'Position of Status Icon in the Status Bar',
        "enum": ['Left', 'Right'],
        type: 'string',
        "default": 'Left',
        order: 5
      }
    },
    activate: function(state) {
      var LinterPlus;
      Linter.state = state;
      LinterPlus = require('./linter.coffee');
      return this.instance = new LinterPlus(state);
    },
    serialize: function() {
      return Linter.state;
    },
    consumeLinter: function(linters) {
      var i, len, linter;
      if (!(linters instanceof Array)) {
        linters = [linters];
      }
      for (i = 0, len = linters.length; i < len; i++) {
        linter = linters[i];
        this.instance.addLinter(linter);
      }
      return new Disposable((function(_this) {
        return function() {
          var j, len1, results;
          results = [];
          for (j = 0, len1 = linters.length; j < len1; j++) {
            linter = linters[j];
            results.push(_this.instance.deleteLinter(linter));
          }
          return results;
        };
      })(this));
    },
    consumeStatusBar: function(statusBar) {
      return this.instance.views.attachBottom(statusBar);
    },
    provideLinter: function() {
      return this.instance;
    },
    provideIndie: function() {
      var ref;
      return (ref = this.instance) != null ? ref.indieLinters : void 0;
    },
    deactivate: function() {
      var ref;
      return (ref = this.instance) != null ? ref.deactivate() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsYUFBYyxPQUFBLENBQVEsTUFBUjs7RUFDZixNQUFNLENBQUMsT0FBUCxHQUFpQixNQUFBLEdBQ2Y7SUFBQSxRQUFBLEVBQVUsSUFBVjtJQUNBLE1BQUEsRUFDRTtNQUFBLFNBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxrQkFBUDtRQUNBLFdBQUEsRUFBYSxtREFEYjtRQUVBLElBQUEsRUFBTSxTQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO1FBSUEsS0FBQSxFQUFPLENBSlA7T0FERjtNQU1BLGlCQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sMkJBQVA7UUFDQSxXQUFBLEVBQWEsK0RBRGI7UUFFQSxJQUFBLEVBQU0sU0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsR0FIVDtRQUlBLEtBQUEsRUFBTyxDQUpQO09BUEY7TUFhQSxtQkFBQSxFQUNFO1FBQUEsV0FBQSxFQUFhLDREQUFiO1FBQ0EsSUFBQSxFQUFNLE9BRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBRlQ7UUFHQSxLQUFBLEVBQ0U7VUFBQSxJQUFBLEVBQU0sUUFBTjtTQUpGO1FBS0EsS0FBQSxFQUFPLENBTFA7T0FkRjtNQW9CQSxxQkFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLGtDQUFQO1FBQ0EsV0FBQSxFQUFhLDRDQURiO1FBRUEsSUFBQSxFQUFNLFNBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSFQ7UUFJQSxLQUFBLEVBQU8sQ0FKUDtPQXJCRjtNQTBCQSxrQkFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLHdDQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFT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QUMsU0FBRDthQUNoQixJQUFDLENBQUEsUUFBUSxDQUFDLEtBQUssQ0FBQyxZQUFoQixDQUE2QixTQUE3QjtJQURnQixDQWpKbEI7SUFvSkEsYUFBQSxFQUFlLFNBQUE7YUFDYixJQUFDLENBQUE7SUFEWSxDQXBKZjtJQXVKQSxZQUFBLEVBQWMsU0FBQTtBQUNaLFVBQUE7Z0RBQVMsQ0FBRTtJQURDLENBdkpkO0lBMEpBLFVBQUEsRUFBWSxTQUFBO0FBQ1YsVUFBQTtnREFBUyxDQUFFLFVBQVgsQ0FBQTtJQURVLENBMUpaOztBQUZGIiwic291cmNlc0NvbnRlbnQiOlsie0Rpc3Bvc2FibGV9ID0gcmVxdWlyZSgnYXRvbScpXG5tb2R1bGUuZXhwb3J0cyA9IExpbnRlciA9XG4gIGluc3RhbmNlOiBudWxsXG4gIGNvbmZpZzpcbiAgICBsaW50T25GbHk6XG4gICAgICB0aXRsZTogJ0xpbnQgQXMgWW91IFR5cGUnXG4gICAgICBkZXNjcmlwdGlvbjogJ0xpbnQgZmlsZXMgd2hpbGUgdHlwaW5nLCB3aXRob3V0IHRoZSBuZWVkIHRvIHNhdmUnXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIG9yZGVyOiAxXG4gICAgbGludE9uRmx5SW50ZXJ2YWw6XG4gICAgICB0aXRsZTogJ0xpbnQgQXMgWW91IFR5cGUgSW50ZXJ2YWwnXG4gICAgICBkZXNjcmlwdGlvbjogJ0ludGVydmFsIGF0IHdoaWNoIHByb3ZpZGVycyBhcmUgdHJpZ2dlcmVkIGFzIHlvdSB0eXBlIChpbiBtcyknXG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDMwMFxuICAgICAgb3JkZXI6IDFcblxuICAgIGlnbm9yZWRNZXNzYWdlVHlwZXM6XG4gICAgICBkZXNjcmlwdGlvbjogJ0NvbW1hIHNlcGFyYXRlZCBsaXN0IG9mIG1lc3NhZ2UgdHlwZXMgdG8gY29tcGxldGVseSBpZ25vcmUnXG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbXVxuICAgICAgaXRlbXM6XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBvcmRlcjogMlxuICAgIGlnbm9yZVZDU0lnbm9yZWRGaWxlczpcbiAgICAgIHRpdGxlOiAnRG8gTm90IExpbnQgRmlsZXMgSWdub3JlZCBieSBWQ1MnXG4gICAgICBkZXNjcmlwdGlvbjogJ0UuZy4sIGlnbm9yZSBmaWxlcyBzcGVjaWZpZWQgaW4gLmdpdGlnbm9yZSdcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgb3JkZXI6IDJcbiAgICBpZ25vcmVNYXRjaGVkRmlsZXM6XG4gICAgICB0aXRsZTogJ0RvIE5vdCBMaW50IEZpbGVzIHRoYXQgbWF0Y2ggdGhpcyBHbG9iJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICcvKiovKi5taW4ue2pzLGNzc30nXG4gICAgICBvcmRlcjogMlxuXG4gICAgc2hvd0Vycm9ySW5saW5lOlxuICAgICAgdGl0bGU6ICdTaG93IElubGluZSBFcnJvciBUb29sdGlwcydcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgb3JkZXI6IDNcbiAgICBpbmxpbmVUb29sdGlwSW50ZXJ2YWw6XG4gICAgICB0aXRsZTogJ0lubGluZSBUb29sdGlwIEludGVydmFsJ1xuICAgICAgZGVzY3JpcHRpb246ICdJbnRlcnZhbCBhdCB3aGljaCBpbmxpbmUgdG9vbHRpcCBpcyB1cGRhdGVkIChpbiBtcyknXG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDYwXG4gICAgICBvcmRlcjogM1xuICAgIGd1dHRlckVuYWJsZWQ6XG4gICAgICB0aXRsZTogJ0hpZ2hsaWdodCBFcnJvciBMaW5lcyBpbiBHdXR0ZXInXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIG9yZGVyOiAzXG4gICAgZ3V0dGVyUG9zaXRpb246XG4gICAgICB0aXRsZTogJ1Bvc2l0aW9uIG9mIEd1dHRlciBIaWdobGlnaHRzJ1xuICAgICAgZW51bTogWydMZWZ0JywgJ1JpZ2h0J11cbiAgICAgIGRlZmF1bHQ6ICdSaWdodCdcbiAgICAgIG9yZGVyOiAzXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIHVuZGVybGluZUlzc3VlczpcbiAgICAgIHRpdGxlOiAnVW5kZXJsaW5lIElzc3VlcydcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgb3JkZXI6IDNcbiAgICBzaG93UHJvdmlkZXJOYW1lOlxuICAgICAgdGl0bGU6ICdTaG93IFByb3ZpZGVyIE5hbWUgKFdoZW4gQXZhaWxhYmxlKSdcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgb3JkZXI6IDNcblxuICAgIHNob3dFcnJvclBhbmVsOlxuICAgICAgdGl0bGU6ICdTaG93IEVycm9yIFBhbmVsJ1xuICAgICAgZGVzY3JpcHRpb246ICdTaG93IGEgbGlzdCBvZiBlcnJvcnMgYXQgdGhlIGJvdHRvbSBvZiB0aGUgZWRpdG9yJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBvcmRlcjogNFxuICAgIGVycm9yUGFuZWxIZWlnaHQ6XG4gICAgICB0aXRsZTogJ0Vycm9yIFBhbmVsIEhlaWdodCdcbiAgICAgIGRlc2NyaXB0aW9uOiAnSGVpZ2h0IG9mIHRoZSBlcnJvciBwYW5lbCAoaW4gcHgpJ1xuICAgICAgdHlwZTogJ251bWJlcidcbiAgICAgIGRlZmF1bHQ6IDE1MFxuICAgICAgb3JkZXI6IDRcbiAgICBhbHdheXNUYWtlTWluaW11bVNwYWNlOlxuICAgICAgdGl0bGU6ICdBdXRvbWF0aWNhbGx5IFJlZHVjZSBFcnJvciBQYW5lbCBIZWlnaHQnXG4gICAgICBkZXNjcmlwdGlvbjogJ1JlZHVjZSBwYW5lbCBoZWlnaHQgd2hlbiBpdCBleGNlZWRzIHRoZSBoZWlnaHQgb2YgdGhlIGVycm9yIGxpc3QnXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIG9yZGVyOiA0XG5cbiAgICBkaXNwbGF5TGludGVySW5mbzpcbiAgICAgIHRpdGxlOiAnRGlzcGxheSBMaW50ZXIgSW5mbyBpbiB0aGUgU3RhdHVzIEJhcidcbiAgICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciB0byBzaG93IGFueSBsaW50ZXIgaW5mb3JtYXRpb24gaW4gdGhlIHN0YXR1cyBiYXInXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIG9yZGVyOiA1XG4gICAgZGlzcGxheUxpbnRlclN0YXR1czpcbiAgICAgIHRpdGxlOiAnRGlzcGxheSBMaW50ZXIgU3RhdHVzIEluZm8gaW4gU3RhdHVzIEJhcidcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGBObyBJc3N1ZXNgIG9yIGBYIElzc3Vlc2Agd2lkZ2V0J1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBvcmRlcjogNVxuICAgIHNob3dFcnJvclRhYkxpbmU6XG4gICAgICB0aXRsZTogJ1Nob3cgXCJMaW5lXCIgVGFiIGluIHRoZSBTdGF0dXMgQmFyJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgb3JkZXI6IDVcbiAgICBzaG93RXJyb3JUYWJGaWxlOlxuICAgICAgdGl0bGU6ICdTaG93IFwiRmlsZVwiIFRhYiBpbiB0aGUgU3RhdHVzIEJhcidcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgb3JkZXI6IDVcbiAgICBzaG93RXJyb3JUYWJQcm9qZWN0OlxuICAgICAgdGl0bGU6ICdTaG93IFwiUHJvamVjdFwiIFRhYiBpbiB0aGUgU3RhdHVzIEJhcidcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgb3JkZXI6IDVcbiAgICBzdGF0dXNJY29uU2NvcGU6XG4gICAgICB0aXRsZTogJ1Njb3BlIG9mIExpbnRlciBNZXNzYWdlcyB0byBTaG93IGluIFN0YXR1cyBJY29uJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGVudW06IFsnRmlsZScsICdMaW5lJywgJ1Byb2plY3QnXVxuICAgICAgZGVmYXVsdDogJ1Byb2plY3QnXG4gICAgICBvcmRlcjogNVxuICAgIHN0YXR1c0ljb25Qb3NpdGlvbjpcbiAgICAgIHRpdGxlOiAnUG9zaXRpb24gb2YgU3RhdHVzIEljb24gaW4gdGhlIFN0YXR1cyBCYXInXG4gICAgICBlbnVtOiBbJ0xlZnQnLCAnUmlnaHQnXVxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICdMZWZ0J1xuICAgICAgb3JkZXI6IDVcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIExpbnRlci5zdGF0ZSA9IHN0YXRlXG4gICAgTGludGVyUGx1cyA9IHJlcXVpcmUoJy4vbGludGVyLmNvZmZlZScpXG4gICAgQGluc3RhbmNlID0gbmV3IExpbnRlclBsdXMgc3RhdGVcblxuICBzZXJpYWxpemU6IC0+XG4gICAgTGludGVyLnN0YXRlXG5cbiAgY29uc3VtZUxpbnRlcjogKGxpbnRlcnMpIC0+XG4gICAgdW5sZXNzIGxpbnRlcnMgaW5zdGFuY2VvZiBBcnJheVxuICAgICAgbGludGVycyA9IFsgbGludGVycyBdXG5cbiAgICBmb3IgbGludGVyIGluIGxpbnRlcnNcbiAgICAgIEBpbnN0YW5jZS5hZGRMaW50ZXIobGludGVyKVxuXG4gICAgbmV3IERpc3Bvc2FibGUgPT5cbiAgICAgIGZvciBsaW50ZXIgaW4gbGludGVyc1xuICAgICAgICBAaW5zdGFuY2UuZGVsZXRlTGludGVyKGxpbnRlcilcblxuICBjb25zdW1lU3RhdHVzQmFyOiAoc3RhdHVzQmFyKSAtPlxuICAgIEBpbnN0YW5jZS52aWV3cy5hdHRhY2hCb3R0b20oc3RhdHVzQmFyKVxuXG4gIHByb3ZpZGVMaW50ZXI6IC0+XG4gICAgQGluc3RhbmNlXG5cbiAgcHJvdmlkZUluZGllOiAtPlxuICAgIEBpbnN0YW5jZT8uaW5kaWVMaW50ZXJzXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAaW5zdGFuY2U/LmRlYWN0aXZhdGUoKVxuIl19
