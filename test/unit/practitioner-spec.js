var Practitioner = require(__dirname + '/../../src/practitioner');

describe('Practitioner', function () {
    describe('load_all', function () {
        it('loads all practitioners from a remote end point', function (done) {
            Practitioner.load_all().then(function (allPractitioners) {
                expect(allPractitioners.length).toBe(50);
                // WIP: verify what are the objects in it
                done();
            });
        });
    });
});