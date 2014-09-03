var Location = require(__dirname + '/../../app/location');
var config = require(__dirname + '/../../app/config');

describe('Location', function () {
    describe('loadAll', function () {
        it('loads all locations from a remote end point', function (done) {
            var endPointUrl = config.locationEndPoint;
            Location.loadAll(endPointUrl).then(function (allLocations) {
                expect(allLocations.length).toBe(1169);

                var firstLocation = allLocations[0];
                expect(firstLocation.globalId).toBe('urn:dhis.org:sierra-leone-demo:csd:facility:xa4F6gesVJm');
                expect(firstLocation.name).toBe('York CHC');
                expect(firstLocation.parentId).toBe('urn:dhis.org:sierra-leone-demo:csd:organization:qtr8GGlm4gg');

                done();
            });
        });
    });
});
