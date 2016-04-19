var timeout,
    users = [],
    usersWithDefaultProfileImage = [],
    MESSAGES = [
        "We heard that our company just hired you to be a part of our growing team. Congratulations and in behalf of our members and supervisors, we would like to welcome you! We are all happy and excited for the upbringing of our company.",
        "Our company is truly happy that you have finally decided to join our team. We believe that you can be one of the best assets here. We can’t wait to know your plans for our team.",
        "Our office welcomes you today as you start working with us. May we have great time together, simply enjoy our team and work hard. I wish you all the luck. Welcome aboard!",
        "Welcome to our company! In behalf of our team and management, we would like you to know that we are so grateful of having you. We believe that you can contribute a lot for our company’s success and improvement. Welcome aboard.",
        "Congratulations for getting the job thus we would like you to know that we are all happy and excited to work with you. We believe that your abilities will help our company to grow more and become bigger.",
        "We are so excited to have you in our group! We believe that you can use your skills and talent in making our company reach new heights.",
        "Hope you will have an amazing time working with us and are really glad that you’ve joined us."
    ];


function bot(robot) {
    robot.enter(function (res) {
        // Check if the user is not a bot and has only entered the general channel
        if (res.message.room === 'general' && !res.message.user.slack.is_bot) {
            // Add new user to the users array
            users.push(res.message.user);

            // Check if the user still has the default image
            if (!res.message.user.slack.profile.hasOwnProperty('image_original')) {
                usersWithDefaultProfileImage.push(res.message.user);
            }
        }

        // Clear timeout if a new user joins the channel within 30 seconds.
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function() {
            // Reply all the users within 30 seconds.
            res.send(randomReply(users));

            // Reset all users array
            users = [];
            usersWithDefaultProfileImage = [];

        }, 30000);
        // Set timeout with function call to print random reply
    });
}

function randomReply(users) {
    var msg,
        randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
        welcome = "Welcome to the Andela team " + joinUsers(users) + ", ";

    welcome += randomMsg;

    // Check if there are users in the usersWithDefaultProfileImage array
    if (usersWithDefaultProfileImage.length) {
        msg = '\n' + joinUsers(usersWithDefaultProfileImage) + ' please, ensure you update your slack account with a profile picture, so that you can be easily identified with.';

        // Append the msg variable to the welcome message.
        welcome += msg;
    }

    // Append the last message to the welcome message
    welcome += "\n\nEndeavour to add your job role to your profile too. Once you've completed that tiny task, feel free to introduce yourself to us all.";

    return welcome;
}

function joinUsers(users) {
    var i, joinedUsers = "";

    // Loop through the array supplied as an argument
    for (i = 0; i < users.length; i++) {
        // Assign the username to the joinedUsers variable
        joinedUsers += ('@' + users[i].name);
        // Check that the current index of the user is not the last in the array
        if (i !== (users.length - 1)) {
            // Append a white space to the variable
            joinedUsers += ' ';
        }
    }

    return joinedUsers;
}

module.exports = bot;
