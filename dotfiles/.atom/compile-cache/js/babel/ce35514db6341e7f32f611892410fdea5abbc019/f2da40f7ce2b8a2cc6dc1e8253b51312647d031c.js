var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _configTernConfigDocs = require('../config/tern-config-docs');

var _configTernConfigDocs2 = _interopRequireDefault(_configTernConfigDocs);

var _configTernPluginsDefintionsJs = require('../config/tern-plugins-defintions.js');

var _configTernPluginsDefintionsJs2 = _interopRequireDefault(_configTernPluginsDefintionsJs);

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsView = require('./atom-ternjs-view');

var _atomTernjsView2 = _interopRequireDefault(_atomTernjsView);

'use babel';

var templateContainer = '\n\n  <div>\n    <div class="container">\n      <h1 class="title"></h1>\n      <div class="content"></div>\n      <button class="btn atom-ternjs-config-close">Save &amp; Restart Server</button>\n      <button class="btn atom-ternjs-config-close">Cancel</button>\n    </div>\n  </div>\n';

var ConfigView = (function (_TernView) {
  _inherits(ConfigView, _TernView);

  function ConfigView() {
    _classCallCheck(this, ConfigView);

    _get(Object.getPrototypeOf(ConfigView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ConfigView, [{
    key: 'createdCallback',
    value: function createdCallback() {

      this.getModel();

      this.classList.add('atom-ternjs-config');
      this.innerHTML = templateContainer;

      this.containerElement = this.querySelector('.container');
      this.contentElement = this.querySelector('.content');
      this.titleElement = this.querySelector('.title');
      this.buttonClose = this.querySelector('.atom-ternjs-config-close:first-of-type');
      this.buttonCancel = this.querySelector('.atom-ternjs-config-close:last-of-type');
    }
  }, {
    key: 'buildOptionsMarkup',
    value: function buildOptionsMarkup() {

      var projectDir = '';
      var projectConfig = this.getModel().config;

      if (_atomTernjsManager2['default'].client) {

        projectDir = _atomTernjsManager2['default'].client.projectDir;
      }

      this.titleElement.innerHTML = projectDir;

      this.contentElement.appendChild(this.buildRadio('ecmaVersion'));
      this.contentElement.appendChild(this.buildlibs('libs', projectConfig.libs));
      this.contentElement.appendChild(this.buildStringArray(projectConfig.loadEagerly, 'loadEagerly'));
      this.contentElement.appendChild(this.buildStringArray(projectConfig.dontLoad, 'dontLoad'));
      this.contentElement.appendChild(this.buildPlugins('plugins', projectConfig.plugins));
    }
  }, {
    key: 'buildSection',
    value: function buildSection(sectionTitle) {

      var section = document.createElement('section');
      section.classList.add(sectionTitle);

      var header = document.createElement('h2');
      header.innerHTML = sectionTitle;

      section.appendChild(header);

      var docs = _configTernConfigDocs2['default'][sectionTitle].doc;

      if (docs) {

        var doc = document.createElement('p');
        doc.innerHTML = docs;

        section.appendChild(doc);
      }

      return section;
    }
  }, {
    key: 'buildRadio',
    value: function buildRadio(sectionTitle) {
      var _this = this;

      var section = this.buildSection(sectionTitle);

      for (var key of Object.keys(this.getModel().config.ecmaVersions)) {

        var inputWrapper = document.createElement('div');
        inputWrapper.classList.add('input-wrapper');

        var label = document.createElement('span');
        label.innerHTML = key;

        var radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'ecmaVersions';
        radio.checked = this.getModel().config.ecmaVersions[key];
        radio.__ternjs_key = key;

        radio.addEventListener('change', function (e) {

          for (var _key of Object.keys(_this.getModel().config.ecmaVersions)) {

            _this.getModel().config.ecmaVersions[_key] = false;
          }

          _this.getModel().config.ecmaVersions[e.target.__ternjs_key] = e.target.checked;
        }, false);

        inputWrapper.appendChild(label);
        inputWrapper.appendChild(radio);
        section.appendChild(inputWrapper);
      }

      return section;
    }
  }, {
    key: 'buildStringArray',
    value: function buildStringArray(obj, sectionTitle) {

      var section = this.buildSection(sectionTitle);

      for (var path of obj) {

        section.appendChild(this.createInputWrapper(path, sectionTitle));
      }

      if (obj.length === 0) {

        section.appendChild(this.createInputWrapper(null, sectionTitle));
      }

      return section;
    }
  }, {
    key: 'buildPlugins',
    value: function buildPlugins(sectionTitle, availablePlugins) {

      var section = this.buildSection(sectionTitle);

      for (var key of Object.keys(availablePlugins)) {

        var wrapper = document.createElement('p');
        wrapper.appendChild(this.buildBoolean(key, availablePlugins));
        var doc = document.createElement('span');
        doc.innerHTML = _configTernPluginsDefintionsJs2['default'][key] && _configTernPluginsDefintionsJs2['default'][key].doc;
        wrapper.appendChild(doc);
        section.appendChild(wrapper);
      }

      return section;
    }
  }, {
    key: 'buildlibs',
    value: function buildlibs(sectionTitle, availableLibs) {

      var section = this.buildSection(sectionTitle);

      for (var key of Object.keys(availableLibs)) {

        section.appendChild(this.buildBoolean(key, availableLibs));
      }

      return section;
    }
  }, {
    key: 'buildBoolean',
    value: function buildBoolean(option, options) {

      var inputWrapper = document.createElement('div');
      var label = document.createElement('span');
      var checkbox = document.createElement('input');

      inputWrapper.classList.add('input-wrapper');
      label.innerHTML = option;
      checkbox.type = 'checkbox';
      checkbox.checked = options[option]._active;
      checkbox.__ternjs_key = option;
      checkbox.addEventListener('change', function (e) {

        options[e.target.__ternjs_key]._active = e.target.checked;
      }, false);

      inputWrapper.appendChild(label);
      inputWrapper.appendChild(checkbox);

      return inputWrapper;
    }
  }, {
    key: 'createInputWrapper',
    value: function createInputWrapper(path, sectionTitle) {

      var inputWrapper = document.createElement('div');
      var editor = this.createTextEditor(path);

      inputWrapper.classList.add('input-wrapper');
      editor.__ternjs_section = sectionTitle;
      inputWrapper.appendChild(editor);
      inputWrapper.appendChild(this.createAdd(sectionTitle));
      inputWrapper.appendChild(this.createSub(editor));

      return inputWrapper;
    }
  }, {
    key: 'createSub',
    value: function createSub(editor) {
      var _this2 = this;

      var sub = document.createElement('span');
      sub.classList.add('sub');
      sub.classList.add('inline-block');
      sub.classList.add('status-removed');
      sub.classList.add('icon');
      sub.classList.add('icon-diff-removed');

      sub.addEventListener('click', function (e) {

        _this2.getModel().removeEditor(editor);
        var inputWrapper = e.target.closest('.input-wrapper');
        inputWrapper.parentNode.removeChild(inputWrapper);
      }, false);

      return sub;
    }
  }, {
    key: 'createAdd',
    value: function createAdd(sectionTitle) {
      var _this3 = this;

      var add = document.createElement('span');
      add.classList.add('add');
      add.classList.add('inline-block');
      add.classList.add('status-added');
      add.classList.add('icon');
      add.classList.add('icon-diff-added');
      add.addEventListener('click', function (e) {

        e.target.closest('section').appendChild(_this3.createInputWrapper(null, sectionTitle));
      }, false);

      return add;
    }
  }, {
    key: 'createTextEditor',
    value: function createTextEditor(path) {

      var item = document.createElement('atom-text-editor');
      item.setAttribute('mini', true);

      if (path) {

        item.getModel().getBuffer().setText(path);
      }

      this.getModel().editors.push(item);

      return item;
    }
  }, {
    key: 'removeContent',
    value: function removeContent() {

      this.contentElement.innerHTML = '';
    }
  }, {
    key: 'getClose',
    value: function getClose() {

      return this.buttonClose;
    }
  }, {
    key: 'getCancel',
    value: function getCancel() {

      return this.buttonCancel;
    }
  }]);

  return ConfigView;
})(_atomTernjsView2['default']);

module.exports = document.registerElement('atom-ternjs-config', {

  prototype: ConfigView.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1jb25maWctdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29DQUUyQiw0QkFBNEI7Ozs7NkNBQ3pCLHNDQUFzQzs7OztpQ0FDaEQsdUJBQXVCOzs7OzhCQUN0QixvQkFBb0I7Ozs7QUFMekMsV0FBVyxDQUFDOztBQU9aLElBQU0saUJBQWlCLGtTQVV0QixDQUFDOztJQUVJLFVBQVU7WUFBVixVQUFVOztXQUFWLFVBQVU7MEJBQVYsVUFBVTs7K0JBQVYsVUFBVTs7O2VBQVYsVUFBVTs7V0FFQywyQkFBRzs7QUFFaEIsVUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOztBQUVoQixVQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3pDLFVBQUksQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLENBQUM7O0FBRW5DLFVBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3pELFVBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNyRCxVQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakQsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLHlDQUF5QyxDQUFDLENBQUM7QUFDakYsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7S0FDbEY7OztXQUVpQiw4QkFBRzs7QUFFbkIsVUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUM7O0FBRTdD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QUU7O0FBRTlELFdBQVMsRUFBRSxVQUFVLENBQUMsU0FBUztDQUNoQyxDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWNvbmZpZy12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB0ZXJuQ29uZmlnRG9jcyBmcm9tICcuLi9jb25maWcvdGVybi1jb25maWctZG9jcyc7XG5pbXBvcnQgcGx1Z2luRGVmaW5pdGlvbnMgZnJvbSAnLi4vY29uZmlnL3Rlcm4tcGx1Z2lucy1kZWZpbnRpb25zLmpzJztcbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vYXRvbS10ZXJuanMtbWFuYWdlcic7XG5pbXBvcnQgVGVyblZpZXcgZnJvbSAnLi9hdG9tLXRlcm5qcy12aWV3JztcblxuY29uc3QgdGVtcGxhdGVDb250YWluZXIgPSBgXG5cbiAgPGRpdj5cbiAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG4gICAgICA8aDEgY2xhc3M9XCJ0aXRsZVwiPjwvaDE+XG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGVudFwiPjwvZGl2PlxuICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBhdG9tLXRlcm5qcy1jb25maWctY2xvc2VcIj5TYXZlICZhbXA7IFJlc3RhcnQgU2VydmVyPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGF0b20tdGVybmpzLWNvbmZpZy1jbG9zZVwiPkNhbmNlbDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbmA7XG5cbmNsYXNzIENvbmZpZ1ZpZXcgZXh0ZW5kcyBUZXJuVmlldyB7XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuXG4gICAgdGhpcy5nZXRNb2RlbCgpO1xuXG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdhdG9tLXRlcm5qcy1jb25maWcnKTtcbiAgICB0aGlzLmlubmVySFRNTCA9IHRlbXBsYXRlQ29udGFpbmVyO1xuXG4gICAgdGhpcy5jb250YWluZXJFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVyJyk7XG4gICAgdGhpcy5jb250ZW50RWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcignLmNvbnRlbnQnKTtcbiAgICB0aGlzLnRpdGxlRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcignLnRpdGxlJyk7XG4gICAgdGhpcy5idXR0b25DbG9zZSA9IHRoaXMucXVlcnlTZWxlY3RvcignLmF0b20tdGVybmpzLWNvbmZpZy1jbG9zZTpmaXJzdC1vZi10eXBlJyk7XG4gICAgdGhpcy5idXR0b25DYW5jZWwgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5hdG9tLXRlcm5qcy1jb25maWctY2xvc2U6bGFzdC1vZi10eXBlJyk7XG4gIH1cblxuICBidWlsZE9wdGlvbnNNYXJrdXAoKSB7XG5cbiAgICBsZXQgcHJvamVjdERpciA9ICcnO1xuICAgIGNvbnN0IHByb2plY3RDb25maWcgPSB0aGlzLmdldE1vZGVsKCkuY29uZmlnO1xuXG4gICAgaWYgKG1hbmFnZXIuY2xpZW50KSB7XG5cbiAgICAgIHByb2plY3REaXIgPSBtYW5hZ2VyLmNsaWVudC5wcm9qZWN0RGlyO1xuICAgIH1cblxuICAgIHRoaXMudGl0bGVFbGVtZW50LmlubmVySFRNTCA9IHByb2plY3REaXI7XG5cbiAgICB0aGlzLmNvbnRlbnRFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuYnVpbGRSYWRpbygnZWNtYVZlcnNpb24nKSk7XG4gICAgdGhpcy5jb250ZW50RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmJ1aWxkbGlicygnbGlicycsIHByb2plY3RDb25maWcubGlicykpO1xuICAgIHRoaXMuY29udGVudEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5idWlsZFN0cmluZ0FycmF5KHByb2plY3RDb25maWcubG9hZEVhZ2VybHksICdsb2FkRWFnZXJseScpKTtcbiAgICB0aGlzLmNvbnRlbnRFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuYnVpbGRTdHJpbmdBcnJheShwcm9qZWN0Q29uZmlnLmRvbnRMb2FkLCAnZG9udExvYWQnKSk7XG4gICAgdGhpcy5jb250ZW50RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmJ1aWxkUGx1Z2lucygncGx1Z2lucycsIHByb2plY3RDb25maWcucGx1Z2lucykpO1xuICB9XG5cbiAgYnVpbGRTZWN0aW9uKHNlY3Rpb25UaXRsZSkge1xuXG4gICAgbGV0IHNlY3Rpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWN0aW9uJyk7XG4gICAgc2VjdGlvbi5jbGFzc0xpc3QuYWRkKHNlY3Rpb25UaXRsZSk7XG5cbiAgICBsZXQgaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICBoZWFkZXIuaW5uZXJIVE1MID0gc2VjdGlvblRpdGxlO1xuXG4gICAgc2VjdGlvbi5hcHBlbmRDaGlsZChoZWFkZXIpO1xuXG4gICAgY29uc3QgZG9jcyA9IHRlcm5Db25maWdEb2NzW3NlY3Rpb25UaXRsZV0uZG9jO1xuXG4gICAgaWYgKGRvY3MpIHtcblxuICAgICAgbGV0IGRvYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgIGRvYy5pbm5lckhUTUwgPSBkb2NzO1xuXG4gICAgICBzZWN0aW9uLmFwcGVuZENoaWxkKGRvYyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlY3Rpb247XG4gIH1cblxuICBidWlsZFJhZGlvKHNlY3Rpb25UaXRsZSkge1xuXG4gICAgbGV0IHNlY3Rpb24gPSB0aGlzLmJ1aWxkU2VjdGlvbihzZWN0aW9uVGl0bGUpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5nZXRNb2RlbCgpLmNvbmZpZy5lY21hVmVyc2lvbnMpKSB7XG5cbiAgICAgIGxldCBpbnB1dFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGlucHV0V3JhcHBlci5jbGFzc0xpc3QuYWRkKCdpbnB1dC13cmFwcGVyJyk7XG5cbiAgICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGxhYmVsLmlubmVySFRNTCA9IGtleTtcblxuICAgICAgbGV0IHJhZGlvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgIHJhZGlvLnR5cGUgPSAncmFkaW8nO1xuICAgICAgcmFkaW8ubmFtZSA9ICdlY21hVmVyc2lvbnMnO1xuICAgICAgcmFkaW8uY2hlY2tlZCA9IHRoaXMuZ2V0TW9kZWwoKS5jb25maWcuZWNtYVZlcnNpb25zW2tleV07XG4gICAgICByYWRpby5fX3Rlcm5qc19rZXkgPSBrZXk7XG5cbiAgICAgIHJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG5cbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5nZXRNb2RlbCgpLmNvbmZpZy5lY21hVmVyc2lvbnMpKSB7XG5cbiAgICAgICAgICB0aGlzLmdldE1vZGVsKCkuY29uZmlnLmVjbWFWZXJzaW9uc1trZXldID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdldE1vZGVsKCkuY29uZmlnLmVjbWFWZXJzaW9uc1tlLnRhcmdldC5fX3Rlcm5qc19rZXldID0gZS50YXJnZXQuY2hlY2tlZDtcbiAgICAgIH0sIGZhbHNlKTtcblxuICAgICAgaW5wdXRXcmFwcGVyLmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICAgIGlucHV0V3JhcHBlci5hcHBlbmRDaGlsZChyYWRpbyk7XG4gICAgICBzZWN0aW9uLmFwcGVuZENoaWxkKGlucHV0V3JhcHBlcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlY3Rpb247XG4gIH1cblxuICBidWlsZFN0cmluZ0FycmF5KG9iaiwgc2VjdGlvblRpdGxlKSB7XG5cbiAgICBsZXQgc2VjdGlvbiA9IHRoaXMuYnVpbGRTZWN0aW9uKHNlY3Rpb25UaXRsZSk7XG5cbiAgICBmb3IgKGNvbnN0IHBhdGggb2Ygb2JqKSB7XG5cbiAgICAgIHNlY3Rpb24uYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVJbnB1dFdyYXBwZXIocGF0aCwgc2VjdGlvblRpdGxlKSk7XG4gICAgfVxuXG4gICAgaWYgKG9iai5sZW5ndGggPT09IDApIHtcblxuICAgICAgc2VjdGlvbi5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZUlucHV0V3JhcHBlcihudWxsLCBzZWN0aW9uVGl0bGUpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VjdGlvbjtcbiAgfVxuXG4gIGJ1aWxkUGx1Z2lucyhzZWN0aW9uVGl0bGUsIGF2YWlsYWJsZVBsdWdpbnMpIHtcblxuICAgIGxldCBzZWN0aW9uID0gdGhpcy5idWlsZFNlY3Rpb24oc2VjdGlvblRpdGxlKTtcblxuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGF2YWlsYWJsZVBsdWdpbnMpKSB7XG5cbiAgICAgIGxldCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmJ1aWxkQm9vbGVhbihrZXksIGF2YWlsYWJsZVBsdWdpbnMpKTtcbiAgICAgIGxldCBkb2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBkb2MuaW5uZXJIVE1MID0gcGx1Z2luRGVmaW5pdGlvbnNba2V5XSAmJiBwbHVnaW5EZWZpbml0aW9uc1trZXldLmRvYztcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZG9jKTtcbiAgICAgIHNlY3Rpb24uYXBwZW5kQ2hpbGQod3JhcHBlcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlY3Rpb247XG4gIH1cblxuICBidWlsZGxpYnMoc2VjdGlvblRpdGxlLCBhdmFpbGFibGVMaWJzKSB7XG5cbiAgICBsZXQgc2VjdGlvbiA9IHRoaXMuYnVpbGRTZWN0aW9uKHNlY3Rpb25UaXRsZSk7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhhdmFpbGFibGVMaWJzKSkge1xuXG4gICAgICBzZWN0aW9uLmFwcGVuZENoaWxkKHRoaXMuYnVpbGRCb29sZWFuKGtleSwgYXZhaWxhYmxlTGlicykpO1xuICAgIH1cblxuICAgIHJldHVybiBzZWN0aW9uO1xuICB9XG5cbiAgYnVpbGRCb29sZWFuKG9wdGlvbiwgb3B0aW9ucykge1xuXG4gICAgbGV0IGlucHV0V3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBsZXQgY2hlY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuXG4gICAgaW5wdXRXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2lucHV0LXdyYXBwZXInKTtcbiAgICBsYWJlbC5pbm5lckhUTUwgPSBvcHRpb247XG4gICAgY2hlY2tib3gudHlwZSA9ICdjaGVja2JveCc7XG4gICAgY2hlY2tib3guY2hlY2tlZCA9IG9wdGlvbnNbb3B0aW9uXS5fYWN0aXZlO1xuICAgIGNoZWNrYm94Ll9fdGVybmpzX2tleSA9IG9wdGlvbjtcbiAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuXG4gICAgICBvcHRpb25zW2UudGFyZ2V0Ll9fdGVybmpzX2tleV0uX2FjdGl2ZSA9IGUudGFyZ2V0LmNoZWNrZWQ7XG5cbiAgICB9LCBmYWxzZSk7XG5cbiAgICBpbnB1dFdyYXBwZXIuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgIGlucHV0V3JhcHBlci5hcHBlbmRDaGlsZChjaGVja2JveCk7XG5cbiAgICByZXR1cm4gaW5wdXRXcmFwcGVyO1xuICB9XG5cbiAgY3JlYXRlSW5wdXRXcmFwcGVyKHBhdGgsIHNlY3Rpb25UaXRsZSkge1xuXG4gICAgbGV0IGlucHV0V3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGxldCBlZGl0b3IgPSB0aGlzLmNyZWF0ZVRleHRFZGl0b3IocGF0aCk7XG5cbiAgICBpbnB1dFdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnaW5wdXQtd3JhcHBlcicpO1xuICAgIGVkaXRvci5fX3Rlcm5qc19zZWN0aW9uID0gc2VjdGlvblRpdGxlO1xuICAgIGlucHV0V3JhcHBlci5hcHBlbmRDaGlsZChlZGl0b3IpO1xuICAgIGlucHV0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZUFkZChzZWN0aW9uVGl0bGUpKTtcbiAgICBpbnB1dFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVTdWIoZWRpdG9yKSk7XG5cbiAgICByZXR1cm4gaW5wdXRXcmFwcGVyO1xuICB9XG5cbiAgY3JlYXRlU3ViKGVkaXRvcikge1xuXG4gICAgbGV0IHN1YiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzdWIuY2xhc3NMaXN0LmFkZCgnc3ViJyk7XG4gICAgc3ViLmNsYXNzTGlzdC5hZGQoJ2lubGluZS1ibG9jaycpO1xuICAgIHN1Yi5jbGFzc0xpc3QuYWRkKCdzdGF0dXMtcmVtb3ZlZCcpO1xuICAgIHN1Yi5jbGFzc0xpc3QuYWRkKCdpY29uJyk7XG4gICAgc3ViLmNsYXNzTGlzdC5hZGQoJ2ljb24tZGlmZi1yZW1vdmVkJyk7XG5cbiAgICBzdWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXG4gICAgICB0aGlzLmdldE1vZGVsKCkucmVtb3ZlRWRpdG9yKGVkaXRvcik7XG4gICAgICBjb25zdCBpbnB1dFdyYXBwZXIgPSBlLnRhcmdldC5jbG9zZXN0KCcuaW5wdXQtd3JhcHBlcicpO1xuICAgICAgaW5wdXRXcmFwcGVyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaW5wdXRXcmFwcGVyKTtcblxuICAgIH0sIGZhbHNlKTtcblxuICAgIHJldHVybiBzdWI7XG4gIH1cblxuICBjcmVhdGVBZGQoc2VjdGlvblRpdGxlKSB7XG5cbiAgICBsZXQgYWRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGFkZC5jbGFzc0xpc3QuYWRkKCdhZGQnKTtcbiAgICBhZGQuY2xhc3NMaXN0LmFkZCgnaW5saW5lLWJsb2NrJyk7XG4gICAgYWRkLmNsYXNzTGlzdC5hZGQoJ3N0YXR1cy1hZGRlZCcpO1xuICAgIGFkZC5jbGFzc0xpc3QuYWRkKCdpY29uJyk7XG4gICAgYWRkLmNsYXNzTGlzdC5hZGQoJ2ljb24tZGlmZi1hZGRlZCcpO1xuICAgIGFkZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cbiAgICAgIGUudGFyZ2V0LmNsb3Nlc3QoJ3NlY3Rpb24nKS5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZUlucHV0V3JhcHBlcihudWxsLCBzZWN0aW9uVGl0bGUpKTtcblxuICAgIH0sIGZhbHNlKTtcblxuICAgIHJldHVybiBhZGQ7XG4gIH1cblxuICBjcmVhdGVUZXh0RWRpdG9yKHBhdGgpIHtcblxuICAgIGxldCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXRvbS10ZXh0LWVkaXRvcicpO1xuICAgIGl0ZW0uc2V0QXR0cmlidXRlKCdtaW5pJywgdHJ1ZSk7XG5cbiAgICBpZiAocGF0aCkge1xuXG4gICAgICBpdGVtLmdldE1vZGVsKCkuZ2V0QnVmZmVyKCkuc2V0VGV4dChwYXRoKTtcbiAgICB9XG5cbiAgICB0aGlzLmdldE1vZGVsKCkuZWRpdG9ycy5wdXNoKGl0ZW0pO1xuXG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICByZW1vdmVDb250ZW50KCkge1xuXG4gICAgdGhpcy5jb250ZW50RWxlbWVudC5pbm5lckhUTUwgPSAnJztcbiAgfVxuXG4gIGdldENsb3NlKCkge1xuXG4gICAgcmV0dXJuIHRoaXMuYnV0dG9uQ2xvc2U7XG4gIH1cblxuICBnZXRDYW5jZWwoKSB7XG5cbiAgICByZXR1cm4gdGhpcy5idXR0b25DYW5jZWw7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2F0b20tdGVybmpzLWNvbmZpZycsIHtcblxuICBwcm90b3R5cGU6IENvbmZpZ1ZpZXcucHJvdG90eXBlXG59KTtcbiJdfQ==