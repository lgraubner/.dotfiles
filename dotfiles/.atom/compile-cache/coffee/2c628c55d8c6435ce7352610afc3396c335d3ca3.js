(function() {
  "use strict";
  var Beautifier, TypeScriptFormatter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = TypeScriptFormatter = (function(superClass) {
    extend(TypeScriptFormatter, superClass);

    function TypeScriptFormatter() {
      return TypeScriptFormatter.__super__.constructor.apply(this, arguments);
    }

    TypeScriptFormatter.prototype.name = "TypeScript Formatter";

    TypeScriptFormatter.prototype.link = "https://github.com/vvakame/typescript-formatter";

    TypeScriptFormatter.prototype.options = {
      TypeScript: true
    };

    TypeScriptFormatter.prototype.beautify = function(text, language, options) {
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var e, format, formatterUtils, opts, result;
          try {
            format = require("typescript-formatter/lib/formatter")["default"];
            formatterUtils = require("typescript-formatter/lib/utils");
            opts = formatterUtils.createDefaultFormatCodeOptions();
            if (options.indent_with_tabs) {
              opts.ConvertTabsToSpaces = false;
            } else {
              opts.TabSize = options.tab_width || options.indent_size;
              opts.IndentSize = options.indent_size;
              opts.IndentStyle = 'space';
            }
            _this.verbose('typescript', text, opts);
            result = format('', text, opts);
            _this.verbose(result);
            return resolve(result);
          } catch (error) {
            e = error;
            return reject(e);
          }
        };
      })(this));
    };

    return TypeScriptFormatter;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvdHlwZXNjcmlwdC1mb3JtYXR0ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLCtCQUFBO0lBQUE7OztFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OztrQ0FDckIsSUFBQSxHQUFNOztrQ0FDTixJQUFBLEdBQU07O2tDQUNOLE9BQUEsR0FBUztNQUNQLFVBQUEsRUFBWSxJQURMOzs7a0NBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFFbEIsY0FBQTtBQUFBO1lBQ0UsTUFBQSxHQUFTLE9BQUEsQ0FBUSxvQ0FBUixDQUE2QyxFQUFDLE9BQUQ7WUFDdEQsY0FBQSxHQUFpQixPQUFBLENBQVEsZ0NBQVI7WUFHakIsSUFBQSxHQUFPLGNBQWMsQ0FBQyw4QkFBZixDQUFBO1lBRVAsSUFBRyxPQUFPLENBQUMsZ0JBQVg7Y0FDRSxJQUFJLENBQUMsbUJBQUwsR0FBMkIsTUFEN0I7YUFBQSxNQUFBO2NBR0UsSUFBSSxDQUFDLE9BQUwsR0FBZSxPQUFPLENBQUMsU0FBUixJQUFxQixPQUFPLENBQUM7Y0FDNUMsSUFBSSxDQUFDLFVBQUwsR0FBa0IsT0FBTyxDQUFDO2NBQzFCLElBQUksQ0FBQyxXQUFMLEdBQW1CLFFBTHJCOztZQU9BLEtBQUMsQ0FBQSxPQUFELENBQVMsWUFBVCxFQUF1QixJQUF2QixFQUE2QixJQUE3QjtZQUNBLE1BQUEsR0FBUyxNQUFBLENBQU8sRUFBUCxFQUFXLElBQVgsRUFBaUIsSUFBakI7WUFDVCxLQUFDLENBQUEsT0FBRCxDQUFTLE1BQVQ7bUJBQ0EsT0FBQSxDQUFRLE1BQVIsRUFqQkY7V0FBQSxhQUFBO1lBa0JNO0FBQ0osbUJBQU8sTUFBQSxDQUFPLENBQVAsRUFuQlQ7O1FBRmtCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFUO0lBREg7Ozs7S0FQdUM7QUFIbkQiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVHlwZVNjcmlwdEZvcm1hdHRlciBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJUeXBlU2NyaXB0IEZvcm1hdHRlclwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL3Z2YWthbWUvdHlwZXNjcmlwdC1mb3JtYXR0ZXJcIlxuICBvcHRpb25zOiB7XG4gICAgVHlwZVNjcmlwdDogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XG5cbiAgICAgIHRyeVxuICAgICAgICBmb3JtYXQgPSByZXF1aXJlKFwidHlwZXNjcmlwdC1mb3JtYXR0ZXIvbGliL2Zvcm1hdHRlclwiKS5kZWZhdWx0XG4gICAgICAgIGZvcm1hdHRlclV0aWxzID0gcmVxdWlyZShcInR5cGVzY3JpcHQtZm9ybWF0dGVyL2xpYi91dGlsc1wiKVxuICAgICAgICAjIEB2ZXJib3NlKCdmb3JtYXQnLCBmb3JtYXQsIGZvcm1hdHRlclV0aWxzKVxuXG4gICAgICAgIG9wdHMgPSBmb3JtYXR0ZXJVdGlscy5jcmVhdGVEZWZhdWx0Rm9ybWF0Q29kZU9wdGlvbnMoKVxuXG4gICAgICAgIGlmIG9wdGlvbnMuaW5kZW50X3dpdGhfdGFic1xuICAgICAgICAgIG9wdHMuQ29udmVydFRhYnNUb1NwYWNlcyA9IGZhbHNlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBvcHRzLlRhYlNpemUgPSBvcHRpb25zLnRhYl93aWR0aCBvciBvcHRpb25zLmluZGVudF9zaXplXG4gICAgICAgICAgb3B0cy5JbmRlbnRTaXplID0gb3B0aW9ucy5pbmRlbnRfc2l6ZVxuICAgICAgICAgIG9wdHMuSW5kZW50U3R5bGUgPSAnc3BhY2UnXG5cbiAgICAgICAgQHZlcmJvc2UoJ3R5cGVzY3JpcHQnLCB0ZXh0LCBvcHRzKVxuICAgICAgICByZXN1bHQgPSBmb3JtYXQoJycsIHRleHQsIG9wdHMpXG4gICAgICAgIEB2ZXJib3NlKHJlc3VsdClcbiAgICAgICAgcmVzb2x2ZSByZXN1bHRcbiAgICAgIGNhdGNoIGVcbiAgICAgICAgcmV0dXJuIHJlamVjdChlKVxuXG4gICAgKVxuIl19
