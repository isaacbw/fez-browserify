var browserify  = require('../src/main');
var test        = require('tape');
var through     = require('through');

test('Browserify Should return a transformed file with hello world', function(t) {
  t.plan(1);
  var runner = browserify({
    transforms: [
      'brfs'
    ]
  })

  // Mock Input object -- simple mock
  var Input = function (filepath){
    this.filepath = filepath;
  }
  Input.prototype.getFilename = function () {
    return this.filepath;
  }

  var bundleStream = runner([new Input(__dirname+'/inputs/fstest.js')]);

  var file = ''

  bundleStream.on('data', function(d) {
    file += d.toString('utf8');
  })
  
  bundleStream.on('end', function() {
    t.assert(file.indexOf('hello world') !== -1);
    t.end();
  });
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

  var runner = browserify({
    transforms: [
      'brfs',
      trText
    ]
  })

  // Mock Input object -- simple mock
  var Input = function (filepath){
    this.filepath = filepath;
  }
  Input.prototype.getFilename = function () {
    return this.filepath;
  }

  var bundleStream = runner([new Input(__dirname+'/inputs/fstest.js')]);

  var file = ''

  bundleStream.on('data', function(d) {
    file += d.toString('utf8');
  })
  
  bundleStream.on('end', function() {
    t.assert(file.indexOf('goodbye world') !== -1);
    t.end();
  });
});