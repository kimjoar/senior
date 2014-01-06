var express = require('express');
var request = require('request');
var app = express();

var socialcastUrl = process.env.SOCIALCAST_URL;
var socialcastUser = process.env.SOCIALCAST_USER;
var socialcastPassword = process.env.SOCIALCAST_PASS;

var socialcastAuth = {
    user: socialcastUser,
    pass: socialcastPassword
};

function messages() {
    var messages = [];

    setInterval(function() {
        messages = [];
    }, 120000);

    return function(newMessages) {
        if (newMessages) {
            messages = newMessages;
        }
        return messages;
    }
}

var socialcastMessages = messages();

function socialcastParams(url) {
    return {
        url: socialcastUrl + url,
        json: true,
        auth: socialcastAuth
    };
}

app.get('/messages', function(req, res) {

    if (socialcastMessages().length > 0) return res.json(socialcastMessages());

    request.get(socialcastParams('/api/messages'), function(error, response, body) {
        if (error) {
            return handleError(error);
        }
        res.json(socialcastMessages(body));
    });

});

app.get('/message/:id', function(req, res) {

    request.get(socialcastParams('/api/messages/' + req.params.id), function(error, response, body) {
        if (error) {
            return handleError(error);
        }
        res.json(body);
    });

});

function handleError(err) {
    console.log("an error has occured. keep calm and carry on.");
}

// if on heroku use heroku port.
var port = process.env.PORT || 1339;
app.listen(port);
