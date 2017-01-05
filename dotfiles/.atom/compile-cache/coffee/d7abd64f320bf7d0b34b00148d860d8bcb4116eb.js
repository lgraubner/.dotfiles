(function() {
  "use strict";
  var $, Beautifiers, CompositeDisposable, LoadingView, Promise, _, async, beautifier, beautify, beautifyDirectory, beautifyFile, beautifyFilePath, debug, defaultLanguageOptions, dir, fs, getCursors, getScrollTop, getUnsupportedOptions, handleSaveEvent, loadingView, logger, path, pkg, plugin, setCursors, setScrollTop, showError, strip, yaml;

  pkg = require('../package.json');

  plugin = module.exports;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  _ = require("lodash");

  Beautifiers = require("./beautifiers");

  beautifier = new Beautifiers();

  defaultLanguageOptions = beautifier.options;

  logger = require('./logger')(__filename);

  Promise = require('bluebird');

  fs = null;

  path = require("path");

  strip = null;

  yaml = null;

  async = null;

  dir = null;

  LoadingView = null;

  loadingView = null;

  $ = null;

  getScrollTop = function(editor) {
    var view;
    view = atom.views.getView(editor);
    return view != null ? view.getScrollTop() : void 0;
  };

  setScrollTop = function(editor, value) {
    var ref, view;
    view = atom.views.getView(editor);
    return view != null ? (ref = view.component) != null ? ref.setScrollTop(value) : void 0 : void 0;
  };

  getCursors = function(editor) {
    var bufferPosition, cursor, cursors, j, len, posArray;
    cursors = editor.getCursors();
    posArray = [];
    for (j = 0, len = cursors.length; j < len; j++) {
      cursor = cursors[j];
      bufferPosition = cursor.getBufferPosition();
      posArray.push([bufferPosition.row, bufferPosition.column]);
    }
    return posArray;
  };

  setCursors = function(editor, posArray) {
    var bufferPosition, i, j, len;
    for (i = j = 0, len = posArray.length; j < len; i = ++j) {
      bufferPosition = posArray[i];
      if (i === 0) {
        editor.setCursorBufferPosition(bufferPosition);
        continue;
      }
      editor.addCursorAtBufferPosition(bufferPosition);
    }
  };

  beautifier.on('beautify::start', function() {
    if (LoadingView == null) {
      LoadingView = require("./views/loading-view");
    }
    if (loadingView == null) {
      loadingView = new LoadingView();
    }
    return loadingView.show();
  });

  beautifier.on('beautify::end', function() {
    return loadingView != null ? loadingView.hide() : void 0;
  });

  showError = function(error) {
    var detail, ref, stack;
    if (!atom.config.get("atom-beautify.general.muteAllErrors")) {
      stack = error.stack;
      detail = error.description || error.message;
      return (ref = atom.notifications) != null ? ref.addError(error.message, {
        stack: stack,
        detail: detail,
        dismissable: true
      }) : void 0;
    }
  };

  beautify = function(arg) {
    var editor, onSave;
    editor = arg.editor, onSave = arg.onSave;
    return new Promise(function(resolve, reject) {
      var allOptions, beautifyCompleted, e, editedFilePath, forceEntireFile, grammarName, isSelection, oldText, text;
      plugin.checkUnsupportedOptions();
      if (path == null) {
        path = require("path");
      }
      forceEntireFile = onSave && atom.config.get("atom-beautify.general.beautifyEntireFileOnSave");
      beautifyCompleted = function(text) {
        var error, origScrollTop, posArray, selectedBufferRange;
        if (text == null) {

        } else if (text instanceof Error) {
          showError(text);
          return reject(text);
        } else if (typeof text === "string") {
          if (oldText !== text) {
            posArray = getCursors(editor);
            origScrollTop = getScrollTop(editor);
            if (!forceEntireFile && isSelection) {
              selectedBufferRange = editor.getSelectedBufferRange();
              editor.setTextInBufferRange(selectedBufferRange, text);
            } else {
              editor.setText(text);
            }
            setCursors(editor, posArray);
            setTimeout((function() {
              setScrollTop(editor, origScrollTop);
              return resolve(text);
            }), 0);
          }
        } else {
          error = new Error("Unsupported beautification result '" + text + "'.");
          showError(error);
          return reject(error);
        }
      };
      editor = editor != null ? editor : atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return showError(new Error("Active Editor not found. ", "Please select a Text Editor first to beautify."));
      }
      isSelection = !!editor.getSelectedText();
      editedFilePath = editor.getPath();
      allOptions = beautifier.getOptionsForPath(editedFilePath, editor);
      text = void 0;
      if (!forceEntireFile && isSelection) {
        text = editor.getSelectedText();
      } else {
        text = editor.getText();
      }
      oldText = text;
      grammarName = editor.getGrammar().name;
      try {
        beautifier.beautify(text, allOptions, grammarName, editedFilePath, {
          onSave: onSave
        }).then(beautifyCompleted)["catch"](beautifyCompleted);
      } catch (error1) {
        e = error1;
        showError(e);
      }
    });
  };

  beautifyFilePath = function(filePath, callback) {
    var $el, cb;
    logger.verbose('beautifyFilePath', filePath);
    if ($ == null) {
      $ = require("atom-space-pen-views").$;
    }
    $el = $(".icon-file-text[data-path=\"" + filePath + "\"]");
    $el.addClass('beautifying');
    cb = function(err, result) {
      logger.verbose('Cleanup beautifyFilePath', err, result);
      $el = $(".icon-file-text[data-path=\"" + filePath + "\"]");
      $el.removeClass('beautifying');
      return callback(err, result);
    };
    if (fs == null) {
      fs = require("fs");
    }
    logger.verbose('readFile', filePath);
    return fs.readFile(filePath, function(err, data) {
      var allOptions, completionFun, e, grammar, grammarName, input;
      logger.verbose('readFile completed', err, filePath);
      if (err) {
        return cb(err);
      }
      input = data != null ? data.toString() : void 0;
      grammar = atom.grammars.selectGrammar(filePath, input);
      grammarName = grammar.name;
      allOptions = beautifier.getOptionsForPath(filePath);
      logger.verbose('beautifyFilePath allOptions', allOptions);
      completionFun = function(output) {
        logger.verbose('beautifyFilePath completionFun', output);
        if (output instanceof Error) {
          return cb(output, null);
        } else if (typeof output === "string") {
          if (output.trim() === '') {
            logger.verbose('beautifyFilePath, output was empty string!');
            return cb(null, output);
          }
          return fs.writeFile(filePath, output, function(err) {
            if (err) {
              return cb(err);
            }
            return cb(null, output);
          });
        } else {
          return cb(new Error("Unknown beautification result " + output + "."), output);
        }
      };
      try {
        logger.verbose('beautify', input, allOptions, grammarName, filePath);
        return beautifier.beautify(input, allOptions, grammarName, filePath).then(completionFun)["catch"](completionFun);
      } catch (error1) {
        e = error1;
        return cb(e);
      }
    });
  };

  beautifyFile = function(arg) {
    var filePath, target;
    target = arg.target;
    filePath = target.dataset.path;
    if (!filePath) {
      return;
    }
    beautifyFilePath(filePath, function(err, result) {
      if (err) {
        return showError(err);
      }
    });
  };

  beautifyDirectory = function(arg) {
    var $el, dirPath, target;
    target = arg.target;
    dirPath = target.dataset.path;
    if (!dirPath) {
      return;
    }
    if ((typeof atom !== "undefined" && atom !== null ? atom.confirm({
      message: "This will beautify all of the files found recursively in this directory, '" + dirPath + "'. Do you want to continue?",
      buttons: ['Yes, continue!', 'No, cancel!']
    }) : void 0) !== 0) {
      return;
    }
    if ($ == null) {
      $ = require("atom-space-pen-views").$;
    }
    $el = $(".icon-file-directory[data-path=\"" + dirPath + "\"]");
    $el.addClass('beautifying');
    if (dir == null) {
      dir = require("node-dir");
    }
    if (async == null) {
      async = require("async");
    }
    dir.files(dirPath, function(err, files) {
      if (err) {
        return showError(err);
      }
      return async.each(files, function(filePath, callback) {
        return beautifyFilePath(filePath, function() {
          return callback();
        });
      }, function(err) {
        $el = $(".icon-file-directory[data-path=\"" + dirPath + "\"]");
        return $el.removeClass('beautifying');
      });
    });
  };

  debug = function() {
    var addHeader, addInfo, allOptions, beautifiers, codeBlockSyntax, debugInfo, detail, editor, error, filePath, grammarName, headers, language, linkifyTitle, open, ref, ref1, selectedBeautifier, stack, text, tocEl;
    try {
      open = require("open");
      if (fs == null) {
        fs = require("fs");
      }
      plugin.checkUnsupportedOptions();
      editor = atom.workspace.getActiveTextEditor();
      linkifyTitle = function(title) {
        var p, sep;
        title = title.toLowerCase();
        p = title.split(/[\s,+#;,\/?:@&=+$]+/);
        sep = "-";
        return p.join(sep);
      };
      if (editor == null) {
        return confirm("Active Editor not found.\n" + "Please select a Text Editor first to beautify.");
      }
      if (!confirm('Are you ready to debug Atom Beautify?')) {
        return;
      }
      debugInfo = "";
      headers = [];
      tocEl = "<TABLEOFCONTENTS/>";
      addInfo = function(key, val) {
        if (key != null) {
          return debugInfo += "**" + key + "**: " + val + "\n\n";
        } else {
          return debugInfo += val + "\n\n";
        }
      };
      addHeader = function(level, title) {
        debugInfo += (Array(level + 1).join('#')) + " " + title + "\n\n";
        return headers.push({
          level: level,
          title: title
        });
      };
      addHeader(1, "Atom Beautify - Debugging information");
      debugInfo += "The following debugging information was " + ("generated by `Atom Beautify` on `" + (new Date()) + "`.") + "\n\n---\n\n" + tocEl + "\n\n---\n\n";
      addInfo('Platform', process.platform);
      addHeader(2, "Versions");
      addInfo('Atom Version', atom.appVersion);
      addInfo('Atom Beautify Version', pkg.version);
      addHeader(2, "Original file to be beautified");
      filePath = editor.getPath();
      addInfo('Original File Path', "`" + filePath + "`");
      grammarName = editor.getGrammar().name;
      addInfo('Original File Grammar', grammarName);
      language = beautifier.getLanguage(grammarName, filePath);
      addInfo('Original File Language', language != null ? language.name : void 0);
      addInfo('Language namespace', language != null ? language.namespace : void 0);
      beautifiers = beautifier.getBeautifiers(language.name);
      addInfo('Supported Beautifiers', _.map(beautifiers, 'name').join(', '));
      selectedBeautifier = beautifier.getBeautifierForLanguage(language);
      addInfo('Selected Beautifier', selectedBeautifier.name);
      text = editor.getText() || "";
      codeBlockSyntax = ((ref = language != null ? language.name : void 0) != null ? ref : grammarName).toLowerCase().split(' ')[0];
      addHeader(3, 'Original File Contents');
      addInfo(null, "\n```" + codeBlockSyntax + "\n" + text + "\n```");
      addHeader(3, 'Package Settings');
      addInfo(null, "The raw package settings options\n" + ("```json\n" + (JSON.stringify(atom.config.get('atom-beautify'), void 0, 4)) + "\n```"));
      addHeader(2, "Beautification options");
      allOptions = beautifier.getOptionsForPath(filePath, editor);
      return Promise.all(allOptions).then(function(allOptions) {
        var cb, configOptions, e, editorConfigOptions, editorOptions, finalOptions, homeOptions, logFilePathRegex, logs, preTransformedOptions, projectOptions, subscription;
        editorOptions = allOptions[0], configOptions = allOptions[1], homeOptions = allOptions[2], editorConfigOptions = allOptions[3];
        projectOptions = allOptions.slice(4);
        preTransformedOptions = beautifier.getOptionsForLanguage(allOptions, language);
        if (selectedBeautifier) {
          finalOptions = beautifier.transformOptions(selectedBeautifier, language.name, preTransformedOptions);
        }
        addInfo('Editor Options', "\n" + "Options from Atom Editor settings\n" + ("```json\n" + (JSON.stringify(editorOptions, void 0, 4)) + "\n```"));
        addInfo('Config Options', "\n" + "Options from Atom Beautify package settings\n" + ("```json\n" + (JSON.stringify(configOptions, void 0, 4)) + "\n```"));
        addInfo('Home Options', "\n" + ("Options from `" + (path.resolve(beautifier.getUserHome(), '.jsbeautifyrc')) + "`\n") + ("```json\n" + (JSON.stringify(homeOptions, void 0, 4)) + "\n```"));
        addInfo('EditorConfig Options', "\n" + "Options from [EditorConfig](http://editorconfig.org/) file\n" + ("```json\n" + (JSON.stringify(editorConfigOptions, void 0, 4)) + "\n```"));
        addInfo('Project Options', "\n" + ("Options from `.jsbeautifyrc` files starting from directory `" + (path.dirname(filePath)) + "` and going up to root\n") + ("```json\n" + (JSON.stringify(projectOptions, void 0, 4)) + "\n```"));
        addInfo('Pre-Transformed Options', "\n" + "Combined options before transforming them given a beautifier's specifications\n" + ("```json\n" + (JSON.stringify(preTransformedOptions, void 0, 4)) + "\n```"));
        if (selectedBeautifier) {
          addHeader(3, 'Final Options');
          addInfo(null, "Final combined and transformed options that are used\n" + ("```json\n" + (JSON.stringify(finalOptions, void 0, 4)) + "\n```"));
        }
        logs = "";
        logFilePathRegex = new RegExp('\\: \\[(.*)\\]');
        subscription = logger.onLogging(function(msg) {
          var sep;
          sep = path.sep;
          return logs += msg.replace(logFilePathRegex, function(a, b) {
            var i, p, s;
            s = b.split(sep);
            i = s.indexOf('atom-beautify');
            p = s.slice(i + 2).join(sep);
            return ': [' + p + ']';
          });
        });
        cb = function(result) {
          var JsDiff, bullet, diff, header, indent, indentNum, j, len, toc;
          subscription.dispose();
          addHeader(2, "Results");
          addInfo('Beautified File Contents', "\n```" + codeBlockSyntax + "\n" + result + "\n```");
          JsDiff = require('diff');
          if (typeof result === "string") {
            diff = JsDiff.createPatch(filePath || "", text || "", result || "", "original", "beautified");
            addInfo('Original vs. Beautified Diff', "\n```" + codeBlockSyntax + "\n" + diff + "\n```");
          }
          addHeader(3, "Logs");
          addInfo(null, "```\n" + logs + "\n```");
          toc = "## Table Of Contents\n";
          for (j = 0, len = headers.length; j < len; j++) {
            header = headers[j];

            /*
            - Heading 1
              - Heading 1.1
             */
            indent = "  ";
            bullet = "-";
            indentNum = header.level - 2;
            if (indentNum >= 0) {
              toc += "" + (Array(indentNum + 1).join(indent)) + bullet + " [" + header.title + "](\#" + (linkifyTitle(header.title)) + ")\n";
            }
          }
          debugInfo = debugInfo.replace(tocEl, toc);
          return atom.workspace.open().then(function(editor) {
            editor.setText(debugInfo);
            return confirm("Please login to GitHub and create a Gist named \"debug.md\" (Markdown file) with your debugging information.\nThen add a link to your Gist in your GitHub Issue.\nThank you!\n\nGist: https://gist.github.com/\nGitHub Issues: https://github.com/Glavin001/atom-beautify/issues");
          })["catch"](function(error) {
            return confirm("An error occurred when creating the Gist: " + error.message);
          });
        };
        try {
          return beautifier.beautify(text, allOptions, grammarName, filePath).then(cb)["catch"](cb);
        } catch (error1) {
          e = error1;
          return cb(e);
        }
      })["catch"](function(error) {
        var detail, ref1, stack;
        stack = error.stack;
        detail = error.description || error.message;
        return typeof atom !== "undefined" && atom !== null ? (ref1 = atom.notifications) != null ? ref1.addError(error.message, {
          stack: stack,
          detail: detail,
          dismissable: true
        }) : void 0 : void 0;
      });
    } catch (error1) {
      error = error1;
      stack = error.stack;
      detail = error.description || error.message;
      return typeof atom !== "undefined" && atom !== null ? (ref1 = atom.notifications) != null ? ref1.addError(error.message, {
        stack: stack,
        detail: detail,
        dismissable: true
      }) : void 0 : void 0;
    }
  };

  handleSaveEvent = function() {
    return atom.workspace.observeTextEditors(function(editor) {
      var beautifyOnSaveHandler, disposable, pendingPaths;
      pendingPaths = {};
      beautifyOnSaveHandler = function(arg) {
        var beautifyOnSave, buffer, fileExtension, filePath, grammar, key, language, languages;
        filePath = arg.path;
        logger.verbose('Should beautify on this save?');
        if (pendingPaths[filePath]) {
          logger.verbose("Editor with file path " + filePath + " already beautified!");
          return;
        }
        buffer = editor.getBuffer();
        if (path == null) {
          path = require('path');
        }
        grammar = editor.getGrammar().name;
        fileExtension = path.extname(filePath);
        fileExtension = fileExtension.substr(1);
        languages = beautifier.languages.getLanguages({
          grammar: grammar,
          extension: fileExtension
        });
        if (languages.length < 1) {
          return;
        }
        language = languages[0];
        key = "atom-beautify." + language.namespace + ".beautify_on_save";
        beautifyOnSave = atom.config.get(key);
        logger.verbose('save editor positions', key, beautifyOnSave);
        if (beautifyOnSave) {
          logger.verbose('Beautifying file', filePath);
          return beautify({
            editor: editor,
            onSave: true
          }).then(function() {
            logger.verbose('Done beautifying file', filePath);
            if (editor.isAlive() === true) {
              logger.verbose('Saving TextEditor...');
              pendingPaths[filePath] = true;
              editor.save();
              delete pendingPaths[filePath];
              return logger.verbose('Saved TextEditor.');
            }
          })["catch"](function(error) {
            return showError(error);
          });
        }
      };
      disposable = editor.onDidSave(function(arg) {
        var filePath;
        filePath = arg.path;
        return beautifyOnSaveHandler({
          path: filePath
        });
      });
      return plugin.subscriptions.add(disposable);
    });
  };

  getUnsupportedOptions = function() {
    var schema, settings, unsupportedOptions;
    settings = atom.config.get('atom-beautify');
    schema = atom.config.getSchema('atom-beautify');
    unsupportedOptions = _.filter(_.keys(settings), function(key) {
      return schema.properties[key] === void 0;
    });
    return unsupportedOptions;
  };

  plugin.checkUnsupportedOptions = function() {
    var unsupportedOptions;
    unsupportedOptions = getUnsupportedOptions();
    if (unsupportedOptions.length !== 0) {
      return atom.notifications.addWarning("Please run Atom command 'Atom-Beautify: Migrate Settings'.", {
        detail: "You can open the Atom command palette with `cmd-shift-p` (OSX) or `ctrl-shift-p` (Linux/Windows) in Atom. You have unsupported options: " + (unsupportedOptions.join(', ')),
        dismissable: true
      });
    }
  };

  plugin.migrateSettings = function() {
    var namespaces, rename, rex, unsupportedOptions;
    unsupportedOptions = getUnsupportedOptions();
    namespaces = beautifier.languages.namespaces;
    if (unsupportedOptions.length === 0) {
      return atom.notifications.addSuccess("No options to migrate.");
    } else {
      rex = new RegExp("(" + (namespaces.join('|')) + ")_(.*)");
      rename = _.toPairs(_.zipObject(unsupportedOptions, _.map(unsupportedOptions, function(key) {
        var m;
        m = key.match(rex);
        if (m === null) {
          return "general." + key;
        } else {
          return m[1] + "." + m[2];
        }
      })));
      _.each(rename, function(arg) {
        var key, newKey, val;
        key = arg[0], newKey = arg[1];
        val = atom.config.get("atom-beautify." + key);
        atom.config.set("atom-beautify." + newKey, val);
        return atom.config.set("atom-beautify." + key, void 0);
      });
      return atom.notifications.addSuccess("Successfully migrated options: " + (unsupportedOptions.join(', ')));
    }
  };

  plugin.config = _.merge(require('./config.coffee'), defaultLanguageOptions);

  plugin.activate = function() {
    this.subscriptions = new CompositeDisposable;
    this.subscriptions.add(handleSaveEvent());
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:beautify-editor", beautify));
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:help-debug-editor", debug));
    this.subscriptions.add(atom.commands.add(".tree-view .file .name", "atom-beautify:beautify-file", beautifyFile));
    this.subscriptions.add(atom.commands.add(".tree-view .directory .name", "atom-beautify:beautify-directory", beautifyDirectory));
    return this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:migrate-settings", plugin.migrateSettings));
  };

  plugin.deactivate = function() {
    return this.subscriptions.dispose();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZnkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQUE7QUFBQSxNQUFBOztFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsaUJBQVI7O0VBR04sTUFBQSxHQUFTLE1BQU0sQ0FBQzs7RUFDZixzQkFBdUIsT0FBQSxDQUFRLFdBQVI7O0VBQ3hCLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7RUFDSixXQUFBLEdBQWMsT0FBQSxDQUFRLGVBQVI7O0VBQ2QsVUFBQSxHQUFpQixJQUFBLFdBQUEsQ0FBQTs7RUFDakIsc0JBQUEsR0FBeUIsVUFBVSxDQUFDOztFQUNwQyxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FBQSxDQUFvQixVQUFwQjs7RUFDVCxPQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVI7O0VBR1YsRUFBQSxHQUFLOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxLQUFBLEdBQVE7O0VBQ1IsSUFBQSxHQUFPOztFQUNQLEtBQUEsR0FBUTs7RUFDUixHQUFBLEdBQU07O0VBQ04sV0FBQSxHQUFjOztFQUNkLFdBQUEsR0FBYzs7RUFDZCxDQUFBLEdBQUk7O0VBTUosWUFBQSxHQUFlLFNBQUMsTUFBRDtBQUNiLFFBQUE7SUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5COzBCQUNQLElBQUksQ0FBRSxZQUFOLENBQUE7RUFGYTs7RUFHZixZQUFBLEdBQWUsU0FBQyxNQUFELEVBQVMsS0FBVDtBQUNiLFFBQUE7SUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5COzhEQUNRLENBQUUsWUFBakIsQ0FBOEIsS0FBOUI7RUFGYTs7RUFJZixVQUFBLEdBQWEs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QUFBLENBQVEsaUJBQVIsQ0FBUixFQUFvQyxzQkFBcEM7O0VBQ2hCLE1BQU0sQ0FBQyxRQUFQLEdBQWtCLFNBQUE7SUFDaEIsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtJQUNyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsZUFBQSxDQUFBLENBQW5CO0lBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsK0JBQXBDLEVBQXFFLFFBQXJFLENBQW5CO0lBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsaUNBQXBDLEVBQXVFLEtBQXZFLENBQW5CO0lBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQix3QkFBbEIsRUFBNEMsNkJBQTVDLEVBQTJFLFlBQTNFLENBQW5CO0lBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQiw2QkFBbEIsRUFBaUQsa0NBQWpELEVBQXFGLGlCQUFyRixDQUFuQjtXQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGdDQUFwQyxFQUFzRSxNQUFNLENBQUMsZUFBN0UsQ0FBbkI7RUFQZ0I7O0VBU2xCLE1BQU0sQ0FBQyxVQUFQLEdBQW9CLFNBQUE7V0FDbEIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7RUFEa0I7QUF0bUJwQiIsInNvdXJjZXNDb250ZW50IjpbIiMgZ2xvYmFsIGF0b21cblwidXNlIHN0cmljdFwiXG5wa2cgPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKVxuXG4jIERlcGVuZGVuY2llc1xucGx1Z2luID0gbW9kdWxlLmV4cG9ydHNcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2V2ZW50LWtpdCdcbl8gPSByZXF1aXJlKFwibG9kYXNoXCIpXG5CZWF1dGlmaWVycyA9IHJlcXVpcmUoXCIuL2JlYXV0aWZpZXJzXCIpXG5iZWF1dGlmaWVyID0gbmV3IEJlYXV0aWZpZXJzKClcbmRlZmF1bHRMYW5ndWFnZU9wdGlvbnMgPSBiZWF1dGlmaWVyLm9wdGlvbnNcbmxvZ2dlciA9IHJlcXVpcmUoJy4vbG9nZ2VyJykoX19maWxlbmFtZSlcblByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpXG5cbiMgTGF6eSBsb2FkZWQgZGVwZW5kZW5jaWVzXG5mcyA9IG51bGxcbnBhdGggPSByZXF1aXJlKFwicGF0aFwiKVxuc3RyaXAgPSBudWxsXG55YW1sID0gbnVsbFxuYXN5bmMgPSBudWxsXG5kaXIgPSBudWxsICMgTm9kZS1EaXJcbkxvYWRpbmdWaWV3ID0gbnVsbFxubG9hZGluZ1ZpZXcgPSBudWxsXG4kID0gbnVsbFxuXG4jIGZ1bmN0aW9uIGNsZWFuT3B0aW9ucyhkYXRhLCB0eXBlcykge1xuIyBub3B0LmNsZWFuKGRhdGEsIHR5cGVzKTtcbiMgcmV0dXJuIGRhdGE7XG4jIH1cbmdldFNjcm9sbFRvcCA9IChlZGl0b3IpIC0+XG4gIHZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICB2aWV3Py5nZXRTY3JvbGxUb3AoKVxuc2V0U2Nyb2xsVG9wID0gKGVkaXRvciwgdmFsdWUpIC0+XG4gIHZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICB2aWV3Py5jb21wb25lbnQ/LnNldFNjcm9sbFRvcCB2YWx1ZVxuXG5nZXRDdXJzb3JzID0gKGVkaXRvcikgLT5cbiAgY3Vyc29ycyA9IGVkaXRvci5nZXRDdXJzb3JzKClcbiAgcG9zQXJyYXkgPSBbXVxuICBmb3IgY3Vyc29yIGluIGN1cnNvcnNcbiAgICBidWZmZXJQb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgcG9zQXJyYXkucHVzaCBbXG4gICAgICBidWZmZXJQb3NpdGlvbi5yb3dcbiAgICAgIGJ1ZmZlclBvc2l0aW9uLmNvbHVtblxuICAgIF1cbiAgcG9zQXJyYXlcbnNldEN1cnNvcnMgPSAoZWRpdG9yLCBwb3NBcnJheSkgLT5cblxuICAjIGNvbnNvbGUubG9nIFwic2V0Q3Vyc29yczpcbiAgZm9yIGJ1ZmZlclBvc2l0aW9uLCBpIGluIHBvc0FycmF5XG4gICAgaWYgaSBpcyAwXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gYnVmZmVyUG9zaXRpb25cbiAgICAgIGNvbnRpbnVlXG4gICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24gYnVmZmVyUG9zaXRpb25cbiAgcmV0dXJuXG5cbiMgU2hvdyBiZWF1dGlmaWNhdGlvbiBwcm9ncmVzcy9sb2FkaW5nIHZpZXdcbmJlYXV0aWZpZXIub24oJ2JlYXV0aWZ5OjpzdGFydCcsIC0+XG4gIExvYWRpbmdWaWV3ID89IHJlcXVpcmUgXCIuL3ZpZXdzL2xvYWRpbmctdmlld1wiXG4gIGxvYWRpbmdWaWV3ID89IG5ldyBMb2FkaW5nVmlldygpXG4gIGxvYWRpbmdWaWV3LnNob3coKVxuKVxuYmVhdXRpZmllci5vbignYmVhdXRpZnk6OmVuZCcsIC0+XG4gIGxvYWRpbmdWaWV3Py5oaWRlKClcbilcbiMgU2hvdyBlcnJvclxuc2hvd0Vycm9yID0gKGVycm9yKSAtPlxuICBpZiBub3QgYXRvbS5jb25maWcuZ2V0KFwiYXRvbS1iZWF1dGlmeS5nZW5lcmFsLm11dGVBbGxFcnJvcnNcIilcbiAgICAjIGNvbnNvbGUubG9nKGUpXG4gICAgc3RhY2sgPSBlcnJvci5zdGFja1xuICAgIGRldGFpbCA9IGVycm9yLmRlc2NyaXB0aW9uIG9yIGVycm9yLm1lc3NhZ2VcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnM/LmFkZEVycm9yKGVycm9yLm1lc3NhZ2UsIHtcbiAgICAgIHN0YWNrLCBkZXRhaWwsIGRpc21pc3NhYmxlIDogdHJ1ZX0pXG5cbmJlYXV0aWZ5ID0gKHtlZGl0b3IsIG9uU2F2ZX0pIC0+XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSAtPlxuXG4gICAgcGx1Z2luLmNoZWNrVW5zdXBwb3J0ZWRPcHRpb25zKClcblxuICAgICMgQ29udGludWUgYmVhdXRpZnlpbmdcbiAgICBwYXRoID89IHJlcXVpcmUoXCJwYXRoXCIpXG4gICAgZm9yY2VFbnRpcmVGaWxlID0gb25TYXZlIGFuZCBhdG9tLmNvbmZpZy5nZXQoXCJhdG9tLWJlYXV0aWZ5LmdlbmVyYWwuYmVhdXRpZnlFbnRpcmVGaWxlT25TYXZlXCIpXG5cbiAgICAjIEdldCB0aGUgcGF0aCB0byB0aGUgY29uZmlnIGZpbGVcbiAgICAjIEFsbCBvZiB0aGUgb3B0aW9uc1xuICAgICMgTGlzdGVkIGluIG9yZGVyIGZyb20gZGVmYXVsdCAoYmFzZSkgdG8gdGhlIG9uZSB3aXRoIHRoZSBoaWdoZXN0IHByaW9yaXR5XG4gICAgIyBMZWZ0ID0gRGVmYXVsdCwgUmlnaHQgPSBXaWxsIG92ZXJyaWRlIHRoZSBsZWZ0LlxuICAgICMgQXRvbSBFZGl0b3JcbiAgICAjXG4gICAgIyBVc2VyJ3MgSG9tZSBwYXRoXG4gICAgIyBQcm9qZWN0IHBhdGhcbiAgICAjIEFzeW5jaHJvbm91c2x5IGFuZCBjYWxsYmFjay1zdHlsZVxuICAgIGJlYXV0aWZ5Q29tcGxldGVkID0gKHRleHQpIC0+XG5cbiAgICAgIGlmIG5vdCB0ZXh0P1xuICAgICAgICAjIERvIG5vdGhpbmcsIGlzIHVuZGVmaW5lZFxuICAgICAgICAjIGNvbnNvbGUubG9nICdiZWF1dGlmeUNvbXBsZXRlZCdcbiAgICAgIGVsc2UgaWYgdGV4dCBpbnN0YW5jZW9mIEVycm9yXG4gICAgICAgIHNob3dFcnJvcih0ZXh0KVxuICAgICAgICByZXR1cm4gcmVqZWN0KHRleHQpXG4gICAgICBlbHNlIGlmIHR5cGVvZiB0ZXh0IGlzIFwic3RyaW5nXCJcbiAgICAgICAgaWYgb2xkVGV4dCBpc250IHRleHRcblxuICAgICAgICAgICMgY29uc29sZS5sb2cgXCJSZXBsYWNpbmcgY3VycmVudCBlZGl0b3IncyB0ZXh0IHdpdGggbmV3IHRleHRcIlxuICAgICAgICAgIHBvc0FycmF5ID0gZ2V0Q3Vyc29ycyhlZGl0b3IpXG5cbiAgICAgICAgICAjIGNvbnNvbGUubG9nIFwicG9zQXJyYXk6XG4gICAgICAgICAgb3JpZ1Njcm9sbFRvcCA9IGdldFNjcm9sbFRvcChlZGl0b3IpXG5cbiAgICAgICAgICAjIGNvbnNvbGUubG9nIFwib3JpZ1Njcm9sbFRvcDpcbiAgICAgICAgICBpZiBub3QgZm9yY2VFbnRpcmVGaWxlIGFuZCBpc1NlbGVjdGlvblxuICAgICAgICAgICAgc2VsZWN0ZWRCdWZmZXJSYW5nZSA9IGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKClcblxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZyBcInNlbGVjdGVkQnVmZmVyUmFuZ2U6XG4gICAgICAgICAgICBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2Ugc2VsZWN0ZWRCdWZmZXJSYW5nZSwgdGV4dFxuICAgICAgICAgIGVsc2VcblxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZyBcInNldFRleHRcIlxuICAgICAgICAgICAgZWRpdG9yLnNldFRleHQgdGV4dFxuXG4gICAgICAgICAgIyBjb25zb2xlLmxvZyBcInNldEN1cnNvcnNcIlxuICAgICAgICAgIHNldEN1cnNvcnMgZWRpdG9yLCBwb3NBcnJheVxuXG4gICAgICAgICAgIyBjb25zb2xlLmxvZyBcIkRvbmUgc2V0Q3Vyc29yc1wiXG4gICAgICAgICAgIyBMZXQgdGhlIHNjcm9sbFRvcCBzZXR0aW5nIHJ1biBhZnRlciBhbGwgdGhlIHNhdmUgcmVsYXRlZCBzdHVmZiBpcyBydW4sXG4gICAgICAgICAgIyBvdGhlcndpc2Ugc2V0U2Nyb2xsVG9wIGlzIG5vdCB3b3JraW5nLCBwcm9iYWJseSBiZWNhdXNlIHRoZSBjdXJzb3JcbiAgICAgICAgICAjIGFkZGl0aW9uIGhhcHBlbnMgYXN5bmNocm9ub3VzbHlcbiAgICAgICAgICBzZXRUaW1lb3V0ICggLT5cblxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZyBcInNldFNjcm9sbFRvcFwiXG4gICAgICAgICAgICBzZXRTY3JvbGxUb3AgZWRpdG9yLCBvcmlnU2Nyb2xsVG9wXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh0ZXh0KVxuICAgICAgICAgICksIDBcbiAgICAgIGVsc2VcbiAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCBiZWF1dGlmaWNhdGlvbiByZXN1bHQgJyN7dGV4dH0nLlwiKVxuICAgICAgICBzaG93RXJyb3IoZXJyb3IpXG4gICAgICAgIHJldHVybiByZWplY3QoZXJyb3IpXG5cbiAgICAgICMgZWxzZVxuICAgICAgIyBjb25zb2xlLmxvZyBcIkFscmVhZHkgQmVhdXRpZnVsIVwiXG4gICAgICByZXR1cm5cblxuICAgICMgY29uc29sZS5sb2cgJ0JlYXV0aWZ5IHRpbWUhJ1xuICAgICNcbiAgICAjIEdldCBjdXJyZW50IGVkaXRvclxuICAgIGVkaXRvciA9IGVkaXRvciA/IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG5cbiAgICAjIENoZWNrIGlmIHRoZXJlIGlzIGFuIGFjdGl2ZSBlZGl0b3JcbiAgICBpZiBub3QgZWRpdG9yP1xuICAgICAgcmV0dXJuIHNob3dFcnJvciggbmV3IEVycm9yKFwiQWN0aXZlIEVkaXRvciBub3QgZm91bmQuIFwiXG4gICAgICAgIFwiUGxlYXNlIHNlbGVjdCBhIFRleHQgRWRpdG9yIGZpcnN0IHRvIGJlYXV0aWZ5LlwiKSlcbiAgICBpc1NlbGVjdGlvbiA9ICEhZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG5cblxuICAgICMgR2V0IGVkaXRvciBwYXRoIGFuZCBjb25maWd1cmF0aW9ucyBmb3IgcGF0aHNcbiAgICBlZGl0ZWRGaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcblxuXG4gICAgIyBHZXQgYWxsIG9wdGlvbnNcbiAgICBhbGxPcHRpb25zID0gYmVhdXRpZmllci5nZXRPcHRpb25zRm9yUGF0aChlZGl0ZWRGaWxlUGF0aCwgZWRpdG9yKVxuXG5cbiAgICAjIEdldCBjdXJyZW50IGVkaXRvcidzIHRleHRcbiAgICB0ZXh0ID0gdW5kZWZpbmVkXG4gICAgaWYgbm90IGZvcmNlRW50aXJlRmlsZSBhbmQgaXNTZWxlY3Rpb25cbiAgICAgIHRleHQgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcbiAgICBlbHNlXG4gICAgICB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKVxuICAgIG9sZFRleHQgPSB0ZXh0XG5cblxuICAgICMgR2V0IEdyYW1tYXJcbiAgICBncmFtbWFyTmFtZSA9IGVkaXRvci5nZXRHcmFtbWFyKCkubmFtZVxuXG5cbiAgICAjIEZpbmFsbHksIGJlYXV0aWZ5IVxuICAgIHRyeVxuICAgICAgYmVhdXRpZmllci5iZWF1dGlmeSh0ZXh0LCBhbGxPcHRpb25zLCBncmFtbWFyTmFtZSwgZWRpdGVkRmlsZVBhdGgsIG9uU2F2ZSA6IG9uU2F2ZSlcbiAgICAgIC50aGVuKGJlYXV0aWZ5Q29tcGxldGVkKVxuICAgICAgLmNhdGNoKGJlYXV0aWZ5Q29tcGxldGVkKVxuICAgIGNhdGNoIGVcbiAgICAgIHNob3dFcnJvcihlKVxuICAgIHJldHVyblxuICApXG5cbmJlYXV0aWZ5RmlsZVBhdGggPSAoZmlsZVBhdGgsIGNhbGxiYWNrKSAtPlxuICBsb2dnZXIudmVyYm9zZSgnYmVhdXRpZnlGaWxlUGF0aCcsIGZpbGVQYXRoKVxuXG4gICMgU2hvdyBpbiBwcm9ncmVzcyBpbmRpY2F0ZSBvbiBmaWxlJ3MgdHJlZS12aWV3IGVudHJ5XG4gICQgPz0gcmVxdWlyZShcImF0b20tc3BhY2UtcGVuLXZpZXdzXCIpLiRcbiAgJGVsID0gJChcIi5pY29uLWZpbGUtdGV4dFtkYXRhLXBhdGg9XFxcIiN7ZmlsZVBhdGh9XFxcIl1cIilcbiAgJGVsLmFkZENsYXNzKCdiZWF1dGlmeWluZycpXG5cbiAgIyBDbGVhbnVwIGFuZCByZXR1cm4gY2FsbGJhY2sgZnVuY3Rpb25cbiAgY2IgPSAoZXJyLCByZXN1bHQpIC0+XG4gICAgbG9nZ2VyLnZlcmJvc2UoJ0NsZWFudXAgYmVhdXRpZnlGaWxlUGF0aCcsIGVyciwgcmVzdWx0KVxuICAgICRlbCA9ICQoXCIuaWNvbi1maWxlLXRleHRbZGF0YS1wYXRoPVxcXCIje2ZpbGVQYXRofVxcXCJdXCIpXG4gICAgJGVsLnJlbW92ZUNsYXNzKCdiZWF1dGlmeWluZycpXG4gICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgcmVzdWx0KVxuXG4gICMgR2V0IGNvbnRlbnRzIG9mIGZpbGVcbiAgZnMgPz0gcmVxdWlyZSBcImZzXCJcbiAgbG9nZ2VyLnZlcmJvc2UoJ3JlYWRGaWxlJywgZmlsZVBhdGgpXG4gIGZzLnJlYWRGaWxlKGZpbGVQYXRoLCAoZXJyLCBkYXRhKSAtPlxuICAgIGxvZ2dlci52ZXJib3NlKCdyZWFkRmlsZSBjb21wbGV0ZWQnLCBlcnIsIGZpbGVQYXRoKVxuICAgIHJldHVybiBjYihlcnIpIGlmIGVyclxuICAgIGlucHV0ID0gZGF0YT8udG9TdHJpbmcoKVxuICAgIGdyYW1tYXIgPSBhdG9tLmdyYW1tYXJzLnNlbGVjdEdyYW1tYXIoZmlsZVBhdGgsIGlucHV0KVxuICAgIGdyYW1tYXJOYW1lID0gZ3JhbW1hci5uYW1lXG5cbiAgICAjIEdldCB0aGUgb3B0aW9uc1xuICAgIGFsbE9wdGlvbnMgPSBiZWF1dGlmaWVyLmdldE9wdGlvbnNGb3JQYXRoKGZpbGVQYXRoKVxuICAgIGxvZ2dlci52ZXJib3NlKCdiZWF1dGlmeUZpbGVQYXRoIGFsbE9wdGlvbnMnLCBhbGxPcHRpb25zKVxuXG4gICAgIyBCZWF1dGlmeSBGaWxlXG4gICAgY29tcGxldGlvbkZ1biA9IChvdXRwdXQpIC0+XG4gICAgICBsb2dnZXIudmVyYm9zZSgnYmVhdXRpZnlGaWxlUGF0aCBjb21wbGV0aW9uRnVuJywgb3V0cHV0KVxuICAgICAgaWYgb3V0cHV0IGluc3RhbmNlb2YgRXJyb3JcbiAgICAgICAgcmV0dXJuIGNiKG91dHB1dCwgbnVsbCApICMgb3V0cHV0ID09IEVycm9yXG4gICAgICBlbHNlIGlmIHR5cGVvZiBvdXRwdXQgaXMgXCJzdHJpbmdcIlxuICAgICAgICAjIGRvIG5vdCBhbGxvdyBlbXB0eSBzdHJpbmdcbiAgICAgICAgaWYgb3V0cHV0LnRyaW0oKSBpcyAnJ1xuICAgICAgICAgIGxvZ2dlci52ZXJib3NlKCdiZWF1dGlmeUZpbGVQYXRoLCBvdXRwdXQgd2FzIGVtcHR5IHN0cmluZyEnKVxuICAgICAgICAgIHJldHVybiBjYihudWxsLCBvdXRwdXQpXG4gICAgICAgICMgc2F2ZSB0byBmaWxlXG4gICAgICAgIGZzLndyaXRlRmlsZShmaWxlUGF0aCwgb3V0cHV0LCAoZXJyKSAtPlxuICAgICAgICAgIHJldHVybiBjYihlcnIpIGlmIGVyclxuICAgICAgICAgIHJldHVybiBjYiggbnVsbCAsIG91dHB1dClcbiAgICAgICAgKVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gY2IoIG5ldyBFcnJvcihcIlVua25vd24gYmVhdXRpZmljYXRpb24gcmVzdWx0ICN7b3V0cHV0fS5cIiksIG91dHB1dClcbiAgICB0cnlcbiAgICAgIGxvZ2dlci52ZXJib3NlKCdiZWF1dGlmeScsIGlucHV0LCBhbGxPcHRpb25zLCBncmFtbWFyTmFtZSwgZmlsZVBhdGgpXG4gICAgICBiZWF1dGlmaWVyLmJlYXV0aWZ5KGlucHV0LCBhbGxPcHRpb25zLCBncmFtbWFyTmFtZSwgZmlsZVBhdGgpXG4gICAgICAudGhlbihjb21wbGV0aW9uRnVuKVxuICAgICAgLmNhdGNoKGNvbXBsZXRpb25GdW4pXG4gICAgY2F0Y2ggZVxuICAgICAgcmV0dXJuIGNiKGUpXG4gICAgKVxuXG5iZWF1dGlmeUZpbGUgPSAoe3RhcmdldH0pIC0+XG4gIGZpbGVQYXRoID0gdGFyZ2V0LmRhdGFzZXQucGF0aFxuICByZXR1cm4gdW5sZXNzIGZpbGVQYXRoXG4gIGJlYXV0aWZ5RmlsZVBhdGgoZmlsZVBhdGgsIChlcnIsIHJlc3VsdCkgLT5cbiAgICByZXR1cm4gc2hvd0Vycm9yKGVycikgaWYgZXJyXG4gICAgIyBjb25zb2xlLmxvZyhcIkJlYXV0aWZ5IEZpbGVcbiAgKVxuICByZXR1cm5cblxuYmVhdXRpZnlEaXJlY3RvcnkgPSAoe3RhcmdldH0pIC0+XG4gIGRpclBhdGggPSB0YXJnZXQuZGF0YXNldC5wYXRoXG4gIHJldHVybiB1bmxlc3MgZGlyUGF0aFxuXG4gIHJldHVybiBpZiBhdG9tPy5jb25maXJtKFxuICAgIG1lc3NhZ2U6IFwiVGhpcyB3aWxsIGJlYXV0aWZ5IGFsbCBvZiB0aGUgZmlsZXMgZm91bmQgXFxcbiAgICAgICAgcmVjdXJzaXZlbHkgaW4gdGhpcyBkaXJlY3RvcnksICcje2RpclBhdGh9Jy4gXFxcbiAgICAgICAgRG8geW91IHdhbnQgdG8gY29udGludWU/XCIsXG4gICAgYnV0dG9uczogWydZZXMsIGNvbnRpbnVlIScsJ05vLCBjYW5jZWwhJ10pIGlzbnQgMFxuXG4gICMgU2hvdyBpbiBwcm9ncmVzcyBpbmRpY2F0ZSBvbiBkaXJlY3RvcnkncyB0cmVlLXZpZXcgZW50cnlcbiAgJCA/PSByZXF1aXJlKFwiYXRvbS1zcGFjZS1wZW4tdmlld3NcIikuJFxuICAkZWwgPSAkKFwiLmljb24tZmlsZS1kaXJlY3RvcnlbZGF0YS1wYXRoPVxcXCIje2RpclBhdGh9XFxcIl1cIilcbiAgJGVsLmFkZENsYXNzKCdiZWF1dGlmeWluZycpXG5cbiAgIyBQcm9jZXNzIERpcmVjdG9yeVxuICBkaXIgPz0gcmVxdWlyZSBcIm5vZGUtZGlyXCJcbiAgYXN5bmMgPz0gcmVxdWlyZSBcImFzeW5jXCJcbiAgZGlyLmZpbGVzKGRpclBhdGgsIChlcnIsIGZpbGVzKSAtPlxuICAgIHJldHVybiBzaG93RXJyb3IoZXJyKSBpZiBlcnJcblxuICAgIGFzeW5jLmVhY2goZmlsZXMsIChmaWxlUGF0aCwgY2FsbGJhY2spIC0+XG4gICAgICAjIElnbm9yZSBlcnJvcnNcbiAgICAgIGJlYXV0aWZ5RmlsZVBhdGgoZmlsZVBhdGgsIC0+IGNhbGxiYWNrKCkpXG4gICAgLCAoZXJyKSAtPlxuICAgICAgJGVsID0gJChcIi5pY29uLWZpbGUtZGlyZWN0b3J5W2RhdGEtcGF0aD1cXFwiI3tkaXJQYXRofVxcXCJdXCIpXG4gICAgICAkZWwucmVtb3ZlQ2xhc3MoJ2JlYXV0aWZ5aW5nJylcbiAgICAgICMgY29uc29sZS5sb2coJ0NvbXBsZXRlZCBiZWF1dGlmeWluZyBkaXJlY3RvcnkhJywgZGlyUGF0aClcbiAgICApXG4gIClcbiAgcmV0dXJuXG5cbmRlYnVnID0gKCkgLT5cbiAgdHJ5XG4gICAgb3BlbiA9IHJlcXVpcmUoXCJvcGVuXCIpXG4gICAgZnMgPz0gcmVxdWlyZSBcImZzXCJcblxuICAgIHBsdWdpbi5jaGVja1Vuc3VwcG9ydGVkT3B0aW9ucygpXG5cbiAgICAjIEdldCBjdXJyZW50IGVkaXRvclxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgbGlua2lmeVRpdGxlID0gKHRpdGxlKSAtPlxuICAgICAgdGl0bGUgPSB0aXRsZS50b0xvd2VyQ2FzZSgpXG4gICAgICBwID0gdGl0bGUuc3BsaXQoL1tcXHMsKyM7LFxcLz86QCY9KyRdKy8pICMgc3BsaXQgaW50byBwYXJ0c1xuICAgICAgc2VwID0gXCItXCJcbiAgICAgIHAuam9pbihzZXApXG5cbiAgICAjIENoZWNrIGlmIHRoZXJlIGlzIGFuIGFjdGl2ZSBlZGl0b3JcbiAgICBpZiBub3QgZWRpdG9yP1xuICAgICAgcmV0dXJuIGNvbmZpcm0oXCJBY3RpdmUgRWRpdG9yIG5vdCBmb3VuZC5cXG5cIiArXG4gICAgICBcIlBsZWFzZSBzZWxlY3QgYSBUZXh0IEVkaXRvciBmaXJzdCB0byBiZWF1dGlmeS5cIilcbiAgICByZXR1cm4gdW5sZXNzIGNvbmZpcm0oJ0FyZSB5b3UgcmVhZHkgdG8gZGVidWcgQXRvbSBCZWF1dGlmeT8nKVxuICAgIGRlYnVnSW5mbyA9IFwiXCJcbiAgICBoZWFkZXJzID0gW11cbiAgICB0b2NFbCA9IFwiPFRBQkxFT0ZDT05URU5UUy8+XCJcbiAgICBhZGRJbmZvID0gKGtleSwgdmFsKSAtPlxuICAgICAgaWYga2V5P1xuICAgICAgICBkZWJ1Z0luZm8gKz0gXCIqKiN7a2V5fSoqOiAje3ZhbH1cXG5cXG5cIlxuICAgICAgZWxzZVxuICAgICAgICBkZWJ1Z0luZm8gKz0gXCIje3ZhbH1cXG5cXG5cIlxuICAgIGFkZEhlYWRlciA9IChsZXZlbCwgdGl0bGUpIC0+XG4gICAgICBkZWJ1Z0luZm8gKz0gXCIje0FycmF5KGxldmVsKzEpLmpvaW4oJyMnKX0gI3t0aXRsZX1cXG5cXG5cIlxuICAgICAgaGVhZGVycy5wdXNoKHtcbiAgICAgICAgbGV2ZWwsIHRpdGxlXG4gICAgICAgIH0pXG4gICAgYWRkSGVhZGVyKDEsIFwiQXRvbSBCZWF1dGlmeSAtIERlYnVnZ2luZyBpbmZvcm1hdGlvblwiKVxuICAgIGRlYnVnSW5mbyArPSBcIlRoZSBmb2xsb3dpbmcgZGVidWdnaW5nIGluZm9ybWF0aW9uIHdhcyBcIiArXG4gICAgXCJnZW5lcmF0ZWQgYnkgYEF0b20gQmVhdXRpZnlgIG9uIGAje25ldyBEYXRlKCl9YC5cIiArXG4gICAgXCJcXG5cXG4tLS1cXG5cXG5cIiArXG4gICAgdG9jRWwgK1xuICAgIFwiXFxuXFxuLS0tXFxuXFxuXCJcblxuICAgICMgUGxhdGZvcm1cbiAgICBhZGRJbmZvKCdQbGF0Zm9ybScsIHByb2Nlc3MucGxhdGZvcm0pXG4gICAgYWRkSGVhZGVyKDIsIFwiVmVyc2lvbnNcIilcblxuXG4gICAgIyBBdG9tIFZlcnNpb25cbiAgICBhZGRJbmZvKCdBdG9tIFZlcnNpb24nLCBhdG9tLmFwcFZlcnNpb24pXG5cblxuICAgICMgQXRvbSBCZWF1dGlmeSBWZXJzaW9uXG4gICAgYWRkSW5mbygnQXRvbSBCZWF1dGlmeSBWZXJzaW9uJywgcGtnLnZlcnNpb24pXG4gICAgYWRkSGVhZGVyKDIsIFwiT3JpZ2luYWwgZmlsZSB0byBiZSBiZWF1dGlmaWVkXCIpXG5cblxuICAgICMgT3JpZ2luYWwgZmlsZVxuICAgICNcbiAgICAjIEdldCBlZGl0b3IgcGF0aCBhbmQgY29uZmlndXJhdGlvbnMgZm9yIHBhdGhzXG4gICAgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG5cbiAgICAjIFBhdGhcbiAgICBhZGRJbmZvKCdPcmlnaW5hbCBGaWxlIFBhdGgnLCBcImAje2ZpbGVQYXRofWBcIilcblxuICAgICMgR2V0IEdyYW1tYXJcbiAgICBncmFtbWFyTmFtZSA9IGVkaXRvci5nZXRHcmFtbWFyKCkubmFtZVxuXG4gICAgIyBHcmFtbWFyXG4gICAgYWRkSW5mbygnT3JpZ2luYWwgRmlsZSBHcmFtbWFyJywgZ3JhbW1hck5hbWUpXG5cbiAgICAjIExhbmd1YWdlXG4gICAgbGFuZ3VhZ2UgPSBiZWF1dGlmaWVyLmdldExhbmd1YWdlKGdyYW1tYXJOYW1lLCBmaWxlUGF0aClcbiAgICBhZGRJbmZvKCdPcmlnaW5hbCBGaWxlIExhbmd1YWdlJywgbGFuZ3VhZ2U/Lm5hbWUpXG4gICAgYWRkSW5mbygnTGFuZ3VhZ2UgbmFtZXNwYWNlJywgbGFuZ3VhZ2U/Lm5hbWVzcGFjZSlcblxuICAgICMgQmVhdXRpZmllclxuICAgIGJlYXV0aWZpZXJzID0gYmVhdXRpZmllci5nZXRCZWF1dGlmaWVycyhsYW5ndWFnZS5uYW1lKVxuICAgIGFkZEluZm8oJ1N1cHBvcnRlZCBCZWF1dGlmaWVycycsIF8ubWFwKGJlYXV0aWZpZXJzLCAnbmFtZScpLmpvaW4oJywgJykpXG4gICAgc2VsZWN0ZWRCZWF1dGlmaWVyID0gYmVhdXRpZmllci5nZXRCZWF1dGlmaWVyRm9yTGFuZ3VhZ2UobGFuZ3VhZ2UpXG4gICAgYWRkSW5mbygnU2VsZWN0ZWQgQmVhdXRpZmllcicsIHNlbGVjdGVkQmVhdXRpZmllci5uYW1lKVxuXG4gICAgIyBHZXQgY3VycmVudCBlZGl0b3IncyB0ZXh0XG4gICAgdGV4dCA9IGVkaXRvci5nZXRUZXh0KCkgb3IgXCJcIlxuXG4gICAgIyBDb250ZW50c1xuICAgIGNvZGVCbG9ja1N5bnRheCA9IChsYW5ndWFnZT8ubmFtZSA/IGdyYW1tYXJOYW1lKS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcgJylbMF1cbiAgICBhZGRIZWFkZXIoMywgJ09yaWdpbmFsIEZpbGUgQ29udGVudHMnKVxuICAgIGFkZEluZm8obnVsbCwgXCJcXG5gYGAje2NvZGVCbG9ja1N5bnRheH1cXG4je3RleHR9XFxuYGBgXCIpXG5cbiAgICBhZGRIZWFkZXIoMywgJ1BhY2thZ2UgU2V0dGluZ3MnKVxuICAgIGFkZEluZm8obnVsbCxcbiAgICAgIFwiVGhlIHJhdyBwYWNrYWdlIHNldHRpbmdzIG9wdGlvbnNcXG5cIiArXG4gICAgICBcImBgYGpzb25cXG4je0pTT04uc3RyaW5naWZ5KGF0b20uY29uZmlnLmdldCgnYXRvbS1iZWF1dGlmeScpLCB1bmRlZmluZWQsIDQpfVxcbmBgYFwiKVxuXG4gICAgIyBCZWF1dGlmaWNhdGlvbiBPcHRpb25zXG4gICAgYWRkSGVhZGVyKDIsIFwiQmVhdXRpZmljYXRpb24gb3B0aW9uc1wiKVxuICAgICMgR2V0IGFsbCBvcHRpb25zXG4gICAgYWxsT3B0aW9ucyA9IGJlYXV0aWZpZXIuZ2V0T3B0aW9uc0ZvclBhdGgoZmlsZVBhdGgsIGVkaXRvcilcbiAgICAjIFJlc29sdmUgb3B0aW9ucyB3aXRoIHByb21pc2VzXG4gICAgUHJvbWlzZS5hbGwoYWxsT3B0aW9ucylcbiAgICAudGhlbigoYWxsT3B0aW9ucykgLT5cbiAgICAgICMgRXh0cmFjdCBvcHRpb25zXG4gICAgICBbXG4gICAgICAgICAgZWRpdG9yT3B0aW9uc1xuICAgICAgICAgIGNvbmZpZ09wdGlvbnNcbiAgICAgICAgICBob21lT3B0aW9uc1xuICAgICAgICAgIGVkaXRvckNvbmZpZ09wdGlvbnNcbiAgICAgIF0gPSBhbGxPcHRpb25zXG4gICAgICBwcm9qZWN0T3B0aW9ucyA9IGFsbE9wdGlvbnNbNC4uXVxuXG4gICAgICBwcmVUcmFuc2Zvcm1lZE9wdGlvbnMgPSBiZWF1dGlmaWVyLmdldE9wdGlvbnNGb3JMYW5ndWFnZShhbGxPcHRpb25zLCBsYW5ndWFnZSlcblxuICAgICAgaWYgc2VsZWN0ZWRCZWF1dGlmaWVyXG4gICAgICAgIGZpbmFsT3B0aW9ucyA9IGJlYXV0aWZpZXIudHJhbnNmb3JtT3B0aW9ucyhzZWxlY3RlZEJlYXV0aWZpZXIsIGxhbmd1YWdlLm5hbWUsIHByZVRyYW5zZm9ybWVkT3B0aW9ucylcblxuICAgICAgIyBTaG93IG9wdGlvbnNcbiAgICAgICMgYWRkSW5mbygnQWxsIE9wdGlvbnMnLCBcIlxcblwiICtcbiAgICAgICMgXCJBbGwgb3B0aW9ucyBleHRyYWN0ZWQgZm9yIGZpbGVcXG5cIiArXG4gICAgICAjIFwiYGBganNvblxcbiN7SlNPTi5zdHJpbmdpZnkoYWxsT3B0aW9ucywgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcbiAgICAgIGFkZEluZm8oJ0VkaXRvciBPcHRpb25zJywgXCJcXG5cIiArXG4gICAgICBcIk9wdGlvbnMgZnJvbSBBdG9tIEVkaXRvciBzZXR0aW5nc1xcblwiICtcbiAgICAgIFwiYGBganNvblxcbiN7SlNPTi5zdHJpbmdpZnkoZWRpdG9yT3B0aW9ucywgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcbiAgICAgIGFkZEluZm8oJ0NvbmZpZyBPcHRpb25zJywgXCJcXG5cIiArXG4gICAgICBcIk9wdGlvbnMgZnJvbSBBdG9tIEJlYXV0aWZ5IHBhY2thZ2Ugc2V0dGluZ3NcXG5cIiArXG4gICAgICBcImBgYGpzb25cXG4je0pTT04uc3RyaW5naWZ5KGNvbmZpZ09wdGlvbnMsIHVuZGVmaW5lZCwgNCl9XFxuYGBgXCIpXG4gICAgICBhZGRJbmZvKCdIb21lIE9wdGlvbnMnLCBcIlxcblwiICtcbiAgICAgIFwiT3B0aW9ucyBmcm9tIGAje3BhdGgucmVzb2x2ZShiZWF1dGlmaWVyLmdldFVzZXJIb21lKCksICcuanNiZWF1dGlmeXJjJyl9YFxcblwiICtcbiAgICAgIFwiYGBganNvblxcbiN7SlNPTi5zdHJpbmdpZnkoaG9tZU9wdGlvbnMsIHVuZGVmaW5lZCwgNCl9XFxuYGBgXCIpXG4gICAgICBhZGRJbmZvKCdFZGl0b3JDb25maWcgT3B0aW9ucycsIFwiXFxuXCIgK1xuICAgICAgXCJPcHRpb25zIGZyb20gW0VkaXRvckNvbmZpZ10oaHR0cDovL2VkaXRvcmNvbmZpZy5vcmcvKSBmaWxlXFxuXCIgK1xuICAgICAgXCJgYGBqc29uXFxuI3tKU09OLnN0cmluZ2lmeShlZGl0b3JDb25maWdPcHRpb25zLCB1bmRlZmluZWQsIDQpfVxcbmBgYFwiKVxuICAgICAgYWRkSW5mbygnUHJvamVjdCBPcHRpb25zJywgXCJcXG5cIiArXG4gICAgICBcIk9wdGlvbnMgZnJvbSBgLmpzYmVhdXRpZnlyY2AgZmlsZXMgc3RhcnRpbmcgZnJvbSBkaXJlY3RvcnkgYCN7cGF0aC5kaXJuYW1lKGZpbGVQYXRoKX1gIGFuZCBnb2luZyB1cCB0byByb290XFxuXCIgK1xuICAgICAgXCJgYGBqc29uXFxuI3tKU09OLnN0cmluZ2lmeShwcm9qZWN0T3B0aW9ucywgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcbiAgICAgIGFkZEluZm8oJ1ByZS1UcmFuc2Zvcm1lZCBPcHRpb25zJywgXCJcXG5cIiArXG4gICAgICBcIkNvbWJpbmVkIG9wdGlvbnMgYmVmb3JlIHRyYW5zZm9ybWluZyB0aGVtIGdpdmVuIGEgYmVhdXRpZmllcidzIHNwZWNpZmljYXRpb25zXFxuXCIgK1xuICAgICAgXCJgYGBqc29uXFxuI3tKU09OLnN0cmluZ2lmeShwcmVUcmFuc2Zvcm1lZE9wdGlvbnMsIHVuZGVmaW5lZCwgNCl9XFxuYGBgXCIpXG4gICAgICBpZiBzZWxlY3RlZEJlYXV0aWZpZXJcbiAgICAgICAgYWRkSGVhZGVyKDMsICdGaW5hbCBPcHRpb25zJylcbiAgICAgICAgYWRkSW5mbyhudWxsLFxuICAgICAgICAgIFwiRmluYWwgY29tYmluZWQgYW5kIHRyYW5zZm9ybWVkIG9wdGlvbnMgdGhhdCBhcmUgdXNlZFxcblwiICtcbiAgICAgICAgICBcImBgYGpzb25cXG4je0pTT04uc3RyaW5naWZ5KGZpbmFsT3B0aW9ucywgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcblxuICAgICAgI1xuICAgICAgbG9ncyA9IFwiXCJcbiAgICAgIGxvZ0ZpbGVQYXRoUmVnZXggPSBuZXcgUmVnRXhwKCdcXFxcOiBcXFxcWyguKilcXFxcXScpXG4gICAgICBzdWJzY3JpcHRpb24gPSBsb2dnZXIub25Mb2dnaW5nKChtc2cpIC0+XG4gICAgICAgICMgY29uc29sZS5sb2coJ2xvZ2dpbmcnLCBtc2cpXG4gICAgICAgIHNlcCA9IHBhdGguc2VwXG4gICAgICAgIGxvZ3MgKz0gbXNnLnJlcGxhY2UobG9nRmlsZVBhdGhSZWdleCwgKGEsYikgLT5cbiAgICAgICAgICBzID0gYi5zcGxpdChzZXApXG4gICAgICAgICAgaSA9IHMuaW5kZXhPZignYXRvbS1iZWF1dGlmeScpXG4gICAgICAgICAgcCA9IHMuc2xpY2UoaSsyKS5qb2luKHNlcClcbiAgICAgICAgICAjIGNvbnNvbGUubG9nKCdsb2dnaW5nJywgYXJndW1lbnRzLCBzLCBpLCBwKVxuICAgICAgICAgIHJldHVybiAnOiBbJytwKyddJ1xuICAgICAgICApXG4gICAgICApXG4gICAgICBjYiA9IChyZXN1bHQpIC0+XG4gICAgICAgIHN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgICAgYWRkSGVhZGVyKDIsIFwiUmVzdWx0c1wiKVxuXG4gICAgICAgICMgTG9nc1xuICAgICAgICBhZGRJbmZvKCdCZWF1dGlmaWVkIEZpbGUgQ29udGVudHMnLCBcIlxcbmBgYCN7Y29kZUJsb2NrU3ludGF4fVxcbiN7cmVzdWx0fVxcbmBgYFwiKVxuICAgICAgICAjIERpZmZcbiAgICAgICAgSnNEaWZmID0gcmVxdWlyZSgnZGlmZicpXG4gICAgICAgIGlmIHR5cGVvZiByZXN1bHQgaXMgXCJzdHJpbmdcIlxuICAgICAgICAgIGRpZmYgPSBKc0RpZmYuY3JlYXRlUGF0Y2goZmlsZVBhdGggb3IgXCJcIiwgdGV4dCBvciBcIlwiLCBcXFxuICAgICAgICAgICAgcmVzdWx0IG9yIFwiXCIsIFwib3JpZ2luYWxcIiwgXCJiZWF1dGlmaWVkXCIpXG4gICAgICAgICAgYWRkSW5mbygnT3JpZ2luYWwgdnMuIEJlYXV0aWZpZWQgRGlmZicsIFwiXFxuYGBgI3tjb2RlQmxvY2tTeW50YXh9XFxuI3tkaWZmfVxcbmBgYFwiKVxuXG4gICAgICAgIGFkZEhlYWRlcigzLCBcIkxvZ3NcIilcbiAgICAgICAgYWRkSW5mbyhudWxsLCBcImBgYFxcbiN7bG9nc31cXG5gYGBcIilcblxuICAgICAgICAjIEJ1aWxkIFRhYmxlIG9mIENvbnRlbnRzXG4gICAgICAgIHRvYyA9IFwiIyMgVGFibGUgT2YgQ29udGVudHNcXG5cIlxuICAgICAgICBmb3IgaGVhZGVyIGluIGhlYWRlcnNcbiAgICAgICAgICAjIyNcbiAgICAgICAgICAtIEhlYWRpbmcgMVxuICAgICAgICAgICAgLSBIZWFkaW5nIDEuMVxuICAgICAgICAgICMjI1xuICAgICAgICAgIGluZGVudCA9IFwiICBcIiAjIDIgc3BhY2VzXG4gICAgICAgICAgYnVsbGV0ID0gXCItXCJcbiAgICAgICAgICBpbmRlbnROdW0gPSBoZWFkZXIubGV2ZWwgLSAyXG4gICAgICAgICAgaWYgaW5kZW50TnVtID49IDBcbiAgICAgICAgICAgIHRvYyArPSAoXCIje0FycmF5KGluZGVudE51bSsxKS5qb2luKGluZGVudCl9I3tidWxsZXR9IFsje2hlYWRlci50aXRsZX1dKFxcIyN7bGlua2lmeVRpdGxlKGhlYWRlci50aXRsZSl9KVxcblwiKVxuICAgICAgICAjIFJlcGxhY2UgVEFCTEVPRkNPTlRFTlRTXG4gICAgICAgIGRlYnVnSW5mbyA9IGRlYnVnSW5mby5yZXBsYWNlKHRvY0VsLCB0b2MpXG5cbiAgICAgICAgIyBTYXZlIHRvIG5ldyBUZXh0RWRpdG9yXG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oKVxuICAgICAgICAgIC50aGVuKChlZGl0b3IpIC0+XG4gICAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChkZWJ1Z0luZm8pXG4gICAgICAgICAgICBjb25maXJtKFwiXCJcIlBsZWFzZSBsb2dpbiB0byBHaXRIdWIgYW5kIGNyZWF0ZSBhIEdpc3QgbmFtZWQgXFxcImRlYnVnLm1kXFxcIiAoTWFya2Rvd24gZmlsZSkgd2l0aCB5b3VyIGRlYnVnZ2luZyBpbmZvcm1hdGlvbi5cbiAgICAgICAgICAgIFRoZW4gYWRkIGEgbGluayB0byB5b3VyIEdpc3QgaW4geW91ciBHaXRIdWIgSXNzdWUuXG4gICAgICAgICAgICBUaGFuayB5b3UhXG5cbiAgICAgICAgICAgIEdpc3Q6IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL1xuICAgICAgICAgICAgR2l0SHViIElzc3VlczogaHR0cHM6Ly9naXRodWIuY29tL0dsYXZpbjAwMS9hdG9tLWJlYXV0aWZ5L2lzc3Vlc1xuICAgICAgICAgICAgXCJcIlwiKVxuICAgICAgICAgIClcbiAgICAgICAgICAuY2F0Y2goKGVycm9yKSAtPlxuICAgICAgICAgICAgY29uZmlybShcIkFuIGVycm9yIG9jY3VycmVkIHdoZW4gY3JlYXRpbmcgdGhlIEdpc3Q6IFwiK2Vycm9yLm1lc3NhZ2UpXG4gICAgICAgICAgKVxuICAgICAgdHJ5XG4gICAgICAgIGJlYXV0aWZpZXIuYmVhdXRpZnkodGV4dCwgYWxsT3B0aW9ucywgZ3JhbW1hck5hbWUsIGZpbGVQYXRoKVxuICAgICAgICAudGhlbihjYilcbiAgICAgICAgLmNhdGNoKGNiKVxuICAgICAgY2F0Y2ggZVxuICAgICAgICByZXR1cm4gY2IoZSlcbiAgICApXG4gICAgLmNhdGNoKChlcnJvcikgLT5cbiAgICAgIHN0YWNrID0gZXJyb3Iuc3RhY2tcbiAgICAgIGRldGFpbCA9IGVycm9yLmRlc2NyaXB0aW9uIG9yIGVycm9yLm1lc3NhZ2VcbiAgICAgIGF0b20/Lm5vdGlmaWNhdGlvbnM/LmFkZEVycm9yKGVycm9yLm1lc3NhZ2UsIHtcbiAgICAgICAgc3RhY2ssIGRldGFpbCwgZGlzbWlzc2FibGUgOiB0cnVlXG4gICAgICB9KVxuICAgIClcbiAgY2F0Y2ggZXJyb3JcbiAgICBzdGFjayA9IGVycm9yLnN0YWNrXG4gICAgZGV0YWlsID0gZXJyb3IuZGVzY3JpcHRpb24gb3IgZXJyb3IubWVzc2FnZVxuICAgIGF0b20/Lm5vdGlmaWNhdGlvbnM/LmFkZEVycm9yKGVycm9yLm1lc3NhZ2UsIHtcbiAgICAgIHN0YWNrLCBkZXRhaWwsIGRpc21pc3NhYmxlIDogdHJ1ZVxuICAgIH0pXG5cbmhhbmRsZVNhdmVFdmVudCA9IC0+XG4gIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSAtPlxuICAgIHBlbmRpbmdQYXRocyA9IHt9XG4gICAgYmVhdXRpZnlPblNhdmVIYW5kbGVyID0gKHtwYXRoOiBmaWxlUGF0aH0pIC0+XG4gICAgICBsb2dnZXIudmVyYm9zZSgnU2hvdWxkIGJlYXV0aWZ5IG9uIHRoaXMgc2F2ZT8nKVxuICAgICAgaWYgcGVuZGluZ1BhdGhzW2ZpbGVQYXRoXVxuICAgICAgICBsb2dnZXIudmVyYm9zZShcIkVkaXRvciB3aXRoIGZpbGUgcGF0aCAje2ZpbGVQYXRofSBhbHJlYWR5IGJlYXV0aWZpZWQhXCIpXG4gICAgICAgIHJldHVyblxuICAgICAgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICBwYXRoID89IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgIyBHZXQgR3JhbW1hclxuICAgICAgZ3JhbW1hciA9IGVkaXRvci5nZXRHcmFtbWFyKCkubmFtZVxuICAgICAgIyBHZXQgZmlsZSBleHRlbnNpb25cbiAgICAgIGZpbGVFeHRlbnNpb24gPSBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpXG4gICAgICAjIFJlbW92ZSBwcmVmaXggXCIuXCIgKHBlcmlvZCkgaW4gZmlsZUV4dGVuc2lvblxuICAgICAgZmlsZUV4dGVuc2lvbiA9IGZpbGVFeHRlbnNpb24uc3Vic3RyKDEpXG4gICAgICAjIEdldCBsYW5ndWFnZVxuICAgICAgbGFuZ3VhZ2VzID0gYmVhdXRpZmllci5sYW5ndWFnZXMuZ2V0TGFuZ3VhZ2VzKHtncmFtbWFyLCBleHRlbnNpb246IGZpbGVFeHRlbnNpb259KVxuICAgICAgaWYgbGFuZ3VhZ2VzLmxlbmd0aCA8IDFcbiAgICAgICAgcmV0dXJuXG4gICAgICAjIFRPRE86IHNlbGVjdCBhcHByb3ByaWF0ZSBsYW5ndWFnZVxuICAgICAgbGFuZ3VhZ2UgPSBsYW5ndWFnZXNbMF1cbiAgICAgICMgR2V0IGxhbmd1YWdlIGNvbmZpZ1xuICAgICAga2V5ID0gXCJhdG9tLWJlYXV0aWZ5LiN7bGFuZ3VhZ2UubmFtZXNwYWNlfS5iZWF1dGlmeV9vbl9zYXZlXCJcbiAgICAgIGJlYXV0aWZ5T25TYXZlID0gYXRvbS5jb25maWcuZ2V0KGtleSlcbiAgICAgIGxvZ2dlci52ZXJib3NlKCdzYXZlIGVkaXRvciBwb3NpdGlvbnMnLCBrZXksIGJlYXV0aWZ5T25TYXZlKVxuICAgICAgaWYgYmVhdXRpZnlPblNhdmVcbiAgICAgICAgbG9nZ2VyLnZlcmJvc2UoJ0JlYXV0aWZ5aW5nIGZpbGUnLCBmaWxlUGF0aClcbiAgICAgICAgYmVhdXRpZnkoe2VkaXRvciwgb25TYXZlOiB0cnVlfSlcbiAgICAgICAgLnRoZW4oKCkgLT5cbiAgICAgICAgICBsb2dnZXIudmVyYm9zZSgnRG9uZSBiZWF1dGlmeWluZyBmaWxlJywgZmlsZVBhdGgpXG4gICAgICAgICAgaWYgZWRpdG9yLmlzQWxpdmUoKSBpcyB0cnVlXG4gICAgICAgICAgICBsb2dnZXIudmVyYm9zZSgnU2F2aW5nIFRleHRFZGl0b3IuLi4nKVxuICAgICAgICAgICAgIyBTdG9yZSB0aGUgZmlsZVBhdGggdG8gcHJldmVudCBpbmZpbml0ZSBsb29waW5nXG4gICAgICAgICAgICAjIFdoZW4gV2hpdGVzcGFjZSBwYWNrYWdlIGhhcyBvcHRpb24gXCJFbnN1cmUgU2luZ2xlIFRyYWlsaW5nIE5ld2xpbmVcIiBlbmFibGVkXG4gICAgICAgICAgICAjIEl0IHdpbGwgYWRkIGEgbmV3bGluZSBhbmQga2VlcCB0aGUgZmlsZSBmcm9tIGNvbnZlcmdpbmcgb24gYSBiZWF1dGlmaWVkIGZvcm1cbiAgICAgICAgICAgICMgYW5kIHNhdmluZyB3aXRob3V0IGVtaXR0aW5nIG9uRGlkU2F2ZSBldmVudCwgYmVjYXVzZSB0aGVyZSB3ZXJlIG5vIGNoYW5nZXMuXG4gICAgICAgICAgICBwZW5kaW5nUGF0aHNbZmlsZVBhdGhdID0gdHJ1ZVxuICAgICAgICAgICAgZWRpdG9yLnNhdmUoKVxuICAgICAgICAgICAgZGVsZXRlIHBlbmRpbmdQYXRoc1tmaWxlUGF0aF1cbiAgICAgICAgICAgIGxvZ2dlci52ZXJib3NlKCdTYXZlZCBUZXh0RWRpdG9yLicpXG4gICAgICAgIClcbiAgICAgICAgLmNhdGNoKChlcnJvcikgLT5cbiAgICAgICAgICByZXR1cm4gc2hvd0Vycm9yKGVycm9yKVxuICAgICAgICApXG4gICAgZGlzcG9zYWJsZSA9IGVkaXRvci5vbkRpZFNhdmUoKHtwYXRoIDogZmlsZVBhdGh9KSAtPlxuICAgICAgIyBUT0RPOiBJbXBsZW1lbnQgZGVib3VuY2luZ1xuICAgICAgYmVhdXRpZnlPblNhdmVIYW5kbGVyKHtwYXRoOiBmaWxlUGF0aH0pXG4gICAgKVxuICAgIHBsdWdpbi5zdWJzY3JpcHRpb25zLmFkZCBkaXNwb3NhYmxlXG5cbmdldFVuc3VwcG9ydGVkT3B0aW9ucyA9IC0+XG4gIHNldHRpbmdzID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWJlYXV0aWZ5JylcbiAgc2NoZW1hID0gYXRvbS5jb25maWcuZ2V0U2NoZW1hKCdhdG9tLWJlYXV0aWZ5JylcbiAgdW5zdXBwb3J0ZWRPcHRpb25zID0gXy5maWx0ZXIoXy5rZXlzKHNldHRpbmdzKSwgKGtleSkgLT5cbiAgICAjIHJldHVybiBhdG9tLmNvbmZpZy5nZXRTY2hlbWEoXCJhdG9tLWJlYXV0aWZ5LiR7a2V5fVwiKS50eXBlXG4gICAgIyByZXR1cm4gdHlwZW9mIHNldHRpbmdzW2tleV1cbiAgICBzY2hlbWEucHJvcGVydGllc1trZXldIGlzIHVuZGVmaW5lZFxuICApXG4gIHJldHVybiB1bnN1cHBvcnRlZE9wdGlvbnNcblxucGx1Z2luLmNoZWNrVW5zdXBwb3J0ZWRPcHRpb25zID0gLT5cbiAgdW5zdXBwb3J0ZWRPcHRpb25zID0gZ2V0VW5zdXBwb3J0ZWRPcHRpb25zKClcbiAgaWYgdW5zdXBwb3J0ZWRPcHRpb25zLmxlbmd0aCBpc250IDBcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcIlBsZWFzZSBydW4gQXRvbSBjb21tYW5kICdBdG9tLUJlYXV0aWZ5OiBNaWdyYXRlIFNldHRpbmdzJy5cIiwge1xuICAgICAgZGV0YWlsIDogXCJZb3UgY2FuIG9wZW4gdGhlIEF0b20gY29tbWFuZCBwYWxldHRlIHdpdGggYGNtZC1zaGlmdC1wYCAoT1NYKSBvciBgY3RybC1zaGlmdC1wYCAoTGludXgvV2luZG93cykgaW4gQXRvbS4gWW91IGhhdmUgdW5zdXBwb3J0ZWQgb3B0aW9uczogI3t1bnN1cHBvcnRlZE9wdGlvbnMuam9pbignLCAnKX1cIixcbiAgICAgIGRpc21pc3NhYmxlIDogdHJ1ZVxuICAgIH0pXG5cbnBsdWdpbi5taWdyYXRlU2V0dGluZ3MgPSAtPlxuICB1bnN1cHBvcnRlZE9wdGlvbnMgPSBnZXRVbnN1cHBvcnRlZE9wdGlvbnMoKVxuICBuYW1lc3BhY2VzID0gYmVhdXRpZmllci5sYW5ndWFnZXMubmFtZXNwYWNlc1xuICAjIGNvbnNvbGUubG9nKCdtaWdyYXRlLXNldHRpbmdzJywgc2NoZW1hLCBuYW1lc3BhY2VzLCB1bnN1cHBvcnRlZE9wdGlvbnMpXG4gIGlmIHVuc3VwcG9ydGVkT3B0aW9ucy5sZW5ndGggaXMgMFxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKFwiTm8gb3B0aW9ucyB0byBtaWdyYXRlLlwiKVxuICBlbHNlXG4gICAgcmV4ID0gbmV3IFJlZ0V4cChcIigje25hbWVzcGFjZXMuam9pbignfCcpfSlfKC4qKVwiKVxuICAgIHJlbmFtZSA9IF8udG9QYWlycyhfLnppcE9iamVjdCh1bnN1cHBvcnRlZE9wdGlvbnMsIF8ubWFwKHVuc3VwcG9ydGVkT3B0aW9ucywgKGtleSkgLT5cbiAgICAgIG0gPSBrZXkubWF0Y2gocmV4KVxuICAgICAgaWYgbSBpcyBudWxsXG4gICAgICAgICMgRGlkIG5vdCBtYXRjaFxuICAgICAgICAjIFB1dCBpbnRvIGdlbmVyYWxcbiAgICAgICAgcmV0dXJuIFwiZ2VuZXJhbC4je2tleX1cIlxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gXCIje21bMV19LiN7bVsyXX1cIlxuICAgICkpKVxuICAgICMgY29uc29sZS5sb2coJ3JlbmFtZScsIHJlbmFtZSlcbiAgICAjIGxvZ2dlci52ZXJib3NlKCdyZW5hbWUnLCByZW5hbWUpXG5cbiAgICAjIE1vdmUgYWxsIG9wdGlvbiB2YWx1ZXMgdG8gcmVuYW1lZCBrZXlcbiAgICBfLmVhY2gocmVuYW1lLCAoW2tleSwgbmV3S2V5XSkgLT5cbiAgICAgICMgQ29weSB0byBuZXcga2V5XG4gICAgICB2YWwgPSBhdG9tLmNvbmZpZy5nZXQoXCJhdG9tLWJlYXV0aWZ5LiN7a2V5fVwiKVxuICAgICAgIyBjb25zb2xlLmxvZygncmVuYW1lJywga2V5LCBuZXdLZXksIHZhbClcbiAgICAgIGF0b20uY29uZmlnLnNldChcImF0b20tYmVhdXRpZnkuI3tuZXdLZXl9XCIsIHZhbClcbiAgICAgICMgRGVsZXRlIG9sZCBrZXlcbiAgICAgIGF0b20uY29uZmlnLnNldChcImF0b20tYmVhdXRpZnkuI3trZXl9XCIsIHVuZGVmaW5lZClcbiAgICApXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoXCJTdWNjZXNzZnVsbHkgbWlncmF0ZWQgb3B0aW9uczogI3t1bnN1cHBvcnRlZE9wdGlvbnMuam9pbignLCAnKX1cIilcblxucGx1Z2luLmNvbmZpZyA9IF8ubWVyZ2UocmVxdWlyZSgnLi9jb25maWcuY29mZmVlJyksIGRlZmF1bHRMYW5ndWFnZU9wdGlvbnMpXG5wbHVnaW4uYWN0aXZhdGUgPSAtPlxuICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIEBzdWJzY3JpcHRpb25zLmFkZCBoYW5kbGVTYXZlRXZlbnQoKVxuICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLCBcImF0b20tYmVhdXRpZnk6YmVhdXRpZnktZWRpdG9yXCIsIGJlYXV0aWZ5XG4gIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsIFwiYXRvbS1iZWF1dGlmeTpoZWxwLWRlYnVnLWVkaXRvclwiLCBkZWJ1Z1xuICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCIudHJlZS12aWV3IC5maWxlIC5uYW1lXCIsIFwiYXRvbS1iZWF1dGlmeTpiZWF1dGlmeS1maWxlXCIsIGJlYXV0aWZ5RmlsZVxuICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCIudHJlZS12aWV3IC5kaXJlY3RvcnkgLm5hbWVcIiwgXCJhdG9tLWJlYXV0aWZ5OmJlYXV0aWZ5LWRpcmVjdG9yeVwiLCBiZWF1dGlmeURpcmVjdG9yeVxuICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLCBcImF0b20tYmVhdXRpZnk6bWlncmF0ZS1zZXR0aW5nc1wiLCBwbHVnaW4ubWlncmF0ZVNldHRpbmdzXG5cbnBsdWdpbi5kZWFjdGl2YXRlID0gLT5cbiAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4iXX0=
