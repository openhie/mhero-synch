var Practitioner = require(__dirname + '/practitioner');
var Location = require(__dirname + '/location');
var Organisation = require(__dirname + '/organisation');

var Hero = function (practitionerEndPoint, locationEndPoint, organisationEndPoint) {
    this.run = function () {
        return Practitioner.loadAll(practitionerEndPoint).then(function (allPractitioners) {
            return Location.loadAll(locationEndPoint).then(function (allLocations) {
                return Organisation.loadAll(organisationEndPoint).then(function (allOrganisations) {
                    var mergedPractitioners = Practitioner.merge(allPractitioners, allLocations, allOrganisations);
                    console.log(mergedPractitioners[0].parent.fullName());
                });
            });
        });
    };
};

module.exports = Hero;