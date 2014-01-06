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

var messages = [];
setInterval(function() {
    messages = [];
}, 10000);

function socialcastParams(url) {
    return {
        url: socialcastUrl + url,
        json: true,
        auth: socialcastAuth
    };
}

app.get('/messages', function(req, res) {

    if (messages.length > 0) return res.json(messages);

    request.get(socialcastParams('/api/messages'), function(error, response, body) {
        if (error) {
            return handleError(error);
        }
        messages = body;
        res.json(messages);
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
