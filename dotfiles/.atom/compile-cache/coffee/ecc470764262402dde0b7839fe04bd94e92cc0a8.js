(function() {
  "use strict";
  var Beautifier, VueBeautifier, _, prettydiff,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  prettydiff = require("prettydiff");

  _ = require('lodash');

  module.exports = VueBeautifier = (function(superClass) {
    extend(VueBeautifier, superClass);

    function VueBeautifier() {
      return VueBeautifier.__super__.constructor.apply(this, arguments);
    }

    VueBeautifier.prototype.name = "Vue Beautifier";

    VueBeautifier.prototype.options = {
      Vue: true
    };

    VueBeautifier.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var regexp;
        regexp = /(<(template|script|style)[^>]*>)((\s|\S)*?)<\/\2>/gi;
        return resolve(text.replace(regexp, function(match, begin, type, text) {
          var lang, ref;
          lang = (ref = /lang\s*=\s*['"](\w+)["']/.exec(begin)) != null ? ref[1] : void 0;
          switch (type) {
            case "template":
              switch (lang) {
                case "pug":
                case "jade":
                  return match.replace(text, "\n" + require("pug-beautify")(text, options) + "\n");
                case void 0:
                  return match.replace(text, "\n" + require("js-beautify").html(text, options) + "\n");
                default:
                  return match;
              }
              break;
            case "script":
              return match.replace(text, "\n" + require("js-beautify")(text, options) + "\n");
            case "style":
              switch (lang) {
                case "sass":
                case "scss":
                  options = _.merge(options, {
                    source: text,
                    lang: "scss",
                    mode: "beautify"
                  });
                  return match.replace(text, prettydiff.api(options)[0]);
                case "less":
                  options = _.merge(options, {
                    source: text,
                    lang: "less",
                    mode: "beautify"
                  });
                  return match.replace(text, prettydiff.api(options)[0]);
                case void 0:
                  return match.replace(text, "\n" + require("js-beautify").css(text, options) + "\n");
                default:
                  return match;
              }
          }
        }));
      });
    };

    return VueBeautifier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvdnVlLWJlYXV0aWZpZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLHdDQUFBO0lBQUE7OztFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFDYixVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVI7O0VBQ2IsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztFQUVKLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7OzRCQUNyQixJQUFBLEdBQU07OzRCQUVOLE9BQUEsR0FDRTtNQUFBLEdBQUEsRUFBSyxJQUFMOzs7NEJBRUYsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2xCLFlBQUE7UUFBQSxNQUFBLEdBQVM7ZUFFVCxPQUFBLENBQVEsSUFBSSxDQUFDLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLFNBQUMsS0FBRCxFQUFRLEtBQVIsRUFBZSxJQUFmLEVBQXFCLElBQXJCO0FBQzNCLGNBQUE7VUFBQSxJQUFBLCtEQUErQyxDQUFBLENBQUE7QUFFL0Msa0JBQU8sSUFBUDtBQUFBLGlCQUNPLFVBRFA7QUFFSSxzQkFBTyxJQUFQO0FBQUEscUJBQ08sS0FEUDtBQUFBLHFCQUNjLE1BRGQ7eUJBRUksS0FBSyxDQUFDLE9BQU4sQ0FBYyxJQUFkLEVBQW9CLElBQUEsR0FBTyxPQUFBLENBQVEsY0FBUixDQUFBLENBQXdCLElBQXhCLEVBQThCLE9BQTlCLENBQVAsR0FBZ0QsSUFBcEU7QUFGSixxQkFHTyxNQUhQO3lCQUlJLEtBQUssQ0FBQyxPQUFOLENBQWMsSUFBZCxFQUFvQixJQUFBLEdBQU8sT0FBQSxDQUFRLGFBQVIsQ0FBc0IsQ0FBQyxJQUF2QixDQUE0QixJQUE1QixFQUFrQyxPQUFsQyxDQUFQLEdBQW9ELElBQXhFO0FBSko7eUJBTUk7QUFOSjtBQURHO0FBRFAsaUJBU08sUUFUUDtxQkFVSSxLQUFLLENBQUMsT0FBTixDQUFjLElBQWQsRUFBb0IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxhQUFSLENBQUEsQ0FBdUIsSUFBdkIsRUFBNkIsT0FBN0IsQ0FBUCxHQUErQyxJQUFuRTtBQVZKLGlCQVdPLE9BWFA7QUFZSSxzQkFBTyxJQUFQO0FBQUEscUJBQ08sTUFEUDtBQUFBLHFCQUNlLE1BRGY7a0JBRUksT0FBQSxHQUFVLENBQUMsQ0FBQyxLQUFGLENBQVEsT0FBUixFQUNSO29CQUFBLE1BQUEsRUFBUSxJQUFSO29CQUNBLElBQUEsRUFBTSxNQUROO29CQUVBLElBQUEsRUFBTSxVQUZOO21CQURRO3lCQUlWLEtBQUssQ0FBQyxPQUFOLENBQWMsSUFBZCxFQUFvQixVQUFVLENBQUMsR0FBWCxDQUFlLE9BQWYsQ0FBd0IsQ0FBQSxDQUFBLENBQTVDO0FBTkoscUJBT08sTUFQUDtrQkFRSSxPQUFBLEdBQVUsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxPQUFSLEVBQ1Y7b0JBQUEsTUFBQSxFQUFRLElBQVI7b0JBQ0EsSUFBQSxFQUFNLE1BRE47b0JBRUEsSUFBQSxFQUFNLFVBRk47bUJBRFU7eUJBSVYsS0FBSyxDQUFDLE9BQU4sQ0FBYyxJQUFkLEVBQW9CLFVBQVUsQ0FBQyxHQUFYLENBQWUsT0FBZixDQUF3QixDQUFBLENBQUEsQ0FBNUM7QUFaSixxQkFhTyxNQWJQO3lCQWNJLEtBQUssQ0FBQyxPQUFOLENBQWMsSUFBZCxFQUFvQixJQUFBLEdBQU8sT0FBQSxDQUFRLGFBQVIsQ0FBc0IsQ0FBQyxHQUF2QixDQUEyQixJQUEzQixFQUFpQyxPQUFqQyxDQUFQLEdBQW1ELElBQXZFO0FBZEo7eUJBZ0JJO0FBaEJKO0FBWko7UUFIMkIsQ0FBckIsQ0FBUjtNQUhrQixDQUFUO0lBREg7Ozs7S0FOaUM7QUFMN0MiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5wcmV0dHlkaWZmID0gcmVxdWlyZShcInByZXR0eWRpZmZcIilcbl8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFZ1ZUJlYXV0aWZpZXIgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiVnVlIEJlYXV0aWZpZXJcIlxuXG4gIG9wdGlvbnM6XG4gICAgVnVlOiB0cnVlXG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICByZWdleHAgPSAvKDwodGVtcGxhdGV8c2NyaXB0fHN0eWxlKVtePl0qPikoKFxcc3xcXFMpKj8pPFxcL1xcMj4vZ2lcblxuICAgICAgcmVzb2x2ZSh0ZXh0LnJlcGxhY2UocmVnZXhwLCAobWF0Y2gsIGJlZ2luLCB0eXBlLCB0ZXh0KSAtPlxuICAgICAgICBsYW5nID0gL2xhbmdcXHMqPVxccypbJ1wiXShcXHcrKVtcIiddLy5leGVjKGJlZ2luKT9bMV1cblxuICAgICAgICBzd2l0Y2ggdHlwZVxuICAgICAgICAgIHdoZW4gXCJ0ZW1wbGF0ZVwiXG4gICAgICAgICAgICBzd2l0Y2ggbGFuZ1xuICAgICAgICAgICAgICB3aGVuIFwicHVnXCIsIFwiamFkZVwiXG4gICAgICAgICAgICAgICAgbWF0Y2gucmVwbGFjZSh0ZXh0LCBcIlxcblwiICsgcmVxdWlyZShcInB1Zy1iZWF1dGlmeVwiKSh0ZXh0LCBvcHRpb25zKSArIFwiXFxuXCIpXG4gICAgICAgICAgICAgIHdoZW4gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgbWF0Y2gucmVwbGFjZSh0ZXh0LCBcIlxcblwiICsgcmVxdWlyZShcImpzLWJlYXV0aWZ5XCIpLmh0bWwodGV4dCwgb3B0aW9ucykgKyBcIlxcblwiKVxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbWF0Y2hcbiAgICAgICAgICB3aGVuIFwic2NyaXB0XCJcbiAgICAgICAgICAgIG1hdGNoLnJlcGxhY2UodGV4dCwgXCJcXG5cIiArIHJlcXVpcmUoXCJqcy1iZWF1dGlmeVwiKSh0ZXh0LCBvcHRpb25zKSArIFwiXFxuXCIpXG4gICAgICAgICAgd2hlbiBcInN0eWxlXCJcbiAgICAgICAgICAgIHN3aXRjaCBsYW5nXG4gICAgICAgICAgICAgIHdoZW4gXCJzYXNzXCIsIFwic2Nzc1wiXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IF8ubWVyZ2Ugb3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGV4dFxuICAgICAgICAgICAgICAgICAgbGFuZzogXCJzY3NzXCJcbiAgICAgICAgICAgICAgICAgIG1vZGU6IFwiYmVhdXRpZnlcIlxuICAgICAgICAgICAgICAgIG1hdGNoLnJlcGxhY2UodGV4dCwgcHJldHR5ZGlmZi5hcGkob3B0aW9ucylbMF0pXG4gICAgICAgICAgICAgIHdoZW4gXCJsZXNzXCJcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gXy5tZXJnZSBvcHRpb25zLFxuICAgICAgICAgICAgICAgIHNvdXJjZTogdGV4dFxuICAgICAgICAgICAgICAgIGxhbmc6IFwibGVzc1wiXG4gICAgICAgICAgICAgICAgbW9kZTogXCJiZWF1dGlmeVwiXG4gICAgICAgICAgICAgICAgbWF0Y2gucmVwbGFjZSh0ZXh0LCBwcmV0dHlkaWZmLmFwaShvcHRpb25zKVswXSlcbiAgICAgICAgICAgICAgd2hlbiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICBtYXRjaC5yZXBsYWNlKHRleHQsIFwiXFxuXCIgKyByZXF1aXJlKFwianMtYmVhdXRpZnlcIikuY3NzKHRleHQsIG9wdGlvbnMpICsgXCJcXG5cIilcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIG1hdGNoXG4gICAgICApKVxuICAgIClcbiJdfQ==
