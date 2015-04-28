/* Modules */

var assert     = require('assert');
var gutil      = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var pixrem     = require('./');

var sourceMapRegex = /sourceMappingURL=data:application\/json;base64/;

/* Tests */

describe('gulp-pixrem', function() {
  it('should postprocess CSS using Pixrem with the default pixel root value', function(done) {
    var stream = pixrem();

    stream.on('data', function(data) {
      assert.equal(data.contents.toString(), 'code { font-size: 14px; font-size: 0.875rem; }');
      done();
    });

    stream.write(new gutil.File({
      contents: new Buffer('code { font-size: 0.875rem; }'),
      cwd: __dirname,
      base: __dirname,
      path: __dirname + '/fixture.css'
    }));
  });

  it('should postprocess CSS using Pixrem with a custom pixel root value', function(done) {
    var stream = pixrem('10px');

    stream.on('data', function(data) {
      assert.equal(data.contents.toString(), 'code { font-size: 10px; font-size: 1rem; }');
      done();
    });

    stream.write(new gutil.File({
      contents: new Buffer('code { font-size: 1rem; }'),
      cwd: __dirname,
      base: __dirname,
      path: __dirname + '/fixture.css'
    }));
  });

  it('should postprocess CSS using Pixrem with inline sourcemaps', function(done) {
    var stream = sourcemaps.init();
    var write  = sourcemaps.write();

    stream.pipe(pixrem()).pipe(write);

    write.on('data', function(data) {
      var results = data.contents.toString();
      assert.ok(sourceMapRegex.test(results));
      done();
    });

    stream.write(new gutil.File({
      contents: new Buffer('code { font-size: 1rem; }'),
      cwd: __dirname,
      base: __dirname,
      path: __dirname + '/fixture.css'
    }));
  });
});
