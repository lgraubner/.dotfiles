Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _mixto = require('mixto');

var _mixto2 = _interopRequireDefault(_mixto);

/**
 * This mixin is used by the `CanvasDrawer` in `MinimapElement` to
 * read the styles informations from the DOM to use when rendering
 * the `Minimap`.
 */
'use babel';

var DOMStylesReader = (function (_Mixin) {
  _inherits(DOMStylesReader, _Mixin);

  function DOMStylesReader() {
    _classCallCheck(this, DOMStylesReader);

    _get(Object.getPrototypeOf(DOMStylesReader.prototype), 'constructor', this).apply(this, arguments);
  }

  //    ##     ## ######## ##       ########  ######## ########   ######
  //    ##     ## ##       ##       ##     ## ##       ##     ## ##    ##
  //    ##     ## ##       ##       ##     ## ##       ##     ## ##
  //    ######### ######   ##       ########  ######   ########   ######
  //    ##     ## ##       ##       ##        ##       ##   ##         ##
  //    ##     ## ##       ##       ##        ##       ##    ##  ##    ##
  //    ##     ## ######## ######## ##        ######## ##     ##  ######

  /**
   * Computes the hue rotation on the provided `r`, `g` and `b` channels
   * by the amount of `angle`.
   *
   * @param  {number} r the red channel of the color to rotate
   * @param  {number} g the green channel of the color to rotate
   * @param  {number} b the blue channel of the color to rotate
   * @param  {number} angle the angle to rotate the hue with
   * @return {Array<number>} the rotated color channels
   * @access private
   */

  _createClass(DOMStylesReader, [{
    key: 'retrieveStyleFromDom',

    /**
     * Returns the computed values for the given property and scope in the DOM.
     *
     * This function insert a dummy element in the DOM to compute
     * its style, return the specified property, and clear the content of the
     * dummy element.
     *
     * @param  {Array<string>} scopes a list of classes reprensenting the scope
     *                                to build
     * @param  {string} property the name of the style property to compute
     * @param  {boolean} [shadowRoot=true] whether to compute the style inside
     *                                     a shadow DOM or not
     * @param  {boolean} [cache=true] whether to cache the computed value or not
     * @return {string} the computed property's value
     */
    value: function retrieveStyleFromDom(scopes, property) {
      var shadowRoot = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
      var cache = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

      this.ensureCache();

      var key = scopes.join(' ');
      var cachedData = this.constructor.domStylesCache[key];

      if (cache && (cachedData ? cachedData[property] : void 0) != null) {
        return cachedData[property];
      }

      this.ensureDummyNodeExistence(shadowRoot);

      if (!cachedData) {
        this.constructor.domStylesCache[key] = cachedData = {};
      }

      var parent = this.dummyNode;
      for (var i = 0, len = scopes.length; i < len; i++) {
        var scope = scopes[i];
        var node = document.createElement('span');
        node.className = scope.replace(/\.+/g, ' ');

        if (parent != null) {
          parent.appendChild(node);
        }

        parent = node;
      }

      var style = window.getComputedStyle(parent);
      var filter = style.getPropertyValue('-webkit-filter');
      var value = style.getPropertyValue(property);

      if (filter.indexOf('hue-rotate') > -1) {
        value = this.rotateHue(value, filter);
      }

      if (value !== '') {
        cachedData[property] = value;
      }

      this.dummyNode.innerHTML = '';
      return value;
    }

    /**
     * Creates a DOM node container for all the operations that need to read
     * styles properties from DOM.
     *
     * @param  {boolean} shadowRoot whether to create the dummy node in the shadow
     *                              DOM or not
     * @access private
     */
  }, {
    key: 'ensureDummyNodeExistence',
    value: function ensureDummyNodeExistence(shadowRoot) {
      if (this.dummyNode == null) {
        /**
         * @access private
         */
        this.dummyNode = document.createElement('span');
        this.dummyNode.style.visibility = 'hidden';
      }

      this.getDummyDOMRoot(shadowRoot).appendChild(this.dummyNode);
    }

    /**
     * Ensures the presence of the cache object in the class that received
     * this mixin.
     *
     * @access private
     */
  }, {
    key: 'ensureCache',
    value: function ensureCache() {
      if (!this.constructor.domStylesCache) {
        this.constructor.domStylesCache = {};
      }
    }

    /**
     * Invalidates the cache by emptying the cache object.
     */
  }, {
    key: 'invalidateDOMStylesCache',
    value: function invalidateDOMStylesCache() {
      this.constructor.domStylesCache = {};
    }

    /**
     * Invalidates the cache only for the first tokenization event.
     *
     * @access private
     */
  }, {
    key: 'invalidateIfFirstTokenization',
    value: function invalidateIfFirstTokenization() {
      if (this.constructor.hasTokenizedOnce) {
        return;
      }
      this.invalidateDOMStylesCache();
      this.constructor.hasTokenizedOnce = true;
    }

    /**
     * Computes the output color of `value` with a rotated hue defined
     * in `filter`.
     *
     * @param  {string} value the CSS color to apply the rotation on
     * @param  {string} filter the CSS hue rotate filter declaration
     * @return {string} the rotated CSS color
     * @access private
     */
  }, {
    key: 'rotateHue',
    value: function rotateHue(value, filter) {
      var match = value.match(/rgb(a?)\((\d+), (\d+), (\d+)(, (\d+(\.\d+)?))?\)/);

      var _match = _slicedToArray(match, 7);

      var r = _match[2];
      var g = _match[3];
      var b = _match[4];
      var a = _match[6];

      var _filter$match = filter.match(/hue-rotate\((\d+)deg\)/);

      var _filter$match2 = _slicedToArray(_filter$match, 2);

      var hue = _filter$match2[1];

      var _map = [r, g, b, a, hue].map(Number);

      var _map2 = _slicedToArray(_map, 5);

      r = _map2[0];
      g = _map2[1];
      b = _map2[2];
      a = _map2[3];
      hue = _map2[4];

      var _rotate = rotate(r, g, b, hue);

      var _rotate2 = _slicedToArray(_rotate, 3);

      r = _rotate2[0];
      g = _rotate2[1];
      b = _rotate2[2];

      if (isNaN(a)) {
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
      } else {
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
      }
    }
  }]);

  return DOMStylesReader;
})(_mixto2['default']);

