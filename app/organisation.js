var Organisation = function() {

};

Organisation.loadAll = function(url) {
    var FeedReader = require(__dirname + '/feed-reader');
    var feedReader = new FeedReader(Organisation, url);
    return feedReader.loadAll();
};

module.exports = Organisation;