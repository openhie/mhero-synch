var Location = require(__dirname + '/../../app/location');

describe('Location', function() {
    describe('loadAll', function() {
        it('loads all locations from a remote end point', function(done) {
            var endPointUrl = 'http://liberia-staging.mhero.org:8984/CSD/csr/merged_sierra_leone/careServicesRequest/urn:openhie.org:openinfoman-fhir:fhir_location_read/adapter/fhir/Location/_search?_format=json&name=&managingOrganization.reference=';
            Location.loadAll(endPointUrl).then(function(allLocations) {
                expect(allLocations.length).toBe(1171);

                var firstLocation = allLocations[0];
                expect(firstLocation.globalId).toBe('urn:dhis.org:sierra-leone-demo:csd:facility:xa4F6gesVJm');
                expect(firstLocation.name).toBe('York CHC');
                expect(firstLocation.parentId).toBe('urn:dhis.org:sierra-leone-demo:csd:organization:qtr8GGlm4gg');

                done();
            });
        });
    });
});
