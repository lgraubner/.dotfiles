(function() {
  var ColorMarker, CompositeDisposable, fill, ref;

  ref = [], CompositeDisposable = ref[0], fill = ref[1];

  module.exports = ColorMarker = (function() {
    function ColorMarker(arg) {
      this.marker = arg.marker, this.color = arg.color, this.text = arg.text, this.invalid = arg.invalid, this.colorBuffer = arg.colorBuffer;
      if (CompositeDisposable == null) {
        CompositeDisposable = require('atom').CompositeDisposable;
      }
      this.id = this.marker.id;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.marker.onDidDestroy((function(_this) {
        return function() {
          return _this.markerWasDestroyed();
        };
      })(this)));
      this.subscriptions.add(this.marker.onDidChange((function(_this) {
        return function() {
          if (_this.marker.isValid()) {
            _this.invalidateScreenRangeCache();
            return _this.checkMarkerScope();
          } else {
            return _this.destroy();
          }
        };
      })(this)));
      this.checkMarkerScope();
    }

    ColorMarker.prototype.destroy = function() {
      if (this.destroyed) {
        return;
      }
      return this.marker.destroy();
    };

    ColorMarker.prototype.markerWasDestroyed = function() {
      var ref1;
      if (this.destroyed) {
        return;
      }
      this.subscriptions.dispose();
      ref1 = {}, this.marker = ref1.marker, this.color = ref1.color, this.text = ref1.text, this.colorBuffer = ref1.colorBuffer;
      return this.destroyed = true;
    };

    ColorMarker.prototype.match = function(properties) {
      var bool;
      if (this.destroyed) {
        return false;
      }
      bool = true;
      if (properties.bufferRange != null) {
        bool && (bool = this.marker.getBufferRange().isEqual(properties.bufferRange));
      }
      if (properties.color != null) {
        bool && (bool = properties.color.isEqual(this.color));
      }
      if (properties.match != null) {
        bool && (bool = properties.match === this.text);
      }
      if (properties.text != null) {
        bool && (bool = properties.text === this.text);
      }
      return bool;
    };

    ColorMarker.prototype.serialize = function() {
      var out;
      if (this.destroyed) {
        return;
      }
      out = {
        markerId: String(this.marker.id),
        bufferRange: this.marker.getBufferRange().serialize(),
        color: this.color.serialize(),
        text: this.text,
        variables: this.color.variables
      };
      if (!this.color.isValid()) {
        out.invalid = true;
      }
      return out;
    };

    ColorMarker.prototype.checkMarkerScope = function(forceEvaluation) {
      var e, range, ref1, scope, scopeChain;
      if (forceEvaluation == null) {
        forceEvaluation = false;
      }
      if (this.destroyed || (this.colorBuffer == null)) {
        return;
      }
      range = this.marker.getBufferRange();
      try {
        scope = this.colorBuffer.editor.scopeDescriptorForBufferPosition != null ? this.colorBuffer.editor.scopeDescriptorForBufferPosition(range.start) : this.colorBuffer.editor.displayBuffer.scopeDescriptorForBufferPosition(range.start);
        scopeChain = scope.getScopeChain();
        if (!scopeChain || (!forceEvaluation && scopeChain === this.lastScopeChain)) {
          return;
        }
        this.ignored = ((ref1 = this.colorBuffer.ignoredScopes) != null ? ref1 : []).some(function(scopeRegExp) {
          return scopeChain.match(scopeRegExp);
        });
        return this.lastScopeChain = scopeChain;
      } catch (error) {
        e = error;
        return console.error(e);
      }
    };

    ColorMarker.prototype.isIgnored = function() {
      return this.ignored;
    };

    ColorMarker.prototype.getBufferRange = function() {
      return this.marker.getBufferRange();
    };

    ColorMarker.prototype.getScreenRange = function() {
      var ref1;
      return this.screenRangeCache != null ? this.screenRangeCache : this.screenRangeCache = (ref1 = this.marker) != null ? ref1.getScreenRange() : void 0;
    };

    ColorMarker.prototype.invalidateScreenRangeCache = function() {
      return this.screenRangeCache = null;
    };

    ColorMarker.prototype.convertContentToHex = function() {
      return this.convertContentInPlace('hex');
    };

    ColorMarker.prototype.convertContentToRGB = function() {
      return this.convertContentInPlace('rgb');
    };

    ColorMarker.prototype.convertContentToRGBA = function() {
      return this.convertContentInPlace('rgba');
    };

    ColorMarker.prototype.convertContentToHSL = function() {
      return this.convertContentInPlace('hsl');
    };

    ColorMarker.prototype.convertContentToHSLA = function() {
      return this.convertContentInPlace('hsla');
    };

    ColorMarker.prototype.copyContentAsHex = function() {
      return atom.clipboard.write(this.convertContent('hex'));
    };

    ColorMarker.prototype.copyContentAsRGB = function() {
      return atom.clipboard.write(this.convertContent('rgb'));
    };

    ColorMarker.prototype.copyContentAsRGBA = function() {
      return atom.clipboard.write(this.convertContent('rgba'));
    };

    ColorMarker.prototype.copyContentAsHSL = function() {
      return atom.clipboard.write(this.convertContent('hsl'));
    };

    ColorMarker.prototype.copyContentAsHSLA = function() {
      return atom.clipboard.write(this.convertContent('hsla'));
    };

    ColorMarker.prototype.convertContentInPlace = function(mode) {
      return this.colorBuffer.editor.getBuffer().setTextInRange(this.marker.getBufferRange(), this.convertContent(mode));
    };

    ColorMarker.prototype.convertContent = function(mode) {
      if (fill == null) {
        fill = require('./utils').fill;
      }
      switch (mode) {
        case 'hex':
          return '#' + fill(this.color.hex, 6);
        case 'rgb':
          return "rgb(" + (Math.round(this.color.red)) + ", " + (Math.round(this.color.green)) + ", " + (Math.round(this.color.blue)) + ")";
        case 'rgba':
          return "rgba(" + (Math.round(this.color.red)) + ", " + (Math.round(this.color.green)) + ", " + (Math.round(this.color.blue)) + ", " + this.color.alpha + ")";
        case 'hsl':
          return "hsl(" + (Math.round(this.color.hue)) + ", " + (Math.round(this.color.saturation)) + "%, " + (Math.round(this.color.lightness)) + "%)";
        case 'hsla':
          return "hsla(" + (Math.round(this.color.hue)) + ", " + (Math.round(this.color.saturation)) + "%, " + (Math.round(this.color.lightness)) + "%, " + this.color.alpha + ")";
      }
    };

    return ColorMarker;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLW1hcmtlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQThCLEVBQTlCLEVBQUMsNEJBQUQsRUFBc0I7O0VBRXRCLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyxxQkFBQyxHQUFEO01BQUUsSUFBQyxDQUFBLGFBQUEsUUFBUSxJQUFDLENBQUEsWUFBQSxPQUFPLElBQUMsQ0FBQSxXQUFBLE1BQU0sSUFBQyxDQUFBLGNBQUEsU0FBUyxJQUFDLENBQUEsa0JBQUE7TUFDaEQsSUFBOEMsMkJBQTlDO1FBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLHNCQUF4Qjs7TUFFQSxJQUFDLENBQUEsRUFBRCxHQUFNLElBQUMsQ0FBQSxNQUFNLENBQUM7TUFDZCxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BQ3JCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBcUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxrQkFBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJCLENBQW5CO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFvQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDckMsSUFBRyxLQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQSxDQUFIO1lBQ0UsS0FBQyxDQUFBLDBCQUFELENBQUE7bUJBQ0EsS0FBQyxDQUFBLGdCQUFELENBQUEsRUFGRjtXQUFBLE1BQUE7bUJBSUUsS0FBQyxDQUFBLE9BQUQsQ0FBQSxFQUpGOztRQURxQztNQUFBLENB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c0NvbnRlbnQiOlsiW0NvbXBvc2l0ZURpc3Bvc2FibGUsIGZpbGxdID0gW11cblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQ29sb3JNYXJrZXJcbiAgY29uc3RydWN0b3I6ICh7QG1hcmtlciwgQGNvbG9yLCBAdGV4dCwgQGludmFsaWQsIEBjb2xvckJ1ZmZlcn0pIC0+XG4gICAge0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbScgdW5sZXNzIENvbXBvc2l0ZURpc3Bvc2FibGU/XG5cbiAgICBAaWQgPSBAbWFya2VyLmlkXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAbWFya2VyLm9uRGlkRGVzdHJveSA9PiBAbWFya2VyV2FzRGVzdHJveWVkKClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQG1hcmtlci5vbkRpZENoYW5nZSA9PlxuICAgICAgaWYgQG1hcmtlci5pc1ZhbGlkKClcbiAgICAgICAgQGludmFsaWRhdGVTY3JlZW5SYW5nZUNhY2hlKClcbiAgICAgICAgQGNoZWNrTWFya2VyU2NvcGUoKVxuICAgICAgZWxzZVxuICAgICAgICBAZGVzdHJveSgpXG5cbiAgICBAY2hlY2tNYXJrZXJTY29wZSgpXG5cbiAgZGVzdHJveTogLT5cbiAgICByZXR1cm4gaWYgQGRlc3Ryb3llZFxuICAgIEBtYXJrZXIuZGVzdHJveSgpXG5cbiAgbWFya2VyV2FzRGVzdHJveWVkOiAtPlxuICAgIHJldHVybiBpZiBAZGVzdHJveWVkXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAge0BtYXJrZXIsIEBjb2xvciwgQHRleHQsIEBjb2xvckJ1ZmZlcn0gPSB7fVxuICAgIEBkZXN0cm95ZWQgPSB0cnVlXG5cbiAgbWF0Y2g6IChwcm9wZXJ0aWVzKSAtPlxuICAgIHJldHVybiBmYWxzZSBpZiBAZGVzdHJveWVkXG5cbiAgICBib29sID0gdHJ1ZVxuXG4gICAgaWYgcHJvcGVydGllcy5idWZmZXJSYW5nZT9cbiAgICAgIGJvb2wgJiY9IEBtYXJrZXIuZ2V0QnVmZmVyUmFuZ2UoKS5pc0VxdWFsKHByb3BlcnRpZXMuYnVmZmVyUmFuZ2UpXG4gICAgYm9vbCAmJj0gcHJvcGVydGllcy5jb2xvci5pc0VxdWFsKEBjb2xvcikgaWYgcHJvcGVydGllcy5jb2xvcj9cbiAgICBib29sICYmPSBwcm9wZXJ0aWVzLm1hdGNoIGlzIEB0ZXh0IGlmIHByb3BlcnRpZXMubWF0Y2g/XG4gICAgYm9vbCAmJj0gcHJvcGVydGllcy50ZXh0IGlzIEB0ZXh0IGlmIHByb3BlcnRpZXMudGV4dD9cblxuICAgIGJvb2xcblxuICBzZXJpYWxpemU6IC0+XG4gICAgcmV0dXJuIGlmIEBkZXN0cm95ZWRcbiAgICBvdXQgPSB7XG4gICAgICBtYXJrZXJJZDogU3RyaW5nKEBtYXJrZXIuaWQpXG4gICAgICBidWZmZXJSYW5nZTogQG1hcmtlci5nZXRCdWZmZXJSYW5nZSgpLnNlcmlhbGl6ZSgpXG4gICAgICBjb2xvcjogQGNvbG9yLnNlcmlhbGl6ZSgpXG4gICAgICB0ZXh0OiBAdGV4dFxuICAgICAgdmFyaWFibGVzOiBAY29sb3IudmFyaWFibGVzXG4gICAgfVxuICAgIG91dC5pbnZhbGlkID0gdHJ1ZSB1bmxlc3MgQGNvbG9yLmlzVmFsaWQoKVxuICAgIG91dFxuXG4gIGNoZWNrTWFya2VyU2NvcGU6IChmb3JjZUV2YWx1YXRpb249ZmFsc2UpIC0+XG4gICAgcmV0dXJuIGlmIEBkZXN0cm95ZWQgb3IgIUBjb2xvckJ1ZmZlcj9cbiAgICByYW5nZSA9IEBtYXJrZXIuZ2V0QnVmZmVyUmFuZ2UoKVxuXG4gICAgdHJ5XG4gICAgICBzY29wZSA9IGlmIEBjb2xvckJ1ZmZlci5lZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24/XG4gICAgICAgIEBjb2xvckJ1ZmZlci5lZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24ocmFuZ2Uuc3RhcnQpXG4gICAgICBlbHNlXG4gICAgICAgIEBjb2xvckJ1ZmZlci5lZGl0b3IuZGlzcGxheUJ1ZmZlci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihyYW5nZS5zdGFydClcbiAgICAgIHNjb3BlQ2hhaW4gPSBzY29wZS5nZXRTY29wZUNoYWluKClcblxuICAgICAgcmV0dXJuIGlmIG5vdCBzY29wZUNoYWluIG9yICghZm9yY2VFdmFsdWF0aW9uIGFuZCBzY29wZUNoYWluIGlzIEBsYXN0U2NvcGVDaGFpbilcblxuICAgICAgQGlnbm9yZWQgPSAoQGNvbG9yQnVmZmVyLmlnbm9yZWRTY29wZXMgPyBbXSkuc29tZSAoc2NvcGVSZWdFeHApIC0+XG4gICAgICAgIHNjb3BlQ2hhaW4ubWF0Y2goc2NvcGVSZWdFeHApXG5cbiAgICAgIEBsYXN0U2NvcGVDaGFpbiA9IHNjb3BlQ2hhaW5cbiAgICBjYXRjaCBlXG4gICAgICBjb25zb2xlLmVycm9yIGVcblxuICBpc0lnbm9yZWQ6IC0+IEBpZ25vcmVkXG5cbiAgZ2V0QnVmZmVyUmFuZ2U6IC0+IEBtYXJrZXIuZ2V0QnVmZmVyUmFuZ2UoKVxuXG4gIGdldFNjcmVlblJhbmdlOiAtPiBAc2NyZWVuUmFuZ2VDYWNoZSA/PSBAbWFya2VyPy5nZXRTY3JlZW5SYW5nZSgpXG5cbiAgaW52YWxpZGF0ZVNjcmVlblJhbmdlQ2FjaGU6IC0+IEBzY3JlZW5SYW5nZUNhY2hlID0gbnVsbFxuXG4gIGNvbnZlcnRDb250ZW50VG9IZXg6IC0+IEBjb252ZXJ0Q29udGVudEluUGxhY2UoJ2hleCcpXG5cbiAgY29udmVydENvbnRlbnRUb1JHQjogLT4gQGNvbnZlcnRDb250ZW50SW5QbGFjZSgncmdiJylcblxuICBjb252ZXJ0Q29udGVudFRvUkdCQTogLT4gQGNvbnZlcnRDb250ZW50SW5QbGFjZSgncmdiYScpXG5cbiAgY29udmVydENvbnRlbnRUb0hTTDogLT4gQGNvbnZlcnRDb250ZW50SW5QbGFjZSgnaHNsJylcblxuICBjb252ZXJ0Q29udGVudFRvSFNMQTogLT4gQGNvbnZlcnRDb250ZW50SW5QbGFjZSgnaHNsYScpXG5cbiAgY29weUNvbnRlbnRBc0hleDogLT4gYXRvbS5jbGlwYm9hcmQud3JpdGUoQGNvbnZlcnRDb250ZW50KCdoZXgnKSlcblxuICBjb3B5Q29udGVudEFzUkdCOiAtPiBhdG9tLmNsaXBib2FyZC53cml0ZShAY29udmVydENvbnRlbnQoJ3JnYicpKVxuXG4gIGNvcHlDb250ZW50QXNSR0JBOiAtPiBhdG9tLmNsaXBib2FyZC53cml0ZShAY29udmVydENvbnRlbnQoJ3JnYmEnKSlcblxuICBjb3B5Q29udGVudEFzSFNMOiAtPiBhdG9tLmNsaXBib2FyZC53cml0ZShAY29udmVydENvbnRlbnQoJ2hzbCcpKVxuXG4gIGNvcHlDb250ZW50QXNIU0xBOiAtPiBhdG9tLmNsaXBib2FyZC53cml0ZShAY29udmVydENvbnRlbnQoJ2hzbGEnKSlcblxuICBjb252ZXJ0Q29udGVudEluUGxhY2U6IChtb2RlKSAtPlxuICAgIEBjb2xvckJ1ZmZlci5lZGl0b3IuZ2V0QnVmZmVyKCkuc2V0VGV4dEluUmFuZ2UoQG1hcmtlci5nZXRCdWZmZXJSYW5nZSgpLCBAY29udmVydENvbnRlbnQobW9kZSkpXG5cbiAgY29udmVydENvbnRlbnQ6IChtb2RlKSAtPlxuICAgIHtmaWxsfSA9IHJlcXVpcmUgJy4vdXRpbHMnIHVubGVzcyBmaWxsP1xuXG4gICAgc3dpdGNoIG1vZGVcbiAgICAgIHdoZW4gJ2hleCdcbiAgICAgICAgJyMnICsgZmlsbChAY29sb3IuaGV4LCA2KVxuICAgICAgd2hlbiAncmdiJ1xuICAgICAgICBcInJnYigje01hdGgucm91bmQgQGNvbG9yLnJlZH0sICN7TWF0aC5yb3VuZCBAY29sb3IuZ3JlZW59LCAje01hdGgucm91bmQgQGNvbG9yLmJsdWV9KVwiXG4gICAgICB3aGVuICdyZ2JhJ1xuICAgICAgICBcInJnYmEoI3tNYXRoLnJvdW5kIEBjb2xvci5yZWR9LCAje01hdGgucm91bmQgQGNvbG9yLmdyZWVufSwgI3tNYXRoLnJvdW5kIEBjb2xvci5ibHVlfSwgI3tAY29sb3IuYWxwaGF9KVwiXG4gICAgICB3aGVuICdoc2wnXG4gICAgICAgIFwiaHNsKCN7TWF0aC5yb3VuZCBAY29sb3IuaHVlfSwgI3tNYXRoLnJvdW5kIEBjb2xvci5zYXR1cmF0aW9ufSUsICN7TWF0aC5yb3VuZCBAY29sb3IubGlnaHRuZXNzfSUpXCJcbiAgICAgIHdoZW4gJ2hzbGEnXG4gICAgICAgIFwiaHNsYSgje01hdGgucm91bmQgQGNvbG9yLmh1ZX0sICN7TWF0aC5yb3VuZCBAY29sb3Iuc2F0dXJhdGlvbn0lLCAje01hdGgucm91bmQgQGNvbG9yLmxpZ2h0bmVzc30lLCAje0Bjb2xvci5hbHBoYX0pXCJcbiJdfQ==
