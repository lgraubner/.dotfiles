Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var Indie = (function () {
  function Indie(_ref) {
    var name = _ref.name;

    _classCallCheck(this, Indie);

    this.name = name;
    this.scope = 'project';
    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();

    this.subscriptions.add(this.emitter);
  }

  _createClass(Indie, [{
    key: 'setMessages',
    value: function setMessages(messages) {
      this.emitter.emit('did-update-messages', messages);
    }
  }, {
    key: 'deleteMessages',
    value: function deleteMessages() {
      this.emitter.emit('did-update-messages', []);
    }

    // Private Method
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }

    // Private Method
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-destroy');
      this.subscriptions.dispose();
    }
  }]);

  return Indie;
})();

exports['default'] = Indie;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvaW5kaWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRTJDLE1BQU07O0FBRmpELFdBQVcsQ0FBQTs7SUFJVSxLQUFLO0FBQ2IsV0FEUSxLQUFLLENBQ1osSUFBTSxFQUFFO1FBQVAsSUFBSSxHQUFMLElBQU0sQ0FBTCxJQUFJOzswQkFERSxLQUFLOztBQUV0QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtBQUNoQixRQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQTtBQUN0QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTs7QUFFNUIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQ3JDOztlQVJrQixLQUFLOztXQVNiLHFCQUFDLFFBQVEsRUFBRTtBQUNwQixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNuRDs7O1dBQ2EsMEJBQUc7QUFDZixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUFFLENBQUMsQ0FBQTtLQUM3Qzs7Ozs7V0FHa0IsNkJBQUMsUUFBUSxFQUFFO0FBQzVCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMscUJBQXFCLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDeEQ7Ozs7O1dBRVcsc0JBQUMsUUFBUSxFQUFFO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQTVCa0IsS0FBSzs7O3FCQUFMLEtBQUsiLCJmaWxlIjoiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9pbmRpZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7RW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kaWUge1xuICBjb25zdHJ1Y3Rvcih7bmFtZX0pIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgdGhpcy5zY29wZSA9ICdwcm9qZWN0J1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgfVxuICBzZXRNZXNzYWdlcyhtZXNzYWdlcykge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywgbWVzc2FnZXMpXG4gIH1cbiAgZGVsZXRlTWVzc2FnZXMoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCBbXSlcbiAgfVxuXG4gIC8vIFByaXZhdGUgTWV0aG9kXG4gIG9uRGlkVXBkYXRlTWVzc2FnZXMoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywgY2FsbGJhY2spXG4gIH1cbiAgLy8gUHJpdmF0ZSBNZXRob2RcbiAgb25EaWREZXN0cm95KGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRlc3Ryb3knLCBjYWxsYmFjaylcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95JylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cbiJdfQ==