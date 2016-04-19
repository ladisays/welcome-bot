var shell = require('shelljs');
console.log("Starting Welcome Bot");
shell.exec('HUBOT_SLACK_TOKEN=xoxb-21176836768-s2RqPwzZij2q2tAhUdGB2gZg ./bin/hubot --adapter slack');