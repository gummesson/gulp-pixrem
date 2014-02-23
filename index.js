/* Modules */

var gutil   = require('gulp-util');
var through = require('through2');
var pixrem  = require('pixrem');

/* Exports */

module.exports = function(root, options) {
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
      file.contents = new Buffer(pixrem(file.contents.toString(), root, options));
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-pixrem', err));
    }

    this.push(file);
    cb();
  });
};
