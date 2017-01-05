(function() {
  var ATOM_VARIABLES, ColorBuffer, ColorMarkerElement, ColorProject, ColorSearch, CompositeDisposable, Emitter, Palette, PathsLoader, PathsScanner, Range, SERIALIZE_MARKERS_VERSION, SERIALIZE_VERSION, THEME_VARIABLES, VariablesCollection, compareArray, minimatch, ref, scopeFromFileName,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = [], ColorBuffer = ref[0], ColorSearch = ref[1], Palette = ref[2], ColorMarkerElement = ref[3], VariablesCollection = ref[4], PathsLoader = ref[5], PathsScanner = ref[6], Emitter = ref[7], CompositeDisposable = ref[8], Range = ref[9], SERIALIZE_VERSION = ref[10], SERIALIZE_MARKERS_VERSION = ref[11], THEME_VARIABLES = ref[12], ATOM_VARIABLES = ref[13], scopeFromFileName = ref[14], minimatch = ref[15];

  compareArray = function(a, b) {
    var i, j, len, v;
    if ((a == null) || (b == null)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (i = j = 0, len = a.length; j < len; i = ++j) {
      v = a[i];
      if (v !== b[i]) {
        return false;
      }
    }
    return true;
  };

  module.exports = ColorProject = (function() {
    ColorProject.deserialize = function(state) {
      var markersVersion, ref1;
      if (SERIALIZE_VERSION == null) {
        ref1 = require('./versions'), SERIALIZE_VERSION = ref1.SERIALIZE_VERSION, SERIALIZE_MARKERS_VERSION = ref1.SERIALIZE_MARKERS_VERSION;
      }
      markersVersion = SERIALIZE_MARKERS_VERSION;
      if (atom.inDevMode() && atom.project.getPaths().some(function(p) {
        return p.match(/\/pigments$/);
      })) {
        markersVersion += '-dev';
      }
      if ((state != null ? state.version : void 0) !== SERIALIZE_VERSION) {
        state = {};
      }
      if ((state != null ? state.markersVersion : void 0) !== markersVersion) {
        delete state.variables;
        delete state.buffers;
      }
      if (!compareArray(state.globalSourceNames, atom.config.get('pigments.sourceNames')) || !compareArray(state.globalIgnoredNames, atom.config.get('pigments.ignoredNames'))) {
        delete state.variables;
        delete state.buffers;
        delete state.paths;
      }
      return new ColorProject(state);
    };

    function ColorProject(state) {
      var buffers, ref1, svgColorExpression, timestamp, variables;
      if (state == null) {
        state = {};
      }
      if (Emitter == null) {
        ref1 = require('atom'), Emitter = ref1.Emitter, CompositeDisposable = ref1.CompositeDisposable, Range = ref1.Range;
      }
      if (VariablesCollection == null) {
        VariablesCollection = require('./variables-collection');
      }
      this.includeThemes = state.includeThemes, this.ignoredNames = state.ignoredNames, this.sourceNames = state.sourceNames, this.ignoredScopes = state.ignoredScopes, this.paths = state.paths, this.searchNames = state.searchNames, this.ignoreGlobalSourceNames = state.ignoreGlobalSourceNames, this.ignoreGlobalIgnoredNames = state.ignoreGlobalIgnoredNames, this.ignoreGlobalIgnoredScopes = state.ignoreGlobalIgnoredScopes, this.ignoreGlobalSearchNames = state.ignoreGlobalSearchNames, this.ignoreGlobalSupportedFiletypes = state.ignoreGlobalSupportedFiletypes, this.supportedFiletypes = state.supportedFiletypes, variables = state.variables, timestamp = state.timestamp, buffers = state.buffers;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.colorBuffersByEditorId = {};
      this.bufferStates = buffers != null ? buffers : {};
      this.variableExpressionsRegistry = require('./variable-expressions');
      this.colorExpressionsRegistry = require('./color-expressions');
      if (variables != null) {
        this.variables = atom.deserializers.deserialize(variables);
      } else {
        this.variables = new VariablesCollection;
      }
      this.subscriptions.add(this.variables.onDidChange((function(_this) {
        return function(results) {
          return _this.emitVariablesChangeEvent(results);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.sourceNames', (function(_this) {
        return function() {
          return _this.updatePaths();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.ignoredNames', (function(_this) {
        return function() {
          return _this.updatePaths();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.ignoredBufferNames', (function(_this) {
        return function(ignoredBufferNames) {
          _this.ignoredBufferNames = ignoredBufferNames;
          return _this.updateColorBuffers();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.ignoredScopes', (function(_this) {
        return function() {
          return _this.emitter.emit('did-change-ignored-scopes', _this.getIgnoredScopes());
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.supportedFiletypes', (function(_this) {
        return function() {
          _this.updateIgnoredFiletypes();
          return _this.emitter.emit('did-change-ignored-scopes', _this.getIgnoredScopes());
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.markerType', function(type) {
        if (type != null) {
          if (ColorMarkerElement == null) {
            ColorMarkerElement = require('./color-marker-element');
          }
          return ColorMarkerElement.setMarkerType(type);
        }
      }));
      this.subscriptions.add(atom.config.observe('pigments.ignoreVcsIgnoredPaths', (function(_this) {
        return function() {
          return _this.loadPathsAndVariables();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.sassShadeAndTintImplementation', (function(_this) {
        return function() {
          return _this.colorExpressionsRegistry.emitter.emit('did-update-expressions', {
            registry: _this.colorExpressionsRegistry
          });
        };
      })(this)));
      svgColorExpression = this.colorExpressionsRegistry.getExpression('pigments:named_colors');
      this.subscriptions.add(atom.config.observe('pigments.filetypesForColorWords', (function(_this) {
        return function(scopes) {
          svgColorExpression.scopes = scopes != null ? scopes : [];
          return _this.colorExpressionsRegistry.emitter.emit('did-update-expressions', {
            name: svgColorExpression.name,
            registry: _this.colorExpressionsRegistry
          });
        };
      })(this)));
      this.subscriptions.add(this.colorExpressionsRegistry.onDidUpdateExpressions((function(_this) {
        return function(arg) {
          var name;
          name = arg.name;
          if ((_this.paths == null) || name === 'pigments:variables') {
            return;
          }
          return _this.variables.evaluateVariables(_this.variables.getVariables(), function() {
            var colorBuffer, id, ref2, results1;
            ref2 = _this.colorBuffersByEditorId;
            results1 = [];
            for (id in ref2) {
              colorBuffer = ref2[id];
              results1.push(colorBuffer.update());
            }
            return results1;
          });
        };
      })(this)));
      this.subscriptions.add(this.variableExpressionsRegistry.onDidUpdateExpressions((function(_this) {
        return function() {
          if (_this.paths == null) {
            return;
          }
          return _this.reloadVariablesForPaths(_this.getPaths());
        };
      })(this)));
      if (timestamp != null) {
        this.timestamp = new Date(Date.parse(timestamp));
      }
      this.updateIgnoredFiletypes();
      if (this.paths != null) {
        this.initialize();
      }
      this.initializeBuffers();
    }

    ColorProject.prototype.onDidInitialize = function(callback) {
      return this.emitter.on('did-initialize', callback);
    };

    ColorProject.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    ColorProject.prototype.onDidUpdateVariables = function(callback) {
      return this.emitter.on('did-update-variables', callback);
    };

    ColorProject.prototype.onDidCreateColorBuffer = function(callback) {
      return this.emitter.on('did-create-color-buffer', callback);
    };

    ColorProject.prototype.onDidChangeIgnoredScopes = function(callback) {
      return this.emitter.on('did-change-ignored-scopes', callback);
    };

    ColorProject.prototype.onDidChangePaths = function(callback) {
      return this.emitter.on('did-change-paths', callback);
    };

    ColorProject.prototype.observeColorBuffers = function(callback) {
      var colorBuffer, id, ref1;
      ref1 = this.colorBuffersByEditorId;
      for (id in ref1) {
        colorBuffer = ref1[id];
        callback(colorBuffer);
      }
      return this.onDidCreateColorBuffer(callback);
    };

    ColorProject.prototype.isInitialized = function() {
      return this.initialized;
    };

    ColorProject.prototype.isDestroyed = function() {
      return this.destroyed;
    };

    ColorProject.prototype.initialize = function() {
      if (this.isInitialized()) {
        return Promise.resolve(this.variables.getVariables());
      }
      if (this.initializePromise != null) {
        return this.initializePromise;
      }
      return this.initializePromise = new Promise((function(_this) {
        return function(resolve) {
          return _this.variables.onceInitialized(resolve);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.loadPathsAndVariables();
        };
      })(this)).then((function(_this) {
        return function() {
          if (_this.includeThemes) {
            return _this.includeThemesVariables();
          }
        };
      })(this)).then((function(_this) {
        return function() {
          var variables;
          _this.initialized = true;
          variables = _this.variables.getVariables();
          _this.emitter.emit('did-initialize', variables);
          return variables;
        };
      })(this));
    };

    ColorProject.prototype.destroy = function() {
      var buffer, id, ref1;
      if (this.destroyed) {
        return;
      }
      if (PathsScanner == null) {
        PathsScanner = require('./paths-scanner');
      }
      this.destroyed = true;
      PathsScanner.terminateRunningTask();
      ref1 = this.colorBuffersByEditorId;
      for (id in ref1) {
        buffer = ref1[id];
        buffer.destroy();
      }
      this.colorBuffersByEditorId = null;
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.emitter.emit('did-destroy', this);
      return this.emitter.dispose();
    };

    ColorProject.prototype.reload = function() {
      return this.initialize().then((function(_this) {
        return function() {
          _this.variables.reset();
          _this.paths = [];
          return _this.loadPathsAndVariables();
        };
      })(this)).then((function(_this) {
        return function() {
          if (atom.config.get('pigments.notifyReloads')) {
            return atom.notifications.addSuccess("Pigments successfully reloaded", {
              dismissable: atom.config.get('pigments.dismissableReloadNotifications'),
              description: "Found:\n- **" + _this.paths.length + "** path(s)\n- **" + (_this.getVariables().length) + "** variables(s) including **" + (_this.getColorVariables().length) + "** color(s)"
            });
          } else {
            return console.log("Found:\n- " + _this.paths.length + " path(s)\n- " + (_this.getVariables().length) + " variables(s) including " + (_this.getColorVariables().length) + " color(s)");
          }
        };
      })(this))["catch"](function(reason) {
        var detail, stack;
        detail = reason.message;
        stack = reason.stack;
        atom.notifications.addError("Pigments couldn't be reloaded", {
          detail: detail,
          stack: stack,
          dismissable: true
        });
        return console.error(reason);
      });
    };

    ColorProject.prototype.loadPathsAndVariables = function() {
      var destroyed;
      destroyed = null;
      return this.loadPaths().then((function(_this) {
        return function(arg) {
          var dirtied, j, len, path, removed;
          dirtied = arg.dirtied, removed = arg.removed;
          if (removed.length > 0) {
            _this.paths = _this.paths.filter(function(p) {
              return indexOf.call(removed, p) < 0;
            });
            _this.deleteVariablesForPaths(removed);
          }
          if ((_this.paths != null) && dirtied.length > 0) {
            for (j = 0, len = dirtied.length; j < len; j++) {
              path = dirtied[j];
              if (indexOf.call(_this.paths, path) < 0) {
                _this.paths.push(path);
              }
            }
            if (_this.variables.length) {
              return dirtied;
            } else {
              return _this.paths;
            }
          } else if (_this.paths == null) {
            return _this.paths = dirtied;
          } else if (!_this.variables.length) {
            return _this.paths;
          } else {
            return [];
          }
        };
      })(this)).then((function(_this) {
        return function(paths) {
          return _this.loadVariablesForPaths(paths);
        };
      })(this)).then((function(_this) {
        return function(results) {
          if (results != null) {
            return _this.variables.updateCollection(results);
          }
        };
      })(this));
    };

    ColorProject.prototype.findAllColors = function() {
      var patterns;
      if (ColorSearch == null) {
        ColorSearch = require('./color-search');
      }
      patterns = this.getSearchNames();
      return new ColorSearch({
        sourceNames: patterns,
        project: this,
        ignoredNames: this.getIgnoredNames(),
        context: this.getContext()
      });
    };

    ColorProject.prototype.setColorPickerAPI = function(colorPickerAPI) {
      this.colorPickerAPI = colorPickerAPI;
    };

    ColorProject.prototype.initializeBuffers = function() {
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var buffer, bufferElement, editorPath;
          editorPath = editor.getPath();
          if ((editorPath == null) || _this.isBufferIgnored(editorPath)) {
            return;
          }
          buffer = _this.colorBufferForEditor(editor);
          if (buffer != null) {
            bufferElement = atom.views.getView(buffer);
            return bufferElement.attach();
          }
        };
      })(this)));
    };

    ColorProject.prototype.hasColorBufferForEditor = function(editor) {
      if (this.destroyed || (editor == null)) {
        return false;
      }
      return this.colorBuffersByEditorId[editor.id] != null;
    };

    ColorProject.prototype.colorBufferForEditor = function(editor) {
      var buffer, state, subscription;
      if (this.destroyed) {
        return;
      }
      if (editor == null) {
        return;
      }
      if (ColorBuffer == null) {
        ColorBuffer = require('./color-buffer');
      }
      if (this.colorBuffersByEditorId[editor.id] != null) {
        return this.colorBuffersByEditorId[editor.id];
      }
      if (this.bufferStates[editor.id] != null) {
        state = this.bufferStates[editor.id];
        state.editor = editor;
        state.project = this;
        delete this.bufferStates[editor.id];
      } else {
        state = {
          editor: editor,
          project: this
        };
      }
      this.colorBuffersByEditorId[editor.id] = buffer = new ColorBuffer(state);
      this.subscriptions.add(subscription = buffer.onDidDestroy((function(_this) {
        return function() {
          _this.subscriptions.remove(subscription);
          subscription.dispose();
          return delete _this.colorBuffersByEditorId[editor.id];
        };
      })(this)));
      this.emitter.emit('did-create-color-buffer', buffer);
      return buffer;
    };

    ColorProject.prototype.colorBufferForPath = function(path) {
      var colorBuffer, id, ref1;
      ref1 = this.colorBuffersByEditorId;
      for (id in ref1) {
        colorBuffer = ref1[id];
        if (colorBuffer.editor.getPath() === path) {
          return colorBuffer;
        }
      }
    };

    ColorProject.prototype.updateColorBuffers = function() {
      var buffer, bufferElement, e, editor, id, j, len, ref1, ref2, results1;
      ref1 = this.colorBuffersByEditorId;
      for (id in ref1) {
        buffer = ref1[id];
        if (this.isBufferIgnored(buffer.editor.getPath())) {
          buffer.destroy();
          delete this.colorBuffersByEditorId[id];
        }
      }
      try {
        if (this.colorBuffersByEditorId != null) {
          ref2 = atom.workspace.getTextEditors();
          results1 = [];
          for (j = 0, len = ref2.length; j < len; j++) {
            editor = ref2[j];
            if (this.hasColorBufferForEditor(editor) || this.isBufferIgnored(editor.getPath())) {
              continue;
            }
            buffer = this.colorBufferForEditor(editor);
            if (buffer != null) {
              bufferElement = atom.views.getView(buffer);
              results1.push(bufferElement.attach());
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        }
      } catch (error) {
        e = error;
        return console.log(e);
      }
    };

    ColorProject.prototype.isBufferIgnored = function(path) {
      var j, len, ref1, source, sources;
      if (minimatch == null) {
        minimatch = require('minimatch');
      }
      path = atom.project.relativize(path);
      sources = (ref1 = this.ignoredBufferNames) != null ? ref1 : [];
      for (j = 0, len = sources.length; j < len; j++) {
        source = sources[j];
        if (minimatch(path, source, {
          matchBase: true,
          dot: true
        })) {
          return true;
        }
      }
      return false;
    };

    ColorProject.prototype.getPaths = function() {
      var ref1;
      return (ref1 = this.paths) != null ? ref1.slice() : void 0;
    };

    ColorProject.prototype.appendPath = function(path) {
      if (path != null) {
        return this.paths.push(path);
      }
    };

    ColorProject.prototype.hasPath = function(path) {
      var ref1;
      return indexOf.call((ref1 = this.paths) != null ? ref1 : [], path) >= 0;
    };

    ColorProject.prototype.loadPaths = function(noKnownPaths) {
      if (noKnownPaths == null) {
        noKnownPaths = false;
      }
      if (PathsLoader == null) {
        PathsLoader = require('./paths-loader');
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var config, knownPaths, ref1, rootPaths;
          rootPaths = _this.getRootPaths();
          knownPaths = noKnownPaths ? [] : (ref1 = _this.paths) != null ? ref1 : [];
          config = {
            knownPaths: knownPaths,
            timestamp: _this.timestamp,
            ignoredNames: _this.getIgnoredNames(),
            paths: rootPaths,
            traverseIntoSymlinkDirectories: atom.config.get('pigments.traverseIntoSymlinkDirectories'),
            sourceNames: _this.getSourceNames(),
            ignoreVcsIgnores: atom.config.get('pigments.ignoreVcsIgnoredPaths')
          };
          return PathsLoader.startTask(config, function(results) {
            var isDescendentOfRootPaths, j, len, p;
            for (j = 0, len = knownPaths.length; j < len; j++) {
              p = knownPaths[j];
              isDescendentOfRootPaths = rootPaths.some(function(root) {
                return p.indexOf(root) === 0;
              });
              if (!isDescendentOfRootPaths) {
                if (results.removed == null) {
                  results.removed = [];
                }
                results.removed.push(p);
              }
            }
            return resolve(results);
          });
        };
      })(this));
    };

    ColorProject.prototype.updatePaths = function() {
      if (!this.initialized) {
        return Promise.resolve();
      }
      return this.loadPaths().then((function(_this) {
        return function(arg) {
          var dirtied, j, len, p, removed;
          dirtied = arg.dirtied, removed = arg.removed;
          _this.deleteVariablesForPaths(removed);
          _this.paths = _this.paths.filter(function(p) {
            return indexOf.call(removed, p) < 0;
          });
          for (j = 0, len = dirtied.length; j < len; j++) {
            p = dirtied[j];
            if (indexOf.call(_this.paths, p) < 0) {
              _this.paths.push(p);
            }
          }
          _this.emitter.emit('did-change-paths', _this.getPaths());
          return _this.reloadVariablesForPaths(dirtied);
        };
      })(this));
    };

    ColorProject.prototype.isVariablesSourcePath = function(path) {
      var j, len, source, sources;
      if (!path) {
        return false;
      }
      if (minimatch == null) {
        minimatch = require('minimatch');
      }
      path = atom.project.relativize(path);
      sources = this.getSourceNames();
      for (j = 0, len = sources.length; j < len; j++) {
        source = sources[j];
        if (minimatch(path, source, {
          matchBase: true,
          dot: true
        })) {
          return true;
        }
      }
    };

    ColorProject.prototype.isIgnoredPath = function(path) {
      var ignore, ignoredNames, j, len;
      if (!path) {
        return false;
      }
      if (minimatch == null) {
        minimatch = require('minimatch');
      }
      path = atom.project.relativize(path);
      ignoredNames = this.getIgnoredNames();
      for (j = 0, len = ignoredNames.length; j < len; j++) {
        ignore = ignoredNames[j];
        if (minimatch(path, ignore, {
          matchBase: true,
          dot: true
        })) {
          return true;
        }
      }
    };

    ColorProject.prototype.scopeFromFileName = function(path) {
      var scope;
      if (scopeFromFileName == null) {
        scopeFromFileName = require('./scope-from-file-name');
      }
      scope = scopeFromFileName(path);
      if (scope === 'sass' || scope === 'scss') {
        scope = [scope, this.getSassScopeSuffix()].join(':');
      }
      return scope;
    };

    ColorProject.prototype.getPalette = function() {
      if (Palette == null) {
        Palette = require('./palette');
      }
      if (!this.isInitialized()) {
        return new Palette;
      }
      return new Palette(this.getColorVariables());
    };

    ColorProject.prototype.getContext = function() {
      return this.variables.getContext();
    };

    ColorProject.prototype.getVariables = function() {
      return this.variables.getVariables();
    };

    ColorProject.prototype.getVariableExpressionsRegistry = function() {
      return this.variableExpressionsRegistry;
    };

    ColorProject.prototype.getVariableById = function(id) {
      return this.variables.getVariableById(id);
    };

    ColorProject.prototype.getVariableByName = function(name) {
      return this.variables.getVariableByName(name);
    };

    ColorProject.prototype.getColorVariables = function() {
      return this.variables.getColorVariables();
    };

    ColorProject.prototype.getColorExpressionsRegistry = function() {
      return this.colorExpressionsRegistry;
    };

    ColorProject.prototype.showVariableInFile = function(variable) {
      return atom.workspace.open(variable.path).then(function(editor) {
        var buffer, bufferRange, ref1;
        if (Range == null) {
          ref1 = require('atom'), Emitter = ref1.Emitter, CompositeDisposable = ref1.CompositeDisposable, Range = ref1.Range;
        }
        buffer = editor.getBuffer();
        bufferRange = Range.fromObject([buffer.positionForCharacterIndex(variable.range[0]), buffer.positionForCharacterIndex(variable.range[1])]);
        return editor.setSelectedBufferRange(bufferRange, {
          autoscroll: true
        });
      });
    };

    ColorProject.prototype.emitVariablesChangeEvent = function(results) {
      return this.emitter.emit('did-update-variables', results);
    };

    ColorProject.prototype.loadVariablesForPath = function(path) {
      return this.loadVariablesForPaths([path]);
    };

    ColorProject.prototype.loadVariablesForPaths = function(paths) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.scanPathsForVariables(paths, function(results) {
            return resolve(results);
          });
        };
      })(this));
    };

    ColorProject.prototype.getVariablesForPath = function(path) {
      return this.variables.getVariablesForPath(path);
    };

    ColorProject.prototype.getVariablesForPaths = function(paths) {
      return this.variables.getVariablesForPaths(paths);
    };

    ColorProject.prototype.deleteVariablesForPath = function(path) {
      return this.deleteVariablesForPaths([path]);
    };

    ColorProject.prototype.deleteVariablesForPaths = function(paths) {
      return this.variables.deleteVariablesForPaths(paths);
    };

    ColorProject.prototype.reloadVariablesForPath = function(path) {
      return this.reloadVariablesForPaths([path]);
    };

    ColorProject.prototype.reloadVariablesForPaths = function(paths) {
      var promise;
      promise = Promise.resolve();
      if (!this.isInitialized()) {
        promise = this.initialize();
      }
      return promise.then((function(_this) {
        return function() {
          if (paths.some(function(path) {
            return indexOf.call(_this.paths, path) < 0;
          })) {
            return Promise.resolve([]);
          }
          return _this.loadVariablesForPaths(paths);
        };
      })(this)).then((function(_this) {
        return function(results) {
          return _this.variables.updateCollection(results, paths);
        };
      })(this));
    };

    ColorProject.prototype.scanPathsForVariables = function(paths, callback) {
      var colorBuffer;
      if (paths.length === 1 && (colorBuffer = this.colorBufferForPath(paths[0]))) {
        return colorBuffer.scanBufferForVariables().then(function(results) {
          return callback(results);
        });
      } else {
        if (PathsScanner == null) {
          PathsScanner = require('./paths-scanner');
        }
        return PathsScanner.startTask(paths.map((function(_this) {
          return function(p) {
            return [p, _this.scopeFromFileName(p)];
          };
        })(this)), this.variableExpressionsRegistry, function(results) {
          return callback(results);
        });
      }
    };

    ColorProject.prototype.loadThemesVariables = function() {
      var div, html, iterator, variables;
      if (THEME_VARIABLES == null) {
        THEME_VARIABLES = require('./uris').THEME_VARIABLES;
      }
      if (ATOM_VARIABLES == null) {
        ATOM_VARIABLES = require('./atom-variables');
      }
      iterator = 0;
      variables = [];
      html = '';
      ATOM_VARIABLES.forEach(function(v) {
        return html += "<div class='" + v + "'>" + v + "</div>";
      });
      div = document.createElement('div');
      div.className = 'pigments-sampler';
      div.innerHTML = html;
      document.body.appendChild(div);
      ATOM_VARIABLES.forEach(function(v, i) {
        var color, end, node, variable;
        node = div.children[i];
        color = getComputedStyle(node).color;
        end = iterator + v.length + color.length + 4;
        variable = {
          name: "@" + v,
          line: i,
          value: color,
          range: [iterator, end],
          path: THEME_VARIABLES
        };
        iterator = end;
        return variables.push(variable);
      });
      document.body.removeChild(div);
      return variables;
    };

    ColorProject.prototype.getRootPaths = function() {
      return atom.project.getPaths();
    };

    ColorProject.prototype.getSassScopeSuffix = function() {
      var ref1, ref2;
      return (ref1 = (ref2 = this.sassShadeAndTintImplementation) != null ? ref2 : atom.config.get('pigments.sassShadeAndTintImplementation')) != null ? ref1 : 'compass';
    };

    ColorProject.prototype.setSassShadeAndTintImplementation = function(sassShadeAndTintImplementation) {
      this.sassShadeAndTintImplementation = sassShadeAndTintImplementation;
      return this.colorExpressionsRegistry.emitter.emit('did-update-expressions', {
        registry: this.colorExpressionsRegistry
      });
    };

    ColorProject.prototype.getSourceNames = function() {
      var names, ref1, ref2;
      names = ['.pigments'];
      names = names.concat((ref1 = this.sourceNames) != null ? ref1 : []);
      if (!this.ignoreGlobalSourceNames) {
        names = names.concat((ref2 = atom.config.get('pigments.sourceNames')) != null ? ref2 : []);
      }
      return names;
    };

    ColorProject.prototype.setSourceNames = function(sourceNames) {
      this.sourceNames = sourceNames != null ? sourceNames : [];
      if ((this.initialized == null) && (this.initializePromise == null)) {
        return;
      }
      return this.initialize().then((function(_this) {
        return function() {
          return _this.loadPathsAndVariables(true);
        };
      })(this));
    };

    ColorProject.prototype.setIgnoreGlobalSourceNames = function(ignoreGlobalSourceNames) {
      this.ignoreGlobalSourceNames = ignoreGlobalSourceNames;
      return this.updatePaths();
    };

    ColorProject.prototype.getSearchNames = function() {
      var names, ref1, ref2, ref3, ref4;
      names = [];
      names = names.concat((ref1 = this.sourceNames) != null ? ref1 : []);
      names = names.concat((ref2 = this.searchNames) != null ? ref2 : []);
      if (!this.ignoreGlobalSearchNames) {
        names = names.concat((ref3 = atom.config.get('pigments.sourceNames')) != null ? ref3 : []);
        names = names.concat((ref4 = atom.config.get('pigments.extendedSearchNames')) != null ? ref4 : []);
      }
      return names;
    };

    ColorProject.prototype.setSearchNames = function(searchNames) {
      this.searchNames = searchNames != null ? searchNames : [];
    };

    ColorProject.prototype.setIgnoreGlobalSearchNames = function(ignoreGlobalSearchNames) {
      this.ignoreGlobalSearchNames = ignoreGlobalSearchNames;
    };

    ColorProject.prototype.getIgnoredNames = function() {
      var names, ref1, ref2, ref3;
      names = (ref1 = this.ignoredNames) != null ? ref1 : [];
      if (!this.ignoreGlobalIgnoredNames) {
        names = names.concat((ref2 = this.getGlobalIgnoredNames()) != null ? ref2 : []);
        names = names.concat((ref3 = atom.config.get('core.ignoredNames')) != null ? ref3 : []);
      }
      return names;
    };

    ColorProject.prototype.getGlobalIgnoredNames = function() {
      var ref1;
      return (ref1 = atom.config.get('pigments.ignoredNames')) != null ? ref1.map(function(p) {
        if (/\/\*$/.test(p)) {
          return p + '*';
        } else {
          return p;
        }
      }) : void 0;
    };

    ColorProject.prototype.setIgnoredNames = function(ignoredNames1) {
      this.ignoredNames = ignoredNames1 != null ? ignoredNames1 : [];
      if ((this.initialized == null) && (this.initializePromise == null)) {
        return Promise.reject('Project is not initialized yet');
      }
      return this.initialize().then((function(_this) {
        return function() {
          var dirtied;
          dirtied = _this.paths.filter(function(p) {
            return _this.isIgnoredPath(p);
          });
          _this.deleteVariablesForPaths(dirtied);
          _this.paths = _this.paths.filter(function(p) {
            return !_this.isIgnoredPath(p);
          });
          return _this.loadPathsAndVariables(true);
        };
      })(this));
    };

    ColorProject.prototype.setIgnoreGlobalIgnoredNames = function(ignoreGlobalIgnoredNames) {
      this.ignoreGlobalIgnoredNames = ignoreGlobalIgnoredNames;
      return this.updatePaths();
    };

    ColorProject.prototype.getIgnoredScopes = function() {
      var ref1, ref2, scopes;
      scopes = (ref1 = this.ignoredScopes) != null ? ref1 : [];
      if (!this.ignoreGlobalIgnoredScopes) {
        scopes = scopes.concat((ref2 = atom.config.get('pigments.ignoredScopes')) != null ? ref2 : []);
      }
      scopes = scopes.concat(this.ignoredFiletypes);
      return scopes;
    };

    ColorProject.prototype.setIgnoredScopes = function(ignoredScopes) {
      this.ignoredScopes = ignoredScopes != null ? ignoredScopes : [];
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.setIgnoreGlobalIgnoredScopes = function(ignoreGlobalIgnoredScopes) {
      this.ignoreGlobalIgnoredScopes = ignoreGlobalIgnoredScopes;
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.setSupportedFiletypes = function(supportedFiletypes) {
      this.supportedFiletypes = supportedFiletypes != null ? supportedFiletypes : [];
      this.updateIgnoredFiletypes();
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.updateIgnoredFiletypes = function() {
      return this.ignoredFiletypes = this.getIgnoredFiletypes();
    };

    ColorProject.prototype.getIgnoredFiletypes = function() {
      var filetypes, ref1, ref2, scopes;
      filetypes = (ref1 = this.supportedFiletypes) != null ? ref1 : [];
      if (!this.ignoreGlobalSupportedFiletypes) {
        filetypes = filetypes.concat((ref2 = atom.config.get('pigments.supportedFiletypes')) != null ? ref2 : []);
      }
      if (filetypes.length === 0) {
        filetypes = ['*'];
      }
      if (filetypes.some(function(type) {
        return type === '*';
      })) {
        return [];
      }
      scopes = filetypes.map(function(ext) {
        var ref3;
        return (ref3 = atom.grammars.selectGrammar("file." + ext)) != null ? ref3.scopeName.replace(/\./g, '\\.') : void 0;
      }).filter(function(scope) {
        return scope != null;
      });
      return ["^(?!\\.(" + (scopes.join('|')) + "))"];
    };

    ColorProject.prototype.setIgnoreGlobalSupportedFiletypes = function(ignoreGlobalSupportedFiletypes) {
      this.ignoreGlobalSupportedFiletypes = ignoreGlobalSupportedFiletypes;
      this.updateIgnoredFiletypes();
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.themesIncluded = function() {
      return this.includeThemes;
    };

    ColorProject.prototype.setIncludeThemes = function(includeThemes) {
      if (includeThemes === this.includeThemes) {
        return Promise.resolve();
      }
      this.includeThemes = includeThemes;
      if (this.includeThemes) {
        return this.includeThemesVariables();
      } else {
        return this.disposeThemesVariables();
      }
    };

    ColorProject.prototype.includeThemesVariables = function() {
      this.themesSubscription = atom.themes.onDidChangeActiveThemes((function(_this) {
        return function() {
          var variables;
          if (!_this.includeThemes) {
            return;
          }
          if (THEME_VARIABLES == null) {
            THEME_VARIABLES = require('./uris').THEME_VARIABLES;
          }
          variables = _this.loadThemesVariables();
          return _this.variables.updatePathCollection(THEME_VARIABLES, variables);
        };
      })(this));
      this.subscriptions.add(this.themesSubscription);
      return this.variables.addMany(this.loadThemesVariables());
    };

    ColorProject.prototype.disposeThemesVariables = function() {
      if (THEME_VARIABLES == null) {
        THEME_VARIABLES = require('./uris').THEME_VARIABLES;
      }
      this.subscriptions.remove(this.themesSubscription);
      this.variables.deleteVariablesForPaths([THEME_VARIABLES]);
      return this.themesSubscription.dispose();
    };

    ColorProject.prototype.getTimestamp = function() {
      return new Date();
    };

    ColorProject.prototype.serialize = function() {
      var data, ref1;
      if (SERIALIZE_VERSION == null) {
        ref1 = require('./versions'), SERIALIZE_VERSION = ref1.SERIALIZE_VERSION, SERIALIZE_MARKERS_VERSION = ref1.SERIALIZE_MARKERS_VERSION;
      }
      data = {
        deserializer: 'ColorProject',
        timestamp: this.getTimestamp(),
        version: SERIALIZE_VERSION,
        markersVersion: SERIALIZE_MARKERS_VERSION,
        globalSourceNames: atom.config.get('pigments.sourceNames'),
        globalIgnoredNames: atom.config.get('pigments.ignoredNames')
      };
      if (this.ignoreGlobalSourceNames != null) {
        data.ignoreGlobalSourceNames = this.ignoreGlobalSourceNames;
      }
      if (this.ignoreGlobalSearchNames != null) {
        data.ignoreGlobalSearchNames = this.ignoreGlobalSearchNames;
      }
      if (this.ignoreGlobalIgnoredNames != null) {
        data.ignoreGlobalIgnoredNames = this.ignoreGlobalIgnoredNames;
      }
      if (this.ignoreGlobalIgnoredScopes != null) {
        data.ignoreGlobalIgnoredScopes = this.ignoreGlobalIgnoredScopes;
      }
      if (this.includeThemes != null) {
        data.includeThemes = this.includeThemes;
      }
      if (this.ignoredScopes != null) {
        data.ignoredScopes = this.ignoredScopes;
      }
      if (this.ignoredNames != null) {
        data.ignoredNames = this.ignoredNames;
      }
      if (this.sourceNames != null) {
        data.sourceNames = this.sourceNames;
      }
      if (this.searchNames != null) {
        data.searchNames = this.searchNames;
      }
      data.buffers = this.serializeBuffers();
      if (this.isInitialized()) {
        data.paths = this.paths;
        data.variables = this.variables.serialize();
      }
      return data;
    };

    ColorProject.prototype.serializeBuffers = function() {
      var colorBuffer, id, out, ref1;
      out = {};
      ref1 = this.colorBuffersByEditorId;
      for (id in ref1) {
        colorBuffer = ref1[id];
        out[id] = colorBuffer.serialize();
      }
      return out;
    };

    return ColorProject;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLXByb2plY3QuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx3UkFBQTtJQUFBOztFQUFBLE1BUUksRUFSSixFQUNFLG9CQURGLEVBQ2Usb0JBRGYsRUFFRSxnQkFGRixFQUVXLDJCQUZYLEVBRStCLDRCQUYvQixFQUdFLG9CQUhGLEVBR2UscUJBSGYsRUFJRSxnQkFKRixFQUlXLDRCQUpYLEVBSWdDLGNBSmhDLEVBS0UsMkJBTEYsRUFLcUIsbUNBTHJCLEVBS2dELHlCQUxoRCxFQUtpRSx3QkFMakUsRUFNRSwyQkFORixFQU9FOztFQUdGLFlBQUEsR0FBZSxTQUFDLENBQUQsRUFBRyxDQUFIO0FBQ2IsUUFBQTtJQUFBLElBQW9CLFdBQUosSUFBYyxXQUE5QjtBQUFBLGFBQU8sTUFBUDs7SUFDQSxJQUFvQixDQUFDLENBQUMsTUFBRixLQUFZLENBQUMsQ0FBQyxNQUFsQztBQUFBLGFBQU8sTUFBUDs7QUFDQSxTQUFBLDJDQUFBOztVQUErQixDQUFBLEtBQU8sQ0FBRSxDQUFBLENBQUE7QUFBeEMsZUFBTzs7QUFBUDtBQUNBLFdBQU87RUFKTTs7RUFNZixNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ0osWUFBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLEtBQUQ7QUFDWixVQUFBO01BQUEsSUFBTyx5QkFBUDtRQUNFLE9BQWlELE9BQUEsQ0FBUSxZQUFSLENBQWpELEVBQUMsMENBQUQsRUFBb0IsMkRBRHRCOztNQUdBLGNBQUEsR0FBaUI7TUFDakIsSUFBNEIsSUFBSSxDQUFDLFNBQUwsQ0FBQSxDQUFBLElBQXFCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsU0FBQyxDQUFEO2VBQU8sQ0FBQyxDQUFDLEtB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b2xvclNlYXJjaCxcbiAgUGFsZXR0ZSwgQ29sb3JNYXJrZXJFbGVtZW50LCBWYXJpYWJsZXNDb2xsZWN0aW9uLFxuICBQYXRoc0xvYWRlciwgUGF0aHNTY2FubmVyLFxuICBFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlLCBSYW5nZSxcbiAgU0VSSUFMSVpFX1ZFUlNJT04sIFNFUklBTElaRV9NQVJLRVJTX1ZFUlNJT04sIFRIRU1FX1ZBUklBQkxFUywgQVRPTV9WQVJJQUJMRVMsXG4gIHNjb3BlRnJvbUZpbGVOYW1lLFxuICBtaW5pbWF0Y2hcbl0gPSBbXVxuXG5jb21wYXJlQXJyYXkgPSAoYSxiKSAtPlxuICByZXR1cm4gZmFsc2UgaWYgbm90IGE/IG9yIG5vdCBiP1xuICByZXR1cm4gZmFsc2UgdW5sZXNzIGEubGVuZ3RoIGlzIGIubGVuZ3RoXG4gIHJldHVybiBmYWxzZSBmb3IgdixpIGluIGEgd2hlbiB2IGlzbnQgYltpXVxuICByZXR1cm4gdHJ1ZVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDb2xvclByb2plY3RcbiAgQGRlc2VyaWFsaXplOiAoc3RhdGUpIC0+XG4gICAgdW5sZXNzIFNFUklBTElaRV9WRVJTSU9OP1xuICAgICAge1NFUklBTElaRV9WRVJTSU9OLCBTRVJJQUxJWkVfTUFSS0VSU19WRVJTSU9OfSA9IHJlcXVpcmUgJy4vdmVyc2lvbnMnXG5cbiAgICBtYXJrZXJzVmVyc2lvbiA9IFNFUklBTElaRV9NQVJLRVJTX1ZFUlNJT05cbiAgICBtYXJrZXJzVmVyc2lvbiArPSAnLWRldicgaWYgYXRvbS5pbkRldk1vZGUoKSBhbmQgYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkuc29tZSAocCkgLT4gcC5tYXRjaCgvXFwvcGlnbWVudHMkLylcblxuICAgIGlmIHN0YXRlPy52ZXJzaW9uIGlzbnQgU0VSSUFMSVpFX1ZFUlNJT05cbiAgICAgIHN0YXRlID0ge31cblxuICAgIGlmIHN0YXRlPy5tYXJrZXJzVmVyc2lvbiBpc250IG1hcmtlcnNWZXJzaW9uXG4gICAgICBkZWxldGUgc3RhdGUudmFyaWFibGVzXG4gICAgICBkZWxldGUgc3RhdGUuYnVmZmVyc1xuXG4gICAgaWYgbm90IGNvbXBhcmVBcnJheShzdGF0ZS5nbG9iYWxTb3VyY2VOYW1lcywgYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5zb3VyY2VOYW1lcycpKSBvciBub3QgY29tcGFyZUFycmF5KHN0YXRlLmdsb2JhbElnbm9yZWROYW1lcywgYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5pZ25vcmVkTmFtZXMnKSlcbiAgICAgIGRlbGV0ZSBzdGF0ZS52YXJpYWJsZXNcbiAgICAgIGRlbGV0ZSBzdGF0ZS5idWZmZXJzXG4gICAgICBkZWxldGUgc3RhdGUucGF0aHNcblxuICAgIG5ldyBDb2xvclByb2plY3Qoc3RhdGUpXG5cbiAgY29uc3RydWN0b3I6IChzdGF0ZT17fSkgLT5cbiAgICB7RW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZSwgUmFuZ2V9ID0gcmVxdWlyZSAnYXRvbScgdW5sZXNzIEVtaXR0ZXI/XG4gICAgVmFyaWFibGVzQ29sbGVjdGlvbiA/PSByZXF1aXJlICcuL3ZhcmlhYmxlcy1jb2xsZWN0aW9uJ1xuXG4gICAge1xuICAgICAgQGluY2x1ZGVUaGVtZXMsIEBpZ25vcmVkTmFtZXMsIEBzb3VyY2VOYW1lcywgQGlnbm9yZWRTY29wZXMsIEBwYXRocywgQHNlYXJjaE5hbWVzLCBAaWdub3JlR2xvYmFsU291cmNlTmFtZXMsIEBpZ25vcmVHbG9iYWxJZ25vcmVkTmFtZXMsIEBpZ25vcmVHbG9iYWxJZ25vcmVkU2NvcGVzLCBAaWdub3JlR2xvYmFsU2VhcmNoTmFtZXMsIEBpZ25vcmVHbG9iYWxTdXBwb3J0ZWRGaWxldHlwZXMsIEBzdXBwb3J0ZWRGaWxldHlwZXMsIHZhcmlhYmxlcywgdGltZXN0YW1wLCBidWZmZXJzXG4gICAgfSA9IHN0YXRlXG5cbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkID0ge31cbiAgICBAYnVmZmVyU3RhdGVzID0gYnVmZmVycyA/IHt9XG5cbiAgICBAdmFyaWFibGVFeHByZXNzaW9uc1JlZ2lzdHJ5ID0gcmVxdWlyZSAnLi92YXJpYWJsZS1leHByZXNzaW9ucydcbiAgICBAY29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5ID0gcmVxdWlyZSAnLi9jb2xvci1leHByZXNzaW9ucydcblxuICAgIGlmIHZhcmlhYmxlcz9cbiAgICAgIEB2YXJpYWJsZXMgPSBhdG9tLmRlc2VyaWFsaXplcnMuZGVzZXJpYWxpemUodmFyaWFibGVzKVxuICAgIGVsc2VcbiAgICAgIEB2YXJpYWJsZXMgPSBuZXcgVmFyaWFibGVzQ29sbGVjdGlvblxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEB2YXJpYWJsZXMub25EaWRDaGFuZ2UgKHJlc3VsdHMpID0+XG4gICAgICBAZW1pdFZhcmlhYmxlc0NoYW5nZUV2ZW50KHJlc3VsdHMpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAncGlnbWVudHMuc291cmNlTmFtZXMnLCA9PlxuICAgICAgQHVwZGF0ZVBhdGhzKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdwaWdtZW50cy5pZ25vcmVkTmFtZXMnLCA9PlxuICAgICAgQHVwZGF0ZVBhdGhzKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdwaWdtZW50cy5pZ25vcmVkQnVmZmVyTmFtZXMnLCAoQGlnbm9yZWRCdWZmZXJOYW1lcykgPT5cbiAgICAgIEB1cGRhdGVDb2xvckJ1ZmZlcnMoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3BpZ21lbnRzLmlnbm9yZWRTY29wZXMnLCA9PlxuICAgICAgQGVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1pZ25vcmVkLXNjb3BlcycsIEBnZXRJZ25vcmVkU2NvcGVzKCkpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAncGlnbWVudHMuc3VwcG9ydGVkRmlsZXR5cGVzJywgPT5cbiAgICAgIEB1cGRhdGVJZ25vcmVkRmlsZXR5cGVzKClcbiAgICAgIEBlbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtaWdub3JlZC1zY29wZXMnLCBAZ2V0SWdub3JlZFNjb3BlcygpKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3BpZ21lbnRzLm1hcmtlclR5cGUnLCAodHlwZSkgLT5cbiAgICAgIGlmIHR5cGU/XG4gICAgICAgIENvbG9yTWFya2VyRWxlbWVudCA/PSByZXF1aXJlICcuL2NvbG9yLW1hcmtlci1lbGVtZW50J1xuICAgICAgICBDb2xvck1hcmtlckVsZW1lbnQuc2V0TWFya2VyVHlwZSh0eXBlKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3BpZ21lbnRzLmlnbm9yZVZjc0lnbm9yZWRQYXRocycsID0+XG4gICAgICBAbG9hZFBhdGhzQW5kVmFyaWFibGVzKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdwaWdtZW50cy5zYXNzU2hhZGVBbmRUaW50SW1wbGVtZW50YXRpb24nLCA9PlxuICAgICAgQGNvbG9yRXhwcmVzc2lvbnNSZWdpc3RyeS5lbWl0dGVyLmVtaXQgJ2RpZC11cGRhdGUtZXhwcmVzc2lvbnMnLCB7XG4gICAgICAgIHJlZ2lzdHJ5OiBAY29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5XG4gICAgICB9XG5cbiAgICBzdmdDb2xvckV4cHJlc3Npb24gPSBAY29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5LmdldEV4cHJlc3Npb24oJ3BpZ21lbnRzOm5hbWVkX2NvbG9ycycpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3BpZ21lbnRzLmZpbGV0eXBlc0ZvckNvbG9yV29yZHMnLCAoc2NvcGVzKSA9PlxuICAgICAgc3ZnQ29sb3JFeHByZXNzaW9uLnNjb3BlcyA9IHNjb3BlcyA/IFtdXG4gICAgICBAY29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5LmVtaXR0ZXIuZW1pdCAnZGlkLXVwZGF0ZS1leHByZXNzaW9ucycsIHtcbiAgICAgICAgbmFtZTogc3ZnQ29sb3JFeHByZXNzaW9uLm5hbWVcbiAgICAgICAgcmVnaXN0cnk6IEBjb2xvckV4cHJlc3Npb25zUmVnaXN0cnlcbiAgICAgIH1cblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAY29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5Lm9uRGlkVXBkYXRlRXhwcmVzc2lvbnMgKHtuYW1lfSkgPT5cbiAgICAgIHJldHVybiBpZiBub3QgQHBhdGhzPyBvciBuYW1lIGlzICdwaWdtZW50czp2YXJpYWJsZXMnXG4gICAgICBAdmFyaWFibGVzLmV2YWx1YXRlVmFyaWFibGVzIEB2YXJpYWJsZXMuZ2V0VmFyaWFibGVzKCksID0+XG4gICAgICAgIGNvbG9yQnVmZmVyLnVwZGF0ZSgpIGZvciBpZCwgY29sb3JCdWZmZXIgb2YgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWRcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAdmFyaWFibGVFeHByZXNzaW9uc1JlZ2lzdHJ5Lm9uRGlkVXBkYXRlRXhwcmVzc2lvbnMgPT5cbiAgICAgIHJldHVybiB1bmxlc3MgQHBhdGhzP1xuICAgICAgQHJlbG9hZFZhcmlhYmxlc0ZvclBhdGhzKEBnZXRQYXRocygpKVxuXG4gICAgQHRpbWVzdGFtcCA9IG5ldyBEYXRlKERhdGUucGFyc2UodGltZXN0YW1wKSkgaWYgdGltZXN0YW1wP1xuXG4gICAgQHVwZGF0ZUlnbm9yZWRGaWxldHlwZXMoKVxuXG4gICAgQGluaXRpYWxpemUoKSBpZiBAcGF0aHM/XG4gICAgQGluaXRpYWxpemVCdWZmZXJzKClcblxuICBvbkRpZEluaXRpYWxpemU6IChjYWxsYmFjaykgLT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLWluaXRpYWxpemUnLCBjYWxsYmFja1xuXG4gIG9uRGlkRGVzdHJveTogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtZGVzdHJveScsIGNhbGxiYWNrXG5cbiAgb25EaWRVcGRhdGVWYXJpYWJsZXM6IChjYWxsYmFjaykgLT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLXVwZGF0ZS12YXJpYWJsZXMnLCBjYWxsYmFja1xuXG4gIG9uRGlkQ3JlYXRlQ29sb3JCdWZmZXI6IChjYWxsYmFjaykgLT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLWNyZWF0ZS1jb2xvci1idWZmZXInLCBjYWxsYmFja1xuXG4gIG9uRGlkQ2hhbmdlSWdub3JlZFNjb3BlczogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtY2hhbmdlLWlnbm9yZWQtc2NvcGVzJywgY2FsbGJhY2tcblxuICBvbkRpZENoYW5nZVBhdGhzOiAoY2FsbGJhY2spIC0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1jaGFuZ2UtcGF0aHMnLCBjYWxsYmFja1xuXG4gIG9ic2VydmVDb2xvckJ1ZmZlcnM6IChjYWxsYmFjaykgLT5cbiAgICBjYWxsYmFjayhjb2xvckJ1ZmZlcikgZm9yIGlkLGNvbG9yQnVmZmVyIG9mIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkXG4gICAgQG9uRGlkQ3JlYXRlQ29sb3JCdWZmZXIoY2FsbGJhY2spXG5cbiAgaXNJbml0aWFsaXplZDogLT4gQGluaXRpYWxpemVkXG5cbiAgaXNEZXN0cm95ZWQ6IC0+IEBkZXN0cm95ZWRcblxuICBpbml0aWFsaXplOiAtPlxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoQHZhcmlhYmxlcy5nZXRWYXJpYWJsZXMoKSkgaWYgQGlzSW5pdGlhbGl6ZWQoKVxuICAgIHJldHVybiBAaW5pdGlhbGl6ZVByb21pc2UgaWYgQGluaXRpYWxpemVQcm9taXNlP1xuICAgIEBpbml0aWFsaXplUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PlxuICAgICAgQHZhcmlhYmxlcy5vbmNlSW5pdGlhbGl6ZWQocmVzb2x2ZSlcbiAgICApXG4gICAgLnRoZW4gPT5cbiAgICAgIEBsb2FkUGF0aHNBbmRWYXJpYWJsZXMoKVxuICAgIC50aGVuID0+XG4gICAgICBAaW5jbHVkZVRoZW1lc1ZhcmlhYmxlcygpIGlmIEBpbmNsdWRlVGhlbWVzXG4gICAgLnRoZW4gPT5cbiAgICAgIEBpbml0aWFsaXplZCA9IHRydWVcblxuICAgICAgdmFyaWFibGVzID0gQHZhcmlhYmxlcy5nZXRWYXJpYWJsZXMoKVxuICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWluaXRpYWxpemUnLCB2YXJpYWJsZXNcbiAgICAgIHZhcmlhYmxlc1xuXG4gIGRlc3Ryb3k6IC0+XG4gICAgcmV0dXJuIGlmIEBkZXN0cm95ZWRcblxuICAgIFBhdGhzU2Nhbm5lciA/PSByZXF1aXJlICcuL3BhdGhzLXNjYW5uZXInXG5cbiAgICBAZGVzdHJveWVkID0gdHJ1ZVxuXG4gICAgUGF0aHNTY2FubmVyLnRlcm1pbmF0ZVJ1bm5pbmdUYXNrKClcblxuICAgIGJ1ZmZlci5kZXN0cm95KCkgZm9yIGlkLGJ1ZmZlciBvZiBAY29sb3JCdWZmZXJzQnlFZGl0b3JJZFxuICAgIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkID0gbnVsbFxuXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBudWxsXG5cbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtZGVzdHJveScsIHRoaXNcbiAgICBAZW1pdHRlci5kaXNwb3NlKClcblxuICByZWxvYWQ6IC0+XG4gICAgQGluaXRpYWxpemUoKS50aGVuID0+XG4gICAgICBAdmFyaWFibGVzLnJlc2V0KClcbiAgICAgIEBwYXRocyA9IFtdXG4gICAgICBAbG9hZFBhdGhzQW5kVmFyaWFibGVzKClcbiAgICAudGhlbiA9PlxuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5ub3RpZnlSZWxvYWRzJylcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoXCJQaWdtZW50cyBzdWNjZXNzZnVsbHkgcmVsb2FkZWRcIiwgZGlzbWlzc2FibGU6IGF0b20uY29uZmlnLmdldCgncGlnbWVudHMuZGlzbWlzc2FibGVSZWxvYWROb3RpZmljYXRpb25zJyksIGRlc2NyaXB0aW9uOiBcIlwiXCJGb3VuZDpcbiAgICAgICAgLSAqKiN7QHBhdGhzLmxlbmd0aH0qKiBwYXRoKHMpXG4gICAgICAgIC0gKioje0BnZXRWYXJpYWJsZXMoKS5sZW5ndGh9KiogdmFyaWFibGVzKHMpIGluY2x1ZGluZyAqKiN7QGdldENvbG9yVmFyaWFibGVzKCkubGVuZ3RofSoqIGNvbG9yKHMpXG4gICAgICAgIFwiXCJcIilcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2coXCJcIlwiRm91bmQ6XG4gICAgICAgIC0gI3tAcGF0aHMubGVuZ3RofSBwYXRoKHMpXG4gICAgICAgIC0gI3tAZ2V0VmFyaWFibGVzKCkubGVuZ3RofSB2YXJpYWJsZXMocykgaW5jbHVkaW5nICN7QGdldENvbG9yVmFyaWFibGVzKCkubGVuZ3RofSBjb2xvcihzKVxuICAgICAgICBcIlwiXCIpXG4gICAgLmNhdGNoIChyZWFzb24pIC0+XG4gICAgICBkZXRhaWwgPSByZWFzb24ubWVzc2FnZVxuICAgICAgc3RhY2sgPSByZWFzb24uc3RhY2tcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcIlBpZ21lbnRzIGNvdWxkbid0IGJlIHJlbG9hZGVkXCIsIHtkZXRhaWwsIHN0YWNrLCBkaXNtaXNzYWJsZTogdHJ1ZX0pXG4gICAgICBjb25zb2xlLmVycm9yIHJlYXNvblxuXG4gIGxvYWRQYXRoc0FuZFZhcmlhYmxlczogLT5cbiAgICBkZXN0cm95ZWQgPSBudWxsXG5cbiAgICBAbG9hZFBhdGhzKCkudGhlbiAoe2RpcnRpZWQsIHJlbW92ZWR9KSA9PlxuICAgICAgIyBXZSBjYW4gZmluZCByZW1vdmVkIGZpbGVzIG9ubHkgd2hlbiB0aGVyZSdzIGFscmVhZHkgcGF0aHMgZnJvbVxuICAgICAgIyBhIHNlcmlhbGl6ZWQgc3RhdGVcbiAgICAgIGlmIHJlbW92ZWQubGVuZ3RoID4gMFxuICAgICAgICBAcGF0aHMgPSBAcGF0aHMuZmlsdGVyIChwKSAtPiBwIG5vdCBpbiByZW1vdmVkXG4gICAgICAgIEBkZWxldGVWYXJpYWJsZXNGb3JQYXRocyhyZW1vdmVkKVxuXG4gICAgICAjIFRoZXJlIHdhcyBzZXJpYWxpemVkIHBhdGhzLCBhbmQgdGhlIGluaXRpYWxpemF0aW9uIGRpc2NvdmVyZWRcbiAgICAgICMgc29tZSBuZXcgb3IgZGlydHkgb25lcy5cbiAgICAgIGlmIEBwYXRocz8gYW5kIGRpcnRpZWQubGVuZ3RoID4gMFxuICAgICAgICBAcGF0aHMucHVzaCBwYXRoIGZvciBwYXRoIGluIGRpcnRpZWQgd2hlbiBwYXRoIG5vdCBpbiBAcGF0aHNcblxuICAgICAgICAjIFRoZXJlIHdhcyBhbHNvIHNlcmlhbGl6ZWQgdmFyaWFibGVzLCBzbyB3ZSdsbCByZXNjYW4gb25seSB0aGVcbiAgICAgICAgIyBkaXJ0eSBwYXRoc1xuICAgICAgICBpZiBAdmFyaWFibGVzLmxlbmd0aFxuICAgICAgICAgIGRpcnRpZWRcbiAgICAgICAgIyBUaGVyZSB3YXMgbm8gdmFyaWFibGVzLCBzbyBpdCdzIHByb2JhYmx5IGJlY2F1c2UgdGhlIG1hcmtlcnNcbiAgICAgICAgIyB2ZXJzaW9uIGNoYW5nZWQsIHdlJ2xsIHJlc2NhbiBhbGwgdGhlIGZpbGVzXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAcGF0aHNcbiAgICAgICMgVGhlcmUgd2FzIG5vIHNlcmlhbGl6ZWQgcGF0aHMsIHNvIHRoZXJlJ3Mgbm8gdmFyaWFibGVzIG5laXRoZXJcbiAgICAgIGVsc2UgdW5sZXNzIEBwYXRocz9cbiAgICAgICAgQHBhdGhzID0gZGlydGllZFxuICAgICAgIyBPbmx5IHRoZSBtYXJrZXJzIHZlcnNpb24gY2hhbmdlZCwgYWxsIHRoZSBwYXRocyBmcm9tIHRoZSBzZXJpYWxpemVkXG4gICAgICAjIHN0YXRlIHdpbGwgYmUgcmVzY2FubmVkXG4gICAgICBlbHNlIHVubGVzcyBAdmFyaWFibGVzLmxlbmd0aFxuICAgICAgICBAcGF0aHNcbiAgICAgICMgTm90aGluZyBjaGFuZ2VkLCB0aGVyZSdzIG5vIGRpcnR5IHBhdGhzIHRvIHJlc2NhblxuICAgICAgZWxzZVxuICAgICAgICBbXVxuICAgIC50aGVuIChwYXRocykgPT5cbiAgICAgIEBsb2FkVmFyaWFibGVzRm9yUGF0aHMocGF0aHMpXG4gICAgLnRoZW4gKHJlc3VsdHMpID0+XG4gICAgICBAdmFyaWFibGVzLnVwZGF0ZUNvbGxlY3Rpb24ocmVzdWx0cykgaWYgcmVzdWx0cz9cblxuICBmaW5kQWxsQ29sb3JzOiAtPlxuICAgIENvbG9yU2VhcmNoID89IHJlcXVpcmUgJy4vY29sb3Itc2VhcmNoJ1xuXG4gICAgcGF0dGVybnMgPSBAZ2V0U2VhcmNoTmFtZXMoKVxuICAgIG5ldyBDb2xvclNlYXJjaFxuICAgICAgc291cmNlTmFtZXM6IHBhdHRlcm5zXG4gICAgICBwcm9qZWN0OiB0aGlzXG4gICAgICBpZ25vcmVkTmFtZXM6IEBnZXRJZ25vcmVkTmFtZXMoKVxuICAgICAgY29udGV4dDogQGdldENvbnRleHQoKVxuXG4gIHNldENvbG9yUGlja2VyQVBJOiAoQGNvbG9yUGlja2VyQVBJKSAtPlxuXG4gICMjICAgICMjIyMjIyMjICAjIyAgICAgIyMgIyMjIyMjIyMgIyMjIyMjIyMgIyMjIyMjIyMgIyMjIyMjIyMgICAjIyMjIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgICAjIyAgICAgICAjIyAgICAgIyMgIyNcbiAgIyMgICAgIyMjIyMjIyMgICMjICAgICAjIyAjIyMjIyMgICAjIyMjIyMgICAjIyMjIyMgICAjIyMjIyMjIyAgICMjIyMjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAgICMjICAgIyMgICAgICAgICAjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAgICMjICAgICMjICAjIyAgICAjI1xuICAjIyAgICAjIyMjIyMjIyAgICMjIyMjIyMgICMjICAgICAgICMjICAgICAgICMjIyMjIyMjICMjICAgICAjIyAgIyMjIyMjXG5cbiAgaW5pdGlhbGl6ZUJ1ZmZlcnM6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSA9PlxuICAgICAgZWRpdG9yUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgIHJldHVybiBpZiBub3QgZWRpdG9yUGF0aD8gb3IgQGlzQnVmZmVySWdub3JlZChlZGl0b3JQYXRoKVxuXG4gICAgICBidWZmZXIgPSBAY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuICAgICAgaWYgYnVmZmVyP1xuICAgICAgICBidWZmZXJFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGJ1ZmZlcilcbiAgICAgICAgYnVmZmVyRWxlbWVudC5hdHRhY2goKVxuXG4gIGhhc0NvbG9yQnVmZmVyRm9yRWRpdG9yOiAoZWRpdG9yKSAtPlxuICAgIHJldHVybiBmYWxzZSBpZiBAZGVzdHJveWVkIG9yIG5vdCBlZGl0b3I/XG4gICAgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXT9cblxuICBjb2xvckJ1ZmZlckZvckVkaXRvcjogKGVkaXRvcikgLT5cbiAgICByZXR1cm4gaWYgQGRlc3Ryb3llZFxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yP1xuXG4gICAgQ29sb3JCdWZmZXIgPz0gcmVxdWlyZSAnLi9jb2xvci1idWZmZXInXG5cbiAgICBpZiBAY29sb3JCdWZmZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdP1xuICAgICAgcmV0dXJuIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkW2VkaXRvci5pZF1cblxuICAgIGlmIEBidWZmZXJTdGF0ZXNbZWRpdG9yLmlkXT9cbiAgICAgIHN0YXRlID0gQGJ1ZmZlclN0YXRlc1tlZGl0b3IuaWRdXG4gICAgICBzdGF0ZS5lZGl0b3IgPSBlZGl0b3JcbiAgICAgIHN0YXRlLnByb2plY3QgPSB0aGlzXG4gICAgICBkZWxldGUgQGJ1ZmZlclN0YXRlc1tlZGl0b3IuaWRdXG4gICAgZWxzZVxuICAgICAgc3RhdGUgPSB7ZWRpdG9yLCBwcm9qZWN0OiB0aGlzfVxuXG4gICAgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSA9IGJ1ZmZlciA9IG5ldyBDb2xvckJ1ZmZlcihzdGF0ZSlcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBzdWJzY3JpcHRpb24gPSBidWZmZXIub25EaWREZXN0cm95ID0+XG4gICAgICBAc3Vic2NyaXB0aW9ucy5yZW1vdmUoc3Vic2NyaXB0aW9uKVxuICAgICAgc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgZGVsZXRlIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkW2VkaXRvci5pZF1cblxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1jcmVhdGUtY29sb3ItYnVmZmVyJywgYnVmZmVyXG5cbiAgICBidWZmZXJcblxuICBjb2xvckJ1ZmZlckZvclBhdGg6IChwYXRoKSAtPlxuICAgIGZvciBpZCxjb2xvckJ1ZmZlciBvZiBAY29sb3JCdWZmZXJzQnlFZGl0b3JJZFxuICAgICAgcmV0dXJuIGNvbG9yQnVmZmVyIGlmIGNvbG9yQnVmZmVyLmVkaXRvci5nZXRQYXRoKCkgaXMgcGF0aFxuXG4gIHVwZGF0ZUNvbG9yQnVmZmVyczogLT5cbiAgICBmb3IgaWQsIGJ1ZmZlciBvZiBAY29sb3JCdWZmZXJzQnlFZGl0b3JJZFxuICAgICAgaWYgQGlzQnVmZmVySWdub3JlZChidWZmZXIuZWRpdG9yLmdldFBhdGgoKSlcbiAgICAgICAgYnVmZmVyLmRlc3Ryb3koKVxuICAgICAgICBkZWxldGUgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWRbaWRdXG5cbiAgICB0cnlcbiAgICAgIGlmIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkP1xuICAgICAgICBmb3IgZWRpdG9yIGluIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcbiAgICAgICAgICBjb250aW51ZSBpZiBAaGFzQ29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKSBvciBAaXNCdWZmZXJJZ25vcmVkKGVkaXRvci5nZXRQYXRoKCkpXG5cbiAgICAgICAgICBidWZmZXIgPSBAY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuICAgICAgICAgIGlmIGJ1ZmZlcj9cbiAgICAgICAgICAgIGJ1ZmZlckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYnVmZmVyKVxuICAgICAgICAgICAgYnVmZmVyRWxlbWVudC5hdHRhY2goKVxuXG4gICAgY2F0Y2ggZVxuICAgICAgY29uc29sZS5sb2cgZVxuXG4gIGlzQnVmZmVySWdub3JlZDogKHBhdGgpIC0+XG4gICAgbWluaW1hdGNoID89IHJlcXVpcmUgJ21pbmltYXRjaCdcblxuICAgIHBhdGggPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZShwYXRoKVxuICAgIHNvdXJjZXMgPSBAaWdub3JlZEJ1ZmZlck5hbWVzID8gW11cbiAgICByZXR1cm4gdHJ1ZSBmb3Igc291cmNlIGluIHNvdXJjZXMgd2hlbiBtaW5pbWF0Y2gocGF0aCwgc291cmNlLCBtYXRjaEJhc2U6IHRydWUsIGRvdDogdHJ1ZSlcbiAgICBmYWxzZVxuXG4gICMjICAgICMjIyMjIyMjICAgICAjIyMgICAgIyMjIyMjIyMgIyMgICAgICMjICAjIyMjIyNcbiAgIyMgICAgIyMgICAgICMjICAgIyMgIyMgICAgICAjIyAgICAjIyAgICAgIyMgIyMgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICAjIyAgICMjICAgICAjIyAgICAjIyAgICAgIyMgIyNcbiAgIyMgICAgIyMjIyMjIyMgICMjICAgICAjIyAgICAjIyAgICAjIyMjIyMjIyMgICMjIyMjI1xuICAjIyAgICAjIyAgICAgICAgIyMjIyMjIyMjICAgICMjICAgICMjICAgICAjIyAgICAgICAjI1xuICAjIyAgICAjIyAgICAgICAgIyMgICAgICMjICAgICMjICAgICMjICAgICAjIyAjIyAgICAjI1xuICAjIyAgICAjIyAgICAgICAgIyMgICAgICMjICAgICMjICAgICMjICAgICAjIyAgIyMjIyMjXG5cbiAgZ2V0UGF0aHM6IC0+IEBwYXRocz8uc2xpY2UoKVxuXG4gIGFwcGVuZFBhdGg6IChwYXRoKSAtPiBAcGF0aHMucHVzaChwYXRoKSBpZiBwYXRoP1xuXG4gIGhhc1BhdGg6IChwYXRoKSAtPiBwYXRoIGluIChAcGF0aHMgPyBbXSlcblxuICBsb2FkUGF0aHM6IChub0tub3duUGF0aHM9ZmFsc2UpIC0+XG4gICAgUGF0aHNMb2FkZXIgPz0gcmVxdWlyZSAnLi9wYXRocy1sb2FkZXInXG5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgcm9vdFBhdGhzID0gQGdldFJvb3RQYXRocygpXG4gICAgICBrbm93blBhdGhzID0gaWYgbm9Lbm93blBhdGhzIHRoZW4gW10gZWxzZSBAcGF0aHMgPyBbXVxuICAgICAgY29uZmlnID0ge1xuICAgICAgICBrbm93blBhdGhzXG4gICAgICAgIEB0aW1lc3RhbXBcbiAgICAgICAgaWdub3JlZE5hbWVzOiBAZ2V0SWdub3JlZE5hbWVzKClcbiAgICAgICAgcGF0aHM6IHJvb3RQYXRoc1xuICAgICAgICB0cmF2ZXJzZUludG9TeW1saW5rRGlyZWN0b3JpZXM6IGF0b20uY29uZmlnLmdldCAncGlnbWVudHMudHJhdmVyc2VJbnRvU3ltbGlua0RpcmVjdG9yaWVzJ1xuICAgICAgICBzb3VyY2VOYW1lczogQGdldFNvdXJjZU5hbWVzKClcbiAgICAgICAgaWdub3JlVmNzSWdub3JlczogYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5pZ25vcmVWY3NJZ25vcmVkUGF0aHMnKVxuICAgICAgfVxuICAgICAgUGF0aHNMb2FkZXIuc3RhcnRUYXNrIGNvbmZpZywgKHJlc3VsdHMpID0+XG4gICAgICAgIGZvciBwIGluIGtub3duUGF0aHNcbiAgICAgICAgICBpc0Rlc2NlbmRlbnRPZlJvb3RQYXRocyA9IHJvb3RQYXRocy5zb21lIChyb290KSAtPlxuICAgICAgICAgICAgcC5pbmRleE9mKHJvb3QpIGlzIDBcblxuICAgICAgICAgIHVubGVzcyBpc0Rlc2NlbmRlbnRPZlJvb3RQYXRoc1xuICAgICAgICAgICAgcmVzdWx0cy5yZW1vdmVkID89IFtdXG4gICAgICAgICAgICByZXN1bHRzLnJlbW92ZWQucHVzaChwKVxuXG4gICAgICAgIHJlc29sdmUocmVzdWx0cylcblxuICB1cGRhdGVQYXRoczogLT5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkgdW5sZXNzIEBpbml0aWFsaXplZFxuXG4gICAgQGxvYWRQYXRocygpLnRoZW4gKHtkaXJ0aWVkLCByZW1vdmVkfSkgPT5cbiAgICAgIEBkZWxldGVWYXJpYWJsZXNGb3JQYXRocyhyZW1vdmVkKVxuXG4gICAgICBAcGF0aHMgPSBAcGF0aHMuZmlsdGVyIChwKSAtPiBwIG5vdCBpbiByZW1vdmVkXG4gICAgICBAcGF0aHMucHVzaChwKSBmb3IgcCBpbiBkaXJ0aWVkIHdoZW4gcCBub3QgaW4gQHBhdGhzXG5cbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1jaGFuZ2UtcGF0aHMnLCBAZ2V0UGF0aHMoKVxuICAgICAgQHJlbG9hZFZhcmlhYmxlc0ZvclBhdGhzKGRpcnRpZWQpXG5cbiAgaXNWYXJpYWJsZXNTb3VyY2VQYXRoOiAocGF0aCkgLT5cbiAgICByZXR1cm4gZmFsc2UgdW5sZXNzIHBhdGhcblxuICAgIG1pbmltYXRjaCA/PSByZXF1aXJlICdtaW5pbWF0Y2gnXG4gICAgcGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplKHBhdGgpXG4gICAgc291cmNlcyA9IEBnZXRTb3VyY2VOYW1lcygpXG5cbiAgICByZXR1cm4gdHJ1ZSBmb3Igc291cmNlIGluIHNvdXJjZXMgd2hlbiBtaW5pbWF0Y2gocGF0aCwgc291cmNlLCBtYXRjaEJhc2U6IHRydWUsIGRvdDogdHJ1ZSlcblxuICBpc0lnbm9yZWRQYXRoOiAocGF0aCkgLT5cbiAgICByZXR1cm4gZmFsc2UgdW5sZXNzIHBhdGhcblxuICAgIG1pbmltYXRjaCA/PSByZXF1aXJlICdtaW5pbWF0Y2gnXG4gICAgcGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplKHBhdGgpXG4gICAgaWdub3JlZE5hbWVzID0gQGdldElnbm9yZWROYW1lcygpXG5cbiAgICByZXR1cm4gdHJ1ZSBmb3IgaWdub3JlIGluIGlnbm9yZWROYW1lcyB3aGVuIG1pbmltYXRjaChwYXRoLCBpZ25vcmUsIG1hdGNoQmFzZTogdHJ1ZSwgZG90OiB0cnVlKVxuXG4gIHNjb3BlRnJvbUZpbGVOYW1lOiAocGF0aCkgLT5cbiAgICBzY29wZUZyb21GaWxlTmFtZSA/PSByZXF1aXJlICcuL3Njb3BlLWZyb20tZmlsZS1uYW1lJ1xuXG4gICAgc2NvcGUgPSBzY29wZUZyb21GaWxlTmFtZShwYXRoKVxuXG4gICAgaWYgc2NvcGUgaXMgJ3Nhc3MnIG9yIHNjb3BlIGlzICdzY3NzJ1xuICAgICAgc2NvcGUgPSBbc2NvcGUsIEBnZXRTYXNzU2NvcGVTdWZmaXgoKV0uam9pbignOicpXG5cbiAgICBzY29wZVxuXG4gICMjICAgICMjICAgICAjIyAgICAjIyMgICAgIyMjIyMjIyMgICAjIyMjIyNcbiAgIyMgICAgIyMgICAgICMjICAgIyMgIyMgICAjIyAgICAgIyMgIyMgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICAjIyAgICMjICAjIyAgICAgIyMgIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAjIyMjIyMjIyAgICMjIyMjI1xuICAjIyAgICAgIyMgICAjIyAgIyMjIyMjIyMjICMjICAgIyMgICAgICAgICAjI1xuICAjIyAgICAgICMjICMjICAgIyMgICAgICMjICMjICAgICMjICAjIyAgICAjI1xuICAjIyAgICAgICAjIyMgICAgIyMgICAgICMjICMjICAgICAjIyAgIyMjIyMjXG5cbiAgZ2V0UGFsZXR0ZTogLT5cbiAgICBQYWxldHRlID89IHJlcXVpcmUgJy4vcGFsZXR0ZSdcblxuICAgIHJldHVybiBuZXcgUGFsZXR0ZSB1bmxlc3MgQGlzSW5pdGlhbGl6ZWQoKVxuICAgIG5ldyBQYWxldHRlKEBnZXRDb2xvclZhcmlhYmxlcygpKVxuXG4gIGdldENvbnRleHQ6IC0+IEB2YXJpYWJsZXMuZ2V0Q29udGV4dCgpXG5cbiAgZ2V0VmFyaWFibGVzOiAtPiBAdmFyaWFibGVzLmdldFZhcmlhYmxlcygpXG5cbiAgZ2V0VmFyaWFibGVFeHByZXNzaW9uc1JlZ2lzdHJ5OiAtPiBAdmFyaWFibGVFeHByZXNzaW9uc1JlZ2lzdHJ5XG5cbiAgZ2V0VmFyaWFibGVCeUlkOiAoaWQpIC0+IEB2YXJpYWJsZXMuZ2V0VmFyaWFibGVCeUlkKGlkKVxuXG4gIGdldFZhcmlhYmxlQnlOYW1lOiAobmFtZSkgLT4gQHZhcmlhYmxlcy5nZXRWYXJpYWJsZUJ5TmFtZShuYW1lKVxuXG4gIGdldENvbG9yVmFyaWFibGVzOiAtPiBAdmFyaWFibGVzLmdldENvbG9yVmFyaWFibGVzKClcblxuICBnZXRDb2xvckV4cHJlc3Npb25zUmVnaXN0cnk6IC0+IEBjb2xvckV4cHJlc3Npb25zUmVnaXN0cnlcblxuICBzaG93VmFyaWFibGVJbkZpbGU6ICh2YXJpYWJsZSkgLT5cbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHZhcmlhYmxlLnBhdGgpLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgIHtFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlLCBSYW5nZX0gPSByZXF1aXJlICdhdG9tJyB1bmxlc3MgUmFuZ2U/XG5cbiAgICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuXG4gICAgICBidWZmZXJSYW5nZSA9IFJhbmdlLmZyb21PYmplY3QgW1xuICAgICAgICBidWZmZXIucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleCh2YXJpYWJsZS5yYW5nZVswXSlcbiAgICAgICAgYnVmZmVyLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgodmFyaWFibGUucmFuZ2VbMV0pXG4gICAgICBdXG5cbiAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKGJ1ZmZlclJhbmdlLCBhdXRvc2Nyb2xsOiB0cnVlKVxuXG4gIGVtaXRWYXJpYWJsZXNDaGFuZ2VFdmVudDogKHJlc3VsdHMpIC0+XG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXVwZGF0ZS12YXJpYWJsZXMnLCByZXN1bHRzXG5cbiAgbG9hZFZhcmlhYmxlc0ZvclBhdGg6IChwYXRoKSAtPiBAbG9hZFZhcmlhYmxlc0ZvclBhdGhzIFtwYXRoXVxuXG4gIGxvYWRWYXJpYWJsZXNGb3JQYXRoczogKHBhdGhzKSAtPlxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICBAc2NhblBhdGhzRm9yVmFyaWFibGVzIHBhdGhzLCAocmVzdWx0cykgPT4gcmVzb2x2ZShyZXN1bHRzKVxuXG4gIGdldFZhcmlhYmxlc0ZvclBhdGg6IChwYXRoKSAtPiBAdmFyaWFibGVzLmdldFZhcmlhYmxlc0ZvclBhdGgocGF0aClcblxuICBnZXRWYXJpYWJsZXNGb3JQYXRoczogKHBhdGhzKSAtPiBAdmFyaWFibGVzLmdldFZhcmlhYmxlc0ZvclBhdGhzKHBhdGhzKVxuXG4gIGRlbGV0ZVZhcmlhYmxlc0ZvclBhdGg6IChwYXRoKSAtPiBAZGVsZXRlVmFyaWFibGVzRm9yUGF0aHMgW3BhdGhdXG5cbiAgZGVsZXRlVmFyaWFibGVzRm9yUGF0aHM6IChwYXRocykgLT5cbiAgICBAdmFyaWFibGVzLmRlbGV0ZVZhcmlhYmxlc0ZvclBhdGhzKHBhdGhzKVxuXG4gIHJlbG9hZFZhcmlhYmxlc0ZvclBhdGg6IChwYXRoKSAtPiBAcmVsb2FkVmFyaWFibGVzRm9yUGF0aHMgW3BhdGhdXG5cbiAgcmVsb2FkVmFyaWFibGVzRm9yUGF0aHM6IChwYXRocykgLT5cbiAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKClcbiAgICBwcm9taXNlID0gQGluaXRpYWxpemUoKSB1bmxlc3MgQGlzSW5pdGlhbGl6ZWQoKVxuXG4gICAgcHJvbWlzZVxuICAgIC50aGVuID0+XG4gICAgICBpZiBwYXRocy5zb21lKChwYXRoKSA9PiBwYXRoIG5vdCBpbiBAcGF0aHMpXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pXG5cbiAgICAgIEBsb2FkVmFyaWFibGVzRm9yUGF0aHMocGF0aHMpXG4gICAgLnRoZW4gKHJlc3VsdHMpID0+XG4gICAgICBAdmFyaWFibGVzLnVwZGF0ZUNvbGxlY3Rpb24ocmVzdWx0cywgcGF0aHMpXG5cbiAgc2NhblBhdGhzRm9yVmFyaWFibGVzOiAocGF0aHMsIGNhbGxiYWNrKSAtPlxuICAgIGlmIHBhdGhzLmxlbmd0aCBpcyAxIGFuZCBjb2xvckJ1ZmZlciA9IEBjb2xvckJ1ZmZlckZvclBhdGgocGF0aHNbMF0pXG4gICAgICBjb2xvckJ1ZmZlci5zY2FuQnVmZmVyRm9yVmFyaWFibGVzKCkudGhlbiAocmVzdWx0cykgLT4gY2FsbGJhY2socmVzdWx0cylcbiAgICBlbHNlXG4gICAgICBQYXRoc1NjYW5uZXIgPz0gcmVxdWlyZSAnLi9wYXRocy1zY2FubmVyJ1xuXG4gICAgICBQYXRoc1NjYW5uZXIuc3RhcnRUYXNrIHBhdGhzLm1hcCgocCkgPT4gW3AsIEBzY29wZUZyb21GaWxlTmFtZShwKV0pLCBAdmFyaWFibGVFeHByZXNzaW9uc1JlZ2lzdHJ5LCAocmVzdWx0cykgLT4gY2FsbGJhY2socmVzdWx0cylcblxuICBsb2FkVGhlbWVzVmFyaWFibGVzOiAtPlxuICAgIHtUSEVNRV9WQVJJQUJMRVN9ID0gcmVxdWlyZSAnLi91cmlzJyB1bmxlc3MgVEhFTUVfVkFSSUFCTEVTP1xuICAgIEFUT01fVkFSSUFCTEVTID89IHJlcXVpcmUgJy4vYXRvbS12YXJpYWJsZXMnXG5cbiAgICBpdGVyYXRvciA9IDBcbiAgICB2YXJpYWJsZXMgPSBbXVxuICAgIGh0bWwgPSAnJ1xuICAgIEFUT01fVkFSSUFCTEVTLmZvckVhY2ggKHYpIC0+IGh0bWwgKz0gXCI8ZGl2IGNsYXNzPScje3Z9Jz4je3Z9PC9kaXY+XCJcblxuICAgIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgZGl2LmNsYXNzTmFtZSA9ICdwaWdtZW50cy1zYW1wbGVyJ1xuICAgIGRpdi5pbm5lckhUTUwgPSBodG1sXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpXG5cbiAgICBBVE9NX1ZBUklBQkxFUy5mb3JFYWNoICh2LGkpIC0+XG4gICAgICBub2RlID0gZGl2LmNoaWxkcmVuW2ldXG4gICAgICBjb2xvciA9IGdldENvbXB1dGVkU3R5bGUobm9kZSkuY29sb3JcbiAgICAgIGVuZCA9IGl0ZXJhdG9yICsgdi5sZW5ndGggKyBjb2xvci5sZW5ndGggKyA0XG5cbiAgICAgIHZhcmlhYmxlID1cbiAgICAgICAgbmFtZTogXCJAI3t2fVwiXG4gICAgICAgIGxpbmU6IGlcbiAgICAgICAgdmFsdWU6IGNvbG9yXG4gICAgICAgIHJhbmdlOiBbaXRlcmF0b3IsZW5kXVxuICAgICAgICBwYXRoOiBUSEVNRV9WQVJJQUJMRVNcblxuICAgICAgaXRlcmF0b3IgPSBlbmRcbiAgICAgIHZhcmlhYmxlcy5wdXNoKHZhcmlhYmxlKVxuXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkaXYpXG4gICAgcmV0dXJuIHZhcmlhYmxlc1xuXG4gICMjICAgICAjIyMjIyMgICMjIyMjIyMjICMjIyMjIyMjICMjIyMjIyMjICMjIyMgIyMgICAgIyMgICMjIyMjIyAgICAjIyMjIyNcbiAgIyMgICAgIyMgICAgIyMgIyMgICAgICAgICAgIyMgICAgICAgIyMgICAgICMjICAjIyMgICAjIyAjIyAgICAjIyAgIyMgICAgIyNcbiAgIyMgICAgIyMgICAgICAgIyMgICAgICAgICAgIyMgICAgICAgIyMgICAgICMjICAjIyMjICAjIyAjIyAgICAgICAgIyNcbiAgIyMgICAgICMjIyMjIyAgIyMjIyMjICAgICAgIyMgICAgICAgIyMgICAgICMjICAjIyAjIyAjIyAjIyAgICMjIyMgICMjIyMjI1xuICAjIyAgICAgICAgICAjIyAjIyAgICAgICAgICAjIyAgICAgICAjIyAgICAgIyMgICMjICAjIyMjICMjICAgICMjICAgICAgICAjI1xuICAjIyAgICAjIyAgICAjIyAjIyAgICAgICAgICAjIyAgICAgICAjIyAgICAgIyMgICMjICAgIyMjICMjICAgICMjICAjIyAgICAjI1xuICAjIyAgICAgIyMjIyMjICAjIyMjIyMjIyAgICAjIyAgICAgICAjIyAgICAjIyMjICMjICAgICMjICAjIyMjIyMgICAgIyMjIyMjXG5cbiAgZ2V0Um9vdFBhdGhzOiAtPiBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuXG4gIGdldFNhc3NTY29wZVN1ZmZpeDogLT5cbiAgICBAc2Fzc1NoYWRlQW5kVGludEltcGxlbWVudGF0aW9uID8gYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5zYXNzU2hhZGVBbmRUaW50SW1wbGVtZW50YXRpb24nKSA/ICdjb21wYXNzJ1xuXG4gIHNldFNhc3NTaGFkZUFuZFRpbnRJbXBsZW1lbnRhdGlvbjogKEBzYXNzU2hhZGVBbmRUaW50SW1wbGVtZW50YXRpb24pIC0+XG4gICAgQGNvbG9yRXhwcmVzc2lvbnNSZWdpc3RyeS5lbWl0dGVyLmVtaXQgJ2RpZC11cGRhdGUtZXhwcmVzc2lvbnMnLCB7XG4gICAgICByZWdpc3RyeTogQGNvbG9yRXhwcmVzc2lvbnNSZWdpc3RyeVxuICAgIH1cblxuICBnZXRTb3VyY2VOYW1lczogLT5cbiAgICBuYW1lcyA9IFsnLnBpZ21lbnRzJ11cbiAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdChAc291cmNlTmFtZXMgPyBbXSlcbiAgICB1bmxlc3MgQGlnbm9yZUdsb2JhbFNvdXJjZU5hbWVzXG4gICAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdChhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLnNvdXJjZU5hbWVzJykgPyBbXSlcbiAgICBuYW1lc1xuXG4gIHNldFNvdXJjZU5hbWVzOiAoQHNvdXJjZU5hbWVzPVtdKSAtPlxuICAgIHJldHVybiBpZiBub3QgQGluaXRpYWxpemVkPyBhbmQgbm90IEBpbml0aWFsaXplUHJvbWlzZT9cblxuICAgIEBpbml0aWFsaXplKCkudGhlbiA9PiBAbG9hZFBhdGhzQW5kVmFyaWFibGVzKHRydWUpXG5cbiAgc2V0SWdub3JlR2xvYmFsU291cmNlTmFtZXM6IChAaWdub3JlR2xvYmFsU291cmNlTmFtZXMpIC0+XG4gICAgQHVwZGF0ZVBhdGhzKClcblxuICBnZXRTZWFyY2hOYW1lczogLT5cbiAgICBuYW1lcyA9IFtdXG4gICAgbmFtZXMgPSBuYW1lcy5jb25jYXQoQHNvdXJjZU5hbWVzID8gW10pXG4gICAgbmFtZXMgPSBuYW1lcy5jb25jYXQoQHNlYXJjaE5hbWVzID8gW10pXG4gICAgdW5sZXNzIEBpZ25vcmVHbG9iYWxTZWFyY2hOYW1lc1xuICAgICAgbmFtZXMgPSBuYW1lcy5jb25jYXQoYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5zb3VyY2VOYW1lcycpID8gW10pXG4gICAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdChhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLmV4dGVuZGVkU2VhcmNoTmFtZXMnKSA/IFtdKVxuICAgIG5hbWVzXG5cbiAgc2V0U2VhcmNoTmFtZXM6IChAc2VhcmNoTmFtZXM9W10pIC0+XG5cbiAgc2V0SWdub3JlR2xvYmFsU2VhcmNoTmFtZXM6IChAaWdub3JlR2xvYmFsU2VhcmNoTmFtZXMpIC0+XG5cbiAgZ2V0SWdub3JlZE5hbWVzOiAtPlxuICAgIG5hbWVzID0gQGlnbm9yZWROYW1lcyA/IFtdXG4gICAgdW5sZXNzIEBpZ25vcmVHbG9iYWxJZ25vcmVkTmFtZXNcbiAgICAgIG5hbWVzID0gbmFtZXMuY29uY2F0KEBnZXRHbG9iYWxJZ25vcmVkTmFtZXMoKSA/IFtdKVxuICAgICAgbmFtZXMgPSBuYW1lcy5jb25jYXQoYXRvbS5jb25maWcuZ2V0KCdjb3JlLmlnbm9yZWROYW1lcycpID8gW10pXG4gICAgbmFtZXNcblxuICBnZXRHbG9iYWxJZ25vcmVkTmFtZXM6IC0+XG4gICAgYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5pZ25vcmVkTmFtZXMnKT8ubWFwIChwKSAtPlxuICAgICAgaWYgL1xcL1xcKiQvLnRlc3QocCkgdGhlbiBwICsgJyonIGVsc2UgcFxuXG4gIHNldElnbm9yZWROYW1lczogKEBpZ25vcmVkTmFtZXM9W10pIC0+XG4gICAgaWYgbm90IEBpbml0aWFsaXplZD8gYW5kIG5vdCBAaW5pdGlhbGl6ZVByb21pc2U/XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoJ1Byb2plY3QgaXMgbm90IGluaXRpYWxpemVkIHlldCcpXG5cbiAgICBAaW5pdGlhbGl6ZSgpLnRoZW4gPT5cbiAgICAgIGRpcnRpZWQgPSBAcGF0aHMuZmlsdGVyIChwKSA9PiBAaXNJZ25vcmVkUGF0aChwKVxuICAgICAgQGRlbGV0ZVZhcmlhYmxlc0ZvclBhdGhzKGRpcnRpZWQpXG5cbiAgICAgIEBwYXRocyA9IEBwYXRocy5maWx0ZXIgKHApID0+ICFAaXNJZ25vcmVkUGF0aChwKVxuICAgICAgQGxvYWRQYXRoc0FuZFZhcmlhYmxlcyh0cnVlKVxuXG4gIHNldElnbm9yZUdsb2JhbElnbm9yZWROYW1lczogKEBpZ25vcmVHbG9iYWxJZ25vcmVkTmFtZXMpIC0+XG4gICAgQHVwZGF0ZVBhdGhzKClcblxuICBnZXRJZ25vcmVkU2NvcGVzOiAtPlxuICAgIHNjb3BlcyA9IEBpZ25vcmVkU2NvcGVzID8gW11cbiAgICB1bmxlc3MgQGlnbm9yZUdsb2JhbElnbm9yZWRTY29wZXNcbiAgICAgIHNjb3BlcyA9IHNjb3Blcy5jb25jYXQoYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5pZ25vcmVkU2NvcGVzJykgPyBbXSlcblxuICAgIHNjb3BlcyA9IHNjb3Blcy5jb25jYXQoQGlnbm9yZWRGaWxldHlwZXMpXG4gICAgc2NvcGVzXG5cbiAgc2V0SWdub3JlZFNjb3BlczogKEBpZ25vcmVkU2NvcGVzPVtdKSAtPlxuICAgIEBlbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtaWdub3JlZC1zY29wZXMnLCBAZ2V0SWdub3JlZFNjb3BlcygpKVxuXG4gIHNldElnbm9yZUdsb2JhbElnbm9yZWRTY29wZXM6IChAaWdub3JlR2xvYmFsSWdub3JlZFNjb3BlcykgLT5cbiAgICBAZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWlnbm9yZWQtc2NvcGVzJywgQGdldElnbm9yZWRTY29wZXMoKSlcblxuICBzZXRTdXBwb3J0ZWRGaWxldHlwZXM6IChAc3VwcG9ydGVkRmlsZXR5cGVzPVtdKSAtPlxuICAgIEB1cGRhdGVJZ25vcmVkRmlsZXR5cGVzKClcbiAgICBAZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWlnbm9yZWQtc2NvcGVzJywgQGdldElnbm9yZWRTY29wZXMoKSlcblxuICB1cGRhdGVJZ25vcmVkRmlsZXR5cGVzOiAtPlxuICAgIEBpZ25vcmVkRmlsZXR5cGVzID0gQGdldElnbm9yZWRGaWxldHlwZXMoKVxuXG4gIGdldElnbm9yZWRGaWxldHlwZXM6IC0+XG4gICAgZmlsZXR5cGVzID0gQHN1cHBvcnRlZEZpbGV0eXBlcyA/IFtdXG5cbiAgICB1bmxlc3MgQGlnbm9yZUdsb2JhbFN1cHBvcnRlZEZpbGV0eXBlc1xuICAgICAgZmlsZXR5cGVzID0gZmlsZXR5cGVzLmNvbmNhdChhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLnN1cHBvcnRlZEZpbGV0eXBlcycpID8gW10pXG5cbiAgICBmaWxldHlwZXMgPSBbJyonXSBpZiBmaWxldHlwZXMubGVuZ3RoIGlzIDBcblxuICAgIHJldHVybiBbXSBpZiBmaWxldHlwZXMuc29tZSAodHlwZSkgLT4gdHlwZSBpcyAnKidcblxuICAgIHNjb3BlcyA9IGZpbGV0eXBlcy5tYXAgKGV4dCkgLT5cbiAgICAgIGF0b20uZ3JhbW1hcnMuc2VsZWN0R3JhbW1hcihcImZpbGUuI3tleHR9XCIpPy5zY29wZU5hbWUucmVwbGFjZSgvXFwuL2csICdcXFxcLicpXG4gICAgLmZpbHRlciAoc2NvcGUpIC0+IHNjb3BlP1xuXG4gICAgW1wiXig/IVxcXFwuKCN7c2NvcGVzLmpvaW4oJ3wnKX0pKVwiXVxuXG4gIHNldElnbm9yZUdsb2JhbFN1cHBvcnRlZEZpbGV0eXBlczogKEBpZ25vcmVHbG9iYWxTdXBwb3J0ZWRGaWxldHlwZXMpIC0+XG4gICAgQHVwZGF0ZUlnbm9yZWRGaWxldHlwZXMoKVxuICAgIEBlbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtaWdub3JlZC1zY29wZXMnLCBAZ2V0SWdub3JlZFNjb3BlcygpKVxuXG4gIHRoZW1lc0luY2x1ZGVkOiAtPiBAaW5jbHVkZVRoZW1lc1xuXG4gIHNldEluY2x1ZGVUaGVtZXM6IChpbmNsdWRlVGhlbWVzKSAtPlxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKSBpZiBpbmNsdWRlVGhlbWVzIGlzIEBpbmNsdWRlVGhlbWVzXG5cbiAgICBAaW5jbHVkZVRoZW1lcyA9IGluY2x1ZGVUaGVtZXNcbiAgICBpZiBAaW5jbHVkZVRoZW1lc1xuICAgICAgQGluY2x1ZGVUaGVtZXNWYXJpYWJsZXMoKVxuICAgIGVsc2VcbiAgICAgIEBkaXNwb3NlVGhlbWVzVmFyaWFibGVzKClcblxuICBpbmNsdWRlVGhlbWVzVmFyaWFibGVzOiAtPlxuICAgIEB0aGVtZXNTdWJzY3JpcHRpb24gPSBhdG9tLnRoZW1lcy5vbkRpZENoYW5nZUFjdGl2ZVRoZW1lcyA9PlxuICAgICAgcmV0dXJuIHVubGVzcyBAaW5jbHVkZVRoZW1lc1xuXG4gICAgICB7VEhFTUVfVkFSSUFCTEVTfSA9IHJlcXVpcmUgJy4vdXJpcycgdW5sZXNzIFRIRU1FX1ZBUklBQkxFUz9cblxuICAgICAgdmFyaWFibGVzID0gQGxvYWRUaGVtZXNWYXJpYWJsZXMoKVxuICAgICAgQHZhcmlhYmxlcy51cGRhdGVQYXRoQ29sbGVjdGlvbihUSEVNRV9WQVJJQUJMRVMsIHZhcmlhYmxlcylcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAdGhlbWVzU3Vic2NyaXB0aW9uXG4gICAgQHZhcmlhYmxlcy5hZGRNYW55KEBsb2FkVGhlbWVzVmFyaWFibGVzKCkpXG5cbiAgZGlzcG9zZVRoZW1lc1ZhcmlhYmxlczogLT5cbiAgICB7VEhFTUVfVkFSSUFCTEVTfSA9IHJlcXVpcmUgJy4vdXJpcycgdW5sZXNzIFRIRU1FX1ZBUklBQkxFUz9cblxuICAgIEBzdWJzY3JpcHRpb25zLnJlbW92ZSBAdGhlbWVzU3Vic2NyaXB0aW9uXG4gICAgQHZhcmlhYmxlcy5kZWxldGVWYXJpYWJsZXNGb3JQYXRocyhbVEhFTUVfVkFSSUFCTEVTXSlcbiAgICBAdGhlbWVzU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuXG4gIGdldFRpbWVzdGFtcDogLT4gbmV3IERhdGUoKVxuXG4gIHNlcmlhbGl6ZTogLT5cbiAgICB1bmxlc3MgU0VSSUFMSVpFX1ZFUlNJT04/XG4gICAgICB7U0VSSUFMSVpFX1ZFUlNJT04sIFNFUklBTElaRV9NQVJLRVJTX1ZFUlNJT059ID0gcmVxdWlyZSAnLi92ZXJzaW9ucydcblxuICAgIGRhdGEgPVxuICAgICAgZGVzZXJpYWxpemVyOiAnQ29sb3JQcm9qZWN0J1xuICAgICAgdGltZXN0YW1wOiBAZ2V0VGltZXN0YW1wKClcbiAgICAgIHZlcnNpb246IFNFUklBTElaRV9WRVJTSU9OXG4gICAgICBtYXJrZXJzVmVyc2lvbjogU0VSSUFMSVpFX01BUktFUlNfVkVSU0lPTlxuICAgICAgZ2xvYmFsU291cmNlTmFtZXM6IGF0b20uY29uZmlnLmdldCgncGlnbWVudHMuc291cmNlTmFtZXMnKVxuICAgICAgZ2xvYmFsSWdub3JlZE5hbWVzOiBhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLmlnbm9yZWROYW1lcycpXG5cbiAgICBpZiBAaWdub3JlR2xvYmFsU291cmNlTmFtZXM/XG4gICAgICBkYXRhLmlnbm9yZUdsb2JhbFNvdXJjZU5hbWVzID0gQGlnbm9yZUdsb2JhbFNvdXJjZU5hbWVzXG4gICAgaWYgQGlnbm9yZUdsb2JhbFNlYXJjaE5hbWVzP1xuICAgICAgZGF0YS5pZ25vcmVHbG9iYWxTZWFyY2hOYW1lcyA9IEBpZ25vcmVHbG9iYWxTZWFyY2hOYW1lc1xuICAgIGlmIEBpZ25vcmVHbG9iYWxJZ25vcmVkTmFtZXM/XG4gICAgICBkYXRhLmlnbm9yZUdsb2JhbElnbm9yZWROYW1lcyA9IEBpZ25vcmVHbG9iYWxJZ25vcmVkTmFtZXNcbiAgICBpZiBAaWdub3JlR2xvYmFsSWdub3JlZFNjb3Blcz9cbiAgICAgIGRhdGEuaWdub3JlR2xvYmFsSWdub3JlZFNjb3BlcyA9IEBpZ25vcmVHbG9iYWxJZ25vcmVkU2NvcGVzXG4gICAgaWYgQGluY2x1ZGVUaGVtZXM/XG4gICAgICBkYXRhLmluY2x1ZGVUaGVtZXMgPSBAaW5jbHVkZVRoZW1lc1xuICAgIGlmIEBpZ25vcmVkU2NvcGVzP1xuICAgICAgZGF0YS5pZ25vcmVkU2NvcGVzID0gQGlnbm9yZWRTY29wZXNcbiAgICBpZiBAaWdub3JlZE5hbWVzP1xuICAgICAgZGF0YS5pZ25vcmVkTmFtZXMgPSBAaWdub3JlZE5hbWVzXG4gICAgaWYgQHNvdXJjZU5hbWVzP1xuICAgICAgZGF0YS5zb3VyY2VOYW1lcyA9IEBzb3VyY2VOYW1lc1xuICAgIGlmIEBzZWFyY2hOYW1lcz9cbiAgICAgIGRhdGEuc2VhcmNoTmFtZXMgPSBAc2VhcmNoTmFtZXNcblxuICAgIGRhdGEuYnVmZmVycyA9IEBzZXJpYWxpemVCdWZmZXJzKClcblxuICAgIGlmIEBpc0luaXRpYWxpemVkKClcbiAgICAgIGRhdGEucGF0aHMgPSBAcGF0aHNcbiAgICAgIGRhdGEudmFyaWFibGVzID0gQHZhcmlhYmxlcy5zZXJpYWxpemUoKVxuXG4gICAgZGF0YVxuXG4gIHNlcmlhbGl6ZUJ1ZmZlcnM6IC0+XG4gICAgb3V0ID0ge31cbiAgICBmb3IgaWQsY29sb3JCdWZmZXIgb2YgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWRcbiAgICAgIG91dFtpZF0gPSBjb2xvckJ1ZmZlci5zZXJpYWxpemUoKVxuICAgIG91dFxuIl19
