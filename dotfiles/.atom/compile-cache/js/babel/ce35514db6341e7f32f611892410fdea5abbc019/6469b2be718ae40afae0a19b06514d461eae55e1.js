Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _indie = require('./indie');

var _indie2 = _interopRequireDefault(_indie);

'use babel';

var IndieRegistry = (function () {
  function IndieRegistry() {
    _classCallCheck(this, IndieRegistry);

    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();

    this.indieLinters = new Set();
    this.subscriptions.add(this.emitter);
  }

  _createClass(IndieRegistry, [{
    key: 'register',
    value: function register(linter) {
      var _this = this;

      _validate2['default'].linter(linter, true);
      var indieLinter = new _indie2['default'](linter);

      this.subscriptions.add(indieLinter);
      this.indieLinters.add(indieLinter);

      indieLinter.onDidDestroy(function () {
        _this.indieLinters['delete'](indieLinter);
      });
      indieLinter.onDidUpdateMessages(function (messages) {
        _this.emitter.emit('did-update-messages', { linter: indieLinter, messages: messages });
      });
      this.emitter.emit('observe', indieLinter);

      return indieLinter;
    }
  }, {
    key: 'has',
    value: function has(indieLinter) {
      return this.indieLinters.has(indieLinter);
    }
  }, {
    key: 'unregister',
    value: function unregister(indieLinter) {
      if (this.indieLinters.has(indieLinter)) {
        indieLinter.dispose();
      }
    }

    // Private method
  }, {
    key: 'observe',
    value: function observe(callback) {
      this.indieLinters.forEach(callback);
      return this.emitter.on('observe', callback);
    }

    // Private method
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return IndieRegistry;
})();

exports['default'] = IndieRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvaW5kaWUtcmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFMkMsTUFBTTs7d0JBQzVCLFlBQVk7Ozs7cUJBQ2YsU0FBUzs7OztBQUozQixXQUFXLENBQUE7O0lBTVUsYUFBYTtBQUNyQixXQURRLGFBQWEsR0FDbEI7MEJBREssYUFBYTs7QUFFOUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7O0FBRTVCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUM3QixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDckM7O2VBUGtCLGFBQWE7O1dBU3hCLGtCQUFDLE1BQU0sRUFBRTs7O0FBQ2YsNEJBQVMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUM3QixVQUFNLFdBQVcsR0FBRyx1QkFBVSxNQUFNLENBQUMsQ0FBQTs7QUFFckMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDbkMsVUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7O0FBRWxDLGlCQUFXLENBQUMsWUFBWSxDQUFDLFlBQU07QUFDN0IsY0FBSyxZQUFZLFVBQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTtPQUN0QyxDQUFDLENBQUE7QUFDRixpQkFBVyxDQUFDLG1CQUFtQixDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQzFDLGNBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBQyxDQUFDLENBQUE7T0FDMUUsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFBOztBQUV6QyxhQUFPLFdBQVcsQ0FBQTtLQUNuQjs7O1dBQ0UsYUFBQyxXQUFXLEVBQUU7QUFDZixhQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0tBQzFDOzs7V0FDUyxvQkFBQyxXQUFXLEVBQUU7QUFDdEIsVUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUN0QyxtQkFBVyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3RCO0tBQ0Y7Ozs7O1dBR00saUJBQUMsUUFBUSxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ25DLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzVDOzs7OztXQUVrQiw2QkFBQyxRQUFRLEVBQUU7QUFDNUIsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUN4RDs7O1dBRU0sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0EvQ2tCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6Ii9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvaW5kaWUtcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQgVmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZSdcbmltcG9ydCBJbmRpZSBmcm9tICcuL2luZGllJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbmRpZVJlZ2lzdHJ5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcblxuICAgIHRoaXMuaW5kaWVMaW50ZXJzID0gbmV3IFNldCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gIH1cblxuICByZWdpc3RlcihsaW50ZXIpIHtcbiAgICBWYWxpZGF0ZS5saW50ZXIobGludGVyLCB0cnVlKVxuICAgIGNvbnN0IGluZGllTGludGVyID0gbmV3IEluZGllKGxpbnRlcilcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoaW5kaWVMaW50ZXIpXG4gICAgdGhpcy5pbmRpZUxpbnRlcnMuYWRkKGluZGllTGludGVyKVxuXG4gICAgaW5kaWVMaW50ZXIub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgIHRoaXMuaW5kaWVMaW50ZXJzLmRlbGV0ZShpbmRpZUxpbnRlcilcbiAgICB9KVxuICAgIGluZGllTGludGVyLm9uRGlkVXBkYXRlTWVzc2FnZXMobWVzc2FnZXMgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCB7bGludGVyOiBpbmRpZUxpbnRlciwgbWVzc2FnZXN9KVxuICAgIH0pXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ29ic2VydmUnLCBpbmRpZUxpbnRlcilcblxuICAgIHJldHVybiBpbmRpZUxpbnRlclxuICB9XG4gIGhhcyhpbmRpZUxpbnRlcikge1xuICAgIHJldHVybiB0aGlzLmluZGllTGludGVycy5oYXMoaW5kaWVMaW50ZXIpXG4gIH1cbiAgdW5yZWdpc3RlcihpbmRpZUxpbnRlcikge1xuICAgIGlmICh0aGlzLmluZGllTGludGVycy5oYXMoaW5kaWVMaW50ZXIpKSB7XG4gICAgICBpbmRpZUxpbnRlci5kaXNwb3NlKClcbiAgICB9XG4gIH1cblxuICAvLyBQcml2YXRlIG1ldGhvZFxuICBvYnNlcnZlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5pbmRpZUxpbnRlcnMuZm9yRWFjaChjYWxsYmFjaylcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdvYnNlcnZlJywgY2FsbGJhY2spXG4gIH1cbiAgLy8gUHJpdmF0ZSBtZXRob2RcbiAgb25EaWRVcGRhdGVNZXNzYWdlcyhjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCBjYWxsYmFjaylcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG4iXX0=