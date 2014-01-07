var cachedRequest = require('./cachedRequest');
var _ = require('underscore');

var veivesenetUrl = process.env.VEIVESENET_URL;

function veivesenetParams(url) {
    return {
        url: veivesenetUrl + url,
        json: true
    };
}

function bilInfo(regNr, callback) {
    console.log('fetching bilinfo', regNr);
    cachedRequest(veivesenetParams('/api/' + regNr), function(error, response, body) {
        if (error) return callback(error);

        _.each(body, function(info) {
          bilInfo[info.name] = info.value;
        });

        callback(null, bilInfo);
    });
}

module.exports = {
    bilInfo: bilInfo
}
