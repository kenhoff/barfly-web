var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var envify = require('envify');
var rewireify = require('rewireify');

var rimraf = require('rimraf');

gulp.task('build-test', function() {
	console.log("building test suite...");
	if (process.env.NODE_ENV != "production") {
		require('dotenv').load()
	}
	rimraf("test.js", function() {
		browserify({
				entries: "./test/Main.jsx",
				transform: [reactify, envify, rewireify]
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
