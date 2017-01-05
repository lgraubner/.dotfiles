
/*
 */

(function() {
  "use strict";
  var Beautifier, Gherkin, Lexer, logger,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  Lexer = require('gherkin').Lexer('en');

  logger = require('../logger')(__filename);

  module.exports = Gherkin = (function(superClass) {
    extend(Gherkin, superClass);

    function Gherkin() {
      return Gherkin.__super__.constructor.apply(this, arguments);
    }

    Gherkin.prototype.name = "Gherkin formatter";

    Gherkin.prototype.link = "https://github.com/Glavin001/atom-beautify/blob/master/src/beautifiers/gherkin.coffee";

    Gherkin.prototype.options = {
      gherkin: true
    };

    Gherkin.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var i, len, lexer, line, loggerLevel, recorder, ref;
        recorder = {
          lines: [],
          tags: [],
          comments: [],
          last_obj: null,
          indent_to: function(indent_level) {
            if (indent_level == null) {
              indent_level = 0;
            }
            return options.indent_char.repeat(options.indent_size * indent_level);
          },
          write_blank: function() {
            return this.lines.push('');
          },
          write_indented: function(content, indent) {
            var i, len, line, ref, results;
            if (indent == null) {
              indent = 0;
            }
            ref = content.trim().split("\n");
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              line = ref[i];
              results.push(this.lines.push("" + (this.indent_to(indent)) + (line.trim())));
            }
            return results;
          },
          write_comments: function(indent) {
            var comment, i, len, ref, results;
            if (indent == null) {
              indent = 0;
            }
            ref = this.comments.splice(0, this.comments.length);
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              comment = ref[i];
              results.push(this.write_indented(comment, indent));
            }
            return results;
          },
          write_tags: function(indent) {
            if (indent == null) {
              indent = 0;
            }
            if (this.tags.length > 0) {
              return this.write_indented(this.tags.splice(0, this.tags.length).join(' '), indent);
            }
          },
          comment: function(value, line) {
            logger.verbose({
              token: 'comment',
              value: value.trim(),
              line: line
            });
            return this.comments.push(value);
          },
          tag: function(value, line) {
            logger.verbose({
              token: 'tag',
              value: value,
              line: line
            });
            return this.tags.push(value);
          },
          feature: function(keyword, name, description, line) {
            logger.verbose({
              token: 'feature',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_comments(0);
            this.write_tags(0);
            this.write_indented(keyword + ": " + name, '');
            if (description) {
              return this.write_indented(description, 1);
            }
          },
          background: function(keyword, name, description, line) {
            logger.verbose({
              token: 'background',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(1);
            this.write_indented(keyword + ": " + name, 1);
            if (description) {
              return this.write_indented(description, 2);
            }
          },
          scenario: function(keyword, name, description, line) {
            logger.verbose({
              token: 'scenario',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(1);
            this.write_tags(1);
            this.write_indented(keyword + ": " + name, 1);
            if (description) {
              return this.write_indented(description, 2);
            }
          },
          scenario_outline: function(keyword, name, description, line) {
            logger.verbose({
              token: 'outline',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(1);
            this.write_tags(1);
            this.write_indented(keyword + ": " + name, 1);
            if (description) {
              return this.write_indented(description, 2);
            }
          },
          examples: function(keyword, name, description, line) {
            logger.verbose({
              token: 'examples',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(2);
            this.write_tags(2);
            this.write_indented(keyword + ": " + name, 2);
            if (description) {
              return this.write_indented(description, 3);
            }
          },
          step: function(keyword, name, line) {
            logger.verbose({
              token: 'step',
              keyword: keyword,
              name: name,
              line: line
            });
            this.write_comments(2);
            return this.write_indented("" + keyword + name, 2);
          },
          doc_string: function(content_type, string, line) {
            var three_quotes;
            logger.verbose({
              token: 'doc_string',
              content_type: content_type,
              string: string,
              line: line
            });
            three_quotes = '"""';
            this.write_comments(2);
            return this.write_indented("" + three_quotes + content_type + "\n" + string + "\n" + three_quotes, 3);
          },
          row: function(cells, line) {
            logger.verbose({
              token: 'row',
              cells: cells,
              line: line
            });
            this.write_comments(3);
            return this.write_indented("| " + (cells.join(' | ')) + " |", 3);
          },
          eof: function() {
            logger.verbose({
              token: 'eof'
            });
            return this.write_comments(2);
          }
        };
        lexer = new Lexer(recorder);
        lexer.scan(text);
        loggerLevel = typeof atom !== "undefined" && atom !== null ? atom.config.get('atom-beautify.general.loggerLevel') : void 0;
        if (loggerLevel === 'verbose') {
          ref = recorder.lines;
          for (i = 0, len = ref.length; i < len; i++) {
            line = ref[i];
            logger.verbose("> " + line);
          }
        }
        return resolve(recorder.lines.join("\n"));
      });
    };

    return Gherkin;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvZ2hlcmtpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7QUFBQTtFQUdBO0FBSEEsTUFBQSxrQ0FBQTtJQUFBOzs7RUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBQ2IsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBQWtCLENBQUMsS0FBbkIsQ0FBeUIsSUFBekI7O0VBQ1IsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSLENBQUEsQ0FBcUIsVUFBckI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7c0JBQ3JCLElBQUEsR0FBTTs7c0JBQ04sSUFBQSxHQUFNOztzQkFFTixPQUFBLEdBQVM7TUFDUCxPQUFBLEVBQVMsSUFERjs7O3NCQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBQ1IsYUFBVyxJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNsQixZQUFBO1FBQUEsUUFBQSxHQUFXO1VBQ1QsS0FBQSxFQUFPLEVBREU7VUFFVCxJQUFBLEVBQU0sRUFGRztVQUdULFFBQUEsRUFBVSxFQUhEO1VBS1QsUUFBQSxFQUFVLElBTEQ7VUFPVCxTQUFBLEVBQVcsU0FBQyxZQUFEOztjQUFDLGVBQWU7O0FBQ3pCLG1CQUFPLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBcEIsQ0FBMkIsT0FBTyxDQUFDLFdBQVIsR0FBc0IsWUFBakQ7VUFERSxDQVBGO1VBVVQsV0FBQSxFQUFhLFNBQUE7bUJBQ1gsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQVksRUFBWjtVQURXLENBVko7VUFhVCxjQUFBLEVBQWdCLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDZCxn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bUMsTUFBbkMsR0FBMEMsSUFBMUMsR0FBOEMsWUFBOUQsRUFBOEUsQ0FBOUU7VUFMVSxDQWxGSDtVQXlGVCxHQUFBLEVBQUssU0FBQyxLQUFELEVBQVEsSUFBUjtZQUNILE1BQU0sQ0FBQyxPQUFQLENBQWU7Y0FBQyxLQUFBLEVBQU8sS0FBUjtjQUFlLEtBQUEsRUFBTyxLQUF0QjtjQUE2QixJQUFBLEVBQU0sSUFBbkM7YUFBZjtZQUlBLElBQUMsQ0FBQSxjQUFELENBQWdCLENBQWhCO21CQUNBLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQUEsR0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFOLENBQVcsS0FBWCxDQUFELENBQUosR0FBdUIsSUFBdkMsRUFBNEMsQ0FBNUM7VUFORyxDQXpGSTtVQWlHVCxHQUFBLEVBQUssU0FBQTtZQUNILE1BQU0sQ0FBQyxPQUFQLENBQWU7Y0FBQyxLQUFBLEVBQU8sS0FBUjthQUFmO21CQUVBLElBQUMsQ0FBQSxjQUFELENBQWdCLENBQWhCO1VBSEcsQ0FqR0k7O1FBdUdYLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTSxRQUFOO1FBQ1osS0FBSyxDQUFDLElBQU4sQ0FBVyxJQUFYO1FBRUEsV0FBQSxrREFBYyxJQUFJLENBQUUsTUFBTSxDQUFDLEdBQWIsQ0FBaUIsbUNBQWpCO1FBQ2QsSUFBRyxXQUFBLEtBQWUsU0FBbEI7QUFDRTtBQUFBLGVBQUEscUNBQUE7O1lBQ0UsTUFBTSxDQUFDLE9BQVAsQ0FBZSxJQUFBLEdBQUssSUFBcEI7QUFERixXQURGOztlQUlBLE9BQUEsQ0FBUSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQWYsQ0FBb0IsSUFBcEIsQ0FBUjtNQWhIa0IsQ0FBVDtJQURIOzs7O0tBUjJCO0FBUnZDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuTGV4ZXIgPSByZXF1aXJlKCdnaGVya2luJykuTGV4ZXIoJ2VuJylcbmxvZ2dlciA9IHJlcXVpcmUoJy4uL2xvZ2dlcicpKF9fZmlsZW5hbWUpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR2hlcmtpbiBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJHaGVya2luIGZvcm1hdHRlclwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL0dsYXZpbjAwMS9hdG9tLWJlYXV0aWZ5L2Jsb2IvbWFzdGVyL3NyYy9iZWF1dGlmaWVycy9naGVya2luLmNvZmZlZVwiXG5cbiAgb3B0aW9uczoge1xuICAgIGdoZXJraW46IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgcmV0dXJuIG5ldyBAUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgcmVjb3JkZXIgPSB7XG4gICAgICAgIGxpbmVzOiBbXVxuICAgICAgICB0YWdzOiBbXVxuICAgICAgICBjb21tZW50czogW11cblxuICAgICAgICBsYXN0X29iajogbnVsbFxuXG4gICAgICAgIGluZGVudF90bzogKGluZGVudF9sZXZlbCA9IDApIC0+XG4gICAgICAgICAgcmV0dXJuIG9wdGlvbnMuaW5kZW50X2NoYXIucmVwZWF0KG9wdGlvbnMuaW5kZW50X3NpemUgKiBpbmRlbnRfbGV2ZWwpXG5cbiAgICAgICAgd3JpdGVfYmxhbms6ICgpIC0+XG4gICAgICAgICAgQGxpbmVzLnB1c2goJycpXG5cbiAgICAgICAgd3JpdGVfaW5kZW50ZWQ6IChjb250ZW50LCBpbmRlbnQgPSAwKSAtPlxuICAgICAgICAgIGZvciBsaW5lIGluIGNvbnRlbnQudHJpbSgpLnNwbGl0KFwiXFxuXCIpXG4gICAgICAgICAgICBAbGluZXMucHVzaChcIiN7QGluZGVudF90byhpbmRlbnQpfSN7bGluZS50cmltKCl9XCIpXG5cbiAgICAgICAgd3JpdGVfY29tbWVudHM6IChpbmRlbnQgPSAwKSAtPlxuICAgICAgICAgIGZvciBjb21tZW50IGluIEBjb21tZW50cy5zcGxpY2UoMCwgQGNvbW1lbnRzLmxlbmd0aClcbiAgICAgICAgICAgIEB3cml0ZV9pbmRlbnRlZChjb21tZW50LCBpbmRlbnQpXG5cbiAgICAgICAgd3JpdGVfdGFnczogKGluZGVudCA9IDApIC0+XG4gICAgICAgICAgaWYgQHRhZ3MubGVuZ3RoID4gMFxuICAgICAgICAgICAgQHdyaXRlX2luZGVudGVkKEB0YWdzLnNwbGljZSgwLCBAdGFncy5sZW5ndGgpLmpvaW4oJyAnKSwgaW5kZW50KVxuXG4gICAgICAgIGNvbW1lbnQ6ICh2YWx1ZSwgbGluZSkgLT5cbiAgICAgICAgICBsb2dnZXIudmVyYm9zZSh7dG9rZW46ICdjb21tZW50JywgdmFsdWU6IHZhbHVlLnRyaW0oKSwgbGluZTogbGluZX0pXG4gICAgICAgICAgQGNvbW1lbnRzLnB1c2godmFsdWUpXG5cbiAgICAgICAgdGFnOiAodmFsdWUsIGxpbmUpIC0+XG4gICAgICAgICAgbG9nZ2VyLnZlcmJvc2Uoe3Rva2VuOiAndGFnJywgdmFsdWU6IHZhbHVlLCBsaW5lOiBsaW5lfSlcbiAgICAgICAgICBAdGFncy5wdXNoKHZhbHVlKVxuXG4gICAgICAgIGZlYXR1cmU6IChrZXl3b3JkLCBuYW1lLCBkZXNjcmlwdGlvbiwgbGluZSkgLT5cbiAgICAgICAgICBsb2dnZXIudmVyYm9zZSh7dG9rZW46ICdmZWF0dXJlJywga2V5d29yZDoga2V5d29yZCwgbmFtZTogbmFtZSwgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLCBsaW5lOiBsaW5lfSlcblxuICAgICAgICAgIEB3cml0ZV9jb21tZW50cygwKVxuICAgICAgICAgIEB3cml0ZV90YWdzKDApXG4gICAgICAgICAgQHdyaXRlX2luZGVudGVkKFwiI3trZXl3b3JkfTogI3tuYW1lfVwiLCAnJylcbiAgICAgICAgICBAd3JpdGVfaW5kZW50ZWQoZGVzY3JpcHRpb24sIDEpIGlmIGRlc2NyaXB0aW9uXG5cbiAgICAgICAgYmFja2dyb3VuZDogKGtleXdvcmQsIG5hbWUsIGRlc2NyaXB0aW9uLCBsaW5lKSAtPlxuICAgICAgICAgIGxvZ2dlci52ZXJib3NlKHt0b2tlbjogJ2JhY2tncm91bmQnLCBrZXl3b3JkOiBrZXl3b3JkLCBuYW1lOiBuYW1lLCBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sIGxpbmU6IGxpbmV9KVxuXG4gICAgICAgICAgQHdyaXRlX2JsYW5rKClcbiAgICAgICAgICBAd3JpdGVfY29tbWVudHMoMSlcbiAgICAgICAgICBAd3JpdGVfaW5kZW50ZWQoXCIje2tleXdvcmR9OiAje25hbWV9XCIsIDEpXG4gICAgICAgICAgQHdyaXRlX2luZGVudGVkKGRlc2NyaXB0aW9uLCAyKSBpZiBkZXNjcmlwdGlvblxuXG4gICAgICAgIHNjZW5hcmlvOiAoa2V5d29yZCwgbmFtZSwgZGVzY3JpcHRpb24sIGxpbmUpIC0+XG4gICAgICAgICAgbG9nZ2VyLnZlcmJvc2Uoe3Rva2VuOiAnc2NlbmFyaW8nLCBrZXl3b3JkOiBrZXl3b3JkLCBuYW1lOiBuYW1lLCBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sIGxpbmU6IGxpbmV9KVxuXG4gICAgICAgICAgQHdyaXRlX2JsYW5rKClcbiAgICAgICAgICBAd3JpdGVfY29tbWVudHMoMSlcbiAgICAgICAgICBAd3JpdGVfdGFncygxKVxuICAgICAgICAgIEB3cml0ZV9pbmRlbnRlZChcIiN7a2V5d29yZH06ICN7bmFtZX1cIiwgMSlcbiAgICAgICAgICBAd3JpdGVfaW5kZW50ZWQoZGVzY3JpcHRpb24sIDIpIGlmIGRlc2NyaXB0aW9uXG5cbiAgICAgICAgc2NlbmFyaW9fb3V0bGluZTogKGtleXdvcmQsIG5hbWUsIGRlc2NyaXB0aW9uLCBsaW5lKSAtPlxuICAgICAgICAgIGxvZ2dlci52ZXJib3NlKHt0b2tlbjogJ291dGxpbmUnLCBrZXl3b3JkOiBrZXl3b3JkLCBuYW1lOiBuYW1lLCBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sIGxpbmU6IGxpbmV9KVxuXG4gICAgICAgICAgQHdyaXRlX2JsYW5rKClcbiAgICAgICAgICBAd3JpdGVfY29tbWVudHMoMSlcbiAgICAgICAgICBAd3JpdGVfdGFncygxKVxuICAgICAgICAgIEB3cml0ZV9pbmRlbnRlZChcIiN7a2V5d29yZH06ICN7bmFtZX1cIiwgMSlcbiAgICAgICAgICBAd3JpdGVfaW5kZW50ZWQoZGVzY3JpcHRpb24sIDIpIGlmIGRlc2NyaXB0aW9uXG5cbiAgICAgICAgZXhhbXBsZXM6IChrZXl3b3JkLCBuYW1lLCBkZXNjcmlwdGlvbiwgbGluZSkgLT5cbiAgICAgICAgICBsb2dnZXIudmVyYm9zZSh7dG9rZW46ICdleGFtcGxlcycsIGtleXdvcmQ6IGtleXdvcmQsIG5hbWU6IG5hbWUsIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbiwgbGluZTogbGluZX0pXG5cbiAgICAgICAgICBAd3JpdGVfYmxhbmsoKVxuICAgICAgICAgIEB3cml0ZV9jb21tZW50cygyKVxuICAgICAgICAgIEB3cml0ZV90YWdzKDIpXG4gICAgICAgICAgQHdyaXRlX2luZGVudGVkKFwiI3trZXl3b3JkfTogI3tuYW1lfVwiLCAyKVxuICAgICAgICAgIEB3cml0ZV9pbmRlbnRlZChkZXNjcmlwdGlvbiwgMykgaWYgZGVzY3JpcHRpb25cblxuICAgICAgICBzdGVwOiAoa2V5d29yZCwgbmFtZSwgbGluZSkgLT5cbiAgICAgICAgICBsb2dnZXIudmVyYm9zZSh7dG9rZW46ICdzdGVwJywga2V5d29yZDoga2V5d29yZCwgbmFtZTogbmFtZSwgbGluZTogbGluZX0pXG5cbiAgICAgICAgICBAd3JpdGVfY29tbWVudHMoMilcbiAgICAgICAgICBAd3JpdGVfaW5kZW50ZWQoXCIje2tleXdvcmR9I3tuYW1lfVwiLCAyKVxuXG4gICAgICAgIGRvY19zdHJpbmc6IChjb250ZW50X3R5cGUsIHN0cmluZywgbGluZSkgLT5cbiAgICAgICAgICBsb2dnZXIudmVyYm9zZSh7dG9rZW46ICdkb2Nfc3RyaW5nJywgY29udGVudF90eXBlOiBjb250ZW50X3R5cGUsIHN0cmluZzogc3RyaW5nLCBsaW5lOiBsaW5lfSlcbiAgICAgICAgICB0aHJlZV9xdW90ZXMgPSAnXCJcIlwiJ1xuXG4gICAgICAgICAgQHdyaXRlX2NvbW1lbnRzKDIpXG4gICAgICAgICAgQHdyaXRlX2luZGVudGVkKFwiI3t0aHJlZV9xdW90ZXN9I3tjb250ZW50X3R5cGV9XFxuI3tzdHJpbmd9XFxuI3t0aHJlZV9xdW90ZXN9XCIsIDMpXG5cbiAgICAgICAgcm93OiAoY2VsbHMsIGxpbmUpIC0+XG4gICAgICAgICAgbG9nZ2VyLnZlcmJvc2Uoe3Rva2VuOiAncm93JywgY2VsbHM6IGNlbGxzLCBsaW5lOiBsaW5lfSlcblxuICAgICAgICAgICMgVE9ETzogbmVlZCB0byBjb2xsZWN0IHJvd3Mgc28gdGhhdCB3ZSBjYW4gYWxpZ24gdGhlIHZlcnRpY2FsIHBpcGVzIHRvIHRoZSB3aWRlc3QgY29sdW1uc1xuICAgICAgICAgICMgU2VlIEdoZXJraW46OkZvcm1hdHRlcjo6UHJldHR5Rm9ybWF0dGVyI3RhYmxlKHJvd3MpXG4gICAgICAgICAgQHdyaXRlX2NvbW1lbnRzKDMpXG4gICAgICAgICAgQHdyaXRlX2luZGVudGVkKFwifCAje2NlbGxzLmpvaW4oJyB8ICcpfSB8XCIsIDMpXG5cbiAgICAgICAgZW9mOiAoKSAtPlxuICAgICAgICAgIGxvZ2dlci52ZXJib3NlKHt0b2tlbjogJ2VvZid9KVxuICAgICAgICAgICMgSWYgdGhlcmUgd2VyZSBhbnkgY29tbWVudHMgbGVmdCwgdHJlYXQgdGhlbSBhcyBzdGVwIGNvbW1lbnRzLlxuICAgICAgICAgIEB3cml0ZV9jb21tZW50cygyKVxuICAgICAgfVxuXG4gICAgICBsZXhlciA9IG5ldyBMZXhlcihyZWNvcmRlcilcbiAgICAgIGxleGVyLnNjYW4odGV4dClcblxuICAgICAgbG9nZ2VyTGV2ZWwgPSBhdG9tPy5jb25maWcuZ2V0KCdhdG9tLWJlYXV0aWZ5LmdlbmVyYWwubG9nZ2VyTGV2ZWwnKVxuICAgICAgaWYgbG9nZ2VyTGV2ZWwgaXMgJ3ZlcmJvc2UnXG4gICAgICAgIGZvciBsaW5lIGluIHJlY29yZGVyLmxpbmVzXG4gICAgICAgICAgbG9nZ2VyLnZlcmJvc2UoXCI+ICN7bGluZX1cIilcblxuICAgICAgcmVzb2x2ZSByZWNvcmRlci5saW5lcy5qb2luKFwiXFxuXCIpXG4gICAgKVxuIl19
