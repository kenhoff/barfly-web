if (process.env.NODE_ENV != "production") {
	require('dotenv').load()
}

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var envify = require('envify');

var rimraf = require('rimraf');

gulp.task('default', function() {
	var watcher = gulp.watch(["test/*.jsx", "js/*.jsx"], ["build"])
	gulp.start('build')

})

// let's be real, not a whole lot of this "vinyl-source-stream" stuff makes any sense to me.
gulp.task('build', function() {
	console.log("building...");
	console.log("environment:", process.env.NODE_ENV);
	rimraf("app.js", function() {
		browserify({
				entries: "./js/Main.jsx",
				transform: [reactify, envify],
			}).bundle()
			// .on('error', function(err) {
			// 	console.log(err.message);
			// })
			.pipe(source("app.js"))
			.pipe(gulp.dest("./"))
			.on("end", function() {
				console.log("all done!");
			})
	})
})

gulp.task('test', function() {
	var watcher = gulp.watch(["test/*.jsx", "js/*.jsx"], ['build-test'])
	gulp.start('build-test')
})

gulp.task('build-test', function() {
	console.log("building test suite...");
	rimraf("test.js", function() {
		browserify({
				entries: "./test/MainTest.jsx",
				transform: [reactify]
			}).bundle()
			.on('error', function(err) {
				console.log(err.message);
			})
			.pipe(source("test.js"))
			.pipe(gulp.dest("./test/"))
			.on("end", function() {
				console.log("done building test suite");
			})
	})
})
