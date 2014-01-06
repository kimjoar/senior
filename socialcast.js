var request = require('request');
var async = require('async');

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
	if (socialcastMessages().length > 0) return callback(null, socialcastMessages());

    request.get(socialcastParams('/api/messages'), function(error, response, body) {
        if (error) {
            return callback(error);
        }
        var likeRequests = [];
        body.forEach(function(message){
            likeRequests.push(function(callback) {
                addLikesToMessage(message, function(likes) {
                    callback(null, likes);
                });
            })
        });
        async.parallel(likeRequests, function(){
            callback(null, socialcastMessages(body));
        });
    });
}

function message(id, callback) {
	request.get(socialcastParams('/api/messages/' + id), function(error, response, body) {
        if (error) return callback(error);
        addLikesToMessage(body, function(){
            if (error) return callback(error);
            callback(null, body);
        });
    });
}

function addLikesToMessage(message, callback){
    request.get(socialcastParams('/api/messages/' +  message.id + '/likes'), function(error, response, likes) {
        if (error) {
            return callback(error);
        }
        console.log('LIKES:', likes);
        message.likes = likes;
        callback(null, likes);
    });
}

module.exports = {
	messages: messages,
	message: message
};