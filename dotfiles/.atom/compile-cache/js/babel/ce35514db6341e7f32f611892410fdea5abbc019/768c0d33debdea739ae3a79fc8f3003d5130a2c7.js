Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/*
  The following hack clears the require cache of all the paths to the minimap when this file is laoded. It should prevents errors of partial reloading after an update.
 */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _decoratorsInclude = require('./decorators/include');

var _decoratorsInclude2 = _interopRequireDefault(_decoratorsInclude);

var _mixinsPluginManagement = require('./mixins/plugin-management');

var _mixinsPluginManagement2 = _interopRequireDefault(_mixinsPluginManagement);

'use babel';

if (!atom.inSpecMode()) {
  Object.keys(require.cache).filter(function (p) {
    return p !== __filename && p.indexOf(_path2['default'].resolve(__dirname, '..') + _path2['default'].sep) > -1;
  }).forEach(function (p) {
    delete require.cache[p];
  });
}

var Emitter = undefined,
    CompositeDisposable = undefined,
    Minimap = undefined,
    MinimapElement = undefined,
    MinimapPluginGeneratorElement = undefined;

/**
 * The `Minimap` package provides an eagle-eye view of text buffers.
 *
 * It also provides API for plugin packages that want to interact with the
 * minimap and be available to the user through the minimap settings.
 */

