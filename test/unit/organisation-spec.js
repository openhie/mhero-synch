var Organisation = require(__dirname + '/../../app/organisation');

describe('Organisation', function () {
    var endPointUrl = 'http://liberia-staging.mhero.org:8984/CSD/csr/merged_sierra_leone/careServicesRequest/urn:openhie.org:openinfoman-fhir:fhir_organization_read/adapter/fhir/Organization/_search?_format=json&name=&partOf.reference=';

    describe('loadAll', function () {
        it('loads all organisations from a remote end point', function (done) {
            Organisation.loadAll(endPointUrl).then(function (allOrganisations) {
                expect(allOrganisations.length).toBe(168);

                var firstOrganisation = allOrganisations[0];
                expect(firstOrganisation.globalId).toBe('urn:dhis.org:sierra-leone-demo:csd:organization:g8DdBm7EmUt');
                expect(firstOrganisation.name).toBe('Sittia');

                done();
            });
        });

        it('assumes there is only one root', function (done) {
            Organisation.loadAll(endPointUrl).then(function (allOrganisations) {
                var roots = allOrganisations.filter(function (organisation) {
                    return organisation.parentId == null;
                });
                expect(roots.length).toBe(1);
                expect(roots[0].globalId).toBe('urn:dhis.org:sierra-leone-demo:csd:organization:ImspTQPwCqd');
                done();
            });
        });
    });

    describe('tree', function () {
        it('organises all organisations in a hierarchical manner', function (done) {
            Organisation.loadAll(endPointUrl).then(function (allOrganisations) {
                var root = Organisation.tree(allOrganisations);
                expect(root.globalId).toBe('urn:dhis.org:sierra-leone-demo:csd:organization:ImspTQPwCqd');
                expect(root.children.length).toBe(13);
                expect(root.children[0].parent).toBe(root);
                done();
            });
        });
    })
});