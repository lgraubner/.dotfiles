(function() {
  var GitRepository, Minimatch, PathLoader, PathsChunkSize, async, fs, path,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  async = require('async');

  fs = require('fs');

  path = require('path');

  GitRepository = require('atom').GitRepository;

  Minimatch = require('minimatch').Minimatch;

  PathsChunkSize = 100;

  PathLoader = (function() {
    function PathLoader(rootPath1, config) {
      var ignoreVcsIgnores, repo;
      this.rootPath = rootPath1;
      this.timestamp = config.timestamp, this.sourceNames = config.sourceNames, ignoreVcsIgnores = config.ignoreVcsIgnores, this.traverseSymlinkDirectories = config.traverseSymlinkDirectories, this.ignoredNames = config.ignoredNames, this.knownPaths = config.knownPaths;
      if (this.knownPaths == null) {
        this.knownPaths = [];
      }
      this.paths = [];
      this.lostPaths = [];
      this.scannedPaths = [];
      this.repo = null;
      if (ignoreVcsIgnores) {
        repo = GitRepository.open(this.rootPath, {
          refreshOnWindowFocus: false
        });
        if ((repo != null ? repo.relativize(path.join(this.rootPath, 'test')) : void 0) === 'test') {
          this.repo = repo;
        }
      }
    }

    PathLoader.prototype.load = function(done) {
      return this.loadPath(this.rootPath, (function(_this) {
        return function() {
          var i, len, p, ref, ref1;
          ref = _this.knownPaths;
          for (i = 0, len = ref.length; i < len; i++) {
            p = ref[i];
            if (indexOf.call(_this.scannedPaths, p) < 0 && p.indexOf(_this.rootPath) === 0) {
              _this.lostPaths.push(p);
            }
          }
          _this.flushPaths();
          if ((ref1 = _this.repo) != null) {
            ref1.destroy();
          }
          return done();
        };
      })(this));
    };

    PathLoader.prototype.isSource = function(loadedPath) {
      var i, len, ref, relativePath, sourceName;
      relativePath = path.relative(this.rootPath, loadedPath);
      ref = this.sourceNames;
      for (i = 0, len = ref.length; i < len; i++) {
        sourceName = ref[i];
        if (sourceName.match(relativePath)) {
          return true;
        }
      }
    };

    PathLoader.prototype.isIgnored = function(loadedPath, stats) {
      var i, ignoredName, len, ref, ref1, relativePath;
      relativePath = path.relative(this.rootPath, loadedPath);
      if ((ref = this.repo) != null ? ref.isPathIgnored(relativePath) : void 0) {
        return true;
      } else {
        ref1 = this.ignoredNames;
        for (i = 0, len = ref1.length; i < len; i++) {
          ignoredName = ref1[i];
          if (ignoredName.match(relativePath)) {
            return true;
          }
        }
        return false;
      }
    };

    PathLoader.prototype.isKnown = function(loadedPath) {
      return indexOf.call(this.knownPaths, loadedPath) >= 0;
    };

    PathLoader.prototype.hasChanged = function(loadedPath, stats) {
      if (stats && (this.timestamp != null)) {
        return stats.ctime >= this.timestamp;
      } else {
        return false;
      }
    };

    PathLoader.prototype.pathLoaded = function(loadedPath, stats, done) {
      this.scannedPaths.push(loadedPath);
      if (this.isSource(loadedPath) && !this.isIgnored(loadedPath, stats)) {
        if (this.isKnown(loadedPath)) {
          if (this.hasChanged(loadedPath, stats)) {
            this.paths.push(loadedPath);
          }
        } else {
          this.paths.push(loadedPath);
        }
      } else {
        if (indexOf.call(this.knownPaths, loadedPath) >= 0) {
          this.lostPaths.push(loadedPath);
        }
      }
      if (this.paths.length + this.lostPaths.length === PathsChunkSize) {
        this.flushPaths();
      }
      return done();
    };

    PathLoader.prototype.flushPaths = function() {
      if (this.paths.length) {
        emit('load-paths:paths-found', this.paths);
      }
      if (this.lostPaths.length) {
        emit('load-paths:paths-lost', this.lostPaths);
      }
      this.paths = [];
      return this.lostPaths = [];
    };

    PathLoader.prototype.loadPath = function(pathToLoad, done) {
      if (this.isIgnored(pathToLoad)) {
        return done();
      }
      return fs.lstat(pathToLoad, (function(_this) {
        return function(error, stats) {
          if (error != null) {
            return done();
          }
          if (stats.isSymbolicLink()) {
            return fs.stat(pathToLoad, function(error, stats) {
              if (error != null) {
                return done();
              }
              if (stats.isFile()) {
                return _this.pathLoaded(pathToLoad, stats, done);
              } else if (stats.isDirectory()) {
                if (_this.traverseSymlinkDirectories) {
                  return _this.loadFolder(pathToLoad, done);
                } else {
                  return done();
                }
              }
            });
          } else if (stats.isDirectory()) {
            return _this.loadFolder(pathToLoad, done);
          } else if (stats.isFile()) {
            return _this.pathLoaded(pathToLoad, stats, done);
          } else {
            return done();
          }
        };
      })(this));
    };

    PathLoader.prototype.loadFolder = function(folderPath, done) {
      return fs.readdir(folderPath, (function(_this) {
        return function(error, children) {
          if (children == null) {
            children = [];
          }
          return async.each(children, function(childName, next) {
            return _this.loadPath(path.join(folderPath, childName), next);
          }, done);
        };
      })(this));
    };

    return PathLoader;

  })();

  module.exports = function(config) {
    var error, i, ignore, j, len, len1, newConf, ref, ref1, source;
    newConf = {
      ignoreVcsIgnores: config.ignoreVcsIgnores,
      traverseSymlinkDirectories: config.traverseSymlinkDirectories,
      knownPaths: config.knownPaths,
      ignoredNames: [],
      sourceNames: []
    };
    if (config.timestamp != null) {
      newConf.timestamp = new Date(Date.parse(config.timestamp));
    }
    ref = config.sourceNames;
    for (i = 0, len = ref.length; i < len; i++) {
      source = ref[i];
      if (source) {
        try {
          newConf.sourceNames.push(new Minimatch(source, {
            matchBase: true,
            dot: true
          }));
        } catch (error1) {
          error = error1;
          console.warn("Error parsing source pattern (" + source + "): " + error.message);
        }
      }
    }
    ref1 = config.ignoredNames;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      ignore = ref1[j];
      if (ignore) {
        try {
          newConf.ignoredNames.push(new Minimatch(ignore, {
            matchBase: true,
            dot: true
          }));
        } catch (error1) {
          error = error1;
          console.warn("Error parsing ignore pattern (" + ignore + "): " + error.message);
        }
      }
    }
    return async.each(config.paths, function(rootPath, next) {
      return new PathLoader(rootPath, newConf).load(next);
    }, this.async());
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3Rhc2tzL2xvYWQtcGF0aHMtaGFuZGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHFFQUFBO0lBQUE7O0VBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztFQUNSLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ04sZ0JBQWlCLE9BQUEsQ0FBUSxNQUFSOztFQUNqQixZQUFhLE9BQUEsQ0FBUSxXQUFSOztFQUVkLGNBQUEsR0FBaUI7O0VBRVg7SUFDVSxvQkFBQyxTQUFELEVBQVksTUFBWjtBQUNaLFVBQUE7TUFEYSxJQUFDLENBQUEsV0FBRDtNQUNaLElBQUMsQ0FBQSxtQkFBQSxTQUFGLEVBQWEsSUFBQyxDQUFBLHFCQUFBLFdBQWQsRUFBMkIsMENBQTNCLEVBQTZDLElBQUMsQ0FBQSxvQ0FBQSwwQkFBOUMsRUFBMEUsSUFBQyxDQUFBLHNCQUFBLFlBQTNFLEVBQXlGLElBQUMsQ0FBQSxvQkFBQTs7UUFFMUYsSUFBQyxDQUFBLGFBQWM7O01BQ2YsSUFBQyxDQUFBLEtBQUQsR0FBUztNQUNULElBQUMsQ0FBQSxTQUFELEdBQWE7TUFDYixJQUFDLENBQUEsWUFBRCxHQUFnQjtNQUVoQixJQUFDLENBQUEsSUFBRCxHQUFRO01BQ1IsSUFBRyxnQkFBSDtRQUNFLElBQUEsR0FBTyxhQUFhLENBQUMsSUFBZCxDQUFtQixJQUFDLENBQUEsUUFBcEIsRUFBOEI7VUFBQSxvQkFBQSxFQUFzQixLQUF0QjtTQUE5QjtRQUNQLG9CQUFnQixJQUFJLENBQUUsVUFBTixDQUFpQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUMsQ0FBQSxRQUFYLEVBQXFCLE1BQXJCLENBQWpCLFdBQUEsS0FBa0QsTUFB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O1lBQUEsU0FBQSxFQUFXLElBQVg7WUFBaUIsR0FBQSxFQUFLLElBQXRCO1dBQWxCLENBQTdCLEVBREY7U0FBQSxjQUFBO1VBRU07VUFDSixPQUFPLENBQUMsSUFBUixDQUFhLGdDQUFBLEdBQWlDLE1BQWpDLEdBQXdDLEtBQXhDLEdBQTZDLEtBQUssQ0FBQyxPQUFoRSxFQUhGOzs7QUFERjtBQU1BO0FBQUEsU0FBQSx3Q0FBQTs7VUFBdUM7QUFDckM7VUFDRSxPQUFPLENBQUMsWUFBWSxDQUFDLElBQXJCLENBQThCLElBQUEsU0FBQSxDQUFVLE1BQVYsRUFBa0I7WUFBQSxTQUFBLEVBQVcsSUFBWDtZQUFpQixHQUFBLEVBQUssSUFBdEI7V0FBbEIsQ0FBOUIsRUFERjtTQUFBLGNBQUE7VUFFTTtVQUNKLE9BQU8sQ0FBQyxJQUFSLENBQWEsZ0NBQUEsR0FBaUMsTUFBakMsR0FBd0MsS0FBeEMsR0FBNkMsS0FBSyxDQUFDLE9BQWhFLEVBSEY7OztBQURGO1dBTUEsS0FBSyxDQUFDLElBQU4sQ0FDRSxNQUFNLENBQUMsS0FEVCxFQUVFLFNBQUMsUUFBRCxFQUFXLElBQVg7YUFDTSxJQUFBLFVBQUEsQ0FBVyxRQUFYLEVBQXFCLE9BQXJCLENBQTZCLENBQUMsSUFBOUIsQ0FBbUMsSUFBbkM7SUFETixDQUZGLEVBSUUsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUpGO0VBdkJlO0FBeEdqQiIsInNvdXJjZXNDb250ZW50IjpbImFzeW5jID0gcmVxdWlyZSAnYXN5bmMnXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57R2l0UmVwb3NpdG9yeX0gPSByZXF1aXJlICdhdG9tJ1xue01pbmltYXRjaH0gPSByZXF1aXJlICdtaW5pbWF0Y2gnXG5cblBhdGhzQ2h1bmtTaXplID0gMTAwXG5cbmNsYXNzIFBhdGhMb2FkZXJcbiAgY29uc3RydWN0b3I6ICAoQHJvb3RQYXRoLCBjb25maWcpIC0+XG4gICAge0B0aW1lc3RhbXAsIEBzb3VyY2VOYW1lcywgaWdub3JlVmNzSWdub3JlcywgQHRyYXZlcnNlU3ltbGlua0RpcmVjdG9yaWVzLCBAaWdub3JlZE5hbWVzLCBAa25vd25QYXRoc30gPSBjb25maWdcblxuICAgIEBrbm93blBhdGhzID89IFtdXG4gICAgQHBhdGhzID0gW11cbiAgICBAbG9zdFBhdGhzID0gW11cbiAgICBAc2Nhbm5lZFBhdGhzID0gW11cblxuICAgIEByZXBvID0gbnVsbFxuICAgIGlmIGlnbm9yZVZjc0lnbm9yZXNcbiAgICAgIHJlcG8gPSBHaXRSZXBvc2l0b3J5Lm9wZW4oQHJvb3RQYXRoLCByZWZyZXNoT25XaW5kb3dGb2N1czogZmFsc2UpXG4gICAgICBAcmVwbyA9IHJlcG8gaWYgcmVwbz8ucmVsYXRpdml6ZShwYXRoLmpvaW4oQHJvb3RQYXRoLCAndGVzdCcpKSBpcyAndGVzdCdcblxuICBsb2FkOiAoZG9uZSkgLT5cbiAgICBAbG9hZFBhdGggQHJvb3RQYXRoLCA9PlxuICAgICAgZm9yIHAgaW4gQGtub3duUGF0aHNcbiAgICAgICAgaWYgcCBub3QgaW4gQHNjYW5uZWRQYXRocyBhbmQgcC5pbmRleE9mKEByb290UGF0aCkgaXMgMFxuICAgICAgICAgIEBsb3N0UGF0aHMucHVzaChwKVxuXG4gICAgICBAZmx1c2hQYXRocygpXG4gICAgICBAcmVwbz8uZGVzdHJveSgpXG4gICAgICBkb25lKClcblxuICBpc1NvdXJjZTogKGxvYWRlZFBhdGgpIC0+XG4gICAgcmVsYXRpdmVQYXRoID0gcGF0aC5yZWxhdGl2ZShAcm9vdFBhdGgsIGxvYWRlZFBhdGgpXG4gICAgZm9yIHNvdXJjZU5hbWUgaW4gQHNvdXJjZU5hbWVzXG4gICAgICByZXR1cm4gdHJ1ZSBpZiBzb3VyY2VOYW1lLm1hdGNoKHJlbGF0aXZlUGF0aClcblxuICBpc0lnbm9yZWQ6IChsb2FkZWRQYXRoLCBzdGF0cykgLT5cbiAgICByZWxhdGl2ZVBhdGggPSBwYXRoLnJlbGF0aXZlKEByb290UGF0aCwgbG9hZGVkUGF0aClcbiAgICBpZiBAcmVwbz8uaXNQYXRoSWdub3JlZChyZWxhdGl2ZVBhdGgpXG4gICAgICB0cnVlXG4gICAgZWxzZVxuICAgICAgZm9yIGlnbm9yZWROYW1lIGluIEBpZ25vcmVkTmFtZXNcbiAgICAgICAgcmV0dXJuIHRydWUgaWYgaWdub3JlZE5hbWUubWF0Y2gocmVsYXRpdmVQYXRoKVxuXG4gICAgICByZXR1cm4gZmFsc2VcblxuICBpc0tub3duOiAobG9hZGVkUGF0aCkgLT4gbG9hZGVkUGF0aCBpbiBAa25vd25QYXRoc1xuXG4gIGhhc0NoYW5nZWQ6IChsb2FkZWRQYXRoLCBzdGF0cykgLT5cbiAgICBpZiBzdGF0cyBhbmQgQHRpbWVzdGFtcD9cbiAgICAgIHN0YXRzLmN0aW1lID49IEB0aW1lc3RhbXBcbiAgICBlbHNlXG4gICAgICBmYWxzZVxuXG4gIHBhdGhMb2FkZWQ6IChsb2FkZWRQYXRoLCBzdGF0cywgZG9uZSkgLT5cbiAgICBAc2Nhbm5lZFBhdGhzLnB1c2gobG9hZGVkUGF0aClcbiAgICBpZiBAaXNTb3VyY2UobG9hZGVkUGF0aCkgYW5kICFAaXNJZ25vcmVkKGxvYWRlZFBhdGgsIHN0YXRzKVxuICAgICAgaWYgQGlzS25vd24obG9hZGVkUGF0aClcbiAgICAgICAgQHBhdGhzLnB1c2gobG9hZGVkUGF0aCkgaWYgQGhhc0NoYW5nZWQobG9hZGVkUGF0aCwgc3RhdHMpXG4gICAgICBlbHNlXG4gICAgICAgIEBwYXRocy5wdXNoKGxvYWRlZFBhdGgpXG4gICAgZWxzZVxuICAgICAgQGxvc3RQYXRocy5wdXNoKGxvYWRlZFBhdGgpIGlmIGxvYWRlZFBhdGggaW4gQGtub3duUGF0aHNcblxuICAgIEBmbHVzaFBhdGhzKCkgaWYgQHBhdGhzLmxlbmd0aCArIEBsb3N0UGF0aHMubGVuZ3RoIGlzIFBhdGhzQ2h1bmtTaXplXG4gICAgZG9uZSgpXG5cbiAgZmx1c2hQYXRoczogLT5cbiAgICBlbWl0KCdsb2FkLXBhdGhzOnBhdGhzLWZvdW5kJywgQHBhdGhzKSBpZiBAcGF0aHMubGVuZ3RoXG4gICAgZW1pdCgnbG9hZC1wYXRoczpwYXRocy1sb3N0JywgQGxvc3RQYXRocykgaWYgQGxvc3RQYXRocy5sZW5ndGhcbiAgICBAcGF0aHMgPSBbXVxuICAgIEBsb3N0UGF0aHMgPSBbXVxuXG4gIGxvYWRQYXRoOiAocGF0aFRvTG9hZCwgZG9uZSkgLT5cbiAgICByZXR1cm4gZG9uZSgpIGlmIEBpc0lnbm9yZWQocGF0aFRvTG9hZClcbiAgICBmcy5sc3RhdCBwYXRoVG9Mb2FkLCAoZXJyb3IsIHN0YXRzKSA9PlxuICAgICAgcmV0dXJuIGRvbmUoKSBpZiBlcnJvcj9cbiAgICAgIGlmIHN0YXRzLmlzU3ltYm9saWNMaW5rKClcbiAgICAgICAgZnMuc3RhdCBwYXRoVG9Mb2FkLCAoZXJyb3IsIHN0YXRzKSA9PlxuICAgICAgICAgIHJldHVybiBkb25lKCkgaWYgZXJyb3I/XG4gICAgICAgICAgaWYgc3RhdHMuaXNGaWxlKClcbiAgICAgICAgICAgIEBwYXRoTG9hZGVkKHBhdGhUb0xvYWQsIHN0YXRzLCBkb25lKVxuICAgICAgICAgIGVsc2UgaWYgc3RhdHMuaXNEaXJlY3RvcnkoKVxuICAgICAgICAgICAgaWYgQHRyYXZlcnNlU3ltbGlua0RpcmVjdG9yaWVzXG4gICAgICAgICAgICAgIEBsb2FkRm9sZGVyKHBhdGhUb0xvYWQsIGRvbmUpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGRvbmUoKVxuICAgICAgZWxzZSBpZiBzdGF0cy5pc0RpcmVjdG9yeSgpXG4gICAgICAgIEBsb2FkRm9sZGVyKHBhdGhUb0xvYWQsIGRvbmUpXG4gICAgICBlbHNlIGlmIHN0YXRzLmlzRmlsZSgpXG4gICAgICAgIEBwYXRoTG9hZGVkKHBhdGhUb0xvYWQsIHN0YXRzLCBkb25lKVxuICAgICAgZWxzZVxuICAgICAgICBkb25lKClcblxuICBsb2FkRm9sZGVyOiAoZm9sZGVyUGF0aCwgZG9uZSkgLT5cbiAgICBmcy5yZWFkZGlyIGZvbGRlclBhdGgsIChlcnJvciwgY2hpbGRyZW49W10pID0+XG4gICAgICBhc3luYy5lYWNoKFxuICAgICAgICBjaGlsZHJlbixcbiAgICAgICAgKGNoaWxkTmFtZSwgbmV4dCkgPT5cbiAgICAgICAgICBAbG9hZFBhdGgocGF0aC5qb2luKGZvbGRlclBhdGgsIGNoaWxkTmFtZSksIG5leHQpXG4gICAgICAgIGRvbmVcbiAgICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSAoY29uZmlnKSAtPlxuICBuZXdDb25mID1cbiAgICBpZ25vcmVWY3NJZ25vcmVzOiBjb25maWcuaWdub3JlVmNzSWdub3Jlc1xuICAgIHRyYXZlcnNlU3ltbGlua0RpcmVjdG9yaWVzOiBjb25maWcudHJhdmVyc2VTeW1saW5rRGlyZWN0b3JpZXNcbiAgICBrbm93blBhdGhzOiBjb25maWcua25vd25QYXRoc1xuICAgIGlnbm9yZWROYW1lczogW11cbiAgICBzb3VyY2VOYW1lczogW11cblxuICBpZiBjb25maWcudGltZXN0YW1wP1xuICAgIG5ld0NvbmYudGltZXN0YW1wID0gbmV3IERhdGUoRGF0ZS5wYXJzZShjb25maWcudGltZXN0YW1wKSlcblxuICBmb3Igc291cmNlIGluIGNvbmZpZy5zb3VyY2VOYW1lcyB3aGVuIHNvdXJjZVxuICAgIHRyeVxuICAgICAgbmV3Q29uZi5zb3VyY2VOYW1lcy5wdXNoKG5ldyBNaW5pbWF0Y2goc291cmNlLCBtYXRjaEJhc2U6IHRydWUsIGRvdDogdHJ1ZSkpXG4gICAgY2F0Y2ggZXJyb3JcbiAgICAgIGNvbnNvbGUud2FybiBcIkVycm9yIHBhcnNpbmcgc291cmNlIHBhdHRlcm4gKCN7c291cmNlfSk6ICN7ZXJyb3IubWVzc2FnZX1cIlxuXG4gIGZvciBpZ25vcmUgaW4gY29uZmlnLmlnbm9yZWROYW1lcyB3aGVuIGlnbm9yZVxuICAgIHRyeVxuICAgICAgbmV3Q29uZi5pZ25vcmVkTmFtZXMucHVzaChuZXcgTWluaW1hdGNoKGlnbm9yZSwgbWF0Y2hCYXNlOiB0cnVlLCBkb3Q6IHRydWUpKVxuICAgIGNhdGNoIGVycm9yXG4gICAgICBjb25zb2xlLndhcm4gXCJFcnJvciBwYXJzaW5nIGlnbm9yZSBwYXR0ZXJuICgje2lnbm9yZX0pOiAje2Vycm9yLm1lc3NhZ2V9XCJcblxuICBhc3luYy5lYWNoKFxuICAgIGNvbmZpZy5wYXRocyxcbiAgICAocm9vdFBhdGgsIG5leHQpIC0+XG4gICAgICBuZXcgUGF0aExvYWRlcihyb290UGF0aCwgbmV3Q29uZikubG9hZChuZXh0KVxuICAgIEBhc3luYygpXG4gIClcbiJdfQ==
