var Organisation = function (item) {
    var jsonContent = JSON.parse(item['atom:content']['#']);
    this.globalId = jsonContent.identifier[0].value;
    this.name = jsonContent.name;
    this.parentId = getParentId();

    this.addChild = function (child) {
        if (!this.children) {
            this.children = [];
        }
        this.children.push(child);
        child.parent = this;
    };

    function getParentId() {
        return jsonContent.partOf ? jsonContent.partOf.reference : null;
    }
};

Organisation.findById = function(allOrganisations, globalId) {
    return allOrganisations.filter(function (organisation) {
        return organisation.globalId == globalId;
    })[0];
};

Organisation.loadAll = function (url) {
    var FeedReader = require(__dirname + '/feed-reader');
    var feedReader = new FeedReader(Organisation, url);

    return feedReader.loadAll().then(function (allOrganisations) {
        allOrganisations.forEach(function (organisation) {
            if (organisation.parentId == null) {
                return;
            }
            var parentOrganisation = Organisation.findById(allOrganisations, organisation.parentId);
            parentOrganisation.addChild(organisation);
        });
        return allOrganisations;
    });
};

Organisation.tree = function (allOrganisations) {
    var roots = allOrganisations.filter(function (organisation) {
        return organisation.parentId == null;
    });
    return roots[0];
};

module.exports = Organisation;