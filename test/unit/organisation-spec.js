var Organisation = require(__dirname + '/../../app/organisation');
var Config = require(__dirname + '/../../app/config');
var config = new Config('dev');

describe('Organisation', function () {
    var endPointUrl = config.organisationEndPoint;

    describe('loadAll', function () {
        it('loads all organisations from a remote end point', function (done) {
            Organisation.loadAll(endPointUrl).then(function (allOrganisations) {
                expect(allOrganisations.length).toBe(10);

                var firstOrganisation = allOrganisations[0];
                expect(firstOrganisation.globalId).toBe('urn:dhis.org:sierra-leone-demo:csd:organization:g8DdBm7EmUt');
                expect(firstOrganisation.name).toBe('Sittia');

                done();
            }).catch(function (error) {
                expect(error).toBe(null);
                done();
            });
        });
    });
});