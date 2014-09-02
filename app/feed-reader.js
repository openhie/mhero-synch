var Q = require('q');

var FeedReader = function(modelClass, endPointUrl) {
    this.loadAll = function() {
        var deferred = Q.defer();

        var request = require('request'),
            FeedParser = require('feedparser');

        var req = request(endPointUrl);
        var feedParser = new FeedParser([]);

        req.on('error', function (error) {
            throw error;
        });
        req.on('response', function (res) {
            if (res.statusCode != 200) {
                return this.emit('error', new Error('Bad status code'));
            }
            this.pipe(feedParser);
        });

        var allPractitioners = [];

        feedParser.on('error', function (error) {
            throw error;
        });

        feedParser.on('readable', function () {
            var item;
            while (item = this.read()) {
                allPractitioners.push(new modelClass(item));
            }
        });

        feedParser.on('end', function () {
            deferred.resolve(allPractitioners);
        });

        return deferred.promise;
    }
};

module.exports = FeedReader;