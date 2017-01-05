(function() {
  var Beautifier, Promise, _, fs, path, readFile, spawn, temp, which;

  Promise = require('bluebird');

  _ = require('lodash');

  fs = require('fs');

  temp = require('temp').track();

  readFile = Promise.promisify(fs.readFile);

  which = require('which');

  spawn = require('child_process').spawn;

  path = require('path');

  module.exports = Beautifier = (function() {

    /*
    Promise
     */
    Beautifier.prototype.Promise = Promise;


    /*
    Name of Beautifier
     */

    Beautifier.prototype.name = 'Beautifier';


    /*
    Supported Options
    
    Enable options for supported languages.
    - <string:language>:<boolean:all_options_enabled>
    - <string:language>:<string:option_key>:<boolean:enabled>
    - <string:language>:<string:option_key>:<string:rename>
    - <string:language>:<string:option_key>:<function:transform>
    - <string:language>:<string:option_key>:<array:mapper>
     */

    Beautifier.prototype.options = {};


    /*
    Supported languages by this Beautifier
    
    Extracted from the keys of the `options` field.
     */

    Beautifier.prototype.languages = null;


    /*
    Beautify text
    
    Override this method in subclasses
     */

    Beautifier.prototype.beautify = null;


    /*
    Show deprecation warning to user.
     */

    Beautifier.prototype.deprecate = function(warning) {
      var ref;
      return (ref = atom.notifications) != null ? ref.addWarning(warning) : void 0;
    };


    /*
    Create temporary file
     */

    Beautifier.prototype.tempFile = function(name, contents, ext) {
      if (name == null) {
        name = "atom-beautify-temp";
      }
      if (contents == null) {
        contents = "";
      }
      if (ext == null) {
        ext = "";
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return temp.open({
            prefix: name,
            suffix: ext
          }, function(err, info) {
            _this.debug('tempFile', name, err, info);
            if (err) {
              return reject(err);
            }
            return fs.write(info.fd, contents, function(err) {
              if (err) {
                return reject(err);
              }
              return fs.close(info.fd, function(err) {
                if (err) {
                  return reject(err);
                }
                return resolve(info.path);
              });
            });
          });
        };
      })(this));
    };


    /*
    Read file
     */

    Beautifier.prototype.readFile = function(filePath) {
      return Promise.resolve(filePath).then(function(filePath) {
        return readFile(filePath, "utf8");
      });
    };


    /*
    Find file
     */

    Beautifier.prototype.findFile = function(startDir, fileNames) {
      var currentDir, fileName, filePath, j, len;
      if (!arguments.length) {
        throw new Error("Specify file names to find.");
      }
      if (!(fileNames instanceof Array)) {
        fileNames = [fileNames];
      }
      startDir = startDir.split(path.sep);
      while (startDir.length) {
        currentDir = startDir.join(path.sep);
        for (j = 0, len = fileNames.length; j < len; j++) {
          fileName = fileNames[j];
          filePath = path.join(currentDir, fileName);
          try {
            fs.accessSync(filePath, fs.R_OK);
            return filePath;
          } catch (error) {}
        }
        startDir.pop();
      }
      return null;
    };


    /*
    If platform is Windows
     */

    Beautifier.prototype.isWindows = (function() {
      return new RegExp('^win').test(process.platform);
    })();


    /*
    Get Shell Environment variables
    
    Special thank you to @ioquatix
    See https://github.com/ioquatix/script-runner/blob/v1.5.0/lib/script-runner.coffee#L45-L63
     */

    Beautifier.prototype._envCache = null;

    Beautifier.prototype._envCacheDate = null;

    Beautifier.prototype._envCacheExpiry = 10000;

    Beautifier.prototype.getShellEnvironment = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var buffer, child;
          if ((_this._envCache != null) && (_this._envCacheDate != null)) {
            if ((new Date() - _this._envCacheDate) < _this._envCacheExpiry) {
              return resolve(_this._envCache);
            }
          }
          if (_this.isWindows) {
            return resolve(process.env);
          } else {
            child = spawn(process.env.SHELL, ['-ilc', 'env'], {
              detached: true,
              stdio: ['ignore', 'pipe', process.stderr]
            });
            buffer = '';
            child.stdout.on('data', function(data) {
              return buffer += data;
            });
            return child.on('close', function(code, signal) {
              var definition, environment, j, key, len, ref, ref1, value;
              if (code !== 0) {
                return reject(new Error("Could not get Shell Environment. Exit code: " + code + ", Signal: " + signal));
              }
              environment = {};
              ref = buffer.split('\n');
              for (j = 0, len = ref.length; j < len; j++) {
                definition = ref[j];
                ref1 = definition.split('=', 2), key = ref1[0], value = ref1[1];
                if (key !== '') {
                  environment[key] = value;
                }
              }
              _this._envCache = environment;
              _this._envCacheDate = new Date();
              return resolve(environment);
            });
          }
        };
      })(this));
    };


    /*
    Like the unix which utility.
    
    Finds the first instance of a specified executable in the PATH environment variable.
    Does not cache the results,
    so hash -r is not needed when the PATH changes.
    See https://github.com/isaacs/node-which
     */

    Beautifier.prototype.which = function(exe, options) {
      if (options == null) {
        options = {};
      }
      return this.getShellEnvironment().then((function(_this) {
        return function(env) {
          return new Promise(function(resolve, reject) {
            var i, ref;
            if (options.path == null) {
              options.path = env.PATH;
            }
            if (_this.isWindows) {
              if (!options.path) {
                for (i in env) {
                  if (i.toLowerCase() === "path") {
                    options.path = env[i];
                    break;
                  }
                }
              }
              if (options.pathExt == null) {
                options.pathExt = ((ref = process.env.PATHEXT) != null ? ref : '.EXE') + ";";
              }
            }
            return which(exe, options, function(err, path) {
              if (err) {
                resolve(exe);
              }
              return resolve(path);
            });
          });
        };
      })(this));
    };


    /*
    Add help to error.description
    
    Note: error.description is not officially used in JavaScript,
    however it is used internally for Atom Beautify when displaying errors.
     */

    Beautifier.prototype.commandNotFoundError = function(exe, help) {
      var docsLink, er, helpStr, issueSearchLink, message;
      message = "Could not find '" + exe + "'. The program may not be installed.";
      er = new Error(message);
      er.code = 'CommandNotFound';
      er.errno = er.code;
      er.syscall = 'beautifier::run';
      er.file = exe;
      if (help != null) {
        if (typeof help === "object") {
          helpStr = "See " + help.link + " for program installation instructions.\n";
          if (help.pathOption) {
            helpStr += "You can configure Atom Beautify with the absolute path to '" + (help.program || exe) + "' by setting '" + help.pathOption + "' in the Atom Beautify package settings.\n";
          }
          if (help.additional) {
            helpStr += help.additional;
          }
          issueSearchLink = "https://github.com/Glavin001/atom-beautify/search?q=" + exe + "&type=Issues";
          docsLink = "https://github.com/Glavin001/atom-beautify/tree/master/docs";
          helpStr += "Your program is properly installed if running '" + (this.isWindows ? 'where.exe' : 'which') + " " + exe + "' in your " + (this.isWindows ? 'CMD prompt' : 'Terminal') + " returns an absolute path to the executable. If this does not work then you have not installed the program correctly and so Atom Beautify will not find the program. Atom Beautify requires that the program be found in your PATH environment variable. \nNote that this is not an Atom Beautify issue if beautification does not work and the above command also does not work: this is expected behaviour, since you have not properly installed your program. Please properly setup the program and search through existing Atom Beautify issues before creating a new issue. See " + issueSearchLink + " for related Issues and " + docsLink + " for documentation. If you are still unable to resolve this issue on your own then please create a new issue and ask for help.\n";
          er.description = helpStr;
        } else {
          er.description = help;
        }
      }
      return er;
    };


    /*
    Run command-line interface command
     */

    Beautifier.prototype.run = function(executable, args, arg) {
      var cwd, help, ignoreReturnCode, onStdin, ref;
      ref = arg != null ? arg : {}, cwd = ref.cwd, ignoreReturnCode = ref.ignoreReturnCode, help = ref.help, onStdin = ref.onStdin;
      args = _.flatten(args);
      return Promise.all([executable, Promise.all(args)]).then((function(_this) {
        return function(arg1) {
          var args, exeName;
          exeName = arg1[0], args = arg1[1];
          _this.debug('exeName, args:', exeName, args);
          return Promise.all([exeName, args, _this.getShellEnvironment(), _this.which(exeName)]);
        };
      })(this)).then((function(_this) {
        return function(arg1) {
          var args, env, exe, exeName, exePath, options;
          exeName = arg1[0], args = arg1[1], env = arg1[2], exePath = arg1[3];
          _this.debug('exePath, env:', exePath, env);
          _this.debug('args', args);
          exe = exePath != null ? exePath : exeName;
          options = {
            cwd: cwd,
            env: env
          };
          return _this.spawn(exe, args, options, onStdin).then(function(arg2) {
            var returnCode, stderr, stdout, windowsProgramNotFoundMsg;
            returnCode = arg2.returnCode, stdout = arg2.stdout, stderr = arg2.stderr;
            _this.verbose('spawn result', returnCode, stdout, stderr);
            if (!ignoreReturnCode && returnCode !== 0) {
              windowsProgramNotFoundMsg = "is not recognized as an internal or external command";
              _this.verbose(stderr, windowsProgramNotFoundMsg);
              if (_this.isWindows && returnCode === 1 && stderr.indexOf(windowsProgramNotFoundMsg) !== -1) {
                throw _this.commandNotFoundError(exeName, help);
              } else {
                throw new Error(stderr);
              }
            } else {
              return stdout;
            }
          })["catch"](function(err) {
            _this.debug('error', err);
            if (err.code === 'ENOENT' || err.errno === 'ENOENT') {
              throw _this.commandNotFoundError(exeName, help);
            } else {
              throw err;
            }
          });
        };
      })(this));
    };


    /*
    Spawn
     */

    Beautifier.prototype.spawn = function(exe, args, options, onStdin) {
      args = _.without(args, void 0);
      args = _.without(args, null);
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var cmd, stderr, stdout;
          _this.debug('spawn', exe, args);
          cmd = spawn(exe, args, options);
          stdout = "";
          stderr = "";
          cmd.stdout.on('data', function(data) {
            return stdout += data;
          });
          cmd.stderr.on('data', function(data) {
            return stderr += data;
          });
          cmd.on('close', function(returnCode) {
            _this.debug('spawn done', returnCode, stderr, stdout);
            return resolve({
              returnCode: returnCode,
              stdout: stdout,
              stderr: stderr
            });
          });
          cmd.on('error', function(err) {
            _this.debug('error', err);
            return reject(err);
          });
          if (onStdin) {
            return onStdin(cmd.stdin);
          }
        };
      })(this));
    };


    /*
    Logger instance
     */

    Beautifier.prototype.logger = null;


    /*
    Initialize and configure Logger
     */

    Beautifier.prototype.setupLogger = function() {
      var key, method, ref;
      this.logger = require('../logger')(__filename);
      ref = this.logger;
      for (key in ref) {
        method = ref[key];
        this[key] = method;
      }
      return this.verbose(this.name + " beautifier logger has been initialized.");
    };


    /*
    Constructor to setup beautifer
     */

    function Beautifier() {
      var globalOptions, lang, options, ref;
      this.setupLogger();
      if (this.options._ != null) {
        globalOptions = this.options._;
        delete this.options._;
        if (typeof globalOptions === "object") {
          ref = this.options;
          for (lang in ref) {
            options = ref[lang];
            if (typeof options === "boolean") {
              if (options === true) {
                this.options[lang] = globalOptions;
              }
            } else if (typeof options === "object") {
              this.options[lang] = _.merge(globalOptions, options);
            } else {
              this.warn(("Unsupported options type " + (typeof options) + " for language " + lang + ": ") + options);
            }
          }
        }
      }
      this.verbose("Options for " + this.name + ":", this.options);
      this.languages = _.keys(this.options);
    }

    return Beautifier;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvYmVhdXRpZmllci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsVUFBUjs7RUFDVixDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0VBQ0osRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsS0FBaEIsQ0FBQTs7RUFDUCxRQUFBLEdBQVcsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsRUFBRSxDQUFDLFFBQXJCOztFQUNYLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUjs7RUFDUixLQUFBLEdBQVEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQzs7RUFDakMsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOztBQUVyQjs7O3lCQUdBLE9BQUEsR0FBUzs7O0FBRVQ7Ozs7eUJBR0EsSUFBQSxHQUFNOzs7QUFFTjs7Ozs7Ozs7Ozs7eUJBVUEsT0FBQSxHQUFTOzs7QUFFVDs7Ozs7O3lCQUtBLFNBQUEsR0FBVzs7O0FBRVg7Ozs7Ozt5QkFLQSxRQUFBLEdBQVU7OztBQUVWOzs7O3lCQUdBLFNBQUEsR0FBVyxTQUFDLE9BQUQ7QUFDVCxVQUFBO3FEQUFrQixDQUFFLFVBQXBCLENBQStCLE9BQS9CO0lBRFM7OztBQUdYOzs7O3lCQUdBLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBOEIsUUFBOUIsRUFBNkMsR0FBN0M7O1FBQUMsT0FBTzs7O1FBQXNCLFdBQVc7OztRQUFJLE1BQU07O0FBQzNELGFBQVcsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQsRUFB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QVAsS0FBa0IsUUFBckI7Y0FDSCxJQUFDLENBQUEsT0FBUSxDQUFBLElBQUEsQ0FBVCxHQUFpQixDQUFDLENBQUMsS0FBRixDQUFRLGFBQVIsRUFBdUIsT0FBdkIsRUFEZDthQUFBLE1BQUE7Y0FHSCxJQUFDLENBQUEsSUFBRCxDQUFNLENBQUEsMkJBQUEsR0FBMkIsQ0FBQyxPQUFPLE9BQVIsQ0FBM0IsR0FBMkMsZ0JBQTNDLEdBQTJELElBQTNELEdBQWdFLElBQWhFLENBQUEsR0FBcUUsT0FBM0UsRUFIRzs7QUFMUCxXQUZGO1NBSkY7O01BZUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxjQUFBLEdBQWUsSUFBQyxDQUFBLElBQWhCLEdBQXFCLEdBQTlCLEVBQWtDLElBQUMsQ0FBQSxPQUFuQztNQUVBLElBQUMsQ0FBQSxTQUFELEdBQWEsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsT0FBUjtJQXJCRjs7Ozs7QUExV2YiLCJzb3VyY2VzQ29udGVudCI6WyJQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKVxuXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5mcyA9IHJlcXVpcmUoJ2ZzJylcbnRlbXAgPSByZXF1aXJlKCd0ZW1wJykudHJhY2soKVxucmVhZEZpbGUgPSBQcm9taXNlLnByb21pc2lmeShmcy5yZWFkRmlsZSlcbndoaWNoID0gcmVxdWlyZSgnd2hpY2gnKVxuc3Bhd24gPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuc3Bhd25cbnBhdGggPSByZXF1aXJlKCdwYXRoJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBCZWF1dGlmaWVyXG5cbiAgIyMjXG4gIFByb21pc2VcbiAgIyMjXG4gIFByb21pc2U6IFByb21pc2VcblxuICAjIyNcbiAgTmFtZSBvZiBCZWF1dGlmaWVyXG4gICMjI1xuICBuYW1lOiAnQmVhdXRpZmllcidcblxuICAjIyNcbiAgU3VwcG9ydGVkIE9wdGlvbnNcblxuICBFbmFibGUgb3B0aW9ucyBmb3Igc3VwcG9ydGVkIGxhbmd1YWdlcy5cbiAgLSA8c3RyaW5nOmxhbmd1YWdlPjo8Ym9vbGVhbjphbGxfb3B0aW9uc19lbmFibGVkPlxuICAtIDxzdHJpbmc6bGFuZ3VhZ2U+OjxzdHJpbmc6b3B0aW9uX2tleT46PGJvb2xlYW46ZW5hYmxlZD5cbiAgLSA8c3RyaW5nOmxhbmd1YWdlPjo8c3RyaW5nOm9wdGlvbl9rZXk+OjxzdHJpbmc6cmVuYW1lPlxuICAtIDxzdHJpbmc6bGFuZ3VhZ2U+OjxzdHJpbmc6b3B0aW9uX2tleT46PGZ1bmN0aW9uOnRyYW5zZm9ybT5cbiAgLSA8c3RyaW5nOmxhbmd1YWdlPjo8c3RyaW5nOm9wdGlvbl9rZXk+OjxhcnJheTptYXBwZXI+XG4gICMjI1xuICBvcHRpb25zOiB7fVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgbGFuZ3VhZ2VzIGJ5IHRoaXMgQmVhdXRpZmllclxuXG4gIEV4dHJhY3RlZCBmcm9tIHRoZSBrZXlzIG9mIHRoZSBgb3B0aW9uc2AgZmllbGQuXG4gICMjI1xuICBsYW5ndWFnZXM6IG51bGxcblxuICAjIyNcbiAgQmVhdXRpZnkgdGV4dFxuXG4gIE92ZXJyaWRlIHRoaXMgbWV0aG9kIGluIHN1YmNsYXNzZXNcbiAgIyMjXG4gIGJlYXV0aWZ5OiBudWxsXG5cbiAgIyMjXG4gIFNob3cgZGVwcmVjYXRpb24gd2FybmluZyB0byB1c2VyLlxuICAjIyNcbiAgZGVwcmVjYXRlOiAod2FybmluZykgLT5cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnM/LmFkZFdhcm5pbmcod2FybmluZylcblxuICAjIyNcbiAgQ3JlYXRlIHRlbXBvcmFyeSBmaWxlXG4gICMjI1xuICB0ZW1wRmlsZTogKG5hbWUgPSBcImF0b20tYmVhdXRpZnktdGVtcFwiLCBjb250ZW50cyA9IFwiXCIsIGV4dCA9IFwiXCIpIC0+XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICAjIGNyZWF0ZSB0ZW1wIGZpbGVcbiAgICAgIHRlbXAub3Blbih7cHJlZml4OiBuYW1lLCBzdWZmaXg6IGV4dH0sIChlcnIsIGluZm8pID0+XG4gICAgICAgIEBkZWJ1ZygndGVtcEZpbGUnLCBuYW1lLCBlcnIsIGluZm8pXG4gICAgICAgIHJldHVybiByZWplY3QoZXJyKSBpZiBlcnJcbiAgICAgICAgZnMud3JpdGUoaW5mby5mZCwgY29udGVudHMsIChlcnIpIC0+XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpIGlmIGVyclxuICAgICAgICAgIGZzLmNsb3NlKGluZm8uZmQsIChlcnIpIC0+XG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycikgaWYgZXJyXG4gICAgICAgICAgICByZXNvbHZlKGluZm8ucGF0aClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbiAgIyMjXG4gIFJlYWQgZmlsZVxuICAjIyNcbiAgcmVhZEZpbGU6IChmaWxlUGF0aCkgLT5cbiAgICBQcm9taXNlLnJlc29sdmUoZmlsZVBhdGgpXG4gICAgLnRoZW4oKGZpbGVQYXRoKSAtPlxuICAgICAgcmV0dXJuIHJlYWRGaWxlKGZpbGVQYXRoLCBcInV0ZjhcIilcbiAgICApXG5cbiAgIyMjXG4gIEZpbmQgZmlsZVxuICAjIyNcbiAgZmluZEZpbGU6IChzdGFydERpciwgZmlsZU5hbWVzKSAtPlxuICAgIHRocm93IG5ldyBFcnJvciBcIlNwZWNpZnkgZmlsZSBuYW1lcyB0byBmaW5kLlwiIHVubGVzcyBhcmd1bWVudHMubGVuZ3RoXG4gICAgdW5sZXNzIGZpbGVOYW1lcyBpbnN0YW5jZW9mIEFycmF5XG4gICAgICBmaWxlTmFtZXMgPSBbZmlsZU5hbWVzXVxuICAgIHN0YXJ0RGlyID0gc3RhcnREaXIuc3BsaXQocGF0aC5zZXApXG4gICAgd2hpbGUgc3RhcnREaXIubGVuZ3RoXG4gICAgICBjdXJyZW50RGlyID0gc3RhcnREaXIuam9pbihwYXRoLnNlcClcbiAgICAgIGZvciBmaWxlTmFtZSBpbiBmaWxlTmFtZXNcbiAgICAgICAgZmlsZVBhdGggPSBwYXRoLmpvaW4oY3VycmVudERpciwgZmlsZU5hbWUpXG4gICAgICAgIHRyeVxuICAgICAgICAgIGZzLmFjY2Vzc1N5bmMoZmlsZVBhdGgsIGZzLlJfT0spXG4gICAgICAgICAgcmV0dXJuIGZpbGVQYXRoXG4gICAgICBzdGFydERpci5wb3AoKVxuICAgIHJldHVybiBudWxsXG5cbiAgIyMjXG4gIElmIHBsYXRmb3JtIGlzIFdpbmRvd3NcbiAgIyMjXG4gIGlzV2luZG93czogZG8gLT5cbiAgICByZXR1cm4gbmV3IFJlZ0V4cCgnXndpbicpLnRlc3QocHJvY2Vzcy5wbGF0Zm9ybSlcblxuICAjIyNcbiAgR2V0IFNoZWxsIEVudmlyb25tZW50IHZhcmlhYmxlc1xuXG4gIFNwZWNpYWwgdGhhbmsgeW91IHRvIEBpb3F1YXRpeFxuICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2lvcXVhdGl4L3NjcmlwdC1ydW5uZXIvYmxvYi92MS41LjAvbGliL3NjcmlwdC1ydW5uZXIuY29mZmVlI0w0NS1MNjNcbiAgIyMjXG4gIF9lbnZDYWNoZTogbnVsbFxuICBfZW52Q2FjaGVEYXRlOiBudWxsXG4gIF9lbnZDYWNoZUV4cGlyeTogMTAwMDAgIyAxMCBzZWNvbmRzXG4gIGdldFNoZWxsRW52aXJvbm1lbnQ6IC0+XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICAjIENoZWNrIENhY2hlXG4gICAgICBpZiBAX2VudkNhY2hlPyBhbmQgQF9lbnZDYWNoZURhdGU/XG4gICAgICAgICMgQ2hlY2sgaWYgQ2FjaGUgaXMgb2xkXG4gICAgICAgIGlmIChuZXcgRGF0ZSgpIC0gQF9lbnZDYWNoZURhdGUpIDwgQF9lbnZDYWNoZUV4cGlyeVxuICAgICAgICAgICMgU3RpbGwgZnJlc2hcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShAX2VudkNhY2hlKVxuXG4gICAgICAjIENoZWNrIGlmIFdpbmRvd3NcbiAgICAgIGlmIEBpc1dpbmRvd3NcbiAgICAgICAgIyBXaW5kb3dzXG4gICAgICAgICMgVXNlIGRlZmF1bHRcbiAgICAgICAgcmVzb2x2ZShwcm9jZXNzLmVudilcbiAgICAgIGVsc2VcbiAgICAgICAgIyBNYWMgJiBMaW51eFxuICAgICAgICAjIEkgdHJpZWQgdXNpbmcgQ2hpbGRQcm9jZXNzLmV4ZWNGaWxlIGJ1dCB0aGVyZSBpcyBubyB3YXkgdG8gc2V0IGRldGFjaGVkIGFuZFxuICAgICAgICAjIHRoaXMgY2F1c2VzIHRoZSBjaGlsZCBzaGVsbCB0byBsb2NrIHVwLlxuICAgICAgICAjIFRoaXMgY29tbWFuZCBydW5zIGFuIGludGVyYWN0aXZlIGxvZ2luIHNoZWxsIGFuZFxuICAgICAgICAjIGV4ZWN1dGVzIHRoZSBleHBvcnQgY29tbWFuZCB0byBnZXQgYSBsaXN0IG9mIGVudmlyb25tZW50IHZhcmlhYmxlcy5cbiAgICAgICAgIyBXZSB0aGVuIHVzZSB0aGVzZSB0byBydW4gdGhlIHNjcmlwdDpcbiAgICAgICAgY2hpbGQgPSBzcGF3biBwcm9jZXNzLmVudi5TSEVMTCwgWyctaWxjJywgJ2VudiddLFxuICAgICAgICAgICMgVGhpcyBpcyBlc3NlbnRpYWwgZm9yIGludGVyYWN0aXZlIHNoZWxscywgb3RoZXJ3aXNlIGl0IG5ldmVyIGZpbmlzaGVzOlxuICAgICAgICAgIGRldGFjaGVkOiB0cnVlLFxuICAgICAgICAgICMgV2UgZG9uJ3QgY2FyZSBhYm91dCBzdGRpbiwgc3RkZXJyIGNhbiBnbyBvdXQgdGhlIHVzdWFsIHdheTpcbiAgICAgICAgICBzdGRpbzogWydpZ25vcmUnLCAncGlwZScsIHByb2Nlc3Muc3RkZXJyXVxuICAgICAgICAjIFdlIGJ1ZmZlciBzdGRvdXQ6XG4gICAgICAgIGJ1ZmZlciA9ICcnXG4gICAgICAgIGNoaWxkLnN0ZG91dC5vbiAnZGF0YScsIChkYXRhKSAtPiBidWZmZXIgKz0gZGF0YVxuICAgICAgICAjIFdoZW4gdGhlIHByb2Nlc3MgZmluaXNoZXMsIGV4dHJhY3QgdGhlIGVudmlyb25tZW50IHZhcmlhYmxlcyBhbmQgcGFzcyB0aGVtIHRvIHRoZSBjYWxsYmFjazpcbiAgICAgICAgY2hpbGQub24gJ2Nsb3NlJywgKGNvZGUsIHNpZ25hbCkgPT5cbiAgICAgICAgICBpZiBjb2RlIGlzbnQgMFxuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJDb3VsZCBub3QgZ2V0IFNoZWxsIEVudmlyb25tZW50LiBFeGl0IGNvZGU6IFwiK2NvZGUrXCIsIFNpZ25hbDogXCIrc2lnbmFsKSlcbiAgICAgICAgICBlbnZpcm9ubWVudCA9IHt9XG4gICAgICAgICAgZm9yIGRlZmluaXRpb24gaW4gYnVmZmVyLnNwbGl0KCdcXG4nKVxuICAgICAgICAgICAgW2tleSwgdmFsdWVdID0gZGVmaW5pdGlvbi5zcGxpdCgnPScsIDIpXG4gICAgICAgICAgICBlbnZpcm9ubWVudFtrZXldID0gdmFsdWUgaWYga2V5ICE9ICcnXG4gICAgICAgICAgIyBDYWNoZSBFbnZpcm9ubWVudFxuICAgICAgICAgIEBfZW52Q2FjaGUgPSBlbnZpcm9ubWVudFxuICAgICAgICAgIEBfZW52Q2FjaGVEYXRlID0gbmV3IERhdGUoKVxuICAgICAgICAgIHJlc29sdmUoZW52aXJvbm1lbnQpXG4gICAgICApXG5cbiAgIyMjXG4gIExpa2UgdGhlIHVuaXggd2hpY2ggdXRpbGl0eS5cblxuICBGaW5kcyB0aGUgZmlyc3QgaW5zdGFuY2Ugb2YgYSBzcGVjaWZpZWQgZXhlY3V0YWJsZSBpbiB0aGUgUEFUSCBlbnZpcm9ubWVudCB2YXJpYWJsZS5cbiAgRG9lcyBub3QgY2FjaGUgdGhlIHJlc3VsdHMsXG4gIHNvIGhhc2ggLXIgaXMgbm90IG5lZWRlZCB3aGVuIHRoZSBQQVRIIGNoYW5nZXMuXG4gIFNlZSBodHRwczovL2dpdGh1Yi5jb20vaXNhYWNzL25vZGUtd2hpY2hcbiAgIyMjXG4gIHdoaWNoOiAoZXhlLCBvcHRpb25zID0ge30pIC0+XG4gICAgIyBHZXQgUEFUSCBhbmQgb3RoZXIgZW52aXJvbm1lbnQgdmFyaWFibGVzXG4gICAgQGdldFNoZWxsRW52aXJvbm1lbnQoKVxuICAgIC50aGVuKChlbnYpID0+XG4gICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgICBvcHRpb25zLnBhdGggPz0gZW52LlBBVEhcbiAgICAgICAgaWYgQGlzV2luZG93c1xuICAgICAgICAgICMgRW52aXJvbm1lbnQgdmFyaWFibGVzIGFyZSBjYXNlLWluc2Vuc2l0aXZlIGluIHdpbmRvd3NcbiAgICAgICAgICAjIENoZWNrIGVudiBmb3IgYSBjYXNlLWluc2Vuc2l0aXZlICdwYXRoJyB2YXJpYWJsZVxuICAgICAgICAgIGlmICFvcHRpb25zLnBhdGhcbiAgICAgICAgICAgIGZvciBpIG9mIGVudlxuICAgICAgICAgICAgICBpZiBpLnRvTG93ZXJDYXNlKCkgaXMgXCJwYXRoXCJcbiAgICAgICAgICAgICAgICBvcHRpb25zLnBhdGggPSBlbnZbaV1cbiAgICAgICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgIyBUcmljayBub2RlLXdoaWNoIGludG8gaW5jbHVkaW5nIGZpbGVzXG4gICAgICAgICAgIyB3aXRoIG5vIGV4dGVuc2lvbiBhcyBleGVjdXRhYmxlcy5cbiAgICAgICAgICAjIFB1dCBlbXB0eSBleHRlbnNpb24gbGFzdCB0byBhbGxvdyBmb3Igb3RoZXIgcmVhbCBleHRlbnNpb25zIGZpcnN0XG4gICAgICAgICAgb3B0aW9ucy5wYXRoRXh0ID89IFwiI3twcm9jZXNzLmVudi5QQVRIRVhUID8gJy5FWEUnfTtcIlxuICAgICAgICB3aGljaChleGUsIG9wdGlvbnMsIChlcnIsIHBhdGgpIC0+XG4gICAgICAgICAgcmVzb2x2ZShleGUpIGlmIGVyclxuICAgICAgICAgIHJlc29sdmUocGF0aClcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxuICAjIyNcbiAgQWRkIGhlbHAgdG8gZXJyb3IuZGVzY3JpcHRpb25cblxuICBOb3RlOiBlcnJvci5kZXNjcmlwdGlvbiBpcyBub3Qgb2ZmaWNpYWxseSB1c2VkIGluIEphdmFTY3JpcHQsXG4gIGhvd2V2ZXIgaXQgaXMgdXNlZCBpbnRlcm5hbGx5IGZvciBBdG9tIEJlYXV0aWZ5IHdoZW4gZGlzcGxheWluZyBlcnJvcnMuXG4gICMjI1xuICBjb21tYW5kTm90Rm91bmRFcnJvcjogKGV4ZSwgaGVscCkgLT5cbiAgICAjIENyZWF0ZSBuZXcgaW1wcm92ZWQgZXJyb3JcbiAgICAjIG5vdGlmeSB1c2VyIHRoYXQgaXQgbWF5IG5vdCBiZVxuICAgICMgaW5zdGFsbGVkIG9yIGluIHBhdGhcbiAgICBtZXNzYWdlID0gXCJDb3VsZCBub3QgZmluZCAnI3tleGV9Jy4gXFxcbiAgICAgICAgICAgIFRoZSBwcm9ncmFtIG1heSBub3QgYmUgaW5zdGFsbGVkLlwiXG4gICAgZXIgPSBuZXcgRXJyb3IobWVzc2FnZSlcbiAgICBlci5jb2RlID0gJ0NvbW1hbmROb3RGb3VuZCdcbiAgICBlci5lcnJubyA9IGVyLmNvZGVcbiAgICBlci5zeXNjYWxsID0gJ2JlYXV0aWZpZXI6OnJ1bidcbiAgICBlci5maWxlID0gZXhlXG4gICAgaWYgaGVscD9cbiAgICAgIGlmIHR5cGVvZiBoZWxwIGlzIFwib2JqZWN0XCJcbiAgICAgICAgIyBCYXNpYyBub3RpY2VcbiAgICAgICAgaGVscFN0ciA9IFwiU2VlICN7aGVscC5saW5rfSBmb3IgcHJvZ3JhbSBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbGxhdGlvbiBpbnN0cnVjdGlvbnMuXFxuXCJcbiAgICAgICAgIyBIZWxwIHRvIGNvbmZpZ3VyZSBBdG9tIEJlYXV0aWZ5IGZvciBwcm9ncmFtJ3MgcGF0aFxuICAgICAgICBoZWxwU3RyICs9IFwiWW91IGNhbiBjb25maWd1cmUgQXRvbSBCZWF1dGlmeSBcXFxuICAgICAgICAgICAgICAgICAgICB3aXRoIHRoZSBhYnNvbHV0ZSBwYXRoIFxcXG4gICAgICAgICAgICAgICAgICAgIHRvICcje2hlbHAucHJvZ3JhbSBvciBleGV9JyBieSBzZXR0aW5nIFxcXG4gICAgICAgICAgICAgICAgICAgICcje2hlbHAucGF0aE9wdGlvbn0nIGluIFxcXG4gICAgICAgICAgICAgICAgICAgIHRoZSBBdG9tIEJlYXV0aWZ5IHBhY2thZ2Ugc2V0dGluZ3MuXFxuXCIgaWYgaGVscC5wYXRoT3B0aW9uXG4gICAgICAgICMgT3B0aW9uYWwsIGFkZGl0aW9uYWwgaGVscFxuICAgICAgICBoZWxwU3RyICs9IGhlbHAuYWRkaXRpb25hbCBpZiBoZWxwLmFkZGl0aW9uYWxcbiAgICAgICAgIyBDb21tb24gSGVscFxuICAgICAgICBpc3N1ZVNlYXJjaExpbmsgPVxuICAgICAgICAgIFwiaHR0cHM6Ly9naXRodWIuY29tL0dsYXZpbjAwMS9hdG9tLWJlYXV0aWZ5L1xcXG4gICAgICAgICAgICAgICAgICBzZWFyY2g/cT0je2V4ZX0mdHlwZT1Jc3N1ZXNcIlxuICAgICAgICBkb2NzTGluayA9IFwiaHR0cHM6Ly9naXRodWIuY29tL0dsYXZpbjAwMS9cXFxuICAgICAgICAgICAgICAgICAgYXRvbS1iZWF1dGlmeS90cmVlL21hc3Rlci9kb2NzXCJcbiAgICAgICAgaGVscFN0ciArPSBcIllvdXIgcHJvZ3JhbSBpcyBwcm9wZXJseSBpbnN0YWxsZWQgaWYgcnVubmluZyBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcje2lmIEBpc1dpbmRvd3MgdGhlbiAnd2hlcmUuZXhlJyBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgJ3doaWNoJ30gI3tleGV9JyBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluIHlvdXIgI3tpZiBAaXNXaW5kb3dzIHRoZW4gJ0NNRCBwcm9tcHQnIFxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSAnVGVybWluYWwnfSBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybnMgYW4gYWJzb2x1dGUgcGF0aCB0byB0aGUgZXhlY3V0YWJsZS4gXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJZiB0aGlzIGRvZXMgbm90IHdvcmsgdGhlbiB5b3UgaGF2ZSBub3QgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0YWxsZWQgdGhlIHByb2dyYW0gY29ycmVjdGx5IGFuZCBzbyBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEF0b20gQmVhdXRpZnkgd2lsbCBub3QgZmluZCB0aGUgcHJvZ3JhbS4gXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBdG9tIEJlYXV0aWZ5IHJlcXVpcmVzIHRoYXQgdGhlIHByb2dyYW0gYmUgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCBpbiB5b3VyIFBBVEggZW52aXJvbm1lbnQgdmFyaWFibGUuIFxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTm90ZSB0aGF0IHRoaXMgaXMgbm90IGFuIEF0b20gQmVhdXRpZnkgaXNzdWUgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBiZWF1dGlmaWNhdGlvbiBkb2VzIG5vdCB3b3JrIGFuZCB0aGUgYWJvdmUgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kIGFsc28gZG9lcyBub3Qgd29yazogdGhpcyBpcyBleHBlY3RlZCBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlaGF2aW91ciwgc2luY2UgeW91IGhhdmUgbm90IHByb3Blcmx5IGluc3RhbGxlZCBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlvdXIgcHJvZ3JhbS4gUGxlYXNlIHByb3Blcmx5IHNldHVwIHRoZSBwcm9ncmFtIFxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIHNlYXJjaCB0aHJvdWdoIGV4aXN0aW5nIEF0b20gQmVhdXRpZnkgaXNzdWVzIFxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVmb3JlIGNyZWF0aW5nIGEgbmV3IGlzc3VlLiBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlZSAje2lzc3VlU2VhcmNoTGlua30gZm9yIHJlbGF0ZWQgSXNzdWVzIGFuZCBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICN7ZG9jc0xpbmt9IGZvciBkb2N1bWVudGF0aW9uLiBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIElmIHlvdSBhcmUgc3RpbGwgdW5hYmxlIHRvIHJlc29sdmUgdGhpcyBpc3N1ZSBvbiBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlvdXIgb3duIHRoZW4gcGxlYXNlIGNyZWF0ZSBhIG5ldyBpc3N1ZSBhbmQgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc2sgZm9yIGhlbHAuXFxuXCJcbiAgICAgICAgZXIuZGVzY3JpcHRpb24gPSBoZWxwU3RyXG4gICAgICBlbHNlICNpZiB0eXBlb2YgaGVscCBpcyBcInN0cmluZ1wiXG4gICAgICAgIGVyLmRlc2NyaXB0aW9uID0gaGVscFxuICAgIHJldHVybiBlclxuXG4gICMjI1xuICBSdW4gY29tbWFuZC1saW5lIGludGVyZmFjZSBjb21tYW5kXG4gICMjI1xuICBydW46IChleGVjdXRhYmxlLCBhcmdzLCB7Y3dkLCBpZ25vcmVSZXR1cm5Db2RlLCBoZWxwLCBvblN0ZGlufSA9IHt9KSAtPlxuICAgICMgRmxhdHRlbiBhcmdzIGZpcnN0XG4gICAgYXJncyA9IF8uZmxhdHRlbihhcmdzKVxuXG4gICAgIyBSZXNvbHZlIGV4ZWN1dGFibGUgYW5kIGFsbCBhcmdzXG4gICAgUHJvbWlzZS5hbGwoW2V4ZWN1dGFibGUsIFByb21pc2UuYWxsKGFyZ3MpXSlcbiAgICAgIC50aGVuKChbZXhlTmFtZSwgYXJnc10pID0+XG4gICAgICAgIEBkZWJ1ZygnZXhlTmFtZSwgYXJnczonLCBleGVOYW1lLCBhcmdzKVxuXG4gICAgICAgICMgR2V0IFBBVEggYW5kIG90aGVyIGVudmlyb25tZW50IHZhcmlhYmxlc1xuICAgICAgICBQcm9taXNlLmFsbChbZXhlTmFtZSwgYXJncywgQGdldFNoZWxsRW52aXJvbm1lbnQoKSwgQHdoaWNoKGV4ZU5hbWUpXSlcbiAgICAgIClcbiAgICAgIC50aGVuKChbZXhlTmFtZSwgYXJncywgZW52LCBleGVQYXRoXSkgPT5cbiAgICAgICAgQGRlYnVnKCdleGVQYXRoLCBlbnY6JywgZXhlUGF0aCwgZW52KVxuICAgICAgICBAZGVidWcoJ2FyZ3MnLCBhcmdzKVxuXG4gICAgICAgIGV4ZSA9IGV4ZVBhdGggPyBleGVOYW1lXG4gICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgY3dkOiBjd2RcbiAgICAgICAgICBlbnY6IGVudlxuICAgICAgICB9XG5cbiAgICAgICAgQHNwYXduKGV4ZSwgYXJncywgb3B0aW9ucywgb25TdGRpbilcbiAgICAgICAgICAudGhlbigoe3JldHVybkNvZGUsIHN0ZG91dCwgc3RkZXJyfSkgPT5cbiAgICAgICAgICAgIEB2ZXJib3NlKCdzcGF3biByZXN1bHQnLCByZXR1cm5Db2RlLCBzdGRvdXQsIHN0ZGVycilcblxuICAgICAgICAgICAgIyBJZiByZXR1cm4gY29kZSBpcyBub3QgMCB0aGVuIGVycm9yIG9jY3VyZWRcbiAgICAgICAgICAgIGlmIG5vdCBpZ25vcmVSZXR1cm5Db2RlIGFuZCByZXR1cm5Db2RlIGlzbnQgMFxuICAgICAgICAgICAgICAjIG9wZXJhYmxlIHByb2dyYW0gb3IgYmF0Y2ggZmlsZVxuICAgICAgICAgICAgICB3aW5kb3dzUHJvZ3JhbU5vdEZvdW5kTXNnID0gXCJpcyBub3QgcmVjb2duaXplZCBhcyBhbiBpbnRlcm5hbCBvciBleHRlcm5hbCBjb21tYW5kXCJcblxuICAgICAgICAgICAgICBAdmVyYm9zZShzdGRlcnIsIHdpbmRvd3NQcm9ncmFtTm90Rm91bmRNc2cpXG5cbiAgICAgICAgICAgICAgaWYgQGlzV2luZG93cyBhbmQgcmV0dXJuQ29kZSBpcyAxIGFuZCBzdGRlcnIuaW5kZXhPZih3aW5kb3dzUHJvZ3JhbU5vdEZvdW5kTXNnKSBpc250IC0xXG4gICAgICAgICAgICAgICAgdGhyb3cgQGNvbW1hbmROb3RGb3VuZEVycm9yKGV4ZU5hbWUsIGhlbHApXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RkZXJyKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBzdGRvdXRcbiAgICAgICAgICApXG4gICAgICAgICAgLmNhdGNoKChlcnIpID0+XG4gICAgICAgICAgICBAZGVidWcoJ2Vycm9yJywgZXJyKVxuXG4gICAgICAgICAgICAjIENoZWNrIGlmIGVycm9yIGlzIEVOT0VOVCAoY29tbWFuZCBjb3VsZCBub3QgYmUgZm91bmQpXG4gICAgICAgICAgICBpZiBlcnIuY29kZSBpcyAnRU5PRU5UJyBvciBlcnIuZXJybm8gaXMgJ0VOT0VOVCdcbiAgICAgICAgICAgICAgdGhyb3cgQGNvbW1hbmROb3RGb3VuZEVycm9yKGV4ZU5hbWUsIGhlbHApXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICMgY29udGludWUgYXMgbm9ybWFsIGVycm9yXG4gICAgICAgICAgICAgIHRocm93IGVyclxuICAgICAgICAgIClcbiAgICAgIClcblxuICAjIyNcbiAgU3Bhd25cbiAgIyMjXG4gIHNwYXduOiAoZXhlLCBhcmdzLCBvcHRpb25zLCBvblN0ZGluKSAtPlxuICAgICMgUmVtb3ZlIHVuZGVmaW5lZC9udWxsIHZhbHVlc1xuICAgIGFyZ3MgPSBfLndpdGhvdXQoYXJncywgdW5kZWZpbmVkKVxuICAgIGFyZ3MgPSBfLndpdGhvdXQoYXJncywgbnVsbClcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgQGRlYnVnKCdzcGF3bicsIGV4ZSwgYXJncylcblxuICAgICAgY21kID0gc3Bhd24oZXhlLCBhcmdzLCBvcHRpb25zKVxuICAgICAgc3Rkb3V0ID0gXCJcIlxuICAgICAgc3RkZXJyID0gXCJcIlxuXG4gICAgICBjbWQuc3Rkb3V0Lm9uKCdkYXRhJywgKGRhdGEpIC0+XG4gICAgICAgIHN0ZG91dCArPSBkYXRhXG4gICAgICApXG4gICAgICBjbWQuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpIC0+XG4gICAgICAgIHN0ZGVyciArPSBkYXRhXG4gICAgICApXG4gICAgICBjbWQub24oJ2Nsb3NlJywgKHJldHVybkNvZGUpID0+XG4gICAgICAgIEBkZWJ1Zygnc3Bhd24gZG9uZScsIHJldHVybkNvZGUsIHN0ZGVyciwgc3Rkb3V0KVxuICAgICAgICByZXNvbHZlKHtyZXR1cm5Db2RlLCBzdGRvdXQsIHN0ZGVycn0pXG4gICAgICApXG4gICAgICBjbWQub24oJ2Vycm9yJywgKGVycikgPT5cbiAgICAgICAgQGRlYnVnKCdlcnJvcicsIGVycilcbiAgICAgICAgcmVqZWN0KGVycilcbiAgICAgIClcblxuICAgICAgb25TdGRpbiBjbWQuc3RkaW4gaWYgb25TdGRpblxuICAgIClcblxuICAjIyNcbiAgTG9nZ2VyIGluc3RhbmNlXG4gICMjI1xuICBsb2dnZXI6IG51bGxcbiAgIyMjXG4gIEluaXRpYWxpemUgYW5kIGNvbmZpZ3VyZSBMb2dnZXJcbiAgIyMjXG4gIHNldHVwTG9nZ2VyOiAtPlxuICAgIEBsb2dnZXIgPSByZXF1aXJlKCcuLi9sb2dnZXInKShfX2ZpbGVuYW1lKVxuICAgICMgQHZlcmJvc2UoQGxvZ2dlcilcbiAgICAjIE1lcmdlIGxvZ2dlciBtZXRob2RzIGludG8gYmVhdXRpZmllciBjbGFzc1xuICAgIGZvciBrZXksIG1ldGhvZCBvZiBAbG9nZ2VyXG4gICAgICAjIEB2ZXJib3NlKGtleSwgbWV0aG9kKVxuICAgICAgQFtrZXldID0gbWV0aG9kXG4gICAgQHZlcmJvc2UoXCIje0BuYW1lfSBiZWF1dGlmaWVyIGxvZ2dlciBoYXMgYmVlbiBpbml0aWFsaXplZC5cIilcblxuICAjIyNcbiAgQ29uc3RydWN0b3IgdG8gc2V0dXAgYmVhdXRpZmVyXG4gICMjI1xuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAjIFNldHVwIGxvZ2dlclxuICAgIEBzZXR1cExvZ2dlcigpXG4gICAgIyBIYW5kbGUgZ2xvYmFsIG9wdGlvbnNcbiAgICBpZiBAb3B0aW9ucy5fP1xuICAgICAgZ2xvYmFsT3B0aW9ucyA9IEBvcHRpb25zLl9cbiAgICAgIGRlbGV0ZSBAb3B0aW9ucy5fXG4gICAgICAjIE9ubHkgbWVyZ2UgaWYgZ2xvYmFsT3B0aW9ucyBpcyBhbiBvYmplY3RcbiAgICAgIGlmIHR5cGVvZiBnbG9iYWxPcHRpb25zIGlzIFwib2JqZWN0XCJcbiAgICAgICAgIyBJdGVyYXRlIG92ZXIgYWxsIHN1cHBvcnRlZCBsYW5ndWFnZXNcbiAgICAgICAgZm9yIGxhbmcsIG9wdGlvbnMgb2YgQG9wdGlvbnNcbiAgICAgICAgICAjXG4gICAgICAgICAgaWYgdHlwZW9mIG9wdGlvbnMgaXMgXCJib29sZWFuXCJcbiAgICAgICAgICAgIGlmIG9wdGlvbnMgaXMgdHJ1ZVxuICAgICAgICAgICAgICBAb3B0aW9uc1tsYW5nXSA9IGdsb2JhbE9wdGlvbnNcbiAgICAgICAgICBlbHNlIGlmIHR5cGVvZiBvcHRpb25zIGlzIFwib2JqZWN0XCJcbiAgICAgICAgICAgIEBvcHRpb25zW2xhbmddID0gXy5tZXJnZShnbG9iYWxPcHRpb25zLCBvcHRpb25zKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIEB3YXJuKFwiVW5zdXBwb3J0ZWQgb3B0aW9ucyB0eXBlICN7dHlwZW9mIG9wdGlvbnN9IGZvciBsYW5ndWFnZSAje2xhbmd9OiBcIisgb3B0aW9ucylcbiAgICBAdmVyYm9zZShcIk9wdGlvbnMgZm9yICN7QG5hbWV9OlwiLCBAb3B0aW9ucylcbiAgICAjIFNldCBzdXBwb3J0ZWQgbGFuZ3VhZ2VzXG4gICAgQGxhbmd1YWdlcyA9IF8ua2V5cyhAb3B0aW9ucylcbiJdfQ==
