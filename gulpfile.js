var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('bot', function(){
	nodemon({ script: 'index.js' });
});

gulp.task('default', ['bot']);