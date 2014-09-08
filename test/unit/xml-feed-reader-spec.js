var XmlFeedReader = require(__dirname + '/../../app/xml-feed-reader');

var Config = require(__dirname + '/../../app/config');
var config = new Config();

describe('XmlFeedReader', function () {
    describe('load', function () {
        var validEndPoint = config.valueSetEndPoint + '?ID=' + '2.25.268234768686152474523705575269868869248.2';
        var getId = function (xml2jsResult) {
            return xml2jsResult['svs:RetrieveValueSetResponse']['svs:ValueSet'][0]['$']['id'];
        };

        it('loads xml from remote as string', function (done) {
            var reader = new XmlFeedReader(validEndPoint);

            reader.load(getId).then(function (id) {
                expect(id).toBe('2.25.268234768686152474523705575269868869248.2');
                done();
            });
        });

        it('returns fallback value if error happens', function (done) {
            var reader = new XmlFeedReader('http://some.thing.does.not/exist');
            reader.load(getId, 'Fallback').then(function (id) {
                expect(id).toBe('Fallback');
                done();
            });
        });

        it('returns fallback value if web server gives non-xml document', function (done) {
            var reader = new XmlFeedReader('http://www.google.com.au');
            reader.load(getId, 'Fallback').then(function (id) {
                expect(id).toBe('Fallback');
                done();
            });
        });

        it('returns fallback value if handler has error', function (done) {
            var reader = new XmlFeedReader(validEndPoint);
            var errorProneHandler = function () {
                throw 'error';
            };

            reader.load(errorProneHandler, 'Fallback').then(function (id) {
                expect(id).toBe('Fallback');
                done();
            });
        });
    });
});