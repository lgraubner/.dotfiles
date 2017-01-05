Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _atomTernjsProvider = require('./atom-ternjs-provider');

var _atomTernjsProvider2 = _interopRequireDefault(_atomTernjsProvider);

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

'use babel';

var AtomTernjs = (function () {
  function AtomTernjs() {
    _classCallCheck(this, AtomTernjs);

    this.config = _config2['default'];
  }

  _createClass(AtomTernjs, [{
    key: 'activate',
    value: function activate() {

      _atomTernjsManager2['default'].init();
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {

      _atomTernjsManager2['default'].destroy();
    }
  }, {
    key: 'provide',
    value: function provide() {

      return _atomTernjsProvider2['default'];
    }
  }]);

  return AtomTernjs;
})();

exports['default'] = new AtomTernjs();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3NCQUV5QixVQUFVOzs7O2tDQUNkLHdCQUF3Qjs7OztpQ0FDekIsdUJBQXVCOzs7O0FBSjNDLFdBQVcsQ0FBQzs7SUFNTixVQUFVO0FBRUgsV0FGUCxVQUFVLEdBRUE7MEJBRlYsVUFBVTs7QUFJWixRQUFJLENBQUMsTUFBTSxzQkFBZSxDQUFDO0dBQzVCOztlQUxHLFVBQVU7O1dBT04sb0JBQUc7O0FBRVQscUNBQVEsSUFBSSxFQUFFLENBQUM7S0FDaEI7OztXQUVTLHNCQUFHOztBQUVYLHFDQUFRLE9BQU8sRUFBRSxDQUFDO0tBQ25COzs7V0FFTSxtQkFBRzs7QUFFUiw2Q0FBZ0I7S0FDakI7OztTQXBCRyxVQUFVOzs7cUJBdUJELElBQUksVUFBVSxFQUFFIiwiZmlsZSI6Ii9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgZGVmYXVsQ29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCBwcm92aWRlciBmcm9tICcuL2F0b20tdGVybmpzLXByb3ZpZGVyJztcbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vYXRvbS10ZXJuanMtbWFuYWdlcic7XG5cbmNsYXNzIEF0b21UZXJuanMge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy5jb25maWcgPSBkZWZhdWxDb25maWc7XG4gIH1cblxuICBhY3RpdmF0ZSgpIHtcblxuICAgIG1hbmFnZXIuaW5pdCgpO1xuICB9XG5cbiAgZGVhY3RpdmF0ZSgpIHtcblxuICAgIG1hbmFnZXIuZGVzdHJveSgpO1xuICB9XG5cbiAgcHJvdmlkZSgpIHtcblxuICAgIHJldHVybiBwcm92aWRlcjtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQXRvbVRlcm5qcygpO1xuIl19