var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var reactify = require('reactify');

gulp.task('default', function() {
	var watcher = gulp.watch("js/*.jsx", ["build"])
	gulp.start('build')

})

// let's be real, not a whole lot of this "vinyl-source-stream" stuff makes any sense to me.
gulp.task('build', function() {
	browserify({
			entries: "./js/Main.jsx",
			transform: [reactify]
		}).bundle()
		.on('error', function(err) {
			console.log(err.message);
		})
		.pipe(source("bundle.js"))
		.pipe(gulp.dest("./"))
})