var Main = (function () {
  /**
   * Used only at export time.
   *
   * @access private
   */

  function Main() {
    _classCallCheck(this, _Main);

    if (!Emitter) {
      var _require = require('atom');

      Emitter = _require.Emitter;
      CompositeDisposable = _require.CompositeDisposable;
    }

    /**
     * The activation state of the package.
     *
     * @type {boolean}
     * @access private
     */
    this.active = false;
    /**
     * The toggle state of the package.
     *
     * @type {boolean}
     * @access private
     */
    this.toggled = false;
    /**
     * The `Map` where Minimap instances are stored with the text editor they
     * target as key.
     *
     * @type {Map}
     * @access private
     */
    this.editorsMinimaps = null;
    /**
     * The composite disposable that stores the package's subscriptions.
     *
     * @type {CompositeDisposable}
     * @access private
     */
    this.subscriptions = null;
    /**
     * The disposable that stores the package's commands subscription.
     *
     * @type {Disposable}
     * @access private
     */
    this.subscriptionsOfCommands = null;

    /**
     * The package's events emitter.
     *
     * @type {Emitter}
     * @access private
     */
    this.emitter = new Emitter();

    this.initializePlugins();
  }

  /**
   * The exposed instance of the `Main` class.
   *
   * @access private
   */

  /**
   * Activates the minimap package.
   */

  _createClass(Main, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      if (this.active) {
        return;
      }
      if (!CompositeDisposable) {
        var _require2 = require('atom');

        Emitter = _require2.Emitter;
        CompositeDisposable = _require2.CompositeDisposable;
      }

      this.subscriptionsOfCommands = atom.commands.add('atom-workspace', {
        'minimap:toggle': function minimapToggle() {
          _this.toggle();
        },
        'minimap:generate-coffee-plugin': function minimapGenerateCoffeePlugin() {
          _this.generatePlugin('coffee');
        },
        'minimap:generate-javascript-plugin': function minimapGenerateJavascriptPlugin() {
          _this.generatePlugin('javascript');
        },
        'minimap:generate-babel-plugin': function minimapGenerateBabelPlugin() {
          _this.generatePlugin('babel');
        }
      });

      this.editorsMinimaps = new Map();
      this.subscriptions = new CompositeDisposable();
      this.active = true;

      if (atom.config.get('minimap.autoToggle')) {
        this.toggle();
      }
    }

    /**
     * Returns a {MinimapElement} for the passed-in model if it's a {Minimap}.
     *
     * @param {*} model the model for which returning a view
     * @return {MinimapElement}
     */
  }, {
    key: 'minimapViewProvider',
    value: function minimapViewProvider(model) {
      if (!Minimap) {
        Minimap = require('./minimap');
      }

      if (model instanceof Minimap) {
        if (!MinimapElement) {
          MinimapElement = require('./minimap-element');
        }

        var element = new MinimapElement();
        element.setModel(model);
        return element;
      }
    }

    /**
     * Deactivates the minimap package.
     */
  }, {
    key: 'deactivate',
    value: function deactivate() {
      var _this2 = this;

      if (!this.active) {
        return;
      }

      this.deactivateAllPlugins();

      if (this.editorsMinimaps) {
        this.editorsMinimaps.forEach(function (value, key) {
          value.destroy();
          _this2.editorsMinimaps['delete'](key);
        });
      }

      this.subscriptions.dispose();
      this.subscriptions = null;
      this.subscriptionsOfCommands.dispose();
      this.subscriptionsOfCommands = null;
      this.editorsMinimaps = undefined;
      this.toggled = false;
      this.active = false;
    }
  }, {
    key: 'getConfigSchema',
    value: function getConfigSchema() {
      return this.config ? this.config : atom.packages.getLoadedPackage('minimap').metadata.configSchema;
    }

    /**
     * Toggles the minimap display.
     */
  }, {
    key: 'toggle',
    value: function toggle() {
      var _this3 = this;

      if (!this.active) {
        return;
      }

      if (this.toggled) {
        this.toggled = false;

        if (this.editorsMinimaps) {
          this.editorsMinimaps.forEach(function (value, key) {
            value.destroy();
            _this3.editorsMinimaps['delete'](key);
          });
        }
        this.subscriptions.dispose();
      } else {
        this.toggled = true;
        this.initSubscriptions();
      }
    }

    /**
     * Opens the plugin generation view.
     *
     * @param  {string} template the name of the template to use
     */
  }, {
    key: 'generatePlugin',
    value: function generatePlugin(template) {
      if (!MinimapPluginGeneratorElement) {
        MinimapPluginGeneratorElement = require('./minimap-plugin-generator-element');
      }
      var view = new MinimapPluginGeneratorElement();
      view.template = template;
      view.attach();
    }

    /**
     * Registers a callback to listen to the `did-activate` event of the package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidActivate',
    value: function onDidActivate(callback) {
      return this.emitter.on('did-activate', callback);
    }

    /**
     * Registers a callback to listen to the `did-deactivate` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidDeactivate',
    value: function onDidDeactivate(callback) {
      return this.emitter.on('did-deactivate', callback);
    }

    /**
     * Registers a callback to listen to the `did-create-minimap` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidCreateMinimap',
    value: function onDidCreateMinimap(callback) {
      return this.emitter.on('did-create-minimap', callback);
    }

    /**
     * Registers a callback to listen to the `did-add-plugin` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidAddPlugin',
    value: function onDidAddPlugin(callback) {
      return this.emitter.on('did-add-plugin', callback);
    }

    /**
     * Registers a callback to listen to the `did-remove-plugin` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidRemovePlugin',
    value: function onDidRemovePlugin(callback) {
      return this.emitter.on('did-remove-plugin', callback);
    }

    /**
     * Registers a callback to listen to the `did-activate-plugin` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidActivatePlugin',
    value: function onDidActivatePlugin(callback) {
      return this.emitter.on('did-activate-plugin', callback);
    }

    /**
     * Registers a callback to listen to the `did-deactivate-plugin` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidDeactivatePlugin',
    value: function onDidDeactivatePlugin(callback) {
      return this.emitter.on('did-deactivate-plugin', callback);
    }

    /**
     * Registers a callback to listen to the `did-change-plugin-order` event of
     * the package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangePluginOrder',
    value: function onDidChangePluginOrder(callback) {
      return this.emitter.on('did-change-plugin-order', callback);
    }

    /**
     * Returns the `Minimap` class
     *
     * @return {Function} the `Minimap` class constructor
     */
  }, {
    key: 'minimapClass',
    value: function minimapClass() {
      if (!Minimap) {
        Minimap = require('./minimap');
      }
      return Minimap;
    }

    /**
     * Returns the `Minimap` object associated to the passed-in
     * `TextEditorElement`.
     *
     * @param  {TextEditorElement} editorElement a text editor element
     * @return {Minimap} the associated minimap
     */
  }, {
    key: 'minimapForEditorElement',
    value: function minimapForEditorElement(editorElement) {
      if (!editorElement) {
        return;
      }
      return this.minimapForEditor(editorElement.getModel());
    }

    /**
     * Returns the `Minimap` object associated to the passed-in
     * `TextEditor`.
     *
     * @param  {TextEditor} textEditor a text editor
     * @return {Minimap} the associated minimap
     */
  }, {
    key: 'minimapForEditor',
    value: function minimapForEditor(textEditor) {
      var _this4 = this;

      if (!textEditor) {
        return;
      }

      var minimap = this.editorsMinimaps.get(textEditor);

      if (!minimap) {
        if (!Minimap) {
          Minimap = require('./minimap');
        }

        minimap = new Minimap({ textEditor: textEditor });
        this.editorsMinimaps.set(textEditor, minimap);

        var editorSubscription = textEditor.onDidDestroy(function () {
          var minimaps = _this4.editorsMinimaps;
          if (minimaps) {
            minimaps['delete'](textEditor);
          }
          editorSubscription.dispose();
        });
      }

      return minimap;
    }

    /**
     * Returns a new stand-alone {Minimap} for the passed-in `TextEditor`.
     *
     * @param  {TextEditor} textEditor a text editor instance to create
     *                                 a minimap for
     * @return {Minimap} a new stand-alone Minimap for the passed-in editor
     */
  }, {
    key: 'standAloneMinimapForEditor',
    value: function standAloneMinimapForEditor(textEditor) {
      if (!textEditor) {
        return;
      }
      if (!Minimap) {
        Minimap = require('./minimap');
      }

      return new Minimap({
        textEditor: textEditor,
        standAlone: true
      });
    }

    /**
     * Returns the `Minimap` associated to the active `TextEditor`.
     *
     * @return {Minimap} the active Minimap
     */
  }, {
    key: 'getActiveMinimap',
    value: function getActiveMinimap() {
      return this.minimapForEditor(atom.workspace.getActiveTextEditor());
    }

    /**
     * Calls a function for each present and future minimaps.
     *
     * @param  {function(minimap:Minimap):void} iterator a function to call with
     *                                                   the existing and future
     *                                                   minimaps
     * @return {Disposable} a disposable to unregister the observer
     */
  }, {
    key: 'observeMinimaps',
    value: function observeMinimaps(iterator) {
      if (!iterator) {
        return;
      }

      if (this.editorsMinimaps) {
        this.editorsMinimaps.forEach(function (minimap) {
          iterator(minimap);
        });
      }
      return this.onDidCreateMinimap(function (minimap) {
        iterator(minimap);
      });
    }

    /**
     * Registers to the `observeTextEditors` method.
     *
     * @access private
     */
  }, {
    key: 'initSubscriptions',
    value: function initSubscriptions() {
      var _this5 = this;

      this.subscriptions.add(atom.workspace.observeTextEditors(function (textEditor) {
        var minimap = _this5.minimapForEditor(textEditor);
        var minimapElement = atom.views.getView(minimap);

        _this5.emitter.emit('did-create-minimap', minimap);

        minimapElement.attach();
      }));
    }
  }]);

  var _Main = Main;
  Main = (0, _decoratorsInclude2['default'])(_mixinsPluginManagement2['default'])(Main) || Main;
  return Main;
})();

