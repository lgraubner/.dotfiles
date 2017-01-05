Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _underscorePlus = require('underscore-plus');

'use babel';

var Function = require('loophole').Function;
var REGEXP_LINE = /(([\$\w]+[\w-]*)|([.:;'"[{( ]+))$/g;

var Provider = (function () {
  function Provider() {
    _classCallCheck(this, Provider);

    this.disposables = [];

    this.force = false;

    // automcomplete-plus
    this.selector = '.source.js';
    this.disableForSelector = '.source.js .comment';
    this.inclusionPriority = 1;
    this.suggestionPriority = _atomTernjsPackageConfig2['default'].options.snippetsFirst ? null : 2;
    this.excludeLowerPriority = _atomTernjsPackageConfig2['default'].options.excludeLowerPriorityProviders;

    this.line = undefined;
    this.lineMatchResult = undefined;
    this.tempPrefix = undefined;
    this.suggestionsArr = undefined;
    this.suggestion = undefined;
    this.suggestionClone = undefined;

    this.registerCommands();
  }

  _createClass(Provider, [{
    key: 'registerCommands',
    value: function registerCommands() {

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:startCompletion', this.forceCompletion.bind(this)));
    }
  }, {
    key: 'isValidPrefix',
    value: function isValidPrefix(prefix, prefixLast) {

      if (prefixLast === undefined) {

        return false;
      }

      if (prefixLast === '\.') {

        return true;
      }

      if (prefixLast.match(/;|\s/)) {

        return false;
      }

      if (prefix.length > 1) {

        prefix = '_' + prefix;
      }

      try {

        new Function('var ' + prefix)();
      } catch (e) {

        return false;
      }

      return true;
    }
  }, {
    key: 'checkPrefix',
    value: function checkPrefix(prefix) {

      if (prefix.match(/(\(|\s|;|\.|\"|\')$/) || prefix.replace(/\s/g, '').length === 0) {

        return '';
      }

      return prefix;
    }
  }, {
    key: 'getPrefix',
    value: function getPrefix(editor, bufferPosition) {

      this.line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      this.lineMatchResult = this.line.match(REGEXP_LINE);

      if (this.lineMatchResult) {

        return this.lineMatchResult[0];
      }
    }
  }, {
    key: 'getSuggestions',
    value: function getSuggestions(_ref) {
      var _this = this;

      var editor = _ref.editor;
      var bufferPosition = _ref.bufferPosition;
      var scopeDescriptor = _ref.scopeDescriptor;
      var prefix = _ref.prefix;
      var activatedManually = _ref.activatedManually;

      return new Promise(function (resolve) {

        if (!_atomTernjsManager2['default'].client) {

          return resolve([]);
        }

        _this.tempPrefix = _this.getPrefix(editor, bufferPosition) || prefix;

        if (!_this.isValidPrefix(_this.tempPrefix, _this.tempPrefix[_this.tempPrefix.length - 1]) && !_this.force && !activatedManually) {

          return resolve([]);
        }

        prefix = _this.checkPrefix(_this.tempPrefix);

        _atomTernjsManager2['default'].client.update(editor).then(function (data) {

          if (!data) {

            return resolve([]);
          }

          _atomTernjsManager2['default'].client.completions(atom.project.relativizePath(editor.getURI())[1], {

            line: bufferPosition.row,
            ch: bufferPosition.column

          }).then(function (data) {

            if (!data) {

              return resolve([]);
            }

            if (!data.completions.length) {

              return resolve([]);
            }

            _this.suggestionsArr = [];

            var scopesPath = scopeDescriptor.getScopesArray();
            var isInFunDef = scopesPath.indexOf('meta.function.js') > -1;

            for (var obj of data.completions) {

              obj = (0, _atomTernjsHelper.formatTypeCompletion)(obj, data.isProperty, data.isObjectKey, isInFunDef);

              _this.suggestion = {

                text: obj.name,
                replacementPrefix: prefix,
                className: null,
                type: obj._typeSelf,
                leftLabel: obj.leftLabel,
                snippet: obj._snippet,
                displayText: obj._displayText,
                description: obj.doc || null,
                descriptionMoreURL: obj.url || null
              };

              if (_atomTernjsPackageConfig2['default'].options.useSnippetsAndFunction && obj._hasParams) {

                _this.suggestionClone = (0, _underscorePlus.clone)(_this.suggestion);
                _this.suggestionClone.type = 'snippet';

                if (obj._hasParams) {

                  _this.suggestion.snippet = obj.name + '(${0:})';
                } else {

                  _this.suggestion.snippet = obj.name + '()';
                }

                _this.suggestionsArr.push(_this.suggestion);
                _this.suggestionsArr.push(_this.suggestionClone);
              } else {

                _this.suggestionsArr.push(_this.suggestion);
              }
            }

            resolve(_this.suggestionsArr);
          })['catch'](function (err) {

            console.error(err);
            resolve([]);
          });
        });
      });
    }
  }, {
    key: 'forceCompletion',
    value: function forceCompletion() {

      this.force = true;
      atom.commands.dispatch(atom.views.getView(atom.workspace.getActiveTextEditor()), 'autocomplete-plus:activate');
      this.force = false;
    }
  }, {
    key: 'destroy',
    value: function destroy() {}
  }]);

  return Provider;
})();

exports['default'] = new Provider();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2lDQUtvQix1QkFBdUI7Ozs7dUNBQ2pCLDhCQUE4Qjs7OztnQ0FHakQsc0JBQXNCOzs4QkFHdEIsaUJBQWlCOztBQVp4QixXQUFXLENBQUM7O0FBRVosSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUM5QyxJQUFNLFdBQVcsR0FBRyxvQ0FBb0MsQ0FBQzs7SUFXbkQsUUFBUTtBQUVELFdBRlAsUUFBUSxHQUVFOzBCQUZWLFFBQVE7O0FBSVYsUUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7O0FBRXRCLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDOzs7QUFHbkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUM7QUFDN0IsUUFBSSxDQUFDLGtCQUFrQixHQUFHLHFCQUFxQixDQUFDO0FBQ2hELFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7QUFDM0IsUUFBSSxDQUFDLGtCQUFrQixHQUFHLHFDQUFjLE9BQU8sQ0FBQyxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUN6RSxRQUFJLENBQUMsb0JBQW9CLEdBQUcscUNBQWMsT0FBTyxDQUFDLDZCQUE2QixDQUFDOztBQUVoRixRQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUN0QixRQUFJLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztBQUNqQyxRQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztBQUM1QixRQUFJLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQztBQUNoQyxRQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztBQUM1QixRQUFJLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FB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QUNKOzs7V0FFYywyQkFBRzs7QUFFaEIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztBQUMvRyxVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjs7O1dBRU0sbUJBQUcsRUFHVDs7O1NBcE1HLFFBQVE7OztxQkF1TUMsSUFBSSxRQUFRLEVBQUUiLCJmaWxlIjoiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmNvbnN0IEZ1bmN0aW9uID0gcmVxdWlyZSgnbG9vcGhvbGUnKS5GdW5jdGlvbjtcbmNvbnN0IFJFR0VYUF9MSU5FID0gLygoW1xcJFxcd10rW1xcdy1dKil8KFsuOjsnXCJbeyggXSspKSQvZztcblxuaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1tYW5hZ2VyJztcbmltcG9ydCBwYWNrYWdlQ29uZmlnIGZyb20gJy4vYXRvbS10ZXJuanMtcGFja2FnZS1jb25maWcnO1xuaW1wb3J0IHtcbiAgZm9ybWF0VHlwZUNvbXBsZXRpb25cbn0gZnJvbSAnLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuaW1wb3J0IHtcbiAgY2xvbmVcbn0gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcblxuY2xhc3MgUHJvdmlkZXIge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuXG4gICAgdGhpcy5mb3JjZSA9IGZhbHNlO1xuXG4gICAgLy8gYXV0b21jb21wbGV0ZS1wbHVzXG4gICAgdGhpcy5zZWxlY3RvciA9ICcuc291cmNlLmpzJztcbiAgICB0aGlzLmRpc2FibGVGb3JTZWxlY3RvciA9ICcuc291cmNlLmpzIC5jb21tZW50JztcbiAgICB0aGlzLmluY2x1c2lvblByaW9yaXR5ID0gMTtcbiAgICB0aGlzLnN1Z2dlc3Rpb25Qcmlvcml0eSA9IHBhY2thZ2VDb25maWcub3B0aW9ucy5zbmlwcGV0c0ZpcnN0ID8gbnVsbCA6IDI7XG4gICAgdGhpcy5leGNsdWRlTG93ZXJQcmlvcml0eSA9IHBhY2thZ2VDb25maWcub3B0aW9ucy5leGNsdWRlTG93ZXJQcmlvcml0eVByb3ZpZGVycztcblxuICAgIHRoaXMubGluZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmxpbmVNYXRjaFJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnRlbXBQcmVmaXggPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zdWdnZXN0aW9uc0FyciA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnN1Z2dlc3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zdWdnZXN0aW9uQ2xvbmUgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLnJlZ2lzdGVyQ29tbWFuZHMoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29tbWFuZHMoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnYXRvbS10ZXJuanM6c3RhcnRDb21wbGV0aW9uJywgdGhpcy5mb3JjZUNvbXBsZXRpb24uYmluZCh0aGlzKSkpO1xuICB9XG5cbiAgaXNWYWxpZFByZWZpeChwcmVmaXgsIHByZWZpeExhc3QpIHtcblxuICAgIGlmIChwcmVmaXhMYXN0ID09PSB1bmRlZmluZWQpIHtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChwcmVmaXhMYXN0ID09PSAnXFwuJykge1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAocHJlZml4TGFzdC5tYXRjaCgvO3xcXHMvKSkge1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHByZWZpeC5sZW5ndGggPiAxKSB7XG5cbiAgICAgIHByZWZpeCA9IGBfJHtwcmVmaXh9YDtcbiAgICB9XG5cbiAgICB0cnkge1xuXG4gICAgICAobmV3IEZ1bmN0aW9uKGB2YXIgJHtwcmVmaXh9YCkpKCk7XG5cbiAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNoZWNrUHJlZml4KHByZWZpeCkge1xuXG4gICAgaWYgKFxuICAgICAgcHJlZml4Lm1hdGNoKC8oXFwofFxcc3w7fFxcLnxcXFwifFxcJykkLykgfHxcbiAgICAgIHByZWZpeC5yZXBsYWNlKC9cXHMvZywgJycpLmxlbmd0aCA9PT0gMFxuICAgICkge1xuXG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByZWZpeDtcbiAgfVxuXG4gIGdldFByZWZpeChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSB7XG5cbiAgICB0aGlzLmxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pO1xuICAgIHRoaXMubGluZU1hdGNoUmVzdWx0ID0gdGhpcy5saW5lLm1hdGNoKFJFR0VYUF9MSU5FKTtcblxuICAgIGlmICh0aGlzLmxpbmVNYXRjaFJlc3VsdCkge1xuXG4gICAgICByZXR1cm4gdGhpcy5saW5lTWF0Y2hSZXN1bHRbMF07XG4gICAgfVxuICB9XG5cbiAgZ2V0U3VnZ2VzdGlvbnMoe2VkaXRvciwgYnVmZmVyUG9zaXRpb24sIHNjb3BlRGVzY3JpcHRvciwgcHJlZml4LCBhY3RpdmF0ZWRNYW51YWxseX0pIHtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXG4gICAgICBpZiAoIW1hbmFnZXIuY2xpZW50KSB7XG5cbiAgICAgICAgcmV0dXJuIHJlc29sdmUoW10pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRlbXBQcmVmaXggPSB0aGlzLmdldFByZWZpeChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSB8fCBwcmVmaXg7XG5cbiAgICAgIGlmICghdGhpcy5pc1ZhbGlkUHJlZml4KHRoaXMudGVtcFByZWZpeCwgdGhpcy50ZW1wUHJlZml4W3RoaXMudGVtcFByZWZpeC5sZW5ndGggLSAxXSkgJiYgIXRoaXMuZm9yY2UgJiYgIWFjdGl2YXRlZE1hbnVhbGx5KSB7XG5cbiAgICAgICAgcmV0dXJuIHJlc29sdmUoW10pO1xuICAgICAgfVxuXG4gICAgICBwcmVmaXggPSB0aGlzLmNoZWNrUHJlZml4KHRoaXMudGVtcFByZWZpeCk7XG5cbiAgICAgIG1hbmFnZXIuY2xpZW50LnVwZGF0ZShlZGl0b3IpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcblxuICAgICAgICAgIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hbmFnZXIuY2xpZW50LmNvbXBsZXRpb25zKGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChlZGl0b3IuZ2V0VVJJKCkpWzFdLCB7XG5cbiAgICAgICAgICBsaW5lOiBidWZmZXJQb3NpdGlvbi5yb3csXG4gICAgICAgICAgY2g6IGJ1ZmZlclBvc2l0aW9uLmNvbHVtblxuXG4gICAgICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICAgIGlmICghZGF0YSkge1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShbXSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFkYXRhLmNvbXBsZXRpb25zLmxlbmd0aCkge1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShbXSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5zdWdnZXN0aW9uc0FyciA9IFtdO1xuXG4gICAgICAgICAgbGV0IHNjb3Blc1BhdGggPSBzY29wZURlc2NyaXB0b3IuZ2V0U2NvcGVzQXJyYXkoKTtcbiAgICAgICAgICBsZXQgaXNJbkZ1bkRlZiA9IHNjb3Blc1BhdGguaW5kZXhPZignbWV0YS5mdW5jdGlvbi5qcycpID4gLTE7XG5cbiAgICAgICAgICBmb3IgKGxldCBvYmogb2YgZGF0YS5jb21wbGV0aW9ucykge1xuXG4gICAgICAgICAgICBvYmogPSBmb3JtYXRUeXBlQ29tcGxldGlvbihvYmosIGRhdGEuaXNQcm9wZXJ0eSwgZGF0YS5pc09iamVjdEtleSwgaXNJbkZ1bkRlZik7XG5cbiAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbiA9IHtcblxuICAgICAgICAgICAgICB0ZXh0OiBvYmoubmFtZSxcbiAgICAgICAgICAgICAgcmVwbGFjZW1lbnRQcmVmaXg6IHByZWZpeCxcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBudWxsLFxuICAgICAgICAgICAgICB0eXBlOiBvYmouX3R5cGVTZWxmLFxuICAgICAgICAgICAgICBsZWZ0TGFiZWw6IG9iai5sZWZ0TGFiZWwsXG4gICAgICAgICAgICAgIHNuaXBwZXQ6IG9iai5fc25pcHBldCxcbiAgICAgICAgICAgICAgZGlzcGxheVRleHQ6IG9iai5fZGlzcGxheVRleHQsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBvYmouZG9jIHx8IG51bGwsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uTW9yZVVSTDogb2JqLnVybCB8fCBudWxsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAocGFja2FnZUNvbmZpZy5vcHRpb25zLnVzZVNuaXBwZXRzQW5kRnVuY3Rpb24gJiYgb2JqLl9oYXNQYXJhbXMpIHtcblxuICAgICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25DbG9uZSA9IGNsb25lKHRoaXMuc3VnZ2VzdGlvbik7XG4gICAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbkNsb25lLnR5cGUgPSAnc25pcHBldCc7XG5cbiAgICAgICAgICAgICAgaWYgKG9iai5faGFzUGFyYW1zKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb24uc25pcHBldCA9IGAke29iai5uYW1lfSgkXFx7MDpcXH0pYDtcblxuICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uLnNuaXBwZXQgPSBgJHtvYmoubmFtZX0oKWA7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zQXJyLnB1c2godGhpcy5zdWdnZXN0aW9uKTtcbiAgICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uc0Fyci5wdXNoKHRoaXMuc3VnZ2VzdGlvbkNsb25lKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zQXJyLnB1c2godGhpcy5zdWdnZXN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXNvbHZlKHRoaXMuc3VnZ2VzdGlvbnNBcnIpO1xuXG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcblxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICByZXNvbHZlKFtdKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZvcmNlQ29tcGxldGlvbigpIHtcblxuICAgIHRoaXMuZm9yY2UgPSB0cnVlO1xuICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSksICdhdXRvY29tcGxldGUtcGx1czphY3RpdmF0ZScpO1xuICAgIHRoaXMuZm9yY2UgPSBmYWxzZTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cblxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBQcm92aWRlcigpO1xuIl19