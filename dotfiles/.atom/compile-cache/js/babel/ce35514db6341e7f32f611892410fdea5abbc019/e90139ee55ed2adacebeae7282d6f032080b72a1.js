Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _decoratorsInclude = require('./decorators/include');

var _decoratorsInclude2 = _interopRequireDefault(_decoratorsInclude);

var _mixinsDecorationManagement = require('./mixins/decoration-management');

var _mixinsDecorationManagement2 = _interopRequireDefault(_mixinsDecorationManagement);

'use babel';

var Emitter = undefined,
    CompositeDisposable = undefined,
    LegacyAdapter = undefined,
    StableAdapter = undefined;

var nextModelId = 1;

/**
 * The Minimap class is the underlying model of a <MinimapElement>.
 * Most manipulations of the minimap is done through the model.
 *
 * Any Minimap instance is tied to a `TextEditor`.
 * Their lifecycle follow the one of their target `TextEditor`, so they are
 * destroyed whenever their `TextEditor` is destroyed.
 */

var Minimap = (function () {
  /**
   * Creates a new Minimap instance for the given `TextEditor`.
   *
   * @param  {Object} options an object with the new Minimap properties
   * @param  {TextEditor} options.textEditor the target text editor for
   *                                         the minimap
   * @param  {boolean} [options.standAlone] whether this minimap is in
   *                                        stand-alone mode or not
   * @param  {number} [options.width] the minimap width in pixels
   * @param  {number} [options.height] the minimap height in pixels
   * @throws {Error} Cannot create a minimap without an editor
   */

  function Minimap() {
    var _this = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, _Minimap);

    if (!options.textEditor) {
      throw new Error('Cannot create a minimap without an editor');
    }

    if (!Emitter) {
      var _require = require('atom');

      Emitter = _require.Emitter;
      CompositeDisposable = _require.CompositeDisposable;
    }

    /**
     * The Minimap's text editor.
     *
     * @type {TextEditor}
     * @access private
     */
    this.textEditor = options.textEditor;
    /**
     * The stand-alone state of the current Minimap.
     *
     * @type {boolean}
     * @access private
     */
    this.standAlone = options.standAlone;
    /**
     * The width of the current Minimap.
     *
     * @type {number}
     * @access private
     */
    this.width = options.width;
    /**
     * The height of the current Minimap.
     *
     * @type {number}
     * @access private
     */
    this.height = options.height;
    /**
     * The id of the current Minimap.
     *
     * @type {Number}
     * @access private
     */
    this.id = nextModelId++;
    /**
     * The events emitter of the current Minimap.
     *
     * @type {Emitter}
     * @access private
     */
    this.emitter = new Emitter();
    /**
     * The Minimap's subscriptions.
     *
     * @type {CompositeDisposable}
     * @access private
     */
    this.subscriptions = new CompositeDisposable();
    /**
     * The adapter object leverage the access to several properties from
     * the `TextEditor`/`TextEditorElement` to support the different APIs
     * between different version of Atom.
     *
     * @type {Object}
     * @access private
     */
    this.adapter = null;
    /**
     * The char height of the current Minimap, will be `undefined` unless
     * `setCharWidth` is called.
     *
     * @type {number}
     * @access private
     */
    this.charHeight = null;
    /**
     * The char height from the package's configuration. Will be overriden
     * by the instance value.
     *
     * @type {number}
     * @access private
     */
    this.configCharHeight = null;
    /**
     * The char width of the current Minimap, will be `undefined` unless
     * `setCharWidth` is called.
     *
     * @type {number}
     * @access private
     */
    this.charWidth = null;
    /**
     * The char width from the package's configuration. Will be overriden
     * by the instance value.
     *
     * @type {number}
     * @access private
     */
    this.configCharWidth = null;
    /**
     * The interline of the current Minimap, will be `undefined` unless
     * `setCharWidth` is called.
     *
     * @type {number}
     * @access private
     */
    this.interline = null;
    /**
     * The interline from the package's configuration. Will be overriden
     * by the instance value.
     *
     * @type {number}
     * @access private
     */
    this.configInterline = null;
    /**
     * The devicePixelRatioRounding of the current Minimap, will be
     * `undefined` unless `setDevicePixelRatioRounding` is called.
     *
     * @type {boolean}
     * @access private
     */
    this.devicePixelRatioRounding = null;
    /**
     * The devicePixelRatioRounding from the package's configuration.
     * Will be overriden by the instance value.
     *
     * @type {boolean}
     * @access private
     */
    this.configDevicePixelRatioRounding = null;
    /**
    /**
     * A boolean value to store whether this Minimap have been destroyed or not.
     *
     * @type {boolean}
     * @access private
     */
    this.destroyed = false;
    /**
     * A boolean value to store whether the `scrollPastEnd` setting is enabled
     * or not.
     *
     * @type {boolean}
     * @access private
     */
    this.scrollPastEnd = false;

    this.initializeDecorations();

    if (atom.views.getView(this.textEditor).getScrollTop != null) {
      if (!StableAdapter) {
        StableAdapter = require('./adapters/stable-adapter');
      }
      this.adapter = new StableAdapter(this.textEditor);
    } else {
      if (!LegacyAdapter) {
        LegacyAdapter = require('./adapters/legacy-adapter');
      }
      this.adapter = new LegacyAdapter(this.textEditor);
    }

    /**
     * When in stand-alone or independent scrolling mode, this value can be used
     * instead of the computed scroll.
     *
     * @type {number}
     * @access private
     */
    this.scrollTop = 0;

    var subs = this.subscriptions;
    var configSubscription = this.subscribeToConfig();

    subs.add(configSubscription);

    subs.add(this.textEditor.onDidChangeGrammar(function () {
      subs.remove(configSubscription);
      configSubscription.dispose();

      configSubscription = _this.subscribeToConfig();
      subs.add(configSubscription);
    }));

    subs.add(this.adapter.onDidChangeScrollTop(function () {
      if (!_this.standAlone && !_this.ignoreTextEditorScroll && !_this.inChangeScrollTop) {
        _this.inChangeScrollTop = true;
        _this.updateScrollTop();
        _this.emitter.emit('did-change-scroll-top', _this);
        _this.inChangeScrollTop = false;
      }

      if (_this.ignoreTextEditorScroll) {
        _this.ignoreTextEditorScroll = false;
      }
    }));
    subs.add(this.adapter.onDidChangeScrollLeft(function () {
      if (!_this.standAlone) {
        _this.emitter.emit('did-change-scroll-left', _this);
      }
    }));

    subs.add(this.textEditor.onDidChange(function (changes) {
      _this.emitChanges(changes);
    }));
    subs.add(this.textEditor.onDidDestroy(function () {
      _this.destroy();
    }));

    /*
    FIXME Some changes occuring during the tokenization produces
    ranges that deceive the canvas rendering by making some
    lines at the end of the buffer intact while they are in fact not,
    resulting in extra lines appearing at the end of the minimap.
    Forcing a whole repaint to fix that bug is suboptimal but works.
    */
    var tokenizedBuffer = this.textEditor.tokenizedBuffer ? this.textEditor.tokenizedBuffer : this.textEditor.displayBuffer.tokenizedBuffer;

    subs.add(tokenizedBuffer.onDidTokenize(function () {
      _this.emitter.emit('did-change-config');
    }));
  }

  /**
   * Destroys the model.
   */

  _createClass(Minimap, [{
    key: 'destroy',
    value: function destroy() {
      if (this.destroyed) {
        return;
      }

      this.removeAllDecorations();
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.textEditor = null;
      this.emitter.emit('did-destroy');
      this.emitter.dispose();
      this.destroyed = true;
    }

    /**
     * Returns `true` when this `Minimap` has benn destroyed.
     *
     * @return {boolean} whether this Minimap has been destroyed or not
     */
  }, {
    key: 'isDestroyed',
    value: function isDestroyed() {
      return this.destroyed;
    }

    /**
     * Registers an event listener to the `did-change` event.
     *
     * @param  {function(event:Object):void} callback a function to call when the
     *                                                event is triggered.
     *                                                the callback will be called
     *                                                with an event object with
     *                                                the following properties:
     * - start: The change's start row number
     * - end: The change's end row number
     * - screenDelta: the delta in buffer rows between the versions before and
     *   after the change
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChange',
    value: function onDidChange(callback) {
      return this.emitter.on('did-change', callback);
    }

    /**
     * Registers an event listener to the `did-change-config` event.
     *
     * @param  {function():void} callback a function to call when the event
     *                                    is triggered.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeConfig',
    value: function onDidChangeConfig(callback) {
      return this.emitter.on('did-change-config', callback);
    }

    /**
     * Registers an event listener to the `did-change-scroll-top` event.
     *
     * The event is dispatched when the text editor `scrollTop` value have been
     * changed or when the minimap scroll top have been changed in stand-alone
     * mode.
     *
     * @param  {function(minimap:Minimap):void} callback a function to call when
     *                                                   the event is triggered.
     *                                                   The current Minimap is
     *                                                   passed as argument to
     *                                                   the callback.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeScrollTop',
    value: function onDidChangeScrollTop(callback) {
      return this.emitter.on('did-change-scroll-top', callback);
    }

    /**
     * Registers an event listener to the `did-change-scroll-left` event.
     *
     * @param  {function(minimap:Minimap):void} callback a function to call when
     *                                                   the event is triggered.
     *                                                   The current Minimap is
     *                                                   passed as argument to
     *                                                   the callback.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeScrollLeft',
    value: function onDidChangeScrollLeft(callback) {
      return this.emitter.on('did-change-scroll-left', callback);
    }

    /**
     * Registers an event listener to the `did-change-stand-alone` event.
     *
     * This event is dispatched when the stand-alone of the current Minimap
     * is either enabled or disabled.
     *
     * @param  {function(minimap:Minimap):void} callback a function to call when
     *                                                   the event is triggered.
     *                                                   The current Minimap is
     *                                                   passed as argument to
     *                                                   the callback.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeStandAlone',
    value: function onDidChangeStandAlone(callback) {
      return this.emitter.on('did-change-stand-alone', callback);
    }

    /**
     * Registers an event listener to the `did-destroy` event.
     *
     * This event is dispatched when this Minimap have been destroyed. It can
     * occurs either because the {@link destroy} method have been called on the
     * Minimap or because the target text editor have been destroyed.
     *
     * @param  {function():void} callback a function to call when the event
     *                                    is triggered.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }

    /**
     * Registers to the config changes for the current editor scope.
     *
     * @return {Disposable} the disposable to dispose all the registered events
     * @access private
     */
  }, {
    key: 'subscribeToConfig',
    value: function subscribeToConfig() {
      var _this2 = this;

      var subs = new CompositeDisposable();
      var opts = { scope: this.textEditor.getRootScopeDescriptor() };

      subs.add(atom.config.observe('editor.scrollPastEnd', opts, function (scrollPastEnd) {
        _this2.scrollPastEnd = scrollPastEnd;
        _this2.adapter.scrollPastEnd = _this2.scrollPastEnd;
        _this2.emitter.emit('did-change-config');
      }));
      subs.add(atom.config.observe('minimap.charHeight', opts, function (configCharHeight) {
        _this2.configCharHeight = configCharHeight;
        _this2.updateScrollTop();
        _this2.emitter.emit('did-change-config');
      }));
      subs.add(atom.config.observe('minimap.charWidth', opts, function (configCharWidth) {
        _this2.configCharWidth = configCharWidth;
        _this2.updateScrollTop();
        _this2.emitter.emit('did-change-config');
      }));
      subs.add(atom.config.observe('minimap.interline', opts, function (configInterline) {
        _this2.configInterline = configInterline;
        _this2.updateScrollTop();
        _this2.emitter.emit('did-change-config');
      }));
      subs.add(atom.config.observe('minimap.independentMinimapScroll', opts, function (independentMinimapScroll) {
        _this2.independentMinimapScroll = independentMinimapScroll;
        _this2.updateScrollTop();
      }));
      subs.add(atom.config.observe('minimap.scrollSensitivity', opts, function (scrollSensitivity) {
        _this2.scrollSensitivity = scrollSensitivity;
      }));
      // cdprr is shorthand for configDevicePixelRatioRounding
      subs.add(atom.config.observe('minimap.devicePixelRatioRounding', opts, function (cdprr) {
        _this2.configDevicePixelRatioRounding = cdprr;
        _this2.updateScrollTop();
        _this2.emitter.emit('did-change-config');
      }));

      return subs;
    }

    /**
     * Returns `true` when the current Minimap is a stand-alone minimap.
     *
     * @return {boolean} whether this Minimap is in stand-alone mode or not.
     */
  }, {
    key: 'isStandAlone',
    value: function isStandAlone() {
      return this.standAlone;
    }

    /**
     * Sets the stand-alone mode for this minimap.
     *
     * @param {boolean} standAlone the new state of the stand-alone mode for this
     *                             Minimap
     * @emits {did-change-stand-alone} if the stand-alone mode have been toggled
     *        on or off by the call
     */
  }, {
    key: 'setStandAlone',
    value: function setStandAlone(standAlone) {
      if (standAlone !== this.standAlone) {
        this.standAlone = standAlone;
        this.emitter.emit('did-change-stand-alone', this);
      }
    }

    /**
     * Returns the `TextEditor` that this minimap represents.
     *
     * @return {TextEditor} this Minimap's text editor
     */
  }, {
    key: 'getTextEditor',
    value: function getTextEditor() {
      return this.textEditor;
    }

    /**
     * Returns the height of the `TextEditor` at the Minimap scale.
     *
     * @return {number} the scaled height of the text editor
     */
  }, {
    key: 'getTextEditorScaledHeight',
    value: function getTextEditorScaledHeight() {
      return this.adapter.getHeight() * this.getVerticalScaleFactor();
    }

    /**
     * Returns the `TextEditor` scroll top value at the Minimap scale.
     *
     * @return {number} the scaled scroll top of the text editor
     */
  }, {
    key: 'getTextEditorScaledScrollTop',
    value: function getTextEditorScaledScrollTop() {
      return this.adapter.getScrollTop() * this.getVerticalScaleFactor();
    }

    /**
     * Returns the `TextEditor` scroll left value at the Minimap scale.
     *
     * @return {number} the scaled scroll left of the text editor
     */
  }, {
    key: 'getTextEditorScaledScrollLeft',
    value: function getTextEditorScaledScrollLeft() {
      return this.adapter.getScrollLeft() * this.getHorizontalScaleFactor();
    }

    /**
     * Returns the `TextEditor` maximum scroll top value.
     *
     * When the `scrollPastEnd` setting is enabled, the method compensate the
     * extra scroll by removing the same height as added by the editor from the
     * final value.
     *
     * @return {number} the maximum scroll top of the text editor
     */
  }, {
    key: 'getTextEditorMaxScrollTop',
    value: function getTextEditorMaxScrollTop() {
      return this.adapter.getMaxScrollTop();
    }

    /**
     * Returns the `TextEditor` scroll top value.
     *
     * @return {number} the scroll top of the text editor
     */
  }, {
    key: 'getTextEditorScrollTop',
    value: function getTextEditorScrollTop() {
      return this.adapter.getScrollTop();
    }

    /**
     * Sets the scroll top of the `TextEditor`.
     *
     * @param {number} scrollTop the new scroll top value
     */
  }, {
    key: 'setTextEditorScrollTop',
    value: function setTextEditorScrollTop(scrollTop) {
      var ignoreTextEditorScroll = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      this.ignoreTextEditorScroll = ignoreTextEditorScroll;
      this.adapter.setScrollTop(scrollTop);
    }

    /**
     * Returns the `TextEditor` scroll left value.
     *
     * @return {number} the scroll left of the text editor
     */
  }, {
    key: 'getTextEditorScrollLeft',
    value: function getTextEditorScrollLeft() {
      return this.adapter.getScrollLeft();
    }

    /**
     * Returns the height of the `TextEditor`.
     *
     * @return {number} the height of the text editor
     */
  }, {
    key: 'getTextEditorHeight',
    value: function getTextEditorHeight() {
      return this.adapter.getHeight();
    }

    /**
     * Returns the `TextEditor` scroll as a value normalized between `0` and `1`.
     *
     * When the `scrollPastEnd` setting is enabled the value may exceed `1` as the
     * maximum scroll value used to compute this ratio compensate for the extra
     * height in the editor. **Use {@link getCapedTextEditorScrollRatio} when
     * you need a value that is strictly between `0` and `1`.**
     *
     * @return {number} the scroll ratio of the text editor
     */
  }, {
    key: 'getTextEditorScrollRatio',
    value: function getTextEditorScrollRatio() {
      return this.adapter.getScrollTop() / (this.getTextEditorMaxScrollTop() || 1);
    }

    /**
     * Returns the `TextEditor` scroll as a value normalized between `0` and `1`.
     *
     * The returned value will always be strictly between `0` and `1`.
     *
     * @return {number} the scroll ratio of the text editor strictly between
     *                  0 and 1
     */
  }, {
    key: 'getCapedTextEditorScrollRatio',
    value: function getCapedTextEditorScrollRatio() {
      return Math.min(1, this.getTextEditorScrollRatio());
    }

    /**
     * Returns the height of the whole minimap in pixels based on the `minimap`
     * settings.
     *
     * @return {number} the height of the minimap
     */
  }, {
    key: 'getHeight',
    value: function getHeight() {
      return this.textEditor.getScreenLineCount() * this.getLineHeight();
    }

    /**
     * Returns the width of the whole minimap in pixels based on the `minimap`
     * settings.
     *
     * @return {number} the width of the minimap
     */
  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.textEditor.getMaxScreenLineLength() * this.getCharWidth();
    }

    /**
     * Returns the height the Minimap content will take on screen.
     *
     * When the Minimap height is greater than the `TextEditor` height, the
     * `TextEditor` height is returned instead.
     *
     * @return {number} the visible height of the Minimap
     */
  }, {
    key: 'getVisibleHeight',
    value: function getVisibleHeight() {
      return Math.min(this.getScreenHeight(), this.getHeight());
    }

    /**
     * Returns the height the minimap should take once displayed, it's either
     * the height of the `TextEditor` or the provided `height` when in stand-alone
     * mode.
     *
     * @return {number} the total height of the Minimap
     */
  }, {
    key: 'getScreenHeight',
    value: function getScreenHeight() {
      if (this.isStandAlone()) {
        if (this.height != null) {
          return this.height;
        } else {
          return this.getHeight();
        }
      } else {
        return this.adapter.getHeight();
      }
    }

    /**
     * Returns the width the whole Minimap will take on screen.
     *
     * @return {number} the width of the Minimap when displayed
     */
  }, {
    key: 'getVisibleWidth',
    value: function getVisibleWidth() {
      return Math.min(this.getScreenWidth(), this.getWidth());
    }

    /**
     * Returns the width the Minimap should take once displayed, it's either the
     * width of the Minimap content or the provided `width` when in standAlone
     * mode.
     *
     * @return {number} the Minimap screen width
     */
  }, {
    key: 'getScreenWidth',
    value: function getScreenWidth() {
      if (this.isStandAlone() && this.width != null) {
        return this.width;
      } else {
        return this.getWidth();
      }
    }

    /**
     * Sets the preferred height and width when in stand-alone mode.
     *
     * This method is called by the <MinimapElement> for this Minimap so that
     * the model is kept in sync with the view.
     *
     * @param {number} height the new height of the Minimap
     * @param {number} width the new width of the Minimap
     */
  }, {
    key: 'setScreenHeightAndWidth',
    value: function setScreenHeightAndWidth(height, width) {
      if (this.width !== width || this.height !== height) {
        this.height = height;
        this.width = width;
        this.updateScrollTop();
      }
    }

    /**
     * Returns the vertical scaling factor when converting coordinates from the
     * `TextEditor` to the Minimap.
     *
     * @return {number} the Minimap vertical scaling factor
     */
  }, {
    key: 'getVerticalScaleFactor',
    value: function getVerticalScaleFactor() {
      return this.getLineHeight() / this.textEditor.getLineHeightInPixels();
    }

    /**
     * Returns the horizontal scaling factor when converting coordinates from the
     * `TextEditor` to the Minimap.
     *
     * @return {number} the Minimap horizontal scaling factor
     */
  }, {
    key: 'getHorizontalScaleFactor',
    value: function getHorizontalScaleFactor() {
      return this.getCharWidth() / this.textEditor.getDefaultCharWidth();
    }

    /**
     * Returns the height of a line in the Minimap in pixels.
     *
     * @return {number} a line's height in the Minimap
     */
  }, {
    key: 'getLineHeight',
    value: function getLineHeight() {
      return this.getCharHeight() + this.getInterline();
    }

    /**
     * Returns the width of a character in the Minimap in pixels.
     *
     * @return {number} a character's width in the Minimap
     */
  }, {
    key: 'getCharWidth',
    value: function getCharWidth() {
      if (this.charWidth != null) {
        return this.charWidth;
      } else {
        return this.configCharWidth;
      }
    }

    /**
     * Sets the char width for this Minimap. This value will override the
     * value from the config for this instance only. A `did-change-config`
     * event is dispatched.
     *
     * @param {number} charWidth the new width of a char in the Minimap
     * @emits {did-change-config} when the value is changed
     */
  }, {
    key: 'setCharWidth',
    value: function setCharWidth(charWidth) {
      this.charWidth = Math.floor(charWidth);
      this.emitter.emit('did-change-config');
    }

    /**
     * Returns the height of a character in the Minimap in pixels.
     *
     * @return {number} a character's height in the Minimap
     */
  }, {
    key: 'getCharHeight',
    value: function getCharHeight() {
      if (this.charHeight != null) {
        return this.charHeight;
      } else {
        return this.configCharHeight;
      }
    }

    /**
     * Sets the char height for this Minimap. This value will override the
     * value from the config for this instance only. A `did-change-config`
     * event is dispatched.
     *
     * @param {number} charHeight the new height of a char in the Minimap
     * @emits {did-change-config} when the value is changed
     */
  }, {
    key: 'setCharHeight',
    value: function setCharHeight(charHeight) {
      this.charHeight = Math.floor(charHeight);
      this.emitter.emit('did-change-config');
    }

    /**
     * Returns the height of an interline in the Minimap in pixels.
     *
     * @return {number} the interline's height in the Minimap
     */
  }, {
    key: 'getInterline',
    value: function getInterline() {
      if (this.interline != null) {
        return this.interline;
      } else {
        return this.configInterline;
      }
    }

    /**
     * Sets the interline height for this Minimap. This value will override the
     * value from the config for this instance only. A `did-change-config`
     * event is dispatched.
     *
     * @param {number} interline the new height of an interline in the Minimap
     * @emits {did-change-config} when the value is changed
     */
  }, {
    key: 'setInterline',
    value: function setInterline(interline) {
      this.interline = Math.floor(interline);
      this.emitter.emit('did-change-config');
    }

    /**
     * Returns the status of devicePixelRatioRounding in the Minimap.
     *
     * @return {boolean} the devicePixelRatioRounding status in the Minimap
     */
  }, {
    key: 'getDevicePixelRatioRounding',
    value: function getDevicePixelRatioRounding() {
      if (this.devicePixelRatioRounding != null) {
        return this.devicePixelRatioRounding;
      } else {
        return this.configDevicePixelRatioRounding;
      }
    }

    /**
     * Sets the devicePixelRatioRounding status for this Minimap.
     * This value will override the value from the config for this instance only.
     * A `did-change-config` event is dispatched.
     *
     * @param {boolean} devicePixelRatioRounding the new status of
     *                                           devicePixelRatioRounding
     *                                           in the Minimap
     * @emits {did-change-config} when the value is changed
     */
  }, {
    key: 'setDevicePixelRatioRounding',
    value: function setDevicePixelRatioRounding(devicePixelRatioRounding) {
      this.devicePixelRatioRounding = devicePixelRatioRounding;
      this.emitter.emit('did-change-config');
    }

    /**
     * Returns the devicePixelRatio in the Minimap in pixels.
     *
     * @return {number} the devicePixelRatio in the Minimap
     */
  }, {
    key: 'getDevicePixelRatio',
    value: function getDevicePixelRatio() {
      return this.getDevicePixelRatioRounding() ? Math.floor(devicePixelRatio) : devicePixelRatio;
    }

    /**
     * Returns the index of the first visible row in the Minimap.
     *
     * @return {number} the index of the first visible row
     */
  }, {
    key: 'getFirstVisibleScreenRow',
    value: function getFirstVisibleScreenRow() {
      return Math.floor(this.getScrollTop() / this.getLineHeight());
    }

    /**
     * Returns the index of the last visible row in the Minimap.
     *
     * @return {number} the index of the last visible row
     */
  }, {
    key: 'getLastVisibleScreenRow',
    value: function getLastVisibleScreenRow() {
      return Math.ceil((this.getScrollTop() + this.getScreenHeight()) / this.getLineHeight());
    }

    /**
     * Returns true when the `independentMinimapScroll` setting have been enabled.
     *
     * @return {boolean} whether the minimap can scroll independently
     */
  }, {
    key: 'scrollIndependentlyOnMouseWheel',
    value: function scrollIndependentlyOnMouseWheel() {
      return this.independentMinimapScroll;
    }

    /**
     * Returns the current scroll of the Minimap.
     *
     * The Minimap can scroll only when its height is greater that the height
     * of its `TextEditor`.
     *
     * @return {number} the scroll top of the Minimap
     */
  }, {
    key: 'getScrollTop',
    value: function getScrollTop() {
      return this.standAlone || this.independentMinimapScroll ? this.scrollTop : this.getScrollTopFromEditor();
    }

    /**
     * Sets the minimap scroll top value when in stand-alone mode.
     *
     * @param {number} scrollTop the new scroll top for the Minimap
     * @emits {did-change-scroll-top} if the Minimap's stand-alone mode is enabled
     */
  }, {
    key: 'setScrollTop',
    value: function setScrollTop(scrollTop) {
      this.scrollTop = Math.max(0, Math.min(this.getMaxScrollTop(), scrollTop));

      if (this.standAlone || this.independentMinimapScroll) {
        this.emitter.emit('did-change-scroll-top', this);
      }
    }

    /**
     * Returns the minimap scroll as a ration between 0 and 1.
     *
     * @return {number} the minimap scroll ratio
     */
  }, {
    key: 'getScrollRatio',
    value: function getScrollRatio() {
      return this.getScrollTop() / this.getMaxScrollTop();
    }

    /**
     * Updates the scroll top value with the one computed from the text editor
     * when the minimap is in the independent scrolling mode.
     *
     * @access private
     */
  }, {
    key: 'updateScrollTop',
    value: function updateScrollTop() {
      if (this.independentMinimapScroll) {
        this.setScrollTop(this.getScrollTopFromEditor());
        this.emitter.emit('did-change-scroll-top', this);
      }
    }

    /**
     * Returns the scroll top as computed from the text editor scroll top.
     *
     * @return {number} the computed scroll top value
     */
  }, {
    key: 'getScrollTopFromEditor',
    value: function getScrollTopFromEditor() {
      return Math.abs(this.getCapedTextEditorScrollRatio() * this.getMaxScrollTop());
    }

    /**
     * Returns the maximum scroll value of the Minimap.
     *
     * @return {number} the maximum scroll top for the Minimap
     */
  }, {
    key: 'getMaxScrollTop',
    value: function getMaxScrollTop() {
      return Math.max(0, this.getHeight() - this.getScreenHeight());
    }

    /**
     * Returns `true` when the Minimap can scroll.
     *
     * @return {boolean} whether this Minimap can scroll or not
     */
  }, {
    key: 'canScroll',
    value: function canScroll() {
      return this.getMaxScrollTop() > 0;
    }

    /**
     * Updates the minimap scroll top value using a mouse event when the
     * independent scrolling mode is enabled
     *
     * @param  {MouseEvent} event the mouse wheel event
     * @access private
     */
  }, {
    key: 'onMouseWheel',
    value: function onMouseWheel(event) {
      if (!this.canScroll()) {
        return;
      }

      var wheelDeltaY = event.wheelDeltaY;

      var previousScrollTop = this.getScrollTop();
      var updatedScrollTop = previousScrollTop - Math.round(wheelDeltaY * this.scrollSensitivity);

      event.preventDefault();
      this.setScrollTop(updatedScrollTop);
    }

    /**
     * Delegates to `TextEditor#getMarker`.
     *
     * @access private
     */
  }, {
    key: 'getMarker',
    value: function getMarker(id) {
      return this.textEditor.getMarker(id);
    }

    /**
     * Delegates to `TextEditor#findMarkers`.
     *
     * @access private
     */
  }, {
    key: 'findMarkers',
    value: function findMarkers(o) {
      try {
        return this.textEditor.findMarkers(o);
      } catch (error) {
        return [];
      }
    }

    /**
     * Delegates to `TextEditor#markBufferRange`.
     *
     * @access private
     */
  }, {
    key: 'markBufferRange',
    value: function markBufferRange(range) {
      return this.textEditor.markBufferRange(range);
    }

    /**
     * Emits a change events with the passed-in changes as data.
     *
     * @param  {Object} changes a change to dispatch
     * @access private
     */
  }, {
    key: 'emitChanges',
    value: function emitChanges(changes) {
      this.emitter.emit('did-change', changes);
    }

    /**
     * Enables the cache at the adapter level to avoid consecutive access to the
     * text editor API during a render phase.
     *
     * @access private
     */
  }, {
    key: 'enableCache',
    value: function enableCache() {
      this.adapter.enableCache();
    }

    /**
     * Disable the adapter cache.
     *
     * @access private
     */
  }, {
    key: 'clearCache',
    value: function clearCache() {
      this.adapter.clearCache();
    }
  }, {
    key: 'editorDestroyed',
    value: function editorDestroyed() {
      this.adapter.editorDestroyed();
    }
  }]);

  var _Minimap = Minimap;
  Minimap = (0, _decoratorsInclude2['default'])(_mixinsDecorationManagement2['default'])(Minimap) || Minimap;
  return Minimap;
})();