exports['default'] = new Main();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7b0JBS2lCLE1BQU07Ozs7aUNBVUgsc0JBQXNCOzs7O3NDQUNiLDRCQUE0Qjs7OztBQWhCekQsV0FBVyxDQUFBOztBQU9YLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7QUFDdEIsUUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ3ZDLFdBQU8sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFLLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsa0JBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7R0FDcEYsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsRUFBSztBQUNoQixXQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7R0FDeEIsQ0FBQyxDQUFBO0NBQ0g7O0FBS0QsSUFBSSxPQUFPLFlBQUE7SUFBRSxtQkFBbUIsWUFBQTtJQUFFLE9BQU8sWUFBQTtJQUFFLGNBQWMsWUFBQTtJQUFFLDZCQUE2QixZQUFBLENBQUE7Ozs7Ozs7OztJQVNsRixJQUFJOzs7Ozs7O0FBTUksV0FOUixJQUFJLEdBTU87OztBQUNiLFFBQUksQ0FBQyxPQUFPLEVBQUU7cUJBQW9DLE9BQU8sQ0FBQyxNQUFNLENBQUM7O0FBQS9DLGFBQU8sWUFBUCxPQUFPO0FBQUUseUJBQW1CLFlBQW5CLG1CQUFtQjtLQUFzQjs7Ozs7Ozs7QUFRcEUsUUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7Ozs7Ozs7QUFPbkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7Ozs7Ozs7O0FBUXBCLFFBQUks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LElBQUk7OztxQkFvWEssSUFBSSxJQUFJLEVBQUUiLCJmaWxlIjoiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbi8qXG4gIFRoZSBmb2xsb3dpbmcgaGFjayBjbGVhcnMgdGhlIHJlcXVpcmUgY2FjaGUgb2YgYWxsIHRoZSBwYXRocyB0byB0aGUgbWluaW1hcCB3aGVuIHRoaXMgZmlsZSBpcyBsYW9kZWQuIEl0IHNob3VsZCBwcmV2ZW50cyBlcnJvcnMgb2YgcGFydGlhbCByZWxvYWRpbmcgYWZ0ZXIgYW4gdXBkYXRlLlxuICovXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG5pZiAoIWF0b20uaW5TcGVjTW9kZSgpKSB7XG4gIE9iamVjdC5rZXlzKHJlcXVpcmUuY2FjaGUpLmZpbHRlcigocCkgPT4ge1xuICAgIHJldHVybiBwICE9PSBfX2ZpbGVuYW1lICYmIHAuaW5kZXhPZihwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4nKSArIHBhdGguc2VwKSA+IC0xXG4gIH0pLmZvckVhY2goKHApID0+IHtcbiAgICBkZWxldGUgcmVxdWlyZS5jYWNoZVtwXVxuICB9KVxufVxuXG5pbXBvcnQgaW5jbHVkZSBmcm9tICcuL2RlY29yYXRvcnMvaW5jbHVkZSdcbmltcG9ydCBQbHVnaW5NYW5hZ2VtZW50IGZyb20gJy4vbWl4aW5zL3BsdWdpbi1tYW5hZ2VtZW50J1xuXG5sZXQgRW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZSwgTWluaW1hcCwgTWluaW1hcEVsZW1lbnQsIE1pbmltYXBQbHVnaW5HZW5lcmF0b3JFbGVtZW50XG5cbi8qKlxuICogVGhlIGBNaW5pbWFwYCBwYWNrYWdlIHByb3ZpZGVzIGFuIGVhZ2xlLWV5ZSB2aWV3IG9mIHRleHQgYnVmZmVycy5cbiAqXG4gKiBJdCBhbHNvIHByb3ZpZGVzIEFQSSBmb3IgcGx1Z2luIHBhY2thZ2VzIHRoYXQgd2FudCB0byBpbnRlcmFjdCB3aXRoIHRoZVxuICogbWluaW1hcCBhbmQgYmUgYXZhaWxhYmxlIHRvIHRoZSB1c2VyIHRocm91Z2ggdGhlIG1pbmltYXAgc2V0dGluZ3MuXG4gKi9cbkBpbmNsdWRlKFBsdWdpbk1hbmFnZW1lbnQpXG5jbGFzcyBNYWluIHtcbiAgLyoqXG4gICAqIFVzZWQgb25seSBhdCBleHBvcnQgdGltZS5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgaWYgKCFFbWl0dGVyKSB7ICh7RW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlKCdhdG9tJykpIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBhY3RpdmF0aW9uIHN0YXRlIG9mIHRoZSBwYWNrYWdlLlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZVxuICAgIC8qKlxuICAgICAqIFRoZSB0b2dnbGUgc3RhdGUgb2YgdGhlIHBhY2thZ2UuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnRvZ2dsZWQgPSBmYWxzZVxuICAgIC8qKlxuICAgICAqIFRoZSBgTWFwYCB3aGVyZSBNaW5pbWFwIGluc3RhbmNlcyBhcmUgc3RvcmVkIHdpdGggdGhlIHRleHQgZWRpdG9yIHRoZXlcbiAgICAgKiB0YXJnZXQgYXMga2V5LlxuICAgICAqXG4gICAgICogQHR5cGUge01hcH1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmVkaXRvcnNNaW5pbWFwcyA9IG51bGxcbiAgICAvKipcbiAgICAgKiBUaGUgY29tcG9zaXRlIGRpc3Bvc2FibGUgdGhhdCBzdG9yZXMgdGhlIHBhY2thZ2UncyBzdWJzY3JpcHRpb25zLlxuICAgICAqXG4gICAgICogQHR5cGUge0NvbXBvc2l0ZURpc3Bvc2FibGV9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBkaXNwb3NhYmxlIHRoYXQgc3RvcmVzIHRoZSBwYWNrYWdlJ3MgY29tbWFuZHMgc3Vic2NyaXB0aW9uLlxuICAgICAqXG4gICAgICogQHR5cGUge0Rpc3Bvc2FibGV9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zT2ZDb21tYW5kcyA9IG51bGxcblxuICAgIC8qKlxuICAgICAqIFRoZSBwYWNrYWdlJ3MgZXZlbnRzIGVtaXR0ZXIuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7RW1pdHRlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG5cbiAgICB0aGlzLmluaXRpYWxpemVQbHVnaW5zKClcbiAgfVxuXG4gIC8qKlxuICAgKiBBY3RpdmF0ZXMgdGhlIG1pbmltYXAgcGFja2FnZS5cbiAgICovXG4gIGFjdGl2YXRlICgpIHtcbiAgICBpZiAodGhpcy5hY3RpdmUpIHsgcmV0dXJuIH1cbiAgICBpZiAoIUNvbXBvc2l0ZURpc3Bvc2FibGUpIHsgKHtFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUoJ2F0b20nKSkgfVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zT2ZDb21tYW5kcyA9IGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdtaW5pbWFwOnRvZ2dsZSc6ICgpID0+IHtcbiAgICAgICAgdGhpcy50b2dnbGUoKVxuICAgICAgfSxcbiAgICAgICdtaW5pbWFwOmdlbmVyYXRlLWNvZmZlZS1wbHVnaW4nOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVQbHVnaW4oJ2NvZmZlZScpXG4gICAgICB9LFxuICAgICAgJ21pbmltYXA6Z2VuZXJhdGUtamF2YXNjcmlwdC1wbHVnaW4nOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVQbHVnaW4oJ2phdmFzY3JpcHQnKVxuICAgICAgfSxcbiAgICAgICdtaW5pbWFwOmdlbmVyYXRlLWJhYmVsLXBsdWdpbic6ICgpID0+IHtcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVBsdWdpbignYmFiZWwnKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmVkaXRvcnNNaW5pbWFwcyA9IG5ldyBNYXAoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWVcblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ21pbmltYXAuYXV0b1RvZ2dsZScpKSB7IHRoaXMudG9nZ2xlKCkgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSB7TWluaW1hcEVsZW1lbnR9IGZvciB0aGUgcGFzc2VkLWluIG1vZGVsIGlmIGl0J3MgYSB7TWluaW1hcH0uXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gbW9kZWwgdGhlIG1vZGVsIGZvciB3aGljaCByZXR1cm5pbmcgYSB2aWV3XG4gICAqIEByZXR1cm4ge01pbmltYXBFbGVtZW50fVxuICAgKi9cbiAgbWluaW1hcFZpZXdQcm92aWRlciAobW9kZWwpIHtcbiAgICBpZiAoIU1pbmltYXApIHsgTWluaW1hcCA9IHJlcXVpcmUoJy4vbWluaW1hcCcpIH1cblxuICAgIGlmIChtb2RlbCBpbnN0YW5jZW9mIE1pbmltYXApIHtcbiAgICAgIGlmICghTWluaW1hcEVsZW1lbnQpIHsgTWluaW1hcEVsZW1lbnQgPSByZXF1aXJlKCcuL21pbmltYXAtZWxlbWVudCcpIH1cblxuICAgICAgY29uc3QgZWxlbWVudCA9IG5ldyBNaW5pbWFwRWxlbWVudCgpXG4gICAgICBlbGVtZW50LnNldE1vZGVsKG1vZGVsKVxuICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVhY3RpdmF0ZXMgdGhlIG1pbmltYXAgcGFja2FnZS5cbiAgICovXG4gIGRlYWN0aXZhdGUgKCkge1xuICAgIGlmICghdGhpcy5hY3RpdmUpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMuZGVhY3RpdmF0ZUFsbFBsdWdpbnMoKVxuXG4gICAgaWYgKHRoaXMuZWRpdG9yc01pbmltYXBzKSB7XG4gICAgICB0aGlzLmVkaXRvcnNNaW5pbWFwcy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIHZhbHVlLmRlc3Ryb3koKVxuICAgICAgICB0aGlzLmVkaXRvcnNNaW5pbWFwcy5kZWxldGUoa2V5KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIHRoaXMuc3Vic2NyaXB0aW9uc09mQ29tbWFuZHMuZGlzcG9zZSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zT2ZDb21tYW5kcyA9IG51bGxcbiAgICB0aGlzLmVkaXRvcnNNaW5pbWFwcyA9IHVuZGVmaW5lZFxuICAgIHRoaXMudG9nZ2xlZCA9IGZhbHNlXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZVxuICB9XG5cbiAgZ2V0Q29uZmlnU2NoZW1hICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWdcbiAgICAgID8gdGhpcy5jb25maWdcbiAgICAgIDogYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKCdtaW5pbWFwJykubWV0YWRhdGEuY29uZmlnU2NoZW1hXG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgbWluaW1hcCBkaXNwbGF5LlxuICAgKi9cbiAgdG9nZ2xlICgpIHtcbiAgICBpZiAoIXRoaXMuYWN0aXZlKSB7IHJldHVybiB9XG5cbiAgICBpZiAodGhpcy50b2dnbGVkKSB7XG4gICAgICB0aGlzLnRvZ2dsZWQgPSBmYWxzZVxuXG4gICAgICBpZiAodGhpcy5lZGl0b3JzTWluaW1hcHMpIHtcbiAgICAgICAgdGhpcy5lZGl0b3JzTWluaW1hcHMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgIHZhbHVlLmRlc3Ryb3koKVxuICAgICAgICAgIHRoaXMuZWRpdG9yc01pbmltYXBzLmRlbGV0ZShrZXkpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudG9nZ2xlZCA9IHRydWVcbiAgICAgIHRoaXMuaW5pdFN1YnNjcmlwdGlvbnMoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyB0aGUgcGx1Z2luIGdlbmVyYXRpb24gdmlldy5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSB0ZW1wbGF0ZSB0aGUgbmFtZSBvZiB0aGUgdGVtcGxhdGUgdG8gdXNlXG4gICAqL1xuICBnZW5lcmF0ZVBsdWdpbiAodGVtcGxhdGUpIHtcbiAgICBpZiAoIU1pbmltYXBQbHVnaW5HZW5lcmF0b3JFbGVtZW50KSB7XG4gICAgICBNaW5pbWFwUGx1Z2luR2VuZXJhdG9yRWxlbWVudCA9IHJlcXVpcmUoJy4vbWluaW1hcC1wbHVnaW4tZ2VuZXJhdG9yLWVsZW1lbnQnKVxuICAgIH1cbiAgICB2YXIgdmlldyA9IG5ldyBNaW5pbWFwUGx1Z2luR2VuZXJhdG9yRWxlbWVudCgpXG4gICAgdmlldy50ZW1wbGF0ZSA9IHRlbXBsYXRlXG4gICAgdmlldy5hdHRhY2goKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGxpc3RlbiB0byB0aGUgYGRpZC1hY3RpdmF0ZWAgZXZlbnQgb2YgdGhlIHBhY2thZ2UuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKGV2ZW50Ok9iamVjdCk6dm9pZH0gY2FsbGJhY2sgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkQWN0aXZhdGUgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWFjdGl2YXRlJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gbGlzdGVuIHRvIHRoZSBgZGlkLWRlYWN0aXZhdGVgIGV2ZW50IG9mIHRoZVxuICAgKiBwYWNrYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZERlYWN0aXZhdGUgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRlYWN0aXZhdGUnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBsaXN0ZW4gdG8gdGhlIGBkaWQtY3JlYXRlLW1pbmltYXBgIGV2ZW50IG9mIHRoZVxuICAgKiBwYWNrYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZENyZWF0ZU1pbmltYXAgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNyZWF0ZS1taW5pbWFwJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gbGlzdGVuIHRvIHRoZSBgZGlkLWFkZC1wbHVnaW5gIGV2ZW50IG9mIHRoZVxuICAgKiBwYWNrYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZEFkZFBsdWdpbiAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtYWRkLXBsdWdpbicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGxpc3RlbiB0byB0aGUgYGRpZC1yZW1vdmUtcGx1Z2luYCBldmVudCBvZiB0aGVcbiAgICogcGFja2FnZS5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZXZlbnQ6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRSZW1vdmVQbHVnaW4gKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXJlbW92ZS1wbHVnaW4nLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBsaXN0ZW4gdG8gdGhlIGBkaWQtYWN0aXZhdGUtcGx1Z2luYCBldmVudCBvZiB0aGVcbiAgICogcGFja2FnZS5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZXZlbnQ6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRBY3RpdmF0ZVBsdWdpbiAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtYWN0aXZhdGUtcGx1Z2luJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gbGlzdGVuIHRvIHRoZSBgZGlkLWRlYWN0aXZhdGUtcGx1Z2luYCBldmVudCBvZiB0aGVcbiAgICogcGFja2FnZS5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZXZlbnQ6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWREZWFjdGl2YXRlUGx1Z2luIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kZWFjdGl2YXRlLXBsdWdpbicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGxpc3RlbiB0byB0aGUgYGRpZC1jaGFuZ2UtcGx1Z2luLW9yZGVyYCBldmVudCBvZlxuICAgKiB0aGUgcGFja2FnZS5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZXZlbnQ6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRDaGFuZ2VQbHVnaW5PcmRlciAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXBsdWdpbi1vcmRlcicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBNaW5pbWFwYCBjbGFzc1xuICAgKlxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGBNaW5pbWFwYCBjbGFzcyBjb25zdHJ1Y3RvclxuICAgKi9cbiAgbWluaW1hcENsYXNzICgpIHtcbiAgICBpZiAoIU1pbmltYXApIHsgTWluaW1hcCA9IHJlcXVpcmUoJy4vbWluaW1hcCcpIH1cbiAgICByZXR1cm4gTWluaW1hcFxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBNaW5pbWFwYCBvYmplY3QgYXNzb2NpYXRlZCB0byB0aGUgcGFzc2VkLWluXG4gICAqIGBUZXh0RWRpdG9yRWxlbWVudGAuXG4gICAqXG4gICAqIEBwYXJhbSAge1RleHRFZGl0b3JFbGVtZW50fSBlZGl0b3JFbGVtZW50IGEgdGV4dCBlZGl0b3IgZWxlbWVudFxuICAgKiBAcmV0dXJuIHtNaW5pbWFwfSB0aGUgYXNzb2NpYXRlZCBtaW5pbWFwXG4gICAqL1xuICBtaW5pbWFwRm9yRWRpdG9yRWxlbWVudCAoZWRpdG9yRWxlbWVudCkge1xuICAgIGlmICghZWRpdG9yRWxlbWVudCkgeyByZXR1cm4gfVxuICAgIHJldHVybiB0aGlzLm1pbmltYXBGb3JFZGl0b3IoZWRpdG9yRWxlbWVudC5nZXRNb2RlbCgpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBNaW5pbWFwYCBvYmplY3QgYXNzb2NpYXRlZCB0byB0aGUgcGFzc2VkLWluXG4gICAqIGBUZXh0RWRpdG9yYC5cbiAgICpcbiAgICogQHBhcmFtICB7VGV4dEVkaXRvcn0gdGV4dEVkaXRvciBhIHRleHQgZWRpdG9yXG4gICAqIEByZXR1cm4ge01pbmltYXB9IHRoZSBhc3NvY2lhdGVkIG1pbmltYXBcbiAgICovXG4gIG1pbmltYXBGb3JFZGl0b3IgKHRleHRFZGl0b3IpIHtcbiAgICBpZiAoIXRleHRFZGl0b3IpIHsgcmV0dXJuIH1cblxuICAgIGxldCBtaW5pbWFwID0gdGhpcy5lZGl0b3JzTWluaW1hcHMuZ2V0KHRleHRFZGl0b3IpXG5cbiAgICBpZiAoIW1pbmltYXApIHtcbiAgICAgIGlmICghTWluaW1hcCkgeyBNaW5pbWFwID0gcmVxdWlyZSgnLi9taW5pbWFwJykgfVxuXG4gICAgICBtaW5pbWFwID0gbmV3IE1pbmltYXAoe3RleHRFZGl0b3J9KVxuICAgICAgdGhpcy5lZGl0b3JzTWluaW1hcHMuc2V0KHRleHRFZGl0b3IsIG1pbmltYXApXG5cbiAgICAgIHZhciBlZGl0b3JTdWJzY3JpcHRpb24gPSB0ZXh0RWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgIGxldCBtaW5pbWFwcyA9IHRoaXMuZWRpdG9yc01pbmltYXBzXG4gICAgICAgIGlmIChtaW5pbWFwcykgeyBtaW5pbWFwcy5kZWxldGUodGV4dEVkaXRvcikgfVxuICAgICAgICBlZGl0b3JTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiBtaW5pbWFwXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIG5ldyBzdGFuZC1hbG9uZSB7TWluaW1hcH0gZm9yIHRoZSBwYXNzZWQtaW4gYFRleHRFZGl0b3JgLlxuICAgKlxuICAgKiBAcGFyYW0gIHtUZXh0RWRpdG9yfSB0ZXh0RWRpdG9yIGEgdGV4dCBlZGl0b3IgaW5zdGFuY2UgdG8gY3JlYXRlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYSBtaW5pbWFwIGZvclxuICAgKiBAcmV0dXJuIHtNaW5pbWFwfSBhIG5ldyBzdGFuZC1hbG9uZSBNaW5pbWFwIGZvciB0aGUgcGFzc2VkLWluIGVkaXRvclxuICAgKi9cbiAgc3RhbmRBbG9uZU1pbmltYXBGb3JFZGl0b3IgKHRleHRFZGl0b3IpIHtcbiAgICBpZiAoIXRleHRFZGl0b3IpIHsgcmV0dXJuIH1cbiAgICBpZiAoIU1pbmltYXApIHsgTWluaW1hcCA9IHJlcXVpcmUoJy4vbWluaW1hcCcpIH1cblxuICAgIHJldHVybiBuZXcgTWluaW1hcCh7XG4gICAgICB0ZXh0RWRpdG9yOiB0ZXh0RWRpdG9yLFxuICAgICAgc3RhbmRBbG9uZTogdHJ1ZVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYE1pbmltYXBgIGFzc29jaWF0ZWQgdG8gdGhlIGFjdGl2ZSBgVGV4dEVkaXRvcmAuXG4gICAqXG4gICAqIEByZXR1cm4ge01pbmltYXB9IHRoZSBhY3RpdmUgTWluaW1hcFxuICAgKi9cbiAgZ2V0QWN0aXZlTWluaW1hcCAoKSB7XG4gICAgcmV0dXJuIHRoaXMubWluaW1hcEZvckVkaXRvcihhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXG4gIH1cblxuICAvKipcbiAgICogQ2FsbHMgYSBmdW5jdGlvbiBmb3IgZWFjaCBwcmVzZW50IGFuZCBmdXR1cmUgbWluaW1hcHMuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKG1pbmltYXA6TWluaW1hcCk6dm9pZH0gaXRlcmF0b3IgYSBmdW5jdGlvbiB0byBjYWxsIHdpdGhcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZXhpc3RpbmcgYW5kIGZ1dHVyZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltYXBzXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byB1bnJlZ2lzdGVyIHRoZSBvYnNlcnZlclxuICAgKi9cbiAgb2JzZXJ2ZU1pbmltYXBzIChpdGVyYXRvcikge1xuICAgIGlmICghaXRlcmF0b3IpIHsgcmV0dXJuIH1cblxuICAgIGlmICh0aGlzLmVkaXRvcnNNaW5pbWFwcykge1xuICAgICAgdGhpcy5lZGl0b3JzTWluaW1hcHMuZm9yRWFjaCgobWluaW1hcCkgPT4geyBpdGVyYXRvcihtaW5pbWFwKSB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5vbkRpZENyZWF0ZU1pbmltYXAoKG1pbmltYXApID0+IHsgaXRlcmF0b3IobWluaW1hcCkgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgdG8gdGhlIGBvYnNlcnZlVGV4dEVkaXRvcnNgIG1ldGhvZC5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBpbml0U3Vic2NyaXB0aW9ucyAoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKHRleHRFZGl0b3IpID0+IHtcbiAgICAgIGxldCBtaW5pbWFwID0gdGhpcy5taW5pbWFwRm9yRWRpdG9yKHRleHRFZGl0b3IpXG4gICAgICBsZXQgbWluaW1hcEVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcobWluaW1hcClcblxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jcmVhdGUtbWluaW1hcCcsIG1pbmltYXApXG5cbiAgICAgIG1pbmltYXBFbGVtZW50LmF0dGFjaCgpXG4gICAgfSkpXG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgZXhwb3NlZCBpbnN0YW5jZSBvZiB0aGUgYE1haW5gIGNsYXNzLlxuICpcbiAqIEBhY2Nlc3MgcHJpdmF0ZVxuICovXG5leHBvcnQgZGVmYXVsdCBuZXcgTWFpbigpXG4iXX0=