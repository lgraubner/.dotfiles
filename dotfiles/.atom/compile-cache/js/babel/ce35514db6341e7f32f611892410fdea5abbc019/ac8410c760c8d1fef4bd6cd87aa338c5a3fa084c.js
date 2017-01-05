'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {

  excludeLowerPriorityProviders: {

    title: 'Exclude lower priority providers',
    description: 'Whether to exclude lower priority providers (e.g. autocomplete-paths)',
    type: 'boolean',
    'default': false,
    order: 0
  },
  guess: {

    title: 'Guess',
    description: 'When completing a property and no completions are found, Tern will use some heuristics to try and return some properties anyway. Set this to false to turn that off.',
    type: 'boolean',
    'default': true,
    order: 1
  },
  sort: {

    title: 'Sort',
    description: 'Determines whether the result set will be sorted.',
    type: 'boolean',
    'default': true,
    order: 2
  },
  caseInsensitive: {

    title: 'Case-insensitive',
    description: 'Whether to use a case-insensitive compare between the current word and potential completions.',
    type: 'boolean',
    'default': true,
    order: 3
  },
  useSnippets: {

    title: 'Use autocomplete-snippets',
    description: 'Adds snippets to autocomplete+ suggestions',
    type: 'boolean',
    'default': false,
    order: 4
  },
  snippetsFirst: {

    title: 'Display snippets above',
    description: 'Displays snippets above tern suggestions. Requires a restart.',
    type: 'boolean',
    'default': false,
    order: 5
  },
  useSnippetsAndFunction: {

    title: 'Display both, autocomplete-snippets and function name',
    description: 'Choose to just complete the function name or expand the snippet',
    type: 'boolean',
    'default': false,
    order: 6
  },
  inlineFnCompletion: {

    title: 'Display inline suggestions for function params',
    description: 'Displays a inline suggestion located right next to the current cursor',
    type: 'boolean',
    'default': true,
    order: 7
  },
  inlineFnCompletionDocumentation: {

    title: 'Display inline suggestions with additional documentation (if any)',
    description: 'Adds documentation to the inline function completion',
    type: 'boolean',
    'default': false,
    order: 8
  },
  documentation: {

    title: 'Documentation',
    description: 'Whether to include documentation string (if found) in the result data.',
    type: 'boolean',
    'default': true,
    order: 9
  },
  urls: {

    title: 'Url',
    description: 'Whether to include documentation urls (if found) in the result data.',
    type: 'boolean',
    'default': true,
    order: 10
  },
  origins: {

    title: 'Origin',
    description: 'Whether to include origins (if found) in the result data.',
    type: 'boolean',
    'default': true,
    order: 11
  },
  ternServerGetFileAsync: {

    title: 'Tern Server getFile async',
    description: 'Indicates whether getFile is asynchronous. Default is true. Requires a restart.',
    type: 'boolean',
    'default': true,
    order: 12
  },
  ternServerDependencyBudget: {

    title: 'Tern Server dependency-budget',
    description: 'http://ternjs.net/doc/manual.html#dependency_budget. Requires a restart.',
    type: 'number',
    'default': 20000,
    order: 13
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZ3JhdWJuZXIvLmRvdGZpbGVzL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7OztxQkFFRzs7QUFFYiwrQkFBNkIsRUFBRTs7QUFFN0IsU0FBSyxFQUFFLGtDQUFrQztBQUN6QyxlQUFXLEVBQUUsdUVBQXVFO0FBQ3BGLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0FBQ2QsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELE9BQUssRUFBRTs7QUFFTCxTQUFLLEVBQUUsT0FBTztBQUNkLGVBQVcsRUFBRSxzS0FBc0s7QUFDbkwsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7QUFDYixTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0QsTUFBSSxFQUFFOztBQUVKLFNBQUssRUFBRSxNQUFNO0FBQ2IsZUFBVyxFQUFFLG1EQUFtRDtBQUNoRSxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtBQUNiLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxpQkFBZSxFQUFFOztBQUVmLFNBQUssRUFBRSxrQkFBa0I7QUFDekIsZUFBVyxFQUFFLCtGQUErRjtBQUM1RyxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtBQUNiLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxhQUFXLEVBQUU7O0FBRVgsU0FBSyxFQUFFLDJCQUEyQjtBQUNsQyxlQUFXLEVBQUUsNENBQTRDO0FBQ3pELFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0FBQ2QsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELGVBQWEsRUFBRTs7QUFFYixTQUFLLEVBQUUsd0JBQXdCO0FBQy9CLGVBQVcsRUFBRSwrREFBK0Q7QUFDNUUsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7QUFDZCxTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0Qsd0JBQXNCLEVBQUU7O0FBRXRCLFNBQUssRUFBRSx1REFBdUQ7QUFDOUQsZUFBVyxFQUFFLGlFQUFpRTtBQUM5RSxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztBQUNkLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxvQkFBa0IsRUFBRTs7QUFFbEIsU0FBSyxFQUFFLGdEQUFnRDtBQUN2RCxlQUFXLEVBQUUsdUVBQXVFO0FBQ3BGLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0FBQ2IsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELGlDQUErQixFQUFFOztBQUUvQixTQUFLLEVBQUUsbUVBQW1FO0FBQzFFLGVBQVcsRUFBRSxzREFBc0Q7QUFDbkUsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7QUFDZCxTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0QsZUFBYSxFQUFFOztBQUViLFNBQUssRUFBRSxlQUFlO0FBQ3RCLGVBQVcsRUFBRSx3RUFBd0U7QUFDckYsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7QUFDYixTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0QsTUFBSSxFQUFFOztBQUVKLFNBQUssRUFBRSxLQUFLO0FBQ1osZUFBVyxFQUFFLHNFQUFzRTtBQUNuRixRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtBQUNiLFNBQUssRUFBRSxFQUFFO0dBQ1Y7QUFDRCxTQUFPLEVBQUU7O0FBRVAsU0FBSyxFQUFFLFFBQVE7QUFDZixlQUFXLEVBQUUsMkRBQTJEO0FBQ3hFLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0FBQ2IsU0FBSyxFQUFFLEVBQUU7R0FDVjtBQUNELHdCQUFzQixFQUFFOztBQUV0QixTQUFLLEVBQUUsMkJBQTJCO0FBQ2xDLGVBQVcsRUFBRSxpRkFBaUY7QUFDOUYsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7QUFDYixTQUFLLEVBQUUsRUFBRTtHQUNWO0FBQ0QsNEJBQTBCLEVBQUU7O0FBRTFCLFNBQUssRUFBRSwrQkFBK0I7QUFDdEMsZUFBVyxFQUFFLDBFQUEwRTtBQUN2RixRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsS0FBSztBQUNkLFNBQUssRUFBRSxFQUFFO0dBQ1Y7Q0FDRiIsImZpbGUiOiIvVXNlcnMvbGFyc2dyYXVibmVyLy5kb3RmaWxlcy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICBleGNsdWRlTG93ZXJQcmlvcml0eVByb3ZpZGVyczoge1xuXG4gICAgdGl0bGU6ICdFeGNsdWRlIGxvd2VyIHByaW9yaXR5IHByb3ZpZGVycycsXG4gICAgZGVzY3JpcHRpb246ICdXaGV0aGVyIHRvIGV4Y2x1ZGUgbG93ZXIgcHJpb3JpdHkgcHJvdmlkZXJzIChlLmcuIGF1dG9jb21wbGV0ZS1wYXRocyknLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBvcmRlcjogMFxuICB9LFxuICBndWVzczoge1xuXG4gICAgdGl0bGU6ICdHdWVzcycsXG4gICAgZGVzY3JpcHRpb246ICdXaGVuIGNvbXBsZXRpbmcgYSBwcm9wZXJ0eSBhbmQgbm8gY29tcGxldGlvbnMgYXJlIGZvdW5kLCBUZXJuIHdpbGwgdXNlIHNvbWUgaGV1cmlzdGljcyB0byB0cnkgYW5kIHJldHVybiBzb21lIHByb3BlcnRpZXMgYW55d2F5LiBTZXQgdGhpcyB0byBmYWxzZSB0byB0dXJuIHRoYXQgb2ZmLicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgb3JkZXI6IDFcbiAgfSxcbiAgc29ydDoge1xuXG4gICAgdGl0bGU6ICdTb3J0JyxcbiAgICBkZXNjcmlwdGlvbjogJ0RldGVybWluZXMgd2hldGhlciB0aGUgcmVzdWx0IHNldCB3aWxsIGJlIHNvcnRlZC4nLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG9yZGVyOiAyXG4gIH0sXG4gIGNhc2VJbnNlbnNpdGl2ZToge1xuXG4gICAgdGl0bGU6ICdDYXNlLWluc2Vuc2l0aXZlJyxcbiAgICBkZXNjcmlwdGlvbjogJ1doZXRoZXIgdG8gdXNlIGEgY2FzZS1pbnNlbnNpdGl2ZSBjb21wYXJlIGJldHdlZW4gdGhlIGN1cnJlbnQgd29yZCBhbmQgcG90ZW50aWFsIGNvbXBsZXRpb25zLicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgb3JkZXI6IDNcbiAgfSxcbiAgdXNlU25pcHBldHM6IHtcblxuICAgIHRpdGxlOiAnVXNlIGF1dG9jb21wbGV0ZS1zbmlwcGV0cycsXG4gICAgZGVzY3JpcHRpb246ICdBZGRzIHNuaXBwZXRzIHRvIGF1dG9jb21wbGV0ZSsgc3VnZ2VzdGlvbnMnLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBvcmRlcjogNFxuICB9LFxuICBzbmlwcGV0c0ZpcnN0OiB7XG5cbiAgICB0aXRsZTogJ0Rpc3BsYXkgc25pcHBldHMgYWJvdmUnLFxuICAgIGRlc2NyaXB0aW9uOiAnRGlzcGxheXMgc25pcHBldHMgYWJvdmUgdGVybiBzdWdnZXN0aW9ucy4gUmVxdWlyZXMgYSByZXN0YXJ0LicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIG9yZGVyOiA1XG4gIH0sXG4gIHVzZVNuaXBwZXRzQW5kRnVuY3Rpb246IHtcblxuICAgIHRpdGxlOiAnRGlzcGxheSBib3RoLCBhdXRvY29tcGxldGUtc25pcHBldHMgYW5kIGZ1bmN0aW9uIG5hbWUnLFxuICAgIGRlc2NyaXB0aW9uOiAnQ2hvb3NlIHRvIGp1c3QgY29tcGxldGUgdGhlIGZ1bmN0aW9uIG5hbWUgb3IgZXhwYW5kIHRoZSBzbmlwcGV0JyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgb3JkZXI6IDZcbiAgfSxcbiAgaW5saW5lRm5Db21wbGV0aW9uOiB7XG5cbiAgICB0aXRsZTogJ0Rpc3BsYXkgaW5saW5lIHN1Z2dlc3Rpb25zIGZvciBmdW5jdGlvbiBwYXJhbXMnLFxuICAgIGRlc2NyaXB0aW9uOiAnRGlzcGxheXMgYSBpbmxpbmUgc3VnZ2VzdGlvbiBsb2NhdGVkIHJpZ2h0IG5leHQgdG8gdGhlIGN1cnJlbnQgY3Vyc29yJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBvcmRlcjogN1xuICB9LFxuICBpbmxpbmVGbkNvbXBsZXRpb25Eb2N1bWVudGF0aW9uOiB7XG5cbiAgICB0aXRsZTogJ0Rpc3BsYXkgaW5saW5lIHN1Z2dlc3Rpb25zIHdpdGggYWRkaXRpb25hbCBkb2N1bWVudGF0aW9uIChpZiBhbnkpJyxcbiAgICBkZXNjcmlwdGlvbjogJ0FkZHMgZG9jdW1lbnRhdGlvbiB0byB0aGUgaW5saW5lIGZ1bmN0aW9uIGNvbXBsZXRpb24nLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBvcmRlcjogOFxuICB9LFxuICBkb2N1bWVudGF0aW9uOiB7XG5cbiAgICB0aXRsZTogJ0RvY3VtZW50YXRpb24nLFxuICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciB0byBpbmNsdWRlIGRvY3VtZW50YXRpb24gc3RyaW5nIChpZiBmb3VuZCkgaW4gdGhlIHJlc3VsdCBkYXRhLicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgb3JkZXI6IDlcbiAgfSxcbiAgdXJsczoge1xuXG4gICAgdGl0bGU6ICdVcmwnLFxuICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciB0byBpbmNsdWRlIGRvY3VtZW50YXRpb24gdXJscyAoaWYgZm91bmQpIGluIHRoZSByZXN1bHQgZGF0YS4nLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG9yZGVyOiAxMFxuICB9LFxuICBvcmlnaW5zOiB7XG5cbiAgICB0aXRsZTogJ09yaWdpbicsXG4gICAgZGVzY3JpcHRpb246ICdXaGV0aGVyIHRvIGluY2x1ZGUgb3JpZ2lucyAoaWYgZm91bmQpIGluIHRoZSByZXN1bHQgZGF0YS4nLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG9yZGVyOiAxMVxuICB9LFxuICB0ZXJuU2VydmVyR2V0RmlsZUFzeW5jOiB7XG5cbiAgICB0aXRsZTogJ1Rlcm4gU2VydmVyIGdldEZpbGUgYXN5bmMnLFxuICAgIGRlc2NyaXB0aW9uOiAnSW5kaWNhdGVzIHdoZXRoZXIgZ2V0RmlsZSBpcyBhc3luY2hyb25vdXMuIERlZmF1bHQgaXMgdHJ1ZS4gUmVxdWlyZXMgYSByZXN0YXJ0LicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgb3JkZXI6IDEyXG4gIH0sXG4gIHRlcm5TZXJ2ZXJEZXBlbmRlbmN5QnVkZ2V0OiB7XG5cbiAgICB0aXRsZTogJ1Rlcm4gU2VydmVyIGRlcGVuZGVuY3ktYnVkZ2V0JyxcbiAgICBkZXNjcmlwdGlvbjogJ2h0dHA6Ly90ZXJuanMubmV0L2RvYy9tYW51YWwuaHRtbCNkZXBlbmRlbmN5X2J1ZGdldC4gUmVxdWlyZXMgYSByZXN0YXJ0LicsXG4gICAgdHlwZTogJ251bWJlcicsXG4gICAgZGVmYXVsdDogMjAwMDAsXG4gICAgb3JkZXI6IDEzXG4gIH1cbn07XG4iXX0=