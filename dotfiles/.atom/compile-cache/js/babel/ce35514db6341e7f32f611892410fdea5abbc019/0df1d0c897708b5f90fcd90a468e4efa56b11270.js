'use babel';

/**
 * @access private
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var StableAdapter = (function () {
  function StableAdapter(textEditor) {
    _classCallCheck(this, StableAdapter);

    this.textEditor = textEditor;
    this.textEditorElement = atom.views.getView(this.textEditor);
  }

  _createClass(StableAdapter, [{
    key: 'enableCache',
    value: function enableCache() {
      this.useCache = true;
    }
  }, {
    key: 'clearCache',
    value: function clearCache() {
      this.useCache = false;
      delete this.heightCache;
      delete this.scrollTopCache;
      delete this.scrollLeftCache;
      delete this.maxScrollTopCache;
    }
  }, {
    key: 'onDidChangeScrollTop',
    value: function onDidChangeScrollTop(callback) {
      return this.textEditorElement.onDidChangeScrollTop(callback);
    }
  }, {
    key: 'onDidChangeScrollLeft',
    value: function onDidChangeScrollLeft(callback) {
      return this.textEditorElement.onDidChangeScrollLeft(callback);
    }
  }, {
    key: 'getHeight',
    value: function getHeight() {
      if (this.editorDestroyed()) {
        return 0;
      }

      if (this.useCache) {
        if (!this.heightCache) {
          this.heightCache = this.textEditorElement.getHeight();
        }
        return this.heightCache;
      }
      return this.textEditorElement.getHeight();
    }
  }, {
    key: 'getScrollTop',
    value: function getScrollTop() {
      if (this.editorDestroyed()) {
        return 0;
      }

      if (this.useCache) {
        if (!this.scrollTopCache) {
          this.scrollTopCache = this.computeScrollTop();
        }
        return this.scrollTopCache;
      }
      return this.computeScrollTop();
    }
  }, {
    key: 'computeScrollTop',
    value: function computeScrollTop() {
      if (this.editorDestroyed()) {
        return 0;
      }

      var scrollTop = this.textEditorElement.getScrollTop();
      var lineHeight = this.textEditor.getLineHeightInPixels();
      var firstRow = this.textEditorElement.getFirstVisibleScreenRow();
      var lineTop = this.textEditorElement.pixelPositionForScreenPosition([firstRow, 0]).top;

      if (lineTop > scrollTop) {
        firstRow -= 1;
        lineTop = this.textEditorElement.pixelPositionForScreenPosition([firstRow, 0]).top;
      }

      var lineY = firstRow * lineHeight;
      var offset = Math.min(scrollTop - lineTop, lineHeight);
      return lineY + offset;
    }
  }, {
    key: 'setScrollTop',
    value: function setScrollTop(scrollTop) {
      if (this.editorDestroyed()) {
        return;
      }

      this.textEditorElement.setScrollTop(scrollTop);
    }
  }, {
    key: 'getScrollLeft',
    value: function getScrollLeft() {
      if (this.editorDestroyed()) {
        return 0;
      }

      if (this.useCache) {
        if (!this.scrollLeftCache) {
          this.scrollLeftCache = this.textEditorElement.getScrollLeft();
        }
        return this.scrollLeftCache;
      }
      return this.textEditorElement.getScrollLeft();
    }
  }, {
    key: 'getMaxScrollTop',
    value: function getMaxScrollTop() {
      if (this.editorDestroyed()) {
        return 0;
      }

      if (this.maxScrollTopCache != null && this.useCache) {
        return this.maxScrollTopCache;
      }

      var maxScrollTop = this.textEditorElement.getScrollHeight() - this.getHeight();
      var lineHeight = this.textEditor.getLineHeightInPixels();

      if (this.scrollPastEnd) {
        maxScrollTop -= this.getHeight() - 3 * lineHeight;
      }

      if (this.useCache) {
        this.maxScrollTopCache = maxScrollTop;
      }

      return maxScrollTop;
    }
  }, {
    key: 'editorDestroyed',
    value: function editorDestroyed() {
      return !this.textEditor || this.textEditor.isDestroyed() || !this.textEditorElement.getModel() || !this.textEditorElement.parentNode;
    }
  }]);

  return StableAdapter;
})();

exports['default'] = StableAdapter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL2FkYXB0ZXJzL3N0YWJsZS1hZGFwdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7Ozs7Ozs7OztJQUtVLGFBQWE7QUFDcEIsV0FETyxhQUFhLENBQ25CLFVBQVUsRUFBRTswQkFETixhQUFhOztBQUU5QixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0dBQzdEOztlQUprQixhQUFhOztXQU1wQix1QkFBRztBQUFFLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0tBQUU7OztXQUU1QixzQkFBRztBQUNaLFVBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQTtBQUN2QixhQUFPLElBQUksQ0FBQyxjQUFjLENBQUE7QUFDMUIsYUFBTyxJQUFJLENBQUMsZUFBZSxDQUFBO0FBQzNCLGFBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFBO0tBQzlCOzs7V0FFb0IsOEJBQUMsUUFBUSxFQUFFO0FBQzlCLGFBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0tBQzdEOzs7V0FFcUIsK0JBQUMsUUFBUSxFQUFFO0FBQy9CLGFBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0tBQzlEOzs7V0FFUyxxQkFBRztBQUNYLFVBQUksSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFO0FBQUUsZUFBTyxDQUFDLENBQUE7T0FBRTs7QUFFeEMsVUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxJQUFJ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LEVBQUUsQ0FBQTtBQUM5RSxVQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixFQUFFLENBQUE7O0FBRXhELFVBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixvQkFBWSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFBO09BQ2xEOztBQUVELFVBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixZQUFJLENBQUMsaUJBQWlCLEdBQUcsWUFBWSxDQUFBO09BQ3RDOztBQUVELGFBQU8sWUFBWSxDQUFBO0tBQ3BCOzs7V0FFZSwyQkFBRztBQUNqQixhQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsSUFDN0IsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLElBQ2xDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQTtLQUMxQzs7O1NBOUdrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvVXNlcnMvbGFyc2dyYXVibmVyLy5kb3RmaWxlcy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9hZGFwdGVycy9zdGFibGUtYWRhcHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbi8qKlxuICogQGFjY2VzcyBwcml2YXRlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YWJsZUFkYXB0ZXIge1xuICBjb25zdHJ1Y3RvciAodGV4dEVkaXRvcikge1xuICAgIHRoaXMudGV4dEVkaXRvciA9IHRleHRFZGl0b3JcbiAgICB0aGlzLnRleHRFZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMudGV4dEVkaXRvcilcbiAgfVxuXG4gIGVuYWJsZUNhY2hlICgpIHsgdGhpcy51c2VDYWNoZSA9IHRydWUgfVxuXG4gIGNsZWFyQ2FjaGUgKCkge1xuICAgIHRoaXMudXNlQ2FjaGUgPSBmYWxzZVxuICAgIGRlbGV0ZSB0aGlzLmhlaWdodENhY2hlXG4gICAgZGVsZXRlIHRoaXMuc2Nyb2xsVG9wQ2FjaGVcbiAgICBkZWxldGUgdGhpcy5zY3JvbGxMZWZ0Q2FjaGVcbiAgICBkZWxldGUgdGhpcy5tYXhTY3JvbGxUb3BDYWNoZVxuICB9XG5cbiAgb25EaWRDaGFuZ2VTY3JvbGxUb3AgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dEVkaXRvckVsZW1lbnQub25EaWRDaGFuZ2VTY3JvbGxUb3AoY2FsbGJhY2spXG4gIH1cblxuICBvbkRpZENoYW5nZVNjcm9sbExlZnQgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dEVkaXRvckVsZW1lbnQub25EaWRDaGFuZ2VTY3JvbGxMZWZ0KGNhbGxiYWNrKVxuICB9XG5cbiAgZ2V0SGVpZ2h0ICgpIHtcbiAgICBpZiAodGhpcy5lZGl0b3JEZXN0cm95ZWQoKSkgeyByZXR1cm4gMCB9XG5cbiAgICBpZiAodGhpcy51c2VDYWNoZSkge1xuICAgICAgaWYgKCF0aGlzLmhlaWdodENhY2hlKSB7XG4gICAgICAgIHRoaXMuaGVpZ2h0Q2FjaGUgPSB0aGlzLnRleHRFZGl0b3JFbGVtZW50LmdldEhlaWdodCgpXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5oZWlnaHRDYWNoZVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy50ZXh0RWRpdG9yRWxlbWVudC5nZXRIZWlnaHQoKVxuICB9XG5cbiAgZ2V0U2Nyb2xsVG9wICgpIHtcbiAgICBpZiAodGhpcy5lZGl0b3JEZXN0cm95ZWQoKSkgeyByZXR1cm4gMCB9XG5cbiAgICBpZiAodGhpcy51c2VDYWNoZSkge1xuICAgICAgaWYgKCF0aGlzLnNjcm9sbFRvcENhY2hlKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9wQ2FjaGUgPSB0aGlzLmNvbXB1dGVTY3JvbGxUb3AoKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuc2Nyb2xsVG9wQ2FjaGVcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29tcHV0ZVNjcm9sbFRvcCgpXG4gIH1cblxuICBjb21wdXRlU2Nyb2xsVG9wICgpIHtcbiAgICBpZiAodGhpcy5lZGl0b3JEZXN0cm95ZWQoKSkgeyByZXR1cm4gMCB9XG5cbiAgICBjb25zdCBzY3JvbGxUb3AgPSB0aGlzLnRleHRFZGl0b3JFbGVtZW50LmdldFNjcm9sbFRvcCgpXG4gICAgY29uc3QgbGluZUhlaWdodCA9IHRoaXMudGV4dEVkaXRvci5nZXRMaW5lSGVpZ2h0SW5QaXhlbHMoKVxuICAgIGxldCBmaXJzdFJvdyA9IHRoaXMudGV4dEVkaXRvckVsZW1lbnQuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KClcbiAgICBsZXQgbGluZVRvcCA9IHRoaXMudGV4dEVkaXRvckVsZW1lbnQucGl4ZWxQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKFtmaXJzdFJvdywgMF0pLnRvcFxuXG4gICAgaWYgKGxpbmVUb3AgPiBzY3JvbGxUb3ApIHtcbiAgICAgIGZpcnN0Um93IC09IDFcbiAgICAgIGxpbmVUb3AgPSB0aGlzLnRleHRFZGl0b3JFbGVtZW50LnBpeGVsUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbihbZmlyc3RSb3csIDBdKS50b3BcbiAgICB9XG5cbiAgICBjb25zdCBsaW5lWSA9IGZpcnN0Um93ICogbGluZUhlaWdodFxuICAgIGNvbnN0IG9mZnNldCA9IE1hdGgubWluKHNjcm9sbFRvcCAtIGxpbmVUb3AsIGxpbmVIZWlnaHQpXG4gICAgcmV0dXJuIGxpbmVZICsgb2Zmc2V0XG4gIH1cblxuICBzZXRTY3JvbGxUb3AgKHNjcm9sbFRvcCkge1xuICAgIGlmICh0aGlzLmVkaXRvckRlc3Ryb3llZCgpKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLnRleHRFZGl0b3JFbGVtZW50LnNldFNjcm9sbFRvcChzY3JvbGxUb3ApXG4gIH1cblxuICBnZXRTY3JvbGxMZWZ0ICgpIHtcbiAgICBpZiAodGhpcy5lZGl0b3JEZXN0cm95ZWQoKSkgeyByZXR1cm4gMCB9XG5cbiAgICBpZiAodGhpcy51c2VDYWNoZSkge1xuICAgICAgaWYgKCF0aGlzLnNjcm9sbExlZnRDYWNoZSkge1xuICAgICAgICB0aGlzLnNjcm9sbExlZnRDYWNoZSA9IHRoaXMudGV4dEVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsTGVmdCgpXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5zY3JvbGxMZWZ0Q2FjaGVcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudGV4dEVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsTGVmdCgpXG4gIH1cblxuICBnZXRNYXhTY3JvbGxUb3AgKCkge1xuICAgIGlmICh0aGlzLmVkaXRvckRlc3Ryb3llZCgpKSB7IHJldHVybiAwIH1cblxuICAgIGlmICh0aGlzLm1heFNjcm9sbFRvcENhY2hlICE9IG51bGwgJiYgdGhpcy51c2VDYWNoZSkge1xuICAgICAgcmV0dXJuIHRoaXMubWF4U2Nyb2xsVG9wQ2FjaGVcbiAgICB9XG5cbiAgICBsZXQgbWF4U2Nyb2xsVG9wID0gdGhpcy50ZXh0RWRpdG9yRWxlbWVudC5nZXRTY3JvbGxIZWlnaHQoKSAtIHRoaXMuZ2V0SGVpZ2h0KClcbiAgICBsZXQgbGluZUhlaWdodCA9IHRoaXMudGV4dEVkaXRvci5nZXRMaW5lSGVpZ2h0SW5QaXhlbHMoKVxuXG4gICAgaWYgKHRoaXMuc2Nyb2xsUGFzdEVuZCkge1xuICAgICAgbWF4U2Nyb2xsVG9wIC09IHRoaXMuZ2V0SGVpZ2h0KCkgLSAzICogbGluZUhlaWdodFxuICAgIH1cblxuICAgIGlmICh0aGlzLnVzZUNhY2hlKSB7XG4gICAgICB0aGlzLm1heFNjcm9sbFRvcENhY2hlID0gbWF4U2Nyb2xsVG9wXG4gICAgfVxuXG4gICAgcmV0dXJuIG1heFNjcm9sbFRvcFxuICB9XG5cbiAgZWRpdG9yRGVzdHJveWVkICgpIHtcbiAgICByZXR1cm4gIXRoaXMudGV4dEVkaXRvciB8fFxuICAgICAgICAgICB0aGlzLnRleHRFZGl0b3IuaXNEZXN0cm95ZWQoKSB8fFxuICAgICAgICAgICAhdGhpcy50ZXh0RWRpdG9yRWxlbWVudC5nZXRNb2RlbCgpIHx8XG4gICAgICAgICAgICF0aGlzLnRleHRFZGl0b3JFbGVtZW50LnBhcmVudE5vZGVcbiAgfVxufVxuIl19