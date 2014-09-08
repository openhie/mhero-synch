var Config = require(__dirname + '/config');
var config = new Config();

var Q = require('q');
var btoa = require('btoa');

var XmlFeedReader = function(endPoint) {
    this.load = function(handler, fallback) {
        var deferred = Q.defer();

        var hwrCredentials = config.authentication.hwr;
        var basicAuthHeaderValue = 'Basic ' + btoa(hwrCredentials.username + ":" + hwrCredentials.password);
        var hwrRequest = {
            url: endPoint,
            headers: {'Authorization': basicAuthHeaderValue}
        };

        var request = require('request');
        request(hwrRequest, function (error, response, body) {
            if(error || response.statusCode != 200) {
                console.error('Error happened when access url:\n --> ' + endPoint);
                deferred.resolve(fallback);
                return;
            }

            var parseString = require('xml2js').parseString;
            parseString(body, function (err, result) {
                if(!result) {
                    deferred.resolve(fallback);
                    return;
                }
                try {
                    deferred.resolve(handler(result));
                } catch (e) {
                    console.log('Error happened when handling result document:\n------');
                    console.log(result);
                    deferred.resolve(fallback);
                }
            });
        });

        return deferred.promise;
    };
};

module.exports = XmlFeedReader;