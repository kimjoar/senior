var express = require('express');
var request = require('request');
var app = express();

var socialcastUrl = process.env.SOCIALCAST_URL;
var socialcastUser = process.env.SOCIALCAST_USER;
var socialcastPassword = process.env.SOCIALCAST_PASS;

var demo_url = "https://api.github.com/users/bekkopen/repos";

app.get('/', function(req, res) {
    request.get({
        url: demo_url,
        json: true,
        headers: {
            'User-Agent': 'request'
        }
    }, function(error, response, body) {
        if (error) {
            return handleError(error);
        }
        res.json(body);
    });
});

app.get('/messages', function(req, res) {

    request.get({
        url: socialcastUrl + '/api/messages',
        json: true,
        'auth': {
            'user': socialcastUser,
            'pass': socialcastPassword
        }
    }, function(error, response, body) {
        if (error) {
            return handleError(error);
        }

        request.get({
            url: socialcastUrl + '/api/messages?page=2',
            json: true,
            'auth': {
                'user': socialcastUser,
                'pass': socialcastPassword
            }
        }, function(error, response, body2) {
            if (error) {
                return handleError(error);
            }
            res.json(body.concat(body2));
        });
    });

});

function handleError(err) {
    console.log("an error has occured. keep calm and carry on.");
}


// if on heroku use heroku port.
var port = process.env.PORT || 1339;
app.listen(port);
