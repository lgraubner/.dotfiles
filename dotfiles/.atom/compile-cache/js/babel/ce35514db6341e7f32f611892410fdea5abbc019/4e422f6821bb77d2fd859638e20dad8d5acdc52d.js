var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomTernjsView = require('./atom-ternjs-view');

var _atomTernjsView2 = _interopRequireDefault(_atomTernjsView);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

'use babel';

var TypeView = (function (_TernView) {
  _inherits(TypeView, _TernView);

  function TypeView() {
    _classCallCheck(this, TypeView);

    _get(Object.getPrototypeOf(TypeView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TypeView, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      this.addEventListener('click', function () {

        _this.getModel().destroyOverlay();
      }, false);

      this.container = document.createElement('div');
      this.appendChild(this.container);
    }
  }, {
    key: 'setData',
    value: function setData(data) {

      if (_atomTernjsPackageConfig2['default'].options.inlineFnCompletionDocumentation) {

        this.container.innerHTML = data.doc ? data.type + '<br /><br />' + data.doc : '' + data.type;

        return;
      }

      this.container.innerHTML = data.type;
    }
  }]);

  return TypeView;
})(_atomTernjsView2['default']);

module.exports = document.registerElement('atom-ternjs-type', {

  prototype: TypeView.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy10eXBlLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs4QkFFcUIsb0JBQW9COzs7O3VDQUNmLDhCQUE4Qjs7OztBQUh4RCxXQUFXLENBQUM7O0lBS04sUUFBUTtZQUFSLFFBQVE7O1dBQVIsUUFBUTswQkFBUixRQUFROzsrQkFBUixRQUFROzs7ZUFBUixRQUFROztXQUVHLDJCQUFHOzs7QUFFaEIsVUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFNOztBQUVuQyxjQUFLLFFBQVEsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO09BRWxDLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRVYsVUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9DLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ2xDOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUU7O0FBRVosVUFBSSxxQ0FBYyxPQUFPLENBQUMsK0JBQStCLEVBQUU7O0FBRXpELFlBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQU0sSUFBSSxDQUFDLElBQUksb0JBQWUsSUFBSSxDQUFDLEdBQUcsUUFBUSxJQUFJLENBQUMsSUFBSSxBQUFFLENBQUM7O0FBRTdGLGVBQU87T0FDUjs7QUFFRCxVQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQ3RDOzs7U0F4QkcsUUFBUTs7O0FBMkJkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRTs7QUFFNUQsV0FBUyxFQUFFLFFBQVEsQ0FBQyxTQUFTO0NBQzlCLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvbGFyc2dyYXVibmVyLy5kb3RmaWxlcy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtdHlwZS12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBUZXJuVmlldyBmcm9tICcuL2F0b20tdGVybmpzLXZpZXcnO1xuaW1wb3J0IHBhY2thZ2VDb25maWcgZnJvbSAnLi9hdG9tLXRlcm5qcy1wYWNrYWdlLWNvbmZpZyc7XG5cbmNsYXNzIFR5cGVWaWV3IGV4dGVuZHMgVGVyblZpZXcge1xuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcblxuICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cbiAgICAgIHRoaXMuZ2V0TW9kZWwoKS5kZXN0cm95T3ZlcmxheSgpO1xuXG4gICAgfSwgZmFsc2UpO1xuXG4gICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyKTtcbiAgfVxuXG4gIHNldERhdGEoZGF0YSkge1xuXG4gICAgaWYgKHBhY2thZ2VDb25maWcub3B0aW9ucy5pbmxpbmVGbkNvbXBsZXRpb25Eb2N1bWVudGF0aW9uKSB7XG5cbiAgICAgIHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9IGRhdGEuZG9jID8gYCR7ZGF0YS50eXBlfTxiciAvPjxiciAvPiR7ZGF0YS5kb2N9YCA6IGAke2RhdGEudHlwZX1gO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gZGF0YS50eXBlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdhdG9tLXRlcm5qcy10eXBlJywge1xuXG4gIHByb3RvdHlwZTogVHlwZVZpZXcucHJvdG90eXBlXG59KTtcbiJdfQ==