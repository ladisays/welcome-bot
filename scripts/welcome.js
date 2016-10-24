var DB_URL = process.env.DB_URL,
    COMPANY_NAME = process.env.COMPANY_NAME,
    timeout,
    users = [],
    usersWithNoTitle = [],
    usersWithDefaultProfileImage = [],
    MESSAGES = [],
    WELCOME_MSGS = [
        // "We heard that our company just hired you to be a part of our growing team. Congratulations and on behalf of our members and leadership, we would like to welcome you! We are all happy and excited for the upbringing of our company.",
        // "Our company is truly happy that you have finally decided to join our team. We believe that you can be one of the best assets here. We can’t wait to know your plans for our team.",
        // "Our office welcomes you today as you start working with us. May we have a great time together, simply enjoy our team and work hard. I wish you the best of luck. Welcome aboard!",
        // "Welcome to our company! On behalf of our team and management, we would like you to know that we are so grateful to have you. We believe that you can contribute a lot for our company’s success and improvement. Welcome aboard.",
        // "Congratulations for getting the job, thus, we would like you to know that we are all happy and excited to work with you. We believe that your abilities will help our company to grow more and become bigger.",
        // "We are so excited to have you in our group! We believe that you can use your skills and talent in making our company reach new heights.",
        // "Hope you will have an amazing time working with us and are really glad that you’ve joined us.",
        "You are here because you are EPIC! (I’ll let the P&C team decode that for you) and we are glad you joined us."
    ];

function joinUsers(users) {
    var i, joinedUsers = "";

    // Loop through the array supplied as an argument
    for (i = 0; i < users.length; i += 1) {
        // Assign the username to the joinedUsers variable
        joinedUsers += ('<@' + users[i].id + '|' + users[i].name + '>');
        // Check that the current index of the user is not the last in the array
        if (i !== (users.length - 1)) {
            // Append a white space to the variable
            joinedUsers += " ";
        }
    }

    return joinedUsers;
}

function randomReply(users) {
    var msg,
        randomMsg = MESSAGES.length ? MESSAGES[Math.floor(Math.random() * MESSAGES.length)] : WELCOME_MSGS[0],
        welcome = joinUsers(users) + " so you got in... WHOOP! WHOOP!!";
        welcome += "\n\nWelcome to the coolest team ever! :andela: ";

    welcome += randomMsg;

    // Check if there are users in the usersWithDefaultProfileImage array
    if (usersWithDefaultProfileImage.length) {
        if (usersWithDefaultProfileImage.length === 1) {
            msg = '\n\nWe love pictures! Please update your Slack profile with an on-fleek profile photo so we can easily spot you around the office.';
        } else {
            msg = '\n\n' + joinUsers(usersWithDefaultProfileImage) + ' we love pictures! Please update your Slack profile with an on-fleek profile photo so we can easily spot you around the office.';
        }

        // Append the msg variable to the welcome message.
        welcome += msg;
    }

    if (usersWithNoTitle.length) {
        if (usersWithNoTitle.length === 1) {
            msg = "\n\nAdd your role to your profile description so we can easily tease… I mean, know what you're up to.";
        } else {
            msg = "\n\n" + joinUsers(usersWithNoTitle) + " add your role to your profile description so we can easily tease… I mean, know what you're up to.";
        }
        
        welcome += msg;
    }

    // Append the last message to the welcome message
    welcome += "\n\nWe'd also love an introduction spiced with funny and weird facts about you. Don't be shy. At Andela, every individual is *_special_*. We can’t wait to discover your superpowers :wink:\n\nYou are Andela!\n\nWelcome :tia:";

    return welcome;
}

function bot(robot) {
    // Get all the messages in the database with the active status
    // robot.http(DB_URL + '/messages.json')
    // .headers({'Content-Type': 'application/json'})
    // .get()(function (err, response, body) {
    //     var key;
    //     if (err) {
    //         MESSAGES = WELCOME_MSGS;
    //         return;
    //     }
    //     if (body) {
    //         body = JSON.parse(body);

    //         for (key in body) {
    //             MESSAGES.push(body[key].message);
    //         }

    //         return;
    //     }
    // });

    robot.enter(function (res) {
        // Check if the user is not a bot and has only entered the general channel
        if (res.message.room === 'general' || 'ladi-bot' && !res.message.user.slack.is_bot) {
            // Add new user to the users array
            users.push(res.message.user);

            // Check if the user still has the default image
            if (!res.message.user.slack.profile.hasOwnProperty('image_original')) {
                usersWithDefaultProfileImage.push(res.message.user);
            }

            // Check if the user has no title in the profile
            if (!res.message.user.slack.profile.title) {
                usersWithNoTitle.push(res.message.user);
            }
        }

        // Clear timeout if a new user joins the channel within 30 seconds.
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function () {
            // Reply all the users within 30 seconds.
            res.send(randomReply(users));

            // Reset all users array
            users = [];
            usersWithNoTitle = [];
            usersWithDefaultProfileImage = [];

        }, 30000);
        // Set timeout with function call to print random reply
    });
}


module.exports = bot;
