Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _side = require('./side');

var _navigator = require('./navigator');

// Public: Model an individual conflict parsed from git's automatic conflict resolution output.
'use babel';

var Conflict = (function () {

  /*
   * Private: Initialize a new Conflict with its constituent Sides, Navigator, and the MergeState
   * it belongs to.
   *
   * ours [Side] the lines of this conflict that the current user contributed (by our best guess).
   * theirs [Side] the lines of this conflict that another contributor created.
   * base [Side] the lines of merge base of this conflict. Optional.
   * navigator [Navigator] maintains references to surrounding Conflicts in the original file.
   * state [MergeState] repository-wide information about the current merge.
   */

  function Conflict(ours, theirs, base, navigator, merge) {
    _classCallCheck(this, Conflict);

    this.ours = ours;
    this.theirs = theirs;
    this.base = base;
    this.navigator = navigator;
    this.merge = merge;

    this.emitter = new _atom.Emitter();

    // Populate back-references
    this.ours.conflict = this;
    this.theirs.conflict = this;
    if (this.base) {
      this.base.conflict = this;
    }
    this.navigator.conflict = this;

    // Begin unresolved
    this.resolution = null;
  }

  // Regular expression that matches the beginning of a potential conflict.

  /*
   * Public: Has this conflict been resolved in any way?
   *
   * Return [Boolean]
   */

  _createClass(Conflict, [{
    key: 'isResolved',
    value: function isResolved() {
      return this.resolution !== null;
    }

    /*
     * Public: Attach an event handler to be notified when this conflict is resolved.
     *
     * callback [Function]
     */
  }, {
    key: 'onDidResolveConflict',
    value: function onDidResolveConflict(callback) {
      return this.emitter.on('resolve-conflict', callback);
    }

    /*
     * Public: Specify which Side is to be kept. Note that either side may have been modified by the
     * user prior to resolution. Notify any subscribers.
     *
     * side [Side] our changes or their changes.
     */
  }, {
    key: 'resolveAs',
    value: function resolveAs(side) {
      this.resolution = side;
      this.emitter.emit('resolve-conflict');
    }

    /*
     * Public: Locate the position that the editor should scroll to in order to make this conflict
     * visible.
     *
     * Return [Point] buffer coordinates
     */
  }, {
    key: 'scrollTarget',
    value: function scrollTarget() {
      return this.ours.marker.getTailBufferPosition();
    }

    /*
     * Public: Audit all Marker instances owned by subobjects within this Conflict.
     *
     * Return [Array<Marker>]
     */
  }, {
    key: 'markers',
    value: function markers() {
      var ms = [this.ours.markers(), this.theirs.markers(), this.navigator.markers()];
      if (this.baseSide) {
        ms.push(this.baseSide.markers());
      }
      return _underscorePlus2['default'].flatten(ms, true);
    }

    /*
     * Public: Console-friendly identification of this conflict.
     *
     * Return [String] that distinguishes this conflict from others.
     */
  }, {
    key: 'toString',
    value: function toString() {
      return '[conflict: ' + this.ours + ' ' + this.theirs + ']';
    }

    /*
     * Public: Parse any conflict markers in a TextEditor's buffer and return a Conflict that contains
     * markers corresponding to each.
     *
     * merge [MergeState] Repository-wide state of the merge.
     * editor [TextEditor] The editor to search.
     * return [Array<Conflict>] A (possibly empty) collection of parsed Conflicts.
     */
  }], [{
    key: 'all',
    value: function all(merge, editor) {
      var conflicts = [];
      var lastRow = -1;

      editor.getBuffer().scan(CONFLICT_START_REGEX, function (m) {
        conflictStartRow = m.range.start.row;
        if (conflictStartRow < lastRow) {
          // Match within an already-parsed conflict.
          return;
        }

        var visitor = new ConflictVisitor(merge, editor);

        try {
          lastRow = parseConflict(merge, editor, conflictStartRow, visitor);
          var conflict = visitor.conflict();

          if (conflicts.length > 0) {
            conflict.navigator.linkToPrevious(conflicts[conflicts.length - 1]);
          }
          conflicts.push(conflict);
        } catch (e) {
          if (!e.parserState) throw e;

          if (!atom.inSpecMode()) {
            console.error('Unable to parse conflict: ' + e.message + '\n' + e.stack);
          }
        }
      });

      return conflicts;
    }
  }]);

  return Conflict;
})();

exports.Conflict = Conflict;
var CONFLICT_START_REGEX = /^<{7} (.+)\r?\n/g;

// Side positions.
var TOP = 'top';
var BASE = 'base';
var BOTTOM = 'bottom';

// Options used to initialize markers.
var options = {
  persistent: false,
  invalidate: 'never'
};

/*
 * Private: conflict parser visitor that ignores all events.
 */

var NoopVisitor = (function () {
  function NoopVisitor() {
    _classCallCheck(this, NoopVisitor);
  }

  /*
   * Private: conflict parser visitor that marks each buffer range and assembles a Conflict from the
   * pieces.
   */

  _createClass(NoopVisitor, [{
    key: 'visitOurSide',
    value: function visitOurSide(position, bannerRow, textRowStart, textRowEnd) {}
  }, {
    key: 'visitBaseSide',
    value: function visitBaseSide(position, bannerRow, textRowStart, textRowEnd) {}
  }, {
    key: 'visitSeparator',
    value: function visitSeparator(sepRowStart, sepRowEnd) {}
  }, {
    key: 'visitTheirSide',
    value: function visitTheirSide(position, bannerRow, textRowStart, textRowEnd) {}
  }]);

  return NoopVisitor;
})();

