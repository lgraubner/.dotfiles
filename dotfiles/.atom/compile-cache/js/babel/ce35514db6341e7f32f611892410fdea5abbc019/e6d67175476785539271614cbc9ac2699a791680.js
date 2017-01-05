Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

'use babel';

var BottomTab = (function (_HTMLElement) {
  _inherits(BottomTab, _HTMLElement);

  function BottomTab() {
    _classCallCheck(this, BottomTab);

    _get(Object.getPrototypeOf(BottomTab.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BottomTab, [{
    key: 'createdCallback',
    value: function createdCallback() {
      this.subscriptions = new _atom.CompositeDisposable();
      this.emitter = new _atom.Emitter();

      this.nameElement = document.createTextNode('');
      this.countElement = document.createElement('span');
      this.countElement.classList.add('count');

      this.appendChild(this.nameElement);
      this.appendChild(document.createTextNode(' '));
      this.appendChild(this.countElement);

      this.count = 0;

      this.subscriptions.add(this.emitter);
      this.addEventListener('click', function () {
        if (this.active) {
          this.emitter.emit('should-toggle-panel');
        } else {
          this.emitter.emit('did-change-tab', this.name);
        }
      });
    }
  }, {
    key: 'prepare',
    value: function prepare(name) {
      var _this = this;

      this.name = name;
      this.nameElement.textContent = name;
      this.subscriptions.add(atom.config.observe('linter.showErrorTab' + name, function (status) {
        if (status) {
          _this.removeAttribute('hidden');
        } else {
          _this.setAttribute('hidden', true);
        }
      }));
    }
  }, {
    key: 'onDidChangeTab',
    value: function onDidChangeTab(callback) {
      return this.emitter.on('did-change-tab', callback);
    }
  }, {
    key: 'onShouldTogglePanel',
    value: function onShouldTogglePanel(callback) {
      return this.emitter.on('should-toggle-panel', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }, {
    key: 'count',
    set: function set(count) {
      this._count = count;
      this.countElement.textContent = count;
    },
    get: function get() {
      return this._count;
    }
  }, {
    key: 'active',
    set: function set(value) {
      this._active = value;
      if (value) {
        this.classList.add('active');
      } else {
        this.classList.remove('active');
      }
    },
    get: function get() {
      return this._active;
    }
  }], [{
    key: 'create',
    value: function create(name) {
      var el = document.createElement('linter-bottom-tab');
      el.prepare(name);
      return el;
    }
  }]);

  return BottomTab;
})(HTMLElement);

exports['default'] = BottomTab;

document.registerElement('linter-bottom-tab', {
  prototype: BottomTab.prototype
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvYm90dG9tLXRhYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBRTJDLE1BQU07O0FBRmpELFdBQVcsQ0FBQTs7SUFJVSxTQUFTO1lBQVQsU0FBUzs7V0FBVCxTQUFTOzBCQUFULFNBQVM7OytCQUFULFNBQVM7OztlQUFULFNBQVM7O1dBQ2IsMkJBQUc7QUFDaEIsVUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxVQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7O0FBRTVCLFVBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUM5QyxVQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDbEQsVUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBOztBQUV4QyxVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUM5QyxVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTs7QUFFbkMsVUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUE7O0FBRWQsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFVBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBVztBQUN4QyxZQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixjQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO1NBQ3pDLE1BQU07QUFDTCxjQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7U0FDL0M7T0FDRixDQUFDLENBQUE7S0FDSDs7O1dBQ00saUJBQUMsSUFBSSxFQUFFOzs7QUFDWixVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtBQUNoQixVQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7QUFDbkMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLHlCQUF1QixJQUFJLEVBQUksVUFBQSxNQUFNLEVBQUk7QUFDakYsWUFBSSxNQUFNLEVBQUU7QUFDVixnQkFBSyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUE7U0FDL0IsTUFBTTtBQUNMLGdCQUFLLFlBQVksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7U0FDbEM7T0FDRixDQUFDLENBQUMsQ0FBQTtLQUNKOzs7V0FDYSx3QkFBQyxRQUFRLEVBQUU7QUFDdkIsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNuRDs7O1dBQ2tCLDZCQUFDLFFBQVEsRUFBRTtBQUM1QixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLHFCQUFxQixFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ3hEOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQUVRLGFBQUMsS0FBSyxFQUFFO0FBQ2YsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7QUFDbkIsVUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFBO0tBQ3RDO1NBQ1EsZUFBRztBQUNWLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQTtLQUNuQjs7O1NBRVMsYUFBQyxLQUFLLEVBQUU7QUFDaEIsVUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7QUFDcEIsVUFBSSxLQUFLLEVBQUU7QUFDVCxZQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUM3QixNQUFNO0FBQ0wsWUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDaEM7S0FDRjtTQUNTLGVBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUE7S0FDcEI7OztXQUVZLGdCQUFDLElBQUksRUFBRTtBQUNsQixVQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUE7QUFDdEQsUUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNoQixhQUFPLEVBQUUsQ0FBQTtLQUNWOzs7U0FyRWtCLFNBQVM7R0FBUyxXQUFXOztxQkFBN0IsU0FBUzs7QUF3RTlCLFFBQVEsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLEVBQUU7QUFDNUMsV0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTO0NBQy9CLENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvbGFyc2dyYXVibmVyLy5kb3RmaWxlcy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL2JvdHRvbS10YWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXJ9IGZyb20gJ2F0b20nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvdHRvbVRhYiBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG5cbiAgICB0aGlzLm5hbWVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpXG4gICAgdGhpcy5jb3VudEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICB0aGlzLmNvdW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdjb3VudCcpXG5cbiAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMubmFtZUVsZW1lbnQpXG4gICAgdGhpcy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnICcpKVxuICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5jb3VudEVsZW1lbnQpXG5cbiAgICB0aGlzLmNvdW50ID0gMFxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtdG9nZ2xlLXBhbmVsJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLXRhYicsIHRoaXMubmFtZSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIHByZXBhcmUobmFtZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB0aGlzLm5hbWVFbGVtZW50LnRleHRDb250ZW50ID0gbmFtZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZShgbGludGVyLnNob3dFcnJvclRhYiR7bmFtZX1gLCBzdGF0dXMgPT4ge1xuICAgICAgaWYgKHN0YXR1cykge1xuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKVxuICAgICAgfVxuICAgIH0pKVxuICB9XG4gIG9uRGlkQ2hhbmdlVGFiKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS10YWInLCBjYWxsYmFjaylcbiAgfVxuICBvblNob3VsZFRvZ2dsZVBhbmVsKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignc2hvdWxkLXRvZ2dsZS1wYW5lbCcsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG5cbiAgc2V0IGNvdW50KGNvdW50KSB7XG4gICAgdGhpcy5fY291bnQgPSBjb3VudFxuICAgIHRoaXMuY291bnRFbGVtZW50LnRleHRDb250ZW50ID0gY291bnRcbiAgfVxuICBnZXQgY291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvdW50XG4gIH1cblxuICBzZXQgYWN0aXZlKHZhbHVlKSB7XG4gICAgdGhpcy5fYWN0aXZlID0gdmFsdWVcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgIH1cbiAgfVxuICBnZXQgYWN0aXZlKCkge1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmVcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGUobmFtZSkge1xuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGludGVyLWJvdHRvbS10YWInKVxuICAgIGVsLnByZXBhcmUobmFtZSlcbiAgICByZXR1cm4gZWxcbiAgfVxufVxuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2xpbnRlci1ib3R0b20tdGFiJywge1xuICBwcm90b3R5cGU6IEJvdHRvbVRhYi5wcm90b3R5cGVcbn0pXG4iXX0=