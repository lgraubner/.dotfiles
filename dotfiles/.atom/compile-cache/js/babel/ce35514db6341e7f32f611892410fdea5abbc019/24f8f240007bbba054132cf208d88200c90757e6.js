Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.activate = activate;
exports.deactivate = deactivate;
exports.provideLinter = provideLinter;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/**
 * Note that this can't be loaded lazily as `atom` doesn't export it correctly
 * for that, however as this comes from app.asar it is pre-compiled and is
 * essentially "free" as there is no expensive compilation step.
 */
// eslint-disable-next-line import/extensions

var _atom = require('atom');

'use babel';

var lazyReq = require('lazy-req')(require);

var _lazyReq = lazyReq('path')('dirname');

var dirname = _lazyReq.dirname;

var stylelint = lazyReq('stylelint');

var _lazyReq2 = lazyReq('atom-linter')('rangeFromLineNumber');

var rangeFromLineNumber = _lazyReq2.rangeFromLineNumber;

var assignDeep = lazyReq('assign-deep');
var escapeHTML = lazyReq('escape-html');

// Settings
var useStandard = undefined;
var presetConfig = undefined;
var disableWhenNoConfig = undefined;
var showIgnored = undefined;

// Internal vars
var subscriptions = undefined;
var baseScopes = ['source.css', 'source.scss', 'source.css.scss', 'source.less', 'source.css.less', 'source.css.postcss', 'source.css.postcss.sugarss'];

function startMeasure(baseName) {
  performance.mark(baseName + '-start');
}

function endMeasure(baseName) {
  if (atom.inDevMode()) {
    performance.mark(baseName + '-end');
    performance.measure(baseName, baseName + '-start', baseName + '-end');
    // eslint-disable-next-line no-console
    console.log(baseName + ' took: ', performance.getEntriesByName(baseName)[0].duration);
    performance.clearMarks(baseName + '-end');
    performance.clearMeasures(baseName);
  }
  performance.clearMarks(baseName + '-start');
}

function createRange(editor, data) {
  if (!Object.hasOwnProperty.call(data, 'line') && !Object.hasOwnProperty.call(data, 'column')) {
    // data.line & data.column might be undefined for non-fatal invalid rules,
    // e.g.: "block-no-empty": "foo"
    // Return `false` so Linter will ignore the range
    return false;
  }

  return rangeFromLineNumber(editor, data.line - 1, data.column - 1);
}

function activate() {
  startMeasure('linter-stylelint: Activation');
  require('atom-package-deps').install('linter-stylelint');

  subscriptions = new _atom.CompositeDisposable();

  subscriptions.add(atom.config.observe('linter-stylelint.useStandard', function (value) {
    useStandard = value;
  }));
  subscriptions.add(atom.config.observe('linter-stylelint.disableWhenNoConfig', function (value) {
    disableWhenNoConfig = value;
  }));
  subscriptions.add(atom.config.observe('linter-stylelint.showIgnored', function (value) {
    showIgnored = value;
  }));

  endMeasure('linter-stylelint: Activation');
}

function deactivate() {
  subscriptions.dispose();
}

function generateHTMLMessage(message) {
  if (!message.rule || message.rule === 'CssSyntaxError') {
    return escapeHTML()(message.text);
  }

  var ruleParts = message.rule.split('/');
  var url = undefined;

  if (ruleParts.length === 1) {
    // Core rule
    url = 'http://stylelint.io/user-guide/rules/' + ruleParts[0];
  } else {
    // Plugin rule
    var pluginName = ruleParts[0];
    // const ruleName = ruleParts[1];

    switch (pluginName) {
      case 'plugin':
        url = 'https://github.com/AtomLinter/linter-stylelint/tree/master/docs/noRuleNamespace.md';
        break;
      default:
        url = 'https://github.com/AtomLinter/linter-stylelint/tree/master/docs/linkingNewRule.md';
    }
  }

  // Escape any HTML in the message, and replace the rule ID with a link
  return escapeHTML()(message.text).replace('(' + message.rule + ')', '(<a href="' + url + '">' + message.rule + '</a>)');
}

var parseResults = function parseResults(editor, options, results, filePath) {
  startMeasure('linter-stylelint: Parsing results');
  if (options.code !== editor.getText()) {
    // The editor contents have changed since the lint was requested, tell
    //   Linter not to update the results
    endMeasure('linter-stylelint: Parsing results');
    endMeasure('linter-stylelint: Lint');
    return null;
  }

  if (!results) {
    endMeasure('linter-stylelint: Parsing results');
    endMeasure('linter-stylelint: Lint');
    return [];
  }

  var invalidOptions = results.invalidOptionWarnings.map(function (msg) {
    return {
      type: 'Error',
      severity: 'error',
      text: msg.text,
      filePath: filePath
    };
  });

  var warnings = results.warnings.map(function (warning) {
    // Stylelint only allows 'error' and 'warning' as severity values
    var severity = !warning.severity || warning.severity === 'error' ? 'Error' : 'Warning';
    return {
      type: severity,
      severity: severity.toLowerCase(),
      html: generateHTMLMessage(warning),
      filePath: filePath,
      range: createRange(editor, warning)
    };
  });

  var deprecations = results.deprecations.map(function (deprecation) {
    return {
      type: 'Warning',
      severity: 'warning',
      html: escapeHTML()(deprecation.text) + ' (<a href="' + deprecation.reference + '">reference</a>)',
      filePath: filePath
    };
  });

  var ignored = [];
  if (showIgnored && results.ignored) {
    ignored.push({
      type: 'Warning',
      severity: 'warning',
      text: 'This file is ignored',
      filePath: filePath
    });
  }

  var toReturn = [].concat(invalidOptions).concat(warnings).concat(deprecations).concat(ignored);

  endMeasure('linter-stylelint: Parsing results');
  endMeasure('linter-stylelint: Lint');
  return toReturn;
};

