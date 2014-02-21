var browserify  = require('../src/main');
var test        = require('tape');
var through     = require('through');

// Mock Input object -- simple mock
var Input = function (filepath){
  this.filepath = filepath;
}
Input.prototype.getFilename = function () {
  return this.filepath;
}

function bundleTest(options, inputs, cb) {
  var runner = browserify(options)
  var bundleStream = runner(inputs);

  var output = '';

  bundleStream.on('data', function(d) {
    output += d.toString('utf8');
  })

  bundleStream.on('error', function(e) {
    cb(e, '');
  })
  
  bundleStream.on('end', function() {
    cb(null, output);
  });
}

test('Browserify Should return a transformed file with hello world', function(t) {
  t.plan(1);

  bundleTest(
    {transforms:['brfs']},
    [new Input(__dirname+'/inputs/fstest.js')],
    function (err, output) {
      if (err) t.fail(err);
      t.assert(output.indexOf('hello world') !== -1);
      t.end();
    }
  )

});


test('Browserify Should return a transformed file with goodbye world', function(t) {
  t.plan(1);

  var trText = function (file) {
    var data = '';

    return through(function write(buff){
      data += buff.toString('utf8');
    }, function end() {
      this.queue(data.replace('hello', 'goodbye'));
      this.queue(null);
    })
  }

  bundleTest(
    {transforms:['brfs', trText]},
    [new Input(__dirname+'/inputs/fstest.js')],
    function (err, output) {
      if (err) t.fail(err);
      t.assert(output.indexOf('goodbye world') !== -1);
      t.end();
    }
  )
});