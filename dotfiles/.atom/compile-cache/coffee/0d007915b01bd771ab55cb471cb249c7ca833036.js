(function() {
  var utils;

  utils = {
    fill: function(str, length, filler) {
      if (filler == null) {
        filler = '0';
      }
      while (str.length < length) {
        str = filler + str;
      }
      return str;
    },
    strip: function(str) {
      return str.replace(/\s+/g, '');
    },
    clamp: function(n) {
      return Math.min(1, Math.max(0, n));
    },
    clampInt: function(n, max) {
      if (max == null) {
        max = 100;
      }
      return Math.min(max, Math.max(0, n));
    },
    insensitive: function(s) {
      return s.split(/(?:)/).map(function(c) {
        return "(?:" + c + "|" + (c.toUpperCase()) + ")";
      }).join('');
    },
    readFloat: function(value, vars, color) {
      var res;
      if (vars == null) {
        vars = {};
      }
      res = parseFloat(value);
      if (isNaN(res) && (vars[value] != null)) {
        color.usedVariables.push(value);
        res = parseFloat(vars[value].value);
      }
      return res;
    },
    readInt: function(value, vars, color, base) {
      var res;
      if (vars == null) {
        vars = {};
      }
      if (base == null) {
        base = 10;
      }
      res = parseInt(value, base);
      if (isNaN(res) && (vars[value] != null)) {
        color.usedVariables.push(value);
        res = parseInt(vars[value].value, base);
      }
      return res;
    },
    countLines: function(string) {
      return string.split(/\r\n|\r|\n/g).length;
    },
    readIntOrPercent: function(value, vars, color) {
      var res;
      if (vars == null) {
        vars = {};
      }
      if (!/\d+/.test(value) && (vars[value] != null)) {
        color.usedVariables.push(value);
        value = vars[value].value;
      }
      if (value == null) {
        return 0/0;
      }
      if (value.indexOf('%') !== -1) {
        res = Math.round(parseFloat(value) * 2.55);
      } else {
        res = parseInt(value);
      }
      return res;
    },
    readFloatOrPercent: function(amount, vars, color) {
      var res;
      if (vars == null) {
        vars = {};
      }
      if (!/\d+/.test(amount) && (vars[amount] != null)) {
        color.usedVariables.push(amount);
        amount = vars[amount].value;
      }
      if (amount == null) {
        return 0/0;
      }
      if (amount.indexOf('%') !== -1) {
        res = parseFloat(amount) / 100;
      } else {
        res = parseFloat(amount);
      }
      return res;
    },
    findClosingIndex: function(s, startIndex, openingChar, closingChar) {
      var curStr, index, nests;
      if (startIndex == null) {
        startIndex = 0;
      }
      if (openingChar == null) {
        openingChar = "[";
      }
      if (closingChar == null) {
        closingChar = "]";
      }
      index = startIndex;
      nests = 1;
      while (nests && index < s.length) {
        curStr = s.substr(index++, 1);
        if (curStr === closingChar) {
          nests--;
        } else if (curStr === openingChar) {
          nests++;
        }
      }
      if (nests === 0) {
        return index - 1;
      } else {
        return -1;
      }
    },
    split: function(s, sep) {
      var a, c, i, l, previousStart, start;
      if (sep == null) {
        sep = ",";
      }
      a = [];
      l = s.length;
      i = 0;
      start = 0;
      previousStart = start;
      whileLoop: //;
      while (i < l) {
        c = s.substr(i, 1);
        switch (c) {
          case "(":
            i = utils.findClosingIndex(s, i + 1, c, ")");
            if (i === -1) {
              break whileLoop;
            }
            break;
          case ")":
            break whileLoop;
            break;
          case "[":
            i = utils.findClosingIndex(s, i + 1, c, "]");
            if (i === -1) {
              break whileLoop;
            }
            break;
          case "":
            i = utils.findClosingIndex(s, i + 1, c, "");
            if (i === -1) {
              break whileLoop;
            }
            break;
          case sep:
            a.push(utils.strip(s.substr(start, i - start)));
            start = i + 1;
            if (previousStart === start) {
              break whileLoop;
            }
            previousStart = start;
        }
        i++;
      }
      a.push(utils.strip(s.substr(start, i - start)));
      return a.filter(function(s) {
        return (s != null) && s.length;
      });
    }
  };

  module.exports = utils;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3V0aWxzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUEsS0FBQSxHQUNFO0lBQUEsSUFBQSxFQUFNLFNBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxNQUFkOztRQUFjLFNBQU87O0FBQ04sYUFBTSxHQUFHLENBQUMsTUFBSixHQUFhLE1BQW5CO1FBQW5CLEdBQUEsR0FBTSxNQUFBLEdBQVM7TUFBSTthQUNuQjtJQUZJLENBQU47SUFJQSxLQUFBLEVBQU8sU0FBQyxHQUFEO2FBQVMsR0FBRyxDQUFDLE9BQUosQ0FBWSxNQUFaLEVBQW9CLEVBQXBCO0lBQVQsQ0FKUDtJQU1BLEtBQUEsRUFBTyxTQUFDLENBQUQ7YUFBTyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFaLENBQVo7SUFBUCxDQU5QO0lBUUEsUUFBQSxFQUFVLFNBQUMsQ0FBRCxFQUFJLEdBQUo7O1FBQUksTUFBSTs7YUFBUSxJQUFJLENBQUMsR0FBTCxDQUFTLEdBQVQsRUFBYyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFaLENBQWQ7SUFBaEIsQ0FSVjtJQVVBLFdBQUEsRUFBYSxTQUFDLENBQUQ7YUFDWCxDQUFDLENBQUMsS0FBRixDQUFRLE1BQVIsQ0FBZSxDQUFDLEdBQWhCLENBQW9CLFNBQUMsQ0FBRDtlQUFPLEtBQUEsR0FBTSxDQUFOLEdBQVEsR0FBUixHQUFVLENBQUMsQ0FBQyxDQUFDLFdBQUYsQ0FBQSxDQUFELENBQVYsR0FBMkI7TUFBbEMsQ0FBcEIsQ0FBeUQsQ0FBQyxJQUExRCxDQUErRCxFQUEvRDtJQURXLENBVmI7SUFhQSxTQUFBLEVBQVcsU0FBQyxLQUFELEVBQVEsSUFBUixFQUFp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QyxDQUFDLE1BQUYsQ0FBUyxLQUFULEVBQWdCLENBQUEsR0FBSSxLQUFwQixDQUFaLENBQVA7WUFDQSxLQUFBLEdBQVEsQ0FBQSxHQUFJO1lBQ1osSUFBcUIsYUFBQSxLQUFpQixLQUF0QztjQUFBLGdCQUFBOztZQUNBLGFBQUEsR0FBZ0I7QUFuQnBCO1FBcUJBLENBQUE7TUF4QkY7TUEwQkEsQ0FBQyxDQUFDLElBQUYsQ0FBTyxLQUFLLENBQUMsS0FBTixDQUFZLENBQUMsQ0FBQyxNQUFGLENBQVMsS0FBVCxFQUFnQixDQUFBLEdBQUksS0FBcEIsQ0FBWixDQUFQO2FBQ0EsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxTQUFDLENBQUQ7ZUFBTyxXQUFBLElBQU8sQ0FBQyxDQUFDO01BQWhCLENBQVQ7SUFsQ0ssQ0F2RVA7OztFQTRHRixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQTdHakIiLCJzb3VyY2VzQ29udGVudCI6WyJcbnV0aWxzID1cbiAgZmlsbDogKHN0ciwgbGVuZ3RoLCBmaWxsZXI9JzAnKSAtPlxuICAgIHN0ciA9IGZpbGxlciArIHN0ciB3aGlsZSBzdHIubGVuZ3RoIDwgbGVuZ3RoXG4gICAgc3RyXG5cbiAgc3RyaXA6IChzdHIpIC0+IHN0ci5yZXBsYWNlKC9cXHMrL2csICcnKVxuXG4gIGNsYW1wOiAobikgLT4gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgbikpXG5cbiAgY2xhbXBJbnQ6IChuLCBtYXg9MTAwKSAtPiBNYXRoLm1pbihtYXgsIE1hdGgubWF4KDAsIG4pKVxuXG4gIGluc2Vuc2l0aXZlOiAocykgLT5cbiAgICBzLnNwbGl0KC8oPzopLykubWFwKChjKSAtPiBcIig/OiN7Y318I3tjLnRvVXBwZXJDYXNlKCl9KVwiKS5qb2luKCcnKVxuXG4gIHJlYWRGbG9hdDogKHZhbHVlLCB2YXJzPXt9LCBjb2xvcikgLT5cbiAgICByZXMgPSBwYXJzZUZsb2F0KHZhbHVlKVxuICAgIGlmIGlzTmFOKHJlcykgYW5kIHZhcnNbdmFsdWVdP1xuICAgICAgY29sb3IudXNlZFZhcmlhYmxlcy5wdXNoKHZhbHVlKVxuICAgICAgcmVzID0gcGFyc2VGbG9hdCh2YXJzW3ZhbHVlXS52YWx1ZSlcbiAgICByZXNcblxuICByZWFkSW50OiAodmFsdWUsIHZhcnM9e30sIGNvbG9yLCBiYXNlPTEwKSAtPlxuICAgIHJlcyA9IHBhcnNlSW50KHZhbHVlLCBiYXNlKVxuICAgIGlmIGlzTmFOKHJlcykgYW5kIHZhcnNbdmFsdWVdP1xuICAgICAgY29sb3IudXNlZFZhcmlhYmxlcy5wdXNoKHZhbHVlKVxuICAgICAgcmVzID0gcGFyc2VJbnQodmFyc1t2YWx1ZV0udmFsdWUsIGJhc2UpXG4gICAgcmVzXG5cbiAgY291bnRMaW5lczogKHN0cmluZykgLT4gc3RyaW5nLnNwbGl0KC9cXHJcXG58XFxyfFxcbi9nKS5sZW5ndGhcblxuICByZWFkSW50T3JQZXJjZW50OiAodmFsdWUsIHZhcnM9e30sIGNvbG9yKSAtPlxuICAgIGlmIG5vdCAvXFxkKy8udGVzdCh2YWx1ZSkgYW5kIHZhcnNbdmFsdWVdP1xuICAgICAgY29sb3IudXNlZFZhcmlhYmxlcy5wdXNoKHZhbHVlKVxuICAgICAgdmFsdWUgPSB2YXJzW3ZhbHVlXS52YWx1ZVxuXG4gICAgcmV0dXJuIE5hTiB1bmxlc3MgdmFsdWU/XG5cbiAgICBpZiB2YWx1ZS5pbmRleE9mKCclJykgaXNudCAtMVxuICAgICAgcmVzID0gTWF0aC5yb3VuZChwYXJzZUZsb2F0KHZhbHVlKSAqIDIuNTUpXG4gICAgZWxzZVxuICAgICAgcmVzID0gcGFyc2VJbnQodmFsdWUpXG5cbiAgICByZXNcblxuICByZWFkRmxvYXRPclBlcmNlbnQ6IChhbW91bnQsIHZhcnM9e30sIGNvbG9yKSAtPlxuICAgIGlmIG5vdCAvXFxkKy8udGVzdChhbW91bnQpIGFuZCB2YXJzW2Ftb3VudF0/XG4gICAgICBjb2xvci51c2VkVmFyaWFibGVzLnB1c2goYW1vdW50KVxuICAgICAgYW1vdW50ID0gdmFyc1thbW91bnRdLnZhbHVlXG5cbiAgICByZXR1cm4gTmFOIHVubGVzcyBhbW91bnQ/XG5cbiAgICBpZiBhbW91bnQuaW5kZXhPZignJScpIGlzbnQgLTFcbiAgICAgIHJlcyA9IHBhcnNlRmxvYXQoYW1vdW50KSAvIDEwMFxuICAgIGVsc2VcbiAgICAgIHJlcyA9IHBhcnNlRmxvYXQoYW1vdW50KVxuXG4gICAgcmVzXG5cbiAgZmluZENsb3NpbmdJbmRleDogKHMsIHN0YXJ0SW5kZXg9MCwgb3BlbmluZ0NoYXI9XCJbXCIsIGNsb3NpbmdDaGFyPVwiXVwiKSAtPlxuICAgIGluZGV4ID0gc3RhcnRJbmRleFxuICAgIG5lc3RzID0gMVxuXG4gICAgd2hpbGUgbmVzdHMgYW5kIGluZGV4IDwgcy5sZW5ndGhcbiAgICAgIGN1clN0ciA9IHMuc3Vic3RyIGluZGV4KyssIDFcblxuICAgICAgaWYgY3VyU3RyIGlzIGNsb3NpbmdDaGFyXG4gICAgICAgIG5lc3RzLS1cbiAgICAgIGVsc2UgaWYgY3VyU3RyIGlzIG9wZW5pbmdDaGFyXG4gICAgICAgIG5lc3RzKytcblxuICAgIGlmIG5lc3RzIGlzIDAgdGhlbiBpbmRleCAtIDEgZWxzZSAtMVxuXG4gIHNwbGl0OiAocywgc2VwPVwiLFwiKSAtPlxuICAgIGEgPSBbXVxuICAgIGwgPSBzLmxlbmd0aFxuICAgIGkgPSAwXG4gICAgc3RhcnQgPSAwXG4gICAgcHJldmlvdXNTdGFydCA9IHN0YXJ0XG4gICAgYHdoaWxlTG9vcDogLy9gXG4gICAgd2hpbGUgaSA8IGxcbiAgICAgIGMgPSBzLnN1YnN0cihpLCAxKVxuXG4gICAgICBzd2l0Y2goYylcbiAgICAgICAgd2hlbiBcIihcIlxuICAgICAgICAgIGkgPSB1dGlscy5maW5kQ2xvc2luZ0luZGV4IHMsIGkgKyAxLCBjLCBcIilcIlxuICAgICAgICAgIGBicmVhayB3aGlsZUxvb3BgIGlmIGkgaXMgLTFcbiAgICAgICAgIyBBIHBhcnNlciByZWdleHAgd2lsbCBlbmQgd2l0aCB0aGUgbGFzdCApLCBzbyBzZXF1ZW5jZXMgbGlrZSAoLi4uKSguLi4pXG4gICAgICAgICMgd2lsbCBlbmQgYWZ0ZXIgdGhlIHNlY29uZCBwYXJlbnRoZXNpcyBwYWlyLCBieSBtYXRoaW5nICkgd2UgcHJldmVudFxuICAgICAgICAjIGFuIGluZmluaXRlIGxvb3Agd2hlbiBzcGxpdHRpbmcgdGhlIHN0cmluZy5cbiAgICAgICAgd2hlbiBcIilcIlxuICAgICAgICAgIGBicmVhayB3aGlsZUxvb3BgXG4gICAgICAgIHdoZW4gXCJbXCJcbiAgICAgICAgICBpID0gdXRpbHMuZmluZENsb3NpbmdJbmRleCBzLCBpICsgMSwgYywgXCJdXCJcbiAgICAgICAgICBgYnJlYWsgd2hpbGVMb29wYCBpZiBpIGlzIC0xXG4gICAgICAgIHdoZW4gXCJcIlxuICAgICAgICAgIGkgPSB1dGlscy5maW5kQ2xvc2luZ0luZGV4IHMsIGkgKyAxLCBjLCBcIlwiXG4gICAgICAgICAgYGJyZWFrIHdoaWxlTG9vcGAgaWYgaSBpcyAtMVxuICAgICAgICB3aGVuIHNlcFxuICAgICAgICAgIGEucHVzaCB1dGlscy5zdHJpcCBzLnN1YnN0ciBzdGFydCwgaSAtIHN0YXJ0XG4gICAgICAgICAgc3RhcnQgPSBpICsgMVxuICAgICAgICAgIGBicmVhayB3aGlsZUxvb3BgIGlmIHByZXZpb3VzU3RhcnQgaXMgc3RhcnRcbiAgICAgICAgICBwcmV2aW91c1N0YXJ0ID0gc3RhcnRcblxuICAgICAgaSsrXG5cbiAgICBhLnB1c2ggdXRpbHMuc3RyaXAgcy5zdWJzdHIgc3RhcnQsIGkgLSBzdGFydFxuICAgIGEuZmlsdGVyIChzKSAtPiBzPyBhbmQgcy5sZW5ndGhcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxzXG4iXX0=
