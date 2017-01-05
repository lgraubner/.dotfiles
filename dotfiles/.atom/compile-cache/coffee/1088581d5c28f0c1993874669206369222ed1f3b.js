(function() {
  var ColorBufferElement, ColorMarkerElement, CompositeDisposable, Emitter, EventsDelegation, nextHighlightId, ref, ref1, registerOrUpdateElement,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = require('atom-utils'), registerOrUpdateElement = ref.registerOrUpdateElement, EventsDelegation = ref.EventsDelegation;

  ref1 = [], ColorMarkerElement = ref1[0], Emitter = ref1[1], CompositeDisposable = ref1[2];

  nextHighlightId = 0;

  ColorBufferElement = (function(superClass) {
    extend(ColorBufferElement, superClass);

    function ColorBufferElement() {
      return ColorBufferElement.__super__.constructor.apply(this, arguments);
    }

    EventsDelegation.includeInto(ColorBufferElement);

    ColorBufferElement.prototype.createdCallback = function() {
      var ref2, ref3;
      if (Emitter == null) {
        ref2 = require('atom'), Emitter = ref2.Emitter, CompositeDisposable = ref2.CompositeDisposable;
      }
      ref3 = [0, 0], this.editorScrollLeft = ref3[0], this.editorScrollTop = ref3[1];
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.shadowRoot = this.createShadowRoot();
      this.displayedMarkers = [];
      this.usedMarkers = [];
      this.unusedMarkers = [];
      return this.viewsByMarkers = new WeakMap;
    };

    ColorBufferElement.prototype.attachedCallback = function() {
      this.attached = true;
      return this.update();
    };

    ColorBufferElement.prototype.detachedCallback = function() {
      return this.attached = false;
    };

    ColorBufferElement.prototype.onDidUpdate = function(callback) {
      return this.emitter.on('did-update', callback);
    };

    ColorBufferElement.prototype.getModel = function() {
      return this.colorBuffer;
    };

    ColorBufferElement.prototype.setModel = function(colorBuffer) {
      var scrollLeftListener, scrollTopListener;
      this.colorBuffer = colorBuffer;
      this.editor = this.colorBuffer.editor;
      if (this.editor.isDestroyed()) {
        return;
      }
      this.editorElement = atom.views.getView(this.editor);
      this.colorBuffer.initialize().then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
      this.subscriptions.add(this.colorBuffer.onDidUpdateColorMarkers((function(_this) {
        return function() {
          return _this.update();
        };
      })(this)));
      this.subscriptions.add(this.colorBuffer.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      scrollLeftListener = (function(_this) {
        return function(editorScrollLeft) {
          _this.editorScrollLeft = editorScrollLeft;
          return _this.updateScroll();
        };
      })(this);
      scrollTopListener = (function(_this) {
        return function(editorScrollTop) {
          _this.editorScrollTop = editorScrollTop;
          if (_this.useNativeDecorations()) {
            return;
          }
          _this.updateScroll();
          return requestAnimationFrame(function() {
            return _this.updateMarkers();
          });
        };
      })(this);
      if (this.editorElement.onDidChangeScrollLeft != null) {
        this.subscriptions.add(this.editorElement.onDidChangeScrollLeft(scrollLeftListener));
        this.subscriptions.add(this.editorElement.onDidChangeScrollTop(scrollTopListener));
      } else {
        this.subscriptions.add(this.editor.onDidChangeScrollLeft(scrollLeftListener));
        this.subscriptions.add(this.editor.onDidChangeScrollTop(scrollTopListener));
      }
      this.subscriptions.add(this.editor.onDidChange((function(_this) {
        return function() {
          return _this.usedMarkers.forEach(function(marker) {
            var ref2;
            if ((ref2 = marker.colorMarker) != null) {
              ref2.invalidateScreenRangeCache();
            }
            return marker.checkScreenRange();
          });
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidAddCursor((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidRemoveCursor((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChangeCursorPosition((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidAddSelection((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidRemoveSelection((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChangeSelectionRange((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      if (this.editor.onDidTokenize != null) {
        this.subscriptions.add(this.editor.onDidTokenize((function(_this) {
          return function() {
            return _this.editorConfigChanged();
          };
        })(this)));
      } else {
        this.subscriptions.add(this.editor.displayBuffer.onDidTokenize((function(_this) {
          return function() {
            return _this.editorConfigChanged();
          };
        })(this)));
      }
      this.subscriptions.add(atom.config.observe('editor.fontSize', (function(_this) {
        return function() {
          return _this.editorConfigChanged();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('editor.lineHeight', (function(_this) {
        return function() {
          return _this.editorConfigChanged();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.markerType', (function(_this) {
        return function(type) {
          if (ColorMarkerElement == null) {
            ColorMarkerElement = require('./color-marker-element');
          }
          if (ColorMarkerElement.prototype.rendererType !== type) {
            ColorMarkerElement.setMarkerType(type);
          }
          if (_this.isNativeDecorationType(type)) {
            _this.initializeNativeDecorations(type);
          } else {
            if (type === 'background') {
              _this.classList.add('above-editor-content');
            } else {
              _this.classList.remove('above-editor-content');
            }
            _this.destroyNativeDecorations();
            _this.updateMarkers(type);
          }
          return _this.previousType = type;
        };
      })(this)));
      this.subscriptions.add(atom.styles.onDidAddStyleElement((function(_this) {
        return function() {
          return _this.editorConfigChanged();
        };
      })(this)));
      this.subscriptions.add(this.editorElement.onDidAttach((function(_this) {
        return function() {
          return _this.attach();
        };
      })(this)));
      return this.subscriptions.add(this.editorElement.onDidDetach((function(_this) {
        return function() {
          return _this.detach();
        };
      })(this)));
    };

    ColorBufferElement.prototype.attach = function() {
      var ref2;
      if (this.parentNode != null) {
        return;
      }
      if (this.editorElement == null) {
        return;
      }
      return (ref2 = this.getEditorRoot().querySelector('.lines')) != null ? ref2.appendChild(this) : void 0;
    };

    ColorBufferElement.prototype.detach = function() {
      if (this.parentNode == null) {
        return;
      }
      return this.parentNode.removeChild(this);
    };

    ColorBufferElement.prototype.destroy = function() {
      this.detach();
      this.subscriptions.dispose();
      if (this.isNativeDecorationType()) {
        this.destroyNativeDecorations();
      } else {
        this.releaseAllMarkerViews();
      }
      return this.colorBuffer = null;
    };

    ColorBufferElement.prototype.update = function() {
      if (this.useNativeDecorations()) {
        if (this.isGutterType()) {
          return this.updateGutterDecorations();
        } else {
          return this.updateHighlightDecorations(this.previousType);
        }
      } else {
        return this.updateMarkers();
      }
    };

    ColorBufferElement.prototype.updateScroll = function() {
      if (this.editorElement.hasTiledRendering && !this.useNativeDecorations()) {
        return this.style.webkitTransform = "translate3d(" + (-this.editorScrollLeft) + "px, " + (-this.editorScrollTop) + "px, 0)";
      }
    };

    ColorBufferElement.prototype.getEditorRoot = function() {
      var ref2;
      return (ref2 = this.editorElement.shadowRoot) != null ? ref2 : this.editorElement;
    };

    ColorBufferElement.prototype.editorConfigChanged = function() {
      if ((this.parentNode == null) || this.useNativeDecorations()) {
        return;
      }
      this.usedMarkers.forEach((function(_this) {
        return function(marker) {
          if (marker.colorMarker != null) {
            return marker.render();
          } else {
            console.warn("A marker view was found in the used instance pool while having a null model", marker);
            return _this.releaseMarkerElement(marker);
          }
        };
      })(this));
      return this.updateMarkers();
    };

    ColorBufferElement.prototype.isGutterType = function(type) {
      if (type == null) {
        type = this.previousType;
      }
      return type === 'gutter' || type === 'native-dot' || type === 'native-square-dot';
    };

    ColorBufferElement.prototype.isDotType = function(type) {
      if (type == null) {
        type = this.previousType;
      }
      return type === 'native-dot' || type === 'native-square-dot';
    };

    ColorBufferElement.prototype.useNativeDecorations = function() {
      return this.isNativeDecorationType(this.previousType);
    };

    ColorBufferElement.prototype.isNativeDecorationType = function(type) {
      if (ColorMarkerElement == null) {
        ColorMarkerElement = require('./color-marker-element');
      }
      return ColorMarkerElement.isNativeDecorationType(type);
    };

    ColorBufferElement.prototype.initializeNativeDecorations = function(type) {
      this.releaseAllMarkerViews();
      this.destroyNativeDecorations();
      if (this.isGutterType(type)) {
        return this.initializeGutter(type);
      } else {
        return this.updateHighlightDecorations(type);
      }
    };

    ColorBufferElement.prototype.destroyNativeDecorations = function() {
      if (this.isGutterType()) {
        return this.destroyGutter();
      } else {
        return this.destroyHighlightDecorations();
      }
    };

    ColorBufferElement.prototype.updateHighlightDecorations = function(type) {
      var className, i, j, len, len1, m, markers, markersByRows, maxRowLength, ref2, ref3, ref4, ref5, style;
      if (this.editor.isDestroyed()) {
        return;
      }
      if (this.styleByMarkerId == null) {
        this.styleByMarkerId = {};
      }
      if (this.decorationByMarkerId == null) {
        this.decorationByMarkerId = {};
      }
      markers = this.colorBuffer.getValidColorMarkers();
      ref2 = this.displayedMarkers;
      for (i = 0, len = ref2.length; i < len; i++) {
        m = ref2[i];
        if (!(indexOf.call(markers, m) < 0)) {
          continue;
        }
        if ((ref3 = this.decorationByMarkerId[m.id]) != null) {
          ref3.destroy();
        }
        this.removeChild(this.styleByMarkerId[m.id]);
        delete this.styleByMarkerId[m.id];
        delete this.decorationByMarkerId[m.id];
      }
      markersByRows = {};
      maxRowLength = 0;
      for (j = 0, len1 = markers.length; j < len1; j++) {
        m = markers[j];
        if (((ref4 = m.color) != null ? ref4.isValid() : void 0) && indexOf.call(this.displayedMarkers, m) < 0) {
          ref5 = this.getHighlighDecorationCSS(m, type), className = ref5.className, style = ref5.style;
          this.appendChild(style);
          this.styleByMarkerId[m.id] = style;
          this.decorationByMarkerId[m.id] = this.editor.decorateMarker(m.marker, {
            type: 'highlight',
            "class": "pigments-" + type + " " + className,
            includeMarkerText: type === 'highlight'
          });
        }
      }
      this.displayedMarkers = markers;
      return this.emitter.emit('did-update');
    };

    ColorBufferElement.prototype.destroyHighlightDecorations = function() {
      var deco, id, ref2;
      ref2 = this.decorationByMarkerId;
      for (id in ref2) {
        deco = ref2[id];
        if (this.styleByMarkerId[id] != null) {
          this.removeChild(this.styleByMarkerId[id]);
        }
        deco.destroy();
      }
      delete this.decorationByMarkerId;
      delete this.styleByMarkerId;
      return this.displayedMarkers = [];
    };

    ColorBufferElement.prototype.getHighlighDecorationCSS = function(marker, type) {
      var className, l, style;
      className = "pigments-highlight-" + (nextHighlightId++);
      style = document.createElement('style');
      l = marker.color.luma;
      if (type === 'native-background') {
        style.innerHTML = "." + className + " .region {\n  background-color: " + (marker.color.toCSS()) + ";\n  color: " + (l > 0.43 ? 'black' : 'white') + ";\n}";
      } else if (type === 'native-underline') {
        style.innerHTML = "." + className + " .region {\n  background-color: " + (marker.color.toCSS()) + ";\n}";
      } else if (type === 'native-outline') {
        style.innerHTML = "." + className + " .region {\n  border-color: " + (marker.color.toCSS()) + ";\n}";
      }
      return {
        className: className,
        style: style
      };
    };

    ColorBufferElement.prototype.initializeGutter = function(type) {
      var gutterContainer, options;
      options = {
        name: "pigments-" + type
      };
      if (type !== 'gutter') {
        options.priority = 1000;
      }
      this.gutter = this.editor.addGutter(options);
      this.displayedMarkers = [];
      if (this.decorationByMarkerId == null) {
        this.decorationByMarkerId = {};
      }
      gutterContainer = this.getEditorRoot().querySelector('.gutter-container');
      this.gutterSubscription = new CompositeDisposable;
      this.gutterSubscription.add(this.subscribeTo(gutterContainer, {
        mousedown: (function(_this) {
          return function(e) {
            var colorMarker, markerId, targetDecoration;
            targetDecoration = e.path[0];
            if (!targetDecoration.matches('span')) {
              targetDecoration = targetDecoration.querySelector('span');
            }
            if (targetDecoration == null) {
              return;
            }
            markerId = targetDecoration.dataset.markerId;
            colorMarker = _this.displayedMarkers.filter(function(m) {
              return m.id === Number(markerId);
            })[0];
            if (!((colorMarker != null) && (_this.colorBuffer != null))) {
              return;
            }
            return _this.colorBuffer.selectColorMarkerAndOpenPicker(colorMarker);
          };
        })(this)
      }));
      if (this.isDotType(type)) {
        this.gutterSubscription.add(this.editor.onDidChange((function(_this) {
          return function(changes) {
            if (Array.isArray(changes)) {
              return changes != null ? changes.forEach(function(change) {
                return _this.updateDotDecorationsOffsets(change.start.row, change.newExtent.row);
              }) : void 0;
            } else {
              return _this.updateDotDecorationsOffsets(changes.start.row, changes.newExtent.row);
            }
          };
        })(this)));
      }
      return this.updateGutterDecorations(type);
    };

    ColorBufferElement.prototype.destroyGutter = function() {
      var decoration, id, ref2;
      this.gutter.destroy();
      this.gutterSubscription.dispose();
      this.displayedMarkers = [];
      ref2 = this.decorationByMarkerId;
      for (id in ref2) {
        decoration = ref2[id];
        decoration.destroy();
      }
      delete this.decorationByMarkerId;
      return delete this.gutterSubscription;
    };

    ColorBufferElement.prototype.updateGutterDecorations = function(type) {
      var deco, decoWidth, i, j, len, len1, m, markers, markersByRows, maxRowLength, ref2, ref3, ref4, row, rowLength;
      if (type == null) {
        type = this.previousType;
      }
      if (this.editor.isDestroyed()) {
        return;
      }
      markers = this.colorBuffer.getValidColorMarkers();
      ref2 = this.displayedMarkers;
      for (i = 0, len = ref2.length; i < len; i++) {
        m = ref2[i];
        if (!(indexOf.call(markers, m) < 0)) {
          continue;
        }
        if ((ref3 = this.decorationByMarkerId[m.id]) != null) {
          ref3.destroy();
        }
        delete this.decorationByMarkerId[m.id];
      }
      markersByRows = {};
      maxRowLength = 0;
      for (j = 0, len1 = markers.length; j < len1; j++) {
        m = markers[j];
        if (((ref4 = m.color) != null ? ref4.isValid() : void 0) && indexOf.call(this.displayedMarkers, m) < 0) {
          this.decorationByMarkerId[m.id] = this.gutter.decorateMarker(m.marker, {
            type: 'gutter',
            "class": 'pigments-gutter-marker',
            item: this.getGutterDecorationItem(m)
          });
        }
        deco = this.decorationByMarkerId[m.id];
        row = m.marker.getStartScreenPosition().row;
        if (markersByRows[row] == null) {
          markersByRows[row] = 0;
        }
        rowLength = 0;
        if (type !== 'gutter') {
          rowLength = this.editorElement.pixelPositionForScreenPosition([row, 2e308]).left;
        }
        decoWidth = 14;
        deco.properties.item.style.left = (rowLength + markersByRows[row] * decoWidth) + "px";
        markersByRows[row]++;
        maxRowLength = Math.max(maxRowLength, markersByRows[row]);
      }
      if (type === 'gutter') {
        atom.views.getView(this.gutter).style.minWidth = (maxRowLength * decoWidth) + "px";
      } else {
        atom.views.getView(this.gutter).style.width = "0px";
      }
      this.displayedMarkers = markers;
      return this.emitter.emit('did-update');
    };

    ColorBufferElement.prototype.updateDotDecorationsOffsets = function(rowStart, rowEnd) {
      var deco, decoWidth, i, m, markerRow, markersByRows, ref2, ref3, results, row, rowLength;
      markersByRows = {};
      results = [];
      for (row = i = ref2 = rowStart, ref3 = rowEnd; ref2 <= ref3 ? i <= ref3 : i >= ref3; row = ref2 <= ref3 ? ++i : --i) {
        results.push((function() {
          var j, len, ref4, results1;
          ref4 = this.displayedMarkers;
          results1 = [];
          for (j = 0, len = ref4.length; j < len; j++) {
            m = ref4[j];
            deco = this.decorationByMarkerId[m.id];
            if (m.marker == null) {
              continue;
            }
            markerRow = m.marker.getStartScreenPosition().row;
            if (row !== markerRow) {
              continue;
            }
            if (markersByRows[row] == null) {
              markersByRows[row] = 0;
            }
            rowLength = this.editorElement.pixelPositionForScreenPosition([row, 2e308]).left;
            decoWidth = 14;
            deco.properties.item.style.left = (rowLength + markersByRows[row] * decoWidth) + "px";
            results1.push(markersByRows[row]++);
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    ColorBufferElement.prototype.getGutterDecorationItem = function(marker) {
      var div;
      div = document.createElement('div');
      div.innerHTML = "<span style='background-color: " + (marker.color.toCSS()) + ";' data-marker-id='" + marker.id + "'></span>";
      return div;
    };

    ColorBufferElement.prototype.requestMarkerUpdate = function(markers) {
      if (this.frameRequested) {
        this.dirtyMarkers = this.dirtyMarkers.concat(markers);
        return;
      } else {
        this.dirtyMarkers = markers.slice();
        this.frameRequested = true;
      }
      return requestAnimationFrame((function(_this) {
        return function() {
          var dirtyMarkers, i, len, m, ref2;
          dirtyMarkers = [];
          ref2 = _this.dirtyMarkers;
          for (i = 0, len = ref2.length; i < len; i++) {
            m = ref2[i];
            if (indexOf.call(dirtyMarkers, m) < 0) {
              dirtyMarkers.push(m);
            }
          }
          delete _this.frameRequested;
          delete _this.dirtyMarkers;
          if (_this.colorBuffer == null) {
            return;
          }
          return dirtyMarkers.forEach(function(marker) {
            return marker.render();
          });
        };
      })(this));
    };

    ColorBufferElement.prototype.updateMarkers = function(type) {
      var base, base1, i, j, len, len1, m, markers, ref2, ref3, ref4;
      if (type == null) {
        type = this.previousType;
      }
      if (this.editor.isDestroyed()) {
        return;
      }
      markers = this.colorBuffer.findValidColorMarkers({
        intersectsScreenRowRange: (ref2 = typeof (base = this.editorElement).getVisibleRowRange === "function" ? base.getVisibleRowRange() : void 0) != null ? ref2 : typeof (base1 = this.editor).getVisibleRowRange === "function" ? base1.getVisibleRowRange() : void 0
      });
      ref3 = this.displayedMarkers;
      for (i = 0, len = ref3.length; i < len; i++) {
        m = ref3[i];
        if (indexOf.call(markers, m) < 0) {
          this.releaseMarkerView(m);
        }
      }
      for (j = 0, len1 = markers.length; j < len1; j++) {
        m = markers[j];
        if (((ref4 = m.color) != null ? ref4.isValid() : void 0) && indexOf.call(this.displayedMarkers, m) < 0) {
          this.requestMarkerView(m);
        }
      }
      this.displayedMarkers = markers;
      return this.emitter.emit('did-update');
    };

    ColorBufferElement.prototype.requestMarkerView = function(marker) {
      var view;
      if (this.unusedMarkers.length) {
        view = this.unusedMarkers.shift();
      } else {
        if (ColorMarkerElement == null) {
          ColorMarkerElement = require('./color-marker-element');
        }
        view = new ColorMarkerElement;
        view.setContainer(this);
        view.onDidRelease((function(_this) {
          return function(arg) {
            var marker;
            marker = arg.marker;
            _this.displayedMarkers.splice(_this.displayedMarkers.indexOf(marker), 1);
            return _this.releaseMarkerView(marker);
          };
        })(this));
        this.shadowRoot.appendChild(view);
      }
      view.setModel(marker);
      this.hideMarkerIfInSelectionOrFold(marker, view);
      this.usedMarkers.push(view);
      this.viewsByMarkers.set(marker, view);
      return view;
    };

    ColorBufferElement.prototype.releaseMarkerView = function(markerOrView) {
      var marker, view;
      marker = markerOrView;
      view = this.viewsByMarkers.get(markerOrView);
      if (view != null) {
        if (marker != null) {
          this.viewsByMarkers["delete"](marker);
        }
        return this.releaseMarkerElement(view);
      }
    };

    ColorBufferElement.prototype.releaseMarkerElement = function(view) {
      this.usedMarkers.splice(this.usedMarkers.indexOf(view), 1);
      if (!view.isReleased()) {
        view.release(false);
      }
      return this.unusedMarkers.push(view);
    };

    ColorBufferElement.prototype.releaseAllMarkerViews = function() {
      var i, j, len, len1, ref2, ref3, view;
      ref2 = this.usedMarkers;
      for (i = 0, len = ref2.length; i < len; i++) {
        view = ref2[i];
        view.destroy();
      }
      ref3 = this.unusedMarkers;
      for (j = 0, len1 = ref3.length; j < len1; j++) {
        view = ref3[j];
        view.destroy();
      }
      this.usedMarkers = [];
      this.unusedMarkers = [];
      return Array.prototype.forEach.call(this.shadowRoot.querySelectorAll('pigments-color-marker'), function(el) {
        return el.parentNode.removeChild(el);
      });
    };

    ColorBufferElement.prototype.requestSelectionUpdate = function() {
      if (this.updateRequested) {
        return;
      }
      this.updateRequested = true;
      return requestAnimationFrame((function(_this) {
        return function() {
          _this.updateRequested = false;
          if (_this.editor.getBuffer().isDestroyed()) {
            return;
          }
          return _this.updateSelections();
        };
      })(this));
    };

    ColorBufferElement.prototype.updateSelections = function() {
      var decoration, i, j, len, len1, marker, ref2, ref3, results, results1, view;
      if (this.editor.isDestroyed()) {
        return;
      }
      if (this.useNativeDecorations()) {
        ref2 = this.displayedMarkers;
        results = [];
        for (i = 0, len = ref2.length; i < len; i++) {
          marker = ref2[i];
          decoration = this.decorationByMarkerId[marker.id];
          if (decoration != null) {
            results.push(this.hideDecorationIfInSelection(marker, decoration));
          } else {
            results.push(void 0);
          }
        }
        return results;
      } else {
        ref3 = this.displayedMarkers;
        results1 = [];
        for (j = 0, len1 = ref3.length; j < len1; j++) {
          marker = ref3[j];
          view = this.viewsByMarkers.get(marker);
          if (view != null) {
            view.classList.remove('hidden');
            view.classList.remove('in-fold');
            results1.push(this.hideMarkerIfInSelectionOrFold(marker, view));
          } else {
            results1.push(console.warn("A color marker was found in the displayed markers array without an associated view", marker));
          }
        }
        return results1;
      }
    };

    ColorBufferElement.prototype.hideDecorationIfInSelection = function(marker, decoration) {
      var classes, i, len, markerRange, props, range, selection, selections;
      selections = this.editor.getSelections();
      props = decoration.getProperties();
      classes = props["class"].split(/\s+/g);
      for (i = 0, len = selections.length; i < len; i++) {
        selection = selections[i];
        range = selection.getScreenRange();
        markerRange = marker.getScreenRange();
        if (!((markerRange != null) && (range != null))) {
          continue;
        }
        if (markerRange.intersectsWith(range)) {
          if (classes[0].match(/-in-selection$/) == null) {
            classes[0] += '-in-selection';
          }
          props["class"] = classes.join(' ');
          decoration.setProperties(props);
          return;
        }
      }
      classes = classes.map(function(cls) {
        return cls.replace('-in-selection', '');
      });
      props["class"] = classes.join(' ');
      return decoration.setProperties(props);
    };

    ColorBufferElement.prototype.hideMarkerIfInSelectionOrFold = function(marker, view) {
      var i, len, markerRange, range, results, selection, selections;
      selections = this.editor.getSelections();
      results = [];
      for (i = 0, len = selections.length; i < len; i++) {
        selection = selections[i];
        range = selection.getScreenRange();
        markerRange = marker.getScreenRange();
        if (!((markerRange != null) && (range != null))) {
          continue;
        }
        if (markerRange.intersectsWith(range)) {
          view.classList.add('hidden');
        }
        if (this.editor.isFoldedAtBufferRow(marker.getBufferRange().start.row)) {
          results.push(view.classList.add('in-fold'));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    ColorBufferElement.prototype.colorMarkerForMouseEvent = function(event) {
      var bufferPosition, position;
      position = this.screenPositionForMouseEvent(event);
      if (position == null) {
        return;
      }
      bufferPosition = this.colorBuffer.editor.bufferPositionForScreenPosition(position);
      return this.colorBuffer.getColorMarkerAtBufferPosition(bufferPosition);
    };

    ColorBufferElement.prototype.screenPositionForMouseEvent = function(event) {
      var pixelPosition;
      pixelPosition = this.pixelPositionForMouseEvent(event);
      if (pixelPosition == null) {
        return;
      }
      if (this.editorElement.screenPositionForPixelPosition != null) {
        return this.editorElement.screenPositionForPixelPosition(pixelPosition);
      } else {
        return this.editor.screenPositionForPixelPosition(pixelPosition);
      }
    };

    ColorBufferElement.prototype.pixelPositionForMouseEvent = function(event) {
      var clientX, clientY, left, ref2, rootElement, scrollTarget, top;
      clientX = event.clientX, clientY = event.clientY;
      scrollTarget = this.editorElement.getScrollTop != null ? this.editorElement : this.editor;
      rootElement = this.getEditorRoot();
      if (rootElement.querySelector('.lines') == null) {
        return;
      }
      ref2 = rootElement.querySelector('.lines').getBoundingClientRect(), top = ref2.top, left = ref2.left;
      top = clientY - top + scrollTarget.getScrollTop();
      left = clientX - left + scrollTarget.getScrollLeft();
      return {
        top: top,
        left: left
      };
    };

    return ColorBufferElement;

  })(HTMLElement);

  module.exports = ColorBufferElement = registerOrUpdateElement('pigments-markers', ColorBufferElement.prototype);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLWJ1ZmZlci1lbGVtZW50LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsMklBQUE7SUFBQTs7OztFQUFBLE1BQThDLE9BQUEsQ0FBUSxZQUFSLENBQTlDLEVBQUMscURBQUQsRUFBMEI7O0VBRTFCLE9BQXFELEVBQXJELEVBQUMsNEJBQUQsRUFBcUIsaUJBQXJCLEVBQThCOztFQUU5QixlQUFBLEdBQWtCOztFQUVaOzs7Ozs7O0lBQ0osZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsa0JBQTdCOztpQ0FFQSxlQUFBLEdBQWlCLFNBQUE7QUFDZixVQUFBO01BQUEsSUFBTyxlQUFQO1FBQ0UsT0FBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQyxzQkFBRCxFQUFVLCtDQURaOztNQUdBLE9BQXdDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBeEMsRUFBQyxJQUFDLENBQUEsMEJBQUYsRUFBb0IsSUFBQyxDQUFBO01BQ3JCLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSTtNQUNmLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDckIsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsZ0JBQUQsQ0FBQTtNQUNkLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjtNQUNwQixJQUFDLENBQUEsV0FBRCxHQUFlO01BQ2YsSUFBQyxDQUFBLGFBQUQsR0FBaUI7YUFDakIsSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFBSTtJQVhQOztpQ0FhakIsZ0JBQUEsR0FBa0IsU0FBQTtNQUNoQixJQUFDLENBQUEsUUFBRCxHQUFZO2FBQ1osSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQUZnQjs7aUNBSWxCLGdCQUFBLEdBQWtCLFNBQUE7YUFDaEIsSUFBQyxDQUFBLFFBQUQsR0FBWTtJ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QWMsMkNBQWQ7QUFBQSxlQUFBOztNQUVBLE9BQWMsV0FBVyxDQUFDLGFBQVosQ0FBMEIsUUFBMUIsQ0FBbUMsQ0FBQyxxQkFBcEMsQ0FBQSxDQUFkLEVBQUMsY0FBRCxFQUFNO01BQ04sR0FBQSxHQUFNLE9BQUEsR0FBVSxHQUFWLEdBQWdCLFlBQVksQ0FBQyxZQUFiLENBQUE7TUFDdEIsSUFBQSxHQUFPLE9BQUEsR0FBVSxJQUFWLEdBQWlCLFlBQVksQ0FBQyxhQUFiLENBQUE7YUFDeEI7UUFBQyxLQUFBLEdBQUQ7UUFBTSxNQUFBLElBQU47O0lBZjBCOzs7O0tBdmpCRzs7RUF3a0JqQyxNQUFNLENBQUMsT0FBUCxHQUNBLGtCQUFBLEdBQ0EsdUJBQUEsQ0FBd0Isa0JBQXhCLEVBQTRDLGtCQUFrQixDQUFDLFNBQS9EO0FBaGxCQSIsInNvdXJjZXNDb250ZW50IjpbIntyZWdpc3Rlck9yVXBkYXRlRWxlbWVudCwgRXZlbnRzRGVsZWdhdGlvbn0gPSByZXF1aXJlICdhdG9tLXV0aWxzJ1xuXG5bQ29sb3JNYXJrZXJFbGVtZW50LCBFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlXSA9IFtdXG5cbm5leHRIaWdobGlnaHRJZCA9IDBcblxuY2xhc3MgQ29sb3JCdWZmZXJFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnRcbiAgRXZlbnRzRGVsZWdhdGlvbi5pbmNsdWRlSW50byh0aGlzKVxuXG4gIGNyZWF0ZWRDYWxsYmFjazogLT5cbiAgICB1bmxlc3MgRW1pdHRlcj9cbiAgICAgIHtFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbiAgICBbQGVkaXRvclNjcm9sbExlZnQsIEBlZGl0b3JTY3JvbGxUb3BdID0gWzAsIDBdXG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlclxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc2hhZG93Um9vdCA9IEBjcmVhdGVTaGFkb3dSb290KClcbiAgICBAZGlzcGxheWVkTWFya2VycyA9IFtdXG4gICAgQHVzZWRNYXJrZXJzID0gW11cbiAgICBAdW51c2VkTWFya2VycyA9IFtdXG4gICAgQHZpZXdzQnlNYXJrZXJzID0gbmV3IFdlYWtNYXBcblxuICBhdHRhY2hlZENhbGxiYWNrOiAtPlxuICAgIEBhdHRhY2hlZCA9IHRydWVcbiAgICBAdXBkYXRlKClcblxuICBkZXRhY2hlZENhbGxiYWNrOiAtPlxuICAgIEBhdHRhY2hlZCA9IGZhbHNlXG5cbiAgb25EaWRVcGRhdGU6IChjYWxsYmFjaykgLT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLXVwZGF0ZScsIGNhbGxiYWNrXG5cbiAgZ2V0TW9kZWw6IC0+IEBjb2xvckJ1ZmZlclxuXG4gIHNldE1vZGVsOiAoQGNvbG9yQnVmZmVyKSAtPlxuICAgIHtAZWRpdG9yfSA9IEBjb2xvckJ1ZmZlclxuICAgIHJldHVybiBpZiBAZWRpdG9yLmlzRGVzdHJveWVkKClcbiAgICBAZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhAZWRpdG9yKVxuXG4gICAgQGNvbG9yQnVmZmVyLmluaXRpYWxpemUoKS50aGVuID0+IEB1cGRhdGUoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBjb2xvckJ1ZmZlci5vbkRpZFVwZGF0ZUNvbG9yTWFya2VycyA9PiBAdXBkYXRlKClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGNvbG9yQnVmZmVyLm9uRGlkRGVzdHJveSA9PiBAZGVzdHJveSgpXG5cbiAgICBzY3JvbGxMZWZ0TGlzdGVuZXIgPSAoQGVkaXRvclNjcm9sbExlZnQpID0+IEB1cGRhdGVTY3JvbGwoKVxuICAgIHNjcm9sbFRvcExpc3RlbmVyID0gKEBlZGl0b3JTY3JvbGxUb3ApID0+XG4gICAgICByZXR1cm4gaWYgQHVzZU5hdGl2ZURlY29yYXRpb25zKClcbiAgICAgIEB1cGRhdGVTY3JvbGwoKVxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0+IEB1cGRhdGVNYXJrZXJzKClcblxuICAgIGlmIEBlZGl0b3JFbGVtZW50Lm9uRGlkQ2hhbmdlU2Nyb2xsTGVmdD9cbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAZWRpdG9yRWxlbWVudC5vbkRpZENoYW5nZVNjcm9sbExlZnQoc2Nyb2xsTGVmdExpc3RlbmVyKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3JFbGVtZW50Lm9uRGlkQ2hhbmdlU2Nyb2xsVG9wKHNjcm9sbFRvcExpc3RlbmVyKVxuICAgIGVsc2VcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAZWRpdG9yLm9uRGlkQ2hhbmdlU2Nyb2xsTGVmdChzY3JvbGxMZWZ0TGlzdGVuZXIpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGVkaXRvci5vbkRpZENoYW5nZVNjcm9sbFRvcChzY3JvbGxUb3BMaXN0ZW5lcilcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAZWRpdG9yLm9uRGlkQ2hhbmdlID0+XG4gICAgICBAdXNlZE1hcmtlcnMuZm9yRWFjaCAobWFya2VyKSAtPlxuICAgICAgICBtYXJrZXIuY29sb3JNYXJrZXI/LmludmFsaWRhdGVTY3JlZW5SYW5nZUNhY2hlKClcbiAgICAgICAgbWFya2VyLmNoZWNrU2NyZWVuUmFuZ2UoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3Iub25EaWRBZGRDdXJzb3IgPT5cbiAgICAgIEByZXF1ZXN0U2VsZWN0aW9uVXBkYXRlKClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGVkaXRvci5vbkRpZFJlbW92ZUN1cnNvciA9PlxuICAgICAgQHJlcXVlc3RTZWxlY3Rpb25VcGRhdGUoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAZWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24gPT5cbiAgICAgIEByZXF1ZXN0U2VsZWN0aW9uVXBkYXRlKClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGVkaXRvci5vbkRpZEFkZFNlbGVjdGlvbiA9PlxuICAgICAgQHJlcXVlc3RTZWxlY3Rpb25VcGRhdGUoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAZWRpdG9yLm9uRGlkUmVtb3ZlU2VsZWN0aW9uID0+XG4gICAgICBAcmVxdWVzdFNlbGVjdGlvblVwZGF0ZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3Iub25EaWRDaGFuZ2VTZWxlY3Rpb25SYW5nZSA9PlxuICAgICAgQHJlcXVlc3RTZWxlY3Rpb25VcGRhdGUoKVxuXG4gICAgaWYgQGVkaXRvci5vbkRpZFRva2VuaXplP1xuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3Iub25EaWRUb2tlbml6ZSA9PiBAZWRpdG9yQ29uZmlnQ2hhbmdlZCgpXG4gICAgZWxzZVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3IuZGlzcGxheUJ1ZmZlci5vbkRpZFRva2VuaXplID0+XG4gICAgICAgIEBlZGl0b3JDb25maWdDaGFuZ2VkKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdlZGl0b3IuZm9udFNpemUnLCA9PlxuICAgICAgQGVkaXRvckNvbmZpZ0NoYW5nZWQoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ2VkaXRvci5saW5lSGVpZ2h0JywgPT5cbiAgICAgIEBlZGl0b3JDb25maWdDaGFuZ2VkKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdwaWdtZW50cy5tYXJrZXJUeXBlJywgKHR5cGUpID0+XG4gICAgICBDb2xvck1hcmtlckVsZW1lbnQgPz0gcmVxdWlyZSAnLi9jb2xvci1tYXJrZXItZWxlbWVudCdcblxuICAgICAgaWYgQ29sb3JNYXJrZXJFbGVtZW50OjpyZW5kZXJlclR5cGUgaXNudCB0eXBlXG4gICAgICAgIENvbG9yTWFya2VyRWxlbWVudC5zZXRNYXJrZXJUeXBlKHR5cGUpXG5cbiAgICAgIGlmIEBpc05hdGl2ZURlY29yYXRpb25UeXBlKHR5cGUpXG4gICAgICAgIEBpbml0aWFsaXplTmF0aXZlRGVjb3JhdGlvbnModHlwZSlcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgdHlwZSBpcyAnYmFja2dyb3VuZCdcbiAgICAgICAgICBAY2xhc3NMaXN0LmFkZCgnYWJvdmUtZWRpdG9yLWNvbnRlbnQnKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQGNsYXNzTGlzdC5yZW1vdmUoJ2Fib3ZlLWVkaXRvci1jb250ZW50JylcblxuICAgICAgICBAZGVzdHJveU5hdGl2ZURlY29yYXRpb25zKClcbiAgICAgICAgQHVwZGF0ZU1hcmtlcnModHlwZSlcblxuICAgICAgQHByZXZpb3VzVHlwZSA9IHR5cGVcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLnN0eWxlcy5vbkRpZEFkZFN0eWxlRWxlbWVudCA9PlxuICAgICAgQGVkaXRvckNvbmZpZ0NoYW5nZWQoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3JFbGVtZW50Lm9uRGlkQXR0YWNoID0+IEBhdHRhY2goKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAZWRpdG9yRWxlbWVudC5vbkRpZERldGFjaCA9PiBAZGV0YWNoKClcblxuICBhdHRhY2g6IC0+XG4gICAgcmV0dXJuIGlmIEBwYXJlbnROb2RlP1xuICAgIHJldHVybiB1bmxlc3MgQGVkaXRvckVsZW1lbnQ/XG4gICAgQGdldEVkaXRvclJvb3QoKS5xdWVyeVNlbGVjdG9yKCcubGluZXMnKT8uYXBwZW5kQ2hpbGQodGhpcylcblxuICBkZXRhY2g6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAcGFyZW50Tm9kZT9cblxuICAgIEBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAZGV0YWNoKClcbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxuICAgIGlmIEBpc05hdGl2ZURlY29yYXRpb25UeXBlKClcbiAgICAgIEBkZXN0cm95TmF0aXZlRGVjb3JhdGlvbnMoKVxuICAgIGVsc2VcbiAgICAgIEByZWxlYXNlQWxsTWFya2VyVmlld3MoKVxuXG4gICAgQGNvbG9yQnVmZmVyID0gbnVsbFxuXG4gIHVwZGF0ZTogLT5cbiAgICBpZiBAdXNlTmF0aXZlRGVjb3JhdGlvbnMoKVxuICAgICAgaWYgQGlzR3V0dGVyVHlwZSgpXG4gICAgICAgIEB1cGRhdGVHdXR0ZXJEZWNvcmF0aW9ucygpXG4gICAgICBlbHNlXG4gICAgICAgIEB1cGRhdGVIaWdobGlnaHREZWNvcmF0aW9ucyhAcHJldmlvdXNUeXBlKVxuICAgIGVsc2VcbiAgICAgIEB1cGRhdGVNYXJrZXJzKClcblxuICB1cGRhdGVTY3JvbGw6IC0+XG4gICAgaWYgQGVkaXRvckVsZW1lbnQuaGFzVGlsZWRSZW5kZXJpbmcgYW5kIG5vdCBAdXNlTmF0aXZlRGVjb3JhdGlvbnMoKVxuICAgICAgQHN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IFwidHJhbnNsYXRlM2QoI3stQGVkaXRvclNjcm9sbExlZnR9cHgsICN7LUBlZGl0b3JTY3JvbGxUb3B9cHgsIDApXCJcblxuICBnZXRFZGl0b3JSb290OiAtPiBAZWRpdG9yRWxlbWVudC5zaGFkb3dSb290ID8gQGVkaXRvckVsZW1lbnRcblxuICBlZGl0b3JDb25maWdDaGFuZ2VkOiAtPlxuICAgIHJldHVybiBpZiBub3QgQHBhcmVudE5vZGU/IG9yIEB1c2VOYXRpdmVEZWNvcmF0aW9ucygpXG4gICAgQHVzZWRNYXJrZXJzLmZvckVhY2ggKG1hcmtlcikgPT5cbiAgICAgIGlmIG1hcmtlci5jb2xvck1hcmtlcj9cbiAgICAgICAgbWFya2VyLnJlbmRlcigpXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUud2FybiBcIkEgbWFya2VyIHZpZXcgd2FzIGZvdW5kIGluIHRoZSB1c2VkIGluc3RhbmNlIHBvb2wgd2hpbGUgaGF2aW5nIGEgbnVsbCBtb2RlbFwiLCBtYXJrZXJcbiAgICAgICAgQHJlbGVhc2VNYXJrZXJFbGVtZW50KG1hcmtlcilcblxuICAgIEB1cGRhdGVNYXJrZXJzKClcblxuICBpc0d1dHRlclR5cGU6ICh0eXBlPUBwcmV2aW91c1R5cGUpIC0+XG4gICAgdHlwZSBpbiBbJ2d1dHRlcicsICduYXRpdmUtZG90JywgJ25hdGl2ZS1zcXVhcmUtZG90J11cblxuICBpc0RvdFR5cGU6ICAodHlwZT1AcHJldmlvdXNUeXBlKSAtPlxuICAgIHR5cGUgaW4gWyduYXRpdmUtZG90JywgJ25hdGl2ZS1zcXVhcmUtZG90J11cblxuICB1c2VOYXRpdmVEZWNvcmF0aW9uczogLT5cbiAgICBAaXNOYXRpdmVEZWNvcmF0aW9uVHlwZShAcHJldmlvdXNUeXBlKVxuXG4gIGlzTmF0aXZlRGVjb3JhdGlvblR5cGU6ICh0eXBlKSAtPlxuICAgIENvbG9yTWFya2VyRWxlbWVudCA/PSByZXF1aXJlICcuL2NvbG9yLW1hcmtlci1lbGVtZW50J1xuXG4gICAgQ29sb3JNYXJrZXJFbGVtZW50LmlzTmF0aXZlRGVjb3JhdGlvblR5cGUodHlwZSlcblxuICBpbml0aWFsaXplTmF0aXZlRGVjb3JhdGlvbnM6ICh0eXBlKSAtPlxuICAgICAgQHJlbGVhc2VBbGxNYXJrZXJWaWV3cygpXG4gICAgICBAZGVzdHJveU5hdGl2ZURlY29yYXRpb25zKClcblxuICAgICAgaWYgQGlzR3V0dGVyVHlwZSh0eXBlKVxuICAgICAgICBAaW5pdGlhbGl6ZUd1dHRlcih0eXBlKVxuICAgICAgZWxzZVxuICAgICAgICBAdXBkYXRlSGlnaGxpZ2h0RGVjb3JhdGlvbnModHlwZSlcblxuICBkZXN0cm95TmF0aXZlRGVjb3JhdGlvbnM6IC0+XG4gICAgaWYgQGlzR3V0dGVyVHlwZSgpXG4gICAgICBAZGVzdHJveUd1dHRlcigpXG4gICAgZWxzZVxuICAgICAgQGRlc3Ryb3lIaWdobGlnaHREZWNvcmF0aW9ucygpXG5cbiAgIyMgICAjIyAgICAgIyMgIyMgICMjIyMjIyAgICMjICAgICAjIyAjIyAgICAgICAjIyAgIyMjIyMjICAgIyMgICAgICMjICMjIyMjIyMjXG4gICMjICAgIyMgICAgICMjICMjICMjICAgICMjICAjIyAgICAgIyMgIyMgICAgICAgIyMgIyMgICAgIyMgICMjICAgICAjIyAgICAjI1xuICAjIyAgICMjICAgICAjIyAjIyAjIyAgICAgICAgIyMgICAgICMjICMjICAgICAgICMjICMjICAgICAgICAjIyAgICAgIyMgICAgIyNcbiAgIyMgICAjIyMjIyMjIyMgIyMgIyMgICAjIyMjICMjIyMjIyMjIyAjIyAgICAgICAjIyAjIyAgICMjIyMgIyMjIyMjIyMjICAgICMjXG4gICMjICAgIyMgICAgICMjICMjICMjICAgICMjICAjIyAgICAgIyMgIyMgICAgICAgIyMgIyMgICAgIyMgICMjICAgICAjIyAgICAjI1xuICAjIyAgICMjICAgICAjIyAjIyAjIyAgICAjIyAgIyMgICAgICMjICMjICAgICAgICMjICMjICAgICMjICAjIyAgICAgIyMgICAgIyNcbiAgIyMgICAjIyAgICAgIyMgIyMgICMjIyMjIyAgICMjICAgICAjIyAjIyMjIyMjIyAjIyAgIyMjIyMjICAgIyMgICAgICMjICAgICMjXG5cbiAgdXBkYXRlSGlnaGxpZ2h0RGVjb3JhdGlvbnM6ICh0eXBlKSAtPlxuICAgIHJldHVybiBpZiBAZWRpdG9yLmlzRGVzdHJveWVkKClcblxuICAgIEBzdHlsZUJ5TWFya2VySWQgPz0ge31cbiAgICBAZGVjb3JhdGlvbkJ5TWFya2VySWQgPz0ge31cblxuICAgIG1hcmtlcnMgPSBAY29sb3JCdWZmZXIuZ2V0VmFsaWRDb2xvck1hcmtlcnMoKVxuXG4gICAgZm9yIG0gaW4gQGRpc3BsYXllZE1hcmtlcnMgd2hlbiBtIG5vdCBpbiBtYXJrZXJzXG4gICAgICBAZGVjb3JhdGlvbkJ5TWFya2VySWRbbS5pZF0/LmRlc3Ryb3koKVxuICAgICAgQHJlbW92ZUNoaWxkKEBzdHlsZUJ5TWFya2VySWRbbS5pZF0pXG4gICAgICBkZWxldGUgQHN0eWxlQnlNYXJrZXJJZFttLmlkXVxuICAgICAgZGVsZXRlIEBkZWNvcmF0aW9uQnlNYXJrZXJJZFttLmlkXVxuXG4gICAgbWFya2Vyc0J5Um93cyA9IHt9XG4gICAgbWF4Um93TGVuZ3RoID0gMFxuXG4gICAgZm9yIG0gaW4gbWFya2Vyc1xuICAgICAgaWYgbS5jb2xvcj8uaXNWYWxpZCgpIGFuZCBtIG5vdCBpbiBAZGlzcGxheWVkTWFya2Vyc1xuICAgICAgICB7Y2xhc3NOYW1lLCBzdHlsZX0gPSBAZ2V0SGlnaGxpZ2hEZWNvcmF0aW9uQ1NTKG0sIHR5cGUpXG4gICAgICAgIEBhcHBlbmRDaGlsZChzdHlsZSlcbiAgICAgICAgQHN0eWxlQnlNYXJrZXJJZFttLmlkXSA9IHN0eWxlXG4gICAgICAgIEBkZWNvcmF0aW9uQnlNYXJrZXJJZFttLmlkXSA9IEBlZGl0b3IuZGVjb3JhdGVNYXJrZXIobS5tYXJrZXIsIHtcbiAgICAgICAgICB0eXBlOiAnaGlnaGxpZ2h0J1xuICAgICAgICAgIGNsYXNzOiBcInBpZ21lbnRzLSN7dHlwZX0gI3tjbGFzc05hbWV9XCJcbiAgICAgICAgICBpbmNsdWRlTWFya2VyVGV4dDogdHlwZSBpcyAnaGlnaGxpZ2h0J1xuICAgICAgICB9KVxuXG4gICAgQGRpc3BsYXllZE1hcmtlcnMgPSBtYXJrZXJzXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXVwZGF0ZSdcblxuICBkZXN0cm95SGlnaGxpZ2h0RGVjb3JhdGlvbnM6IC0+XG4gICAgZm9yIGlkLCBkZWNvIG9mIEBkZWNvcmF0aW9uQnlNYXJrZXJJZFxuICAgICAgQHJlbW92ZUNoaWxkKEBzdHlsZUJ5TWFya2VySWRbaWRdKSBpZiBAc3R5bGVCeU1hcmtlcklkW2lkXT9cbiAgICAgIGRlY28uZGVzdHJveSgpXG5cbiAgICBkZWxldGUgQGRlY29yYXRpb25CeU1hcmtlcklkXG4gICAgZGVsZXRlIEBzdHlsZUJ5TWFya2VySWRcbiAgICBAZGlzcGxheWVkTWFya2VycyA9IFtdXG5cbiAgZ2V0SGlnaGxpZ2hEZWNvcmF0aW9uQ1NTOiAobWFya2VyLCB0eXBlKSAtPlxuICAgIGNsYXNzTmFtZSA9IFwicGlnbWVudHMtaGlnaGxpZ2h0LSN7bmV4dEhpZ2hsaWdodElkKyt9XCJcbiAgICBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcbiAgICBsID0gbWFya2VyLmNvbG9yLmx1bWFcblxuICAgIGlmIHR5cGUgaXMgJ25hdGl2ZS1iYWNrZ3JvdW5kJ1xuICAgICAgc3R5bGUuaW5uZXJIVE1MID0gXCJcIlwiXG4gICAgICAuI3tjbGFzc05hbWV9IC5yZWdpb24ge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAje21hcmtlci5jb2xvci50b0NTUygpfTtcbiAgICAgICAgY29sb3I6ICN7aWYgbCA+IDAuNDMgdGhlbiAnYmxhY2snIGVsc2UgJ3doaXRlJ307XG4gICAgICB9XG4gICAgICBcIlwiXCJcbiAgICBlbHNlIGlmIHR5cGUgaXMgJ25hdGl2ZS11bmRlcmxpbmUnXG4gICAgICBzdHlsZS5pbm5lckhUTUwgPSBcIlwiXCJcbiAgICAgIC4je2NsYXNzTmFtZX0gLnJlZ2lvbiB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICN7bWFya2VyLmNvbG9yLnRvQ1NTKCl9O1xuICAgICAgfVxuICAgICAgXCJcIlwiXG4gICAgZWxzZSBpZiB0eXBlIGlzICduYXRpdmUtb3V0bGluZSdcbiAgICAgIHN0eWxlLmlubmVySFRNTCA9IFwiXCJcIlxuICAgICAgLiN7Y2xhc3NOYW1lfSAucmVnaW9uIHtcbiAgICAgICAgYm9yZGVyLWNvbG9yOiAje21hcmtlci5jb2xvci50b0NTUygpfTtcbiAgICAgIH1cbiAgICAgIFwiXCJcIlxuXG4gICAge2NsYXNzTmFtZSwgc3R5bGV9XG5cbiAgIyMgICAgICMjIyMjIyAgICMjICAgICAjIyAjIyMjIyMjIyAjIyMjIyMjIyAjIyMjIyMjIyAjIyMjIyMjI1xuICAjIyAgICAjIyAgICAjIyAgIyMgICAgICMjICAgICMjICAgICAgICMjICAgICMjICAgICAgICMjICAgICAjI1xuICAjIyAgICAjIyAgICAgICAgIyMgICAgICMjICAgICMjICAgICAgICMjICAgICMjICAgICAgICMjICAgICAjI1xuICAjIyAgICAjIyAgICMjIyMgIyMgICAgICMjICAgICMjICAgICAgICMjICAgICMjIyMjIyAgICMjIyMjIyMjXG4gICMjICAgICMjICAgICMjICAjIyAgICAgIyMgICAgIyMgICAgICAgIyMgICAgIyMgICAgICAgIyMgICAjI1xuICAjIyAgICAjIyAgICAjIyAgIyMgICAgICMjICAgICMjICAgICAgICMjICAgICMjICAgICAgICMjICAgICMjXG4gICMjICAgICAjIyMjIyMgICAgIyMjIyMjIyAgICAgIyMgICAgICAgIyMgICAgIyMjIyMjIyMgIyMgICAgICMjXG5cbiAgaW5pdGlhbGl6ZUd1dHRlcjogKHR5cGUpIC0+XG4gICAgb3B0aW9ucyA9IG5hbWU6IFwicGlnbWVudHMtI3t0eXBlfVwiXG4gICAgb3B0aW9ucy5wcmlvcml0eSA9IDEwMDAgaWYgdHlwZSBpc250ICdndXR0ZXInXG5cbiAgICBAZ3V0dGVyID0gQGVkaXRvci5hZGRHdXR0ZXIob3B0aW9ucylcbiAgICBAZGlzcGxheWVkTWFya2VycyA9IFtdXG4gICAgQGRlY29yYXRpb25CeU1hcmtlcklkID89IHt9XG4gICAgZ3V0dGVyQ29udGFpbmVyID0gQGdldEVkaXRvclJvb3QoKS5xdWVyeVNlbGVjdG9yKCcuZ3V0dGVyLWNvbnRhaW5lcicpXG4gICAgQGd1dHRlclN1YnNjcmlwdGlvbiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAZ3V0dGVyU3Vic2NyaXB0aW9uLmFkZCBAc3Vic2NyaWJlVG8gZ3V0dGVyQ29udGFpbmVyLFxuICAgICAgbW91c2Vkb3duOiAoZSkgPT5cbiAgICAgICAgdGFyZ2V0RGVjb3JhdGlvbiA9IGUucGF0aFswXVxuXG4gICAgICAgIHVubGVzcyB0YXJnZXREZWNvcmF0aW9uLm1hdGNoZXMoJ3NwYW4nKVxuICAgICAgICAgIHRhcmdldERlY29yYXRpb24gPSB0YXJnZXREZWNvcmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKVxuXG4gICAgICAgIHJldHVybiB1bmxlc3MgdGFyZ2V0RGVjb3JhdGlvbj9cblxuICAgICAgICBtYXJrZXJJZCA9IHRhcmdldERlY29yYXRpb24uZGF0YXNldC5tYXJrZXJJZFxuICAgICAgICBjb2xvck1hcmtlciA9IEBkaXNwbGF5ZWRNYXJrZXJzLmZpbHRlcigobSkgLT4gbS5pZCBpcyBOdW1iZXIobWFya2VySWQpKVswXVxuXG4gICAgICAgIHJldHVybiB1bmxlc3MgY29sb3JNYXJrZXI/IGFuZCBAY29sb3JCdWZmZXI/XG5cbiAgICAgICAgQGNvbG9yQnVmZmVyLnNlbGVjdENvbG9yTWFya2VyQW5kT3BlblBpY2tlcihjb2xvck1hcmtlcilcblxuICAgIGlmIEBpc0RvdFR5cGUodHlwZSlcbiAgICAgIEBndXR0ZXJTdWJzY3JpcHRpb24uYWRkIEBlZGl0b3Iub25EaWRDaGFuZ2UgKGNoYW5nZXMpID0+XG4gICAgICAgIGlmIEFycmF5LmlzQXJyYXkgY2hhbmdlc1xuICAgICAgICAgIGNoYW5nZXM/LmZvckVhY2ggKGNoYW5nZSkgPT5cbiAgICAgICAgICAgIEB1cGRhdGVEb3REZWNvcmF0aW9uc09mZnNldHMoY2hhbmdlLnN0YXJ0LnJvdywgY2hhbmdlLm5ld0V4dGVudC5yb3cpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAdXBkYXRlRG90RGVjb3JhdGlvbnNPZmZzZXRzKGNoYW5nZXMuc3RhcnQucm93LCBjaGFuZ2VzLm5ld0V4dGVudC5yb3cpXG5cbiAgICBAdXBkYXRlR3V0dGVyRGVjb3JhdGlvbnModHlwZSlcblxuICBkZXN0cm95R3V0dGVyOiAtPlxuICAgIEBndXR0ZXIuZGVzdHJveSgpXG4gICAgQGd1dHRlclN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICBAZGlzcGxheWVkTWFya2VycyA9IFtdXG4gICAgZGVjb3JhdGlvbi5kZXN0cm95KCkgZm9yIGlkLCBkZWNvcmF0aW9uIG9mIEBkZWNvcmF0aW9uQnlNYXJrZXJJZFxuICAgIGRlbGV0ZSBAZGVjb3JhdGlvbkJ5TWFya2VySWRcbiAgICBkZWxldGUgQGd1dHRlclN1YnNjcmlwdGlvblxuXG4gIHVwZGF0ZUd1dHRlckRlY29yYXRpb25zOiAodHlwZT1AcHJldmlvdXNUeXBlKSAtPlxuICAgIHJldHVybiBpZiBAZWRpdG9yLmlzRGVzdHJveWVkKClcblxuICAgIG1hcmtlcnMgPSBAY29sb3JCdWZmZXIuZ2V0VmFsaWRDb2xvck1hcmtlcnMoKVxuXG4gICAgZm9yIG0gaW4gQGRpc3BsYXllZE1hcmtlcnMgd2hlbiBtIG5vdCBpbiBtYXJrZXJzXG4gICAgICBAZGVjb3JhdGlvbkJ5TWFya2VySWRbbS5pZF0/LmRlc3Ryb3koKVxuICAgICAgZGVsZXRlIEBkZWNvcmF0aW9uQnlNYXJrZXJJZFttLmlkXVxuXG4gICAgbWFya2Vyc0J5Um93cyA9IHt9XG4gICAgbWF4Um93TGVuZ3RoID0gMFxuXG4gICAgZm9yIG0gaW4gbWFya2Vyc1xuICAgICAgaWYgbS5jb2xvcj8uaXNWYWxpZCgpIGFuZCBtIG5vdCBpbiBAZGlzcGxheWVkTWFya2Vyc1xuICAgICAgICBAZGVjb3JhdGlvbkJ5TWFya2VySWRbbS5pZF0gPSBAZ3V0dGVyLmRlY29yYXRlTWFya2VyKG0ubWFya2VyLCB7XG4gICAgICAgICAgdHlwZTogJ2d1dHRlcidcbiAgICAgICAgICBjbGFzczogJ3BpZ21lbnRzLWd1dHRlci1tYXJrZXInXG4gICAgICAgICAgaXRlbTogQGdldEd1dHRlckRlY29yYXRpb25JdGVtKG0pXG4gICAgICAgIH0pXG5cbiAgICAgIGRlY28gPSBAZGVjb3JhdGlvbkJ5TWFya2VySWRbbS5pZF1cbiAgICAgIHJvdyA9IG0ubWFya2VyLmdldFN0YXJ0U2NyZWVuUG9zaXRpb24oKS5yb3dcbiAgICAgIG1hcmtlcnNCeVJvd3Nbcm93XSA/PSAwXG5cbiAgICAgIHJvd0xlbmd0aCA9IDBcblxuICAgICAgaWYgdHlwZSBpc250ICdndXR0ZXInXG4gICAgICAgIHJvd0xlbmd0aCA9IEBlZGl0b3JFbGVtZW50LnBpeGVsUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbihbcm93LCBJbmZpbml0eV0pLmxlZnRcblxuICAgICAgZGVjb1dpZHRoID0gMTRcblxuICAgICAgZGVjby5wcm9wZXJ0aWVzLml0ZW0uc3R5bGUubGVmdCA9IFwiI3tyb3dMZW5ndGggKyBtYXJrZXJzQnlSb3dzW3Jvd10gKiBkZWNvV2lkdGh9cHhcIlxuXG4gICAgICBtYXJrZXJzQnlSb3dzW3Jvd10rK1xuICAgICAgbWF4Um93TGVuZ3RoID0gTWF0aC5tYXgobWF4Um93TGVuZ3RoLCBtYXJrZXJzQnlSb3dzW3Jvd10pXG5cbiAgICBpZiB0eXBlIGlzICdndXR0ZXInXG4gICAgICBhdG9tLnZpZXdzLmdldFZpZXcoQGd1dHRlcikuc3R5bGUubWluV2lkdGggPSBcIiN7bWF4Um93TGVuZ3RoICogZGVjb1dpZHRofXB4XCJcbiAgICBlbHNlXG4gICAgICBhdG9tLnZpZXdzLmdldFZpZXcoQGd1dHRlcikuc3R5bGUud2lkdGggPSBcIjBweFwiXG5cbiAgICBAZGlzcGxheWVkTWFya2VycyA9IG1hcmtlcnNcbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtdXBkYXRlJ1xuXG4gIHVwZGF0ZURvdERlY29yYXRpb25zT2Zmc2V0czogKHJvd1N0YXJ0LCByb3dFbmQpIC0+XG4gICAgbWFya2Vyc0J5Um93cyA9IHt9XG5cbiAgICBmb3Igcm93IGluIFtyb3dTdGFydC4ucm93RW5kXVxuICAgICAgZm9yIG0gaW4gQGRpc3BsYXllZE1hcmtlcnNcbiAgICAgICAgZGVjbyA9IEBkZWNvcmF0aW9uQnlNYXJrZXJJZFttLmlkXVxuICAgICAgICBjb250aW51ZSB1bmxlc3MgbS5tYXJrZXI/XG4gICAgICAgIG1hcmtlclJvdyA9IG0ubWFya2VyLmdldFN0YXJ0U2NyZWVuUG9zaXRpb24oKS5yb3dcbiAgICAgICAgY29udGludWUgdW5sZXNzIHJvdyBpcyBtYXJrZXJSb3dcblxuICAgICAgICBtYXJrZXJzQnlSb3dzW3Jvd10gPz0gMFxuXG4gICAgICAgIHJvd0xlbmd0aCA9IEBlZGl0b3JFbGVtZW50LnBpeGVsUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbihbcm93LCBJbmZpbml0eV0pLmxlZnRcblxuICAgICAgICBkZWNvV2lkdGggPSAxNFxuXG4gICAgICAgIGRlY28ucHJvcGVydGllcy5pdGVtLnN0eWxlLmxlZnQgPSBcIiN7cm93TGVuZ3RoICsgbWFya2Vyc0J5Um93c1tyb3ddICogZGVjb1dpZHRofXB4XCJcbiAgICAgICAgbWFya2Vyc0J5Um93c1tyb3ddKytcblxuICBnZXRHdXR0ZXJEZWNvcmF0aW9uSXRlbTogKG1hcmtlcikgLT5cbiAgICBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGRpdi5pbm5lckhUTUwgPSBcIlwiXCJcbiAgICA8c3BhbiBzdHlsZT0nYmFja2dyb3VuZC1jb2xvcjogI3ttYXJrZXIuY29sb3IudG9DU1MoKX07JyBkYXRhLW1hcmtlci1pZD0nI3ttYXJrZXIuaWR9Jz48L3NwYW4+XG4gICAgXCJcIlwiXG4gICAgZGl2XG5cbiAgIyMgICAgIyMgICAgICMjICAgICMjIyAgICAjIyMjIyMjIyAgIyMgICAgIyMgIyMjIyMjIyMgIyMjIyMjIyMgICAjIyMjIyNcbiAgIyMgICAgIyMjICAgIyMjICAgIyMgIyMgICAjIyAgICAgIyMgIyMgICAjIyAgIyMgICAgICAgIyMgICAgICMjICMjICAgICMjXG4gICMjICAgICMjIyMgIyMjIyAgIyMgICAjIyAgIyMgICAgICMjICMjICAjIyAgICMjICAgICAgICMjICAgICAjIyAjI1xuICAjIyAgICAjIyAjIyMgIyMgIyMgICAgICMjICMjIyMjIyMjICAjIyMjIyAgICAjIyMjIyMgICAjIyMjIyMjIyAgICMjIyMjI1xuICAjIyAgICAjIyAgICAgIyMgIyMjIyMjIyMjICMjICAgIyMgICAjIyAgIyMgICAjIyAgICAgICAjIyAgICMjICAgICAgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAjIyAgIyMgICAjIyAgIyMgICAgICAgIyMgICAgIyMgICMjICAgICMjXG4gICMjICAgICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICMjICMjIyMjIyMjICMjICAgICAjIyAgIyMjIyMjXG5cbiAgcmVxdWVzdE1hcmtlclVwZGF0ZTogKG1hcmtlcnMpIC0+XG4gICAgaWYgQGZyYW1lUmVxdWVzdGVkXG4gICAgICBAZGlydHlNYXJrZXJzID0gQGRpcnR5TWFya2Vycy5jb25jYXQobWFya2VycylcbiAgICAgIHJldHVyblxuICAgIGVsc2VcbiAgICAgIEBkaXJ0eU1hcmtlcnMgPSBtYXJrZXJzLnNsaWNlKClcbiAgICAgIEBmcmFtZVJlcXVlc3RlZCA9IHRydWVcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PlxuICAgICAgZGlydHlNYXJrZXJzID0gW11cbiAgICAgIGRpcnR5TWFya2Vycy5wdXNoKG0pIGZvciBtIGluIEBkaXJ0eU1hcmtlcnMgd2hlbiBtIG5vdCBpbiBkaXJ0eU1hcmtlcnNcblxuICAgICAgZGVsZXRlIEBmcmFtZVJlcXVlc3RlZFxuICAgICAgZGVsZXRlIEBkaXJ0eU1hcmtlcnNcblxuICAgICAgcmV0dXJuIHVubGVzcyBAY29sb3JCdWZmZXI/XG5cbiAgICAgIGRpcnR5TWFya2Vycy5mb3JFYWNoIChtYXJrZXIpIC0+IG1hcmtlci5yZW5kZXIoKVxuXG4gIHVwZGF0ZU1hcmtlcnM6ICh0eXBlPUBwcmV2aW91c1R5cGUpIC0+XG4gICAgcmV0dXJuIGlmIEBlZGl0b3IuaXNEZXN0cm95ZWQoKVxuXG4gICAgbWFya2VycyA9IEBjb2xvckJ1ZmZlci5maW5kVmFsaWRDb2xvck1hcmtlcnMoe1xuICAgICAgaW50ZXJzZWN0c1NjcmVlblJvd1JhbmdlOiBAZWRpdG9yRWxlbWVudC5nZXRWaXNpYmxlUm93UmFuZ2U/KCkgPyBAZWRpdG9yLmdldFZpc2libGVSb3dSYW5nZT8oKVxuICAgIH0pXG5cbiAgICBmb3IgbSBpbiBAZGlzcGxheWVkTWFya2VycyB3aGVuIG0gbm90IGluIG1hcmtlcnNcbiAgICAgIEByZWxlYXNlTWFya2VyVmlldyhtKVxuXG4gICAgZm9yIG0gaW4gbWFya2VycyB3aGVuIG0uY29sb3I/LmlzVmFsaWQoKSBhbmQgbSBub3QgaW4gQGRpc3BsYXllZE1hcmtlcnNcbiAgICAgIEByZXF1ZXN0TWFya2VyVmlldyhtKVxuXG4gICAgQGRpc3BsYXllZE1hcmtlcnMgPSBtYXJrZXJzXG5cbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtdXBkYXRlJ1xuXG4gIHJlcXVlc3RNYXJrZXJWaWV3OiAobWFya2VyKSAtPlxuICAgIGlmIEB1bnVzZWRNYXJrZXJzLmxlbmd0aFxuICAgICAgdmlldyA9IEB1bnVzZWRNYXJrZXJzLnNoaWZ0KClcbiAgICBlbHNlXG4gICAgICBDb2xvck1hcmtlckVsZW1lbnQgPz0gcmVxdWlyZSAnLi9jb2xvci1tYXJrZXItZWxlbWVudCdcblxuICAgICAgdmlldyA9IG5ldyBDb2xvck1hcmtlckVsZW1lbnRcbiAgICAgIHZpZXcuc2V0Q29udGFpbmVyKHRoaXMpXG4gICAgICB2aWV3Lm9uRGlkUmVsZWFzZSAoe21hcmtlcn0pID0+XG4gICAgICAgIEBkaXNwbGF5ZWRNYXJrZXJzLnNwbGljZShAZGlzcGxheWVkTWFya2Vycy5pbmRleE9mKG1hcmtlciksIDEpXG4gICAgICAgIEByZWxlYXNlTWFya2VyVmlldyhtYXJrZXIpXG4gICAgICBAc2hhZG93Um9vdC5hcHBlbmRDaGlsZCB2aWV3XG5cbiAgICB2aWV3LnNldE1vZGVsKG1hcmtlcilcblxuICAgIEBoaWRlTWFya2VySWZJblNlbGVjdGlvbk9yRm9sZChtYXJrZXIsIHZpZXcpXG4gICAgQHVzZWRNYXJrZXJzLnB1c2godmlldylcbiAgICBAdmlld3NCeU1hcmtlcnMuc2V0KG1hcmtlciwgdmlldylcbiAgICB2aWV3XG5cbiAgcmVsZWFzZU1hcmtlclZpZXc6IChtYXJrZXJPclZpZXcpIC0+XG4gICAgbWFya2VyID0gbWFya2VyT3JWaWV3XG4gICAgdmlldyA9IEB2aWV3c0J5TWFya2Vycy5nZXQobWFya2VyT3JWaWV3KVxuXG4gICAgaWYgdmlldz9cbiAgICAgIEB2aWV3c0J5TWFya2Vycy5kZWxldGUobWFya2VyKSBpZiBtYXJrZXI/XG4gICAgICBAcmVsZWFzZU1hcmtlckVsZW1lbnQodmlldylcblxuICByZWxlYXNlTWFya2VyRWxlbWVudDogKHZpZXcpIC0+XG4gICAgQHVzZWRNYXJrZXJzLnNwbGljZShAdXNlZE1hcmtlcnMuaW5kZXhPZih2aWV3KSwgMSlcbiAgICB2aWV3LnJlbGVhc2UoZmFsc2UpIHVubGVzcyB2aWV3LmlzUmVsZWFzZWQoKVxuICAgIEB1bnVzZWRNYXJrZXJzLnB1c2godmlldylcblxuICByZWxlYXNlQWxsTWFya2VyVmlld3M6IC0+XG4gICAgdmlldy5kZXN0cm95KCkgZm9yIHZpZXcgaW4gQHVzZWRNYXJrZXJzXG4gICAgdmlldy5kZXN0cm95KCkgZm9yIHZpZXcgaW4gQHVudXNlZE1hcmtlcnNcblxuICAgIEB1c2VkTWFya2VycyA9IFtdXG4gICAgQHVudXNlZE1hcmtlcnMgPSBbXVxuXG4gICAgQXJyYXk6OmZvckVhY2guY2FsbCBAc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yQWxsKCdwaWdtZW50cy1jb2xvci1tYXJrZXInKSwgKGVsKSAtPiBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKVxuXG4gICMjICAgICAjIyMjIyMgICMjIyMjIyMjICMjICAgICAgICMjIyMjIyMjICAjIyMjIyMgICMjIyMjIyMjXG4gICMjICAgICMjICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAgICMjICAgICMjICAgICMjXG4gICMjICAgICMjICAgICAgICMjICAgICAgICMjICAgICAgICMjICAgICAgICMjICAgICAgICAgICMjXG4gICMjICAgICAjIyMjIyMgICMjIyMjIyAgICMjICAgICAgICMjIyMjIyAgICMjICAgICAgICAgICMjXG4gICMjICAgICAgICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAgICMjICAgICAgICAgICMjXG4gICMjICAgICMjICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAgICMjICAgICMjICAgICMjXG4gICMjICAgICAjIyMjIyMgICMjIyMjIyMjICMjIyMjIyMjICMjIyMjIyMjICAjIyMjIyMgICAgICMjXG5cbiAgcmVxdWVzdFNlbGVjdGlvblVwZGF0ZTogLT5cbiAgICByZXR1cm4gaWYgQHVwZGF0ZVJlcXVlc3RlZFxuXG4gICAgQHVwZGF0ZVJlcXVlc3RlZCA9IHRydWVcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT5cbiAgICAgIEB1cGRhdGVSZXF1ZXN0ZWQgPSBmYWxzZVxuICAgICAgcmV0dXJuIGlmIEBlZGl0b3IuZ2V0QnVmZmVyKCkuaXNEZXN0cm95ZWQoKVxuICAgICAgQHVwZGF0ZVNlbGVjdGlvbnMoKVxuXG4gIHVwZGF0ZVNlbGVjdGlvbnM6IC0+XG4gICAgcmV0dXJuIGlmIEBlZGl0b3IuaXNEZXN0cm95ZWQoKVxuICAgIGlmIEB1c2VOYXRpdmVEZWNvcmF0aW9ucygpXG4gICAgICBmb3IgbWFya2VyIGluIEBkaXNwbGF5ZWRNYXJrZXJzXG4gICAgICAgIGRlY29yYXRpb24gPSBAZGVjb3JhdGlvbkJ5TWFya2VySWRbbWFya2VyLmlkXVxuXG4gICAgICAgIEBoaWRlRGVjb3JhdGlvbklmSW5TZWxlY3Rpb24obWFya2VyLCBkZWNvcmF0aW9uKSBpZiBkZWNvcmF0aW9uP1xuICAgIGVsc2VcbiAgICAgIGZvciBtYXJrZXIgaW4gQGRpc3BsYXllZE1hcmtlcnNcbiAgICAgICAgdmlldyA9IEB2aWV3c0J5TWFya2Vycy5nZXQobWFya2VyKVxuICAgICAgICBpZiB2aWV3P1xuICAgICAgICAgIHZpZXcuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICAgICAgICB2aWV3LmNsYXNzTGlzdC5yZW1vdmUoJ2luLWZvbGQnKVxuICAgICAgICAgIEBoaWRlTWFya2VySWZJblNlbGVjdGlvbk9yRm9sZChtYXJrZXIsIHZpZXcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjb25zb2xlLndhcm4gXCJBIGNvbG9yIG1hcmtlciB3YXMgZm91bmQgaW4gdGhlIGRpc3BsYXllZCBtYXJrZXJzIGFycmF5IHdpdGhvdXQgYW4gYXNzb2NpYXRlZCB2aWV3XCIsIG1hcmtlclxuXG4gIGhpZGVEZWNvcmF0aW9uSWZJblNlbGVjdGlvbjogKG1hcmtlciwgZGVjb3JhdGlvbikgLT5cbiAgICBzZWxlY3Rpb25zID0gQGVkaXRvci5nZXRTZWxlY3Rpb25zKClcblxuICAgIHByb3BzID0gZGVjb3JhdGlvbi5nZXRQcm9wZXJ0aWVzKClcbiAgICBjbGFzc2VzID0gcHJvcHMuY2xhc3Muc3BsaXQoL1xccysvZylcblxuICAgIGZvciBzZWxlY3Rpb24gaW4gc2VsZWN0aW9uc1xuICAgICAgcmFuZ2UgPSBzZWxlY3Rpb24uZ2V0U2NyZWVuUmFuZ2UoKVxuICAgICAgbWFya2VyUmFuZ2UgPSBtYXJrZXIuZ2V0U2NyZWVuUmFuZ2UoKVxuXG4gICAgICBjb250aW51ZSB1bmxlc3MgbWFya2VyUmFuZ2U/IGFuZCByYW5nZT9cbiAgICAgIGlmIG1hcmtlclJhbmdlLmludGVyc2VjdHNXaXRoKHJhbmdlKVxuICAgICAgICBjbGFzc2VzWzBdICs9ICctaW4tc2VsZWN0aW9uJyB1bmxlc3MgY2xhc3Nlc1swXS5tYXRjaCgvLWluLXNlbGVjdGlvbiQvKT9cbiAgICAgICAgcHJvcHMuY2xhc3MgPSBjbGFzc2VzLmpvaW4oJyAnKVxuICAgICAgICBkZWNvcmF0aW9uLnNldFByb3BlcnRpZXMocHJvcHMpXG4gICAgICAgIHJldHVyblxuXG4gICAgY2xhc3NlcyA9IGNsYXNzZXMubWFwIChjbHMpIC0+IGNscy5yZXBsYWNlKCctaW4tc2VsZWN0aW9uJywgJycpXG4gICAgcHJvcHMuY2xhc3MgPSBjbGFzc2VzLmpvaW4oJyAnKVxuICAgIGRlY29yYXRpb24uc2V0UHJvcGVydGllcyhwcm9wcylcblxuICBoaWRlTWFya2VySWZJblNlbGVjdGlvbk9yRm9sZDogKG1hcmtlciwgdmlldykgLT5cbiAgICBzZWxlY3Rpb25zID0gQGVkaXRvci5nZXRTZWxlY3Rpb25zKClcblxuICAgIGZvciBzZWxlY3Rpb24gaW4gc2VsZWN0aW9uc1xuICAgICAgcmFuZ2UgPSBzZWxlY3Rpb24uZ2V0U2NyZWVuUmFuZ2UoKVxuICAgICAgbWFya2VyUmFuZ2UgPSBtYXJrZXIuZ2V0U2NyZWVuUmFuZ2UoKVxuXG4gICAgICBjb250aW51ZSB1bmxlc3MgbWFya2VyUmFuZ2U/IGFuZCByYW5nZT9cblxuICAgICAgdmlldy5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKSBpZiBtYXJrZXJSYW5nZS5pbnRlcnNlY3RzV2l0aChyYW5nZSlcbiAgICAgIHZpZXcuY2xhc3NMaXN0LmFkZCgnaW4tZm9sZCcpIGlmICBAZWRpdG9yLmlzRm9sZGVkQXRCdWZmZXJSb3cobWFya2VyLmdldEJ1ZmZlclJhbmdlKCkuc3RhcnQucm93KVxuXG4gICMjICAgICAjIyMjIyMgICAjIyMjIyMjICAjIyAgICAjIyAjIyMjIyMjIyAjIyMjIyMjIyAjIyAgICAgIyMgIyMjIyMjIyNcbiAgIyMgICAgIyMgICAgIyMgIyMgICAgICMjICMjIyAgICMjICAgICMjICAgICMjICAgICAgICAjIyAgICMjICAgICAjI1xuICAjIyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMjIyAgIyMgICAgIyMgICAgIyMgICAgICAgICAjIyAjIyAgICAgICMjXG4gICMjICAgICMjICAgICAgICMjICAgICAjIyAjIyAjIyAjIyAgICAjIyAgICAjIyMjIyMgICAgICAjIyMgICAgICAgIyNcbiAgIyMgICAgIyMgICAgICAgIyMgICAgICMjICMjICAjIyMjICAgICMjICAgICMjICAgICAgICAgIyMgIyMgICAgICAjI1xuICAjIyAgICAjIyAgICAjIyAjIyAgICAgIyMgIyMgICAjIyMgICAgIyMgICAgIyMgICAgICAgICMjICAgIyMgICAgICMjXG4gICMjICAgICAjIyMjIyMgICAjIyMjIyMjICAjIyAgICAjIyAgICAjIyAgICAjIyMjIyMjIyAjIyAgICAgIyMgICAgIyNcbiAgIyNcbiAgIyMgICAgIyMgICAgICMjICMjIyMjIyMjICMjICAgICMjICMjICAgICAjI1xuICAjIyAgICAjIyMgICAjIyMgIyMgICAgICAgIyMjICAgIyMgIyMgICAgICMjXG4gICMjICAgICMjIyMgIyMjIyAjIyAgICAgICAjIyMjICAjIyAjIyAgICAgIyNcbiAgIyMgICAgIyMgIyMjICMjICMjIyMjIyAgICMjICMjICMjICMjICAgICAjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICMjIyMgIyMgICAgICMjXG4gICMjICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICMjIyAjIyAgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICMjIyMjIyMjICMjICAgICMjICAjIyMjIyMjXG5cbiAgY29sb3JNYXJrZXJGb3JNb3VzZUV2ZW50OiAoZXZlbnQpIC0+XG4gICAgcG9zaXRpb24gPSBAc2NyZWVuUG9zaXRpb25Gb3JNb3VzZUV2ZW50KGV2ZW50KVxuXG4gICAgcmV0dXJuIHVubGVzcyBwb3NpdGlvbj9cblxuICAgIGJ1ZmZlclBvc2l0aW9uID0gQGNvbG9yQnVmZmVyLmVkaXRvci5idWZmZXJQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKHBvc2l0aW9uKVxuXG4gICAgQGNvbG9yQnVmZmVyLmdldENvbG9yTWFya2VyQXRCdWZmZXJQb3NpdGlvbihidWZmZXJQb3NpdGlvbilcblxuICBzY3JlZW5Qb3NpdGlvbkZvck1vdXNlRXZlbnQ6IChldmVudCkgLT5cbiAgICBwaXhlbFBvc2l0aW9uID0gQHBpeGVsUG9zaXRpb25Gb3JNb3VzZUV2ZW50KGV2ZW50KVxuXG4gICAgcmV0dXJuIHVubGVzcyBwaXhlbFBvc2l0aW9uP1xuXG4gICAgaWYgQGVkaXRvckVsZW1lbnQuc2NyZWVuUG9zaXRpb25Gb3JQaXhlbFBvc2l0aW9uP1xuICAgICAgQGVkaXRvckVsZW1lbnQuc2NyZWVuUG9zaXRpb25Gb3JQaXhlbFBvc2l0aW9uKHBpeGVsUG9zaXRpb24pXG4gICAgZWxzZVxuICAgICAgQGVkaXRvci5zY3JlZW5Qb3NpdGlvbkZvclBpeGVsUG9zaXRpb24ocGl4ZWxQb3NpdGlvbilcblxuICBwaXhlbFBvc2l0aW9uRm9yTW91c2VFdmVudDogKGV2ZW50KSAtPlxuICAgIHtjbGllbnRYLCBjbGllbnRZfSA9IGV2ZW50XG5cbiAgICBzY3JvbGxUYXJnZXQgPSBpZiBAZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxUb3A/XG4gICAgICBAZWRpdG9yRWxlbWVudFxuICAgIGVsc2VcbiAgICAgIEBlZGl0b3JcblxuICAgIHJvb3RFbGVtZW50ID0gQGdldEVkaXRvclJvb3QoKVxuXG4gICAgcmV0dXJuIHVubGVzcyByb290RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubGluZXMnKT9cblxuICAgIHt0b3AsIGxlZnR9ID0gcm9vdEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmxpbmVzJykuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICB0b3AgPSBjbGllbnRZIC0gdG9wICsgc2Nyb2xsVGFyZ2V0LmdldFNjcm9sbFRvcCgpXG4gICAgbGVmdCA9IGNsaWVudFggLSBsZWZ0ICsgc2Nyb2xsVGFyZ2V0LmdldFNjcm9sbExlZnQoKVxuICAgIHt0b3AsIGxlZnR9XG5cbm1vZHVsZS5leHBvcnRzID1cbkNvbG9yQnVmZmVyRWxlbWVudCA9XG5yZWdpc3Rlck9yVXBkYXRlRWxlbWVudCAncGlnbWVudHMtbWFya2VycycsIENvbG9yQnVmZmVyRWxlbWVudC5wcm90b3R5cGVcbiJdfQ==
