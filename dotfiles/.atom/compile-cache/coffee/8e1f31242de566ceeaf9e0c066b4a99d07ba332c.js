(function() {
  var ColorMarkerElement, CompositeDisposable, Emitter, EventsDelegation, RENDERERS, SPEC_MODE, ref, ref1, registerOrUpdateElement,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = [], CompositeDisposable = ref[0], Emitter = ref[1];

  ref1 = require('atom-utils'), registerOrUpdateElement = ref1.registerOrUpdateElement, EventsDelegation = ref1.EventsDelegation;

  SPEC_MODE = atom.inSpecMode();

  RENDERERS = {
    'background': require('./renderers/background'),
    'outline': require('./renderers/outline'),
    'underline': require('./renderers/underline'),
    'dot': require('./renderers/dot'),
    'square-dot': require('./renderers/square-dot')
  };

  ColorMarkerElement = (function(superClass) {
    extend(ColorMarkerElement, superClass);

    function ColorMarkerElement() {
      return ColorMarkerElement.__super__.constructor.apply(this, arguments);
    }

    EventsDelegation.includeInto(ColorMarkerElement);

    ColorMarkerElement.prototype.renderer = new RENDERERS.background;

    ColorMarkerElement.prototype.createdCallback = function() {
      var ref2;
      if (Emitter == null) {
        ref2 = require('atom'), CompositeDisposable = ref2.CompositeDisposable, Emitter = ref2.Emitter;
      }
      this.emitter = new Emitter;
      return this.released = true;
    };

    ColorMarkerElement.prototype.attachedCallback = function() {};

    ColorMarkerElement.prototype.detachedCallback = function() {};

    ColorMarkerElement.prototype.onDidRelease = function(callback) {
      return this.emitter.on('did-release', callback);
    };

    ColorMarkerElement.prototype.setContainer = function(bufferElement1) {
      this.bufferElement = bufferElement1;
    };

    ColorMarkerElement.prototype.getModel = function() {
      return this.colorMarker;
    };

    ColorMarkerElement.prototype.setModel = function(colorMarker1) {
      var ref2;
      this.colorMarker = colorMarker1;
      if (!this.released) {
        return;
      }
      if (CompositeDisposable == null) {
        ref2 = require('atom'), CompositeDisposable = ref2.CompositeDisposable, Emitter = ref2.Emitter;
      }
      this.released = false;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.colorMarker.marker.onDidDestroy((function(_this) {
        return function() {
          return _this.release();
        };
      })(this)));
      this.subscriptions.add(this.colorMarker.marker.onDidChange((function(_this) {
        return function(data) {
          var isValid;
          isValid = data.isValid;
          if (isValid) {
            return _this.bufferElement.requestMarkerUpdate([_this]);
          } else {
            return _this.release();
          }
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.markerType', (function(_this) {
        return function(type) {
          if (!_this.bufferElement.useNativeDecorations()) {
            return _this.bufferElement.requestMarkerUpdate([_this]);
          }
        };
      })(this)));
      this.subscriptions.add(this.subscribeTo(this, {
        click: (function(_this) {
          return function(e) {
            var colorBuffer;
            colorBuffer = _this.colorMarker.colorBuffer;
            if (colorBuffer == null) {
              return;
            }
            return colorBuffer.selectColorMarkerAndOpenPicker(_this.colorMarker);
          };
        })(this)
      }));
      return this.render();
    };

    ColorMarkerElement.prototype.destroy = function() {
      var ref2, ref3;
      if ((ref2 = this.parentNode) != null) {
        ref2.removeChild(this);
      }
      if ((ref3 = this.subscriptions) != null) {
        ref3.dispose();
      }
      return this.clear();
    };

    ColorMarkerElement.prototype.render = function() {
      var bufferElement, cls, colorMarker, i, k, len, ref2, ref3, region, regions, renderer, style, v;
      if (!((this.colorMarker != null) && (this.colorMarker.color != null) && (this.renderer != null))) {
        return;
      }
      ref2 = this, colorMarker = ref2.colorMarker, renderer = ref2.renderer, bufferElement = ref2.bufferElement;
      if (bufferElement.editor.isDestroyed()) {
        return;
      }
      this.innerHTML = '';
      ref3 = renderer.render(colorMarker), style = ref3.style, regions = ref3.regions, cls = ref3["class"];
      regions = (regions || []).filter(function(r) {
        return r != null;
      });
      if ((regions != null ? regions.some(function(r) {
        return r != null ? r.invalid : void 0;
      }) : void 0) && !SPEC_MODE) {
        return bufferElement.requestMarkerUpdate([this]);
      }
      for (i = 0, len = regions.length; i < len; i++) {
        region = regions[i];
        this.appendChild(region);
      }
      if (cls != null) {
        this.className = cls;
      } else {
        this.className = '';
      }
      if (style != null) {
        for (k in style) {
          v = style[k];
          this.style[k] = v;
        }
      } else {
        this.style.cssText = '';
      }
      return this.lastMarkerScreenRange = colorMarker.getScreenRange();
    };

    ColorMarkerElement.prototype.checkScreenRange = function() {
      if (!((this.colorMarker != null) && (this.lastMarkerScreenRange != null))) {
        return;
      }
      if (!this.lastMarkerScreenRange.isEqual(this.colorMarker.getScreenRange())) {
        return this.render();
      }
    };

    ColorMarkerElement.prototype.isReleased = function() {
      return this.released;
    };

    ColorMarkerElement.prototype.release = function(dispatchEvent) {
      var marker;
      if (dispatchEvent == null) {
        dispatchEvent = true;
      }
      if (this.released) {
        return;
      }
      this.subscriptions.dispose();
      marker = this.colorMarker;
      this.clear();
      if (dispatchEvent) {
        return this.emitter.emit('did-release', {
          marker: marker,
          view: this
        });
      }
    };

    ColorMarkerElement.prototype.clear = function() {
      this.subscriptions = null;
      this.colorMarker = null;
      this.released = true;
      this.innerHTML = '';
      this.className = '';
      return this.style.cssText = '';
    };

    return ColorMarkerElement;

  })(HTMLElement);

  module.exports = ColorMarkerElement = registerOrUpdateElement('pigments-color-marker', ColorMarkerElement.prototype);

  ColorMarkerElement.isNativeDecorationType = function(type) {
    return type === 'gutter' || type === 'native-background' || type === 'native-outline' || type === 'native-underline' || type === 'native-dot' || type === 'native-square-dot';
  };

  ColorMarkerElement.setMarkerType = function(markerType) {
    if (ColorMarkerElement.isNativeDecorationType(markerType)) {
      return;
    }
    if (RENDERERS[markerType] == null) {
      return;
    }
    this.prototype.rendererType = markerType;
    return this.prototype.renderer = new RENDERERS[markerType];
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLW1hcmtlci1lbGVtZW50LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNEhBQUE7SUFBQTs7O0VBQUEsTUFBaUMsRUFBakMsRUFBQyw0QkFBRCxFQUFzQjs7RUFFdEIsT0FBOEMsT0FBQSxDQUFRLFlBQVIsQ0FBOUMsRUFBQyxzREFBRCxFQUEwQjs7RUFFMUIsU0FBQSxHQUFZLElBQUksQ0FBQyxVQUFMLENBQUE7O0VBQ1osU0FBQSxHQUNFO0lBQUEsWUFBQSxFQUFjLE9BQUEsQ0FBUSx3QkFBUixDQUFkO0lBQ0EsU0FBQSxFQUFXLE9BQUEsQ0FBUSxxQkFBUixDQURYO0lBRUEsV0FBQSxFQUFhLE9BQUEsQ0FBUSx1QkFBUixDQUZiO0lBR0EsS0FBQSxFQUFPLE9BQUEsQ0FBUSxpQkFBUixDQUhQO0lBSUEsWUFBQSxFQUFjLE9BQUEsQ0FBUSx3QkFBUixDQUpkOzs7RUFNSTs7Ozs7OztJQUNKLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLGtCQUE3Qjs7aUNBRUEsUUFBQSxHQUFVLElBQUksU0FBUyxDQUFDOztpQ0FFeEIsZUFBQSxHQUFpQixTQUFBO0FBQ2YsVUFBQTtNQUFBLElBQXVELGVBQXZEO1FBQUEsT0FBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQyw4Q0FBRCxFQUFzQix1QkFBdEI7O01BRUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO2FBQ2YsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUpHOztpQ0FNakIsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBOztpQ0FFbEIsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBOztpQ0FFbEIsWUFBQSxHQUFjLFNBQUMsUUFBRDthQUNaLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGFBQVosRUFBMkIs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b3NhYmxlLCBFbWl0dGVyXSA9IFtdXG5cbntyZWdpc3Rlck9yVXBkYXRlRWxlbWVudCwgRXZlbnRzRGVsZWdhdGlvbn0gPSByZXF1aXJlICdhdG9tLXV0aWxzJ1xuXG5TUEVDX01PREUgPSBhdG9tLmluU3BlY01vZGUoKVxuUkVOREVSRVJTID1cbiAgJ2JhY2tncm91bmQnOiByZXF1aXJlICcuL3JlbmRlcmVycy9iYWNrZ3JvdW5kJ1xuICAnb3V0bGluZSc6IHJlcXVpcmUgJy4vcmVuZGVyZXJzL291dGxpbmUnXG4gICd1bmRlcmxpbmUnOiByZXF1aXJlICcuL3JlbmRlcmVycy91bmRlcmxpbmUnXG4gICdkb3QnOiByZXF1aXJlICcuL3JlbmRlcmVycy9kb3QnXG4gICdzcXVhcmUtZG90JzogcmVxdWlyZSAnLi9yZW5kZXJlcnMvc3F1YXJlLWRvdCdcblxuY2xhc3MgQ29sb3JNYXJrZXJFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnRcbiAgRXZlbnRzRGVsZWdhdGlvbi5pbmNsdWRlSW50byh0aGlzKVxuXG4gIHJlbmRlcmVyOiBuZXcgUkVOREVSRVJTLmJhY2tncm91bmRcblxuICBjcmVhdGVkQ2FsbGJhY2s6IC0+XG4gICAge0NvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXJ9ID0gcmVxdWlyZSAnYXRvbScgdW5sZXNzIEVtaXR0ZXI/XG5cbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG4gICAgQHJlbGVhc2VkID0gdHJ1ZVxuXG4gIGF0dGFjaGVkQ2FsbGJhY2s6IC0+XG5cbiAgZGV0YWNoZWRDYWxsYmFjazogLT5cblxuICBvbkRpZFJlbGVhc2U6IChjYWxsYmFjaykgLT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLXJlbGVhc2UnLCBjYWxsYmFja1xuXG4gIHNldENvbnRhaW5lcjogKEBidWZmZXJFbGVtZW50KSAtPlxuXG4gIGdldE1vZGVsOiAtPiBAY29sb3JNYXJrZXJcblxuICBzZXRNb2RlbDogKEBjb2xvck1hcmtlcikgLT5cbiAgICByZXR1cm4gdW5sZXNzIEByZWxlYXNlZFxuICAgIHtDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyfSA9IHJlcXVpcmUgJ2F0b20nIHVubGVzcyBDb21wb3NpdGVEaXNwb3NhYmxlP1xuXG4gICAgQHJlbGVhc2VkID0gZmFsc2VcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBjb2xvck1hcmtlci5tYXJrZXIub25EaWREZXN0cm95ID0+IEByZWxlYXNlKClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGNvbG9yTWFya2VyLm1hcmtlci5vbkRpZENoYW5nZSAoZGF0YSkgPT5cbiAgICAgIHtpc1ZhbGlkfSA9IGRhdGFcbiAgICAgIGlmIGlzVmFsaWQgdGhlbiBAYnVmZmVyRWxlbWVudC5yZXF1ZXN0TWFya2VyVXBkYXRlKFt0aGlzXSkgZWxzZSBAcmVsZWFzZSgpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAncGlnbWVudHMubWFya2VyVHlwZScsICh0eXBlKSA9PlxuICAgICAgQGJ1ZmZlckVsZW1lbnQucmVxdWVzdE1hcmtlclVwZGF0ZShbdGhpc10pIHVubGVzcyBAYnVmZmVyRWxlbWVudC51c2VOYXRpdmVEZWNvcmF0aW9ucygpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHN1YnNjcmliZVRvIHRoaXMsXG4gICAgICBjbGljazogKGUpID0+XG4gICAgICAgIGNvbG9yQnVmZmVyID0gQGNvbG9yTWFya2VyLmNvbG9yQnVmZmVyXG5cbiAgICAgICAgcmV0dXJuIHVubGVzcyBjb2xvckJ1ZmZlcj9cblxuICAgICAgICBjb2xvckJ1ZmZlci5zZWxlY3RDb2xvck1hcmtlckFuZE9wZW5QaWNrZXIoQGNvbG9yTWFya2VyKVxuXG4gICAgQHJlbmRlcigpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAcGFyZW50Tm9kZT8ucmVtb3ZlQ2hpbGQodGhpcylcbiAgICBAc3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQGNsZWFyKClcblxuICByZW5kZXI6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAY29sb3JNYXJrZXI/IGFuZCBAY29sb3JNYXJrZXIuY29sb3I/IGFuZCBAcmVuZGVyZXI/XG5cbiAgICB7Y29sb3JNYXJrZXIsIHJlbmRlcmVyLCBidWZmZXJFbGVtZW50fSA9IHRoaXNcblxuICAgIHJldHVybiBpZiBidWZmZXJFbGVtZW50LmVkaXRvci5pc0Rlc3Ryb3llZCgpXG4gICAgQGlubmVySFRNTCA9ICcnXG4gICAge3N0eWxlLCByZWdpb25zLCBjbGFzczogY2xzfSA9IHJlbmRlcmVyLnJlbmRlcihjb2xvck1hcmtlcilcblxuICAgIHJlZ2lvbnMgPSAocmVnaW9ucyBvciBbXSkuZmlsdGVyIChyKSAtPiByP1xuXG4gICAgaWYgcmVnaW9ucz8uc29tZSgocikgLT4gcj8uaW52YWxpZCkgYW5kICFTUEVDX01PREVcbiAgICAgIHJldHVybiBidWZmZXJFbGVtZW50LnJlcXVlc3RNYXJrZXJVcGRhdGUoW3RoaXNdKVxuXG4gICAgQGFwcGVuZENoaWxkKHJlZ2lvbikgZm9yIHJlZ2lvbiBpbiByZWdpb25zXG4gICAgaWYgY2xzP1xuICAgICAgQGNsYXNzTmFtZSA9IGNsc1xuICAgIGVsc2VcbiAgICAgIEBjbGFzc05hbWUgPSAnJ1xuXG4gICAgaWYgc3R5bGU/XG4gICAgICBAc3R5bGVba10gPSB2IGZvciBrLHYgb2Ygc3R5bGVcbiAgICBlbHNlXG4gICAgICBAc3R5bGUuY3NzVGV4dCA9ICcnXG5cbiAgICBAbGFzdE1hcmtlclNjcmVlblJhbmdlID0gY29sb3JNYXJrZXIuZ2V0U2NyZWVuUmFuZ2UoKVxuXG4gIGNoZWNrU2NyZWVuUmFuZ2U6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAY29sb3JNYXJrZXI/IGFuZCBAbGFzdE1hcmtlclNjcmVlblJhbmdlP1xuICAgIHVubGVzcyBAbGFzdE1hcmtlclNjcmVlblJhbmdlLmlzRXF1YWwoQGNvbG9yTWFya2VyLmdldFNjcmVlblJhbmdlKCkpXG4gICAgICBAcmVuZGVyKClcblxuICBpc1JlbGVhc2VkOiAtPiBAcmVsZWFzZWRcblxuICByZWxlYXNlOiAoZGlzcGF0Y2hFdmVudD10cnVlKSAtPlxuICAgIHJldHVybiBpZiBAcmVsZWFzZWRcbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBtYXJrZXIgPSBAY29sb3JNYXJrZXJcbiAgICBAY2xlYXIoKVxuICAgIEBlbWl0dGVyLmVtaXQoJ2RpZC1yZWxlYXNlJywge21hcmtlciwgdmlldzogdGhpc30pIGlmIGRpc3BhdGNoRXZlbnRcblxuICBjbGVhcjogLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICBAY29sb3JNYXJrZXIgPSBudWxsXG4gICAgQHJlbGVhc2VkID0gdHJ1ZVxuICAgIEBpbm5lckhUTUwgPSAnJ1xuICAgIEBjbGFzc05hbWUgPSAnJ1xuICAgIEBzdHlsZS5jc3NUZXh0ID0gJydcblxubW9kdWxlLmV4cG9ydHMgPVxuQ29sb3JNYXJrZXJFbGVtZW50ID1cbnJlZ2lzdGVyT3JVcGRhdGVFbGVtZW50ICdwaWdtZW50cy1jb2xvci1tYXJrZXInLCBDb2xvck1hcmtlckVsZW1lbnQucHJvdG90eXBlXG5cbkNvbG9yTWFya2VyRWxlbWVudC5pc05hdGl2ZURlY29yYXRpb25UeXBlID0gKHR5cGUpIC0+XG4gIHR5cGUgaW4gW1xuICAgICdndXR0ZXInXG4gICAgJ25hdGl2ZS1iYWNrZ3JvdW5kJ1xuICAgICduYXRpdmUtb3V0bGluZSdcbiAgICAnbmF0aXZlLXVuZGVybGluZSdcbiAgICAnbmF0aXZlLWRvdCdcbiAgICAnbmF0aXZlLXNxdWFyZS1kb3QnXG4gIF1cblxuQ29sb3JNYXJrZXJFbGVtZW50LnNldE1hcmtlclR5cGUgPSAobWFya2VyVHlwZSkgLT5cbiAgcmV0dXJuIGlmIENvbG9yTWFya2VyRWxlbWVudC5pc05hdGl2ZURlY29yYXRpb25UeXBlKG1hcmtlclR5cGUpXG4gIHJldHVybiB1bmxlc3MgUkVOREVSRVJTW21hcmtlclR5cGVdP1xuXG4gIEBwcm90b3R5cGUucmVuZGVyZXJUeXBlID0gbWFya2VyVHlwZVxuICBAcHJvdG90eXBlLnJlbmRlcmVyID0gbmV3IFJFTkRFUkVSU1ttYXJrZXJUeXBlXVxuIl19
