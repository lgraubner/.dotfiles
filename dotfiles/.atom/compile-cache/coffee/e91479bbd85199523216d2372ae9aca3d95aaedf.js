(function() {
  var Range, Validate, helpers;

  Range = require('atom').Range;

  helpers = require('./helpers');

  module.exports = Validate = {
    linter: function(linter, indie) {
      if (indie == null) {
        indie = false;
      }
      if (!indie) {
        if (!(linter.grammarScopes instanceof Array)) {
          throw new Error("grammarScopes is not an Array. Got: " + linter.grammarScopes);
        }
        if (linter.lint) {
          if (typeof linter.lint !== 'function') {
            throw new Error("linter.lint isn't a function on provider");
          }
        } else {
          throw new Error('Missing linter.lint on provider');
        }
        if (linter.scope && typeof linter.scope === 'string') {
          linter.scope = linter.scope.toLowerCase();
        }
        if (linter.scope !== 'file' && linter.scope !== 'project') {
          throw new Error('Linter.scope must be either `file` or `project`');
        }
      }
      if (linter.name) {
        if (typeof linter.name !== 'string') {
          throw new Error('Linter.name must be a string');
        }
      } else {
        linter.name = null;
      }
      return true;
    },
    messages: function(messages, linter) {
      if (!(messages instanceof Array)) {
        throw new Error("Expected messages to be array, provided: " + (typeof messages));
      }
      if (!linter) {
        throw new Error('No linter provided');
      }
      messages.forEach(function(result) {
        if (result.type) {
          if (typeof result.type !== 'string') {
            throw new Error('Invalid type field on Linter Response');
          }
        } else {
          throw new Error('Missing type field on Linter Response');
        }
        if (result.html) {
          if (typeof result.text === 'string') {
            throw new Error('Got both html and text fields on Linter Response, expecting only one');
          }
          if (typeof result.html !== 'string' && !(result.html instanceof HTMLElement)) {
            throw new Error('Invalid html field on Linter Response');
          }
          result.text = null;
        } else if (result.text) {
          if (typeof result.text !== 'string') {
            throw new Error('Invalid text field on Linter Response');
          }
          result.html = null;
        } else {
          throw new Error('Missing html/text field on Linter Response');
        }
        if (result.trace) {
          if (!(result.trace instanceof Array)) {
            throw new Error('Invalid trace field on Linter Response');
          }
        } else {
          result.trace = null;
        }
        if (result["class"]) {
          if (typeof result["class"] !== 'string') {
            throw new Error('Invalid class field on Linter Response');
          }
        } else {
          result["class"] = result.type.toLowerCase().replace(' ', '-');
        }
        if (result.filePath) {
          if (typeof result.filePath !== 'string') {
            throw new Error('Invalid filePath field on Linter response');
          }
        } else {
          result.filePath = null;
        }
        if (result.range != null) {
          result.range = Range.fromObject(result.range);
        }
        result.key = helpers.messageKey(result);
        result.linter = linter.name;
        if (result.trace && result.trace.length) {
          return Validate.messages(result.trace, linter);
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi92YWxpZGF0ZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVI7O0VBQ1YsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFFBQUEsR0FDZjtJQUFBLE1BQUEsRUFBUSxTQUFDLE1BQUQsRUFBUyxLQUFUOztRQUFTLFFBQVE7O01BQ3ZCLElBQUEsQ0FBTyxLQUFQO1FBQ0UsSUFBQSxDQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsWUFBZ0MsS0FBdkMsQ0FBQTtBQUNFLGdCQUFVLElBQUEsS0FBQSxDQUFNLHNDQUFBLEdBQXVDLE1BQU0sQ0FBQyxhQUFwRCxFQURaOztRQUVBLElBQUcsTUFBTSxDQUFDLElBQVY7VUFDRSxJQUErRCxPQUFPLE1BQU0sQ0FBQyxJQUFkLEtBQXdCLFVBQXZGO0FBQUEsa0JBQVUsSUFBQSxLQUFBLENBQU0sMENBQU4sRUFBVjtXQURGO1NBQUEsTUFBQTtBQUdFLGdCQUFVLElBQUEsS0FBQSxDQUFNLGlDQUFOLEVBSFo7O1FBSUEsSUFBRyxNQUFNLENBQUMsS0FBUCxJQUFpQixPQUFPLE1BQU0sQ0FBQyxLQUFkLEtBQXVCLFFBQTNDO1VBQ0UsTUFBTSxDQUFDLEtBQVAsR0FBZSxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQWIsQ0FBQSxFQURqQjs7UUFFQSxJQUFzRSxNQUFNLENBQUMsS0FBUCxLQUFrQixNQUFsQixJQUE2QixNQUFNLENBQUMsS0FBUCxLQUFrQixTQUFySDtBQUFBLGdCQUFVLElBQUEsS0FBQSxDQUFNLGlEQUFOLEVBQVY7U0FURjs7TUFVQSxJQUFHLE1BQU0sQ0FBQyxJQUFWO1FBQ0UsSUFBbUQsT0FBTyxNQUFNLENBQUMsSUFBZCxL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LE1BQWhDLEVBQUE7O01BNUJlLENBQWpCO0lBSlEsQ0FqQlY7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7UmFuZ2V9ID0gcmVxdWlyZSgnYXRvbScpXG5oZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJzJylcblxubW9kdWxlLmV4cG9ydHMgPSBWYWxpZGF0ZSA9XG4gIGxpbnRlcjogKGxpbnRlciwgaW5kaWUgPSBmYWxzZSkgLT5cbiAgICB1bmxlc3MgaW5kaWVcbiAgICAgIHVubGVzcyBsaW50ZXIuZ3JhbW1hclNjb3BlcyBpbnN0YW5jZW9mIEFycmF5XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImdyYW1tYXJTY29wZXMgaXMgbm90IGFuIEFycmF5LiBHb3Q6ICN7bGludGVyLmdyYW1tYXJTY29wZXN9XCIpXG4gICAgICBpZiBsaW50ZXIubGludFxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJsaW50ZXIubGludCBpc24ndCBhIGZ1bmN0aW9uIG9uIHByb3ZpZGVyXCIpIGlmIHR5cGVvZiBsaW50ZXIubGludCBpc250ICdmdW5jdGlvbidcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGxpbnRlci5saW50IG9uIHByb3ZpZGVyJylcbiAgICAgIGlmIGxpbnRlci5zY29wZSBhbmQgdHlwZW9mIGxpbnRlci5zY29wZSBpcyAnc3RyaW5nJ1xuICAgICAgICBsaW50ZXIuc2NvcGUgPSBsaW50ZXIuc2NvcGUudG9Mb3dlckNhc2UoKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdMaW50ZXIuc2NvcGUgbXVzdCBiZSBlaXRoZXIgYGZpbGVgIG9yIGBwcm9qZWN0YCcpIGlmIGxpbnRlci5zY29wZSBpc250ICdmaWxlJyBhbmQgbGludGVyLnNjb3BlIGlzbnQgJ3Byb2plY3QnXG4gICAgaWYgbGludGVyLm5hbWVcbiAgICAgIHRocm93IG5ldyBFcnJvcignTGludGVyLm5hbWUgbXVzdCBiZSBhIHN0cmluZycpIGlmIHR5cGVvZiBsaW50ZXIubmFtZSBpc250ICdzdHJpbmcnXG4gICAgZWxzZVxuICAgICAgbGludGVyLm5hbWUgPSBudWxsXG4gICAgcmV0dXJuIHRydWVcblxuICBtZXNzYWdlczogKG1lc3NhZ2VzLCBsaW50ZXIpIC0+XG4gICAgdW5sZXNzIG1lc3NhZ2VzIGluc3RhbmNlb2YgQXJyYXlcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIG1lc3NhZ2VzIHRvIGJlIGFycmF5LCBwcm92aWRlZDogI3t0eXBlb2YgbWVzc2FnZXN9XCIpXG4gICAgdGhyb3cgbmV3IEVycm9yICdObyBsaW50ZXIgcHJvdmlkZWQnIHVubGVzcyBsaW50ZXJcbiAgICBtZXNzYWdlcy5mb3JFYWNoIChyZXN1bHQpIC0+XG4gICAgICBpZiByZXN1bHQudHlwZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgJ0ludmFsaWQgdHlwZSBmaWVsZCBvbiBMaW50ZXIgUmVzcG9uc2UnIGlmIHR5cGVvZiByZXN1bHQudHlwZSBpc250ICdzdHJpbmcnXG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvciAnTWlzc2luZyB0eXBlIGZpZWxkIG9uIExpbnRlciBSZXNwb25zZSdcbiAgICAgIGlmIHJlc3VsdC5odG1sXG4gICAgICAgIHRocm93IG5ldyBFcnJvciAnR290IGJvdGggaHRtbCBhbmQgdGV4dCBmaWVsZHMgb24gTGludGVyIFJlc3BvbnNlLCBleHBlY3Rpbmcgb25seSBvbmUnIGlmIHR5cGVvZiByZXN1bHQudGV4dCBpcyAnc3RyaW5nJ1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgJ0ludmFsaWQgaHRtbCBmaWVsZCBvbiBMaW50ZXIgUmVzcG9uc2UnIGlmIHR5cGVvZiByZXN1bHQuaHRtbCBpc250ICdzdHJpbmcnIGFuZCBub3QgKHJlc3VsdC5odG1sIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgIHJlc3VsdC50ZXh0ID0gbnVsbFxuICAgICAgZWxzZSBpZiByZXN1bHQudGV4dFxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgJ0ludmFsaWQgdGV4dCBmaWVsZCBvbiBMaW50ZXIgUmVzcG9uc2UnIGlmIHR5cGVvZiByZXN1bHQudGV4dCBpc250ICdzdHJpbmcnXG4gICAgICAgIHJlc3VsdC5odG1sID0gbnVsbFxuICAgICAgZWxzZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgJ01pc3NpbmcgaHRtbC90ZXh0IGZpZWxkIG9uIExpbnRlciBSZXNwb25zZSdcbiAgICAgIGlmIHJlc3VsdC50cmFjZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgJ0ludmFsaWQgdHJhY2UgZmllbGQgb24gTGludGVyIFJlc3BvbnNlJyB1bmxlc3MgcmVzdWx0LnRyYWNlIGluc3RhbmNlb2YgQXJyYXlcbiAgICAgIGVsc2UgcmVzdWx0LnRyYWNlID0gbnVsbFxuICAgICAgaWYgcmVzdWx0LmNsYXNzXG4gICAgICAgIHRocm93IG5ldyBFcnJvciAnSW52YWxpZCBjbGFzcyBmaWVsZCBvbiBMaW50ZXIgUmVzcG9uc2UnIGlmIHR5cGVvZiByZXN1bHQuY2xhc3MgaXNudCAnc3RyaW5nJ1xuICAgICAgZWxzZVxuICAgICAgICByZXN1bHQuY2xhc3MgPSByZXN1bHQudHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyAnLCAnLScpXG4gICAgICBpZiByZXN1bHQuZmlsZVBhdGhcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGZpbGVQYXRoIGZpZWxkIG9uIExpbnRlciByZXNwb25zZScpIGlmIHR5cGVvZiByZXN1bHQuZmlsZVBhdGggaXNudCAnc3RyaW5nJ1xuICAgICAgZWxzZVxuICAgICAgICByZXN1bHQuZmlsZVBhdGggPSBudWxsXG4gICAgICByZXN1bHQucmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0IHJlc3VsdC5yYW5nZSBpZiByZXN1bHQucmFuZ2U/XG4gICAgICByZXN1bHQua2V5ID0gaGVscGVycy5tZXNzYWdlS2V5KHJlc3VsdClcbiAgICAgIHJlc3VsdC5saW50ZXIgPSBsaW50ZXIubmFtZVxuICAgICAgVmFsaWRhdGUubWVzc2FnZXMocmVzdWx0LnRyYWNlLCBsaW50ZXIpIGlmIHJlc3VsdC50cmFjZSBhbmQgcmVzdWx0LnRyYWNlLmxlbmd0aFxuICAgIHJldHVyblxuIl19
