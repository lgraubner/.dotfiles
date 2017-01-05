var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atomTernjsView = require('./atom-ternjs-view');

var _atomTernjsView2 = _interopRequireDefault(_atomTernjsView);

'use babel';

var ReferenceView = (function (_TernView) {
  _inherits(ReferenceView, _TernView);

  function ReferenceView() {
    _classCallCheck(this, ReferenceView);

    _get(Object.getPrototypeOf(ReferenceView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ReferenceView, [{
    key: 'createdCallback',
    value: function createdCallback() {

      var container = document.createElement('div');

      this.content = document.createElement('div');
      this.closeButton = document.createElement('button');

      this.classList.add('atom-ternjs-reference');
      this.closeButton.classList.add('btn', 'atom-ternjs-reference-close');
      this.closeButton.innerHTML = 'Close';

      container.appendChild(this.closeButton);
      container.appendChild(this.content);

      this.closeButton.addEventListener('click', function (e) {
        return _atomTernjsEvents2['default'].emit('reference-hide');
      });

      this.appendChild(container);
    }
  }, {
    key: 'clickHandle',
    value: function clickHandle(i) {

      this.getModel().goToReference(i);
    }
  }, {
    key: 'buildItems',
    value: function buildItems(data) {

      var headline = document.createElement('h2');
      var list = document.createElement('ul');
      var i = 0;

      this.content.innerHTML = '';
      headline.innerHTML = data.name + ' (' + data.type + ')';
      this.content.appendChild(headline);

      for (var item of data.refs) {

        var li = document.createElement('li');
        var lineText = (0, _atomTernjsHelper.replaceTags)(item.lineText);
        lineText = lineText.replace(data.name, '<strong>' + data.name + '</strong>');

        li.innerHTML = '\n        <h3>\n          <span>\n            <span class="darken">\n              (' + (item.position.row + 1) + ':' + item.position.column + '):\n            </span>\n            <span> ' + lineText + '</span>\n          </span>\n          <span class="darken"> (' + item.file + ')</span>\n          <div class="clear"></div>\n        </h3>\n      ';

        li.addEventListener('click', this.clickHandle.bind(this, i), false);
        list.appendChild(li);

        i++;
      }

      this.content.appendChild(list);
    }
  }]);

  return ReferenceView;
})(_atomTernjsView2['default']);

module.exports = document.registerElement('atom-ternjs-reference', {

  prototype: ReferenceView.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1yZWZlcmVuY2Utdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2dDQUUwQixzQkFBc0I7O2dDQUM1QixzQkFBc0I7Ozs7OEJBQ3JCLG9CQUFvQjs7OztBQUp6QyxXQUFXLENBQUM7O0lBTU4sYUFBYTtZQUFiLGFBQWE7O1dBQWIsYUFBYTswQkFBYixhQUFhOzsrQkFBYixhQUFhOzs7ZUFBYixhQUFhOztXQUVGLDJCQUFHOztBQUVoQixVQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVoRCxVQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0MsVUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVwRCxVQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQzVDLFVBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztBQUNyRSxVQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7O0FBRXJDLGVBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3hDLGVBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVwQyxVQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFDLENBQUM7ZUFBSyw4QkFBUSxJQUFJLENBQUMsZ0JBQWdCLENBQUM7T0FBQSxDQUFDLENBQUM7O0FBRWxGLFVBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDN0I7OztXQUVVLHFCQUFDLENBQUMsRUFBRTs7QUFFYixVQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2xDOzs7V0FFUyxvQkFBQyxJQUFJLEVBQUU7O0FBRWYsVUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QyxVQUFJLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hDLFVBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFVixVQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDNUIsY0FBUSxDQUFDLFNBQVMsR0FBTSxJQUFJLENBQUMsSUFBSSxVQUFLLElBQUksQ0FBQyxJQUFJLE1BQUcsQ0FBQztBQUNuRCxVQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFbkMsV0FBSyxJQUFNLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFOztBQUU1QixZQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLFlBQUksUUFBUSxHQUFHLG1DQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQyxnQkFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksZUFBYSxJQUFJLENBQUMsSUFBSSxlQUFZLENBQUM7O0FBRXhFLFVBQUUsQ0FBQyxTQUFTLDZGQUlELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQSxTQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxvREFFekMsUUFBUSxxRUFFTSxJQUFJLENBQUMsSUFBSSx5RUFHckMsQ0FBQzs7QUFFRixVQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNwRSxZQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVyQixTQUFDLEVBQUUsQ0FBQztPQUNMOztBQUVELFVBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2hDOzs7U0E5REcsYUFBYTs7O0FBaUVuQixNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsdUJBQXVCLEVBQUU7O0FBRWpFLFdBQVMsRUFBRSxhQUFhLENBQUMsU0FBUztDQUNuQyxDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXJlZmVyZW5jZS12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7cmVwbGFjZVRhZ3N9IGZyb20gJy4vYXRvbS10ZXJuanMtaGVscGVyJztcbmltcG9ydCBlbWl0dGVyIGZyb20gJy4vYXRvbS10ZXJuanMtZXZlbnRzJztcbmltcG9ydCBUZXJuVmlldyBmcm9tICcuL2F0b20tdGVybmpzLXZpZXcnO1xuXG5jbGFzcyBSZWZlcmVuY2VWaWV3IGV4dGVuZHMgVGVyblZpZXcge1xuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcblxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgdGhpcy5jb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5jbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdhdG9tLXRlcm5qcy1yZWZlcmVuY2UnKTtcbiAgICB0aGlzLmNsb3NlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J0bicsICdhdG9tLXRlcm5qcy1yZWZlcmVuY2UtY2xvc2UnKTtcbiAgICB0aGlzLmNsb3NlQnV0dG9uLmlubmVySFRNTCA9ICdDbG9zZSc7XG5cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jbG9zZUJ1dHRvbik7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udGVudCk7XG5cbiAgICB0aGlzLmNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGVtaXR0ZXIuZW1pdCgncmVmZXJlbmNlLWhpZGUnKSk7XG5cbiAgICB0aGlzLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gIH1cblxuICBjbGlja0hhbmRsZShpKSB7XG5cbiAgICB0aGlzLmdldE1vZGVsKCkuZ29Ub1JlZmVyZW5jZShpKTtcbiAgfVxuXG4gIGJ1aWxkSXRlbXMoZGF0YSkge1xuXG4gICAgbGV0IGhlYWRsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICBsZXQgbGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgbGV0IGkgPSAwO1xuXG4gICAgdGhpcy5jb250ZW50LmlubmVySFRNTCA9ICcnO1xuICAgIGhlYWRsaW5lLmlubmVySFRNTCA9IGAke2RhdGEubmFtZX0gKCR7ZGF0YS50eXBlfSlgO1xuICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChoZWFkbGluZSk7XG5cbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZGF0YS5yZWZzKSB7XG5cbiAgICAgIGxldCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBsZXQgbGluZVRleHQgPSByZXBsYWNlVGFncyhpdGVtLmxpbmVUZXh0KTtcbiAgICAgIGxpbmVUZXh0ID0gbGluZVRleHQucmVwbGFjZShkYXRhLm5hbWUsIGA8c3Ryb25nPiR7ZGF0YS5uYW1lfTwvc3Ryb25nPmApO1xuXG4gICAgICBsaS5pbm5lckhUTUwgPSBgXG4gICAgICAgIDxoMz5cbiAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZGFya2VuXCI+XG4gICAgICAgICAgICAgICgke2l0ZW0ucG9zaXRpb24ucm93ICsgMX06JHtpdGVtLnBvc2l0aW9uLmNvbHVtbn0pOlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4+ICR7bGluZVRleHR9PC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImRhcmtlblwiPiAoJHtpdGVtLmZpbGV9KTwvc3Bhbj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2xlYXJcIj48L2Rpdj5cbiAgICAgICAgPC9oMz5cbiAgICAgIGA7XG5cbiAgICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jbGlja0hhbmRsZS5iaW5kKHRoaXMsIGkpLCBmYWxzZSk7XG4gICAgICBsaXN0LmFwcGVuZENoaWxkKGxpKTtcblxuICAgICAgaSsrO1xuICAgIH1cblxuICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChsaXN0KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnYXRvbS10ZXJuanMtcmVmZXJlbmNlJywge1xuXG4gIHByb3RvdHlwZTogUmVmZXJlbmNlVmlldy5wcm90b3R5cGVcbn0pO1xuIl19