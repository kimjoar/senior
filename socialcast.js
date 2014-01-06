var request = require('request');

var socialcastUrl = process.env.SOCIALCAST_URL;
var socialcastUser = process.env.SOCIALCAST_USER;
var socialcastPassword = process.env.SOCIALCAST_PASS;

var socialcastAuth = {
    user: socialcastUser,
    pass: socialcastPassword
};

function messageHandler() {
    var messages = [];

    setInterval(function() {
        messages = [];
    }, 120000);

    return function(newMessages) {
        if (newMessages) {
            messages = newMessages;
        }
        return messages;
    };
}

var socialcastMessages = messageHandler();

function socialcastParams(url) {
    return {
        url: socialcastUrl + url,
        json: true,
        auth: socialcastAuth
    };
}

function messages(callback) {
	if (socialcastMessages().length > 0) return res.json(socialcastMessages());

    request.get(socialcastParams('/api/messages'), function(error, response, body) {
        if (error) {
            return callback(error);
        }
        callback(null, socialcastMessages(body));
    });
}

function message(id, callback) {
	request.get(socialcastParams('/api/messages/' + id), function(error, response, body) {
        if (error) {
            return callback(error);
        }
        callback(null, body);
    });
}

module.exports = {
	messages: messages,
	message: message
};