var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');
var reactify = require('reactify');

gulp.task('default', function () {
	var watcher = gulp.watch("*.js", ["build"])
})

// let's be real, not a whole lot of this "vinyl-source-stream" stuff makes any sense to me.
gulp.task('build', function () {
	browserify({
		entries: "./barflyMain.js",
		transform: [reactify]
	}).bundle()
		.pipe(source("bundle.js"))
		.pipe(gulp.dest("./"))
})
