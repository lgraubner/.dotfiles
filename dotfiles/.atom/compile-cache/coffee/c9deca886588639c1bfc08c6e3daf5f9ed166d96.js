(function() {
  "use strict";
  var Beautifier, PrettyDiff,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = PrettyDiff = (function(superClass) {
    extend(PrettyDiff, superClass);

    function PrettyDiff() {
      return PrettyDiff.__super__.constructor.apply(this, arguments);
    }

    PrettyDiff.prototype.name = "Pretty Diff";

    PrettyDiff.prototype.link = "https://github.com/prettydiff/prettydiff";

    PrettyDiff.prototype.options = {
      _: {
        inchar: [
          "indent_with_tabs", "indent_char", function(indent_with_tabs, indent_char) {
            if (indent_with_tabs === true) {
              return "\t";
            } else {
              return indent_char;
            }
          }
        ],
        insize: [
          "indent_with_tabs", "indent_size", function(indent_with_tabs, indent_size) {
            if (indent_with_tabs === true) {
              return 1;
            } else {
              return indent_size;
            }
          }
        ],
        objsort: function(objsort) {
          return objsort || false;
        },
        preserve: [
          'preserve_newlines', function(preserve_newlines) {
            if (preserve_newlines === true) {
              return "all";
            } else {
              return "none";
            }
          }
        ],
        cssinsertlines: "newline_between_rules",
        comments: [
          "indent_comments", function(indent_comments) {
            if (indent_comments === false) {
              return "noindent";
            } else {
              return "indent";
            }
          }
        ],
        force: "force_indentation",
        quoteConvert: "convert_quotes",
        vertical: [
          'align_assignments', function(align_assignments) {
            if (align_assignments === true) {
              return "all";
            } else {
              return "none";
            }
          }
        ],
        wrap: "wrap_line_length",
        space: "space_after_anon_function",
        noleadzero: "no_lead_zero",
        endcomma: "end_with_comma",
        methodchain: [
          'break_chained_methods', function(break_chained_methods) {
            if (break_chained_methods === true) {
              return false;
            } else {
              return true;
            }
          }
        ],
        ternaryline: "preserve_ternary_lines",
        bracepadding: "space_in_paren"
      },
      CSV: true,
      Coldfusion: true,
      ERB: true,
      EJS: true,
      HTML: true,
      Handlebars: true,
      Nunjucks: true,
      XML: true,
      SVG: true,
      Spacebars: true,
      JSX: true,
      JavaScript: true,
      CSS: true,
      SCSS: true,
      JSON: true,
      TSS: true,
      Twig: true,
      LESS: true,
      Swig: true,
      "UX Markup": true,
      Visualforce: true,
      "Riot.js": true,
      XTemplate: true
    };

    PrettyDiff.prototype.beautify = function(text, language, options) {
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var _, args, lang, output, prettydiff, result;
          prettydiff = require("prettydiff");
          _ = require('lodash');
          lang = "auto";
          switch (language) {
            case "CSV":
              lang = "csv";
              break;
            case "Coldfusion":
              lang = "html";
              break;
            case "EJS":
            case "Twig":
              lang = "ejs";
              break;
            case "ERB":
              lang = "html_ruby";
              break;
            case "Handlebars":
            case "Mustache":
            case "Spacebars":
            case "Swig":
            case "Riot.js":
            case "XTemplate":
              lang = "handlebars";
              break;
            case "SGML":
              lang = "markup";
              break;
            case "XML":
            case "Visualforce":
            case "SVG":
              lang = "xml";
              break;
            case "HTML":
            case "Nunjucks":
            case "UX Markup":
              lang = "html";
              break;
            case "JavaScript":
              lang = "javascript";
              break;
            case "JSON":
              lang = "json";
              break;
            case "JSX":
              lang = "jsx";
              break;
            case "JSTL":
              lang = "jsp";
              break;
            case "CSS":
              lang = "css";
              break;
            case "LESS":
              lang = "less";
              break;
            case "SCSS":
              lang = "scss";
              break;
            case "TSS":
              lang = "tss";
              break;
            default:
              lang = "auto";
          }
          args = {
            source: text,
            lang: lang,
            mode: "beautify"
          };
          _.merge(options, args);
          _this.verbose('prettydiff', options);
          output = prettydiff.api(options);
          result = output[0];
          return resolve(result);
        };
      })(this));
    };

    return PrettyDiff;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcHJldHR5ZGlmZi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsc0JBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3lCQUNyQixJQUFBLEdBQU07O3lCQUNOLElBQUEsR0FBTTs7eUJBQ04sT0FBQSxHQUFTO01BRVAsQ0FBQSxFQUNFO1FBQUEsTUFBQSxFQUFRO1VBQUMsa0JBQUQsRUFBcUIsYUFBckIsRUFBb0MsU0FBQyxnQkFBRCxFQUFtQixXQUFuQjtZQUMxQyxJQUFJLGdCQUFBLEtBQW9CLElBQXhCO3FCQUNFLEtBREY7YUFBQSxNQUFBO3FCQUNZLFlBRFo7O1VBRDBDLENBQXBDO1NBQVI7UUFJQSxNQUFBLEVBQVE7VUFBQyxrQkFBRCxFQUFxQixhQUFyQixFQUFvQyxTQUFDLGdCQUFELEVBQW1CLFdBQW5CO1lBQzFDLElBQUksZ0JBQUEsS0FBb0IsSUFBeEI7cUJBQ0UsRUFERjthQUFBLE1BQUE7cUJBQ1MsWUFEVDs7VUFEMEMsQ0FBcEM7U0FKUjtRQVFBLE9BQUEsRUFBUyxTQUFDLE9BQUQ7aUJBQ1AsT0FBQSxJQUFXO1FBREosQ0FSVDtRQVVBLFFBQUEsRUFBVTtVQUFDLG1CQUFELEVBQXNCLFNBQUMsaUJBQUQ7WUFDOUIsSUFBSSxpQkFBQSxLQUFxQixJQUF6QjtxQkFDRSxNQURGO2FBQUEsTUFBQTtxQkFDYSxPQURiOztVQUQ4QixDQUF0QjtTQVZWO1FBY0EsY0FBQSxFQUFnQix1QkFkaEI7UUFlQSxRQUFBLEVBQVU7VUFBQyxpQkFBRCxFQUFvQixTQUFDLGVBQUQ7WUFDNUIsSUFBSSxlQUFBLEtBQW1CLEtBQXZCO3FCQUNFLFdBREY7YUFBQSxNQUFBO3FCQUNrQixTQURsQjs7VUFENEIsQ0FBcEI7U0FmVjtRQW1CQSxLQUFBLEVBQU8sbUJBbkJQO1FBb0JBLFlBQUEsRUFBYyxnQkFwQmQ7UUFxQkEsUUFBQSxFQUFVO1VBQUMsbUJBQUQsRUFBc0IsU0FBQyxpQkFBRDtZQUM5QixJQUFJLGlCQUFBLEtBQXFCLElBQXpCO3FCQUNFLE1BREY7YUFBQSxNQUFBO3FCQUNhLE9BRGI7O1VBRDhCLENBQXRCO1NBckJWO1FBeUJBLElBQUEsRUFBTSxrQkF6Qk47UUEwQkEsS0FBQSxFQUFPLDJCQTFCUDtRQTJCQSxVQUFBLEVBQVksY0EzQlo7UUE0QkEsUUFBQSxFQUFVLGdCQTVCVjtRQTZCQSxXQUFBLEVBQWE7VUFBQyx1QkFBRCxFQUEwQixTQUFDLHFCQUFEO1lBQ3JDLElBQUkscUJBQUEsS0FBeUIsSUFBN0I7cUJBQ0UsTUFERjthQUFBLE1BQUE7cUJBQ2EsS0FEYjs7VUFEcUMsQ0FBMUI7U0E3QmI7UUFpQ0EsV0FBQSxFQUFhLHdCQWpDYjtRQWtDQSxZQUFBLEVBQWMsZ0JBbENkO09BSEs7TUF1Q1AsR0FBQSxFQUFLLElBdkNFO01Bd0NQLFVBQUEsRUFBWSxJQXhDTDtNQXlDUCxHQUFBLEVBQUssSUF6Q0U7TUEwQ1AsR0FBQSxFQUFLLElBMUNFO01BMkNQLElBQUEsRUFBTSxJQTNDQztNQTRDUCxVQUFBLEVBQVksSUE1Q0w7TUE2Q1AsUUFBQSxFQUFVLElBN0NIO01BOENQLEdBQUEsRUFBSyxJQTlDRTtNQStDUCxHQUFBLEVBQUssSUEvQ0U7TUFnRFAsU0FBQSxFQUFXLElBaERKO01BaURQLEdBQUEsRUFBSyxJQWpERTtNQWtEUCxVQUFBLEVBQVksSUFsREw7TUFtRFAsR0FBQSxFQUFLLElBbkRFO01Bb0RQLElBQUEsRUFBTSxJQXBEQztNQXFEUCxJQUFBLEVBQU0sSUFyREM7TUFzRFAsR0FBQSxFQUFLLElBdERFO01BdURQLElBQUEsRUFBTSxJQXZEQztNQXdEUCxJQUFBLEVBQU0sSUF4REM7TUF5RFAsSUFBQSxFQUFNLElBekRDO01BMERQLFdBQUEsRUFBYSxJQTFETjtNQTJEUCxXQUFBLEVBQWEsSUEzRE47TUE0RFAsU0FBQSxFQUFXLElBNURKO01BNkRQLFNBQUEsRUFBVyxJQTdESjs7O3lCQWdFVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUVSLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNsQixjQUFBO1VBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSO1VBQ2IsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSO1VBR0osSUFBQSxHQUFPO0FBQ1Asa0JBQU8sUUFBUDtBQUFBLGlCQUNPLEtBRFA7Y0FFSSxJQUFBLEdBQU87QUFESjtBQURQLGlCQUdPLFlBSFA7Y0FJSSxJQUFBLEdBQU87QUFESjtBQUhQLGlCQUtPLEtBTFA7QUFBQSxpQkFLYyxNQUxkO2NBTUksSUFBQSxHQUFPO0FBREc7QUFMZCxpQkFPTyxLQVBQO2NBUUksSUFBQSxHQUFPO0FBREo7QUFQUCxpQkFTTyxZQVRQO0FBQUEsaUJBU3FCLFVBVHJCO0FBQUEsaUJBU2lDLFdBVGpDO0FBQUEsaUJBUzhDLE1BVDlDO0FBQUEsaUJBU3NELFNBVHREO0FBQUEsaUJBU2lFLFdBVGpFO2NBVUksSUFBQSxHQUFPO0FBRHNEO0FBVGpFLGlCQVdPLE1BWFA7Y0FZSSxJQUFBLEdBQU87QUFESjtBQVhQLGlCQWFPLEtBYlA7QUFBQSxpQkFhYyxhQWJkO0FBQUEsaUJBYTZCLEtBYjdCO2NBY0ksSUFBQSxHQUFPO0FBRGtCO0FBYjdCLGlCQWVPLE1BZlA7QUFBQSxpQkFlZSxVQWZmO0FBQUEsaUJBZTJCLFdBZjNCO2NBZ0JJLElBQUEsR0FBTztBQURnQjtBQWYzQixpQkFpQk8sWUFqQlA7Y0FrQkksSUFBQSxHQUFPO0FBREo7QUFqQlAsaUJBbUJPLE1BbkJQO2NBb0JJLElBQUEsR0FBTztBQURKO0FBbkJQLGlCQXFCTyxLQXJCUDtjQXNCSSxJQUFBLEdBQU87QUFESjtBQXJCUCxpQkF1Qk8sTUF2QlA7Y0F3QkksSUFBQSxHQUFPO0FBREo7QUF2QlAsaUJBeUJPLEtBekJQO2NBMEJJLElBQUEsR0FBTztBQURKO0FBekJQLGlCQTJCTyxNQTNCUDtjQTRCSSxJQUFBLEdBQU87QUFESjtBQTNCUCxpQkE2Qk8sTUE3QlA7Y0E4QkksSUFBQSxHQUFPO0FBREo7QUE3QlAsaUJBK0JPLEtBL0JQO2NBZ0NJLElBQUEsR0FBTztBQURKO0FBL0JQO2NBa0NJLElBQUEsR0FBTztBQWxDWDtVQXFDQSxJQUFBLEdBQ0U7WUFBQSxNQUFBLEVBQVEsSUFBUjtZQUNBLElBQUEsRUFBTSxJQUROO1lBRUEsSUFBQSxFQUFNLFVBRk47O1VBS0YsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxPQUFSLEVBQWlCLElBQWpCO1VBR0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQXVCLE9BQXZCO1VBQ0EsTUFBQSxHQUFTLFVBQVUsQ0FBQyxHQUFYLENBQWUsT0FBZjtVQUNULE1BQUEsR0FBUyxNQUFPLENBQUEsQ0FBQTtpQkFHaEIsT0FBQSxDQUFRLE1BQVI7UUF6RGtCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFUO0lBRkg7Ozs7S0FuRThCO0FBSDFDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFByZXR0eURpZmYgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiUHJldHR5IERpZmZcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9wcmV0dHlkaWZmL3ByZXR0eWRpZmZcIlxuICBvcHRpb25zOiB7XG4gICAgIyBBcHBseSB0aGVzZSBvcHRpb25zIGZpcnN0IC8gZ2xvYmFsbHksIGZvciBhbGwgbGFuZ3VhZ2VzXG4gICAgXzpcbiAgICAgIGluY2hhcjogW1wiaW5kZW50X3dpdGhfdGFic1wiLCBcImluZGVudF9jaGFyXCIsIChpbmRlbnRfd2l0aF90YWJzLCBpbmRlbnRfY2hhcikgLT5cbiAgICAgICAgaWYgKGluZGVudF93aXRoX3RhYnMgaXMgdHJ1ZSkgdGhlbiBcXFxuICAgICAgICAgIFwiXFx0XCIgZWxzZSBpbmRlbnRfY2hhclxuICAgICAgXVxuICAgICAgaW5zaXplOiBbXCJpbmRlbnRfd2l0aF90YWJzXCIsIFwiaW5kZW50X3NpemVcIiwgKGluZGVudF93aXRoX3RhYnMsIGluZGVudF9zaXplKSAtPlxuICAgICAgICBpZiAoaW5kZW50X3dpdGhfdGFicyBpcyB0cnVlKSB0aGVuIFxcXG4gICAgICAgICAgMSBlbHNlIGluZGVudF9zaXplXG4gICAgICBdXG4gICAgICBvYmpzb3J0OiAob2Jqc29ydCkgLT5cbiAgICAgICAgb2Jqc29ydCBvciBmYWxzZVxuICAgICAgcHJlc2VydmU6IFsncHJlc2VydmVfbmV3bGluZXMnLCAocHJlc2VydmVfbmV3bGluZXMpIC0+XG4gICAgICAgIGlmIChwcmVzZXJ2ZV9uZXdsaW5lcyBpcyB0cnVlICkgdGhlbiBcXFxuICAgICAgICAgIFwiYWxsXCIgZWxzZSBcIm5vbmVcIlxuICAgICAgXVxuICAgICAgY3NzaW5zZXJ0bGluZXM6IFwibmV3bGluZV9iZXR3ZWVuX3J1bGVzXCJcbiAgICAgIGNvbW1lbnRzOiBbXCJpbmRlbnRfY29tbWVudHNcIiwgKGluZGVudF9jb21tZW50cykgLT5cbiAgICAgICAgaWYgKGluZGVudF9jb21tZW50cyBpcyBmYWxzZSkgdGhlbiBcXFxuICAgICAgICAgIFwibm9pbmRlbnRcIiBlbHNlIFwiaW5kZW50XCJcbiAgICAgIF1cbiAgICAgIGZvcmNlOiBcImZvcmNlX2luZGVudGF0aW9uXCJcbiAgICAgIHF1b3RlQ29udmVydDogXCJjb252ZXJ0X3F1b3Rlc1wiXG4gICAgICB2ZXJ0aWNhbDogWydhbGlnbl9hc3NpZ25tZW50cycsIChhbGlnbl9hc3NpZ25tZW50cykgLT5cbiAgICAgICAgaWYgKGFsaWduX2Fzc2lnbm1lbnRzIGlzIHRydWUgKSB0aGVuIFxcXG4gICAgICAgICAgXCJhbGxcIiBlbHNlIFwibm9uZVwiXG4gICAgICBdXG4gICAgICB3cmFwOiBcIndyYXBfbGluZV9sZW5ndGhcIlxuICAgICAgc3BhY2U6IFwic3BhY2VfYWZ0ZXJfYW5vbl9mdW5jdGlvblwiXG4gICAgICBub2xlYWR6ZXJvOiBcIm5vX2xlYWRfemVyb1wiXG4gICAgICBlbmRjb21tYTogXCJlbmRfd2l0aF9jb21tYVwiXG4gICAgICBtZXRob2RjaGFpbjogWydicmVha19jaGFpbmVkX21ldGhvZHMnLCAoYnJlYWtfY2hhaW5lZF9tZXRob2RzKSAtPlxuICAgICAgICBpZiAoYnJlYWtfY2hhaW5lZF9tZXRob2RzIGlzIHRydWUgKSB0aGVuIFxcXG4gICAgICAgICAgZmFsc2UgZWxzZSB0cnVlXG4gICAgICBdXG4gICAgICB0ZXJuYXJ5bGluZTogXCJwcmVzZXJ2ZV90ZXJuYXJ5X2xpbmVzXCJcbiAgICAgIGJyYWNlcGFkZGluZzogXCJzcGFjZV9pbl9wYXJlblwiXG4gICAgIyBBcHBseSBsYW5ndWFnZS1zcGVjaWZpYyBvcHRpb25zXG4gICAgQ1NWOiB0cnVlXG4gICAgQ29sZGZ1c2lvbjogdHJ1ZVxuICAgIEVSQjogdHJ1ZVxuICAgIEVKUzogdHJ1ZVxuICAgIEhUTUw6IHRydWVcbiAgICBIYW5kbGViYXJzOiB0cnVlXG4gICAgTnVuanVja3M6IHRydWVcbiAgICBYTUw6IHRydWVcbiAgICBTVkc6IHRydWVcbiAgICBTcGFjZWJhcnM6IHRydWVcbiAgICBKU1g6IHRydWVcbiAgICBKYXZhU2NyaXB0OiB0cnVlXG4gICAgQ1NTOiB0cnVlXG4gICAgU0NTUzogdHJ1ZVxuICAgIEpTT046IHRydWVcbiAgICBUU1M6IHRydWVcbiAgICBUd2lnOiB0cnVlXG4gICAgTEVTUzogdHJ1ZVxuICAgIFN3aWc6IHRydWVcbiAgICBcIlVYIE1hcmt1cFwiOiB0cnVlXG4gICAgVmlzdWFsZm9yY2U6IHRydWVcbiAgICBcIlJpb3QuanNcIjogdHJ1ZVxuICAgIFhUZW1wbGF0ZTogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cblxuICAgIHJldHVybiBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIHByZXR0eWRpZmYgPSByZXF1aXJlKFwicHJldHR5ZGlmZlwiKVxuICAgICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5cbiAgICAgICMgU2VsZWN0IFByZXR0eWRpZmYgbGFuZ3VhZ2VcbiAgICAgIGxhbmcgPSBcImF1dG9cIlxuICAgICAgc3dpdGNoIGxhbmd1YWdlXG4gICAgICAgIHdoZW4gXCJDU1ZcIlxuICAgICAgICAgIGxhbmcgPSBcImNzdlwiXG4gICAgICAgIHdoZW4gXCJDb2xkZnVzaW9uXCJcbiAgICAgICAgICBsYW5nID0gXCJodG1sXCJcbiAgICAgICAgd2hlbiBcIkVKU1wiLCBcIlR3aWdcIlxuICAgICAgICAgIGxhbmcgPSBcImVqc1wiXG4gICAgICAgIHdoZW4gXCJFUkJcIlxuICAgICAgICAgIGxhbmcgPSBcImh0bWxfcnVieVwiXG4gICAgICAgIHdoZW4gXCJIYW5kbGViYXJzXCIsIFwiTXVzdGFjaGVcIiwgXCJTcGFjZWJhcnNcIiwgXCJTd2lnXCIsIFwiUmlvdC5qc1wiLCBcIlhUZW1wbGF0ZVwiXG4gICAgICAgICAgbGFuZyA9IFwiaGFuZGxlYmFyc1wiXG4gICAgICAgIHdoZW4gXCJTR01MXCJcbiAgICAgICAgICBsYW5nID0gXCJtYXJrdXBcIlxuICAgICAgICB3aGVuIFwiWE1MXCIsIFwiVmlzdWFsZm9yY2VcIiwgXCJTVkdcIlxuICAgICAgICAgIGxhbmcgPSBcInhtbFwiXG4gICAgICAgIHdoZW4gXCJIVE1MXCIsIFwiTnVuanVja3NcIiwgXCJVWCBNYXJrdXBcIlxuICAgICAgICAgIGxhbmcgPSBcImh0bWxcIlxuICAgICAgICB3aGVuIFwiSmF2YVNjcmlwdFwiXG4gICAgICAgICAgbGFuZyA9IFwiamF2YXNjcmlwdFwiXG4gICAgICAgIHdoZW4gXCJKU09OXCJcbiAgICAgICAgICBsYW5nID0gXCJqc29uXCJcbiAgICAgICAgd2hlbiBcIkpTWFwiXG4gICAgICAgICAgbGFuZyA9IFwianN4XCJcbiAgICAgICAgd2hlbiBcIkpTVExcIlxuICAgICAgICAgIGxhbmcgPSBcImpzcFwiXG4gICAgICAgIHdoZW4gXCJDU1NcIlxuICAgICAgICAgIGxhbmcgPSBcImNzc1wiXG4gICAgICAgIHdoZW4gXCJMRVNTXCJcbiAgICAgICAgICBsYW5nID0gXCJsZXNzXCJcbiAgICAgICAgd2hlbiBcIlNDU1NcIlxuICAgICAgICAgIGxhbmcgPSBcInNjc3NcIlxuICAgICAgICB3aGVuIFwiVFNTXCJcbiAgICAgICAgICBsYW5nID0gXCJ0c3NcIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgbGFuZyA9IFwiYXV0b1wiXG5cbiAgICAgICMgUHJldHR5ZGlmZiBBcmd1bWVudHNcbiAgICAgIGFyZ3MgPVxuICAgICAgICBzb3VyY2U6IHRleHRcbiAgICAgICAgbGFuZzogbGFuZ1xuICAgICAgICBtb2RlOiBcImJlYXV0aWZ5XCJcblxuICAgICAgIyBNZXJnZSBhcmdzIGludG9zIG9wdGlvbnNcbiAgICAgIF8ubWVyZ2Uob3B0aW9ucywgYXJncylcblxuICAgICAgIyBCZWF1dGlmeVxuICAgICAgQHZlcmJvc2UoJ3ByZXR0eWRpZmYnLCBvcHRpb25zKVxuICAgICAgb3V0cHV0ID0gcHJldHR5ZGlmZi5hcGkob3B0aW9ucylcbiAgICAgIHJlc3VsdCA9IG91dHB1dFswXVxuXG4gICAgICAjIFJldHVybiBiZWF1dGlmaWVkIHRleHRcbiAgICAgIHJlc29sdmUocmVzdWx0KVxuXG4gICAgKVxuIl19
