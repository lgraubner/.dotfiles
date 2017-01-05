(function() {
  var StatusBarView,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = StatusBarView = (function() {
    function StatusBarView() {
      this.removeElement = bind(this.removeElement, this);
      this.getElement = bind(this.getElement, this);
      this.element = document.createElement('div');
      this.element.classList.add("highlight-selected-status", "inline-block");
    }

    StatusBarView.prototype.updateCount = function(count) {
      this.element.textContent = "Highlighted: " + count;
      if (count === 0) {
        return this.element.classList.add("highlight-selected-hidden");
      } else {
        return this.element.classList.remove("highlight-selected-hidden");
      }
    };

    StatusBarView.prototype.getElement = function() {
      return this.element;
    };

    StatusBarView.prototype.removeElement = function() {
      this.element.parentNode.removeChild(this.element);
      return this.element = null;
    };

    return StatusBarView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvaGlnaGxpZ2h0LXNlbGVjdGVkL2xpYi9zdGF0dXMtYmFyLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxhQUFBO0lBQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLHVCQUFBOzs7TUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO01BQ1gsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsMkJBQXZCLEVBQW1ELGNBQW5EO0lBRlc7OzRCQUliLFdBQUEsR0FBYSxTQUFDLEtBQUQ7TUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsR0FBdUIsZUFBQSxHQUFrQjtNQUN6QyxJQUFHLEtBQUEsS0FBUyxDQUFaO2VBQ0UsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsMkJBQXZCLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBbkIsQ0FBMEIsMkJBQTFCLEVBSEY7O0lBRlc7OzRCQU9iLFVBQUEsR0FBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBO0lBRFM7OzRCQUdaLGFBQUEsR0FBZSxTQUFBO01BQ2IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxVQUFVLENBQUMsV0FBcEIsQ0FBZ0MsSUFBQyxDQUFBLE9BQWpDO2FBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUZFOzs7OztBQWhCakIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBTdGF0dXNCYXJWaWV3XG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJoaWdobGlnaHQtc2VsZWN0ZWQtc3RhdHVzXCIsXCJpbmxpbmUtYmxvY2tcIilcblxuICB1cGRhdGVDb3VudDogKGNvdW50KSAtPlxuICAgIEBlbGVtZW50LnRleHRDb250ZW50ID0gXCJIaWdobGlnaHRlZDogXCIgKyBjb3VudFxuICAgIGlmIGNvdW50ID09IDBcbiAgICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJoaWdobGlnaHQtc2VsZWN0ZWQtaGlkZGVuXCIpXG4gICAgZWxzZVxuICAgICAgQGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImhpZ2hsaWdodC1zZWxlY3RlZC1oaWRkZW5cIilcblxuICBnZXRFbGVtZW50OiA9PlxuICAgIEBlbGVtZW50XG5cbiAgcmVtb3ZlRWxlbWVudDogPT5cbiAgICBAZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKEBlbGVtZW50KVxuICAgIEBlbGVtZW50ID0gbnVsbFxuIl19
