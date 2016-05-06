var DB_URL = process.env.DB_URL,
    HEROKU_URL = process.env.HEROKU_URL,
    SLACK_ADMIN_CHANNEL = process.env.SLACK_ADMIN_CHANNEL;

function bot(robot) {
    robot.router.get('/hubot/messages/:message_id', function (req, res) {
        var message_id = req.params.message_id;

        robot.http(DB_URL + '/messages/' + message_id + '.json')
        .headers({'Content-Type': 'application/json'})
        .get()(function (error, response, body) {
            var attachment, approvalUrl;

            if (error) {
                return res.status(404).send('Not found');
            }

            body = JSON.parse(body);

            approvalUrl = HEROKU_URL + '/hubot/messages/' + message_id + '/approve';

            attachment = {
                content: {
                    color: '#3AA3E3',
                    fallback: '<!group> New welcome message for approval',
                    pretext: '<!group> New welcome message for approval',
                    title: body.message,
                    text: '<' + approvalUrl + '|Click here to approve message>',
                    fields: [
                        {
                            title: 'Author',
                            value: (body.user.real_name || '') + '\n<@' + body.user.id + '|' + body.user.name + '>',
                            short: true
                        },
                        {
                            title: 'Date Created',
                            value: formatDate(body.createdAt),
                            short: true
                        }
                    ],
                    mrkdwn_in: ['text'],
                    unfurl_links: true
                },
                channel: SLACK_ADMIN_CHANNEL
            };

            robot.emit('slack.attachment', attachment);

            return res.status(201).send('Message sent to the approval channel');
        });
    });

    robot.router.get('/hubot/messages/:message_id/approve', function (req, res) {
        var attachment, data,
            message_id = req.params.message_id,
            options = {
                status: 'active',
                updatedAt   : {
                    ".sv"   : "timestamp"
                }
            };

        robot.http(DB_URL + '/messages/' + message_id + '.json')
        .headers({'Content-Type': 'application/json'})
        .get()(function (error, response, body) {
            if (error) {
                return res.status(404).send('Not found!');
            }

            data = JSON.parse(body);

            if (data.status === 'active') {
                return res.status(201).send('<html><body style="padding:20px;text-align:center;color:#767676;"><h3>Message has already been approved.</h3><script>setTimeout(function(){window.close();},200);</script></body></html>');
            }

            if (data.status === 'inactive') {
                robot.http(DB_URL + '/messages/' + message_id + '.json')
                .headers({'Content-Type': 'application/json'})
                .patch(JSON.stringify(options))(function (error, response, body) {
                    if (error) {
                        return res.status(400).send('Request could not be processed!');
                    }

                    attachment = {
                        content: {
                            color: '#5CB85C',
                            fallback: 'Your welcome message has been approved',
                            pretext: 'Your welcome message has been approved by the bot team',
                            title: 'Here is your message',
                            text: data.message
                        },
                        channel: data.user.name
                    };

                    robot.emit('slack.attachment', attachment);

                    return res.status(201).send('<html><body style="padding:20px;text-align:center;color:#767676;"><h3>Message has been approved.</h3><script>setTimeout(function(){window.close();},200);</script></body></html>');
                });
            }
        });
    });
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