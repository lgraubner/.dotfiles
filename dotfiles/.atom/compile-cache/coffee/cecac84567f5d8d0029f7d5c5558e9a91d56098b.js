
/*
 */

(function() {
  var Beautifier, Lua, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  path = require("path");

  "use strict";

  Beautifier = require('../beautifier');

  module.exports = Lua = (function(superClass) {
    extend(Lua, superClass);

    function Lua() {
      return Lua.__super__.constructor.apply(this, arguments);
    }

    Lua.prototype.name = "Lua beautifier";

    Lua.prototype.link = "https://github.com/Glavin001/atom-beautify/blob/master/src/beautifiers/lua-beautifier/beautifier.pl";

    Lua.prototype.options = {
      Lua: true
    };

    Lua.prototype.beautify = function(text, language, options) {
      var lua_beautifier;
      lua_beautifier = path.resolve(__dirname, "beautifier.pl");
      return this.run("perl", [lua_beautifier, '<', this.tempFile("input", text)]);
    };

    return Lua;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvbHVhLWJlYXV0aWZpZXIvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0FBQUE7QUFBQSxNQUFBLHFCQUFBO0lBQUE7OztFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUDs7RUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7a0JBQ3JCLElBQUEsR0FBTTs7a0JBQ04sSUFBQSxHQUFNOztrQkFFTixPQUFBLEdBQVM7TUFDUCxHQUFBLEVBQUssSUFERTs7O2tCQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBQ1IsVUFBQTtNQUFBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLGVBQXhCO2FBQ2pCLElBQUMsQ0FBQSxHQUFELENBQUssTUFBTCxFQUFhLENBQ1gsY0FEVyxFQUVYLEdBRlcsRUFHWCxJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FIVyxDQUFiO0lBRlE7Ozs7S0FSdUI7QUFQbkMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbiMjI1xucGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgTHVhIGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIkx1YSBiZWF1dGlmaWVyXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vR2xhdmluMDAxL2F0b20tYmVhdXRpZnkvYmxvYi9tYXN0ZXIvc3JjL2JlYXV0aWZpZXJzL2x1YS1iZWF1dGlmaWVyL2JlYXV0aWZpZXIucGxcIlxuXG4gIG9wdGlvbnM6IHtcbiAgICBMdWE6IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgbHVhX2JlYXV0aWZpZXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImJlYXV0aWZpZXIucGxcIilcbiAgICBAcnVuKFwicGVybFwiLCBbXG4gICAgICBsdWFfYmVhdXRpZmllcixcbiAgICAgICc8JyxcbiAgICAgIEB0ZW1wRmlsZShcImlucHV0XCIsIHRleHQpXG4gICAgICBdKVxuIl19
