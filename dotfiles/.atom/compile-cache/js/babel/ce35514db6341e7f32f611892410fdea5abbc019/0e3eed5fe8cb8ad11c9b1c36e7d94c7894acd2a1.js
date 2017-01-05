var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var EditorconfigWrapGuideElement = (function (_HTMLDivElement) {
	_inherits(EditorconfigWrapGuideElement, _HTMLDivElement);

	function EditorconfigWrapGuideElement() {
		_classCallCheck(this, EditorconfigWrapGuideElement);

		_get(Object.getPrototypeOf(EditorconfigWrapGuideElement.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(EditorconfigWrapGuideElement, [{
		key: 'initialize',
		// eslint-disable-line no-undef
		value: function initialize(editor, editorElement) {
			this.classList.add('ecfg-wrap-guide');
			this.editorElement = editorElement;
			this.editor = editor;
			this.visible = true;

			this.attachToLines();
			this.update();
		}
	}, {
		key: 'attachToLines',
		value: function attachToLines() {
			var editorElement = this.editorElement;

			if (editorElement && editorElement.rootElement) {
				var lines = editorElement.rootElement.querySelector('.lines');
				if (lines) {
					lines.appendChild(this);
				}
			}
		}
	}, {
		key: 'update',
		value: function update() {
			var editorElement = this.editorElement;
			// eslint-disable-next-line camelcase
			var max_line_length = this.editor.getBuffer().editorconfig.settings.max_line_length;

			if (max_line_length === 'auto') {
				// eslint-disable-line camelcase
				this.style.display = 'none';
				this.visible = false;
			} else {
				// eslint-disable-next-line camelcase
				var columnWidth = editorElement.getDefaultCharacterWidth() * max_line_length;
				if (editorElement.logicalDisplayBuffer) {
					columnWidth -= editorElement.getScrollLeft();
				} else {
					columnWidth -= this.editor.getScrollLeft();
				}
				this.style.left = Math.round(columnWidth) + 'px';
				this.style.display = 'block';
				this.visible = true;
			}
		}
	}, {
		key: 'isVisible',
		value: function isVisible() {
			return this.visible === true;
		}
	}]);

	return EditorconfigWrapGuideElement;
})(HTMLDivElement);

module.exports = document.registerElement('ecfg-wrap-guide', {
	'extends': 'div',
	prototype: EditorconfigWrapGuideElement.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2VkaXRvcmNvbmZpZy9saWIvd3JhcGd1aWRlLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUVNLDRCQUE0QjtXQUE1Qiw0QkFBNEI7O1VBQTVCLDRCQUE0Qjt3QkFBNUIsNEJBQTRCOzs2QkFBNUIsNEJBQTRCOzs7Y0FBNUIsNEJBQTRCOzs7U0FDdkIsb0JBQUMsTUFBTSxFQUFFLGFBQWEsRUFBRTtBQUNqQyxPQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3RDLE9BQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO0FBQ25DLE9BQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLE9BQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUVwQixPQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDckIsT0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0dBQ2Q7OztTQUVZLHlCQUFHO0FBQ2YsT0FBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQzs7QUFFekMsT0FBSSxhQUFhLElBQ2hCLGFBQWEsQ0FBQyxXQUFXLEVBQUU7QUFDM0IsUUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDaEUsUUFBSSxLQUFLLEVBQUU7QUFDVixVQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3hCO0lBQ0Q7R0FDRDs7O1NBRUssa0JBQUc7QUFDUixPQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDOztBQUV6QyxPQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDOztBQUV0RixPQUFJLGVBQWUsS0FBSyxNQUFNLEVBQUU7O0FBQy9CLFFBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUM1QixRQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUNyQixNQUFNOztBQUVOLFFBQUksV0FBVyxHQUFHLGFBQWEsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLGVBQWUsQ0FBQztBQUM3RSxRQUFJLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRTtBQUN2QyxnQkFBVyxJQUFJLGFBQWEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztLQUM3QyxNQUFNO0FBQ04sZ0JBQVcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO0tBQzNDO0FBQ0QsUUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsT0FBSSxDQUFDO0FBQ2pELFFBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUM3QixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztJQUNwQjtHQUNEOzs7U0FFUSxxQkFBRztBQUNYLFVBQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUM7R0FDN0I7OztRQS9DSSw0QkFBNEI7R0FBUyxjQUFjOztBQWtEekQsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLGlCQUFpQixFQUFFO0FBQzVELFlBQVMsS0FBSztBQUNkLFVBQVMsRUFBRSw0QkFBNEIsQ0FBQyxTQUFTO0NBQ2pELENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvbGFyc2dyYXVibmVyLy5kb3RmaWxlcy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9lZGl0b3Jjb25maWcvbGliL3dyYXBndWlkZS12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5jbGFzcyBFZGl0b3Jjb25maWdXcmFwR3VpZGVFbGVtZW50IGV4dGVuZHMgSFRNTERpdkVsZW1lbnQgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG5cdGluaXRpYWxpemUoZWRpdG9yLCBlZGl0b3JFbGVtZW50KSB7XG5cdFx0dGhpcy5jbGFzc0xpc3QuYWRkKCdlY2ZnLXdyYXAtZ3VpZGUnKTtcblx0XHR0aGlzLmVkaXRvckVsZW1lbnQgPSBlZGl0b3JFbGVtZW50O1xuXHRcdHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuXHRcdHRoaXMudmlzaWJsZSA9IHRydWU7XG5cblx0XHR0aGlzLmF0dGFjaFRvTGluZXMoKTtcblx0XHR0aGlzLnVwZGF0ZSgpO1xuXHR9XG5cblx0YXR0YWNoVG9MaW5lcygpIHtcblx0XHRjb25zdCBlZGl0b3JFbGVtZW50ID0gdGhpcy5lZGl0b3JFbGVtZW50O1xuXG5cdFx0aWYgKGVkaXRvckVsZW1lbnQgJiZcblx0XHRcdGVkaXRvckVsZW1lbnQucm9vdEVsZW1lbnQpIHtcblx0XHRcdGNvbnN0IGxpbmVzID0gZWRpdG9yRWxlbWVudC5yb290RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubGluZXMnKTtcblx0XHRcdGlmIChsaW5lcykge1xuXHRcdFx0XHRsaW5lcy5hcHBlbmRDaGlsZCh0aGlzKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHR1cGRhdGUoKSB7XG5cdFx0Y29uc3QgZWRpdG9yRWxlbWVudCA9IHRoaXMuZWRpdG9yRWxlbWVudDtcblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG5cdFx0Y29uc3QgbWF4X2xpbmVfbGVuZ3RoID0gdGhpcy5lZGl0b3IuZ2V0QnVmZmVyKCkuZWRpdG9yY29uZmlnLnNldHRpbmdzLm1heF9saW5lX2xlbmd0aDtcblxuXHRcdGlmIChtYXhfbGluZV9sZW5ndGggPT09ICdhdXRvJykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNhbWVsY2FzZVxuXHRcdFx0dGhpcy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0dGhpcy52aXNpYmxlID0gZmFsc2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2Vcblx0XHRcdGxldCBjb2x1bW5XaWR0aCA9IGVkaXRvckVsZW1lbnQuZ2V0RGVmYXVsdENoYXJhY3RlcldpZHRoKCkgKiBtYXhfbGluZV9sZW5ndGg7XG5cdFx0XHRpZiAoZWRpdG9yRWxlbWVudC5sb2dpY2FsRGlzcGxheUJ1ZmZlcikge1xuXHRcdFx0XHRjb2x1bW5XaWR0aCAtPSBlZGl0b3JFbGVtZW50LmdldFNjcm9sbExlZnQoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbHVtbldpZHRoIC09IHRoaXMuZWRpdG9yLmdldFNjcm9sbExlZnQoKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuc3R5bGUubGVmdCA9IGAke01hdGgucm91bmQoY29sdW1uV2lkdGgpfXB4YDtcblx0XHRcdHRoaXMuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cdFx0XHR0aGlzLnZpc2libGUgPSB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdGlzVmlzaWJsZSgpIHtcblx0XHRyZXR1cm4gdGhpcy52aXNpYmxlID09PSB0cnVlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlY2ZnLXdyYXAtZ3VpZGUnLCB7XG5cdGV4dGVuZHM6ICdkaXYnLFxuXHRwcm90b3R5cGU6IEVkaXRvcmNvbmZpZ1dyYXBHdWlkZUVsZW1lbnQucHJvdG90eXBlXG59KTtcbiJdfQ==