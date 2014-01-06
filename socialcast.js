var request = require('request');
var async = require('async');

var socialcastUrl = process.env.SOCIALCAST_URL;
var socialcastUser = process.env.SOCIALCAST_USER;
var socialcastPassword = process.env.SOCIALCAST_PASS;

var socialcastAuth = {
    user: socialcastUser,
    pass: socialcastPassword
};

var cachedLikes = {};

var socialcastMessages = [];

setInterval(function() {
    socialcastMessages.length = 0;
}, 120000);

function socialcastParams(url) {
    return {
        url: socialcastUrl + url,
        json: true,
        auth: socialcastAuth
    };
}

function messages(callback) {
	if (socialcastMessages.length > 0) return callback(null, socialcastMessages);

    request.get(socialcastParams('/api/messages'), function(error, response, body) {
        if (error) {
            return callback(error);
        }

        var reqs = body.map(function(message){
            return function(callback) {
                addLikesToMessage(message, function(likes) {
                    callback(null, likes);
                });
            };
        });

        async.parallel(reqs, function(){
            socialcastMessages = body;
            callback(null, socialcastMessages);
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
    if (cachedLikes[message.id]) {
        var l = cachedLikes[message.id];
        message.likes = l;
        return callback(null, l);
    }

    request.get(socialcastParams('/api/messages/' +  message.id + '/likes'), function(error, response, likes) {
        if (error) {
            return callback(error);
        }
        cachedLikes[message.id] = likes;
        message.likes = likes;
        callback(null, likes);
    });
}

module.exports = {
	messages: messages,
	message: message
};
