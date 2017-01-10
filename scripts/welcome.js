var COMPANY_NAME = process.env.COMPANY_NAME,
    timeout, new_users = [];

function bot(robot) {
    robot.enter(function (res) {
        var msg = "",
            slack_attachment = {
                content: {
                    color: "#A6B2F7",
                    fallback: "",
                    pretext: "",
                    title: "",
                    text: "",
                    mrkdwn_in: ['text', 'pretext']
                },
                channel: ""
            },
            general_message_attachment = slack_attachment,
            profile_image_attachment,
            profile_title_attachment,
            direct_message_attachment,
            welcome_note;

        if (res.message.room === "general" || "ladi-bot" && !res.message.user.slack.is_bot) { // check if the user has entered the general or ladi-bot and is not a bot
            // Push the user into the users array.
            new_users.push(res.message.user);

            robot.adapter.client.openDM(res.message.user.id, function (room) {
                if (!room.ok) {
                    return res.send("Unable to send a message to <@" + res.message.user.name + "|" + res.message.user.name + ">");
                }

                profile_image_attachment = slack_attachment;
                profile_title_attachment = slack_attachment;
                direct_message_attachment = slack_attachment;

                direct_message_attachment.content.fallback = "Welcome to " + COMPANY_NAME + " <@" + res.message.user.id + "|" + res.message.user.name + ">";
                direct_message_attachment.content.title = "Welcome to " + COMPANY_NAME + " <@" + res.message.user.id + "|" + res.message.user.name + ">";
                direct_message_attachment.content.text = "You are here because you are EPIC! (I’ll let the P&C team decode that for you) and we are glad you joined us.";
                direct_message_attachment.channel = room.channel.id;

                robot.emit("slack-attachment", direct_message_attachment);


                if (!res.message.user.slack.profile.hasOwnProperty("image_original")) { // check if the user does not have a profile image
                    msg = "We love pictures! Please update your slack profile with an on-fleek profile photo so we can easily spot you around the office.";

                    profile_image_attachment.content.fallback = msg;
                    profile_image_attachment.content.title = "About Your Profile Photo";
                    profile_image_attachment.content.text = msg;
                    profile_image_attachment.channel = room.channel.id;

                    robot.emit("slack-attachment", profile_image_attachment);
                }

                if (!res.message.user.slack.profile.title) { // check if the user does not have a profile title
                    msg = "Add your role to your profile description so we can easily tease… I mean, know what you're up to.";

                    profile_title_attachment.content.fallback = msg;
                    profile_title_attachment.content.title = "About Your Profile Title";
                    profile_title_attachment.content.text = msg;
                    profile_title_attachment.channel = room.channel.id;

                    robot.emit("slack-attachment", profile_title_attachment);
                }
            });
        }

        // clear timeout if a new user joins the channel within 30 seconds.
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(function () { // set a timeout to send the greeting
            // general_message_attachment
            general_message_attachment.content.fallback = "Welcome to " + COMPANY_NAME + " " + joinUsers(new_users);
            general_message_attachment.content.title = new_users.length > 1 ? "We Have New Members!" : "We Have A New Member!";
            general_message_attachment.content.text = "Welcome to " + COMPANY_NAME + " " + joinUsers(new_users);
            general_message_attachment.channel = res.message.room;

            // msg = "Welcome to " + COMPANY_NAME + " " + joinUsers(new_users);

            new_users = []; // reset all users array

            // return res.send(msg);
            
            return robot.emit("slack-attachment", general_message_attachment); // send a general greeting with all the users within 30 seconds.

        }, 30000);
    });
}

function joinUsers(users) {
    var i, joinedUsers = "";

    // Loop through the array supplied as an argument
    for (i = 0; i < users.length; i += 1) {
        joinedUsers += ("<@" + users[i].id + "|" + users[i].name + ">"); // Assign the username to the joinedUsers variable
        
        if (i !== (users.length - 1)) { // Check that the current index of the user is not the last in the array
            joinedUsers += " "; // Append a white space to the variable
        }
    }

    return joinedUsers;
}

module.exports = bot;