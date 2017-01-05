Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _bottomTab = require('./bottom-tab');

var _bottomTab2 = _interopRequireDefault(_bottomTab);

var _bottomStatus = require('./bottom-status');

var _bottomStatus2 = _interopRequireDefault(_bottomStatus);

'use babel';

var BottomContainer = (function (_HTMLElement) {
  _inherits(BottomContainer, _HTMLElement);

  function BottomContainer() {
    _classCallCheck(this, BottomContainer);

    _get(Object.getPrototypeOf(BottomContainer.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BottomContainer, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      this.subscriptions = new _atom.CompositeDisposable();
      this.emitter = new _atom.Emitter();
      this.tabs = new Map();
      this.tabs.set('Line', _bottomTab2['default'].create('Line'));
      this.tabs.set('File', _bottomTab2['default'].create('File'));
      this.tabs.set('Project', _bottomTab2['default'].create('Project'));
      this.status = new _bottomStatus2['default']();

      this.subscriptions.add(this.emitter);
      this.subscriptions.add(atom.config.observe('linter.displayLinterInfo', function (displayInfo) {
        _this.displayInfo = displayInfo;
        _this.visibility = typeof _this.visibility === 'undefined' ? true : _this.visibility;
      }));
      this.subscriptions.add(atom.config.observe('linter.statusIconScope', function (iconScope) {
        _this.iconScope = iconScope;
        _this.status.count = _this.tabs.get(iconScope).count;
      }));
      this.subscriptions.add(atom.config.observe('linter.displayLinterStatus', function (visibiltiy) {
        _this.status.visibility = visibiltiy;
      }));

      for (var tab of this.tabs) {
        this.appendChild(tab[1]);
        this.subscriptions.add(tab[1]);
      }
      this.appendChild(this.status);

      this.onDidChangeTab(function (activeName) {
        _this.activeTab = activeName;
      });
    }
  }, {
    key: 'getTab',
    value: function getTab(name) {
      return this.tabs.get(name);
    }
  }, {
    key: 'setCount',
    value: function setCount(_ref) {
      var Project = _ref.Project;
      var File = _ref.File;
      var Line = _ref.Line;

      this.tabs.get('Project').count = Project;
      this.tabs.get('File').count = File;
      this.tabs.get('Line').count = Line;
      this.status.count = this.tabs.get(this.iconScope).count;
    }
  }, {
    key: 'onDidChangeTab',
    value: function onDidChangeTab(callback) {
      var disposable = new _atom.CompositeDisposable();
      this.tabs.forEach(function (tab) {
        disposable.add(tab.onDidChangeTab(callback));
      });
      return disposable;
    }
  }, {
    key: 'onShouldTogglePanel',
    value: function onShouldTogglePanel(callback) {
      var disposable = new _atom.CompositeDisposable();
      this.tabs.forEach(function (tab) {
        disposable.add(tab.onShouldTogglePanel(callback));
      });
      return disposable;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.tabs.clear();
      this.status = null;
    }
  }, {
    key: 'activeTab',
    set: function set(activeName) {
      this._activeTab = activeName;
      for (var _ref23 of this.tabs) {
        var _ref22 = _slicedToArray(_ref23, 2);

        var _name = _ref22[0];
        var tab = _ref22[1];

        tab.active = _name === activeName;
      }
    },
    get: function get() {
      return this._activeTab;
    }
  }, {
    key: 'visibility',
    get: function get() {
      return !this.hasAttribute('hidden');
    },
    set: function set(value) {
      if (value && this.displayInfo) {
        this.removeAttribute('hidden');
      } else {
        this.setAttribute('hidden', true);
      }
    }
  }], [{
    key: 'create',
    value: function create(activeTab) {
      var el = document.createElement('linter-bottom-container');
      el.activeTab = activeTab;
      return el;
    }
  }]);

  return BottomContainer;
})(HTMLElement);

exports['default'] = BottomContainer;

