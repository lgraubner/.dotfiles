'use babel';

/**
 * @access private
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CanvasLayer = (function () {
  function CanvasLayer() {
    _classCallCheck(this, CanvasLayer);

    /**
     * The onscreen canvas.
     * @type {HTMLCanvasElement}
     */
    this.canvas = document.createElement('canvas');
    /**
     * The onscreen canvas context.
     * @type {CanvasRenderingContext2D}
     */
    this.context = this.canvas.getContext('2d');
    this.canvas.webkitImageSmoothingEnabled = false;
    this.context.imageSmoothingEnabled = false;

    /**
    * The offscreen canvas.
    * @type {HTMLCanvasElement}
    * @access private
    */
    this.offscreenCanvas = document.createElement('canvas');
    /**
     * The offscreen canvas context.
     * @type {CanvasRenderingContext2D}
     * @access private
     */
    this.offscreenContext = this.offscreenCanvas.getContext('2d');
    this.offscreenCanvas.webkitImageSmoothingEnabled = false;
    this.offscreenContext.imageSmoothingEnabled = false;
  }

  _createClass(CanvasLayer, [{
    key: 'attach',
    value: function attach(parent) {
      if (this.canvas.parentNode) {
        return;
      }

      parent.appendChild(this.canvas);
    }
  }, {
    key: 'setSize',
    value: function setSize() {
      var width = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var height = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      this.canvas.width = width;
      this.canvas.height = height;
      this.context.imageSmoothingEnabled = false;
      this.resetOffscreenSize();
    }
  }, {
    key: 'getSize',
    value: function getSize() {
      return {
        width: this.canvas.width,
        height: this.canvas.height
      };
    }
  }, {
    key: 'resetOffscreenSize',
    value: function resetOffscreenSize() {
      this.offscreenCanvas.width = this.canvas.width;
      this.offscreenCanvas.height = this.canvas.height;
      this.offscreenContext.imageSmoothingEnabled = false;
    }
  }, {
    key: 'copyToOffscreen',
    value: function copyToOffscreen() {
      this.offscreenContext.drawImage(this.canvas, 0, 0);
    }
  }, {
    key: 'copyFromOffscreen',
    value: function copyFromOffscreen() {
      this.context.drawImage(this.offscreenCanvas, 0, 0);
    }
  }, {
    key: 'copyPartFromOffscreen',
    value: function copyPartFromOffscreen(srcY, destY, height) {
      this.context.drawImage(this.offscreenCanvas, 0, srcY, this.offscreenCanvas.width, height, 0, destY, this.offscreenCanvas.width, height);
    }
  }, {
    key: 'clearCanvas',
    value: function clearCanvas() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }]);

  return CanvasLayer;
})();

