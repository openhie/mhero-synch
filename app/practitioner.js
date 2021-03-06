var Q = require('q');

var Config = require(__dirname + '/config');
var config = new Config();

var ValueSet = require(__dirname + '/value-set');

var rapidProIdAssigner = 'http://rapidpro.io/' + config.authentication.rapidpro.instance;

var Practitioner = function (jsonInFeed) {
//    console.log(jsonInFeed);
    var jsonContent = JSON.parse(jsonInFeed);
    this.globalid = jsonContent.identifier[0].value;
    this.rapidProId = findIdByAssigner(rapidProIdAssigner);
    this.role = jsonContent.role;
    this.parentId = getParentId();
    this.familyName = getName('family');
    this.givenName = getName('given');
    this.textName = jsonContent.name.text;
    this.email = getContact(jsonContent, 'EMAIL');
    this.phone = getContact(jsonContent, 'BP');

    this.groups = function () {
        return this.parent ? this.parent.groups() : [];
    };

    this.cadres = function () {
        // FIXME: I don't like this another level of defer
        var deferred = Q.defer();

        if (!this.role) {
            deferred.resolve([]);
        } else {
            var promises = this.role.map(function (role) {
                var coding = role.coding[0];
                return ValueSet.load(config.valueSetEndPoint, coding.system.split(':')[2]).then(function (valueSet) {
                    var concept = valueSet.get(coding.code);
                    return concept == null ? null : concept.displayName;
                });
            });
            Q.all(promises).then(function (allCadres) {
                var nonNullCadres = allCadres.filter(function (cadre) {
                    return cadre != null;
                });
                deferred.resolve(nonNullCadres);
            });
        }

        return deferred.promise;
    };

    this.fullName = function () {
        if (this.familyName && this.givenName) {
            return this.familyName + ' ' + this.givenName;
        }
        return this.textName;
    };

    this.formalisedPhoneNumber = function () {
        var rawPhoneNumber = this.phone;
        if (!rawPhoneNumber || rawPhoneNumber.length == 0) {
            return null;
        }

        var phoneNumber = rawPhoneNumber.split('/')[0].trim().replace(/[^\d\+]/g, '');

        if (phoneNumber[0] == '+') {
            return phoneNumber;
        }

        if (phoneNumber[0] != '0') {
            return config.countryCode + phoneNumber;
        }

        if (phoneNumber[1] == '0') {
            return '+' + phoneNumber.slice(2);
        }

        return config.countryCode + phoneNumber.slice(1);
    };

    this.toRapidProContact = function () {
        var contact = {
            name: this.fullName(),
            uuid: this.rapidProId,
            phone: this.formalisedPhoneNumber(),
            groups: this.groups(),
            fields: {
                globalid: this.globalid,
                facility: this.parent ? this.parent.name : ''
            }
        };
        return this.cadres().then(function (cadres) {
            contact.cadres = cadres;
            contact.groups = contact.groups.concat(cadres);
            return contact;
        });
    };

    function findIdByAssigner(assigner) {
        var allIds = jsonContent.identifier;
        var foundIds = allIds.filter(function (id) {
            return id.assigner === assigner;
        });
        return foundIds.length > 0 ? foundIds[0].value : null;
    }

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
        if (jsonContent.organization) {
            return jsonContent.organization.reference;
        }
        return null;
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

    function findById(allObjects, globalid) {
        return allObjects.filter(function (object) {
	    if (globalid != undefined && object.globalid != undefined) {
		return object.globalid.toUpperCase() == globalid.toUpperCase();
	    } else {
		return false;
	    }
        })[0];
    }

    allObjects.forEach(function (object) {
        object.parent = findById(allObjects, object.parentId);
    });

    allLocations.forEach(function (location) {
        if (!location.parent) {
            throw '[DATA ERROR] Location must have a parent, but this does not: ' + location.globalid;
        }
    });

    return allPractitioners;
};

Practitioner.formatForRapidPro = function (allPractitioners) {
    var allPromises = allPractitioners.map(function (practitioner) {
        return practitioner.toRapidProContact();
    });
    return Q.all(allPromises);
};

Practitioner.createRapidProIdInHwr = function (practitionerId, rapidProId) {
    var dataLoad =
        "<?xml version='1.0' encoding='utf-8'?>" +
        "<csd:careServicesRequest xmlns:csd='urn:ihe:iti:csd:2013' xmlns='urn:ihe:iti:csd:2013'>" +
        "   <function urn='urn:openhie.org:openinfoman-hwr:stored-function:health_worker_create_otherid'>" +
        "       <requestParams>" +
        "           <id urn='" + practitionerId + "'/>" +
        "           <otherID assigningAuthorityName='" + rapidProIdAssigner + "' code='" + rapidProId + "' />" +
        "       </requestParams>" +
        "   </function>" +
        "</csd:careServicesRequest>";

    var HwrEndPoint = require(__dirname + '/hwr-end-point');
    var hwr = new HwrEndPoint(config.practitionerUpdateEndPoint);
    return hwr.update(dataLoad);
};

module.exports = Practitioner;
