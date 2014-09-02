var Organisation = function(item) {
    var jsonContent = JSON.parse(item['atom:content']['#']);
    this.globalId = jsonContent.identifier[0].value;
    this.name = jsonContent.name;
};

Organisation.loadAll = function(url) {
    var FeedReader = require(__dirname + '/feed-reader');
    var feedReader = new FeedReader(Organisation, url);
    return feedReader.loadAll();
};

module.exports = Organisation;