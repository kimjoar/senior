var cachedRequest = require('./cachedRequest');
var _ = require('underscore');

var veivesenetUrl = process.env.VEIVESENET_URL;

function veivesenetParams(url) {
    return {
        url: veivesenetUrl + url,
        json: true
    };
}

function bilInfo(regNr){
	var bilInfo = {};
	cachedRequest(veivesenetParams('/api/' + regNr), function(error, response, body) {
        if (error) return callback(error);
		
		_.each(body, function(listeElement) {
		  bilInfo[listeElement.name] = listeElement.value;
		});

    });
    return bilInfo;
}

module.exports = {
	bilInfo: bilInfo
}