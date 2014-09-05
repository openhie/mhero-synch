var Practitioner = function (item) {
    var jsonContent = JSON.parse(item['atom:content']['#']);
    this.globalId = jsonContent.identifier[0].value;
    this.parentId = getParentId();
    this.familyName = getName('family');
    this.givenName = getName('given');
    this.email = getContact(jsonContent, 'EMAIL');
    this.phone = getContact(jsonContent, 'BP');

    this.groups = function () {
        return this.parent ? this.parent.groups() : undefined;
    };

    this.fullName = function () {
        return this.familyName + ' ' + this.givenName;
    };

    this.formalisedPhoneNumber = function () {
        var rawPhoneNumber = this.phone;
        if (!rawPhoneNumber || rawPhoneNumber.length == 0) {
            return null;
        }

        var phoneNumber = rawPhoneNumber.split('/')[0].trim().replace(/[^\d\+]/g, '');

        if (phoneNumber[0] != '0') {
            return phoneNumber;
        }

        if (phoneNumber[1] == '0') {
            return '+' + phoneNumber.slice(2);
        }

        var Config = require(__dirname + '/config');
        var config = new Config();
        return config.countryCode + phoneNumber.slice(1);
    };

    this.toRapidProContact = function () {
        return {
            name: this.fullName(),
            phone: this.formalisedPhoneNumber(),
            groups: this.groups(),
            fields: {
                globalId: this.globalId
            }
        };
    };

    function getName(postfix) {
        var name = jsonContent.name[postfix];
        if (!name || name.length == 0) {
            return null;
        }
        return name[0];
    }

    function getParentId() {
        var location = jsonContent.location;
        if (location && location.length > 0) {
            return location[0].reference;
        }
        return jsonContent.organization.reference;
    }

    function getContact(jsonContent, contactField) {
        var contact = jsonContent.telecom;
        if (!contact || contact.length == 0) {
            return null;
        }

        var specifiedContact = contact.filter(function (aContact) {
            return aContact.system == contactField;
        })[0];
        return specifiedContact == undefined ? null : specifiedContact.value.trim();
    }
};


Practitioner.loadAll = function (url) {
    var FeedReader = require(__dirname + '/feed-reader');
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

    allLocations.forEach(function (location) {
        if (!location.parent) {
            throw '[DATA ERROR] Location must have a parent, but this does not: ' + location.globalId;
        }
    });

    return allPractitioners;
};

Practitioner.formatForRapidPro = function (allPractitioners) {
    return allPractitioners.map(function (practitioner) {
        return practitioner.toRapidProContact();
    });
};

module.exports = Practitioner;
