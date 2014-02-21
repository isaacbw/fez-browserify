var browserify = require("browserify");

module.exports = function(options) {
  return function(inputs) {
    var b = browserify();
    inputs.forEach(function(input) {
      b.add(input.getFilename());
    });
    // Transforms are order dependent. Provide an array with the transforms in order.
    if (options.transforms) {
        if (!Array.isArray(options.transforms)) 
            throw new Error('options.transforms must be an Array');
        for (var i = 0; i < options.transforms.length; i += 1)
            b.transform(options.transforms[i]);
    }
    return b.bundle(options);
  };
};
