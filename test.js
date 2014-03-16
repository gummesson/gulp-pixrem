/* Modules */

var assert = require('assert');
var gutil  = require('gulp-util');
var pixrem = require('./');

/* Tests */

describe('gulp-pixrem', function() {
  it('should postprocess CSS using Pixrem with the default pixel root value', function(done) {
    var stream = pixrem();

    stream.on('data', function(data) {
      assert.equal(data.contents.toString(), 'code { font-size: 14px; font-size: 0.875rem; }');
      done();
    });

    stream.write(new gutil.File({
      contents: new Buffer('code { font-size: 0.875rem; }')
    }));
  });

  it('should postprocess CSS using Pixrem with a custom pixel root value', function(done) {
    var stream = pixrem('10px');

    stream.on('data', function(data) {
      assert.equal(data.contents.toString(), 'code { font-size: 10px; font-size: 1rem; }');
      done();
    });

    stream.write(new gutil.File({
      contents: new Buffer('code { font-size: 1rem; }')
    }));
  });
});