var ConflictVisitor = (function () {

  /*
   * merge - [MergeState] passed to each instantiated Side.
   * editor - [TextEditor] displaying the conflicting text.
   */

  function ConflictVisitor(merge, editor) {
    _classCallCheck(this, ConflictVisitor);

    this.merge = merge;
    this.editor = editor;
    this.previousSide = null;

    this.ourSide = null;
    this.baseSide = null;
    this.navigator = null;
  }

  /*
   * Private: parseConflict discovers git conflict markers in a corpus of text and constructs Conflict
   * instances that mark the correct lines.
   *
   * Returns [Integer] the buffer row after the final <<<<<< boundary.
   */

  /*
   * position - [String] one of TOP or BOTTOM.
   * bannerRow - [Integer] of the buffer row that contains our side's banner.
   * textRowStart - [Integer] of the first buffer row that contain this side's text.
   * textRowEnd - [Integer] of the first buffer row beyond the extend of this side's text.
   */

  _createClass(ConflictVisitor, [{
    key: 'visitOurSide',
    value: function visitOurSide(position, bannerRow, textRowStart, textRowEnd) {
      this.ourSide = this.markSide(position, _side.OurSide, bannerRow, textRowStart, textRowEnd);
    }

    /*
     * bannerRow - [Integer] the buffer row that contains our side's banner.
     * textRowStart - [Integer] first buffer row that contain this side's text.
     * textRowEnd - [Integer] first buffer row beyond the extend of this side's text.
     */
  }, {
    key: 'visitBaseSide',
    value: function visitBaseSide(bannerRow, textRowStart, textRowEnd) {
      this.baseSide = this.markSide(BASE, _side.BaseSide, bannerRow, textRowStart, textRowEnd);
    }

    /*
     * sepRowStart - [Integer] buffer row that contains the "=======" separator.
     * sepRowEnd - [Integer] the buffer row after the separator.
     */
  }, {
    key: 'visitSeparator',
    value: function visitSeparator(sepRowStart, sepRowEnd) {
      var marker = this.editor.markBufferRange([[sepRowStart, 0], [sepRowEnd, 0]], options);
      this.previousSide.followingMarker = marker;

      this.navigator = new _navigator.Navigator(marker);
      this.previousSide = this.navigator;
    }

    /*
     * position - [String] Always BASE; accepted for consistency.
     * bannerRow - [Integer] the buffer row that contains our side's banner.
     * textRowStart - [Integer] first buffer row that contain this side's text.
     * textRowEnd - [Integer] first buffer row beyond the extend of this side's text.
     */
  }, {
    key: 'visitTheirSide',
    value: function visitTheirSide(position, bannerRow, textRowStart, textRowEnd) {
      this.theirSide = this.markSide(position, _side.TheirSide, bannerRow, textRowStart, textRowEnd);
    }
  }, {
    key: 'markSide',
    value: function markSide(position, sideKlass, bannerRow, textRowStart, textRowEnd) {
      var description = this.sideDescription(bannerRow);

      var bannerMarker = this.editor.markBufferRange([[bannerRow, 0], [bannerRow + 1, 0]], options);

      if (this.previousSide) {
        this.previousSide.followingMarker = bannerMarker;
      }

      var textRange = [[textRowStart, 0], [textRowEnd, 0]];
      var textMarker = this.editor.markBufferRange(textRange, options);
      var text = this.editor.getTextInBufferRange(textRange);

      var side = new sideKlass(text, description, textMarker, bannerMarker, position);
      this.previousSide = side;
      return side;
    }

    /*
     * Parse the banner description for the current side from a banner row.
     */
  }, {
    key: 'sideDescription',
    value: function sideDescription(bannerRow) {
      return this.editor.lineTextForBufferRow(bannerRow).match(/^[<|>]{7} (.*)$/)[1];
    }
  }, {
    key: 'conflict',
    value: function conflict() {
      this.previousSide.followingMarker = this.previousSide.refBannerMarker;

      return new Conflict(this.ourSide, this.theirSide, this.baseSide, this.navigator, this.merge);
    }
  }]);

  return ConflictVisitor;
})();

