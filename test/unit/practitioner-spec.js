var Practitioner = require(__dirname + '/../../src/practitioner');

describe('Practitioner', function () {
    describe('load_all', function () {
        it('loads all practitioners from a remote end point', function (done) {
            Practitioner.load_all().then(function (allPractitioners) {
                expect(allPractitioners.length).toBe(50);
                var firstPractitioner = allPractitioners[0];
                expect(firstPractitioner.globalId).toBe('urn:dhis.org:liberia-training:csd:provider:dbQGGwj9Dke');
                expect(firstPractitioner.givenName).toBe('Jallah');
                expect(firstPractitioner.familyName).toBe('Kennedy');
                expect(firstPractitioner.email).toBe('jallahmk@hotmail.com');
                done();
            });
        });
    });
});