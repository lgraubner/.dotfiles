(function() {
  "use strict";
  var Beautifier, SassConvert,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = SassConvert = (function(superClass) {
    extend(SassConvert, superClass);

    function SassConvert() {
      return SassConvert.__super__.constructor.apply(this, arguments);
    }

    SassConvert.prototype.name = "SassConvert";

    SassConvert.prototype.link = "http://sass-lang.com/documentation/file.SASS_REFERENCE.html#syntax";

    SassConvert.prototype.options = {
      CSS: false,
      Sass: false,
      SCSS: false
    };

    SassConvert.prototype.beautify = function(text, language, options, context) {
      var lang;
      lang = language.toLowerCase();
      return this.run("sass-convert", [this.tempFile("input", text), "--from", lang, "--to", lang]);
    };

    return SassConvert;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvc2Fzcy1jb252ZXJ0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSx1QkFBQTtJQUFBOzs7RUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7MEJBQ3JCLElBQUEsR0FBTTs7MEJBQ04sSUFBQSxHQUFNOzswQkFFTixPQUFBLEdBRUU7TUFBQSxHQUFBLEVBQUssS0FBTDtNQUNBLElBQUEsRUFBTSxLQUROO01BRUEsSUFBQSxFQUFNLEtBRk47OzswQkFJRixRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixFQUEwQixPQUExQjtBQUNSLFVBQUE7TUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBQTthQUVQLElBQUMsQ0FBQSxHQUFELENBQUssY0FBTCxFQUFxQixDQUNuQixJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FEbUIsRUFFbkIsUUFGbUIsRUFFVCxJQUZTLEVBRUgsTUFGRyxFQUVLLElBRkwsQ0FBckI7SUFIUTs7OztLQVYrQjtBQUgzQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTYXNzQ29udmVydCBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJTYXNzQ29udmVydFwiXG4gIGxpbms6IFwiaHR0cDovL3Nhc3MtbGFuZy5jb20vZG9jdW1lbnRhdGlvbi9maWxlLlNBU1NfUkVGRVJFTkNFLmh0bWwjc3ludGF4XCJcblxuICBvcHRpb25zOlxuICAgICMgVE9ETzogQWRkIHN1cHBvcnQgZm9yIG9wdGlvbnNcbiAgICBDU1M6IGZhbHNlXG4gICAgU2FzczogZmFsc2VcbiAgICBTQ1NTOiBmYWxzZVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMsIGNvbnRleHQpIC0+XG4gICAgbGFuZyA9IGxhbmd1YWdlLnRvTG93ZXJDYXNlKClcblxuICAgIEBydW4oXCJzYXNzLWNvbnZlcnRcIiwgW1xuICAgICAgQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dCksXG4gICAgICBcIi0tZnJvbVwiLCBsYW5nLCBcIi0tdG9cIiwgbGFuZ1xuICAgIF0pXG4iXX0=
