var async = require('async');
var cachedRequest = require('./cachedRequest');
var employee = require('./ansatt');
var veivesenet = require('./veivesenet');

var socialcastUrl = process.env.SOCIALCAST_URL;
var socialcastUser = process.env.SOCIALCAST_USER;
var socialcastPassword = process.env.SOCIALCAST_PASS;

var socialcastAuth = {
    user: socialcastUser,
    pass: socialcastPassword
};

function socialcastParams(url) {
    return {
        url: socialcastUrl + url,
        json: true,
        auth: socialcastAuth
    };
}

function messages(page, callback) {
	if (typeof page === "function" && typeof callback === "undefined") {
		callback = page;
		page = 1;
	}

    cachedRequest(socialcastParams('/api/messages?page=' + page), function(error, response, body) {
        if (error) {
            return callback(error);
        }

        var reqs = body.map(function(message){
            return function(cb) {
                console.log('add extra info', message);
                addExtraInfo(message, cb);
            };
        });

        async.parallel(reqs, function(){
            callback(null, body);
        });
    });
}

function addExtraInfo(message, cb) {
    var fns = [
        addUserInfo,
        addLikes
    ];

    async.each(fns, function(item, callback) {
        item(message, callback);
    }, function(err, boom) {
        cb(null);
    });
};

function addUserInfo(message, callback) {
    if (message.user) {
        var user = employee.get(message.user.name);
        if (user) {
            message.user.senioritet = user.Seniority;
            message.user.avdeling = user.Department;
            addBilInfo(user.Cars, message, callback);
        }
    }
}

function message(id, callback) {
	cachedRequest(socialcastParams('/api/messages/' + id), function(error, response, body) {
        if (error) return callback(error);
        console.log('message', id, body);
        addExtraInfo(body, function() {
            callback(null, body);
        });
    });
}

function addLikes(message, callback){
    cachedRequest(socialcastParams('/api/messages/' +  message.id + '/likes'), function(error, response, likes) {
        if (error) {
            return callback(error);
        }
        message.likes = likes;
        callback(null, likes);
    });
}

function addBilInfo(regNr, message, callback){
    veivesenet.bilInfo(regNr, function(error, bilInfo) {
        message.user.bilmerke = bilInfo['Merke og modell'];
        message.user.drivstofftype = bilInfo['Drivstoff'];
        callback(null);
    });
}

module.exports = {
	messages: messages,
	message: message
};
