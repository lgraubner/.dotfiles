(function() {
  var RegionRenderer;

  module.exports = RegionRenderer = (function() {
    function RegionRenderer() {}

    RegionRenderer.prototype.includeTextInRegion = false;

    RegionRenderer.prototype.renderRegions = function(colorMarker) {
      var i, range, ref, ref1, regions, row, rowSpan, textEditor;
      range = colorMarker.getScreenRange();
      if (range.isEmpty()) {
        return [];
      }
      rowSpan = range.end.row - range.start.row;
      regions = [];
      textEditor = colorMarker.colorBuffer.editor;
      if (rowSpan === 0) {
        regions.push(this.createRegion(range.start, range.end, colorMarker));
      } else {
        regions.push(this.createRegion(range.start, {
          row: range.start.row,
          column: 2e308
        }, colorMarker, this.screenLineForScreenRow(textEditor, range.start.row)));
        if (rowSpan > 1) {
          for (row = i = ref = range.start.row + 1, ref1 = range.end.row; ref <= ref1 ? i < ref1 : i > ref1; row = ref <= ref1 ? ++i : --i) {
            regions.push(this.createRegion({
              row: row,
              column: 0
            }, {
              row: row,
              column: 2e308
            }, colorMarker, this.screenLineForScreenRow(textEditor, row)));
          }
        }
        regions.push(this.createRegion({
          row: range.end.row,
          column: 0
        }, range.end, colorMarker, this.screenLineForScreenRow(textEditor, range.end.row)));
      }
      return regions;
    };

    RegionRenderer.prototype.screenLineForScreenRow = function(textEditor, row) {
      if (textEditor.screenLineForScreenRow != null) {
        return textEditor.screenLineForScreenRow(row);
      } else {
        return textEditor.displayBuffer.screenLines[row];
      }
    };

    RegionRenderer.prototype.createRegion = function(start, end, colorMarker, screenLine) {
      var bufferRange, charWidth, clippedEnd, clippedStart, css, endPosition, lineHeight, name, needAdjustment, ref, ref1, region, startPosition, text, textEditor, textEditorElement, value;
      textEditor = colorMarker.colorBuffer.editor;
      textEditorElement = atom.views.getView(textEditor);
      if (textEditorElement.component == null) {
        return;
      }
      lineHeight = textEditor.getLineHeightInPixels();
      charWidth = textEditor.getDefaultCharWidth();
      clippedStart = {
        row: start.row,
        column: (ref = this.clipScreenColumn(screenLine, start.column)) != null ? ref : start.column
      };
      clippedEnd = {
        row: end.row,
        column: (ref1 = this.clipScreenColumn(screenLine, end.column)) != null ? ref1 : end.column
      };
      bufferRange = textEditor.bufferRangeForScreenRange({
        start: clippedStart,
        end: clippedEnd
      });
      needAdjustment = (screenLine != null ? typeof screenLine.isSoftWrapped === "function" ? screenLine.isSoftWrapped() : void 0 : void 0) && end.column >= (screenLine != null ? screenLine.text.length : void 0) - (screenLine != null ? screenLine.softWrapIndentationDelta : void 0);
      if (needAdjustment) {
        bufferRange.end.column++;
      }
      startPosition = textEditorElement.pixelPositionForScreenPosition(clippedStart);
      endPosition = textEditorElement.pixelPositionForScreenPosition(clippedEnd);
      text = textEditor.getBuffer().getTextInRange(bufferRange);
      css = {};
      css.left = startPosition.left;
      css.top = startPosition.top;
      css.width = endPosition.left - startPosition.left;
      if (needAdjustment) {
        css.width += charWidth;
      }
      css.height = lineHeight;
      region = document.createElement('div');
      region.className = 'region';
      if (this.includeTextInRegion) {
        region.textContent = text;
      }
      if (startPosition.left === endPosition.left) {
        region.invalid = true;
      }
      for (name in css) {
        value = css[name];
        region.style[name] = value + 'px';
      }
      return region;
    };

    RegionRenderer.prototype.clipScreenColumn = function(line, column) {
      if (line != null) {
        if (line.clipScreenColumn != null) {
          return line.clipScreenColumn(column);
        } else {
          return Math.min(line.lineText.length, column);
        }
      }
    };

    return RegionRenderer;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlbmRlcmVycy9yZWdpb24tcmVuZGVyZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNOzs7NkJBQ0osbUJBQUEsR0FBcUI7OzZCQUVyQixhQUFBLEdBQWUsU0FBQyxXQUFEO0FBQ2IsVUFBQTtNQUFBLEtBQUEsR0FBUSxXQUFXLENBQUMsY0FBWixDQUFBO01BQ1IsSUFBYSxLQUFLLENBQUMsT0FBTixDQUFBLENBQWI7QUFBQSxlQUFPLEdBQVA7O01BRUEsT0FBQSxHQUFVLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBVixHQUFnQixLQUFLLENBQUMsS0FBSyxDQUFDO01BQ3RDLE9BQUEsR0FBVTtNQUVWLFVBQUEsR0FBYSxXQUFXLENBQUMsV0FBVyxDQUFDO01BRXJDLElBQUcsT0FBQSxLQUFXLENBQWQ7UUFDRSxPQUFPLENBQUMsSUFBUixDQUFhLElBQUMsQ0FBQSxZQUFELENBQWMsS0FBSyxDQUFDLEtBQXBCLEVBQTJCLEtBQUssQ0FBQyxHQUFqQyxFQUFzQyxXQUF0QyxDQUFiLEVBREY7T0FBQSxNQUFBO1FBR0UsT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFDLENBQUEsWUFBRCxDQUNYLEtBQUssQ0FBQyxLQURLLEVBRVg7VUFDRSxHQUFBLEVBQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxHQURuQjtVQUVFLE1BQUEsRUFBUSxLQUZWO1NBRlcsRUFNWCxXQU5XLEVBT1gsSUFBQyxDQUFBLHNCQUFELENBQXdCLFVBQXhCLEVBQW9DLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBaEQsQ0FQVyxDQUFiO1FBU0EsSUFBRyxPQUFBLEdBQVUsQ0FBYjtBQUNFLGVBQVcsMkhBQVg7WUFDRSxPQUFPLENBQUMsSUFBUixDQUFh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QUFNLENBQUMsT0FBUCxHQUFpQixLQUFqQjs7QUFDQSxXQUFBLFdBQUE7O1FBQUEsTUFBTSxDQUFDLEtBQU0sQ0FBQSxJQUFBLENBQWIsR0FBcUIsS0FBQSxHQUFRO0FBQTdCO2FBRUE7SUE3Q1k7OzZCQStDZCxnQkFBQSxHQUFrQixTQUFDLElBQUQsRUFBTyxNQUFQO01BQ2hCLElBQUcsWUFBSDtRQUNFLElBQUcsNkJBQUg7aUJBQ0UsSUFBSSxDQUFDLGdCQUFMLENBQXNCLE1BQXRCLEVBREY7U0FBQSxNQUFBO2lCQUdFLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUF2QixFQUErQixNQUEvQixFQUhGO1NBREY7O0lBRGdCOzs7OztBQWhHcEIiLCJzb3VyY2VzQ29udGVudCI6WyJcbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFJlZ2lvblJlbmRlcmVyXG4gIGluY2x1ZGVUZXh0SW5SZWdpb246IGZhbHNlXG5cbiAgcmVuZGVyUmVnaW9uczogKGNvbG9yTWFya2VyKSAtPlxuICAgIHJhbmdlID0gY29sb3JNYXJrZXIuZ2V0U2NyZWVuUmFuZ2UoKVxuICAgIHJldHVybiBbXSBpZiByYW5nZS5pc0VtcHR5KClcblxuICAgIHJvd1NwYW4gPSByYW5nZS5lbmQucm93IC0gcmFuZ2Uuc3RhcnQucm93XG4gICAgcmVnaW9ucyA9IFtdXG5cbiAgICB0ZXh0RWRpdG9yID0gY29sb3JNYXJrZXIuY29sb3JCdWZmZXIuZWRpdG9yXG5cbiAgICBpZiByb3dTcGFuIGlzIDBcbiAgICAgIHJlZ2lvbnMucHVzaCBAY3JlYXRlUmVnaW9uKHJhbmdlLnN0YXJ0LCByYW5nZS5lbmQsIGNvbG9yTWFya2VyKVxuICAgIGVsc2VcbiAgICAgIHJlZ2lvbnMucHVzaCBAY3JlYXRlUmVnaW9uKFxuICAgICAgICByYW5nZS5zdGFydCxcbiAgICAgICAge1xuICAgICAgICAgIHJvdzogcmFuZ2Uuc3RhcnQucm93XG4gICAgICAgICAgY29sdW1uOiBJbmZpbml0eVxuICAgICAgICB9LFxuICAgICAgICBjb2xvck1hcmtlcixcbiAgICAgICAgQHNjcmVlbkxpbmVGb3JTY3JlZW5Sb3codGV4dEVkaXRvciwgcmFuZ2Uuc3RhcnQucm93KVxuICAgICAgKVxuICAgICAgaWYgcm93U3BhbiA+IDFcbiAgICAgICAgZm9yIHJvdyBpbiBbcmFuZ2Uuc3RhcnQucm93ICsgMS4uLnJhbmdlLmVuZC5yb3ddXG4gICAgICAgICAgcmVnaW9ucy5wdXNoIEBjcmVhdGVSZWdpb24oXG4gICAgICAgICAgICB7cm93LCBjb2x1bW46IDB9LFxuICAgICAgICAgICAge3JvdywgY29sdW1uOiBJbmZpbml0eX0sXG4gICAgICAgICAgICBjb2xvck1hcmtlcixcbiAgICAgICAgICAgIEBzY3JlZW5MaW5lRm9yU2NyZWVuUm93KHRleHRFZGl0b3IsIHJvdylcbiAgICAgICAgICApXG5cbiAgICAgIHJlZ2lvbnMucHVzaCBAY3JlYXRlUmVnaW9uKFxuICAgICAgICB7cm93OiByYW5nZS5lbmQucm93LCBjb2x1bW46IDB9LFxuICAgICAgICByYW5nZS5lbmQsXG4gICAgICAgIGNvbG9yTWFya2VyLFxuICAgICAgICBAc2NyZWVuTGluZUZvclNjcmVlblJvdyh0ZXh0RWRpdG9yLCByYW5nZS5lbmQucm93KVxuICAgICAgKVxuXG4gICAgcmVnaW9uc1xuXG4gIHNjcmVlbkxpbmVGb3JTY3JlZW5Sb3c6ICh0ZXh0RWRpdG9yLCByb3cpIC0+XG4gICAgaWYgdGV4dEVkaXRvci5zY3JlZW5MaW5lRm9yU2NyZWVuUm93P1xuICAgICAgdGV4dEVkaXRvci5zY3JlZW5MaW5lRm9yU2NyZWVuUm93KHJvdylcbiAgICBlbHNlXG4gICAgICB0ZXh0RWRpdG9yLmRpc3BsYXlCdWZmZXIuc2NyZWVuTGluZXNbcm93XVxuXG4gIGNyZWF0ZVJlZ2lvbjogKHN0YXJ0LCBlbmQsIGNvbG9yTWFya2VyLCBzY3JlZW5MaW5lKSAtPlxuICAgIHRleHRFZGl0b3IgPSBjb2xvck1hcmtlci5jb2xvckJ1ZmZlci5lZGl0b3JcbiAgICB0ZXh0RWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0Vmlldyh0ZXh0RWRpdG9yKVxuXG4gICAgcmV0dXJuIHVubGVzcyB0ZXh0RWRpdG9yRWxlbWVudC5jb21wb25lbnQ/XG5cbiAgICBsaW5lSGVpZ2h0ID0gdGV4dEVkaXRvci5nZXRMaW5lSGVpZ2h0SW5QaXhlbHMoKVxuICAgIGNoYXJXaWR0aCA9IHRleHRFZGl0b3IuZ2V0RGVmYXVsdENoYXJXaWR0aCgpXG5cbiAgICBjbGlwcGVkU3RhcnQgPSB7XG4gICAgICByb3c6IHN0YXJ0LnJvd1xuICAgICAgY29sdW1uOiBAY2xpcFNjcmVlbkNvbHVtbihzY3JlZW5MaW5lLCBzdGFydC5jb2x1bW4pID8gc3RhcnQuY29sdW1uXG4gICAgfVxuICAgIGNsaXBwZWRFbmQgPSB7XG4gICAgICByb3c6IGVuZC5yb3dcbiAgICAgIGNvbHVtbjogQGNsaXBTY3JlZW5Db2x1bW4oc2NyZWVuTGluZSwgZW5kLmNvbHVtbikgPyBlbmQuY29sdW1uXG4gICAgfVxuXG4gICAgYnVmZmVyUmFuZ2UgPSB0ZXh0RWRpdG9yLmJ1ZmZlclJhbmdlRm9yU2NyZWVuUmFuZ2Uoe1xuICAgICAgc3RhcnQ6IGNsaXBwZWRTdGFydFxuICAgICAgZW5kOiBjbGlwcGVkRW5kXG4gICAgfSlcblxuICAgIG5lZWRBZGp1c3RtZW50ID0gc2NyZWVuTGluZT8uaXNTb2Z0V3JhcHBlZD8oKSBhbmQgZW5kLmNvbHVtbiA+PSBzY3JlZW5MaW5lPy50ZXh0Lmxlbmd0aCAtIHNjcmVlbkxpbmU/LnNvZnRXcmFwSW5kZW50YXRpb25EZWx0YVxuXG4gICAgYnVmZmVyUmFuZ2UuZW5kLmNvbHVtbisrIGlmIG5lZWRBZGp1c3RtZW50XG5cbiAgICBzdGFydFBvc2l0aW9uID0gdGV4dEVkaXRvckVsZW1lbnQucGl4ZWxQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKGNsaXBwZWRTdGFydClcbiAgICBlbmRQb3NpdGlvbiA9IHRleHRFZGl0b3JFbGVtZW50LnBpeGVsUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbihjbGlwcGVkRW5kKVxuXG4gICAgdGV4dCA9IHRleHRFZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0VGV4dEluUmFuZ2UoYnVmZmVyUmFuZ2UpXG5cbiAgICBjc3MgPSB7fVxuICAgIGNzcy5sZWZ0ID0gc3RhcnRQb3NpdGlvbi5sZWZ0XG4gICAgY3NzLnRvcCA9IHN0YXJ0UG9zaXRpb24udG9wXG4gICAgY3NzLndpZHRoID0gZW5kUG9zaXRpb24ubGVmdCAtIHN0YXJ0UG9zaXRpb24ubGVmdFxuICAgIGNzcy53aWR0aCArPSBjaGFyV2lkdGggaWYgbmVlZEFkanVzdG1lbnRcbiAgICBjc3MuaGVpZ2h0ID0gbGluZUhlaWdodFxuXG4gICAgcmVnaW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICByZWdpb24uY2xhc3NOYW1lID0gJ3JlZ2lvbidcbiAgICByZWdpb24udGV4dENvbnRlbnQgPSB0ZXh0IGlmIEBpbmNsdWRlVGV4dEluUmVnaW9uXG4gICAgcmVnaW9uLmludmFsaWQgPSB0cnVlIGlmIHN0YXJ0UG9zaXRpb24ubGVmdCBpcyBlbmRQb3NpdGlvbi5sZWZ0XG4gICAgcmVnaW9uLnN0eWxlW25hbWVdID0gdmFsdWUgKyAncHgnIGZvciBuYW1lLCB2YWx1ZSBvZiBjc3NcblxuICAgIHJlZ2lvblxuXG4gIGNsaXBTY3JlZW5Db2x1bW46IChsaW5lLCBjb2x1bW4pIC0+XG4gICAgaWYgbGluZT9cbiAgICAgIGlmIGxpbmUuY2xpcFNjcmVlbkNvbHVtbj9cbiAgICAgICAgbGluZS5jbGlwU2NyZWVuQ29sdW1uKGNvbHVtbilcbiAgICAgIGVsc2VcbiAgICAgICAgTWF0aC5taW4obGluZS5saW5lVGV4dC5sZW5ndGgsIGNvbHVtbilcbiJdfQ==
