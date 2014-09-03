var Organisation = require(__dirname + '/../../app/organisation');
var config = require(__dirname + '/../../app/config');

describe('Organisation', function () {
    var endPointUrl = config.organisationEndPoint;

    describe('loadAll', function () {
        it('loads all organisations from a remote end point', function (done) {
            Organisation.loadAll(endPointUrl).then(function (allOrganisations) {
                expect(allOrganisations.length).toBe(61);

                var firstOrganisation = allOrganisations[0];
                expect(firstOrganisation.globalId).toBe('urn:dhis.org:sierra-leone-demo:csd:organization:qIRCo0MfuGb');
                expect(firstOrganisation.name).toBe('Gbinleh Dixion');

                done();
            });
        });
    });
});