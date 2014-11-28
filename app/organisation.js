var Organisation = function (jsonInFeed) {
    var jsonContent = JSON.parse(jsonInFeed);
    this.globalid = jsonContent.identifier[0].value;
    this.name = jsonContent.name;
    this.parentId = getParentId();

    this.fullName = function () {
        if (!this.parent) {
            return this.name;
        }
        return this.parent.fullName() + ', ' + this.name;
    };

    this.groups = function () {
        if (!this.parent) {
            return [this.fullName()];
        }
        return [this.fullName()].concat(this.parent.groups());
    };

    function getParentId() {
        return jsonContent.partOf ? jsonContent.partOf.reference : null;
    }
};

Organisation.loadAll = function (url) {
    var FeedReader = require(__dirname + '/feed-reader');
    var feedReader = new FeedReader(Organisation, url);
    return feedReader.loadAll();
};

module.exports = Organisation;