/* Modules */

var assert     = require('assert');
var gutil      = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var pixrem     = require('./');

/* Helpers */

var regex = /sourceMappingURL=data:application\/json;base64/;

function fixture(content) {
  var file = new gutil.File({
    contents: new Buffer(content),
    cwd: __dirname,
    base: __dirname,
    path: __dirname + '/fixture.css'
  });

  return file;
}

/* Tests */

describe('gulp-pixrem', function() {
  it('should postprocess CSS using Pixrem with the default pixel root value', function(done) {
    var stream = pixrem();

    stream.on('data', function(data) {
      assert.equal(data.contents.toString(), 'code { font-size: 14px; font-size: 0.875rem; }');
      done();
    });

    stream.write(fixture('code { font-size: 0.875rem; }'));
  });

  it('should postprocess CSS using Pixrem with a custom pixel root value', function(done) {
    var stream = pixrem('10px');

    stream.on('data', function(data) {
      assert.equal(data.contents.toString(), 'code { font-size: 10px; font-size: 1rem; }');
      done();
    });

    stream.write(fixture('code { font-size: 1rem; }'));
  });
  
  it('should postprocess CSS using Pixrem with a custom pixel root value set in the html tag', function(done) {
    var stream = pixrem('100%', { replace: true });

    stream.on('data', function(data) {
      assert.equal(data.contents.toString(), 'html { font-size: 12px; } code { font-size: 12px; }');
      done();
    });

    stream.write(fixture('html { font-size: 12px; } code { font-size: 1rem; }'));
  });

  it('should postprocess CSS using Pixrem with sourcemaps', function(done) {
    var stream = sourcemaps.init();
    var write  = sourcemaps.write();

    stream.pipe(pixrem()).pipe(write);

    write.on('data', function(data) {
      var results = data.contents.toString();
      assert.ok(regex.test(results));
      done();
    });

    stream.write(fixture('code { font-size: 1rem; }'));
  });
});
