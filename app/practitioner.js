var Practitioner = function (item) {
    var jsonContent = JSON.parse(item['atom:content']['#']);
    this.globalId = jsonContent.identifier[0].value;
    this.parentId = getParentId();
    this.familyName = jsonContent.name.family[0];
    this.givenName = jsonContent.name.given[0];
    this.email = getContact(jsonContent, 'EMAIL');
    this.phone = getContact(jsonContent, 'BP');

    this.toRapidProContact = function () {
        var contact = { name: this.familyName + ' ' + this.givenName };
        if (this.parent) {
            contact.groups = [this.parent.fullName()]
        }
        contact.phone = this.phone;
        return contact;
    };

    function getParentId() {
        var location = jsonContent.location;
        if (!location || location.length == 0) {
            return null;
        }
        return location[0].reference;
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
    var allObjects = allPractitioners.concat(allLocations).concat(allOrganisations);

    function findById(allObjects, globalId) {
        return allObjects.filter(function (object) {
            return object.globalId == globalId;
        })[0];
    }

    allObjects.forEach(function (object) {
        object.parent = findById(allObjects, object.parentId);
    });

    return allPractitioners;
};

Practitioner.formatForRapidPro = function (allPractitioners) {
    return allPractitioners.map(function (practitioner) {
        return practitioner.toRapidProContact();
    });
};

module.exports = Practitioner;