var parseConflict = function parseConflict(merge, editor, row, visitor) {
  var lastBoundary = null;

  // Visit a side that begins with a banner and description as its first line.
  var visitHeaderSide = function visitHeaderSide(position, visitMethod) {
    var sideRowStart = row;
    row += 1;
    advanceToBoundary('|=');
    var sideRowEnd = row;

    visitor[visitMethod](position, sideRowStart, sideRowStart + 1, sideRowEnd);
  };

  // Visit the base side from diff3 output, if one is present, then visit the separator.
  var visitBaseAndSeparator = function visitBaseAndSeparator() {
    if (lastBoundary === '|') {
      visitBaseSide();
    }

    visitSeparator();
  };

  // Visit a base side from diff3 output.
  var visitBaseSide = function visitBaseSide() {
    var sideRowStart = row;
    row += 1;

    var b = advanceToBoundary('<=');
    while (b === '<') {
      // Embedded recursive conflict within a base side, caused by a criss-cross merge.
      // Advance beyond it without marking anything.
      row = parseConflict(merge, editor, row, new NoopVisitor());
      b = advanceToBoundary('<=');
    }

    var sideRowEnd = row;

    visitor.visitBaseSide(sideRowStart, sideRowStart + 1, sideRowEnd);
  };

  // Visit a "========" separator.
  var visitSeparator = function visitSeparator() {
    var sepRowStart = row;
    row += 1;
    var sepRowEnd = row;

    visitor.visitSeparator(sepRowStart, sepRowEnd);
  };

  // Vidie a side with a banner and description as its last line.
  var visitFooterSide = function visitFooterSide(position, visitMethod) {
    var sideRowStart = row;
    var b = advanceToBoundary('>');
    row += 1;
    sideRowEnd = row;

    visitor[visitMethod](position, sideRowEnd - 1, sideRowStart, sideRowEnd - 1);
  };

  // Determine if the current row is a side boundary.
  //
  // boundaryKinds - [String] any combination of <, |, =, or > to limit the kinds of boundary
  //   detected.
  //
  // Returns the matching boundaryKinds character, or `null` if none match.
  var isAtBoundary = function isAtBoundary() {
    var boundaryKinds = arguments.length <= 0 || arguments[0] === undefined ? '<|=>' : arguments[0];

    var line = editor.lineTextForBufferRow(row);
    for (b of boundaryKinds) {
      if (line.startsWith(b.repeat(7))) {
        return b;
      }
    }
    return null;
  };

  // Increment the current row until the current line matches one of the provided boundary kinds,
  // or until there are no more lines in the editor.
  //
  // boundaryKinds - [String] any combination of <, |, =, or > to limit the kinds of boundaries
  //   that halt the progression.
  //
  // Returns the matching boundaryKinds character, or 'null' if there are no matches to the end of
  // the editor.
  var advanceToBoundary = function advanceToBoundary() {
    var boundaryKinds = arguments.length <= 0 || arguments[0] === undefined ? '<|=>' : arguments[0];

    var b = isAtBoundary(boundaryKinds);
    while (b === null) {
      row += 1;
      if (row > editor.getLastBufferRow()) {
        var e = new Error('Unterminated conflict side');
        e.parserState = true;
        throw e;
      }
      b = isAtBoundary(boundaryKinds);
    }

    lastBoundary = b;
    return b;
  };

  if (!merge.isRebase) {
    visitHeaderSide(TOP, 'visitOurSide');
    visitBaseAndSeparator();
    visitFooterSide(BOTTOM, 'visitTheirSide');
  } else {
    visitHeaderSide(TOP, 'visitTheirSide');
    visitBaseAndSeparator();
    visitFooterSide(BOTTOM, 'visitOurSide');
  }

  return row;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL21lcmdlLWNvbmZsaWN0cy9saWIvY29uZmxpY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFc0IsTUFBTTs7OEJBQ2QsaUJBQWlCOzs7O29CQUVrQixRQUFROzt5QkFDakMsYUFBYTs7O0FBTnJDLFdBQVcsQ0FBQTs7SUFTRSxRQUFROzs7Ozs7Ozs7Ozs7O0FBWVAsV0FaRCxRQUFRLENBWU4sSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRTswQkFaeEMsUUFBUTs7QUFhakIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7QUFDaEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7QUFDcEIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7QUFDaEIsUUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7QUFDMUIsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7O0FBRWxCLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTs7O0FBRzVCLFFBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtBQUN6QixRQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7QUFDM0IsUUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2IsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0tBQzFCO0FBQ0QsUUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBOzs7QUFHOUIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7R0FDdkI7Ozs7Ozs7Ozs7ZUEvQlUsUUFBUTs7V0FzQ1Qsc0JBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSSxDQUFBO0tBQ2hDOzs7Ozs7Ozs7V0FPb0IsOEJBQUMsUUFBUSxFQUFFO0FBQzlCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDckQ7Ozs7Ozs7Ozs7V0FRUyxtQkFBQyxJQUFJLEVBQUU7QUFDZixVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTtBQUN0QixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0tBQ3RDOzs7Ozs7Ozs7O1dBUVksd0JBQUc7QUFDZCxhQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUE7S0FDaEQ7Ozs7Ozs7OztXQU9PLG1CQUFHO0FBQ1QsVUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO0FBQ2pGLFVBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixVQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTtPQUNqQztBQUNELGFBQU8sNEJBQUUsT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTtLQUMzQjs7Ozs7Ozs7O1dBT1Esb0JBQUc7QUFDViw2QkFBcUIsSUFBSSxDQUFDLElBQUksU0FBSSxJQUFJLENBQUMsTUFBTSxPQUFHO0tBQ2pEOzs7Ozs7Ozs7Ozs7V0FVVSxhQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDekIsVUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFBO0FBQ3BCLFVBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFBOztBQUVoQixZQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLFVBQUMsQ0FBQyxFQUFLO0FBQ25ELHdCQUFnQixHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQTtBQUNwQyxZQUFJLGdCQUFnQixHQUFHLE9BQU8sRUFBRTs7QUFFOUIsaUJBQU07U0FDUDs7QUFFRCxZQUFNLE9BQU8sR0FBRyxJQUFJLGVBQWUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUE7O0FBRWxELFlBQUk7QUFDRixpQkFBTyxHQUFHLGFBQWEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ2pFLGNBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQTs7QUFFbkMsY0FBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN4QixvQkFBUSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtXQUNuRTtBQUNELG1CQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQ3pCLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixjQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQTs7QUFFM0IsY0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtBQUN0QixtQkFBTyxDQUFDLEtBQUssZ0NBQThCLENBQUMsQ0FBQyxPQUFPLFVBQUssQ0FBQyxDQUFDLEtBQUssQ0FBRyxDQUFBO1dBQ3BFO1NBQ0Y7T0FDRixDQUFDLENBQUE7O0FBRUYsYUFBTyxTQUFTLENBQUE7S0FDakI7OztTQXJJVSxRQUFROzs7O0FBeUlyQixJQUFNLG9CQUFvQixHQUFHLGtCQUFrQixDQUFBOzs7QUFHL0MsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFBO0FBQ2pCLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQTtBQUNuQixJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUE7OztBQUd2QixJQUFNLE9BQU8sR0FBRztBQUNkLFlBQVUsRUFBRSxLQUFLO0FBQ2pCLFlBQVUsRUFBRSxPQUFPO0NBQ3BCLENBQUE7Ozs7OztJQUtLLFdBQVc7V0FBWCxXQUFXOzBCQUFYLFdBQVc7Ozs7Ozs7O2VBQVgsV0FBVzs7V0FFRixzQkFBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsRUFBRzs7O1dBRWxELHVCQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxFQUFHOzs7V0FFbEQsd0JBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFHOzs7V0FFNUIsd0JBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLEVBQUc7OztTQVI5RCxXQUFXOzs7SUFnQlgsZUFBZTs7Ozs7OztBQU1QLFdBTlIsZUFBZSxDQU1OLEtBQUssRUFBRSxNQUFNLEVBQUU7MEJBTnhCLGVBQWU7O0FBT2pCLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO0FBQ3BCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFBOztBQUV4QixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtBQUNuQixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtBQUNwQixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTtHQUN0Qjs7Ozs7Ozs7Ozs7Ozs7OztlQWRHLGVBQWU7O1dBc0JOLHNCQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRTtBQUMzRCxVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxpQkFBVyxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0tBQ3JGOzs7Ozs7Ozs7V0FPYSx1QkFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRTtBQUNsRCxVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxrQkFBWSxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0tBQ25GOzs7Ozs7OztXQU1jLHdCQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUU7QUFDdEMsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ3ZGLFVBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQTs7QUFFMUMsVUFBSSxDQUFDLFNBQVMsR0FBRyx5QkFBYyxNQUFNLENBQUMsQ0FBQTtBQUN0QyxVQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUE7S0FDbkM7Ozs7Ozs7Ozs7V0FRYyx3QkFBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUU7QUFDN0QsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsbUJBQWEsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQTtLQUN6Rjs7O1dBRVEsa0JBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRTtBQUNsRSxVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFBOztBQUVuRCxVQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFBOztBQUUvRixVQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDckIsWUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLEdBQUcsWUFBWSxDQUFBO09BQ2pEOztBQUVELFVBQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN0RCxVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDbEUsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQTs7QUFFeEQsVUFBTSxJQUFJLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBQ2pGLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFBO0FBQ3hCLGFBQU8sSUFBSSxDQUFBO0tBQ1o7Ozs7Ozs7V0FLZSx5QkFBQyxTQUFTLEVBQUU7QUFDMUIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQy9FOzs7V0FFUSxvQkFBRztBQUNWLFVBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFBOztBQUVyRSxhQUFPLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQzdGOzs7U0F0RkcsZUFBZTs7O0FBZ0dyQixJQUFNLGFBQWEsR0FBRyxTQUFoQixhQUFhLENBQWEsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFO0FBQzNELE1BQUksWUFBWSxHQUFHLElBQUksQ0FBQTs7O0FBR3ZCLE1BQU0sZUFBZSxHQUFHLFNBQWxCLGVBQWUsQ0FBSSxRQUFRLEVBQUUsV0FBVyxFQUFLO0FBQ2pELFFBQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQTtBQUN4QixPQUFHLElBQUksQ0FBQyxDQUFBO0FBQ1IscUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDdkIsUUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFBOztBQUV0QixXQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxZQUFZLEdBQUcsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0dBQzNFLENBQUE7OztBQUdELE1BQU0scUJBQXFCLEdBQUcsU0FBeEIscUJBQXFCLEdBQVM7QUFDbEMsUUFBSSxZQUFZLEtBQUssR0FBRyxFQUFFO0FBQ3hCLG1CQUFhLEVBQUUsQ0FBQTtLQUNoQjs7QUFFRCxrQkFBYyxFQUFFLENBQUE7R0FDakIsQ0FBQTs7O0FBR0QsTUFBTSxhQUFhLEdBQUcsU0FBaEIsYUFBYSxHQUFTO0FBQzFCLFFBQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQTtBQUN4QixPQUFHLElBQUksQ0FBQyxDQUFBOztBQUVSLFFBQUksQ0FBQyxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFBO0FBQy9CLFdBQU8sQ0FBQyxLQUFLLEdBQUcsRUFBRTs7O0FBR2hCLFNBQUcsR0FBRyxhQUFhLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxXQUFXLEVBQUUsQ0FBQyxDQUFBO0FBQzFELE9BQUMsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUM1Qjs7QUFFRCxRQUFNLFVBQVUsR0FBRyxHQUFHLENBQUE7O0FBRXRCLFdBQU8sQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLFlBQVksR0FBRyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUE7R0FDbEUsQ0FBQTs7O0FBR0QsTUFBTSxjQUFjLEdBQUcsU0FBakIsY0FBYyxHQUFTO0FBQzNCLFFBQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQTtBQUN2QixPQUFHLElBQUksQ0FBQyxDQUFBO0FBQ1IsUUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFBOztBQUVyQixXQUFPLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQTtHQUMvQyxDQUFBOzs7QUFHRCxNQUFNLGVBQWUsR0FBRyxTQUFsQixlQUFlLENBQUksUUFBUSxFQUFFLFdBQVcsRUFBSztBQUNqRCxRQUFNLFlBQVksR0FBRyxHQUFHLENBQUE7QUFDeEIsUUFBTSxDQUFDLEdBQUcsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDaEMsT0FBRyxJQUFJLENBQUMsQ0FBQTtBQUNSLGNBQVUsR0FBRyxHQUFHLENBQUE7O0FBRWhCLFdBQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxZQUFZLEVBQUUsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFBO0dBQzdFLENBQUE7Ozs7Ozs7O0FBUUQsTUFBTSxZQUFZLEdBQUcsU0FBZixZQUFZLEdBQStCO1FBQTNCLGFBQWEseURBQUcsTUFBTTs7QUFDMUMsUUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQzdDLFNBQUssQ0FBQyxJQUFJLGFBQWEsRUFBRTtBQUN2QixVQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ2hDLGVBQU8sQ0FBQyxDQUFBO09BQ1Q7S0FDRjtBQUNELFdBQU8sSUFBSSxDQUFBO0dBQ1osQ0FBQTs7Ozs7Ozs7OztBQVVELE1BQU0saUJBQWlCLEdBQUcsU0FBcEIsaUJBQWlCLEdBQStCO1FBQTNCLGFBQWEseURBQUcsTUFBTTs7QUFDL0MsUUFBSSxDQUFDLEdBQUcsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ25DLFdBQU8sQ0FBQyxLQUFLLElBQUksRUFBRTtBQUNqQixTQUFHLElBQUksQ0FBQyxDQUFBO0FBQ1IsVUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixFQUFFLEVBQUU7QUFDbkMsWUFBTSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtBQUNqRCxTQUFDLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQTtBQUNwQixjQUFNLENBQUMsQ0FBQTtPQUNSO0FBQ0QsT0FBQyxHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQTtLQUNoQzs7QUFFRCxnQkFBWSxHQUFHLENBQUMsQ0FBQTtBQUNoQixXQUFPLENBQUMsQ0FBQTtHQUNULENBQUE7O0FBRUQsTUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7QUFDbkIsbUJBQWUsQ0FBQyxHQUFHLEVBQUUsY0FBYyxDQUFDLENBQUE7QUFDcEMseUJBQXFCLEVBQUUsQ0FBQTtBQUN2QixtQkFBZSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO0dBQzFDLE1BQU07QUFDTCxtQkFBZSxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO0FBQ3RDLHlCQUFxQixFQUFFLENBQUE7QUFDdkIsbUJBQWUsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUE7R0FDeEM7O0FBRUQsU0FBTyxHQUFHLENBQUE7Q0FDWCxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL21lcmdlLWNvbmZsaWN0cy9saWIvY29uZmxpY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0VtaXR0ZXJ9IGZyb20gJ2F0b20nXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlLXBsdXMnXG5cbmltcG9ydCB7U2lkZSwgT3VyU2lkZSwgVGhlaXJTaWRlLCBCYXNlU2lkZX0gZnJvbSAnLi9zaWRlJ1xuaW1wb3J0IHtOYXZpZ2F0b3J9IGZyb20gJy4vbmF2aWdhdG9yJ1xuXG4vLyBQdWJsaWM6IE1vZGVsIGFuIGluZGl2aWR1YWwgY29uZmxpY3QgcGFyc2VkIGZyb20gZ2l0J3MgYXV0b21hdGljIGNvbmZsaWN0IHJlc29sdXRpb24gb3V0cHV0LlxuZXhwb3J0IGNsYXNzIENvbmZsaWN0IHtcblxuICAvKlxuICAgKiBQcml2YXRlOiBJbml0aWFsaXplIGEgbmV3IENvbmZsaWN0IHdpdGggaXRzIGNvbnN0aXR1ZW50IFNpZGVzLCBOYXZpZ2F0b3IsIGFuZCB0aGUgTWVyZ2VTdGF0ZVxuICAgKiBpdCBiZWxvbmdzIHRvLlxuICAgKlxuICAgKiBvdXJzIFtTaWRlXSB0aGUgbGluZXMgb2YgdGhpcyBjb25mbGljdCB0aGF0IHRoZSBjdXJyZW50IHVzZXIgY29udHJpYnV0ZWQgKGJ5IG91ciBiZXN0IGd1ZXNzKS5cbiAgICogdGhlaXJzIFtTaWRlXSB0aGUgbGluZXMgb2YgdGhpcyBjb25mbGljdCB0aGF0IGFub3RoZXIgY29udHJpYnV0b3IgY3JlYXRlZC5cbiAgICogYmFzZSBbU2lkZV0gdGhlIGxpbmVzIG9mIG1lcmdlIGJhc2Ugb2YgdGhpcyBjb25mbGljdC4gT3B0aW9uYWwuXG4gICAqIG5hdmlnYXRvciBbTmF2aWdhdG9yXSBtYWludGFpbnMgcmVmZXJlbmNlcyB0byBzdXJyb3VuZGluZyBDb25mbGljdHMgaW4gdGhlIG9yaWdpbmFsIGZpbGUuXG4gICAqIHN0YXRlIFtNZXJnZVN0YXRlXSByZXBvc2l0b3J5LXdpZGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGN1cnJlbnQgbWVyZ2UuXG4gICAqL1xuICBjb25zdHJ1Y3RvciAob3VycywgdGhlaXJzLCBiYXNlLCBuYXZpZ2F0b3IsIG1lcmdlKSB7XG4gICAgdGhpcy5vdXJzID0gb3Vyc1xuICAgIHRoaXMudGhlaXJzID0gdGhlaXJzXG4gICAgdGhpcy5iYXNlID0gYmFzZVxuICAgIHRoaXMubmF2aWdhdG9yID0gbmF2aWdhdG9yXG4gICAgdGhpcy5tZXJnZSA9IG1lcmdlXG5cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG5cbiAgICAvLyBQb3B1bGF0ZSBiYWNrLXJlZmVyZW5jZXNcbiAgICB0aGlzLm91cnMuY29uZmxpY3QgPSB0aGlzXG4gICAgdGhpcy50aGVpcnMuY29uZmxpY3QgPSB0aGlzXG4gICAgaWYgKHRoaXMuYmFzZSkge1xuICAgICAgdGhpcy5iYXNlLmNvbmZsaWN0ID0gdGhpc1xuICAgIH1cbiAgICB0aGlzLm5hdmlnYXRvci5jb25mbGljdCA9IHRoaXNcblxuICAgIC8vIEJlZ2luIHVucmVzb2x2ZWRcbiAgICB0aGlzLnJlc29sdXRpb24gPSBudWxsXG4gIH1cblxuICAvKlxuICAgKiBQdWJsaWM6IEhhcyB0aGlzIGNvbmZsaWN0IGJlZW4gcmVzb2x2ZWQgaW4gYW55IHdheT9cbiAgICpcbiAgICogUmV0dXJuIFtCb29sZWFuXVxuICAgKi9cbiAgaXNSZXNvbHZlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXNvbHV0aW9uICE9PSBudWxsXG4gIH1cblxuICAvKlxuICAgKiBQdWJsaWM6IEF0dGFjaCBhbiBldmVudCBoYW5kbGVyIHRvIGJlIG5vdGlmaWVkIHdoZW4gdGhpcyBjb25mbGljdCBpcyByZXNvbHZlZC5cbiAgICpcbiAgICogY2FsbGJhY2sgW0Z1bmN0aW9uXVxuICAgKi9cbiAgb25EaWRSZXNvbHZlQ29uZmxpY3QgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbigncmVzb2x2ZS1jb25mbGljdCcsIGNhbGxiYWNrKVxuICB9XG5cbiAgLypcbiAgICogUHVibGljOiBTcGVjaWZ5IHdoaWNoIFNpZGUgaXMgdG8gYmUga2VwdC4gTm90ZSB0aGF0IGVpdGhlciBzaWRlIG1heSBoYXZlIGJlZW4gbW9kaWZpZWQgYnkgdGhlXG4gICAqIHVzZXIgcHJpb3IgdG8gcmVzb2x1dGlvbi4gTm90aWZ5IGFueSBzdWJzY3JpYmVycy5cbiAgICpcbiAgICogc2lkZSBbU2lkZV0gb3VyIGNoYW5nZXMgb3IgdGhlaXIgY2hhbmdlcy5cbiAgICovXG4gIHJlc29sdmVBcyAoc2lkZSkge1xuICAgIHRoaXMucmVzb2x1dGlvbiA9IHNpZGVcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgncmVzb2x2ZS1jb25mbGljdCcpXG4gIH1cblxuICAvKlxuICAgKiBQdWJsaWM6IExvY2F0ZSB0aGUgcG9zaXRpb24gdGhhdCB0aGUgZWRpdG9yIHNob3VsZCBzY3JvbGwgdG8gaW4gb3JkZXIgdG8gbWFrZSB0aGlzIGNvbmZsaWN0XG4gICAqIHZpc2libGUuXG4gICAqXG4gICAqIFJldHVybiBbUG9pbnRdIGJ1ZmZlciBjb29yZGluYXRlc1xuICAgKi9cbiAgc2Nyb2xsVGFyZ2V0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5vdXJzLm1hcmtlci5nZXRUYWlsQnVmZmVyUG9zaXRpb24oKVxuICB9XG5cbiAgLypcbiAgICogUHVibGljOiBBdWRpdCBhbGwgTWFya2VyIGluc3RhbmNlcyBvd25lZCBieSBzdWJvYmplY3RzIHdpdGhpbiB0aGlzIENvbmZsaWN0LlxuICAgKlxuICAgKiBSZXR1cm4gW0FycmF5PE1hcmtlcj5dXG4gICAqL1xuICBtYXJrZXJzICgpIHtcbiAgICBjb25zdCBtcyA9IFt0aGlzLm91cnMubWFya2VycygpLCB0aGlzLnRoZWlycy5tYXJrZXJzKCksIHRoaXMubmF2aWdhdG9yLm1hcmtlcnMoKV1cbiAgICBpZiAodGhpcy5iYXNlU2lkZSkge1xuICAgICAgbXMucHVzaCh0aGlzLmJhc2VTaWRlLm1hcmtlcnMoKSlcbiAgICB9XG4gICAgcmV0dXJuIF8uZmxhdHRlbihtcywgdHJ1ZSlcbiAgfVxuXG4gIC8qXG4gICAqIFB1YmxpYzogQ29uc29sZS1mcmllbmRseSBpZGVudGlmaWNhdGlvbiBvZiB0aGlzIGNvbmZsaWN0LlxuICAgKlxuICAgKiBSZXR1cm4gW1N0cmluZ10gdGhhdCBkaXN0aW5ndWlzaGVzIHRoaXMgY29uZmxpY3QgZnJvbSBvdGhlcnMuXG4gICAqL1xuICB0b1N0cmluZyAoKSB7XG4gICAgcmV0dXJuIGBbY29uZmxpY3Q6ICR7dGhpcy5vdXJzfSAke3RoaXMudGhlaXJzfV1gXG4gIH1cblxuICAvKlxuICAgKiBQdWJsaWM6IFBhcnNlIGFueSBjb25mbGljdCBtYXJrZXJzIGluIGEgVGV4dEVkaXRvcidzIGJ1ZmZlciBhbmQgcmV0dXJuIGEgQ29uZmxpY3QgdGhhdCBjb250YWluc1xuICAgKiBtYXJrZXJzIGNvcnJlc3BvbmRpbmcgdG8gZWFjaC5cbiAgICpcbiAgICogbWVyZ2UgW01lcmdlU3RhdGVdIFJlcG9zaXRvcnktd2lkZSBzdGF0ZSBvZiB0aGUgbWVyZ2UuXG4gICAqIGVkaXRvciBbVGV4dEVkaXRvcl0gVGhlIGVkaXRvciB0byBzZWFyY2guXG4gICAqIHJldHVybiBbQXJyYXk8Q29uZmxpY3Q+XSBBIChwb3NzaWJseSBlbXB0eSkgY29sbGVjdGlvbiBvZiBwYXJzZWQgQ29uZmxpY3RzLlxuICAgKi9cbiAgc3RhdGljIGFsbCAobWVyZ2UsIGVkaXRvcikge1xuICAgIGNvbnN0IGNvbmZsaWN0cyA9IFtdXG4gICAgbGV0IGxhc3RSb3cgPSAtMVxuXG4gICAgZWRpdG9yLmdldEJ1ZmZlcigpLnNjYW4oQ09ORkxJQ1RfU1RBUlRfUkVHRVgsIChtKSA9PiB7XG4gICAgICBjb25mbGljdFN0YXJ0Um93ID0gbS5yYW5nZS5zdGFydC5yb3dcbiAgICAgIGlmIChjb25mbGljdFN0YXJ0Um93IDwgbGFzdFJvdykge1xuICAgICAgICAvLyBNYXRjaCB3aXRoaW4gYW4gYWxyZWFkeS1wYXJzZWQgY29uZmxpY3QuXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCB2aXNpdG9yID0gbmV3IENvbmZsaWN0VmlzaXRvcihtZXJnZSwgZWRpdG9yKVxuXG4gICAgICB0cnkge1xuICAgICAgICBsYXN0Um93ID0gcGFyc2VDb25mbGljdChtZXJnZSwgZWRpdG9yLCBjb25mbGljdFN0YXJ0Um93LCB2aXNpdG9yKVxuICAgICAgICBjb25zdCBjb25mbGljdCA9IHZpc2l0b3IuY29uZmxpY3QoKVxuXG4gICAgICAgIGlmIChjb25mbGljdHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbmZsaWN0Lm5hdmlnYXRvci5saW5rVG9QcmV2aW91cyhjb25mbGljdHNbY29uZmxpY3RzLmxlbmd0aCAtIDFdKVxuICAgICAgICB9XG4gICAgICAgIGNvbmZsaWN0cy5wdXNoKGNvbmZsaWN0KVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoIWUucGFyc2VyU3RhdGUpIHRocm93IGVcblxuICAgICAgICBpZiAoIWF0b20uaW5TcGVjTW9kZSgpKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihgVW5hYmxlIHRvIHBhcnNlIGNvbmZsaWN0OiAke2UubWVzc2FnZX1cXG4ke2Uuc3RhY2t9YClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gY29uZmxpY3RzXG4gIH1cbn1cblxuLy8gUmVndWxhciBleHByZXNzaW9uIHRoYXQgbWF0Y2hlcyB0aGUgYmVnaW5uaW5nIG9mIGEgcG90ZW50aWFsIGNvbmZsaWN0LlxuY29uc3QgQ09ORkxJQ1RfU1RBUlRfUkVHRVggPSAvXjx7N30gKC4rKVxccj9cXG4vZ1xuXG4vLyBTaWRlIHBvc2l0aW9ucy5cbmNvbnN0IFRPUCA9ICd0b3AnXG5jb25zdCBCQVNFID0gJ2Jhc2UnXG5jb25zdCBCT1RUT00gPSAnYm90dG9tJ1xuXG4vLyBPcHRpb25zIHVzZWQgdG8gaW5pdGlhbGl6ZSBtYXJrZXJzLlxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgcGVyc2lzdGVudDogZmFsc2UsXG4gIGludmFsaWRhdGU6ICduZXZlcidcbn1cblxuLypcbiAqIFByaXZhdGU6IGNvbmZsaWN0IHBhcnNlciB2aXNpdG9yIHRoYXQgaWdub3JlcyBhbGwgZXZlbnRzLlxuICovXG5jbGFzcyBOb29wVmlzaXRvciB7XG5cbiAgdmlzaXRPdXJTaWRlIChwb3NpdGlvbiwgYmFubmVyUm93LCB0ZXh0Um93U3RhcnQsIHRleHRSb3dFbmQpIHsgfVxuXG4gIHZpc2l0QmFzZVNpZGUgKHBvc2l0aW9uLCBiYW5uZXJSb3csIHRleHRSb3dTdGFydCwgdGV4dFJvd0VuZCkgeyB9XG5cbiAgdmlzaXRTZXBhcmF0b3IgKHNlcFJvd1N0YXJ0LCBzZXBSb3dFbmQpIHsgfVxuXG4gIHZpc2l0VGhlaXJTaWRlIChwb3NpdGlvbiwgYmFubmVyUm93LCB0ZXh0Um93U3RhcnQsIHRleHRSb3dFbmQpIHsgfVxuXG59XG5cbi8qXG4gKiBQcml2YXRlOiBjb25mbGljdCBwYXJzZXIgdmlzaXRvciB0aGF0IG1hcmtzIGVhY2ggYnVmZmVyIHJhbmdlIGFuZCBhc3NlbWJsZXMgYSBDb25mbGljdCBmcm9tIHRoZVxuICogcGllY2VzLlxuICovXG5jbGFzcyBDb25mbGljdFZpc2l0b3Ige1xuXG4gIC8qXG4gICAqIG1lcmdlIC0gW01lcmdlU3RhdGVdIHBhc3NlZCB0byBlYWNoIGluc3RhbnRpYXRlZCBTaWRlLlxuICAgKiBlZGl0b3IgLSBbVGV4dEVkaXRvcl0gZGlzcGxheWluZyB0aGUgY29uZmxpY3RpbmcgdGV4dC5cbiAgICovXG4gIGNvbnN0cnVjdG9yIChtZXJnZSwgZWRpdG9yKSB7XG4gICAgdGhpcy5tZXJnZSA9IG1lcmdlXG4gICAgdGhpcy5lZGl0b3IgPSBlZGl0b3JcbiAgICB0aGlzLnByZXZpb3VzU2lkZSA9IG51bGxcblxuICAgIHRoaXMub3VyU2lkZSA9IG51bGxcbiAgICB0aGlzLmJhc2VTaWRlID0gbnVsbFxuICAgIHRoaXMubmF2aWdhdG9yID0gbnVsbFxuICB9XG5cbiAgLypcbiAgICogcG9zaXRpb24gLSBbU3RyaW5nXSBvbmUgb2YgVE9QIG9yIEJPVFRPTS5cbiAgICogYmFubmVyUm93IC0gW0ludGVnZXJdIG9mIHRoZSBidWZmZXIgcm93IHRoYXQgY29udGFpbnMgb3VyIHNpZGUncyBiYW5uZXIuXG4gICAqIHRleHRSb3dTdGFydCAtIFtJbnRlZ2VyXSBvZiB0aGUgZmlyc3QgYnVmZmVyIHJvdyB0aGF0IGNvbnRhaW4gdGhpcyBzaWRlJ3MgdGV4dC5cbiAgICogdGV4dFJvd0VuZCAtIFtJbnRlZ2VyXSBvZiB0aGUgZmlyc3QgYnVmZmVyIHJvdyBiZXlvbmQgdGhlIGV4dGVuZCBvZiB0aGlzIHNpZGUncyB0ZXh0LlxuICAgKi9cbiAgdmlzaXRPdXJTaWRlIChwb3NpdGlvbiwgYmFubmVyUm93LCB0ZXh0Um93U3RhcnQsIHRleHRSb3dFbmQpIHtcbiAgICB0aGlzLm91clNpZGUgPSB0aGlzLm1hcmtTaWRlKHBvc2l0aW9uLCBPdXJTaWRlLCBiYW5uZXJSb3csIHRleHRSb3dTdGFydCwgdGV4dFJvd0VuZClcbiAgfVxuXG4gIC8qXG4gICAqIGJhbm5lclJvdyAtIFtJbnRlZ2VyXSB0aGUgYnVmZmVyIHJvdyB0aGF0IGNvbnRhaW5zIG91ciBzaWRlJ3MgYmFubmVyLlxuICAgKiB0ZXh0Um93U3RhcnQgLSBbSW50ZWdlcl0gZmlyc3QgYnVmZmVyIHJvdyB0aGF0IGNvbnRhaW4gdGhpcyBzaWRlJ3MgdGV4dC5cbiAgICogdGV4dFJvd0VuZCAtIFtJbnRlZ2VyXSBmaXJzdCBidWZmZXIgcm93IGJleW9uZCB0aGUgZXh0ZW5kIG9mIHRoaXMgc2lkZSdzIHRleHQuXG4gICAqL1xuICB2aXNpdEJhc2VTaWRlIChiYW5uZXJSb3csIHRleHRSb3dTdGFydCwgdGV4dFJvd0VuZCkge1xuICAgIHRoaXMuYmFzZVNpZGUgPSB0aGlzLm1hcmtTaWRlKEJBU0UsIEJhc2VTaWRlLCBiYW5uZXJSb3csIHRleHRSb3dTdGFydCwgdGV4dFJvd0VuZClcbiAgfVxuXG4gIC8qXG4gICAqIHNlcFJvd1N0YXJ0IC0gW0ludGVnZXJdIGJ1ZmZlciByb3cgdGhhdCBjb250YWlucyB0aGUgXCI9PT09PT09XCIgc2VwYXJhdG9yLlxuICAgKiBzZXBSb3dFbmQgLSBbSW50ZWdlcl0gdGhlIGJ1ZmZlciByb3cgYWZ0ZXIgdGhlIHNlcGFyYXRvci5cbiAgICovXG4gIHZpc2l0U2VwYXJhdG9yIChzZXBSb3dTdGFydCwgc2VwUm93RW5kKSB7XG4gICAgY29uc3QgbWFya2VyID0gdGhpcy5lZGl0b3IubWFya0J1ZmZlclJhbmdlKFtbc2VwUm93U3RhcnQsIDBdLCBbc2VwUm93RW5kLCAwXV0sIG9wdGlvbnMpXG4gICAgdGhpcy5wcmV2aW91c1NpZGUuZm9sbG93aW5nTWFya2VyID0gbWFya2VyXG5cbiAgICB0aGlzLm5hdmlnYXRvciA9IG5ldyBOYXZpZ2F0b3IobWFya2VyKVxuICAgIHRoaXMucHJldmlvdXNTaWRlID0gdGhpcy5uYXZpZ2F0b3JcbiAgfVxuXG4gIC8qXG4gICAqIHBvc2l0aW9uIC0gW1N0cmluZ10gQWx3YXlzIEJBU0U7IGFjY2VwdGVkIGZvciBjb25zaXN0ZW5jeS5cbiAgICogYmFubmVyUm93IC0gW0ludGVnZXJdIHRoZSBidWZmZXIgcm93IHRoYXQgY29udGFpbnMgb3VyIHNpZGUncyBiYW5uZXIuXG4gICAqIHRleHRSb3dTdGFydCAtIFtJbnRlZ2VyXSBmaXJzdCBidWZmZXIgcm93IHRoYXQgY29udGFpbiB0aGlzIHNpZGUncyB0ZXh0LlxuICAgKiB0ZXh0Um93RW5kIC0gW0ludGVnZXJdIGZpcnN0IGJ1ZmZlciByb3cgYmV5b25kIHRoZSBleHRlbmQgb2YgdGhpcyBzaWRlJ3MgdGV4dC5cbiAgICovXG4gIHZpc2l0VGhlaXJTaWRlIChwb3NpdGlvbiwgYmFubmVyUm93LCB0ZXh0Um93U3RhcnQsIHRleHRSb3dFbmQpIHtcbiAgICB0aGlzLnRoZWlyU2lkZSA9IHRoaXMubWFya1NpZGUocG9zaXRpb24sIFRoZWlyU2lkZSwgYmFubmVyUm93LCB0ZXh0Um93U3RhcnQsIHRleHRSb3dFbmQpXG4gIH1cblxuICBtYXJrU2lkZSAocG9zaXRpb24sIHNpZGVLbGFzcywgYmFubmVyUm93LCB0ZXh0Um93U3RhcnQsIHRleHRSb3dFbmQpIHtcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHRoaXMuc2lkZURlc2NyaXB0aW9uKGJhbm5lclJvdylcblxuICAgIGNvbnN0IGJhbm5lck1hcmtlciA9IHRoaXMuZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShbW2Jhbm5lclJvdywgMF0sIFtiYW5uZXJSb3cgKyAxLCAwXV0sIG9wdGlvbnMpXG5cbiAgICBpZiAodGhpcy5wcmV2aW91c1NpZGUpIHtcbiAgICAgIHRoaXMucHJldmlvdXNTaWRlLmZvbGxvd2luZ01hcmtlciA9IGJhbm5lck1hcmtlclxuICAgIH1cblxuICAgIGNvbnN0IHRleHRSYW5nZSA9IFtbdGV4dFJvd1N0YXJ0LCAwXSwgW3RleHRSb3dFbmQsIDBdXVxuICAgIGNvbnN0IHRleHRNYXJrZXIgPSB0aGlzLmVkaXRvci5tYXJrQnVmZmVyUmFuZ2UodGV4dFJhbmdlLCBvcHRpb25zKVxuICAgIGNvbnN0IHRleHQgPSB0aGlzLmVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZSh0ZXh0UmFuZ2UpXG5cbiAgICBjb25zdCBzaWRlID0gbmV3IHNpZGVLbGFzcyh0ZXh0LCBkZXNjcmlwdGlvbiwgdGV4dE1hcmtlciwgYmFubmVyTWFya2VyLCBwb3NpdGlvbilcbiAgICB0aGlzLnByZXZpb3VzU2lkZSA9IHNpZGVcbiAgICByZXR1cm4gc2lkZVxuICB9XG5cbiAgLypcbiAgICogUGFyc2UgdGhlIGJhbm5lciBkZXNjcmlwdGlvbiBmb3IgdGhlIGN1cnJlbnQgc2lkZSBmcm9tIGEgYmFubmVyIHJvdy5cbiAgICovXG4gIHNpZGVEZXNjcmlwdGlvbiAoYmFubmVyUm93KSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGJhbm5lclJvdykubWF0Y2goL15bPHw+XXs3fSAoLiopJC8pWzFdXG4gIH1cblxuICBjb25mbGljdCAoKSB7XG4gICAgdGhpcy5wcmV2aW91c1NpZGUuZm9sbG93aW5nTWFya2VyID0gdGhpcy5wcmV2aW91c1NpZGUucmVmQmFubmVyTWFya2VyXG5cbiAgICByZXR1cm4gbmV3IENvbmZsaWN0KHRoaXMub3VyU2lkZSwgdGhpcy50aGVpclNpZGUsIHRoaXMuYmFzZVNpZGUsIHRoaXMubmF2aWdhdG9yLCB0aGlzLm1lcmdlKVxuICB9XG5cbn1cblxuLypcbiAqIFByaXZhdGU6IHBhcnNlQ29uZmxpY3QgZGlzY292ZXJzIGdpdCBjb25mbGljdCBtYXJrZXJzIGluIGEgY29ycHVzIG9mIHRleHQgYW5kIGNvbnN0cnVjdHMgQ29uZmxpY3RcbiAqIGluc3RhbmNlcyB0aGF0IG1hcmsgdGhlIGNvcnJlY3QgbGluZXMuXG4gKlxuICogUmV0dXJucyBbSW50ZWdlcl0gdGhlIGJ1ZmZlciByb3cgYWZ0ZXIgdGhlIGZpbmFsIDw8PDw8PCBib3VuZGFyeS5cbiAqL1xuY29uc3QgcGFyc2VDb25mbGljdCA9IGZ1bmN0aW9uIChtZXJnZSwgZWRpdG9yLCByb3csIHZpc2l0b3IpIHtcbiAgbGV0IGxhc3RCb3VuZGFyeSA9IG51bGxcblxuICAvLyBWaXNpdCBhIHNpZGUgdGhhdCBiZWdpbnMgd2l0aCBhIGJhbm5lciBhbmQgZGVzY3JpcHRpb24gYXMgaXRzIGZpcnN0IGxpbmUuXG4gIGNvbnN0IHZpc2l0SGVhZGVyU2lkZSA9IChwb3NpdGlvbiwgdmlzaXRNZXRob2QpID0+IHtcbiAgICBjb25zdCBzaWRlUm93U3RhcnQgPSByb3dcbiAgICByb3cgKz0gMVxuICAgIGFkdmFuY2VUb0JvdW5kYXJ5KCd8PScpXG4gICAgY29uc3Qgc2lkZVJvd0VuZCA9IHJvd1xuXG4gICAgdmlzaXRvclt2aXNpdE1ldGhvZF0ocG9zaXRpb24sIHNpZGVSb3dTdGFydCwgc2lkZVJvd1N0YXJ0ICsgMSwgc2lkZVJvd0VuZClcbiAgfVxuXG4gIC8vIFZpc2l0IHRoZSBiYXNlIHNpZGUgZnJvbSBkaWZmMyBvdXRwdXQsIGlmIG9uZSBpcyBwcmVzZW50LCB0aGVuIHZpc2l0IHRoZSBzZXBhcmF0b3IuXG4gIGNvbnN0IHZpc2l0QmFzZUFuZFNlcGFyYXRvciA9ICgpID0+IHtcbiAgICBpZiAobGFzdEJvdW5kYXJ5ID09PSAnfCcpIHtcbiAgICAgIHZpc2l0QmFzZVNpZGUoKVxuICAgIH1cblxuICAgIHZpc2l0U2VwYXJhdG9yKClcbiAgfVxuXG4gIC8vIFZpc2l0IGEgYmFzZSBzaWRlIGZyb20gZGlmZjMgb3V0cHV0LlxuICBjb25zdCB2aXNpdEJhc2VTaWRlID0gKCkgPT4ge1xuICAgIGNvbnN0IHNpZGVSb3dTdGFydCA9IHJvd1xuICAgIHJvdyArPSAxXG5cbiAgICBsZXQgYiA9IGFkdmFuY2VUb0JvdW5kYXJ5KCc8PScpXG4gICAgd2hpbGUgKGIgPT09ICc8Jykge1xuICAgICAgLy8gRW1iZWRkZWQgcmVjdXJzaXZlIGNvbmZsaWN0IHdpdGhpbiBhIGJhc2Ugc2lkZSwgY2F1c2VkIGJ5IGEgY3Jpc3MtY3Jvc3MgbWVyZ2UuXG4gICAgICAvLyBBZHZhbmNlIGJleW9uZCBpdCB3aXRob3V0IG1hcmtpbmcgYW55dGhpbmcuXG4gICAgICByb3cgPSBwYXJzZUNvbmZsaWN0KG1lcmdlLCBlZGl0b3IsIHJvdywgbmV3IE5vb3BWaXNpdG9yKCkpXG4gICAgICBiID0gYWR2YW5jZVRvQm91bmRhcnkoJzw9JylcbiAgICB9XG5cbiAgICBjb25zdCBzaWRlUm93RW5kID0gcm93XG5cbiAgICB2aXNpdG9yLnZpc2l0QmFzZVNpZGUoc2lkZVJvd1N0YXJ0LCBzaWRlUm93U3RhcnQgKyAxLCBzaWRlUm93RW5kKVxuICB9XG5cbiAgLy8gVmlzaXQgYSBcIj09PT09PT09XCIgc2VwYXJhdG9yLlxuICBjb25zdCB2aXNpdFNlcGFyYXRvciA9ICgpID0+IHtcbiAgICBjb25zdCBzZXBSb3dTdGFydCA9IHJvd1xuICAgIHJvdyArPSAxXG4gICAgY29uc3Qgc2VwUm93RW5kID0gcm93XG5cbiAgICB2aXNpdG9yLnZpc2l0U2VwYXJhdG9yKHNlcFJvd1N0YXJ0LCBzZXBSb3dFbmQpXG4gIH1cblxuICAvLyBWaWRpZSBhIHNpZGUgd2l0aCBhIGJhbm5lciBhbmQgZGVzY3JpcHRpb24gYXMgaXRzIGxhc3QgbGluZS5cbiAgY29uc3QgdmlzaXRGb290ZXJTaWRlID0gKHBvc2l0aW9uLCB2aXNpdE1ldGhvZCkgPT4ge1xuICAgIGNvbnN0IHNpZGVSb3dTdGFydCA9IHJvd1xuICAgIGNvbnN0IGIgPSBhZHZhbmNlVG9Cb3VuZGFyeSgnPicpXG4gICAgcm93ICs9IDFcbiAgICBzaWRlUm93RW5kID0gcm93XG5cbiAgICB2aXNpdG9yW3Zpc2l0TWV0aG9kXShwb3NpdGlvbiwgc2lkZVJvd0VuZCAtIDEsIHNpZGVSb3dTdGFydCwgc2lkZVJvd0VuZCAtIDEpXG4gIH1cblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGN1cnJlbnQgcm93IGlzIGEgc2lkZSBib3VuZGFyeS5cbiAgLy9cbiAgLy8gYm91bmRhcnlLaW5kcyAtIFtTdHJpbmddIGFueSBjb21iaW5hdGlvbiBvZiA8LCB8LCA9LCBvciA+IHRvIGxpbWl0IHRoZSBraW5kcyBvZiBib3VuZGFyeVxuICAvLyAgIGRldGVjdGVkLlxuICAvL1xuICAvLyBSZXR1cm5zIHRoZSBtYXRjaGluZyBib3VuZGFyeUtpbmRzIGNoYXJhY3Rlciwgb3IgYG51bGxgIGlmIG5vbmUgbWF0Y2guXG4gIGNvbnN0IGlzQXRCb3VuZGFyeSA9IChib3VuZGFyeUtpbmRzID0gJzx8PT4nKSA9PiB7XG4gICAgY29uc3QgbGluZSA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhyb3cpXG4gICAgZm9yIChiIG9mIGJvdW5kYXJ5S2luZHMpIHtcbiAgICAgIGlmIChsaW5lLnN0YXJ0c1dpdGgoYi5yZXBlYXQoNykpKSB7XG4gICAgICAgIHJldHVybiBiXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICAvLyBJbmNyZW1lbnQgdGhlIGN1cnJlbnQgcm93IHVudGlsIHRoZSBjdXJyZW50IGxpbmUgbWF0Y2hlcyBvbmUgb2YgdGhlIHByb3ZpZGVkIGJvdW5kYXJ5IGtpbmRzLFxuICAvLyBvciB1bnRpbCB0aGVyZSBhcmUgbm8gbW9yZSBsaW5lcyBpbiB0aGUgZWRpdG9yLlxuICAvL1xuICAvLyBib3VuZGFyeUtpbmRzIC0gW1N0cmluZ10gYW55IGNvbWJpbmF0aW9uIG9mIDwsIHwsID0sIG9yID4gdG8gbGltaXQgdGhlIGtpbmRzIG9mIGJvdW5kYXJpZXNcbiAgLy8gICB0aGF0IGhhbHQgdGhlIHByb2dyZXNzaW9uLlxuICAvL1xuICAvLyBSZXR1cm5zIHRoZSBtYXRjaGluZyBib3VuZGFyeUtpbmRzIGNoYXJhY3Rlciwgb3IgJ251bGwnIGlmIHRoZXJlIGFyZSBubyBtYXRjaGVzIHRvIHRoZSBlbmQgb2ZcbiAgLy8gdGhlIGVkaXRvci5cbiAgY29uc3QgYWR2YW5jZVRvQm91bmRhcnkgPSAoYm91bmRhcnlLaW5kcyA9ICc8fD0+JykgPT4ge1xuICAgIGxldCBiID0gaXNBdEJvdW5kYXJ5KGJvdW5kYXJ5S2luZHMpXG4gICAgd2hpbGUgKGIgPT09IG51bGwpIHtcbiAgICAgIHJvdyArPSAxXG4gICAgICBpZiAocm93ID4gZWRpdG9yLmdldExhc3RCdWZmZXJSb3coKSkge1xuICAgICAgICBjb25zdCBlID0gbmV3IEVycm9yKCdVbnRlcm1pbmF0ZWQgY29uZmxpY3Qgc2lkZScpXG4gICAgICAgIGUucGFyc2VyU3RhdGUgPSB0cnVlXG4gICAgICAgIHRocm93IGVcbiAgICAgIH1cbiAgICAgIGIgPSBpc0F0Qm91bmRhcnkoYm91bmRhcnlLaW5kcylcbiAgICB9XG5cbiAgICBsYXN0Qm91bmRhcnkgPSBiXG4gICAgcmV0dXJuIGJcbiAgfVxuXG4gIGlmICghbWVyZ2UuaXNSZWJhc2UpIHtcbiAgICB2aXNpdEhlYWRlclNpZGUoVE9QLCAndmlzaXRPdXJTaWRlJylcbiAgICB2aXNpdEJhc2VBbmRTZXBhcmF0b3IoKVxuICAgIHZpc2l0Rm9vdGVyU2lkZShCT1RUT00sICd2aXNpdFRoZWlyU2lkZScpXG4gIH0gZWxzZSB7XG4gICAgdmlzaXRIZWFkZXJTaWRlKFRPUCwgJ3Zpc2l0VGhlaXJTaWRlJylcbiAgICB2aXNpdEJhc2VBbmRTZXBhcmF0b3IoKVxuICAgIHZpc2l0Rm9vdGVyU2lkZShCT1RUT00sICd2aXNpdE91clNpZGUnKVxuICB9XG5cbiAgcmV0dXJuIHJvd1xufVxuIl19