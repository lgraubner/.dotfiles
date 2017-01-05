(function() {
  var AtomReact, CompositeDisposable, Disposable, autoCompleteTagCloseRegex, autoCompleteTagStartRegex, contentCheckRegex, decreaseIndentForNextLinePattern, defaultDetectReactFilePattern, jsxComplexAttributePattern, jsxTagStartPattern, ref;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable;

  contentCheckRegex = null;

  defaultDetectReactFilePattern = '/((require\\([\'"]react(?:(-native|\\/addons))?[\'"]\\)))|(import\\s+[\\w{},\\s]+\\s+from\\s+[\'"]react(?:(-native|\\/addons))?[\'"])/';

  autoCompleteTagStartRegex = /(<)([a-zA-Z0-9\.:$_]+)/g;

  autoCompleteTagCloseRegex = /(<\/)([^>]+)(>)/g;

  jsxTagStartPattern = '(?x)((^|=|return)\\s*<([^!/?](?!.+?(</.+?>))))';

  jsxComplexAttributePattern = '(?x)\\{ [^}"\']* $|\\( [^)"\']* $';

  decreaseIndentForNextLinePattern = '(?x) />\\s*(,|;)?\\s*$ | ^(?!\\s*\\?)\\s*\\S+.*</[-_\\.A-Za-z0-9]+>$';

  AtomReact = (function() {
    AtomReact.prototype.config = {
      enabledForAllJavascriptFiles: {
        type: 'boolean',
        "default": false,
        description: 'Enable grammar, snippets and other features automatically for all .js files.'
      },
      disableAutoClose: {
        type: 'boolean',
        "default": false,
        description: 'Disabled tag autocompletion'
      },
      detectReactFilePattern: {
        type: 'string',
        "default": defaultDetectReactFilePattern
      },
      jsxTagStartPattern: {
        type: 'string',
        "default": jsxTagStartPattern
      },
      jsxComplexAttributePattern: {
        type: 'string',
        "default": jsxComplexAttributePattern
      },
      decreaseIndentForNextLinePattern: {
        type: 'string',
        "default": decreaseIndentForNextLinePattern
      }
    };

    function AtomReact() {}

    AtomReact.prototype.patchEditorLangModeAutoDecreaseIndentForBufferRow = function(editor) {
      var fn, self;
      self = this;
      fn = editor.languageMode.autoDecreaseIndentForBufferRow;
      if (fn.jsxPatch) {
        return;
      }
      return editor.languageMode.autoDecreaseIndentForBufferRow = function(bufferRow, options) {
        var currentIndentLevel, decreaseIndentRegex, decreaseNextLineIndentRegex, desiredIndentLevel, increaseIndentRegex, line, precedingLine, precedingRow, scopeDescriptor;
        if (editor.getGrammar().scopeName !== "source.js.jsx") {
          return fn.call(editor.languageMode, bufferRow, options);
        }
        scopeDescriptor = this.editor.scopeDescriptorForBufferPosition([bufferRow, 0]);
        decreaseNextLineIndentRegex = this.cacheRegex(atom.config.get('react.decreaseIndentForNextLinePattern') || decreaseIndentForNextLinePattern);
        decreaseIndentRegex = this.decreaseIndentRegexForScopeDescriptor(scopeDescriptor);
        increaseIndentRegex = this.increaseIndentRegexForScopeDescriptor(scopeDescriptor);
        precedingRow = this.buffer.previousNonBlankRow(bufferRow);
        if (precedingRow < 0) {
          return;
        }
        precedingLine = this.buffer.lineForRow(precedingRow);
        line = this.buffer.lineForRow(bufferRow);
        if (precedingLine && decreaseNextLineIndentRegex.testSync(precedingLine) && !(increaseIndentRegex && increaseIndentRegex.testSync(precedingLine)) && !this.editor.isBufferRowCommented(precedingRow)) {
          currentIndentLevel = this.editor.indentationForBufferRow(precedingRow);
          if (decreaseIndentRegex && decreaseIndentRegex.testSync(line)) {
            currentIndentLevel -= 1;
          }
          desiredIndentLevel = currentIndentLevel - 1;
          if (desiredIndentLevel >= 0 && desiredIndentLevel < currentIndentLevel) {
            return this.editor.setIndentationForBufferRow(bufferRow, desiredIndentLevel);
          }
        } else if (!this.editor.isBufferRowCommented(bufferRow)) {
          return fn.call(editor.languageMode, bufferRow, options);
        }
      };
    };

    AtomReact.prototype.patchEditorLangModeSuggestedIndentForBufferRow = function(editor) {
      var fn, self;
      self = this;
      fn = editor.languageMode.suggestedIndentForBufferRow;
      if (fn.jsxPatch) {
        return;
      }
      return editor.languageMode.suggestedIndentForBufferRow = function(bufferRow, options) {
        var complexAttributeRegex, decreaseIndentRegex, decreaseIndentTest, decreaseNextLineIndentRegex, increaseIndentRegex, indent, precedingLine, precedingRow, scopeDescriptor, tagStartRegex, tagStartTest;
        indent = fn.call(editor.languageMode, bufferRow, options);
        if (!(editor.getGrammar().scopeName === "source.js.jsx" && bufferRow > 1)) {
          return indent;
        }
        scopeDescriptor = this.editor.scopeDescriptorForBufferPosition([bufferRow, 0]);
        decreaseNextLineIndentRegex = this.cacheRegex(atom.config.get('react.decreaseIndentForNextLinePattern') || decreaseIndentForNextLinePattern);
        increaseIndentRegex = this.increaseIndentRegexForScopeDescriptor(scopeDescriptor);
        decreaseIndentRegex = this.decreaseIndentRegexForScopeDescriptor(scopeDescriptor);
        tagStartRegex = this.cacheRegex(atom.config.get('react.jsxTagStartPattern') || jsxTagStartPattern);
        complexAttributeRegex = this.cacheRegex(atom.config.get('react.jsxComplexAttributePattern') || jsxComplexAttributePattern);
        precedingRow = this.buffer.previousNonBlankRow(bufferRow);
        if (precedingRow < 0) {
          return indent;
        }
        precedingLine = this.buffer.lineForRow(precedingRow);
        if (precedingLine == null) {
          return indent;
        }
        if (this.editor.isBufferRowCommented(bufferRow) && this.editor.isBufferRowCommented(precedingRow)) {
          return this.editor.indentationForBufferRow(precedingRow);
        }
        tagStartTest = tagStartRegex.testSync(precedingLine);
        decreaseIndentTest = decreaseIndentRegex.testSync(precedingLine);
        if (tagStartTest && complexAttributeRegex.testSync(precedingLine) && !this.editor.isBufferRowCommented(precedingRow)) {
          indent += 1;
        }
        if (precedingLine && !decreaseIndentTest && decreaseNextLineIndentRegex.testSync(precedingLine) && !this.editor.isBufferRowCommented(precedingRow)) {
          indent -= 1;
        }
        return Math.max(indent, 0);
      };
    };

    AtomReact.prototype.patchEditorLangMode = function(editor) {
      var ref1, ref2;
      if ((ref1 = this.patchEditorLangModeSuggestedIndentForBufferRow(editor)) != null) {
        ref1.jsxPatch = true;
      }
      return (ref2 = this.patchEditorLangModeAutoDecreaseIndentForBufferRow(editor)) != null ? ref2.jsxPatch = true : void 0;
    };

    AtomReact.prototype.isReact = function(text) {
      var match;
      if (atom.config.get('react.enabledForAllJavascriptFiles')) {
        return true;
      }
      if (contentCheckRegex == null) {
        match = (atom.config.get('react.detectReactFilePattern') || defaultDetectReactFilePattern).match(new RegExp('^/(.*?)/([gimy]*)$'));
        contentCheckRegex = new RegExp(match[1], match[2]);
      }
      return text.match(contentCheckRegex) != null;
    };

    AtomReact.prototype.isReactEnabledForEditor = function(editor) {
      var ref1;
      return (editor != null) && ((ref1 = editor.getGrammar().scopeName) === "source.js.jsx" || ref1 === "source.coffee.jsx");
    };

    AtomReact.prototype.autoSetGrammar = function(editor) {
      var extName, jsxGrammar, path;
      if (this.isReactEnabledForEditor(editor)) {
        return;
      }
      path = require('path');
      extName = path.extname(editor.getPath() || '');
      if (extName === ".jsx" || ((extName === ".js" || extName === ".es6") && this.isReact(editor.getText()))) {
        jsxGrammar = atom.grammars.grammarsByScopeName["source.js.jsx"];
        if (jsxGrammar) {
          return editor.setGrammar(jsxGrammar);
        }
      }
    };

    AtomReact.prototype.onHTMLToJSX = function() {
      var HTMLtoJSX, converter, editor, jsxformat, selections;
      jsxformat = require('jsxformat');
      HTMLtoJSX = require('./htmltojsx');
      converter = new HTMLtoJSX({
        createClass: false
      });
      editor = atom.workspace.getActiveTextEditor();
      if (!this.isReactEnabledForEditor(editor)) {
        return;
      }
      selections = editor.getSelections();
      return editor.transact((function(_this) {
        return function() {
          var i, jsxOutput, len, range, results, selection, selectionText;
          results = [];
          for (i = 0, len = selections.length; i < len; i++) {
            selection = selections[i];
            try {
              selectionText = selection.getText();
              jsxOutput = converter.convert(selectionText);
              try {
                jsxformat.setOptions({});
                jsxOutput = jsxformat.format(jsxOutput);
              } catch (error) {}
              selection.insertText(jsxOutput);
              range = selection.getBufferRange();
              results.push(editor.autoIndentBufferRows(range.start.row, range.end.row));
            } catch (error) {}
          }
          return results;
        };
      })(this));
    };

    AtomReact.prototype.onReformat = function() {
      var _, editor, jsxformat, selections;
      jsxformat = require('jsxformat');
      _ = require('lodash');
      editor = atom.workspace.getActiveTextEditor();
      if (!this.isReactEnabledForEditor(editor)) {
        return;
      }
      selections = editor.getSelections();
      return editor.transact((function(_this) {
        return function() {
          var bufEnd, bufStart, err, firstChangedLine, i, lastChangedLine, len, newLineCount, original, originalLineCount, range, result, results, selection, serializedRange;
          results = [];
          for (i = 0, len = selections.length; i < len; i++) {
            selection = selections[i];
            try {
              range = selection.getBufferRange();
              serializedRange = range.serialize();
              bufStart = serializedRange[0];
              bufEnd = serializedRange[1];
              jsxformat.setOptions({});
              result = jsxformat.format(selection.getText());
              originalLineCount = editor.getLineCount();
              selection.insertText(result);
              newLineCount = editor.getLineCount();
              editor.autoIndentBufferRows(bufStart[0], bufEnd[0] + (newLineCount - originalLineCount));
              results.push(editor.setCursorBufferPosition(bufStart));
            } catch (error) {
              err = error;
              range = selection.getBufferRange().serialize();
              range[0][0]++;
              range[1][0]++;
              jsxformat.setOptions({
                range: range
              });
              original = editor.getText();
              try {
                result = jsxformat.format(original);
                selection.clear();
                originalLineCount = editor.getLineCount();
                editor.setText(result);
                newLineCount = editor.getLineCount();
                firstChangedLine = range[0][0] - 1;
                lastChangedLine = range[1][0] - 1 + (newLineCount - originalLineCount);
                editor.autoIndentBufferRows(firstChangedLine, lastChangedLine);
                results.push(editor.setCursorBufferPosition([firstChangedLine, range[0][1]]));
              } catch (error) {}
            }
          }
          return results;
        };
      })(this));
    };

    AtomReact.prototype.autoCloseTag = function(eventObj, editor) {
      var fullLine, lastLine, lastLineSpaces, line, lines, match, ref1, ref2, rest, row, serializedEndPoint, tagName, token, tokenizedLine;
      if (atom.config.get('react.disableAutoClose')) {
        return;
      }
      if (!this.isReactEnabledForEditor(editor) || editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      if ((eventObj != null ? eventObj.newText : void 0) === '>' && !eventObj.oldText) {
        if (editor.getCursorBufferPositions().length > 1) {
          return;
        }
        tokenizedLine = (ref1 = editor.tokenizedBuffer) != null ? ref1.tokenizedLineForRow(eventObj.newRange.end.row) : void 0;
        if (tokenizedLine == null) {
          return;
        }
        token = tokenizedLine.tokenAtBufferColumn(eventObj.newRange.end.column - 1);
        if ((token == null) || token.scopes.indexOf('tag.open.js') === -1 || token.scopes.indexOf('punctuation.definition.tag.end.js') === -1) {
          return;
        }
        lines = editor.buffer.getLines();
        row = eventObj.newRange.end.row;
        line = lines[row];
        line = line.substr(0, eventObj.newRange.end.column);
        if (line.substr(line.length - 2, 1) === '/') {
          return;
        }
        tagName = null;
        while ((line != null) && (tagName == null)) {
          match = line.match(autoCompleteTagStartRegex);
          if ((match != null) && match.length > 0) {
            tagName = match.pop().substr(1);
          }
          row--;
          line = lines[row];
        }
        if (tagName != null) {
          editor.insertText('</' + tagName + '>', {
            undo: 'skip'
          });
          return editor.setCursorBufferPosition(eventObj.newRange.end);
        }
      } else if ((eventObj != null ? eventObj.oldText : void 0) === '>' && (eventObj != null ? eventObj.newText : void 0) === '') {
        lines = editor.buffer.getLines();
        row = eventObj.newRange.end.row;
        fullLine = lines[row];
        tokenizedLine = (ref2 = editor.tokenizedBuffer) != null ? ref2.tokenizedLineForRow(eventObj.newRange.end.row) : void 0;
        if (tokenizedLine == null) {
          return;
        }
        token = tokenizedLine.tokenAtBufferColumn(eventObj.newRange.end.column - 1);
        if ((token == null) || token.scopes.indexOf('tag.open.js') === -1) {
          return;
        }
        line = fullLine.substr(0, eventObj.newRange.end.column);
        if (line.substr(line.length - 1, 1) === '/') {
          return;
        }
        tagName = null;
        while ((line != null) && (tagName == null)) {
          match = line.match(autoCompleteTagStartRegex);
          if ((match != null) && match.length > 0) {
            tagName = match.pop().substr(1);
          }
          row--;
          line = lines[row];
        }
        if (tagName != null) {
          rest = fullLine.substr(eventObj.newRange.end.column);
          if (rest.indexOf('</' + tagName + '>') === 0) {
            serializedEndPoint = [eventObj.newRange.end.row, eventObj.newRange.end.column];
            return editor.setTextInBufferRange([serializedEndPoint, [serializedEndPoint[0], serializedEndPoint[1] + tagName.length + 3]], '', {
              undo: 'skip'
            });
          }
        }
      } else if ((eventObj != null ? eventObj.newText : void 0) === '\n') {
        lines = editor.buffer.getLines();
        row = eventObj.newRange.end.row;
        lastLine = lines[row - 1];
        fullLine = lines[row];
        if (/>$/.test(lastLine) && fullLine.search(autoCompleteTagCloseRegex) === 0) {
          while (lastLine != null) {
            match = lastLine.match(autoCompleteTagStartRegex);
            if ((match != null) && match.length > 0) {
              break;
            }
            row--;
            lastLine = lines[row];
          }
          lastLineSpaces = lastLine.match(/^\s*/);
          lastLineSpaces = lastLineSpaces != null ? lastLineSpaces[0] : '';
          editor.insertText('\n' + lastLineSpaces);
          return editor.setCursorBufferPosition(eventObj.newRange.end);
        }
      }
    };

    AtomReact.prototype.processEditor = function(editor) {
      var disposableBufferEvent;
      this.patchEditorLangMode(editor);
      this.autoSetGrammar(editor);
      disposableBufferEvent = editor.buffer.onDidChange((function(_this) {
        return function(e) {
          return _this.autoCloseTag(e, editor);
        };
      })(this));
      this.disposables.add(editor.onDidDestroy((function(_this) {
        return function() {
          return disposableBufferEvent.dispose();
        };
      })(this)));
      return this.disposables.add(disposableBufferEvent);
    };

    AtomReact.prototype.deactivate = function() {
      return this.disposables.dispose();
    };

    AtomReact.prototype.activate = function() {
      var disposableConfigListener, disposableHTMLTOJSX, disposableProcessEditor, disposableReformat;
      this.disposables = new CompositeDisposable();
      disposableConfigListener = atom.config.observe('react.detectReactFilePattern', function(newValue) {
        return contentCheckRegex = null;
      });
      disposableReformat = atom.commands.add('atom-workspace', 'react:reformat-JSX', (function(_this) {
        return function() {
          return _this.onReformat();
        };
      })(this));
      disposableHTMLTOJSX = atom.commands.add('atom-workspace', 'react:HTML-to-JSX', (function(_this) {
        return function() {
          return _this.onHTMLToJSX();
        };
      })(this));
      disposableProcessEditor = atom.workspace.observeTextEditors(this.processEditor.bind(this));
      this.disposables.add(disposableConfigListener);
      this.disposables.add(disposableReformat);
      this.disposables.add(disposableHTMLTOJSX);
      return this.disposables.add(disposableProcessEditor);
    };

    return AtomReact;

  })();

  module.exports = AtomReact;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcmVhY3QvbGliL2F0b20tcmVhY3QuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDZDQUFELEVBQXNCOztFQUV0QixpQkFBQSxHQUFvQjs7RUFDcEIsNkJBQUEsR0FBZ0M7O0VBQ2hDLHlCQUFBLEdBQTRCOztFQUM1Qix5QkFBQSxHQUE0Qjs7RUFFNUIsa0JBQUEsR0FBcUI7O0VBQ3JCLDBCQUFBLEdBQTZCOztFQUM3QixnQ0FBQSxHQUFtQzs7RUFJN0I7d0JBQ0osTUFBQSxHQUNFO01BQUEsNEJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLDhFQUZiO09BREY7TUFJQSxnQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsNkJBRmI7T0FMRjtNQVFBLHNCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsNkJBRFQ7T0FURjtNQVdBLGtCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsa0JBRFQ7T0FaRjtNQWNBLDBCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsMEJBRFQ7T0FmRjtNQWlCQSxnQ0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGdDQURUO09BbEJGOzs7SUFxQlcsbUJBQUEsR0FBQTs7d0JBQ2IsaURBQUEsR0FBbUQsU0FBQyxNQUFE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QUFBLENBQUEsQ0FBQSxJQUFBLENBQXpEO01BQ3RCLHVCQUFBLEdBQTBCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsSUFBQyxDQUFBLGFBQWEsQ0FBQyxJQUFmLENBQW9CLElBQXBCLENBQWxDO01BRTFCLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQix3QkFBakI7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsa0JBQWpCO01BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLG1CQUFqQjthQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQix1QkFBakI7SUFoQlE7Ozs7OztFQW1CWixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQWpWakIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5jb250ZW50Q2hlY2tSZWdleCA9IG51bGxcbmRlZmF1bHREZXRlY3RSZWFjdEZpbGVQYXR0ZXJuID0gJy8oKHJlcXVpcmVcXFxcKFtcXCdcIl1yZWFjdCg/OigtbmF0aXZlfFxcXFwvYWRkb25zKSk/W1xcJ1wiXVxcXFwpKSl8KGltcG9ydFxcXFxzK1tcXFxcd3t9LFxcXFxzXStcXFxccytmcm9tXFxcXHMrW1xcJ1wiXXJlYWN0KD86KC1uYXRpdmV8XFxcXC9hZGRvbnMpKT9bXFwnXCJdKS8nXG5hdXRvQ29tcGxldGVUYWdTdGFydFJlZ2V4ID0gLyg8KShbYS16QS1aMC05XFwuOiRfXSspL2dcbmF1dG9Db21wbGV0ZVRhZ0Nsb3NlUmVnZXggPSAvKDxcXC8pKFtePl0rKSg+KS9nXG5cbmpzeFRhZ1N0YXJ0UGF0dGVybiA9ICcoP3gpKChefD18cmV0dXJuKVxcXFxzKjwoW14hLz9dKD8hLis/KDwvLis/PikpKSknXG5qc3hDb21wbGV4QXR0cmlidXRlUGF0dGVybiA9ICcoP3gpXFxcXHsgW159XCJcXCddKiAkfFxcXFwoIFteKVwiXFwnXSogJCdcbmRlY3JlYXNlSW5kZW50Rm9yTmV4dExpbmVQYXR0ZXJuID0gJyg/eClcbi8+XFxcXHMqKCx8Oyk/XFxcXHMqJFxufCBeKD8hXFxcXHMqXFxcXD8pXFxcXHMqXFxcXFMrLio8L1stX1xcXFwuQS1aYS16MC05XSs+JCdcblxuY2xhc3MgQXRvbVJlYWN0XG4gIGNvbmZpZzpcbiAgICBlbmFibGVkRm9yQWxsSmF2YXNjcmlwdEZpbGVzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246ICdFbmFibGUgZ3JhbW1hciwgc25pcHBldHMgYW5kIG90aGVyIGZlYXR1cmVzIGF1dG9tYXRpY2FsbHkgZm9yIGFsbCAuanMgZmlsZXMuJ1xuICAgIGRpc2FibGVBdXRvQ2xvc2U6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogJ0Rpc2FibGVkIHRhZyBhdXRvY29tcGxldGlvbidcbiAgICBkZXRlY3RSZWFjdEZpbGVQYXR0ZXJuOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IGRlZmF1bHREZXRlY3RSZWFjdEZpbGVQYXR0ZXJuXG4gICAganN4VGFnU3RhcnRQYXR0ZXJuOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IGpzeFRhZ1N0YXJ0UGF0dGVyblxuICAgIGpzeENvbXBsZXhBdHRyaWJ1dGVQYXR0ZXJuOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IGpzeENvbXBsZXhBdHRyaWJ1dGVQYXR0ZXJuXG4gICAgZGVjcmVhc2VJbmRlbnRGb3JOZXh0TGluZVBhdHRlcm46XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogZGVjcmVhc2VJbmRlbnRGb3JOZXh0TGluZVBhdHRlcm5cblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgcGF0Y2hFZGl0b3JMYW5nTW9kZUF1dG9EZWNyZWFzZUluZGVudEZvckJ1ZmZlclJvdzogKGVkaXRvcikgLT5cbiAgICBzZWxmID0gdGhpc1xuICAgIGZuID0gZWRpdG9yLmxhbmd1YWdlTW9kZS5hdXRvRGVjcmVhc2VJbmRlbnRGb3JCdWZmZXJSb3dcbiAgICByZXR1cm4gaWYgZm4uanN4UGF0Y2hcblxuICAgIGVkaXRvci5sYW5ndWFnZU1vZGUuYXV0b0RlY3JlYXNlSW5kZW50Rm9yQnVmZmVyUm93ID0gKGJ1ZmZlclJvdywgb3B0aW9ucykgLT5cbiAgICAgIHJldHVybiBmbi5jYWxsKGVkaXRvci5sYW5ndWFnZU1vZGUsIGJ1ZmZlclJvdywgb3B0aW9ucykgdW5sZXNzIGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lID09IFwic291cmNlLmpzLmpzeFwiXG5cbiAgICAgIHNjb3BlRGVzY3JpcHRvciA9IEBlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oW2J1ZmZlclJvdywgMF0pXG4gICAgICBkZWNyZWFzZU5leHRMaW5lSW5kZW50UmVnZXggPSBAY2FjaGVSZWdleChhdG9tLmNvbmZpZy5nZXQoJ3JlYWN0LmRlY3JlYXNlSW5kZW50Rm9yTmV4dExpbmVQYXR0ZXJuJykgfHzCoGRlY3JlYXNlSW5kZW50Rm9yTmV4dExpbmVQYXR0ZXJuKVxuICAgICAgZGVjcmVhc2VJbmRlbnRSZWdleCA9IEBkZWNyZWFzZUluZGVudFJlZ2V4Rm9yU2NvcGVEZXNjcmlwdG9yKHNjb3BlRGVzY3JpcHRvcilcbiAgICAgIGluY3JlYXNlSW5kZW50UmVnZXggPSBAaW5jcmVhc2VJbmRlbnRSZWdleEZvclNjb3BlRGVzY3JpcHRvcihzY29wZURlc2NyaXB0b3IpXG5cbiAgICAgIHByZWNlZGluZ1JvdyA9IEBidWZmZXIucHJldmlvdXNOb25CbGFua1JvdyhidWZmZXJSb3cpXG5cbiAgICAgIHJldHVybiBpZiBwcmVjZWRpbmdSb3cgPCAwXG5cbiAgICAgIHByZWNlZGluZ0xpbmUgPSBAYnVmZmVyLmxpbmVGb3JSb3cocHJlY2VkaW5nUm93KVxuICAgICAgbGluZSA9IEBidWZmZXIubGluZUZvclJvdyhidWZmZXJSb3cpXG5cbiAgICAgIGlmIHByZWNlZGluZ0xpbmUgYW5kIGRlY3JlYXNlTmV4dExpbmVJbmRlbnRSZWdleC50ZXN0U3luYyhwcmVjZWRpbmdMaW5lKSBhbmRcbiAgICAgICAgIG5vdCAoaW5jcmVhc2VJbmRlbnRSZWdleCBhbmQgaW5jcmVhc2VJbmRlbnRSZWdleC50ZXN0U3luYyhwcmVjZWRpbmdMaW5lKSkgYW5kXG4gICAgICAgICBub3QgQGVkaXRvci5pc0J1ZmZlclJvd0NvbW1lbnRlZChwcmVjZWRpbmdSb3cpXG4gICAgICAgIGN1cnJlbnRJbmRlbnRMZXZlbCA9IEBlZGl0b3IuaW5kZW50YXRpb25Gb3JCdWZmZXJSb3cocHJlY2VkaW5nUm93KVxuICAgICAgICBjdXJyZW50SW5kZW50TGV2ZWwgLT0gMSBpZiBkZWNyZWFzZUluZGVudFJlZ2V4IGFuZCBkZWNyZWFzZUluZGVudFJlZ2V4LnRlc3RTeW5jKGxpbmUpXG4gICAgICAgIGRlc2lyZWRJbmRlbnRMZXZlbCA9IGN1cnJlbnRJbmRlbnRMZXZlbCAtIDFcbiAgICAgICAgaWYgZGVzaXJlZEluZGVudExldmVsID49IDAgYW5kIGRlc2lyZWRJbmRlbnRMZXZlbCA8IGN1cnJlbnRJbmRlbnRMZXZlbFxuICAgICAgICAgIEBlZGl0b3Iuc2V0SW5kZW50YXRpb25Gb3JCdWZmZXJSb3coYnVmZmVyUm93LCBkZXNpcmVkSW5kZW50TGV2ZWwpXG4gICAgICBlbHNlIGlmIG5vdCBAZWRpdG9yLmlzQnVmZmVyUm93Q29tbWVudGVkKGJ1ZmZlclJvdylcbiAgICAgICAgZm4uY2FsbChlZGl0b3IubGFuZ3VhZ2VNb2RlLCBidWZmZXJSb3csIG9wdGlvbnMpXG5cbiAgcGF0Y2hFZGl0b3JMYW5nTW9kZVN1Z2dlc3RlZEluZGVudEZvckJ1ZmZlclJvdzogKGVkaXRvcikgLT5cbiAgICBzZWxmID0gdGhpc1xuICAgIGZuID0gZWRpdG9yLmxhbmd1YWdlTW9kZS5zdWdnZXN0ZWRJbmRlbnRGb3JCdWZmZXJSb3dcbiAgICByZXR1cm4gaWYgZm4uanN4UGF0Y2hcblxuICAgIGVkaXRvci5sYW5ndWFnZU1vZGUuc3VnZ2VzdGVkSW5kZW50Rm9yQnVmZmVyUm93ID0gKGJ1ZmZlclJvdywgb3B0aW9ucykgLT5cbiAgICAgIGluZGVudCA9IGZuLmNhbGwoZWRpdG9yLmxhbmd1YWdlTW9kZSwgYnVmZmVyUm93LCBvcHRpb25zKVxuICAgICAgcmV0dXJuIGluZGVudCB1bmxlc3MgZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUgPT0gXCJzb3VyY2UuanMuanN4XCIgYW5kIGJ1ZmZlclJvdyA+IDFcblxuICAgICAgc2NvcGVEZXNjcmlwdG9yID0gQGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihbYnVmZmVyUm93LCAwXSlcblxuICAgICAgZGVjcmVhc2VOZXh0TGluZUluZGVudFJlZ2V4ID0gQGNhY2hlUmVnZXgoYXRvbS5jb25maWcuZ2V0KCdyZWFjdC5kZWNyZWFzZUluZGVudEZvck5leHRMaW5lUGF0dGVybicpIHx8wqBkZWNyZWFzZUluZGVudEZvck5leHRMaW5lUGF0dGVybilcbiAgICAgIGluY3JlYXNlSW5kZW50UmVnZXggPSBAaW5jcmVhc2VJbmRlbnRSZWdleEZvclNjb3BlRGVzY3JpcHRvcihzY29wZURlc2NyaXB0b3IpXG5cbiAgICAgIGRlY3JlYXNlSW5kZW50UmVnZXggPSBAZGVjcmVhc2VJbmRlbnRSZWdleEZvclNjb3BlRGVzY3JpcHRvcihzY29wZURlc2NyaXB0b3IpXG4gICAgICB0YWdTdGFydFJlZ2V4ID0gQGNhY2hlUmVnZXgoYXRvbS5jb25maWcuZ2V0KCdyZWFjdC5qc3hUYWdTdGFydFBhdHRlcm4nKSB8fMKganN4VGFnU3RhcnRQYXR0ZXJuKVxuICAgICAgY29tcGxleEF0dHJpYnV0ZVJlZ2V4ID0gQGNhY2hlUmVnZXgoYXRvbS5jb25maWcuZ2V0KCdyZWFjdC5qc3hDb21wbGV4QXR0cmlidXRlUGF0dGVybicpIHx8wqBqc3hDb21wbGV4QXR0cmlidXRlUGF0dGVybilcblxuICAgICAgcHJlY2VkaW5nUm93ID0gQGJ1ZmZlci5wcmV2aW91c05vbkJsYW5rUm93KGJ1ZmZlclJvdylcblxuICAgICAgcmV0dXJuIGluZGVudCBpZiBwcmVjZWRpbmdSb3cgPCAwXG5cbiAgICAgIHByZWNlZGluZ0xpbmUgPSBAYnVmZmVyLmxpbmVGb3JSb3cocHJlY2VkaW5nUm93KVxuXG4gICAgICByZXR1cm4gaW5kZW50IGlmIG5vdCBwcmVjZWRpbmdMaW5lP1xuXG4gICAgICBpZiBAZWRpdG9yLmlzQnVmZmVyUm93Q29tbWVudGVkKGJ1ZmZlclJvdykgYW5kIEBlZGl0b3IuaXNCdWZmZXJSb3dDb21tZW50ZWQocHJlY2VkaW5nUm93KVxuICAgICAgICByZXR1cm4gQGVkaXRvci5pbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhwcmVjZWRpbmdSb3cpXG5cbiAgICAgIHRhZ1N0YXJ0VGVzdCA9IHRhZ1N0YXJ0UmVnZXgudGVzdFN5bmMocHJlY2VkaW5nTGluZSlcbiAgICAgIGRlY3JlYXNlSW5kZW50VGVzdCA9IGRlY3JlYXNlSW5kZW50UmVnZXgudGVzdFN5bmMocHJlY2VkaW5nTGluZSlcblxuICAgICAgaW5kZW50ICs9IDEgaWYgdGFnU3RhcnRUZXN0IGFuZCBjb21wbGV4QXR0cmlidXRlUmVnZXgudGVzdFN5bmMocHJlY2VkaW5nTGluZSkgYW5kIG5vdCBAZWRpdG9yLmlzQnVmZmVyUm93Q29tbWVudGVkKHByZWNlZGluZ1JvdylcbiAgICAgIGluZGVudCAtPSAxIGlmIHByZWNlZGluZ0xpbmUgYW5kIG5vdCBkZWNyZWFzZUluZGVudFRlc3QgYW5kIGRlY3JlYXNlTmV4dExpbmVJbmRlbnRSZWdleC50ZXN0U3luYyhwcmVjZWRpbmdMaW5lKSBhbmQgbm90IEBlZGl0b3IuaXNCdWZmZXJSb3dDb21tZW50ZWQocHJlY2VkaW5nUm93KVxuXG4gICAgICByZXR1cm4gTWF0aC5tYXgoaW5kZW50LCAwKVxuXG4gIHBhdGNoRWRpdG9yTGFuZ01vZGU6IChlZGl0b3IpIC0+XG4gICAgQHBhdGNoRWRpdG9yTGFuZ01vZGVTdWdnZXN0ZWRJbmRlbnRGb3JCdWZmZXJSb3coZWRpdG9yKT8uanN4UGF0Y2ggPSB0cnVlXG4gICAgQHBhdGNoRWRpdG9yTGFuZ01vZGVBdXRvRGVjcmVhc2VJbmRlbnRGb3JCdWZmZXJSb3coZWRpdG9yKT8uanN4UGF0Y2ggPSB0cnVlXG5cbiAgaXNSZWFjdDogKHRleHQpIC0+XG4gICAgcmV0dXJuIHRydWUgaWYgYXRvbS5jb25maWcuZ2V0KCdyZWFjdC5lbmFibGVkRm9yQWxsSmF2YXNjcmlwdEZpbGVzJylcblxuXG4gICAgaWYgbm90IGNvbnRlbnRDaGVja1JlZ2V4P1xuICAgICAgbWF0Y2ggPSAoYXRvbS5jb25maWcuZ2V0KCdyZWFjdC5kZXRlY3RSZWFjdEZpbGVQYXR0ZXJuJykgfHwgZGVmYXVsdERldGVjdFJlYWN0RmlsZVBhdHRlcm4pLm1hdGNoKG5ldyBSZWdFeHAoJ14vKC4qPykvKFtnaW15XSopJCcpKTtcbiAgICAgIGNvbnRlbnRDaGVja1JlZ2V4ID0gbmV3IFJlZ0V4cChtYXRjaFsxXSwgbWF0Y2hbMl0pXG4gICAgcmV0dXJuIHRleHQubWF0Y2goY29udGVudENoZWNrUmVnZXgpP1xuXG4gIGlzUmVhY3RFbmFibGVkRm9yRWRpdG9yOiAoZWRpdG9yKSAtPlxuICAgIHJldHVybiBlZGl0b3I/ICYmIGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lIGluIFtcInNvdXJjZS5qcy5qc3hcIiwgXCJzb3VyY2UuY29mZmVlLmpzeFwiXVxuXG4gIGF1dG9TZXRHcmFtbWFyOiAoZWRpdG9yKSAtPlxuICAgIHJldHVybiBpZiBAaXNSZWFjdEVuYWJsZWRGb3JFZGl0b3IgZWRpdG9yXG5cbiAgICBwYXRoID0gcmVxdWlyZSAncGF0aCdcblxuICAgICMgQ2hlY2sgaWYgZmlsZSBleHRlbnNpb24gaXMgLmpzeCBvciB0aGUgZmlsZSByZXF1aXJlcyBSZWFjdFxuICAgIGV4dE5hbWUgPSBwYXRoLmV4dG5hbWUoZWRpdG9yLmdldFBhdGgoKSBvciAnJylcbiAgICBpZiBleHROYW1lIGlzIFwiLmpzeFwiIG9yICgoZXh0TmFtZSBpcyBcIi5qc1wiIG9yIGV4dE5hbWUgaXMgXCIuZXM2XCIpIGFuZCBAaXNSZWFjdChlZGl0b3IuZ2V0VGV4dCgpKSlcbiAgICAgIGpzeEdyYW1tYXIgPSBhdG9tLmdyYW1tYXJzLmdyYW1tYXJzQnlTY29wZU5hbWVbXCJzb3VyY2UuanMuanN4XCJdXG4gICAgICBlZGl0b3Iuc2V0R3JhbW1hciBqc3hHcmFtbWFyIGlmIGpzeEdyYW1tYXJcblxuICBvbkhUTUxUb0pTWDogLT5cbiAgICBqc3hmb3JtYXQgPSByZXF1aXJlICdqc3hmb3JtYXQnXG4gICAgSFRNTHRvSlNYID0gcmVxdWlyZSAnLi9odG1sdG9qc3gnXG4gICAgY29udmVydGVyID0gbmV3IEhUTUx0b0pTWChjcmVhdGVDbGFzczogZmFsc2UpXG5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgIHJldHVybiBpZiBub3QgQGlzUmVhY3RFbmFibGVkRm9yRWRpdG9yIGVkaXRvclxuXG4gICAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcblxuICAgIGVkaXRvci50cmFuc2FjdCA9PlxuICAgICAgZm9yIHNlbGVjdGlvbiBpbiBzZWxlY3Rpb25zXG4gICAgICAgIHRyeVxuICAgICAgICAgIHNlbGVjdGlvblRleHQgPSBzZWxlY3Rpb24uZ2V0VGV4dCgpXG4gICAgICAgICAganN4T3V0cHV0ID0gY29udmVydGVyLmNvbnZlcnQoc2VsZWN0aW9uVGV4dClcblxuICAgICAgICAgIHRyeVxuICAgICAgICAgICAganN4Zm9ybWF0LnNldE9wdGlvbnMoe30pO1xuICAgICAgICAgICAganN4T3V0cHV0ID0ganN4Zm9ybWF0LmZvcm1hdChqc3hPdXRwdXQpXG5cbiAgICAgICAgICBzZWxlY3Rpb24uaW5zZXJ0VGV4dChqc3hPdXRwdXQpO1xuICAgICAgICAgIHJhbmdlID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCk7XG4gICAgICAgICAgZWRpdG9yLmF1dG9JbmRlbnRCdWZmZXJSb3dzKHJhbmdlLnN0YXJ0LnJvdywgcmFuZ2UuZW5kLnJvdylcblxuICBvblJlZm9ybWF0OiAtPlxuICAgIGpzeGZvcm1hdCA9IHJlcXVpcmUgJ2pzeGZvcm1hdCdcbiAgICBfID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICByZXR1cm4gaWYgbm90IEBpc1JlYWN0RW5hYmxlZEZvckVkaXRvciBlZGl0b3JcblxuICAgIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gICAgZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBmb3Igc2VsZWN0aW9uIGluIHNlbGVjdGlvbnNcbiAgICAgICAgdHJ5XG4gICAgICAgICAgcmFuZ2UgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKTtcbiAgICAgICAgICBzZXJpYWxpemVkUmFuZ2UgPSByYW5nZS5zZXJpYWxpemUoKVxuICAgICAgICAgIGJ1ZlN0YXJ0ID0gc2VyaWFsaXplZFJhbmdlWzBdXG4gICAgICAgICAgYnVmRW5kID0gc2VyaWFsaXplZFJhbmdlWzFdXG5cbiAgICAgICAgICBqc3hmb3JtYXQuc2V0T3B0aW9ucyh7fSk7XG4gICAgICAgICAgcmVzdWx0ID0ganN4Zm9ybWF0LmZvcm1hdChzZWxlY3Rpb24uZ2V0VGV4dCgpKVxuXG4gICAgICAgICAgb3JpZ2luYWxMaW5lQ291bnQgPSBlZGl0b3IuZ2V0TGluZUNvdW50KClcbiAgICAgICAgICBzZWxlY3Rpb24uaW5zZXJ0VGV4dChyZXN1bHQpXG4gICAgICAgICAgbmV3TGluZUNvdW50ID0gZWRpdG9yLmdldExpbmVDb3VudCgpXG5cbiAgICAgICAgICBlZGl0b3IuYXV0b0luZGVudEJ1ZmZlclJvd3MoYnVmU3RhcnRbMF0sIGJ1ZkVuZFswXSArIChuZXdMaW5lQ291bnQgLSBvcmlnaW5hbExpbmVDb3VudCkpXG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKGJ1ZlN0YXJ0KVxuICAgICAgICBjYXRjaCBlcnJcbiAgICAgICAgICAjIFBhcnNpbmcvZm9ybWF0dGluZyB0aGUgc2VsZWN0aW9uIGZhaWxlZCBsZXRzIHRyeSB0byBwYXJzZSB0aGUgd2hvbGUgZmlsZSBidXQgZm9ybWF0IHRoZSBzZWxlY3Rpb24gb25seVxuICAgICAgICAgIHJhbmdlID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkuc2VyaWFsaXplKClcbiAgICAgICAgICAjIGVzcHJpbWEgYXN0IGxpbmUgY291bnQgc3RhcnRzIGZvciAxXG4gICAgICAgICAgcmFuZ2VbMF1bMF0rK1xuICAgICAgICAgIHJhbmdlWzFdWzBdKytcblxuICAgICAgICAgIGpzeGZvcm1hdC5zZXRPcHRpb25zKHtyYW5nZTogcmFuZ2V9KTtcblxuICAgICAgICAgICMgVE9ETzogdXNlIGZvbGRcbiAgICAgICAgICBvcmlnaW5hbCA9IGVkaXRvci5nZXRUZXh0KCk7XG5cbiAgICAgICAgICB0cnlcbiAgICAgICAgICAgIHJlc3VsdCA9IGpzeGZvcm1hdC5mb3JtYXQob3JpZ2luYWwpXG4gICAgICAgICAgICBzZWxlY3Rpb24uY2xlYXIoKVxuXG4gICAgICAgICAgICBvcmlnaW5hbExpbmVDb3VudCA9IGVkaXRvci5nZXRMaW5lQ291bnQoKVxuICAgICAgICAgICAgZWRpdG9yLnNldFRleHQocmVzdWx0KVxuICAgICAgICAgICAgbmV3TGluZUNvdW50ID0gZWRpdG9yLmdldExpbmVDb3VudCgpXG5cbiAgICAgICAgICAgIGZpcnN0Q2hhbmdlZExpbmUgPSByYW5nZVswXVswXSAtIDFcbiAgICAgICAgICAgIGxhc3RDaGFuZ2VkTGluZSA9IHJhbmdlWzFdWzBdIC0gMSArIChuZXdMaW5lQ291bnQgLSBvcmlnaW5hbExpbmVDb3VudClcblxuICAgICAgICAgICAgZWRpdG9yLmF1dG9JbmRlbnRCdWZmZXJSb3dzKGZpcnN0Q2hhbmdlZExpbmUsIGxhc3RDaGFuZ2VkTGluZSlcblxuICAgICAgICAgICAgIyByZXR1cm4gYmFja1xuICAgICAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFtmaXJzdENoYW5nZWRMaW5lLCByYW5nZVswXVsxXV0pXG5cbiAgYXV0b0Nsb3NlVGFnOiAoZXZlbnRPYmosIGVkaXRvcikgLT5cbiAgICByZXR1cm4gaWYgYXRvbS5jb25maWcuZ2V0KCdyZWFjdC5kaXNhYmxlQXV0b0Nsb3NlJylcblxuICAgIHJldHVybiBpZiBub3QgQGlzUmVhY3RFbmFibGVkRm9yRWRpdG9yKGVkaXRvcikgb3IgZWRpdG9yICE9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgaWYgZXZlbnRPYmo/Lm5ld1RleHQgaXMgJz4nIGFuZCAhZXZlbnRPYmoub2xkVGV4dFxuICAgICAgIyBhdXRvIGNsb3NpbmcgbXVsdGlwbGUgY3Vyc29ycyBpcyBhIGxpdHRsZSBiaXQgdHJpY2t5IHNvIGxldHMgZGlzYWJsZSBpdCBmb3Igbm93XG4gICAgICByZXR1cm4gaWYgZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9ucygpLmxlbmd0aCA+IDE7XG5cbiAgICAgIHRva2VuaXplZExpbmUgPSBlZGl0b3IudG9rZW5pemVkQnVmZmVyPy50b2tlbml6ZWRMaW5lRm9yUm93KGV2ZW50T2JqLm5ld1JhbmdlLmVuZC5yb3cpXG4gICAgICByZXR1cm4gaWYgbm90IHRva2VuaXplZExpbmU/XG5cbiAgICAgIHRva2VuID0gdG9rZW5pemVkTGluZS50b2tlbkF0QnVmZmVyQ29sdW1uKGV2ZW50T2JqLm5ld1JhbmdlLmVuZC5jb2x1bW4gLSAxKVxuXG4gICAgICBpZiBub3QgdG9rZW4/IG9yIHRva2VuLnNjb3Blcy5pbmRleE9mKCd0YWcub3Blbi5qcycpID09IC0xIG9yIHRva2VuLnNjb3Blcy5pbmRleE9mKCdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5lbmQuanMnKSA9PSAtMVxuICAgICAgICByZXR1cm5cblxuICAgICAgbGluZXMgPSBlZGl0b3IuYnVmZmVyLmdldExpbmVzKClcbiAgICAgIHJvdyA9IGV2ZW50T2JqLm5ld1JhbmdlLmVuZC5yb3dcbiAgICAgIGxpbmUgPSBsaW5lc1tyb3ddXG4gICAgICBsaW5lID0gbGluZS5zdWJzdHIgMCwgZXZlbnRPYmoubmV3UmFuZ2UuZW5kLmNvbHVtblxuXG4gICAgICAjIFRhZyBpcyBzZWxmIGNsb3NpbmdcbiAgICAgIHJldHVybiBpZiBsaW5lLnN1YnN0cihsaW5lLmxlbmd0aCAtIDIsIDEpIGlzICcvJ1xuXG4gICAgICB0YWdOYW1lID0gbnVsbFxuXG4gICAgICB3aGlsZSBsaW5lPyBhbmQgbm90IHRhZ05hbWU/XG4gICAgICAgIG1hdGNoID0gbGluZS5tYXRjaCBhdXRvQ29tcGxldGVUYWdTdGFydFJlZ2V4XG4gICAgICAgIGlmIG1hdGNoPyAmJiBtYXRjaC5sZW5ndGggPiAwXG4gICAgICAgICAgdGFnTmFtZSA9IG1hdGNoLnBvcCgpLnN1YnN0cigxKVxuICAgICAgICByb3ctLVxuICAgICAgICBsaW5lID0gbGluZXNbcm93XVxuXG4gICAgICBpZiB0YWdOYW1lP1xuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnPC8nICsgdGFnTmFtZSArICc+Jywge3VuZG86ICdza2lwJ30pXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihldmVudE9iai5uZXdSYW5nZS5lbmQpXG5cbiAgICBlbHNlIGlmIGV2ZW50T2JqPy5vbGRUZXh0IGlzICc+JyBhbmQgZXZlbnRPYmo/Lm5ld1RleHQgaXMgJydcblxuICAgICAgbGluZXMgPSBlZGl0b3IuYnVmZmVyLmdldExpbmVzKClcbiAgICAgIHJvdyA9IGV2ZW50T2JqLm5ld1JhbmdlLmVuZC5yb3dcbiAgICAgIGZ1bGxMaW5lID0gbGluZXNbcm93XVxuXG4gICAgICB0b2tlbml6ZWRMaW5lID0gZWRpdG9yLnRva2VuaXplZEJ1ZmZlcj8udG9rZW5pemVkTGluZUZvclJvdyhldmVudE9iai5uZXdSYW5nZS5lbmQucm93KVxuICAgICAgcmV0dXJuIGlmIG5vdCB0b2tlbml6ZWRMaW5lP1xuXG4gICAgICB0b2tlbiA9IHRva2VuaXplZExpbmUudG9rZW5BdEJ1ZmZlckNvbHVtbihldmVudE9iai5uZXdSYW5nZS5lbmQuY29sdW1uIC0gMSlcbiAgICAgIGlmIG5vdCB0b2tlbj8gb3IgdG9rZW4uc2NvcGVzLmluZGV4T2YoJ3RhZy5vcGVuLmpzJykgPT0gLTFcbiAgICAgICAgcmV0dXJuXG4gICAgICBsaW5lID0gZnVsbExpbmUuc3Vic3RyIDAsIGV2ZW50T2JqLm5ld1JhbmdlLmVuZC5jb2x1bW5cblxuICAgICAgIyBUYWcgaXMgc2VsZiBjbG9zaW5nXG4gICAgICByZXR1cm4gaWYgbGluZS5zdWJzdHIobGluZS5sZW5ndGggLSAxLCAxKSBpcyAnLydcblxuICAgICAgdGFnTmFtZSA9IG51bGxcblxuICAgICAgd2hpbGUgbGluZT8gYW5kIG5vdCB0YWdOYW1lP1xuICAgICAgICBtYXRjaCA9IGxpbmUubWF0Y2ggYXV0b0NvbXBsZXRlVGFnU3RhcnRSZWdleFxuICAgICAgICBpZiBtYXRjaD8gJiYgbWF0Y2gubGVuZ3RoID4gMFxuICAgICAgICAgIHRhZ05hbWUgPSBtYXRjaC5wb3AoKS5zdWJzdHIoMSlcbiAgICAgICAgcm93LS1cbiAgICAgICAgbGluZSA9IGxpbmVzW3Jvd11cblxuICAgICAgaWYgdGFnTmFtZT9cbiAgICAgICAgcmVzdCA9IGZ1bGxMaW5lLnN1YnN0cihldmVudE9iai5uZXdSYW5nZS5lbmQuY29sdW1uKVxuICAgICAgICBpZiByZXN0LmluZGV4T2YoJzwvJyArIHRhZ05hbWUgKyAnPicpID09IDBcbiAgICAgICAgICAjIHJlc3QgaXMgY2xvc2luZyB0YWdcbiAgICAgICAgICBzZXJpYWxpemVkRW5kUG9pbnQgPSBbZXZlbnRPYmoubmV3UmFuZ2UuZW5kLnJvdywgZXZlbnRPYmoubmV3UmFuZ2UuZW5kLmNvbHVtbl07XG4gICAgICAgICAgZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBzZXJpYWxpemVkRW5kUG9pbnQsXG4gICAgICAgICAgICAgIFtzZXJpYWxpemVkRW5kUG9pbnRbMF0sIHNlcmlhbGl6ZWRFbmRQb2ludFsxXSArIHRhZ05hbWUubGVuZ3RoICsgM11cbiAgICAgICAgICAgIF1cbiAgICAgICAgICAsICcnLCB7dW5kbzogJ3NraXAnfSlcblxuICAgIGVsc2UgaWYgZXZlbnRPYmo/Lm5ld1RleHQgaXMgJ1xcbidcbiAgICAgIGxpbmVzID0gZWRpdG9yLmJ1ZmZlci5nZXRMaW5lcygpXG4gICAgICByb3cgPSBldmVudE9iai5uZXdSYW5nZS5lbmQucm93XG4gICAgICBsYXN0TGluZSA9IGxpbmVzW3JvdyAtIDFdXG4gICAgICBmdWxsTGluZSA9IGxpbmVzW3Jvd11cblxuICAgICAgaWYgLz4kLy50ZXN0KGxhc3RMaW5lKSBhbmQgZnVsbExpbmUuc2VhcmNoKGF1dG9Db21wbGV0ZVRhZ0Nsb3NlUmVnZXgpID09IDBcbiAgICAgICAgd2hpbGUgbGFzdExpbmU/XG4gICAgICAgICAgbWF0Y2ggPSBsYXN0TGluZS5tYXRjaCBhdXRvQ29tcGxldGVUYWdTdGFydFJlZ2V4XG4gICAgICAgICAgaWYgbWF0Y2g/ICYmIG1hdGNoLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgcm93LS1cbiAgICAgICAgICBsYXN0TGluZSA9IGxpbmVzW3Jvd11cblxuICAgICAgICBsYXN0TGluZVNwYWNlcyA9IGxhc3RMaW5lLm1hdGNoKC9eXFxzKi8pXG4gICAgICAgIGxhc3RMaW5lU3BhY2VzID0gaWYgbGFzdExpbmVTcGFjZXM/IHRoZW4gbGFzdExpbmVTcGFjZXNbMF0gZWxzZSAnJ1xuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnXFxuJyArIGxhc3RMaW5lU3BhY2VzKVxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oZXZlbnRPYmoubmV3UmFuZ2UuZW5kKVxuXG4gIHByb2Nlc3NFZGl0b3I6IChlZGl0b3IpIC0+XG4gICAgQHBhdGNoRWRpdG9yTGFuZ01vZGUoZWRpdG9yKVxuICAgIEBhdXRvU2V0R3JhbW1hcihlZGl0b3IpXG4gICAgZGlzcG9zYWJsZUJ1ZmZlckV2ZW50ID0gZWRpdG9yLmJ1ZmZlci5vbkRpZENoYW5nZSAoZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIEBhdXRvQ2xvc2VUYWcgZSwgZWRpdG9yXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGVkaXRvci5vbkRpZERlc3Ryb3kgPT4gZGlzcG9zYWJsZUJ1ZmZlckV2ZW50LmRpc3Bvc2UoKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZChkaXNwb3NhYmxlQnVmZmVyRXZlbnQpO1xuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICBhY3RpdmF0ZTogLT5cblxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cblxuICAgICMgQmluZCBldmVudHNcbiAgICBkaXNwb3NhYmxlQ29uZmlnTGlzdGVuZXIgPSBhdG9tLmNvbmZpZy5vYnNlcnZlICdyZWFjdC5kZXRlY3RSZWFjdEZpbGVQYXR0ZXJuJywgKG5ld1ZhbHVlKSAtPlxuICAgICAgY29udGVudENoZWNrUmVnZXggPSBudWxsXG5cbiAgICBkaXNwb3NhYmxlUmVmb3JtYXQgPSBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAncmVhY3Q6cmVmb3JtYXQtSlNYJywgPT4gQG9uUmVmb3JtYXQoKVxuICAgIGRpc3Bvc2FibGVIVE1MVE9KU1ggPSBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAncmVhY3Q6SFRNTC10by1KU1gnLCA9PiBAb25IVE1MVG9KU1goKVxuICAgIGRpc3Bvc2FibGVQcm9jZXNzRWRpdG9yID0gYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIEBwcm9jZXNzRWRpdG9yLmJpbmQodGhpcylcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgZGlzcG9zYWJsZUNvbmZpZ0xpc3RlbmVyXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBkaXNwb3NhYmxlUmVmb3JtYXRcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGRpc3Bvc2FibGVIVE1MVE9KU1hcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGRpc3Bvc2FibGVQcm9jZXNzRWRpdG9yXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBdG9tUmVhY3RcbiJdfQ==
