var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var env = require('node-env-file');

gulp.task('bot', function () {
	nodemon({ script: 'index.js' });
});

gulp.task('set-env', function () {
	return env('.env');
});

gulp.task('default', ['set-env', 'bot']);