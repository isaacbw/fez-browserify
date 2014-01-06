var browserify = require("browserify");

module.exports = function(options) {
  return function(inputs) {
    var b = browserify();
    inputs.forEach(function(input) {
      b.add(input.getFilename());
    });

    return b.bundle(options);
  };
};
