var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomTernjsView = require('./atom-ternjs-view');

var _atomTernjsView2 = _interopRequireDefault(_atomTernjsView);

'use babel';

var DocumentationView = (function (_TernView) {
  _inherits(DocumentationView, _TernView);

  function DocumentationView() {
    _classCallCheck(this, DocumentationView);

    _get(Object.getPrototypeOf(DocumentationView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(DocumentationView, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      this.getModel();
      this.addEventListener('click', function () {

        _this.getModel().destroyOverlay();
      }, false);

      this.container = document.createElement('div');

      this.container.onmousewheel = function (e) {

        e.stopPropagation();
      };

      this.appendChild(this.container);
    }
  }, {
    key: 'setData',
    value: function setData(data) {

      this.container.innerHTML = '\n\n      <h3>' + data.type + '</h3>\n      <p>' + data.doc + '</p>\n      <a href="' + data.url + '">' + data.url + '</p>\n    ';
    }
  }]);

  return DocumentationView;
})(_atomTernjsView2['default']);

module.exports = document.registerElement('atom-ternjs-documentation', {

  prototype: DocumentationView.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1kb2N1bWVudGF0aW9uLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs4QkFFcUIsb0JBQW9COzs7O0FBRnpDLFdBQVcsQ0FBQzs7SUFJTixpQkFBaUI7WUFBakIsaUJBQWlCOztXQUFqQixpQkFBaUI7MEJBQWpCLGlCQUFpQjs7K0JBQWpCLGlCQUFpQjs7O2VBQWpCLGlCQUFpQjs7V0FFTiwyQkFBRzs7O0FBRWhCLFVBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNoQixVQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQU07O0FBRW5DLGNBQUssUUFBUSxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7T0FFbEMsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFVixVQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRS9DLFVBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFVBQUMsQ0FBQyxFQUFLOztBQUVuQyxTQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7T0FDckIsQ0FBQzs7QUFFRixVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUNsQzs7O1dBRU0saUJBQUMsSUFBSSxFQUFFOztBQUVaLFVBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxzQkFFaEIsSUFBSSxDQUFDLElBQUksd0JBQ1YsSUFBSSxDQUFDLEdBQUcsNkJBQ0YsSUFBSSxDQUFDLEdBQUcsVUFBSyxJQUFJLENBQUMsR0FBRyxlQUNqQyxDQUFDO0tBQ0g7OztTQTdCRyxpQkFBaUI7OztBQWdDdkIsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLDJCQUEyQixFQUFFOztBQUVyRSxXQUFTLEVBQUUsaUJBQWlCLENBQUMsU0FBUztDQUN2QyxDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWRvY3VtZW50YXRpb24tdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgVGVyblZpZXcgZnJvbSAnLi9hdG9tLXRlcm5qcy12aWV3JztcblxuY2xhc3MgRG9jdW1lbnRhdGlvblZpZXcgZXh0ZW5kcyBUZXJuVmlldyB7XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuXG4gICAgdGhpcy5nZXRNb2RlbCgpO1xuICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cbiAgICAgIHRoaXMuZ2V0TW9kZWwoKS5kZXN0cm95T3ZlcmxheSgpO1xuXG4gICAgfSwgZmFsc2UpO1xuXG4gICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIHRoaXMuY29udGFpbmVyLm9ubW91c2V3aGVlbCA9IChlKSA9PiB7XG5cbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfTtcblxuICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xuICB9XG5cbiAgc2V0RGF0YShkYXRhKSB7XG5cbiAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSBgXG5cbiAgICAgIDxoMz4ke2RhdGEudHlwZX08L2gzPlxuICAgICAgPHA+JHtkYXRhLmRvY308L3A+XG4gICAgICA8YSBocmVmPVwiJHtkYXRhLnVybH1cIj4ke2RhdGEudXJsfTwvcD5cbiAgICBgO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdhdG9tLXRlcm5qcy1kb2N1bWVudGF0aW9uJywge1xuXG4gIHByb3RvdHlwZTogRG9jdW1lbnRhdGlvblZpZXcucHJvdG90eXBlXG59KTtcbiJdfQ==