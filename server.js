var express = require('express');
var _ = require('underscore');
var socialcast = require('./socialcast');
var employee = require('./ansatt');
var db = require('./db');
var veivesenet = require('./veivesenet');
var aggregate = require('./aggregateMagicBullshit');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

var pushedMessages = [];

app.get('/messages', function(req, res) {

    socialcast.messages(function(error, messages) {
        if (error) return handleError(error);

        messages.forEach(function(message) {
            if (!message.user) return;

            var user = employee.get(message.user.name);
            if (user) {
                message.user.senioritet = user.Seniority;
                message.user.avdeling = user.Department;
                addBilInfo(user.Cars, message);
            } else {
                console.log('did not find', message.user.name);
            }
        });

        res.json(messages);
    });

});

function addBilInfo(regNr, message){
    var bilInfo = veivesenet.bilInfo(regNr);
    if(bilInfo) {
        message.user.bilmerke = bilInfo['Merke og modell'];
        message.user.drivstofftype = bilInfo['Drivstoff'];
    }
}

app.get('/message/:id', function(req, res) {

    var id = req.params.id;

    var found;

    _.each(pushedMessages, function(message) {
        if (message.id == id) {
            found = message;
        }
    });

    console.log('found for', id, found);
    if (found) return res.json(found);

    socialcast.message(id, function(error, message) {
        if (error) return handleError(error);
        if (!message || !message.user) res.json(message);

        var user = employee.get(message.user.name);
        if (user) {
            message.user.senioritet = user.Seniority;
            message.user.avdeling = user.Department;
            addBilInfo(user.Cars, message);
        } else {
            console.log('did not find', user);
        }

        res.json(message);
    });

});

app.get('/', function (req, res){
    socialcast.messages(function(error, messages) {
        if (error) return handleError(error);
        res.render('index', { messages: messages });
    });
});

app.post('/push', function(req, res) {
    if (req.body.data) {
        var json = JSON.parse(req.body.data);
        console.log("json", json);
        pushedMessages.push(json);
    }

    res.send(200);
});

app.get('/aggregate_start', function(req, res) {
    aggregate.start(function(error) {
        if (error) {
            console.log("Aggregation failed", error);
            return res.send(500);
        }
    });

    res.send("Aggregering startet");
});

function handleError(err) {
    console.log("an error has occured. keep calm and carry on.");
    console.error(err);
}

db.connect(function(error) {
    if (error) throw new Error("Could not get database connection", error);

    var port = process.env.PORT || 1339;
    app.listen(port);

    employee.all();
});
