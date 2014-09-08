var ValueSet = require(__dirname + '/../../app/value-set');

var Config = require(__dirname + '/../../app/config');
var config = new Config();

describe('ValueSet', function () {
    describe('load', function () {
        it('loads a value set with given id', function (done) {
            var endPoint = config.valueSetEndPoint;
            var id = '2.25.268234768686152474523705575269868869248.2';

            ValueSet.load(endPoint, id).then(function (valueSet) {
                expect(valueSet.get('xvvgOYzgRpM').displayName).toBe('County Online Administrator');
                done();
            }).catch(function (error) {
                expect(error).toBe(null);
                done();
            });
        });
    });
});