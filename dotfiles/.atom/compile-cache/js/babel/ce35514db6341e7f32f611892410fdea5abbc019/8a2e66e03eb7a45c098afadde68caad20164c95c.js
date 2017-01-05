'use babel';

/**
 * Generates a decorator function to includes many `mixto` mixins into a class.
 *
 * @param  {...Mixin} mixins the mixins to include in the class
 * @return {function(cls:Function):Function} the decorator function that will
 *                                           include the specified mixins
 * @example
 * @include(SomeMixin)
 * export default class SomeClass {
 *   // ...
 * }
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = include;

function include() {
  for (var _len = arguments.length, mixins = Array(_len), _key = 0; _key < _len; _key++) {
    mixins[_key] = arguments[_key];
  }

  return function performInclusion(cls) {
    mixins.forEach(function (mixin) {
      mixin.includeInto(cls);
    });
    return cls;
  };
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL2RlY29yYXRvcnMvaW5jbHVkZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQWNhLE9BQU87O0FBQWhCLFNBQVMsT0FBTyxHQUFhO29DQUFSLE1BQU07QUFBTixVQUFNOzs7QUFDeEMsU0FBTyxTQUFTLGdCQUFnQixDQUFFLEdBQUcsRUFBRTtBQUNyQyxVQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQUUsV0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUFFLENBQUMsQ0FBQTtBQUNyRCxXQUFPLEdBQUcsQ0FBQTtHQUNYLENBQUE7Q0FDRiIsImZpbGUiOiIvVXNlcnMvbGFyc2dyYXVibmVyLy5kb3RmaWxlcy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9kZWNvcmF0b3JzL2luY2x1ZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIGRlY29yYXRvciBmdW5jdGlvbiB0byBpbmNsdWRlcyBtYW55IGBtaXh0b2AgbWl4aW5zIGludG8gYSBjbGFzcy5cbiAqXG4gKiBAcGFyYW0gIHsuLi5NaXhpbn0gbWl4aW5zIHRoZSBtaXhpbnMgdG8gaW5jbHVkZSBpbiB0aGUgY2xhc3NcbiAqIEByZXR1cm4ge2Z1bmN0aW9uKGNsczpGdW5jdGlvbik6RnVuY3Rpb259IHRoZSBkZWNvcmF0b3IgZnVuY3Rpb24gdGhhdCB3aWxsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlIHRoZSBzcGVjaWZpZWQgbWl4aW5zXG4gKiBAZXhhbXBsZVxuICogQGluY2x1ZGUoU29tZU1peGluKVxuICogZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29tZUNsYXNzIHtcbiAqICAgLy8gLi4uXG4gKiB9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluY2x1ZGUgKC4uLm1peGlucykge1xuICByZXR1cm4gZnVuY3Rpb24gcGVyZm9ybUluY2x1c2lvbiAoY2xzKSB7XG4gICAgbWl4aW5zLmZvckVhY2goKG1peGluKSA9PiB7IG1peGluLmluY2x1ZGVJbnRvKGNscykgfSlcbiAgICByZXR1cm4gY2xzXG4gIH1cbn1cbiJdfQ==