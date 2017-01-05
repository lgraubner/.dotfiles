(function() {
  "use strict";
  var Beautifier, Remark,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Remark = (function(superClass) {
    extend(Remark, superClass);

    function Remark() {
      return Remark.__super__.constructor.apply(this, arguments);
    }

    Remark.prototype.name = "Remark";

    Remark.prototype.link = "https://github.com/wooorm/remark";

    Remark.prototype.options = {
      _: {
        gfm: true,
        yaml: true,
        commonmark: true,
        footnotes: true,
        pedantic: true,
        breaks: true,
        entities: true,
        setext: true,
        closeAtx: true,
        looseTable: true,
        spacedTable: true,
        fence: true,
        fences: true,
        bullet: true,
        listItemIndent: true,
        incrementListMarker: true,
        rule: true,
        ruleRepetition: true,
        ruleSpaces: true,
        strong: true,
        emphasis: true,
        position: true
      },
      Markdown: true
    };

    Remark.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var cleanMarkdown, err, remark;
        try {
          remark = require('remark');
          cleanMarkdown = remark().process(text, options).toString();
          return resolve(cleanMarkdown);
        } catch (error) {
          err = error;
          this.error("Remark error: " + err);
          return reject(err);
        }
      });
    };

    return Remark;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcmVtYXJrLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxrQkFBQTtJQUFBOzs7RUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7cUJBQ3JCLElBQUEsR0FBTTs7cUJBQ04sSUFBQSxHQUFNOztxQkFDTixPQUFBLEdBQVM7TUFDUCxDQUFBLEVBQUc7UUFDRCxHQUFBLEVBQUssSUFESjtRQUVELElBQUEsRUFBTSxJQUZMO1FBR0QsVUFBQSxFQUFZLElBSFg7UUFJRCxTQUFBLEVBQVcsSUFKVjtRQUtELFFBQUEsRUFBVSxJQUxUO1FBTUQsTUFBQSxFQUFRLElBTlA7UUFPRCxRQUFBLEVBQVUsSUFQVDtRQVFELE1BQUEsRUFBUSxJQVJQO1FBU0QsUUFBQSxFQUFVLElBVFQ7UUFVRCxVQUFBLEVBQVksSUFWWDtRQVdELFdBQUEsRUFBYSxJQVhaO1FBWUQsS0FBQSxFQUFPLElBWk47UUFhRCxNQUFBLEVBQVEsSUFiUDtRQWNELE1BQUEsRUFBUSxJQWRQO1FBZUQsY0FBQSxFQUFnQixJQWZmO1FBZ0JELG1CQUFBLEVBQXFCLElBaEJwQjtRQWlCRCxJQUFBLEVBQU0sSUFqQkw7UUFrQkQsY0FBQSxFQUFnQixJQWxCZjtRQW1CRCxVQUFBLEVBQVksSUFuQlg7UUFvQkQsTUFBQSxFQUFRLElBcEJQO1FBcUJELFFBQUEsRUFBVSxJQXJCVDtRQXNCRCxRQUFBLEVBQVUsSUF0QlQ7T0FESTtNQXlCUCxRQUFBLEVBQVUsSUF6Qkg7OztxQkE0QlQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2xCLFlBQUE7QUFBQTtVQUNFLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUjtVQUNULGFBQUEsR0FBZ0IsTUFBQSxDQUFBLENBQVEsQ0FBQyxPQUFULENBQWlCLElBQWpCLEVBQXVCLE9BQXZCLENBQStCLENBQUMsUUFBaEMsQ0FBQTtpQkFDaEIsT0FBQSxDQUFRLGFBQVIsRUFIRjtTQUFBLGFBQUE7VUFJTTtVQUNKLElBQUMsQ0FBQSxLQUFELENBQU8sZ0JBQUEsR0FBaUIsR0FBeEI7aUJBQ0EsTUFBQSxDQUFPLEdBQVAsRUFORjs7TUFEa0IsQ0FBVDtJQURIOzs7O0tBL0IwQjtBQUh0QyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBSZW1hcmsgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiUmVtYXJrXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vd29vb3JtL3JlbWFya1wiXG4gIG9wdGlvbnM6IHtcbiAgICBfOiB7XG4gICAgICBnZm06IHRydWVcbiAgICAgIHlhbWw6IHRydWVcbiAgICAgIGNvbW1vbm1hcms6IHRydWVcbiAgICAgIGZvb3Rub3RlczogdHJ1ZVxuICAgICAgcGVkYW50aWM6IHRydWVcbiAgICAgIGJyZWFrczogdHJ1ZVxuICAgICAgZW50aXRpZXM6IHRydWVcbiAgICAgIHNldGV4dDogdHJ1ZVxuICAgICAgY2xvc2VBdHg6IHRydWVcbiAgICAgIGxvb3NlVGFibGU6IHRydWVcbiAgICAgIHNwYWNlZFRhYmxlOiB0cnVlXG4gICAgICBmZW5jZTogdHJ1ZVxuICAgICAgZmVuY2VzOiB0cnVlXG4gICAgICBidWxsZXQ6IHRydWVcbiAgICAgIGxpc3RJdGVtSW5kZW50OiB0cnVlXG4gICAgICBpbmNyZW1lbnRMaXN0TWFya2VyOiB0cnVlXG4gICAgICBydWxlOiB0cnVlXG4gICAgICBydWxlUmVwZXRpdGlvbjogdHJ1ZVxuICAgICAgcnVsZVNwYWNlczogdHJ1ZVxuICAgICAgc3Ryb25nOiB0cnVlXG4gICAgICBlbXBoYXNpczogdHJ1ZVxuICAgICAgcG9zaXRpb246IHRydWVcbiAgICB9XG4gICAgTWFya2Rvd246IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgcmV0dXJuIG5ldyBAUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgdHJ5XG4gICAgICAgIHJlbWFyayA9IHJlcXVpcmUgJ3JlbWFyaydcbiAgICAgICAgY2xlYW5NYXJrZG93biA9IHJlbWFyaygpLnByb2Nlc3ModGV4dCwgb3B0aW9ucykudG9TdHJpbmcoKVxuICAgICAgICByZXNvbHZlIGNsZWFuTWFya2Rvd25cbiAgICAgIGNhdGNoIGVyclxuICAgICAgICBAZXJyb3IoXCJSZW1hcmsgZXJyb3I6ICN7ZXJyfVwiKVxuICAgICAgICByZWplY3QoZXJyKVxuICAgIClcbiJdfQ==
