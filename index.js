/* Modules */

var gutil          = require('gulp-util');
var assign         = require('object-assign');
var applySourceMap = require('vinyl-sourcemaps-apply');
var through        = require('through2');
var pixrem         = require('pixrem');

/* Exports */

module.exports = function(root, options) {
  options = options || {};

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-pixrem', 'Streaming not supported'));
      return cb();
    }

    try {
      var settings = assign(options, {
        map: file.sourceMap ? { annotation: false } : false,
        from: file.relative,
        to: file.relative
      });

      var results = pixrem.process(file.contents.toString(), root, settings);

      if (results.map && file.sourceMap) {
        applySourceMap(file, results.map.toString());
        file.contents = new Buffer(results.css);
      } else {
        file.contents = new Buffer(results);
      }

    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-pixrem', err));
    }

    this.push(file);
    cb();
  });
};
