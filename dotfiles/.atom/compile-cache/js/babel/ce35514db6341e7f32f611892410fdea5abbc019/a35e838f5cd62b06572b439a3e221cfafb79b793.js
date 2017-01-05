var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomTernjsView = require('./atom-ternjs-view');

var _atomTernjsView2 = _interopRequireDefault(_atomTernjsView);

'use babel';

var RenameView = (function (_TernView) {
  _inherits(RenameView, _TernView);

  function RenameView() {
    _classCallCheck(this, RenameView);

    _get(Object.getPrototypeOf(RenameView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(RenameView, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      this.classList.add('atom-ternjs-rename');

      var container = document.createElement('div');
      var wrapper = document.createElement('div');

      var title = document.createElement('h1');
      title.innerHTML = 'Rename';

      var sub = document.createElement('h2');
      sub.innerHTML = 'Rename a variable in a scope-aware way. (experimental)';

      var buttonClose = document.createElement('button');
      buttonClose.innerHTML = 'Close';
      buttonClose.id = 'close';
      buttonClose.classList.add('btn');
      buttonClose.classList.add('atom-ternjs-rename-close');

      buttonClose.addEventListener('click', function (e) {

        _this.model.hide();
      });

      this.nameEditor = document.createElement('atom-text-editor');
      this.nameEditor.setAttribute('mini', true);
      this.nameEditor.addEventListener('core:confirm', this.rename.bind(this));

      var buttonRename = document.createElement('button');
      buttonRename.innerHTML = 'Rename';
      buttonRename.id = 'close';
      buttonRename.classList.add('btn');
      buttonRename.classList.add('mt');
      buttonRename.addEventListener('click', this.rename.bind(this));

      wrapper.appendChild(title);
      wrapper.appendChild(sub);
      wrapper.appendChild(this.nameEditor);
      wrapper.appendChild(buttonClose);
      wrapper.appendChild(buttonRename);
      container.appendChild(wrapper);

      this.appendChild(container);
    }
  }, {
    key: 'rename',
    value: function rename() {

      var text = this.nameEditor.getModel().getBuffer().getText();

      if (!text) {

        return;
      }

      this.model.updateAllAndRename(text);
    }
  }]);

  return RenameView;
})(_atomTernjsView2['default']);

