
/*
Global Logger
 */

(function() {
  module.exports = (function() {
    var Emitter, emitter, levels, stream, winston, writable;
    Emitter = require('event-kit').Emitter;
    emitter = new Emitter();
    winston = require('winston');
    stream = require('stream');
    writable = new stream.Writable();
    writable._write = function(chunk, encoding, next) {
      var msg;
      msg = chunk.toString();
      emitter.emit('logging', msg);
      return next();
    };
    levels = {
      silly: 0,
      input: 1,
      verbose: 2,
      prompt: 3,
      debug: 4,
      info: 5,
      data: 6,
      help: 7,
      warn: 8,
      error: 9
    };
    return function(label) {
      var i, len, logger, loggerMethods, method, transport, wlogger;
      transport = new winston.transports.File({
        label: label,
        level: 'debug',
        timestamp: true,
        stream: writable,
        json: false
      });
      wlogger = new winston.Logger({
        transports: [transport]
      });
      wlogger.on('logging', function(transport, level, msg, meta) {
        var d, levelNum, loggerLevel, loggerLevelNum, path, ref;
        loggerLevel = (ref = typeof atom !== "undefined" && atom !== null ? atom.config.get('atom-beautify.general.loggerLevel') : void 0) != null ? ref : "warn";
        loggerLevelNum = levels[loggerLevel];
        levelNum = levels[level];
        if (loggerLevelNum <= levelNum) {
          path = require('path');
          label = "" + (path.dirname(transport.label).split(path.sep).reverse()[0]) + path.sep + (path.basename(transport.label));
          d = new Date();
          return console.log((d.toLocaleDateString()) + " " + (d.toLocaleTimeString()) + " - " + label + " [" + level + "]: " + msg, meta);
        }
      });
      loggerMethods = ['silly', 'debug', 'verbose', 'info', 'warn', 'error'];
      logger = {};
      for (i = 0, len = loggerMethods.length; i < len; i++) {
        method = loggerMethods[i];
        logger[method] = wlogger[method];
      }
      logger.onLogging = function(handler) {
        var subscription;
        subscription = emitter.on('logging', handler);
        return subscription;
      };
      return logger;
    };
  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbG9nZ2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQW9CLENBQUEsU0FBQTtBQUVsQixRQUFBO0lBQUMsVUFBVyxPQUFBLENBQVEsV0FBUjtJQUNaLE9BQUEsR0FBYyxJQUFBLE9BQUEsQ0FBQTtJQUdkLE9BQUEsR0FBVSxPQUFBLENBQVEsU0FBUjtJQUNWLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUjtJQUNULFFBQUEsR0FBZSxJQUFBLE1BQU0sQ0FBQyxRQUFQLENBQUE7SUFDZixRQUFRLENBQUMsTUFBVCxHQUFrQixTQUFDLEtBQUQsRUFBUSxRQUFSLEVBQWtCLElBQWxCO0FBQ2hCLFVBQUE7TUFBQSxHQUFBLEdBQU0sS0FBSyxDQUFDLFFBQU4sQ0FBQTtNQUVOLE9BQU8sQ0FBQyxJQUFSLENBQWEsU0FBYixFQUF3QixHQUF4QjthQUNBLElBQUEsQ0FBQTtJQUpnQjtJQU1sQixNQUFBLEdBQVM7TUFDUCxLQUFBLEVBQU8sQ0FEQTtNQUVQLEtBQUEsRUFBTyxDQUZBO01BR1AsT0FBQSxFQUFTLENBSEY7TUFJUCxNQUFBLEVBQVEsQ0FKRDtNQUtQLEtBQUEsRUFBTyxDQUxBO01BTVAsSUFBQSxFQUFNLENBTkM7TUFPUCxJQUFBLEVBQU0sQ0FQQztNQVFQLElBQUEsRUFBTSxDQVJDO01BU1AsSUFBQSxFQUFNLENBVEM7TUFVUCxLQUFBLEVBQU8sQ0FWQTs7QUFhVCxXQUFPLFNBQUMsS0FBRDtBQUNMLFVBQUE7TUFBQSxTQUFBLEdBQWdCLElBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFwQixDQUEwQjtRQUN4QyxLQUFBLEVBQU8sS0FEaUM7UUFFeEMsS0FBQSxFQUFPLE9BRmlDO1FBR3hDLFNBQUEsRUFBVyxJQUg2QjtRQU14QyxNQUFBLEVBQVEsUUFOZ0M7UUFPeEMsSUFBQSxFQUFNLEtBUGtDO09BQTFCO01BVWhCLE9BQUEsR0FBYyxJQUFDLE9BQU8sQ0FBQyxNQUFULENBQWlCO1FBRTdCLFVBQUEsRUFBWSxDQUNWLFNBRFUsQ0FGaUI7T0FBakI7TUFNZCxPQUFPLENBQUMsRUFBUixDQUFXLFNBQVgsRUFBc0IsU0FBQyxTQUFELEVBQVksS0FBWixFQUFtQixHQUFuQixFQUF3QixJQUF4QjtBQUNwQixZQUFBO1FBQUEsV0FBQSx3SUFDeUM7UUFFekMsY0FBQSxHQUFpQixNQUFPLENBQUEsV0FBQTtRQUN4QixRQUFBLEdBQVcsTUFBTyxDQUFBLEtBQUE7UUFDbEIsSUFBRyxjQUFBLElBQWtCLFFBQXJCO1VBQ0UsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSO1VBQ1AsS0FBQSxHQUFRLEVBQUEsR0FBRSxDQUFDLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBUyxDQUFDLEtBQXZCLENBQ0MsQ0FBQyxLQURGLENBQ1EsSUFBSSxDQUFDLEdBRGIsQ0FDaUIsQ0FBQyxPQURsQixDQUFBLENBQzRCLENBQUEsQ0FBQSxDQUQ3QixDQUFGLEdBRU0sSUFBSSxDQUFDLEdBRlgsR0FFZ0IsQ0FBQyxJQUFJLENBQUMsUUFBTCxDQUFjLFNBQVMsQ0FBQyxLQUF4QixDQUFEO1VBQ3hCLENBQUEsR0FBUSxJQUFBLElBQUEsQ0FBQTtpQkFDUixPQUFPLENBQUMsR0FBUixDQUFjLENBQUMsQ0FBQyxDQUFDLGtCQUFGLENBQUEsQ0FBRCxDQUFBLEdBQXdCLEdBQXhCLEdBQTBCLENBQUMsQ0FBQyxDQUFDLGtCQUFGLENBQUEsQ0FBRCxDQUExQixHQUFrRCxLQUFsRCxHQUF1RCxLQUF2RCxHQUE2RCxJQUE3RCxHQUFpRSxLQUFqRSxHQUF1RSxLQUF2RSxHQUE0RSxHQUExRixFQUFpRyxJQUFqRyxFQU5GOztNQU5vQixDQUF0QjtNQWVBLGFBQUEsR0FBZ0IsQ0FBQyxPQUFELEVBQVMsT0FBVCxFQUFpQixTQUFqQixFQUEyQixNQUEzQixFQUFrQyxNQUFsQyxFQUF5QyxPQUF6QztNQUNoQixNQUFBLEdBQVM7QUFDVCxXQUFBLCtDQUFBOztRQUNFLE1BQU8sQ0FBQSxNQUFBLENBQVAsR0FBaUIsT0FBUSxDQUFBLE1BQUE7QUFEM0I7TUFHQSxNQUFNLENBQUMsU0FBUCxHQUFtQixTQUFDLE9BQUQ7QUFFakIsWUFBQTtRQUFBLFlBQUEsR0FBZSxPQUFPLENBQUMsRUFBUixDQUFXLFNBQVgsRUFBc0IsT0FBdEI7QUFFZixlQUFPO01BSlU7QUFNbkIsYUFBTztJQTNDRjtFQTVCVyxDQUFBLENBQUgsQ0FBQTtBQUhqQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuR2xvYmFsIExvZ2dlclxuIyMjXG5tb2R1bGUuZXhwb3J0cyA9IGRvIC0+XG4gICMgQ3JlYXRlIEV2ZW50IEVtaXR0ZXJcbiAge0VtaXR0ZXJ9ID0gcmVxdWlyZSAnZXZlbnQta2l0J1xuICBlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAjIENyZWF0ZSBUcmFuc3BvcnQgd2l0aCBXcml0YWJsZSBTdHJlYW1cbiAgIyBTZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjE1ODM4MzEvMjU3ODIwNVxuICB3aW5zdG9uID0gcmVxdWlyZSgnd2luc3RvbicpXG4gIHN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpXG4gIHdyaXRhYmxlID0gbmV3IHN0cmVhbS5Xcml0YWJsZSgpXG4gIHdyaXRhYmxlLl93cml0ZSA9IChjaHVuaywgZW5jb2RpbmcsIG5leHQpIC0+XG4gICAgbXNnID0gY2h1bmsudG9TdHJpbmcoKVxuICAgICMgY29uc29sZS5sb2cobXNnKVxuICAgIGVtaXR0ZXIuZW1pdCgnbG9nZ2luZycsIG1zZylcbiAgICBuZXh0KClcblxuICBsZXZlbHMgPSB7XG4gICAgc2lsbHk6IDAsXG4gICAgaW5wdXQ6IDEsXG4gICAgdmVyYm9zZTogMixcbiAgICBwcm9tcHQ6IDMsXG4gICAgZGVidWc6IDQsXG4gICAgaW5mbzogNSxcbiAgICBkYXRhOiA2LFxuICAgIGhlbHA6IDcsXG4gICAgd2FybjogOCxcbiAgICBlcnJvcjogOVxuICB9XG5cbiAgcmV0dXJuIChsYWJlbCkgLT5cbiAgICB0cmFuc3BvcnQgPSBuZXcgKHdpbnN0b24udHJhbnNwb3J0cy5GaWxlKSh7XG4gICAgICBsYWJlbDogbGFiZWxcbiAgICAgIGxldmVsOiAnZGVidWcnXG4gICAgICB0aW1lc3RhbXA6IHRydWVcbiAgICAgICMgcHJldHR5UHJpbnQ6IHRydWVcbiAgICAgICMgY29sb3JpemU6IHRydWVcbiAgICAgIHN0cmVhbTogd3JpdGFibGVcbiAgICAgIGpzb246IGZhbHNlXG4gICAgfSlcbiAgICAjIEluaXRpYWxpemUgbG9nZ2VyXG4gICAgd2xvZ2dlciA9IG5ldyAod2luc3Rvbi5Mb2dnZXIpKHtcbiAgICAgICMgQ29uZmlndXJlIHRyYW5zcG9ydHNcbiAgICAgIHRyYW5zcG9ydHM6IFtcbiAgICAgICAgdHJhbnNwb3J0XG4gICAgICBdXG4gICAgfSlcbiAgICB3bG9nZ2VyLm9uKCdsb2dnaW5nJywgKHRyYW5zcG9ydCwgbGV2ZWwsIG1zZywgbWV0YSktPlxuICAgICAgbG9nZ2VyTGV2ZWwgPSBhdG9tPy5jb25maWcuZ2V0KFxcXG4gICAgICAgICdhdG9tLWJlYXV0aWZ5LmdlbmVyYWwubG9nZ2VyTGV2ZWwnKSA/IFwid2FyblwiXG4gICAgICAjIGNvbnNvbGUubG9nKCdsb2dnaW5nJywgbG9nZ2VyTGV2ZWwsIGFyZ3VtZW50cylcbiAgICAgIGxvZ2dlckxldmVsTnVtID0gbGV2ZWxzW2xvZ2dlckxldmVsXVxuICAgICAgbGV2ZWxOdW0gPSBsZXZlbHNbbGV2ZWxdXG4gICAgICBpZiBsb2dnZXJMZXZlbE51bSA8PSBsZXZlbE51bVxuICAgICAgICBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgICAgIGxhYmVsID0gXCIje3BhdGguZGlybmFtZSh0cmFuc3BvcnQubGFiZWwpXFxcbiAgICAgICAgICAgICAgICAgICAgLnNwbGl0KHBhdGguc2VwKS5yZXZlcnNlKClbMF19XFxcbiAgICAgICAgICAgICAgICAgICAgI3twYXRoLnNlcH0je3BhdGguYmFzZW5hbWUodHJhbnNwb3J0LmxhYmVsKX1cIlxuICAgICAgICBkID0gbmV3IERhdGUoKVxuICAgICAgICBjb25zb2xlLmxvZyhcIiN7ZC50b0xvY2FsZURhdGVTdHJpbmcoKX0gI3tkLnRvTG9jYWxlVGltZVN0cmluZygpfSAtICN7bGFiZWx9IFsje2xldmVsfV06ICN7bXNnfVwiLCBtZXRhKVxuICAgIClcbiAgICAjIEV4cG9ydCBsb2dnZXIgbWV0aG9kc1xuICAgIGxvZ2dlck1ldGhvZHMgPSBbJ3NpbGx5JywnZGVidWcnLCd2ZXJib3NlJywnaW5mbycsJ3dhcm4nLCdlcnJvciddXG4gICAgbG9nZ2VyID0ge31cbiAgICBmb3IgbWV0aG9kIGluIGxvZ2dlck1ldGhvZHNcbiAgICAgIGxvZ2dlclttZXRob2RdID0gd2xvZ2dlclttZXRob2RdXG4gICAgIyBBZGQgbG9nZ2VyIGxpc3RlbmVyXG4gICAgbG9nZ2VyLm9uTG9nZ2luZyA9IChoYW5kbGVyKSAtPlxuICAgICAgIyBjb25zb2xlLmxvZygnb25Mb2dnaW5nJywgaGFuZGxlcilcbiAgICAgIHN1YnNjcmlwdGlvbiA9IGVtaXR0ZXIub24oJ2xvZ2dpbmcnLCBoYW5kbGVyKVxuICAgICAgIyBjb25zb2xlLmxvZygnZW1pdHRlcicsIGVtaXR0ZXIuaGFuZGxlcnNCeUV2ZW50TmFtZSwgc3Vic2NyaXB0aW9uKVxuICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvblxuICAgICMgUmV0dXJuIHNpbXBsaWZpZWQgbG9nZ2VyXG4gICAgcmV0dXJuIGxvZ2dlclxuIl19
