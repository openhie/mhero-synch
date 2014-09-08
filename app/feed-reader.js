var FeedReader = function(modelClass, endPointUrl) {
    this.loadAll = function() {

        var XmlFeedReader = require(__dirname + '/xml-feed-reader');
        var reader = new XmlFeedReader(endPointUrl);

        var createModelObjects = function(result) {
            var atomEntries = result['atom:feed']['atom:entry'];
            return atomEntries.map(function(atomEntry) {
                var json = atomEntry['atom:content'][0]['_'];
                return new modelClass(json);
            });
        };
        var fallback = [];

        return reader.load(createModelObjects, fallback);
    }
};

module.exports = FeedReader;