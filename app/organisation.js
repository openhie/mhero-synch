var Organisation = function (item) {
    var jsonContent = JSON.parse(item['atom:content']['#']);
    this.globalId = jsonContent.identifier[0].value;
    this.name = jsonContent.name;
    this.parentId = getParentId();

    this.fullName = function () {
        if(!this.parent) {
            return this.name;
        }
        return this.name + '-' + this.parent.fullName();
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