module.exports = document.registerElement('atom-ternjs-rename', {

  prototype: RenameView.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1yZW5hbWUtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzhCQUVxQixvQkFBb0I7Ozs7QUFGekMsV0FBVyxDQUFDOztJQUlOLFVBQVU7WUFBVixVQUFVOztXQUFWLFVBQVU7MEJBQVYsVUFBVTs7K0JBQVYsVUFBVTs7O2VBQVYsVUFBVTs7V0FFQywyQkFBRzs7O0FBRWhCLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7O0FBRXpDLFVBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEQsVUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFOUMsVUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QyxXQUFLLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQzs7QUFFM0IsVUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QyxTQUFHLENBQUMsU0FBUyxHQUFHLHdEQUF3RCxDQUFDOztBQUV6RSxVQUFJLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ25ELGlCQUFXLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztBQUNoQyxpQkFBVyxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUM7QUFDekIsaUJBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pDLGlCQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDOztBQUV0RCxpQkFBVyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFDLENBQUMsRUFBSzs7QUFFM0MsY0FBSyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDbkIsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzdELFVBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzQyxVQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUV6RSxVQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3BELGtCQUFZLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztBQUNsQyxrQkFBWSxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUM7QUFDMUIsa0JBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2xDLGtCQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQyxrQkFBWSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUUvRCxhQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNCLGFBQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekIsYUFBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDckMsYUFBTyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNqQyxhQUFPLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2xDLGVBQVMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRS9CLFVBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDN0I7OztXQUVLLGtCQUFHOztBQUVQLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRTlELFVBQUksQ0FBQyxJQUFJLEVBQUU7O0FBRVQsZUFBTztPQUNSOztBQUVELFVBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDckM7OztTQXpERyxVQUFVOzs7QUE0RGhCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsRUFBRTs7QUFFOUQsV0FBUyxFQUFFLFVBQVUsQ0FBQyxTQUFTO0NBQ2hDLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvbGFyc2dyYXVibmVyLy5kb3RmaWxlcy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcmVuYW1lLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IFRlcm5WaWV3IGZyb20gJy4vYXRvbS10ZXJuanMtdmlldyc7XG5cbmNsYXNzIFJlbmFtZVZpZXcgZXh0ZW5kcyBUZXJuVmlldyB7XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuXG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdhdG9tLXRlcm5qcy1yZW5hbWUnKTtcblxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIGxldCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJyk7XG4gICAgdGl0bGUuaW5uZXJIVE1MID0gJ1JlbmFtZSc7XG5cbiAgICBsZXQgc3ViID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICBzdWIuaW5uZXJIVE1MID0gJ1JlbmFtZSBhIHZhcmlhYmxlIGluIGEgc2NvcGUtYXdhcmUgd2F5LiAoZXhwZXJpbWVudGFsKSc7XG5cbiAgICBsZXQgYnV0dG9uQ2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBidXR0b25DbG9zZS5pbm5lckhUTUwgPSAnQ2xvc2UnO1xuICAgIGJ1dHRvbkNsb3NlLmlkID0gJ2Nsb3NlJztcbiAgICBidXR0b25DbG9zZS5jbGFzc0xpc3QuYWRkKCdidG4nKTtcbiAgICBidXR0b25DbG9zZS5jbGFzc0xpc3QuYWRkKCdhdG9tLXRlcm5qcy1yZW5hbWUtY2xvc2UnKTtcblxuICAgIGJ1dHRvbkNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblxuICAgICAgdGhpcy5tb2RlbC5oaWRlKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm5hbWVFZGl0b3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdG9tLXRleHQtZWRpdG9yJyk7XG4gICAgdGhpcy5uYW1lRWRpdG9yLnNldEF0dHJpYnV0ZSgnbWluaScsIHRydWUpO1xuICAgIHRoaXMubmFtZUVkaXRvci5hZGRFdmVudExpc3RlbmVyKCdjb3JlOmNvbmZpcm0nLCB0aGlzLnJlbmFtZS5iaW5kKHRoaXMpKTtcblxuICAgIGxldCBidXR0b25SZW5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBidXR0b25SZW5hbWUuaW5uZXJIVE1MID0gJ1JlbmFtZSc7XG4gICAgYnV0dG9uUmVuYW1lLmlkID0gJ2Nsb3NlJztcbiAgICBidXR0b25SZW5hbWUuY2xhc3NMaXN0LmFkZCgnYnRuJyk7XG4gICAgYnV0dG9uUmVuYW1lLmNsYXNzTGlzdC5hZGQoJ210Jyk7XG4gICAgYnV0dG9uUmVuYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5yZW5hbWUuYmluZCh0aGlzKSk7XG5cbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN1Yik7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLm5hbWVFZGl0b3IpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoYnV0dG9uQ2xvc2UpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoYnV0dG9uUmVuYW1lKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQod3JhcHBlcik7XG5cbiAgICB0aGlzLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gIH1cblxuICByZW5hbWUoKSB7XG5cbiAgICBjb25zdCB0ZXh0ID0gdGhpcy5uYW1lRWRpdG9yLmdldE1vZGVsKCkuZ2V0QnVmZmVyKCkuZ2V0VGV4dCgpO1xuXG4gICAgaWYgKCF0ZXh0KSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm1vZGVsLnVwZGF0ZUFsbEFuZFJlbmFtZSh0ZXh0KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnYXRvbS10ZXJuanMtcmVuYW1lJywge1xuXG4gIHByb3RvdHlwZTogUmVuYW1lVmlldy5wcm90b3R5cGVcbn0pO1xuIl19