exports['default'] = CanvasLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL2NhbnZhcy1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7Ozs7Ozs7Ozs7SUFLVSxXQUFXO0FBQ2xCLFdBRE8sV0FBVyxHQUNmOzBCQURJLFdBQVc7Ozs7OztBQU01QixRQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7Ozs7O0FBSzlDLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDM0MsUUFBSSxDQUFDLE1BQU0sQ0FBQywyQkFBMkIsR0FBRyxLQUFLLENBQUE7QUFDL0MsUUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUE7Ozs7Ozs7QUFPMUMsUUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBOzs7Ozs7QUFNdkQsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzdELFFBQUksQ0FBQyxlQUFlLENBQUMsMkJBQTJCLEdBQUcsS0FBSyxDQUFBO0FBQ3hELFFBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUE7R0FDcEQ7O2VBN0JrQixXQUFXOztXQStCdkIsZ0JBQUMsTUFBTSxFQUFFO0FBQ2QsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtBQUFFLGVBQU07T0FBRTs7QUFFdEMsWUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7S0FDaEM7OztXQUVPLG1CQUF3QjtVQUF2QixLQUFLLHlEQUFHLENBQUM7VUFBRSxNQUFNLHlEQUFHLENBQUM7O0FBQzVCLFVBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtBQUN6QixVQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7QUFDM0IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUE7QUFDMUMsVUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUE7S0FDMUI7OztXQUVPLG1CQUFHO0FBQ1QsYUFBTztBQUNMLGFBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUs7QUFDeEIsY0FBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTtPQUMzQixDQUFBO0tBQ0Y7OztXQUVrQiw4QkFBRztBQUNwQixVQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQTtBQUM5QyxVQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQTtBQUNoRCxVQUFJLENBQUMsZ0JBQWdCLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFBO0tBQ3BEOzs7V0FFZSwyQkFBRztBQUNqQixVQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0tBQ25EOzs7V0FFaUIsNkJBQUc7QUFDbkIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7S0FDbkQ7OztXQUVxQiwrQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUMxQyxVQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FDcEIsSUFBSSxDQUFDLGVBQWUsRUFDcEIsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQzNDLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUM3QyxDQUFBO0tBQ0Y7OztXQUVXLHVCQUFHO0FBQ2IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQ3BFOzs7U0EzRWtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6Ii9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL2NhbnZhcy1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbi8qKlxuICogQGFjY2VzcyBwcml2YXRlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhc0xheWVyIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIC8qKlxuICAgICAqIFRoZSBvbnNjcmVlbiBjYW52YXMuXG4gICAgICogQHR5cGUge0hUTUxDYW52YXNFbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcbiAgICAvKipcbiAgICAgKiBUaGUgb25zY3JlZW4gY2FudmFzIGNvbnRleHQuXG4gICAgICogQHR5cGUge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH1cbiAgICAgKi9cbiAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gICAgdGhpcy5jYW52YXMud2Via2l0SW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2VcbiAgICB0aGlzLmNvbnRleHQuaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2VcblxuICAgIC8qKlxuICAgICogVGhlIG9mZnNjcmVlbiBjYW52YXMuXG4gICAgKiBAdHlwZSB7SFRNTENhbnZhc0VsZW1lbnR9XG4gICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAqL1xuICAgIHRoaXMub2Zmc2NyZWVuQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcbiAgICAvKipcbiAgICAgKiBUaGUgb2Zmc2NyZWVuIGNhbnZhcyBjb250ZXh0LlxuICAgICAqIEB0eXBlIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5vZmZzY3JlZW5Db250ZXh0ID0gdGhpcy5vZmZzY3JlZW5DYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuICAgIHRoaXMub2Zmc2NyZWVuQ2FudmFzLndlYmtpdEltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlXG4gICAgdGhpcy5vZmZzY3JlZW5Db250ZXh0LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlXG4gIH1cblxuICBhdHRhY2ggKHBhcmVudCkge1xuICAgIGlmICh0aGlzLmNhbnZhcy5wYXJlbnROb2RlKSB7IHJldHVybiB9XG5cbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpXG4gIH1cblxuICBzZXRTaXplICh3aWR0aCA9IDAsIGhlaWdodCA9IDApIHtcbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpZHRoXG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gaGVpZ2h0XG4gICAgdGhpcy5jb250ZXh0LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlXG4gICAgdGhpcy5yZXNldE9mZnNjcmVlblNpemUoKVxuICB9XG5cbiAgZ2V0U2l6ZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdpZHRoOiB0aGlzLmNhbnZhcy53aWR0aCxcbiAgICAgIGhlaWdodDogdGhpcy5jYW52YXMuaGVpZ2h0XG4gICAgfVxuICB9XG5cbiAgcmVzZXRPZmZzY3JlZW5TaXplICgpIHtcbiAgICB0aGlzLm9mZnNjcmVlbkNhbnZhcy53aWR0aCA9IHRoaXMuY2FudmFzLndpZHRoXG4gICAgdGhpcy5vZmZzY3JlZW5DYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0XG4gICAgdGhpcy5vZmZzY3JlZW5Db250ZXh0LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlXG4gIH1cblxuICBjb3B5VG9PZmZzY3JlZW4gKCkge1xuICAgIHRoaXMub2Zmc2NyZWVuQ29udGV4dC5kcmF3SW1hZ2UodGhpcy5jYW52YXMsIDAsIDApXG4gIH1cblxuICBjb3B5RnJvbU9mZnNjcmVlbiAoKSB7XG4gICAgdGhpcy5jb250ZXh0LmRyYXdJbWFnZSh0aGlzLm9mZnNjcmVlbkNhbnZhcywgMCwgMClcbiAgfVxuXG4gIGNvcHlQYXJ0RnJvbU9mZnNjcmVlbiAoc3JjWSwgZGVzdFksIGhlaWdodCkge1xuICAgIHRoaXMuY29udGV4dC5kcmF3SW1hZ2UoXG4gICAgICB0aGlzLm9mZnNjcmVlbkNhbnZhcyxcbiAgICAgIDAsIHNyY1ksIHRoaXMub2Zmc2NyZWVuQ2FudmFzLndpZHRoLCBoZWlnaHQsXG4gICAgICAwLCBkZXN0WSwgdGhpcy5vZmZzY3JlZW5DYW52YXMud2lkdGgsIGhlaWdodFxuICAgIClcbiAgfVxuXG4gIGNsZWFyQ2FudmFzICgpIHtcbiAgICB0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpXG4gIH1cbn1cbiJdfQ==