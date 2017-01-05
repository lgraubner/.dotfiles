'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TernView = (function (_HTMLElement) {
  _inherits(TernView, _HTMLElement);

  function TernView() {
    _classCallCheck(this, TernView);

    _get(Object.getPrototypeOf(TernView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TernView, [{
    key: 'initialize',
    value: function initialize(model) {

      this.setModel(model);

      return this;
    }
  }, {
    key: 'getModel',
    value: function getModel() {

      return this.model;
    }
  }, {
    key: 'setModel',
    value: function setModel(model) {

      this.model = model;
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      this.remove();
    }
  }]);

  return TernView;
})(HTMLElement);

exports['default'] = TernView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7SUFFUyxRQUFRO1lBQVIsUUFBUTs7V0FBUixRQUFROzBCQUFSLFFBQVE7OytCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBRWpCLG9CQUFDLEtBQUssRUFBRTs7QUFFaEIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFckIsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1dBRU8sb0JBQUc7O0FBRVQsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0tBQ25COzs7V0FFTyxrQkFBQyxLQUFLLEVBQUU7O0FBRWQsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDcEI7OztXQUVNLG1CQUFHOztBQUVSLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7U0F0QmtCLFFBQVE7R0FBUyxXQUFXOztxQkFBNUIsUUFBUSIsImZpbGUiOiIvVXNlcnMvbGFyc2dyYXVibmVyLy5kb3RmaWxlcy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXJuVmlldyBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICBpbml0aWFsaXplKG1vZGVsKSB7XG5cbiAgICB0aGlzLnNldE1vZGVsKG1vZGVsKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZ2V0TW9kZWwoKSB7XG5cbiAgICByZXR1cm4gdGhpcy5tb2RlbDtcbiAgfVxuXG4gIHNldE1vZGVsKG1vZGVsKSB7XG5cbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gIH1cblxuICBkZXN0cm95KCkge1xuXG4gICAgdGhpcy5yZW1vdmUoKTtcbiAgfVxufVxuIl19