exports['default'] = Minimap;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21pbmltYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztpQ0FJb0Isc0JBQXNCOzs7OzBDQUNULGdDQUFnQzs7OztBQUxqRSxXQUFXLENBQUE7O0FBRVgsSUFBSSxPQUFPLFlBQUE7SUFBRSxtQkFBbUIsWUFBQTtJQUFFLGFBQWEsWUFBQTtJQUFFLGFBQWEsWUFBQSxDQUFBOztBQUs5RCxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUE7Ozs7Ozs7Ozs7O0lBV0UsT0FBTzs7Ozs7Ozs7Ozs7Ozs7QUFhZCxXQWJPLE9BQU8sR0FhQzs7O1FBQWQsT0FBTyx5REFBRyxFQUFFOzs7O0FBQ3ZCLFFBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO0FBQ3ZCLFlBQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQTtLQUM3RDs7QUFFRCxRQUFJLENBQUMsT0FBTyxFQUFFO3FCQUNzQixPQUFPLENBQUMsTUFBTSxDQUFDOztBQUEvQyxhQUFPLFlBQVAsT0FBTztBQUFFLHlCQUFtQixZQUFuQixtQkFBbUI7S0FDL0I7Ozs7Ozs7O0FBUUQsUUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFBOzs7Ozs7O0FBT3BDLFFBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQTs7Ozs7OztBQU9wQyxRQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUE7Ozs7Ozs7QUFPMUIsUUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFBOzs7Ozs7O0FBTzVCLFFBQUksQ0FBQyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUE7Ozs7Ozs7QUFPdkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFBOzs7Ozs7O0FBTzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcs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LEtBQUssRUFBRTtBQUNkLGVBQU8sRUFBRSxDQUFBO09BQ1Y7S0FDRjs7Ozs7Ozs7O1dBT2UseUJBQUMsS0FBSyxFQUFFO0FBQUUsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUFFOzs7Ozs7Ozs7O1dBUTdELHFCQUFDLE9BQU8sRUFBRTtBQUFFLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQTtLQUFFOzs7Ozs7Ozs7O1dBUXRELHVCQUFHO0FBQUUsVUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQTtLQUFFOzs7Ozs7Ozs7V0FPbEMsc0JBQUc7QUFBRSxVQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFBO0tBQUU7OztXQUUzQiwyQkFBRztBQUFFLFVBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUE7S0FBRTs7O2lCQXQ2QmxDLE9BQU87QUFBUCxTQUFPLEdBRDNCLDRFQUE2QixDQUNULE9BQU8sS0FBUCxPQUFPO1NBQVAsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWluaW1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmxldCBFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlLCBMZWdhY3lBZGFwdGVyLCBTdGFibGVBZGFwdGVyXG5cbmltcG9ydCBpbmNsdWRlIGZyb20gJy4vZGVjb3JhdG9ycy9pbmNsdWRlJ1xuaW1wb3J0IERlY29yYXRpb25NYW5hZ2VtZW50IGZyb20gJy4vbWl4aW5zL2RlY29yYXRpb24tbWFuYWdlbWVudCdcblxubGV0IG5leHRNb2RlbElkID0gMVxuXG4vKipcbiAqIFRoZSBNaW5pbWFwIGNsYXNzIGlzIHRoZSB1bmRlcmx5aW5nIG1vZGVsIG9mIGEgPE1pbmltYXBFbGVtZW50Pi5cbiAqIE1vc3QgbWFuaXB1bGF0aW9ucyBvZiB0aGUgbWluaW1hcCBpcyBkb25lIHRocm91Z2ggdGhlIG1vZGVsLlxuICpcbiAqIEFueSBNaW5pbWFwIGluc3RhbmNlIGlzIHRpZWQgdG8gYSBgVGV4dEVkaXRvcmAuXG4gKiBUaGVpciBsaWZlY3ljbGUgZm9sbG93IHRoZSBvbmUgb2YgdGhlaXIgdGFyZ2V0IGBUZXh0RWRpdG9yYCwgc28gdGhleSBhcmVcbiAqIGRlc3Ryb3llZCB3aGVuZXZlciB0aGVpciBgVGV4dEVkaXRvcmAgaXMgZGVzdHJveWVkLlxuICovXG5AaW5jbHVkZShEZWNvcmF0aW9uTWFuYWdlbWVudClcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pbmltYXAge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBNaW5pbWFwIGluc3RhbmNlIGZvciB0aGUgZ2l2ZW4gYFRleHRFZGl0b3JgLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMgYW4gb2JqZWN0IHdpdGggdGhlIG5ldyBNaW5pbWFwIHByb3BlcnRpZXNcbiAgICogQHBhcmFtICB7VGV4dEVkaXRvcn0gb3B0aW9ucy50ZXh0RWRpdG9yIHRoZSB0YXJnZXQgdGV4dCBlZGl0b3IgZm9yXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgbWluaW1hcFxuICAgKiBAcGFyYW0gIHtib29sZWFufSBbb3B0aW9ucy5zdGFuZEFsb25lXSB3aGV0aGVyIHRoaXMgbWluaW1hcCBpcyBpblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFuZC1hbG9uZSBtb2RlIG9yIG5vdFxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IFtvcHRpb25zLndpZHRoXSB0aGUgbWluaW1hcCB3aWR0aCBpbiBwaXhlbHNcbiAgICogQHBhcmFtICB7bnVtYmVyfSBbb3B0aW9ucy5oZWlnaHRdIHRoZSBtaW5pbWFwIGhlaWdodCBpbiBwaXhlbHNcbiAgICogQHRocm93cyB7RXJyb3J9IENhbm5vdCBjcmVhdGUgYSBtaW5pbWFwIHdpdGhvdXQgYW4gZWRpdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvciAob3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKCFvcHRpb25zLnRleHRFZGl0b3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBhIG1pbmltYXAgd2l0aG91dCBhbiBlZGl0b3InKVxuICAgIH1cblxuICAgIGlmICghRW1pdHRlcikge1xuICAgICAgKHtFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUoJ2F0b20nKSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgTWluaW1hcCdzIHRleHQgZWRpdG9yLlxuICAgICAqXG4gICAgICogQHR5cGUge1RleHRFZGl0b3J9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy50ZXh0RWRpdG9yID0gb3B0aW9ucy50ZXh0RWRpdG9yXG4gICAgLyoqXG4gICAgICogVGhlIHN0YW5kLWFsb25lIHN0YXRlIG9mIHRoZSBjdXJyZW50IE1pbmltYXAuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnN0YW5kQWxvbmUgPSBvcHRpb25zLnN0YW5kQWxvbmVcbiAgICAvKipcbiAgICAgKiBUaGUgd2lkdGggb2YgdGhlIGN1cnJlbnQgTWluaW1hcC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy53aWR0aCA9IG9wdGlvbnMud2lkdGhcbiAgICAvKipcbiAgICAgKiBUaGUgaGVpZ2h0IG9mIHRoZSBjdXJyZW50IE1pbmltYXAuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHRcbiAgICAvKipcbiAgICAgKiBUaGUgaWQgb2YgdGhlIGN1cnJlbnQgTWluaW1hcC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5pZCA9IG5leHRNb2RlbElkKytcbiAgICAvKipcbiAgICAgKiBUaGUgZXZlbnRzIGVtaXR0ZXIgb2YgdGhlIGN1cnJlbnQgTWluaW1hcC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtFbWl0dGVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICAvKipcbiAgICAgKiBUaGUgTWluaW1hcCdzIHN1YnNjcmlwdGlvbnMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Q29tcG9zaXRlRGlzcG9zYWJsZX1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgLyoqXG4gICAgICogVGhlIGFkYXB0ZXIgb2JqZWN0IGxldmVyYWdlIHRoZSBhY2Nlc3MgdG8gc2V2ZXJhbCBwcm9wZXJ0aWVzIGZyb21cbiAgICAgKiB0aGUgYFRleHRFZGl0b3JgL2BUZXh0RWRpdG9yRWxlbWVudGAgdG8gc3VwcG9ydCB0aGUgZGlmZmVyZW50IEFQSXNcbiAgICAgKiBiZXR3ZWVuIGRpZmZlcmVudCB2ZXJzaW9uIG9mIEF0b20uXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuYWRhcHRlciA9IG51bGxcbiAgICAvKipcbiAgICAgKiBUaGUgY2hhciBoZWlnaHQgb2YgdGhlIGN1cnJlbnQgTWluaW1hcCwgd2lsbCBiZSBgdW5kZWZpbmVkYCB1bmxlc3NcbiAgICAgKiBgc2V0Q2hhcldpZHRoYCBpcyBjYWxsZWQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuY2hhckhlaWdodCA9IG51bGxcbiAgICAvKipcbiAgICAgKiBUaGUgY2hhciBoZWlnaHQgZnJvbSB0aGUgcGFja2FnZSdzIGNvbmZpZ3VyYXRpb24uIFdpbGwgYmUgb3ZlcnJpZGVuXG4gICAgICogYnkgdGhlIGluc3RhbmNlIHZhbHVlLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNvbmZpZ0NoYXJIZWlnaHQgPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGNoYXIgd2lkdGggb2YgdGhlIGN1cnJlbnQgTWluaW1hcCwgd2lsbCBiZSBgdW5kZWZpbmVkYCB1bmxlc3NcbiAgICAgKiBgc2V0Q2hhcldpZHRoYCBpcyBjYWxsZWQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuY2hhcldpZHRoID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBjaGFyIHdpZHRoIGZyb20gdGhlIHBhY2thZ2UncyBjb25maWd1cmF0aW9uLiBXaWxsIGJlIG92ZXJyaWRlblxuICAgICAqIGJ5IHRoZSBpbnN0YW5jZSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5jb25maWdDaGFyV2lkdGggPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGludGVybGluZSBvZiB0aGUgY3VycmVudCBNaW5pbWFwLCB3aWxsIGJlIGB1bmRlZmluZWRgIHVubGVzc1xuICAgICAqIGBzZXRDaGFyV2lkdGhgIGlzIGNhbGxlZC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5pbnRlcmxpbmUgPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGludGVybGluZSBmcm9tIHRoZSBwYWNrYWdlJ3MgY29uZmlndXJhdGlvbi4gV2lsbCBiZSBvdmVycmlkZW5cbiAgICAgKiBieSB0aGUgaW5zdGFuY2UgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuY29uZmlnSW50ZXJsaW5lID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBkZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgb2YgdGhlIGN1cnJlbnQgTWluaW1hcCwgd2lsbCBiZVxuICAgICAqIGB1bmRlZmluZWRgIHVubGVzcyBgc2V0RGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nYCBpcyBjYWxsZWQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmRldmljZVBpeGVsUmF0aW9Sb3VuZGluZyA9IG51bGxcbiAgICAvKipcbiAgICAgKiBUaGUgZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nIGZyb20gdGhlIHBhY2thZ2UncyBjb25maWd1cmF0aW9uLlxuICAgICAqIFdpbGwgYmUgb3ZlcnJpZGVuIGJ5IHRoZSBpbnN0YW5jZSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuY29uZmlnRGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nID0gbnVsbFxuICAgIC8qKlxuICAgIC8qKlxuICAgICAqIEEgYm9vbGVhbiB2YWx1ZSB0byBzdG9yZSB3aGV0aGVyIHRoaXMgTWluaW1hcCBoYXZlIGJlZW4gZGVzdHJveWVkIG9yIG5vdC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZGVzdHJveWVkID0gZmFsc2VcbiAgICAvKipcbiAgICAgKiBBIGJvb2xlYW4gdmFsdWUgdG8gc3RvcmUgd2hldGhlciB0aGUgYHNjcm9sbFBhc3RFbmRgIHNldHRpbmcgaXMgZW5hYmxlZFxuICAgICAqIG9yIG5vdC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuc2Nyb2xsUGFzdEVuZCA9IGZhbHNlXG5cbiAgICB0aGlzLmluaXRpYWxpemVEZWNvcmF0aW9ucygpXG5cbiAgICBpZiAoYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMudGV4dEVkaXRvcikuZ2V0U2Nyb2xsVG9wICE9IG51bGwpIHtcbiAgICAgIGlmICghU3RhYmxlQWRhcHRlcikge1xuICAgICAgICBTdGFibGVBZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy9zdGFibGUtYWRhcHRlcicpXG4gICAgICB9XG4gICAgICB0aGlzLmFkYXB0ZXIgPSBuZXcgU3RhYmxlQWRhcHRlcih0aGlzLnRleHRFZGl0b3IpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghTGVnYWN5QWRhcHRlcikge1xuICAgICAgICBMZWdhY3lBZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy9sZWdhY3ktYWRhcHRlcicpXG4gICAgICB9XG4gICAgICB0aGlzLmFkYXB0ZXIgPSBuZXcgTGVnYWN5QWRhcHRlcih0aGlzLnRleHRFZGl0b3IpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2hlbiBpbiBzdGFuZC1hbG9uZSBvciBpbmRlcGVuZGVudCBzY3JvbGxpbmcgbW9kZSwgdGhpcyB2YWx1ZSBjYW4gYmUgdXNlZFxuICAgICAqIGluc3RlYWQgb2YgdGhlIGNvbXB1dGVkIHNjcm9sbC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5zY3JvbGxUb3AgPSAwXG5cbiAgICBjb25zdCBzdWJzID0gdGhpcy5zdWJzY3JpcHRpb25zXG4gICAgbGV0IGNvbmZpZ1N1YnNjcmlwdGlvbiA9IHRoaXMuc3Vic2NyaWJlVG9Db25maWcoKVxuXG4gICAgc3Vicy5hZGQoY29uZmlnU3Vic2NyaXB0aW9uKVxuXG4gICAgc3Vicy5hZGQodGhpcy50ZXh0RWRpdG9yLm9uRGlkQ2hhbmdlR3JhbW1hcigoKSA9PiB7XG4gICAgICBzdWJzLnJlbW92ZShjb25maWdTdWJzY3JpcHRpb24pXG4gICAgICBjb25maWdTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG5cbiAgICAgIGNvbmZpZ1N1YnNjcmlwdGlvbiA9IHRoaXMuc3Vic2NyaWJlVG9Db25maWcoKVxuICAgICAgc3Vicy5hZGQoY29uZmlnU3Vic2NyaXB0aW9uKVxuICAgIH0pKVxuXG4gICAgc3Vicy5hZGQodGhpcy5hZGFwdGVyLm9uRGlkQ2hhbmdlU2Nyb2xsVG9wKCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5zdGFuZEFsb25lICYmICF0aGlzLmlnbm9yZVRleHRFZGl0b3JTY3JvbGwgJiYgIXRoaXMuaW5DaGFuZ2VTY3JvbGxUb3ApIHtcbiAgICAgICAgdGhpcy5pbkNoYW5nZVNjcm9sbFRvcCA9IHRydWVcbiAgICAgICAgdGhpcy51cGRhdGVTY3JvbGxUb3AoKVxuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1zY3JvbGwtdG9wJywgdGhpcylcbiAgICAgICAgdGhpcy5pbkNoYW5nZVNjcm9sbFRvcCA9IGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmlnbm9yZVRleHRFZGl0b3JTY3JvbGwpIHtcbiAgICAgICAgdGhpcy5pZ25vcmVUZXh0RWRpdG9yU2Nyb2xsID0gZmFsc2VcbiAgICAgIH1cbiAgICB9KSlcbiAgICBzdWJzLmFkZCh0aGlzLmFkYXB0ZXIub25EaWRDaGFuZ2VTY3JvbGxMZWZ0KCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5zdGFuZEFsb25lKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLXNjcm9sbC1sZWZ0JywgdGhpcylcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIHN1YnMuYWRkKHRoaXMudGV4dEVkaXRvci5vbkRpZENoYW5nZSgoY2hhbmdlcykgPT4ge1xuICAgICAgdGhpcy5lbWl0Q2hhbmdlcyhjaGFuZ2VzKVxuICAgIH0pKVxuICAgIHN1YnMuYWRkKHRoaXMudGV4dEVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4geyB0aGlzLmRlc3Ryb3koKSB9KSlcblxuICAgIC8qXG4gICAgRklYTUUgU29tZSBjaGFuZ2VzIG9jY3VyaW5nIGR1cmluZyB0aGUgdG9rZW5pemF0aW9uIHByb2R1Y2VzXG4gICAgcmFuZ2VzIHRoYXQgZGVjZWl2ZSB0aGUgY2FudmFzIHJlbmRlcmluZyBieSBtYWtpbmcgc29tZVxuICAgIGxpbmVzIGF0IHRoZSBlbmQgb2YgdGhlIGJ1ZmZlciBpbnRhY3Qgd2hpbGUgdGhleSBhcmUgaW4gZmFjdCBub3QsXG4gICAgcmVzdWx0aW5nIGluIGV4dHJhIGxpbmVzIGFwcGVhcmluZyBhdCB0aGUgZW5kIG9mIHRoZSBtaW5pbWFwLlxuICAgIEZvcmNpbmcgYSB3aG9sZSByZXBhaW50IHRvIGZpeCB0aGF0IGJ1ZyBpcyBzdWJvcHRpbWFsIGJ1dCB3b3Jrcy5cbiAgICAqL1xuICAgIGNvbnN0IHRva2VuaXplZEJ1ZmZlciA9IHRoaXMudGV4dEVkaXRvci50b2tlbml6ZWRCdWZmZXJcbiAgICAgID8gdGhpcy50ZXh0RWRpdG9yLnRva2VuaXplZEJ1ZmZlclxuICAgICAgOiB0aGlzLnRleHRFZGl0b3IuZGlzcGxheUJ1ZmZlci50b2tlbml6ZWRCdWZmZXJcblxuICAgIHN1YnMuYWRkKHRva2VuaXplZEJ1ZmZlci5vbkRpZFRva2VuaXplKCgpID0+IHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gICAgfSkpXG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveXMgdGhlIG1vZGVsLlxuICAgKi9cbiAgZGVzdHJveSAoKSB7XG4gICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLnJlbW92ZUFsbERlY29yYXRpb25zKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIHRoaXMudGV4dEVkaXRvciA9IG51bGxcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knKVxuICAgIHRoaXMuZW1pdHRlci5kaXNwb3NlKClcbiAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWVcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIHRoaXMgYE1pbmltYXBgIGhhcyBiZW5uIGRlc3Ryb3llZC5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gd2hldGhlciB0aGlzIE1pbmltYXAgaGFzIGJlZW4gZGVzdHJveWVkIG9yIG5vdFxuICAgKi9cbiAgaXNEZXN0cm95ZWQgKCkgeyByZXR1cm4gdGhpcy5kZXN0cm95ZWQgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtY2hhbmdlYCBldmVudC5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZXZlbnQ6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aCBhbiBldmVudCBvYmplY3Qgd2l0aFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICogLSBzdGFydDogVGhlIGNoYW5nZSdzIHN0YXJ0IHJvdyBudW1iZXJcbiAgICogLSBlbmQ6IFRoZSBjaGFuZ2UncyBlbmQgcm93IG51bWJlclxuICAgKiAtIHNjcmVlbkRlbHRhOiB0aGUgZGVsdGEgaW4gYnVmZmVyIHJvd3MgYmV0d2VlbiB0aGUgdmVyc2lvbnMgYmVmb3JlIGFuZFxuICAgKiAgIGFmdGVyIHRoZSBjaGFuZ2VcbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRDaGFuZ2UgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZScsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1jaGFuZ2UtY29uZmlnYCBldmVudC5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oKTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgZXZlbnRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpcyB0cmlnZ2VyZWQuXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkQ2hhbmdlQ29uZmlnIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2UtY29uZmlnJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLWNoYW5nZS1zY3JvbGwtdG9wYCBldmVudC5cbiAgICpcbiAgICogVGhlIGV2ZW50IGlzIGRpc3BhdGNoZWQgd2hlbiB0aGUgdGV4dCBlZGl0b3IgYHNjcm9sbFRvcGAgdmFsdWUgaGF2ZSBiZWVuXG4gICAqIGNoYW5nZWQgb3Igd2hlbiB0aGUgbWluaW1hcCBzY3JvbGwgdG9wIGhhdmUgYmVlbiBjaGFuZ2VkIGluIHN0YW5kLWFsb25lXG4gICAqIG1vZGUuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKG1pbmltYXA6TWluaW1hcCk6dm9pZH0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIHdoZW5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjdXJyZW50IE1pbmltYXAgaXNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXNzZWQgYXMgYXJndW1lbnQgdG9cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkQ2hhbmdlU2Nyb2xsVG9wIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2Utc2Nyb2xsLXRvcCcsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1jaGFuZ2Utc2Nyb2xsLWxlZnRgIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihtaW5pbWFwOk1pbmltYXApOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY3VycmVudCBNaW5pbWFwIGlzXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VkIGFzIGFyZ3VtZW50IHRvXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZENoYW5nZVNjcm9sbExlZnQgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1zY3JvbGwtbGVmdCcsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1jaGFuZ2Utc3RhbmQtYWxvbmVgIGV2ZW50LlxuICAgKlxuICAgKiBUaGlzIGV2ZW50IGlzIGRpc3BhdGNoZWQgd2hlbiB0aGUgc3RhbmQtYWxvbmUgb2YgdGhlIGN1cnJlbnQgTWluaW1hcFxuICAgKiBpcyBlaXRoZXIgZW5hYmxlZCBvciBkaXNhYmxlZC5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24obWluaW1hcDpNaW5pbWFwKTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgd2hlblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGN1cnJlbnQgTWluaW1hcCBpc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3NlZCBhcyBhcmd1bWVudCB0b1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBjYWxsYmFjay5cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRDaGFuZ2VTdGFuZEFsb25lIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2Utc3RhbmQtYWxvbmUnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtZGVzdHJveWAgZXZlbnQuXG4gICAqXG4gICAqIFRoaXMgZXZlbnQgaXMgZGlzcGF0Y2hlZCB3aGVuIHRoaXMgTWluaW1hcCBoYXZlIGJlZW4gZGVzdHJveWVkLiBJdCBjYW5cbiAgICogb2NjdXJzIGVpdGhlciBiZWNhdXNlIHRoZSB7QGxpbmsgZGVzdHJveX0gbWV0aG9kIGhhdmUgYmVlbiBjYWxsZWQgb24gdGhlXG4gICAqIE1pbmltYXAgb3IgYmVjYXVzZSB0aGUgdGFyZ2V0IHRleHQgZWRpdG9yIGhhdmUgYmVlbiBkZXN0cm95ZWQuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKCk6dm9pZH0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGV2ZW50XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXMgdHJpZ2dlcmVkLlxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZERlc3Ryb3kgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRlc3Ryb3knLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgdG8gdGhlIGNvbmZpZyBjaGFuZ2VzIGZvciB0aGUgY3VycmVudCBlZGl0b3Igc2NvcGUuXG4gICAqXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IHRoZSBkaXNwb3NhYmxlIHRvIGRpc3Bvc2UgYWxsIHRoZSByZWdpc3RlcmVkIGV2ZW50c1xuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIHN1YnNjcmliZVRvQ29uZmlnICgpIHtcbiAgICBjb25zdCBzdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIGNvbnN0IG9wdHMgPSB7c2NvcGU6IHRoaXMudGV4dEVkaXRvci5nZXRSb290U2NvcGVEZXNjcmlwdG9yKCl9XG5cbiAgICBzdWJzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdlZGl0b3Iuc2Nyb2xsUGFzdEVuZCcsIG9wdHMsIChzY3JvbGxQYXN0RW5kKSA9PiB7XG4gICAgICB0aGlzLnNjcm9sbFBhc3RFbmQgPSBzY3JvbGxQYXN0RW5kXG4gICAgICB0aGlzLmFkYXB0ZXIuc2Nyb2xsUGFzdEVuZCA9IHRoaXMuc2Nyb2xsUGFzdEVuZFxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgICB9KSlcbiAgICBzdWJzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdtaW5pbWFwLmNoYXJIZWlnaHQnLCBvcHRzLCAoY29uZmlnQ2hhckhlaWdodCkgPT4ge1xuICAgICAgdGhpcy5jb25maWdDaGFySGVpZ2h0ID0gY29uZmlnQ2hhckhlaWdodFxuICAgICAgdGhpcy51cGRhdGVTY3JvbGxUb3AoKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgICB9KSlcbiAgICBzdWJzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdtaW5pbWFwLmNoYXJXaWR0aCcsIG9wdHMsIChjb25maWdDaGFyV2lkdGgpID0+IHtcbiAgICAgIHRoaXMuY29uZmlnQ2hhcldpZHRoID0gY29uZmlnQ2hhcldpZHRoXG4gICAgICB0aGlzLnVwZGF0ZVNjcm9sbFRvcCgpXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICAgIH0pKVxuICAgIHN1YnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ21pbmltYXAuaW50ZXJsaW5lJywgb3B0cywgKGNvbmZpZ0ludGVybGluZSkgPT4ge1xuICAgICAgdGhpcy5jb25maWdJbnRlcmxpbmUgPSBjb25maWdJbnRlcmxpbmVcbiAgICAgIHRoaXMudXBkYXRlU2Nyb2xsVG9wKClcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gICAgfSkpXG4gICAgc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbWluaW1hcC5pbmRlcGVuZGVudE1pbmltYXBTY3JvbGwnLCBvcHRzLCAoaW5kZXBlbmRlbnRNaW5pbWFwU2Nyb2xsKSA9PiB7XG4gICAgICB0aGlzLmluZGVwZW5kZW50TWluaW1hcFNjcm9sbCA9IGluZGVwZW5kZW50TWluaW1hcFNjcm9sbFxuICAgICAgdGhpcy51cGRhdGVTY3JvbGxUb3AoKVxuICAgIH0pKVxuICAgIHN1YnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ21pbmltYXAuc2Nyb2xsU2Vuc2l0aXZpdHknLCBvcHRzLCAoc2Nyb2xsU2Vuc2l0aXZpdHkpID0+IHtcbiAgICAgIHRoaXMuc2Nyb2xsU2Vuc2l0aXZpdHkgPSBzY3JvbGxTZW5zaXRpdml0eVxuICAgIH0pKVxuICAgIC8vIGNkcHJyIGlzIHNob3J0aGFuZCBmb3IgY29uZmlnRGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nXG4gICAgc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZShcbiAgICAgICdtaW5pbWFwLmRldmljZVBpeGVsUmF0aW9Sb3VuZGluZycsXG4gICAgICBvcHRzLFxuICAgICAgKGNkcHJyKSA9PiB7XG4gICAgICAgIHRoaXMuY29uZmlnRGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nID0gY2RwcnJcbiAgICAgICAgdGhpcy51cGRhdGVTY3JvbGxUb3AoKVxuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICAgICAgfVxuICAgICkpXG5cbiAgICByZXR1cm4gc3Vic1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIGN1cnJlbnQgTWluaW1hcCBpcyBhIHN0YW5kLWFsb25lIG1pbmltYXAuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgdGhpcyBNaW5pbWFwIGlzIGluIHN0YW5kLWFsb25lIG1vZGUgb3Igbm90LlxuICAgKi9cbiAgaXNTdGFuZEFsb25lICgpIHsgcmV0dXJuIHRoaXMuc3RhbmRBbG9uZSB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHN0YW5kLWFsb25lIG1vZGUgZm9yIHRoaXMgbWluaW1hcC5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBzdGFuZEFsb25lIHRoZSBuZXcgc3RhdGUgb2YgdGhlIHN0YW5kLWFsb25lIG1vZGUgZm9yIHRoaXNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1pbmltYXBcbiAgICogQGVtaXRzIHtkaWQtY2hhbmdlLXN0YW5kLWFsb25lfSBpZiB0aGUgc3RhbmQtYWxvbmUgbW9kZSBoYXZlIGJlZW4gdG9nZ2xlZFxuICAgKiAgICAgICAgb24gb3Igb2ZmIGJ5IHRoZSBjYWxsXG4gICAqL1xuICBzZXRTdGFuZEFsb25lIChzdGFuZEFsb25lKSB7XG4gICAgaWYgKHN0YW5kQWxvbmUgIT09IHRoaXMuc3RhbmRBbG9uZSkge1xuICAgICAgdGhpcy5zdGFuZEFsb25lID0gc3RhbmRBbG9uZVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2Utc3RhbmQtYWxvbmUnLCB0aGlzKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvcmAgdGhhdCB0aGlzIG1pbmltYXAgcmVwcmVzZW50cy5cbiAgICpcbiAgICogQHJldHVybiB7VGV4dEVkaXRvcn0gdGhpcyBNaW5pbWFwJ3MgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3IgKCkgeyByZXR1cm4gdGhpcy50ZXh0RWRpdG9yIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIHRoZSBgVGV4dEVkaXRvcmAgYXQgdGhlIE1pbmltYXAgc2NhbGUuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHNjYWxlZCBoZWlnaHQgb2YgdGhlIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yU2NhbGVkSGVpZ2h0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmdldEhlaWdodCgpICogdGhpcy5nZXRWZXJ0aWNhbFNjYWxlRmFjdG9yKClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvcmAgc2Nyb2xsIHRvcCB2YWx1ZSBhdCB0aGUgTWluaW1hcCBzY2FsZS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2NhbGVkIHNjcm9sbCB0b3Agb2YgdGhlIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yU2NhbGVkU2Nyb2xsVG9wICgpIHtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmdldFNjcm9sbFRvcCgpICogdGhpcy5nZXRWZXJ0aWNhbFNjYWxlRmFjdG9yKClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvcmAgc2Nyb2xsIGxlZnQgdmFsdWUgYXQgdGhlIE1pbmltYXAgc2NhbGUuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHNjYWxlZCBzY3JvbGwgbGVmdCBvZiB0aGUgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3JTY2FsZWRTY3JvbGxMZWZ0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmdldFNjcm9sbExlZnQoKSAqIHRoaXMuZ2V0SG9yaXpvbnRhbFNjYWxlRmFjdG9yKClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvcmAgbWF4aW11bSBzY3JvbGwgdG9wIHZhbHVlLlxuICAgKlxuICAgKiBXaGVuIHRoZSBgc2Nyb2xsUGFzdEVuZGAgc2V0dGluZyBpcyBlbmFibGVkLCB0aGUgbWV0aG9kIGNvbXBlbnNhdGUgdGhlXG4gICAqIGV4dHJhIHNjcm9sbCBieSByZW1vdmluZyB0aGUgc2FtZSBoZWlnaHQgYXMgYWRkZWQgYnkgdGhlIGVkaXRvciBmcm9tIHRoZVxuICAgKiBmaW5hbCB2YWx1ZS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgbWF4aW11bSBzY3JvbGwgdG9wIG9mIHRoZSB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvck1heFNjcm9sbFRvcCAoKSB7IHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0TWF4U2Nyb2xsVG9wKCkgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvcmAgc2Nyb2xsIHRvcCB2YWx1ZS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2Nyb2xsIHRvcCBvZiB0aGUgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3JTY3JvbGxUb3AgKCkgeyByZXR1cm4gdGhpcy5hZGFwdGVyLmdldFNjcm9sbFRvcCgpIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc2Nyb2xsIHRvcCBvZiB0aGUgYFRleHRFZGl0b3JgLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2Nyb2xsVG9wIHRoZSBuZXcgc2Nyb2xsIHRvcCB2YWx1ZVxuICAgKi9cbiAgc2V0VGV4dEVkaXRvclNjcm9sbFRvcCAoc2Nyb2xsVG9wLCBpZ25vcmVUZXh0RWRpdG9yU2Nyb2xsID0gZmFsc2UpIHtcbiAgICB0aGlzLmlnbm9yZVRleHRFZGl0b3JTY3JvbGwgPSBpZ25vcmVUZXh0RWRpdG9yU2Nyb2xsXG4gICAgdGhpcy5hZGFwdGVyLnNldFNjcm9sbFRvcChzY3JvbGxUb3ApXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRleHRFZGl0b3JgIHNjcm9sbCBsZWZ0IHZhbHVlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBzY3JvbGwgbGVmdCBvZiB0aGUgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3JTY3JvbGxMZWZ0ICgpIHsgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRTY3JvbGxMZWZ0KCkgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgdGhlIGBUZXh0RWRpdG9yYC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgaGVpZ2h0IG9mIHRoZSB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvckhlaWdodCAoKSB7IHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0SGVpZ2h0KCkgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvcmAgc2Nyb2xsIGFzIGEgdmFsdWUgbm9ybWFsaXplZCBiZXR3ZWVuIGAwYCBhbmQgYDFgLlxuICAgKlxuICAgKiBXaGVuIHRoZSBgc2Nyb2xsUGFzdEVuZGAgc2V0dGluZyBpcyBlbmFibGVkIHRoZSB2YWx1ZSBtYXkgZXhjZWVkIGAxYCBhcyB0aGVcbiAgICogbWF4aW11bSBzY3JvbGwgdmFsdWUgdXNlZCB0byBjb21wdXRlIHRoaXMgcmF0aW8gY29tcGVuc2F0ZSBmb3IgdGhlIGV4dHJhXG4gICAqIGhlaWdodCBpbiB0aGUgZWRpdG9yLiAqKlVzZSB7QGxpbmsgZ2V0Q2FwZWRUZXh0RWRpdG9yU2Nyb2xsUmF0aW99IHdoZW5cbiAgICogeW91IG5lZWQgYSB2YWx1ZSB0aGF0IGlzIHN0cmljdGx5IGJldHdlZW4gYDBgIGFuZCBgMWAuKipcbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2Nyb2xsIHJhdGlvIG9mIHRoZSB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvclNjcm9sbFJhdGlvICgpIHtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmdldFNjcm9sbFRvcCgpIC8gKHRoaXMuZ2V0VGV4dEVkaXRvck1heFNjcm9sbFRvcCgpIHx8IDEpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRleHRFZGl0b3JgIHNjcm9sbCBhcyBhIHZhbHVlIG5vcm1hbGl6ZWQgYmV0d2VlbiBgMGAgYW5kIGAxYC5cbiAgICpcbiAgICogVGhlIHJldHVybmVkIHZhbHVlIHdpbGwgYWx3YXlzIGJlIHN0cmljdGx5IGJldHdlZW4gYDBgIGFuZCBgMWAuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHNjcm9sbCByYXRpbyBvZiB0aGUgdGV4dCBlZGl0b3Igc3RyaWN0bHkgYmV0d2VlblxuICAgKiAgICAgICAgICAgICAgICAgIDAgYW5kIDFcbiAgICovXG4gIGdldENhcGVkVGV4dEVkaXRvclNjcm9sbFJhdGlvICgpIHtcbiAgICByZXR1cm4gTWF0aC5taW4oMSwgdGhpcy5nZXRUZXh0RWRpdG9yU2Nyb2xsUmF0aW8oKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgdGhlIHdob2xlIG1pbmltYXAgaW4gcGl4ZWxzIGJhc2VkIG9uIHRoZSBgbWluaW1hcGBcbiAgICogc2V0dGluZ3MuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIGhlaWdodCBvZiB0aGUgbWluaW1hcFxuICAgKi9cbiAgZ2V0SGVpZ2h0ICgpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0RWRpdG9yLmdldFNjcmVlbkxpbmVDb3VudCgpICogdGhpcy5nZXRMaW5lSGVpZ2h0KClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB3aWR0aCBvZiB0aGUgd2hvbGUgbWluaW1hcCBpbiBwaXhlbHMgYmFzZWQgb24gdGhlIGBtaW5pbWFwYFxuICAgKiBzZXR0aW5ncy5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgd2lkdGggb2YgdGhlIG1pbmltYXBcbiAgICovXG4gIGdldFdpZHRoICgpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0RWRpdG9yLmdldE1heFNjcmVlbkxpbmVMZW5ndGgoKSAqIHRoaXMuZ2V0Q2hhcldpZHRoKClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgdGhlIE1pbmltYXAgY29udGVudCB3aWxsIHRha2Ugb24gc2NyZWVuLlxuICAgKlxuICAgKiBXaGVuIHRoZSBNaW5pbWFwIGhlaWdodCBpcyBncmVhdGVyIHRoYW4gdGhlIGBUZXh0RWRpdG9yYCBoZWlnaHQsIHRoZVxuICAgKiBgVGV4dEVkaXRvcmAgaGVpZ2h0IGlzIHJldHVybmVkIGluc3RlYWQuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHZpc2libGUgaGVpZ2h0IG9mIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXRWaXNpYmxlSGVpZ2h0ICgpIHtcbiAgICByZXR1cm4gTWF0aC5taW4odGhpcy5nZXRTY3JlZW5IZWlnaHQoKSwgdGhpcy5nZXRIZWlnaHQoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgdGhlIG1pbmltYXAgc2hvdWxkIHRha2Ugb25jZSBkaXNwbGF5ZWQsIGl0J3MgZWl0aGVyXG4gICAqIHRoZSBoZWlnaHQgb2YgdGhlIGBUZXh0RWRpdG9yYCBvciB0aGUgcHJvdmlkZWQgYGhlaWdodGAgd2hlbiBpbiBzdGFuZC1hbG9uZVxuICAgKiBtb2RlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSB0b3RhbCBoZWlnaHQgb2YgdGhlIE1pbmltYXBcbiAgICovXG4gIGdldFNjcmVlbkhlaWdodCAoKSB7XG4gICAgaWYgKHRoaXMuaXNTdGFuZEFsb25lKCkpIHtcbiAgICAgIGlmICh0aGlzLmhlaWdodCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlaWdodFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SGVpZ2h0KClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRIZWlnaHQoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB3aWR0aCB0aGUgd2hvbGUgTWluaW1hcCB3aWxsIHRha2Ugb24gc2NyZWVuLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSB3aWR0aCBvZiB0aGUgTWluaW1hcCB3aGVuIGRpc3BsYXllZFxuICAgKi9cbiAgZ2V0VmlzaWJsZVdpZHRoICgpIHtcbiAgICByZXR1cm4gTWF0aC5taW4odGhpcy5nZXRTY3JlZW5XaWR0aCgpLCB0aGlzLmdldFdpZHRoKCkpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgd2lkdGggdGhlIE1pbmltYXAgc2hvdWxkIHRha2Ugb25jZSBkaXNwbGF5ZWQsIGl0J3MgZWl0aGVyIHRoZVxuICAgKiB3aWR0aCBvZiB0aGUgTWluaW1hcCBjb250ZW50IG9yIHRoZSBwcm92aWRlZCBgd2lkdGhgIHdoZW4gaW4gc3RhbmRBbG9uZVxuICAgKiBtb2RlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBNaW5pbWFwIHNjcmVlbiB3aWR0aFxuICAgKi9cbiAgZ2V0U2NyZWVuV2lkdGggKCkge1xuICAgIGlmICh0aGlzLmlzU3RhbmRBbG9uZSgpICYmIHRoaXMud2lkdGggIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMud2lkdGhcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0V2lkdGgoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwcmVmZXJyZWQgaGVpZ2h0IGFuZCB3aWR0aCB3aGVuIGluIHN0YW5kLWFsb25lIG1vZGUuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBieSB0aGUgPE1pbmltYXBFbGVtZW50PiBmb3IgdGhpcyBNaW5pbWFwIHNvIHRoYXRcbiAgICogdGhlIG1vZGVsIGlzIGtlcHQgaW4gc3luYyB3aXRoIHRoZSB2aWV3LlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IHRoZSBuZXcgaGVpZ2h0IG9mIHRoZSBNaW5pbWFwXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCB0aGUgbmV3IHdpZHRoIG9mIHRoZSBNaW5pbWFwXG4gICAqL1xuICBzZXRTY3JlZW5IZWlnaHRBbmRXaWR0aCAoaGVpZ2h0LCB3aWR0aCkge1xuICAgIGlmICh0aGlzLndpZHRoICE9PSB3aWR0aCB8fCB0aGlzLmhlaWdodCAhPT0gaGVpZ2h0KSB7XG4gICAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICAgICAgdGhpcy53aWR0aCA9IHdpZHRoXG4gICAgICB0aGlzLnVwZGF0ZVNjcm9sbFRvcCgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZlcnRpY2FsIHNjYWxpbmcgZmFjdG9yIHdoZW4gY29udmVydGluZyBjb29yZGluYXRlcyBmcm9tIHRoZVxuICAgKiBgVGV4dEVkaXRvcmAgdG8gdGhlIE1pbmltYXAuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIE1pbmltYXAgdmVydGljYWwgc2NhbGluZyBmYWN0b3JcbiAgICovXG4gIGdldFZlcnRpY2FsU2NhbGVGYWN0b3IgKCkge1xuICAgIHJldHVybiB0aGlzLmdldExpbmVIZWlnaHQoKSAvIHRoaXMudGV4dEVkaXRvci5nZXRMaW5lSGVpZ2h0SW5QaXhlbHMoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhvcml6b250YWwgc2NhbGluZyBmYWN0b3Igd2hlbiBjb252ZXJ0aW5nIGNvb3JkaW5hdGVzIGZyb20gdGhlXG4gICAqIGBUZXh0RWRpdG9yYCB0byB0aGUgTWluaW1hcC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgTWluaW1hcCBob3Jpem9udGFsIHNjYWxpbmcgZmFjdG9yXG4gICAqL1xuICBnZXRIb3Jpem9udGFsU2NhbGVGYWN0b3IgKCkge1xuICAgIHJldHVybiB0aGlzLmdldENoYXJXaWR0aCgpIC8gdGhpcy50ZXh0RWRpdG9yLmdldERlZmF1bHRDaGFyV2lkdGgoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCBvZiBhIGxpbmUgaW4gdGhlIE1pbmltYXAgaW4gcGl4ZWxzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IGEgbGluZSdzIGhlaWdodCBpbiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0TGluZUhlaWdodCAoKSB7IHJldHVybiB0aGlzLmdldENoYXJIZWlnaHQoKSArIHRoaXMuZ2V0SW50ZXJsaW5lKCkgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB3aWR0aCBvZiBhIGNoYXJhY3RlciBpbiB0aGUgTWluaW1hcCBpbiBwaXhlbHMuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gYSBjaGFyYWN0ZXIncyB3aWR0aCBpbiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0Q2hhcldpZHRoICgpIHtcbiAgICBpZiAodGhpcy5jaGFyV2lkdGggIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhcldpZHRoXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZ0NoYXJXaWR0aFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjaGFyIHdpZHRoIGZvciB0aGlzIE1pbmltYXAuIFRoaXMgdmFsdWUgd2lsbCBvdmVycmlkZSB0aGVcbiAgICogdmFsdWUgZnJvbSB0aGUgY29uZmlnIGZvciB0aGlzIGluc3RhbmNlIG9ubHkuIEEgYGRpZC1jaGFuZ2UtY29uZmlnYFxuICAgKiBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gY2hhcldpZHRoIHRoZSBuZXcgd2lkdGggb2YgYSBjaGFyIGluIHRoZSBNaW5pbWFwXG4gICAqIEBlbWl0cyB7ZGlkLWNoYW5nZS1jb25maWd9IHdoZW4gdGhlIHZhbHVlIGlzIGNoYW5nZWRcbiAgICovXG4gIHNldENoYXJXaWR0aCAoY2hhcldpZHRoKSB7XG4gICAgdGhpcy5jaGFyV2lkdGggPSBNYXRoLmZsb29yKGNoYXJXaWR0aClcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCBvZiBhIGNoYXJhY3RlciBpbiB0aGUgTWluaW1hcCBpbiBwaXhlbHMuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gYSBjaGFyYWN0ZXIncyBoZWlnaHQgaW4gdGhlIE1pbmltYXBcbiAgICovXG4gIGdldENoYXJIZWlnaHQgKCkge1xuICAgIGlmICh0aGlzLmNoYXJIZWlnaHQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhckhlaWdodFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25maWdDaGFySGVpZ2h0XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGNoYXIgaGVpZ2h0IGZvciB0aGlzIE1pbmltYXAuIFRoaXMgdmFsdWUgd2lsbCBvdmVycmlkZSB0aGVcbiAgICogdmFsdWUgZnJvbSB0aGUgY29uZmlnIGZvciB0aGlzIGluc3RhbmNlIG9ubHkuIEEgYGRpZC1jaGFuZ2UtY29uZmlnYFxuICAgKiBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gY2hhckhlaWdodCB0aGUgbmV3IGhlaWdodCBvZiBhIGNoYXIgaW4gdGhlIE1pbmltYXBcbiAgICogQGVtaXRzIHtkaWQtY2hhbmdlLWNvbmZpZ30gd2hlbiB0aGUgdmFsdWUgaXMgY2hhbmdlZFxuICAgKi9cbiAgc2V0Q2hhckhlaWdodCAoY2hhckhlaWdodCkge1xuICAgIHRoaXMuY2hhckhlaWdodCA9IE1hdGguZmxvb3IoY2hhckhlaWdodClcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCBvZiBhbiBpbnRlcmxpbmUgaW4gdGhlIE1pbmltYXAgaW4gcGl4ZWxzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBpbnRlcmxpbmUncyBoZWlnaHQgaW4gdGhlIE1pbmltYXBcbiAgICovXG4gIGdldEludGVybGluZSAoKSB7XG4gICAgaWYgKHRoaXMuaW50ZXJsaW5lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmludGVybGluZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25maWdJbnRlcmxpbmVcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgaW50ZXJsaW5lIGhlaWdodCBmb3IgdGhpcyBNaW5pbWFwLiBUaGlzIHZhbHVlIHdpbGwgb3ZlcnJpZGUgdGhlXG4gICAqIHZhbHVlIGZyb20gdGhlIGNvbmZpZyBmb3IgdGhpcyBpbnN0YW5jZSBvbmx5LiBBIGBkaWQtY2hhbmdlLWNvbmZpZ2BcbiAgICogZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGludGVybGluZSB0aGUgbmV3IGhlaWdodCBvZiBhbiBpbnRlcmxpbmUgaW4gdGhlIE1pbmltYXBcbiAgICogQGVtaXRzIHtkaWQtY2hhbmdlLWNvbmZpZ30gd2hlbiB0aGUgdmFsdWUgaXMgY2hhbmdlZFxuICAgKi9cbiAgc2V0SW50ZXJsaW5lIChpbnRlcmxpbmUpIHtcbiAgICB0aGlzLmludGVybGluZSA9IE1hdGguZmxvb3IoaW50ZXJsaW5lKVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3RhdHVzIG9mIGRldmljZVBpeGVsUmF0aW9Sb3VuZGluZyBpbiB0aGUgTWluaW1hcC5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gdGhlIGRldmljZVBpeGVsUmF0aW9Sb3VuZGluZyBzdGF0dXMgaW4gdGhlIE1pbmltYXBcbiAgICovXG4gIGdldERldmljZVBpeGVsUmF0aW9Sb3VuZGluZyAoKSB7XG4gICAgaWYgKHRoaXMuZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmRldmljZVBpeGVsUmF0aW9Sb3VuZGluZ1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25maWdEZXZpY2VQaXhlbFJhdGlvUm91bmRpbmdcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nIHN0YXR1cyBmb3IgdGhpcyBNaW5pbWFwLlxuICAgKiBUaGlzIHZhbHVlIHdpbGwgb3ZlcnJpZGUgdGhlIHZhbHVlIGZyb20gdGhlIGNvbmZpZyBmb3IgdGhpcyBpbnN0YW5jZSBvbmx5LlxuICAgKiBBIGBkaWQtY2hhbmdlLWNvbmZpZ2AgZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBkZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgdGhlIG5ldyBzdGF0dXMgb2ZcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluIHRoZSBNaW5pbWFwXG4gICAqIEBlbWl0cyB7ZGlkLWNoYW5nZS1jb25maWd9IHdoZW4gdGhlIHZhbHVlIGlzIGNoYW5nZWRcbiAgICovXG4gIHNldERldmljZVBpeGVsUmF0aW9Sb3VuZGluZyAoZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nKSB7XG4gICAgdGhpcy5kZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgPSBkZXZpY2VQaXhlbFJhdGlvUm91bmRpbmdcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRldmljZVBpeGVsUmF0aW8gaW4gdGhlIE1pbmltYXAgaW4gcGl4ZWxzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBkZXZpY2VQaXhlbFJhdGlvIGluIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXREZXZpY2VQaXhlbFJhdGlvICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXREZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcoKVxuICAgICAgPyBNYXRoLmZsb29yKGRldmljZVBpeGVsUmF0aW8pXG4gICAgICA6IGRldmljZVBpeGVsUmF0aW9cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZmlyc3QgdmlzaWJsZSByb3cgaW4gdGhlIE1pbmltYXAuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIGluZGV4IG9mIHRoZSBmaXJzdCB2aXNpYmxlIHJvd1xuICAgKi9cbiAgZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93ICgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLmdldFNjcm9sbFRvcCgpIC8gdGhpcy5nZXRMaW5lSGVpZ2h0KCkpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGxhc3QgdmlzaWJsZSByb3cgaW4gdGhlIE1pbmltYXAuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIGluZGV4IG9mIHRoZSBsYXN0IHZpc2libGUgcm93XG4gICAqL1xuICBnZXRMYXN0VmlzaWJsZVNjcmVlblJvdyAoKSB7XG4gICAgcmV0dXJuIE1hdGguY2VpbChcbiAgICAgICh0aGlzLmdldFNjcm9sbFRvcCgpICsgdGhpcy5nZXRTY3JlZW5IZWlnaHQoKSkgLyB0aGlzLmdldExpbmVIZWlnaHQoKVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgd2hlbiB0aGUgYGluZGVwZW5kZW50TWluaW1hcFNjcm9sbGAgc2V0dGluZyBoYXZlIGJlZW4gZW5hYmxlZC5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gd2hldGhlciB0aGUgbWluaW1hcCBjYW4gc2Nyb2xsIGluZGVwZW5kZW50bHlcbiAgICovXG4gIHNjcm9sbEluZGVwZW5kZW50bHlPbk1vdXNlV2hlZWwgKCkgeyByZXR1cm4gdGhpcy5pbmRlcGVuZGVudE1pbmltYXBTY3JvbGwgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHNjcm9sbCBvZiB0aGUgTWluaW1hcC5cbiAgICpcbiAgICogVGhlIE1pbmltYXAgY2FuIHNjcm9sbCBvbmx5IHdoZW4gaXRzIGhlaWdodCBpcyBncmVhdGVyIHRoYXQgdGhlIGhlaWdodFxuICAgKiBvZiBpdHMgYFRleHRFZGl0b3JgLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBzY3JvbGwgdG9wIG9mIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXRTY3JvbGxUb3AgKCkge1xuICAgIHJldHVybiB0aGlzLnN0YW5kQWxvbmUgfHwgdGhpcy5pbmRlcGVuZGVudE1pbmltYXBTY3JvbGxcbiAgICAgID8gdGhpcy5zY3JvbGxUb3BcbiAgICAgIDogdGhpcy5nZXRTY3JvbGxUb3BGcm9tRWRpdG9yKClcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtaW5pbWFwIHNjcm9sbCB0b3AgdmFsdWUgd2hlbiBpbiBzdGFuZC1hbG9uZSBtb2RlLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2Nyb2xsVG9wIHRoZSBuZXcgc2Nyb2xsIHRvcCBmb3IgdGhlIE1pbmltYXBcbiAgICogQGVtaXRzIHtkaWQtY2hhbmdlLXNjcm9sbC10b3B9IGlmIHRoZSBNaW5pbWFwJ3Mgc3RhbmQtYWxvbmUgbW9kZSBpcyBlbmFibGVkXG4gICAqL1xuICBzZXRTY3JvbGxUb3AgKHNjcm9sbFRvcCkge1xuICAgIHRoaXMuc2Nyb2xsVG9wID0gTWF0aC5tYXgoMCwgTWF0aC5taW4odGhpcy5nZXRNYXhTY3JvbGxUb3AoKSwgc2Nyb2xsVG9wKSlcblxuICAgIGlmICh0aGlzLnN0YW5kQWxvbmUgfHwgdGhpcy5pbmRlcGVuZGVudE1pbmltYXBTY3JvbGwpIHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLXNjcm9sbC10b3AnLCB0aGlzKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtaW5pbWFwIHNjcm9sbCBhcyBhIHJhdGlvbiBiZXR3ZWVuIDAgYW5kIDEuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIG1pbmltYXAgc2Nyb2xsIHJhdGlvXG4gICAqL1xuICBnZXRTY3JvbGxSYXRpbyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U2Nyb2xsVG9wKCkgLyB0aGlzLmdldE1heFNjcm9sbFRvcCgpXG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgc2Nyb2xsIHRvcCB2YWx1ZSB3aXRoIHRoZSBvbmUgY29tcHV0ZWQgZnJvbSB0aGUgdGV4dCBlZGl0b3JcbiAgICogd2hlbiB0aGUgbWluaW1hcCBpcyBpbiB0aGUgaW5kZXBlbmRlbnQgc2Nyb2xsaW5nIG1vZGUuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgdXBkYXRlU2Nyb2xsVG9wICgpIHtcbiAgICBpZiAodGhpcy5pbmRlcGVuZGVudE1pbmltYXBTY3JvbGwpIHtcbiAgICAgIHRoaXMuc2V0U2Nyb2xsVG9wKHRoaXMuZ2V0U2Nyb2xsVG9wRnJvbUVkaXRvcigpKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2Utc2Nyb2xsLXRvcCcsIHRoaXMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHNjcm9sbCB0b3AgYXMgY29tcHV0ZWQgZnJvbSB0aGUgdGV4dCBlZGl0b3Igc2Nyb2xsIHRvcC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgY29tcHV0ZWQgc2Nyb2xsIHRvcCB2YWx1ZVxuICAgKi9cbiAgZ2V0U2Nyb2xsVG9wRnJvbUVkaXRvciAoKSB7XG4gICAgcmV0dXJuIE1hdGguYWJzKFxuICAgICAgdGhpcy5nZXRDYXBlZFRleHRFZGl0b3JTY3JvbGxSYXRpbygpICogdGhpcy5nZXRNYXhTY3JvbGxUb3AoKVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtYXhpbXVtIHNjcm9sbCB2YWx1ZSBvZiB0aGUgTWluaW1hcC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgbWF4aW11bSBzY3JvbGwgdG9wIGZvciB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0TWF4U2Nyb2xsVG9wICgpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgdGhpcy5nZXRIZWlnaHQoKSAtIHRoaXMuZ2V0U2NyZWVuSGVpZ2h0KCkpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgTWluaW1hcCBjYW4gc2Nyb2xsLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB3aGV0aGVyIHRoaXMgTWluaW1hcCBjYW4gc2Nyb2xsIG9yIG5vdFxuICAgKi9cbiAgY2FuU2Nyb2xsICgpIHsgcmV0dXJuIHRoaXMuZ2V0TWF4U2Nyb2xsVG9wKCkgPiAwIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgbWluaW1hcCBzY3JvbGwgdG9wIHZhbHVlIHVzaW5nIGEgbW91c2UgZXZlbnQgd2hlbiB0aGVcbiAgICogaW5kZXBlbmRlbnQgc2Nyb2xsaW5nIG1vZGUgaXMgZW5hYmxlZFxuICAgKlxuICAgKiBAcGFyYW0gIHtNb3VzZUV2ZW50fSBldmVudCB0aGUgbW91c2Ugd2hlZWwgZXZlbnRcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBvbk1vdXNlV2hlZWwgKGV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLmNhblNjcm9sbCgpKSB7IHJldHVybiB9XG5cbiAgICBjb25zdCB7d2hlZWxEZWx0YVl9ID0gZXZlbnRcbiAgICBjb25zdCBwcmV2aW91c1Njcm9sbFRvcCA9IHRoaXMuZ2V0U2Nyb2xsVG9wKClcbiAgICBjb25zdCB1cGRhdGVkU2Nyb2xsVG9wID0gcHJldmlvdXNTY3JvbGxUb3AgLSBNYXRoLnJvdW5kKHdoZWVsRGVsdGFZICogdGhpcy5zY3JvbGxTZW5zaXRpdml0eSlcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICB0aGlzLnNldFNjcm9sbFRvcCh1cGRhdGVkU2Nyb2xsVG9wKVxuICB9XG5cbiAgLyoqXG4gICAqIERlbGVnYXRlcyB0byBgVGV4dEVkaXRvciNnZXRNYXJrZXJgLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGdldE1hcmtlciAoaWQpIHsgcmV0dXJuIHRoaXMudGV4dEVkaXRvci5nZXRNYXJrZXIoaWQpIH1cblxuICAvKipcbiAgICogRGVsZWdhdGVzIHRvIGBUZXh0RWRpdG9yI2ZpbmRNYXJrZXJzYC5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBmaW5kTWFya2VycyAobykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0RWRpdG9yLmZpbmRNYXJrZXJzKG8pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxlZ2F0ZXMgdG8gYFRleHRFZGl0b3IjbWFya0J1ZmZlclJhbmdlYC5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBtYXJrQnVmZmVyUmFuZ2UgKHJhbmdlKSB7IHJldHVybiB0aGlzLnRleHRFZGl0b3IubWFya0J1ZmZlclJhbmdlKHJhbmdlKSB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIGEgY2hhbmdlIGV2ZW50cyB3aXRoIHRoZSBwYXNzZWQtaW4gY2hhbmdlcyBhcyBkYXRhLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGNoYW5nZXMgYSBjaGFuZ2UgdG8gZGlzcGF0Y2hcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBlbWl0Q2hhbmdlcyAoY2hhbmdlcykgeyB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZScsIGNoYW5nZXMpIH1cblxuICAvKipcbiAgICogRW5hYmxlcyB0aGUgY2FjaGUgYXQgdGhlIGFkYXB0ZXIgbGV2ZWwgdG8gYXZvaWQgY29uc2VjdXRpdmUgYWNjZXNzIHRvIHRoZVxuICAgKiB0ZXh0IGVkaXRvciBBUEkgZHVyaW5nIGEgcmVuZGVyIHBoYXNlLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGVuYWJsZUNhY2hlICgpIHsgdGhpcy5hZGFwdGVyLmVuYWJsZUNhY2hlKCkgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlIHRoZSBhZGFwdGVyIGNhY2hlLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGNsZWFyQ2FjaGUgKCkgeyB0aGlzLmFkYXB0ZXIuY2xlYXJDYWNoZSgpIH1cblxuICBlZGl0b3JEZXN0cm95ZWQgKCkgeyB0aGlzLmFkYXB0ZXIuZWRpdG9yRGVzdHJveWVkKCkgfVxuXG59XG4iXX0=