document.registerElement('linter-bottom-container', {
  prototype: BottomContainer.prototype
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvYm90dG9tLWNvbnRhaW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O29CQUUyQyxNQUFNOzt5QkFDM0IsY0FBYzs7Ozs0QkFDWCxpQkFBaUI7Ozs7QUFKMUMsV0FBVyxDQUFBOztJQU1VLGVBQWU7WUFBZixlQUFlOztXQUFmLGVBQWU7MEJBQWYsZUFBZTs7K0JBQWYsZUFBZTs7O2VBQWYsZUFBZTs7V0FDbkIsMkJBQUc7OztBQUNoQixVQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF1QixDQUFBO0FBQzVDLFVBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQVcsQ0FBQTtBQUMxQixVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDckIsVUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLHVCQUFVLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0FBQy9DLFVBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSx1QkFBVSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtBQUMvQyxVQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsdUJBQVUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7QUFDckQsVUFBSSxDQUFDLE1BQU0sR0FBRywrQkFBZ0IsQ0FBQTs7QUFFOUIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDBCQUEwQixFQUFFLFVBQUEsV0FBVyxFQUFJO0FBQ3BGLGNBQUssV0FBVyxHQUFHLFdBQVcsQ0FBQTtBQUM5QixjQUFLLFVB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LFVBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDakIsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7S0FDbkI7OztTQXhDWSxhQUFDLFVBQVUsRUFBRTtBQUN4QixVQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1Qix5QkFBd0IsSUFBSSxDQUFDLElBQUksRUFBRTs7O1lBQXpCLEtBQUk7WUFBRSxHQUFHOztBQUNqQixXQUFHLENBQUMsTUFBTSxHQUFHLEtBQUksS0FBSyxVQUFVLENBQUE7T0FDakM7S0FDRjtTQUNZLGVBQUc7QUFDZCxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUE7S0FDdkI7OztTQUVhLGVBQUc7QUFDZixhQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUNwQztTQUNhLGFBQUMsS0FBSyxFQUFFO0FBQ3BCLFVBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDN0IsWUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUMvQixNQUFNO0FBQ0wsWUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7T0FDbEM7S0FDRjs7O1dBdUJZLGdCQUFDLFNBQVMsRUFBRTtBQUN2QixVQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLHlCQUF5QixDQUFDLENBQUE7QUFDNUQsUUFBRSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7QUFDeEIsYUFBTyxFQUFFLENBQUE7S0FDVjs7O1NBekZrQixlQUFlO0dBQVMsV0FBVzs7cUJBQW5DLGVBQWU7O0FBNEZwQyxRQUFRLENBQUMsZUFBZSxDQUFDLHlCQUF5QixFQUFFO0FBQ2xELFdBQVMsRUFBRSxlQUFlLENBQUMsU0FBUztDQUNyQyxDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi91aS9ib3R0b20tY29udGFpbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyfSBmcm9tICdhdG9tJ1xuaW1wb3J0IEJvdHRvbVRhYiBmcm9tICcuL2JvdHRvbS10YWInXG5pbXBvcnQgQm90dG9tU3RhdHVzIGZyb20gJy4vYm90dG9tLXN0YXR1cydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm90dG9tQ29udGFpbmVyIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlclxuICAgIHRoaXMudGFicyA9IG5ldyBNYXAoKVxuICAgIHRoaXMudGFicy5zZXQoJ0xpbmUnLCBCb3R0b21UYWIuY3JlYXRlKCdMaW5lJykpXG4gICAgdGhpcy50YWJzLnNldCgnRmlsZScsIEJvdHRvbVRhYi5jcmVhdGUoJ0ZpbGUnKSlcbiAgICB0aGlzLnRhYnMuc2V0KCdQcm9qZWN0JywgQm90dG9tVGFiLmNyZWF0ZSgnUHJvamVjdCcpKVxuICAgIHRoaXMuc3RhdHVzID0gbmV3IEJvdHRvbVN0YXR1c1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuZGlzcGxheUxpbnRlckluZm8nLCBkaXNwbGF5SW5mbyA9PiB7XG4gICAgICB0aGlzLmRpc3BsYXlJbmZvID0gZGlzcGxheUluZm9cbiAgICAgIHRoaXMudmlzaWJpbGl0eSA9IHR5cGVvZiB0aGlzLnZpc2liaWxpdHkgPT09ICd1bmRlZmluZWQnID8gdHJ1ZSA6IHRoaXMudmlzaWJpbGl0eVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLnN0YXR1c0ljb25TY29wZScsIGljb25TY29wZSA9PiB7XG4gICAgICB0aGlzLmljb25TY29wZSA9IGljb25TY29wZVxuICAgICAgdGhpcy5zdGF0dXMuY291bnQgPSB0aGlzLnRhYnMuZ2V0KGljb25TY29wZSkuY291bnRcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5kaXNwbGF5TGludGVyU3RhdHVzJywgdmlzaWJpbHRpeSA9PiB7XG4gICAgICB0aGlzLnN0YXR1cy52aXNpYmlsaXR5ID0gdmlzaWJpbHRpeVxuICAgIH0pKVxuXG4gICAgZm9yIChsZXQgdGFiIG9mIHRoaXMudGFicykge1xuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0YWJbMV0pXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRhYlsxXSlcbiAgICB9XG4gICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLnN0YXR1cylcblxuICAgIHRoaXMub25EaWRDaGFuZ2VUYWIoYWN0aXZlTmFtZSA9PiB7XG4gICAgICB0aGlzLmFjdGl2ZVRhYiA9IGFjdGl2ZU5hbWVcbiAgICB9KVxuICB9XG4gIGdldFRhYihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMudGFicy5nZXQobmFtZSlcbiAgfVxuICBzZXRDb3VudCh7UHJvamVjdCwgRmlsZSwgTGluZX0pIHtcbiAgICB0aGlzLnRhYnMuZ2V0KCdQcm9qZWN0JykuY291bnQgPSBQcm9qZWN0XG4gICAgdGhpcy50YWJzLmdldCgnRmlsZScpLmNvdW50ID0gRmlsZVxuICAgIHRoaXMudGFicy5nZXQoJ0xpbmUnKS5jb3VudCA9IExpbmVcbiAgICB0aGlzLnN0YXR1cy5jb3VudCA9IHRoaXMudGFicy5nZXQodGhpcy5pY29uU2NvcGUpLmNvdW50XG4gIH1cblxuICBzZXQgYWN0aXZlVGFiKGFjdGl2ZU5hbWUpIHtcbiAgICB0aGlzLl9hY3RpdmVUYWIgPSBhY3RpdmVOYW1lXG4gICAgZm9yIChsZXQgW25hbWUsIHRhYl0gb2YgdGhpcy50YWJzKSB7XG4gICAgICB0YWIuYWN0aXZlID0gbmFtZSA9PT0gYWN0aXZlTmFtZVxuICAgIH1cbiAgfVxuICBnZXQgYWN0aXZlVGFiKCkge1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmVUYWJcbiAgfVxuXG4gIGdldCB2aXNpYmlsaXR5KCkge1xuICAgIHJldHVybiAhdGhpcy5oYXNBdHRyaWJ1dGUoJ2hpZGRlbicpXG4gIH1cbiAgc2V0IHZpc2liaWxpdHkodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgJiYgdGhpcy5kaXNwbGF5SW5mbykge1xuICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKVxuICAgIH1cbiAgfVxuXG4gIG9uRGlkQ2hhbmdlVGFiKGNhbGxiYWNrKSB7XG4gICAgY29uc3QgZGlzcG9zYWJsZSA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgdGhpcy50YWJzLmZvckVhY2goZnVuY3Rpb24odGFiKSB7XG4gICAgICBkaXNwb3NhYmxlLmFkZCh0YWIub25EaWRDaGFuZ2VUYWIoY2FsbGJhY2spKVxuICAgIH0pXG4gICAgcmV0dXJuIGRpc3Bvc2FibGVcbiAgfVxuICBvblNob3VsZFRvZ2dsZVBhbmVsKGNhbGxiYWNrKSB7XG4gICAgY29uc3QgZGlzcG9zYWJsZSA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgdGhpcy50YWJzLmZvckVhY2goZnVuY3Rpb24odGFiKSB7XG4gICAgICBkaXNwb3NhYmxlLmFkZCh0YWIub25TaG91bGRUb2dnbGVQYW5lbChjYWxsYmFjaykpXG4gICAgfSlcbiAgICByZXR1cm4gZGlzcG9zYWJsZVxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy50YWJzLmNsZWFyKClcbiAgICB0aGlzLnN0YXR1cyA9IG51bGxcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGUoYWN0aXZlVGFiKSB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW50ZXItYm90dG9tLWNvbnRhaW5lcicpXG4gICAgZWwuYWN0aXZlVGFiID0gYWN0aXZlVGFiXG4gICAgcmV0dXJuIGVsXG4gIH1cbn1cblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdsaW50ZXItYm90dG9tLWNvbnRhaW5lcicsIHtcbiAgcHJvdG90eXBlOiBCb3R0b21Db250YWluZXIucHJvdG90eXBlXG59KVxuIl19