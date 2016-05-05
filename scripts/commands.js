var DB_URL = process.env.DB_URL,
    HEROKU_URL = process.env.HEROKU_URL;


function bot(robot) {
    robot.respond(/-a (.*)/i, function (res) {
        var data = {
            message     : res.match[1],
            user        : buildUserObject(res),
            status      : "inactive",
            createdAt   : {
                ".sv"   : "timestamp"
            }
        };

        robot.http(DB_URL + '/messages.json')
        .headers({'Content-Type': 'application/json'})
        .post(JSON.stringify(data))(function (err, response, body) {
            if (err) {
                return res.reply('Something went wrong while trying to add your welcome message. Please, try again later.');
            }
            // console.log('The data being sent - ', body);
            body = JSON.parse(body);

            robot.http(HEROKU_URL + '/hubot/messages/' + body.name)
            .headers({'Content-Type': 'application/json'})
            .get()(function (error, status, data) {
                if (error) {
                    return res.reply('Something went wrong while trying to add your welcome message. Please, try again later.');
                }
                
                return res.reply('Thank you. Your welcome message has been added to the list of welcome messages.\nOnce it has been approved, you will be notified by me.');
            });

        });
    });

    robot.respond(/-list/i , function (res) {
        robot.http(DB_URL + '/messages.json')
        .headers({'Content-Type': 'application/json'})
        .get()(function (err, response, body) {
            var key, messageList = [];

            if (err) {
                return res.reply('Unable to list all welcome messages');
            }
            
            body = JSON.parse(body);

            for (key in body) {
                if (body[key].status === 'active') {
                    messageList.push('`' + body[key].message + '`');
                }
            }

            if (messageList.length) {
                return robot.emit('slack-attachment', {
                    content         : {
                        color       : '#4F9689',
                        fallback    : 'Welcome message list',
                        pretext     : '',
                        title       : 'List of all welcome messages',
                        text        : messageList.join('\n\n\n'),
                        mrkdwn_in   : ['text']
                    },
                    channel         : res.message.room
                });
            } else {
                return res.reply('There are no active messages');
            }
        });
    });

    robot.respond(/-list-all|-la/i , function (res) {
        robot.http(DB_URL + '/messages.json')
        .headers({'Content-Type': 'application/json'})
        .get()(function (err, response, body) {
            var key, attachment, messageList = [];

            if (err) {
                return res.reply('Unable to list all welcome messages');
            }
            
            body = JSON.parse(body);

            for (key in body) {
                attachment = {
                    content         : {
                        color       : (body[key].status === "active") ? '#55BA77' : '#FF6D57',
                        fallback    : 'Welcome message - (' + body[key].status + ')',
                        pretext     : '',
                        title       : 'Welcome message - (' + body[key].status + ')',
                        text        : '`' + body[key].message + '`',
                        fields      : [
                            {
                                title: 'Author',
                                value: (body[key].user.real_name || '') + '\n@' + body[key].user.name,
                                short: true
                            },
                            {
                                title: 'Date Created',
                                value: formatDate(body[key].createdAt),
                                short: true
                            }
                        ],
                        mrkdwn_in   : ['text', 'title']
                    },
                    channel         : res.message.room
                };

                robot.emit('slack-attachment', attachment);
            }

        });
    });
}

function buildUserObject(res) {
    return {
        id          : res.message.user.slack.id,
        name        : res.message.user.slack.name,
        real_name   : res.message.user.real_name,
        icon        : res.message.user.slack.profile.image_32
    };
}

function formatDate(timestamp) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        date = new Date(timestamp),
        year = date.getFullYear(),
        month = months[date.getMonth()],
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds(),
        formattedDate;

        if (sec < 10) {
            sec = '0' + sec;
        }

        formattedDate = month + ' ' + day + ', ' + year + '\n' + hour + ':' + min + ':' + sec;

    return formattedDate;
}

module.exports = bot;
