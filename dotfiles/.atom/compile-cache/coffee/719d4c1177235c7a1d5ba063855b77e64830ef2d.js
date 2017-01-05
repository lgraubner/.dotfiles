(function() {
  var ColorContext, ColorSearch, Emitter, Minimatch, ref, registry;

  ref = [], Emitter = ref[0], Minimatch = ref[1], ColorContext = ref[2], registry = ref[3];

  module.exports = ColorSearch = (function() {
    ColorSearch.deserialize = function(state) {
      return new ColorSearch(state.options);
    };

    function ColorSearch(options) {
      var ref1, subscription;
      this.options = options != null ? options : {};
      ref1 = this.options, this.sourceNames = ref1.sourceNames, this.ignoredNameSources = ref1.ignoredNames, this.context = ref1.context, this.project = ref1.project;
      if (Emitter == null) {
        Emitter = require('atom').Emitter;
      }
      this.emitter = new Emitter;
      if (this.project != null) {
        this.init();
      } else {
        subscription = atom.packages.onDidActivatePackage((function(_this) {
          return function(pkg) {
            if (pkg.name === 'pigments') {
              subscription.dispose();
              _this.project = pkg.mainModule.getProject();
              return _this.init();
            }
          };
        })(this));
      }
    }

    ColorSearch.prototype.init = function() {
      var error, i, ignore, len, ref1;
      if (Minimatch == null) {
        Minimatch = require('minimatch').Minimatch;
      }
      if (ColorContext == null) {
        ColorContext = require('./color-context');
      }
      if (this.context == null) {
        this.context = new ColorContext({
          registry: this.project.getColorExpressionsRegistry()
        });
      }
      this.parser = this.context.parser;
      this.variables = this.context.getVariables();
      if (this.sourceNames == null) {
        this.sourceNames = [];
      }
      if (this.ignoredNameSources == null) {
        this.ignoredNameSources = [];
      }
      this.ignoredNames = [];
      ref1 = this.ignoredNameSources;
      for (i = 0, len = ref1.length; i < len; i++) {
        ignore = ref1[i];
        if (ignore != null) {
          try {
            this.ignoredNames.push(new Minimatch(ignore, {
              matchBase: true,
              dot: true
            }));
          } catch (error1) {
            error = error1;
            console.warn("Error parsing ignore pattern (" + ignore + "): " + error.message);
          }
        }
      }
      if (this.searchRequested) {
        return this.search();
      }
    };

    ColorSearch.prototype.getTitle = function() {
      return 'Pigments Find Results';
    };

    ColorSearch.prototype.getURI = function() {
      return 'pigments://search';
    };

    ColorSearch.prototype.getIconName = function() {
      return "pigments";
    };

    ColorSearch.prototype.onDidFindMatches = function(callback) {
      return this.emitter.on('did-find-matches', callback);
    };

    ColorSearch.prototype.onDidCompleteSearch = function(callback) {
      return this.emitter.on('did-complete-search', callback);
    };

    ColorSearch.prototype.search = function() {
      var promise, re, results;
      if (this.project == null) {
        this.searchRequested = true;
        return;
      }
      re = new RegExp(this.project.getColorExpressionsRegistry().getRegExp());
      results = [];
      promise = atom.workspace.scan(re, {
        paths: this.sourceNames
      }, (function(_this) {
        return function(m) {
          var i, len, newMatches, ref1, ref2, relativePath, result, scope;
          relativePath = atom.project.relativize(m.filePath);
          scope = _this.project.scopeFromFileName(relativePath);
          if (_this.isIgnored(relativePath)) {
            return;
          }
          newMatches = [];
          ref1 = m.matches;
          for (i = 0, len = ref1.length; i < len; i++) {
            result = ref1[i];
            result.color = _this.parser.parse(result.matchText, scope);
            if (!((ref2 = result.color) != null ? ref2.isValid() : void 0)) {
              continue;
            }
            if (result.range[0] == null) {
              console.warn("Color search returned a result with an invalid range", result);
              continue;
            }
            result.range[0][1] += result.matchText.indexOf(result.color.colorExpression);
            result.matchText = result.color.colorExpression;
            results.push(result);
            newMatches.push(result);
          }
          m.matches = newMatches;
          if (m.matches.length > 0) {
            return _this.emitter.emit('did-find-matches', m);
          }
        };
      })(this));
      return promise.then((function(_this) {
        return function() {
          _this.results = results;
          return _this.emitter.emit('did-complete-search', results);
        };
      })(this));
    };

    ColorSearch.prototype.isIgnored = function(relativePath) {
      var i, ignoredName, len, ref1;
      ref1 = this.ignoredNames;
      for (i = 0, len = ref1.length; i < len; i++) {
        ignoredName = ref1[i];
        if (ignoredName.match(relativePath)) {
          return true;
        }
      }
    };

    ColorSearch.prototype.serialize = function() {
      return {
        deserializer: 'ColorSearch',
        options: {
          sourceNames: this.sourceNames,
          ignoredNames: this.ignoredNameSources
        }
      };
    };

    return ColorSearch;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLXNlYXJjaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQStDLEVBQS9DLEVBQUMsZ0JBQUQsRUFBVSxrQkFBVixFQUFxQixxQkFBckIsRUFBbUM7O0VBRW5DLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDSixXQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsS0FBRDthQUFlLElBQUEsV0FBQSxDQUFZLEtBQUssQ0FBQyxPQUFsQjtJQUFmOztJQUVELHFCQUFDLE9BQUQ7QUFDWCxVQUFBO01BRFksSUFBQyxDQUFBLDRCQUFELFVBQVM7TUFDckIsT0FBd0UsSUFBQyxDQUFBLE9BQXpFLEVBQUMsSUFBQyxDQUFBLG1CQUFBLFdBQUYsRUFBNkIsSUFBQyxDQUFBLDBCQUFmLFlBQWYsRUFBa0QsSUFBQyxDQUFBLGVBQUEsT0FBbkQsRUFBNEQsSUFBQyxDQUFBLGVBQUE7TUFDN0QsSUFBa0MsZUFBbEM7UUFBQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLFVBQVo7O01BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BRWYsSUFBRyxvQkFBSDtRQUNFLElBQUMsQ0FBQSxJQUFELENBQUEsRUFERjtPQUFBLE1BQUE7UUFHRSxZQUFBLEdBQWUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBZCxDQUFtQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLEdBQUQ7WUFDaEQsSUFBRyxHQUFHLENBQUMsSUFBSixLQUFZLFVBQWY7Y0FDRSxZQUFZLENBQUMsT0FBYixDQUFBO2NBQ0EsS0FBQyxDQUFBLE9BQUQsR0FBVyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQWYsQ0FBQTtxQkFDWCxLQUFDLENBQUEsSUFBRCxDQUFBLEVBSEY7O1VBRGdEO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQyxFQUhqQjs7SUFMVzs7MEJBY2IsSUFBQSxHQUFNLFNBQUE7QUFDSixVQUFBO01BQUEsSUFBeUMsaUJBQXpDO1FBQUMsWUFBYSxPQUFBLENBQVEsV0FBUixZQUFkOzs7UUFDQSxlQUFnQixPQUFBLENBQVEsaUJBQVI7OztRQUVoQixJQUFDLENBQUEsVUFBZSxJQUFBLFlBQUEsQ0FBYTtVQUFBLFFBQUEsRUFBVSxJQUFDLENBQUEsT0FBTyxDQUFDLDJCQUFULENBQUEsQ0FBVjtTQUFiOztNQUVoQixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxPQUFPLENBQUM7TUFDbkIsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBQTs7UUFDYixJQUFDLENBQUEsY0FBZTs7O1FBQ2hCLElBQUMsQ0FBQSxxQkFBc0I7O01BRXZCLElBQUMsQ0FBQSxZQUFELEdBQWdCO0FBQ2hCO0FBQUEsV0FBQSxzQ0FBQTs7WUFBdUM7QUFDckM7WUFDRSxJQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsQ0FBdUIsSUFBQSxTQUFBLENBQVUsTUFBVixFQUFrQjtjQUFBLFNBQUEsRUFBVyxJQUFYO2NBQWlCLEdBQUEsRUFBSyxJQUF0QjthQUFsQixDQUF2QixFQURGO1dBQUEsY0FBQTtZQUVNO1lBQ0osT0FBTyxDQUFDLElBQVIsQ0FBYSxnQ0FBQSxHQUFpQyxNQUFqQyxHQUF3QyxLQUF4QyxHQUE2QyxLQUFLLENBQUMsT0FBaEUsRUFIRjs7O0FBREY7TUFNQSxJQUFhLElBQUMsQ0FBQSxlQUFkO2VBQUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQUFBOztJQWxCSTs7MEJBb0JOLFFBQUEsR0FBVSxTQUFBO2FBQUc7SUFBSDs7MEJBRVYsTUFBQSxHQUFRLFNBQUE7YUFBRztJQUFIOzswQkFFUixXQUFBLEdBQWEsU0FBQTthQUFHO0lBQUg7OzBCQUViLGdCQUFBLEdBQWtCLFNBQUMsUUFBRDthQUNoQixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxrQkFBWixFQUFnQyxRQUFoQztJQURnQjs7MEJBR2xCLG1CQUFBLEdBQXFCLFNBQUMsUUFBRDthQUNuQixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxxQkFBWixFQUFtQyxRQUFuQztJQURtQjs7MEJBR3JCLE1BQUEsR0FBUSxTQUFBO0FBQ04sVUFBQTtNQUFBLElBQU8sb0JBQVA7UUFDRSxJQUFDLENBQUEsZUFBRCxHQUFtQjtBQUNuQixlQUZGOztNQUlBLEVBQUEsR0FBUyxJQUFBLE1BQUEsQ0FBTyxJQUFDLENBQUEsT0FBTyxDQUFDLDJCQUFULENBQUEsQ0FBc0MsQ0FBQyxTQUF2QyxDQUFBLENBQVA7TUFDVCxPQUFBLEdBQVU7TUFFVixPQUFBLEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLEVBQXBCLEVBQXdCO1FBQUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxXQUFSO09BQXhCLEVBQTZDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO0FBQ3JELGNBQUE7VUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFiLENBQXdCLENBQUMsQ0FBQyxRQUExQjtVQUNmLEtBQUEsR0FBUSxLQUFDLENBQUEsT0FBTyxDQUFDLGlCQUFULENBQTJCLFlBQTNCO1VBQ1IsSUFBVSxLQUFDLENBQUEsU0FBRCxDQUFXLFlBQVgsQ0FBVjtBQUFBLG1CQUFBOztVQUVBLFVBQUEsR0FBYTtBQUNiO0FBQUEsZUFBQSxzQ0FBQTs7WUFDRSxNQUFNLENBQUMsS0FBUCxHQUFlLEtBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixDQUFjLE1BQU0sQ0FBQyxTQUFyQixFQUFnQyxLQUFoQztZQUdmLElBQUEsc0NBQTRCLENBQUUsT0FBZCxDQUFBLFdBQWhCO0FBQUEsdUJBQUE7O1lBR0EsSUFBTyx1QkFBUDtjQUNFLE9BQU8sQ0FBQyxJQUFSLENBQWEsc0RBQWIsRUFBcUUsTUFBckU7QUFDQSx1QkFGRjs7WUFHQSxNQUFNLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBaEIsSUFBc0IsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFqQixDQUF5QixNQUFNLENBQUMsS0FBSyxDQUFDLGVBQXRDO1lBQ3RCLE1BQU0sQ0FBQyxTQUFQLEdBQW1CLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFFaEMsT0FBTyxDQUFDLElBQVIsQ0FBYSxNQUFiO1lBQ0EsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsTUFBaEI7QUFkRjtVQWdCQSxDQUFDLENBQUMsT0FBRixHQUFZO1VBRVosSUFBdUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFWLEdBQW1CLENBQTFEO21CQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLGtCQUFkLEVBQWtDLENBQWxDLEVBQUE7O1FBeEJxRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0M7YUEwQlYsT0FBTyxDQUFDLElBQVIsQ0FBYSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDWCxLQUFDLENBQUEsT0FBRCxHQUFXO2lCQUNYLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLHFCQUFkLEVBQXFDLE9BQXJDO1FBRlc7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWI7SUFsQ007OzBCQXNDUixTQUFBLEdBQVcsU0FBQyxZQUFEO0FBQ1QsVUFBQTtBQUFBO0FBQUEsV0FBQSxzQ0FBQTs7UUFDRSxJQUFlLFdBQVcsQ0FBQyxLQUFaLENBQWtCLFlBQWxCLENBQWY7QUFBQSxpQkFBTyxLQUFQOztBQURGO0lBRFM7OzBCQUlYLFNBQUEsR0FBVyxTQUFBO2FBQ1Q7UUFDRSxZQUFBLEVBQWMsYUFEaEI7UUFFRSxPQUFBLEVBQVM7VUFDTixhQUFELElBQUMsQ0FBQSxXQURNO1VBRVAsWUFBQSxFQUFjLElBQUMsQ0FBQSxrQkFGUjtTQUZYOztJQURTOzs7OztBQTlGYiIsInNvdXJjZXNDb250ZW50IjpbIltFbWl0dGVyLCBNaW5pbWF0Y2gsIENvbG9yQ29udGV4dCwgcmVnaXN0cnldID0gW11cblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQ29sb3JTZWFyY2hcbiAgQGRlc2VyaWFsaXplOiAoc3RhdGUpIC0+IG5ldyBDb2xvclNlYXJjaChzdGF0ZS5vcHRpb25zKVxuXG4gIGNvbnN0cnVjdG9yOiAoQG9wdGlvbnM9e30pIC0+XG4gICAge0Bzb3VyY2VOYW1lcywgaWdub3JlZE5hbWVzOiBAaWdub3JlZE5hbWVTb3VyY2VzLCBAY29udGV4dCwgQHByb2plY3R9ID0gQG9wdGlvbnNcbiAgICB7RW1pdHRlcn0gPSByZXF1aXJlICdhdG9tJyB1bmxlc3MgRW1pdHRlcj9cbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG5cbiAgICBpZiBAcHJvamVjdD9cbiAgICAgIEBpbml0KClcbiAgICBlbHNlXG4gICAgICBzdWJzY3JpcHRpb24gPSBhdG9tLnBhY2thZ2VzLm9uRGlkQWN0aXZhdGVQYWNrYWdlIChwa2cpID0+XG4gICAgICAgIGlmIHBrZy5uYW1lIGlzICdwaWdtZW50cydcbiAgICAgICAgICBzdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICAgICAgQHByb2plY3QgPSBwa2cubWFpbk1vZHVsZS5nZXRQcm9qZWN0KClcbiAgICAgICAgICBAaW5pdCgpXG5cbiAgaW5pdDogLT5cbiAgICB7TWluaW1hdGNofSA9IHJlcXVpcmUgJ21pbmltYXRjaCcgdW5sZXNzIE1pbmltYXRjaD9cbiAgICBDb2xvckNvbnRleHQgPz0gcmVxdWlyZSAnLi9jb2xvci1jb250ZXh0J1xuXG4gICAgQGNvbnRleHQgPz0gbmV3IENvbG9yQ29udGV4dChyZWdpc3RyeTogQHByb2plY3QuZ2V0Q29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5KCkpXG5cbiAgICBAcGFyc2VyID0gQGNvbnRleHQucGFyc2VyXG4gICAgQHZhcmlhYmxlcyA9IEBjb250ZXh0LmdldFZhcmlhYmxlcygpXG4gICAgQHNvdXJjZU5hbWVzID89IFtdXG4gICAgQGlnbm9yZWROYW1lU291cmNlcyA/PSBbXVxuXG4gICAgQGlnbm9yZWROYW1lcyA9IFtdXG4gICAgZm9yIGlnbm9yZSBpbiBAaWdub3JlZE5hbWVTb3VyY2VzIHdoZW4gaWdub3JlP1xuICAgICAgdHJ5XG4gICAgICAgIEBpZ25vcmVkTmFtZXMucHVzaChuZXcgTWluaW1hdGNoKGlnbm9yZSwgbWF0Y2hCYXNlOiB0cnVlLCBkb3Q6IHRydWUpKVxuICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgY29uc29sZS53YXJuIFwiRXJyb3IgcGFyc2luZyBpZ25vcmUgcGF0dGVybiAoI3tpZ25vcmV9KTogI3tlcnJvci5tZXNzYWdlfVwiXG5cbiAgICBAc2VhcmNoKCkgaWYgQHNlYXJjaFJlcXVlc3RlZFxuXG4gIGdldFRpdGxlOiAtPiAnUGlnbWVudHMgRmluZCBSZXN1bHRzJ1xuXG4gIGdldFVSSTogLT4gJ3BpZ21lbnRzOi8vc2VhcmNoJ1xuXG4gIGdldEljb25OYW1lOiAtPiBcInBpZ21lbnRzXCJcblxuICBvbkRpZEZpbmRNYXRjaGVzOiAoY2FsbGJhY2spIC0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1maW5kLW1hdGNoZXMnLCBjYWxsYmFja1xuXG4gIG9uRGlkQ29tcGxldGVTZWFyY2g6IChjYWxsYmFjaykgLT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLWNvbXBsZXRlLXNlYXJjaCcsIGNhbGxiYWNrXG5cbiAgc2VhcmNoOiAtPlxuICAgIHVubGVzcyBAcHJvamVjdD9cbiAgICAgIEBzZWFyY2hSZXF1ZXN0ZWQgPSB0cnVlXG4gICAgICByZXR1cm5cblxuICAgIHJlID0gbmV3IFJlZ0V4cCBAcHJvamVjdC5nZXRDb2xvckV4cHJlc3Npb25zUmVnaXN0cnkoKS5nZXRSZWdFeHAoKVxuICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgcHJvbWlzZSA9IGF0b20ud29ya3NwYWNlLnNjYW4gcmUsIHBhdGhzOiBAc291cmNlTmFtZXMsIChtKSA9PlxuICAgICAgcmVsYXRpdmVQYXRoID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemUobS5maWxlUGF0aClcbiAgICAgIHNjb3BlID0gQHByb2plY3Quc2NvcGVGcm9tRmlsZU5hbWUocmVsYXRpdmVQYXRoKVxuICAgICAgcmV0dXJuIGlmIEBpc0lnbm9yZWQocmVsYXRpdmVQYXRoKVxuXG4gICAgICBuZXdNYXRjaGVzID0gW11cbiAgICAgIGZvciByZXN1bHQgaW4gbS5tYXRjaGVzXG4gICAgICAgIHJlc3VsdC5jb2xvciA9IEBwYXJzZXIucGFyc2UocmVzdWx0Lm1hdGNoVGV4dCwgc2NvcGUpXG4gICAgICAgICMgRklYTUUgaXQgc2hvdWxkIGJlIGhhbmRsZWQgd2F5IGJlZm9yZSwgYnV0IGl0J2xsIG5lZWQgYSBjaGFuZ2VcbiAgICAgICAgIyBpbiBob3cgd2UgdGVzdCBpZiBhIHZhcmlhYmxlIGlzIGEgY29sb3IuXG4gICAgICAgIGNvbnRpbnVlIHVubGVzcyByZXN1bHQuY29sb3I/LmlzVmFsaWQoKVxuICAgICAgICAjIEZJWE1FIFNlZW1zIGxpa2UsIHNvbWV0aW1lIHRoZSByYW5nZSBvZiB0aGUgcmVzdWx0IGlzIHVuZGVmaW5lZCxcbiAgICAgICAgIyB3ZSdsbCBpZ25vcmUgdGhhdCBmb3Igbm93IGFuZCBsb2cgdGhlIGZhdWx0aW5nIHJlc3VsdC5cbiAgICAgICAgdW5sZXNzIHJlc3VsdC5yYW5nZVswXT9cbiAgICAgICAgICBjb25zb2xlLndhcm4gXCJDb2xvciBzZWFyY2ggcmV0dXJuZWQgYSByZXN1bHQgd2l0aCBhbiBpbnZhbGlkIHJhbmdlXCIsIHJlc3VsdFxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIHJlc3VsdC5yYW5nZVswXVsxXSArPSByZXN1bHQubWF0Y2hUZXh0LmluZGV4T2YocmVzdWx0LmNvbG9yLmNvbG9yRXhwcmVzc2lvbilcbiAgICAgICAgcmVzdWx0Lm1hdGNoVGV4dCA9IHJlc3VsdC5jb2xvci5jb2xvckV4cHJlc3Npb25cblxuICAgICAgICByZXN1bHRzLnB1c2ggcmVzdWx0XG4gICAgICAgIG5ld01hdGNoZXMucHVzaCByZXN1bHRcblxuICAgICAgbS5tYXRjaGVzID0gbmV3TWF0Y2hlc1xuXG4gICAgICBAZW1pdHRlci5lbWl0ICdkaWQtZmluZC1tYXRjaGVzJywgbSBpZiBtLm1hdGNoZXMubGVuZ3RoID4gMFxuXG4gICAgcHJvbWlzZS50aGVuID0+XG4gICAgICBAcmVzdWx0cyA9IHJlc3VsdHNcbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1jb21wbGV0ZS1zZWFyY2gnLCByZXN1bHRzXG5cbiAgaXNJZ25vcmVkOiAocmVsYXRpdmVQYXRoKSAtPlxuICAgIGZvciBpZ25vcmVkTmFtZSBpbiBAaWdub3JlZE5hbWVzXG4gICAgICByZXR1cm4gdHJ1ZSBpZiBpZ25vcmVkTmFtZS5tYXRjaChyZWxhdGl2ZVBhdGgpXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIHtcbiAgICAgIGRlc2VyaWFsaXplcjogJ0NvbG9yU2VhcmNoJ1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBAc291cmNlTmFtZXMsXG4gICAgICAgIGlnbm9yZWROYW1lczogQGlnbm9yZWROYW1lU291cmNlc1xuICAgICAgfVxuICAgIH1cbiJdfQ==
