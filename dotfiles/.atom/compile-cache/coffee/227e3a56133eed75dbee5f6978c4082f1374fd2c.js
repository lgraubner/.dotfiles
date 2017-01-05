
/*
Requires https://github.com/jaspervdj/stylish-haskell
 */

(function() {
  "use strict";
  var Beautifier, Crystal,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Crystal = (function(superClass) {
    extend(Crystal, superClass);

    function Crystal() {
      return Crystal.__super__.constructor.apply(this, arguments);
    }

    Crystal.prototype.name = "Crystal";

    Crystal.prototype.link = "http://crystal-lang.org";

    Crystal.prototype.options = {
      Crystal: true
    };

    Crystal.prototype.beautify = function(text, language, options) {
      var tempFile;
      if (this.isWindows) {
        return this.Promise.reject(this.commandNotFoundError('crystal', {
          link: "http://crystal-lang.org",
          program: "crystal"
        }));
      } else {
        return this.run("crystal", ['tool', 'format', tempFile = this.tempFile("temp", text)], {
          ignoreReturnCode: true
        }).then((function(_this) {
          return function() {
            return _this.readFile(tempFile);
          };
        })(this));
      }
    };

    return Crystal;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvY3J5c3RhbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQTtBQUpBLE1BQUEsbUJBQUE7SUFBQTs7O0VBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3NCQUNyQixJQUFBLEdBQU07O3NCQUNOLElBQUEsR0FBTTs7c0JBRU4sT0FBQSxHQUFTO01BQ1AsT0FBQSxFQUFTLElBREY7OztzQkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUVSLFVBQUE7TUFBQSxJQUFHLElBQUMsQ0FBQSxTQUFKO2VBQ0UsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQWdCLElBQUMsQ0FBQSxvQkFBRCxDQUNkLFNBRGMsRUFFZDtVQUNBLElBQUEsRUFBTSx5QkFETjtVQUVBLE9BQUEsRUFBUyxTQUZUO1NBRmMsQ0FBaEIsRUFERjtPQUFBLE1BQUE7ZUFTRSxJQUFDLENBQUEsR0FBRCxDQUFLLFNBQUwsRUFBZ0IsQ0FDZCxNQURjLEVBRWQsUUFGYyxFQUdkLFFBQUEsR0FBVyxJQUFDLENBQUEsUUFBRCxDQUFVLE1BQVYsRUFBa0IsSUFBbEIsQ0FIRyxDQUFoQixFQUlLO1VBQUMsZ0JBQUEsRUFBa0IsSUFBbkI7U0FKTCxDQUtFLENBQUMsSUFMSCxDQUtRLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1VBREk7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTFIsRUFURjs7SUFGUTs7OztLQVIyQjtBQVB2QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9naXRodWIuY29tL2phc3BlcnZkai9zdHlsaXNoLWhhc2tlbGxcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQ3J5c3RhbCBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJDcnlzdGFsXCJcbiAgbGluazogXCJodHRwOi8vY3J5c3RhbC1sYW5nLm9yZ1wiXG5cbiAgb3B0aW9uczoge1xuICAgIENyeXN0YWw6IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgIyBTZWVtcyB0aGF0IENyeXN0YWwgZG9zZW4ndCBoYXZlIFdpbmRvd3Mgc3VwcG9ydCB5ZXQuXG4gICAgaWYgQGlzV2luZG93c1xuICAgICAgQFByb21pc2UucmVqZWN0KEBjb21tYW5kTm90Rm91bmRFcnJvcihcbiAgICAgICAgJ2NyeXN0YWwnXG4gICAgICAgIHtcbiAgICAgICAgbGluazogXCJodHRwOi8vY3J5c3RhbC1sYW5nLm9yZ1wiXG4gICAgICAgIHByb2dyYW06IFwiY3J5c3RhbFwiXG4gICAgICAgIH0pXG4gICAgICApXG4gICAgZWxzZVxuICAgICAgQHJ1bihcImNyeXN0YWxcIiwgW1xuICAgICAgICAndG9vbCcsXG4gICAgICAgICdmb3JtYXQnLFxuICAgICAgICB0ZW1wRmlsZSA9IEB0ZW1wRmlsZShcInRlbXBcIiwgdGV4dClcbiAgICAgICAgXSwge2lnbm9yZVJldHVybkNvZGU6IHRydWV9KVxuICAgICAgICAudGhlbig9PlxuICAgICAgICAgIEByZWFkRmlsZSh0ZW1wRmlsZSlcbiAgICAgICAgKVxuIl19
