var express = require('express');
var socialcast = require('./socialcast');
var employee = require('./ansatt');
var app = express();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/messages', function(req, res) {

    socialcast.messages(function(error, messages) {
        if (error) return handleError(error);

        messages.forEach(function(message) {
            if (!message.user) return;

            var user = employee.get(message.user.name);
            if (user) {
                message.user.senioritet = user.Seniority;
                message.user.avdeling = user.Department;
            } else {
                console.log('did not find', user);
            }
        });

        res.json(messages);
    });

});

app.get('/message/:id', function(req, res) {

    socialcast.message(req.params.id, function(error, message) {
        if (error) return handleError(error);
        if (!message || !message.user) res.json(message);

        var user = employee.get(message.user.name);
        if (user) {
            message.user.senioritet = user.Seniority;
            message.user.avdeling = user.Department;
        } else {
            console.log('did not find', user);
        }

        res.json(message);
    });

});

app.get('/', function (req, res){
    socialcast.messages(function(error, messages) {
        if (error) return handleError(error);
        res.render('index', {messages:messages});
    });    
});    

function handleError(err) {
    console.log("an error has occured. keep calm and carry on.");
    console.error(err);
}

employee.all();

// if on heroku use heroku port.
var port = process.env.PORT || 1339;
app.listen(port);
