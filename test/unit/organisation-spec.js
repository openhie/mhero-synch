var Organisation = require(__dirname + '/../../app/organisation');
var Config = require(__dirname + '/../../app/config');
var config = new Config();

describe('Organisation', function () {
    var endPointUrl = config.organisationEndPoint;

    describe('loadAll', function () {
        it('loads all organisations from a remote end point', function (done) {
            Organisation.loadAll(endPointUrl).then(function (allOrganisations) {
                expect(allOrganisations.length).toBe(50);

                var firstOrganisation = allOrganisations[0];
                expect(firstOrganisation.globalId).toBe('urn:dhis.org:sierra-leone-demo:csd:organization:sVRpsRz4hSk');
                expect(firstOrganisation.name).toBe('District # 2');

                done();
            }).catch(function (error) {
                expect(error).toBe(null);
                done();
            });
        });
    });
});