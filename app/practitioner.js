var Practitioner = function (item) {
    var jsonContent = JSON.parse(item['atom:content']['#']);
    this.globalId = jsonContent.identifier[0].value;
    this.parentId = getParentId();
    this.familyName = jsonContent.name.family[0];
    this.givenName = jsonContent.name.given[0];
    this.email = getContact(jsonContent, 'EMAIL');
    this.phone = getContact(jsonContent, 'BP');

    function getParentId() {
        if(!jsonContent.organization) {
            return null;
        }
        return jsonContent.organization.reference;
    }

    function getContact(jsonContent, contactField) {
        var contact = jsonContent.telecom;
        if (contact.length == 0) {
            return null;
        }

        var specifiedContact = contact.filter(function (aContact) {
            return aContact.system == contactField;
        })[0];
        return specifiedContact == undefined ? null : specifiedContact.value.trim();
    }
};

var FeedReader = require(__dirname + '/feed-reader');

Practitioner.loadAll = function (url) {
    var feedReader = new FeedReader(Practitioner, url);
    return feedReader.loadAll();
};

Practitioner.merge = function (allPractitioners, allLocations, allOrganisations) {
    var Organisation = require(__dirname + '/organisation');

    allLocations.forEach(function (location) {
        location.parent = Organisation.findById(allOrganisations, location.parentId);
    });

    allPractitioners.forEach(function (practitioner) {
        var parentLocation = allLocations.filter(function (location) {
            return location.globalId == practitioner.parentId;
        })[0];
        practitioner.parent = parentLocation;
    });

    return allPractitioners;
};

module.exports = Practitioner;
