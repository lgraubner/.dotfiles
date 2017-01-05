
/*
Language Support and default options.
 */

(function() {
  "use strict";
  var Languages, _, extend;

  _ = require('lodash');

  extend = null;

  module.exports = Languages = (function() {
    Languages.prototype.languageNames = ["apex", "arduino", "bash", "c-sharp", "c", "clojure", "coffeescript", "coldfusion", "cpp", "crystal", "css", "csv", "d", "ejs", "elm", "erb", "erlang", "gherkin", "glsl", "go", "fortran", "handlebars", "haskell", "html", "jade", "java", "javascript", "json", "jsx", "latex", "less", "lua", "markdown", 'marko', "mustache", "nunjucks", "objective-c", "ocaml", "pawn", "perl", "php", "puppet", "python", "r", "riotjs", "ruby", "rust", "sass", "scss", "spacebars", "sql", "svg", "swig", "tss", "twig", "typescript", "ux_markup", "vala", "vue", "visualforce", "xml", "xtemplate"];


    /*
    Languages
     */

    Languages.prototype.languages = null;


    /*
    Namespaces
     */

    Languages.prototype.namespaces = null;


    /*
    Constructor
     */

    function Languages() {
      this.languages = _.map(this.languageNames, function(name) {
        return require("./" + name);
      });
      this.namespaces = _.map(this.languages, function(language) {
        return language.namespace;
      });
    }


    /*
    Get language for grammar and extension
     */

    Languages.prototype.getLanguages = function(arg) {
      var extension, grammar, name, namespace;
      name = arg.name, namespace = arg.namespace, grammar = arg.grammar, extension = arg.extension;
      return _.union(_.filter(this.languages, function(language) {
        return _.isEqual(language.name, name);
      }), _.filter(this.languages, function(language) {
        return _.isEqual(language.namespace, namespace);
      }), _.filter(this.languages, function(language) {
        return _.includes(language.grammars, grammar);
      }), _.filter(this.languages, function(language) {
        return _.includes(language.extensions, extension);
      }));
    };

    return Languages;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUdBO0FBSEEsTUFBQTs7RUFLQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0VBQ0osTUFBQSxHQUFTOztFQUdULE1BQU0sQ0FBQyxPQUFQLEdBQXVCO3dCQUlyQixhQUFBLEdBQWUsQ0FDYixNQURhLEVBRWIsU0FGYSxFQUdiLE1BSGEsRUFJYixTQUphLEVBS2IsR0FMYSxFQU1iLFNBTmEsRUFPYixjQVBhLEVBUWIsWUFSYSxFQVNiLEtBVGEsRUFVYixTQVZhLEVBV2IsS0FYYSxFQVliLEtBWmEsRUFhYixHQWJhLEVBY2IsS0FkYSxFQWViLEtBZmEsRUFnQmIsS0FoQmEsRUFpQmIsUUFqQmEsRUFrQmIsU0FsQmEsRUFtQmIsTUFuQmEsRUFvQmIsSUFwQmEsRUFxQmIsU0FyQmEsRUFzQmIsWUF0QmEsRUF1QmIsU0F2QmEsRUF3QmIsTUF4QmEsRUF5QmIsTUF6QmEsRUEwQmIsTUExQmEsRUEyQmIsWUEzQmEsRUE0QmIsTUE1QmEsRUE2QmIsS0E3QmEsRUE4QmIsT0E5QmEsRUErQmIsTUEvQmEsRUFnQ2IsS0FoQ2EsRUFpQ2IsVUFqQ2EsRUFrQ2IsT0FsQ2EsRUFtQ2IsVUFuQ2EsRUFvQ2IsVUFwQ2EsRUFxQ2IsYUFyQ2EsRUFzQ2IsT0F0Q2EsRUF1Q2IsTUF2Q2EsRUF3Q2IsTUF4Q2EsRUF5Q2IsS0F6Q2EsRUEwQ2IsUUExQ2EsRUEyQ2IsUUEzQ2EsRUE0Q2IsR0E1Q2EsRUE2Q2IsUUE3Q2EsRUE4Q2IsTUE5Q2EsRUErQ2IsTUEvQ2EsRUFnRGIsTUFoRGEsRUFpRGIsTUFqRGEsRUFrRGIsV0FsRGEsRUFtRGIsS0FuRGEsRUFvRGIsS0FwRGEsRUFxRGIsTUFyRGEsRUFzRGIsS0F0RGEsRUF1RGIsTUF2RGEsRUF3RGIsWUF4RGEsRUF5RGIsV0F6RGEsRUEwRGIsTUExRGEsRUEyRGIsS0EzRGEsRUE0RGIsYUE1RGEsRUE2RGIsS0E3RGEsRUE4RGIsV0E5RGE7OztBQWlFZjs7Ozt3QkFHQSxTQUFBLEdBQVc7OztBQUVYOzs7O3dCQUdBLFVBQUEsR0FBWTs7O0FBRVo7Ozs7SUFHYSxtQkFBQTtNQUNYLElBQUMsQ0FBQSxTQUFELEdBQWEsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxJQUFDLENBQUEsYUFBUCxFQUFzQixTQUFDLElBQUQ7ZUFDakMsT0FBQSxDQUFRLElBQUEsR0FBSyxJQUFiO01BRGlDLENBQXRCO01BR2IsSUFBQyxDQUFBLFVBQUQsR0FBYyxDQUFDLENBQUMsR0FBRixDQUFNLElBQUMsQ0FBQSxTQUFQLEVBQWtCLFNBQUMsUUFBRDtlQUFjLFFBQVEsQ0FBQztNQUF2QixDQUFsQjtJQUpIOzs7QUFNYjs7Ozt3QkFHQSxZQUFBLEdBQWMsU0FBQyxHQUFEO0FBRVosVUFBQTtNQUZjLGlCQUFNLDJCQUFXLHVCQUFTO2FBRXhDLENBQUMsQ0FBQyxLQUFGLENBQ0UsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFDLENBQUEsU0FBVixFQUFxQixTQUFDLFFBQUQ7ZUFBYyxDQUFDLENBQUMsT0FBRixDQUFVLFFBQVEsQ0FBQyxJQUFuQixFQUF5QixJQUF6QjtNQUFkLENBQXJCLENBREYsRUFFRSxDQUFDLENBQUMsTUFBRixDQUFTLElBQUMsQ0FBQSxTQUFWLEVBQXFCLFNBQUMsUUFBRDtlQUFjLENBQUMsQ0FBQyxPQUFGLENBQVUsUUFBUSxDQUFDLFNBQW5CLEVBQThCLFNBQTlCO01BQWQsQ0FBckIsQ0FGRixFQUdFLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLFNBQVYsRUFBcUIsU0FBQyxRQUFEO2VBQWMsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxRQUFRLENBQUMsUUFBcEIsRUFBOEIsT0FBOUI7TUFBZCxDQUFyQixDQUhGLEVBSUUsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFDLENBQUEsU0FBVixFQUFxQixTQUFDLFFBQUQ7ZUFBYyxDQUFDLENBQUMsUUFBRixDQUFXLFFBQVEsQ0FBQyxVQUFwQixFQUFnQyxTQUFoQztNQUFkLENBQXJCLENBSkY7SUFGWTs7Ozs7QUFwR2hCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5MYW5ndWFnZSBTdXBwb3J0IGFuZCBkZWZhdWx0IG9wdGlvbnMuXG4jIyNcblwidXNlIHN0cmljdFwiXG4jIExhenkgbG9hZGVkIGRlcGVuZGVuY2llc1xuXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5leHRlbmQgPSBudWxsXG5cbiNcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgTGFuZ3VhZ2VzXG5cbiAgIyBTdXBwb3J0ZWQgdW5pcXVlIGNvbmZpZ3VyYXRpb24ga2V5c1xuICAjIFVzZWQgZm9yIGRldGVjdGluZyBuZXN0ZWQgY29uZmlndXJhdGlvbnMgaW4gLmpzYmVhdXRpZnlyY1xuICBsYW5ndWFnZU5hbWVzOiBbXG4gICAgXCJhcGV4XCJcbiAgICBcImFyZHVpbm9cIlxuICAgIFwiYmFzaFwiXG4gICAgXCJjLXNoYXJwXCJcbiAgICBcImNcIlxuICAgIFwiY2xvanVyZVwiXG4gICAgXCJjb2ZmZWVzY3JpcHRcIlxuICAgIFwiY29sZGZ1c2lvblwiXG4gICAgXCJjcHBcIlxuICAgIFwiY3J5c3RhbFwiXG4gICAgXCJjc3NcIlxuICAgIFwiY3N2XCJcbiAgICBcImRcIlxuICAgIFwiZWpzXCJcbiAgICBcImVsbVwiXG4gICAgXCJlcmJcIlxuICAgIFwiZXJsYW5nXCJcbiAgICBcImdoZXJraW5cIlxuICAgIFwiZ2xzbFwiXG4gICAgXCJnb1wiXG4gICAgXCJmb3J0cmFuXCJcbiAgICBcImhhbmRsZWJhcnNcIlxuICAgIFwiaGFza2VsbFwiXG4gICAgXCJodG1sXCJcbiAgICBcImphZGVcIlxuICAgIFwiamF2YVwiXG4gICAgXCJqYXZhc2NyaXB0XCJcbiAgICBcImpzb25cIlxuICAgIFwianN4XCJcbiAgICBcImxhdGV4XCJcbiAgICBcImxlc3NcIlxuICAgIFwibHVhXCJcbiAgICBcIm1hcmtkb3duXCJcbiAgICAnbWFya28nXG4gICAgXCJtdXN0YWNoZVwiXG4gICAgXCJudW5qdWNrc1wiXG4gICAgXCJvYmplY3RpdmUtY1wiXG4gICAgXCJvY2FtbFwiXG4gICAgXCJwYXduXCJcbiAgICBcInBlcmxcIlxuICAgIFwicGhwXCJcbiAgICBcInB1cHBldFwiXG4gICAgXCJweXRob25cIlxuICAgIFwiclwiXG4gICAgXCJyaW90anNcIlxuICAgIFwicnVieVwiXG4gICAgXCJydXN0XCJcbiAgICBcInNhc3NcIlxuICAgIFwic2Nzc1wiXG4gICAgXCJzcGFjZWJhcnNcIlxuICAgIFwic3FsXCJcbiAgICBcInN2Z1wiXG4gICAgXCJzd2lnXCJcbiAgICBcInRzc1wiXG4gICAgXCJ0d2lnXCJcbiAgICBcInR5cGVzY3JpcHRcIlxuICAgIFwidXhfbWFya3VwXCJcbiAgICBcInZhbGFcIlxuICAgIFwidnVlXCJcbiAgICBcInZpc3VhbGZvcmNlXCJcbiAgICBcInhtbFwiXG4gICAgXCJ4dGVtcGxhdGVcIlxuICBdXG5cbiAgIyMjXG4gIExhbmd1YWdlc1xuICAjIyNcbiAgbGFuZ3VhZ2VzOiBudWxsXG5cbiAgIyMjXG4gIE5hbWVzcGFjZXNcbiAgIyMjXG4gIG5hbWVzcGFjZXM6IG51bGxcblxuICAjIyNcbiAgQ29uc3RydWN0b3JcbiAgIyMjXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBsYW5ndWFnZXMgPSBfLm1hcChAbGFuZ3VhZ2VOYW1lcywgKG5hbWUpIC0+XG4gICAgICByZXF1aXJlKFwiLi8je25hbWV9XCIpXG4gICAgKVxuICAgIEBuYW1lc3BhY2VzID0gXy5tYXAoQGxhbmd1YWdlcywgKGxhbmd1YWdlKSAtPiBsYW5ndWFnZS5uYW1lc3BhY2UpXG5cbiAgIyMjXG4gIEdldCBsYW5ndWFnZSBmb3IgZ3JhbW1hciBhbmQgZXh0ZW5zaW9uXG4gICMjI1xuICBnZXRMYW5ndWFnZXM6ICh7bmFtZSwgbmFtZXNwYWNlLCBncmFtbWFyLCBleHRlbnNpb259KSAtPlxuICAgICMgY29uc29sZS5sb2coJ2dldExhbmd1YWdlcycsIG5hbWUsIG5hbWVzcGFjZSwgZ3JhbW1hciwgZXh0ZW5zaW9uLCBAbGFuZ3VhZ2VzKVxuICAgIF8udW5pb24oXG4gICAgICBfLmZpbHRlcihAbGFuZ3VhZ2VzLCAobGFuZ3VhZ2UpIC0+IF8uaXNFcXVhbChsYW5ndWFnZS5uYW1lLCBuYW1lKSlcbiAgICAgIF8uZmlsdGVyKEBsYW5ndWFnZXMsIChsYW5ndWFnZSkgLT4gXy5pc0VxdWFsKGxhbmd1YWdlLm5hbWVzcGFjZSwgbmFtZXNwYWNlKSlcbiAgICAgIF8uZmlsdGVyKEBsYW5ndWFnZXMsIChsYW5ndWFnZSkgLT4gXy5pbmNsdWRlcyhsYW5ndWFnZS5ncmFtbWFycywgZ3JhbW1hcikpXG4gICAgICBfLmZpbHRlcihAbGFuZ3VhZ2VzLCAobGFuZ3VhZ2UpIC0+IF8uaW5jbHVkZXMobGFuZ3VhZ2UuZXh0ZW5zaW9ucywgZXh0ZW5zaW9uKSlcbiAgICApXG4iXX0=
