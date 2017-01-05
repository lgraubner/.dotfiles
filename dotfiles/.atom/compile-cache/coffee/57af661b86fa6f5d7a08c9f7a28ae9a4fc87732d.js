(function() {
  var DotRenderer;

  module.exports = DotRenderer = (function() {
    function DotRenderer() {}

    DotRenderer.prototype.render = function(colorMarker) {
      var charWidth, color, column, index, lineHeight, markers, pixelPosition, range, screenLine, textEditor, textEditorElement;
      range = colorMarker.getScreenRange();
      color = colorMarker.color;
      if (color == null) {
        return {};
      }
      textEditor = colorMarker.colorBuffer.editor;
      textEditorElement = atom.views.getView(textEditor);
      charWidth = textEditor.getDefaultCharWidth();
      markers = colorMarker.colorBuffer.findValidColorMarkers({
        intersectsScreenRowRange: [range.end.row, range.end.row]
      }).filter(function(m) {
        return m.getScreenRange().end.row === range.end.row;
      });
      index = markers.indexOf(colorMarker);
      screenLine = this.screenLineForScreenRow(textEditor, range.end.row);
      if (screenLine == null) {
        return {};
      }
      lineHeight = textEditor.getLineHeightInPixels();
      column = this.getLineLastColumn(screenLine) * charWidth;
      pixelPosition = textEditorElement.pixelPositionForScreenPosition(range.end);
      return {
        "class": 'dot',
        style: {
          backgroundColor: color.toCSS(),
          top: (pixelPosition.top + lineHeight / 2) + 'px',
          left: (column + index * 18) + 'px'
        }
      };
    };

    DotRenderer.prototype.getLineLastColumn = function(line) {
      if (line.lineText != null) {
        return line.lineText.length + 1;
      } else {
        return line.getMaxScreenColumn() + 1;
      }
    };

    DotRenderer.prototype.screenLineForScreenRow = function(textEditor, row) {
      if (textEditor.screenLineForScreenRow != null) {
        return textEditor.screenLineForScreenRow(row);
      } else {
        return textEditor.displayBuffer.screenLines[row];
      }
    };

    return DotRenderer;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlbmRlcmVycy9kb3QuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNOzs7MEJBQ0osTUFBQSxHQUFRLFNBQUMsV0FBRDtBQUNOLFVBQUE7TUFBQSxLQUFBLEdBQVEsV0FBVyxDQUFDLGNBQVosQ0FBQTtNQUVSLEtBQUEsR0FBUSxXQUFXLENBQUM7TUFFcEIsSUFBaUIsYUFBakI7QUFBQSxlQUFPLEdBQVA7O01BRUEsVUFBQSxHQUFhLFdBQVcsQ0FBQyxXQUFXLENBQUM7TUFDckMsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLFVBQW5CO01BQ3BCLFNBQUEsR0FBWSxVQUFVLENBQUMsbUJBQVgsQ0FBQTtNQUVaLE9BQUEsR0FBVSxXQUFXLENBQUMsV0FBVyxDQUFDLHFCQUF4QixDQUE4QztRQUN0RCx3QkFBQSxFQUEwQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBWCxFQUFnQixLQUFLLENBQUMsR0FBRyxDQUFDLEdBQTFCLENBRDRCO09BQTlDLENBRVIsQ0FBQyxNQUZPLENBRUEsU0FBQyxDQUFEO2VBQU8sQ0FBQyxDQUFDLGNBQUYsQ0FBQSxDQUFrQixDQUFDLEdBQUcsQ0FBQyxHQUF2QixLQUE4QixLQUFLLENBQUMsR0FBRyxDQUFDO01BQS9DLENBRkE7TUFJVixLQUFBLEdBQVEsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsV0FBaEI7TUFDUixVQUFBLEdBQWEsSUFBQyxDQUFBLHNCQUFELENBQXdCLFVBQXhCLEVBQW9DLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBOUM7TUFFYixJQUFpQixrQkFBakI7QUFBQSxlQUFPLEdBQVA7O01BRUEsVUFBQSxHQUFhLFVBQVUsQ0FBQyxxQkFBWCxDQUFBO01BQ2IsTUFBQSxHQUFTLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixVQUFuQixDQUFBLEdBQWlDO01BQzFDLGFBQUEsR0FBZ0IsaUJBQWlCLENBQUMsOEJBQWxCLENBQWlELEtBQUssQ0FBQyxHQUF2RDthQUVoQjtRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sS0FBUDtRQUNBLEtBQUEsRUFDRTtVQUFBLGVBQUEsRUFBaUIsS0FBSyxDQUFDLEtBQU4sQ0FBQSxDQUFqQjtVQUNBLEdBQUEsRUFBSyxDQUFDLGFBQWEsQ0FBQyxHQUFkLEdBQW9CLFVBQUEsR0FBYSxDQUFsQyxDQUFBLEdBQXVDLElBRDVDO1VBRUEsSUFBQSxFQUFNLENBQUMsTUFBQSxHQUFTLEtBQUEsR0FBUSxFQUFsQixDQUFBLEdBQXdCLElBRjlCO1NBRkY7O0lBeEJNOzswQkE4QlIsaUJBQUEsR0FBbUIsU0FBQyxJQUFEO01BQ2pCLElBQUcscUJBQUg7ZUFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQWQsR0FBdUIsRUFEekI7T0FBQSxNQUFBO2VBR0UsSUFBSSxDQUFDLGtCQUFMLENBQUEsQ0FBQSxHQUE0QixFQUg5Qjs7SUFEaUI7OzBCQU1uQixzQkFBQSxHQUF3QixTQUFDLFVBQUQsRUFBYSxHQUFiO01BQ3RCLElBQUcseUNBQUg7ZUFDRSxVQUFVLENBQUMsc0JBQVgsQ0FBa0MsR0FBbEMsRUFERjtPQUFBLE1BQUE7ZUFHRSxVQUFVLENBQUMsYUFBYSxDQUFDLFdBQVksQ0FBQSxHQUFBLEVBSHZDOztJQURzQjs7Ozs7QUF0QzFCIiwic291cmNlc0NvbnRlbnQiOlsiXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBEb3RSZW5kZXJlclxuICByZW5kZXI6IChjb2xvck1hcmtlcikgLT5cbiAgICByYW5nZSA9IGNvbG9yTWFya2VyLmdldFNjcmVlblJhbmdlKClcblxuICAgIGNvbG9yID0gY29sb3JNYXJrZXIuY29sb3JcblxuICAgIHJldHVybiB7fSB1bmxlc3MgY29sb3I/XG5cbiAgICB0ZXh0RWRpdG9yID0gY29sb3JNYXJrZXIuY29sb3JCdWZmZXIuZWRpdG9yXG4gICAgdGV4dEVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcodGV4dEVkaXRvcilcbiAgICBjaGFyV2lkdGggPSB0ZXh0RWRpdG9yLmdldERlZmF1bHRDaGFyV2lkdGgoKVxuXG4gICAgbWFya2VycyA9IGNvbG9yTWFya2VyLmNvbG9yQnVmZmVyLmZpbmRWYWxpZENvbG9yTWFya2Vycyh7XG4gICAgICBpbnRlcnNlY3RzU2NyZWVuUm93UmFuZ2U6IFtyYW5nZS5lbmQucm93LCByYW5nZS5lbmQucm93XVxuICAgIH0pLmZpbHRlciAobSkgLT4gbS5nZXRTY3JlZW5SYW5nZSgpLmVuZC5yb3cgaXMgcmFuZ2UuZW5kLnJvd1xuXG4gICAgaW5kZXggPSBtYXJrZXJzLmluZGV4T2YoY29sb3JNYXJrZXIpXG4gICAgc2NyZWVuTGluZSA9IEBzY3JlZW5MaW5lRm9yU2NyZWVuUm93KHRleHRFZGl0b3IsIHJhbmdlLmVuZC5yb3cpXG5cbiAgICByZXR1cm4ge30gdW5sZXNzIHNjcmVlbkxpbmU/XG5cbiAgICBsaW5lSGVpZ2h0ID0gdGV4dEVkaXRvci5nZXRMaW5lSGVpZ2h0SW5QaXhlbHMoKVxuICAgIGNvbHVtbiA9IEBnZXRMaW5lTGFzdENvbHVtbihzY3JlZW5MaW5lKSAqIGNoYXJXaWR0aFxuICAgIHBpeGVsUG9zaXRpb24gPSB0ZXh0RWRpdG9yRWxlbWVudC5waXhlbFBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24ocmFuZ2UuZW5kKVxuXG4gICAgY2xhc3M6ICdkb3QnXG4gICAgc3R5bGU6XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yLnRvQ1NTKClcbiAgICAgIHRvcDogKHBpeGVsUG9zaXRpb24udG9wICsgbGluZUhlaWdodCAvIDIpICsgJ3B4J1xuICAgICAgbGVmdDogKGNvbHVtbiArIGluZGV4ICogMTgpICsgJ3B4J1xuXG4gIGdldExpbmVMYXN0Q29sdW1uOiAobGluZSkgLT5cbiAgICBpZiBsaW5lLmxpbmVUZXh0P1xuICAgICAgbGluZS5saW5lVGV4dC5sZW5ndGggKyAxXG4gICAgZWxzZVxuICAgICAgbGluZS5nZXRNYXhTY3JlZW5Db2x1bW4oKSArIDFcblxuICBzY3JlZW5MaW5lRm9yU2NyZWVuUm93OiAodGV4dEVkaXRvciwgcm93KSAtPlxuICAgIGlmIHRleHRFZGl0b3Iuc2NyZWVuTGluZUZvclNjcmVlblJvdz9cbiAgICAgIHRleHRFZGl0b3Iuc2NyZWVuTGluZUZvclNjcmVlblJvdyhyb3cpXG4gICAgZWxzZVxuICAgICAgdGV4dEVkaXRvci5kaXNwbGF5QnVmZmVyLnNjcmVlbkxpbmVzW3Jvd11cbiJdfQ==