var runStylelint = _asyncToGenerator(function* (editor, options, filePath) {
  startMeasure('linter-stylelint: Stylelint');
  var data = undefined;
  try {
    data = yield stylelint().lint(options);
  } catch (error) {
    endMeasure('linter-stylelint: Stylelint');
    // Was it a code parsing error?
    if (error.line) {
      endMeasure('linter-stylelint: Lint');
      return [{
        type: 'Error',
        severity: 'error',
        text: error.reason || error.message,
        filePath: filePath,
        range: createRange(editor, error)
      }];
    }

    // If we got here, stylelint found something really wrong with the
    // configuration, such as extending an invalid configuration
    atom.notifications.addError('Unable to run stylelint', {
      detail: error.reason || error.message,
      dismissable: true
    });

    endMeasure('linter-stylelint: Lint');
    return [];
  }
  endMeasure('linter-stylelint: Stylelint');

  var results = data.results.shift();
  return parseResults(editor, options, results, filePath);
});

function provideLinter() {
  return {
    name: 'stylelint',
    grammarScopes: baseScopes,
    scope: 'file',
    lintOnFly: true,
    lint: _asyncToGenerator(function* (editor) {
      startMeasure('linter-stylelint: Lint');
      var scopes = editor.getLastCursor().getScopeDescriptor().getScopesArray();

      var filePath = editor.getPath();
      var text = editor.getText();

      if (!text) {
        endMeasure('linter-stylelint: Lint');
        return [];
      }

      // Require stylelint-config-standard if it hasn't already been loaded
      if (!presetConfig && useStandard) {
        presetConfig = require('stylelint-config-standard');
      }
      // Setup base config if useStandard() is true
      var defaultConfig = {
        rules: {}
      };

      // Base the config in the project directory

      var _atom$project$relativizePath = atom.project.relativizePath(filePath);

      var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 1);

      var configBasedir = _atom$project$relativizePath2[0];

      if (configBasedir === null) {
        // Falling back to the file directory if no project is found
        configBasedir = dirname(filePath);
      }

      var rules = useStandard ? assignDeep()({}, presetConfig) : defaultConfig;

      var options = {
        code: text,
        codeFilename: filePath,
        config: rules,
        configBasedir: configBasedir
      };

      if (scopes.includes('source.css.scss') || scopes.includes('source.scss')) {
        options.syntax = 'scss';
      }
      if (scopes.includes('source.css.less') || scopes.includes('source.less')) {
        options.syntax = 'less';
      }
      if (scopes.includes('source.css.postcss.sugarss')) {
        options.syntax = 'sugarss';
        // `stylelint-config-standard` isn't fully compatible with SugarSS
        // See here for details:
        // https://github.com/stylelint/stylelint-config-standard#using-the-config-with-sugarss-syntax
        options.config.rules['block-closing-brace-empty-line-before'] = null;
        options.config.rules['block-closing-brace-newline-after'] = null;
        options.config.rules['block-closing-brace-newline-before'] = null;
        options.config.rules['block-closing-brace-space-before'] = null;
        options.config.rules['block-opening-brace-newline-after'] = null;
        options.config.rules['block-opening-brace-space-after'] = null;
        options.config.rules['block-opening-brace-space-before'] = null;
        options.config.rules['declaration-block-semicolon-newline-after'] = null;
        options.config.rules['declaration-block-semicolon-space-after'] = null;
        options.config.rules['declaration-block-semicolon-space-before'] = null;
        options.config.rules['declaration-block-trailing-semicolon'] = null;
        options.config.rules['declaration-block-trailing-semicolon'] = null;
      }

      startMeasure('linter-stylelint: Create Linter');
      var stylelintLinter = yield stylelint().createLinter();
      endMeasure('linter-stylelint: Create Linter');

      startMeasure('linter-stylelint: Config');
      var foundConfig = undefined;
      try {
        foundConfig = yield stylelintLinter.getConfigForFile(filePath);
      } catch (error) {
        if (!/No configuration provided for .+/.test(error.message)) {
          endMeasure('linter-stylelint: Config');
          // If we got here, stylelint failed to parse the configuration
          // there's no point of re-linting if useStandard is true, because the
          // user does not have the complete set of desired rules parsed
          atom.notifications.addError('Unable to parse stylelint configuration', {
            detail: error.message,
            dismissable: true
          });
          endMeasure('linter-stylelint: Lint');
          return [];
        }
      }
      endMeasure('linter-stylelint: Config');

      if (foundConfig) {
        options.config = assignDeep()(rules, foundConfig.config);
        options.configBasedir = dirname(foundConfig.filepath);
      }

      if (!foundConfig && disableWhenNoConfig) {
        endMeasure('linter-stylelint: Lint');
        return [];
      }

      startMeasure('linter-stylelint: Check ignored');
      var fileIsIgnored = undefined;
      try {
        fileIsIgnored = yield stylelintLinter.isPathIgnored(filePath);
      } catch (error) {
        // Do nothing, configuration errors should have already been caught and thrown above
      }
      endMeasure('linter-stylelint: Check ignored');

      if (fileIsIgnored) {
        endMeasure('linter-stylelint: Lint');
        if (showIgnored) {
          return [{
            type: 'Warning',
            severity: 'warning',
            text: 'This file is ignored',
            filePath: filePath
          }];
        }
        return [];
      }

      var results = yield runStylelint(editor, options, filePath);
      return results;
    })
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zdHlsZWxpbnQvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBUW9DLE1BQU07O0FBUjFDLFdBQVcsQ0FBQzs7QUFVWixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7O2VBRXpCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUM7O0lBQXRDLE9BQU8sWUFBUCxPQUFPOztBQUNmLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzs7Z0JBQ1AsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLHFCQUFxQixDQUFDOztJQUFyRSxtQkFBbUIsYUFBbkIsbUJBQW1COztBQUMzQixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUMsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDOzs7QUFHMUMsSUFBSSxXQUFXLFlBQUEsQ0FBQztBQUNoQixJQUFJLFlBQVksWUFBQSxDQUFDO0FBQ2pCLElBQUksbUJBQW1CLFlBQUEsQ0FBQztBQUN4QixJQUFJLFdBQVcsWUFBQSxDQUFDOzs7QUFHaEIsSUFBSSxhQUFhLFlBQUEsQ0FBQztBQUNsQixJQUFNLFVBQVUsR0FBRyxDQUNqQixZQUFZLEVBQ1osYUFBYSxFQUNiLGlCQUFpQixFQUNqQixhQUFhLEVBQ2IsaUJBQWlCLEVBQ2pCLG9CQUFvQixFQUNwQiw0QkFBNEIsQ0FDN0IsQ0FBQzs7QUFFRixTQUFTLFlBQVksQ0FBQyxRQUFRLEVBQUU7QUFDOUIsYUFBVyxDQUFDLElBQUksQ0FBSSxRQUFRLFlBQVMsQ0FBQztDQUN2Qzs7QUFFRCxTQUFTLFVBQVUsQ0FBQyxRQUFRLEVBQUU7QUFDNUIsTUFBSSxJQUFJLENBQUMsU0FB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QUN2QyxrQkFBVSxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDckMsZUFBTyxFQUFFLENBQUM7T0FDWDs7QUFFRCxrQkFBWSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDaEQsVUFBSSxhQUFhLFlBQUEsQ0FBQztBQUNsQixVQUFJO0FBQ0YscUJBQWEsR0FBRyxNQUFNLGVBQWUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7T0FDL0QsQ0FBQyxPQUFPLEtBQUssRUFBRTs7T0FFZjtBQUNELGdCQUFVLENBQUMsaUNBQWlDLENBQUMsQ0FBQzs7QUFFOUMsVUFBSSxhQUFhLEVBQUU7QUFDakIsa0JBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3JDLFlBQUksV0FBVyxFQUFFO0FBQ2YsaUJBQU8sQ0FBQztBQUNOLGdCQUFJLEVBQUUsU0FBUztBQUNmLG9CQUFRLEVBQUUsU0FBUztBQUNuQixnQkFBSSxFQUFFLHNCQUFzQjtBQUM1QixvQkFBUSxFQUFSLFFBQVE7V0FDVCxDQUFDLENBQUM7U0FDSjtBQUNELGVBQU8sRUFBRSxDQUFDO09BQ1g7O0FBRUQsVUFBTSxPQUFPLEdBQUcsTUFBTSxZQUFZLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM5RCxhQUFPLE9BQU8sQ0FBQztLQUNoQixDQUFBO0dBQ0YsQ0FBQztDQUNIIiwiZmlsZSI6Ii9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zdHlsZWxpbnQvbGliL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qKlxuICogTm90ZSB0aGF0IHRoaXMgY2FuJ3QgYmUgbG9hZGVkIGxhemlseSBhcyBgYXRvbWAgZG9lc24ndCBleHBvcnQgaXQgY29ycmVjdGx5XG4gKiBmb3IgdGhhdCwgaG93ZXZlciBhcyB0aGlzIGNvbWVzIGZyb20gYXBwLmFzYXIgaXQgaXMgcHJlLWNvbXBpbGVkIGFuZCBpc1xuICogZXNzZW50aWFsbHkgXCJmcmVlXCIgYXMgdGhlcmUgaXMgbm8gZXhwZW5zaXZlIGNvbXBpbGF0aW9uIHN0ZXAuXG4gKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvZXh0ZW5zaW9uc1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuXG5jb25zdCBsYXp5UmVxID0gcmVxdWlyZSgnbGF6eS1yZXEnKShyZXF1aXJlKTtcblxuY29uc3QgeyBkaXJuYW1lIH0gPSBsYXp5UmVxKCdwYXRoJykoJ2Rpcm5hbWUnKTtcbmNvbnN0IHN0eWxlbGludCA9IGxhenlSZXEoJ3N0eWxlbGludCcpO1xuY29uc3QgeyByYW5nZUZyb21MaW5lTnVtYmVyIH0gPSBsYXp5UmVxKCdhdG9tLWxpbnRlcicpKCdyYW5nZUZyb21MaW5lTnVtYmVyJyk7XG5jb25zdCBhc3NpZ25EZWVwID0gbGF6eVJlcSgnYXNzaWduLWRlZXAnKTtcbmNvbnN0IGVzY2FwZUhUTUwgPSBsYXp5UmVxKCdlc2NhcGUtaHRtbCcpO1xuXG4vLyBTZXR0aW5nc1xubGV0IHVzZVN0YW5kYXJkO1xubGV0IHByZXNldENvbmZpZztcbmxldCBkaXNhYmxlV2hlbk5vQ29uZmlnO1xubGV0IHNob3dJZ25vcmVkO1xuXG4vLyBJbnRlcm5hbCB2YXJzXG5sZXQgc3Vic2NyaXB0aW9ucztcbmNvbnN0IGJhc2VTY29wZXMgPSBbXG4gICdzb3VyY2UuY3NzJyxcbiAgJ3NvdXJjZS5zY3NzJyxcbiAgJ3NvdXJjZS5jc3Muc2NzcycsXG4gICdzb3VyY2UubGVzcycsXG4gICdzb3VyY2UuY3NzLmxlc3MnLFxuICAnc291cmNlLmNzcy5wb3N0Y3NzJyxcbiAgJ3NvdXJjZS5jc3MucG9zdGNzcy5zdWdhcnNzJ1xuXTtcblxuZnVuY3Rpb24gc3RhcnRNZWFzdXJlKGJhc2VOYW1lKSB7XG4gIHBlcmZvcm1hbmNlLm1hcmsoYCR7YmFzZU5hbWV9LXN0YXJ0YCk7XG59XG5cbmZ1bmN0aW9uIGVuZE1lYXN1cmUoYmFzZU5hbWUpIHtcbiAgaWYgKGF0b20uaW5EZXZNb2RlKCkpIHtcbiAgICBwZXJmb3JtYW5jZS5tYXJrKGAke2Jhc2VOYW1lfS1lbmRgKTtcbiAgICBwZXJmb3JtYW5jZS5tZWFzdXJlKGJhc2VOYW1lLCBgJHtiYXNlTmFtZX0tc3RhcnRgLCBgJHtiYXNlTmFtZX0tZW5kYCk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmxvZyhgJHtiYXNlTmFtZX0gdG9vazogYCwgcGVyZm9ybWFuY2UuZ2V0RW50cmllc0J5TmFtZShiYXNlTmFtZSlbMF0uZHVyYXRpb24pO1xuICAgIHBlcmZvcm1hbmNlLmNsZWFyTWFya3MoYCR7YmFzZU5hbWV9LWVuZGApO1xuICAgIHBlcmZvcm1hbmNlLmNsZWFyTWVhc3VyZXMoYmFzZU5hbWUpO1xuICB9XG4gIHBlcmZvcm1hbmNlLmNsZWFyTWFya3MoYCR7YmFzZU5hbWV9LXN0YXJ0YCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVJhbmdlKGVkaXRvciwgZGF0YSkge1xuICBpZiAoIU9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsICdsaW5lJykgJiYgIU9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsICdjb2x1bW4nKSkge1xuICAgIC8vIGRhdGEubGluZSAmIGRhdGEuY29sdW1uIG1pZ2h0IGJlIHVuZGVmaW5lZCBmb3Igbm9uLWZhdGFsIGludmFsaWQgcnVsZXMsXG4gICAgLy8gZS5nLjogXCJibG9jay1uby1lbXB0eVwiOiBcImZvb1wiXG4gICAgLy8gUmV0dXJuIGBmYWxzZWAgc28gTGludGVyIHdpbGwgaWdub3JlIHRoZSByYW5nZVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiByYW5nZUZyb21MaW5lTnVtYmVyKGVkaXRvciwgZGF0YS5saW5lIC0gMSwgZGF0YS5jb2x1bW4gLSAxKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICBzdGFydE1lYXN1cmUoJ2xpbnRlci1zdHlsZWxpbnQ6IEFjdGl2YXRpb24nKTtcbiAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdsaW50ZXItc3R5bGVsaW50Jyk7XG5cbiAgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXN0eWxlbGludC51c2VTdGFuZGFyZCcsICh2YWx1ZSkgPT4ge1xuICAgIHVzZVN0YW5kYXJkID0gdmFsdWU7XG4gIH0pKTtcbiAgc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXN0eWxlbGludC5kaXNhYmxlV2hlbk5vQ29uZmlnJywgKHZhbHVlKSA9PiB7XG4gICAgZGlzYWJsZVdoZW5Ob0NvbmZpZyA9IHZhbHVlO1xuICB9KSk7XG4gIHN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1zdHlsZWxpbnQuc2hvd0lnbm9yZWQnLCAodmFsdWUpID0+IHtcbiAgICBzaG93SWdub3JlZCA9IHZhbHVlO1xuICB9KSk7XG5cbiAgZW5kTWVhc3VyZSgnbGludGVyLXN0eWxlbGludDogQWN0aXZhdGlvbicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpIHtcbiAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlSFRNTE1lc3NhZ2UobWVzc2FnZSkge1xuICBpZiAoIW1lc3NhZ2UucnVsZSB8fCBtZXNzYWdlLnJ1bGUgPT09ICdDc3NTeW50YXhFcnJvcicpIHtcbiAgICByZXR1cm4gZXNjYXBlSFRNTCgpKG1lc3NhZ2UudGV4dCk7XG4gIH1cblxuICBjb25zdCBydWxlUGFydHMgPSBtZXNzYWdlLnJ1bGUuc3BsaXQoJy8nKTtcbiAgbGV0IHVybDtcblxuICBpZiAocnVsZVBhcnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIC8vIENvcmUgcnVsZVxuICAgIHVybCA9IGBodHRwOi8vc3R5bGVsaW50LmlvL3VzZXItZ3VpZGUvcnVsZXMvJHtydWxlUGFydHNbMF19YDtcbiAgfSBlbHNlIHtcbiAgICAvLyBQbHVnaW4gcnVsZVxuICAgIGNvbnN0IHBsdWdpbk5hbWUgPSBydWxlUGFydHNbMF07XG4gICAgLy8gY29uc3QgcnVsZU5hbWUgPSBydWxlUGFydHNbMV07XG5cbiAgICBzd2l0Y2ggKHBsdWdpbk5hbWUpIHtcbiAgICAgIGNhc2UgJ3BsdWdpbic6XG4gICAgICAgIHVybCA9ICdodHRwczovL2dpdGh1Yi5jb20vQXRvbUxpbnRlci9saW50ZXItc3R5bGVsaW50L3RyZWUvbWFzdGVyL2RvY3Mvbm9SdWxlTmFtZXNwYWNlLm1kJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB1cmwgPSAnaHR0cHM6Ly9naXRodWIuY29tL0F0b21MaW50ZXIvbGludGVyLXN0eWxlbGludC90cmVlL21hc3Rlci9kb2NzL2xpbmtpbmdOZXdSdWxlLm1kJztcbiAgICB9XG4gIH1cblxuICAvLyBFc2NhcGUgYW55IEhUTUwgaW4gdGhlIG1lc3NhZ2UsIGFuZCByZXBsYWNlIHRoZSBydWxlIElEIHdpdGggYSBsaW5rXG4gIHJldHVybiBlc2NhcGVIVE1MKCkobWVzc2FnZS50ZXh0KS5yZXBsYWNlKFxuICAgIGAoJHttZXNzYWdlLnJ1bGV9KWAsIGAoPGEgaHJlZj1cIiR7dXJsfVwiPiR7bWVzc2FnZS5ydWxlfTwvYT4pYFxuICApO1xufVxuXG5jb25zdCBwYXJzZVJlc3VsdHMgPSAoZWRpdG9yLCBvcHRpb25zLCByZXN1bHRzLCBmaWxlUGF0aCkgPT4ge1xuICBzdGFydE1lYXN1cmUoJ2xpbnRlci1zdHlsZWxpbnQ6IFBhcnNpbmcgcmVzdWx0cycpO1xuICBpZiAob3B0aW9ucy5jb2RlICE9PSBlZGl0b3IuZ2V0VGV4dCgpKSB7XG4gICAgLy8gVGhlIGVkaXRvciBjb250ZW50cyBoYXZlIGNoYW5nZWQgc2luY2UgdGhlIGxpbnQgd2FzIHJlcXVlc3RlZCwgdGVsbFxuICAgIC8vICAgTGludGVyIG5vdCB0byB1cGRhdGUgdGhlIHJlc3VsdHNcbiAgICBlbmRNZWFzdXJlKCdsaW50ZXItc3R5bGVsaW50OiBQYXJzaW5nIHJlc3VsdHMnKTtcbiAgICBlbmRNZWFzdXJlKCdsaW50ZXItc3R5bGVsaW50OiBMaW50Jyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoIXJlc3VsdHMpIHtcbiAgICBlbmRNZWFzdXJlKCdsaW50ZXItc3R5bGVsaW50OiBQYXJzaW5nIHJlc3VsdHMnKTtcbiAgICBlbmRNZWFzdXJlKCdsaW50ZXItc3R5bGVsaW50OiBMaW50Jyk7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgaW52YWxpZE9wdGlvbnMgPSByZXN1bHRzLmludmFsaWRPcHRpb25XYXJuaW5ncy5tYXAobXNnID0+ICh7XG4gICAgdHlwZTogJ0Vycm9yJyxcbiAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICB0ZXh0OiBtc2cudGV4dCxcbiAgICBmaWxlUGF0aFxuICB9KSk7XG5cbiAgY29uc3Qgd2FybmluZ3MgPSByZXN1bHRzLndhcm5pbmdzLm1hcCgod2FybmluZykgPT4ge1xuICAgIC8vIFN0eWxlbGludCBvbmx5IGFsbG93cyAnZXJyb3InIGFuZCAnd2FybmluZycgYXMgc2V2ZXJpdHkgdmFsdWVzXG4gICAgY29uc3Qgc2V2ZXJpdHkgPSAhd2FybmluZy5zZXZlcml0eSB8fCB3YXJuaW5nLnNldmVyaXR5ID09PSAnZXJyb3InID8gJ0Vycm9yJyA6ICdXYXJuaW5nJztcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogc2V2ZXJpdHksXG4gICAgICBzZXZlcml0eTogc2V2ZXJpdHkudG9Mb3dlckNhc2UoKSxcbiAgICAgIGh0bWw6IGdlbmVyYXRlSFRNTE1lc3NhZ2Uod2FybmluZyksXG4gICAgICBmaWxlUGF0aCxcbiAgICAgIHJhbmdlOiBjcmVhdGVSYW5nZShlZGl0b3IsIHdhcm5pbmcpXG4gICAgfTtcbiAgfSk7XG5cbiAgY29uc3QgZGVwcmVjYXRpb25zID0gcmVzdWx0cy5kZXByZWNhdGlvbnMubWFwKGRlcHJlY2F0aW9uID0+ICh7XG4gICAgdHlwZTogJ1dhcm5pbmcnLFxuICAgIHNldmVyaXR5OiAnd2FybmluZycsXG4gICAgaHRtbDogYCR7ZXNjYXBlSFRNTCgpKGRlcHJlY2F0aW9uLnRleHQpfSAoPGEgaHJlZj1cIiR7ZGVwcmVjYXRpb24ucmVmZXJlbmNlfVwiPnJlZmVyZW5jZTwvYT4pYCxcbiAgICBmaWxlUGF0aFxuICB9KSk7XG5cbiAgY29uc3QgaWdub3JlZCA9IFtdO1xuICBpZiAoc2hvd0lnbm9yZWQgJiYgcmVzdWx0cy5pZ25vcmVkKSB7XG4gICAgaWdub3JlZC5wdXNoKHtcbiAgICAgIHR5cGU6ICdXYXJuaW5nJyxcbiAgICAgIHNldmVyaXR5OiAnd2FybmluZycsXG4gICAgICB0ZXh0OiAnVGhpcyBmaWxlIGlzIGlnbm9yZWQnLFxuICAgICAgZmlsZVBhdGhcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IHRvUmV0dXJuID0gW11cbiAgICAuY29uY2F0KGludmFsaWRPcHRpb25zKVxuICAgIC5jb25jYXQod2FybmluZ3MpXG4gICAgLmNvbmNhdChkZXByZWNhdGlvbnMpXG4gICAgLmNvbmNhdChpZ25vcmVkKTtcblxuICBlbmRNZWFzdXJlKCdsaW50ZXItc3R5bGVsaW50OiBQYXJzaW5nIHJlc3VsdHMnKTtcbiAgZW5kTWVhc3VyZSgnbGludGVyLXN0eWxlbGludDogTGludCcpO1xuICByZXR1cm4gdG9SZXR1cm47XG59O1xuXG5jb25zdCBydW5TdHlsZWxpbnQgPSBhc3luYyAoZWRpdG9yLCBvcHRpb25zLCBmaWxlUGF0aCkgPT4ge1xuICBzdGFydE1lYXN1cmUoJ2xpbnRlci1zdHlsZWxpbnQ6IFN0eWxlbGludCcpO1xuICBsZXQgZGF0YTtcbiAgdHJ5IHtcbiAgICBkYXRhID0gYXdhaXQgc3R5bGVsaW50KCkubGludChvcHRpb25zKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlbmRNZWFzdXJlKCdsaW50ZXItc3R5bGVsaW50OiBTdHlsZWxpbnQnKTtcbiAgICAvLyBXYXMgaXQgYSBjb2RlIHBhcnNpbmcgZXJyb3I/XG4gICAgaWYgKGVycm9yLmxpbmUpIHtcbiAgICAgIGVuZE1lYXN1cmUoJ2xpbnRlci1zdHlsZWxpbnQ6IExpbnQnKTtcbiAgICAgIHJldHVybiBbe1xuICAgICAgICB0eXBlOiAnRXJyb3InLFxuICAgICAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICAgICAgdGV4dDogZXJyb3IucmVhc29uIHx8IGVycm9yLm1lc3NhZ2UsXG4gICAgICAgIGZpbGVQYXRoLFxuICAgICAgICByYW5nZTogY3JlYXRlUmFuZ2UoZWRpdG9yLCBlcnJvcilcbiAgICAgIH1dO1xuICAgIH1cblxuICAgIC8vIElmIHdlIGdvdCBoZXJlLCBzdHlsZWxpbnQgZm91bmQgc29tZXRoaW5nIHJlYWxseSB3cm9uZyB3aXRoIHRoZVxuICAgIC8vIGNvbmZpZ3VyYXRpb24sIHN1Y2ggYXMgZXh0ZW5kaW5nIGFuIGludmFsaWQgY29uZmlndXJhdGlvblxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignVW5hYmxlIHRvIHJ1biBzdHlsZWxpbnQnLCB7XG4gICAgICBkZXRhaWw6IGVycm9yLnJlYXNvbiB8fCBlcnJvci5tZXNzYWdlLFxuICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICB9KTtcblxuICAgIGVuZE1lYXN1cmUoJ2xpbnRlci1zdHlsZWxpbnQ6IExpbnQnKTtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgZW5kTWVhc3VyZSgnbGludGVyLXN0eWxlbGludDogU3R5bGVsaW50Jyk7XG5cbiAgY29uc3QgcmVzdWx0cyA9IGRhdGEucmVzdWx0cy5zaGlmdCgpO1xuICByZXR1cm4gcGFyc2VSZXN1bHRzKGVkaXRvciwgb3B0aW9ucywgcmVzdWx0cywgZmlsZVBhdGgpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVMaW50ZXIoKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3N0eWxlbGludCcsXG4gICAgZ3JhbW1hclNjb3BlczogYmFzZVNjb3BlcyxcbiAgICBzY29wZTogJ2ZpbGUnLFxuICAgIGxpbnRPbkZseTogdHJ1ZSxcbiAgICBsaW50OiBhc3luYyAoZWRpdG9yKSA9PiB7XG4gICAgICBzdGFydE1lYXN1cmUoJ2xpbnRlci1zdHlsZWxpbnQ6IExpbnQnKTtcbiAgICAgIGNvbnN0IHNjb3BlcyA9IGVkaXRvci5nZXRMYXN0Q3Vyc29yKCkuZ2V0U2NvcGVEZXNjcmlwdG9yKCkuZ2V0U2NvcGVzQXJyYXkoKTtcblxuICAgICAgY29uc3QgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgY29uc3QgdGV4dCA9IGVkaXRvci5nZXRUZXh0KCk7XG5cbiAgICAgIGlmICghdGV4dCkge1xuICAgICAgICBlbmRNZWFzdXJlKCdsaW50ZXItc3R5bGVsaW50OiBMaW50Jyk7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cblxuICAgICAgLy8gUmVxdWlyZSBzdHlsZWxpbnQtY29uZmlnLXN0YW5kYXJkIGlmIGl0IGhhc24ndCBhbHJlYWR5IGJlZW4gbG9hZGVkXG4gICAgICBpZiAoIXByZXNldENvbmZpZyAmJiB1c2VTdGFuZGFyZCkge1xuICAgICAgICBwcmVzZXRDb25maWcgPSByZXF1aXJlKCdzdHlsZWxpbnQtY29uZmlnLXN0YW5kYXJkJyk7XG4gICAgICB9XG4gICAgICAvLyBTZXR1cCBiYXNlIGNvbmZpZyBpZiB1c2VTdGFuZGFyZCgpIGlzIHRydWVcbiAgICAgIGNvbnN0IGRlZmF1bHRDb25maWcgPSB7XG4gICAgICAgIHJ1bGVzOiB7fVxuICAgICAgfTtcblxuICAgICAgLy8gQmFzZSB0aGUgY29uZmlnIGluIHRoZSBwcm9qZWN0IGRpcmVjdG9yeVxuICAgICAgbGV0IFtjb25maWdCYXNlZGlyXSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aCk7XG4gICAgICBpZiAoY29uZmlnQmFzZWRpciA9PT0gbnVsbCkge1xuICAgICAgICAvLyBGYWxsaW5nIGJhY2sgdG8gdGhlIGZpbGUgZGlyZWN0b3J5IGlmIG5vIHByb2plY3QgaXMgZm91bmRcbiAgICAgICAgY29uZmlnQmFzZWRpciA9IGRpcm5hbWUoZmlsZVBhdGgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBydWxlcyA9IHVzZVN0YW5kYXJkID8gYXNzaWduRGVlcCgpKHt9LCBwcmVzZXRDb25maWcpIDogZGVmYXVsdENvbmZpZztcblxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgY29kZTogdGV4dCxcbiAgICAgICAgY29kZUZpbGVuYW1lOiBmaWxlUGF0aCxcbiAgICAgICAgY29uZmlnOiBydWxlcyxcbiAgICAgICAgY29uZmlnQmFzZWRpclxuICAgICAgfTtcblxuICAgICAgaWYgKHNjb3Blcy5pbmNsdWRlcygnc291cmNlLmNzcy5zY3NzJykgfHwgc2NvcGVzLmluY2x1ZGVzKCdzb3VyY2Uuc2NzcycpKSB7XG4gICAgICAgIG9wdGlvbnMuc3ludGF4ID0gJ3Njc3MnO1xuICAgICAgfVxuICAgICAgaWYgKHNjb3Blcy5pbmNsdWRlcygnc291cmNlLmNzcy5sZXNzJykgfHwgc2NvcGVzLmluY2x1ZGVzKCdzb3VyY2UubGVzcycpKSB7XG4gICAgICAgIG9wdGlvbnMuc3ludGF4ID0gJ2xlc3MnO1xuICAgICAgfVxuICAgICAgaWYgKHNjb3Blcy5pbmNsdWRlcygnc291cmNlLmNzcy5wb3N0Y3NzLnN1Z2Fyc3MnKSkge1xuICAgICAgICBvcHRpb25zLnN5bnRheCA9ICdzdWdhcnNzJztcbiAgICAgICAgLy8gYHN0eWxlbGludC1jb25maWctc3RhbmRhcmRgIGlzbid0IGZ1bGx5IGNvbXBhdGlibGUgd2l0aCBTdWdhclNTXG4gICAgICAgIC8vIFNlZSBoZXJlIGZvciBkZXRhaWxzOlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3R5bGVsaW50L3N0eWxlbGludC1jb25maWctc3RhbmRhcmQjdXNpbmctdGhlLWNvbmZpZy13aXRoLXN1Z2Fyc3Mtc3ludGF4XG4gICAgICAgIG9wdGlvbnMuY29uZmlnLnJ1bGVzWydibG9jay1jbG9zaW5nLWJyYWNlLWVtcHR5LWxpbmUtYmVmb3JlJ10gPSBudWxsO1xuICAgICAgICBvcHRpb25zLmNvbmZpZy5ydWxlc1snYmxvY2stY2xvc2luZy1icmFjZS1uZXdsaW5lLWFmdGVyJ10gPSBudWxsO1xuICAgICAgICBvcHRpb25zLmNvbmZpZy5ydWxlc1snYmxvY2stY2xvc2luZy1icmFjZS1uZXdsaW5lLWJlZm9yZSddID0gbnVsbDtcbiAgICAgICAgb3B0aW9ucy5jb25maWcucnVsZXNbJ2Jsb2NrLWNsb3NpbmctYnJhY2Utc3BhY2UtYmVmb3JlJ10gPSBudWxsO1xuICAgICAgICBvcHRpb25zLmNvbmZpZy5ydWxlc1snYmxvY2stb3BlbmluZy1icmFjZS1uZXdsaW5lLWFmdGVyJ10gPSBudWxsO1xuICAgICAgICBvcHRpb25zLmNvbmZpZy5ydWxlc1snYmxvY2stb3BlbmluZy1icmFjZS1zcGFjZS1hZnRlciddID0gbnVsbDtcbiAgICAgICAgb3B0aW9ucy5jb25maWcucnVsZXNbJ2Jsb2NrLW9wZW5pbmctYnJhY2Utc3BhY2UtYmVmb3JlJ10gPSBudWxsO1xuICAgICAgICBvcHRpb25zLmNvbmZpZy5ydWxlc1snZGVjbGFyYXRpb24tYmxvY2stc2VtaWNvbG9uLW5ld2xpbmUtYWZ0ZXInXSA9IG51bGw7XG4gICAgICAgIG9wdGlvbnMuY29uZmlnLnJ1bGVzWydkZWNsYXJhdGlvbi1ibG9jay1zZW1pY29sb24tc3BhY2UtYWZ0ZXInXSA9IG51bGw7XG4gICAgICAgIG9wdGlvbnMuY29uZmlnLnJ1bGVzWydkZWNsYXJhdGlvbi1ibG9jay1zZW1pY29sb24tc3BhY2UtYmVmb3JlJ10gPSBudWxsO1xuICAgICAgICBvcHRpb25zLmNvbmZpZy5ydWxlc1snZGVjbGFyYXRpb24tYmxvY2stdHJhaWxpbmctc2VtaWNvbG9uJ10gPSBudWxsO1xuICAgICAgICBvcHRpb25zLmNvbmZpZy5ydWxlc1snZGVjbGFyYXRpb24tYmxvY2stdHJhaWxpbmctc2VtaWNvbG9uJ10gPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBzdGFydE1lYXN1cmUoJ2xpbnRlci1zdHlsZWxpbnQ6IENyZWF0ZSBMaW50ZXInKTtcbiAgICAgIGNvbnN0IHN0eWxlbGludExpbnRlciA9IGF3YWl0IHN0eWxlbGludCgpLmNyZWF0ZUxpbnRlcigpO1xuICAgICAgZW5kTWVhc3VyZSgnbGludGVyLXN0eWxlbGludDogQ3JlYXRlIExpbnRlcicpO1xuXG4gICAgICBzdGFydE1lYXN1cmUoJ2xpbnRlci1zdHlsZWxpbnQ6IENvbmZpZycpO1xuICAgICAgbGV0IGZvdW5kQ29uZmlnO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm91bmRDb25maWcgPSBhd2FpdCBzdHlsZWxpbnRMaW50ZXIuZ2V0Q29uZmlnRm9yRmlsZShmaWxlUGF0aCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoIS9ObyBjb25maWd1cmF0aW9uIHByb3ZpZGVkIGZvciAuKy8udGVzdChlcnJvci5tZXNzYWdlKSkge1xuICAgICAgICAgIGVuZE1lYXN1cmUoJ2xpbnRlci1zdHlsZWxpbnQ6IENvbmZpZycpO1xuICAgICAgICAgIC8vIElmIHdlIGdvdCBoZXJlLCBzdHlsZWxpbnQgZmFpbGVkIHRvIHBhcnNlIHRoZSBjb25maWd1cmF0aW9uXG4gICAgICAgICAgLy8gdGhlcmUncyBubyBwb2ludCBvZiByZS1saW50aW5nIGlmIHVzZVN0YW5kYXJkIGlzIHRydWUsIGJlY2F1c2UgdGhlXG4gICAgICAgICAgLy8gdXNlciBkb2VzIG5vdCBoYXZlIHRoZSBjb21wbGV0ZSBzZXQgb2YgZGVzaXJlZCBydWxlcyBwYXJzZWRcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ1VuYWJsZSB0byBwYXJzZSBzdHlsZWxpbnQgY29uZmlndXJhdGlvbicsIHtcbiAgICAgICAgICAgIGRldGFpbDogZXJyb3IubWVzc2FnZSxcbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZW5kTWVhc3VyZSgnbGludGVyLXN0eWxlbGludDogTGludCcpO1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZW5kTWVhc3VyZSgnbGludGVyLXN0eWxlbGludDogQ29uZmlnJyk7XG5cbiAgICAgIGlmIChmb3VuZENvbmZpZykge1xuICAgICAgICBvcHRpb25zLmNvbmZpZyA9IGFzc2lnbkRlZXAoKShydWxlcywgZm91bmRDb25maWcuY29uZmlnKTtcbiAgICAgICAgb3B0aW9ucy5jb25maWdCYXNlZGlyID0gZGlybmFtZShmb3VuZENvbmZpZy5maWxlcGF0aCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghZm91bmRDb25maWcgJiYgZGlzYWJsZVdoZW5Ob0NvbmZpZykge1xuICAgICAgICBlbmRNZWFzdXJlKCdsaW50ZXItc3R5bGVsaW50OiBMaW50Jyk7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cblxuICAgICAgc3RhcnRNZWFzdXJlKCdsaW50ZXItc3R5bGVsaW50OiBDaGVjayBpZ25vcmVkJyk7XG4gICAgICBsZXQgZmlsZUlzSWdub3JlZDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZpbGVJc0lnbm9yZWQgPSBhd2FpdCBzdHlsZWxpbnRMaW50ZXIuaXNQYXRoSWdub3JlZChmaWxlUGF0aCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBEbyBub3RoaW5nLCBjb25maWd1cmF0aW9uIGVycm9ycyBzaG91bGQgaGF2ZSBhbHJlYWR5IGJlZW4gY2F1Z2h0IGFuZCB0aHJvd24gYWJvdmVcbiAgICAgIH1cbiAgICAgIGVuZE1lYXN1cmUoJ2xpbnRlci1zdHlsZWxpbnQ6IENoZWNrIGlnbm9yZWQnKTtcblxuICAgICAgaWYgKGZpbGVJc0lnbm9yZWQpIHtcbiAgICAgICAgZW5kTWVhc3VyZSgnbGludGVyLXN0eWxlbGludDogTGludCcpO1xuICAgICAgICBpZiAoc2hvd0lnbm9yZWQpIHtcbiAgICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgIHR5cGU6ICdXYXJuaW5nJyxcbiAgICAgICAgICAgIHNldmVyaXR5OiAnd2FybmluZycsXG4gICAgICAgICAgICB0ZXh0OiAnVGhpcyBmaWxlIGlzIGlnbm9yZWQnLFxuICAgICAgICAgICAgZmlsZVBhdGhcbiAgICAgICAgICB9XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBydW5TdHlsZWxpbnQoZWRpdG9yLCBvcHRpb25zLCBmaWxlUGF0aCk7XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gIH07XG59XG4iXX0=