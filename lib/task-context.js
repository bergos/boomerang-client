var TaskContext = function () {
  this.env = {
    isNode: (typeof process !== 'undefined' && process.versions && process.versions.node)
  };

  this.graphStore = new rdf.promise.Store(new rdf.InMemoryStore())
};


module.exports = TaskContext;