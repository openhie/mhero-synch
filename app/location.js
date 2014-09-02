var Location = function(item){
    var jsonContent = JSON.parse(item['atom:content']['#']);
    this.globalId = jsonContent.identifier[0].value;
    this.name = jsonContent.name;
}

Location.loadAll = function(url){
    var FeedReader = require(__dirname + '/feed-reader');
    var feedReader = new FeedReader(Location, url);
    return feedReader.loadAll();
}

module.exports = Location;
