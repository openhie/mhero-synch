var Config = require(__dirname + '/config');
var config = new Config();

var Q = require('q');
var btoa = require('btoa');
var request = require('request');

var HwrEndPoint = function (endPoint) {
    function prepareRequest() {
        var hwrCredentials = config.authentication.hwr;
        var basicAuthHeaderValue = 'Basic ' + btoa(hwrCredentials.username + ":" + hwrCredentials.password);
        return {
            url: endPoint,
            headers: {'Authorization': basicAuthHeaderValue}
        };
    }

    this.load = function (handler, fallback) {
        var deferred = Q.defer();

        var hwrRequest = prepareRequest();
        request(hwrRequest, function (error, response, body) {
            if (error || response.statusCode != 200) {
                console.error('Error happened when access url:\n --> ' + endPoint);
                deferred.resolve(fallback);
                return;
            }

            var parseString = require('xml2js').parseString;
            parseString(body, function (err, result) {
                if (!result) {
                    deferred.resolve(fallback);
                    return;
                }
                try {
                    deferred.resolve(handler(result));
                } catch (e) {
                    console.error('Error happened when handling result document:\n------');
                    console.error(result);
                    console.error(e.stack);
                    deferred.resolve(fallback);
                }
            });
        });
        return deferred.promise;
    };

    this.update = function (dataLoad) {
        var deferred = Q.defer();

        var Stream = require('stream');
        var dataLoadStream = new Stream();

        dataLoadStream.pipe = function (dest) {
            dest.write(dataLoad);
        };

        var hwrRequest = prepareRequest();
        hwrRequest.headers['Content-Type'] = 'application/xml';
        dataLoadStream.pipe(request.post(hwrRequest, function (error, response, body) {
            deferred.resolve(body);
        }));

        return deferred.promise;
    };
};

module.exports = HwrEndPoint;