Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = element;

var _atomUtils = require('atom-utils');

/**
 * Generates a decorator function to convert a class into a custom element
 * through the `registerOrUpdateElement` method from `atom-utils`.
 *
 * The decorator will take care to return the generated element class so that
 * you can just export it directly as demonstrated below.
 *
 * As supported by the `registerOrUpdateElement` method, static member will
 * be available on the new class.
 *
 * **Note: As there's some limitations when modifying the prototype
 * of a custom element, if you need to inject element callbacks (like
 * `createdCallback`) through a mixin, the mixins should be included before
 * converting the class as a custom element. You'll be able to achieve that by
 * placing the `include` decorator after the `element` one as shown in the
 * second example.**
 *
 * @param  {string} elementName the node name of the element to register
 * @return {Function} the element class as returned by
 *                    `document.registerElement`
 * @example
 * @element('dummy-element-name')
 * export default class SomeClass {
 *   // ...
 * }
 *
 * @element('dummy-element-with-mixin')
 * @include(SomeMixin)
 * export default class SomeClass {
 *   // ...
 * }
 */
'use babel';

function element(elementName) {
  return function (cls) {
    var elementClass = (0, _atomUtils.registerOrUpdateElement)(elementName, {
      'class': cls
    });
    return elementClass;
  };
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL2RlY29yYXRvcnMvZWxlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7cUJBb0N3QixPQUFPOzt5QkFsQ08sWUFBWTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUZsRCxXQUFXLENBQUE7O0FBb0NJLFNBQVMsT0FBTyxDQUFFLFdBQVcsRUFBRTtBQUM1QyxTQUFPLFVBQVUsR0FBRyxFQUFFO0FBQ3BCLFFBQUksWUFBWSxHQUFHLHdDQUF3QixXQUFXLEVBQUU7QUFDdEQsZUFBTyxHQUFHO0tBQ1gsQ0FBQyxDQUFBO0FBQ0YsV0FBTyxZQUFZLENBQUE7R0FDcEIsQ0FBQTtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL2RlY29yYXRvcnMvZWxlbWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7cmVnaXN0ZXJPclVwZGF0ZUVsZW1lbnR9IGZyb20gJ2F0b20tdXRpbHMnXG5cbi8qKlxuICogR2VuZXJhdGVzIGEgZGVjb3JhdG9yIGZ1bmN0aW9uIHRvIGNvbnZlcnQgYSBjbGFzcyBpbnRvIGEgY3VzdG9tIGVsZW1lbnRcbiAqIHRocm91Z2ggdGhlIGByZWdpc3Rlck9yVXBkYXRlRWxlbWVudGAgbWV0aG9kIGZyb20gYGF0b20tdXRpbHNgLlxuICpcbiAqIFRoZSBkZWNvcmF0b3Igd2lsbCB0YWtlIGNhcmUgdG8gcmV0dXJuIHRoZSBnZW5lcmF0ZWQgZWxlbWVudCBjbGFzcyBzbyB0aGF0XG4gKiB5b3UgY2FuIGp1c3QgZXhwb3J0IGl0IGRpcmVjdGx5IGFzIGRlbW9uc3RyYXRlZCBiZWxvdy5cbiAqXG4gKiBBcyBzdXBwb3J0ZWQgYnkgdGhlIGByZWdpc3Rlck9yVXBkYXRlRWxlbWVudGAgbWV0aG9kLCBzdGF0aWMgbWVtYmVyIHdpbGxcbiAqIGJlIGF2YWlsYWJsZSBvbiB0aGUgbmV3IGNsYXNzLlxuICpcbiAqICoqTm90ZTogQXMgdGhlcmUncyBzb21lIGxpbWl0YXRpb25zIHdoZW4gbW9kaWZ5aW5nIHRoZSBwcm90b3R5cGVcbiAqIG9mIGEgY3VzdG9tIGVsZW1lbnQsIGlmIHlvdSBuZWVkIHRvIGluamVjdCBlbGVtZW50IGNhbGxiYWNrcyAobGlrZVxuICogYGNyZWF0ZWRDYWxsYmFja2ApIHRocm91Z2ggYSBtaXhpbiwgdGhlIG1peGlucyBzaG91bGQgYmUgaW5jbHVkZWQgYmVmb3JlXG4gKiBjb252ZXJ0aW5nIHRoZSBjbGFzcyBhcyBhIGN1c3RvbSBlbGVtZW50LiBZb3UnbGwgYmUgYWJsZSB0byBhY2hpZXZlIHRoYXQgYnlcbiAqIHBsYWNpbmcgdGhlIGBpbmNsdWRlYCBkZWNvcmF0b3IgYWZ0ZXIgdGhlIGBlbGVtZW50YCBvbmUgYXMgc2hvd24gaW4gdGhlXG4gKiBzZWNvbmQgZXhhbXBsZS4qKlxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gZWxlbWVudE5hbWUgdGhlIG5vZGUgbmFtZSBvZiB0aGUgZWxlbWVudCB0byByZWdpc3RlclxuICogQHJldHVybiB7RnVuY3Rpb259IHRoZSBlbGVtZW50IGNsYXNzIGFzIHJldHVybmVkIGJ5XG4gKiAgICAgICAgICAgICAgICAgICAgYGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudGBcbiAqIEBleGFtcGxlXG4gKiBAZWxlbWVudCgnZHVtbXktZWxlbWVudC1uYW1lJylcbiAqIGV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvbWVDbGFzcyB7XG4gKiAgIC8vIC4uLlxuICogfVxuICpcbiAqIEBlbGVtZW50KCdkdW1teS1lbGVtZW50LXdpdGgtbWl4aW4nKVxuICogQGluY2x1ZGUoU29tZU1peGluKVxuICogZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29tZUNsYXNzIHtcbiAqICAgLy8gLi4uXG4gKiB9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVsZW1lbnQgKGVsZW1lbnROYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoY2xzKSB7XG4gICAgbGV0IGVsZW1lbnRDbGFzcyA9IHJlZ2lzdGVyT3JVcGRhdGVFbGVtZW50KGVsZW1lbnROYW1lLCB7XG4gICAgICBjbGFzczogY2xzXG4gICAgfSlcbiAgICByZXR1cm4gZWxlbWVudENsYXNzXG4gIH1cbn1cbiJdfQ==