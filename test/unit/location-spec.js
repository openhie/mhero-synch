var Location = require(__dirname + '/../../app/location');
var Config = require(__dirname + '/../../app/config');
var config = new Config();

describe('Location', function () {
    describe('loadAll', function () {
        it('loads all locations from a remote end point', function (done) {
            var endPointUrl = config.locationEndPoint;
            Location.loadAll(endPointUrl).then(function (allLocations) {
                expect(allLocations.length).toBe(50);

                var firstLocation = allLocations[0];
                expect(firstLocation.globalid).toBe('urn:dhis.org:sierra-leone-demo:csd:facility:zhK0MJtc2uB');
                expect(firstLocation.name).toBe('Uncle Dah Medicine Store');
                expect(firstLocation.parentId).toBe('urn:dhis.org:sierra-leone-demo:csd:organization:VXewC2uAW2s');

                done();
            }).catch(function (error) {
                expect(error).toBe(null);
                done();
            });
        });
    });
});
