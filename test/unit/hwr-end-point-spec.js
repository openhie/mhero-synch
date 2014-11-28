var HwrEndPoint = require(__dirname + '/../../app/hwr-end-point');

var Config = require(__dirname + '/../../app/config');
var config = new Config();

describe('HwrEndPoint', function () {
    describe('load', function () {
        var validEndPoint = config.valueSetEndPoint + '?ID=' + '2.25.268234768686152474523705575269868869248.2';
        var getId = function (xml2jsResult) {
            return xml2jsResult['svs:RetrieveValueSetResponse']['svs:ValueSet'][0]['$']['id'];
        };

        it('loads xml from remote as string', function (done) {
            var hwr = new HwrEndPoint(validEndPoint);

            hwr.load(getId).then(function (id) {
                expect(id).toBe('2.25.268234768686152474523705575269868869248.2');
                done();
            });
        });

        it('returns fallback value if error happens', function (done) {
            var hwr = new HwrEndPoint('http://some.thing.does.not/exist');
            hwr.load(getId, 'Fallback').then(function (id) {
                expect(id).toBe('Fallback');
                done();
            });
        });

        it('returns fallback value if web server gives non-xml document', function (done) {
            var hwr = new HwrEndPoint('http://www.google.com.au');
            hwr.load(getId, 'Fallback').then(function (id) {
                expect(id).toBe('Fallback');
                done();
            });
        });

        it('returns fallback value if handler has error', function (done) {
            var hwr = new HwrEndPoint(validEndPoint);
            var errorProneHandler = function () {
                throw 'error';
            };

            hwr.load(errorProneHandler, 'Fallback').then(function (id) {
                expect(id).toBe('Fallback');
                done();
            });
        });
    });

    describe('update', function () {
        var endPoint = config.practitionerUpdateEndPoint;

        it('posts to hwr and gets back new id position', function (done) {
            var hwr = new HwrEndPoint(endPoint);
            var dataLoad =
                "<?xml version='1.0' encoding='utf-8'?>" +
                "<csd:careServicesRequest xmlns:csd='urn:ihe:iti:csd:2013' xmlns='urn:ihe:iti:csd:2013'>" +
                "   <function urn='urn:openhie.org:openinfoman-hwr:stored-function:health_worker_create_otherid'>" +
                "       <requestParams>" +
                "           <id urn='urn:dhis.org:sierra-leone-demo:csd:provider:dbQGGwj9Dke'/>" +
                "           <otherID assigningAuthorityName='test.thoughtworks.com' code='67890' />" +
                "       </requestParams>" +
                "   </function>" +
                "</csd:careServicesRequest>";
            hwr.update(dataLoad).then(function(responseBody) {
                console.log(responseBody);
                expect(responseBody).toMatch(/<otherID position="\d+"\/>/);
                done();
            });
        });
    });
});