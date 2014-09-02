var Organisation = require(__dirname + '/../../app/organisation');

describe('Organisation', function() {
    describe('loadAll', function() {
        it('loads all organisations from a remote end point', function(done) {
            var endPointUrl = 'http://liberia-staging.mhero.org:8984/CSD/csr/merged_sierra_leone/careServicesRequest/urn:openhie.org:openinfoman-fhir:fhir_organization_read/adapter/fhir/Organization/_search?_format=json&name=&partOf.reference=';
            Organisation.loadAll(endPointUrl).then(function(allOrganisations) {
                expect(allOrganisations.length).toBe(50)
                // WIP: check organisation data
                done();
            });
        });
    });
});