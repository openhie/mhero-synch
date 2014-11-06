var FeedReader = function(modelClass, endPointUrl) {
    this.loadAll = function() {
        var HwrEndPoint = require(__dirname + '/hwr-end-point');
        var hwr = new HwrEndPoint(endPointUrl);
        var createModelObjects = function(result) {
            var atomEntries = result['atom:feed']['atom:entry'];
	    if (atomEntries) {
		console.log("Feed has " + (atomEntries.length) + " from: "  + endPointUrl);
		return atomEntries.map(function(atomEntry) {
                    var json = atomEntry['atom:content'][0]['_'];
                    return new modelClass(json);
		});
	    } else {
		console.log("Feed is empty from: "  + endPointUrl);
		return [];
	    }
        };
        var fallback = [];

        return hwr.load(createModelObjects, fallback);
    }
};

module.exports = FeedReader;