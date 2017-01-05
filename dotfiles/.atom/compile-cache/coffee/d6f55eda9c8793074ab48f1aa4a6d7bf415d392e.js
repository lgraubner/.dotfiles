(function() {
  module.exports = {
    name: "Markdown",
    namespace: "markdown",

    /*
    Supported Grammars
     */
    grammars: ["GitHub Markdown"],

    /*
    Supported extensions
     */
    extensions: ["markdown", "md"],
    defaultBeautifier: "Tidy Markdown",
    options: {
      gfm: {
        type: 'boolean',
        "default": true,
        description: 'GitHub Flavoured Markdown'
      },
      yaml: {
        type: 'boolean',
        "default": true,
        description: 'Enables raw YAML front matter to be detected (thus ignoring markdown-like syntax).'
      },
      commonmark: {
        type: 'boolean',
        "default": false,
        description: 'Allows and disallows several constructs.'
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL21hcmtkb3duLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBRWYsSUFBQSxFQUFNLFVBRlM7SUFHZixTQUFBLEVBQVcsVUFISTs7QUFLZjs7O0lBR0EsUUFBQSxFQUFVLENBQ1IsaUJBRFEsQ0FSSzs7QUFZZjs7O0lBR0EsVUFBQSxFQUFZLENBQ1YsVUFEVSxFQUVWLElBRlUsQ0FmRztJQW9CZixpQkFBQSxFQUFtQixlQXBCSjtJQXNCZixPQUFBLEVBQ0U7TUFBQSxHQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLFdBQUEsRUFBYSwyQkFGYjtPQURGO01BSUEsSUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsb0ZBRmI7T0FMRjtNQVFBLFVBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLDBDQUZiO09BVEY7S0F2QmE7O0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgbmFtZTogXCJNYXJrZG93blwiXG4gIG5hbWVzcGFjZTogXCJtYXJrZG93blwiXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBHcmFtbWFyc1xuICAjIyNcbiAgZ3JhbW1hcnM6IFtcbiAgICBcIkdpdEh1YiBNYXJrZG93blwiXG4gIF1cblxuICAjIyNcbiAgU3VwcG9ydGVkIGV4dGVuc2lvbnNcbiAgIyMjXG4gIGV4dGVuc2lvbnM6IFtcbiAgICBcIm1hcmtkb3duXCJcbiAgICBcIm1kXCJcbiAgXVxuXG4gIGRlZmF1bHRCZWF1dGlmaWVyOiBcIlRpZHkgTWFya2Rvd25cIlxuXG4gIG9wdGlvbnM6XG4gICAgZ2ZtOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBkZXNjcmlwdGlvbjogJ0dpdEh1YiBGbGF2b3VyZWQgTWFya2Rvd24nXG4gICAgeWFtbDpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgZGVzY3JpcHRpb246ICdFbmFibGVzIHJhdyBZQU1MIGZyb250IG1hdHRlciB0byBiZSBkZXRlY3RlZCAodGh1cyBpZ25vcmluZyBtYXJrZG93bi1saWtlIHN5bnRheCkuJ1xuICAgIGNvbW1vbm1hcms6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogJ0FsbG93cyBhbmQgZGlzYWxsb3dzIHNldmVyYWwgY29uc3RydWN0cy4nXG59XG4iXX0=
