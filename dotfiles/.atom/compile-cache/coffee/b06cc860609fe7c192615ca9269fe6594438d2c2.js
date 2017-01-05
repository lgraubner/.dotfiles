(function() {
  var ColorBuffer, ColorBufferElement, ColorMarker, ColorMarkerElement, ColorProject, ColorProjectElement, ColorResultsElement, ColorSearch, Disposable, Palette, PaletteElement, PigmentsAPI, PigmentsProvider, VariablesCollection, ref, uris, url;

  ref = [], Palette = ref[0], PaletteElement = ref[1], ColorSearch = ref[2], ColorResultsElement = ref[3], ColorProject = ref[4], ColorProjectElement = ref[5], ColorBuffer = ref[6], ColorBufferElement = ref[7], ColorMarker = ref[8], ColorMarkerElement = ref[9], VariablesCollection = ref[10], PigmentsProvider = ref[11], PigmentsAPI = ref[12], Disposable = ref[13], url = ref[14], uris = ref[15];

  module.exports = {
    activate: function(state) {
      var convertMethod, copyMethod;
      if (ColorProject == null) {
        ColorProject = require('./color-project');
      }
      this.patchAtom();
      this.project = state.project != null ? ColorProject.deserialize(state.project) : new ColorProject();
      atom.commands.add('atom-workspace', {
        'pigments:find-colors': (function(_this) {
          return function() {
            return _this.findColors();
          };
        })(this),
        'pigments:show-palette': (function(_this) {
          return function() {
            return _this.showPalette();
          };
        })(this),
        'pigments:project-settings': (function(_this) {
          return function() {
            return _this.showSettings();
          };
        })(this),
        'pigments:reload': (function(_this) {
          return function() {
            return _this.reloadProjectVariables();
          };
        })(this),
        'pigments:report': (function(_this) {
          return function() {
            return _this.createPigmentsReport();
          };
        })(this)
      });
      convertMethod = (function(_this) {
        return function(action) {
          return function(event) {
            var colorBuffer, editor;
            if (_this.lastEvent != null) {
              action(_this.colorMarkerForMouseEvent(_this.lastEvent));
            } else {
              editor = atom.workspace.getActiveTextEditor();
              colorBuffer = _this.project.colorBufferForEditor(editor);
              editor.getCursors().forEach(function(cursor) {
                var marker;
                marker = colorBuffer.getColorMarkerAtBufferPosition(cursor.getBufferPosition());
                return action(marker);
              });
            }
            return _this.lastEvent = null;
          };
        };
      })(this);
      copyMethod = (function(_this) {
        return function(action) {
          return function(event) {
            var colorBuffer, cursor, editor, marker;
            if (_this.lastEvent != null) {
              action(_this.colorMarkerForMouseEvent(_this.lastEvent));
            } else {
              editor = atom.workspace.getActiveTextEditor();
              colorBuffer = _this.project.colorBufferForEditor(editor);
              cursor = editor.getLastCursor();
              marker = colorBuffer.getColorMarkerAtBufferPosition(cursor.getBufferPosition());
              action(marker);
            }
            return _this.lastEvent = null;
          };
        };
      })(this);
      atom.commands.add('atom-text-editor', {
        'pigments:convert-to-hex': convertMethod(function(marker) {
          if (marker != null) {
            return marker.convertContentToHex();
          }
        }),
        'pigments:convert-to-rgb': convertMethod(function(marker) {
          if (marker != null) {
            return marker.convertContentToRGB();
          }
        }),
        'pigments:convert-to-rgba': convertMethod(function(marker) {
          if (marker != null) {
            return marker.convertContentToRGBA();
          }
        }),
        'pigments:convert-to-hsl': convertMethod(function(marker) {
          if (marker != null) {
            return marker.convertContentToHSL();
          }
        }),
        'pigments:convert-to-hsla': convertMethod(function(marker) {
          if (marker != null) {
            return marker.convertContentToHSLA();
          }
        }),
        'pigments:copy-as-hex': copyMethod(function(marker) {
          if (marker != null) {
            return marker.copyContentAsHex();
          }
        }),
        'pigments:copy-as-rgb': copyMethod(function(marker) {
          if (marker != null) {
            return marker.copyContentAsRGB();
          }
        }),
        'pigments:copy-as-rgba': copyMethod(function(marker) {
          if (marker != null) {
            return marker.copyContentAsRGBA();
          }
        }),
        'pigments:copy-as-hsl': copyMethod(function(marker) {
          if (marker != null) {
            return marker.copyContentAsHSL();
          }
        }),
        'pigments:copy-as-hsla': copyMethod(function(marker) {
          if (marker != null) {
            return marker.copyContentAsHSLA();
          }
        })
      });
      atom.workspace.addOpener((function(_this) {
        return function(uriToOpen) {
          var host, protocol, ref1;
          url || (url = require('url'));
          ref1 = url.parse(uriToOpen), protocol = ref1.protocol, host = ref1.host;
          if (protocol !== 'pigments:') {
            return;
          }
          switch (host) {
            case 'search':
              return _this.project.findAllColors();
            case 'palette':
              return _this.project.getPalette();
            case 'settings':
              return atom.views.getView(_this.project);
          }
        };
      })(this));
      return atom.contextMenu.add({
        'atom-text-editor': [
          {
            label: 'Pigments',
            submenu: [
              {
                label: 'Convert to hexadecimal',
                command: 'pigments:convert-to-hex'
              }, {
                label: 'Convert to RGB',
                command: 'pigments:convert-to-rgb'
              }, {
                label: 'Convert to RGBA',
                command: 'pigments:convert-to-rgba'
              }, {
                label: 'Convert to HSL',
                command: 'pigments:convert-to-hsl'
              }, {
                label: 'Convert to HSLA',
                command: 'pigments:convert-to-hsla'
              }, {
                type: 'separator'
              }, {
                label: 'Copy as hexadecimal',
                command: 'pigments:copy-as-hex'
              }, {
                label: 'Copy as RGB',
                command: 'pigments:copy-as-rgb'
              }, {
                label: 'Copy as RGBA',
                command: 'pigments:copy-as-rgba'
              }, {
                label: 'Copy as HSL',
                command: 'pigments:copy-as-hsl'
              }, {
                label: 'Copy as HSLA',
                command: 'pigments:copy-as-hsla'
              }
            ],
            shouldDisplay: (function(_this) {
              return function(event) {
                return _this.shouldDisplayContextMenu(event);
              };
            })(this)
          }
        ]
      });
    },
    deactivate: function() {
      var ref1;
      return (ref1 = this.getProject()) != null ? typeof ref1.destroy === "function" ? ref1.destroy() : void 0 : void 0;
    },
    provideAutocomplete: function() {
      if (PigmentsProvider == null) {
        PigmentsProvider = require('./pigments-provider');
      }
      return new PigmentsProvider(this);
    },
    provideAPI: function() {
      if (PigmentsAPI == null) {
        PigmentsAPI = require('./pigments-api');
      }
      return new PigmentsAPI(this.getProject());
    },
    consumeColorPicker: function(api) {
      if (Disposable == null) {
        Disposable = require('atom').Disposable;
      }
      this.getProject().setColorPickerAPI(api);
      return new Disposable((function(_this) {
        return function() {
          return _this.getProject().setColorPickerAPI(null);
        };
      })(this));
    },
    consumeColorExpressions: function(options) {
      var handle, name, names, priority, regexpString, registry, scopes;
      if (options == null) {
        options = {};
      }
      if (Disposable == null) {
        Disposable = require('atom').Disposable;
      }
      registry = this.getProject().getColorExpressionsRegistry();
      if (options.expressions != null) {
        names = options.expressions.map(function(e) {
          return e.name;
        });
        registry.createExpressions(options.expressions);
        return new Disposable(function() {
          var j, len, name, results;
          results = [];
          for (j = 0, len = names.length; j < len; j++) {
            name = names[j];
            results.push(registry.removeExpression(name));
          }
          return results;
        });
      } else {
        name = options.name, regexpString = options.regexpString, handle = options.handle, scopes = options.scopes, priority = options.priority;
        registry.createExpression(name, regexpString, priority, scopes, handle);
        return new Disposable(function() {
          return registry.removeExpression(name);
        });
      }
    },
    consumeVariableExpressions: function(options) {
      var handle, name, names, priority, regexpString, registry, scopes;
      if (options == null) {
        options = {};
      }
      if (Disposable == null) {
        Disposable = require('atom').Disposable;
      }
      registry = this.getProject().getVariableExpressionsRegistry();
      if (options.expressions != null) {
        names = options.expressions.map(function(e) {
          return e.name;
        });
        registry.createExpressions(options.expressions);
        return new Disposable(function() {
          var j, len, name, results;
          results = [];
          for (j = 0, len = names.length; j < len; j++) {
            name = names[j];
            results.push(registry.removeExpression(name));
          }
          return results;
        });
      } else {
        name = options.name, regexpString = options.regexpString, handle = options.handle, scopes = options.scopes, priority = options.priority;
        registry.createExpression(name, regexpString, priority, scopes, handle);
        return new Disposable(function() {
          return registry.removeExpression(name);
        });
      }
    },
    deserializePalette: function(state) {
      if (Palette == null) {
        Palette = require('./palette');
      }
      return Palette.deserialize(state);
    },
    deserializeColorSearch: function(state) {
      if (ColorSearch == null) {
        ColorSearch = require('./color-search');
      }
      return ColorSearch.deserialize(state);
    },
    deserializeColorProject: function(state) {
      if (ColorProject == null) {
        ColorProject = require('./color-project');
      }
      return ColorProject.deserialize(state);
    },
    deserializeColorProjectElement: function(state) {
      var element, subscription;
      if (ColorProjectElement == null) {
        ColorProjectElement = require('./color-project-element');
      }
      element = new ColorProjectElement;
      if (this.project != null) {
        element.setModel(this.getProject());
      } else {
        subscription = atom.packages.onDidActivatePackage((function(_this) {
          return function(pkg) {
            if (pkg.name === 'pigments') {
              subscription.dispose();
              return element.setModel(_this.getProject());
            }
          };
        })(this));
      }
      return element;
    },
    deserializeVariablesCollection: function(state) {
      if (VariablesCollection == null) {
        VariablesCollection = require('./variables-collection');
      }
      return VariablesCollection.deserialize(state);
    },
    pigmentsViewProvider: function(model) {
      var element;
      element = model instanceof (ColorBuffer != null ? ColorBuffer : ColorBuffer = require('./color-buffer')) ? (ColorBufferElement != null ? ColorBufferElement : ColorBufferElement = require('./color-buffer-element'), element = new ColorBufferElement) : model instanceof (ColorMarker != null ? ColorMarker : ColorMarker = require('./color-marker')) ? (ColorMarkerElement != null ? ColorMarkerElement : ColorMarkerElement = require('./color-marker-element'), element = new ColorMarkerElement) : model instanceof (ColorSearch != null ? ColorSearch : ColorSearch = require('./color-search')) ? (ColorResultsElement != null ? ColorResultsElement : ColorResultsElement = require('./color-results-element'), element = new ColorResultsElement) : model instanceof (ColorProject != null ? ColorProject : ColorProject = require('./color-project')) ? (ColorProjectElement != null ? ColorProjectElement : ColorProjectElement = require('./color-project-element'), element = new ColorProjectElement) : model instanceof (Palette != null ? Palette : Palette = require('./palette')) ? (PaletteElement != null ? PaletteElement : PaletteElement = require('./palette-element'), element = new PaletteElement) : void 0;
      if (element != null) {
        element.setModel(model);
      }
      return element;
    },
    shouldDisplayContextMenu: function(event) {
      this.lastEvent = event;
      setTimeout(((function(_this) {
        return function() {
          return _this.lastEvent = null;
        };
      })(this)), 10);
      return this.colorMarkerForMouseEvent(event) != null;
    },
    colorMarkerForMouseEvent: function(event) {
      var colorBuffer, colorBufferElement, editor;
      editor = atom.workspace.getActiveTextEditor();
      colorBuffer = this.project.colorBufferForEditor(editor);
      colorBufferElement = atom.views.getView(colorBuffer);
      return colorBufferElement != null ? colorBufferElement.colorMarkerForMouseEvent(event) : void 0;
    },
    serialize: function() {
      return {
        project: this.project.serialize()
      };
    },
    getProject: function() {
      return this.project;
    },
    findColors: function() {
      var pane;
      if (uris == null) {
        uris = require('./uris');
      }
      pane = atom.workspace.paneForURI(uris.SEARCH);
      pane || (pane = atom.workspace.getActivePane());
      return atom.workspace.openURIInPane(uris.SEARCH, pane, {});
    },
    showPalette: function() {
      if (uris == null) {
        uris = require('./uris');
      }
      return this.project.initialize().then(function() {
        var pane;
        pane = atom.workspace.paneForURI(uris.PALETTE);
        pane || (pane = atom.workspace.getActivePane());
        return atom.workspace.openURIInPane(uris.PALETTE, pane, {});
      })["catch"](function(reason) {
        return console.error(reason);
      });
    },
    showSettings: function() {
      if (uris == null) {
        uris = require('./uris');
      }
      return this.project.initialize().then(function() {
        var pane;
        pane = atom.workspace.paneForURI(uris.SETTINGS);
        pane || (pane = atom.workspace.getActivePane());
        return atom.workspace.openURIInPane(uris.SETTINGS, pane, {});
      })["catch"](function(reason) {
        return console.error(reason);
      });
    },
    reloadProjectVariables: function() {
      return this.project.reload();
    },
    createPigmentsReport: function() {
      return atom.workspace.open('pigments-report.json').then((function(_this) {
        return function(editor) {
          return editor.setText(_this.createReport());
        };
      })(this));
    },
    createReport: function() {
      var o;
      o = {
        atom: atom.getVersion(),
        pigments: atom.packages.getLoadedPackage('pigments').metadata.version,
        platform: require('os').platform(),
        config: atom.config.get('pigments'),
        project: {
          config: {
            sourceNames: this.project.sourceNames,
            searchNames: this.project.searchNames,
            ignoredNames: this.project.ignoredNames,
            ignoredScopes: this.project.ignoredScopes,
            includeThemes: this.project.includeThemes,
            ignoreGlobalSourceNames: this.project.ignoreGlobalSourceNames,
            ignoreGlobalSearchNames: this.project.ignoreGlobalSearchNames,
            ignoreGlobalIgnoredNames: this.project.ignoreGlobalIgnoredNames,
            ignoreGlobalIgnoredScopes: this.project.ignoreGlobalIgnoredScopes
          },
          paths: this.project.getPaths(),
          variables: {
            colors: this.project.getColorVariables().length,
            total: this.project.getVariables().length
          }
        }
      };
      return JSON.stringify(o, null, 2).replace(RegExp("" + (atom.project.getPaths().join('|')), "g"), '<root>');
    },
    patchAtom: function() {
      var HighlightComponent, TextEditorPresenter, _buildHighlightRegions, _updateHighlightRegions, requireCore;
      requireCore = function(name) {
        return require(Object.keys(require.cache).filter(function(s) {
          return s.indexOf(name) > -1;
        })[0]);
      };
      HighlightComponent = requireCore('highlights-component');
      TextEditorPresenter = requireCore('text-editor-presenter');
      if (TextEditorPresenter.getTextInScreenRange == null) {
        TextEditorPresenter.prototype.getTextInScreenRange = function(screenRange) {
          if (this.displayLayer != null) {
            return this.model.getTextInRange(this.displayLayer.translateScreenRange(screenRange));
          } else {
            return this.model.getTextInRange(this.model.bufferRangeForScreenRange(screenRange));
          }
        };
        _buildHighlightRegions = TextEditorPresenter.prototype.buildHighlightRegions;
        TextEditorPresenter.prototype.buildHighlightRegions = function(screenRange) {
          var regions;
          regions = _buildHighlightRegions.call(this, screenRange);
          if (regions.length === 1) {
            regions[0].text = this.getTextInScreenRange(screenRange);
          } else {
            regions[0].text = this.getTextInScreenRange([screenRange.start, [screenRange.start.row, 2e308]]);
            regions[regions.length - 1].text = this.getTextInScreenRange([[screenRange.end.row, 0], screenRange.end]);
            if (regions.length > 2) {
              regions[1].text = this.getTextInScreenRange([[screenRange.start.row + 1, 0], [screenRange.end.row - 1, 2e308]]);
            }
          }
          return regions;
        };
        _updateHighlightRegions = HighlightComponent.prototype.updateHighlightRegions;
        return HighlightComponent.prototype.updateHighlightRegions = function(id, newHighlightState) {
          var i, j, len, newRegionState, ref1, ref2, regionNode, results;
          _updateHighlightRegions.call(this, id, newHighlightState);
          if ((ref1 = newHighlightState["class"]) != null ? ref1.match(/^pigments-native-background\s/) : void 0) {
            ref2 = newHighlightState.regions;
            results = [];
            for (i = j = 0, len = ref2.length; j < len; i = ++j) {
              newRegionState = ref2[i];
              regionNode = this.regionNodesByHighlightId[id][i];
              if (newRegionState.text != null) {
                results.push(regionNode.textContent = newRegionState.text);
              } else {
                results.push(void 0);
              }
            }
            return results;
          }
        };
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3BpZ21lbnRzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFTSSxFQVRKLEVBQ0UsZ0JBREYsRUFDVyx1QkFEWCxFQUVFLG9CQUZGLEVBRWUsNEJBRmYsRUFHRSxxQkFIRixFQUdnQiw0QkFIaEIsRUFJRSxvQkFKRixFQUllLDJCQUpmLEVBS0Usb0JBTEYsRUFLZSwyQkFMZixFQU1FLDZCQU5GLEVBTXVCLDBCQU52QixFQU15QyxxQkFOekMsRUFPRSxvQkFQRixFQVFFLGFBUkYsRUFRTzs7RUFHUCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtBQUNSLFVBQUE7O1FBQUEsZUFBZ0IsT0FBQSxDQUFRLGlCQUFSOztNQUVoQixJQUFDLENBQUEsU0FBRCxDQUFBO01BRUEsSUFBQyxDQUFBLE9BQUQsR0FBYyxxQkFBSCxHQUNULFlBQVksQ0FBQyxXQUFiLENBQXlCLEtBQUssQ0FBQyxPQUEvQixDQURTLEdBR0wsSUFBQSxZQUFBLENBQUE7TUFFTixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ0U7UUFBQSxzQkFBQSxFQUF3QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxVQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEI7UUFDQSx1QkFBQSxFQUF5QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxXQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEekI7UUFFQSwyQkFBQSxFQUE2QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxZQUFE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O0FBQ0U7QUFBQTtpQkFBQSw4Q0FBQTs7Y0FDRSxVQUFBLEdBQWEsSUFBQyxDQUFBLHdCQUF5QixDQUFBLEVBQUEsQ0FBSSxDQUFBLENBQUE7Y0FFM0MsSUFBZ0QsMkJBQWhEOzZCQUFBLFVBQVUsQ0FBQyxXQUFYLEdBQXlCLGNBQWMsQ0FBQyxNQUF4QztlQUFBLE1BQUE7cUNBQUE7O0FBSEY7MkJBREY7O1FBSDJDLEVBaEMvQzs7SUFQUyxDQXhSWDs7QUFaRiIsInNvdXJjZXNDb250ZW50IjpbIltcbiAgUGFsZXR0ZSwgUGFsZXR0ZUVsZW1lbnQsXG4gIENvbG9yU2VhcmNoLCBDb2xvclJlc3VsdHNFbGVtZW50LFxuICBDb2xvclByb2plY3QsIENvbG9yUHJvamVjdEVsZW1lbnQsXG4gIENvbG9yQnVmZmVyLCBDb2xvckJ1ZmZlckVsZW1lbnQsXG4gIENvbG9yTWFya2VyLCBDb2xvck1hcmtlckVsZW1lbnQsXG4gIFZhcmlhYmxlc0NvbGxlY3Rpb24sIFBpZ21lbnRzUHJvdmlkZXIsIFBpZ21lbnRzQVBJLFxuICBEaXNwb3NhYmxlLFxuICB1cmwsIHVyaXNcbl0gPSBbXVxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQ29sb3JQcm9qZWN0ID89IHJlcXVpcmUgJy4vY29sb3ItcHJvamVjdCdcblxuICAgIEBwYXRjaEF0b20oKVxuXG4gICAgQHByb2plY3QgPSBpZiBzdGF0ZS5wcm9qZWN0P1xuICAgICAgQ29sb3JQcm9qZWN0LmRlc2VyaWFsaXplKHN0YXRlLnByb2plY3QpXG4gICAgZWxzZVxuICAgICAgbmV3IENvbG9yUHJvamVjdCgpXG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ3BpZ21lbnRzOmZpbmQtY29sb3JzJzogPT4gQGZpbmRDb2xvcnMoKVxuICAgICAgJ3BpZ21lbnRzOnNob3ctcGFsZXR0ZSc6ID0+IEBzaG93UGFsZXR0ZSgpXG4gICAgICAncGlnbWVudHM6cHJvamVjdC1zZXR0aW5ncyc6ID0+IEBzaG93U2V0dGluZ3MoKVxuICAgICAgJ3BpZ21lbnRzOnJlbG9hZCc6ID0+IEByZWxvYWRQcm9qZWN0VmFyaWFibGVzKClcbiAgICAgICdwaWdtZW50czpyZXBvcnQnOiA9PiBAY3JlYXRlUGlnbWVudHNSZXBvcnQoKVxuXG4gICAgY29udmVydE1ldGhvZCA9IChhY3Rpb24pID0+IChldmVudCkgPT5cbiAgICAgIGlmIEBsYXN0RXZlbnQ/XG4gICAgICAgIGFjdGlvbiBAY29sb3JNYXJrZXJGb3JNb3VzZUV2ZW50KEBsYXN0RXZlbnQpXG4gICAgICBlbHNlXG4gICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBjb2xvckJ1ZmZlciA9IEBwcm9qZWN0LmNvbG9yQnVmZmVyRm9yRWRpdG9yKGVkaXRvcilcblxuICAgICAgICBlZGl0b3IuZ2V0Q3Vyc29ycygpLmZvckVhY2ggKGN1cnNvcikgPT5cbiAgICAgICAgICBtYXJrZXIgPSBjb2xvckJ1ZmZlci5nZXRDb2xvck1hcmtlckF0QnVmZmVyUG9zaXRpb24oY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCkpXG4gICAgICAgICAgYWN0aW9uKG1hcmtlcilcblxuICAgICAgQGxhc3RFdmVudCA9IG51bGxcblxuICAgIGNvcHlNZXRob2QgPSAoYWN0aW9uKSA9PiAoZXZlbnQpID0+XG4gICAgICBpZiBAbGFzdEV2ZW50P1xuICAgICAgICBhY3Rpb24gQGNvbG9yTWFya2VyRm9yTW91c2VFdmVudChAbGFzdEV2ZW50KVxuICAgICAgZWxzZVxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgY29sb3JCdWZmZXIgPSBAcHJvamVjdC5jb2xvckJ1ZmZlckZvckVkaXRvcihlZGl0b3IpXG4gICAgICAgIGN1cnNvciA9IGVkaXRvci5nZXRMYXN0Q3Vyc29yKClcbiAgICAgICAgbWFya2VyID0gY29sb3JCdWZmZXIuZ2V0Q29sb3JNYXJrZXJBdEJ1ZmZlclBvc2l0aW9uKGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpKVxuICAgICAgICBhY3Rpb24obWFya2VyKVxuXG4gICAgICBAbGFzdEV2ZW50ID0gbnVsbFxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLFxuICAgICAgJ3BpZ21lbnRzOmNvbnZlcnQtdG8taGV4JzogY29udmVydE1ldGhvZCAobWFya2VyKSAtPlxuICAgICAgICBtYXJrZXIuY29udmVydENvbnRlbnRUb0hleCgpIGlmIG1hcmtlcj9cblxuICAgICAgJ3BpZ21lbnRzOmNvbnZlcnQtdG8tcmdiJzogY29udmVydE1ldGhvZCAobWFya2VyKSAtPlxuICAgICAgICBtYXJrZXIuY29udmVydENvbnRlbnRUb1JHQigpIGlmIG1hcmtlcj9cblxuICAgICAgJ3BpZ21lbnRzOmNvbnZlcnQtdG8tcmdiYSc6IGNvbnZlcnRNZXRob2QgKG1hcmtlcikgLT5cbiAgICAgICAgbWFya2VyLmNvbnZlcnRDb250ZW50VG9SR0JBKCkgaWYgbWFya2VyP1xuXG4gICAgICAncGlnbWVudHM6Y29udmVydC10by1oc2wnOiBjb252ZXJ0TWV0aG9kIChtYXJrZXIpIC0+XG4gICAgICAgIG1hcmtlci5jb252ZXJ0Q29udGVudFRvSFNMKCkgaWYgbWFya2VyP1xuXG4gICAgICAncGlnbWVudHM6Y29udmVydC10by1oc2xhJzogY29udmVydE1ldGhvZCAobWFya2VyKSAtPlxuICAgICAgICBtYXJrZXIuY29udmVydENvbnRlbnRUb0hTTEEoKSBpZiBtYXJrZXI/XG5cbiAgICAgICdwaWdtZW50czpjb3B5LWFzLWhleCc6IGNvcHlNZXRob2QgKG1hcmtlcikgLT5cbiAgICAgICAgbWFya2VyLmNvcHlDb250ZW50QXNIZXgoKSBpZiBtYXJrZXI/XG5cbiAgICAgICdwaWdtZW50czpjb3B5LWFzLXJnYic6IGNvcHlNZXRob2QgKG1hcmtlcikgLT5cbiAgICAgICAgbWFya2VyLmNvcHlDb250ZW50QXNSR0IoKSBpZiBtYXJrZXI/XG5cbiAgICAgICdwaWdtZW50czpjb3B5LWFzLXJnYmEnOiBjb3B5TWV0aG9kIChtYXJrZXIpIC0+XG4gICAgICAgIG1hcmtlci5jb3B5Q29udGVudEFzUkdCQSgpIGlmIG1hcmtlcj9cblxuICAgICAgJ3BpZ21lbnRzOmNvcHktYXMtaHNsJzogY29weU1ldGhvZCAobWFya2VyKSAtPlxuICAgICAgICBtYXJrZXIuY29weUNvbnRlbnRBc0hTTCgpIGlmIG1hcmtlcj9cblxuICAgICAgJ3BpZ21lbnRzOmNvcHktYXMtaHNsYSc6IGNvcHlNZXRob2QgKG1hcmtlcikgLT5cbiAgICAgICAgbWFya2VyLmNvcHlDb250ZW50QXNIU0xBKCkgaWYgbWFya2VyP1xuXG4gICAgYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyICh1cmlUb09wZW4pID0+XG4gICAgICB1cmwgfHw9IHJlcXVpcmUgJ3VybCdcblxuICAgICAge3Byb3RvY29sLCBob3N0fSA9IHVybC5wYXJzZSB1cmlUb09wZW5cbiAgICAgIHJldHVybiB1bmxlc3MgcHJvdG9jb2wgaXMgJ3BpZ21lbnRzOidcblxuICAgICAgc3dpdGNoIGhvc3RcbiAgICAgICAgd2hlbiAnc2VhcmNoJyB0aGVuIEBwcm9qZWN0LmZpbmRBbGxDb2xvcnMoKVxuICAgICAgICB3aGVuICdwYWxldHRlJyB0aGVuIEBwcm9qZWN0LmdldFBhbGV0dGUoKVxuICAgICAgICB3aGVuICdzZXR0aW5ncycgdGhlbiBhdG9tLnZpZXdzLmdldFZpZXcoQHByb2plY3QpXG5cbiAgICBhdG9tLmNvbnRleHRNZW51LmFkZFxuICAgICAgJ2F0b20tdGV4dC1lZGl0b3InOiBbe1xuICAgICAgICBsYWJlbDogJ1BpZ21lbnRzJ1xuICAgICAgICBzdWJtZW51OiBbXG4gICAgICAgICAge2xhYmVsOiAnQ29udmVydCB0byBoZXhhZGVjaW1hbCcsIGNvbW1hbmQ6ICdwaWdtZW50czpjb252ZXJ0LXRvLWhleCd9XG4gICAgICAgICAge2xhYmVsOiAnQ29udmVydCB0byBSR0InLCBjb21tYW5kOiAncGlnbWVudHM6Y29udmVydC10by1yZ2InfVxuICAgICAgICAgIHtsYWJlbDogJ0NvbnZlcnQgdG8gUkdCQScsIGNvbW1hbmQ6ICdwaWdtZW50czpjb252ZXJ0LXRvLXJnYmEnfVxuICAgICAgICAgIHtsYWJlbDogJ0NvbnZlcnQgdG8gSFNMJywgY29tbWFuZDogJ3BpZ21lbnRzOmNvbnZlcnQtdG8taHNsJ31cbiAgICAgICAgICB7bGFiZWw6ICdDb252ZXJ0IHRvIEhTTEEnLCBjb21tYW5kOiAncGlnbWVudHM6Y29udmVydC10by1oc2xhJ31cbiAgICAgICAgICB7dHlwZTogJ3NlcGFyYXRvcid9XG4gICAgICAgICAge2xhYmVsOiAnQ29weSBhcyBoZXhhZGVjaW1hbCcsIGNvbW1hbmQ6ICdwaWdtZW50czpjb3B5LWFzLWhleCd9XG4gICAgICAgICAge2xhYmVsOiAnQ29weSBhcyBSR0InLCBjb21tYW5kOiAncGlnbWVudHM6Y29weS1hcy1yZ2InfVxuICAgICAgICAgIHtsYWJlbDogJ0NvcHkgYXMgUkdCQScsIGNvbW1hbmQ6ICdwaWdtZW50czpjb3B5LWFzLXJnYmEnfVxuICAgICAgICAgIHtsYWJlbDogJ0NvcHkgYXMgSFNMJywgY29tbWFuZDogJ3BpZ21lbnRzOmNvcHktYXMtaHNsJ31cbiAgICAgICAgICB7bGFiZWw6ICdDb3B5IGFzIEhTTEEnLCBjb21tYW5kOiAncGlnbWVudHM6Y29weS1hcy1oc2xhJ31cbiAgICAgICAgXVxuICAgICAgICBzaG91bGREaXNwbGF5OiAoZXZlbnQpID0+IEBzaG91bGREaXNwbGF5Q29udGV4dE1lbnUoZXZlbnQpXG4gICAgICB9XVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGdldFByb2plY3QoKT8uZGVzdHJveT8oKVxuXG4gIHByb3ZpZGVBdXRvY29tcGxldGU6IC0+XG4gICAgUGlnbWVudHNQcm92aWRlciA/PSByZXF1aXJlICcuL3BpZ21lbnRzLXByb3ZpZGVyJ1xuICAgIG5ldyBQaWdtZW50c1Byb3ZpZGVyKHRoaXMpXG5cbiAgcHJvdmlkZUFQSTogLT5cbiAgICBQaWdtZW50c0FQSSA/PSByZXF1aXJlICcuL3BpZ21lbnRzLWFwaSdcbiAgICBuZXcgUGlnbWVudHNBUEkoQGdldFByb2plY3QoKSlcblxuICBjb25zdW1lQ29sb3JQaWNrZXI6IChhcGkpIC0+XG4gICAgRGlzcG9zYWJsZSA/PSByZXF1aXJlKCdhdG9tJykuRGlzcG9zYWJsZVxuXG4gICAgQGdldFByb2plY3QoKS5zZXRDb2xvclBpY2tlckFQSShhcGkpXG5cbiAgICBuZXcgRGlzcG9zYWJsZSA9PlxuICAgICAgQGdldFByb2plY3QoKS5zZXRDb2xvclBpY2tlckFQSShudWxsKVxuXG4gIGNvbnN1bWVDb2xvckV4cHJlc3Npb25zOiAob3B0aW9ucz17fSkgLT5cbiAgICBEaXNwb3NhYmxlID89IHJlcXVpcmUoJ2F0b20nKS5EaXNwb3NhYmxlXG5cbiAgICByZWdpc3RyeSA9IEBnZXRQcm9qZWN0KCkuZ2V0Q29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5KClcblxuICAgIGlmIG9wdGlvbnMuZXhwcmVzc2lvbnM/XG4gICAgICBuYW1lcyA9IG9wdGlvbnMuZXhwcmVzc2lvbnMubWFwIChlKSAtPiBlLm5hbWVcbiAgICAgIHJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb25zKG9wdGlvbnMuZXhwcmVzc2lvbnMpXG5cbiAgICAgIG5ldyBEaXNwb3NhYmxlIC0+IHJlZ2lzdHJ5LnJlbW92ZUV4cHJlc3Npb24obmFtZSkgZm9yIG5hbWUgaW4gbmFtZXNcbiAgICBlbHNlXG4gICAgICB7bmFtZSwgcmVnZXhwU3RyaW5nLCBoYW5kbGUsIHNjb3BlcywgcHJpb3JpdHl9ID0gb3B0aW9uc1xuICAgICAgcmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbihuYW1lLCByZWdleHBTdHJpbmcsIHByaW9yaXR5LCBzY29wZXMsIGhhbmRsZSlcblxuICAgICAgbmV3IERpc3Bvc2FibGUgLT4gcmVnaXN0cnkucmVtb3ZlRXhwcmVzc2lvbihuYW1lKVxuXG4gIGNvbnN1bWVWYXJpYWJsZUV4cHJlc3Npb25zOiAob3B0aW9ucz17fSkgLT5cbiAgICBEaXNwb3NhYmxlID89IHJlcXVpcmUoJ2F0b20nKS5EaXNwb3NhYmxlXG5cbiAgICByZWdpc3RyeSA9IEBnZXRQcm9qZWN0KCkuZ2V0VmFyaWFibGVFeHByZXNzaW9uc1JlZ2lzdHJ5KClcblxuICAgIGlmIG9wdGlvbnMuZXhwcmVzc2lvbnM/XG4gICAgICBuYW1lcyA9IG9wdGlvbnMuZXhwcmVzc2lvbnMubWFwIChlKSAtPiBlLm5hbWVcbiAgICAgIHJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb25zKG9wdGlvbnMuZXhwcmVzc2lvbnMpXG5cbiAgICAgIG5ldyBEaXNwb3NhYmxlIC0+IHJlZ2lzdHJ5LnJlbW92ZUV4cHJlc3Npb24obmFtZSkgZm9yIG5hbWUgaW4gbmFtZXNcbiAgICBlbHNlXG4gICAgICB7bmFtZSwgcmVnZXhwU3RyaW5nLCBoYW5kbGUsIHNjb3BlcywgcHJpb3JpdHl9ID0gb3B0aW9uc1xuICAgICAgcmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbihuYW1lLCByZWdleHBTdHJpbmcsIHByaW9yaXR5LCBzY29wZXMsIGhhbmRsZSlcblxuICAgICAgbmV3IERpc3Bvc2FibGUgLT4gcmVnaXN0cnkucmVtb3ZlRXhwcmVzc2lvbihuYW1lKVxuXG4gIGRlc2VyaWFsaXplUGFsZXR0ZTogKHN0YXRlKSAtPlxuICAgIFBhbGV0dGUgPz0gcmVxdWlyZSAnLi9wYWxldHRlJ1xuICAgIFBhbGV0dGUuZGVzZXJpYWxpemUoc3RhdGUpXG5cbiAgZGVzZXJpYWxpemVDb2xvclNlYXJjaDogKHN0YXRlKSAtPlxuICAgIENvbG9yU2VhcmNoID89IHJlcXVpcmUgJy4vY29sb3Itc2VhcmNoJ1xuICAgIENvbG9yU2VhcmNoLmRlc2VyaWFsaXplKHN0YXRlKVxuXG4gIGRlc2VyaWFsaXplQ29sb3JQcm9qZWN0OiAoc3RhdGUpIC0+XG4gICAgQ29sb3JQcm9qZWN0ID89IHJlcXVpcmUgJy4vY29sb3ItcHJvamVjdCdcbiAgICBDb2xvclByb2plY3QuZGVzZXJpYWxpemUoc3RhdGUpXG5cbiAgZGVzZXJpYWxpemVDb2xvclByb2plY3RFbGVtZW50OiAoc3RhdGUpIC0+XG4gICAgQ29sb3JQcm9qZWN0RWxlbWVudCA/PSByZXF1aXJlICcuL2NvbG9yLXByb2plY3QtZWxlbWVudCdcbiAgICBlbGVtZW50ID0gbmV3IENvbG9yUHJvamVjdEVsZW1lbnRcblxuICAgIGlmIEBwcm9qZWN0P1xuICAgICAgZWxlbWVudC5zZXRNb2RlbChAZ2V0UHJvamVjdCgpKVxuICAgIGVsc2VcbiAgICAgIHN1YnNjcmlwdGlvbiA9IGF0b20ucGFja2FnZXMub25EaWRBY3RpdmF0ZVBhY2thZ2UgKHBrZykgPT5cbiAgICAgICAgaWYgcGtnLm5hbWUgaXMgJ3BpZ21lbnRzJ1xuICAgICAgICAgIHN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgICAgICBlbGVtZW50LnNldE1vZGVsKEBnZXRQcm9qZWN0KCkpXG5cbiAgICBlbGVtZW50XG5cbiAgZGVzZXJpYWxpemVWYXJpYWJsZXNDb2xsZWN0aW9uOiAoc3RhdGUpIC0+XG4gICAgVmFyaWFibGVzQ29sbGVjdGlvbiA/PSByZXF1aXJlICcuL3ZhcmlhYmxlcy1jb2xsZWN0aW9uJ1xuICAgIFZhcmlhYmxlc0NvbGxlY3Rpb24uZGVzZXJpYWxpemUoc3RhdGUpXG5cbiAgcGlnbWVudHNWaWV3UHJvdmlkZXI6IChtb2RlbCkgLT5cbiAgICBlbGVtZW50ID0gaWYgbW9kZWwgaW5zdGFuY2VvZiAoQ29sb3JCdWZmZXIgPz0gcmVxdWlyZSAnLi9jb2xvci1idWZmZXInKVxuICAgICAgQ29sb3JCdWZmZXJFbGVtZW50ID89IHJlcXVpcmUgJy4vY29sb3ItYnVmZmVyLWVsZW1lbnQnXG4gICAgICBlbGVtZW50ID0gbmV3IENvbG9yQnVmZmVyRWxlbWVudFxuICAgIGVsc2UgaWYgbW9kZWwgaW5zdGFuY2VvZiAoQ29sb3JNYXJrZXIgPz0gcmVxdWlyZSAnLi9jb2xvci1tYXJrZXInKVxuICAgICAgQ29sb3JNYXJrZXJFbGVtZW50ID89IHJlcXVpcmUgJy4vY29sb3ItbWFya2VyLWVsZW1lbnQnXG4gICAgICBlbGVtZW50ID0gbmV3IENvbG9yTWFya2VyRWxlbWVudFxuICAgIGVsc2UgaWYgbW9kZWwgaW5zdGFuY2VvZiAoQ29sb3JTZWFyY2ggPz0gcmVxdWlyZSAnLi9jb2xvci1zZWFyY2gnKVxuICAgICAgQ29sb3JSZXN1bHRzRWxlbWVudCA/PSByZXF1aXJlICcuL2NvbG9yLXJlc3VsdHMtZWxlbWVudCdcbiAgICAgIGVsZW1lbnQgPSBuZXcgQ29sb3JSZXN1bHRzRWxlbWVudFxuICAgIGVsc2UgaWYgbW9kZWwgaW5zdGFuY2VvZiAoQ29sb3JQcm9qZWN0ID89IHJlcXVpcmUgJy4vY29sb3ItcHJvamVjdCcpXG4gICAgICBDb2xvclByb2plY3RFbGVtZW50ID89IHJlcXVpcmUgJy4vY29sb3ItcHJvamVjdC1lbGVtZW50J1xuICAgICAgZWxlbWVudCA9IG5ldyBDb2xvclByb2plY3RFbGVtZW50XG4gICAgZWxzZSBpZiBtb2RlbCBpbnN0YW5jZW9mIChQYWxldHRlID89IHJlcXVpcmUgJy4vcGFsZXR0ZScpXG4gICAgICBQYWxldHRlRWxlbWVudCA/PSByZXF1aXJlICcuL3BhbGV0dGUtZWxlbWVudCdcbiAgICAgIGVsZW1lbnQgPSBuZXcgUGFsZXR0ZUVsZW1lbnRcblxuICAgIGVsZW1lbnQuc2V0TW9kZWwobW9kZWwpIGlmIGVsZW1lbnQ/XG4gICAgZWxlbWVudFxuXG4gIHNob3VsZERpc3BsYXlDb250ZXh0TWVudTogKGV2ZW50KSAtPlxuICAgIEBsYXN0RXZlbnQgPSBldmVudFxuICAgIHNldFRpbWVvdXQgKD0+IEBsYXN0RXZlbnQgPSBudWxsKSwgMTBcbiAgICBAY29sb3JNYXJrZXJGb3JNb3VzZUV2ZW50KGV2ZW50KT9cblxuICBjb2xvck1hcmtlckZvck1vdXNlRXZlbnQ6IChldmVudCkgLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBjb2xvckJ1ZmZlciA9IEBwcm9qZWN0LmNvbG9yQnVmZmVyRm9yRWRpdG9yKGVkaXRvcilcbiAgICBjb2xvckJ1ZmZlckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoY29sb3JCdWZmZXIpXG4gICAgY29sb3JCdWZmZXJFbGVtZW50Py5jb2xvck1hcmtlckZvck1vdXNlRXZlbnQoZXZlbnQpXG5cbiAgc2VyaWFsaXplOiAtPiB7cHJvamVjdDogQHByb2plY3Quc2VyaWFsaXplKCl9XG5cbiAgZ2V0UHJvamVjdDogLT4gQHByb2plY3RcblxuICBmaW5kQ29sb3JzOiAtPlxuICAgIHVyaXMgPz0gcmVxdWlyZSAnLi91cmlzJ1xuXG4gICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkodXJpcy5TRUFSQ0gpXG4gICAgcGFuZSB8fD0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG5cbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuVVJJSW5QYW5lKHVyaXMuU0VBUkNILCBwYW5lLCB7fSlcblxuICBzaG93UGFsZXR0ZTogLT5cbiAgICB1cmlzID89IHJlcXVpcmUgJy4vdXJpcydcblxuICAgIEBwcm9qZWN0LmluaXRpYWxpemUoKS50aGVuIC0+XG4gICAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSSh1cmlzLlBBTEVUVEUpXG4gICAgICBwYW5lIHx8PSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcblxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlblVSSUluUGFuZSh1cmlzLlBBTEVUVEUsIHBhbmUsIHt9KVxuICAgIC5jYXRjaCAocmVhc29uKSAtPlxuICAgICAgY29uc29sZS5lcnJvciByZWFzb25cblxuICBzaG93U2V0dGluZ3M6IC0+XG4gICAgdXJpcyA/PSByZXF1aXJlICcuL3VyaXMnXG5cbiAgICBAcHJvamVjdC5pbml0aWFsaXplKCkudGhlbiAtPlxuICAgICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkodXJpcy5TRVRUSU5HUylcbiAgICAgIHBhbmUgfHw9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuXG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuVVJJSW5QYW5lKHVyaXMuU0VUVElOR1MsIHBhbmUsIHt9KVxuICAgIC5jYXRjaCAocmVhc29uKSAtPlxuICAgICAgY29uc29sZS5lcnJvciByZWFzb25cblxuICByZWxvYWRQcm9qZWN0VmFyaWFibGVzOiAtPiBAcHJvamVjdC5yZWxvYWQoKVxuXG4gIGNyZWF0ZVBpZ21lbnRzUmVwb3J0OiAtPlxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3BpZ21lbnRzLXJlcG9ydC5qc29uJykudGhlbiAoZWRpdG9yKSA9PlxuICAgICAgZWRpdG9yLnNldFRleHQoQGNyZWF0ZVJlcG9ydCgpKVxuXG4gIGNyZWF0ZVJlcG9ydDogLT5cbiAgICBvID1cbiAgICAgIGF0b206IGF0b20uZ2V0VmVyc2lvbigpXG4gICAgICBwaWdtZW50czogYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKCdwaWdtZW50cycpLm1ldGFkYXRhLnZlcnNpb25cbiAgICAgIHBsYXRmb3JtOiByZXF1aXJlKCdvcycpLnBsYXRmb3JtKClcbiAgICAgIGNvbmZpZzogYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cycpXG4gICAgICBwcm9qZWN0OlxuICAgICAgICBjb25maWc6XG4gICAgICAgICAgc291cmNlTmFtZXM6IEBwcm9qZWN0LnNvdXJjZU5hbWVzXG4gICAgICAgICAgc2VhcmNoTmFtZXM6IEBwcm9qZWN0LnNlYXJjaE5hbWVzXG4gICAgICAgICAgaWdub3JlZE5hbWVzOiBAcHJvamVjdC5pZ25vcmVkTmFtZXNcbiAgICAgICAgICBpZ25vcmVkU2NvcGVzOiBAcHJvamVjdC5pZ25vcmVkU2NvcGVzXG4gICAgICAgICAgaW5jbHVkZVRoZW1lczogQHByb2plY3QuaW5jbHVkZVRoZW1lc1xuICAgICAgICAgIGlnbm9yZUdsb2JhbFNvdXJjZU5hbWVzOiBAcHJvamVjdC5pZ25vcmVHbG9iYWxTb3VyY2VOYW1lc1xuICAgICAgICAgIGlnbm9yZUdsb2JhbFNlYXJjaE5hbWVzOiBAcHJvamVjdC5pZ25vcmVHbG9iYWxTZWFyY2hOYW1lc1xuICAgICAgICAgIGlnbm9yZUdsb2JhbElnbm9yZWROYW1lczogQHByb2plY3QuaWdub3JlR2xvYmFsSWdub3JlZE5hbWVzXG4gICAgICAgICAgaWdub3JlR2xvYmFsSWdub3JlZFNjb3BlczogQHByb2plY3QuaWdub3JlR2xvYmFsSWdub3JlZFNjb3Blc1xuICAgICAgICBwYXRoczogQHByb2plY3QuZ2V0UGF0aHMoKVxuICAgICAgICB2YXJpYWJsZXM6XG4gICAgICAgICAgY29sb3JzOiBAcHJvamVjdC5nZXRDb2xvclZhcmlhYmxlcygpLmxlbmd0aFxuICAgICAgICAgIHRvdGFsOiBAcHJvamVjdC5nZXRWYXJpYWJsZXMoKS5sZW5ndGhcblxuICAgIEpTT04uc3RyaW5naWZ5KG8sIG51bGwsIDIpXG4gICAgLnJlcGxhY2UoLy8vI3thdG9tLnByb2plY3QuZ2V0UGF0aHMoKS5qb2luKCd8Jyl9Ly8vZywgJzxyb290PicpXG5cbiAgcGF0Y2hBdG9tOiAtPlxuICAgIHJlcXVpcmVDb3JlID0gKG5hbWUpIC0+XG4gICAgICByZXF1aXJlIE9iamVjdC5rZXlzKHJlcXVpcmUuY2FjaGUpLmZpbHRlcigocykgLT4gcy5pbmRleE9mKG5hbWUpID4gLTEpWzBdXG5cbiAgICBIaWdobGlnaHRDb21wb25lbnQgPSByZXF1aXJlQ29yZSgnaGlnaGxpZ2h0cy1jb21wb25lbnQnKVxuICAgIFRleHRFZGl0b3JQcmVzZW50ZXIgPSByZXF1aXJlQ29yZSgndGV4dC1lZGl0b3ItcHJlc2VudGVyJylcblxuICAgIHVubGVzcyBUZXh0RWRpdG9yUHJlc2VudGVyLmdldFRleHRJblNjcmVlblJhbmdlP1xuICAgICAgVGV4dEVkaXRvclByZXNlbnRlcjo6Z2V0VGV4dEluU2NyZWVuUmFuZ2UgPSAoc2NyZWVuUmFuZ2UpIC0+XG4gICAgICAgIGlmIEBkaXNwbGF5TGF5ZXI/XG4gICAgICAgICAgQG1vZGVsLmdldFRleHRJblJhbmdlKEBkaXNwbGF5TGF5ZXIudHJhbnNsYXRlU2NyZWVuUmFuZ2Uoc2NyZWVuUmFuZ2UpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQG1vZGVsLmdldFRleHRJblJhbmdlKEBtb2RlbC5idWZmZXJSYW5nZUZvclNjcmVlblJhbmdlKHNjcmVlblJhbmdlKSlcblxuICAgICAgX2J1aWxkSGlnaGxpZ2h0UmVnaW9ucyA9IFRleHRFZGl0b3JQcmVzZW50ZXI6OmJ1aWxkSGlnaGxpZ2h0UmVnaW9uc1xuICAgICAgVGV4dEVkaXRvclByZXNlbnRlcjo6YnVpbGRIaWdobGlnaHRSZWdpb25zID0gKHNjcmVlblJhbmdlKSAtPlxuICAgICAgICByZWdpb25zID0gX2J1aWxkSGlnaGxpZ2h0UmVnaW9ucy5jYWxsKHRoaXMsIHNjcmVlblJhbmdlKVxuXG4gICAgICAgIGlmIHJlZ2lvbnMubGVuZ3RoIGlzIDFcbiAgICAgICAgICByZWdpb25zWzBdLnRleHQgPSBAZ2V0VGV4dEluU2NyZWVuUmFuZ2Uoc2NyZWVuUmFuZ2UpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZWdpb25zWzBdLnRleHQgPSBAZ2V0VGV4dEluU2NyZWVuUmFuZ2UoW1xuICAgICAgICAgICAgc2NyZWVuUmFuZ2Uuc3RhcnRcbiAgICAgICAgICAgIFtzY3JlZW5SYW5nZS5zdGFydC5yb3csIEluZmluaXR5XVxuICAgICAgICAgIF0pXG4gICAgICAgICAgcmVnaW9uc1tyZWdpb25zLmxlbmd0aCAtIDFdLnRleHQgPSBAZ2V0VGV4dEluU2NyZWVuUmFuZ2UoW1xuICAgICAgICAgICAgW3NjcmVlblJhbmdlLmVuZC5yb3csIDBdXG4gICAgICAgICAgICBzY3JlZW5SYW5nZS5lbmRcbiAgICAgICAgICBdKVxuXG4gICAgICAgICAgaWYgcmVnaW9ucy5sZW5ndGggPiAyXG4gICAgICAgICAgICByZWdpb25zWzFdLnRleHQgPSBAZ2V0VGV4dEluU2NyZWVuUmFuZ2UoW1xuICAgICAgICAgICAgICBbc2NyZWVuUmFuZ2Uuc3RhcnQucm93ICsgMSwgMF1cbiAgICAgICAgICAgICAgW3NjcmVlblJhbmdlLmVuZC5yb3cgLSAxLCBJbmZpbml0eV1cbiAgICAgICAgICAgIF0pXG5cbiAgICAgICAgcmVnaW9uc1xuXG4gICAgICBfdXBkYXRlSGlnaGxpZ2h0UmVnaW9ucyA9IEhpZ2hsaWdodENvbXBvbmVudDo6dXBkYXRlSGlnaGxpZ2h0UmVnaW9uc1xuICAgICAgSGlnaGxpZ2h0Q29tcG9uZW50Ojp1cGRhdGVIaWdobGlnaHRSZWdpb25zID0gKGlkLCBuZXdIaWdobGlnaHRTdGF0ZSkgLT5cbiAgICAgICAgX3VwZGF0ZUhpZ2hsaWdodFJlZ2lvbnMuY2FsbCh0aGlzLCBpZDsgbmV3SGlnaGxpZ2h0U3RhdGUpXG5cbiAgICAgICAgaWYgbmV3SGlnaGxpZ2h0U3RhdGUuY2xhc3M/Lm1hdGNoIC9ecGlnbWVudHMtbmF0aXZlLWJhY2tncm91bmRcXHMvXG4gICAgICAgICAgZm9yIG5ld1JlZ2lvblN0YXRlLCBpIGluIG5ld0hpZ2hsaWdodFN0YXRlLnJlZ2lvbnNcbiAgICAgICAgICAgIHJlZ2lvbk5vZGUgPSBAcmVnaW9uTm9kZXNCeUhpZ2hsaWdodElkW2lkXVtpXVxuXG4gICAgICAgICAgICByZWdpb25Ob2RlLnRleHRDb250ZW50ID0gbmV3UmVnaW9uU3RhdGUudGV4dCBpZiBuZXdSZWdpb25TdGF0ZS50ZXh0P1xuIl19