exports['default'] = DOMStylesReader;
function rotate(r, g, b, angle) {
  var matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  var lumR = 0.2126;
  var lumG = 0.7152;
  var lumB = 0.0722;
  var hueRotateR = 0.143;
  var hueRotateG = 0.140;
  var hueRotateB = 0.283;
  var cos = Math.cos(angle * Math.PI / 180);
  var sin = Math.sin(angle * Math.PI / 180);

  matrix[0] = lumR + (1 - lumR) * cos - lumR * sin;
  matrix[1] = lumG - lumG * cos - lumG * sin;
  matrix[2] = lumB - lumB * cos + (1 - lumB) * sin;
  matrix[3] = lumR - lumR * cos + hueRotateR * sin;
  matrix[4] = lumG + (1 - lumG) * cos + hueRotateG * sin;
  matrix[5] = lumB - lumB * cos - hueRotateB * sin;
  matrix[6] = lumR - lumR * cos - (1 - lumR) * sin;
  matrix[7] = lumG - lumG * cos + lumG * sin;
  matrix[8] = lumB + (1 - lumB) * cos + lumB * sin;

  return [clamp(matrix[0] * r + matrix[1] * g + matrix[2] * b), clamp(matrix[3] * r + matrix[4] * g + matrix[5] * b), clamp(matrix[6] * r + matrix[7] * g + matrix[8] * b)];

  function clamp(num) {
    return Math.ceil(Math.max(0, Math.min(255, num)));
  }
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21peGlucy9kb20tc3R5bGVzLXJlYWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3FCQUVrQixPQUFPOzs7Ozs7Ozs7QUFGekIsV0FBVyxDQUFBOztJQVNVLGVBQWU7WUFBZixlQUFlOztXQUFmLGVBQWU7MEJBQWYsZUFBZTs7K0JBQWYsZUFBZTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7ZUFBZixlQUFlOzs7Ozs7Ozs7Ozs7Ozs7Ozs7V0FnQmIsOEJBQUMsTUFBTSxFQUFFLFFBQVEsRUFBbUM7VUFBakMsVUFBVSx5REFBRyxJQUFJO1VBQUUsS0FBSyx5REFBRyxJQUFJOztBQUNyRSxVQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7O0FBRWxCLFVBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDMUIsVUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUE7O0FBRXJELFVBQUksS0FBSyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQSxJQUFLLElBQUksRUFBRTtBQUNqRSxlQUFPLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUM1Qjs7QUFFRCxVQUFJLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUE7O0FBRXpDLFVBQUksQ0FBQyxVQUFVLEVBQUU7QUFDZixZQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLEdBQUcsRUFBRSxDQUFBO09BQ3ZEOztBQUVELFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUE7QUFDM0IsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLE1B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RCxRQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFJLElBQUksR0FBRyxHQUFHLEFBQUMsR0FBSSxJQUFJLEdBQUcsR0FBRyxBQUFDLENBQUE7QUFDOUMsUUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBSSxJQUFJLEdBQUcsR0FBRyxBQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFBLEdBQUksR0FBRyxDQUFBO0FBQ2xELFFBQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUksSUFBSSxHQUFHLEdBQUcsQUFBQyxHQUFHLFVBQVUsR0FBRyxHQUFHLENBQUE7QUFDbEQsUUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUEsR0FBSSxHQUFHLEdBQUcsVUFBVSxHQUFHLEdBQUcsQ0FBQTtBQUN0RCxRQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFJLElBQUksR0FBRyxHQUFHLEFBQUMsR0FBSSxVQUFVLEdBQUcsR0FBRyxBQUFDLENBQUE7QUFDcEQsUUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBSSxJQUFJLEdBQUcsR0FBRyxBQUFDLEdBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFBLEdBQUksR0FBRyxBQUFDLENBQUE7QUFDcEQsUUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBSSxJQUFJLEdBQUcsR0FBRyxBQUFDLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQTtBQUM1QyxRQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQSxHQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFBOztBQUVoRCxTQUFPLENBQ0wsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQ3BELEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUNwRCxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FDckQsQ0FBQTs7QUFFRCxXQUFTLEtBQUssQ0FBRSxHQUFHLEVBQUU7QUFDbkIsV0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtHQUNsRDtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21peGlucy9kb20tc3R5bGVzLXJlYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBNaXhpbiBmcm9tICdtaXh0bydcblxuLyoqXG4gKiBUaGlzIG1peGluIGlzIHVzZWQgYnkgdGhlIGBDYW52YXNEcmF3ZXJgIGluIGBNaW5pbWFwRWxlbWVudGAgdG9cbiAqIHJlYWQgdGhlIHN0eWxlcyBpbmZvcm1hdGlvbnMgZnJvbSB0aGUgRE9NIHRvIHVzZSB3aGVuIHJlbmRlcmluZ1xuICogdGhlIGBNaW5pbWFwYC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRE9NU3R5bGVzUmVhZGVyIGV4dGVuZHMgTWl4aW4ge1xuICAvKipcbiAgICogUmV0dXJucyB0aGUgY29tcHV0ZWQgdmFsdWVzIGZvciB0aGUgZ2l2ZW4gcHJvcGVydHkgYW5kIHNjb3BlIGluIHRoZSBET00uXG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb24gaW5zZXJ0IGEgZHVtbXkgZWxlbWVudCBpbiB0aGUgRE9NIHRvIGNvbXB1dGVcbiAgICogaXRzIHN0eWxlLCByZXR1cm4gdGhlIHNwZWNpZmllZCBwcm9wZXJ0eSwgYW5kIGNsZWFyIHRoZSBjb250ZW50IG9mIHRoZVxuICAgKiBkdW1teSBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gIHtBcnJheTxzdHJpbmc+fSBzY29wZXMgYSBsaXN0IG9mIGNsYXNzZXMgcmVwcmVuc2VudGluZyB0aGUgc2NvcGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGJ1aWxkXG4gICAqIEBwYXJhbSAge3N0cmluZ30gcHJvcGVydHkgdGhlIG5hbWUgb2YgdGhlIHN0eWxlIHByb3BlcnR5IHRvIGNvbXB1dGVcbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gW3NoYWRvd1Jvb3Q9dHJ1ZV0gd2hldGhlciB0byBjb21wdXRlIHRoZSBzdHlsZSBpbnNpZGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYSBzaGFkb3cgRE9NIG9yIG5vdFxuICAgKiBAcGFyYW0gIHtib29sZWFufSBbY2FjaGU9dHJ1ZV0gd2hldGhlciB0byBjYWNoZSB0aGUgY29tcHV0ZWQgdmFsdWUgb3Igbm90XG4gICAqIEByZXR1cm4ge3N0cmluZ30gdGhlIGNvbXB1dGVkIHByb3BlcnR5J3MgdmFsdWVcbiAgICovXG4gIHJldHJpZXZlU3R5bGVGcm9tRG9tIChzY29wZXMsIHByb3BlcnR5LCBzaGFkb3dSb290ID0gdHJ1ZSwgY2FjaGUgPSB0cnVlKSB7XG4gICAgdGhpcy5lbnN1cmVDYWNoZSgpXG5cbiAgICBsZXQga2V5ID0gc2NvcGVzLmpvaW4oJyAnKVxuICAgIGxldCBjYWNoZWREYXRhID0gdGhpcy5jb25zdHJ1Y3Rvci5kb21TdHlsZXNDYWNoZVtrZXldXG5cbiAgICBpZiAoY2FjaGUgJiYgKGNhY2hlZERhdGEgPyBjYWNoZWREYXRhW3Byb3BlcnR5XSA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGNhY2hlZERhdGFbcHJvcGVydHldXG4gICAgfVxuXG4gICAgdGhpcy5lbnN1cmVEdW1teU5vZGVFeGlzdGVuY2Uoc2hhZG93Um9vdClcblxuICAgIGlmICghY2FjaGVkRGF0YSkge1xuICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5kb21TdHlsZXNDYWNoZVtrZXldID0gY2FjaGVkRGF0YSA9IHt9XG4gICAgfVxuXG4gICAgbGV0IHBhcmVudCA9IHRoaXMuZHVtbXlOb2RlXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHNjb3Blcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbGV0IHNjb3BlID0gc2NvcGVzW2ldXG4gICAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgbm9kZS5jbGFzc05hbWUgPSBzY29wZS5yZXBsYWNlKC9cXC4rL2csICcgJylcblxuICAgICAgaWYgKHBhcmVudCAhPSBudWxsKSB7IHBhcmVudC5hcHBlbmRDaGlsZChub2RlKSB9XG5cbiAgICAgIHBhcmVudCA9IG5vZGVcbiAgICB9XG5cbiAgICBsZXQgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShwYXJlbnQpXG4gICAgbGV0IGZpbHRlciA9IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJy13ZWJraXQtZmlsdGVyJylcbiAgICBsZXQgdmFsdWUgPSBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKHByb3BlcnR5KVxuXG4gICAgaWYgKGZpbHRlci5pbmRleE9mKCdodWUtcm90YXRlJykgPiAtMSkge1xuICAgICAgdmFsdWUgPSB0aGlzLnJvdGF0ZUh1ZSh2YWx1ZSwgZmlsdGVyKVxuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPT0gJycpIHsgY2FjaGVkRGF0YVtwcm9wZXJ0eV0gPSB2YWx1ZSB9XG5cbiAgICB0aGlzLmR1bW15Tm9kZS5pbm5lckhUTUwgPSAnJ1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBET00gbm9kZSBjb250YWluZXIgZm9yIGFsbCB0aGUgb3BlcmF0aW9ucyB0aGF0IG5lZWQgdG8gcmVhZFxuICAgKiBzdHlsZXMgcHJvcGVydGllcyBmcm9tIERPTS5cbiAgICpcbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gc2hhZG93Um9vdCB3aGV0aGVyIHRvIGNyZWF0ZSB0aGUgZHVtbXkgbm9kZSBpbiB0aGUgc2hhZG93XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRE9NIG9yIG5vdFxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGVuc3VyZUR1bW15Tm9kZUV4aXN0ZW5jZSAoc2hhZG93Um9vdCkge1xuICAgIGlmICh0aGlzLmR1bW15Tm9kZSA9PSBudWxsKSB7XG4gICAgICAvKipcbiAgICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAgICovXG4gICAgICB0aGlzLmR1bW15Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgdGhpcy5kdW1teU5vZGUuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nXG4gICAgfVxuXG4gICAgdGhpcy5nZXREdW1teURPTVJvb3Qoc2hhZG93Um9vdCkuYXBwZW5kQ2hpbGQodGhpcy5kdW1teU5vZGUpXG4gIH1cblxuICAvKipcbiAgICogRW5zdXJlcyB0aGUgcHJlc2VuY2Ugb2YgdGhlIGNhY2hlIG9iamVjdCBpbiB0aGUgY2xhc3MgdGhhdCByZWNlaXZlZFxuICAgKiB0aGlzIG1peGluLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGVuc3VyZUNhY2hlICgpIHtcbiAgICBpZiAoIXRoaXMuY29uc3RydWN0b3IuZG9tU3R5bGVzQ2FjaGUpIHtcbiAgICAgIHRoaXMuY29uc3RydWN0b3IuZG9tU3R5bGVzQ2FjaGUgPSB7fVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbnZhbGlkYXRlcyB0aGUgY2FjaGUgYnkgZW1wdHlpbmcgdGhlIGNhY2hlIG9iamVjdC5cbiAgICovXG4gIGludmFsaWRhdGVET01TdHlsZXNDYWNoZSAoKSB7XG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5kb21TdHlsZXNDYWNoZSA9IHt9XG4gIH1cblxuICAvKipcbiAgICogSW52YWxpZGF0ZXMgdGhlIGNhY2hlIG9ubHkgZm9yIHRoZSBmaXJzdCB0b2tlbml6YXRpb24gZXZlbnQuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgaW52YWxpZGF0ZUlmRmlyc3RUb2tlbml6YXRpb24gKCkge1xuICAgIGlmICh0aGlzLmNvbnN0cnVjdG9yLmhhc1Rva2VuaXplZE9uY2UpIHsgcmV0dXJuIH1cbiAgICB0aGlzLmludmFsaWRhdGVET01TdHlsZXNDYWNoZSgpXG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5oYXNUb2tlbml6ZWRPbmNlID0gdHJ1ZVxuICB9XG5cbiAgLyoqXG4gICAqIENvbXB1dGVzIHRoZSBvdXRwdXQgY29sb3Igb2YgYHZhbHVlYCB3aXRoIGEgcm90YXRlZCBodWUgZGVmaW5lZFxuICAgKiBpbiBgZmlsdGVyYC5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSB2YWx1ZSB0aGUgQ1NTIGNvbG9yIHRvIGFwcGx5IHRoZSByb3RhdGlvbiBvblxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGZpbHRlciB0aGUgQ1NTIGh1ZSByb3RhdGUgZmlsdGVyIGRlY2xhcmF0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ30gdGhlIHJvdGF0ZWQgQ1NTIGNvbG9yXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgcm90YXRlSHVlICh2YWx1ZSwgZmlsdGVyKSB7XG4gICAgbGV0IG1hdGNoID0gdmFsdWUubWF0Y2goL3JnYihhPylcXCgoXFxkKyksIChcXGQrKSwgKFxcZCspKCwgKFxcZCsoXFwuXFxkKyk/KSk/XFwpLylcbiAgICBsZXQgWywgLCByLCBnLCBiLCAsIGFdID0gbWF0Y2hcblxuICAgIGxldCBbLCBodWVdID0gZmlsdGVyLm1hdGNoKC9odWUtcm90YXRlXFwoKFxcZCspZGVnXFwpLylcblxuICAgIDtbciwgZywgYiwgYSwgaHVlXSA9IFtyLCBnLCBiLCBhLCBodWVdLm1hcChOdW1iZXIpXG4gICAgO1tyLCBnLCBiXSA9IHJvdGF0ZShyLCBnLCBiLCBodWUpXG5cbiAgICBpZiAoaXNOYU4oYSkpIHtcbiAgICAgIHJldHVybiBgcmdiKCR7cn0sICR7Z30sICR7Yn0pYFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYHJnYmEoJHtyfSwgJHtnfSwgJHtifSwgJHthfSlgXG4gICAgfVxuICB9XG59XG5cbi8vICAgICMjICAgICAjIyAjIyMjIyMjIyAjIyAgICAgICAjIyMjIyMjIyAgIyMjIyMjIyMgIyMjIyMjIyMgICAjIyMjIyNcbi8vICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjICAgICMjXG4vLyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICAgIyMgICAgICMjICMjICAgICAgICMjICAgICAjIyAjI1xuLy8gICAgIyMjIyMjIyMjICMjIyMjIyAgICMjICAgICAgICMjIyMjIyMjICAjIyMjIyMgICAjIyMjIyMjIyAgICMjIyMjI1xuLy8gICAgIyMgICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAgICAjIyAgICAgICAjIyAgICMjICAgICAgICAgIyNcbi8vICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgICAjIyAgICAgICAgIyMgICAgICAgIyMgICAgIyMgICMjICAgICMjXG4vLyAgICAjIyAgICAgIyMgIyMjIyMjIyMgIyMjIyMjIyMgIyMgICAgICAgICMjIyMjIyMjICMjICAgICAjIyAgIyMjIyMjXG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIGh1ZSByb3RhdGlvbiBvbiB0aGUgcHJvdmlkZWQgYHJgLCBgZ2AgYW5kIGBiYCBjaGFubmVsc1xuICogYnkgdGhlIGFtb3VudCBvZiBgYW5nbGVgLlxuICpcbiAqIEBwYXJhbSAge251bWJlcn0gciB0aGUgcmVkIGNoYW5uZWwgb2YgdGhlIGNvbG9yIHRvIHJvdGF0ZVxuICogQHBhcmFtICB7bnVtYmVyfSBnIHRoZSBncmVlbiBjaGFubmVsIG9mIHRoZSBjb2xvciB0byByb3RhdGVcbiAqIEBwYXJhbSAge251bWJlcn0gYiB0aGUgYmx1ZSBjaGFubmVsIG9mIHRoZSBjb2xvciB0byByb3RhdGVcbiAqIEBwYXJhbSAge251bWJlcn0gYW5nbGUgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgaHVlIHdpdGhcbiAqIEByZXR1cm4ge0FycmF5PG51bWJlcj59IHRoZSByb3RhdGVkIGNvbG9yIGNoYW5uZWxzXG4gKiBAYWNjZXNzIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gcm90YXRlIChyLCBnLCBiLCBhbmdsZSkge1xuICBsZXQgbWF0cml4ID0gWzEsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDFdXG4gIGNvbnN0IGx1bVIgPSAwLjIxMjZcbiAgY29uc3QgbHVtRyA9IDAuNzE1MlxuICBjb25zdCBsdW1CID0gMC4wNzIyXG4gIGNvbnN0IGh1ZVJvdGF0ZVIgPSAwLjE0M1xuICBjb25zdCBodWVSb3RhdGVHID0gMC4xNDBcbiAgY29uc3QgaHVlUm90YXRlQiA9IDAuMjgzXG4gIGNvbnN0IGNvcyA9IE1hdGguY29zKGFuZ2xlICogTWF0aC5QSSAvIDE4MClcbiAgY29uc3Qgc2luID0gTWF0aC5zaW4oYW5nbGUgKiBNYXRoLlBJIC8gMTgwKVxuXG4gIG1hdHJpeFswXSA9IGx1bVIgKyAoMSAtIGx1bVIpICogY29zIC0gKGx1bVIgKiBzaW4pXG4gIG1hdHJpeFsxXSA9IGx1bUcgLSAobHVtRyAqIGNvcykgLSAobHVtRyAqIHNpbilcbiAgbWF0cml4WzJdID0gbHVtQiAtIChsdW1CICogY29zKSArICgxIC0gbHVtQikgKiBzaW5cbiAgbWF0cml4WzNdID0gbHVtUiAtIChsdW1SICogY29zKSArIGh1ZVJvdGF0ZVIgKiBzaW5cbiAgbWF0cml4WzRdID0gbHVtRyArICgxIC0gbHVtRykgKiBjb3MgKyBodWVSb3RhdGVHICogc2luXG4gIG1hdHJpeFs1XSA9IGx1bUIgLSAobHVtQiAqIGNvcykgLSAoaHVlUm90YXRlQiAqIHNpbilcbiAgbWF0cml4WzZdID0gbHVtUiAtIChsdW1SICogY29zKSAtICgoMSAtIGx1bVIpICogc2luKVxuICBtYXRyaXhbN10gPSBsdW1HIC0gKGx1bUcgKiBjb3MpICsgbHVtRyAqIHNpblxuICBtYXRyaXhbOF0gPSBsdW1CICsgKDEgLSBsdW1CKSAqIGNvcyArIGx1bUIgKiBzaW5cblxuICByZXR1cm4gW1xuICAgIGNsYW1wKG1hdHJpeFswXSAqIHIgKyBtYXRyaXhbMV0gKiBnICsgbWF0cml4WzJdICogYiksXG4gICAgY2xhbXAobWF0cml4WzNdICogciArIG1hdHJpeFs0XSAqIGcgKyBtYXRyaXhbNV0gKiBiKSxcbiAgICBjbGFtcChtYXRyaXhbNl0gKiByICsgbWF0cml4WzddICogZyArIG1hdHJpeFs4XSAqIGIpXG4gIF1cblxuICBmdW5jdGlvbiBjbGFtcCAobnVtKSB7XG4gICAgcmV0dXJuIE1hdGguY2VpbChNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIG51bSkpKVxuICB9XG59XG4iXX0=