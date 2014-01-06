var request = require('request');

var caches = {};

setInterval(function() {
    caches = {};
}, 15 * 60 * 1000)

module.exports = function(params, callback) {
    if (caches[params.url]) return callback.apply(null, caches[params.url]);

    request.get(params, function() {
        caches[params.url] = arguments;
        callback.apply(null, arguments);
    });
};

