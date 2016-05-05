var shell = require('shelljs');
console.log("Starting Welcome Bot");
shell.exec('./bin/hubot --adapter slack');