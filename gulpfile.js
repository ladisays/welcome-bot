var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('bot', function () {
	nodemon({ script: 'index.js' });
});

// Laden
// gulp.task('set-env', function () {
// 	process.env.DB_URL = "https://welcomebot.firebaseio.com";
// 	process.env.COMPANY_NAME = "Laden Media";
// 	process.env.HEROKU_URL = "http://127.0.0.1:8080";
// 	process.env.HUBOT_SLACK_TOKEN = "xoxb-21176836768-s2RqPwzZij2q2tAhUdGB2gZg";

// 	return process.env;
// });

// Andela
gulp.task('set-env', function () {
	process.env.DB_URL = "https://welcomebot.firebaseio.com";
	process.env.COMPANY_NAME = "Andela";
	process.env.HEROKU_URL = "http://127.0.0.1:8080";
	process.env.HUBOT_SLACK_TOKEN = "xoxb-20085311829-dppWmYCG4CYgkQxYBQyHDoNt";

	return process.env;
});

gulp.task('default', ['set-env', 'bot']);