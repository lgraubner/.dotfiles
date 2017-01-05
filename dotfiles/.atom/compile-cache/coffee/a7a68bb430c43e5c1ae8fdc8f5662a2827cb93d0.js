(function() {
  "use strict";
  var BashBeautify, Beautifier,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = BashBeautify = (function(superClass) {
    extend(BashBeautify, superClass);

    function BashBeautify() {
      return BashBeautify.__super__.constructor.apply(this, arguments);
    }

    BashBeautify.prototype.name = "beautysh";

    BashBeautify.prototype.link = "https://github.com/bemeurer/beautysh";

    BashBeautify.prototype.options = {
      Bash: {
        indent_size: true
      }
    };

    BashBeautify.prototype.beautify = function(text, language, options) {
      var file;
      file = this.tempFile("input", text);
      return this.run('beautysh', ['-i', options.indent_size, '-f', file], {
        help: {
          link: "https://github.com/bemeurer/beautysh"
        }
      }).then((function(_this) {
        return function() {
          return _this.readFile(file);
        };
      })(this));
    };

    return BashBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvYmVhdXR5c2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLHdCQUFBO0lBQUE7OztFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OzsyQkFDckIsSUFBQSxHQUFNOzsyQkFDTixJQUFBLEdBQU07OzJCQUNOLE9BQUEsR0FBUztNQUNQLElBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSxJQUFiO09BRks7OzsyQkFLVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7TUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CO2FBQ1AsSUFBQyxDQUFBLEdBQUQsQ0FBSyxVQUFMLEVBQWlCLENBQUUsSUFBRixFQUFRLE9BQU8sQ0FBQyxXQUFoQixFQUE2QixJQUE3QixFQUFtQyxJQUFuQyxDQUFqQixFQUE0RDtRQUFBLElBQUEsRUFBTTtVQUFFLElBQUEsRUFBTSxzQ0FBUjtTQUFOO09BQTVELENBQ0EsQ0FBQyxJQURELENBQ00sQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxRQUFELENBQVUsSUFBVjtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUROO0lBRlE7Ozs7S0FSZ0M7QUFINUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQmFzaEJlYXV0aWZ5IGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcImJlYXV0eXNoXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vYmVtZXVyZXIvYmVhdXR5c2hcIlxuICBvcHRpb25zOiB7XG4gICAgQmFzaDpcbiAgICAgIGluZGVudF9zaXplOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIGZpbGUgPSBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgIEBydW4oJ2JlYXV0eXNoJywgWyAnLWknLCBvcHRpb25zLmluZGVudF9zaXplLCAnLWYnLCBmaWxlIF0sIGhlbHA6IHsgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vYmVtZXVyZXIvYmVhdXR5c2hcIiB9KVxuICAgIC50aGVuKD0+IEByZWFkRmlsZSBmaWxlKVxuIl19
