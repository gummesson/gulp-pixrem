/* Modules */

var assert = require('assert');
var gutil = require('gulp-util');
var pixrem = require('./index');

/* Tests */

it('should postprocess CSS using Pixrem', function(done) {
  var stream = pixrem();

  stream.on('data', function(data) {
    assert.equal(data.contents.toString(), 'code { font-size: 14px; font-size: 0.875rem; }');
    done();
  });

  stream.write(new gutil.File({
    contents: new Buffer('code { font-size: 0.875rem; }')
  }));
});
