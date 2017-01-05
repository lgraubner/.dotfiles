(function() {
  var MergeState;

  MergeState = (function() {
    function MergeState(conflicts, context1, isRebase) {
      this.conflicts = conflicts;
      this.context = context1;
      this.isRebase = isRebase;
    }

    MergeState.prototype.conflictPaths = function() {
      var c, i, len, ref, results;
      ref = this.conflicts;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        c = ref[i];
        results.push(c.path);
      }
      return results;
    };

    MergeState.prototype.reread = function() {
      return this.context.readConflicts().then((function(_this) {
        return function(conflicts) {
          _this.conflicts = conflicts;
        };
      })(this));
    };

    MergeState.prototype.isEmpty = function() {
      return this.conflicts.length === 0;
    };

    MergeState.prototype.relativize = function(filePath) {
      return this.context.workingDirectory.relativize(filePath);
    };

    MergeState.prototype.join = function(relativePath) {
      return this.context.joinPath(relativePath);
    };

    MergeState.read = function(context) {
      var isr;
      isr = context.isRebasing();
      return context.readConflicts().then(function(cs) {
        return new MergeState(cs, context, isr);
      });
    };

    return MergeState;

  })();

  module.exports = {
    MergeState: MergeState
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi9tZXJnZS1zdGF0ZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNO0lBRVMsb0JBQUMsU0FBRCxFQUFhLFFBQWIsRUFBdUIsUUFBdkI7TUFBQyxJQUFDLENBQUEsWUFBRDtNQUFZLElBQUMsQ0FBQSxVQUFEO01BQVUsSUFBQyxDQUFBLFdBQUQ7SUFBdkI7O3lCQUViLGFBQUEsR0FBZSxTQUFBO0FBQUcsVUFBQTtBQUFBO0FBQUE7V0FBQSxxQ0FBQTs7cUJBQUEsQ0FBQyxDQUFDO0FBQUY7O0lBQUg7O3lCQUVmLE1BQUEsR0FBUSxTQUFBO2FBQ04sSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULENBQUEsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsU0FBRDtVQUFDLEtBQUMsQ0FBQSxZQUFEO1FBQUQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCO0lBRE07O3lCQUdSLE9BQUEsR0FBUyxTQUFBO2FBQUcsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLEtBQXFCO0lBQXhCOzt5QkFFVCxVQUFBLEdBQVksU0FBQyxRQUFEO2FBQWMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUExQixDQUFxQyxRQUFyQztJQUFkOzt5QkFFWixJQUFBLEdBQU0sU0FBQyxZQUFEO2FBQWtCLElBQUMsQ0FBQSxPQUFPLENBQUMsUUFBVCxDQUFrQixZQUFsQjtJQUFsQjs7SUFFTixVQUFDLENBQUEsSUFBRCxHQUFPLFNBQUMsT0FBRDtBQUNMLFVBQUE7TUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLFVBQVIsQ0FBQTthQUNOLE9BQU8sQ0FBQyxhQUFSLENBQUEsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixTQUFDLEVBQUQ7ZUFDdkIsSUFBQSxVQUFBLENBQVcsRUFBWCxFQUFlLE9BQWYsRUFBd0IsR0FBeEI7TUFEdUIsQ0FBN0I7SUFGSzs7Ozs7O0VBS1QsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFVBQUEsRUFBWSxVQUFaOztBQXJCRiIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE1lcmdlU3RhdGVcblxuICBjb25zdHJ1Y3RvcjogKEBjb25mbGljdHMsIEBjb250ZXh0LCBAaXNSZWJhc2UpIC0+XG5cbiAgY29uZmxpY3RQYXRoczogLT4gYy5wYXRoIGZvciBjIGluIEBjb25mbGljdHNcblxuICByZXJlYWQ6IC0+XG4gICAgQGNvbnRleHQucmVhZENvbmZsaWN0cygpLnRoZW4gKEBjb25mbGljdHMpID0+XG5cbiAgaXNFbXB0eTogLT4gQGNvbmZsaWN0cy5sZW5ndGggaXMgMFxuXG4gIHJlbGF0aXZpemU6IChmaWxlUGF0aCkgLT4gQGNvbnRleHQud29ya2luZ0RpcmVjdG9yeS5yZWxhdGl2aXplIGZpbGVQYXRoXG5cbiAgam9pbjogKHJlbGF0aXZlUGF0aCkgLT4gQGNvbnRleHQuam9pblBhdGgocmVsYXRpdmVQYXRoKVxuXG4gIEByZWFkOiAoY29udGV4dCkgLT5cbiAgICBpc3IgPSBjb250ZXh0LmlzUmViYXNpbmcoKVxuICAgIGNvbnRleHQucmVhZENvbmZsaWN0cygpLnRoZW4gKGNzKSAtPlxuICAgICAgbmV3IE1lcmdlU3RhdGUoY3MsIGNvbnRleHQsIGlzcilcblxubW9kdWxlLmV4cG9ydHMgPVxuICBNZXJnZVN0YXRlOiBNZXJnZVN0YXRlXG4iXX0=
