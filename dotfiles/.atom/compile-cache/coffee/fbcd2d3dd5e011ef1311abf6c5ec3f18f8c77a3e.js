(function() {
  var ATOM_BUNDLE_IDENTIFIER, BufferedProcess, INSTALLATION_LINE_PATTERN, glob, path;

  path = require('path');

  glob = require('glob');

  BufferedProcess = require('atom').BufferedProcess;

  ATOM_BUNDLE_IDENTIFIER = 'com.github.atom';

  INSTALLATION_LINE_PATTERN = /^Installing +([^@]+)@(\S+).+\s+(\S+)$/;

  module.exports = {
    updatePackages: function(isAutoUpdate) {
      if (isAutoUpdate == null) {
        isAutoUpdate = true;
      }
      return this.runApmUpgrade((function(_this) {
        return function(log) {
          var entries, summary;
          entries = _this.parseLog(log);
          summary = _this.generateSummary(entries, isAutoUpdate);
          if (!summary) {
            return;
          }
          return _this.notify({
            title: 'Atom Package Updates',
            message: summary,
            sender: ATOM_BUNDLE_IDENTIFIER,
            activate: ATOM_BUNDLE_IDENTIFIER
          });
        };
      })(this));
    },
    runApmUpgrade: function(callback) {
      var args, command, exit, log, stdout;
      command = atom.packages.getApmPath();
      args = ['upgrade', '--no-confirm', '--no-color'];
      log = '';
      stdout = function(data) {
        return log += data;
      };
      exit = function(exitCode) {
        return callback(log);
      };
      return new BufferedProcess({
        command: command,
        args: args,
        stdout: stdout,
        exit: exit
      });
    },
    parseLog: function(log) {
      var _match, i, len, line, lines, matches, name, result, results, version;
      lines = log.split('\n');
      results = [];
      for (i = 0, len = lines.length; i < len; i++) {
        line = lines[i];
        matches = line.match(INSTALLATION_LINE_PATTERN);
        if (matches == null) {
          continue;
        }
        _match = matches[0], name = matches[1], version = matches[2], result = matches[3];
        results.push({
          'name': name,
          'version': version,
          'isInstalled': result === '\u2713'
        });
      }
      return results;
    },
    generateSummary: function(entries, isAutoUpdate) {
      var names, successfulEntries, summary;
      if (isAutoUpdate == null) {
        isAutoUpdate = true;
      }
      successfulEntries = entries.filter(function(entry) {
        return entry.isInstalled;
      });
      if (!(successfulEntries.length > 0)) {
        return null;
      }
      names = successfulEntries.map(function(entry) {
        return entry.name;
      });
      summary = successfulEntries.length <= 5 ? this.generateEnumerationExpression(names) : successfulEntries.length + " packages";
      summary += successfulEntries.length === 1 ? ' has' : ' have';
      summary += ' been updated';
      if (isAutoUpdate) {
        summary += ' automatically';
      }
      summary += '.';
      return summary;
    },
    generateEnumerationExpression: function(items) {
      var expression, i, index, item, len;
      expression = '';
      for (index = i = 0, len = items.length; i < len; index = ++i) {
        item = items[index];
        if (index > 0) {
          if (index + 1 < items.length) {
            expression += ', ';
          } else {
            expression += ' and ';
          }
        }
        expression += item;
      }
      return expression;
    },
    notify: function(notification) {
      var args, command, key, value;
      command = this.getTerminalNotifierPath();
      if (!command) {
        return console.log("terminal-notifier is not found.");
      }
      args = [];
      for (key in notification) {
        value = notification[key];
        args.push("-" + key, value);
      }
      return new BufferedProcess({
        command: command,
        args: args
      });
    },
    getTerminalNotifierPath: function() {
      var paths, pattern;
      if (this.cachedTerminalNotifierPath !== void 0) {
        return this.cachedTerminalNotifierPath;
      }
      pattern = path.join(__dirname, '..', 'vendor', '**', 'terminal-notifier');
      paths = glob.sync(pattern);
      return this.cachedTerminalNotifierPath = paths.length === 0 ? null : paths[0];
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXV0by11cGRhdGUtcGFja2FnZXMvbGliL3BhY2thZ2UtdXBkYXRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ04sa0JBQW1CLE9BQUEsQ0FBUSxNQUFSOztFQUVwQixzQkFBQSxHQUF5Qjs7RUFDekIseUJBQUEsR0FBNEI7O0VBRTVCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxjQUFBLEVBQWdCLFNBQUMsWUFBRDs7UUFBQyxlQUFlOzthQUM5QixJQUFDLENBQUEsYUFBRCxDQUFlLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO0FBQ2IsY0FBQTtVQUFBLE9BQUEsR0FBVSxLQUFDLENBQUEsUUFBRCxDQUFVLEdBQVY7VUFDVixPQUFBLEdBQVUsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsT0FBakIsRUFBMEIsWUFBMUI7VUFDVixJQUFBLENBQWMsT0FBZDtBQUFBLG1CQUFBOztpQkFDQSxLQUFDLENBQUEsTUFBRCxDQUNFO1lBQUEsS0FBQSxFQUFPLHNCQUFQO1lBQ0EsT0FBQSxFQUFTLE9BRFQ7WUFFQSxNQUFBLEVBQVEsc0JBRlI7WUFHQSxRQUFBLEVBQVUsc0JBSFY7V0FERjtRQUphO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFmO0lBRGMsQ0FBaEI7SUFXQSxhQUFBLEVBQWUsU0FBQyxRQUFEO0FBQ2IsVUFBQTtNQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQWQsQ0FBQTtNQUNWLElBQUEsR0FBTyxDQUFDLFNBQUQsRUFBWSxjQUFaLEVBQTRCLFlBQTVCO01BRVAsR0FBQSxHQUFNO01BRU4sTUFBQSxHQUFTLFNBQUMs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QUFELEdBQ0ssS0FBSyxDQUFDLE1BQU4sS0FBZ0IsQ0FBbkIsR0FDRSxJQURGLEdBR0UsS0FBTSxDQUFBLENBQUE7SUFYYSxDQXBGekI7O0FBUkYiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSAncGF0aCdcbmdsb2IgPSByZXF1aXJlICdnbG9iJ1xue0J1ZmZlcmVkUHJvY2Vzc30gPSByZXF1aXJlICdhdG9tJ1xuXG5BVE9NX0JVTkRMRV9JREVOVElGSUVSID0gJ2NvbS5naXRodWIuYXRvbSdcbklOU1RBTExBVElPTl9MSU5FX1BBVFRFUk4gPSAvXkluc3RhbGxpbmcgKyhbXkBdKylAKFxcUyspLitcXHMrKFxcUyspJC9cblxubW9kdWxlLmV4cG9ydHMgPVxuICB1cGRhdGVQYWNrYWdlczogKGlzQXV0b1VwZGF0ZSA9IHRydWUpIC0+XG4gICAgQHJ1bkFwbVVwZ3JhZGUgKGxvZykgPT5cbiAgICAgIGVudHJpZXMgPSBAcGFyc2VMb2cobG9nKVxuICAgICAgc3VtbWFyeSA9IEBnZW5lcmF0ZVN1bW1hcnkoZW50cmllcywgaXNBdXRvVXBkYXRlKVxuICAgICAgcmV0dXJuIHVubGVzcyBzdW1tYXJ5XG4gICAgICBAbm90aWZ5XG4gICAgICAgIHRpdGxlOiAnQXRvbSBQYWNrYWdlIFVwZGF0ZXMnXG4gICAgICAgIG1lc3NhZ2U6IHN1bW1hcnlcbiAgICAgICAgc2VuZGVyOiBBVE9NX0JVTkRMRV9JREVOVElGSUVSXG4gICAgICAgIGFjdGl2YXRlOiBBVE9NX0JVTkRMRV9JREVOVElGSUVSXG5cbiAgcnVuQXBtVXBncmFkZTogKGNhbGxiYWNrKSAtPlxuICAgIGNvbW1hbmQgPSBhdG9tLnBhY2thZ2VzLmdldEFwbVBhdGgoKVxuICAgIGFyZ3MgPSBbJ3VwZ3JhZGUnLCAnLS1uby1jb25maXJtJywgJy0tbm8tY29sb3InXVxuXG4gICAgbG9nID0gJydcblxuICAgIHN0ZG91dCA9IChkYXRhKSAtPlxuICAgICAgbG9nICs9IGRhdGFcblxuICAgIGV4aXQgPSAoZXhpdENvZGUpIC0+XG4gICAgICBjYWxsYmFjayhsb2cpXG5cbiAgICBuZXcgQnVmZmVyZWRQcm9jZXNzKHtjb21tYW5kLCBhcmdzLCBzdGRvdXQsIGV4aXR9KVxuXG4gICMgUGFyc2luZyB0aGUgb3V0cHV0IG9mIGFwbSBpcyBhIGRpcnR5IHdheSwgYnV0IHVzaW5nIGF0b20tcGFja2FnZS1tYW5hZ2VyIGRpcmVjdGx5IHZpYSBKYXZhU2NyaXB0XG4gICMgaXMgcHJvYmFibHkgbW9yZSBicml0dGxlIHRoYW4gcGFyc2luZyB0aGUgb3V0cHV0IHNpbmNlIGl0J3MgYSBwcml2YXRlIHBhY2thZ2UuXG4gICMgL0FwcGxpY2F0aW9ucy9BdG9tLmFwcC9Db250ZW50cy9SZXNvdXJjZXMvYXBwL2FwbS9ub2RlX21vZHVsZXMvYXRvbS1wYWNrYWdlLW1hbmFnZXJcbiAgcGFyc2VMb2c6IChsb2cpIC0+XG4gICAgbGluZXMgPSBsb2cuc3BsaXQoJ1xcbicpXG5cbiAgICBmb3IgbGluZSBpbiBsaW5lc1xuICAgICAgbWF0Y2hlcyA9IGxpbmUubWF0Y2goSU5TVEFMTEFUSU9OX0xJTkVfUEFUVEVSTilcbiAgICAgIGNvbnRpbnVlIHVubGVzcyBtYXRjaGVzP1xuICAgICAgW19tYXRjaCwgbmFtZSwgdmVyc2lvbiwgcmVzdWx0XSA9IG1hdGNoZXNcblxuICAgICAgJ25hbWUnOiBuYW1lXG4gICAgICAndmVyc2lvbic6IHZlcnNpb25cbiAgICAgICdpc0luc3RhbGxlZCc6IHJlc3VsdCA9PSAnXFx1MjcxMydcblxuICBnZW5lcmF0ZVN1bW1hcnk6IChlbnRyaWVzLCBpc0F1dG9VcGRhdGUgPSB0cnVlKSAtPlxuICAgIHN1Y2Nlc3NmdWxFbnRyaWVzID0gZW50cmllcy5maWx0ZXIgKGVudHJ5KSAtPlxuICAgICAgZW50cnkuaXNJbnN0YWxsZWRcbiAgICByZXR1cm4gbnVsbCB1bmxlc3Mgc3VjY2Vzc2Z1bEVudHJpZXMubGVuZ3RoID4gMFxuXG4gICAgbmFtZXMgPSBzdWNjZXNzZnVsRW50cmllcy5tYXAgKGVudHJ5KSAtPlxuICAgICAgZW50cnkubmFtZVxuXG4gICAgc3VtbWFyeSA9XG4gICAgICBpZiBzdWNjZXNzZnVsRW50cmllcy5sZW5ndGggPD0gNVxuICAgICAgICBAZ2VuZXJhdGVFbnVtZXJhdGlvbkV4cHJlc3Npb24obmFtZXMpXG4gICAgICBlbHNlXG4gICAgICAgIFwiI3tzdWNjZXNzZnVsRW50cmllcy5sZW5ndGh9IHBhY2thZ2VzXCJcblxuICAgIHN1bW1hcnkgKz0gaWYgc3VjY2Vzc2Z1bEVudHJpZXMubGVuZ3RoID09IDEgdGhlbiAnIGhhcycgZWxzZSAnIGhhdmUnXG4gICAgc3VtbWFyeSArPSAnIGJlZW4gdXBkYXRlZCdcbiAgICBzdW1tYXJ5ICs9ICcgYXV0b21hdGljYWxseScgaWYgaXNBdXRvVXBkYXRlXG4gICAgc3VtbWFyeSArPSAnLidcbiAgICBzdW1tYXJ5XG5cbiAgZ2VuZXJhdGVFbnVtZXJhdGlvbkV4cHJlc3Npb246IChpdGVtcykgLT5cbiAgICBleHByZXNzaW9uID0gJydcblxuICAgIGZvciBpdGVtLCBpbmRleCBpbiBpdGVtc1xuICAgICAgaWYgaW5kZXggPiAwXG4gICAgICAgIGlmIGluZGV4ICsgMSA8IGl0ZW1zLmxlbmd0aFxuICAgICAgICAgIGV4cHJlc3Npb24gKz0gJywgJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgZXhwcmVzc2lvbiArPSAnIGFuZCAnXG5cbiAgICAgIGV4cHJlc3Npb24gKz0gaXRlbVxuXG4gICAgZXhwcmVzc2lvblxuXG4gIG5vdGlmeTogKG5vdGlmaWNhdGlvbikgLT5cbiAgICBjb21tYW5kID0gQGdldFRlcm1pbmFsTm90aWZpZXJQYXRoKClcbiAgICByZXR1cm4gY29uc29sZS5sb2coXCJ0ZXJtaW5hbC1ub3RpZmllciBpcyBub3QgZm91bmQuXCIpIHVubGVzcyBjb21tYW5kXG5cbiAgICBhcmdzID0gW11cbiAgICBmb3Iga2V5LCB2YWx1ZSBvZiBub3RpZmljYXRpb25cbiAgICAgIGFyZ3MucHVzaChcIi0je2tleX1cIiwgdmFsdWUpXG5cbiAgICBuZXcgQnVmZmVyZWRQcm9jZXNzKHtjb21tYW5kLCBhcmdzfSlcblxuICBnZXRUZXJtaW5hbE5vdGlmaWVyUGF0aDogLT5cbiAgICB1bmxlc3MgQGNhY2hlZFRlcm1pbmFsTm90aWZpZXJQYXRoID09IHVuZGVmaW5lZFxuICAgICAgcmV0dXJuIEBjYWNoZWRUZXJtaW5hbE5vdGlmaWVyUGF0aFxuXG4gICAgcGF0dGVybiA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICd2ZW5kb3InLCAnKionLCAndGVybWluYWwtbm90aWZpZXInKVxuICAgIHBhdGhzID0gZ2xvYi5zeW5jKHBhdHRlcm4pXG5cbiAgICBAY2FjaGVkVGVybWluYWxOb3RpZmllclBhdGggPVxuICAgICAgaWYgcGF0aHMubGVuZ3RoID09IDBcbiAgICAgICAgbnVsbFxuICAgICAgZWxzZVxuICAgICAgICBwYXRoc1swXVxuIl19
