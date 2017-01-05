(function() {
  module.exports = {
    name: "PHP",
    namespace: "php",

    /*
    Supported Grammars
     */
    grammars: ["PHP"],

    /*
    Supported extensions
     */
    extensions: ["php", "module", "inc"],
    defaultBeautifier: "PHP-CS-Fixer",
    options: {
      cs_fixer_path: {
        title: "PHP-CS-Fixer Path",
        type: 'string',
        "default": "",
        description: "Path to the `php-cs-fixer` CLI executable"
      },
      fixers: {
        type: 'string',
        "default": "",
        description: "Add fixer(s). i.e. linefeed,-short_tag,indentation"
      },
      level: {
        type: 'string',
        "default": "",
        description: "By default, all PSR-2 fixers and some additional ones are run."
      },
      phpcbf_path: {
        title: "PHPCBF Path",
        type: 'string',
        "default": "",
        description: "Path to the `phpcbf` CLI executable"
      },
      standard: {
        title: "PHPCBF Standard",
        type: 'string',
        "default": "",
        description: "Standard name Squiz, PSR2, PSR1, PHPCS, PEAR, Zend, MySource... or path to CS rules"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL3BocC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUVmLElBQUEsRUFBTSxLQUZTO0lBR2YsU0FBQSxFQUFXLEtBSEk7O0FBS2Y7OztJQUdBLFFBQUEsRUFBVSxDQUNSLEtBRFEsQ0FSSzs7QUFZZjs7O0lBR0EsVUFBQSxFQUFZLENBQ1YsS0FEVSxFQUVWLFFBRlUsRUFHVixLQUhVLENBZkc7SUFxQmYsaUJBQUEsRUFBbUIsY0FyQko7SUF1QmYsT0FBQSxFQUNFO01BQUEsYUFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLG1CQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBRlQ7UUFHQSxXQUFBLEVBQWEsMkNBSGI7T0FERjtNQUtBLE1BQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQURUO1FBRUEsV0FBQSxFQUFhLG9EQUZiO09BTkY7TUFTQSxLQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFEVDtRQUVBLFdBQUEsRUFBYSxnRUFGYjtPQVZGO01BYUEsV0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLGFBQVA7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFGVDtRQUdBLFdBQUEsRUFBYSxxQ0FIYjtPQWRGO01Ba0JBLFFBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxpQkFBUDtRQUNBLElBQUEsRUFBTSxRQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQUZUO1FBR0EsV0FBQSxFQUFhLHFGQUhiO09BbkJGO0tBeEJhOztBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIG5hbWU6IFwiUEhQXCJcbiAgbmFtZXNwYWNlOiBcInBocFwiXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBHcmFtbWFyc1xuICAjIyNcbiAgZ3JhbW1hcnM6IFtcbiAgICBcIlBIUFwiXG4gIF1cblxuICAjIyNcbiAgU3VwcG9ydGVkIGV4dGVuc2lvbnNcbiAgIyMjXG4gIGV4dGVuc2lvbnM6IFtcbiAgICBcInBocFwiXG4gICAgXCJtb2R1bGVcIlxuICAgIFwiaW5jXCJcbiAgXVxuXG4gIGRlZmF1bHRCZWF1dGlmaWVyOiBcIlBIUC1DUy1GaXhlclwiXG5cbiAgb3B0aW9uczpcbiAgICBjc19maXhlcl9wYXRoOlxuICAgICAgdGl0bGU6IFwiUEhQLUNTLUZpeGVyIFBhdGhcIlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiXCJcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlBhdGggdG8gdGhlIGBwaHAtY3MtZml4ZXJgIENMSSBleGVjdXRhYmxlXCJcbiAgICBmaXhlcnM6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJcIlxuICAgICAgZGVzY3JpcHRpb246IFwiQWRkIGZpeGVyKHMpLiBpLmUuIGxpbmVmZWVkLC1zaG9ydF90YWcsaW5kZW50YXRpb25cIlxuICAgIGxldmVsOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiXCJcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkJ5IGRlZmF1bHQsIGFsbCBQU1ItMiBmaXhlcnMgYW5kIHNvbWUgYWRkaXRpb25hbCBvbmVzIGFyZSBydW4uXCJcbiAgICBwaHBjYmZfcGF0aDpcbiAgICAgIHRpdGxlOiBcIlBIUENCRiBQYXRoXCJcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcIlwiXG4gICAgICBkZXNjcmlwdGlvbjogXCJQYXRoIHRvIHRoZSBgcGhwY2JmYCBDTEkgZXhlY3V0YWJsZVwiLFxuICAgIHN0YW5kYXJkOlxuICAgICAgdGl0bGU6IFwiUEhQQ0JGIFN0YW5kYXJkXCJcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcIlwiLFxuICAgICAgZGVzY3JpcHRpb246IFwiU3RhbmRhcmQgbmFtZSBTcXVpeiwgUFNSMiwgUFNSMSwgUEhQQ1MsIFBFQVIsIFplbmQsIE15U291cmNlLi4uIG9yIHBhdGggdG8gQ1MgcnVsZXNcIlxuXG59XG4iXX0=
