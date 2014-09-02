var Practitioner = require(__dirname + '/../../app/practitioner');

describe('Practitioner', function () {
    describe('loadAll', function () {
        it('loads all practitioners from a remote end point', function (done) {
            var endPointUrl = 'http://liberia-staging.mhero.org:8984/CSD/csr/dhis2_training_liberia/careServicesRequest/urn:openhie.org:openinfoman-fhir:fhir_practitioner_read/adapter/fhir/Practitioner/_search?name.text=&_format=json&organization.reference=&location.reference='
            Practitioner.loadAll(endPointUrl).then(function (allPractitioners) {
                expect(allPractitioners.length).toBe(50);

                var firstPractitioner = allPractitioners[0];
                expect(firstPractitioner.globalId).toBe('urn:dhis.org:liberia-training:csd:provider:dbQGGwj9Dke');
                expect(firstPractitioner.givenName).toBe('Jallah');
                expect(firstPractitioner.familyName).toBe('Kennedy');
                expect(firstPractitioner.email).toBe('jallahmk@hotmail.com');
                expect(firstPractitioner.phone).toBe(null);

                var fifthPractitioner = allPractitioners[4];
                expect(fifthPractitioner.phone).toBe('236847915');

                done();
            });
        });
    });
});