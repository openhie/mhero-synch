var Location = function (jsonInFeed) {
    var jsonContent = JSON.parse(jsonInFeed);
    this.globalid = jsonContent.identifier[0].value;
    this.name = jsonContent.name;
    this.parentId = jsonContent.managingOrganization.reference;

    this.fullName = function () {
        var fullName = this.parent.fullName() + ', ' + this.name;
        // FIXME: we shouldn't need this once Evan fixed RapidPro db restriction
        if (fullName.length > 64) {
            fullName = fullName.substring(0, 62) + '..';
        }
        return fullName;
    };

    this.groups = function () {
        return [this.fullName()].concat(this.parent.groups());
    };
};

Location.loadAll = function (url) {
    var FeedReader = require(__dirname + '/feed-reader');
    var feedReader = new FeedReader(Location, url);
    return feedReader.loadAll();
};

module.exports = Location;
