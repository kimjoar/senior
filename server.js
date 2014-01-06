var express = require('express');
var socialcast = require('./socialcast');
var app = express();

app.get('/messages', function(req, res) {

    socialcast.messages(function(error, messages) {
        if (error) return handleError(error);

        res.json(messages);
    });

});

app.get('/message/:id', function(req, res) {

    socialcast.message(req.params.id, function(error, message) {
        if (error) return handleError(error);

        res.json(message);
    });

});

function handleError(err) {
    console.log("an error has occured. keep calm and carry on.");
    console.error(err);
}

// if on heroku use heroku port.
var port = process.env.PORT || 1339;
app.listen(port);
